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
  id: number;
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
  impersonatedOverride?: Pick<SessionInfo, "id" | "username" | "displayName"> | null;
}

type LoginResult =
  | { success: true; session: SessionInfo }
  | { success: false; error: string };

export type OperationResult = { success: boolean; message: string };

interface AdminFoundationContextValue {
  session: SessionInfo | null;
  effectiveSession: SessionInfo | null;
  impersonation: ImpersonationState | null;
  users: DirectoryUser[];
  hasPremiumAccess: boolean;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  startImpersonation: (userId: string, reason?: string) => OperationResult;
  stopImpersonation: () => void;
  stepUpState: StepUpState;
  verifyStepUp: (code: string) => boolean;
  isStepUpValid: () => boolean;
  featureFlags: Record<FeatureFlagKey, FeatureFlagRecord>;
  updateFeatureFlag: (
    key: FeatureFlagKey,
    value: boolean,
    options?: { reason?: string }
  ) => OperationResult;
  auditLogs: AuditLogEntry[];
  appendAuditLog: (entry: AuditLogInput) => void;
  configItems: ConfigItem[];
  updateConfigItem: (
    key: string,
    value: string,
    options?: { note?: string }
  ) => OperationResult;
  monitoring: MonitoringSnapshot;
  refreshMonitoring: () => void;
  infrastructure: InfrastructureStatus;
  triggerBackup: (mode: "manual" | "scheduled") => OperationResult;
  triggerRestore: (
    options: { dryRun: boolean; backupId: string; note?: string }
  ) => OperationResult;
  scheduleDeletion: (
    options: { confirmationText: string; requestedAt: string }
  ) => OperationResult;
  cancelDeletion: () => void;
  license: LicenseState;
  overrideLicenseTier: (tier: LicenseTier | null) => OperationResult;
  tierFeatures: Record<LicenseTier, string[]>;
  featureAvailability: (featureKey: FeatureFlagKey) => boolean;
  canAccessAdmin: boolean;
  canManageUsers: boolean;
  canModifyConfig: boolean;
  canRunCriticalOps: boolean;
  instanceName: string;
  instanceConfirmationToken: string;
  STEP_UP_CODE: string;
}const AUTH_STORAGE_KEY = "owncent-auth-session";
const STEP_UP_CODE = "246810";
const STEP_UP_VALID_WINDOW_MS = 5 * 60 * 1000;
const INSTANCE_NAME = "OwnCent Demo Instance";
const INSTANCE_CONFIRMATION_TOKEN = "owncent-demo";

interface DemoUser extends DirectoryUser {
  password: string;
}

const stripToSession = (user: DirectoryUser | DemoUser): SessionInfo => ({
  id: user.id,
  username: user.username,
  displayName: user.displayName,
  email: user.email,
  role: user.role,
  tier: user.tier,
  isPremium: user.isPremium,
});

const toDirectoryUser = (user: DemoUser): DirectoryUser => ({
  ...stripToSession(user),
  phone: user.phone,
});

const tierFromPremiumFlag = (tier: LicenseTier): boolean =>
  tier === "premium" || tier === "family";

const FEATURE_LICENSE_MAP: Record<FeatureFlagKey, keyof LicenseState["features"] | null> = {
  debt_optimizer_enabled: "debt_optimizer",
  strategy_simulator_enabled: "strategy_simulator",
  bank_api_enabled: "bank_api",
  family_features_enabled: "family_accounts",
  reports_enabled: "detailed_reports",
};

