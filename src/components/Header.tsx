import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const Header = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <h1 
              className="text-2xl font-bold glitch-text cursor-pointer" 
              data-text="Prompt or Die"
            >
              Prompt or Die
            </h1>
          </Link>
          <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
            BETA
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm hover:text-primary transition-colors">Builder</Link>
          <Link to="/gallery" className="text-sm hover:text-accent transition-colors">Gallery</Link>
          <Link to="/docs" className="text-sm hover:text-primary transition-colors">Docs</Link>
          <a href="https://github.com/promptordie/prompt-builder" target="_blank" className="text-sm hover:text-accent transition-colors">GitHub</a>
        </nav>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="border-border hover:border-primary"
            onClick={() => navigate("/auth")}
          >
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
          
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => navigate("/auth?tab=register")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;