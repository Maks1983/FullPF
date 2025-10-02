import { Router } from 'express';
import type { Response } from 'express';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { authenticateRequest, requireRole } from '../middleware/authMiddleware';
import type { AuthenticatedRequest } from '../middleware/authMiddleware';
import { extractTenantMiddleware, validateTenantMiddleware } from '../middleware/tenantMiddleware';
import {
  addBankConnection,
  addBankToken,
  listBankConnections,
  listBankTokens,
  newAuditLogEntry,
  revokeBankTokenRecord,
  revokeTokensForConnection,
  updateBankConnection,
} from '../data/store';

const router = Router();

// Apply tenant middleware to all bank routes
router.use(extractTenantMiddleware);
router.use(validateTenantMiddleware);

const createConnectionSchema = z.object({
  provider: z.enum(['demo', 'teller', 'plaid', 'finicity', 'basiq', 'other']).default('demo'),
  institutionId: z.string().min(1),
  institutionName: z.string().min(1),
  connectionLabel: z.string().max(64).optional(),
});

const tokenSchema = z.object({
  scope: z.array(z.string().min(1)).min(1),
  expiresInDays: z.number().int().positive().max(365).optional(),
});

const syncSchema = z.object({
  status: z.enum(['pending', 'active', 'error']).optional(),
  failureReason: z.string().max(256).optional(),
});

const revokeSchema = z.object({
  reason: z.string().max(256).optional(),
});

const ensureTenant = (req: AuthenticatedRequest, res: Response): string | null => {
  if (!req.tenantId) {
    res.status(400).json({ message: 'Tenant context required' });
    return null;
  }
  return req.tenantId;
};

const maskToken = (id: string): string => `${id.slice(0, 4)}-****-${id.slice(-4)}`;

// List bank connections for current user
router.get('/connections', authenticateRequest, (req: AuthenticatedRequest, res) => {
  const tenantId = ensureTenant(req, res);
  if (!tenantId) return;

  const includeTokens = req.query.includeTokens === 'true';
  const connections = listBankConnections(tenantId);
  
  if (!includeTokens) {
    res.json(connections);
    return;
  }
  
  const tokens = listBankTokens(tenantId);
  res.json({ connections, tokens });
});

// Create new bank connection
router.post('/connections', authenticateRequest, requireRole(['owner', 'manager']), (req: AuthenticatedRequest, res) => {
  const tenantId = ensureTenant(req, res);
  if (!tenantId) return;

  const parsed = createConnectionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const now = new Date().toISOString();
  const connection = {
    id: randomUUID(),
    tenantId,
    userId: req.currentUser!.id,
    provider: parsed.data.provider,
    institutionId: parsed.data.institutionId,
    institutionName: parsed.data.institutionName,
    status: 'pending' as const,
    connectionLabel: parsed.data.connectionLabel,
    createdAt: now,
    updatedAt: now,
  };

  addBankConnection(tenantId, connection);

  newAuditLogEntry(tenantId, {
    actorUserId: req.currentUser!.id,
    actorUsername: req.currentUser!.username,
    actorDisplayName: req.currentUser!.displayName,
    action: 'bank.connection_created',
    targetEntity: connection.id,
    severity: 'info',
    metadata: { provider: connection.provider, institutionName: connection.institutionName },
    immutable: false,
  });

  res.status(201).json(connection);
});

// Issue token for bank connection
router.post('/connections/:id/token', authenticateRequest, requireRole(['owner', 'manager']), (req: AuthenticatedRequest, res) => {
  const tenantId = ensureTenant(req, res);
  if (!tenantId) return;

  const parsed = tokenSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const connectionId = req.params.id;
  const connection = updateBankConnection(tenantId, connectionId, (current) => ({
    ...current,
    updatedAt: new Date().toISOString(),
    status: current.status === 'pending' ? 'active' : current.status,
  }));

  if (!connection) {
    res.status(404).json({ message: 'Connection not found' });
    return;
  }

  const expiresDays = parsed.data.expiresInDays ?? 90;
  const tokenId = randomUUID();
  const token = {
    id: tokenId,
    tenantId,
    connectionId,
    scope: parsed.data.scope,
    expiresAt: new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    secretFragment: maskToken(tokenId),
  };

  addBankToken(tenantId, token);

  newAuditLogEntry(tenantId, {
    actorUserId: req.currentUser!.id,
    actorUsername: req.currentUser!.username,
    actorDisplayName: req.currentUser!.displayName,
    action: 'bank.token_issued',
    targetEntity: connectionId,
    severity: 'info',
    metadata: { scope: token.scope, expiresAt: token.expiresAt },
    immutable: false,
  });

  res.status(201).json(token);
});

