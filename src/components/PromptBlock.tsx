import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, GripVertical, Pencil, Trash } from "lucide-react";
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

const blockTypeConfig = {
  intent: {
    color: 'bg-primary/10 text-primary border-primary/20',
    hoverColor: 'hover:border-primary hover:shadow-[0_0_10px_rgba(0,255,128,0.2)]',
    icon: '🎯'
  },
  tone: {
    color: 'bg-accent/10 text-accent border-accent/20',
    hoverColor: 'hover:border-accent hover:shadow-[0_0_10px_rgba(0,255,255,0.2)]',
    icon: '🔊'
  },
  format: {
    color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    hoverColor: 'hover:border-yellow-500 hover:shadow-[0_0_10px_rgba(234,179,8,0.2)]',
    icon: '📋'
  },
  context: {
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    hoverColor: 'hover:border-purple-500 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)]',
    icon: '🌍'
  },
  persona: {
    color: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    hoverColor: 'hover:border-pink-500 hover:shadow-[0_0_10px_rgba(236,72,153,0.2)]',
    icon: '👤'
  }
};

const PromptBlock = ({ id, type, label, value, onRemove, onEdit, onDuplicate }: PromptBlockProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const typeConfig = blockTypeConfig[type];

  const handleEdit = (updatedBlock: PromptBlockProps) => {
    onEdit?.(updatedBlock);
  };

  const handleDuplicate = () => {
    onDuplicate?.({ id, type, label, value });
  };

  return (
    <Card 
      className={`p-4 transition-all duration-300 hover:scale-[1.01] cursor-grab active:cursor-grabbing relative group
        border ${isHovered ? 'border-' + type + '/50 shadow-lg' : 'border-border/60'} 
        ${typeConfig.hoverColor} rounded-lg mb-3`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-lg bg-gradient-to-b from-primary/50 via-accent/50 to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-lg select-none">
            {typeConfig.icon}
          </div>
          <Badge className={`${typeConfig.color} capitalize font-semibold`}>
            {type}
          </Badge>
        </div>
        
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 rounded-md hover:bg-muted"
            onClick={handleDuplicate}
            title="Duplicate block"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          
          <EditBlockDialog 
            block={{ id, type, label, value }} 
            onSave={handleEdit} 
          />
          
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive rounded-md"
            onClick={() => onRemove?.(id)}
            title="Remove block"
          >
            <Trash className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      <h3 className="text-base font-semibold mb-2 pr-6">{label}</h3>
      <div className="text-sm text-muted-foreground font-mono bg-muted/30 p-3 rounded-md border border-muted overflow-auto max-h-32">
        {value}
      </div>
      
      {/* Drag handle */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-opacity cursor-grab">
        <GripVertical className="h-5 w-5" />
      </div>
    </Card>
  );
};

export default PromptBlock;