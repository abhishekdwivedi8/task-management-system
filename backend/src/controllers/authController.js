import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendOTPEmail } from '../config/email.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      // If user exists but email not verified, allow re-registration
      if (!existingUser.isEmailVerified) {
        // Generate new OTP
        const otp = existingUser.generateOTP();
        await existingUser.save();

        // Send OTP email
        await sendOTPEmail(email, otp, name);

        return res.status(200).json({
          success: true,
          message: 'User already exists but email not verified. New OTP sent to your email.',
          data: {
            email: existingUser.email,
            name: existingUser.name,
            otpExpiresIn: `${process.env.OTP_EXPIRY_MINUTES} minutes`
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: 'User with this email already exists and is verified.'
      });
    }

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    // Generate OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, name);
    } catch (emailError) {
      // Rollback user creation if email fails
      await User.findByIdAndDelete(user._id);
      throw new Error('Failed to send verification email. Please try again.');
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! OTP sent to your email. Please verify to login.',
      data: {
        userId: user._id,
        email: user.email,
        name: user.name,
        otpExpiresIn: `${process.env.OTP_EXPIRY_MINUTES} minutes`
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed. Please try again.'
    });
  }
};

// @desc    Verify email OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user with OTP fields
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('+otp +otpExpiry +otpAttempts');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified. Please login.'
      });
    }

    // Check OTP attempts (max 5 attempts)
    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    const verification = user.verifyOTP(otp);

    if (!verification.valid) {
      await user.save();
      return res.status(400).json({
        success: false,
        message: verification.message,
        attemptsLeft: 5 - user.otpAttempts
      });
    }

    // Mark email as verified and clear OTP
    user.isEmailVerified = true;
    user.clearOTP();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now login.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        token
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed. Please try again.'
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('+lastOTPSentAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified.'
      });
    }

    // Rate limiting: Allow OTP resend only after 1 minute
    if (user.lastOTPSentAt) {
      const timeSinceLastOTP = Date.now() - user.lastOTPSentAt.getTime();
      const oneMinute = 60 * 1000;

      if (timeSinceLastOTP < oneMinute) {
        const waitTime = Math.ceil((oneMinute - timeSinceLastOTP) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${waitTime} seconds before requesting a new OTP.`
        });
      }
    }

    // Generate and send new OTP
    const otp = user.generateOTP();
    user.otpAttempts = 0; // Reset attempts
    await user.save();

    await sendOTPEmail(email, otp, user.name);

    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email.',
      data: {
        otpExpiresIn: `${process.env.OTP_EXPIRY_MINUTES} minutes`
      }
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP. Please try again.'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('+password +loginAttempts +lockUntil');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in. Check your inbox for OTP.'
      });
    }

    // Check if account is active
    if (user.accountStatus !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is suspended or deleted. Please contact support.'
      });
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Remove sensitive data
    user.password = undefined;
    user.loginAttempts = undefined;
    user.lockUntil = undefined;

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile.'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // But we can add token to blacklist if needed (requires Redis/DB)
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed.'
    });
  }
};
