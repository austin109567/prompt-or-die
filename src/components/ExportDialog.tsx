
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromptBlockProps } from "@/components/PromptBlock";
import { Check, Copy, Download, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportDialogProps {
  blocks: PromptBlockProps[];
  generatedPrompt: string;
  trigger?: React.ReactNode;
}

const ExportDialog = ({ blocks, generatedPrompt, trigger }: ExportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Export formats
  const formats = {
    markdown: generatedPrompt,
    json: JSON.stringify(
      { 
        blocks: blocks, 
        generatedPrompt,
        timestamp: new Date().toISOString(),
        version: "1.0"
      }, 
      null, 
      2
    ),
    openaiFunctions: JSON.stringify(
      {
        name: "execute_prompt",
        description: "Execute the specified prompt with the provided inputs",
        parameters: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "The prompt to execute",
              default: generatedPrompt.replace(/\n/g, "\\n")
            },
            inputs: {
              type: "object",
              description: "Additional inputs for the prompt"
            }
          },
          required: ["prompt"]
        }
      }, 
      null, 
      2
    )
  };
  
  const handleCopy = async (format: 'markdown' | 'json' | 'openaiFunctions') => {
    try {
      await navigator.clipboard.writeText(formats[format]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Copied!",
        description: `${format.charAt(0).toUpperCase() + format.slice(1)} format copied to clipboard.`
      });
    } catch (err) {
      console.error('Copy failed:', err);
      
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive"
      });
    }
  };
  
  const handleDownload = (format: 'markdown' | 'json' | 'openaiFunctions') => {
    const extensions = {
      markdown: 'md',
      json: 'json',
      openaiFunctions: 'json'
    };
    
    const names = {
      markdown: 'prompt',
      json: 'prompt-export',
      openaiFunctions: 'openai-function'
    };
    
    const blob = new Blob([formats[format]], {
      type: format === 'markdown' ? 'text/markdown' : 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${names[format]}.${extensions[format]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `${format.charAt(0).toUpperCase() + format.slice(1)} file has been downloaded.`
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Prompt or Die Prompt',
        text: generatedPrompt,
        url: window.location.href,
      })
      .then(() => {
        toast({
          title: "Shared!",
          description: "Prompt shared successfully."
        });
      })
      .catch((error) => {
        console.error('Share failed:', error);
        toast({
          title: "Share failed",
          description: "Could not share the prompt.",
          variant: "destructive"
        });
      });
    } else {
      toast({
        title: "Share not supported",
        description: "Your browser doesn't support the Web Share API.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Export Prompt</DialogTitle>
          <DialogDescription>
            Export your prompt in different formats for use in various AI platforms and applications.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="markdown" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="openaiFunctions">OpenAI Functions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="markdown" className="space-y-4 mt-4">
            <div className="font-mono text-xs bg-muted/50 p-4 rounded-md overflow-auto max-h-[300px] whitespace-pre-wrap border">
              {formats.markdown}
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCopy('markdown')}
                className="gap-1"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleDownload('markdown')}
                className="gap-1 bg-primary hover:bg-primary/90"
              >
                <Download className="h-4 w-4" />
                Download .md
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="json" className="space-y-4 mt-4">
            <div className="font-mono text-xs bg-muted/50 p-4 rounded-md overflow-auto max-h-[300px] whitespace-pre-wrap border">
              {formats.json}
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCopy('json')}
                className="gap-1"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleDownload('json')}
                className="gap-1 bg-primary hover:bg-primary/90"
              >
                <Download className="h-4 w-4" />
                Download JSON
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="openaiFunctions" className="space-y-4 mt-4">
            <div className="font-mono text-xs bg-muted/50 p-4 rounded-md overflow-auto max-h-[300px] whitespace-pre-wrap border">
              {formats.openaiFunctions}
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCopy('openaiFunctions')}
                className="gap-1"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleDownload('openaiFunctions')}
                className="gap-1 bg-primary hover:bg-primary/90"
              >
                <Download className="h-4 w-4" />
                Download JSON
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 items-center">
          <Button 
            variant="outline" 
            onClick={handleShare}
            className="w-full sm:w-auto gap-2"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button 
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
