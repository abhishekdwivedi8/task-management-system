import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  LayoutDashboard,
  ListTodo,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  PlusCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        taskAPI.getStats(),
        taskAPI.getTasks({ page: 1, limit: 5 }),
      ]);

      setStats(statsRes.data.data.stats);
      setRecentTasks(tasksRes.data.data.tasks);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen={false} />;
  }

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats?.total || 0,
      icon: ListTodo,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600',
      link: '/tasks',
    },
    {
      title: 'Pending',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      link: '/tasks?status=pending',
    },
    {
      title: 'In Progress',
      value: stats?.inProgress || 0,
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      link: '/tasks?status=in-progress',
    },
    {
      title: 'Completed',
      value: stats?.completed || 0,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      link: '/tasks?status=completed',
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-pending',
      'in-progress': 'badge-in-progress',
      completed: 'badge-completed',
      cancelled: 'badge-cancelled',
    };
    return badges[status] || 'badge-pending';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high',
      urgent: 'priority-urgent',
    };
    return colors[priority] || 'priority-medium';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Header */}
      <div className="glass-card border-2 border-white/40 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.name}
            </h1>
            <p className="text-gray-600">
              Here's your task overview for today
            </p>
          </div>
          <div className="hidden md:block">
            <LayoutDashboard size={48} className="text-primary-200" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="group relative"
            >
              <div className="glass-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-white/40">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} className={stat.textColor} />
                  </div>
                  <span className={`text-4xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </span>
                </div>
                <h3 className="text-gray-700 font-semibold">{stat.title}</h3>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Tasks */}
      <div className="glass-card border-2 border-white/40 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Tasks</h2>
          <Link to="/tasks/create" className="btn-primary flex items-center space-x-2">
            <PlusCircle size={20} />
            <span>New Task</span>
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-primary-50 rounded-full mb-4">
              <AlertCircle size={48} className="text-primary-400" />
            </div>
            <p className="text-gray-600 text-lg mb-6">No tasks yet</p>
            <Link to="/tasks/create" className="btn-primary inline-flex items-center space-x-2">
              <PlusCircle size={20} />
              <span>Create Your First Task</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <Link
                key={task._id}
                to={`/tasks/${task._id}`}
                className="block group"
              >
                <div className="bg-white/60 backdrop-blur-sm border-2 border-gray-100 rounded-xl p-5 hover:shadow-lg hover:border-primary-200 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                        {task.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {task.description}
                      </p>
                      <div className="flex items-center space-x-3">
                        <span className={`badge ${getStatusBadge(task.status)}`}>
                          {task.status}
                        </span>
                        <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {recentTasks.length > 0 && (
          <div className="mt-6 text-center">
            <Link
              to="/tasks"
              className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center space-x-2 group"
            >
              <span>View All Tasks</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
