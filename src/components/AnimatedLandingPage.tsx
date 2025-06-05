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

interface Rod {
  id: string;
  x: number;
  y: number;
  length: number;
  angle: number;
  vx: number;
  vy: number;
  vAngle: number;
  color: string;
  opacity: number;
  inHelix: boolean;
  helixId?: string;
  helixPosition?: number;
  helixStrand?: 'top' | 'bottom';
}

interface DNAHelix {
  id: string;
  rods: string[];
  centerX: number;
  centerY: number;
  vx: number;
  vy: number;
  length: number;
  width: number;
  rotation: number;
  vRotation: number;
  winding: number; // Controls the tightness of the helix
  phase: number; // Phase offset for animation
  age: number;
  decaying: boolean;
}

const AnimatedLandingPage = () => {
  const { theme } = useTheme();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [rods, setRods] = useState<Rod[]>([]);
  const [helices, setHelices] = useState<{[key: string]: DNAHelix}>({});
  const canvasRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Set up canvas dimensions
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

  // Initialize rods after dimensions are set
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    // Generate random rods
    const initialRods: Rod[] = Array.from({ length: 100 }).map((_, i) => {
      const x = Math.random() * dimensions.width;
      const y = Math.random() * dimensions.height;
      const angle = Math.random() * Math.PI * 2;
      const length = 20 + Math.random() * 10; // More consistent rod length
      
      return {
        id: `rod-${i}`,
        x,
        y,
        length,
        angle,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vAngle: (Math.random() - 0.5) * 0.02,
        color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        opacity: 0.7 + Math.random() * 0.3,
        inHelix: false
      };
    });

    setRods(initialRods);
  }, [dimensions, theme]);

  // Animation loop
  useEffect(() => {
    if (rods.length === 0 || !canvasRef.current) return;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Update rods
      setRods(prevRods => {
        return prevRods.map(rod => {
          if (rod.inHelix) return rod;
          
          // Move the rod
          let newX = rod.x + rod.vx * (deltaTime / 16);
          let newY = rod.y + rod.vy * (deltaTime / 16);
          let newAngle = rod.angle + rod.vAngle * (deltaTime / 16);
          
          // Bounce off walls
          let newVx = rod.vx;
          let newVy = rod.vy;
          
          const halfLength = rod.length / 2;
          const endX1 = newX + Math.cos(newAngle) * halfLength;
          const endY1 = newY + Math.sin(newAngle) * halfLength;
          const endX2 = newX - Math.cos(newAngle) * halfLength;
          const endY2 = newY - Math.sin(newAngle) * halfLength;
          
          if (endX1 < 0 || endX2 < 0 || endX1 > dimensions.width || endX2 > dimensions.width) {
            newVx = -newVx;
            newAngle = Math.PI - newAngle;
          }
          
          if (endY1 < 0 || endY2 < 0 || endY1 > dimensions.height || endY2 > dimensions.height) {
            newVy = -newVy;
            newAngle = -newAngle;
          }
          
          // Slight random movement
          if (Math.random() < 0.03) {
            newVx += (Math.random() - 0.5) * 0.1;
            newVy += (Math.random() - 0.5) * 0.1;
            
            // Limit speed
            const speed = Math.sqrt(newVx * newVx + newVy * newVy);
            if (speed > 0.8) {
              newVx = (newVx / speed) * 0.8;
              newVy = (newVy / speed) * 0.8;
            }
          }
          
          return {
            ...rod,
            x: newX,
            y: newY,
            angle: newAngle,
            vx: newVx,
            vy: newVy
          };
        });
      });

      // Try to form DNA helix
      if (Math.random() < 0.008) {
        formDNAHelix();
      }
      
      // Update existing helices
      updateHelices(deltaTime);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [rods, dimensions, helices]);
  
  // Function to form DNA helix from rods
  const formDNAHelix = () => {
    // Find free rods
    const freeRods = rods.filter(rod => !rod.inHelix);
    
    // We need at least 12 rods for a decent helix
    const numRods = 12 + Math.floor(Math.random() * 12); // 12-24 rods
    
    if (freeRods.length < numRods) return;
    
    // Choose random position for helix center
    const centerX = Math.random() * (dimensions.width * 0.7) + (dimensions.width * 0.15);
    const centerY = Math.random() * (dimensions.height * 0.7) + (dimensions.height * 0.15);
    
    // Choose random rods
    const selectedRodIds = freeRods
      .sort(() => Math.random() - 0.5)
      .slice(0, numRods)
      .map(rod => rod.id);
    
    // Create a new DNA helix
    const helixId = `helix-${Date.now()}-${Math.random()}`;
    const newHelix: DNAHelix = {
      id: helixId,
      rods: selectedRodIds,
      centerX,
      centerY,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      length: numRods * 8, // Length based on number of rods
      width: 30 + Math.random() * 15, // Width of the helix
      rotation: Math.random() * Math.PI * 2,
      vRotation: (Math.random() - 0.5) * 0.01,
      winding: 0.3 + Math.random() * 0.2, // How tight the helix winds
      phase: Math.random() * Math.PI * 2,
      age: 0,
      decaying: false
    };
    
    // Update the rods to be part of the helix
    setRods(prevRods => {
      return prevRods.map((rod, index) => {
        if (selectedRodIds.includes(rod.id)) {
          const position = selectedRodIds.indexOf(rod.id);
          const isTopStrand = position % 2 === 0;
          
          return {
            ...rod,
            inHelix: true,
            helixId,
            helixPosition: Math.floor(position / 2),
            helixStrand: isTopStrand ? 'top' : 'bottom',
            color: 'rgba(200, 200, 255, 0.9)' // Slightly blue for fresh DNA
          };
        }
        return rod;
      });
    });
    
    // Add the new helix
    setHelices(prevHelices => ({
      ...prevHelices,
      [helixId]: newHelix
    }));
  };
  
  // Update existing DNA helices
  const updateHelices = (deltaTime: number) => {
    const updatedHelices = {...helices};
    let helicesChanged = false;
    
    Object.keys(updatedHelices).forEach(helixId => {
      const helix = updatedHelices[helixId];
      
      // Update age
      helix.age += deltaTime / 1000; // Convert to seconds
      
      // Check if helix should start decaying (after 6 seconds)
      if (!helix.decaying && helix.age > 6) {
        helix.decaying = true;
        helicesChanged = true;
        
        // Change color of rods to deep crimson red
        setRods(prevRods => {
          return prevRods.map(rod => {
            if (rod.helixId === helixId) {
              return {
                ...rod,
                color: 'rgba(139, 0, 0, 0.9)' // Deep crimson red
              };
            }
            return rod;
          });
        });
      }
      
      // Remove helix if it's been decaying for more than 4 seconds
      if (helix.decaying && helix.age > 10) {
        // Release rods from the helix
        setRods(prevRods => {
          return prevRods.map(rod => {
            if (rod.helixId === helixId) {
              // Release rod with velocity in the opposite direction
              return {
                ...rod,
                inHelix: false,
                helixId: undefined,
                helixPosition: undefined,
                helixStrand: undefined,
                vx: (Math.random() - 0.5) * 0.7,
                vy: (Math.random() - 0.5) * 0.7,
                vAngle: (Math.random() - 0.5) * 0.04,
                color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                opacity: 0.7 + Math.random() * 0.3
              };
            }
            return rod;
          });
        });
        
        // Delete the helix
        delete updatedHelices[helixId];
        helicesChanged = true;
        return;
      }
      
      // Update position
      helix.centerX += helix.vx * (deltaTime / 16);
      helix.centerY += helix.vy * (deltaTime / 16);
      helix.rotation += helix.vRotation * (deltaTime / 16);
      helix.phase += 0.01 * (deltaTime / 16); // Animate the helix rotation
      
      // Bounce off walls
      if (helix.centerX < helix.width/2 || helix.centerX > dimensions.width - helix.width/2) {
        helix.vx = -helix.vx;
      }
      if (helix.centerY < helix.length/2 || helix.centerY > dimensions.height - helix.length/2) {
        helix.vy = -helix.vy;
      }
      
      // Position the rods to form the DNA double helix
      const rodCount = helix.rods.length;
      const rodPairs = Math.floor(rodCount / 2);
      
      helix.rods.forEach((rodId, index) => {
        const rodIndex = rods.findIndex(r => r.id === rodId);
        if (rodIndex !== -1) {
          const rod = rods[rodIndex];
          const isTopStrand = index % 2 === 0;
          const pairPosition = Math.floor(index / 2);
          
          // Calculate vertical position along the helix
          const verticalStep = helix.length / (rodPairs + 1);
          const verticalOffset = -helix.length/2 + (pairPosition + 1) * verticalStep;
          
          // Calculate horizontal position with sine wave for double helix effect
          const angleOffset = pairPosition * helix.winding + helix.phase;
          const horizontalOffset = Math.sin(angleOffset) * helix.width/2;
          
          // Apply the helix rotation
          const rotatedX = Math.cos(helix.rotation) * horizontalOffset;
          const rotatedY = Math.sin(helix.rotation) * horizontalOffset;
          
          // Final position
          const newX = helix.centerX + rotatedX;
          const newY = helix.centerY + rotatedY + verticalOffset;
          
          // Angle for the rod - perpendicular to the helix curve
          const tangentAngle = Math.atan2(
            Math.cos(angleOffset) * (isTopStrand ? 1 : -1),
            helix.winding
          ) + helix.rotation + (isTopStrand ? Math.PI/2 : -Math.PI/2);
          
          // Update the rod
          setRods(prev => {
            const newRods = [...prev];
            newRods[rodIndex] = {
              ...rod,
              x: newX,
              y: newY,
              angle: tangentAngle,
              // Decay effect - gradually reduce opacity if decaying
              opacity: helix.decaying 
                ? Math.max(0.3, 1 - (helix.age - 6) / 4) 
                : rod.opacity
            };
            return newRods;
          });
        }
      });
    });
    
    if (helicesChanged) {
      setHelices(updatedHelices);
    }
  };
  
  // Cycle through phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % enigmaticPhrases.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center">
      {/* Canvas for rods and DNA */}
      <div 
        ref={canvasRef} 
        className="absolute inset-0 overflow-hidden"
      >
        {rods.map(rod => (
          <motion.div
            key={rod.id}
            className="absolute"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                width: `${rod.length}px`,
                height: '2px',
                backgroundColor: rod.color,
                opacity: rod.opacity,
                transformOrigin: 'center',
                left: rod.x - rod.length/2,
                top: rod.y - 1,
                transform: `rotate(${rod.angle}rad)`,
                borderRadius: '1px'
              }}
            />
            {/* Connector nodes at ends - only for rods in a helix */}
            {rod.inHelix && (
              <>
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: rod.color,
                    left: rod.x + Math.cos(rod.angle) * (rod.length/2) - 2,
                    top: rod.y + Math.sin(rod.angle) * (rod.length/2) - 2,
                    opacity: rod.opacity
                  }}
                />
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: rod.color,
                    left: rod.x - Math.cos(rod.angle) * (rod.length/2) - 2,
                    top: rod.y - Math.sin(rod.angle) * (rod.length/2) - 2,
                    opacity: rod.opacity
                  }}
                />
              </>
            )}
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