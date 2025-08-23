import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Handle arrays and objects
      if (Array.isArray(value)) {
        return `"${value.join('; ')}"`;
      } else if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value)}"`;
      } else if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if contains comma or quote
        return value.includes(',') || value.includes('"') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }
      return value || '';
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
}

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

    if (req.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const format = url.searchParams.get('format') || 'json';
    const productIds = url.searchParams.get('products')?.split(',') || [];

    let query = supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id);

    // If specific products requested, filter by IDs
    if (productIds.length > 0) {
      query = query.in('id', productIds);
    }

    const { data: products, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products for export:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Transform data for export (remove sensitive fields)
    const exportData = products?.map(product => ({
      product_name: product.product_name,
      category: product.category,
      generated_title: product.generated_title,
      generated_description: product.generated_description,
      generated_features: product.generated_features,
      target_audience: product.target_audience,
      keywords: product.keywords,
      specifications: product.specifications,
      created_at: product.created_at
    })) || [];

    console.log(`Exporting ${exportData.length} products in ${format} format for user:`, user.id);

    if (format.toLowerCase() === 'csv') {
      const csvContent = convertToCSV(exportData);
      
      return new Response(csvContent, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="products-${new Date().toISOString().split('T')[0]}.csv"`
        },
      });
    } else {
      // Default to JSON export
      return new Response(JSON.stringify(exportData, null, 2), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="products-${new Date().toISOString().split('T')[0]}.json"`
        },
      });
    }

  } catch (error) {
    console.error('Error in export function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});