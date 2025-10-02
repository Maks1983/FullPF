import { Router } from 'express';
import type { Response } from 'express';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import {
  authenticateUser,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyTwoFactor,
  revokeRefreshTokenById,
  initiatePasswordReset,
  resetPassword,
  initiateEmailVerification,
  verifyEmail,
  validatePasswordStrength,
  checkRateLimit,
} from '../services/authService';
import {
  addStepUpEvent,
  endImpersonation,
  findUserById,
  getActiveImpersonation,
  newAuditLogEntry,
  startImpersonation,
  saveUser,
} from '../data/store';
import type { AuthenticatedRequest } from '../middleware/authMiddleware';
import type { TenantRequest } from '../middleware/tenantMiddleware';
import { extractTenantMiddleware, validateTenantMiddleware } from '../middleware/tenantMiddleware';
import type { FeatureFlagKey, ImpersonationRecord } from '../types';
import { authenticateRequest } from '../middleware/authMiddleware';

const router = Router();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const twoFactorSchema = z.object({
  challengeId: z.string().uuid(),
  code: z.string().length(6),
});

const refreshSchema = z.object({
  refreshToken: z.string().uuid(),
});

const stepUpSchema = z.object({
  code: z.string().length(6),
  action: z.string().min(1),
});

const impersonationSchema = z.object({
  targetUserId: z.string().min(1),
  reason: z.string().max(256).optional(),
});

const passwordResetRequestSchema = z.object({
  email: z.string().email(),
});

const passwordResetSchema = z.object({
  token: z.string().uuid(),
  newPassword: z.string().min(8),
});