const DEMO_USERS: DemoUser[] = [
  {
    id: "user-owner",
    username: "admin",
    password: "admin",
    displayName: "Avery Li",
    email: "avery.li@owncent.demo",
    role: "owner",
    tier: "premium",
    isPremium: true,
    phone: "+1-555-0100",
  },
  {
    id: "user-manager",
    username: "manager",
    password: "manager",
    displayName: "Jordan Smith",
    email: "jordan.smith@owncent.demo",
    role: "manager",
    tier: "advanced",
    isPremium: false,
    phone: "+1-555-0101",
  },
  {
    id: "user-demo",
    username: "demo",
    password: "demo",
    displayName: "Demo User",
    email: "demo.user@owncent.demo",
    role: "user",
    tier: "advanced",
    isPremium: false,
    phone: "+1-555-0102",
  },
  {
    id: "user-premium",
    username: "premium",
    password: "premium",
    displayName: "Priya Malhotra",
    email: "priya.malhotra@owncent.demo",
    role: "user",
    tier: "premium",
    isPremium: true,
    phone: "+1-555-0103",
  },
  {
    id: "user-family",
    username: "family",
    password: "family",
    displayName: "The Oakwoods",
    email: "family.team@owncent.demo",
    role: "family",
    tier: "family",
    isPremium: true,
    phone: "+1-555-0104",
  },
  {
    id: "user-readonly",
    username: "readonly",
    password: "readonly",
    displayName: "View Only",
    email: "readonly.viewer@owncent.demo",
    role: "readonly",
    tier: "free",
    isPremium: false,
    phone: "+1-555-0105",
  },
];

const DIRECTORY_USERS: DirectoryUser[] = DEMO_USERS.map(toDirectoryUser);

const INITIAL_FEATURE_FLAGS: Record<FeatureFlagKey, FeatureFlagRecord> = {
  debt_optimizer_enabled: {
    key: "debt_optimizer_enabled",
    description: "Enable the premium debt optimization module.",
    value: false,
    overridableBy: ["owner"],
    lastChangedAt: "2025-09-01T10:00:00.000Z",
    notes: "Awaiting production-ready optimization dataset.",
  },
  strategy_simulator_enabled: {
    key: "strategy_simulator_enabled",
    description: "Enable what-if strategy simulator.",
    value: false,
    overridableBy: ["owner"],
    lastChangedAt: "2025-09-01T10:15:00.000Z",
    notes: "Hidden until premium rollout.",
  },
  bank_api_enabled: {
    key: "bank_api_enabled",
    description: "Allow direct bank data aggregation via partner API.",
    value: false,
    overridableBy: ["owner"],
    lastChangedAt: "2025-09-05T08:20:00.000Z",
  },
  family_features_enabled: {
    key: "family_features_enabled",
    description: "Unlock multi-user household planning features.",
    value: true,
    overridableBy: ["owner"],
    lastChangedAt: "2025-09-10T13:40:00.000Z",
  },
  reports_enabled: {
    key: "reports_enabled",
    description: "Enable advanced reporting dashboards.",
    value: true,
    overridableBy: ["owner", "manager"],
    lastChangedAt: "2025-09-12T18:00:00.000Z",
  },
};

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 1,
    actorUserId: "user-owner",
    actorUsername: "admin",
    actorDisplayName: "Avery Li",
    impersonatedUserId: null,
    impersonatedUsername: null,
    impersonatedDisplayName: null,
    action: "system.bootstrap",
    targetEntity: "instance",
    metadata: { message: "Demo environment initialized" },
    immutable: true,
    severity: "info",
    timestamp: "2025-09-01T08:00:00.000Z",
  },
  {
    id: 2,
    actorUserId: "user-owner",
    actorUsername: "admin",
    actorDisplayName: "Avery Li",
    impersonatedUserId: null,
    impersonatedUsername: null,
    impersonatedDisplayName: null,
    action: "license.validated",
    targetEntity: "license",
    metadata: { tier: "premium", status: "valid" },
    immutable: false,
    severity: "info",
    timestamp: "2025-09-12T09:32:00.000Z",
  },
  {
    id: 3,
    actorUserId: "user-manager",
    actorUsername: "manager",
    actorDisplayName: "Jordan Smith",
    impersonatedUserId: null,
    impersonatedUsername: null,
    impersonatedDisplayName: null,
    action: "user.invite",
    targetEntity: "user-premium",
    metadata: { role: "user", tier: "premium" },
    immutable: false,
    severity: "info",
    timestamp: "2025-09-15T14:10:00.000Z",
  },
];

