import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, AlertCircle, Clock } from 'lucide-react';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, resendOTP } = useAuth();
  
  const email = location.state?.email || '';
  const name = location.state?.name || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      await verifyOTP({ email, otp });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');

    try {
      await resendOTP(email);
      setCanResend(false);
      setResendTimer(60);

      // Restart timer
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indianBlue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gold-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-gold-500 to-gold-600 p-4 rounded-2xl shadow-gold-lg mb-4">
            <Shield size={48} className="text-cream-50" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
          <p className="text-gold-600">We've sent a 6-digit code to</p>
          <p className="text-gray-800 font-semibold">{email}</p>
        </div>

        {/* OTP Form */}
        <div className="card animate-fadeIn">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Enter OTP Code
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500" size={20} />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                    setError('');
                  }}
                  className="input-field pl-11 text-center text-2xl font-bold tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-600 flex items-center">
                <Clock size={16} className="mr-1" />
                OTP expires in 5 minutes
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="spinner w-5 h-5 border-2 mr-2"></div>
                  Verifying...
                </span>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="text-gold-600 font-semibold hover:text-gold-700 disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            ) : (
              <p className="text-gray-600">
                Resend OTP in{' '}
                <span className="text-gold-600 font-semibold">{resendTimer}s</span>
              </p>
            )}
          </div>

          {/* Back to Login */}
          <div className="mt-4 text-center">
            <Link to="/login" className="text-gray-600 hover:text-gold-600 text-sm">
              Back to Login
            </Link>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-gold-light-gradient border-2 border-gold-300 rounded-lg">
            <p className="text-gold-700 font-semibold text-sm mb-2">📧 Check your email</p>
            <ul className="text-gray-700 text-xs space-y-1">
              <li>• Check your spam/junk folder if you don't see the email</li>
              <li>• OTP is valid for 5 minutes only</li>
              <li>• You can request a new OTP after 60 seconds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
