import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Shuffle, Keyboard, PuzzleIcon } from "lucide-react";
import { PromptBlockProps } from "./PromptBlock";
import BlockList from "./BlockList";

interface BuilderPanelProps {
  blocks: PromptBlockProps[];
  onAddBlock: () => void;
  onRemoveBlock: (id: string) => void;
  onUpdateBlock: (block: PromptBlockProps) => void;
  onDuplicateBlock: (block: PromptBlockProps) => void;
  onShuffleBlocks: () => void;
  onShowKeyboardHelp: () => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropIndex: number) => void;
  draggedIndex: number | null;
}

const BuilderPanel = ({
  blocks,
  onAddBlock,
  onRemoveBlock,
  onUpdateBlock,
  onDuplicateBlock,
  onShuffleBlocks,
  onShowKeyboardHelp,
  onDragStart,
  onDragOver,
  onDrop,
  draggedIndex
}: BuilderPanelProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 h-8 w-8 rounded-md flex items-center justify-center border border-primary/30">
            <PuzzleIcon className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Prompt Builder</h2>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={onShowKeyboardHelp}
            variant="ghost"
            size="sm"
            className="h-9 px-2.5 text-muted-foreground hover:text-foreground"
            title="Keyboard shortcuts"
          >
            <Keyboard className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Shortcuts</span>
          </Button>
          <Button 
            onClick={onShuffleBlocks}
            variant="outline"
            size="sm"
            className="h-9 border-muted hover:border-primary/50"
            disabled={blocks.length < 2}
          >
            <Shuffle className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Shuffle</span>
          </Button>
          <Button 
            onClick={onAddBlock}
            className="bg-primary hover:bg-primary/90 h-9"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Block
          </Button>
        </div>
      </div>

      <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 scrollbar-thin">
        {blocks.length === 0 ? (
          <Card className="p-8 text-center border-dashed bg-muted/10">
            <PuzzleIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">Start building your prompt by adding blocks</p>
            <Button onClick={onAddBlock} variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
              <Plus className="h-4 w-4 mr-2" />
              Add your first block
            </Button>
          </Card>
        ) : (
          <BlockList
            blocks={blocks}
            onRemove={onRemoveBlock}
            onUpdate={onUpdateBlock}
            onDuplicate={onDuplicateBlock}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            draggedIndex={draggedIndex}
          />
        )}
      </div>
    </div>
  );
};

export default BuilderPanel;