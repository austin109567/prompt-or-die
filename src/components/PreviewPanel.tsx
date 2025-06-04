import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Check, MonitorPlay } from "lucide-react";
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
        <div className="flex items-center gap-3">
          <div className="bg-accent/20 h-8 w-8 rounded-md flex items-center justify-center border border-accent/30">
            <MonitorPlay className="h-4 w-4 text-accent" />
          </div>
          <h2 className="text-xl font-bold">Live Preview</h2>
        </div>
        {generatedPrompt && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCopyToClipboard}
            className="flex items-center space-x-2 border-muted hover:border-accent/50"
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
      
      <Card className="border border-border/60 bg-card/90 backdrop-blur-sm overflow-hidden">
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm text-muted-foreground">Generated Prompt</h3>
            <Badge className="bg-primary/10 text-primary font-mono text-xs border border-primary/20">
              {blockCount} blocks
            </Badge>
          </div>
          
          <Separator className="bg-border/50" />
          
          <div className="font-mono text-sm bg-muted/30 p-4 rounded-md border border-border/50 min-h-[200px] max-h-[300px] overflow-y-auto whitespace-pre-wrap">
            {generatedPrompt || (
              <span className="text-muted-foreground italic">
                Click "Generate Prompt\" to see your composed prompt here...
              </span>
            )}
          </div>

          <Separator className="bg-border/50" />

          <AIPreview promptText={generatedPrompt} />
        </div>
      </Card>
    </div>
  );
};

export default PreviewPanel;