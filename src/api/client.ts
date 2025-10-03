/**
 * Expense API Client
 *
 * Type-safe client for the Offline Expense App API.
 * Handles authentication, retries, and error handling.
 */

import type {
  LoginRequest,
  LoginResponse,
  AccountsRequest,
  AccountsResponse,
  BatchTransactionsRequest,
  BatchTransactionsResponse,
  UserInfoResponse,
  SyncStatusRequest,
  SyncStatusResponse,
  ApiError,
} from './types';

export interface ClientConfig {
  baseUrl: string;
  onTokenExpired?: () => Promise<string | null>;
  maxRetries?: number;
  retryDelay?: number;
}

export class ExpenseAPIClient {
  private config: Required<ClientConfig>;

  constructor(config: ClientConfig) {
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      onTokenExpired: async () => null,
      ...config,
    };
  }

  private getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private setToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retry = 0
  ): Promise<T> {
    try {
      const token = this.getToken();

      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      });

      if (response.status === 401) {
        if (this.config.onTokenExpired) {
          const newToken = await this.config.onTokenExpired();
          if (newToken) {
            this.setToken(newToken);
            return this.request(endpoint, options, retry);
          }
        }
        throw new Error('Authentication failed');
      }

      if (response.status === 429 && retry < this.config.maxRetries) {
        const delay = this.config.retryDelay * Math.pow(2, retry);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.request(endpoint, options, retry + 1);
      }

      if (response.status >= 500 && retry < this.config.maxRetries) {
        const delay = this.config.retryDelay * Math.pow(2, retry);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.request(endpoint, options, retry + 1);
      }

      const data = await response.json();

      if (!response.ok) {
        const error = data as ApiError;
        throw new Error(error.error || 'Request failed');
      }

      return data as T;
    } catch (error) {
      if (retry < this.config.maxRetries) {
        const delay = this.config.retryDelay * Math.pow(2, retry);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.request(endpoint, options, retry + 1);
      }
      throw error;
    }
  }

  /**
   * Login and obtain access tokens
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api-login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success) {
      this.setToken(response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }

    return response;
  }

  /**
   * Get user information and rate limits
   */
  async getUserInfo(): Promise<UserInfoResponse> {
    return this.request<UserInfoResponse>('/api-user');
  }

  /**
   * Get available accounts for expense entry
   */
  async getAccounts(params?: AccountsRequest): Promise<AccountsResponse> {
    const queryParams = new URLSearchParams();

    if (params?.includeInactive !== undefined) {
      queryParams.set('includeInactive', String(params.includeInactive));
    }

    if (params?.excludeBankLinked !== undefined) {
      queryParams.set('excludeBankLinked', String(params.excludeBankLinked));
    }

    const query = queryParams.toString();
    const endpoint = `/api-accounts${query ? `?${query}` : ''}`;

    return this.request<AccountsResponse>(endpoint);
  }

  /**
   * Batch insert transactions
   */
  async batchTransactions(
    payload: BatchTransactionsRequest
  ): Promise<BatchTransactionsResponse> {
    return this.request<BatchTransactionsResponse>('/api-transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Get sync status
   */
  async getSyncStatus(params?: SyncStatusRequest): Promise<SyncStatusResponse> {
    const queryParams = new URLSearchParams();

    if (params?.lastSyncTimestamp) {
      queryParams.set('lastSyncTimestamp', params.lastSyncTimestamp);
    }

    const query = queryParams.toString();
    const endpoint = `/api-sync-status${query ? `?${query}` : ''}`;

    return this.request<SyncStatusResponse>(endpoint);
  }

  /**
   * Logout (clears local tokens)
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('lastSyncTimestamp');
  }
}

/**
 * Singleton instance
 */
let clientInstance: ExpenseAPIClient | null = null;

export function getAPIClient(config?: Partial<ClientConfig>): ExpenseAPIClient {
  if (!clientInstance) {
    const baseUrl =
      config?.baseUrl ||
      import.meta.env.VITE_SUPABASE_URL + '/functions/v1' ||
      'http://localhost:54321/functions/v1';

    clientInstance = new ExpenseAPIClient({
      baseUrl,
      ...config,
    });
  }

  return clientInstance;
}

/**
 * Reset singleton (useful for testing)
 */
export function resetAPIClient(): void {
  clientInstance = null;
}
