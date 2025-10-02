import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  adminApi,
  authApi,
  initializeTokensFromStorage,
} from "../lib/apiClient";
import type { AdminBootstrapResponse } from "../lib/apiClient";

export type UserRole = "owner" | "manager" | "user" | "family" | "readonly";
export type LicenseTier = "free" | "advanced" | "premium" | "family";
export type StepUpAction =
  | "impersonation"
  | "config_update"
  | "restore"
  | "full_deletion"
  | "license_override"
  | "license_revocation"
  | "backup";

export interface SessionInfo {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: UserRole;
  tier: LicenseTier;
  isPremium: boolean;
}

export interface DirectoryUser extends SessionInfo {
  phone: string;
}

export interface ImpersonationState {
  target: SessionInfo;
  reason?: string;
  startedAt: string;
}

export type FeatureFlagKey =
  | "debt_optimizer_enabled"
  | "strategy_simulator_enabled"
  | "bank_api_enabled"
  | "family_features_enabled"
  | "reports_enabled";

export interface FeatureFlagRecord {
  key: FeatureFlagKey;
  description: string;
  value: boolean;
  overridableBy: UserRole[];
  lastChangedAt: string;
  overriddenByUserId?: string;
  notes?: string;
}

export interface AuditLogEntry {
  id: number | string;
  actorUserId: string;
  actorUsername: string;
  actorDisplayName: string;
  impersonatedUserId?: string | null;
  impersonatedUsername?: string | null;
  impersonatedDisplayName?: string | null;
  action: string;
  targetEntity: string;
  metadata: Record<string, unknown>;
  immutable: boolean;
  severity: "info" | "warning" | "critical";
  timestamp: string;
}

export interface ConfigItem {
  key: string;
  value: string;
  encrypted: boolean;
  masked: boolean;
  description: string;
  lastUpdatedAt: string | null;
  lastUpdatedByUserId: string | null;
  requiresStepUp: boolean;
}

export interface MonitoringSnapshot {
  lastUpdatedAt: string;
  dbConnection: "healthy" | "degraded" | "down";
  smtpStatus: "ok" | "warning" | "error";
  uptimeSeconds: number;
  cpuUtilization: number;
  memoryUtilization: number;
  queueBacklog: number;
}

export interface InfrastructureStatus {
  lastBackupAt: string | null;
  lastBackupMode: "manual" | "scheduled" | null;
  lastRestoreAt: string | null;
  lastRestoreDryRunAt: string | null;
  deletionScheduledFor: string | null;
}

export interface LicenseState {
  licenseId: string;
  tier: LicenseTier;
  status: "valid" | "expiring" | "expired";
  expiresAt: string;
  lastValidatedAt: string;
  overrideActive: boolean;
  overrideTier?: LicenseTier;
  features: Record<string, boolean>;
}

export interface StepUpState {
  lastVerifiedAt: string | null;
}

interface AuditLogInput {
  action: string;
  targetEntity: string;
  metadata?: Record<string, unknown>;
  severity?: "info" | "warning" | "critical";
  immutable?: boolean;
  actorOverride?: Pick<SessionInfo, "id" | "username" | "displayName">;
  impersonatedOverride?: Pick<
    SessionInfo,
    "id" | "username" | "displayName"
  > | null;
}

export type OperationResult = { success: boolean; message: string };

export type LoginOutcome =
  | { status: "success"; session: SessionInfo }
  | { status: "challenge"; challengeId: string }
  | { status: "error"; error: string };

export type TwoFactorOutcome =
  | { status: "success"; session: SessionInfo }
  | { status: "error"; error: string };

