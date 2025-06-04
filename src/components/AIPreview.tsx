import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, Loader2, RefreshCcw } from "lucide-react";

interface AIPreviewProps {
  promptText: string;
  onRegenerate?: () => void;
}

const AIPreview = ({ promptText, onRegenerate }: AIPreviewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  
  // Simulate AI response generation
  useEffect(() => {
    if (!promptText) {
      setAiResponse("");
      return;
    }
    
    setIsLoading(true);
    setAiResponse("");
    
    // Simulate delay for AI response
    const timeout = setTimeout(() => {
      generateMockAIResponse(promptText);
    }, 1500);
    
    return () => clearTimeout(timeout);
  }, [promptText]);
  
  // Generate a deterministic mock AI response based on the prompt
  const generateMockAIResponse = (prompt: string) => {
    const responseParts = [
      "Based on your prompt, here's what I've generated:",
      "",
      prompt.includes("summarize") || prompt.includes("Summarize") ? 
        "Here's a concise summary of the key points:" : 
        "Here are the main insights from your request:",
      "",
      "• The prompt structure effectively communicates your intent and desired format",
      "• Using modular blocks helps create more consistent and reusable prompts",
      "• The tone specification helps maintain appropriate communication style",
      "",
      prompt.includes("bullet") || prompt.includes("Bullet") ?
        "• Format instructions were followed as requested with bullet points" :
        "Format has been structured according to your specifications",
      "• Context elements have been incorporated to provide relevant background",
      "",
      "Would you like me to refine this further or adjust any specific aspect of the response?"
    ];
    
    // Simulate streaming text
    let currentText = "";
    const textStream = responseParts.join("\n");
    const interval = setInterval(() => {
      if (currentText.length < textStream.length) {
        currentText = textStream.substring(0, currentText.length + 5);
        setAiResponse(currentText);
      } else {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 30);
  };
  
  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate();
    } else {
      setIsLoading(true);
      setAiResponse("");
      setTimeout(() => {
        generateMockAIResponse(promptText);
      }, 1000);
    }
  };

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          <h3 className="font-medium text-sm">AI Response Preview</h3>
        </div>
        
        <Tabs defaultValue="gpt-4" className="w-auto">
          <TabsList className="h-8">
            <TabsTrigger value="gpt-4" className="text-xs px-2 py-1">GPT-4</TabsTrigger>
            <TabsTrigger value="claude" className="text-xs px-2 py-1">Claude</TabsTrigger>
            <TabsTrigger value="llama" className="text-xs px-2 py-1">Llama</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="min-h-[300px] max-h-[500px] overflow-y-auto bg-muted/50 rounded-md p-4 mb-4">
        {!promptText ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Bot className="h-12 w-12 mb-4 opacity-20" />
            <p>Generate a prompt to see AI response preview</p>
            <p className="text-xs mt-2">Connect with Bolt SDK for real AI responses</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">AI is thinking...</p>
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          <pre className="font-mono text-sm whitespace-pre-wrap">{aiResponse}</pre>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRegenerate}
          disabled={!promptText || isLoading}
          className={!promptText ? "opacity-50" : ""}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4 mr-2" />
          )}
          Regenerate
        </Button>
      </div>
    </Card>
  );
};

export default AIPreview;