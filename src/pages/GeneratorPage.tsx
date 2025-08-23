import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BackendProductForm } from "@/components/BackendProductForm";
import { BackendGeneratedContent } from "@/components/BackendGeneratedContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, LogOut, User } from "lucide-react";
import { FloatingElements } from "@/components/3d/FloatingElements";

interface GeneratedContent {
  title: string;
  description: string;
  features: string[];
}

export const GeneratorPage = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [productData, setProductData] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleContentGenerated = (content: GeneratedContent) => {
    setGeneratedContent(content);
  };

  const handleSave = (productId: string) => {
    console.log('Product saved with ID:', productId);
    // Optionally redirect to a products list or show success message
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <FloatingElements />
      
      {/* Header */}
      <div className="relative z-10 bg-background/10 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <User className="h-4 w-4" />
                {user.email}
              </div>
              <Button
                variant="ghost"
                onClick={signOut}
                className="text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              AI Product Description Generator
            </h1>
            <p className="text-xl text-white/80">
              Generate SEO-optimized content for your products using advanced AI
            </p>
          </div>

          {/* Single column layout for better spacing */}
          <div className="space-y-12">
            {/* Product Form - Full width with better spacing */}
            <div className="max-w-4xl mx-auto">
              <BackendProductForm
                onContentGenerated={(content) => {
                  handleContentGenerated(content);
                  setProductData(productData);
                }}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>

            {/* Generated Content - Full width when available */}
            {generatedContent && (
              <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Generated Content</h2>
                  <p className="text-white/70">Your AI-generated SEO content is ready!</p>
                </div>
                <BackendGeneratedContent
                  {...generatedContent}
                  onSave={handleSave}
                  productData={productData}
                />
              </div>
            )}

            {/* Placeholder when no content */}
            {!generatedContent && (
              <div className="max-w-4xl mx-auto">
                <Card className="bg-background/80 backdrop-blur-sm border-white/10">
                  <CardContent className="p-12 text-center">
                    <div className="text-muted-foreground">
                      <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="h-12 w-12 text-primary" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-4">Generate Your First Product</h3>
                      <p className="text-lg max-w-2xl mx-auto mb-8">
                        Fill out the form above with your product details and click generate to see 
                        professional SEO content created instantly by our AI.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <div className="p-6 bg-background/50 rounded-xl border border-white/10">
                          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-xl">🎯</span>
                          </div>
                          <div className="font-semibold text-primary mb-2">SEO Titles</div>
                          <div className="text-sm">Optimized for search rankings and click-through rates</div>
                        </div>
                        
                        <div className="p-6 bg-background/50 rounded-xl border border-white/10">
                          <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-xl">✍️</span>
                          </div>
                          <div className="font-semibold text-secondary mb-2">Descriptions</div>
                          <div className="text-sm">Compelling copy that converts visitors to customers</div>
                        </div>
                        
                        <div className="p-6 bg-background/50 rounded-xl border border-white/10">
                          <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-xl">⭐</span>
                          </div>
                          <div className="font-semibold text-accent mb-2">Features</div>
                          <div className="text-sm">Highlight key benefits in bullet-point format</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};