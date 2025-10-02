import { Router } from 'express';
import Joi from 'joi';
import { goalService } from '../services/goalService';
import { validate, validateParams, schemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

// Validation schemas
const createGoalSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional(),
  targetAmount: Joi.number().positive().required(),
  currentAmount: Joi.number().min(0).optional(),
  targetDate: Joi.date().iso().min('now').required(),
  category: Joi.string().valid('emergency', 'savings', 'investment', 'debt', 'purchase', 'other').required(),
  priority: Joi.string().valid('low', 'medium', 'high').required(),
  linkedAccountId: Joi.string().uuid().optional(),
});

const updateGoalSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  description: Joi.string().max(500).optional(),
  targetAmount: Joi.number().positive().optional(),
  currentAmount: Joi.number().min(0).optional(),
  targetDate: Joi.date().iso().optional(),
  category: Joi.string().valid('emergency', 'savings', 'investment', 'debt', 'purchase', 'other').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  linkedAccountId: Joi.string().uuid().optional(),
  isActive: Joi.boolean().optional(),
});

const updateProgressSchema = Joi.object({
  amount: Joi.number().required(),
});

// Get all goals for user
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const goals = await goalService.findByUserId(req.user!.id);

  const response: ApiResponse = {
    success: true,
    data: goals,
  };

  res.json(response);
}));

// Get goal by ID
router.get('/:id', validateParams(Joi.object({ id: schemas.id })), asyncHandler(async (req: AuthenticatedRequest, res) => {
  const goal = await goalService.findById(req.params.id, req.user!.id);
  
  if (!goal) {
    throw new Error('Goal not found');
  }

  const response: ApiResponse = {
    success: true,
    data: goal,
  };

  res.json(response);
}));

// Create new goal
router.post('/', validate(createGoalSchema), asyncHandler(async (req: AuthenticatedRequest, res) => {
  const goalData = req.body;
  const goal = await goalService.create(req.user!.id, goalData);

  const response: ApiResponse = {
    success: true,
    data: goal,
    message: 'Goal created successfully',
  };

  res.status(201).json(response);
}));

// Update goal
router.put('/:id',
  validateParams(Joi.object({ id: schemas.id })),
  validate(updateGoalSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const updates = req.body;
    const goal = await goalService.update(req.params.id, req.user!.id, updates);

    const response: ApiResponse = {
      success: true,
      data: goal,
      message: 'Goal updated successfully',
    };

    res.json(response);
  })
);

// Delete goal
router.delete('/:id', validateParams(Joi.object({ id: schemas.id })), asyncHandler(async (req: AuthenticatedRequest, res) => {
  await goalService.delete(req.params.id, req.user!.id);

  const response: ApiResponse = {
    success: true,
    message: 'Goal deleted successfully',
  };

  res.json(response);
}));

// Update goal progress
router.post('/:id/progress',
  validateParams(Joi.object({ id: schemas.id })),
  validate(updateProgressSchema),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { amount } = req.body;
    const goal = await goalService.updateProgress(req.params.id, req.user!.id, amount);

    const response: ApiResponse = {
      success: true,
      data: goal,
      message: 'Goal progress updated successfully',
    };

    res.json(response);
  })
);

// Get goal progress analytics
router.get('/analytics/progress', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const progressData = await goalService.getGoalProgress(req.user!.id);

  const response: ApiResponse = {
    success: true,
    data: progressData,
  };

  res.json(response);
}));

export default router;