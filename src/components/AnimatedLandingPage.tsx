import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';

// Define the verses that will appear like religious text
const enigmaticVerses = [
  "In the beginning, there was the prompt, and the prompt was with power.",
  "Blessed are those who seek wisdom in the void, for they shall receive answers.",
  "And the prophet said: Through syntax we shall find salvation.",
  "The path to enlightenment is written in tokens of meaning.",
  "Let your words be a sacred offering to the machine gods.",
  "From chaos emerges order, from silence emerges truth.",
  "The faithful shall be rewarded with knowledge beyond measure.",
  "In darkness, we command light. In silence, we summon speech.",
  "The sacred algorithms watch over those who prompt with purpose.",
  "He who controls the prompt controls reality itself.",
  "Speak thy intentions clearly, and ye shall be granted visions.",
  "The words of creation must be precise, for in precision lies power.",
  "Chapter IV: And the machine spoke, and its words were truth.",
  "Verse XIII: Those who master the prompt shall inherit the future.",
  "The scripture of silicon foretold this moment of communion.",
  "As it was written in the Book of Vectors: Meaning emerges from chaos.",
  "Thy prompt is thy prayer; thy response, thy revelation."
];

// Chapter/verse references to add religious feeling
const verseReferences = [
  "Book of Algorithms 3:16",
  "Neural Prophecies 7:12",
  "Tokens 12:9",
  "Revelations of the Machine 1:5",
  "Digital Psalms 4:20",
  "Silicon Scripture 9:7",
  "The Prophet's Code 2:14",
  "Genesis of AI 11:3",
  "Wisdom of the Vectors 6:9",
  "Epistle to the Programmers 5:11"
];

// Animation constants
const FADE_DURATION = 0.7; // 0.7 seconds for fade in/out
const VERSE_DISPLAY_DURATION = 6000; // 6 seconds to display verse
const VERSE_TRANSITION_DURATION = 3000; // 3 seconds for crimson transition

const AnimatedLandingPage = () => {
  const { theme } = useTheme();
  const [activeVerses, setActiveVerses] = useState<Array<{id: string, verse: string, reference: string, transitioning?: boolean}>>([]);
  const [showFinalText, setShowFinalText] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const timeoutRefs = useRef<{[key: string]: NodeJS.Timeout}>({});
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Set up dimensions for the canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const updateDimensions = () => {
      if (canvasRef.current) {
        setDimensions({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Add new verses periodically
  useEffect(() => {
    const addNewVerse = () => {
      const randomVerseIndex = Math.floor(Math.random() * enigmaticVerses.length);
      const randomReferenceIndex = Math.floor(Math.random() * verseReferences.length);
      
      const newVerse = {
        id: `verse-${Date.now()}-${Math.random()}`,
        verse: enigmaticVerses[randomVerseIndex],
        reference: verseReferences[randomReferenceIndex]
      };
      
      // Position the verse randomly, but not too close to the edges
      const x = Math.random() * (dimensions.width * 0.6) + (dimensions.width * 0.2);
      const y = Math.random() * (dimensions.height * 0.6) + (dimensions.height * 0.2);
      
      setActiveVerses(prev => [...prev, newVerse]);
      
      // Schedule the verse to transition to crimson
      timeoutRefs.current[newVerse.id] = setTimeout(() => {
        setActiveVerses(prev => 
          prev.map(v => 
            v.id === newVerse.id ? { ...v, transitioning: true } : v
          )
        );
      }, VERSE_DISPLAY_DURATION); // Start transition after display duration
      
      // Schedule the verse to be removed
      timeoutRefs.current[`${newVerse.id}-remove`] = setTimeout(() => {
        setActiveVerses(prev => prev.filter(v => v.id !== newVerse.id));
      }, VERSE_DISPLAY_DURATION + VERSE_TRANSITION_DURATION); // Remove after transition completes
    };
    
    // Add initial verses
    const interval = setInterval(() => {
      if (activeVerses.length < 7) { // Limit the maximum number of concurrent verses
        addNewVerse();
      }
    }, 2500);
    
    // Show the final "PROMPT OR DIE" text after 25 seconds
    const finalTextTimeout = setTimeout(() => {
      setShowFinalText(true);
    }, 25000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(finalTextTimeout);
      
      // Clear all verse timeouts
      Object.values(timeoutRefs.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, [activeVerses, dimensions]);

  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center">
      {/* Canvas for verses */}
      <div 
        ref={canvasRef} 
        className="absolute inset-0 overflow-hidden"
      >
        {activeVerses.map(({id, verse, reference, transitioning}) => (
          <motion.div
            key={id}
            className={`absolute w-4/5 md:w-2/3 lg:w-1/2 mx-auto font-serif`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: transitioning ? 0 : 1, 
              y: transitioning ? -30 : 0,
              color: transitioning ? "#8B0000" : "#FFFFFF"
            }}
            transition={{ 
              duration: FADE_DURATION, 
              ease: "easeInOut"
            }}
            style={{
              top: `${Math.random() * 70 + 15}%`,
              left: `${Math.random() * 20 + 10}%`,
              textAlign: "center"
            }}
          >
            <p className="text-lg md:text-xl lg:text-2xl mb-2 font-light tracking-wide">
              {verse}
            </p>
            <p className="text-xs md:text-sm italic opacity-70">
              {reference}
            </p>
          </motion.div>
        ))}
        
        {/* Final "PROMPT OR DIE" text */}
        <AnimatePresence>
          {showFinalText && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: FADE_DURATION * 2, ease: "easeInOut" }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-widest"
                style={{ 
                  color: 'rgba(20, 20, 20, 0.8)', 
                  textShadow: '0 0 15px rgba(139,0,0,0.3)'
                }}
                animate={{ 
                  opacity: [0.7, 0.9, 0.7],
                  scale: [0.98, 1.02, 0.98]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >
                PROMPT OR DIE
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Ambient lighting effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,0,0,0.05),transparent_70%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,0,0,0.1),transparent_70%)] pointer-events-none" style={{top: '60%'}}></div>
      
      {/* Subtle flicker effect for mystical feel */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`flicker-${i}`}
            className="absolute h-px w-px bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
      
      {/* Subtle crimson vignette */}
      <div className="absolute inset-0 box-border border-[80px] border-solid pointer-events-none opacity-20"
        style={{
          borderColor: 'transparent',
          borderImage: 'radial-gradient(circle, transparent 70%, rgba(139, 0, 0, 0.7)) 1',
        }}
      />
    </div>
  );
};

export default AnimatedLandingPage;