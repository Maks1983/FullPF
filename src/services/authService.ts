import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type UserRow = Database['public']['Tables']['users']['Row'];

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: UserRow['role'];
  tier: UserRow['tier'];
  isPremium: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  async signUp(data: SignUpData): Promise<AuthUser> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: data.email,
        username: data.username,
        display_name: data.displayName,
        phone: '',
        role: 'user',
        tier: 'free',
        is_premium: false,
      })
      .select()
      .single();

    if (userError) throw userError;

    return {
      id: userData.id,
      email: userData.email,
      username: userData.username,
      displayName: userData.display_name,
      role: userData.role,
      tier: userData.tier,
      isPremium: userData.is_premium,
    };
  },

  async signIn(data: SignInData): Promise<AuthUser> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to sign in');

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (userError) throw userError;
    if (!userData) throw new Error('User profile not found');

    return {
      id: userData.id,
      email: userData.email,
      username: userData.username,
      displayName: userData.display_name,
      role: userData.role,
      tier: userData.tier,
      isPremium: userData.is_premium,
    };
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;
    if (!userData) return null;

    return {
      id: userData.id,
      email: userData.email,
      username: userData.username,
      displayName: userData.display_name,
      role: userData.role,
      tier: userData.tier,
      isPremium: userData.is_premium,
    };
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (signInError) throw new Error('Current password is incorrect');

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) throw updateError;
  },

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  },
};
