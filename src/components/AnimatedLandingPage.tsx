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
  helixStrand?: 'backbone' | 'basepair';
  blur?: number;
  scale?: number;
}

interface DNAHelix {
  id: string;
  rods: string[];
  backboneRods: string[];
  basepairRods: string[];
  centerX: number;
  centerY: number;
  vx: number;
  vy: number;
  width: number; // 2nm in pixels
  height: number; // Height per complete turn (3.4nm)
  turns: number; // Number of complete turns
  rotation: number;
  vRotation: number;
  formationProgress: number; // 0 to 1
  age: number; 
  decaying: boolean;
  decayProgress: number; // 0 to 1
  particles: Particle[];
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  lifespan: number;
  age: number;
}

const AnimatedLandingPage = () => {
  const { theme } = useTheme();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [rods, setRods] = useState<Rod[]>([]);
  const [helices, setHelices] = useState<{[key: string]: DNAHelix}>({});
  const [particles, setParticles] = useState<Particle[]>([]);
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

    // Generate random rods with more subtle, fluid appearance
    const initialRods: Rod[] = Array.from({ length: 120 }).map((_, i) => {
      const x = Math.random() * dimensions.width;
      const y = Math.random() * dimensions.height;
      const angle = Math.random() * Math.PI * 2;
      // More consistent rod lengths based on DNA proportions
      const length = 15 + Math.random() * 5; 
      
      return {
        id: `rod-${i}`,
        x,
        y,
        length,
        angle,
        vx: (Math.random() - 0.5) * 0.3, // Slower initial motion
        vy: (Math.random() - 0.5) * 0.3,
        vAngle: (Math.random() - 0.5) * 0.01,
        color: theme === 'dark' 
          ? `rgba(${220 + Math.random() * 35}, ${220 + Math.random() * 35}, ${220 + Math.random() * 35}, 0.6)` 
          : `rgba(${30 + Math.random() * 30}, ${30 + Math.random() * 30}, ${30 + Math.random() * 30}, 0.6)`,
        opacity: 0.3 + Math.random() * 0.05, // 30-35% opacity
        inHelix: false,
        scale: 1.0
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
      const dt = deltaTime / 16; // Normalize by 16ms (60fps)

      // Update rods
      setRods(prevRods => {
        return prevRods.map(rod => {
          if (rod.inHelix) return rod;
          
          // Apply cubic bezier easing to motion for organic movement
          const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          const easeFactor = easeInOut(0.5 + Math.sin(timestamp * 0.001) * 0.5);
          
          // Move the rod with eased motion
          let newX = rod.x + rod.vx * dt * easeFactor;
          let newY = rod.y + rod.vy * dt * easeFactor;
          let newAngle = rod.angle + rod.vAngle * dt;
          
          // Bounce off walls with soft edge handling
          let newVx = rod.vx;
          let newVy = rod.vy;
          
          const halfLength = rod.length / 2;
          const endX1 = newX + Math.cos(newAngle) * halfLength;
          const endY1 = newY + Math.sin(newAngle) * halfLength;
          const endX2 = newX - Math.cos(newAngle) * halfLength;
          const endY2 = newY - Math.sin(newAngle) * halfLength;
          
          if (endX1 < 0 || endX2 < 0 || endX1 > dimensions.width || endX2 > dimensions.width) {
            newVx = -newVx * 0.9; // Soft bounce
            newAngle = Math.PI - newAngle + (Math.random() - 0.5) * 0.1; // Slight variation
          }
          
          if (endY1 < 0 || endY2 < 0 || endY1 > dimensions.height || endY2 > dimensions.height) {
            newVy = -newVy * 0.9; // Soft bounce
            newAngle = -newAngle + (Math.random() - 0.5) * 0.1; // Slight variation
          }
          
          // Gentle random motion
          if (Math.random() < 0.02) {
            newVx += (Math.random() - 0.5) * 0.05;
            newVy += (Math.random() - 0.5) * 0.05;
            
            // Limit speed for more controlled movement
            const speed = Math.sqrt(newVx * newVx + newVy * newVy);
            if (speed > 0.5) {
              newVx = (newVx / speed) * 0.5;
              newVy = (newVy / speed) * 0.5;
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

      // Try to form DNA helix at a controlled rate
      if (Math.random() < 0.004) { // Reduced frequency for more deliberate formation
        formDNAHelix();
      }
      
      // Update existing helices
      updateHelices(deltaTime);
      
      // Update particles
      updateParticles(deltaTime);
      
      // Generate ambient particles around helices
      Object.values(helices).forEach(helix => {
        if (Math.random() < 0.1 * dt) {
          generateAmbientParticle(helix);
        }
      });

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
    
    // We need enough rods for a scientifically accurate DNA model
    // Each turn needs 10 base pairs (20 rods) plus 20 backbone rods
    const basePairsPerTurn = 10;
    const turns = 1 + Math.floor(Math.random() * 2); // 1-2 turns
    const backboneRodsNeeded = turns * basePairsPerTurn * 2;
    const basepairRodsNeeded = turns * basePairsPerTurn;
    const totalRodsNeeded = backboneRodsNeeded + basepairRodsNeeded;
    
    if (freeRods.length < totalRodsNeeded) return;
    
    // Choose random position for helix center
    const centerX = Math.random() * (dimensions.width * 0.6) + (dimensions.width * 0.2);
    const centerY = Math.random() * (dimensions.height * 0.6) + (dimensions.height * 0.2);
    
    // Choose random rods
    const selectedRods = freeRods
      .sort(() => Math.random() - 0.5)
      .slice(0, totalRodsNeeded);
    
    // Separate backbone and basepair rods
    const backboneRodIds = selectedRods
      .slice(0, backboneRodsNeeded)
      .map(rod => rod.id);
      
    const basepairRodIds = selectedRods
      .slice(backboneRodsNeeded)
      .map(rod => rod.id);
    
    // Create a new DNA helix
    const helixId = `helix-${Date.now()}-${Math.random()}`;
    const allRodIds = [...backboneRodIds, ...basepairRodIds];
    
    const newHelix: DNAHelix = {
      id: helixId,
      rods: allRodIds,
      backboneRods: backboneRodIds,
      basepairRods: basepairRodIds,
      centerX,
      centerY,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      width: 20, // Width of the helix (2nm proportion)
      height: 34 * turns, // Height for the total turns (3.4nm per turn)
      turns,
      rotation: Math.random() * Math.PI * 2,
      vRotation: (Math.random() < 0.5 ? 1 : -1) * (0.8 / 60) * 2 * Math.PI, // 0.8 turns per second
      formationProgress: 0, // Start at 0 and animate to 1
      age: 0,
      decaying: false,
      decayProgress: 0,
      particles: []
    };
    
    // Update the rods to be part of the helix
    setRods(prevRods => {
      return prevRods.map(rod => {
        if (allRodIds.includes(rod.id)) {
          const isBackbone = backboneRodIds.includes(rod.id);
          
          return {
            ...rod,
            inHelix: true,
            helixId,
            helixStrand: isBackbone ? 'backbone' : 'basepair',
            color: isBackbone 
              ? 'rgba(230, 230, 230, 0.85)' 
              : 'rgba(210, 210, 255, 0.85)',
            opacity: 0.8,
            scale: 0
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
      
      // Update formation progress (over 5-7 seconds)
      const formationDuration = 5 + Math.random() * 2;
      if (helix.formationProgress < 1) {
        // Use cubic-bezier for organic formation
        const t = Math.min(1, helix.age / formationDuration);
        const cubic = (t: number) => {
          // Cubic bezier approximation for organic movement
          return t < 0.5 
            ? 4 * t * t * t 
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };
        
        helix.formationProgress = cubic(t);
        helicesChanged = true;
      }
      
      // Check if helix should start decaying (after 6 seconds)
      if (!helix.decaying && helix.age > 6) {
        helix.decaying = true;
        helicesChanged = true;
      }
      
      // Update decay progress (over 3-4 seconds)
      const decayDuration = 3 + Math.random();
      if (helix.decaying) {
        helix.decayProgress = Math.min(1, (helix.age - 6) / decayDuration);
        helicesChanged = true;
        
        // Color transition to crimson
        const decayT = helix.decayProgress;
        setRods(prevRods => {
          return prevRods.map(rod => {
            if (rod.helixId === helixId) {
              const isBasepair = rod.helixStrand === 'basepair';
              
              // Create a gradient transition to crimson
              // Start RGB values
              const startR = isBasepair ? 210 : 230;
              const startG = isBasepair ? 210 : 230;
              const startB = isBasepair ? 255 : 230;
              
              // End RGB values (crimson: #DC143C -> 220, 20, 60)
              const endR = 220;
              const endG = 20;
              const endB = 60;
              
              // Interpolate RGB values
              const r = Math.round(startR + (endR - startR) * decayT);
              const g = Math.round(startG + (endG - startG) * decayT);
              const b = Math.round(startB + (endB - startB) * decayT);
              
              return {
                ...rod,
                color: `rgba(${r}, ${g}, ${b}, ${0.85 - decayT * 0.35})`,
                blur: decayT * 2, // Add blur during decay
                scale: 1 - decayT * 0.3 // Slight scale reduction during decay
              };
            }
            return rod;
          });
        });
      }
      
      // Remove helix if fully decayed
      if (helix.decaying && helix.decayProgress >= 1) {
        // Release rods from the helix with dispersion
        setRods(prevRods => {
          return prevRods.map(rod => {
            if (rod.helixId === helixId) {
              // Calculate dispersion direction (away from helix center)
              const dx = rod.x - helix.centerX;
              const dy = rod.y - helix.centerY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const normalizedDx = dist > 0 ? dx / dist : 0;
              const normalizedDy = dist > 0 ? dy / dist : 0;
              
              return {
                ...rod,
                inHelix: false,
                helixId: undefined,
                helixPosition: undefined,
                helixStrand: undefined,
                // Velocity away from center with randomness
                vx: normalizedDx * (0.5 + Math.random() * 0.5),
                vy: normalizedDy * (0.5 + Math.random() * 0.5),
                vAngle: (Math.random() - 0.5) * 0.04,
                color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                opacity: 0.3 + Math.random() * 0.05,
                blur: 0,
                scale: 1
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
      
      // Bounce off walls with padding
      const padding = Math.max(helix.width, helix.height) / 2;
      if (helix.centerX < padding || helix.centerX > dimensions.width - padding) {
        helix.vx = -helix.vx * 0.8;
      }
      if (helix.centerY < padding || helix.centerY > dimensions.height - padding) {
        helix.vy = -helix.vy * 0.8;
      }
      
      // Position the rods to form the DNA double helix
      // For scientifically accurate proportions
      const basePairsPerTurn = 10;
      const turnHeight = helix.height / helix.turns;
      
      // Position backbone rods
      helix.backboneRods.forEach((rodId, index) => {
        const rodIndex = rods.findIndex(r => r.id === rodId);
        if (rodIndex !== -1) {
          const isLeftBackbone = index < helix.backboneRods.length / 2;
          const backboneIndex = isLeftBackbone 
            ? index 
            : index - helix.backboneRods.length / 2;
          
          // Smooth formation animation using formationProgress
          const formationT = Math.min(1, helix.formationProgress * 2); // Double speed for early appearance
          
          // Calculate position along the helix
          const turnProgress = (backboneIndex % basePairsPerTurn) / basePairsPerTurn;
          const turnIndex = Math.floor(backboneIndex / basePairsPerTurn);
          
          // Vertical position
          const verticalProgress = (turnIndex + turnProgress) / helix.turns;
          const verticalOffset = -helix.height/2 + verticalProgress * helix.height;
          
          // Angle around the helix
          const angleOffset = turnProgress * Math.PI * 2 + (isLeftBackbone ? 0 : Math.PI);
          
          // Apply the helix rotation and width
          const rotX = Math.cos(angleOffset + helix.rotation) * helix.width/2 * formationT;
          const rotY = Math.sin(angleOffset + helix.rotation) * helix.width/2 * formationT;
          
          // Final position with formation animation
          const targetX = helix.centerX + rotX;
          const targetY = helix.centerY + rotY + verticalOffset * formationT;
          
          // Angle for the rod - tangent to the helix curve
          const tangentAngle = angleOffset + helix.rotation + Math.PI/2;
          
          // Update the rod with easing
          setRods(prev => {
            const newRods = [...prev];
            const rod = newRods[rodIndex];
            
            newRods[rodIndex] = {
              ...rod,
              x: targetX,
              y: targetY,
              angle: tangentAngle,
              // Scale from 0 to 1 during formation
              scale: helix.formationProgress,
              // Add subtle blur based on movement speed
              blur: helix.decaying ? rod.blur : Math.min(1, Math.sqrt(helix.vx*helix.vx + helix.vy*helix.vy) * 3),
              // Maintain opacity based on decay state
              opacity: helix.decaying 
                ? rod.opacity
                : 0.3 + 0.55 * helix.formationProgress
            };
            return newRods;
          });
        }
      });
      
      // Position base pair rods
      helix.basepairRods.forEach((rodId, index) => {
        const rodIndex = rods.findIndex(r => r.id === rodId);
        if (rodIndex !== -1) {
          // Base pairs connect the two backbones
          // Smooth formation animation - appear slightly after backbones
          const formationT = Math.max(0, Math.min(1, (helix.formationProgress - 0.2) * 1.25));
          
          // Calculate positions along the helix
          const turnIndex = Math.floor(index / (basePairsPerTurn / 2));
          const pairProgress = (index % (basePairsPerTurn / 2)) / (basePairsPerTurn / 2);
          
          // Vertical position
          const verticalProgress = (turnIndex + pairProgress) / helix.turns;
          const verticalOffset = -helix.height/2 + verticalProgress * helix.height;
          
          // Angle around the helix
          const angleOffset = pairProgress * Math.PI + helix.rotation;
          
          // Position at center of helix
          const centerX = helix.centerX;
          const centerY = helix.centerY + verticalOffset * formationT;
          
          // Angle for base pair - perpendicular to backbone tangent
          const basePairAngle = angleOffset;
          
          // Update the rod
          setRods(prev => {
            const newRods = [...prev];
            const rod = newRods[rodIndex];
            
            newRods[rodIndex] = {
              ...rod,
              x: centerX,
              y: centerY,
              angle: basePairAngle,
              // Scale from 0 to 1 during formation
              scale: formationT,
              // Add subtle blur based on movement
              blur: helix.decaying ? rod.blur : Math.min(1, Math.sqrt(helix.vx*helix.vx + helix.vy*helix.vy) * 2),
              // Adjust opacity
              opacity: helix.decaying 
                ? rod.opacity 
                : 0.35 + 0.5 * formationT
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
  
  // Generate ambient particles around helices
  const generateAmbientParticle = (helix: DNAHelix) => {
    // Only generate particles for formed helices
    if (helix.formationProgress < 0.5) return;
    
    // Random position near the helix
    const angle = Math.random() * Math.PI * 2;
    const distance = helix.width/2 * (1 + Math.random());
    const x = helix.centerX + Math.cos(angle) * distance;
    const y = helix.centerY + Math.sin(angle) * distance + (Math.random() - 0.5) * helix.height;
    
    // Particle properties
    const newParticle: Particle = {
      id: `particle-${Date.now()}-${Math.random()}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: 1 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.2,
      lifespan: 2 + Math.random() * 2, // 2-4 seconds
      age: 0
    };
    
    // Add to particles state
    setParticles(prev => [...prev, newParticle]);
  };
  
  // Update particles
  const updateParticles = (deltaTime: number) => {
    setParticles(prevParticles => {
      return prevParticles
        .map(particle => {
          // Update age
          const newAge = particle.age + deltaTime / 1000;
          
          // Remove if past lifespan
          if (newAge >= particle.lifespan) {
            return null;
          }
          
          // Calculate lifetime progress
          const progress = newAge / particle.lifespan;
          
          // Fade in then out
          let newOpacity = particle.opacity;
          if (progress < 0.2) {
            newOpacity = particle.opacity * (progress / 0.2);
          } else if (progress > 0.8) {
            newOpacity = particle.opacity * (1 - (progress - 0.8) / 0.2);
          }
          
          // Update position
          const newX = particle.x + particle.vx * (deltaTime / 16);
          const newY = particle.y + particle.vy * (deltaTime / 16);
          
          return {
            ...particle,
            x: newX,
            y: newY,
            opacity: newOpacity,
            age: newAge
          };
        })
        .filter(Boolean) as Particle[]; // Filter out removed particles
    });
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
      {/* Canvas for rods, DNA and particles */}
      <div 
        ref={canvasRef} 
        className="absolute inset-0 overflow-hidden"
      >
        {/* Ambient particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            style={{
              position: 'absolute',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              backgroundColor: theme === 'dark' 
                ? `rgba(255, 255, 255, ${particle.opacity})` 
                : `rgba(0, 0, 0, ${particle.opacity})`,
              left: particle.x - particle.size/2,
              top: particle.y - particle.size/2,
              filter: 'blur(1px)'
            }}
          />
        ))}
        
        {/* Rods forming DNA structure */}
        {rods.map(rod => (
          <motion.div
            key={rod.id}
            className="absolute pointer-events-none"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%'
            }}
          >
            {/* The rod element */}
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
                transform: `rotate(${rod.angle}rad) scale(${rod.scale || 1})`,
                borderRadius: '1px',
                filter: rod.blur ? `blur(${rod.blur}px)` : undefined,
                boxShadow: rod.helixStrand === 'basepair' 
                  ? '0 0 3px rgba(255, 255, 255, 0.3)' 
                  : undefined
              }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 100
              }}
            />
            
            {/* Connector nodes at ends - only for rods in a helix */}
            {rod.inHelix && rod.helixStrand === 'backbone' && (
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
                    opacity: rod.opacity,
                    filter: rod.blur ? `blur(${rod.blur}px)` : undefined,
                    transform: `scale(${rod.scale || 1})`,
                    boxShadow: '0 0 2px rgba(255, 255, 255, 0.2)'
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
                    opacity: rod.opacity,
                    filter: rod.blur ? `blur(${rod.blur}px)` : undefined,
                    transform: `scale(${rod.scale || 1})`,
                    boxShadow: '0 0 2px rgba(255, 255, 255, 0.2)'
                  }}
                />
              </>
            )}
            
            {/* Nucleotide base pair connections - more detailed */}
            {rod.inHelix && rod.helixStrand === 'basepair' && (
              <>
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: rod.color,
                    left: rod.x + Math.cos(rod.angle) * (rod.length/2) - 2.5,
                    top: rod.y + Math.sin(rod.angle) * (rod.length/2) - 2.5,
                    opacity: rod.opacity,
                    filter: rod.blur ? `blur(${rod.blur}px)` : undefined,
                    transform: `scale(${rod.scale || 1})`,
                    boxShadow: '0 0 3px rgba(255, 255, 255, 0.25)'
                  }}
                />
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: rod.color,
                    left: rod.x - Math.cos(rod.angle) * (rod.length/2) - 2.5,
                    top: rod.y - Math.sin(rod.angle) * (rod.length/2) - 2.5,
                    opacity: rod.opacity,
                    filter: rod.blur ? `blur(${rod.blur}px)` : undefined,
                    transform: `scale(${rod.scale || 1})`,
                    boxShadow: '0 0 3px rgba(255, 255, 255, 0.25)'
                  }}
                />
              </>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Ambient lighting effects */}
      <div className="absolute inset-0 pointer-events-none">
        {Object.values(helices).map(helix => (
          <motion.div 
            key={helix.id}
            style={{
              position: 'absolute',
              left: helix.centerX - 50,
              top: helix.centerY - 50,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: helix.decaying 
                ? `radial-gradient(circle, rgba(220, 20, 60, ${0.15 * (1 - helix.decayProgress)}) 0%, transparent 70%)`
                : `radial-gradient(circle, rgba(255, 255, 255, ${0.1 * helix.formationProgress}) 0%, transparent 70%)`,
              opacity: helix.decaying ? 1 - helix.decayProgress : helix.formationProgress,
              transform: `scale(${1 + helix.formationProgress})`,
              transition: 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)'
            }}
          />
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
          className="text-[#DC143C] font-bold text-4xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.span
            animate={{
              textShadow: [
                '0 0 5px rgba(220,20,60,0.3)',
                '0 0 15px rgba(220,20,60,0.5)',
                '0 0 5px rgba(220,20,60,0.3)'
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            className="drop-shadow-[0_0_8px_rgba(220,20,60,0.8)] filter"
          >
            PROMPT<span className="text-white">OR</span>DIE
          </motion.span>
        </motion.div>
      </div>
      
      {/* Ghost layer for extra depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,20,60,0.1),transparent_70%)] pointer-events-none"></div>
    </div>
  );
};

export default AnimatedLandingPage;