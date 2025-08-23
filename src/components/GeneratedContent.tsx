import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GeneratedContentProps {
  title: string;
  description: string;
  features: string[];
}

export default function GeneratedContent({ title, description, features }: GeneratedContentProps) {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  const copyToClipboard = async (text: string, itemType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(prev).add(itemType));
      toast({
        title: "Copied!",
        description: `${itemType} copied to clipboard`,
      });
      
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemType);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const CopyButton = ({ itemType, text }: { itemType: string; text: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, itemType)}
      className="h-8 px-2"
    >
      {copiedItems.has(itemType) ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Generated Title */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Generated Title</CardTitle>
              <Badge variant="secondary">{title.length} chars</Badge>
              <Badge variant={title.length >= 50 && title.length <= 70 ? "default" : "destructive"}>
                {title.length >= 50 && title.length <= 70 ? "Optimal" : "Length Issue"}
              </Badge>
            </div>
            <CopyButton itemType="Title" text={title} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium leading-relaxed">{title}</p>
        </CardContent>
      </Card>

      {/* Generated Description */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Generated Description</CardTitle>
              <Badge variant="secondary">{description.split(' ').length} words</Badge>
              <Badge variant={description.split(' ').length >= 150 && description.split(' ').length <= 250 ? "default" : "destructive"}>
                {description.split(' ').length >= 150 && description.split(' ').length <= 250 ? "Optimal" : "Word Count Issue"}
              </Badge>
            </div>
            <CopyButton itemType="Description" text={description} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            {description.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated Features */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Generated Features</CardTitle>
              <Badge variant="secondary">{features.length} features</Badge>
              <Badge variant={features.length >= 3 && features.length <= 5 ? "default" : "destructive"}>
                {features.length >= 3 && features.length <= 5 ? "Optimal" : "Count Issue"}
              </Badge>
            </div>
            <CopyButton itemType="Features" text={features.join('\n')} />
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}