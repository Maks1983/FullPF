/**
 * Sync Status Routes
 * GET /api/v1/sync/status - Get sync status for user's accounts
 */

const express = require('express');
const { authenticate } = require('../middleware/auth');
const { tierBasedRateLimit } = require('../middleware/rateLimit');
const db = require('../db');

const router = express.Router();

// All routes require authentication
router.use(authenticate);
router.use(tierBasedRateLimit);

/**
 * GET /api/v1/sync/status
 * Get sync status for all user's bank connections
 */
router.get('/status', async (req, res) => {
  try {
    const userId = req.user!.id;

    // Get bank connections with sync status
    const [connectionRows] = await db.query(
      `SELECT
        id,
        provider,
        institution_id as institutionId,
        institution_name as institutionName,
        status,
        connection_label as connectionLabel,
        failure_reason as failureReason,
        last_synced_at as lastSyncedAt,
        metadata,
        created_at as createdAt,
        updated_at as updatedAt
      FROM bank_connections
      WHERE user_id = ?
      ORDER BY institution_name`,
      [userId]
    );

    // Get account count per connection
    const connections = await Promise.all(
      (connectionRows as any[]).map(async (conn) => {
        const [accountRows] = await db.query(
          `SELECT COUNT(*) as count
           FROM accounts
           WHERE user_id = ? AND JSON_EXTRACT(metadata, '$.connection_id') = ?`,
          [userId, conn.id]
        );

        const accountCount = (accountRows as any[])[0]?.count || 0;

        return {
          ...conn,
          metadata: conn.metadata ? JSON.parse(conn.metadata) : null,
          accountCount,
        };
      })
    );

    // Get overall sync summary
    const needsSync = connections.filter(
      (c) => c.status === 'active' && (!c.lastSyncedAt || isStale(c.lastSyncedAt))
    ).length;

    const hasErrors = connections.filter((c) => c.status === 'error').length;

    res.json({
      connections,
      summary: {
        total: connections.length,
        active: connections.filter((c) => c.status === 'active').length,
        needsSync,
        hasErrors,
        lastSyncedAt: getLatestSyncTime(connections),
      },
    });
  } catch (error) {
    console.error('Get sync status error:', error);
    res.status(500).json({
      error: 'Failed to fetch sync status',
    });
  }
});

/**
 * Helper: Check if last sync is stale (older than 24 hours)
 */
function isStale(lastSyncedAt: Date | null): boolean {
  if (!lastSyncedAt) return true;
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return new Date(lastSyncedAt) < oneDayAgo;
}

/**
 * Helper: Get the most recent sync time across all connections
 */
function getLatestSyncTime(connections: any[]): Date | null {
  const syncTimes = connections
    .map((c) => c.lastSyncedAt)
    .filter((t) => t !== null)
    .map((t) => new Date(t));

  if (syncTimes.length === 0) return null;

  return new Date(Math.max(...syncTimes.map((t) => t.getTime())));
}

module.exports = router;
