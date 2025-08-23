import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProductData {
  product_name: string;
  category: string;
  specifications?: any;
  image_analysis?: string;
  target_audience?: string;
  keywords?: string[];
  tone_of_voice?: string;
}

interface GeneratedContent {
  title: string;
  description: string;
  features: string[];
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

    const productData: ProductData = await req.json();
    
    // Get prompt configuration for category
    const { data: promptConfig, error: promptError } = await supabase
      .from('prompt_configurations')
      .select('*')
      .eq('category', productData.category)
      .single();

    if (promptError) {
      console.error('Prompt config error:', promptError);
      // Fallback to default prompts if category not found
    }

    const googleApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!googleApiKey) {
      throw new Error('Google AI API key not configured');
    }

    // Create context from product data
    const context = `
Product Name: ${productData.product_name}
Category: ${productData.category}
Specifications: ${JSON.stringify(productData.specifications || {})}
Target Audience: ${productData.target_audience || 'General consumers'}
Keywords: ${productData.keywords?.join(', ') || ''}
Tone: ${productData.tone_of_voice || 'Professional and engaging'}
Image Analysis: ${productData.image_analysis || 'Not provided'}
    `;

    // Generate title using Gemini
    const titlePrompt = promptConfig?.title_prompt || 'Create an SEO-optimized product title. Include key benefits and target keywords. Keep it under 60 characters.';
    const titleResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + googleApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${titlePrompt}\n\nProduct Context:\n${context}\n\nGenerate only the title, no explanations:`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 100,
          temperature: 0.7,
        }
      }),
    });

    const titleData = await titleResponse.json();
    const generatedTitle = titleData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Generated Title';

    // Generate description
    const descriptionPrompt = promptConfig?.description_prompt || 'Write a compelling product description. Focus on benefits, use cases, and target audience. Optimize for search engines.';
    const descriptionResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + googleApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${descriptionPrompt}\n\nProduct Context:\n${context}\n\nGenerate only the description, no explanations:`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7,
        }
      }),
    });

    const descriptionData = await descriptionResponse.json();
    const generatedDescription = descriptionData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Generated Description';

    // Generate features
    const featuresPrompt = promptConfig?.features_prompt || 'List 5-8 key features as bullet points. Focus on benefits that matter most to customers.';
    const featuresResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + googleApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${featuresPrompt}\n\nProduct Context:\n${context}\n\nGenerate only the bullet point features, no explanations:`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.7,
        }
      }),
    });

    const featuresData = await featuresResponse.json();
    const featuresText = featuresData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    const generatedFeatures = featuresText
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
      .filter(feature => feature.length > 0);

    // Update user API calls count
    await supabase
      .from('profiles')
      .update({ api_calls_used: supabase.rpc('increment', { x: 1 }) })
      .eq('user_id', user.id);

    const result: GeneratedContent = {
      title: generatedTitle,
      description: generatedDescription,
      features: generatedFeatures
    };

    console.log('Content generated successfully for user:', user.id);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating content:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate content', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});