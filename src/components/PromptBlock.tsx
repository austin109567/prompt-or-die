
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Edit2 } from "lucide-react";

export interface PromptBlockProps {
  id: string;
  type: 'intent' | 'tone' | 'format' | 'context' | 'persona';
  label: string;
  value: string;
  onRemove?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const blockTypeColors = {
  intent: 'bg-primary/10 text-primary border-primary/20',
  tone: 'bg-accent/10 text-accent border-accent/20',
  format: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  context: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  persona: 'bg-pink-500/10 text-pink-500 border-pink-500/20'
};

const PromptBlock = ({ id, type, label, value, onRemove, onEdit }: PromptBlockProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={`p-4 transition-all duration-200 hover:scale-[1.02] cursor-pointer relative group
        ${isHovered ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-border'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-2">
        <Badge className={`${blockTypeColors[type]} capitalize font-mono text-xs`}>
          {type}
        </Badge>
        
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-muted"
            onClick={() => onEdit?.(id)}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
            onClick={() => onRemove?.(id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <h3 className="font-medium text-sm mb-2">{label}</h3>
      <p className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded">
        {value}
      </p>
    </Card>
  );
};

export default PromptBlock;
