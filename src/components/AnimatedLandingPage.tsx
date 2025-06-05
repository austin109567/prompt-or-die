import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';

// Define the quotes that will cycle through
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

// The characters we'll use for the floating animation
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
// Expanded list of words
const words = [
  'PROMPT', 'CODE', 'AI', 'VOID', 'CHAOS', 'ORDER', 'SYSTEM', 'WHISPER',
  'CRAFT', 'BUILD', 'DREAM', 'THINK', 'CREATE', 'DESIGN', 'WRITE', 'LEARN',
  'EVOLVE', 'FUTURE', 'MIND', 'NEURAL', 'DIGITAL', 'VIRTUAL', 'QUANTUM', 'VISION',
  'SYNTAX', 'PATTERN', 'LOGIC', 'WISDOM', 'KNOWLEDGE', 'INSIGHT', 'SPARK', 'FLOW'
];

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  letter: string;
  targetWord?: string;
  targetIndex?: number;
  isInWord: boolean;
  wordFormed: boolean;
}

const AnimatedLandingPage = () => {
  const { theme } = useTheme();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const [mouseActive, setMouseActive] = useState(false);
  const [formedWords, setFormedWords] = useState<{[key: string]: {x: number, y: number, word: string}}>({}); 

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
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
        canvasRef.current.appendChild(star);
        
        // Animate and remove
        setTimeout(() => {
          star.style.transition = 'all 1s ease';
          star.style.opacity = '0';
          star.style.transform = `translate(${(Math.random() - 0.5) * 80}px, ${(Math.random() - 0.5) * 80}px)`;
        }, 10);
        
        setTimeout(() => {
          if (canvasRef.current && canvasRef.current.contains(star)) {
            canvasRef.current.removeChild(star);
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

  // Initialize particles after dimensions are set
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const updateDimensions = () => {
      if (!canvasRef.current) return;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      // Generate random particles
      const initialParticles: Particle[] = Array.from({ length: 100 }).map((_, i) => ({
        id: `particle-${i}`,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        letter: characters[Math.floor(Math.random() * characters.length)],
        isInWord: false,
        wordFormed: false
      }));

      setParticles(initialParticles);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Function to check if a letter can start forming a word
  const canFormWord = (letter: string) => {
    // Check if the letter is a potential starting point for any of our words
    return words.some(word => word.startsWith(letter));
  };

  // Function to find potential words that can be formed with the given prefix
  const findPotentialWords = (prefix: string) => {
    return words.filter(word => word.startsWith(prefix));
  };

  // Animation loop for particles
  useEffect(() => {
    if (particles.length === 0 || !canvasRef.current) return;

    const animate = (timestamp: number) => {
      if (!canvasRef.current) return;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      // Keep track of formed words to display them separately
      const newFormedWords: {[key: string]: {x: number, y: number, word: string}} = {...formedWords};
      
      setParticles(prevParticles => {
        // Occasionally try to form a word
        if (Math.random() < 0.005) {
          // Find particles that are not in a word and can potentially start a word
          const availableParticles = prevParticles.filter(p => !p.isInWord && canFormWord(p.letter));
          
          if (availableParticles.length > 0) {
            // Pick a random particle as the word starter
            const starterParticle = availableParticles[Math.floor(Math.random() * availableParticles.length)];
            
            // Find potential words that start with this letter
            const potentialWords = findPotentialWords(starterParticle.letter);
            
            if (potentialWords.length > 0) {
              // Choose a random word from potential words
              const targetWord = potentialWords[Math.floor(Math.random() * potentialWords.length)];
              
              if (targetWord) {
                // Find enough free particles to form the rest of the word
                const remainingLettersNeeded = targetWord.length - 1; // -1 because we already have the starter
                const freeParticles = prevParticles.filter(p => p.id !== starterParticle.id && !p.isInWord)
                                                  .sort(() => Math.random() - 0.5)
                                                  .slice(0, remainingLettersNeeded);
                
                if (freeParticles.length === remainingLettersNeeded) {
                  // Create a new array with particles assigned to the word
                  const updatedParticles = [...prevParticles];
                  const starterIndex = updatedParticles.findIndex(p => p.id === starterParticle.id);
                  
                  // Position the words in a reasonable area of the screen
                  const wordX = Math.random() * (width - 200) + 100; 
                  const wordY = Math.random() * (height - 200) + 100;
                  
                  // Update the starter particle
                  updatedParticles[starterIndex] = {
                    ...updatedParticles[starterIndex],
                    targetWord,
                    targetIndex: 0,
                    isInWord: true
                  };
                  
                  // Assign the remaining letters
                  for (let i = 0; i < freeParticles.length; i++) {
                    const particleIndex = updatedParticles.findIndex(p => p.id === freeParticles[i].id);
                    if (particleIndex !== -1) {
                      updatedParticles[particleIndex] = {
                        ...updatedParticles[particleIndex],
                        letter: targetWord[i + 1],  // +1 because we already have the first letter
                        targetWord,
                        targetIndex: i + 1,
                        isInWord: true
                      };
                    }
                  }
                  
                  return updatedParticles;
                }
              }
            }
          }
        }
        
        return prevParticles.map(particle => {
          // Handle particles that are part of a word
          if (particle.isInWord && particle.targetWord && particle.targetIndex !== undefined) {
            const letterSpacing = 20; // Space between letters
            const wordParticles = prevParticles.filter(p => p.targetWord === particle.targetWord);
            const isWordComplete = wordParticles.length === particle.targetWord.length;
            
            // Check if all particles for the word are in position
            let allInPosition = true;
            if (isWordComplete) {
              for (const p of wordParticles) {
                if (p.targetIndex !== undefined) {
                  const centerX = width / 2 - (particle.targetWord.length * letterSpacing) / 2;
                  const targetX = centerX + (p.targetIndex * letterSpacing);
                  const targetY = height / 2;
                  
                  const dx = targetX - p.x;
                  const dy = targetY - p.y;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  
                  if (distance > 2) {
                    allInPosition = false;
                    break;
                  }
                }
              }
            }
            
            // If word is complete and all letters are in position
            if (isWordComplete && allInPosition && !particle.wordFormed) {
              // Record the formed word to display separately
              const wordId = `word-${Date.now()}-${Math.random()}`; 
              const centerX = width / 2 - (particle.targetWord.length * letterSpacing) / 2;
              const centerY = height / 2;
              
              newFormedWords[wordId] = {
                x: centerX,
                y: centerY,
                word: particle.targetWord
              };
              
              // Mark all particles in this word as formed
              return {
                ...particle,
                wordFormed: true
              };
            }
            
            // Calculate target position for particles in the word
            if (particle.targetIndex !== undefined) {
              const centerX = width / 2 - (particle.targetWord.length * letterSpacing) / 2;
              const targetX = centerX + (particle.targetIndex * letterSpacing);
              const targetY = height / 2;
              
              const dx = targetX - particle.x;
              const dy = targetY - particle.y;
              
              // Apply attraction forces
              return {
                ...particle,
                vx: dx * 0.05,
                vy: dy * 0.05,
                x: particle.x + particle.vx,
                y: particle.y + particle.vy
              };
            }
          }
          
          // Release particles from words after a while
          if (particle.wordFormed && Math.random() < 0.005) {
            return {
              ...particle,
              isInWord: false,
              targetWord: undefined,
              targetIndex: undefined,
              wordFormed: false,
              vx: (Math.random() - 0.5) * 0.5,
              vy: (Math.random() - 0.5) * 0.5,
              letter: characters[Math.floor(Math.random() * characters.length)]
            };
          }
          
          // Regular floating particles
          if (!particle.isInWord) {
            let newX = particle.x + particle.vx;
            let newY = particle.y + particle.vy;
            
            // Bounce off walls
            let newVx = particle.vx;
            let newVy = particle.vy;
            
            if (newX <= 0 || newX >= width) {
              newVx = -newVx;
              newX = Math.max(0, Math.min(width, newX));
            }
            
            if (newY <= 0 || newY >= height) {
              newVy = -newVy;
              newY = Math.max(0, Math.min(height, newY));
            }
            
            // Slight random movement
            if (Math.random() < 0.03) {
              newVx += (Math.random() - 0.5) * 0.1;
              newVy += (Math.random() - 0.5) * 0.1;
              
              // Limit speed
              const speed = Math.sqrt(newVx * newVx + newVy * newVy);
              if (speed > 1) {
                newVx = newVx / speed;
                newVy = newVy / speed;
              }
            }
            
            return {
              ...particle,
              x: newX,
              y: newY,
              vx: newVx,
              vy: newVy
            };
          }
          
          return particle;
        });
      });
      
      // Update formed words state if changed
      if (Object.keys(newFormedWords).length !== Object.keys(formedWords).length) {
        setFormedWords(newFormedWords);
      }
      
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [particles, formedWords]);
  
  // Cycle through phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % enigmaticPhrases.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Remove formed words after some time
  useEffect(() => {
    const wordTimeouts: {[key: string]: NodeJS.Timeout} = {};
    
    Object.keys(formedWords).forEach(wordId => {
      if (!wordTimeouts[wordId]) {
        wordTimeouts[wordId] = setTimeout(() => {
          setFormedWords(prev => {
            const updated = {...prev};
            delete updated[wordId];
            return updated;
          });
        }, 5000 + Math.random() * 3000); // Display for 5-8 seconds
      }
    });
    
    return () => {
      Object.values(wordTimeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [formedWords]);

  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center">
      {/* Particle Canvas */}
      <div 
        ref={canvasRef} 
        className="absolute inset-0 overflow-hidden"
      >
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className={`absolute font-mono text-sm ${theme === 'dark' ? 'text-white' : 'text-black'} ${particle.isInWord ? 'font-bold' : 'opacity-50'}`}
            style={{
              left: particle.x,
              top: particle.y,
              position: 'absolute',
            }}
            animate={{
              x: particle.x,
              y: particle.y,
              transition: { duration: 0.1, ease: 'linear' }
            }}
          >
            {particle.letter}
          </motion.div>
        ))}
        
        {/* Formed Words */}
        {Object.entries(formedWords).map(([wordId, { x, y, word }]) => (
          <motion.div
            key={wordId}
            className="absolute font-mono text-xl font-bold tracking-widest"
            style={{
              left: x,
              top: y,
              color: '#8B0000',
              opacity: 0
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1.2, 1, 0.9],
            }}
            transition={{
              duration: 5,
              times: [0, 0.1, 0.8, 1],
              ease: "easeInOut"
            }}
          >
            {word}
          </motion.div>
        ))}
      </div>
      
      {/* Cycling Quote in Center */}
      <div className="relative z-10 text-center max-w-2xl px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentPhrase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-xl md:text-2xl text-white font-mono"
          >
            {enigmaticPhrases[currentPhrase]}
          </motion.p>
        </AnimatePresence>
      </div>
      
      {/* Animated "Prompt or Die" Text in Bottom Right */}
      <div className="absolute bottom-8 right-8 z-10">
        <motion.div 
          className="text-[#8B0000] font-bold text-4xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.span
            animate={{
              textShadow: [
                '0 0 5px rgba(139,0,0,0.3)',
                '0 0 15px rgba(139,0,0,0.5)',
                '0 0 5px rgba(139,0,0,0.3)'
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            className="drop-shadow-[0_0_8px_rgba(139,0,0,0.8)] filter"
          >
            PROMPT<span className="text-white">OR</span>DIE
          </motion.span>
        </motion.div>
      </div>
      
      {/* Ghost layer for extra depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,0,0,0.1),transparent_70%)] pointer-events-none"></div>
    </div>
  );
};

export default AnimatedLandingPage;