const INITIAL_CONFIG: ConfigItem[] = [
  {
    key: "db.connection_string",
    value: "mariadb://demo:demo@localhost:3306/owncent",
    encrypted: true,
    masked: true,
    description: "Primary MariaDB connection string",
    lastUpdatedAt: null,
    lastUpdatedByUserId: null,
    requiresStepUp: true,
  },
  {
    key: "smtp.api_key",
    value: "sk-demo-000000000000",
    encrypted: true,
    masked: true,
    description: "SMTP provider API key",
    lastUpdatedAt: "2025-09-10T11:24:00.000Z",
    lastUpdatedByUserId: "user-owner",
    requiresStepUp: true,
  },
  {
    key: "license.webhook_url",
    value: "https://api.owncent.demo/license/webhook",
    encrypted: false,
    masked: false,
    description: "Callback endpoint for remote license validation",
    lastUpdatedAt: null,
    lastUpdatedByUserId: null,
    requiresStepUp: false,
  },
];

const INITIAL_MONITORING: MonitoringSnapshot = {
  lastUpdatedAt: "2025-09-27T09:00:00.000Z",
  dbConnection: "healthy",
  smtpStatus: "warning",
  uptimeSeconds: 86400 * 12,
  cpuUtilization: 34,
  memoryUtilization: 62,
  queueBacklog: 1,
};

const INITIAL_INFRASTRUCTURE: InfrastructureStatus = {
  lastBackupAt: "2025-09-25T02:15:00.000Z",
  lastBackupMode: "scheduled",
  lastRestoreAt: null,
  lastRestoreDryRunAt: "2025-09-26T18:45:00.000Z",
  deletionScheduledFor: null,
};

