
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Shuffle, Keyboard } from "lucide-react";
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
        <h2 className="text-xl font-bold">Prompt Builder</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={onShowKeyboardHelp}
            variant="ghost"
            size="sm"
            title="Keyboard shortcuts"
          >
            <Keyboard className="h-4 w-4" />
          </Button>
          <Button 
            onClick={onShuffleBlocks}
            variant="outline"
            size="sm"
            disabled={blocks.length < 2}
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
          <Button 
            onClick={onAddBlock}
            className="bg-primary hover:bg-primary/90"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Block
          </Button>
        </div>
      </div>

      <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
        {blocks.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <p className="text-muted-foreground mb-4">No prompt blocks yet</p>
            <Button onClick={onAddBlock} variant="outline">
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
