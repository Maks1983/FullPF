/**
 * API Transactions Endpoint
 *
 * Batch insert new expenses from mobile app.
 * Validates and stores in database with full RBAC enforcement.
 *
 * POST /api-transactions
 * Headers: Authorization: Bearer <token>
 * Body: { transactions: ApiTransaction[] }
 * Response: { success: boolean, results: TransactionResult[], processed: number, failed: number }
 */

import { createClient } from 'npm:@supabase/supabase-js@2';

interface ApiTransaction {
  accountId: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense' | 'transfer';
  notes?: string;
  clientId?: string;
}

interface TransactionResult {
  clientId?: string;
  id?: string;
  success: boolean;
  error?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const MAX_BATCH_SIZE = 50;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Method not allowed',
        code: 'METHOD_NOT_ALLOWED',
      }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing or invalid authorization header',
          code: 'UNAUTHORIZED',
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const token = authHeader.substring(7);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid or expired token',
          code: 'INVALID_TOKEN',
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { transactions } = (await req.json()) as { transactions: ApiTransaction[] };

    if (!Array.isArray(transactions)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Transactions must be an array',
          code: 'INVALID_INPUT',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (transactions.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          results: [],
          processed: 0,
          failed: 0,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (transactions.length > MAX_BATCH_SIZE) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Batch size exceeds maximum of ${MAX_BATCH_SIZE}`,
          code: 'BATCH_TOO_LARGE',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', user.id);

    if (accountsError) {
      throw accountsError;
    }

    const userAccountIds = new Set((accounts || []).map((a) => a.id));

    const results: TransactionResult[] = [];
    let processed = 0;
    let failed = 0;

    for (const txn of transactions) {
      try {
        if (!userAccountIds.has(txn.accountId)) {
          results.push({
            clientId: txn.clientId,
            success: false,
            error: 'Account not found or access denied',
          });
          failed++;
          continue;
        }

        if (!txn.description || !txn.amount || !txn.type) {
          results.push({
            clientId: txn.clientId,
            success: false,
            error: 'Missing required fields',
          });
          failed++;
          continue;
        }

        const { data: inserted, error: insertError } = await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            account_id: txn.accountId,
            date: txn.date || new Date().toISOString().split('T')[0],
            description: txn.description,
            amount: txn.amount,
            category: txn.category || 'uncategorized',
            type: txn.type,
            notes: txn.notes || '',
          })
          .select('id')
          .single();

        if (insertError) {
          results.push({
            clientId: txn.clientId,
            success: false,
            error: insertError.message,
          });
          failed++;
        } else {
          results.push({
            clientId: txn.clientId,
            id: inserted.id,
            success: true,
          });
          processed++;
        }
      } catch (error) {
        results.push({
          clientId: txn.clientId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        failed++;
      }
    }

    const response = {
      success: true,
      results,
      processed,
      failed,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Transactions error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
