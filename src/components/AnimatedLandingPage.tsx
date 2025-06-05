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
const words = ['PROMPT', 'CODE', 'AI', 'VOID', 'CHAOS', 'ORDER', 'SYSTEM', 'WHISPER'];

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
}

const AnimatedLandingPage = () => {
  const { theme } = useTheme();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

    // Generate random particles
    const initialParticles: Particle[] = Array.from({ length: 100 }).map((_, i) => ({
      id: `particle-${i}`,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      letter: characters[Math.floor(Math.random() * characters.length)],
      isInWord: false
    }));

    setParticles(initialParticles);
  }, [dimensions]);

  // Animation loop for particles
  useEffect(() => {
    if (particles.length === 0 || !canvasRef.current) return;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setParticles(prevParticles => {
        // Occasionally select a random word to form
        if (Math.random() < 0.003) {
          const randomWord = words[Math.floor(Math.random() * words.length)];
          const availableParticles = prevParticles.filter(p => !p.isInWord);
          
          if (availableParticles.length >= randomWord.length) {
            const selectedParticles = availableParticles
              .sort(() => Math.random() - 0.5)
              .slice(0, randomWord.length);
            
            // Position the particles in the word
            const wordX = Math.random() * (dimensions.width - 150) + 75;
            const wordY = Math.random() * (dimensions.height - 100) + 50;
            
            return prevParticles.map(particle => {
              const index = selectedParticles.findIndex(p => p.id === particle.id);
              if (index !== -1) {
                return {
                  ...particle,
                  targetWord: randomWord,
                  targetIndex: index,
                  letter: randomWord[index],
                  isInWord: true
                };
              }
              return particle;
            });
          }
        }
        
        return prevParticles.map(particle => {
          // Handle particles that are part of a word
          if (particle.isInWord && particle.targetWord && particle.targetIndex !== undefined) {
            const letterWidth = 20; // Approximate width of a letter
            const wordLength = particle.targetWord.length;
            const totalWidth = wordLength * letterWidth;
            
            // Calculate target position based on the word
            const particleIndex = particle.targetIndex;
            const wordStartX = Math.random() * (dimensions.width - totalWidth - 40) + 20;
            const wordY = Math.random() * (dimensions.height - 40) + 20;
            
            const targetX = wordStartX + (particleIndex * letterWidth);
            const targetY = wordY;
            
            // Move toward the target position
            const dx = targetX - particle.x;
            const dy = targetY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 0.5) {
              // If close enough, consider the word formed
              // After 2-3 seconds, release the particles
              if (Math.random() < 0.005) {
                return {
                  ...particle,
                  isInWord: false,
                  targetWord: undefined,
                  targetIndex: undefined,
                  vx: (Math.random() - 0.5) * 0.5,
                  vy: (Math.random() - 0.5) * 0.5,
                  letter: characters[Math.floor(Math.random() * characters.length)]
                };
              }
              return particle;
            }
            
            return {
              ...particle,
              vx: dx * 0.05,
              vy: dy * 0.05,
              x: particle.x + particle.vx * (deltaTime / 16),
              y: particle.y + particle.vy * (deltaTime / 16)
            };
          }
          
          // Regular floating particles
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
          if (Math.random() < 0.05) {
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
        });
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particles, dimensions]);
  
  // Cycle through phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % enigmaticPhrases.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

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