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
        className="flex-1 bg-primary hover:bg-primary/90"
        disabled={!hasBlocks}
      >
        <Play className="h-4 w-4 mr-2" />
        Generate Prompt
      </Button>
      <Button 
        variant="outline" 
        className="border-accent text-accent hover:bg-accent/10"
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