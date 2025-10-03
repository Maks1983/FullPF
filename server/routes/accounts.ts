/**
 * Accounts Routes
 * GET /api/v1/accounts - Get user accounts
 */

import express, { Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { tierBasedRateLimit } from '../middleware/rateLimit';
import db from '../db';

const router = express.Router();

// All routes require authentication
router.use(authenticate);
router.use(tierBasedRateLimit);

/**
 * GET /api/v1/accounts
 * Get all accounts for authenticated user with balances
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const [rows] = await db.query(
      `SELECT
        id,
        account_name as accountName,
        account_type as accountType,
        institution_name as institutionName,
        balance,
        currency,
        is_active as isActive,
        account_number_last4 as accountNumberLast4,
        metadata,
        created_at as createdAt,
        updated_at as updatedAt
      FROM accounts
      WHERE user_id = ? AND is_active = TRUE
      ORDER BY account_type, account_name`,
      [userId]
    );

    // Parse metadata JSON
    const accounts = (rows as any[]).map(account => ({
      ...account,
      metadata: account.metadata ? JSON.parse(account.metadata) : null,
    }));

    res.json({
      accounts,
      totalBalance: accounts.reduce((sum, acc) => sum + Number(acc.balance), 0),
      count: accounts.length,
    });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({
      error: 'Failed to fetch accounts',
    });
  }
});

/**
 * GET /api/v1/accounts/:id
 * Get single account details
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const accountId = req.params.id;

    const [rows] = await db.query(
      `SELECT
        id,
        account_name as accountName,
        account_type as accountType,
        institution_name as institutionName,
        balance,
        currency,
        is_active as isActive,
        account_number_last4 as accountNumberLast4,
        metadata,
        created_at as createdAt,
        updated_at as updatedAt
      FROM accounts
      WHERE id = ? AND user_id = ?`,
      [accountId, userId]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({
        error: 'Account not found',
      });
      return;
    }

    const account = rows[0] as any;

    res.json({
      ...account,
      metadata: account.metadata ? JSON.parse(account.metadata) : null,
    });
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({
      error: 'Failed to fetch account',
    });
  }
});

export default router;
