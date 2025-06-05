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
  thickness?: number;
  gradient?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOpacity?: number;
  perspective?: number;
  rotateX?: number;
  rotateY?: number;
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
  perspective?: number;
  rotateX?: number;
  rotateY?: number;
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
  color?: string;
  blur?: number;
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
      // More consistent rod lengths based on DNA proportions with increased size
      const length = 18 + Math.random() * 7; // Increased by ~30%
      
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
        scale: 1.0,
        thickness: 2.6, // Increased thickness (30% more than original 2px)
        gradient: true,
        perspective: 800 + Math.random() * 200,
        rotateX: (Math.random() - 0.5) * 15,
        rotateY: (Math.random() - 0.5) * 15
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
          const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          const easeFactor = easeInOut(0.5 + Math.sin(timestamp * 0.001) * 0.5);
          
          // Move the rod with eased motion
          let newX = rod.x + rod.vx * dt * easeFactor;
          let newY = rod.y + rod.vy * dt * easeFactor;
          let newAngle = rod.angle + rod.vAngle * dt;
          
          // Subtle 3D rotation effect for free-floating rods
          let newRotateX = rod.rotateX ? rod.rotateX + (Math.random() - 0.5) * 0.1 : (Math.random() - 0.5) * 5;
          let newRotateY = rod.rotateY ? rod.rotateY + (Math.random() - 0.5) * 0.1 : (Math.random() - 0.5) * 5;
          
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
            vy: newVy,
            rotateX: newRotateX,
            rotateY: newRotateY
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
        if (Math.random() < 0.15 * dt) {
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
    
    // Create a new DNA helix with 3D perspective
    const helixId = `helix-${Date.now()}-${Math.random()}`;
    const allRodIds = [...backboneRodIds, ...basepairRodIds];
    
    // Add 3D rotation values for the entire helix
    const perspective = 1200 + Math.random() * 400;
    const rotateX = (Math.random() - 0.5) * 20;
    const rotateY = (Math.random() - 0.5) * 20;
    
    const newHelix: DNAHelix = {
      id: helixId,
      rods: allRodIds,
      backboneRods: backboneRodIds,
      basepairRods: basepairRodIds,
      centerX,
      centerY,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      width: 26, // Width of the helix (increased by 30%)
      height: 44 * turns, // Height for the total turns (increased by 30%)
      turns,
      rotation: Math.random() * Math.PI * 2,
      vRotation: (Math.random() < 0.5 ? 1 : -1) * (0.8 / 60) * 2 * Math.PI, // 0.8 turns per second
      formationProgress: 0, // Start at 0 and animate to 1
      age: 0,
      decaying: false,
      decayProgress: 0,
      particles: [],
      perspective,
      rotateX,
      rotateY
    };
    
    // Update the rods to be part of the helix
    setRods(prevRods => {
      return prevRods.map(rod => {
        if (allRodIds.includes(rod.id)) {
          const isBackbone = backboneRodIds.includes(rod.id);
          
          // Enhanced colors with more depth
          const baseColor = isBackbone 
            ? 'rgba(230, 230, 240, 0.85)' 
            : 'rgba(210, 210, 255, 0.85)';
            
          return {
            ...rod,
            inHelix: true,
            helixId,
            helixStrand: isBackbone ? 'backbone' : 'basepair',
            color: baseColor,
            opacity: 0.85,
            scale: 0,
            thickness: isBackbone ? 3.2 : 2.8, // Increased thickness by ~30%
            gradient: true,
            shadowColor: isBackbone ? 'rgba(200, 200, 255, 0.6)' : 'rgba(180, 180, 255, 0.7)',
            shadowBlur: 3,
            shadowOpacity: 0.7,
            perspective
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
        
        // Gradually apply 3D rotation during formation
        helix.rotateX = (helix.rotateX || 0) * t;
        helix.rotateY = (helix.rotateY || 0) * t;
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
              const startB = isBasepair ? 255 : 240;
              
              // End RGB values (crimson: #DC143C -> 220, 20, 60)
              const endR = 220;
              const endG = 20;
              const endB = 60;
              
              // Interpolate RGB values
              const r = Math.round(startR + (endR - startR) * decayT);
              const g = Math.round(startG + (endG - startG) * decayT);
              const b = Math.round(startB + (endB - startB) * decayT);
              
              // Add decay effects for enhanced visual interest
              const baseColor = `rgba(${r}, ${g}, ${b}, ${0.85 - decayT * 0.25})`;
              
              return {
                ...rod,
                color: baseColor,
                shadowColor: `rgba(${r}, ${g/2}, ${b/2}, ${0.7 - decayT * 0.3})`,
                shadowBlur: 2 + decayT * 3,
                blur: decayT * 2.5, // Add blur during decay
                scale: 1 - decayT * 0.2 // Slight scale reduction during decay
              };
            }
            return rod;
          });
        });
        
        // Enhance particle generation during decay
        if (Math.random() < 0.3 * decayT) {
          generateDecayParticle(helix);
        }
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
              
              // Randomize the 3D rotations for dispersion
              const newRotateX = (Math.random() - 0.5) * 45; 
              const newRotateY = (Math.random() - 0.5) * 45;
              
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
                scale: 1,
                rotateX: newRotateX,
                rotateY: newRotateY
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
      
      // Update position with some 3D wobble
      helix.centerX += helix.vx * (deltaTime / 16);
      helix.centerY += helix.vy * (deltaTime / 16);
      helix.rotation += helix.vRotation * (deltaTime / 16);
      
      // Add subtle 3D rotation wobble to enhance dimensional effect
      helix.rotateX = (helix.rotateX || 0) + (Math.random() - 0.5) * 0.1;
      helix.rotateY = (helix.rotateY || 0) + (Math.random() - 0.5) * 0.1;
      
      // Bounce off walls with padding
      const padding = Math.max(helix.width, helix.height) / 2;
      if (helix.centerX < padding || helix.centerX > dimensions.width - padding) {
        helix.vx = -helix.vx * 0.8;
        helix.rotateY = (helix.rotateY || 0) + (Math.random() - 0.5) * 5; // Add rotational energy on bounce
      }
      if (helix.centerY < padding || helix.centerY > dimensions.height - padding) {
        helix.vy = -helix.vy * 0.8;
        helix.rotateX = (helix.rotateX || 0) + (Math.random() - 0.5) * 5; // Add rotational energy on bounce
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
            
            // Generate a gradient based on position for enhanced visual depth
            const gradientAngle = Math.floor(angleOffset * (180/Math.PI) + helix.rotation * (180/Math.PI)) % 360;
            
            // Determine gradient colors based on decay state
            let gradientStart, gradientEnd;
            
            if (helix.decaying) {
              // During decay, transition to crimson
              const decayT = helix.decayProgress;
              
              // Start color (light)
              const startR = 230;
              const startG = 230;
              const startB = 240;
              
              // End color (crimson)
              const endR = 220;
              const endG = 20;
              const endB = 60;
              
              // Interpolate RGB values for gradient start and end
              const rStart = Math.round(startR + (endR - startR) * decayT);
              const gStart = Math.round(startG + (endG - startG) * decayT);
              const bStart = Math.round(startB + (endB - startB) * decayT);
              
              const rEnd = Math.round((startR - 30) + (endR - 50 - (startR - 30)) * decayT);
              const gEnd = Math.round((startG - 30) + (endG - 10 - (startG - 30)) * decayT);
              const bEnd = Math.round((startB - 30) + (endB - 10 - (startB - 30)) * decayT);
              
              gradientStart = `rgba(${rStart}, ${gStart}, ${bStart}, ${0.85 - decayT * 0.25})`;
              gradientEnd = `rgba(${rEnd}, ${gEnd}, ${bEnd}, ${0.85 - decayT * 0.25})`;
            } else {
              // Normal state
              gradientStart = isLeftBackbone 
                ? `rgba(240, 240, 250, ${0.3 + 0.65 * helix.formationProgress})`
                : `rgba(235, 235, 245, ${0.3 + 0.65 * helix.formationProgress})`;
              
              gradientEnd = isLeftBackbone 
                ? `rgba(210, 210, 235, ${0.3 + 0.65 * helix.formationProgress})`
                : `rgba(200, 200, 230, ${0.3 + 0.65 * helix.formationProgress})`;
            }
            
            // Enhanced shadow effect with directional light
            const shadowBlur = helix.decaying 
              ? 2 + helix.decayProgress * 3
              : 2 + helix.formationProgress * 1.5;
              
            const shadowColor = helix.decaying
              ? `rgba(220, 20, 60, ${0.4 + helix.decayProgress * 0.3})`
              : `rgba(180, 180, 255, ${0.3 + helix.formationProgress * 0.4})`;
            
            // Apply 3D rotations from helix to rod
            const perspective = helix.perspective || 800;
            const rotateX = (helix.rotateX || 0) + Math.sin(angleOffset) * 5;
            const rotateY = (helix.rotateY || 0) + Math.cos(angleOffset) * 5;
            
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
                : 0.3 + 0.65 * helix.formationProgress,
              // Apply gradient
              gradient: true,
              gradientAngle,
              gradientStart,
              gradientEnd,
              // Shadow effects
              shadowBlur,
              shadowColor,
              // 3D effects
              perspective,
              rotateX,
              rotateY,
              // Increase thickness by 30%
              thickness: 3.2
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
          
          // Apply 3D rotations from helix to rod
          const perspective = helix.perspective || 800;
          const rotateX = (helix.rotateX || 0) + Math.sin(angleOffset) * 10; // More pronounced for base pairs
          const rotateY = (helix.rotateY || 0) + Math.cos(angleOffset) * 10;
          
          // Update the rod with 3D effects
          setRods(prev => {
            const newRods = [...prev];
            const rod = newRods[rodIndex];
            
            // Determine gradient colors for basepair
            let gradientStart, gradientEnd;
            
            if (helix.decaying) {
              // During decay, transition to crimson
              const decayT = helix.decayProgress;
              
              // Start color (light blue tint)
              const startR = 210;
              const startG = 210;
              const startB = 255;
              
              // End color (crimson)
              const endR = 220;
              const endG = 20;
              const endB = 60;
              
              // Interpolate RGB values for gradient
              const rStart = Math.round(startR + (endR - startR) * decayT);
              const gStart = Math.round(startG + (endG - startG) * decayT);
              const bStart = Math.round(startB + (endB - startB) * decayT);
              
              const rEnd = Math.round((startR - 40) + (endR - 40 - (startR - 40)) * decayT);
              const gEnd = Math.round((startG - 40) + (endG - 10 - (startG - 40)) * decayT);
              const bEnd = Math.round((startB - 40) + (endB - 10 - (startB - 40)) * decayT);
              
              gradientStart = `rgba(${rStart}, ${gStart}, ${bStart}, ${0.85 - decayT * 0.25})`;
              gradientEnd = `rgba(${rEnd}, ${gEnd}, ${bEnd}, ${0.85 - decayT * 0.25})`;
            } else {
              // Normal state - enhanced colors for basepairs
              gradientStart = `rgba(220, 220, 255, ${0.35 + 0.55 * formationT})`;
              gradientEnd = `rgba(180, 180, 255, ${0.35 + 0.55 * formationT})`;
            }
            
            // Enhanced shadow effect for basepairs
            const shadowBlur = helix.decaying 
              ? 2 + helix.decayProgress * 3.5
              : 2.5 + formationT * 2;
              
            const shadowColor = helix.decaying
              ? `rgba(220, 20, 60, ${0.5 + helix.decayProgress * 0.3})`
              : `rgba(160, 160, 255, ${0.4 + formationT * 0.3})`;
            
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
                : 0.35 + 0.6 * formationT,
              // Apply gradient
              gradient: true,
              gradientStart,
              gradientEnd,
              // Shadow effects
              shadowBlur,
              shadowColor,
              // 3D effects
              perspective,
              rotateX,
              rotateY,
              // Increase thickness by 30%
              thickness: 2.8
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
    const distance = helix.width/2 * (1 + Math.random() * 0.5);
    const verticalRange = helix.height * 0.6;
    const x = helix.centerX + Math.cos(angle) * distance;
    const y = helix.centerY + Math.sin(angle) * distance + (Math.random() - 0.5) * verticalRange;
    
    // Particle color based on helix state
    let particleColor;
    if (helix.decaying) {
      // Crimson particles during decay
      const alpha = 0.3 + Math.random() * 0.3;
      particleColor = `rgba(220, 20, 60, ${alpha})`;
    } else {
      // Bluish-white particles during normal state
      const alpha = 0.2 + Math.random() * 0.25;
      particleColor = `rgba(210, 210, 255, ${alpha})`;
    }
    
    // Particle properties
    const newParticle: Particle = {
      id: `particle-${Date.now()}-${Math.random()}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 1.5 + Math.random() * 2.5, // Larger particles for better visibility
      opacity: 0.2 + Math.random() * 0.3,
      lifespan: 2 + Math.random() * 2, // 2-4 seconds
      age: 0,
      color: particleColor,
      blur: 1.5 + Math.random() // Add blur for glow effect
    };
    
    // Add to particles state
    setParticles(prev => [...prev, newParticle]);
  };
  
  // Generate decay particles when helix is decaying
  const generateDecayParticle = (helix: DNAHelix) => {
    // Random position within the helix volume
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * helix.width/2;
    const verticalRange = helix.height;
    const x = helix.centerX + Math.cos(angle) * distance;
    const y = helix.centerY + Math.sin(angle) * distance + (Math.random() - 0.5) * verticalRange;
    
    // Crimson particles with varying intensity during decay
    const intensity = 0.6 + Math.random() * 0.4;
    const r = Math.floor(220 * intensity);
    const g = Math.floor(20 * intensity);
    const b = Math.floor(60 * intensity);
    const alpha = 0.4 + Math.random() * 0.3;
    
    // Create particle with outward velocity from helix center
    const dirX = x - helix.centerX;
    const dirY = y - helix.centerY;
    const dist = Math.sqrt(dirX * dirX + dirY * dirY);
    const normX = dist > 0 ? dirX / dist : 0;
    const normY = dist > 0 ? dirY / dist : 0;
    
    const speed = 0.3 + Math.random() * 0.7;
    
    const newParticle: Particle = {
      id: `decay-${Date.now()}-${Math.random()}`,
      x,
      y,
      vx: normX * speed + (Math.random() - 0.5) * 0.2,
      vy: normY * speed + (Math.random() - 0.5) * 0.2,
      size: 2 + Math.random() * 3, // Larger decay particles
      opacity: alpha,
      lifespan: 1 + Math.random() * 1.5, // Shorter lifespan for decay particles
      age: 0,
      color: `rgba(${r}, ${g}, ${b}, ${alpha})`,
      blur: 2 + Math.random() * 2 // More blur for glow effect
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
          
          // Add subtle drift for more organic motion
          const newVx = particle.vx + (Math.random() - 0.5) * 0.01;
          const newVy = particle.vy + (Math.random() - 0.5) * 0.01;
          
          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
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
    <div className="w-full min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center perspective-1200">
      {/* Canvas for rods, DNA and particles */}
      <div 
        ref={canvasRef} 
        className="absolute inset-0 overflow-hidden"
        style={{ perspective: '1200px' }}
      >
        {/* Enhanced ambient lighting */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(30,30,50,0.15) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }}
        />
        
        {/* Ambient particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            style={{
              position: 'absolute',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              backgroundColor: particle.color || (theme === 'dark' 
                ? `rgba(255, 255, 255, ${particle.opacity})` 
                : `rgba(0, 0, 0, ${particle.opacity})`),
              left: particle.x - particle.size/2,
              top: particle.y - particle.size/2,
              filter: `blur(${particle.blur || 1}px)`,
              boxShadow: particle.color?.includes('220, 20, 60')
                ? `0 0 ${particle.size * 1.5}px ${particle.color.replace(', 0.', ', 0.3')}`
                : undefined,
              zIndex: 2
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
              height: '100%',
              zIndex: rod.inHelix ? 3 : 1
            }}
          >
            {/* The rod element with enhanced 3D transformations */}
            <motion.div
              style={{
                position: 'absolute',
                width: `${rod.length}px`,
                height: `${rod.thickness || 2.6}px`,
                background: rod.gradient 
                  ? `linear-gradient(${rod.gradientAngle || 0}deg, ${rod.gradientStart || rod.color}, ${rod.gradientEnd || rod.color})`
                  : rod.color,
                opacity: rod.opacity,
                transformOrigin: 'center',
                left: rod.x - rod.length/2,
                top: rod.y - (rod.thickness || 2.6)/2,
                transform: `
                  rotate(${rod.angle}rad) 
                  scale(${rod.scale || 1}) 
                  ${rod.perspective ? `perspective(${rod.perspective}px)` : ''} 
                  ${rod.rotateX ? `rotateX(${rod.rotateX}deg)` : ''} 
                  ${rod.rotateY ? `rotateY(${rod.rotateY}deg)` : ''}
                `,
                borderRadius: `${(rod.thickness || 2.6)/2}px`,
                boxShadow: rod.shadowColor 
                  ? `0 0 ${rod.shadowBlur || 2}px ${rod.shadowColor}`
                  : undefined,
                filter: rod.blur ? `blur(${rod.blur}px)` : undefined
              }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 100
              }}
            />
            
            {/* Enhanced connector nodes at ends - only for rods in a helix */}
            {rod.inHelix && rod.helixStrand === 'backbone' && (
              <>
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: rod.gradient 
                      ? rod.gradientStart || rod.color 
                      : rod.color,
                    left: rod.x + Math.cos(rod.angle) * (rod.length/2) - 2.5,
                    top: rod.y + Math.sin(rod.angle) * (rod.length/2) - 2.5,
                    opacity: rod.opacity,
                    filter: rod.blur ? `blur(${rod.blur}px)` : undefined,
                    transform: `
                      scale(${rod.scale || 1}) 
                      ${rod.perspective ? `perspective(${rod.perspective}px)` : ''} 
                      ${rod.rotateX ? `rotateX(${rod.rotateX}deg)` : ''} 
                      ${rod.rotateY ? `rotateY(${rod.rotateY}deg)` : ''}
                    `,
                    boxShadow: rod.shadowColor 
                      ? `0 0 ${rod.shadowBlur || 2}px ${rod.shadowColor}, inset 0 0 2px rgba(255,255,255,0.3)`
                      : undefined
                  }}
                />
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: rod.gradient 
                      ? rod.gradientEnd || rod.color 
                      : rod.color,
                    left: rod.x - Math.cos(rod.angle) * (rod.length/2) - 2.5,
                    top: rod.y - Math.sin(rod.angle) * (rod.length/2) - 2.5,
                    opacity: rod.opacity,
                    filter: rod.blur ? `blur(${rod.blur}px)` : undefined,
                    transform: `
                      scale(${rod.scale || 1}) 
                      ${rod.perspective ? `perspective(${rod.perspective}px)` : ''} 
                      ${rod.rotateX ? `rotateX(${rod.rotateX}deg)` : ''} 
                      ${rod.rotateY ? `rotateY(${rod.rotateY}deg)` : ''}
                    `,
                    boxShadow: rod.shadowColor 
                      ? `0 0 ${rod.shadowBlur || 2}px ${rod.shadowColor}, inset 0 0 2px rgba(255,255,255,0.3)`
                      : undefined
                  }}
                />
              </>
            )}
            
            {/* Enhanced nucleotide base pair connections */}
            {rod.inHelix && rod.helixStrand === 'basepair' && (
              <>
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: rod.gradient 
                      ? rod.gradientStart || rod.color 
                      : rod.color,
                    left: rod.x + Math.cos(rod.angle) * (rod.length/2) - 3,
                    top: rod.y + Math.sin(rod.angle) * (rod.length/2) - 3,
                    opacity: rod.opacity,
                    filter: rod.blur ? `blur(${rod.blur}px)` : undefined,
                    transform: `
                      scale(${rod.scale || 1}) 
                      ${rod.perspective ? `perspective(${rod.perspective}px)` : ''} 
                      ${rod.rotateX ? `rotateX(${rod.rotateX}deg)` : ''} 
                      ${rod.rotateY ? `rotateY(${rod.rotateY}deg)` : ''}
                    `,
                    boxShadow: rod.shadowColor 
                      ? `0 0 ${(rod.shadowBlur || 2) + 1}px ${rod.shadowColor}, inset 0 0 2px rgba(255,255,255,0.5)`
                      : undefined
                  }}
                />
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: rod.gradient 
                      ? rod.gradientEnd || rod.color 
                      : rod.color,
                    left: rod.x - Math.cos(rod.angle) * (rod.length/2) - 3,
                    top: rod.y - Math.sin(rod.angle) * (rod.length/2) - 3,
                    opacity: rod.opacity,
                    filter: rod.blur ? `blur(${rod.blur}px)` : undefined,
                    transform: `
                      scale(${rod.scale || 1}) 
                      ${rod.perspective ? `perspective(${rod.perspective}px)` : ''} 
                      ${rod.rotateX ? `rotateX(${rod.rotateX}deg)` : ''} 
                      ${rod.rotateY ? `rotateY(${rod.rotateY}deg)` : ''}
                    `,
                    boxShadow: rod.shadowColor 
                      ? `0 0 ${(rod.shadowBlur || 2) + 1}px ${rod.shadowColor}, inset 0 0 2px rgba(255,255,255,0.5)`
                      : undefined
                  }}
                />
              </>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Enhanced ambient lighting effects */}
      <div className="absolute inset-0 pointer-events-none">
        {Object.values(helices).map(helix => (
          <motion.div 
            key={helix.id}
            style={{
              position: 'absolute',
              left: helix.centerX - 75,
              top: helix.centerY - 75,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: helix.decaying 
                ? `radial-gradient(circle, rgba(220, 20, 60, ${0.2 * (1 - helix.decayProgress)}) 0%, transparent 70%)`
                : `radial-gradient(circle, rgba(180, 180, 255, ${0.15 * helix.formationProgress}) 0%, transparent 70%)`,
              opacity: helix.decaying ? 1 - helix.decayProgress : helix.formationProgress,
              transform: `
                scale(${1 + helix.formationProgress * 0.5}) 
                perspective(${helix.perspective || 800}px) 
                rotateX(${helix.rotateX || 0}deg) 
                rotateY(${helix.rotateY || 0}deg)
              `,
              transition: 'all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
              boxShadow: helix.decaying 
                ? `0 0 50px rgba(220, 20, 60, ${0.1 * (1 - helix.decayProgress)})`
                : `0 0 50px rgba(180, 180, 255, ${0.1 * helix.formationProgress})`,
              zIndex: 1
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
      
      {/* Enhanced depth layer with atmospheric effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,20,60,0.1),transparent_70%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),transparent_30%,transparent_70%,rgba(0,0,0,0.2))] pointer-events-none"></div>
    </div>
  );
};

export default AnimatedLandingPage;