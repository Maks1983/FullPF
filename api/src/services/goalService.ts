import { v4 as uuidv4 } from 'uuid';
import { Goal } from '../types';
import { AppError } from '../middleware/errorHandler';

// In-memory storage for demo (replace with database in production)
const goals: Goal[] = [
  {
    id: 'goal-1',
    userId: 'user-1',
    name: 'Emergency Fund',
    description: 'Build 6 months of expenses',
    targetAmount: 180000,
    currentAmount: 129200,
    targetDate: new Date('2024-12-31'),
    category: 'emergency',
    priority: 'high',
    isActive: true,
    linkedAccountId: 'acc-3',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'goal-2',
    userId: 'user-1',
    name: 'House Down Payment',
    description: 'Save for house down payment',
    targetAmount: 500000,
    currentAmount: 125000,
    targetDate: new Date('2026-06-30'),
    category: 'purchase',
    priority: 'high',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
];

export const goalService = {
  async findByUserId(userId: string): Promise<Goal[]> {
    return goals.filter(goal => goal.userId === userId && goal.isActive);
  },

  async findById(id: string, userId: string): Promise<Goal | null> {
    const goal = goals.find(g => g.id === id && g.userId === userId);
    return goal || null;
  },

  async create(userId: string, goalData: {
    name: string;
    description?: string;
    targetAmount: number;
    currentAmount?: number;
    targetDate: Date;
    category: Goal['category'];
    priority: Goal['priority'];
    linkedAccountId?: string;
  }): Promise<Goal> {
    const goal: Goal = {
      id: uuidv4(),
      userId,
      currentAmount: 0,
      ...goalData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    goals.push(goal);
    return goal;
  },

  async update(id: string, userId: string, updates: Partial<Goal>): Promise<Goal> {
    const goalIndex = goals.findIndex(g => g.id === id && g.userId === userId);
    if (goalIndex === -1) {
      throw new AppError('Goal not found', 404);
    }

    const updatedGoal = {
      ...goals[goalIndex],
      ...updates,
      updatedAt: new Date(),
    };

    goals[goalIndex] = updatedGoal;
    return updatedGoal;
  },

  async delete(id: string, userId: string): Promise<void> {
    const goalIndex = goals.findIndex(g => g.id === id && g.userId === userId);
    if (goalIndex === -1) {
      throw new AppError('Goal not found', 404);
    }

    // Soft delete by setting isActive to false
    goals[goalIndex] = {
      ...goals[goalIndex],
      isActive: false,
      updatedAt: new Date(),
    };
  },

  async updateProgress(id: string, userId: string, amount: number): Promise<Goal> {
    const goal = await this.findById(id, userId);
    if (!goal) {
      throw new AppError('Goal not found', 404);
    }

    const newAmount = Math.max(0, goal.currentAmount + amount);
    return this.update(id, userId, { currentAmount: newAmount });
  },

  async getGoalProgress(userId: string): Promise<{
    goalId: string;
    goalName: string;
    progress: number;
    targetAmount: number;
    currentAmount: number;
    daysRemaining: number;
    monthlyContributionNeeded: number;
  }[]> {
    const userGoals = await this.findByUserId(userId);
    const now = new Date();

    return userGoals.map(goal => {
      const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
      const daysRemaining = Math.max(0, Math.ceil((goal.targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
      const monthsRemaining = Math.max(1, daysRemaining / 30);
      const monthlyContributionNeeded = remainingAmount / monthsRemaining;

      return {
        goalId: goal.id,
        goalName: goal.name,
        progress,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        daysRemaining,
        monthlyContributionNeeded,
      };
    });
  },
};