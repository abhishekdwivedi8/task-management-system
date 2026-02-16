import Task from '../models/Task.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, tags } = req.body;

    // Create task with user ID from JWT
    const task = await Task.create({
      title: title.trim(),
      description: description.trim(),
      priority: priority || 'medium',
      status: status || 'pending',
      dueDate: dueDate || null,
      tags: tags || [],
      createdBy: req.user.id // From JWT token
    });

    // Populate creator details
    await task.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      data: {
        task
      }
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task. Please try again.'
    });
  }
};

// @desc    Get all tasks with pagination
// @route   GET /api/tasks?page=1&limit=10&status=pending&priority=high
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = { isDeleted: false };

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter by priority
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    // Filter by user's own tasks (non-admin users see only their tasks)
    if (req.user.role !== 'admin') {
      filter.createdBy = req.user.id;
    }

    // Search by title or description
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const total = await Task.countDocuments(filter);

    // Get tasks with pagination
    const tasks = await Task.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        tasks,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPrevPage
        }
      }
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks. Please try again.'
    });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      isDeleted: false
    })
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.'
      });
    }

    // Check authorization (users can only view their own tasks unless admin)
    if (req.user.role !== 'admin' && task.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this task.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        task
      }
    });

  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task. Please try again.'
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    let task = await Task.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task.'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate', 'tags'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Set completion date if status changed to completed
    if (updates.status === 'completed' && task.status !== 'completed') {
      updates.completedAt = new Date();
    }

    // Update task
    task = await Task.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      data: {
        task
      }
    });

  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task. Please try again.'
    });
  }
};

// @desc    Delete task (soft delete)
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task.'
      });
    }

    // Soft delete
    task.isDeleted = true;
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully!'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task. Please try again.'
    });
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = async (req, res) => {
  try {
    const filter = { isDeleted: false };

    // Non-admin users see only their stats
    if (req.user.role !== 'admin') {
      // Convert string ID to ObjectId for aggregation
      filter.createdBy = new mongoose.Types.ObjectId(req.user.id);
    }

    const stats = await Task.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          highPriority: {
            $sum: { $cond: [{ $in: ['$priority', ['high', 'urgent']] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: stats[0] || {
          total: 0,
          pending: 0,
          inProgress: 0,
          completed: 0,
          cancelled: 0,
          highPriority: 0
        }
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics.'
    });
  }
};
