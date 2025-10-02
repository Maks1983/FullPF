import { randomUUID } from 'crypto';
import { getInitialTenantState, knownTenantIds } from '../data/initialData';
import { resetState, getState } from '../data/store';
import type { AppState, UserRecord, LicenseState } from '../types';

export interface TenantInfo {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'deleted';
  createdAt: string;
  lastActiveAt: string;
  userCount: number;
  licenseStatus: 'valid' | 'expiring' | 'expired';
  licenseExpiresAt: string;
}

export interface CreateTenantRequest {
  tenantId: string;
  name: string;
  ownerUser: {
    username: string;
    displayName: string;
    email: string;
    password: string;
  };
  license?: Partial<LicenseState>;
}

export interface TenantCreationResult {
  success: boolean;
  tenantId?: string;
  message: string;
  errors?: string[];
}

/**
 * List all known tenants with basic metadata
 */
export const listAllTenants = (): TenantInfo[] => {
  return knownTenantIds.map(tenantId => {
    try {
      const state = getState(tenantId);
      const userCount = state.users.length;
      const license = state.license;
      
      return {
        id: tenantId,
        name: tenantId.charAt(0).toUpperCase() + tenantId.slice(1).replace('-', ' '),
        status: 'active' as const,
        createdAt: '2024-01-01T00:00:00.000Z', // Mock data
        lastActiveAt: new Date().toISOString(),
        userCount,
        licenseStatus: license.status,
        licenseExpiresAt: license.expiresAt
      };
    } catch (error) {
      return {
        id: tenantId,
        name: tenantId,
        status: 'suspended' as const,
        createdAt: '2024-01-01T00:00:00.000Z',
        lastActiveAt: '2024-01-01T00:00:00.000Z',
        userCount: 0,
        licenseStatus: 'expired' as const,
        licenseExpiresAt: '2024-01-01T00:00:00.000Z'
      };
    }
  });
};

/**
 * Get detailed tenant information
 */
export const getTenantDetails = (tenantId: string): TenantInfo | null => {
  try {
    const state = getState(tenantId);
    const userCount = state.users.length;
    const license = state.license;
    
    return {
      id: tenantId,
      name: tenantId.charAt(0).toUpperCase() + tenantId.slice(1).replace('-', ' '),
      status: 'active',
      createdAt: '2024-01-01T00:00:00.000Z', // Mock data
      lastActiveAt: new Date().toISOString(),
      userCount,
      licenseStatus: license.status,
      licenseExpiresAt: license.expiresAt
    };
  } catch (error) {
    return null;
  }
};

/**
 * Validate tenant ID format and availability
 */
export const validateTenantId = (tenantId: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!tenantId || tenantId.trim().length === 0) {
    errors.push('Tenant ID is required');
  }
  
  if (tenantId.length < 3) {
    errors.push('Tenant ID must be at least 3 characters');
  }
  
  if (tenantId.length > 50) {
    errors.push('Tenant ID must be less than 50 characters');
  }
  
  if (!/^[a-z0-9-]+$/.test(tenantId)) {
    errors.push('Tenant ID can only contain lowercase letters, numbers, and hyphens');
  }
  
  if (tenantId.startsWith('-') || tenantId.endsWith('-')) {
    errors.push('Tenant ID cannot start or end with a hyphen');
  }
  
  if (knownTenantIds.includes(tenantId)) {
    errors.push('Tenant ID already exists');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Create a new tenant (for future multi-tenant provisioning)
 * Currently returns error as we're using pre-seeded tenants
 */
export const createTenant = async (request: CreateTenantRequest): Promise<TenantCreationResult> => {
  const validation = validateTenantId(request.tenantId);
  if (!validation.valid) {
    return {
      success: false,
      message: 'Invalid tenant configuration',
      errors: validation.errors
    };
  }
  
  // For now, return error as we're using pre-seeded demo tenants
  return {
    success: false,
    message: 'Tenant creation is not available in demo mode. Use existing demo tenants: demo-instance, aurora-family',
    errors: ['Demo mode restriction']
  };
};

/**
 * Delete a tenant and all its data (dangerous operation)
 */
export const deleteTenant = async (tenantId: string): Promise<TenantCreationResult> => {
  try {
    // Validate tenant exists
    const state = getState(tenantId);
    if (!state) {
      return {
        success: false,
        message: 'Tenant not found',
        errors: ['Tenant does not exist']
      };
    }
    
    // Reset tenant state (effectively deletes all data)
    resetState(tenantId);
    
    return {
      success: true,
      tenantId,
      message: `Tenant ${tenantId} has been deleted and all data purged`
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete tenant',
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
};

/**
 * Get tenant usage statistics
 */
export const getTenantUsage = (tenantId: string) => {
  try {
    const state = getState(tenantId);
    
    return {
      tenantId,
      users: state.users.length,
      auditLogs: state.auditLogs.length,
      bankConnections: state.bankConnections.length,
      bankTokens: state.bankTokens.length,
      refreshTokens: state.refreshTokens.length,
      stepUpEvents: state.stepUpEvents.length,
      impersonations: state.impersonations.length,
      lastActivity: state.auditLogs[0]?.timestamp || null
    };
  } catch (error) {
    return null;
  }
};