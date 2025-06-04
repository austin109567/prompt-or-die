import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bot, Lock, Key, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIApiKeySetupProps {
  onApiKeySet: () => void;
}

const AIApiKeySetup = ({ onApiKeySet }: AIApiKeySetupProps) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [open, setOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  
  useEffect(() => {
    // Check if API key exists in localStorage
    const storedApiKey = localStorage.getItem("openai_api_key");
    if (storedApiKey) {
      setHasApiKey(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key",
        variant: "destructive"
      });
      return;
    }
    
    // Simple validation - OpenAI keys typically start with "sk-"
    if (!apiKey.startsWith("sk-")) {
      toast({
        title: "Invalid API Key Format",
        description: "OpenAI API keys typically start with 'sk-'",
        variant: "destructive"
      });
      return;
    }
    
    // Store API key in localStorage (Note: in a production app, consider more secure storage options)
    localStorage.setItem("openai_api_key", apiKey);
    
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved successfully"
    });
    
    setHasApiKey(true);
    setOpen(false);
    onApiKeySet();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={hasApiKey ? "ghost" : "outline"} 
          size="sm" 
          className={hasApiKey ? 
            "text-primary hover:bg-primary/10 border-none" : 
            "border-dashed border-2 border-primary/30 hover:border-primary/70"
          }
        >
          {hasApiKey ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-500" />
              API Key Set
            </>
          ) : (
            <>
              <Key className="h-4 w-4 mr-2" />
              Set OpenAI API Key
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            OpenAI API Configuration
          </DialogTitle>
          <DialogDescription>
            Connect your OpenAI API key to enable real AI responses based on your prompts
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground flex items-center">
              <Lock className="h-3 w-3 mr-1" /> 
              Your API key is stored locally and never sent to our servers
            </p>
          </div>
          <div className="bg-muted p-3 rounded-md text-sm">
            <p>Don't have an API key?</p>
            <a 
              href="https://platform.openai.com/account/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center mt-1"
            >
              Get one from OpenAI
            </a>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveApiKey} className="bg-primary hover:bg-primary/90">
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIApiKeySetup;