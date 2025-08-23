import { Button } from "@/components/ui/button";
import { RotatingCube } from "@/components/3d/RotatingCube";
import { FloatingElements } from "@/components/3d/FloatingElements";
import { ArrowRight, Play, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const sampleProducts = [
  { name: "Premium Headphones", category: "Electronics", image: "" },
  { name: "Smart Watch", category: "Wearables", image: "" },
  { name: "Wireless Earbuds", category: "Audio", image: "" },
  { name: "Gaming Mouse", category: "Peripherals", image: "" },
];

export const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartGenerating = () => {
    if (user) {
      navigate('/generate');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-hero animate-gradient bg-[length:400%_400%]" />
      
      {/* Floating Elements Background */}
      <FloatingElements className="absolute inset-0 opacity-30" />
      
      {/* Particle Effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse-neon" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 rounded-full bg-gradient-glass border border-primary/20 backdrop-blur-sm">
                <span className="text-sm font-medium text-primary-glow">AI-Powered Content Generation</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  AI-Powered
                </span>
                <br />
                <span className="text-foreground">Product SEO</span>
                <br />
                <span className="text-secondary">Generator</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                Turn product data into{" "}
                <span className="text-primary font-semibold">search-optimized titles</span>,{" "}
                <span className="text-secondary font-semibold">descriptions</span>, and{" "}
                <span className="text-accent font-semibold">features</span>{" "}
                with cutting-edge AI technology.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={handleStartGenerating}
                size="lg" 
                className="group bg-gradient-primary hover:shadow-neon transition-all duration-500 text-lg px-8 py-4 rounded-xl"
              >
                {user ? 'Start Generating' : 'Get Started'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              {!user && (
                <Button 
                  onClick={() => navigate('/auth')}
                  variant="outline" 
                  size="lg"
                  className="group glass-panel border-primary/30 hover:border-primary/50 text-lg px-8 py-4 rounded-xl"
                >
                  <LogIn className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Sign In
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Products Generated</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-secondary">95%</div>
                <div className="text-sm text-muted-foreground">SEO Improvement</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-accent">2.5x</div>
                <div className="text-sm text-muted-foreground">Faster Content</div>
              </div>
            </div>
          </div>

          {/* Right Content - 3D Rotating Cube */}
          <div className="relative flex justify-center items-center">
            <div className="w-96 h-96 relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-pulse-neon" />
              
              {/* 3D Cube */}
              <RotatingCube 
                className="w-full h-full relative z-10" 
                products={sampleProducts}
              />
              
              {/* Orbiting Elements */}
              <div className="absolute inset-0 animate-rotate-slow">
                <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse-neon" />
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-secondary rounded-full animate-pulse-neon" />
                <div className="absolute top-1/2 left-0 w-2.5 h-2.5 bg-accent rounded-full animate-pulse-neon" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};