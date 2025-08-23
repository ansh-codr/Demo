import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Download, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface GeneratedContentProps {
  title: string;
  description: string;
  features: string[];
  onSave?: (productId: string) => void;
  productData?: any;
}

export const BackendGeneratedContent = ({ title, description, features, onSave, productData }: GeneratedContentProps) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const copyToClipboard = async (text: string, itemType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(prev).add(itemType));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemType);
          return newSet;
        });
      }, 2000);
      
      toast({
        title: "Copied!",
        description: `${itemType} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const saveProduct = async () => {
    if (!session?.user || !productData) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save products.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const productToSave = {
        ...productData,
        generated_title: title,
        generated_description: description,
        generated_features: features
      };

      const { data, error } = await supabase.functions.invoke('products', {
        body: productToSave,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (error) throw error;

      toast({
        title: "Product saved!",
        description: "Your product has been saved successfully."
      });

      onSave?.(data.id);
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: "Save failed",
        description: error.message || "Failed to save product",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const exportJSON = () => {
    const exportData = {
      title,
      description,
      features,
      exported_at: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `product-content-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exported!",
      description: "Content exported as JSON file"
    });
  };

  const exportCSV = () => {
    const csvContent = [
      ['Type', 'Content'],
      ['Title', title],
      ['Description', description.replace(/"/g, '""')],
      ...features.map((feature, index) => [`Feature ${index + 1}`, feature])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `product-content-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exported!",
      description: "Content exported as CSV file"
    });
  };

  const CopyButton = ({ onClick, copied }: { onClick: () => void; copied: boolean }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="h-8 w-8 p-0"
    >
      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
    </Button>
  );

  const getTitleStatus = () => {
    if (title.length <= 60) return { text: "Optimal", variant: "default" as const };
    return { text: "Too Long", variant: "destructive" as const };
  };

  const getDescriptionStatus = () => {
    if (description.length <= 160) return { text: "Optimal", variant: "default" as const };
    return { text: "Too Long", variant: "destructive" as const };
  };

  const titleStatus = getTitleStatus();
  const descriptionStatus = getDescriptionStatus();

  return (
    <div className="space-y-6">
      {/* Generated Title */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">Generated Title</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{title.length} chars</Badge>
              <Badge variant={titleStatus.variant}>{titleStatus.text}</Badge>
              <CopyButton
                onClick={() => copyToClipboard(title, "Title")}
                copied={copiedItems.has("Title")}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">{title}</p>
        </CardContent>
      </Card>

      {/* Generated Description */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">Generated Description</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{description.length} chars</Badge>
              <Badge variant={descriptionStatus.variant}>{descriptionStatus.text}</Badge>
              <CopyButton
                onClick={() => copyToClipboard(description, "Description")}
                copied={copiedItems.has("Description")}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            {description.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-2 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated Features */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">Generated Features</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{features.length} features</Badge>
              <Badge variant="default">Optimal</Badge>
              <CopyButton
                onClick={() => copyToClipboard(features.join('\n• '), "Features")}
                copied={copiedItems.has("Features")}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4">
        <Button onClick={saveProduct} disabled={saving} className="flex items-center gap-2">
          {saving ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Product
        </Button>
        
        <Button onClick={exportJSON} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export JSON
        </Button>
        
        <Button onClick={exportCSV} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
};