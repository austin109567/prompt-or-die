import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PromptBlockProps } from "./PromptBlock";
import KeyboardShortcuts from "./KeyboardShortcuts";
import BuilderPanel from "./BuilderPanel";
import PreviewPanel from "./PreviewPanel";
import ActionButtons from "./ActionButtons";
import KeyboardShortcutsDialog from "./KeyboardShortcutsDialog";
import ExportDialog from "./ExportDialog";

interface PromptBuilderProps {
  initialBlocks?: PromptBlockProps[];
}

const PromptBuilder = ({ initialBlocks = [] }: PromptBuilderProps) => {
  const [blocks, setBlocks] = useState<PromptBlockProps[]>([
    {
      id: '1',
      type: 'intent',
      label: 'Summarize Content',
      value: 'Provide a concise summary of the given content, highlighting key points and main ideas.'
    },
    {
      id: '2',
      type: 'tone',
      label: 'Professional',
      value: 'Use clear, professional language suitable for business communications.'
    },
    {
      id: '3',
      type: 'format',
      label: 'Bullet Points',
      value: 'Format the output as organized bullet points with clear hierarchy.'
    }
  ]);

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showKeyboardDialog, setShowKeyboardDialog] = useState(false);
  const { toast } = useToast();

  // Load initial blocks when provided
  useEffect(() => {
    if (initialBlocks.length > 0) {
      setBlocks(initialBlocks);
      setGeneratedPrompt('');
    }
  }, [initialBlocks]);

  const addNewBlock = () => {
    const newBlock: PromptBlockProps = {
      id: Date.now().toString(),
      type: 'intent',
      label: 'New Block',
      value: 'Enter your prompt instruction here...'
    };
    setBlocks([...blocks, newBlock]);
    console.log('Added new block:', newBlock);
  };

  const removeBlock = (id: string) => {
    console.log('Removing block:', id);
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const updateBlock = (updatedBlock: PromptBlockProps) => {
    console.log('Updating block:', updatedBlock);
    setBlocks(blocks.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    ));
  };

  const duplicateBlock = (blockToDuplicate: PromptBlockProps) => {
    console.log('Duplicating block:', blockToDuplicate);
    const duplicatedBlock: PromptBlockProps = {
      ...blockToDuplicate,
      id: Date.now().toString(),
      label: `${blockToDuplicate.label} (Copy)`
    };
    const index = blocks.findIndex(b => b.id === blockToDuplicate.id);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, duplicatedBlock);
    setBlocks(newBlocks);
    
    toast({
      title: "Block duplicated!",
      description: "A copy has been added below the original."
    });
  };

  const shuffleBlocks = () => {
    console.log('Shuffling blocks');
    const shuffled = [...blocks].sort(() => Math.random() - 0.5);
    setBlocks(shuffled);
    toast({
      title: "Blocks shuffled!",
      description: "Try a new arrangement to spark creativity."
    });
  };

  const handleDragStart = (index: number) => {
    console.log('Drag start:', index);
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    console.log('Drop at index:', dropIndex, 'from:', draggedIndex);
    if (draggedIndex === null) return;

    const newBlocks = [...blocks];
    const draggedBlock = newBlocks[draggedIndex];
    newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(dropIndex, 0, draggedBlock);

    setBlocks(newBlocks);
    setDraggedIndex(null);
  };

  const generatePrompt = () => {
    console.log('Generating prompt with blocks:', blocks);
    if (blocks.length === 0) {
      toast({
        title: "No blocks found",
        description: "Add some prompt blocks first!",
        variant: "destructive"
      });
      return;
    }

    const prompt = blocks
      .map(block => `## ${block.type.toUpperCase()}: ${block.label}\n${block.value}`)
      .join('\n\n');
    
    setGeneratedPrompt(prompt);
    console.log('Generated prompt:', prompt);
    toast({
      title: "Prompt generated!",
      description: "Your modular prompt is ready for use."
    });
  };

  const copyToClipboard = async () => {
    console.log('Copying to clipboard');
    if (!generatedPrompt) {
      toast({
        title: "Nothing to copy",
        description: "Generate a prompt first!",
        variant: "destructive"
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard."
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

  const exportPrompt = () => {
    console.log('Exporting prompt');
    // This is now handled by the ExportDialog component
  };

  const showKeyboardHelp = () => {
    setShowKeyboardDialog(true);
  };

  return (
    <>
      <KeyboardShortcuts 
        onAddBlock={addNewBlock}
        onGeneratePrompt={generatePrompt}
        onCopyPrompt={copyToClipboard}
        onExportPrompt={exportPrompt}
      />
      
      <KeyboardShortcutsDialog 
        open={showKeyboardDialog}
        onOpenChange={setShowKeyboardDialog}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Builder Panel */}
        <div className="space-y-6">
          <BuilderPanel
            blocks={blocks}
            onAddBlock={addNewBlock}
            onRemoveBlock={removeBlock}
            onUpdateBlock={updateBlock}
            onDuplicateBlock={duplicateBlock}
            onShuffleBlocks={shuffleBlocks}
            onShowKeyboardHelp={showKeyboardHelp}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            draggedIndex={draggedIndex}
          />

          <div className="flex space-x-3">
            <ActionButtons
              onGeneratePrompt={generatePrompt}
              onExportPrompt={exportPrompt}
              hasBlocks={blocks.length > 0}
              hasGeneratedPrompt={!!generatedPrompt}
            />
            {generatedPrompt && (
              <ExportDialog 
                blocks={blocks}
                generatedPrompt={generatedPrompt}
                trigger={
                  <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
                    Export Options
                  </Button>
                }
              />
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <PreviewPanel
          generatedPrompt={generatedPrompt}
          blockCount={blocks.length}
          copied={copied}
          onCopyToClipboard={copyToClipboard}
        />
      </div>
    </>
  );
};

export default PromptBuilder;