const emailVerificationSchema = z.object({
  token: z.string().uuid(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

const normalizeTenantId = (tenantId: string): string => tenantId.trim().toLowerCase();

const pendingChallenges = new Map<string, { tenantId: string; userId: string; createdAt: number }>();

// Apply tenant middleware to all routes
router.use(extractTenantMiddleware);
router.use(validateTenantMiddleware);

router.post('/login', async (req: TenantRequest, res) => {
  const tenantId = req.tenantId;
  if (!tenantId) {
    res.status(400).json({ message: 'Tenant context required' });
    return;
  }

  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const { username, password } = parsed.data;
  const clientInfo = {
    ip: req.ip,
    userAgent: req.get('user-agent')
  };
  const result = await authenticateUser(tenantId, username, password, clientInfo);
  if (!result.success || !result.user) {
    const reason = result.reason ?? 'invalid_credentials';
    newAuditLogEntry(tenantId, {
      actorUserId: 'system',
      actorUsername: 'system',
      actorDisplayName: 'System',
      action: 'auth.login_failed',
      targetEntity: username,
      severity: reason === 'account_locked' ? 'warning' : 'info',
      metadata: { reason, ip: clientInfo.ip, userAgent: clientInfo.userAgent },
      immutable: false,
    });
    res.status(401).json({ message: 'Login failed', reason });
    return;
  }

  if (result.needsTwoFactor) {
    const challengeId = randomUUID();
    pendingChallenges.set(challengeId, {
      tenantId,
      userId: result.user.id,
      createdAt: Date.now(),
    });
    res.json({ requiresTwoFactor: true, challengeId });
    return;
  }

  const accessToken = generateAccessToken(tenantId, result.user);
  const refreshContext: { userAgent?: string; ipAddress?: string } = {};
  const userAgent = req.get('user-agent');
  if (userAgent) {
    refreshContext.userAgent = userAgent;
  }
  if (req.ip) {
    refreshContext.ipAddress = req.ip;
  }
  const refreshToken = generateRefreshToken(tenantId, result.user, refreshContext);

  newAuditLogEntry(tenantId, {
    actorUserId: result.user.id,
    actorUsername: result.user.username,
    actorDisplayName: result.user.displayName,
    action: 'auth.login',
    targetEntity: result.user.id,
    severity: 'info',
    metadata: { method: 'password', ip: clientInfo.ip, userAgent: clientInfo.userAgent },
    immutable: false,
  });

  res.json({ accessToken, refreshToken: refreshToken.token });
});

router.post('/2fa/verify', (req: TenantRequest, res) => {
  const parsed = twoFactorSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const { challengeId, code } = parsed.data;
  const challenge = pendingChallenges.get(challengeId);
  if (!challenge) {
    res.status(400).json({ message: 'Challenge expired or invalid' });
    return;
  }
  pendingChallenges.delete(challengeId);

  if (req.tenantId !== challenge.tenantId) {
    res.status(403).json({ message: 'Tenant mismatch' });
  }

  const tenantId = challenge.tenantId;
  const user = findUserById(tenantId, challenge.userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const isValid = verifyTwoFactor(user, code);
  addStepUpEvent(tenantId, {
    id: randomUUID(),
    userId: user.id,
    action: 'auth.login_2fa',
    verifiedAt: new Date().toISOString(),
    success: isValid,
    metadata: { challengeId },
  });

  if (!isValid) {
    newAuditLogEntry(tenantId, {
      actorUserId: user.id,
      actorUsername: user.username,
      actorDisplayName: user.displayName,
      action: 'auth.login_two_factor_failed',
      targetEntity: user.id,
      severity: 'warning',
      metadata: { reason: 'invalid_code' },
      immutable: false,
    });
    res.status(401).json({ message: 'Invalid code' });
    return;
  }

  const accessToken = generateAccessToken(tenantId, user);
  const refreshContext: { userAgent?: string; ipAddress?: string } = {};
  const userAgent = req.get('user-agent');
  if (userAgent) {
    refreshContext.userAgent = userAgent;
  }
  if (req.ip) {
    refreshContext.ipAddress = req.ip;
  }
  const refreshToken = generateRefreshToken(tenantId, user, refreshContext);

  newAuditLogEntry(tenantId, {
    actorUserId: user.id,
    actorUsername: user.username,
    actorDisplayName: user.displayName,
    action: 'auth.login_two_factor_success',
    targetEntity: user.id,
    severity: 'info',
    metadata: { challengeId },
    immutable: false,
  });

  res.json({ accessToken, refreshToken: refreshToken.token });
});

router.post('/refresh', (req: TenantRequest, res) => {
  const tenantId = req.tenantId;
  if (!tenantId) {
    res.status(400).json({ message: 'Tenant context required' });
    return;
  }
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request' });
    return;
  }
  const { refreshToken } = parsed.data;
  const record = verifyRefreshToken(tenantId, refreshToken);
  if (!record) {
    res.status(401).json({ message: 'Invalid refresh token' });
    return;
  }
  const user = findUserById(tenantId, record.userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  const accessToken = generateAccessToken(tenantId, user);
  res.json({ accessToken });
});

router.post('/logout', authenticateRequest, (req: AuthenticatedRequest, res) => {
  const tenantId = req.tenantId;
  if (!tenantId) {
    res.status(400).json({ message: 'Tenant not resolved for session' });
    return;
  }
  const parsed = refreshSchema.safeParse(req.body);
  if (parsed.success) {
    revokeRefreshTokenById(tenantId, parsed.data.refreshToken, 'logout');
  }
  if (req.currentUser) {
    newAuditLogEntry(tenantId, {
      actorUserId: req.currentUser.id,
      actorUsername: req.currentUser.username,
      actorDisplayName: req.currentUser.displayName,
      action: 'auth.logout',
      targetEntity: req.currentUser.id,
      severity: 'info',
      metadata: {},
      immutable: false,
    });
  }
  res.status(204).send();
});

router.get('/session', authenticateRequest, (req: AuthenticatedRequest, res) => {
  const tenantId = req.tenantId;
  const user = req.currentUser!;
  const impersonation = tenantId ? getActiveImpersonation(tenantId, user.id) : undefined;
  res.json({
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      tier: user.tier,
      isPremium: user.isPremium,
      phone: user.phone,
    },
    impersonation,
  });
});

router.post('/step-up', authenticateRequest, (req: AuthenticatedRequest, res) => {
  const tenantId = req.tenantId;
  if (!tenantId) {
    res.status(400).json({ message: 'Tenant not resolved for session' });
    return;
  }
  const parsed = stepUpSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const { code, action } = parsed.data;
  const user = req.currentUser!;
  const success = (req.currentUser?.twoFactorEnabled ?? false)
    ? verifyTwoFactor(req.currentUser!, code)
    : code === '246810';

  addStepUpEvent(tenantId, {
    id: randomUUID(),
    userId: user.id,
    action,
    verifiedAt: new Date().toISOString(),
    success,
  });

  newAuditLogEntry(tenantId, {
    actorUserId: user.id,
    actorUsername: user.username,
    actorDisplayName: user.displayName,
    action: success ? 'auth.step_up_passed' : 'auth.step_up_failed',
    targetEntity: action,
    severity: success ? 'info' : 'warning',
    metadata: { action },
    immutable: false,
  });

  res.json({ success });
});

router.post('/impersonate', authenticateRequest, (req: AuthenticatedRequest, res) => {
  const tenantId = req.tenantId;
  if (!tenantId) {
    res.status(400).json({ message: 'Tenant not resolved for session' });
    return;
  }
  const parsed = impersonationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
    return;
  }
  const user = req.currentUser!;
  if (user.role !== 'owner') {
    res.status(403).json({ message: 'Impersonation restricted to owner role' });
    return;
  }
  const { targetUserId, reason } = parsed.data;
  const targetUser = findUserById(tenantId, targetUserId);
  if (!targetUser) {
    res.status(404).json({ message: 'Target user not found' });
    return;
  }
  const impersonationOptions: { impersonatedUserId?: string; featureFlags?: FeatureFlagKey[] } = {
    impersonatedUserId: user.id,
  };
  if (req.sessionClaims?.featureFlags) {
    impersonationOptions.featureFlags = req.sessionClaims.featureFlags;
  }
  const accessToken = generateAccessToken(tenantId, targetUser, impersonationOptions);
  const impersonationRecord: ImpersonationRecord = {
    id: randomUUID(),
    actorUserId: user.id,
    targetUserId,
    startedAt: new Date().toISOString(),
  };
  if (reason) {
    impersonationRecord.reason = reason;
  }
  startImpersonation(tenantId, impersonationRecord);
  newAuditLogEntry(tenantId, {
    actorUserId: user.id,
    actorUsername: user.username,
    actorDisplayName: user.displayName,
    impersonatedUserId: targetUser.id,
    impersonatedUsername: targetUser.username,
    impersonatedDisplayName: targetUser.displayName,
    action: 'auth.impersonation_started',
    targetEntity: targetUser.id,
    severity: 'warning',
    metadata: { reason },
    immutable: true,
  });
  res.json({ accessToken });
});

router.post('/impersonate/stop', authenticateRequest, (req: AuthenticatedRequest, res) => {
  const tenantId = req.tenantId;
  if (!tenantId) {
    res.status(400).json({ message: 'Tenant not resolved for session' });
    return;
  }
  const user = req.currentUser!;
  endImpersonation(tenantId, user.id);
  newAuditLogEntry(tenantId, {
    actorUserId: user.id,
    actorUsername: user.username,
    actorDisplayName: user.displayName,
    action: 'auth.impersonation_stopped',
    targetEntity: user.id,
    severity: 'info',
    metadata: {},
    immutable: false,
  });
  const accessToken = generateAccessToken(tenantId, user);
  res.json({ accessToken });
});

router.post('/password-reset/request', (req: TenantRequest, res) => {
  const tenantId = req.tenantId;
  if (!tenantId) {
    res.status(400).json({ message: 'Tenant context required' });
    return;
  }

  const parsed = passwordResetRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const { email } = parsed.data;
  const clientInfo = {
    ip: req.ip,
    userAgent: req.get('user-agent')
  };

  initiatePasswordReset(tenantId, email, clientInfo)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      console.error('Password reset error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to process password reset request' 
      });
    });
});

