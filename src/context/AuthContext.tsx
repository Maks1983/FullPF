import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, initializeTokensFromStorage } from '../lib/apiClient';
import type { FeatureFlagKey } from './AdminFoundation';

export interface SessionInfo {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: 'owner' | 'manager' | 'user' | 'family' | 'readonly';
  tier: 'free' | 'advanced' | 'premium' | 'family';
  isPremium: boolean;
}

export interface AuthContextType {
  session: SessionInfo | null;
  effectiveSession: SessionInfo | null;
  impersonation: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginOutcome>;
  logout: () => Promise<void>;
  featureAvailability: (featureKey: FeatureFlagKey) => boolean;
}

export type LoginOutcome =
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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize tokens from storage
        initializeTokensFromStorage();

        // Try to load session from API
        const data = await authApi.loadSession();
        if (data && data.user) {
          setSession({
            id: data.user.id,
            username: data.user.username || data.user.email,
            displayName: data.user.displayName || data.user.email,
            email: data.user.email,
            role: data.user.role,
            tier: data.user.tier,
            isPremium: data.user.isPremium || data.user.tier !== 'free',
          });
          if (data.impersonation) {
            setImpersonation(data.impersonation);
          }
        }
      } catch (error) {
        console.log('No valid session found');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<LoginOutcome> => {
    try {
      const result = await authApi.login(email.trim(), password);

      // Handle two-factor authentication
      if ('requiresTwoFactor' in result) {
        return {
          status: 'error',
          error: 'Two-factor authentication not yet implemented'
        };
      }

      // Fetch user profile
      const userData = await authApi.loadSession();
      if (!userData || !userData.user) {
        throw new Error('Failed to load user session');
      }

      const sessionInfo: SessionInfo = {
        id: userData.user.id,
        username: userData.user.username || userData.user.email,
        displayName: userData.user.displayName || userData.user.email,
        email: userData.user.email,
        role: userData.user.role,
        tier: userData.user.tier,
        isPremium: userData.user.isPremium || userData.user.tier !== 'free',
      };

      setSession(sessionInfo);

      return { status: 'success', session: sessionInfo };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setSession(null);
      setImpersonation(null);
    }
  };

  const featureAvailability = (featureKey: FeatureFlagKey): boolean => {
    if (!session) return false;

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