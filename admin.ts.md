import { Router, Response } from 'express';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth.js';
import db from '../db.js';

interface FeatureFlagRow {
  key: string;
  description: string;
  value: 0 | 1 | boolean;
  overridable_by: string | null;
  last_changed_at: Date | string | null;
  overridden_by_user_id: string | null;
  notes: string | null;
}

interface LicenseRow {
  license_id: string;
  tier: string;
  status: string;
  expires_at: Date | string;
  last_validated_at: Date | string | null;
  override_active: 0 | 1 | boolean;
  override_tier: string | null;
  features: string | null;
  updated_at?: Date | string | null;
}

interface ConfigItemRow {
  key: string;
  value: string;
  encrypted: 0 | 1 | boolean;
  masked: 0 | 1 | boolean;
  description: string;
  requires_step_up: 0 | 1 | boolean;
  last_updated_at: Date | string | null;
  last_updated_by_user_id: string | null;
}

interface AuditLogRow {
  id: number;
  actor_user_id: string;
  actor_username?: string | null;
  actor_display_name?: string | null;
  impersonated_user_id: string | null;
  impersonated_username?: string | null;
  impersonated_display_name?: string | null;
  action: string;
  target_entity: string;
  metadata: string | null;
  severity: 'info' | 'warning' | 'critical';
  immutable: 0 | 1 | boolean;
  timestamp: Date | string;
}

interface InfrastructureState {
  lastBackupAt: string | null;
  lastBackupMode: 'manual' | 'scheduled' | null;
  lastRestoreAt: string | null;
  lastRestoreDryRunAt: string | null;
  deletionScheduledFor: string | null;
}

const router = Router();

router.use(authenticate);
router.use(requireRole('owner', 'manager'));

const infrastructureState: InfrastructureState = {
  lastBackupAt: null,
  lastBackupMode: null,
  lastRestoreAt: null,
  lastRestoreDryRunAt: null,
  deletionScheduledFor: null,
};

const parseBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') return value === '1' || value.toLowerCase() === 'true';
  return false;
};

const parseJson = <T>(raw: unknown, fallback: T): T => {
  if (!raw) return fallback;
  if (typeof raw === 'object') return raw as T;
  try {
    return JSON.parse(String(raw)) as T;
  } catch (error) {
    return fallback;
  }
};

const mapUsers = (rows: any[]) =>
  rows.map((user) => ({
    id: user.id,
    email: user.email,
    username: user.username ?? user.email,
    displayName: user.display_name ?? user.email,
    role: user.role,
    tier: user.tier ?? 'free',
    isPremium: parseBoolean(user.isPremium) || ['premium', 'family'].includes(user.tier),
    phone: user.phone ?? '',
  }));

const mapFeatureFlags = (rows: FeatureFlagRow[]): Record<string, any> =>
  rows.reduce<Record<string, any>>((acc, row) => {
    acc[row.key] = {
      key: row.key,
      description: row.description,
      value: parseBoolean(row.value),
      overridableBy: parseJson<string[]>(row.overridable_by, []),
      lastChangedAt: row.last_changed_at ? new Date(row.last_changed_at).toISOString() : new Date(0).toISOString(),
      overriddenByUserId: row.overridden_by_user_id ?? undefined,
      notes: row.notes ?? undefined,
    };
    return acc;
  }, {});

const mapConfigItems = (rows: ConfigItemRow[]) =>
  rows.map((row) => ({
    key: row.key,
    value: row.value,
    encrypted: parseBoolean(row.encrypted),
    masked: parseBoolean(row.masked),
    description: row.description,
    requiresStepUp: parseBoolean(row.requires_step_up),
    lastUpdatedAt: row.last_updated_at ? new Date(row.last_updated_at).toISOString() : null,
    lastUpdatedByUserId: row.last_updated_by_user_id ?? null,
  }));

const mapAuditLogs = (rows: AuditLogRow[]) =>
  rows.map((row) => ({
    id: row.id,
    actorUserId: row.actor_user_id,
    actorUsername: row.actor_username ?? '',
    actorDisplayName: row.actor_display_name ?? '',
    impersonatedUserId: row.impersonated_user_id ?? null,
    impersonatedUsername: row.impersonated_username ?? null,
    impersonatedDisplayName: row.impersonated_display_name ?? null,
    action: row.action,
    targetEntity: row.target_entity,
    metadata: parseJson<Record<string, unknown>>(row.metadata, {}),
    immutable: parseBoolean(row.immutable),
    severity: row.severity,
    timestamp: new Date(row.timestamp).toISOString(),
  }));

