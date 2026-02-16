import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User as UserIcon, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors([]);
  };

  const validateForm = () => {
    const newErrors = [];

    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Passwords do not match');
    }

    if (formData.password.length < 6) {
      newErrors.push('Password must be at least 6 characters');
    }

    if (!/[A-Z]/.test(formData.password)) {
      newErrors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(formData.password)) {
      newErrors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(formData.password)) {
      newErrors.push('Password must contain at least one number');
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const { name, email, password } = formData;
      await register({ name, email, password });
      navigate('/verify-otp', { state: { email, name } });
    } catch (err) {
      const errorMessages = err.response?.data?.errors || [err.response?.data?.message || 'Registration failed'];
      setErrors(Array.isArray(errorMessages) ? errorMessages : [errorMessages]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gold-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-indianGreen-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-gold-500 to-gold-600 p-4 rounded-2xl shadow-gold-lg mb-4">
            <UserPlus size={48} className="text-cream-50" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gold-600">Join us to manage your tasks efficiently</p>
        </div>

        {/* Register Form */}
        <div className="card animate-fadeIn">
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
              <div className="flex items-start space-x-3 mb-2">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700 font-semibold text-sm">Please fix the following errors:</p>
              </div>
              <ul className="list-disc list-inside space-y-1 ml-7">
                {errors.map((error, index) => (
                  <li key={index} className="text-red-600 text-sm">{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-11"
                  placeholder="John Doe"
                  required
                  minLength={2}
                  maxLength={50}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-11"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-11"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500" size={20} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-11"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Password Requirements */}
            <div className="p-3 bg-gold-light-gradient border border-gold-300 rounded-lg">
              <p className="text-gold-700 font-semibold text-xs mb-2">Password must contain:</p>
              <ul className="space-y-1 text-xs text-gray-700">
                <li className="flex items-center">
                  <CheckCircle size={14} className="text-indianGreen-500 mr-2" />
                  At least 6 characters
                </li>
                <li className="flex items-center">
                  <CheckCircle size={14} className="text-indianGreen-500 mr-2" />
                  One uppercase letter
                </li>
                <li className="flex items-center">
                  <CheckCircle size={14} className="text-indianGreen-500 mr-2" />
                  One lowercase letter
                </li>
                <li className="flex items-center">
                  <CheckCircle size={14} className="text-indianGreen-500 mr-2" />
                  One number
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="spinner w-5 h-5 border-2 mr-2"></div>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-gold-600 font-semibold hover:text-gold-700">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
