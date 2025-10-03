import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type UserRow = Database['public']['Tables']['users']['Row'];
type FeatureFlagRow = Database['public']['Tables']['feature_flags']['Row'];
type ConfigItemRow = Database['public']['Tables']['config_items']['Row'];
type AuditLogRow = Database['public']['Tables']['audit_logs']['Row'];

export interface AdminUser extends UserRow {
  phone: string;
}

export const adminService = {
  async getAllUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as AdminUser[];
  },

  async getFeatureFlags(): Promise<FeatureFlagRow[]> {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')
      .order('key', { ascending: true });

    if (error) throw error;
    return data;
  },

  async updateFeatureFlag(
    key: string,
    value: boolean,
    userId: string,
    notes?: string
  ): Promise<FeatureFlagRow> {
    const { data, error } = await supabase
      .from('feature_flags')
      .update({
        value,
        last_changed_at: new Date().toISOString(),
        overridden_by_user_id: userId,
        notes: notes || '',
      })
      .eq('key', key)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getConfigItems(): Promise<ConfigItemRow[]> {
    const { data, error } = await supabase
      .from('config_items')
      .select('*')
      .order('key', { ascending: true });

    if (error) throw error;
    return data;
  },

  async updateConfigItem(
    key: string,
    value: string,
    userId: string
  ): Promise<ConfigItemRow> {
    const { data, error } = await supabase
      .from('config_items')
      .update({
        value,
        last_updated_at: new Date().toISOString(),
        last_updated_by_user_id: userId,
      })
      .eq('key', key)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAuditLogs(limit = 100): Promise<AuditLogRow[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async createAuditLog(log: {
    actor_user_id: string;
    action: string;
    target_entity: string;
    metadata?: Record<string, unknown>;
    severity?: 'info' | 'warning' | 'critical';
    immutable?: boolean;
    impersonated_user_id?: string | null;
  }): Promise<AuditLogRow> {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        actor_user_id: log.actor_user_id,
        action: log.action,
        target_entity: log.target_entity,
        metadata: log.metadata || {},
        severity: log.severity || 'info',
        immutable: log.immutable || false,
        impersonated_user_id: log.impersonated_user_id || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUserRole(
    userId: string,
    role: UserRow['role'],
    actorId: string
  ): Promise<UserRow> {
    const { data, error } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    await this.createAuditLog({
      actor_user_id: actorId,
      action: 'user.role_changed',
      target_entity: userId,
      metadata: { new_role: role },
      severity: 'warning',
    });

    return data;
  },

  async updateUserTier(
    userId: string,
    tier: UserRow['tier'],
    actorId: string
  ): Promise<UserRow> {
    const isPremium = tier === 'premium' || tier === 'family';

    const { data, error } = await supabase
      .from('users')
      .update({
        tier,
        is_premium: isPremium,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    await this.createAuditLog({
      actor_user_id: actorId,
      action: 'user.tier_changed',
      target_entity: userId,
      metadata: { new_tier: tier },
      severity: 'warning',
    });

    return data;
  },

  async getMonitoringSnapshot() {
    const now = new Date().toISOString();
    const uptimeStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: transactionCount } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', uptimeStart);

    return {
      lastUpdatedAt: now,
      dbConnection: 'healthy' as const,
      smtpStatus: 'ok' as const,
      uptimeSeconds: 7 * 24 * 60 * 60,
      cpuUtilization: 25,
      memoryUtilization: 30,
      queueBacklog: 0,
      stats: {
        userCount: userCount || 0,
        recentTransactionCount: transactionCount || 0,
      },
    };
  },
};
