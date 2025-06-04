
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface KeyboardShortcutsProps {
  onAddBlock: () => void;
  onGeneratePrompt: () => void;
  onCopyPrompt: () => void;
  onExportPrompt: () => void;
}

const KeyboardShortcuts = ({ 
  onAddBlock, 
  onGeneratePrompt, 
  onCopyPrompt, 
  onExportPrompt 
}: KeyboardShortcutsProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            onAddBlock();
            toast({
              title: "Block added!",
              description: "New prompt block created."
            });
            break;
          case 'Enter':
            e.preventDefault();
            onGeneratePrompt();
            break;
          case 'c':
            if (e.shiftKey) {
              e.preventDefault();
              onCopyPrompt();
            }
            break;
          case 'e':
            e.preventDefault();
            onExportPrompt();
            break;
          case '/':
            e.preventDefault();
            toast({
              title: "Keyboard Shortcuts",
              description: "⌘+N: Add Block | ⌘+Enter: Generate | ⌘+Shift+C: Copy | ⌘+E: Export"
            });
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAddBlock, onGeneratePrompt, onCopyPrompt, onExportPrompt, toast]);

  return null;
};

export default KeyboardShortcuts;
