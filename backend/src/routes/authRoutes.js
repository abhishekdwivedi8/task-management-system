import express from 'express';
import {
  register,
  verifyOTP,
  resendOTP,
  login,
  getMe,
  logout
} from '../controllers/authController.js';
import {
  validateRegister,
  validateLogin,
  validateOTP
} from '../middleware/validation.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/verify-otp', validateOTP, verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
