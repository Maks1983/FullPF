import { Router } from 'express';
import { analyticsService } from '../services/analyticsService';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

// Get comprehensive analytics data
router.get('/dashboard', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const analyticsData = await analyticsService.getDashboardData(req.user!.id);

  const response: ApiResponse = {
    success: true,
    data: analyticsData,
  };

  res.json(response);
}));

// Get financial health score
router.get('/health', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const healthData = await analyticsService.getFinancialHealth(req.user!.id);

  const response: ApiResponse = {
    success: true,
    data: healthData,
  };

  res.json(response);
}));

export default router;