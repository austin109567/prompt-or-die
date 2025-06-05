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
  originalVx?: number;
  originalVy?: number;
}

const AnimatedLandingPage = () => {
  const { theme } = useTheme();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [formedWords, setFormedWords] = useState<{[key: string]: {x: number, y: number, word: string, vx: number, vy: number}}>({}); 

  // Set up particles
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

  // Initialize particles after dimensions are set
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    // Generate random particles distributed throughout the canvas
    const initialParticles: Particle[] = Array.from({ length: 100 }).map((_, i) => ({
      id: `particle-${i}`,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      letter: characters[Math.floor(Math.random() * characters.length)],
      isInWord: false,
      wordFormed: false
    }));

    setParticles(initialParticles);
  }, [dimensions]);

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
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Keep track of formed words to display them separately
      const newFormedWords: {[key: string]: {x: number, y: number, word: string, vx: number, vy: number}} = {...formedWords};
      
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
                  const wordX = Math.random() * (dimensions.width - 300) + 150; 
                  const wordY = Math.random() * (dimensions.height - 300) + 150;
                  
                  // Update the starter particle
                  updatedParticles[starterIndex] = {
                    ...updatedParticles[starterIndex],
                    targetWord,
                    targetIndex: 0,
                    isInWord: true,
                    originalVx: updatedParticles[starterIndex].vx,
                    originalVy: updatedParticles[starterIndex].vy
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
                        isInWord: true,
                        originalVx: updatedParticles[particleIndex].vx,
                        originalVy: updatedParticles[particleIndex].vy
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
                  const targetX = Math.random() * (dimensions.width * 0.6) + (dimensions.width * 0.2);
                  const targetY = Math.random() * (dimensions.height * 0.6) + (dimensions.height * 0.2);
                  const wordCenterX = targetX - (particle.targetWord.length * letterSpacing) / 2;
                  const wordCenterY = targetY;
                  
                  const particleTargetX = wordCenterX + (p.targetIndex * letterSpacing);
                  const particleTargetY = wordCenterY;
                  
                  const dx = particleTargetX - p.x;
                  const dy = particleTargetY - p.y;
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
              const wordCenterX = dimensions.width * 0.5 - (particle.targetWord.length * letterSpacing) / 2;
              const wordCenterY = dimensions.height * 0.5;
              
              // Determine the reverse direction for the formed word
              const avgVx = wordParticles.reduce((sum, p) => sum + (p.originalVx || 0), 0) / wordParticles.length;
              const avgVy = wordParticles.reduce((sum, p) => sum + (p.originalVy || 0), 0) / wordParticles.length;
              
              newFormedWords[wordId] = {
                x: wordCenterX,
                y: wordCenterY,
                word: particle.targetWord,
                vx: -avgVx * 2, // Reverse direction and increase speed
                vy: -avgVy * 2
              };
              
              // Mark all particles in this word as formed
              return {
                ...particle,
                wordFormed: true
              };
            }
            
            // Calculate target position for particles in the word
            if (particle.targetIndex !== undefined) {
              // Dynamically determine a position in the canvas for this word to form
              // This ensures words don't always form in the same place
              const targetX = Math.random() * (dimensions.width * 0.6) + (dimensions.width * 0.2);
              const targetY = Math.random() * (dimensions.height * 0.6) + (dimensions.height * 0.2);
              const wordCenterX = targetX - (particle.targetWord.length * letterSpacing) / 2;
              const wordCenterY = targetY;
              
              const particleTargetX = wordCenterX + (particle.targetIndex * letterSpacing);
              const particleTargetY = wordCenterY;
              
              const dx = particleTargetX - particle.x;
              const dy = particleTargetY - particle.y;
              
              // Apply attraction forces
              return {
                ...particle,
                vx: dx * 0.05,
                vy: dy * 0.05,
                x: particle.x + particle.vx * (deltaTime / 16),
                y: particle.y + particle.vy * (deltaTime / 16)
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
            let newX = particle.x + particle.vx * (deltaTime / 16);
            let newY = particle.y + particle.vy * (deltaTime / 16);
            
            // Bounce off walls
            let newVx = particle.vx;
            let newVy = particle.vy;
            
            if (newX <= 0 || newX >= dimensions.width) {
              newVx = -newVx;
              newX = Math.max(0, Math.min(dimensions.width, newX));
            }
            
            if (newY <= 0 || newY >= dimensions.height) {
              newVy = -newVy;
              newY = Math.max(0, Math.min(dimensions.height, newY));
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
      
      // Update formed words state and animate them
      if (Object.keys(newFormedWords).length !== Object.keys(formedWords).length) {
        setFormedWords(newFormedWords);
      } else {
        // Animate existing formed words
        const updatedFormedWords = {...newFormedWords};
        Object.keys(formedWords).forEach(wordId => {
          if (formedWords[wordId]) {
            const word = formedWords[wordId];
            
            // Move the word in its reverse direction
            let newX = word.x + word.vx * (deltaTime / 32);
            let newY = word.y + word.vy * (deltaTime / 32);
            
            // Remove words that go off-screen
            if (newX < -100 || newX > dimensions.width + 100 || 
                newY < -100 || newY > dimensions.height + 100) {
              delete updatedFormedWords[wordId];
            } else {
              updatedFormedWords[wordId] = {
                ...word,
                x: newX,
                y: newY
              };
            }
          }
        });
        
        if (Object.keys(updatedFormedWords).length !== Object.keys(formedWords).length) {
          setFormedWords(updatedFormedWords);
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particles, dimensions, formedWords]);
  
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
        }, 8000 + Math.random() * 4000); // Display for 8-12 seconds
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
              opacity: [0, 1, 1, 0.8],
              scale: [0.8, 1.2, 1, 0.9],
              x: x,
              y: y
            }}
            transition={{
              opacity: {
                duration: 8,
                times: [0, 0.1, 0.8, 1]
              },
              scale: {
                duration: 8,
                times: [0, 0.1, 0.3, 1]
              },
              x: { duration: 0.1 },
              y: { duration: 0.1 }
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