const INITIAL_LICENSE: LicenseState = {
  licenseId: "LIC-OWN-DEMO-001",
  tier: "premium",
  status: "valid",
  expiresAt: "2026-02-01T00:00:00.000Z",
  lastValidatedAt: "2025-09-27T08:30:00.000Z",
  overrideActive: false,
  overrideTier: undefined,
  features: {
    debt_optimizer: true,
    strategy_simulator: true,
    scenario_planning: true,
    detailed_reports: true,
    bank_api: false,
    family_accounts: true,
  },
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

const SYSTEM_ACTOR: Pick<SessionInfo, "id" | "username" | "displayName"> = {
  id: "system",
  username: "system",
  displayName: "System",
};
const AdminFoundationContext = createContext<AdminFoundationContextValue | undefined>(
  undefined,
);

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

export const AdminFoundationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [impersonation, setImpersonation] = useState<ImpersonationState | null>(
    null,
  );
  const [featureFlags, setFeatureFlags] =
    useState<Record<FeatureFlagKey, FeatureFlagRecord>>(INITIAL_FEATURE_FLAGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [configItems, setConfigItems] = useState<ConfigItem[]>(INITIAL_CONFIG);
  const [monitoring, setMonitoring] =
    useState<MonitoringSnapshot>(INITIAL_MONITORING);
  const [infrastructure, setInfrastructure] = useState<InfrastructureStatus>(
    INITIAL_INFRASTRUCTURE,
  );
  const [license, setLicense] = useState<LicenseState>(INITIAL_LICENSE);
  const [stepUpState, setStepUpState] = useState<StepUpState>({
    lastVerifiedAt: null,
  });
  const auditIdRef = useRef<number>(INITIAL_AUDIT_LOGS.length + 1);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as Partial<SessionInfo> | null;
      if (!parsed || !parsed.id) {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }
      const found = DEMO_USERS.find((user) => user.id === parsed.id);
      if (!found) {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }
      setSession(stripToSession(found));
    } catch (error) {
      console.error("Failed to restore session", error);
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (session) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [session]);  const appendAuditLog = useCallback(
    (entry: AuditLogInput) => {
      const actor = entry.actorOverride ?? session ?? SYSTEM_ACTOR;
      const impersonated =
        entry.impersonatedOverride ?? impersonation?.target ?? null;
      const id = auditIdRef.current;
      auditIdRef.current += 1;

      const nextEntry: AuditLogEntry = {
        id,
        actorUserId: actor.id,
        actorUsername: actor.username,
        actorDisplayName: actor.displayName,
        impersonatedUserId: impersonated?.id ?? null,
        impersonatedUsername: impersonated?.username ?? null,
        impersonatedDisplayName: impersonated?.displayName ?? null,
        action: entry.action,
        targetEntity: entry.targetEntity,
        metadata: entry.metadata ?? {},
        immutable: entry.immutable ?? false,
        severity: entry.severity ?? "info",
        timestamp: new Date().toISOString(),
      };

      setAuditLogs((previous) => [...previous, nextEntry]);
    },
    [impersonation?.target, session],
  );

  const isStepUpValid = useCallback(() => {
    return isStepUpTimestampValid(stepUpState.lastVerifiedAt);
  }, [stepUpState.lastVerifiedAt]);

  const verifyStepUp = useCallback(
    (code: string) => {
      if (!session) {
        return false;
      }
      const sanitized = code.trim();
      const success = sanitized === STEP_UP_CODE;
      appendAuditLog({
        action: success ? "auth.step_up_verified" : "auth.step_up_failed",
        targetEntity: "step-up",
        metadata: { outcome: success ? "success" : "failed" },
        severity: success ? "info" : "warning",
      });
      if (!success) {
        return false;
      }
      setStepUpState({ lastVerifiedAt: new Date().toISOString() });
      return true;
    },
    [appendAuditLog, session],
  );

  const login = useCallback(
    async (username: string, password: string) => {
      const normalizedUsername = username.trim().toLowerCase();
      const normalizedPassword = password.trim();
      const match = DEMO_USERS.find(
        (user) =>
          user.username === normalizedUsername &&
          user.password === normalizedPassword,
      );

      if (!match) {
        return { success: false, error: "Invalid username or password" } as const;
      }

      const nextSession = stripToSession(match);
      setSession(nextSession);
      setImpersonation(null);
      setStepUpState({ lastVerifiedAt: null });
      appendAuditLog({
        action: "auth.login",
        targetEntity: nextSession.id,
        metadata: { role: nextSession.role, tier: nextSession.tier },
        actorOverride: nextSession,
      });

      return { success: true, session: nextSession } as const;
    },
    [appendAuditLog],
  );

  const logout = useCallback(() => {
    if (session) {
      appendAuditLog({
        action: "auth.logout",
        targetEntity: session.id,
      });
    }
    setSession(null);
    setImpersonation(null);
    setStepUpState({ lastVerifiedAt: null });
  }, [appendAuditLog, session]);

  const startImpersonation = useCallback(
    (userId: string, reason?: string) => {
      if (!session || session.role !== "owner") {
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
      const target = DIRECTORY_USERS.find((user) => user.id === userId);
      if (!target) {
        return { success: false, message: "Target user not found." };
      }
      if (target.id === session.id) {
        return {
          success: false,
          message: "You cannot impersonate your own account.",
        };
      }

      const nextImpersonation: ImpersonationState = {
        target: stripToSession(target),
        reason,
        startedAt: new Date().toISOString(),
      };

      setImpersonation(nextImpersonation);
      appendAuditLog({
        action: "auth.impersonation_started",
        targetEntity: userId,
        metadata: { reason: reason ?? "support" },
        severity: "warning",
        impersonatedOverride: nextImpersonation.target,
      });

      return { success: true, message: "Impersonation active." };
    },
    [appendAuditLog, isStepUpValid, session],
  );

  const stopImpersonation = useCallback(() => {
    if (!impersonation) {
      return;
    }
    appendAuditLog({
      action: "auth.impersonation_stopped",
      targetEntity: impersonation.target.id,
      severity: "info",
      impersonatedOverride: impersonation.target,
    });
    setImpersonation(null);
  }, [appendAuditLog, impersonation]);  const updateFeatureFlag = useCallback(
    (key: FeatureFlagKey, value: boolean, options?: { reason?: string }) => {
      if (!session) {
        return { success: false, message: "Not authenticated." };
      }

      const record = featureFlags[key];
      if (!record) {
        return { success: false, message: "Unknown feature flag." };
      }
      if (!record.overridableBy.includes(session.role)) {
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

      const nextRecord: FeatureFlagRecord = {
        ...record,
        value,
        lastChangedAt: new Date().toISOString(),
        overriddenByUserId: session.id,
        notes: options?.reason ?? record.notes,
      };

      setFeatureFlags((previous) => ({
        ...previous,
        [key]: nextRecord,
      }));

      appendAuditLog({
        action: "feature.toggle",
        targetEntity: key,
        metadata: { value, reason: options?.reason },
        severity: "info",
      });

      return { success: true, message: "Feature flag updated." };
    },
    [appendAuditLog, featureFlags, impersonation, session],
  );

  const updateConfigItem = useCallback(
    (key: string, value: string, options?: { note?: string }) => {
      if (!session || session.role !== "owner") {
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

      const nextItem: ConfigItem = {
        ...item,
        value,
        lastUpdatedAt: new Date().toISOString(),
        lastUpdatedByUserId: session.id,
      };

      setConfigItems((previous) =>
        previous.map((config) => (config.key === key ? nextItem : config)),
      );

      appendAuditLog({
        action: "config.updated",
        targetEntity: key,
        metadata: { note: options?.note ?? null, masked: item.masked },
        severity: "warning",
      });

      return { success: true, message: "Configuration updated." };
    },
    [appendAuditLog, configItems, impersonation, isStepUpValid, session],
  );

  const refreshMonitoring = useCallback(() => {
    const jitter = () => Math.round(Math.random() * 4 - 2);
    setMonitoring((previous) => ({
      ...previous,
      lastUpdatedAt: new Date().toISOString(),
      cpuUtilization: Math.min(
        95,
        Math.max(10, previous.cpuUtilization + jitter()),
      ),
      memoryUtilization: Math.min(
        95,
        Math.max(20, previous.memoryUtilization + jitter()),
      ),
      queueBacklog: Math.max(
        0,
        previous.queueBacklog + Math.round(Math.random() * 2 - 1),
      ),
    }));
    appendAuditLog({
      action: "monitoring.refreshed",
      targetEntity: "infrastructure",
      severity: "info",
    });
  }, [appendAuditLog]);

  const triggerBackup = useCallback(
    (mode: "manual" | "scheduled") => {
      if (!session) {
        return { success: false, message: "Not authenticated." };
      }
      if (!["owner", "manager"].includes(session.role)) {
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

      const timestamp = new Date().toISOString();
      setInfrastructure((previous) => ({
        ...previous,
        lastBackupAt: timestamp,
        lastBackupMode: mode,
      }));
      appendAuditLog({
        action: "infrastructure.backup",
        targetEntity: mode,
        metadata: { mode },
        severity: "info",
      });
      return { success: true, message: "Backup request recorded." };
    },
    [appendAuditLog, impersonation, session],
  );

  const triggerRestore = useCallback(
    (options: { dryRun: boolean; backupId: string; note?: string }) => {
      if (!session || session.role !== "owner") {
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

      const timestamp = new Date().toISOString();
      setInfrastructure((previous) => ({
        ...previous,
        lastRestoreAt: options.dryRun ? previous.lastRestoreAt : timestamp,
        lastRestoreDryRunAt: options.dryRun
          ? timestamp
          : previous.lastRestoreDryRunAt,
      }));
      appendAuditLog({
        action: "infrastructure.restore",
        targetEntity: options.backupId,
        metadata: { dryRun: options.dryRun, note: options.note ?? null },
        severity: options.dryRun ? "info" : "warning",
      });
      return {
        success: true,
        message: options.dryRun
          ? "Restore dry-run recorded."
          : "Restore scheduled.",
      };
    },
    [appendAuditLog, impersonation, isStepUpValid, session],
  );

  const scheduleDeletion = useCallback(
    (options: { confirmationText: string; requestedAt: string }) => {
      if (!session || session.role !== "owner") {
        return {
          success: false,
          message: "Only the Owner can schedule full deletion.",
        };
      }
      if (!isStepUpValid()) {
        return {
          success: false,
          message: "Step-up verification required before scheduling deletion.",
        };
      }
      if (impersonation) {
        return {
          success: false,
          message: "Disable impersonation before scheduling deletion.",
        };
      }
      if (
        options.confirmationText.trim().toLowerCase() !==
        INSTANCE_CONFIRMATION_TOKEN
      ) {
        return {
          success: false,
          message: "Confirmation text does not match the instance token.",
        };
      }

      const timestamp = options.requestedAt || new Date().toISOString();
      setInfrastructure((previous) => ({
        ...previous,
        deletionScheduledFor: timestamp,
      }));
      appendAuditLog({
        action: "infrastructure.full_deletion_scheduled",
        targetEntity: INSTANCE_NAME,
        metadata: { requestedAt: timestamp },
        severity: "critical",
        immutable: true,
      });
      return { success: true, message: "Full deletion scheduled." };
    },
    [appendAuditLog, impersonation, isStepUpValid, session],
  );

  const cancelDeletion = useCallback(() => {
    if (!session || session.role !== "owner") {
      return;
    }
    setInfrastructure((previous) => ({
      ...previous,
      deletionScheduledFor: null,
    }));
    appendAuditLog({
      action: "infrastructure.full_deletion_cancelled",
      targetEntity: INSTANCE_NAME,
      severity: "warning",
    });
  }, [appendAuditLog, session]);

  const overrideLicenseTier = useCallback(
    (tier: LicenseTier | null) => {
      if (!session || session.role !== "owner") {
        return {
          success: false,
          message: "Only the Owner can override license tiers.",
        };
      }
      if (impersonation) {
        return {
          success: false,
          message: "Disable impersonation before overriding the license.",
        };
      }
      if (tier && !isStepUpValid()) {
        return {
          success: false,
          message: "Step-up verification required for tier override.",
        };
      }
      if (tier && !["free", "advanced", "premium", "family"].includes(tier)) {
        return { success: false, message: "Unknown tier override." };
      }

      setLicense((previous) => ({
        ...previous,
        overrideActive: tier !== null,
        overrideTier: tier ?? undefined,
        lastValidatedAt: new Date().toISOString(),
      }));
      appendAuditLog({
        action: "license.override",
        targetEntity: license.licenseId,
        metadata: { tier: tier ?? "none" },
        severity: "warning",
      });
      return { success: true, message: "License override updated." };
    },
    [appendAuditLog, impersonation, isStepUpValid, license.licenseId, session],
  );  const effectiveSession = impersonation?.target ?? session;
  const ownerOverrideActive = session?.role === "owner" && !impersonation;
  const appliedLicenseTier =
    license.overrideActive && ownerOverrideActive
      ? license.overrideTier ?? license.tier
      : license.tier;
  const hasPremiumTier = effectiveSession
    ? tierFromPremiumFlag(effectiveSession.tier)
    : false;
  const licenseSupportsPremium = tierFromPremiumFlag(appliedLicenseTier);
  const hasPremiumAccess =
    ownerOverrideActive || (hasPremiumTier && licenseSupportsPremium);

  const effectiveTier = effectiveSession?.tier ?? "free";

  const featureAvailability = useCallback(
    (featureKey: FeatureFlagKey) => {
      if (ownerOverrideActive) {
        return true;
      }
      const flagEnabled = featureFlags[featureKey]?.value ?? false;
      if (!flagEnabled) {
        return false;
      }
      const licenseFeatureKey = FEATURE_LICENSE_MAP[featureKey];
      if (
        licenseFeatureKey &&
        license.features[licenseFeatureKey] === false
      ) {
        return false;
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
    [
      appliedLicenseTier,
      effectiveTier,
      featureFlags,
      license.features,
      ownerOverrideActive,
    ],
  );

  const canAccessAdmin = Boolean(
    session && ["owner", "manager"].includes(session.role),
  );
  const canManageUsers = Boolean(
    session && ["owner", "manager"].includes(session.role) && !impersonation,
  );
  const canModifyConfig = Boolean(session?.role === "owner" && !impersonation);
  const canRunCriticalOps = Boolean(session?.role === "owner" && !impersonation);

  const value = useMemo<AdminFoundationContextValue>(
    () => ({
      session,
      effectiveSession,
      impersonation,
      users: DIRECTORY_USERS.map((user) => ({ ...user })),
      hasPremiumAccess,
      login,
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
      logout,
      monitoring,
      overrideLicenseTier,
      refreshMonitoring,
      scheduleDeletion,
      session,
      startImpersonation,
      stepUpState,
      triggerBackup,
      triggerRestore,
      updateConfigItem,
      updateFeatureFlag,
      verifyStepUp,
      isStepUpValid,
      effectiveSession,
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
    throw new Error("useAdminFoundation must be used within AdminFoundationProvider");
  }
  return context;
};