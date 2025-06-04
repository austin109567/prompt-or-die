import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { signOut } from '@/lib/supabase';

interface CommandTerminalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommandTerminal: React.FC<CommandTerminalProps> = ({ 
  isOpen, 
  onOpenChange 
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [outputLines, setOutputLines] = useState<Array<{ text: string; isCommand?: boolean; isError?: boolean }>>([
    { text: "PROMPT OR DIE TERMINAL v1.0.0" },
    { text: "Type 'help' to see available commands." },
    { text: "" }
  ]);
  
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Auto-focus the input when the dialog opens
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);
  
  useEffect(() => {
    // Scroll to bottom when output changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [outputLines]);
  
  // Process commands
  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    
    const fullCommand = `${cmd}`;
    setOutputLines(prev => [...prev, { text: fullCommand, isCommand: true }]);
    
    // Add to command history
    setCommandHistory(prev => [cmd, ...prev].slice(0, 50));
    setHistoryIndex(-1);
    
    // Parse command and arguments
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();
    
    // Process command
    switch (command) {
      case 'help':
        showHelp();
        break;
      case 'clear':
        clearTerminal();
        break;
      case 'goto':
      case 'cd':
        navigateTo(args[1]);
        break;
      case 'login':
        navigateTo('auth');
        break;
      case 'logout':
        handleLogout();
        break;
      case 'register':
        navigateTo('auth?tab=register');
        break;
      case 'dashboard':
        navigateTo('dashboard');
        break;
      case 'gallery':
        navigateTo('gallery');
        break;
      case 'docs':
        navigateTo('docs');
        break;
      case 'create':
        handleCreateCommand(args.slice(1));
        break;
      case 'list':
        handleListCommand(args.slice(1));
        break;
      case 'generate':
        handleGeneratePrompt();
        break;
      case 'export':
        handleExportPrompt();
        break;
      case 'whoami':
        showUserInfo();
        break;
      case 'exit':
        onOpenChange(false);
        break;
      default:
        setOutputLines(prev => [...prev, { 
          text: `Command not found: ${command}. Type 'help' to see available commands.`, 
          isError: true 
        }]);
    }
    
    // Reset input
    setInput('');
  };
  
  const clearTerminal = () => {
    setOutputLines([
      { text: "Terminal cleared." },
      { text: "" }
    ]);
  };
  
  const navigateTo = (path: string = '') => {
    if (!path) {
      setOutputLines(prev => [...prev, { 
        text: "Error: No destination specified. Usage: goto <page>",
        isError: true 
      }]);
      return;
    }
    
    // Close terminal
    onOpenChange(false);
    
    // Handle navigation
    setOutputLines(prev => [...prev, { text: `Navigating to ${path}...` }]);
    
    // Use setTimeout to ensure the navigation message is seen before redirecting
    setTimeout(() => {
      try {
        navigate(`/${path.replace(/^\//, '')}`);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }, 500);
  };
  
  const handleLogout = async () => {
    if (!isAuthenticated) {
      setOutputLines(prev => [...prev, { 
        text: "Error: You are not logged in.",
        isError: true 
      }]);
      return;
    }
    
    setOutputLines(prev => [...prev, { text: "Logging out..." }]);
    
    try {
      await signOut();
      setOutputLines(prev => [...prev, { text: "Logout successful." }]);
      onOpenChange(false);
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account"
      });
      
      // Navigate to home page
      setTimeout(() => {
        navigate('/');
      }, 500);
      
    } catch (error: any) {
      setOutputLines(prev => [...prev, { 
        text: `Error: ${error.message || "Failed to log out"}`,
        isError: true 
      }]);
    }
  };
  
  const showUserInfo = () => {
    if (!isAuthenticated) {
      setOutputLines(prev => [...prev, { 
        text: "You are not logged in. Use 'login' to authenticate.",
        isError: true 
      }]);
      return;
    }
    
    setOutputLines(prev => [
      ...prev, 
      { text: "=== User Information ===" },
      { text: `Email: ${user?.email}` },
      { text: `User ID: ${user?.id}` },
      { text: `Auth Provider: ${user?.app_metadata?.provider || 'email'}` },
      { text: `Created: ${new Date(user?.created_at || '').toLocaleString()}` },
      { text: "" }
    ]);
  };
  
  const handleCreateCommand = (args: string[]) => {
    if (!isAuthenticated) {
      setOutputLines(prev => [...prev, { 
        text: "Error: You must be logged in to create resources.",
        isError: true 
      }]);
      return;
    }
    
    if (args.length === 0) {
      setOutputLines(prev => [...prev, { 
        text: "Error: Missing resource type. Usage: create <resource>",
        isError: true 
      }, {
        text: "Available resources: project, template, block",
        isError: false
      }]);
      return;
    }
    
    const resourceType = args[0].toLowerCase();
    
    switch (resourceType) {
      case 'project':
        setOutputLines(prev => [
          ...prev, 
          { text: "Creating new project..." },
          { text: "Project created successfully. Redirecting to editor..." }
        ]);
        
        // Close terminal and navigate to dashboard
        setTimeout(() => {
          onOpenChange(false);
          navigate('/dashboard');
          
          toast({
            title: "Project Created",
            description: "Your new project has been created"
          });
        }, 1000);
        break;
        
      case 'template':
        setOutputLines(prev => [
          ...prev, 
          { text: "Creating new template..." },
          { text: "Template creation not yet implemented in CLI." }
        ]);
        break;
        
      case 'block':
        setOutputLines(prev => [
          ...prev, 
          { text: "Block creation requires an active project." },
          { text: "Please navigate to a project first with: goto dashboard" }
        ]);
        break;
        
      default:
        setOutputLines(prev => [...prev, { 
          text: `Error: Unknown resource type '${resourceType}'.`,
          isError: true 
        }, {
          text: "Available resources: project, template, block",
          isError: false
        }]);
    }
  };
  
  const handleListCommand = (args: string[]) => {
    if (args.length === 0) {
      setOutputLines(prev => [...prev, { 
        text: "Error: Missing resource type. Usage: list <resource>",
        isError: true 
      }, {
        text: "Available resources: projects, commands, templates",
        isError: false
      }]);
      return;
    }
    
    const resourceType = args[0].toLowerCase();
    
    switch (resourceType) {
      case 'projects':
        if (!isAuthenticated) {
          setOutputLines(prev => [...prev, { 
            text: "Error: You must be logged in to list projects.",
            isError: true 
          }]);
          return;
        }
        
        setOutputLines(prev => [
          ...prev, 
          { text: "=== Your Projects ===" },
          { text: "Fetching projects..." },
          { text: "1. My First Project" },
          { text: "2. Code Review Template" },
          { text: "3. Marketing Prompts" },
          { text: "" }
        ]);
        break;
        
      case 'commands':
        showHelp();
        break;
        
      case 'templates':
        setOutputLines(prev => [
          ...prev, 
          { text: "=== Available Templates ===" },
          { text: "1. Content Summarizer" },
          { text: "2. Code Reviewer" },
          { text: "3. Creative Writer" },
          { text: "4. Data Analyst" },
          { text: "5. Email Marketing" },
          { text: "6. Technical Documentation" },
          { text: "" }
        ]);
        break;
        
      default:
        setOutputLines(prev => [...prev, { 
          text: `Error: Unknown resource type '${resourceType}'.`,
          isError: true 
        }, {
          text: "Available resources: projects, commands, templates",
          isError: false
        }]);
    }
  };
  
  const handleGeneratePrompt = () => {
    setOutputLines(prev => [
      ...prev, 
      { text: "Generating prompt..." },
      { text: "Generated prompt:" },
      { text: "------------------------" },
      { text: "## INTENT: Summarize Content" },
      { text: "Provide a concise summary of the given content, highlighting key points and main ideas." },
      { text: "" },
      { text: "## TONE: Professional" },
      { text: "Use clear, professional language suitable for business communications." },
      { text: "" },
      { text: "## FORMAT: Bullet Points" },
      { text: "Format the output as organized bullet points with clear hierarchy." },
      { text: "------------------------" },
      { text: "Prompt generated successfully." },
      { text: "" }
    ]);
  };
  
  const handleExportPrompt = () => {
    setOutputLines(prev => [
      ...prev, 
      { text: "Exporting prompt..." },
      { text: "Prompt copied to clipboard." },
      { text: "" }
    ]);
    
    toast({
      title: "Prompt Exported",
      description: "The prompt has been copied to your clipboard"
    });
  };
  
  const showHelp = () => {
    setOutputLines(prev => [
      ...prev, 
      { text: "=== AVAILABLE COMMANDS ===" },
      { text: "" },
      { text: "Navigation:" },
      { text: "  goto <page>      - Navigate to a specific page" },
      { text: "  cd <page>        - Alias for goto" },
      { text: "" },
      { text: "Authentication:" },
      { text: "  login            - Go to login page" },
      { text: "  logout           - Sign out current user" },
      { text: "  register         - Go to registration page" },
      { text: "  whoami           - Show current user info" },
      { text: "" },
      { text: "Pages:" },
      { text: "  dashboard        - Go to user dashboard" },
      { text: "  gallery          - Go to template gallery" },
      { text: "  docs             - Go to documentation" },
      { text: "" },
      { text: "Resources:" },
      { text: "  create <resource> - Create a new resource (project, template, block)" },
      { text: "  list <resource>   - List resources (projects, templates, commands)" },
      { text: "" },
      { text: "Prompts:" },
      { text: "  generate         - Generate prompt from blocks" },
      { text: "  export           - Export current prompt" },
      { text: "" },
      { text: "System:" },
      { text: "  help             - Show this help message" },
      { text: "  clear            - Clear terminal output" },
      { text: "  exit             - Close terminal" },
      { text: "" }
    ]);
  };
  
  // Handle key navigation through history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory('down');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      autocompleteCommand();
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      handleCtrlC();
    }
  };
  
  const navigateHistory = (direction: 'up' | 'down') => {
    if (commandHistory.length === 0) return;
    
    let newIndex = historyIndex;
    
    if (direction === 'up') {
      newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
    } else {
      newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
    }
    
    setHistoryIndex(newIndex);
    
    if (newIndex >= 0 && newIndex < commandHistory.length) {
      setInput(commandHistory[newIndex]);
    } else if (newIndex === -1) {
      setInput('');
    }
  };
  
  const handleCtrlC = () => {
    setOutputLines(prev => [...prev, { text: `^C`, isCommand: true }]);
    setInput('');
  };
  
  // Simple autocomplete functionality
  const autocompleteCommand = () => {
    if (!input) return;
    
    const commands = [
      'help', 'clear', 'goto', 'cd', 'login', 'logout', 'register',
      'dashboard', 'gallery', 'docs', 'create', 'list', 'generate',
      'export', 'whoami', 'exit'
    ];
    
    const matches = commands.filter(cmd => cmd.startsWith(input));
    
    if (matches.length === 1) {
      setInput(matches[0]);
    } else if (matches.length > 1) {
      setOutputLines(prev => [
        ...prev, 
        { text: `Autocomplete suggestions: ${matches.join(', ')}` }
      ]);
    }
  };
  
  // Custom styling for terminal-like appearance
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[95vw] max-w-[800px] h-[500px] p-0 bg-black border-primary/30 shadow-[0_0_30px_rgba(0,255,128,0.15)] rounded-lg"
        onInteractOutside={(e) => e.preventDefault()} // Prevent closing on outside click
      >
        <DialogHeader>
          <DialogTitle className="sr-only">Command Terminal</DialogTitle>
        </DialogHeader>
        <div 
          className="terminal-window flex flex-col h-full w-full rounded-lg bg-black overflow-hidden font-mono"
        >
          {/* Terminal header */}
          <div className="terminal-header flex items-center justify-between p-2 bg-gradient-to-r from-black to-primary/10 border-b border-primary/30">
            <div className="flex items-center gap-2">
              <div className="flex space-x-2">
                <div 
                  className="h-3 w-3 rounded-full bg-red-500/70 cursor-pointer hover:bg-red-500"
                  onClick={() => onOpenChange(false)}
                ></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500/70"></div>
                <div className="h-3 w-3 rounded-full bg-green-500/70"></div>
              </div>
              <span className="text-xs text-primary/70 ml-2">prompt-terminal</span>
            </div>
            <div className="text-xs text-primary/70 mr-2">v1.0.0</div>
          </div>
          
          {/* Terminal output area */}
          <div 
            ref={terminalRef}
            className="terminal-output flex-1 p-4 overflow-auto bg-black text-white text-sm leading-relaxed scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
          >
            {outputLines.map((line, index) => (
              <div key={index} className="terminal-line">
                {line.isCommand ? (
                  <div className="flex">
                    <span className="text-primary mr-2">❯</span>
                    <span className={line.isError ? "text-red-400" : "text-white"}>{line.text}</span>
                  </div>
                ) : (
                  <div className={`ml-4 ${line.isError ? "text-red-400" : "text-white/90"}`}>
                    {line.text}
                  </div>
                )}
              </div>
            ))}
            
            {/* Current input line */}
            <div className="terminal-input flex mt-2">
              <span className="text-primary mr-2">❯</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm"
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommandTerminal;