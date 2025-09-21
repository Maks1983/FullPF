/**
 * License gating hook for feature access control
 */

import { useMemo } from 'react';

// Mock license data - in production this would come from your license table
interface LicenseFeatures {
  smartInsights: boolean;
  smartSuggestions: boolean;
  advancedAnalytics: boolean;
  premiumReports: boolean;
  bankIntegration: boolean;
}

interface LicenseInfo {
  isValid: boolean;
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  features: LicenseFeatures;
  expiresAt: string;
}

// Mock license - in production this would be fetched from your license table
const mockLicense: LicenseInfo = {
  isValid: true,
  tier: 'premium', // Change this to test different tiers
  features: {
    smartInsights: true,
    smartSuggestions: true,
    advancedAnalytics: true,
    premiumReports: true,
    bankIntegration: true,
  },
  expiresAt: '2024-12-31',
};

export const useLicenseGating = () => {
  return useMemo(() => {
    // In production, this would check your local license table
    const license = mockLicense;
    
    const hasFeature = (feature: keyof LicenseFeatures): boolean => {
      if (!license.isValid) return false;
      return license.features[feature];
    };

    const getUpgradeMessage = (feature: string): string => {
      switch (license.tier) {
        case 'free':
          return `Upgrade to Basic or higher to unlock ${feature}`;
        case 'basic':
          return `Upgrade to Premium to unlock ${feature}`;
        default:
          return `This feature requires a valid license`;
      }
    };

    return {
      license,
      hasFeature,
      getUpgradeMessage,
      // Specific feature checks
      canUseSmartInsights: hasFeature('smartInsights'),
      canUseSmartSuggestions: hasFeature('smartSuggestions'),
      canUseAdvancedAnalytics: hasFeature('advancedAnalytics'),
      canUsePremiumReports: hasFeature('premiumReports'),
      canUseBankIntegration: hasFeature('bankIntegration'),
    };
  }, []);
};