import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
} from '../controllers/taskController.js';
import { validateTask } from '../middleware/validation.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Task routes
router.route('/')
  .get(getTasks)
  .post(validateTask, createTask);

router.get('/stats', getTaskStats);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

export default router;
