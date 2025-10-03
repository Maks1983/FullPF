import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import type { AuthUser } from '../services/authService';
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

const mapAuthUserToSession = (user: AuthUser): SessionInfo => ({
  id: user.id,
  username: user.username,
  displayName: user.displayName,
  email: user.email,
  role: user.role,
  tier: user.tier,
  isPremium: user.isPremium,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [impersonation, setImpersonation] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setSession(mapAuthUserToSession(user));
        }
      } catch (error) {
        console.log('No valid session found');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      if (user) {
        setSession(mapAuthUserToSession(user));
      } else {
        setSession(null);
        setImpersonation(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<LoginOutcome> => {
    try {
      const user = await authService.signIn({ email: email.trim(), password });
      const sessionInfo = mapAuthUserToSession(user);
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
      await authService.signOut();
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