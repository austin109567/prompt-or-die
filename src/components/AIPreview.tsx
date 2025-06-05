
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AIPreviewProps {
  prompt: string;
  promptText?: string;
  onPreviewGenerated?: (preview: string) => void;
}

const AIPreview = ({ prompt, promptText, onPreviewGenerated }: AIPreviewProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const currentPrompt = prompt || promptText || '';

  const generatePreview = async () => {
    if (!currentPrompt.trim()) {
      toast({
        title: "No prompt provided",
        description: "Please add some prompt content first",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI preview generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockPreview = `AI Preview for: "${currentPrompt.substring(0, 50)}..."\n\nThis is a simulated AI response that would be generated based on your prompt. The actual AI integration would process your prompt and return relevant content here.`;
      
      setPreview(mockPreview);
      onPreviewGenerated?.(mockPreview);
      
      toast({
        title: "Preview generated",
        description: "AI preview has been generated successfully"
      });
    } catch (error) {
      toast({
        title: "Error generating preview",
        description: "Failed to generate AI preview. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPreview = async () => {
    if (!preview) return;
    
    try {
      await navigator.clipboard.writeText(preview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Copied to clipboard",
        description: "Preview has been copied to your clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy preview to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={generatePreview}
          disabled={isGenerating || !currentPrompt.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Preview...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Preview
            </>
          )}
        </Button>
        
        {preview && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Generated Preview:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyPreview}
                className="h-7 w-7 p-0"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <Textarea
              value={preview}
              readOnly
              className="min-h-[120px] bg-muted/50"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIPreview;
