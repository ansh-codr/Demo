import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = "https://ydmmtxxwgliwwblwweca.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkbW10eHh3Z2xpd3dibHd3ZWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NjczOTQsImV4cCI6MjA3MTU0MzM5NH0.CsqiyMvcnjPNhaMA8H7DPq2VvniEpBH3GRiXI1WMaOA";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      throw new Error('Invalid authentication');
    }

    if (req.method === 'GET') {
      // Get user's dashboard statistics
      const { data: profile } = await supabase
        .from('profiles')
        .select('api_calls_used, role')
        .eq('user_id', user.id)
        .single();

      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const { data: recentProducts } = await supabase
        .from('products')
        .select('id, product_name, category, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // If user is admin, get system-wide stats
      let systemStats = null;
      if (profile?.role === 'admin') {
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        const { count: totalSystemProducts } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        const { data: apiUsage } = await supabase
          .from('profiles')
          .select('api_calls_used');

        const totalApiCalls = apiUsage?.reduce((sum, profile) => sum + (profile.api_calls_used || 0), 0) || 0;

        systemStats = {
          totalUsers: totalUsers || 0,
          totalSystemProducts: totalSystemProducts || 0,
          totalApiCalls
        };
      }

      const dashboardData = {
        user: {
          id: user.id,
          email: user.email,
          role: profile?.role || 'user'
        },
        stats: {
          apiCallsUsed: profile?.api_calls_used || 0,
          totalProducts: totalProducts || 0,
          recentProducts: recentProducts || []
        },
        systemStats
      };

      console.log('Dashboard data retrieved for user:', user.id);

      return new Response(JSON.stringify(dashboardData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in dashboard function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});