import { Router } from 'express';
import type { Response } from 'express';
import { z } from 'zod';
import { authenticateRequest, requireRole } from '../middleware/authMiddleware';
import type { AuthenticatedRequest } from '../middleware/authMiddleware';
import { extractTenantMiddleware, validateTenantMiddleware } from '../middleware/tenantMiddleware';
import {
  listAllTenants,
  getTenantDetails,
  createTenant,
  deleteTenant,
  getTenantUsage,
  validateTenantId
} from '../services/tenantService';
import { newAuditLogEntry } from '../data/store';

const router = Router();

// Apply tenant middleware
router.use(extractTenantMiddleware);
router.use(validateTenantMiddleware);

const createTenantSchema = z.object({
  tenantId: z.string().min(3).max(50),
  name: z.string().min(1).max(100),
  ownerUser: z.object({
    username: z.string().min(3).max(50),
    displayName: z.string().min(1).max(100),
    email: z.string().email(),
    password: z.string().min(8)
  })
});

const deleteTenantSchema = z.object({
  confirmationText: z.string(),
  reason: z.string().optional()
});

// List all tenants (super admin only)
router.get('/list', authenticateRequest, requireRole(['owner']), (req: AuthenticatedRequest, res) => {
  try {
    const tenants = listAllTenants();
    res.json({ tenants });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to list tenants',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get current tenant details
router.get('/current', authenticateRequest, (req: AuthenticatedRequest, res) => {
  const tenantId = req.tenantId;
  if (!tenantId) {
    res.status(400).json({ message: 'Tenant context required' });
    return;
  }

  try {
    const details = getTenantDetails(tenantId);
    if (!details) {
      res.status(404).json({ message: 'Tenant not found' });
      return;
    }

    const usage = getTenantUsage(tenantId);
    res.json({ ...details, usage });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to get tenant details',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create new tenant (super admin only - disabled in demo)
router.post('/create', authenticateRequest, requireRole(['owner']), (req: AuthenticatedRequest, res) => {
  const parsed = createTenantSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ 
      message: 'Invalid request', 
      details: parsed.error.flatten() 
    });
    return;
  }

  // For demo mode, always return error
  res.status(403).json({
    message: 'Tenant creation disabled in demo mode',
    availableTenants: ['demo-instance', 'aurora-family']
  });
});

// Validate tenant ID availability
router.post('/validate', authenticateRequest, requireRole(['owner']), (req: AuthenticatedRequest, res) => {
  const { tenantId } = req.body;
  if (!tenantId) {
    res.status(400).json({ message: 'Tenant ID required' });
    return;
  }

  const validation = validateTenantId(tenantId);
  res.json(validation);
});

// Delete tenant (super admin only)
router.delete('/:targetTenantId', authenticateRequest, requireRole(['owner']), (req: AuthenticatedRequest, res) => {
  const targetTenantId = req.params.targetTenantId;
  const currentTenantId = req.tenantId;

  if (!targetTenantId) {
    res.status(400).json({ message: 'Target tenant ID required' });
    return;
  }

  if (targetTenantId === currentTenantId) {
    res.status(400).json({ message: 'Cannot delete current tenant from within itself' });
    return;
  }

  const parsed = deleteTenantSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ 
      message: 'Invalid request', 
      details: parsed.error.flatten() 
    });
    return;
  }

  if (parsed.data.confirmationText !== `delete-${targetTenantId}`) {
    res.status(400).json({ 
      message: 'Confirmation text must match format: delete-{tenantId}' 
    });
    return;
  }

  // For demo mode, prevent actual deletion
  res.status(403).json({
    message: 'Tenant deletion disabled in demo mode',
    note: 'In production, this would permanently delete all tenant data'
  });
});

// Get tenant usage statistics
router.get('/usage', authenticateRequest, requireRole(['owner', 'manager']), (req: AuthenticatedRequest, res) => {
  const tenantId = req.tenantId;
  if (!tenantId) {
    res.status(400).json({ message: 'Tenant context required' });
    return;
  }

  try {
    const usage = getTenantUsage(tenantId);
    if (!usage) {
      res.status(404).json({ message: 'Tenant not found' });
      return;
    }

    res.json(usage);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to get tenant usage',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;