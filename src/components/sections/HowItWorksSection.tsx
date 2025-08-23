import { Card, CardContent } from "@/components/ui/card";
import { Database, Brain, Target, ArrowRight } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: Database,
    title: "Ingest Product Data",
    description: "Upload your product images and specifications from any e-commerce platform or API.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20"
  },
  {
    id: 2,
    icon: Brain,
    title: "Generate SEO Content",
    description: "Our AI analyzes your product data and creates optimized titles, descriptions, and bullet points.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/20"
  },
  {
    id: 3,
    icon: Target,
    title: "Optimize by Category",
    description: "Fine-tune content based on product categories and target audience for maximum impact.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20"
  }
];

export const HowItWorksSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-50" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-primary rounded-full blur-3xl opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-glass border border-primary/20 backdrop-blur-sm">
            <span className="text-sm font-medium text-primary-glow">How It Works</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            Transform Product Data in{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">3 Simple Steps</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our advanced AI pipeline processes your product information and generates 
            high-converting, SEO-optimized content in seconds.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-1/4 right-1/4 h-px bg-gradient-to-r from-primary via-secondary to-accent opacity-30" />
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="relative group">
                  {/* Step Card */}
                  <Card className={`glass-panel ${step.borderColor} hover:shadow-glow transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2`}>
                    <CardContent className="p-8 text-center space-y-6">
                      {/* Step Number */}
                      <div className="relative">
                        <div className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform duration-300`}>
                          <Icon className={`h-8 w-8 ${step.color}`} />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-sm font-bold">
                          {step.id}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        <h3 className="text-xl font-heading font-semibold">{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>

                      {/* Hover Effect */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className={`w-full h-1 ${step.bgColor} rounded-full relative overflow-hidden`}>
                          <div className={`absolute inset-0 bg-gradient-to-r ${step.color === 'text-primary' ? 'from-primary to-primary-glow' : step.color === 'text-secondary' ? 'from-secondary to-secondary/80' : 'from-accent to-accent/80'} animate-gradient bg-[length:200%_100%]`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Arrow (for desktop) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse-neon">
                        <ArrowRight className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-block p-6 glass-panel rounded-2xl border border-primary/20">
            <p className="text-lg text-muted-foreground mb-4">
              Ready to automate your product content generation?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="px-4 py-2 bg-primary/10 rounded-lg">
                <span className="text-sm font-medium text-primary">⚡ Generate in seconds</span>
              </div>
              <div className="px-4 py-2 bg-secondary/10 rounded-lg">
                <span className="text-sm font-medium text-secondary">🎯 SEO-optimized</span>
              </div>
              <div className="px-4 py-2 bg-accent/10 rounded-lg">
                <span className="text-sm font-medium text-accent">📈 Higher conversions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};