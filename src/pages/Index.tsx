import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductForm from '@/components/ProductForm';
import GeneratedContent from '@/components/GeneratedContent';
import { ContentGenerator } from '@/utils/contentGenerator';
import { Sparkles, Zap, Target, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
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
          
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="relative bg-gradient-hero">
            <div className="container mx-auto px-4 py-16 md:py-24">
              <div className="text-center max-w-4xl mx-auto">
                <Badge variant="secondary" className="mb-4 text-sm font-medium">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered Content Generation
                </Badge>
                
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  EcomScribe Pro
                </h1>
                
                <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                  Transform raw product data into high-converting, SEO-optimized listings that drive sales and engagement
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  <div className="flex items-center gap-2 text-white/80">
                    <Zap className="w-5 h-5" />
                    <span>Instant Generation</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Target className="w-5 h-5" />
                    <span>SEO Optimized</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <TrendingUp className="w-5 h-5" />
                    <span>High Converting</span>
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
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose EcomScribe Pro?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built specifically for e-commerce success with AI-powered optimization
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <article className="text-center relative">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                  <Target className="w-8 h-8 text-primary relative z-10" />
                  <div className="absolute inset-0 opacity-20">
                    <ProductShowcase className="w-full h-full" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">SEO Optimized</h3>
                <p className="text-muted-foreground">
                  Every title, description, and feature list is crafted to rank higher in search results and drive organic traffic.
                </p>
              </article>
              
              <article className="text-center relative">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                  <Zap className="w-8 h-8 text-primary relative z-10" />
                  <FloatingObjects className="absolute inset-0 opacity-30" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Generate professional product content in seconds, not hours. Perfect for busy e-commerce teams and students.
                </p>
              </article>
              
              <article className="text-center relative">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                  <TrendingUp className="w-8 h-8 text-primary relative z-10" />
                  <ParticleField className="absolute inset-0 opacity-40" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Conversion Focused</h3>
                <p className="text-muted-foreground">
                  Content designed to turn browsers into buyers with compelling copy that highlights benefits over features.
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