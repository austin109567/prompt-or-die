import { Button } from "@/components/ui/button";
import { Play, Download } from "lucide-react";

interface ActionButtonsProps {
  onGeneratePrompt: () => void;
  onExportPrompt: () => void;
  hasBlocks: boolean;
  hasGeneratedPrompt: boolean;
}

const ActionButtons = ({
  onGeneratePrompt,
  onExportPrompt,
  hasBlocks,
  hasGeneratedPrompt
}: ActionButtonsProps) => {
  return (
    <div className="flex space-x-3">
      <Button 
        onClick={onGeneratePrompt}
        className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,128,0.3)]"
        disabled={!hasBlocks}
      >
        <Play className="h-4 w-4 mr-2" />
        Generate Prompt
      </Button>
      <Button 
        variant="outline" 
        className="border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/60"
        onClick={onExportPrompt}
        disabled={!hasGeneratedPrompt}
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
  );
};

export default ActionButtons;