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

    const url = new URL(req.url);
    const category = url.searchParams.get('category');

    switch (req.method) {
      case 'GET':
        let query = supabase.from('prompt_configurations').select('*');
        
        if (category) {
          // GET /api/prompts?category=electronics - Get specific category
          query = query.eq('category', category);
          
          const { data: prompt, error } = await query.single();
          
          if (error) {
            console.error('Error fetching prompt:', error);
            return new Response(JSON.stringify({ error: 'Prompt configuration not found' }), {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(prompt), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          // GET /api/prompts - Get all prompt configurations
          const { data: prompts, error } = await query.order('category');
          
          if (error) {
            console.error('Error fetching prompts:', error);
            return new Response(JSON.stringify({ error: 'Failed to fetch prompts' }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(prompts || []), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      case 'POST':
        // POST /api/prompts - Create new prompt configuration (admin only)
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          throw new Error('Authorization header required');
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
        if (userError || !user) {
          throw new Error('Invalid authentication');
        }

        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (!profile || profile.role !== 'admin') {
          return new Response(JSON.stringify({ error: 'Admin access required' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const newPromptData = await req.json();
        
        const { data: newPrompt, error: createError } = await supabase
          .from('prompt_configurations')
          .insert(newPromptData)
          .select()
          .single();

        if (createError) {
          console.error('Error creating prompt:', createError);
          return new Response(JSON.stringify({ error: 'Failed to create prompt configuration' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(newPrompt), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'PUT':
        // PUT /api/prompts/:category - Update prompt configuration (admin only)
        const authHeaderPut = req.headers.get('Authorization');
        if (!authHeaderPut) {
          throw new Error('Authorization header required');
        }

        const { data: { user: userPut }, error: userErrorPut } = await supabase.auth.getUser(authHeaderPut.replace('Bearer ', ''));
        if (userErrorPut || !userPut) {
          throw new Error('Invalid authentication');
        }

        // Check if user is admin
        const { data: profilePut } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', userPut.id)
          .single();

        if (!profilePut || profilePut.role !== 'admin') {
          return new Response(JSON.stringify({ error: 'Admin access required' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        if (!category) {
          return new Response(JSON.stringify({ error: 'Category parameter required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const updatePromptData = await req.json();
        
        const { data: updatedPrompt, error: updateError } = await supabase
          .from('prompt_configurations')
          .update(updatePromptData)
          .eq('category', category)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating prompt:', updateError);
          return new Response(JSON.stringify({ error: 'Failed to update prompt configuration' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(updatedPrompt), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    console.error('Error in prompts function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});