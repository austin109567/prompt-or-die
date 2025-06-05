
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PromptBlockProps } from './PromptBlock';
import { Edit2 } from 'lucide-react';

interface EditBlockDialogProps {
  block: PromptBlockProps;
  onSave: (updatedBlock: PromptBlockProps) => void;
  trigger?: React.ReactNode;
}

const EditBlockDialog = ({ block, onSave, trigger }: EditBlockDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedBlock, setEditedBlock] = useState<PromptBlockProps>(block);

  const handleSave = () => {
    onSave(editedBlock);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setEditedBlock(block);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Prompt Block</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="type">Block Type</Label>
            <Select
              value={editedBlock.type}
              onValueChange={(value) => setEditedBlock({ ...editedBlock, type: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select block type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="intent">Intent</SelectItem>
                <SelectItem value="tone">Tone</SelectItem>
                <SelectItem value="format">Format</SelectItem>
                <SelectItem value="context">Context</SelectItem>
                <SelectItem value="persona">Persona</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={editedBlock.label}
              onChange={(e) => setEditedBlock({ ...editedBlock, label: e.target.value })}
              placeholder="Enter block label"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="value">Content</Label>
            <Textarea
              id="value"
              value={editedBlock.value}
              onChange={(e) => setEditedBlock({ ...editedBlock, value: e.target.value })}
              placeholder="Enter block content"
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditBlockDialog;
