import { Router } from 'express';
import type { Response } from 'express';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../middleware/authMiddleware';
import { extractTenantMiddleware, validateTenantMiddleware } from '../middleware/tenantMiddleware';
import type { ConfigItem, InfrastructureStatus, LicenseState } from '../types';
import { authenticateRequest, requireRole } from '../middleware/authMiddleware';
import {
  getState,
  updateFeatureFlag,
  getFeatureFlags,
  getLicense,
  setLicense,
  getConfigItems,
  setConfigItems,
  getMonitoring,
  setMonitoring,
  getInfrastructure,
  setInfrastructure,
  newAuditLogEntry,
} from '../data/store';

const router = Router();

// Apply tenant middleware to all admin routes
router.use(extractTenantMiddleware);
router.use(validateTenantMiddleware);

const ensureTenant = (req: AuthenticatedRequest, res: Response): string | null => {
  if (!req.tenantId) {
    res.status(400).json({ message: 'Tenant context required' });
    return null;
  }
  return req.tenantId;
};

const featureFlagSchema = z.object({
  value: z.boolean(),
  notes: z.string().max(256).optional(),
});

const configUpdateSchema = z.object({
  value: z.string(),
  masked: z.boolean().optional(),
});

const licenseOverrideSchema = z.object({
  overrideActive: z.boolean(),
  overrideTier: z.enum(['free', 'advanced', 'premium', 'family']).optional(),
});

const scheduleDeletionSchema = z.object({
  confirmationToken: z.string().min(1),
  scheduledFor: z.string().datetime(),
});

const auditSchema = z.object({
  action: z.string(),
  targetEntity: z.string(),
  severity: z.enum(['info', 'warning', 'critical']).default('info'),
  metadata: z.record(z.string(), z.any()).optional(),
  immutable: z.boolean().optional(),
});

router.get(
  '/bootstrap',
  authenticateRequest,
  (req: AuthenticatedRequest, res) => {
    const tenantId = req.tenantId;
    if (!tenantId) {
      res.status(400).json({ message: 'Tenant context required' });
      return;
    }
    const state = getState(tenantId);
    res.json({
      users: state.users.map((user) => ({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        tier: user.tier,
        isPremium: user.isPremium,
        phone: user.phone,
      })),
      featureFlags: getFeatureFlags(tenantId),
      license: getLicense(tenantId),
      configItems: getConfigItems(tenantId),
      monitoring: getMonitoring(tenantId),
      infrastructure: getInfrastructure(tenantId),
      auditLogs: state.auditLogs,
    });
  },
);

router.patch(
  '/feature-flags/:key',
  authenticateRequest,
  requireRole(['owner']),
  (req: AuthenticatedRequest, res) => {
    const tenantId = ensureTenant(req, res);
    if (!tenantId) {
      return;
    }
    const parsed = featureFlagSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
      return;
    }
    const flags = getFeatureFlags(tenantId);
    const key = req.params.key as keyof typeof flags;
    const current = flags[key];
    if (!current) {
      res.status(404).json({ message: 'Feature flag not found' });
      return;
    }
    const { value, notes } = parsed.data;
    const next = updateFeatureFlag(tenantId, key, (flag) => ({
      ...flag,
      value,
      lastChangedAt: new Date().toISOString(),
      ...(notes !== undefined ? { notes } : {}),
      ...(req.currentUser ? { overriddenByUserId: req.currentUser.id } : {}),
    }));
    newAuditLogEntry(tenantId, {
      actorUserId: req.currentUser!.id,
      actorUsername: req.currentUser!.username,
      actorDisplayName: req.currentUser!.displayName,
      action: 'feature_flag.updated',
      targetEntity: key,
      severity: 'info',
      metadata: { value, notes },
      immutable: false,
    });
    res.json(next);
  },
);

router.post(
  '/audit',
  authenticateRequest,
  (req: AuthenticatedRequest, res) => {
    const tenantId = ensureTenant(req, res);
    if (!tenantId) {
      return;
    }
    const parsed = auditSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
      return;
    }
    const entry = newAuditLogEntry(tenantId, {
      actorUserId: req.currentUser!.id,
      actorUsername: req.currentUser!.username,
      actorDisplayName: req.currentUser!.displayName,
      action: parsed.data.action,
      targetEntity: parsed.data.targetEntity,
      severity: parsed.data.severity,
      metadata: parsed.data.metadata ?? {},
      immutable: parsed.data.immutable ?? false,
    });
    res.status(201).json(entry);
  },
);

router.patch(
  '/config/:key',
  authenticateRequest,
  requireRole(['owner']),
  (req: AuthenticatedRequest, res) => {
    const tenantId = ensureTenant(req, res);
    if (!tenantId) {
      return;
    }
    const parsed = configUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
      return;
    }

    const key = req.params.key;
    const items = getConfigItems(tenantId);
    const index = items.findIndex((item) => item.key === key);
    if (index < 0) {
      res.status(404).json({ message: 'Config item not found' });
      return;
    }

    const currentItem = items[index]!;
    const updated: ConfigItem = {
      ...currentItem,
      value: parsed.data.value,
      masked: parsed.data.masked ?? currentItem.masked,
      lastUpdatedAt: new Date().toISOString(),
      lastUpdatedByUserId: req.currentUser!.id,
    };
    const nextItems = [...items];
    nextItems[index] = updated;
    setConfigItems(tenantId, nextItems);

    newAuditLogEntry(tenantId, {
      actorUserId: req.currentUser!.id,
      actorUsername: req.currentUser!.username,
      actorDisplayName: req.currentUser!.displayName,
      action: 'config.updated',
      targetEntity: key,
      severity: 'warning',
      metadata: { masked: updated.masked },
      immutable: false,
    });

    res.json(updated);
  },
);

