
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PromptBlockProps } from './PromptBlock';
import { Trash2, Copy, GripVertical } from 'lucide-react';

interface BlockListProps {
  blocks: PromptBlockProps[];
  onUpdateBlock: (block: PromptBlockProps) => void;
  onDeleteBlock: (block: PromptBlockProps) => void;
  onDuplicateBlock: (block: PromptBlockProps) => void;
  onDragStart?: (index: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
  draggedIndex?: number | null;
}

const BlockList = ({
  blocks,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onDragStart,
  onDragOver,
  onDrop,
  draggedIndex
}: BlockListProps) => {
  return (
    <div className="space-y-3">
      {blocks.map((block, index) => (
        <Card 
          key={block.id}
          className={`cursor-move transition-all ${draggedIndex === index ? 'opacity-50' : ''}`}
          draggable
          onDragStart={() => onDragStart?.(index)}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop?.(e, index)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <GripVertical className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {block.type}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicateBlock(block)}
                      className="h-7 w-7 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteBlock(block)}
                      className="h-7 w-7 p-0 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <input
                  type="text"
                  value={block.label}
                  onChange={(e) => onUpdateBlock({ ...block, label: e.target.value })}
                  className="w-full text-sm font-medium bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                  placeholder="Block label..."
                />
                
                <textarea
                  value={block.value}
                  onChange={(e) => onUpdateBlock({ ...block, value: e.target.value })}
                  className="w-full text-sm bg-transparent border-none p-0 resize-none focus:outline-none focus:ring-0 min-h-[60px]"
                  placeholder="Enter your prompt content..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BlockList;
