import { Router, Response } from 'express';
import Joi from 'joi';
import { transactionService } from '../services/transactionService';
import { validate, validateParams, validateQuery, schemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

// Validation schemas
const createTransactionSchema = Joi.object({
  accountId: Joi.string().uuid().required(),
  categoryId: Joi.string().uuid().optional(),
  amount: Joi.number().required(),
  description: Joi.string().min(1).max(200).required(),
  date: Joi.date().iso().required(),
  type: Joi.string().valid('income', 'expense', 'transfer').required(),
  merchant: Joi.string().max(100).optional(),
  location: Joi.string().max(200).optional(),
  notes: Joi.string().max(500).optional(),
  tags: Joi.array().items(Joi.string().max(50)).optional(),
});

const updateTransactionSchema = Joi.object({
  categoryId: Joi.string().uuid().optional(),
  amount: Joi.number().optional(),
  description: Joi.string().min(1).max(200).optional(),
  date: Joi.date().iso().optional(),
  type: Joi.string().valid('income', 'expense', 'transfer').optional(),
  merchant: Joi.string().max(100).optional(),
  location: Joi.string().max(200).optional(),
  notes: Joi.string().max(500).optional(),
  tags: Joi.array().items(Joi.string().max(50)).optional(),
  status: Joi.string().valid('pending', 'completed', 'cancelled').optional(),
});

const transactionFiltersSchema = Joi.object({
  ...schemas.pagination.describe().keys,
  accountId: Joi.string().uuid().optional(),
  categoryId: Joi.string().uuid().optional(),
  type: Joi.string().valid('income', 'expense', 'transfer').optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  minAmount: Joi.number().optional(),
  maxAmount: Joi.number().optional(),
  search: Joi.string().max(100).optional(),
});

// Get transactions with filters and pagination
router.get('/', validateQuery(transactionFiltersSchema), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const filters = req.query as any;
  const result = await transactionService.findByUserId(req.user!.id, filters);

  const response: ApiResponse = {
    success: true,
    data: result.transactions,
    pagination: {
      page: result.page,
      limit: filters.limit || 20,
      total: result.total,
      totalPages: result.totalPages,
    },
  };

  res.json(response);
}));

// Get transaction by ID
router.get('/:id', validateParams(Joi.object({ id: schemas.id })), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const transaction = await transactionService.findById(req.params.id!, req.user!.id);
  
  if (!transaction) {
    throw new Error('Transaction not found');
  }

  const response: ApiResponse = {
    success: true,
    data: transaction,
  };

  res.json(response);
}));

// Create new transaction
router.post('/', validate(createTransactionSchema), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const transactionData = req.body;
  const transaction = await transactionService.create(req.user!.id, transactionData);

  const response: ApiResponse = {
    success: true,
    data: transaction,
    message: 'Transaction created successfully',
  };

  res.status(201).json(response);
}));

// Update transaction
router.put('/:id',
  validateParams(Joi.object({ id: schemas.id })),
  validate(updateTransactionSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const updates = req.body;
    const transaction = await transactionService.update(req.params.id!, req.user!.id, updates);

    const response: ApiResponse = {
      success: true,
      data: transaction,
      message: 'Transaction updated successfully',
    };

    res.json(response);
  })
);

// Delete transaction
router.delete('/:id', validateParams(Joi.object({ id: schemas.id })), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await transactionService.delete(req.params.id!, req.user!.id);

  const response: ApiResponse = {
    success: true,
    message: 'Transaction deleted successfully',
  };

  res.json(response);
}));

// Get monthly totals
router.get('/analytics/monthly/:year', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const year = parseInt(req.params.year!, 10);
  const monthlyTotals = await transactionService.getMonthlyTotals(req.user!.id, year);

  const response: ApiResponse = {
    success: true,
    data: monthlyTotals,
  };

  res.json(response);
}));

export default router;