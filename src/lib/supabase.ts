import { createClient } from '@supabase/supabase-js';
import { appConfig } from '../config/app.config';

export const supabase = createClient(
  appConfig.supabase.url,
  appConfig.supabase.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

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
