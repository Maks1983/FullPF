import { v4 as uuidv4 } from 'uuid';
import { Account } from '../types';
import { AppError } from '../middleware/errorHandler';

// In-memory storage for demo (replace with database in production)
const accounts: Account[] = [
  {
    id: 'acc-1',
    userId: 'user-1',
    name: 'Main Checking',
    type: 'checking',
    balance: 15420.00,
    currency: 'NOK',
    isActive: true,
    institution: 'DNB',
    accountNumber: '****1234',
    minimumBalance: 500,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'acc-2',
    userId: 'user-1',
    name: 'High Yield Savings',
    type: 'savings',
    balance: 82000.00,
    currency: 'NOK',
    isActive: true,
    institution: 'Nordea',
    accountNumber: '****5678',
    interestRate: 4.2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'acc-3',
    userId: 'user-1',
    name: 'Emergency Fund',
    type: 'savings',
    balance: 47200.00,
    currency: 'NOK',
    isActive: true,
    institution: 'Nordea',
    accountNumber: '****9012',
    interestRate: 3.8,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'acc-4',
    userId: 'user-1',
    name: 'Credit Card',
    type: 'credit',
    balance: -18500.00,
    currency: 'NOK',
    isActive: true,
    institution: 'SEB',
    accountNumber: '****3456',
    creditLimit: 25000,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
];

export const accountService = {
  async findByUserId(userId: string): Promise<Account[]> {
    return accounts.filter(account => account.userId === userId && account.isActive);
  },

  async findById(id: string, userId: string): Promise<Account | null> {
    const account = accounts.find(acc => acc.id === id && acc.userId === userId);
    return account || null;
  },

  async create(userId: string, accountData: {
    name: string;
    type: Account['type'];
    balance: number;
    currency: string;
    institution?: string;
    accountNumber?: string;
    routingNumber?: string;
    interestRate?: number;
    creditLimit?: number;
    minimumBalance?: number;
  }): Promise<Account> {
    const account: Account = {
      id: uuidv4(),
      userId,
      ...accountData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    accounts.push(account);
    return account;
  },

  async update(id: string, userId: string, updates: Partial<Account>): Promise<Account> {
    const accountIndex = accounts.findIndex(acc => acc.id === id && acc.userId === userId);
    if (accountIndex === -1) {
      throw new AppError('Account not found', 404);
    }

    const updatedAccount = {
      ...accounts[accountIndex],
      ...updates,
      updatedAt: new Date(),
    };

    accounts[accountIndex] = updatedAccount;
    return updatedAccount;
  },

  async delete(id: string, userId: string): Promise<void> {
    const accountIndex = accounts.findIndex(acc => acc.id === id && acc.userId === userId);
    if (accountIndex === -1) {
      throw new AppError('Account not found', 404);
    }

    // Soft delete by setting isActive to false
    accounts[accountIndex] = {
      ...accounts[accountIndex],
      isActive: false,
      updatedAt: new Date(),
    };
  },

  async updateBalance(id: string, userId: string, newBalance: number): Promise<Account> {
    return this.update(id, userId, { balance: newBalance });
  },

  async getAccountSummary(userId: string): Promise<{
    checking: number;
    savings: number;
    credit: number;
    investment: number;
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
  }> {
    const userAccounts = await this.findByUserId(userId);
    
    const summary = {
      checking: 0,
      savings: 0,
      credit: 0,
      investment: 0,
      totalAssets: 0,
      totalLiabilities: 0,
      netWorth: 0,
    };

    userAccounts.forEach(account => {
      const balance = account.balance;
      
      switch (account.type) {
        case 'checking':
          summary.checking += balance;
          break;
        case 'savings':
          summary.savings += balance;
          break;
        case 'credit':
          summary.credit += Math.abs(balance); // Credit balances are negative
          break;
        case 'investment':
          summary.investment += balance;
          break;
      }

      if (balance > 0) {
        summary.totalAssets += balance;
      } else {
        summary.totalLiabilities += Math.abs(balance);
      }
    });

    summary.netWorth = summary.totalAssets - summary.totalLiabilities;
    
    return summary;
  },
};