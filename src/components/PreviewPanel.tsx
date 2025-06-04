import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Check } from "lucide-react";
import AIPreview from "./AIPreview";

interface PreviewPanelProps {
  generatedPrompt: string;
  blockCount: number;
  copied: boolean;
  onCopyToClipboard: () => void;
}

const PreviewPanel = ({
  generatedPrompt,
  blockCount,
  copied,
  onCopyToClipboard
}: PreviewPanelProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Live Preview</h2>
        {generatedPrompt && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCopyToClipboard}
            className="flex items-center space-x-2"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </Button>
        )}
      </div>
      
      <Card className="p-6 h-full min-h-[400px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm text-muted-foreground">Generated Prompt</h3>
            <Badge className="bg-primary/10 text-primary font-mono">
              {blockCount} blocks
            </Badge>
          </div>
          
          <Separator />
          
          <div className="font-mono text-sm bg-muted/50 p-4 rounded min-h-[200px] max-h-[300px] overflow-y-auto whitespace-pre-wrap">
            {generatedPrompt || (
              <span className="text-muted-foreground italic">
                Click "Generate Prompt\" to see your composed prompt here...
              </span>
            )}
          </div>

          <Separator />

          <AIPreview promptText={generatedPrompt} />
        </div>
      </Card>
    </div>
  );
};

export default PreviewPanel;