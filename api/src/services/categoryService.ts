import { v4 as uuidv4 } from 'uuid';
import { Category } from '../types';
import { AppError } from '../middleware/errorHandler';

// In-memory storage for demo (replace with database in production)
const categories: Category[] = [
  {
    id: 'cat-1',
    userId: 'user-1',
    name: 'Food & Dining',
    type: 'expense',
    color: '#ef4444',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-2',
    userId: 'user-1',
    name: 'Transportation',
    type: 'expense',
    color: '#3b82f6',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-3',
    userId: 'user-1',
    name: 'Salary',
    type: 'income',
    color: '#10b981',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-4',
    userId: 'user-1',
    name: 'Housing',
    type: 'expense',
    color: '#8b5cf6',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const categoryService = {
  async findByUserId(userId: string): Promise<Category[]> {
    return categories.filter(category => category.userId === userId && category.isActive);
  },

  async findById(id: string, userId: string): Promise<Category | null> {
    const category = categories.find(cat => cat.id === id && cat.userId === userId);
    return category || null;
  },

  async create(userId: string, categoryData: {
    name: string;
    type: Category['type'];
    color: string;
    icon?: string;
    parentId?: string;
  }): Promise<Category> {
    // Check if category name already exists for user
    const existing = categories.find(cat => 
      cat.userId === userId && 
      cat.name.toLowerCase() === categoryData.name.toLowerCase() &&
      cat.isActive
    );

    if (existing) {
      throw new AppError('Category name already exists', 400);
    }

    const category: Category = {
      id: uuidv4(),
      userId,
      ...categoryData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    categories.push(category);
    return category;
  },

  async update(id: string, userId: string, updates: Partial<Category>): Promise<Category> {
    const categoryIndex = categories.findIndex(cat => cat.id === id && cat.userId === userId);
    if (categoryIndex === -1) {
      throw new AppError('Category not found', 404);
    }

    // Check for name conflicts if name is being updated
    if (updates.name) {
      const existing = categories.find(cat => 
        cat.userId === userId && 
        cat.id !== id &&
        cat.name.toLowerCase() === updates.name!.toLowerCase() &&
        cat.isActive
      );

      if (existing) {
        throw new AppError('Category name already exists', 400);
      }
    }

    const updatedCategory: Category = {
      ...categories[categoryIndex],
      ...updates,
      updatedAt: new Date(),
    };

    categories[categoryIndex] = updatedCategory;
    return updatedCategory;
  },

  async delete(id: string, userId: string): Promise<void> {
    const categoryIndex = categories.findIndex(cat => cat.id === id && cat.userId === userId);
    if (categoryIndex === -1) {
      throw new AppError('Category not found', 404);
    }

    // Soft delete by setting isActive to false
    categories[categoryIndex] = {
      ...categories[categoryIndex],
      isActive: false,
      updatedAt: new Date(),
    } as Category;
  },

  async getSpendingByCategory(userId: string, startDate: Date, endDate: Date): Promise<{
    categoryId: string;
    categoryName: string;
    amount: number;
    transactionCount: number;
    percentage: number;
  }[]> {
    const userCategories = await this.findByUserId(userId);
    const categoryMap = new Map(userCategories.map(cat => [cat.id, cat.name]));

    // This would typically join with transactions, but for demo we'll simulate
    const mockData = [
      { categoryId: 'cat-1', amount: 4200, count: 15 },
      { categoryId: 'cat-2', amount: 2800, count: 8 },
      { categoryId: 'cat-4', amount: 12000, count: 1 },
    ];

    const totalAmount = mockData.reduce((sum, item) => sum + item.amount, 0);

    return mockData.map(item => ({
      categoryId: item.categoryId,
      categoryName: categoryMap.get(item.categoryId) || 'Unknown',
      amount: item.amount,
      transactionCount: item.count,
      percentage: (item.amount / totalAmount) * 100,
    }));
  },
};