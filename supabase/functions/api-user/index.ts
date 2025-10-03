/**
 * API User Endpoint
 *
 * Fetch minimal user info: name, email, subscription tier, role.
 * Includes rate limit information.
 *
 * GET /api-user
 * Headers: Authorization: Bearer <token>
 * Response: { success: boolean, user: ApiUser, rateLimit: RateLimitInfo }
 */

import { createClient } from 'npm:@supabase/supabase-js@2';

interface ApiUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: string;
  tier: string;
  isPremium: boolean;
}

interface RateLimitInfo {
  tier: string;
  requestsPerMinute: number;
  requestsRemaining: number;
  resetAt: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const RATE_LIMITS: Record<string, number> = {
  free: 30,
  advanced: 60,
  premium: 120,
  family: 180,
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

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'User profile not found',
          code: 'USER_NOT_FOUND',
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const apiUser: ApiUser = {
      id: userData.id,
      email: userData.email,
      username: userData.username,
      displayName: userData.display_name,
      role: userData.role,
      tier: userData.tier,
      isPremium: userData.is_premium,
    };

    const tier = userData.tier;
    const limit = RATE_LIMITS[tier] || RATE_LIMITS.free;

    const rateLimit: RateLimitInfo = {
      tier,
      requestsPerMinute: limit,
      requestsRemaining: limit,
      resetAt: new Date(Date.now() + 60000).toISOString(),
    };

    const response = {
      success: true,
      user: apiUser,
      rateLimit,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('User info error:', error);

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
