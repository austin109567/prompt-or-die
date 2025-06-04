import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { PromptBlockProps } from "./PromptBlock";

interface EditBlockDialogProps {
  block: PromptBlockProps;
  onSave: (updatedBlock: PromptBlockProps) => void;
}

const blockTypes = [
  { value: 'intent', label: 'Intent', description: 'What the AI should do' },
  { value: 'tone', label: 'Tone', description: 'How the AI should communicate' },
  { value: 'format', label: 'Format', description: 'How to structure the output' },
  { value: 'context', label: 'Context', description: 'Relevant information or constraints' },
  { value: 'persona', label: 'Persona', description: 'Who the AI should act as' }
];

const blockTypeIcons = {
  intent: '🎯',
  tone: '🔊',
  format: '📋',
  context: '🌍',
  persona: '👤'
};

const EditBlockDialog = ({ block, onSave }: EditBlockDialogProps) => {
  const [open, setOpen] = useState(false);
  const [editedBlock, setEditedBlock] = useState(block);

  const handleSave = () => {
    onSave(editedBlock);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 rounded-md hover:bg-muted"
          title="Edit block"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Prompt Block</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="block-type">Block Type</Label>
            <Select
              value={editedBlock.type}
              onValueChange={(value) => 
                setEditedBlock(prev => ({ ...prev, type: value as any }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select block type" />
              </SelectTrigger>
              <SelectContent>
                {blockTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="flex items-center gap-2 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{blockTypeIcons[type.value as keyof typeof blockTypeIcons]}</span>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="block-label">Label</Label>
            <Input
              id="block-label"
              value={editedBlock.label}
              onChange={(e) => 
                setEditedBlock(prev => ({ ...prev, label: e.target.value }))
              }
              placeholder="Enter a descriptive label for this block..."
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              A short, descriptive name for this prompt block
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="block-value">Content</Label>
            <Textarea
              id="block-value"
              value={editedBlock.value}
              onChange={(e) => 
                setEditedBlock(prev => ({ ...prev, value: e.target.value }))
              }
              placeholder="Enter your prompt instruction..."
              className="min-h-[150px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              The actual content of the prompt block that will be included in the final prompt
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditBlockDialog;