import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, Loader2, RefreshCw } from "lucide-react";
import { generateAIResponse } from "@/lib/openai";

interface AIPreviewProps {
  promptText: string;
  onRegenerate?: () => void;
}

const AIPreview = ({ promptText, onRegenerate }: AIPreviewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [selectedModel, setSelectedModel] = useState<"gpt-4" | "claude" | "llama">("gpt-4");
  
  // Generate AI response when promptText changes
  useEffect(() => {
    if (!promptText) {
      setAiResponse("");
      return;
    }
    
    setIsLoading(true);
    setAiResponse("");
    
    const generateResponse = async () => {
      const response = await generateAIResponse(promptText, selectedModel);
      if (response) {
        // Simulate streaming text for a better UX
        let currentText = "";
        const textStream = response;
        const interval = setInterval(() => {
          if (currentText.length < textStream.length) {
            currentText = textStream.substring(0, currentText.length + 5);
            setAiResponse(currentText);
          } else {
            clearInterval(interval);
            setIsLoading(false);
          }
        }, 30);
      } else {
        // Fallback to mock response if API call fails
        generateMockAIResponse(promptText, selectedModel);
      }
    };
    
    // Check if we have an API key configured
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      generateResponse();
    } else {
      // No API key, use mock data
      setTimeout(() => {
        generateMockAIResponse(promptText, selectedModel);
      }, 1500);
    }
    
  }, [promptText, selectedModel]);
  
  // Generate a mock AI response as fallback
  const generateMockAIResponse = (prompt: string, model: "gpt-4" | "claude" | "llama") => {
    // Different models have slightly different responses
    const modelPrefix = model === "gpt-4" 
      ? "Based on your structured prompt, I've generated the following response:\n\n"
      : model === "claude"
        ? "I'll address your request according to the specified parameters:\n\n"
        : "Following your instructions, here's my response:\n\n";
    
    const responseParts = [
      modelPrefix,
      prompt.includes("summarize") || prompt.includes("Summarize") ? 
        "Here's a concise summary of the key points:" : 
        "Here are the main insights based on your request:",
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
      
      const regenerateResponse = async () => {
        const response = await generateAIResponse(promptText, selectedModel);
        if (response) {
          // Simulate streaming text
          let currentText = "";
          const textStream = response;
          const interval = setInterval(() => {
            if (currentText.length < textStream.length) {
              currentText = textStream.substring(0, currentText.length + 5);
              setAiResponse(currentText);
            } else {
              clearInterval(interval);
              setIsLoading(false);
            }
          }, 30);
        } else {
          generateMockAIResponse(promptText, selectedModel);
        }
      };
      
      if (import.meta.env.VITE_OPENAI_API_KEY) {
        regenerateResponse();
      } else {
        setTimeout(() => {
          generateMockAIResponse(promptText, selectedModel);
        }, 1000);
      }
    }
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model as "gpt-4" | "claude" | "llama");
    // This will trigger the useEffect to regenerate the response
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-accent" />
          <h3 className="font-medium text-sm">AI Response Preview</h3>
        </div>
        
        <Tabs 
          value={selectedModel} 
          onValueChange={handleModelChange}
          className="w-auto"
        >
          <TabsList className="h-7 p-0.5 bg-muted/50">
            <TabsTrigger value="gpt-4" className="text-xs px-2.5 py-0.5 h-6">
              GPT-4
            </TabsTrigger>
            <TabsTrigger value="claude" className="text-xs px-2.5 py-0.5 h-6">
              Claude
            </TabsTrigger>
            <TabsTrigger value="llama" className="text-xs px-2.5 py-0.5 h-6">
              Llama
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="min-h-[200px] max-h-[300px] overflow-y-auto bg-muted/30 rounded-md p-4 border border-border/50 relative">
        {!promptText ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Bot className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-sm">Generate a prompt to see AI response preview</p>
            <p className="text-xs mt-2">
              {import.meta.env.VITE_OPENAI_API_KEY ? 
                "Using OpenAI API for real responses" : 
                "Set VITE_OPENAI_API_KEY for real AI responses"}
            </p>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">AI is thinking...</p>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ) : (
          <div className="font-mono text-sm whitespace-pre-wrap">
            {aiResponse}
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRegenerate}
          disabled={!promptText || isLoading}
          className="border-accent/30 hover:border-accent/60 hover:bg-accent/10 text-xs"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          )}
          Regenerate
        </Button>
      </div>
    </div>
  );
};

export default AIPreview;