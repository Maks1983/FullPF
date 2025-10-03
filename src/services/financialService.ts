import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type AccountRow = Database['public']['Tables']['accounts']['Row'];
type TransactionRow = Database['public']['Tables']['transactions']['Row'];
type GoalRow = Database['public']['Tables']['goals']['Row'];
type BudgetRow = Database['public']['Tables']['budgets']['Row'];

export const financialService = {
  async getAccounts(userId: string): Promise<AccountRow[]> {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createAccount(account: Database['public']['Tables']['accounts']['Insert']): Promise<AccountRow> {
    const { data, error } = await supabase
      .from('accounts')
      .insert(account)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAccount(id: string, updates: Database['public']['Tables']['accounts']['Update']): Promise<AccountRow> {
    const { data, error } = await supabase
      .from('accounts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAccount(id: string): Promise<void> {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getTransactions(userId: string, accountId?: string): Promise<TransactionRow[]> {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    if (accountId) {
      query = query.eq('account_id', accountId);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createTransaction(transaction: Database['public']['Tables']['transactions']['Insert']): Promise<TransactionRow> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTransaction(id: string, updates: Database['public']['Tables']['transactions']['Update']): Promise<TransactionRow> {
    const { data, error } = await supabase
      .from('transactions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getGoals(userId: string): Promise<GoalRow[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createGoal(goal: Database['public']['Tables']['goals']['Insert']): Promise<GoalRow> {
    const { data, error } = await supabase
      .from('goals')
      .insert(goal)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateGoal(id: string, updates: Database['public']['Tables']['goals']['Update']): Promise<GoalRow> {
    const { data, error } = await supabase
      .from('goals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteGoal(id: string): Promise<void> {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getBudgets(userId: string): Promise<BudgetRow[]> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createBudget(budget: Database['public']['Tables']['budgets']['Insert']): Promise<BudgetRow> {
    const { data, error } = await supabase
      .from('budgets')
      .insert(budget)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBudget(id: string, updates: Database['public']['Tables']['budgets']['Update']): Promise<BudgetRow> {
    const { data, error } = await supabase
      .from('budgets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteBudget(id: string): Promise<void> {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
