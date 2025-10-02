import { v4 as uuidv4 } from 'uuid';
import { Budget } from '../types';
import { AppError } from '../middleware/errorHandler';
import { transactionService } from './transactionService';
import { categoryService } from './categoryService';

// In-memory storage for demo (replace with database in production)
const budgets: Budget[] = [
  {
    id: 'budget-1',
    userId: 'user-1',
    categoryId: 'cat-1',
    amount: 5000,
    period: 'monthly',
    startDate: new Date('2024-01-01'),
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'budget-2',
    userId: 'user-1',
    categoryId: 'cat-2',
    amount: 3500,
    period: 'monthly',
    startDate: new Date('2024-01-01'),
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const budgetService = {
  async findByUserId(userId: string): Promise<Budget[]> {
    return budgets.filter(budget => budget.userId === userId && budget.isActive);
  },

  async findById(id: string, userId: string): Promise<Budget | null> {
    const budget = budgets.find(b => b.id === id && b.userId === userId);
    return budget || null;
  },

  async create(userId: string, budgetData: {
    categoryId: string;
    amount: number;
    period: Budget['period'];
    startDate: Date;
    endDate?: Date;
  }): Promise<Budget> {
    // Verify category belongs to user
    const category = await categoryService.findById(budgetData.categoryId, userId);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Check if budget already exists for this category and period
    const existing = budgets.find(b => 
      b.userId === userId && 
      b.categoryId === budgetData.categoryId && 
      b.period === budgetData.period &&
      b.isActive
    );

    if (existing) {
      throw new AppError('Budget already exists for this category and period', 400);
    }

    const budget: Budget = {
      id: uuidv4(),
      userId,
      ...budgetData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    budgets.push(budget);
    return budget;
  },

  async update(id: string, userId: string, updates: Partial<Budget>): Promise<Budget> {
    const budgetIndex = budgets.findIndex(b => b.id === id && b.userId === userId);
    if (budgetIndex === -1) {
      throw new AppError('Budget not found', 404);
    }

    const updatedBudget = {
      ...budgets[budgetIndex],
      ...updates,
      updatedAt: new Date(),
    };

    budgets[budgetIndex] = updatedBudget;
    return updatedBudget;
  },

  async delete(id: string, userId: string): Promise<void> {
    const budgetIndex = budgets.findIndex(b => b.id === id && b.userId === userId);
    if (budgetIndex === -1) {
      throw new AppError('Budget not found', 404);
    }

    // Soft delete by setting isActive to false
    budgets[budgetIndex] = {
      ...budgets[budgetIndex],
      isActive: false,
      updatedAt: new Date(),
    };
  },

  async getBudgetAnalysis(userId: string, year: number, month: number): Promise<{
    categoryId: string;
    categoryName: string;
    budgetAmount: number;
    spentAmount: number;
    remainingAmount: number;
    percentageUsed: number;
    isOverBudget: boolean;
    period: string;
  }[]> {
    const userBudgets = await this.findByUserId(userId);
    const userCategories = await categoryService.findByUserId(userId);
    const categoryMap = new Map(userCategories.map(cat => [cat.id, cat.name]));

    // Calculate spending for the period
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const categoryBreakdown = await transactionService.getCategoryBreakdown(userId, startDate, endDate);
    const spendingMap = new Map(categoryBreakdown.map(item => [item.categoryId, item.amount]));

    return userBudgets.map(budget => {
      const spentAmount = spendingMap.get(budget.categoryId) || 0;
      const remainingAmount = budget.amount - spentAmount;
      const percentageUsed = budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0;
      const isOverBudget = spentAmount > budget.amount;

      return {
        categoryId: budget.categoryId,
        categoryName: categoryMap.get(budget.categoryId) || 'Unknown',
        budgetAmount: budget.amount,
        spentAmount,
        remainingAmount,
        percentageUsed,
        isOverBudget,
        period: budget.period,
      };
    });
  },
};