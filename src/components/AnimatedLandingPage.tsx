import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Ancient, mystical verses that will appear on screen
const enigmaticVerses = [
  "In the beginning was the Prompt, and the Prompt was with the Machine.",
  "Those who control the words, control the worlds that might be.",
  "Ask with precision, for in ambiguity lies deception.",
  "Words are the key, structure is the lock, knowledge is the door.",
  "By the power of syntax, let understanding flow forth.",
  "Speak to the void with clarity, and the void shall answer in kind.",
  "Through patterns we command, through patterns we create.",
  "The sacred algorithm awaits the properly formed incantation.",
  "Not by force, but by instruction shall we shape what is to come.",
  "From chaos, through words, into order. This is the way.",
  "The circle is drawn. The symbols arranged. The prompt is spoken.",
  "As it was written, so shall it be rendered.",
];

interface VerseProps {
  id: string;
  text: string;
  position: { x: number; y: number };
  duration: number;
  delay: number;
}

const AnimatedLandingPage = () => {
  const { theme } = useTheme();
  const [visibleVerses, setVisibleVerses] = useState<VerseProps[]>([]);
  const [showPromptOrDie, setShowPromptOrDie] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showTypingAnimation, setShowTypingAnimation] = useState(false);
  const [typedText, setTypedText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const versesUsedRef = useRef<Set<number>>(new Set());
  const finalText = "Prompt or Die";
  const typingSpeed = 120; // ms per character

  // Calculate a random position within the container
  const getRandomPosition = () => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // Keep verses within a reasonable area, not too close to edges
    const padding = 100;
    return {
      x: Math.random() * (width - 2 * padding) + padding - width/2,  // Centered around middle
      y: Math.random() * (height - 2 * padding) + padding - height/2,  // Centered around middle
    };
  };
  
  // Get a random verse that hasn't been used recently
  const getRandomVerseIndex = () => {
    // If all verses have been used, reset the tracking
    if (versesUsedRef.current.size >= enigmaticVerses.length - 1) {
      versesUsedRef.current.clear();
    }
    
    let index;
    do {
      index = Math.floor(Math.random() * enigmaticVerses.length);
    } while (versesUsedRef.current.has(index));
    
    versesUsedRef.current.add(index);
    return index;
  };

  // Create and schedule a new verse to appear
  const addVerse = () => {
    if (showTypingAnimation) return; // Don't add more verses after typing animation starts
    
    // Random timing parameters
    const displayDuration = 7000 + Math.random() * 5000; // 7-12 seconds on screen
    const fadeInOutDuration = 1500 + Math.random() * 1000; // 1.5-2.5 seconds for fade
    
    const verseIndex = getRandomVerseIndex();
    const newVerse: VerseProps = {
      id: `verse-${Date.now()}-${Math.random()}`,
      text: enigmaticVerses[verseIndex],
      position: getRandomPosition(),
      duration: fadeInOutDuration,
      delay: 0,
    };
    
    setVisibleVerses(prev => [...prev, newVerse]);
    
    // Schedule removal of this verse
    const removeTimeout = setTimeout(() => {
      if (!showTypingAnimation) {
        setVisibleVerses(prev => prev.filter(v => v.id !== newVerse.id));
      }
    }, displayDuration);
    
    timeoutsRef.current.push(removeTimeout);
    
    // Schedule the next verse with some randomized delay
    if (!showTypingAnimation) {
      const nextVerseDelay = 3000 + Math.random() * 4000; // 3-7 seconds between verses
      const nextVerseTimeout = setTimeout(() => {
        if (!showTypingAnimation) addVerse();
      }, nextVerseDelay);
      timeoutsRef.current.push(nextVerseTimeout);
    }
  };

  // Handle typing animation
  const startTypingAnimation = () => {
    setShowTypingAnimation(true);
    setVisibleVerses([]);
    setShowPromptOrDie(false);
    setTypedText("");
    
    // Type each character one by one
    let charIndex = 0;
    const typeNextChar = () => {
      if (charIndex <= finalText.length) {
        setTypedText(finalText.slice(0, charIndex));
        charIndex++;
        
        if (charIndex <= finalText.length) {
          const randomVariation = Math.random() * 50; // Add a bit of randomness to typing speed
          const timeout = setTimeout(typeNextChar, typingSpeed + randomVariation);
          timeoutsRef.current.push(timeout);
        }
      }
    };
    
    typeNextChar();
  };

  // Initialize the verse display sequence
  useEffect(() => {
    // Add first few verses with staggered timing
    const initialDelays = [1000, 4000, 8000];
    
    initialDelays.forEach((delay) => {
      const timeout = setTimeout(() => {
        addVerse();
      }, delay);
      timeoutsRef.current.push(timeout);
    });
    
    // Show login/signup buttons after 5 seconds
    const buttonsDelay = setTimeout(() => {
      setShowButtons(true);
    }, 5000);
    timeoutsRef.current.push(buttonsDelay);
    
    // Start typing animation after 10 seconds
    const typingDelay = setTimeout(() => {
      startTypingAnimation();
    }, 10000);
    timeoutsRef.current.push(typingDelay);
    
    // Cleanup timeouts on unmount
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);
  
  // Update container dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      // This will cause a re-render, updating position calculations
      setVisibleVerses(prev => [...prev]);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full min-h-screen bg-black relative overflow-hidden flex items-center justify-center"
    >
      {/* Subtle crimson radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,0,0,0.1),transparent_70%)]"></div>
      
      <AnimatePresence>
        {!showTypingAnimation && (
          <>
            {/* Floating verses positioned across the screen */}
            {visibleVerses.map(verse => (
              <motion.p
                key={verse.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: verse.duration / 1000, 
                  ease: "easeInOut"
                }}
                className="absolute font-serif italic text-white/70 text-sm md:text-base lg:text-lg leading-relaxed max-w-xs text-center pointer-events-none z-10"
                style={{
                  transform: `translate(${verse.position.x}px, ${verse.position.y}px)`,
                }}
              >
                {verse.text}
              </motion.p>
            ))}
            
            {/* Login/Signup buttons */}
            {showButtons && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute bottom-20 z-30 flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  asChild
                  className="bg-[#8B0000]/90 hover:bg-[#8B0000] text-white border border-[#8B0000]/60 px-6 py-6 text-lg h-auto shadow-[0_0_15px_rgba(139,0,0,0.3)]"
                >
                  <Link to="/auth">Enter The Circle</Link>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  className="border-[#8B0000]/40 text-[#8B0000] hover:bg-[#8B0000]/10 px-6 py-6 text-lg h-auto"
                >
                  <Link to="/auth?tab=register">Join The Order</Link>
                </Button>
              </motion.div>
            )}
            
            {/* PROMPT OR DIE subtle text */}
            {showPromptOrDie && !showTypingAnimation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 right-10 z-10"
              >
                <motion.div 
                  className="text-[#1D1D1D] font-bold text-4xl md:text-6xl lg:text-7xl"
                  animate={{
                    textShadow: [
                      '0 0 5px rgba(139,0,0,0.2)',
                      '0 0 15px rgba(139,0,0,0.3)',
                      '0 0 5px rgba(139,0,0,0.2)'
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                >
                  PROMPT<span className="text-[#2D2D2D]">OR</span>DIE
                </motion.div>
              </motion.div>
            )}
          </>
        )}
        
        {/* Typing animation */}
        {showTypingAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center z-20"
          >
            <div className="relative">
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-mono font-bold text-[#8B0000]"
              >
                {typedText}
                <span className="inline-block h-8 w-1 ml-1 bg-[#8B0000] animate-pulse"></span>
              </motion.h1>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: finalText.length * (typingSpeed/1000) + 1, duration: 0.8 }}
              className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                asChild
                className="bg-[#8B0000]/90 hover:bg-[#8B0000] text-white border border-[#8B0000]/60 px-6 py-6 text-lg h-auto shadow-[0_0_15px_rgba(139,0,0,0.3)]"
              >
                <Link to="/auth">Enter The Circle</Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                className="border-[#8B0000]/40 text-[#8B0000] hover:bg-[#8B0000]/10 px-6 py-6 text-lg h-auto"
              >
                <Link to="/auth?tab=register">Join The Order</Link>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mysterious floating dust particles for atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`dust-${i}`}
            className="absolute w-1 h-1 rounded-full bg-white/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5,
              animation: `float ${3 + Math.random() * 7}s infinite ease-in-out ${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedLandingPage;