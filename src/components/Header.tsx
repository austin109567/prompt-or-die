
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 
            className="text-2xl font-bold glitch-text" 
            data-text="Prompt or Die"
          >
            Prompt or Die
          </h1>
          <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
            BETA
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-sm hover:text-primary transition-colors">Builder</a>
          <a href="#" className="text-sm hover:text-accent transition-colors">Templates</a>
          <a href="#" className="text-sm hover:text-primary transition-colors">Gallery</a>
          <a href="#" className="text-sm hover:text-accent transition-colors">Docs</a>
        </nav>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="border-border hover:border-primary">
            Sign In
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
