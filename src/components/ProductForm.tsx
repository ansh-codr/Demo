import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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

interface ProductFormProps {
  onGenerate: (data: ProductData) => void;
  isLoading: boolean;
}

export default function ProductForm({ onGenerate, isLoading }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductData>({
    product_id: '',
    product_name_raw: '',
    category: '',
    specifications: '',
    image_analysis: '',
    target_audience: '',
    primary_keyword: '',
    secondary_keywords: '',
    tone_of_voice: '',
    negative_keywords: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const handleChange = (field: keyof ProductData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const loadDemoData = () => {
    setFormData({
      product_id: "KM-8821",
      product_name_raw: "HeatMug Pro",
      category: "Kitchen Appliances",
      specifications: "capacity is 400ml, material is 304 Stainless Steel, temperature range is 55-65 Celsius, battery life is 4 hours, has Bluetooth 5.0 and app control",
      image_analysis: "primary color is Matte Black, setting is on a clean desk next to a laptop, key visual element is an LED temperature display",
      target_audience: "Busy remote workers",
      primary_keyword: "Smart Coffee Mug",
      secondary_keywords: "temperature control mug, heated travel mug",
      tone_of_voice: "Modern and Professional",
      negative_keywords: "cheap, basic"
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Product Information</CardTitle>
          <Button variant="outline" size="sm" onClick={loadDemoData}>
            Load Demo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product_id">Product ID</Label>
              <Input
                id="product_id"
                value={formData.product_id}
                onChange={handleChange('product_id')}
                placeholder="e.g., KM-8821"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product_name_raw">Product Name (Raw)</Label>
              <Input
                id="product_name_raw"
                value={formData.product_name_raw}
                onChange={handleChange('product_name_raw')}
                placeholder="e.g., HeatMug Pro"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={handleChange('category')}
              placeholder="e.g., Kitchen Appliances"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specifications">Specifications</Label>
            <Textarea
              id="specifications"
              value={formData.specifications}
              onChange={handleChange('specifications')}
              placeholder="capacity is 400ml, material is 304 Stainless Steel, temperature range is 55-65 Celsius..."
              className="min-h-[80px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_analysis">Image Analysis</Label>
            <Textarea
              id="image_analysis"
              value={formData.image_analysis}
              onChange={handleChange('image_analysis')}
              placeholder="primary color is Matte Black, setting is on a clean desk next to a laptop..."
              className="min-h-[60px]"
              required
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Student Customizations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target_audience">Target Audience</Label>
                <Input
                  id="target_audience"
                  value={formData.target_audience}
                  onChange={handleChange('target_audience')}
                  placeholder="e.g., Busy remote workers"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone_of_voice">Tone of Voice</Label>
                <Input
                  id="tone_of_voice"
                  value={formData.tone_of_voice}
                  onChange={handleChange('tone_of_voice')}
                  placeholder="e.g., Modern and Professional"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_keyword">Primary Keyword</Label>
              <Input
                id="primary_keyword"
                value={formData.primary_keyword}
                onChange={handleChange('primary_keyword')}
                placeholder="e.g., Smart Coffee Mug"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_keywords">Secondary Keywords</Label>
              <Input
                id="secondary_keywords"
                value={formData.secondary_keywords}
                onChange={handleChange('secondary_keywords')}
                placeholder="e.g., temperature control mug, heated travel mug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="negative_keywords">Negative Keywords</Label>
              <Input
                id="negative_keywords"
                value={formData.negative_keywords}
                onChange={handleChange('negative_keywords')}
                placeholder="e.g., cheap, basic"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating Content...
              </>
            ) : (
              'Generate SEO Content'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}