router.post(
  '/monitoring/refresh',
  authenticateRequest,
  (req: AuthenticatedRequest, res) => {
    const tenantId = ensureTenant(req, res);
    if (!tenantId) {
      return;
    }
    const current = getMonitoring(tenantId);
    const jitter = (value: number) => Math.max(0, Math.min(1, value + (Math.random() - 0.5) * 0.05));
    const next = {
      ...current,
      lastUpdatedAt: new Date().toISOString(),
      cpuUtilization: jitter(current.cpuUtilization),
      memoryUtilization: jitter(current.memoryUtilization),
      queueBacklog: Math.max(0, current.queueBacklog + Math.round((Math.random() - 0.5) * 2)),
    };
    setMonitoring(tenantId, next);
    res.json(next);
  },
);

router.post(
  '/infrastructure/backup',
  authenticateRequest,
  requireRole(['owner']),
  (req: AuthenticatedRequest, res) => {
    const tenantId = ensureTenant(req, res);
    if (!tenantId) {
      return;
    }
    const status = getInfrastructure(tenantId);
    const mode: 'manual' | 'scheduled' = req.body?.mode === 'manual' ? 'manual' : 'scheduled';
    const next: InfrastructureStatus = {
      ...status,
      lastBackupAt: new Date().toISOString(),
      lastBackupMode: mode,
    };
    setInfrastructure(tenantId, next);
    newAuditLogEntry(tenantId, {
      actorUserId: req.currentUser!.id,
      actorUsername: req.currentUser!.username,
      actorDisplayName: req.currentUser!.displayName,
      action: 'infrastructure.backup_triggered',
      targetEntity: 'infrastructure',
      severity: 'warning',
      metadata: { mode },
      immutable: false,
    });
    res.json(next);
  },
);

router.post(
  '/infrastructure/restore',
  authenticateRequest,
  requireRole(['owner']),
  (req: AuthenticatedRequest, res) => {
    const tenantId = ensureTenant(req, res);
    if (!tenantId) {
      return;
    }
    const status = getInfrastructure(tenantId);
    const isDryRun = Boolean(req.body.dryRun);
    const next: InfrastructureStatus = {
      ...status,
      lastRestoreAt: isDryRun ? status.lastRestoreAt : new Date().toISOString(),
      lastRestoreDryRunAt: new Date().toISOString(),
    };
    setInfrastructure(tenantId, next);
    newAuditLogEntry(tenantId, {
      actorUserId: req.currentUser!.id,
      actorUsername: req.currentUser!.username,
      actorDisplayName: req.currentUser!.displayName,
      action: isDryRun ? 'infrastructure.restore_dry_run' : 'infrastructure.restore',
      targetEntity: 'infrastructure',
      severity: 'critical',
      metadata: { dryRun: isDryRun },
      immutable: true,
    });
    res.json(next);
  },
);

router.post(
  '/infrastructure/deletion/schedule',
  authenticateRequest,
  requireRole(['owner']),
  (req: AuthenticatedRequest, res) => {
    const tenantId = ensureTenant(req, res);
    if (!tenantId) {
      return;
    }
    const parsed = scheduleDeletionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
      return;
    }
    const status = getInfrastructure(tenantId);
    const next: InfrastructureStatus = {
      ...status,
      deletionScheduledFor: parsed.data.scheduledFor,
    };
    setInfrastructure(tenantId, next);
    newAuditLogEntry(tenantId, {
      actorUserId: req.currentUser!.id,
      actorUsername: req.currentUser!.username,
      actorDisplayName: req.currentUser!.displayName,
      action: 'infrastructure.deletion_scheduled',
      targetEntity: 'infrastructure',
      severity: 'critical',
      metadata: { scheduledFor: parsed.data.scheduledFor },
      immutable: true,
    });
    res.json(next);
  },
);

router.post(
  '/infrastructure/deletion/cancel',
  authenticateRequest,
  requireRole(['owner']),
  (req: AuthenticatedRequest, res) => {
    const tenantId = ensureTenant(req, res);
    if (!tenantId) {
      return;
    }
    const status = getInfrastructure(tenantId);
    const next: InfrastructureStatus = {
      ...status,
      deletionScheduledFor: null,
    };
    setInfrastructure(tenantId, next);
    newAuditLogEntry(tenantId, {
      actorUserId: req.currentUser!.id,
      actorUsername: req.currentUser!.username,
      actorDisplayName: req.currentUser!.displayName,
      action: 'infrastructure.deletion_cancelled',
      targetEntity: 'infrastructure',
      severity: 'warning',
      metadata: {},
      immutable: false,
    });
    res.json(next);
  },
);

router.post(
  '/license/override',
  authenticateRequest,
  requireRole(['owner']),
  (req: AuthenticatedRequest, res) => {
    const tenantId = ensureTenant(req, res);
    if (!tenantId) {
      return;
    }
    const parsed = licenseOverrideSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
      return;
    }
    const current = getLicense(tenantId);
    const overrideTier = parsed.data.overrideActive
      ? parsed.data.overrideTier ?? current.overrideTier ?? current.tier
      : undefined;
    const next: LicenseState = {
      ...current,
      overrideActive: parsed.data.overrideActive,
      overrideTier,
      lastValidatedAt: new Date().toISOString(),
    };
    setLicense(tenantId, next);
    newAuditLogEntry(tenantId, {
      actorUserId: req.currentUser!.id,
      actorUsername: req.currentUser!.username,
      actorDisplayName: req.currentUser!.displayName,
      action: 'license.override_updated',
      targetEntity: 'license',
      severity: 'warning',
      metadata: parsed.data,
      immutable: false,
    });
    res.json(next);
  },
);

export default router;

