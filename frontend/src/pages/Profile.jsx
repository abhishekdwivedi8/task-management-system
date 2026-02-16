import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>

      <div className="card">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-8 pb-8 border-b-2 border-gold-200">
          <div className="w-24 h-24 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full flex items-center justify-center">
            <User size={48} className="text-cream-50" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{user?.name}</h2>
            <p className="text-gold-600 font-semibold">{user?.email}</p>
            {user?.isEmailVerified && (
              <div className="flex items-center text-indianGreen-600 mt-2">
                <CheckCircle size={18} className="mr-2" />
                <span className="text-sm font-semibold">Email Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-cream-100 rounded-lg">
            <div className="flex items-center text-gray-600 mb-3">
              <Shield size={20} className="mr-2 text-gold-600" />
              <span className="font-semibold">Role</span>
            </div>
            <p className="text-gray-800 capitalize">
              {user?.role === 'admin' ? (
                <span className="badge bg-gradient-to-r from-gold-500 to-gold-600 text-cream-50">
                  Administrator
                </span>
              ) : (
                <span className="badge badge-pending">User</span>
              )}
            </p>
          </div>

          <div className="p-4 bg-cream-100 rounded-lg">
            <div className="flex items-center text-gray-600 mb-3">
              <Calendar size={20} className="mr-2 text-gold-600" />
              <span className="font-semibold">Member Since</span>
            </div>
            <p className="text-gray-800">
              {new Date(user?.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="p-4 bg-cream-100 rounded-lg">
            <div className="flex items-center text-gray-600 mb-3">
              <Mail size={20} className="mr-2 text-gold-600" />
              <span className="font-semibold">Email Status</span>
            </div>
            <p className="text-gray-800">
              {user?.isEmailVerified ? (
                <span className="text-indianGreen-600 font-semibold">Verified ✓</span>
              ) : (
                <span className="text-saffron-600 font-semibold">Not Verified</span>
              )}
            </p>
          </div>

          <div className="p-4 bg-cream-100 rounded-lg">
            <div className="flex items-center text-gray-600 mb-3">
              <User size={20} className="mr-2 text-gold-600" />
              <span className="font-semibold">Account ID</span>
            </div>
            <p className="text-gray-800 text-sm font-mono">{user?.id}</p>
          </div>
        </div>

        {/* Admin Badge */}
        {user?.role === 'admin' && (
          <div className="mt-8 p-6 bg-gold-light-gradient border-2 border-gold-300 rounded-lg">
            <h3 className="text-gold-700 font-bold text-lg mb-2">🔐 Administrator Access</h3>
            <p className="text-gray-700">
              You have full administrative privileges including user management and system configuration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
