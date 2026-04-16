import type { Response } from 'express';
import { TaskModel } from '../models/Task';
import type { AuthenticatedRequest } from '../middleware/auth';
import type { ApiResponse, Task } from '../types/index';

export const TaskController = {
  async create(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const { title, description, status, priority } = req.body;
      const task = await TaskModel.create(title, description, req.user.userId, status, priority);

      res.status(201).json({
        success: true,
        data: task,
        message: 'Task created successfully',
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ success: false, message: 'Failed to create task' });
    }
  },

  async getAll(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      let tasks: Task[];
      if (req.user.role === 'admin') {
        tasks = await TaskModel.findAll();
      } else {
        tasks = await TaskModel.findByUserId(req.user.userId);
      }

      res.json({ success: true, data: tasks });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
    }
  },

  async getById(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const { id } = req.params;
      const task = await TaskModel.findById(id);

      if (!task) {
        res.status(404).json({ success: false, message: 'Task not found' });
        return;
      }

      if (task.userId !== req.user.userId && req.user.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Access denied' });
        return;
      }

      res.json({ success: true, data: task });
    } catch (error) {
      console.error('Get task error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch task' });
    }
  },

  async update(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const { id } = req.params;
      const { title, description, status, priority } = req.body;

      const existingTask = await TaskModel.findById(id);
      if (!existingTask) {
        res.status(404).json({ success: false, message: 'Task not found' });
        return;
      }

      if (existingTask.userId !== req.user.userId && req.user.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Access denied' });
        return;
      }

      const task = await TaskModel.update(id, { title, description, status, priority });

      res.json({ success: true, data: task, message: 'Task updated' });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ success: false, message: 'Failed to update task' });
    }
  },

  async delete(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const { id } = req.params;
      const existingTask = await TaskModel.findById(id);

      if (!existingTask) {
        res.status(404).json({ success: false, message: 'Task not found' });
        return;
      }

      if (existingTask.userId !== req.user.userId && req.user.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Access denied' });
        return;
      }

      await TaskModel.delete(id);

      res.json({ success: true, message: 'Task deleted' });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ success: false, message: 'Failed to delete task' });
    }
  },
};