interface AdminFoundationContextValue {
  session: SessionInfo | null;
  effectiveSession: SessionInfo | null;
  impersonation: ImpersonationState | null;
  users: DirectoryUser[];
  hasPremiumAccess: boolean;
  login: (username: string, password: string) => Promise<LoginOutcome>;
  completeTwoFactor: (
    challengeId: string,
    code: string,
  ) => Promise<TwoFactorOutcome>;
  logout: () => Promise<void>;
  startImpersonation: (
    userId: string,
    reason?: string,
  ) => Promise<OperationResult>;
  stopImpersonation: () => Promise<void>;
  stepUpState: StepUpState;
  verifyStepUp: (action: StepUpAction, code: string) => Promise<boolean>;
  isStepUpValid: () => boolean;
  featureFlags: Record<FeatureFlagKey, FeatureFlagRecord>;
  updateFeatureFlag: (
    key: FeatureFlagKey,
    value: boolean,
    options?: { reason?: string },
  ) => Promise<OperationResult>;
  auditLogs: AuditLogEntry[];
  appendAuditLog: (entry: AuditLogInput) => Promise<void>;
  configItems: ConfigItem[];
  updateConfigItem: (
    key: string,
    value: string,
    options?: { note?: string },
  ) => Promise<OperationResult>;
  monitoring: MonitoringSnapshot;
  refreshMonitoring: () => Promise<OperationResult>;
  infrastructure: InfrastructureStatus;
  triggerBackup: (mode: "manual" | "scheduled") => Promise<OperationResult>;
  triggerRestore: (options: {
    dryRun: boolean;
    backupId: string;
    note?: string;
  }) => Promise<OperationResult>;
  scheduleDeletion: (options: {
    confirmationText: string;
    requestedAt: string;
  }) => Promise<OperationResult>;
  cancelDeletion: () => Promise<OperationResult>;
  license: LicenseState;
  overrideLicenseTier: (tier: LicenseTier | null) => Promise<OperationResult>;
  tierFeatures: Record<LicenseTier, string[]>;
  featureAvailability: (featureKey: FeatureFlagKey) => boolean;
  canAccessAdmin: boolean;
  canManageUsers: boolean;
  canModifyConfig: boolean;
  canRunCriticalOps: boolean;
  instanceName: string;
  instanceConfirmationToken: string;
  STEP_UP_CODE: string;
}

const STEP_UP_CODE = "246810";
const STEP_UP_VALID_WINDOW_MS = 5 * 60 * 1000;
const INSTANCE_NAME = "OwnCent Demo Instance";
const INSTANCE_CONFIRMATION_TOKEN = "owncent-demo";

const DEFAULT_FEATURE_FLAGS: Record<FeatureFlagKey, FeatureFlagRecord> = {
  debt_optimizer_enabled: {
    key: "debt_optimizer_enabled",
    description: "Enable the premium debt optimization module.",
    value: false,
    overridableBy: ["owner"],
    lastChangedAt: new Date(0).toISOString(),
  },
  strategy_simulator_enabled: {
    key: "strategy_simulator_enabled",
    description: "Enable what-if strategy simulator.",
    value: false,
    overridableBy: ["owner"],
    lastChangedAt: new Date(0).toISOString(),
  },
  bank_api_enabled: {
    key: "bank_api_enabled",
    description: "Allow direct bank data aggregation.",
    value: false,
    overridableBy: ["owner"],
    lastChangedAt: new Date(0).toISOString(),
  },
  family_features_enabled: {
    key: "family_features_enabled",
    description: "Unlock multi-user household planning features.",
    value: false,
    overridableBy: ["owner"],
    lastChangedAt: new Date(0).toISOString(),
  },
  reports_enabled: {
    key: "reports_enabled",
    description: "Enable premium reporting engine.",
    value: false,
    overridableBy: ["owner"],
    lastChangedAt: new Date(0).toISOString(),
  },
};

const DEFAULT_LICENSE: LicenseState = {
  licenseId: "",
  tier: "free",
  status: "expired",
  expiresAt: new Date(0).toISOString(),
  lastValidatedAt: new Date(0).toISOString(),
  overrideActive: false,
  overrideTier: undefined,
  features: {
    debt_optimizer: false,
    strategy_simulator: false,
    scenario_planning: false,
    detailed_reports: false,
    bank_api: false,
    family_accounts: false,
  },
};

