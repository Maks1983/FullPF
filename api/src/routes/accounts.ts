import { Router, Response } from 'express';
import Joi from 'joi';
import { accountService } from '../services/accountService';
import { validate, validateParams, schemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

// Validation schemas
const createAccountSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  type: Joi.string().valid('checking', 'savings', 'credit', 'investment', 'loan').required(),
  balance: Joi.number().required(),
  currency: Joi.string().length(3).required(),
  institution: Joi.string().max(100).optional(),
  accountNumber: Joi.string().max(50).optional(),
  routingNumber: Joi.string().max(20).optional(),
  interestRate: Joi.number().min(0).max(100).optional(),
  creditLimit: Joi.number().min(0).optional(),
  minimumBalance: Joi.number().optional(),
});

const updateAccountSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  balance: Joi.number().optional(),
  institution: Joi.string().max(100).optional(),
  accountNumber: Joi.string().max(50).optional(),
  routingNumber: Joi.string().max(20).optional(),
  interestRate: Joi.number().min(0).max(100).optional(),
  creditLimit: Joi.number().min(0).optional(),
  minimumBalance: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

// Get all accounts for user
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const accounts = await accountService.findByUserId(req.user!.id);

  const response: ApiResponse = {
    success: true,
    data: accounts,
  };

  res.json(response);
}));

// Get account by ID
router.get('/:id', validateParams(Joi.object({ id: schemas.id })), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const account = await accountService.findById(req.params.id!, req.user!.id);
  
  if (!account) {
    throw new Error('Account not found');
  }

  const response: ApiResponse = {
    success: true,
    data: account,
  };

  res.json(response);
}));

// Create new account
router.post('/', validate(createAccountSchema), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const accountData = req.body;
  const account = await accountService.create(req.user!.id, accountData);

  const response: ApiResponse = {
    success: true,
    data: account,
    message: 'Account created successfully',
  };

  res.status(201).json(response);
}));

// Update account
router.put('/:id', 
  validateParams(Joi.object({ id: schemas.id })),
  validate(updateAccountSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const updates = req.body;
    const account = await accountService.update(req.params.id!, req.user!.id, updates);

    const response: ApiResponse = {
      success: true,
      data: account,
      message: 'Account updated successfully',
    };

    res.json(response);
  })
);

// Delete account
router.delete('/:id', validateParams(Joi.object({ id: schemas.id })), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await accountService.delete(req.params.id!, req.user!.id);

  const response: ApiResponse = {
    success: true,
    message: 'Account deleted successfully',
  };

  res.json(response);
}));

// Get account summary
router.get('/summary/overview', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const summary = await accountService.getAccountSummary(req.user!.id);

  const response: ApiResponse = {
    success: true,
    data: summary,
  };

  res.json(response);
}));

export default router;