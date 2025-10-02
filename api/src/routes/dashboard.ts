import { Router } from 'express';
import { accountService } from '../services/accountService';
import { transactionService } from '../services/transactionService';
import { goalService } from '../services/goalService';
import { categoryService } from '../services/categoryService';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, DashboardData } from '../types';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

// Get complete dashboard data
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  
  // Get account summary
  const accountSummary = await accountService.getAccountSummary(userId);
  
  // Get recent transactions (last 10)
  const recentTransactionsResult = await transactionService.findByUserId(userId, {
    page: 1,
    limit: 10,
    sortBy: 'date',
    sortOrder: 'desc',
  });
  
  // Get monthly trends for current year
  const currentYear = new Date().getFullYear();
  const monthlyTrends = await transactionService.getMonthlyTotals(userId, currentYear);
  
  // Get category breakdown for current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const categoryBreakdown = await transactionService.getCategoryBreakdown(userId, startOfMonth, endOfMonth);
  
  // Get goal progress
  const goalProgress = await goalService.getGoalProgress(userId);
  
  // Calculate key metrics
  const totalBalance = accountSummary.checking + accountSummary.savings;
  const currentMonthData = monthlyTrends[monthlyTrends.length - 1];
  const monthlyIncome = currentMonthData?.income || 0;
  const monthlyExpenses = currentMonthData?.expenses || 0;
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

  const dashboardData: DashboardData = {
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    netWorth: accountSummary.netWorth,
    savingsRate,
    recentTransactions: recentTransactionsResult.transactions,
    accountSummary: {
      checking: accountSummary.checking,
      savings: accountSummary.savings,
      credit: accountSummary.credit,
      investment: accountSummary.investment,
    },
    monthlyTrends,
    categoryBreakdown: categoryBreakdown.map(cat => ({
      categoryId: cat.categoryId,
      categoryName: cat.categoryName,
      amount: cat.amount,
      percentage: categoryBreakdown.reduce((sum, c) => sum + c.amount, 0) > 0 
        ? (cat.amount / categoryBreakdown.reduce((sum, c) => sum + c.amount, 0)) * 100 
        : 0,
    })),
    goalProgress,
  };

  const response: ApiResponse<DashboardData> = {
    success: true,
    data: dashboardData,
  };

  res.json(response);
}));

// Get quick stats
router.get('/stats', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const accountSummary = await accountService.getAccountSummary(userId);
  const goals = await goalService.findByUserId(userId);
  
  // Get transaction count for current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const transactionsResult = await transactionService.findByUserId(userId, {
    startDate: startOfMonth.toISOString(),
    endDate: now.toISOString(),
  });

  const stats = {
    totalAccounts: Object.values(accountSummary).filter(val => typeof val === 'number' && val > 0).length,
    totalGoals: goals.length,
    completedGoals: goals.filter(goal => goal.currentAmount >= goal.targetAmount).length,
    monthlyTransactions: transactionsResult.total,
    netWorth: accountSummary.netWorth,
    liquidAssets: accountSummary.checking + accountSummary.savings,
  };

  const response: ApiResponse = {
    success: true,
    data: stats,
  };

  res.json(response);
}));

export default router;