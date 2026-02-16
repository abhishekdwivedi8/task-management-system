import validator from 'validator';

// Validate registration input
export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  // Name validation
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  } else if (name.trim().length > 50) {
    errors.push('Name cannot exceed 50 characters');
  }

  // Email validation
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!validator.isEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    if (password.length > 128) {
      errors.push('Password cannot exceed 128 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Trim inputs without escaping
  if (req.body.name) req.body.name = req.body.name.trim();
  if (req.body.email) req.body.email = req.body.email.trim().toLowerCase();

  next();
};

// Validate login input
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!validator.isEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!password || password.trim().length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validate OTP input
export const validateOTP = (req, res, next) => {
  const { email, otp } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!validator.isEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!otp || otp.trim().length === 0) {
    errors.push('OTP is required');
  } else if (!/^\d{6}$/.test(otp)) {
    errors.push('OTP must be a 6-digit number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validate task creation
export const validateTask = (req, res, next) => {
  const { title, description } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Task title is required');
  } else if (title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  } else if (title.trim().length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }

  if (!description || description.trim().length === 0) {
    errors.push('Task description is required');
  } else if (description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  } else if (description.trim().length > 1000) {
    errors.push('Description cannot exceed 1000 characters');
  }

  // Validate optional fields
  if (req.body.priority && !['low', 'medium', 'high', 'urgent'].includes(req.body.priority)) {
    errors.push('Priority must be one of: low, medium, high, urgent');
  }

  if (req.body.status && !['pending', 'in-progress', 'completed', 'cancelled'].includes(req.body.status)) {
    errors.push('Status must be one of: pending, in-progress, completed, cancelled');
  }

  if (req.body.dueDate && !validator.isISO8601(req.body.dueDate)) {
    errors.push('Due date must be a valid ISO 8601 date');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Trim string fields without escaping
  if (req.body.title) req.body.title = req.body.title.trim();
  if (req.body.description) req.body.description = req.body.description.trim();

  next();
};

// Sanitize input to prevent XSS (only for dangerous contexts)
export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Only trim, don't escape - MongoDB and React handle XSS protection
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};
