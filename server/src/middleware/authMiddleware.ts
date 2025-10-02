import type { Request, Response, NextFunction } from 'express';
import { decodeAccessToken, getUserFromClaims } from '../services/authService';
import { TenantNotFoundError } from '../data/store';
import type { SessionClaims, UserRecord, UserRole } from '../types';
import type { TenantRequest } from './tenantMiddleware';

const normalizeTenantId = (tenantId: string): string => tenantId.trim().toLowerCase();

export interface AuthenticatedRequest extends TenantRequest {
  sessionClaims?: SessionClaims;
  currentUser?: UserRecord;
}

export const authenticateRequest = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Missing authorization header' });
    return;
  }
  const [scheme, token] = authHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    res.status(401).json({ message: 'Invalid authorization header' });
    return;
  }

  const claims = decodeAccessToken(token);
  if (!claims || !claims.customerId) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }

  const claimTenant = normalizeTenantId(claims.customerId);
  
  // Validate tenant from middleware matches token tenant
  if (req.tenantId && req.tenantId !== claimTenant) {
    res.status(403).json({ message: 'Tenant mismatch' });
    return;
  }

  try {
    const user = getUserFromClaims({ ...claims, customerId: claimTenant });
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.sessionClaims = { ...claims, customerId: claimTenant };
    req.currentUser = user;
    req.tenantId = claimTenant;
    next();
  } catch (error) {
    if (error instanceof TenantNotFoundError) {
      res.status(404).json({ 
        message: 'Tenant not found',
        tenantId: error.tenantId 
      });
      return;
    }
    res.status(500).json({ message: 'Authentication error' });
  }
};

export const requireRole = (allowed: UserRole[]) => (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.currentUser) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }
  if (!allowed.includes(req.currentUser.role)) {
    res.status(403).json({ message: 'Insufficient permissions' });
    return;
  }
  next();
};
