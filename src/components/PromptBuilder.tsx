
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Download, Play } from "lucide-react";
import PromptBlock, { PromptBlockProps } from "./PromptBlock";

const PromptBuilder = () => {
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

  const generatePrompt = () => {
    const prompt = blocks.map(block => `[${block.type.toUpperCase()}]: ${block.value}`).join('\n\n');
    setGeneratedPrompt(prompt);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Builder Panel */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Prompt Builder</h2>
          <Button 
            onClick={addNewBlock}
            className="bg-primary hover:bg-primary/90"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Block
          </Button>
        </div>

        <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
          {blocks.map((block) => (
            <PromptBlock
              key={block.id}
              {...block}
              onRemove={removeBlock}
              onEdit={(id) => console.log('Edit block:', id)}
            />
          ))}
        </div>

        <div className="flex space-x-3">
          <Button 
            onClick={generatePrompt}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Play className="h-4 w-4 mr-2" />
            Generate Prompt
          </Button>
          <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Live Preview</h2>
        
        <Card className="p-6 h-full min-h-[400px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-muted-foreground">Generated Prompt</h3>
              <Badge className="bg-primary/10 text-primary font-mono">
                {blocks.length} blocks
              </Badge>
            </div>
            
            <Separator />
            
            <div className="font-mono text-sm bg-muted/50 p-4 rounded min-h-[200px] max-h-[300px] overflow-y-auto">
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
  );
};

export default PromptBuilder;
