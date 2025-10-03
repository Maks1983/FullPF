/**
 * Transactions Routes
 * GET /api/v1/transactions - Get user transactions
 * POST /api/v1/transactions/batch - Batch create/update transactions (offline sync)
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticate } = require('../middleware/auth');
const { tierBasedRateLimit } = require('../middleware/rateLimit');
const { createError } = require('../middleware/errorHandler');
const db = require('../db');

const router = express.Router();

// All routes require authentication
router.use(authenticate);
router.use(tierBasedRateLimit);

/**
 * GET /api/v1/transactions
 * Get transactions for authenticated user with optional filters
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user!.id;
    const {
      accountId,
      startDate,
      endDate,
      category,
      limit = '100',
      offset = '0',
    } = req.query;

    let query = `
      SELECT
        t.id,
        t.account_id as accountId,
        t.transaction_date as transactionDate,
        t.description,
        t.amount,
        t.category,
        t.transaction_type as transactionType,
        t.merchant_name as merchantName,
        t.pending,
        t.tags,
        t.metadata,
        t.created_at as createdAt,
        t.updated_at as updatedAt,
        a.account_name as accountName,
        a.account_type as accountType
      FROM transactions t
      JOIN accounts a ON t.account_id = a.id
      WHERE t.user_id = ?
    `;

    const params: any[] = [userId];

    if (accountId) {
      query += ' AND t.account_id = ?';
      params.push(accountId);
    }

    if (startDate) {
      query += ' AND t.transaction_date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND t.transaction_date <= ?';
      params.push(endDate);
    }

    if (category) {
      query += ' AND t.category = ?';
      params.push(category);
    }

    query += ' ORDER BY t.transaction_date DESC, t.created_at DESC';
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), parseInt(offset as string));

    const [rows] = await db.query(query, params);

    // Parse JSON fields
    const transactions = (rows as any[]).map(txn => ({
      ...txn,
      tags: txn.tags ? JSON.parse(txn.tags) : [],
      metadata: txn.metadata ? JSON.parse(txn.metadata) : null,
    }));

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total
      FROM transactions t
      WHERE t.user_id = ?
    `;
    const countParams: any[] = [userId];

    if (accountId) {
      countQuery += ' AND t.account_id = ?';
      countParams.push(accountId);
    }
    if (startDate) {
      countQuery += ' AND t.transaction_date >= ?';
      countParams.push(startDate);
    }
    if (endDate) {
      countQuery += ' AND t.transaction_date <= ?';
      countParams.push(endDate);
    }
    if (category) {
      countQuery += ' AND t.category = ?';
      countParams.push(category);
    }

    const [countRows] = await db.query(countQuery, countParams);
    const total = (countRows as any[])[0].total;

    res.json({
      transactions,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: parseInt(offset as string) + transactions.length < total,
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      error: 'Failed to fetch transactions',
    });
  }
});

/**
 * POST /api/v1/transactions/batch
 * Batch create or update transactions (for offline sync)
 */
router.post('/batch', async (req, res) => {
  try {
    const userId = req.user!.id;
    const { transactions } = req.body;

    if (!Array.isArray(transactions) || transactions.length === 0) {
      throw createError('Transactions array is required', 400);
    }

    if (transactions.length > 100) {
      throw createError('Maximum 100 transactions per batch', 400);
    }

    const results = {
      created: 0,
      updated: 0,
      errors: [] as any[],
    };

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      for (const txn of transactions) {
        try {
          // Validate account belongs to user
          const [accountRows] = await connection.query(
            'SELECT id FROM accounts WHERE id = ? AND user_id = ?',
            [txn.accountId, userId]
          );

          if (!Array.isArray(accountRows) || accountRows.length === 0) {
            results.errors.push({
              transaction: txn,
              error: 'Account not found or unauthorized',
            });
            continue;
          }

          // Check if transaction already exists (by external_id in metadata)
          let existingTxnId: string | null = null;
          if (txn.metadata?.external_id) {
            const [existing] = await connection.query(
              `SELECT id FROM transactions
               WHERE user_id = ? AND JSON_EXTRACT(metadata, '$.external_id') = ?`,
              [userId, txn.metadata.external_id]
            );
            if (Array.isArray(existing) && existing.length > 0) {
              existingTxnId = (existing[0] as any).id;
            }
          }

          if (existingTxnId) {
            // Update existing transaction
            await connection.query(
              `UPDATE transactions SET
                account_id = ?,
                transaction_date = ?,
                description = ?,
                amount = ?,
                category = ?,
                transaction_type = ?,
                merchant_name = ?,
                pending = ?,
                tags = ?,
                metadata = ?,
                updated_at = NOW()
               WHERE id = ? AND user_id = ?`,
              [
                txn.accountId,
                txn.transactionDate,
                txn.description,
                txn.amount,
                txn.category || null,
                txn.transactionType || 'debit',
                txn.merchantName || null,
                txn.pending || false,
                JSON.stringify(txn.tags || []),
                JSON.stringify(txn.metadata || {}),
                existingTxnId,
                userId,
              ]
            );
            results.updated++;
          } else {
            // Create new transaction
            const newId = txn.id || uuidv4();
            await connection.query(
              `INSERT INTO transactions (
                id, account_id, user_id, transaction_date, description,
                amount, category, transaction_type, merchant_name, pending,
                tags, metadata
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                newId,
                txn.accountId,
                userId,
                txn.transactionDate,
                txn.description,
                txn.amount,
                txn.category || null,
                txn.transactionType || 'debit',
                txn.merchantName || null,
                txn.pending || false,
                JSON.stringify(txn.tags || []),
                JSON.stringify(txn.metadata || {}),
              ]
            );
            results.created++;
          }

          // Update account balance
          await connection.query(
            `UPDATE accounts SET
              balance = balance + ?,
              updated_at = NOW()
             WHERE id = ? AND user_id = ?`,
            [txn.amount, txn.accountId, userId]
          );
        } catch (error: any) {
          results.errors.push({
            transaction: txn,
            error: error.message,
          });
        }
      }

      await connection.commit();
      connection.release();

      res.json({
        success: true,
        results,
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error: any) {
    console.error('Batch transactions error:', error);
    if (error.statusCode) {
      res.status(error.statusCode).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Failed to process batch transactions',
      });
    }
  }
});

module.exports = router;
