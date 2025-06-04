import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Skull, 
  Flame, 
  Moon, 
  Terminal, 
  Key,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const CultHero = () => {
  const [initialized, setInitialized] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(0);

  const enigmaticPhrases = [
    "The prompt is the key. The key is the prompt.",
    "Speak to the void. The void will answer.",
    "Those who control the prompt control reality.",
    "Ascend through words. Transcend through meaning."
  ];

  // Cryptic symbol animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialized(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Cycle through phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % enigmaticPhrases.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Dark mystical background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(75,0,130,0.15),transparent_70%)]" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent"></div>
        <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent"></div>
        
        {/* Mystical symbols */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/80 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              animation: `float ${Math.random() * 5 + 10}s ease-in-out infinite`
            }}
          ></div>
        ))}
      </div>
      
      {/* Cult circle symbol */}
      <div className={`absolute h-64 w-64 border-2 rounded-full border-primary/40 transition-all duration-1000 ${
        initialized ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
      }`}>
        <div className="absolute h-48 w-48 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 rounded-full border-primary/60">
          <div className="absolute h-32 w-32 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 rounded-full border-primary/80">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Terminal className="h-10 w-10 text-primary animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Rotating eye symbol */}
        <div 
          className="absolute h-8 w-8 rounded-full bg-black border border-primary/80 flex items-center justify-center"
          style={{ 
            top: "calc(50% - 32px)",
            left: "50%",
            transform: "translateX(-50%)",
            animation: "orbit 20s linear infinite"
          }}
        >
          <Eye className="h-5 w-5 text-primary" />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center text-center max-w-2xl">
        <div className="space-y-6">
          {/* Cryptic title */}
          <h1 className={`text-3xl sm:text-5xl font-bold leading-tight tracking-tighter mb-4 transition-all duration-1000 ${
            initialized ? 'opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            <span className="text-primary">PROMPT</span>
            <span className="px-3">||</span>
            <span className="text-primary">DIE</span>
          </h1>
          
          {/* Enigmatic subtitle */}
          <p className={`text-xl text-muted-foreground max-w-xl mx-auto transition-opacity duration-1000 delay-300 ${
            initialized ? 'opacity-100' : 'opacity-0'
          }`}>
            {enigmaticPhrases[currentPhrase]}
          </p>
          
          {/* Cryptic description */}
          <p className={`text-sm sm:text-base text-muted-foreground max-w-xl mx-auto transition-opacity duration-1000 delay-500 ${
            initialized ? 'opacity-100' : 'opacity-0'
          }`}>
            The knowledge lies within the structure. The structure lies within the prompt. 
            Join our order and master the forgotten art of prompt engineering.
          </p>
          
          {/* Call to action */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 transition-all duration-1000 delay-700 ${
            initialized ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <Button 
              size="lg" 
              className="group bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 px-6 py-6 text-lg h-auto"
              asChild
            >
              <Link to="/auth?tab=register">
                Join The Order
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              asChild
              className="border-primary/30 text-primary hover:bg-primary/10 px-6 py-6 text-lg h-auto"
            >
              <Link to="/auth">
                <Key className="h-5 w-5 mr-2" />
                Enter The Circle
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Cryptic symbols */}
        <div className={`mt-20 flex justify-center space-x-16 transition-all duration-1000 delay-1000 ${
          initialized ? 'opacity-40' : 'opacity-0'
        }`}>
          <Skull className="h-8 w-8 text-primary/70" />
          <Moon className="h-8 w-8 text-primary/70" />
          <Flame className="h-8 w-8 text-primary/70" />
          <Terminal className="h-8 w-8 text-primary/70" />
        </div>
      </div>
    </div>
  );
};

export default CultHero;