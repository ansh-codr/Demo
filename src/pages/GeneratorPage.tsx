import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BackendProductForm } from "@/components/BackendProductForm";
import { BackendGeneratedContent } from "@/components/BackendGeneratedContent";
import { Button } from "@/components/ui/button";
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              AI Product Description Generator
            </h1>
            <p className="text-xl text-white/80">
              Generate SEO-optimized content for your products using AI
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Form */}
            <div>
              <BackendProductForm
                onContentGenerated={(content) => {
                  handleContentGenerated(content);
                  // Store product data for saving
                  setProductData(productData);
                }}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>

            {/* Generated Content */}
            <div>
              {generatedContent ? (
                <BackendGeneratedContent
                  {...generatedContent}
                  onSave={handleSave}
                  productData={productData}
                />
              ) : (
                <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-white/10 p-8 text-center">
                  <div className="text-muted-foreground">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No content generated yet</h3>
                    <p>Fill out the product form and click generate to see your SEO-optimized content here.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};