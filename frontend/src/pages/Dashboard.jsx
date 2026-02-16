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
      color: 'from-gold-500 to-gold-600',
      textColor: 'text-gold-600',
      link: '/tasks',
      filter: null,
    },
    {
      title: 'Pending',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'from-saffron-500 to-saffron-600',
      textColor: 'text-saffron-600',
      link: '/tasks?status=pending',
      filter: 'pending',
    },
    {
      title: 'In Progress',
      value: stats?.inProgress || 0,
      icon: TrendingUp,
      color: 'from-indianBlue-500 to-indianBlue-600',
      textColor: 'text-indianBlue-600',
      link: '/tasks?status=in-progress',
      filter: 'in-progress',
    },
    {
      title: 'Completed',
      value: stats?.completed || 0,
      icon: CheckCircle2,
      color: 'from-indianGreen-500 to-indianGreen-600',
      textColor: 'text-indianGreen-600',
      link: '/tasks?status=completed',
      filter: 'completed',
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
      <div className="bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl shadow-gold-lg p-8 text-cream-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-cream-100">
              Here's what's happening with your tasks today
            </p>
          </div>
          <LayoutDashboard size={64} className="opacity-20" />
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
              className="card hover:shadow-gold-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon size={24} className="text-cream-50" />
                </div>
                <span className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </span>
              </div>
              <h3 className="text-gray-600 font-semibold">{stat.title}</h3>
            </Link>
          );
        })}
      </div>

      {/* Recent Tasks */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Tasks</h2>
          <Link to="/tasks/create" className="btn-primary text-sm py-2 px-4">
            <PlusCircle size={18} className="inline mr-2" />
            New Task
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto text-gold-300 mb-4" />
            <p className="text-gray-600 mb-4">No tasks yet</p>
            <Link to="/tasks/create" className="btn-primary">
              Create Your First Task
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <Link
                key={task._id}
                to={`/tasks/${task._id}`}
                className="block p-4 bg-cream-100 border-2 border-gold-200 rounded-lg hover:shadow-gold transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {task.description}
                    </p>
                    <div className="flex items-center space-x-3">
                      <span className={`badge ${getStatusBadge(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`text-sm font-semibold ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
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
              className="text-gold-600 font-semibold hover:text-gold-700"
            >
              View All Tasks →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
