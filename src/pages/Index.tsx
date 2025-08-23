import { useState } from "react";
import { ContentGenerator } from "@/utils/contentGenerator";
import ProductForm from "@/components/ProductForm";
import GeneratedContent from "@/components/GeneratedContent";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Star,
  ArrowRight,
  Zap,
  Target,
  Rocket
} from "lucide-react";

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

  const handleGenerate = async (productData: ProductData) => {
    setIsLoading(true);
    try {
      const result = await ContentGenerator.generateContent(productData);
      setGeneratedContent(result);
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const demoProducts = [
    {
      name: "Premium Wireless Headphones",
      category: "Electronics",
      description: "High-quality wireless headphones with noise cancellation",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    },
    {
      name: "Smart Fitness Watch",
      category: "Wearables", 
      description: "Advanced fitness tracking with heart rate monitoring",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    },
    {
      name: "Gaming Mechanical Keyboard",
      category: "Peripherals",
      description: "RGB backlit mechanical keyboard for gaming",
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a"
    }
  ];

  const categories = ["Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Beauty"];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "E-commerce Manager",
      company: "TechStore Pro",
      content: "This AI tool increased our product page conversions by 40%. The SEO-optimized content is incredible!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Digital Marketing Student",
      company: "University of Commerce",
      content: "Perfect for learning copywriting techniques. The AI generates content I can study and improve upon.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Product Manager",
      company: "GadgetWorld",
      content: "Saves us hours of writing time. The generated descriptions are professional and convert well.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <head>
        <title>AI-Powered Product SEO Generator | Transform Product Data Instantly</title>
        <meta 
          name="description" 
          content="Generate SEO-optimized product titles, descriptions, and features with AI. Perfect for e-commerce businesses, students, and product managers." 
        />
      </head>

      {/* Hero Section */}
      <HeroSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Product Demo Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-30" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-gradient-glass border border-secondary/20 backdrop-blur-sm">
              <span className="text-sm font-medium text-secondary">Live Demo</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-heading font-bold">
              See AI Magic in{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">Action</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Watch how our AI transforms basic product information into 
              compelling, conversion-optimized content.
            </p>
          </div>

          {/* Interactive Demo */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {demoProducts.map((product, index) => (
              <Card key={index} className="group glass-dark border-primary/20 hover:shadow-glow transition-all duration-500 hover:scale-105">
                <CardContent className="p-6 space-y-4">
                  <div className="aspect-video bg-gradient-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors"
                  >
                    Generate Content
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Demo Form */}
          <div className="max-w-4xl mx-auto">
            <Card className="glass-dark border-primary/20 shadow-glow">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-heading font-semibold mb-6">Try It Yourself</h3>
                    <ProductForm onGenerate={handleGenerate} isLoading={isLoading} />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-heading font-semibold mb-6">Generated Content</h3>
                    {generatedContent ? (
                      <GeneratedContent
                        title={generatedContent.generated_title}
                        description={generatedContent.generated_description}
                        features={generatedContent.generated_features_list}
                      />
                    ) : (
                      <Card className="h-full flex items-center justify-center bg-muted/5 border-dashed border-muted/20">
                        <CardContent className="text-center py-16">
                          <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            Generated content will appear here
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Category Fine-Tuning Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10 animate-gradient bg-[length:400%_400%]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-gradient-glass border border-accent/20 backdrop-blur-sm">
              <span className="text-sm font-medium text-accent">Smart Categories</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-heading font-bold">
              Optimized for Every{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">Product Category</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI understands the unique requirements of different product categories 
              and tailors content accordingly.
            </p>
          </div>

          {/* Floating Category Tags */}
          <div className="relative h-96 mb-16">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-primary/20 rounded-full blur-3xl animate-pulse-neon" />
            </div>
            
            {categories.map((category, index) => {
              const angle = (index * 60) * (Math.PI / 180);
              const radius = 120;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <div
                  key={category}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    animationDelay: `${index * 0.5}s`
                  }}
                >
                  <Badge 
                    variant="outline" 
                    className="glass-dark border-primary/30 text-lg px-4 py-2 hover:shadow-neon hover:scale-110 transition-all duration-300 cursor-pointer"
                  >
                    {category}
                  </Badge>
                </div>
              );
            })}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-dark border-primary/20 text-center">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Category-Specific Keywords</h3>
                <p className="text-muted-foreground">
                  Tailored keyword optimization based on product category and market trends.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-dark border-secondary/20 text-center">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Market Analysis</h3>
                <p className="text-muted-foreground">
                  AI analyzes market trends to optimize content for maximum visibility.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-dark border-accent/20 text-center">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Audience Targeting</h3>
                <p className="text-muted-foreground">
                  Content optimized for specific demographics and buying behaviors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-50" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-gradient-glass border border-primary/20 backdrop-blur-sm">
              <span className="text-sm font-medium text-primary-glow">Success Stories</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-heading font-bold">
              Trusted by{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">Students & Professionals</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how our AI-powered tool is helping people create better product content faster.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-dark border-primary/20 hover:shadow-glow transition-all duration-500 hover:scale-105">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  
                  <div className="pt-4 border-t border-muted/20">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-sm text-primary">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Impact Metrics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Products Generated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">95%</div>
              <div className="text-muted-foreground">SEO Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">2.5x</div>
              <div className="text-muted-foreground">Faster Creation</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-glow mb-2">500+</div>
              <div className="text-muted-foreground">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero animate-gradient bg-[length:400%_400%]" />
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-white">
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Product Content?
              </span>
            </h2>
            
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Join thousands of e-commerce professionals and students who are already 
              creating better product content with AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="group bg-white text-black hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold"
              >
                <Rocket className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Start Generating Now
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="group border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 rounded-xl"
              >
                <Zap className="mr-2 h-5 w-5" />
                View API Docs
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="pt-8">
              <p className="text-sm text-gray-400">
                Free to start • No credit card required • Generate up to 10 products per month
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;