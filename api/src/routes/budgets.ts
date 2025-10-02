import { Router, Response } from 'express';
import Joi from 'joi';
import { budgetService } from '../services/budgetService';
import { validate, validateParams, validateQuery, schemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

// Validation schemas
const createBudgetSchema = Joi.object({
  categoryId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  period: Joi.string().valid('weekly', 'monthly', 'yearly').required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
});

const updateBudgetSchema = Joi.object({
  amount: Joi.number().positive().optional(),
  period: Joi.string().valid('weekly', 'monthly', 'yearly').optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  isActive: Joi.boolean().optional(),
});

const budgetAnalysisSchema = Joi.object({
  year: Joi.number().integer().min(2020).max(2030).required(),
  month: Joi.number().integer().min(1).max(12).required(),
});

// Get all budgets for user
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const budgets = await budgetService.findByUserId(req.user!.id);

  const response: ApiResponse = {
    success: true,
    data: budgets,
  };

  res.json(response);
}));

// Get budget by ID
router.get('/:id', validateParams(Joi.object({ id: schemas.id })), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const budget = await budgetService.findById(req.params.id, req.user!.id);
  
  if (!budget) {
    throw new Error('Budget not found');
  }

  const response: ApiResponse = {
    success: true,
    data: budget,
  };

  res.json(response);
}));

// Create new budget
router.post('/', validate(createBudgetSchema), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const budgetData = req.body;
  const budget = await budgetService.create(req.user!.id, budgetData);

  const response: ApiResponse = {
    success: true,
    data: budget,
    message: 'Budget created successfully',
  };

  res.status(201).json(response);
}));

// Update budget
router.put('/:id',
  validateParams(Joi.object({ id: schemas.id })),
  validate(updateBudgetSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const updates = req.body;
    const budget = await budgetService.update(req.params.id, req.user!.id, updates);

    const response: ApiResponse = {
      success: true,
      data: budget,
      message: 'Budget updated successfully',
    };

    res.json(response);
  })
);

// Delete budget
router.delete('/:id', validateParams(Joi.object({ id: schemas.id })), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await budgetService.delete(req.params.id, req.user!.id);

  const response: ApiResponse = {
    success: true,
    message: 'Budget deleted successfully',
  };

  res.json(response);
}));

// Get budget analysis
router.get('/analytics/analysis', validateQuery(budgetAnalysisSchema), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { year, month } = req.query as any;
  const analysis = await budgetService.getBudgetAnalysis(req.user!.id, parseInt(year), parseInt(month));

  const response: ApiResponse = {
    success: true,
    data: analysis,
  };

  res.json(response);
}));

export default router;