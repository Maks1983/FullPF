import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, setTokens, clearTokens, initializeTokensFromStorage } from '../lib/apiClient';
import type { SessionInfo, FeatureFlagKey } from './AdminFoundation';

export interface AuthContextType {
  session: SessionInfo | null;
  effectiveSession: SessionInfo | null;
  impersonation: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<LoginOutcome>;
  completeTwoFactor: (challengeId: string, code: string) => Promise<TwoFactorOutcome>;
  logout: () => Promise<void>;
  featureAvailability: (featureKey: FeatureFlagKey) => boolean;
}

export type LoginOutcome =
  | { status: 'success'; session: SessionInfo }
  | { status: 'challenge'; challengeId: string }
  | { status: 'error'; error: string };

export type TwoFactorOutcome =
  | { status: 'success'; session: SessionInfo }
  | { status: 'error'; error: string };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [impersonation, setImpersonation] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        initializeTokensFromStorage();
        const { user, impersonation: impersonationInfo } = await authApi.loadSession();
        setSession(user);
        setImpersonation(impersonationInfo);
      } catch (error) {
        console.log('No valid session found');
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<LoginOutcome> => {
    try {
      const response = await authApi.login(username.trim(), password);
      
      if ('requiresTwoFactor' in response) {
        return { status: 'challenge', challengeId: response.challengeId };
      }
      
      // Load session after successful login
      const { user, impersonation: impersonationInfo } = await authApi.loadSession();
      setSession(user);
      setImpersonation(impersonationInfo);
      
      return { status: 'success', session: user };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  };

  const completeTwoFactor = async (challengeId: string, code: string): Promise<TwoFactorOutcome> => {
    try {
      await authApi.verifyTwoFactor(challengeId, code.trim());
      
      // Load session after successful 2FA
      const { user, impersonation: impersonationInfo } = await authApi.loadSession();
      setSession(user);
      setImpersonation(impersonationInfo);
      
      return { status: 'success', session: user };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Two-factor verification failed'
      };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setSession(null);
      setImpersonation(null);
      clearTokens();
    }
  };

  // Basic feature availability based on user tier
  const featureAvailability = (featureKey: FeatureFlagKey): boolean => {
    if (!session) return false;
    
    // Basic tier-based feature gating
    const tierFeatures: Record<string, FeatureFlagKey[]> = {
      free: [],
      advanced: ['family_features_enabled', 'reports_enabled'],
      premium: ['debt_optimizer_enabled', 'strategy_simulator_enabled', 'bank_api_enabled', 'family_features_enabled', 'reports_enabled'],
      family: ['debt_optimizer_enabled', 'strategy_simulator_enabled', 'bank_api_enabled', 'family_features_enabled', 'reports_enabled']
    };

    const userFeatures = tierFeatures[session.tier] || [];
    return userFeatures.includes(featureKey);
  };

  const effectiveSession = impersonation?.target ?? session;
  const isAuthenticated = Boolean(session);

  const value: AuthContextType = {
    session,
    effectiveSession,
    impersonation,
    isAuthenticated,
    isLoading,
    login,
    completeTwoFactor,
    logout,
    featureAvailability
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};