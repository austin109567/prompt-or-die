
import PromptBlock, { PromptBlockProps } from "./PromptBlock";

interface BlockListProps {
  blocks: PromptBlockProps[];
  onRemove: (id: string) => void;
  onUpdate: (block: PromptBlockProps) => void;
  onDuplicate: (block: PromptBlockProps) => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropIndex: number) => void;
  draggedIndex: number | null;
}

const BlockList = ({
  blocks,
  onRemove,
  onUpdate,
  onDuplicate,
  onDragStart,
  onDragOver,
  onDrop,
  draggedIndex
}: BlockListProps) => {
  return (
    <>
      {blocks.map((block, index) => (
        <div
          key={block.id}
          draggable
          onDragStart={() => onDragStart(index)}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, index)}
          className={`transition-all duration-200 ${
            draggedIndex === index ? 'opacity-50 scale-95' : ''
          }`}
        >
          <PromptBlock
            {...block}
            onRemove={onRemove}
            onEdit={onUpdate}
            onDuplicate={onDuplicate}
          />
        </div>
      ))}
    </>
  );
};

export default BlockList;
