import type { Request, Response, NextFunction } from 'express';
import { TenantNotFoundError } from '../data/store';

export const TENANT_HEADER = 'x-tenant-id';

export interface TenantRequest extends Request {
  tenantId?: string;
}

const normalizeTenantId = (tenantId: string): string => tenantId.trim().toLowerCase();

export const extractTenantMiddleware = (
  req: TenantRequest,
  res: Response,
  next: NextFunction,
): void => {
  const rawTenant = req.get(TENANT_HEADER);
  if (!rawTenant) {
    res.status(400).json({ 
      error: 'TENANT_REQUIRED',
      message: 'Missing tenant header. Include X-Tenant-ID in your request.' 
    });
    return;
  }

  const tenantId = normalizeTenantId(rawTenant);
  if (!tenantId || tenantId.length < 3) {
    res.status(400).json({ 
      error: 'INVALID_TENANT',
      message: 'Tenant ID must be at least 3 characters long.' 
    });
    return;
  }

  req.tenantId = tenantId;
  next();
};

export const validateTenantMiddleware = (
  req: TenantRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.tenantId) {
    res.status(500).json({ 
      error: 'TENANT_NOT_EXTRACTED',
      message: 'Tenant ID was not extracted. Ensure extractTenantMiddleware runs first.' 
    });
    return;
  }

  try {
    // This will throw TenantNotFoundError if tenant doesn't exist
    // The store will handle tenant validation
    next();
  } catch (error) {
    if (error instanceof TenantNotFoundError) {
      res.status(404).json({ 
        error: 'TENANT_NOT_FOUND',
        message: `Tenant '${error.tenantId}' not found. Contact support if this is unexpected.`,
        tenantId: error.tenantId
      });
      return;
    }
    
    res.status(500).json({ 
      error: 'TENANT_VALIDATION_ERROR',
      message: 'Failed to validate tenant access.' 
    });
  }
};

export const requireTenant = (req: TenantRequest, res: Response): string | null => {
  if (!req.tenantId) {
    res.status(400).json({ 
      error: 'TENANT_REQUIRED',
      message: 'Tenant context is required for this operation.' 
    });
    return null;
  }
  return req.tenantId;
};