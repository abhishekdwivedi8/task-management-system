import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { taskAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
  });

  useEffect(() => {
    // Update filters when URL params change
    const statusFromUrl = searchParams.get('status');
    const priorityFromUrl = searchParams.get('priority');
    
    setFilters(prev => ({
      ...prev,
      status: statusFromUrl || '',
      priority: priorityFromUrl || '',
    }));
  }, [searchParams]);

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks(filters);
      setTasks(response.data.data.tasks);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

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

  if (loading && filters.page === 1) {
    return <LoadingSpinner fullScreen={false} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">All Tasks</h1>
        <Link to="/tasks/create" className="btn-primary">
          <PlusCircle size={20} className="inline mr-2" />
          Create Task
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        {/* Active Filter Indicator */}
        {(filters.status || filters.priority || filters.search) && (
          <div className="mb-4 p-3 bg-gold-light-gradient border-2 border-gold-300 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gold-700" />
              <span className="text-gold-700 font-semibold">Active Filters:</span>
              {filters.status && (
                <span className="badge badge-pending">
                  Status: {filters.status}
                </span>
              )}
              {filters.priority && (
                <span className="badge badge-pending">
                  Priority: {filters.priority}
                </span>
              )}
              {filters.search && (
                <span className="badge badge-pending">
                  Search: "{filters.search}"
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setFilters({
                  page: 1,
                  limit: 10,
                  search: '',
                  status: '',
                  priority: '',
                });
                setSearchParams({});
              }}
              className="text-gold-700 hover:text-gold-800 font-semibold text-sm"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500" size={20} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-11"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="input-field"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="card">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No tasks found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Link
                key={task._id}
                to={`/tasks/${task._id}`}
                className="block p-4 bg-cream-100 border-2 border-gold-200 rounded-lg hover:shadow-gold transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">{task.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{task.description}</p>
                    <div className="flex items-center space-x-3">
                      <span className={`badge ${getStatusBadge(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`text-sm font-semibold ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {tasks.length} of {pagination.total} tasks
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={!pagination.hasPrevPage}
                className="btn-secondary py-2 px-3 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-gray-700 font-semibold">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={!pagination.hasNextPage}
                className="btn-secondary py-2 px-3 disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
