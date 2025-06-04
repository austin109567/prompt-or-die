import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { 
  Code, 
  ExternalLink, 
  Github, 
  Menu, 
  Moon, 
  Sun, 
  Terminal, 
  User 
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50 transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md flex items-center justify-center bg-primary/20 border border-primary/30">
              <Terminal className="h-4 w-4 text-primary" />
            </div>
            <h1 
              className="text-xl font-bold glitch-text hidden sm:block" 
              data-text="Prompt or Die"
            >
              Prompt or Die
            </h1>
          </Link>
          <span className="text-xs text-primary font-mono bg-primary/10 px-2 py-1 rounded border border-primary/20">
            BETA
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Builder</Link>
          <Link to="/gallery" className="text-sm font-medium hover:text-accent transition-colors">Gallery</Link>
          <Link to="/docs" className="text-sm font-medium hover:text-primary transition-colors">Docs</Link>
          <a 
            href="https://github.com/promptordie/prompt-builder" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1"
          >
            GitHub
            <ExternalLink className="h-3 w-3" />
          </a>
        </nav>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </Button>
          
          <div className="hidden sm:block">
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-2 border-border hover:border-primary hover:text-primary"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
            
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-effect"
              onClick={() => navigate("/auth?tab=register")}
            >
              Get Started
            </Button>
          </div>
          
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader className="mb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    Prompt or Die
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4">
                  <Link 
                    to="/" 
                    className="text-sm font-medium hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Builder
                  </Link>
                  <Link 
                    to="/gallery" 
                    className="text-sm font-medium hover:text-accent transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Gallery
                  </Link>
                  <Link 
                    to="/docs" 
                    className="text-sm font-medium hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Docs
                  </Link>
                  <a 
                    href="https://github.com/promptordie/prompt-builder" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1 py-2"
                  >
                    GitHub
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </nav>
                <div className="mt-6 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-border hover:border-primary hover:text-primary"
                    onClick={() => {
                      navigate("/auth");
                      setIsMenuOpen(false);
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  
                  <Button 
                    className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => {
                      navigate("/auth?tab=register");
                      setIsMenuOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;