/**
 * API Accounts Endpoint
 *
 * Fetch accounts available for expense entry (non-bank-linked only).
 * Requires authentication via Bearer token.
 *
 * GET /api-accounts?includeInactive=false&excludeBankLinked=true
 * Headers: Authorization: Bearer <token>
 * Response: { success: boolean, accounts: ApiAccount[], timestamp: string }
 */

import { createClient } from 'npm:@supabase/supabase-js@2';

interface ApiAccount {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  institution: string;
  isActive: boolean;
}

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
    const includeInactive = url.searchParams.get('includeInactive') === 'true';
    const excludeBankLinked = url.searchParams.get('excludeBankLinked') !== 'false';

    let query = supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id);

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data: accounts, error: accountsError } = await query.order('created_at', {
      ascending: false,
    });

    if (accountsError) {
      throw accountsError;
    }

    let filteredAccounts = accounts || [];

    if (excludeBankLinked) {
      const { data: bankConnections } = await supabase
        .from('bank_connections')
        .select('institution_id')
        .eq('user_id', user.id)
        .eq('status', 'active');

      const bankLinkedInstitutions = new Set(
        (bankConnections || []).map((bc) => bc.institution_id)
      );

      filteredAccounts = filteredAccounts.filter(
        (account) => !bankLinkedInstitutions.has(account.institution)
      );
    }

    const apiAccounts: ApiAccount[] = filteredAccounts.map((account) => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: Number(account.balance),
      currency: account.currency,
      institution: account.institution,
      isActive: account.is_active,
    }));

    const response = {
      success: true,
      accounts: apiAccounts,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Accounts error:', error);

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
