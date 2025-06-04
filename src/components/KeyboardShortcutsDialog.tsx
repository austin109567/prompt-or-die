import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KeyboardShortcutsDialog = ({ open, onOpenChange }: KeyboardShortcutsDialogProps) => {
  const shortcuts = [
    {
      action: "Add new block",
      mac: "⌘ + N",
      windows: "Ctrl + N"
    },
    {
      action: "Generate prompt",
      mac: "⌘ + Enter",
      windows: "Ctrl + Enter"
    },
    {
      action: "Copy prompt",
      mac: "⌘ + Shift + C",
      windows: "Ctrl + Shift + C"
    },
    {
      action: "Export prompt",
      mac: "⌘ + E",
      windows: "Ctrl + E"
    },
    {
      action: "Delete selected block",
      mac: "⌘ + Delete",
      windows: "Ctrl + Delete"
    },
    {
      action: "Duplicate block",
      mac: "⌘ + D",
      windows: "Ctrl + D"
    },
    {
      action: "Show keyboard shortcuts",
      mac: "⌘ + /",
      windows: "Ctrl + /"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Boost your productivity with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="font-medium text-sm">Action</div>
          <div className="font-medium text-sm">Mac</div>
          <div className="font-medium text-sm">Windows/Linux</div>
          
          {shortcuts.map((shortcut, index) => (
            <>
              <div key={`action-${index}`} className="text-sm">{shortcut.action}</div>
              <div key={`mac-${index}`} className="text-sm font-mono bg-muted/50 px-2 py-1 rounded text-center">
                {shortcut.mac}
              </div>
              <div key={`win-${index}`} className="text-sm font-mono bg-muted/50 px-2 py-1 rounded text-center">
                {shortcut.windows}
              </div>
            </>
          ))}
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <p>More shortcuts will be added in future updates.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsDialog;