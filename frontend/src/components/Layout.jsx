import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  Users,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/tasks', icon: ListTodo, label: 'Tasks' },
    { path: '/tasks/create', icon: PlusCircle, label: 'Create Task' },
    ...(isAdmin() ? [{ path: '/admin/users', icon: Users, label: 'Manage Users' }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gold-500 to-gold-600 shadow-gold-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-cream-50 mr-4"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-2xl font-bold text-cream-50">
                Task Management
              </h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="flex items-center space-x-2 bg-gold-light-gradient px-4 py-2 rounded-lg hover:shadow-gold transition-all duration-300"
              >
                <User size={20} className="text-gold-700" />
                <span className="text-gold-700 font-semibold hidden sm:inline">
                  {user?.name}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-cream-50 px-4 py-2 rounded-lg hover:bg-cream-100 transition-all duration-300"
              >
                <LogOut size={20} className="text-gold-700" />
                <span className="text-gold-700 font-semibold hidden sm:inline">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-cream-50 to-cream-100 border-r-2 border-gold-200 transition-transform duration-300 ease-in-out mt-16 lg:mt-0`}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-cream-50 shadow-gold'
                      : 'text-gray-700 hover:bg-cream-200 hover:text-gold-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Badge */}
          {isAdmin() && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-gold-light-gradient border-2 border-gold-300 rounded-lg p-3 text-center">
                <p className="text-gold-700 font-bold text-sm">Admin Access</p>
              </div>
            </div>
          )}
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
