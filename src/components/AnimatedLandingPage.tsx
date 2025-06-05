import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';

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

const AnimatedLandingPage = () => {
  const { theme } = useTheme();
  const [currentVerseIndex, setCurrentVerseIndex] = useState(-1);
  const [visibleVerses, setVisibleVerses] = useState<{id: string, text: string, position: {x: number, y: number}}[]>([]);
  const [showPromptOrDie, setShowPromptOrDie] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nextVerseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Set up dimensions for positioning verses
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        if (containerRef.current) {
          setDimensions({
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
          });
        }
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      
      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    }
  }, []);

  // Start showing verses after component mounts
  useEffect(() => {
    // Start with a slight delay
    const initialDelay = setTimeout(() => {
      showNextVerse();
    }, 1000);

    // Show "PROMPT OR DIE" after all verses have cycled through
    const promptOrDieDelay = setTimeout(() => {
      setShowPromptOrDie(true);
    }, enigmaticVerses.length * 6000 + 3000);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(promptOrDieDelay);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (nextVerseTimeoutRef.current) clearTimeout(nextVerseTimeoutRef.current);
    };
  }, []);

  const showNextVerse = () => {
    const nextIndex = (currentVerseIndex + 1) % enigmaticVerses.length;
    setCurrentVerseIndex(nextIndex);
    
    // Generate a random position within the container, but keep a margin from edges
    const margin = 100; // pixels from edge
    const x = margin + Math.random() * (dimensions.width - 2 * margin);
    const y = margin + Math.random() * (dimensions.height - 2 * margin);
    
    const newVerse = {
      id: `verse-${Date.now()}`,
      text: enigmaticVerses[nextIndex],
      position: { x, y }
    };
    
    setVisibleVerses(prev => [...prev, newVerse]);
    
    // Schedule the verse to be removed
    timeoutRef.current = setTimeout(() => {
      setVisibleVerses(prev => prev.filter(verse => verse.id !== newVerse.id));
    }, 5000); // Verse stays visible for 5 seconds
    
    // Schedule the next verse
    nextVerseTimeoutRef.current = setTimeout(() => {
      showNextVerse();
    }, 6000); // New verse every 6 seconds
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Subtle crimson radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,0,0,0.1),transparent_70%)]"></div>
      
      {/* Floating verses */}
      <AnimatePresence>
        {visibleVerses.map(verse => (
          <motion.p
            key={verse.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute font-serif italic text-white/70 text-sm md:text-base lg:text-lg leading-relaxed max-w-md text-center"
            style={{
              left: verse.position.x,
              top: verse.position.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {verse.text}
          </motion.p>
        ))}
      </AnimatePresence>
      
      {/* PROMPT OR DIE text */}
      <AnimatePresence>
        {showPromptOrDie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 right-10 z-10"
          >
            <motion.div 
              className={`text-[#1D1D1D] font-bold text-4xl md:text-6xl lg:text-7xl`}
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
      </AnimatePresence>
      
      {/* Mysterious floating dust particles for atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
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