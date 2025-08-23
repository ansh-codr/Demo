import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductForm from '@/components/ProductForm';
import GeneratedContent from '@/components/GeneratedContent';
import { ContentGenerator } from '@/utils/contentGenerator';
import { Sparkles, Zap, Target, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import techBackground from '@/assets/tech-background.jpg';
import { FloatingObjects } from '@/components/3d/FloatingObjects';
import { ParticleField } from '@/components/3d/ParticleField';
import { ProductShowcase } from '@/components/3d/ProductShowcase';

interface ProductData {
  product_id: string;
  product_name_raw: string;
  category: string;
  specifications: string;
  image_analysis: string;
  target_audience: string;
  primary_keyword: string;
  secondary_keywords: string;
  tone_of_voice: string;
  negative_keywords: string;
}

interface GeneratedResult {
  generated_title: string;
  generated_description: string;
  generated_features_list: string[];
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedResult | null>(null);

  const handleGenerate = async (data: ProductData) => {
    setIsLoading(true);
    try {
      const result = await ContentGenerator.generateContent(data);
      setGeneratedContent(result);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <title>EcomScribe Pro - AI SEO Product Content Generator</title>
      <meta name="description" content="Generate high-converting, SEO-optimized product titles, descriptions, and features instantly with AI. Perfect for e-commerce businesses and students." />
      <meta name="keywords" content="AI product content generator, SEO product descriptions, e-commerce copywriting, product listing optimization" />
      <link rel="canonical" href="/" />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <header className="relative overflow-hidden">
          {/* 3D Background Elements */}
          <ParticleField className="absolute inset-0 opacity-30" />
          <FloatingObjects className="absolute inset-0 opacity-60" />
          
          {/* Large Background Title with Reflection */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black text-white/5 select-none leading-none tracking-tight bg-gradient-to-b from-white/10 to-transparent bg-clip-text text-transparent backdrop-blur-sm">
                EcomScribe Pro
              </h1>
              <div className="mt-2 text-8xl md:text-9xl lg:text-[12rem] font-black text-white/3 select-none leading-none tracking-tight transform scale-y-[-1] blur-sm opacity-30">
                EcomScribe Pro
              </div>
            </div>
          </div>
          
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${techBackground})` }}
          />
          <div className="relative bg-black/40">
            <div className="container mx-auto px-4 py-20 md:py-32">
              <div className="text-center max-w-3xl mx-auto relative z-10">
                <Badge variant="secondary" className="mb-6 text-sm font-medium">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered
                </Badge>
                
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Generate Perfect Product Content
                </h2>
                
                <p className="text-lg md:text-xl text-white/80 mb-10">
                  Transform raw data into SEO-optimized listings instantly
                </p>
                
                <div className="flex justify-center gap-8">
                  <div className="flex items-center gap-2 text-white/70">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">Instant</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">SEO Ready</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">High Converting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Input Form */}
            <section className="lg:sticky lg:top-8 lg:h-fit">
              <ProductForm onGenerate={handleGenerate} isLoading={isLoading} />
            </section>

            {/* Generated Content */}
            <section>
              {generatedContent ? (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Generated Content</h2>
                    <p className="text-muted-foreground">
                      Your SEO-optimized product content is ready! Click the copy icons to use in your listings.
                    </p>
                  </div>
                  <GeneratedContent
                    title={generatedContent.generated_title}
                    description={generatedContent.generated_description}
                    features={generatedContent.generated_features_list}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Ready to Generate</h3>
                    <p className="text-muted-foreground">
                      Fill out the form and click "Generate SEO Content" to see your optimized product listing
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>

        {/* Features Section */}
        <section className="bg-muted/20 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <article className="text-center relative group">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-primary relative z-10" />
                  <div className="absolute inset-0 opacity-20">
                    <ProductShowcase className="w-full h-full" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">SEO Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Optimized for search rankings
                </p>
              </article>
              
              <article className="text-center relative group">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-primary relative z-10" />
                  <FloatingObjects className="absolute inset-0 opacity-30" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
                <p className="text-sm text-muted-foreground">
                  Generate content in seconds
                </p>
              </article>
              
              <article className="text-center relative group">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-primary relative z-10" />
                  <ParticleField className="absolute inset-0 opacity-40" />
                </div>
                <h3 className="text-lg font-semibold mb-2">High Converting</h3>
                <p className="text-sm text-muted-foreground">
                  Built to drive sales
                </p>
              </article>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;