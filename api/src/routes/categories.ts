import { Router, Response } from 'express';
import Joi from 'joi';
import { categoryService } from '../services/categoryService';
import { validate, validateParams, schemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

// Validation schemas
const createCategorySchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  type: Joi.string().valid('income', 'expense').required(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).required(),
  icon: Joi.string().max(50).optional(),
  parentId: Joi.string().uuid().optional(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(1).max(50).optional(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: Joi.string().max(50).optional(),
  parentId: Joi.string().uuid().optional(),
  isActive: Joi.boolean().optional(),
});

// Get all categories for user
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const categories = await categoryService.findByUserId(req.user!.id);

  const response: ApiResponse = {
    success: true,
    data: categories,
  };

  res.json(response);
}));

// Get category by ID
router.get('/:id', validateParams(Joi.object({ id: schemas.id })), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const category = await categoryService.findById(req.params.id!, req.user!.id);
  
  if (!category) {
    throw new Error('Category not found');
  }

  const response: ApiResponse = {
    success: true,
    data: category,
  };

  res.json(response);
}));

// Create new category
router.post('/', validate(createCategorySchema), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const categoryData = req.body;
  const category = await categoryService.create(req.user!.id, categoryData);

  const response: ApiResponse = {
    success: true,
    data: category,
    message: 'Category created successfully',
  };

  res.status(201).json(response);
}));

// Update category
router.put('/:id',
  validateParams(Joi.object({ id: schemas.id })),
  validate(updateCategorySchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const updates = req.body;
    const category = await categoryService.update(req.params.id!, req.user!.id, updates);

    const response: ApiResponse = {
      success: true,
      data: category,
      message: 'Category updated successfully',
    };

    res.json(response);
  })
);

// Delete category
router.delete('/:id', validateParams(Joi.object({ id: schemas.id })), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await categoryService.delete(req.params.id!, req.user!.id);

  const response: ApiResponse = {
    success: true,
    message: 'Category deleted successfully',
  };

  res.json(response);
}));

// Get spending by category
router.get('/analytics/spending', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { startDate, endDate } = req.query;
  
  const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const end = endDate ? new Date(endDate as string) : new Date();
  
  const spendingData = await categoryService.getSpendingByCategory(req.user!.id, start, end);

  const response: ApiResponse = {
    success: true,
    data: spendingData,
  };

  res.json(response);
}));

export default router;