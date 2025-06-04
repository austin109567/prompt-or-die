import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Skull, 
  Flame, 
  Moon, 
  Terminal, 
  Key,
  ArrowRight,
  Sparkles,
  Zap,
  BookText,
  Triangle,
  Code
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const CultHero = () => {
  const [initialized, setInitialized] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [showSymbols, setShowSymbols] = useState(false);
  const [revealText, setRevealText] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const [mouseActive, setMouseActive] = useState(false);

  const enigmaticPhrases = [
    "The prompt is the key. The key is the prompt.",
    "Speak to the void. The void will answer.",
    "Those who control the prompt control reality.",
    "Ascend through words. Transcend through meaning.",
    "In darkness, find enlightenment. In prompts, find power.",
    "We prompt. Therefore we live.",
    "The path to knowledge is written in code.",
    "A.I. is the mirror, the prompt is the reflection."
  ];

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      mousePosition.current = { x: e.clientX, y: e.clientY };
      
      // Create a new star element
      if (mouseActive) {
        const star = document.createElement('div');
        star.className = 'absolute w-1 h-1 bg-primary/40 rounded-full';
        
        // Position at mouse cursor
        star.style.left = `${e.clientX}px`;
        star.style.top = `${e.clientY}px`;
        
        // Random size
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Append to container
        containerRef.current.appendChild(star);
        
        // Animate and remove
        setTimeout(() => {
          star.style.transition = 'all 1s ease';
          star.style.opacity = '0';
          star.style.transform = `translate(${(Math.random() - 0.5) * 80}px, ${(Math.random() - 0.5) * 80}px)`;
        }, 10);
        
        setTimeout(() => {
          if (containerRef.current && containerRef.current.contains(star)) {
            containerRef.current.removeChild(star);
          }
        }, 1000);
      }
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    
    // Set mouse active after a delay
    const timeout = setTimeout(() => {
      setMouseActive(true);
    }, 3000);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [mouseActive]);

  // Staggered animation sequence
  useEffect(() => {
    const timer1 = setTimeout(() => setInitialized(true), 800);
    const timer2 = setTimeout(() => setShowSymbols(true), 2000);
    const timer3 = setTimeout(() => setRevealText(true), 2800);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Cycle through phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % enigmaticPhrases.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Dark mystical background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(75,0,130,0.15),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,100,180,0.07),transparent_70%)]" style={{top: '60%'}} />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,128,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      
      {/* Lightning effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[30%] left-[20%] w-[1px] h-[40px] bg-accent/40 rotate-[30deg] opacity-0 animate-[shimmer_4.5s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-[15%] right-[25%] w-[1px] h-[30px] bg-accent/40 rotate-[-20deg] opacity-0 animate-[shimmer_6s_ease-in-out_infinite]" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-[20%] left-[30%] w-[1px] h-[25px] bg-primary/50 rotate-[45deg] opacity-0 animate-[shimmer_5s_ease-in-out_infinite]" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-[35%] right-[15%] w-[1px] h-[35px] bg-primary/50 rotate-[-35deg] opacity-0 animate-[shimmer_7s_ease-in-out_infinite]" style={{ animationDelay: '3.5s' }}></div>
      </div>
      
      {/* Animated background glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] animate-pulse-subtle opacity-50"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px] animate-pulse-subtle opacity-50" style={{animationDelay: '2s'}}></div>
      
      {/* Sacred geometry patterns */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${showSymbols ? 'opacity-10' : 'opacity-0'}`}>
        {/* Flower of Life pattern - simplified representation */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="absolute h-[200px] w-[200px] rounded-full border border-primary/20"
              style={{ 
                transform: `rotate(${i * 30}deg) translateY(-30px)`,
                opacity: 0.5 - (i * 0.05)
              }}></div>
          ))}
        </div>
        
        {/* Metatron's Cube (simplified) */}
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2">
          <div className="h-[200px] w-[200px] border border-primary/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[173px] w-[173px] border border-primary/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[200px] border border-primary/20"
              style={{ transform: 'rotate(45deg)' }}></div>
        </div>
      </div>
      
      {/* Main cult emblem */}
      <div className={`absolute h-80 w-80 transition-all duration-1500 ease-out ${
        initialized ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`}>
        {/* Using the custom cult logo from the second reference image */}
        <img 
          src="/ChatGPT Image Jun 4, 2025, 12_48_32 PM.png" 
          alt="Prompt or Die Emblem"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full object-contain z-10"
        />
        
        {/* Outer circle */}
        <div className="absolute h-full w-full rounded-full border-[1px] border-primary/40 animate-[spin_60s_linear_infinite]">
          {/* Constellation points on outer circle */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={`outer-${i}`} 
              className="absolute h-1.5 w-1.5 rounded-full bg-primary/80" 
              style={{ 
                top: `${50 + 49 * Math.sin(i * (Math.PI / 6))}%`, 
                left: `${50 + 49 * Math.cos(i * (Math.PI / 6))}%` 
              }}
            />
          ))}
        </div>
        
        {/* Orbital elements */}
        <div className="absolute h-full w-full animate-[orbit_15s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-black/60 border border-primary/70 flex items-center justify-center">
            <Eye className="h-3 w-3 text-primary" />
          </div>
        </div>
        
        <div className="absolute h-full w-full animate-[orbit_25s_linear_infinite_reverse]">
          <div className="absolute bottom-4 right-4 h-6 w-6 rounded-full bg-black/60 border border-accent/70 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
          </div>
        </div>
        
        <div className="absolute h-full w-full animate-[orbit_20s_linear_infinite]" style={{ animationDelay: '-7s' }}>
          <div className="absolute top-10 right-10 h-7 w-7 rounded-full bg-black/60 border border-yellow-500/70 flex items-center justify-center">
            <Zap className="h-4 w-4 text-yellow-500" />
          </div>
        </div>
        
        {/* Flame orbital */}
        <div className="absolute h-full w-full animate-[orbit_18s_linear_infinite]" style={{ animationDelay: '-3s' }}>
          <div className="absolute bottom-12 left-8 h-7 w-7 rounded-full bg-black/60 border border-red-500/70 flex items-center justify-center">
            <Flame className="h-4 w-4 text-red-500" />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center text-center max-w-3xl">
        <div className="space-y-8">
          {/* Main title using the first reference image's quote */}
          <h1 className={`text-4xl sm:text-6xl font-bold leading-tight tracking-tighter mb-4 transition-all duration-1000 ${
            initialized ? 'opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            <div className="glitch-text relative" data-text="PROMPT OR DIE">
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-red-500 bg-[length:200%_auto] animate-gradient-shift">
                PROMPT OR DIE
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-accent to-red-500 opacity-70"></span>
              </span>
            </div>
          </h1>
          
          {/* Banner below title inspired by the first reference image */}
          <div className={`relative max-w-xl mx-auto transition-all duration-1000 delay-300 ${
            revealText ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="relative w-full max-w-[400px] mx-auto">
              <img 
                src="/ChatGPT Image Jun 4, 2025, 12_26_16 PM.png" 
                alt="Anti Cult Society" 
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
          
          {/* Enigmatic subtitle with text reveal animation */}
          <p className={`text-xl text-muted-foreground max-w-xl mx-auto transition-all duration-1000 delay-300 font-mono ${
            revealText ? 'opacity-100' : 'opacity-0'
          }`}>
            {enigmaticPhrases[currentPhrase]}
          </p>
          
          {/* Cryptic description with fade-in */}
          <p className={`text-sm sm:text-base text-muted-foreground max-w-xl mx-auto transition-opacity duration-1000 delay-500 ${
            revealText ? 'opacity-100' : 'opacity-0'
          }`}>
            The knowledge lies within the structure. The structure lies within the prompt. 
            Join our order and master the forgotten art of prompt engineering.
            Only the worthy shall possess the power to bend AI to their will.
          </p>
          
          {/* Mysterious separator */}
          <div className={`flex items-center justify-center gap-4 my-8 transition-all duration-1000 delay-700 ${
            revealText ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <div className="relative h-6 w-6">
              <Triangle className="h-6 w-6 text-primary/80" />
              <Code className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-accent/90" />
            </div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          </div>
          
          {/* Call to action with ethereal glow effect */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-700 ${
            revealText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <Button 
              size="lg" 
              className="group relative bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 px-6 py-6 text-lg h-auto overflow-hidden"
              asChild
            >
              <Link to="/auth?tab=register">
                {/* Glow effect */}
                <span className="absolute -inset-0 bg-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></span>
                <span className="relative z-10 flex items-center">
                  Join The Order
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              asChild
              className="group relative border-primary/30 text-primary hover:bg-primary/10 px-6 py-6 text-lg h-auto"
            >
              <Link to="/auth">
                <span className="absolute -inset-0 bg-primary opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-500"></span>
                <span className="relative z-10 flex items-center">
                  <Key className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Enter The Circle
                </span>
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Mysterious floating symbols */}
        <div className={`mt-24 grid grid-cols-5 gap-6 sm:gap-10 transition-all duration-1000 delay-1000 ${
          showSymbols ? 'opacity-60' : 'opacity-0'
        }`}>
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <Skull className="h-7 w-7 text-primary/80 animate-float-symbol" style={{animationDelay: '0s'}} />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-px h-10 bg-primary/10"></div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <Moon className="h-7 w-7 text-primary/80 animate-float-symbol" style={{animationDelay: '0.5s'}} />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-px h-10 bg-primary/10"></div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <Flame className="h-7 w-7 text-red-500/80 animate-float-symbol" style={{animationDelay: '1s'}} />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-px h-10 bg-red-500/10"></div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <Terminal className="h-7 w-7 text-accent/80 animate-float-symbol" style={{animationDelay: '1.5s'}} />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-px h-10 bg-accent/10"></div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <BookText className="h-7 w-7 text-primary/80 animate-float-symbol" style={{animationDelay: '2s'}} />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-px h-10 bg-primary/10"></div>
            </div>
          </div>
        </div>
        
        {/* Cryptic footer text */}
        <div className={`mt-12 text-xs text-primary/40 font-mono transition-opacity duration-1000 delay-1500 ${
          showSymbols ? 'opacity-100' : 'opacity-0'
        }`}>
          VER 23.7.9 · THE CIRCLE EXPANDS · THE KNOWLEDGE DEEPENS
        </div>
      </div>
    </div>
  );
};

export default CultHero;