const buildMonitoringSnapshot = async () => {
  const now = new Date();
  const [userCountRows] = await db.query('SELECT COUNT(*) AS count FROM users');
  const [transactionRows] = await db.query(
    "SELECT COUNT(*) AS count FROM transactions WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
  );
  const userCount = Array.isArray(userCountRows) && userCountRows.length > 0
    ? Number((userCountRows as any)[0].count)
    : 0;
  const recentTransactionCount = Array.isArray(transactionRows) && transactionRows.length > 0
    ? Number((transactionRows as any)[0].count)
    : 0;

  return {
    lastUpdatedAt: now.toISOString(),
    dbConnection: 'healthy' as const,
    smtpStatus: 'ok' as const,
    uptimeSeconds: 7 * 24 * 60 * 60,
    cpuUtilization: 27,
    memoryUtilization: 42,
    queueBacklog: 0,
    stats: {
      userCount,
      recentTransactionCount,
    },
  };
};

const buildLicenseState = (row: LicenseRow | undefined, featureFlags: Record<string, any>) => {
  if (!row) {
    return {
      licenseId: 'demo-license-001',
      tier: 'free',
      status: 'valid',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastValidatedAt: new Date().toISOString(),
      overrideActive: false,
      features: Object.keys(featureFlags).reduce<Record<string, boolean>>((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
    };
  }

  const baseFeatures = Object.keys(featureFlags).reduce<Record<string, boolean>>((acc, key) => {
    acc[key] = false;
    return acc;
  }, {});
  const parsedFeatures = parseJson<Record<string, boolean>>(row.features, baseFeatures);

  return {
    licenseId: row.license_id,
    tier: row.override_active && row.override_tier ? row.override_tier : row.tier,
    status: row.status,
    expiresAt: new Date(row.expires_at).toISOString(),
    lastValidatedAt: row.last_validated_at
      ? new Date(row.last_validated_at).toISOString()
      : new Date().toISOString(),
    overrideActive: parseBoolean(row.override_active),
    overrideTier: row.override_tier ?? undefined,
    features: { ...baseFeatures, ...parsedFeatures },
  };
};

router.get('/bootstrap', async (_req: AuthRequest, res: Response) => {
  try {
    const [userRows] = await db.query(
      `SELECT id, email, username, display_name, phone, role, tier, is_premium AS isPremium FROM users`
    );
    const users = mapUsers(userRows as any[]);

    const [featureFlagRows] = await db.query(
      `SELECT key, description, value, overridable_by, last_changed_at, overridden_by_user_id, notes FROM feature_flags`
    );
    const featureFlags = mapFeatureFlags(featureFlagRows as FeatureFlagRow[]);

    const [licenseRows] = await db.query(
      `SELECT license_id, tier, status, expires_at, last_validated_at, override_active, override_tier, features, updated_at
       FROM licenses
       ORDER BY updated_at DESC
       LIMIT 1`
    );
    const licenseRow = Array.isArray(licenseRows) && licenseRows.length > 0
      ? (licenseRows as any[])[0] as LicenseRow
      : undefined;
    const license = buildLicenseState(licenseRow, featureFlags);

    const [configRows] = await db.query(
      `SELECT key, value, encrypted, masked, description, requires_step_up, last_updated_at, last_updated_by_user_id FROM config_items`
    );
    const configItems = mapConfigItems(configRows as ConfigItemRow[]);

    const monitoring = await buildMonitoringSnapshot();

    const [auditRows] = await db.query(
      `SELECT
        al.id,
        al.actor_user_id,
        actor.username AS actor_username,
        actor.display_name AS actor_display_name,
        al.impersonated_user_id,
        imp.username AS impersonated_username,
        imp.display_name AS impersonated_display_name,
        al.action,
        al.target_entity,
        al.metadata,
        al.severity,
        al.immutable,
        al.timestamp
       FROM audit_logs al
       LEFT JOIN users actor ON actor.id = al.actor_user_id
       LEFT JOIN users imp ON imp.id = al.impersonated_user_id
       ORDER BY al.timestamp DESC
       LIMIT 200`
    );
    const auditLogs = mapAuditLogs(auditRows as AuditLogRow[]);

    res.json({
      users,
      featureFlags,
      license,
      configItems,
      monitoring,
      infrastructure: infrastructureState,
      auditLogs,
    });
  } catch (error) {
    console.error('Admin bootstrap error:', error);
    res.status(500).json({ error: 'Failed to bootstrap admin console' });
  }
});

router.patch('/feature-flags/:key', async (req: AuthRequest, res: Response) => {
  try {
    const { key } = req.params;
    const { value, notes } = req.body as { value: boolean; notes?: string };

    if (typeof value !== 'boolean') {
      res.status(400).json({ error: 'Invalid payload: value must be boolean' });
      return;
    }

    await db.query(
      `UPDATE feature_flags
       SET value = ?, last_changed_at = NOW(), overridden_by_user_id = ?, notes = ?
       WHERE key = ?`,
      [value ? 1 : 0, req.user!.id, notes ?? null, key]
    );

    const [rows] = await db.query(
      `SELECT key, description, value, overridable_by, last_changed_at, overridden_by_user_id, notes
       FROM feature_flags WHERE key = ?`,
      [key]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({ error: 'Feature flag not found' });
      return;
    }

    const flag = mapFeatureFlags(rows as FeatureFlagRow[])[key];
    res.json(flag);
  } catch (error) {
    console.error('Update feature flag error:', error);
    res.status(500).json({ error: 'Failed to update feature flag' });
  }
});

router.post('/audit', async (req: AuthRequest, res: Response) => {
  try {
    const { action, targetEntity, severity = 'info', metadata = {}, immutable = false } = req.body as {
      action: string;
      targetEntity: string;
      severity?: 'info' | 'warning' | 'critical';
      metadata?: Record<string, unknown>;
      immutable?: boolean;
    };

    if (!action || !targetEntity) {
      res.status(400).json({ error: 'action and targetEntity are required' });
      return;
    }

    const [result] = await db.query(
      `INSERT INTO audit_logs (actor_user_id, action, target_entity, metadata, severity, immutable)
       VALUES (?, ?, ?, ?, ?, ?)`
      , [req.user!.id, action, targetEntity, JSON.stringify(metadata ?? {}), severity, immutable ? 1 : 0]
    );

    const insertedId = (result as any).insertId;
    const [rows] = await db.query(
      `SELECT
        al.id,
        al.actor_user_id,
        actor.username AS actor_username,
        actor.display_name AS actor_display_name,
        al.impersonated_user_id,
        imp.username AS impersonated_username,
        imp.display_name AS impersonated_display_name,
        al.action,
        al.target_entity,
        al.metadata,
        al.severity,
        al.immutable,
        al.timestamp
       FROM audit_logs al
       LEFT JOIN users actor ON actor.id = al.actor_user_id
       LEFT JOIN users imp ON imp.id = al.impersonated_user_id
       WHERE al.id = ?`,
      [insertedId]
    );

    const auditLog = mapAuditLogs(rows as AuditLogRow[])[0];
    res.status(201).json(auditLog);
  } catch (error) {
    console.error('Append audit log error:', error);
    res.status(500).json({ error: 'Failed to append audit log' });
  }
});

router.patch('/config/:key', async (req: AuthRequest, res: Response) => {
  try {
    const { key } = req.params;
    const { value, masked } = req.body as { value: string; masked?: boolean };

    if (typeof value !== 'string') {
      res.status(400).json({ error: 'Invalid payload: value must be string' });
      return;
    }

    await db.query(
      `UPDATE config_items
       SET value = ?, masked = COALESCE(?, masked), last_updated_at = NOW(), last_updated_by_user_id = ?
       WHERE key = ?`,
      [value, typeof masked === 'boolean' ? (masked ? 1 : 0) : null, req.user!.id, key]
    );

    const [rows] = await db.query(
      `SELECT key, value, encrypted, masked, description, requires_step_up, last_updated_at, last_updated_by_user_id
       FROM config_items WHERE key = ?`,
      [key]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({ error: 'Config item not found' });
      return;
    }

    const configItem = mapConfigItems(rows as ConfigItemRow[])[0];
    res.json(configItem);
  } catch (error) {
    console.error('Update config item error:', error);
    res.status(500).json({ error: 'Failed to update config item' });
  }
});

router.post('/monitoring/refresh', async (_req: AuthRequest, res: Response) => {
  try {
    const snapshot = await buildMonitoringSnapshot();
    res.json(snapshot);
  } catch (error) {
    console.error('Refresh monitoring error:', error);
    res.status(500).json({ error: 'Failed to refresh monitoring' });
  }
});

router.post('/infrastructure/backup', (req: AuthRequest, res: Response) => {
  const { mode } = req.body as { mode?: 'manual' | 'scheduled' };
  const backupMode = mode ?? 'manual';
  const now = new Date().toISOString();

  infrastructureState.lastBackupAt = now;
  infrastructureState.lastBackupMode = backupMode;

  res.json(infrastructureState);
});

router.post('/infrastructure/restore', (req: AuthRequest, res: Response) => {
  const { dryRun = false } = req.body as { dryRun?: boolean };
  const now = new Date().toISOString();

  if (dryRun) {
    infrastructureState.lastRestoreDryRunAt = now;
  } else {
    infrastructureState.lastRestoreAt = now;
  }

  res.json(infrastructureState);
});

router.post('/infrastructure/deletion/schedule', (req: AuthRequest, res: Response) => {
  const { scheduledFor } = req.body as { confirmationToken?: string; scheduledFor: string };

  if (!scheduledFor) {
    res.status(400).json({ error: 'scheduledFor is required' });
    return;
  }

  infrastructureState.deletionScheduledFor = new Date(scheduledFor).toISOString();
  res.json(infrastructureState);
});

router.post('/infrastructure/deletion/cancel', (_req: AuthRequest, res: Response) => {
  infrastructureState.deletionScheduledFor = null;
  res.json(infrastructureState);
});

export default router;
