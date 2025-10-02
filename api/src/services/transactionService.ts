import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionFilters } from '../types';
import { AppError } from '../middleware/errorHandler';
import { accountService } from './accountService';

// In-memory storage for demo (replace with database in production)
const transactions: Transaction[] = [
  {
    id: 'tx-1',
    userId: 'user-1',
    accountId: 'acc-1',
    categoryId: 'cat-1',
    amount: -485.50,
    description: 'Grocery Store',
    date: new Date('2024-01-15'),
    type: 'expense',
    status: 'completed',
    merchant: 'Rema 1000',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'tx-2',
    userId: 'user-1',
    accountId: 'acc-1',
    categoryId: 'cat-2',
    amount: -650.00,
    description: 'Gas Station',
    date: new Date('2024-01-14'),
    type: 'expense',
    status: 'completed',
    merchant: 'Shell',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: 'tx-3',
    userId: 'user-1',
    accountId: 'acc-1',
    categoryId: 'cat-3',
    amount: 52000.00,
    description: 'Salary Deposit',
    date: new Date('2024-01-01'),
    type: 'income',
    status: 'completed',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const transactionService = {
  async findByUserId(userId: string, filters: TransactionFilters = {}): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    let filtered = transactions.filter(tx => tx.userId === userId);

    // Apply filters
    if (filters.accountId) {
      filtered = filtered.filter(tx => tx.accountId === filters.accountId);
    }

    if (filters.categoryId) {
      filtered = filtered.filter(tx => tx.categoryId === filters.categoryId);
    }

    if (filters.type) {
      filtered = filtered.filter(tx => tx.type === filters.type);
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter(tx => tx.date >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      filtered = filtered.filter(tx => tx.date <= endDate);
    }

    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(tx => Math.abs(tx.amount) >= filters.minAmount!);
    }

    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(tx => Math.abs(tx.amount) <= filters.maxAmount!);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.description.toLowerCase().includes(searchTerm) ||
        tx.merchant?.toLowerCase().includes(searchTerm) ||
        tx.notes?.toLowerCase().includes(searchTerm)
      );
    }

    // Sort
    const sortBy = filters.sortBy || 'date';
    const sortOrder = filters.sortOrder || 'desc';
    
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Transaction];
      let bValue: any = b[sortBy as keyof Transaction];
      
      if (aValue instanceof Date) aValue = aValue.getTime();
      if (bValue instanceof Date) bValue = bValue.getTime();
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedTransactions = filtered.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filtered.length / limit);

    return {
      transactions: paginatedTransactions,
      total: filtered.length,
      page,
      totalPages,
    };
  },

  async findById(id: string, userId: string): Promise<Transaction | null> {
    const transaction = transactions.find(tx => tx.id === id && tx.userId === userId);
    return transaction || null;
  },

  async create(userId: string, transactionData: {
    accountId: string;
    categoryId?: string;
    amount: number;
    description: string;
    date: Date;
    type: Transaction['type'];
    merchant?: string;
    location?: string;
    notes?: string;
    tags?: string[];
  }): Promise<Transaction> {
    // Verify account belongs to user
    const account = await accountService.findById(transactionData.accountId, userId);
    if (!account) {
      throw new AppError('Account not found', 404);
    }

    const transaction: Transaction = {
      id: uuidv4(),
      userId,
      ...transactionData,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    transactions.push(transaction);

    // Update account balance
    const newBalance = account.balance + transactionData.amount;
    await accountService.updateBalance(transactionData.accountId, userId, newBalance);

    return transaction;
  },

  async update(id: string, userId: string, updates: Partial<Transaction>): Promise<Transaction> {
    const transactionIndex = transactions.findIndex(tx => tx.id === id && tx.userId === userId);
    if (transactionIndex === -1) {
      throw new AppError('Transaction not found', 404);
    }

    const originalTransaction = transactions[transactionIndex];
    const updatedTransaction: Transaction = {
      ...originalTransaction,
      ...updates,
      updatedAt: new Date(),
    };

    // If amount changed, update account balance
    if (updates.amount !== undefined && updates.amount !== originalTransaction!.amount) {
      const account = await accountService.findById(originalTransaction!.accountId, userId);
      if (account) {
        const balanceDifference = updates.amount - originalTransaction!.amount;
        const newBalance = account.balance + balanceDifference;
        await accountService.updateBalance(originalTransaction!.accountId, userId, newBalance);
      }
    }

    transactions[transactionIndex] = updatedTransaction;
    return updatedTransaction;
  },

  async delete(id: string, userId: string): Promise<void> {
    const transactionIndex = transactions.findIndex(tx => tx.id === id && tx.userId === userId);
    if (transactionIndex === -1) {
      throw new AppError('Transaction not found', 404);
    }

    const transaction = transactions[transactionIndex];

    // Reverse the transaction's effect on account balance
    const account = await accountService.findById(transaction!.accountId, userId);
    if (account) {
      const newBalance = account.balance - transaction!.amount;
      await accountService.updateBalance(transaction!.accountId, userId, newBalance);
    }

    transactions.splice(transactionIndex, 1);
  },

  async getMonthlyTotals(userId: string, year: number): Promise<{
    month: string;
    income: number;
    expenses: number;
    netFlow: number;
  }[]> {
    const userTransactions = transactions.filter(tx => 
      tx.userId === userId && 
      tx.date.getFullYear() === year &&
      tx.status === 'completed'
    );

    const monthlyData: Record<string, { income: number; expenses: number }> = {};

    userTransactions.forEach(tx => {
      const monthKey = tx.date.toISOString().substring(0, 7); // YYYY-MM
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }

      if (tx.amount > 0) {
        monthlyData[monthKey].income += tx.amount;
      } else {
        monthlyData[monthKey].expenses += Math.abs(tx.amount);
      }
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
        netFlow: data.income - data.expenses,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  },

  async getCategoryBreakdown(userId: string, startDate: Date, endDate: Date): Promise<{
    categoryId: string;
    categoryName: string;
    amount: number;
    transactionCount: number;
  }[]> {
    const userTransactions = transactions.filter(tx => 
      tx.userId === userId && 
      tx.date >= startDate && 
      tx.date <= endDate &&
      tx.status === 'completed'
    );

    const categoryData: Record<string, { amount: number; count: number; name: string }> = {};

    userTransactions.forEach(tx => {
      const categoryId = tx.categoryId || 'uncategorized';
      const categoryName = tx.categoryId ? 'Category Name' : 'Uncategorized'; // Would fetch from category service
      
      if (!categoryData[categoryId]) {
        categoryData[categoryId] = { amount: 0, count: 0, name: categoryName };
      }

      categoryData[categoryId].amount += Math.abs(tx.amount);
      categoryData[categoryId].count += 1;
    });

    return Object.entries(categoryData)
      .map(([categoryId, data]) => ({
        categoryId,
        categoryName: data.name,
        amount: data.amount,
        transactionCount: data.count,
      }))
      .sort((a, b) => b.amount - a.amount);
  },
};