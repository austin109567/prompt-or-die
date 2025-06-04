import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Play, Copy, Check, Shuffle, Keyboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PromptBlock, { PromptBlockProps } from "./PromptBlock";
import KeyboardShortcuts from "./KeyboardShortcuts";

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
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const updateBlock = (updatedBlock: PromptBlockProps) => {
    setBlocks(blocks.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    ));
  };

  const duplicateBlock = (blockToDuplicate: PromptBlockProps) => {
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
    const shuffled = [...blocks].sort(() => Math.random() - 0.5);
    setBlocks(shuffled);
    toast({
      title: "Blocks shuffled!",
      description: "Try a new arrangement to spark creativity."
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newBlocks = [...blocks];
    const draggedBlock = newBlocks[draggedIndex];
    newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(dropIndex, 0, draggedBlock);

    setBlocks(newBlocks);
    setDraggedIndex(null);
  };

  const generatePrompt = () => {
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
    toast({
      title: "Prompt generated!",
      description: "Your modular prompt is ready for use."
    });
  };

  const copyToClipboard = async () => {
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
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const exportPrompt = () => {
    if (!generatedPrompt) {
      toast({
        title: "Nothing to export",
        description: "Generate a prompt first!",
        variant: "destructive"
      });
      return;
    }

    const exportData = {
      blocks: blocks,
      generatedPrompt: generatedPrompt,
      timestamp: new Date().toISOString(),
      version: "1.0"
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-or-die-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Exported!",
      description: "Prompt configuration downloaded as JSON."
    });
  };

  const showKeyboardHelp = () => {
    toast({
      title: "Keyboard Shortcuts",
      description: "⌘+N: Add Block | ⌘+Enter: Generate | ⌘+Shift+C: Copy | ⌘+E: Export | ⌘+/: Help"
    });
  };

  return (
    <>
      <KeyboardShortcuts 
        onAddBlock={addNewBlock}
        onGeneratePrompt={generatePrompt}
        onCopyPrompt={copyToClipboard}
        onExportPrompt={exportPrompt}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Builder Panel */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Prompt Builder</h2>
            <div className="flex space-x-2">
              <Button 
                onClick={showKeyboardHelp}
                variant="ghost"
                size="sm"
                title="Keyboard shortcuts"
              >
                <Keyboard className="h-4 w-4" />
              </Button>
              <Button 
                onClick={shuffleBlocks}
                variant="outline"
                size="sm"
                disabled={blocks.length < 2}
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Shuffle
              </Button>
              <Button 
                onClick={addNewBlock}
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
                <Button onClick={addNewBlock} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first block
                </Button>
              </Card>
            ) : (
              blocks.map((block, index) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`transition-all duration-200 ${
                    draggedIndex === index ? 'opacity-50 scale-95' : ''
                  }`}
                >
                  <PromptBlock
                    {...block}
                    onRemove={removeBlock}
                    onEdit={updateBlock}
                    onDuplicate={duplicateBlock}
                  />
                </div>
              ))
            )}
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={generatePrompt}
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={blocks.length === 0}
            >
              <Play className="h-4 w-4 mr-2" />
              Generate Prompt
            </Button>
            <Button 
              variant="outline" 
              className="border-accent text-accent hover:bg-accent/10"
              onClick={exportPrompt}
              disabled={!generatedPrompt}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Live Preview</h2>
            {generatedPrompt && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={copyToClipboard}
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
                  {blocks.length} blocks
                </Badge>
              </div>
              
              <Separator />
              
              <div className="font-mono text-sm bg-muted/50 p-4 rounded min-h-[200px] max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                {generatedPrompt || (
                  <span className="text-muted-foreground italic">
                    Click "Generate Prompt" to see your composed prompt here...
                  </span>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">AI Response Preview</h4>
                <div className="bg-card border border-border rounded p-4 min-h-[100px] flex items-center justify-center">
                  <span className="text-muted-foreground text-sm italic">
                    Connect to Bolt SDK for live AI preview
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PromptBuilder;