const DEFAULT_MONITORING: MonitoringSnapshot = {
  lastUpdatedAt: new Date(0).toISOString(),
  dbConnection: "healthy",
  smtpStatus: "ok",
  uptimeSeconds: 0,
  cpuUtilization: 25,
  memoryUtilization: 30,
  queueBacklog: 0,
};

const DEFAULT_INFRASTRUCTURE: InfrastructureStatus = {
  lastBackupAt: null,
  lastBackupMode: null,
  lastRestoreAt: null,
  lastRestoreDryRunAt: null,
  deletionScheduledFor: null,
};

const TIER_FEATURES: Record<LicenseTier, string[]> = {
  free: ["view_checking", "view_savings", "debts"],
  advanced: [
    "view_checking",
    "view_savings",
    "debts",
    "net_worth",
    "investments",
    "assets_liabilities",
  ],
  premium: [
    "view_checking",
    "view_savings",
    "debts",
    "net_worth",
    "investments",
    "assets_liabilities",
    "debt_optimizer",
    "strategy_simulator",
    "scenario_planning",
    "reports",
    "bank_api",
  ],
  family: [
    "view_checking",
    "view_savings",
    "debts",
    "net_worth",
    "investments",
    "assets_liabilities",
    "debt_optimizer",
    "strategy_simulator",
    "scenario_planning",
    "reports",
    "bank_api",
    "family_accounts",
    "shared_goals",
  ],
};

const AdminFoundationContext = createContext<
  AdminFoundationContextValue | undefined
>(undefined);

const tierFromPremiumFlag = (tier: LicenseTier): boolean =>
  tier === "premium" || tier === "family";

const isStepUpTimestampValid = (timestamp: string | null): boolean => {
  if (!timestamp) {
    return false;
  }
  const verified = new Date(timestamp).getTime();
  if (!Number.isFinite(verified)) {
    return false;
  }
  return Date.now() - verified <= STEP_UP_VALID_WINDOW_MS;
};