// Sync bank connection status
router.post('/connections/:id/sync', authenticateRequest, requireRole(['owner', 'manager']), (req: AuthenticatedRequest, res) => {
  const tenantId = ensureTenant(req, res);
  if (!tenantId) return;

  const parsed = syncSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const connectionId = req.params.id;
  const connection = updateBankConnection(tenantId, connectionId, (current) => ({
    ...current,
    status: parsed.data.status ?? current.status,
    failureReason: parsed.data.failureReason,
    lastSyncedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  if (!connection) {
    res.status(404).json({ message: 'Connection not found' });
    return;
  }

  newAuditLogEntry(tenantId, {
    actorUserId: req.currentUser!.id,
    actorUsername: req.currentUser!.username,
    actorDisplayName: req.currentUser!.displayName,
    action: 'bank.connection_synced',
    targetEntity: connectionId,
    severity: parsed.data.failureReason ? 'warning' : 'info',
    metadata: parsed.data,
    immutable: false,
  });

  res.json(connection);
});

// Revoke bank connection
router.post('/connections/:id/revoke', authenticateRequest, requireRole(['owner']), (req: AuthenticatedRequest, res) => {
  const tenantId = ensureTenant(req, res);
  if (!tenantId) return;

  const parsed = revokeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const connectionId = req.params.id;
  const connection = updateBankConnection(tenantId, connectionId, (current) => ({
    ...current,
    status: 'revoked',
    failureReason: parsed.data.reason,
    updatedAt: new Date().toISOString(),
  }));

  if (!connection) {
    res.status(404).json({ message: 'Connection not found' });
    return;
  }

  const revokedTokens = revokeTokensForConnection(tenantId, connectionId, parsed.data.reason);

  newAuditLogEntry(tenantId, {
    actorUserId: req.currentUser!.id,
    actorUsername: req.currentUser!.username,
    actorDisplayName: req.currentUser!.displayName,
    action: 'bank.connection_revoked',
    targetEntity: connectionId,
    severity: 'warning',
    metadata: { reason: parsed.data.reason, revokedTokens: revokedTokens.length },
    immutable: false,
  });

  res.json({ connection, revokedTokens });
});

// List tokens for specific connection
router.get('/connections/:id/tokens', authenticateRequest, (req: AuthenticatedRequest, res) => {
  const tenantId = ensureTenant(req, res);
  if (!tenantId) return;

  const connectionId = req.params.id;
  const tokens = listBankTokens(tenantId, connectionId);
  res.json(tokens);
});

// Revoke specific token
router.post('/tokens/:id/revoke', authenticateRequest, requireRole(['owner', 'manager']), (req: AuthenticatedRequest, res) => {
  const tenantId = ensureTenant(req, res);
  if (!tenantId) return;

  const parsed = revokeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const token = revokeBankTokenRecord(tenantId, req.params.id, parsed.data.reason);
  if (!token) {
    res.status(404).json({ message: 'Token not found or already revoked' });
    return;
  }

  newAuditLogEntry(tenantId, {
    actorUserId: req.currentUser!.id,
    actorUsername: req.currentUser!.username,
    actorDisplayName: req.currentUser!.displayName,
    action: 'bank.token_revoked',
    targetEntity: token.connectionId,
    severity: 'warning',
    metadata: { tokenId: token.id, reason: parsed.data.reason },
    immutable: false,
  });

  res.json(token);
});

export default router;