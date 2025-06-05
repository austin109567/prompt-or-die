
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PromptBlockProps } from "./PromptBlock";
import KeyboardShortcuts from "./KeyboardShortcuts";
import BuilderPanel from "./BuilderPanel";
import PreviewPanel from "./PreviewPanel";

interface PromptBuilderProps {
  initialBlocks?: PromptBlockProps[];
  onBlocksChange?: (blocks: PromptBlockProps[]) => void;
}

const PromptBuilder = ({ initialBlocks = [], onBlocksChange }: PromptBuilderProps) => {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<PromptBlockProps[]>(initialBlocks);

  useEffect(() => {
    if (onBlocksChange) {
      onBlocksChange(blocks);
    }
  }, [blocks, onBlocksChange]);

  const addBlock = (type: 'text' | 'variable' | 'instruction' | 'example') => {
    const newBlock: PromptBlockProps = {
      id: Math.random().toString(36).substring(2, 15),
      type,
      label: `New ${type}`,
      value: ''
    };
    
    setBlocks([...blocks, newBlock]);
    
    toast({
      title: "Block added",
      description: `${type} block has been added to your prompt`
    });
  };

  const updateBlock = (id: string, updates: Partial<PromptBlockProps>) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
    
    toast({
      title: "Block deleted",
      description: "Block has been removed from your prompt"
    });
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    setBlocks(newBlocks);
  };

  const duplicateBlock = (id: string) => {
    const blockToDuplicate = blocks.find(block => block.id === id);
    if (blockToDuplicate) {
      const duplicatedBlock: PromptBlockProps = {
        ...blockToDuplicate,
        id: Math.random().toString(36).substring(2, 15),
        label: `${blockToDuplicate.label} (Copy)`
      };
      
      const blockIndex = blocks.findIndex(block => block.id === id);
      const newBlocks = [...blocks];
      newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);
      setBlocks(newBlocks);
      
      toast({
        title: "Block duplicated",
        description: "Block has been duplicated successfully"
      });
    }
  };

  const generatePrompt = () => {
    return blocks.map(block => {
      switch (block.type) {
        case 'text':
          return block.value;
        case 'variable':
          return `{{${block.label}}}`;
        case 'instruction':
          return `[${block.label}]: ${block.value}`;
        case 'example':
          return `Example: ${block.value}`;
        default:
          return block.value;
      }
    }).join('\n\n');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="flex-1">
        <BuilderPanel 
          blocks={blocks}
          onAddBlock={addBlock}
          onUpdateBlock={updateBlock}
          onDeleteBlock={deleteBlock}
          onDuplicateBlock={duplicateBlock}
          onMoveBlock={moveBlock}
        />
      </div>
      
      <div className="flex-1">
        <PreviewPanel 
          blocks={blocks}
          generatedPrompt={generatePrompt()}
        />
      </div>
      
      <KeyboardShortcuts 
        onAddText={() => addBlock('text')}
        onAddVariable={() => addBlock('variable')}
        onAddInstruction={() => addBlock('instruction')}
        onAddExample={() => addBlock('example')}
      />
    </div>
  );
};

export default PromptBuilder;