const sortAuditLogs = (entries: AuditLogEntry[]): AuditLogEntry[] =>
  [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

const applyBootstrapState = (
  data: AdminBootstrapResponse,
  setters: {
    setUsers: (users: DirectoryUser[]) => void;
    setFeatureFlags: (flags: Record<FeatureFlagKey, FeatureFlagRecord>) => void;
    setLicense: (license: LicenseState) => void;
    setConfigItems: (items: ConfigItem[]) => void;
    setMonitoring: (snapshot: MonitoringSnapshot) => void;
    setInfrastructure: (status: InfrastructureStatus) => void;
    setAuditLogs: (logs: AuditLogEntry[]) => void;
  },
) => {
  setters.setUsers(data.users.map((user) => ({ ...user })));
  setters.setFeatureFlags(data.featureFlags);
  setters.setLicense(data.license);
  setters.setConfigItems(data.configItems);
  setters.setMonitoring(data.monitoring);
  setters.setInfrastructure(data.infrastructure);
  setters.setAuditLogs(sortAuditLogs(data.auditLogs));
};

const resetAdministrativeState = (setters: {
  setUsers: (users: DirectoryUser[]) => void;
  setFeatureFlags: (flags: Record<FeatureFlagKey, FeatureFlagRecord>) => void;
  setLicense: (license: LicenseState) => void;
  setConfigItems: (items: ConfigItem[]) => void;
  setMonitoring: (snapshot: MonitoringSnapshot) => void;
  setInfrastructure: (status: InfrastructureStatus) => void;
  setAuditLogs: (logs: AuditLogEntry[]) => void;
  setStepUpState: (state: StepUpState) => void;
}) => {
  setters.setUsers([]);
  setters.setFeatureFlags(DEFAULT_FEATURE_FLAGS);
  setters.setLicense(DEFAULT_LICENSE);
  setters.setConfigItems([]);
  setters.setMonitoring(DEFAULT_MONITORING);
  setters.setInfrastructure(DEFAULT_INFRASTRUCTURE);
  setters.setAuditLogs([]);
  setters.setStepUpState({ lastVerifiedAt: null });
};

export const AdminFoundationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const sessionRef = useRef<SessionInfo | null>(null);
  const [impersonation, setImpersonation] = useState<ImpersonationState | null>(
    null,
  );
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [featureFlags, setFeatureFlags] = useState<
    Record<FeatureFlagKey, FeatureFlagRecord>
  >(DEFAULT_FEATURE_FLAGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [configItems, setConfigItems] = useState<ConfigItem[]>([]);
  const [monitoring, setMonitoring] =
    useState<MonitoringSnapshot>(DEFAULT_MONITORING);
  const [infrastructure, setInfrastructure] = useState<InfrastructureStatus>(
    DEFAULT_INFRASTRUCTURE,
  );
  const [license, setLicense] = useState<LicenseState>(DEFAULT_LICENSE);
  const [stepUpState, setStepUpState] = useState<StepUpState>({
    lastVerifiedAt: null,
  });

  const loadSessionAndBootstrap =
    useCallback(async (): Promise<SessionInfo | null> => {
      try {
        const { user, impersonation: impersonationInfo } =
          await authApi.loadSession();
        setSession(user);
        sessionRef.current = user;
        setImpersonation(impersonationInfo);
        const bootstrap = await adminApi.bootstrap();
        applyBootstrapState(bootstrap, {
          setUsers,
          setFeatureFlags,
          setLicense,
          setConfigItems,
          setMonitoring,
          setInfrastructure,
          setAuditLogs,
        });
        setStepUpState({ lastVerifiedAt: null });
        return user;
      } catch (error) {
        setSession(null);
        sessionRef.current = null;
        setImpersonation(null);
        resetAdministrativeState({
          setUsers,
          setFeatureFlags,
          setLicense,
          setConfigItems,
          setMonitoring,
          setInfrastructure,
          setAuditLogs,
          setStepUpState,
        });
        return null;
      }
    }, []);

  useEffect(() => {
    initializeTokensFromStorage();
    void loadSessionAndBootstrap();
  }, [loadSessionAndBootstrap]);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const login = useCallback(
    async (username: string, password: string): Promise<LoginOutcome> => {
      try {
        const response = await authApi.login(username.trim(), password);
        if ("requiresTwoFactor" in response) {
          return { status: "challenge", challengeId: response.challengeId };
        }
        const user = await loadSessionAndBootstrap();
        if (user) {
          return { status: "success", session: user };
        }
        return { status: "error", error: "Unable to establish session." };
      } catch (error) {
        return {
          status: "error",
          error: error instanceof Error ? error.message : "Login failed",
        };
      }
    },
    [loadSessionAndBootstrap],
  );

  const completeTwoFactor = useCallback(
    async (challengeId: string, code: string): Promise<TwoFactorOutcome> => {
      try {
        await authApi.verifyTwoFactor(challengeId, code.trim());
        const user = await loadSessionAndBootstrap();
        if (user) {
          return { status: "success", session: user };
        }
        return {
          status: "error",
          error: "Two-factor succeeded, but session could not be loaded.",
        };
      } catch (error) {
        return {
          status: "error",
          error:
            error instanceof Error
              ? error.message
              : "Two-factor verification failed",
        };
      }
    },
    [loadSessionAndBootstrap],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setSession(null);
      sessionRef.current = null;
      setImpersonation(null);
      resetAdministrativeState({
        setUsers,
        setFeatureFlags,
        setLicense,
        setConfigItems,
        setMonitoring,
        setInfrastructure,
        setAuditLogs,
        setStepUpState,
      });
    }
  }, []);

  const verifyStepUp = useCallback(
    async (action: StepUpAction, code: string): Promise<boolean> => {
      try {
        const { success } = await authApi.stepUp(action, code.trim());
        if (success) {
          setStepUpState({ lastVerifiedAt: new Date().toISOString() });
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
  );

  const isStepUpValid = useCallback(
    () => isStepUpTimestampValid(stepUpState.lastVerifiedAt),
    [stepUpState.lastVerifiedAt],
  );

  const startImpersonation = useCallback(
    async (userId: string, reason?: string): Promise<OperationResult> => {
      const currentSession = sessionRef.current;
      if (!currentSession || currentSession.role !== "owner") {
        return {
          success: false,
          message: "Only the Owner can impersonate other users.",
        };
      }
      if (!isStepUpValid()) {
        return {
          success: false,
          message: "Step-up verification is required before impersonating.",
        };
      }
      try {
        await authApi.impersonate(userId, reason);
        const user = await loadSessionAndBootstrap();
        if (user) {
          return { success: true, message: "Impersonation active." };
        }
        return {
          success: false,
          message: "Failed to refresh session after impersonation.",
        };
      } catch (error) {
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to impersonate user.",
        };
      }
    },
    [isStepUpValid, loadSessionAndBootstrap],
  );

  const stopImpersonation = useCallback(async () => {
    try {
      await authApi.stopImpersonation();
    } finally {
      await loadSessionAndBootstrap();
    }
  }, [loadSessionAndBootstrap]);

  const updateFeatureFlag = useCallback(
    async (
      key: FeatureFlagKey,
      value: boolean,
      options?: { reason?: string },
    ): Promise<OperationResult> => {
      const currentSession = sessionRef.current;
      if (!currentSession) {
        return { success: false, message: "Not authenticated." };
      }
      const record = featureFlags[key];
      if (!record) {
        return { success: false, message: "Unknown feature flag." };
      }
      if (!record.overridableBy.includes(currentSession.role)) {
        return {
          success: false,
          message: "You do not have permission to modify this flag.",
        };
      }
      if (impersonation) {
        return {
          success: false,
          message: "Disable impersonation before modifying feature flags.",
        };
      }
      try {
        const updated = await adminApi.updateFeatureFlag(key, {
          value,
          notes: options?.reason,
        });
        setFeatureFlags((prev) => ({
          ...prev,
          [key]: updated,
        }));
        return { success: true, message: "Feature flag updated." };
      } catch (error) {
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to update feature flag.",
        };
      }
    },
    [featureFlags, impersonation],
  );

  const updateConfigItem = useCallback(
    async (
      key: string,
      value: string,
      options?: { note?: string },
    ): Promise<OperationResult> => {
      const currentSession = sessionRef.current;
      if (!currentSession || currentSession.role !== "owner") {
        return {
          success: false,
          message: "Only the Owner can update configuration.",
        };
      }
      if (impersonation) {
        return {
          success: false,
          message: "Disable impersonation before editing configuration.",
        };
      }
      const item = configItems.find((config) => config.key === key);
      if (!item) {
        return { success: false, message: "Configuration key not found." };
      }
      if (item.requiresStepUp && !isStepUpValid()) {
        return {
          success: false,
          message: "Step-up verification required to edit this secret.",
        };
      }
      try {
        const updated = await adminApi.updateConfig(key, {
          value,
          masked: item.masked,
        });
        setConfigItems((prev) =>
          prev.map((config) => (config.key === key ? updated : config)),
        );
        await adminApi
          .appendAudit({
            action: "config.updated",
            targetEntity: key,
            severity: "warning",
            metadata: { note: options?.note ?? null },
          })
          .catch(() => undefined);
        return { success: true, message: "Configuration updated." };
      } catch (error) {
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to update configuration.",
        };
      }
    },
    [configItems, impersonation, isStepUpValid],
  );

  const refreshMonitoring = useCallback(async (): Promise<OperationResult> => {
    try {
      const snapshot = await adminApi.refreshMonitoring();
      setMonitoring(snapshot);
      return { success: true, message: "Monitoring refreshed." };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to refresh monitoring.",
      };
    }
  }, []);

  const triggerBackup = useCallback(
    async (mode: "manual" | "scheduled"): Promise<OperationResult> => {
      const currentSession = sessionRef.current;
      if (!currentSession) {
        return { success: false, message: "Not authenticated." };
      }
      if (!["owner", "manager"].includes(currentSession.role)) {
        return {
          success: false,
          message: "Only Owners or Managers can initiate backups.",
        };
      }
      if (impersonation) {
        return {
          success: false,
          message: "Disable impersonation before running backups.",
        };
      }
      try {
        const status = await adminApi.triggerBackup(mode);
        setInfrastructure(status);
        return { success: true, message: "Backup request recorded." };
      } catch (error) {
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to trigger backup.",
        };
      }
    },
    [impersonation],
  );

  const triggerRestore = useCallback(
    async (options: {
      dryRun: boolean;
      backupId: string;
      note?: string;
    }): Promise<OperationResult> => {
      const currentSession = sessionRef.current;
      if (!currentSession || currentSession.role !== "owner") {
        return {
          success: false,
          message: "Only the Owner can trigger restore operations.",
        };
      }
      if (!isStepUpValid()) {
        return {
          success: false,
          message: "Step-up verification required before restoring.",
        };
      }
      if (impersonation) {
        return {
          success: false,
          message: "Disable impersonation before restoring data.",
        };
      }
      if (!options.backupId.trim()) {
        return {
          success: false,
          message: "Backup identifier is required.",
        };
      }
      try {
        const status = await adminApi.triggerRestore({
          dryRun: options.dryRun,
        });
        setInfrastructure(status);
        return { success: true, message: "Restore request recorded." };
      } catch (error) {
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to trigger restore.",
        };
      }
    },
    [impersonation, isStepUpValid],
  );

  const scheduleDeletion = useCallback(
    async (options: {
      confirmationText: string;
      requestedAt: string;
    }): Promise<OperationResult> => {
      const currentSession = sessionRef.current;
      if (!currentSession || currentSession.role !== "owner") {
        return {
          success: false,
          message: "Only the Owner can schedule deletion.",
        };
      }
      if (!isStepUpValid()) {
        return {
          success: false,
          message: "Step-up verification required before scheduling deletion.",
        };
      }
      if (options.confirmationText.trim() !== INSTANCE_CONFIRMATION_TOKEN) {
        return {
          success: false,
          message: "Confirmation token does not match the instance identifier.",
        };
      }
      try {
        const status = await adminApi.scheduleDeletion({
          confirmationToken: options.confirmationText.trim(),
          scheduledFor: options.requestedAt,
        });
        setInfrastructure(status);
        return { success: true, message: "Deletion scheduled." };
      } catch (error) {
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to schedule deletion.",
        };
      }
    },
    [isStepUpValid],
  );

  const cancelDeletion = useCallback(async (): Promise<OperationResult> => {
    try {
      const status = await adminApi.cancelDeletion();
      setInfrastructure(status);
      return { success: true, message: "Deletion cancelled." };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to cancel deletion.",
      };
    }
  }, []);

  const overrideLicenseTier = useCallback(
    async (tier: LicenseTier | null): Promise<OperationResult> => {
      const currentSession = sessionRef.current;
      if (!currentSession || currentSession.role !== "owner") {
        return {
          success: false,
          message: "Only the Owner can override license tier.",
        };
      }
      if (!isStepUpValid()) {
        return {
          success: false,
          message:
            "Step-up verification required before overriding the license.",
        };
      }
      try {
        const updated = await adminApi.updateLicenseOverride({
          overrideActive: tier !== null,
          overrideTier: tier ?? undefined,
        });
        setLicense(updated);
        return { success: true, message: "License override updated." };
      } catch (error) {
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to override license tier.",
        };
      }
    },
    [isStepUpValid],
  );

  const appendAuditLog = useCallback(
    async (entry: AuditLogInput): Promise<void> => {
      try {
        const created = await adminApi.appendAudit({
          action: entry.action,
          targetEntity: entry.targetEntity,
          severity: entry.severity,
          metadata: entry.metadata,
          immutable: entry.immutable,
        });
        setAuditLogs((previous) => sortAuditLogs([created, ...previous]));
      } catch (error) {
        // swallow on failure in demo mode
      }
    },
  );

  const featureAvailability = useCallback(
    (featureKey: FeatureFlagKey): boolean => {
      const record = featureFlags[featureKey];
      if (!record || !record.value) {
        return false;
      }
      const effective = impersonation?.target ?? sessionRef.current;
      const effectiveTier = effective?.tier ?? license.tier;
      const appliedLicenseTier =
        license.overrideActive && license.overrideTier
          ? license.overrideTier
          : license.tier;
      const ownerOverrideActive = license.overrideActive;

      if (ownerOverrideActive) {
        return true;
      }

      if (featureKey === "family_features_enabled") {
        return (
          effectiveTier === "family" &&
          license.features.family_accounts !== false
        );
      }
      if (featureKey === "reports_enabled") {
        return (
          effectiveTier !== "free" &&
          license.features.detailed_reports !== false
        );
      }
      if (
        featureKey === "debt_optimizer_enabled" ||
        featureKey === "strategy_simulator_enabled" ||
        featureKey === "bank_api_enabled"
      ) {
        return (
          tierFromPremiumFlag(effectiveTier) &&
          tierFromPremiumFlag(appliedLicenseTier)
        );
      }
      return false;
    },
    [featureFlags, impersonation, license],
  );

  const effectiveSession = impersonation?.target ?? session;
  const hasPremiumAccess = Boolean(
    effectiveSession && tierFromPremiumFlag(effectiveSession.tier),
  );
  const canAccessAdmin = Boolean(
    session && ["owner", "manager"].includes(session.role),
  );
  const canManageUsers = Boolean(
    session && ["owner", "manager"].includes(session.role) && !impersonation,
  );
  const canModifyConfig = Boolean(session?.role === "owner" && !impersonation);
  const canRunCriticalOps = Boolean(
    session?.role === "owner" && !impersonation,
  );

  const value = useMemo<AdminFoundationContextValue>(
    () => ({
      session,
      effectiveSession,
      impersonation,
      users,
      hasPremiumAccess,
      login,
      completeTwoFactor,
      logout,
      startImpersonation,
      stopImpersonation,
      stepUpState,
      verifyStepUp,
      isStepUpValid,
      featureFlags,
      updateFeatureFlag,
      auditLogs,
      appendAuditLog,
      configItems,
      updateConfigItem,
      monitoring,
      refreshMonitoring,
      infrastructure,
      triggerBackup,
      triggerRestore,
      scheduleDeletion,
      cancelDeletion,
      license,
      overrideLicenseTier,
      tierFeatures: TIER_FEATURES,
      featureAvailability,
      canAccessAdmin,
      canManageUsers,
      canModifyConfig,
      canRunCriticalOps,
      instanceName: INSTANCE_NAME,
      instanceConfirmationToken: INSTANCE_CONFIRMATION_TOKEN,
      STEP_UP_CODE,
    }),
    [
      appendAuditLog,
      auditLogs,
      canAccessAdmin,
      canManageUsers,
      canModifyConfig,
      canRunCriticalOps,
      configItems,
      featureAvailability,
      featureFlags,
      hasPremiumAccess,
      impersonation,
      infrastructure,
      license,
      login,
      completeTwoFactor,
      logout,
      monitoring,
      overrideLicenseTier,
      refreshMonitoring,
      scheduleDeletion,
      session,
      startImpersonation,
      stepUpState,
      stopImpersonation,
      triggerBackup,
      triggerRestore,
      updateConfigItem,
      updateFeatureFlag,
      verifyStepUp,
      isStepUpValid,
      users,
      effectiveSession,
      cancelDeletion,
    ],
  );

  return (
    <AdminFoundationContext.Provider value={value}>
      {children}
    </AdminFoundationContext.Provider>
  );
};

export const useAdminFoundation = (): AdminFoundationContextValue => {
  const context = useContext(AdminFoundationContext);
  if (!context) {
    throw new Error(
      "useAdminFoundation must be used within AdminFoundationProvider",
    );
  }
  return context;
};
