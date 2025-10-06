/**
 * License gating hook for feature access control
 */

import { useMemo } from "react";
import { useAuthContext } from "../context/AuthContext";
import type { LicenseTier, FeatureFlagKey } from "../context/AdminFoundation";

type LicenseFeatureKey =
  | "smartInsights"
  | "smartSuggestions"
  | "advancedAnalytics"
  | "premiumReports"
  | "bankIntegration";

type LicenseFeatureState = Record<LicenseFeatureKey, boolean>;

const tierOrder: LicenseTier[] = ["free", "advanced", "premium", "family"];

const compareTier = (tier: LicenseTier, required: LicenseTier): boolean =>
  tierOrder.indexOf(tier) >= tierOrder.indexOf(required);

const FEATURE_FLAG_MAP: Partial<Record<LicenseFeatureKey, FeatureFlagKey>> = {
  smartInsights: "reports_enabled",
  smartSuggestions: "strategy_simulator_enabled",
  advancedAnalytics: "strategy_simulator_enabled",
  premiumReports: "reports_enabled",
  bankIntegration: "bank_api_enabled",
};

const FEATURE_REQUIREMENTS: Record<LicenseFeatureKey, LicenseTier> = {
  smartInsights: "advanced",
  smartSuggestions: "advanced",
  advancedAnalytics: "premium",
  premiumReports: "premium",
  bankIntegration: "premium",
};

export const useLicenseGating = () => {
  const {
    effectiveSession,
    license,
    featureAvailability,
  } = useAuthContext();

  return useMemo(() => {
    const effectiveTier = effectiveSession?.tier ?? "free";
    const appliedTier =
      license.overrideActive && license.overrideTier
        ? license.overrideTier
        : license.tier;

    const features = Object.keys(FEATURE_REQUIREMENTS).reduce((acc, key) => {
      const featureKey = key as LicenseFeatureKey;
      const requiredTier = FEATURE_REQUIREMENTS[featureKey];
      const tierAllows = compareTier(effectiveTier, requiredTier) && compareTier(appliedTier, requiredTier);
      const flagKey = FEATURE_FLAG_MAP[featureKey];
      const flagAllows = flagKey ? featureAvailability(flagKey) : tierAllows;
      acc[featureKey] = Boolean(tierAllows && flagAllows);
      return acc;
    }, {} as LicenseFeatureState);

    const hasFeature = (feature: LicenseFeatureKey): boolean => features[feature];

    const getUpgradeMessage = (feature: LicenseFeatureKey): string => {
      if (features[feature]) {
        return "Unlocked for your current tier.";
      }
      const requiredTier = FEATURE_REQUIREMENTS[feature];
      return `Upgrade to the ${requiredTier === "advanced" ? "Advanced" : "Premium"} tier to unlock ${feature.replace(/([A-Z])/g, " $1").toLowerCase()}.`;
    };

    return {
      license,
      effectiveTier,
      appliedTier,
      features,
      hasFeature,
      getUpgradeMessage,
    };
  }, [effectiveSession?.tier, featureAvailability, license]);
};