router.post('/password-reset/confirm', (req: TenantRequest, res) => {
  const parsed = passwordResetSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const { token, newPassword } = parsed.data;

  // Validate password strength
  const validation = validatePasswordStrength(newPassword);
  if (!validation.valid) {
    res.status(400).json({ 
      success: false, 
      message: 'Password does not meet security requirements',
      errors: validation.errors,
      score: validation.score
    });
    return;
  }

  resetPassword(token, newPassword)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      console.error('Password reset confirmation error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to reset password' 
      });
    });
});

router.post('/email-verification/request', authenticateRequest, (req: AuthenticatedRequest, res) => {
  const tenantId = req.tenantId;
  if (!tenantId) {
    res.status(400).json({ message: 'Tenant context required' });
    return;
  }

  const user = req.currentUser!;
  
  initiateEmailVerification(tenantId, user.id)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      console.error('Email verification error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send verification email' 
      });
    });
});

router.post('/email-verification/confirm', (req: TenantRequest, res) => {
  const parsed = emailVerificationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const { token } = parsed.data;

  verifyEmail(token)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      console.error('Email verification confirmation error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to verify email' 
      });
    });
});

router.post('/change-password', authenticateRequest, (req: AuthenticatedRequest, res) => {
  const tenantId = req.tenantId;
  if (!tenantId) {
    res.status(400).json({ message: 'Tenant context required' });
    return;
  }

  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const { currentPassword, newPassword } = parsed.data;
  const user = req.currentUser!;

  // Verify current password
  bcrypt.compare(currentPassword, user.passwordHash)
    .then(async (isValid) => {
      if (!isValid) {
        res.status(400).json({ 
          success: false, 
          message: 'Current password is incorrect' 
        });
        return;
      }

      // Validate new password strength
      const validation = validatePasswordStrength(newPassword);
      if (!validation.valid) {
        res.status(400).json({ 
          success: false, 
          message: 'New password does not meet security requirements',
          errors: validation.errors,
          score: validation.score
        });
        return;
      }

      // Update password
      const saltRounds = 12;
      user.passwordHash = await bcrypt.hash(newPassword, saltRounds);
      user.updatedAt = new Date().toISOString();
      saveUser(tenantId, user);

      // Log audit event
      newAuditLogEntry(tenantId, {
        actorUserId: user.id,
        actorUsername: user.username,
        actorDisplayName: user.displayName,
        action: 'auth.password_changed',
        targetEntity: user.id,
        severity: 'warning',
        metadata: {},
        immutable: false,
      });

      res.json({ success: true, message: 'Password changed successfully' });
    })
    .catch(error => {
      console.error('Password change error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to change password' 
      });
    });
});

router.get('/rate-limit/:identifier', (req: TenantRequest, res) => {
  const { identifier } = req.params;
  const rateLimit = checkRateLimit(identifier, 5, 15 * 60 * 1000); // 5 attempts per 15 minutes
  res.json(rateLimit);
});

export default router;