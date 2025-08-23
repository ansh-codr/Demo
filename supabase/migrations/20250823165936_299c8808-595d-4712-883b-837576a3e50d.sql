-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Create enum for product categories
CREATE TYPE public.product_category AS ENUM ('electronics', 'clothing', 'home', 'sports', 'books', 'beauty', 'automotive', 'toys', 'health', 'other');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  api_calls_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  category product_category NOT NULL DEFAULT 'other',
  specifications JSONB,
  image_url TEXT,
  image_analysis TEXT,
  target_audience TEXT,
  keywords TEXT[],
  tone_of_voice TEXT,
  generated_title TEXT,
  generated_description TEXT,
  generated_features TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prompt_configurations table
CREATE TABLE public.prompt_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category product_category NOT NULL,
  title_prompt TEXT NOT NULL,
  description_prompt TEXT NOT NULL,
  features_prompt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category)
);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_configurations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Products policies
CREATE POLICY "Users can view their own products" 
ON public.products 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" 
ON public.products 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" 
ON public.products 
FOR DELETE 
USING (auth.uid() = user_id);

-- Prompt configurations policies (public read, admin write)
CREATE POLICY "Anyone can view prompt configurations" 
ON public.prompt_configurations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage prompt configurations" 
ON public.prompt_configurations 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Storage policies for product images
CREATE POLICY "Users can upload their own product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own product images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Product images are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Users can update their own product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own product images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prompt_configurations_updated_at
  BEFORE UPDATE ON public.prompt_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default prompt configurations
INSERT INTO public.prompt_configurations (category, title_prompt, description_prompt, features_prompt) VALUES
('electronics', 
 'Create an SEO-optimized product title for this electronic device. Include key specifications, brand benefits, and target keywords. Keep it under 60 characters.',
 'Write a compelling product description for this electronic device. Focus on key benefits, technical specifications, use cases, and target audience. Optimize for search engines with natural keyword integration.',
 'List 5-8 key features as bullet points for this electronic device. Focus on benefits and specifications that matter most to customers.'
),
('clothing', 
 'Create an SEO-optimized title for this clothing item. Include style, material, fit, and target keywords. Keep it under 60 characters.',
 'Write an engaging product description for this clothing item. Highlight style, comfort, material quality, versatility, and care instructions. Include size and fit information.',
 'List 5-8 key features as bullet points for this clothing item. Focus on material, fit, style benefits, and care features.'
),
('home', 
 'Create an SEO-optimized title for this home product. Include functionality, style, and key benefits. Keep it under 60 characters.',
 'Write a detailed product description for this home item. Focus on functionality, design benefits, space optimization, and how it enhances daily life.',
 'List 5-8 key features as bullet points for this home product. Emphasize practical benefits, quality, and lifestyle improvements.'
),
('sports', 
 'Create an SEO-optimized title for this sports product. Include performance benefits, activity type, and key features. Keep it under 60 characters.',
 'Write an energetic product description for this sports item. Focus on performance enhancement, durability, comfort, and specific sport applications.',
 'List 5-8 key features as bullet points for this sports product. Highlight performance benefits, durability, and sport-specific advantages.'
),
('books', 
 'Create an SEO-optimized title for this book. Include genre, key themes, and target audience appeal. Keep it under 60 characters.',
 'Write an engaging book description. Include plot summary, key themes, target audience, and what readers will gain. Make it compelling and searchable.',
 'List 5-8 key features as bullet points for this book. Focus on content benefits, learning outcomes, and reader value.'
),
('beauty', 
 'Create an SEO-optimized title for this beauty product. Include benefits, skin/hair type, and key ingredients. Keep it under 60 characters.',
 'Write an attractive product description for this beauty item. Focus on benefits, ingredients, application, results, and skin compatibility.',
 'List 5-8 key features as bullet points for this beauty product. Highlight ingredients, benefits, application ease, and results.'
),
('automotive', 
 'Create an SEO-optimized title for this automotive product. Include compatibility, performance benefits, and key features. Keep it under 60 characters.',
 'Write a technical yet accessible description for this automotive item. Focus on performance, compatibility, installation, and vehicle benefits.',
 'List 5-8 key features as bullet points for this automotive product. Emphasize performance, compatibility, and installation benefits.'
),
('toys', 
 'Create an SEO-optimized title for this toy. Include age range, educational benefits, and play value. Keep it under 60 characters.',
 'Write an exciting product description for this toy. Focus on educational benefits, safety, developmental value, and fun factor for children.',
 'List 5-8 key features as bullet points for this toy. Highlight educational benefits, safety, age appropriateness, and play value.'
),
('health', 
 'Create an SEO-optimized title for this health product. Include benefits, usage, and target audience. Keep it under 60 characters.',
 'Write a trustworthy product description for this health item. Focus on benefits, usage instructions, safety, and wellness outcomes.',
 'List 5-8 key features as bullet points for this health product. Emphasize benefits, safety, ease of use, and health outcomes.'
),
('other', 
 'Create an SEO-optimized product title. Include key benefits, target audience, and main features. Keep it under 60 characters.',
 'Write a comprehensive product description. Focus on main benefits, use cases, quality, and value proposition for customers.',
 'List 5-8 key features as bullet points. Highlight the most important benefits, quality aspects, and customer value.'
);