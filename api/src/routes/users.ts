import { Router, Response } from 'express';
import Joi from 'joi';
import { userService } from '../services/userService';
import { validate } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

// Validation schemas
const updateUserSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).optional(),
  lastName: Joi.string().min(1).max(50).optional(),
  currency: Joi.string().length(3).optional(),
  timezone: Joi.string().optional(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

// Get current user profile
router.get('/profile', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await userService.findById(req.user!.id);
  
  if (!user) {
    throw new Error('User not found');
  }

  const response: ApiResponse = {
    success: true,
    data: {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      currency: user.currency,
      timezone: user.timezone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };

  res.json(response);
}));

// Update user profile
router.put('/profile', validate(updateUserSchema), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const updates = req.body;
  const updatedUser = await userService.update(req.user!.id, updates);

  const response: ApiResponse = {
    success: true,
    data: {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      currency: updatedUser.currency,
      timezone: updatedUser.timezone,
      updatedAt: updatedUser.updatedAt,
    },
    message: 'Profile updated successfully',
  };

  res.json(response);
}));

// Change password
router.post('/change-password', validate(changePasswordSchema), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user!.id;

  // Verify current password
  const isValidPassword = await userService.verifyPassword(userId, currentPassword);
  if (!isValidPassword) {
    throw new Error('Current password is incorrect');
  }

  // Update password
  await userService.updatePassword(userId, newPassword);

  const response: ApiResponse = {
    success: true,
    message: 'Password changed successfully',
  };

  res.json(response);
}));

export default router;