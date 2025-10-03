/**
 * Example Mobile App Integration
 *
 * This example shows how to integrate the Expense API into a mobile app
 * with offline-first capabilities.
 */

import { ExpenseAPIClient } from '../client';
import type { ApiTransaction, ApiAccount } from '../types';

/**
 * Offline Expense Tracker
 *
 * Manages expenses in memory and syncs when online.
 */
export class OfflineExpenseTracker {
  private client: ExpenseAPIClient;
  private pendingTransactions: ApiTransaction[] = [];
  private accounts: ApiAccount[] = [];
  private isOnline = navigator.onLine;
  private syncInterval: number | null = null;

  constructor(baseUrl: string) {
    this.client = new ExpenseAPIClient({
      baseUrl,
      onTokenExpired: async () => {
        return await this.handleTokenRefresh();
      },
    });

    this.setupConnectivityMonitoring();
    this.loadPendingFromStorage();
  }

  /**
   * Initialize - Login and load accounts
   */
  async initialize(email: string, password: string): Promise<void> {
    const loginResult = await this.client.login({ email, password });

    if (!loginResult.success) {
      throw new Error('Login failed');
    }

    await this.loadAccounts();
    await this.syncTransactions();
  }

  /**
   * Load available accounts
   */
  private async loadAccounts(): Promise<void> {
    const result = await this.client.getAccounts({
      excludeBankLinked: true,
      includeInactive: false,
    });

    this.accounts = result.accounts;
  }

  /**
   * Get accounts for selection
   */
  getAccounts(): ApiAccount[] {
    return this.accounts;
  }

  /**
   * Add new expense
   */
  async addExpense(expense: Omit<ApiTransaction, 'clientId'>): Promise<void> {
    const transaction: ApiTransaction = {
      ...expense,
      clientId: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    this.pendingTransactions.push(transaction);
    this.savePendingToStorage();

    if (this.isOnline) {
      await this.syncTransactions();
    }
  }

  /**
   * Get pending transaction count
   */
  getPendingCount(): number {
    return this.pendingTransactions.length;
  }

  /**
   * Check if online
   */
  isConnected(): boolean {
    return this.isOnline;
  }

  /**
   * Sync pending transactions to server
   */
  async syncTransactions(): Promise<{
    synced: number;
    failed: number;
  }> {
    if (!this.isOnline || this.pendingTransactions.length === 0) {
      return { synced: 0, failed: 0 };
    }

    try {
      const batchSize = 50;
      const batches = [];

      for (let i = 0; i < this.pendingTransactions.length; i += batchSize) {
        batches.push(this.pendingTransactions.slice(i, i + batchSize));
      }

      let totalSynced = 0;
      let totalFailed = 0;

      for (const batch of batches) {
        const result = await this.client.batchTransactions({
          transactions: batch,
        });

        const successIds = new Set(
          result.results.filter((r) => r.success).map((r) => r.clientId)
        );

        this.pendingTransactions = this.pendingTransactions.filter(
          (txn) => !successIds.has(txn.clientId)
        );

        totalSynced += result.processed;
        totalFailed += result.failed;

        localStorage.setItem('lastSyncTimestamp', result.timestamp);
      }

      this.savePendingToStorage();

      return { synced: totalSynced, failed: totalFailed };
    } catch (error) {
      console.error('Sync failed:', error);
      return { synced: 0, failed: this.pendingTransactions.length };
    }
  }

  /**
   * Get sync status from server
   */
  async getSyncStatus(): Promise<{
    lastSyncTimestamp: string;
    pendingCount: number;
    needsFullSync: boolean;
  }> {
    const lastSync = localStorage.getItem('lastSyncTimestamp') || undefined;

    const status = await this.client.getSyncStatus({
      lastSyncTimestamp: lastSync,
    });

    return {
      lastSyncTimestamp: status.lastSyncTimestamp,
      pendingCount: status.pendingCount,
      needsFullSync: status.needsFullSync,
    };
  }

  /**
   * Setup connectivity monitoring
   */
  private setupConnectivityMonitoring(): void {
    const handleOnline = async () => {
      this.isOnline = true;
      await this.syncTransactions();
    };

    const handleOffline = () => {
      this.isOnline = false;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    this.syncInterval = window.setInterval(() => {
      if (this.isOnline && this.pendingTransactions.length > 0) {
        this.syncTransactions();
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Clean up
   */
  destroy(): void {
    if (this.syncInterval !== null) {
      clearInterval(this.syncInterval);
    }
  }

  /**
   * Load pending transactions from storage
   */
  private loadPendingFromStorage(): void {
    const stored = localStorage.getItem('pendingTransactions');
    if (stored) {
      try {
        this.pendingTransactions = JSON.parse(stored);
      } catch {
        this.pendingTransactions = [];
      }
    }
  }

  /**
   * Save pending transactions to storage
   */
  private savePendingToStorage(): void {
    localStorage.setItem(
      'pendingTransactions',
      JSON.stringify(this.pendingTransactions)
    );
  }

  /**
   * Handle token refresh
   */
  private async handleTokenRefresh(): Promise<string | null> {
    return null;
  }
}

/**
 * React Hook Example
 */
export function useExpenseTracker(baseUrl: string) {
  const [tracker] = useState(() => new OfflineExpenseTracker(baseUrl));
  const [isOnline, setIsOnline] = useState(tracker.isConnected());
  const [pendingCount, setPendingCount] = useState(tracker.getPendingCount());
  const [accounts, setAccounts] = useState<ApiAccount[]>([]);

  useEffect(() => {
    const updateStatus = () => {
      setIsOnline(tracker.isConnected());
      setPendingCount(tracker.getPendingCount());
    };

    const interval = setInterval(updateStatus, 1000);

    return () => {
      clearInterval(interval);
      tracker.destroy();
    };
  }, [tracker]);

  const addExpense = async (expense: Omit<ApiTransaction, 'clientId'>) => {
    await tracker.addExpense(expense);
    setPendingCount(tracker.getPendingCount());
  };

  const sync = async () => {
    const result = await tracker.syncTransactions();
    setPendingCount(tracker.getPendingCount());
    return result;
  };

  const initialize = async (email: string, password: string) => {
    await tracker.initialize(email, password);
    setAccounts(tracker.getAccounts());
  };

  return {
    isOnline,
    pendingCount,
    accounts,
    addExpense,
    sync,
    initialize,
  };
}

/**
 * UI Component Example
 */
export function ConnectionIndicator({
  isOnline,
  pendingCount,
}: {
  isOnline: boolean;
  pendingCount: number;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
        isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`}
      />
      <span>{isOnline ? 'Live' : 'Offline'}</span>
      {pendingCount > 0 && <span className="ml-1">({pendingCount} pending)</span>}
      }
    </div>
  );
}

/**
 * Expense Form Example
 */
export function ExpenseForm({
  accounts,
  onSubmit,
}: {
  accounts: ApiAccount[];
  onSubmit: (expense: Omit<ApiTransaction, 'clientId'>) => Promise<void>;
}) {
  const [accountId, setAccountId] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      accountId,
      description,
      amount: -Math.abs(parseFloat(amount)),
      category: category || 'uncategorized',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    });

    setDescription('');
    setAmount('');
    setCategory('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Account</label>
        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="">Select account</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name} ({acc.currency} {acc.balance.toFixed(2)})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Coffee, lunch, etc."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="food, transport, etc."
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Expense
      </button>
    </form>
  );
}
