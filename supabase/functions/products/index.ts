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

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const productId = pathParts[pathParts.length - 1];

    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        if (productId && productId !== 'products') {
          // GET /api/products/:id - Fetch single product
          const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .eq('user_id', user.id)
            .single();

          if (error) {
            console.error('Error fetching product:', error);
            return new Response(JSON.stringify({ error: 'Product not found' }), {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(product), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          // GET /api/products - Fetch all user's products
          const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching products:', error);
            return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(products || []), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      case 'POST':
        // POST /api/products - Create new product
        const newProductData = await req.json();
        
        const { data: newProduct, error: createError } = await supabase
          .from('products')
          .insert({
            ...newProductData,
            user_id: user.id
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating product:', createError);
          return new Response(JSON.stringify({ error: 'Failed to create product' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log('Product created successfully:', newProduct.id);
        return new Response(JSON.stringify(newProduct), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'PUT':
        // PUT /api/products/:id - Update existing product
        if (!productId || productId === 'products') {
          return new Response(JSON.stringify({ error: 'Product ID required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const updateData = await req.json();
        
        const { data: updatedProduct, error: updateError } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', productId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating product:', updateError);
          return new Response(JSON.stringify({ error: 'Failed to update product' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log('Product updated successfully:', updatedProduct.id);
        return new Response(JSON.stringify(updatedProduct), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'DELETE':
        // DELETE /api/products/:id - Delete product
        if (!productId || productId === 'products') {
          return new Response(JSON.stringify({ error: 'Product ID required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .eq('id', productId)
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('Error deleting product:', deleteError);
          return new Response(JSON.stringify({ error: 'Failed to delete product' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log('Product deleted successfully:', productId);
        return new Response(JSON.stringify({ message: 'Product deleted successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    console.error('Error in products function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});