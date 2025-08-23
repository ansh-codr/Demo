import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Wand2, Loader2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CATEGORIES = [
  'electronics', 'clothing', 'home', 'sports', 'books', 
  'beauty', 'automotive', 'toys', 'health', 'other'
];

interface ProductData {
  product_name: string;
  category: string;
  specifications: any;
  target_audience?: string;
  keywords: string[];
  tone_of_voice?: string;
}

interface DemoProductFormProps {
  onContentGenerated: (content: { title: string; description: string; features: string[] }) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onSignUpPrompt: () => void;
}

export const DemoProductForm = ({ onContentGenerated, isLoading, setIsLoading, onSignUpPrompt }: DemoProductFormProps) => {
  const { toast } = useToast();
  const [productData, setProductData] = useState<ProductData>({
    product_name: '',
    category: 'other',
    specifications: {},
    target_audience: '',
    keywords: [],
    tone_of_voice: 'professional'
  });
  const [keywordInput, setKeywordInput] = useState('');
  const [demoUsageCount, setDemoUsageCount] = useState(() => {
    const stored = localStorage.getItem('demo_usage_count');
    return stored ? parseInt(stored) : 0;
  });

  const handleInputChange = (field: keyof ProductData, value: any) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !productData.keywords.includes(keywordInput.trim())) {
      setProductData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setProductData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const generateDemoContent = async () => {
    if (!productData.product_name.trim()) {
      toast({
        title: "Product name required",
        description: "Please enter a product name.",
        variant: "destructive"
      });
      return;
    }

    if (demoUsageCount >= 3) {
      onSignUpPrompt();
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API delay for realistic demo experience
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock content based on category and input
      const mockContent = generateMockContent(productData);
      
      onContentGenerated(mockContent);
      
      const newCount = demoUsageCount + 1;
      setDemoUsageCount(newCount);
      localStorage.setItem('demo_usage_count', newCount.toString());
      
      toast({
        title: "Demo content generated!",
        description: `${3 - newCount} demo generations remaining. Sign up for unlimited access!`
      });
    } catch (error: any) {
      console.error('Demo generation error:', error);
      toast({
        title: "Generation failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockContent = (data: ProductData) => {
    const categoryPrompts = {
      electronics: {
        titleTemplates: [
          `${data.product_name} - Premium Quality Electronics`,
          `Advanced ${data.product_name} with Smart Features`,
          `${data.product_name} Pro - Next Generation Technology`
        ],
        features: [
          "Advanced technology integration",
          "Energy-efficient operation",
          "Durable construction",
          "User-friendly interface",
          "Wireless connectivity",
          "Long-lasting battery life",
          "Compact design"
        ]
      },
      clothing: {
        titleTemplates: [
          `${data.product_name} - Premium Comfort & Style`,
          `Luxury ${data.product_name} Collection`,
          `${data.product_name} - Fashion Forward Design`
        ],
        features: [
          "Premium fabric quality",
          "Comfortable fit",
          "Durable construction",
          "Easy care instructions",
          "Versatile styling options",
          "Breathable material",
          "Color-fast technology"
        ]
      },
      // Add more categories as needed
      other: {
        titleTemplates: [
          `${data.product_name} - Premium Quality`,
          `Professional ${data.product_name}`,
          `${data.product_name} - Superior Performance`
        ],
        features: [
          "High-quality materials",
          "Reliable performance",
          "Easy to use",
          "Durable design",
          "Great value for money"
        ]
      }
    };

    const categoryData = categoryPrompts[data.category as keyof typeof categoryPrompts] || categoryPrompts.other;
    const randomTitle = categoryData.titleTemplates[Math.floor(Math.random() * categoryData.titleTemplates.length)];
    
    const description = `Experience the perfect blend of quality and innovation with our ${data.product_name}. 
    Designed for ${data.target_audience || 'discerning customers'}, this product delivers exceptional performance 
    and reliability. Whether you're looking for ${data.keywords.slice(0, 2).join(' or ')}, our ${data.product_name} 
    exceeds expectations with its superior craftsmanship and attention to detail.`;

    const shuffledFeatures = [...categoryData.features]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    return {
      title: randomTitle,
      description: description.trim(),
      features: shuffledFeatures
    };
  };

  const loadDemoData = () => {
    setProductData({
      product_name: "Wireless Bluetooth Headphones Pro",
      category: "electronics",
      specifications: {
        battery: "30 hours playback",
        connectivity: "Bluetooth 5.0",
        features: ["Active Noise Cancellation", "Quick Charge", "Voice Assistant"],
        weight: "250g"
      },
      target_audience: "Music enthusiasts and professionals",
      keywords: ["wireless headphones", "bluetooth", "noise cancelling", "premium audio"],
      tone_of_voice: "professional"
    });
    toast({
      title: "Demo data loaded",
      description: "Sample product data has been loaded for testing."
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          AI Product Generator - Free Demo
        </CardTitle>
        <CardDescription>
          Try our AI generator with up to 3 free generations. No signup required!
        </CardDescription>
        
        {demoUsageCount > 0 && (
          <Alert>
            <User className="h-4 w-4" />
            <AlertDescription>
              Demo generations used: {demoUsageCount}/3. 
              {demoUsageCount >= 3 ? ' Sign up for unlimited access!' : ` ${3 - demoUsageCount} remaining.`}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="product_name">Product Name *</Label>
            <Input
              id="product_name"
              value={productData.product_name}
              onChange={(e) => handleInputChange('product_name', e.target.value)}
              placeholder="Enter product name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={productData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target_audience">Target Audience</Label>
          <Input
            id="target_audience"
            value={productData.target_audience}
            onChange={(e) => handleInputChange('target_audience', e.target.value)}
            placeholder="e.g., Tech enthusiasts, Fitness enthusiasts, Parents"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specifications">Product Details</Label>
          <Textarea
            id="specifications"
            value={JSON.stringify(productData.specifications, null, 2)}
            onChange={(e) => {
              try {
                const specs = JSON.parse(e.target.value);
                handleInputChange('specifications', specs);
              } catch {
                // Invalid JSON, don't update
              }
            }}
            placeholder='{"battery": "24 hours", "weight": "200g", "features": ["feature1", "feature2"]}'
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Keywords</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Add a keyword"
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            />
            <Button onClick={addKeyword} variant="outline">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {productData.keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                {keyword}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeKeyword(keyword)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={loadDemoData} variant="outline">
            Load Demo Data
          </Button>
          <Button 
            onClick={generateDemoContent} 
            disabled={isLoading || !productData.product_name.trim() || demoUsageCount >= 3}
            className="flex-1"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {demoUsageCount >= 3 ? 'Sign Up for More' : 'Generate Demo Content'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};