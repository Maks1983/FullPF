/**
 * API Sync Status Endpoint
 *
 * Return last sync timestamp and pending transaction count.
 * Helps mobile app track sync status and show live/offline indicator.
 *
 * GET /api-sync-status?lastSyncTimestamp=2025-01-01T00:00:00Z
 * Headers: Authorization: Bearer <token>
 * Response: { success: boolean, lastSyncTimestamp: string, pendingCount: number, serverTime: string }
 */

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'GET') {
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

    const url = new URL(req.url);
    const lastSyncTimestamp = url.searchParams.get('lastSyncTimestamp');

    const { data: latestTransaction, error: txnError } = await supabase
      .from('transactions')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (txnError) {
      throw txnError;
    }

    const serverLatestTimestamp = latestTransaction
      ? latestTransaction.created_at
      : new Date(0).toISOString();

    let pendingCount = 0;
    let needsFullSync = false;

    if (lastSyncTimestamp) {
      try {
        const clientTimestamp = new Date(lastSyncTimestamp);
        const serverTimestamp = new Date(serverLatestTimestamp);

        if (serverTimestamp > clientTimestamp) {
          const { count, error: countError } = await supabase
            .from('transactions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', lastSyncTimestamp);

          if (countError) {
            throw countError;
          }

          pendingCount = count || 0;
        }

        const hoursDiff =
          (serverTimestamp.getTime() - clientTimestamp.getTime()) / (1000 * 60 * 60);
        if (hoursDiff > 24) {
          needsFullSync = true;
        }
      } catch {
        needsFullSync = true;
      }
    } else {
      needsFullSync = true;
    }

    const response = {
      success: true,
      lastSyncTimestamp: serverLatestTimestamp,
      pendingCount,
      serverTime: new Date().toISOString(),
      needsFullSync,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Sync status error:', error);

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
