import { useState, useEffect, createContext, useContext } from 'react';

type CommandTerminalContextType = {
  isTerminalOpen: boolean;
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;
};

const CommandTerminalContext = createContext<CommandTerminalContextType | undefined>(undefined);

export function CommandTerminalProvider({ children }: { children: React.ReactNode }) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const openTerminal = () => setIsTerminalOpen(true);
  const closeTerminal = () => setIsTerminalOpen(false);
  const toggleTerminal = () => setIsTerminalOpen(prev => !prev);

  // Add global keyboard shortcut (Ctrl+`) to toggle terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the pressed key is backtick (`) with Ctrl key
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        toggleTerminal();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        // Alternative shortcut: Ctrl+K
        e.preventDefault();
        toggleTerminal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <CommandTerminalContext.Provider 
      value={{ isTerminalOpen, openTerminal, closeTerminal, toggleTerminal }}
    >
      {children}
    </CommandTerminalContext.Provider>
  );
}

export function useCommandTerminal() {
  const context = useContext(CommandTerminalContext);
  if (context === undefined) {
    throw new Error('useCommandTerminal must be used within a CommandTerminalProvider');
  }
  return context;
}