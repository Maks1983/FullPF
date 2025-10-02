import { AnalyticsData } from '../types';
import { transactionService } from './transactionService';
import { accountService } from './accountService';
import { categoryService } from './categoryService';

export const analyticsService = {
  async getDashboardData(userId: string): Promise<AnalyticsData> {
    const currentYear = new Date().getFullYear();
    
    // Get monthly trends for the current year
    const monthlyTotals = await transactionService.getMonthlyTotals(userId, currentYear);
    
    // Get category breakdown for last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const categoryBreakdown = await transactionService.getCategoryBreakdown(userId, startDate, endDate);
    const totalSpending = categoryBreakdown.reduce((sum, cat) => sum + cat.amount, 0);
    
    // Get account summary for net worth calculation
    const accountSummary = await accountService.getAccountSummary(userId);
    
    // Generate mock net worth history (in production, this would come from historical data)
    const netWorthHistory = Array.from({ length: 12 }, (_, index) => {
      const month = new Date();
      month.setMonth(month.getMonth() - (11 - index));
      
      return {
        month: month.toISOString().substring(0, 7),
        assets: accountSummary.totalAssets + (Math.random() - 0.5) * 10000,
        liabilities: accountSummary.totalLiabilities + (Math.random() - 0.5) * 5000,
        netWorth: accountSummary.netWorth + (Math.random() - 0.5) * 8000,
      };
    });

    // Calculate savings rate history
    const savingsRateHistory = monthlyTotals.map(month => ({
      month: month.month,
      rate: month.income > 0 ? (month.netFlow / month.income) * 100 : 0,
    }));

    return {
      cashflowTrend: monthlyTotals,
      spendingByCategory: categoryBreakdown.map(cat => ({
        categoryName: cat.categoryName,
        amount: cat.amount,
        percentage: totalSpending > 0 ? (cat.amount / totalSpending) * 100 : 0,
        trend: Math.random() * 20 - 10, // Mock trend data
      })),
      netWorthHistory,
      savingsRate: savingsRateHistory,
    };
  },

  async getFinancialHealth(userId: string): Promise<{
    score: number;
    factors: {
      emergencyFund: { score: number; description: string };
      debtToIncome: { score: number; description: string };
      savingsRate: { score: number; description: string };
      diversification: { score: number; description: string };
    };
    recommendations: string[];
  }> {
    const accountSummary = await accountService.getAccountSummary(userId);
    const currentYear = new Date().getFullYear();
    const monthlyTotals = await transactionService.getMonthlyTotals(userId, currentYear);
    
    // Calculate average monthly income and expenses
    const avgMonthlyIncome = monthlyTotals.reduce((sum, month) => sum + month.income, 0) / Math.max(monthlyTotals.length, 1);
    const avgMonthlyExpenses = monthlyTotals.reduce((sum, month) => sum + month.expenses, 0) / Math.max(monthlyTotals.length, 1);
    
    // Emergency fund score (based on months of expenses covered)
    const emergencyFundMonths = avgMonthlyExpenses > 0 ? accountSummary.savings / avgMonthlyExpenses : 0;
    const emergencyFundScore = Math.min(100, (emergencyFundMonths / 6) * 100);
    
    // Debt-to-income ratio score
    const monthlyDebtPayments = accountSummary.credit * 0.03; // Assume 3% minimum payment
    const debtToIncomeRatio = avgMonthlyIncome > 0 ? (monthlyDebtPayments / avgMonthlyIncome) * 100 : 0;
    const debtToIncomeScore = Math.max(0, 100 - (debtToIncomeRatio * 2));
    
    // Savings rate score
    const savingsRate = avgMonthlyIncome > 0 ? ((avgMonthlyIncome - avgMonthlyExpenses) / avgMonthlyIncome) * 100 : 0;
    const savingsRateScore = Math.min(100, savingsRate * 5);
    
    // Diversification score (simplified)
    const diversificationScore = accountSummary.investment > 0 ? 85 : 60;
    
    const overallScore = (emergencyFundScore + debtToIncomeScore + savingsRateScore + diversificationScore) / 4;
    
    const recommendations: string[] = [];
    if (emergencyFundScore < 80) recommendations.push('Build your emergency fund to 6 months of expenses');
    if (debtToIncomeScore < 70) recommendations.push('Reduce debt payments to improve cash flow');
    if (savingsRateScore < 60) recommendations.push('Increase your savings rate to 20% or more');
    if (diversificationScore < 80) recommendations.push('Consider diversifying with investments');

    return {
      score: Math.round(overallScore),
      factors: {
        emergencyFund: {
          score: Math.round(emergencyFundScore),
          description: `${emergencyFundMonths.toFixed(1)} months of expenses covered`,
        },
        debtToIncome: {
          score: Math.round(debtToIncomeScore),
          description: `${debtToIncomeRatio.toFixed(1)}% debt-to-income ratio`,
        },
        savingsRate: {
          score: Math.round(savingsRateScore),
          description: `${savingsRate.toFixed(1)}% savings rate`,
        },
        diversification: {
          score: Math.round(diversificationScore),
          description: 'Investment portfolio diversification',
        },
      },
      recommendations,
    };
  },
};