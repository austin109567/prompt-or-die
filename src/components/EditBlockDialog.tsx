
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2 } from "lucide-react";
import { PromptBlockProps } from "./PromptBlock";

interface EditBlockDialogProps {
  block: PromptBlockProps;
  onSave: (updatedBlock: PromptBlockProps) => void;
}

const blockTypes = [
  { value: 'intent', label: 'Intent' },
  { value: 'tone', label: 'Tone' },
  { value: 'format', label: 'Format' },
  { value: 'context', label: 'Context' },
  { value: 'persona', label: 'Persona' }
];

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
          className="h-6 w-6 p-0 hover:bg-muted"
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Prompt Block</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="block-type">Type</Label>
            <Select
              value={editedBlock.type}
              onValueChange={(value) => 
                setEditedBlock(prev => ({ ...prev, type: value as any }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {blockTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
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
              placeholder="Enter block label..."
            />
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
              className="min-h-[100px]"
            />
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
