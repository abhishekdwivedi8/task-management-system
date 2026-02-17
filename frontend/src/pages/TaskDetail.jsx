import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Edit, Trash2, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await taskAPI.getTaskById(id);
      setTask(response.data.data.task);
      setFormData({
        title: response.data.data.task.title,
        description: response.data.data.task.description,
        status: response.data.data.task.status,
        priority: response.data.data.task.priority,
      });
    } catch (error) {
      toast.error('Failed to load task');
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.updateTask(id, formData);
      toast.success('Task updated successfully!');
      setEditing(false);
      fetchTask();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(id);
        toast.success('Task deleted successfully!');
        navigate('/tasks');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen={false} />;
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-pending',
      'in-progress': 'badge-in-progress',
      completed: 'badge-completed',
      cancelled: 'badge-cancelled',
    };
    return badges[status] || 'badge-pending';
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <button
        onClick={() => navigate('/tasks')}
        className="flex items-center text-sky-600 hover:text-sky-700 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Tasks
      </button>

      <div className="card">
        {!editing ? (
          <>
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{task.title}</h1>
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`badge ${getStatusBadge(task.status)}`}>
                    {task.status}
                  </span>
                  <span className="badge bg-sky-100 text-sky-700 border border-sky-300">
                    {task.priority}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => setEditing(true)} className="btn-secondary py-2 px-4">
                  <Edit size={18} className="inline mr-2" />
                  Edit
                </button>
                <button onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
                  <Trash2 size={18} className="inline mr-2" />
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-sky-50 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-2">
                    <User size={18} className="mr-2" />
                    <span className="font-semibold">Created By</span>
                  </div>
                  <p className="text-gray-800">{task.createdBy?.name}</p>
                  <p className="text-sm text-gray-600">{task.createdBy?.email}</p>
                </div>

                <div className="p-4 bg-sky-50 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar size={18} className="mr-2" />
                    <span className="font-semibold">Created At</span>
                  </div>
                  <p className="text-gray-800">
                    {new Date(task.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field min-h-[120px]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
