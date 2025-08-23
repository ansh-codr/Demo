import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DemoProductForm } from "@/components/demo/DemoProductForm";
import { BackendGeneratedContent } from "@/components/BackendGeneratedContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Sparkles, CheckCircle, X } from "lucide-react";
import { FloatingElements } from "@/components/3d/FloatingElements";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface GeneratedContent {
  title: string;
  description: string;
  features: string[];
}

export const DemoPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);

  const handleContentGenerated = (content: GeneratedContent) => {
    setGeneratedContent(content);
  };

  const handleSignUpPrompt = () => {
    setShowSignUpPrompt(true);
  };

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
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-primary hover:shadow-neon"
              >
                <User className="h-4 w-4 mr-2" />
                Sign Up for Full Access
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-white">
                Try AI Product Generator
              </h1>
            </div>
            <p className="text-xl text-white/80 mb-4">
              Generate SEO-optimized content for your products using AI - No signup required for demo!
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                3 Free Generations
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                No Credit Card
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Instant Results
              </div>
            </div>
          </div>

          {/* Two Column Layout for larger screens, stacked for mobile */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Product Form - Full width on mobile, left column on desktop */}
            <div className="space-y-6">
              <DemoProductForm
                onContentGenerated={handleContentGenerated}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                onSignUpPrompt={handleSignUpPrompt}
              />
              
              {/* Benefits Card - Only show on larger screens to save space */}
              <Card className="hidden xl:block bg-background/80 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">Why Sign Up?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Unlimited generations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Save & manage products</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Export to JSON/CSV</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Advanced AI features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Image upload support</span>
                  </div>
                  <Button 
                    onClick={() => navigate('/auth')} 
                    className="w-full mt-4 bg-gradient-primary hover:shadow-neon"
                  >
                    Get Started Free
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Generated Content - Full width on mobile, right column on desktop */}
            <div className="space-y-6">
              {generatedContent ? (
                <div className="space-y-6">
                  <BackendGeneratedContent
                    {...generatedContent}
                    onSave={() => {
                      // Demo version - prompt to sign up
                      handleSignUpPrompt();
                    }}
                  />
                  
                  {/* Call to Action after generation */}
                  <Card className="bg-gradient-primary/10 border-primary/20 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Love what you see?</h3>
                      <p className="text-muted-foreground mb-4">
                        Sign up now for unlimited generations, save your products, and access advanced AI features!
                      </p>
                      <Button 
                        onClick={() => navigate('/auth')} 
                        size="lg"
                        className="bg-gradient-primary hover:shadow-neon"
                      >
                        Sign Up - It's Free!
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="bg-background/80 backdrop-blur-sm border-white/10">
                  <CardContent className="p-12 text-center">
                    <div className="text-muted-foreground">
                      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-4">Ready to Generate?</h3>
                      <p className="text-lg mb-6">
                        Fill out the product form on the left and click generate to see your 
                        AI-powered SEO content appear here instantly!
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div className="p-4 bg-background/50 rounded-lg">
                          <div className="font-semibold text-primary mb-1">SEO Title</div>
                          <div>Optimized for search engines</div>
                        </div>
                        <div className="p-4 bg-background/50 rounded-lg">
                          <div className="font-semibold text-secondary mb-1">Description</div>
                          <div>Compelling product copy</div>
                        </div>
                        <div className="p-4 bg-background/50 rounded-lg">
                          <div className="font-semibold text-accent mb-1">Features</div>
                          <div>Bullet point highlights</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sign Up Prompt Dialog */}
      <Dialog open={showSignUpPrompt} onOpenChange={setShowSignUpPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Unlock Full Access
            </DialogTitle>
            <DialogDescription>
              You've reached the demo limit! Sign up for free to continue generating unlimited SEO content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Unlimited generations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Save products</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Export data</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Image uploads</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Advanced AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>No credit card</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate('/auth')} 
                className="flex-1 bg-gradient-primary hover:shadow-neon"
              >
                Sign Up Free
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowSignUpPrompt(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};