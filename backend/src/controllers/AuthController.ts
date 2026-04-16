import type { Response } from 'express';
import { UserModel } from '../models/User';
import { generateToken } from '../config/jwt';
import type { AuthenticatedRequest } from '../middleware/auth';
import type { ApiResponse } from '../types/index';

export const AuthController = {
  async register(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { email, password, name } = req.body;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'Email already registered',
        });
        return;
      }

      const user = await UserModel.create(email, password, name);

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(201).json({
        success: true,
        data: { user, token },
        message: 'Registration successful',
      });
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      console.error('Registration error:', err.message || error);
      if (err.code === '23505') {
        res.status(409).json({ success: false, message: 'Email already registered' });
        return;
      }
      res.status(500).json({ success: false, message: 'Registration failed' });
    }
  },

  async login(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      const isValidPassword = await UserModel.verifyPassword(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        data: { user: userWithoutPassword, token },
        message: 'Login successful',
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
      });
    }
  },

  async getProfile(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ success: false, message: 'Failed to get profile' });
    }
  },

  async updateProfile(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const { name, email } = req.body;
      const user = await UserModel.update(req.user.userId, { name, email });

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.json({ success: true, data: user, message: 'Profile updated' });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
  },
};