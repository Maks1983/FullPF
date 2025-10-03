/**
 * Database Client Configuration
 * Connects to MariaDB via Express.js API
 */

interface DatabaseConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class DatabaseClient {
  private config: DatabaseConfig;
  private accessToken: string | null = null;

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage() {
    this.accessToken = localStorage.getItem('accessToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    if (this.config.apiKey) {
      headers['X-API-Key'] = this.config.apiKey;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth methods
  auth = {
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      const response = await this.request<{
        accessToken: string;
        refreshToken: string;
        user: any;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      this.accessToken = response.accessToken;
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      return { data: { user: response.user, session: response }, error: null };
    },

    signOut: async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        await this.request('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      } finally {
        this.accessToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      return { error: null };
    },

    getUser: async () => {
      if (!this.accessToken) {
        return { data: { user: null }, error: null };
      }

      try {
        const user = await this.request<any>('/user');
        return { data: { user }, error: null };
      } catch (error) {
        return { data: { user: null }, error };
      }
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Simplified auth state change - in a real implementation,
      // you might use WebSockets or polling
      const checkAuth = async () => {
        const { data } = await this.auth.getUser();
        callback(data.user ? 'SIGNED_IN' : 'SIGNED_OUT', data.user);
      };

      checkAuth();

      return {
        data: { subscription: { unsubscribe: () => {} } }
      };
    },

    updateUser: async (updates: { password?: string }) => {
      const response = await this.request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(updates),
      });
      return { data: response, error: null };
    },

    resetPasswordForEmail: async (email: string) => {
      await this.request('/auth/password-reset/request', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return { error: null };
    },
  };

  // Database query methods
  from = (table: string) => {
    return {
      select: (columns = '*') => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            const response = await this.request<any>(`/${table}?${column}=${value}&limit=1`);
            return { data: response[0] || null, error: null };
          },
          maybeSingle: async () => {
            const response = await this.request<any>(`/${table}?${column}=${value}&limit=1`);
            return { data: response[0] || null, error: null };
          },
        }),
        order: (column: string, options?: { ascending: boolean }) => ({
          limit: (count: number) => ({
            async then() {
              const response = await this.request<any[]>(`/${table}?order=${column}&limit=${count}`);
              return { data: response, error: null };
            }
          })
        }),
      }),
      insert: (data: any) => ({
        select: () => ({
          single: async () => {
            const response = await this.request<any>(`/${table}`, {
              method: 'POST',
              body: JSON.stringify(data),
            });
            return { data: response, error: null };
          },
        }),
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: async () => {
              const response = await this.request<any>(`/${table}/${value}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
              });
              return { data: response, error: null };
            },
          }),
        }),
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          async then() {
            await this.request(`/${table}/${value}`, { method: 'DELETE' });
            return { error: null };
          }
        })
      }),
    };
  };
}

export const database = new DatabaseClient({
  baseUrl: import.meta.env.VITE_DATABASE_URL || 'http://localhost:4000/api/v1',
  apiKey: import.meta.env.VITE_DATABASE_KEY,
});

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          display_name: string;
          phone: string;
          role: 'owner' | 'manager' | 'user' | 'family' | 'readonly';
          tier: 'free' | 'advanced' | 'premium' | 'family';
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'checking' | 'savings' | 'credit' | 'loan' | 'investment' | 'asset' | 'liability';
          balance: number;
          currency: string;
          institution: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['accounts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['accounts']['Insert']>;
      };
      transactions: {
        Row: {
          id: string;
          account_id: string;
          user_id: string;
          date: string;
          description: string;
          amount: number;
          category: string;
          type: 'income' | 'expense' | 'transfer';
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount: number;
          deadline: string | null;
          category: string;
          is_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['goals']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['goals']['Insert']>;
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          amount: number;
          period: 'monthly' | 'yearly';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['budgets']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['budgets']['Insert']>;
      };
      feature_flags: {
        Row: {
          key: string;
          description: string;
          value: boolean;
          overridable_by: string[];
          last_changed_at: string;
          overridden_by_user_id: string | null;
          notes: string;
        };
        Insert: Database['public']['Tables']['feature_flags']['Row'];
        Update: Partial<Database['public']['Tables']['feature_flags']['Row']>;
      };
      config_items: {
        Row: {
          key: string;
          value: string;
          encrypted: boolean;
          masked: boolean;
          description: string;
          requires_step_up: boolean;
          last_updated_at: string;
          last_updated_by_user_id: string | null;
        };
        Insert: Database['public']['Tables']['config_items']['Row'];
        Update: Partial<Database['public']['Tables']['config_items']['Row']>;
      };
      audit_logs: {
        Row: {
          id: number;
          actor_user_id: string;
          impersonated_user_id: string | null;
          action: string;
          target_entity: string;
          metadata: Record<string, unknown>;
          severity: 'info' | 'warning' | 'critical';
          immutable: boolean;
          timestamp: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'timestamp'>;
        Update: never;
      };
      bank_connections: {
        Row: {
          id: string;
          user_id: string;
          provider: 'demo' | 'teller' | 'plaid' | 'finicity' | 'basiq' | 'other';
          institution_id: string;
          institution_name: string;
          status: 'pending' | 'active' | 'error' | 'revoked';
          connection_label: string;
          failure_reason: string;
          last_synced_at: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bank_connections']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['bank_connections']['Insert']>;
      };
    };
  };
}