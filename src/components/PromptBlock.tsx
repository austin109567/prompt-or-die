
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Copy } from "lucide-react";
import EditBlockDialog from "./EditBlockDialog";

export interface PromptBlockProps {
  id: string;
  type: 'intent' | 'tone' | 'format' | 'context' | 'persona';
  label: string;
  value: string;
  onRemove?: (id: string) => void;
  onEdit?: (updatedBlock: PromptBlockProps) => void;
  onDuplicate?: (block: PromptBlockProps) => void;
}

const blockTypeColors = {
  intent: 'bg-primary/10 text-primary border-primary/20',
  tone: 'bg-accent/10 text-accent border-accent/20',
  format: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  context: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  persona: 'bg-pink-500/10 text-pink-500 border-pink-500/20'
};

const PromptBlock = ({ id, type, label, value, onRemove, onEdit, onDuplicate }: PromptBlockProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = (updatedBlock: PromptBlockProps) => {
    onEdit?.(updatedBlock);
  };

  const handleDuplicate = () => {
    onDuplicate?.({ id, type, label, value });
  };

  return (
    <Card 
      className={`p-4 transition-all duration-200 hover:scale-[1.02] cursor-grab active:cursor-grabbing relative group
        ${isHovered ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-border'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-2">
        <Badge className={`${blockTypeColors[type]} capitalize font-mono text-xs`}>
          {type}
        </Badge>
        
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
          <EditBlockDialog 
            block={{ id, type, label, value }} 
            onSave={handleEdit} 
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-accent/20 hover:text-accent"
            onClick={handleDuplicate}
            title="Duplicate block"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
            onClick={() => onRemove?.(id)}
            title="Remove block"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <h3 className="font-medium text-sm mb-2">{label}</h3>
      <p className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded">
        {value}
      </p>
      
      {/* Drag handle indicator */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-50 transition-opacity">
        <div className="flex flex-col space-y-1">
          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
        </div>
      </div>
    </Card>
  );
};

export default PromptBlock;
