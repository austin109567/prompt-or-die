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
  gradientStart?: string;
  gradientEnd?: string;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOpacity?: number;
  perspective?: number;
  rotateX?: number;
  rotateY?: number;
}

interface DNAHelix {
  id: string;
  strandIndex: number; // 0, 1, or 2 to identify which of the three strands
  rods: string[];
  backboneRods: string[];
  basepairRods: string[];
  centerX: number;
  centerY: number;
  vx: number;
  vy: number;
  width: number; 
  height: number; 
  turns: number;
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
  state: 'forming' | 'stable' | 'unwinding' | 'rewinding' | 'decaying';
  targetHelix?: string; // ID of helix to intertwine with
  intertwineProgress?: number; // 0 to 1
  unwindProgress?: number; // 0 to 1
  rewindProgress?: number; // 0 to 1
  colorScheme: DNAColorScheme;
}

interface DNAColorScheme {
  backboneStart: string;
  backboneEnd: string;
  basepairStart: string;
  basepairEnd: string;
  decayStart: string;
  decayEnd: string;
  particleColor: string;
  glowColor: string;
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

// Define three distinct color schemes for DNA strands
const DNA_COLOR_SCHEMES: DNAColorScheme[] = [
  // Scheme 1: Blue-ish
  {
    backboneStart: 'rgba(180, 210, 255, 0.85)',
    backboneEnd: 'rgba(140, 180, 240, 0.85)',
    basepairStart: 'rgba(210, 230, 255, 0.85)',
    basepairEnd: 'rgba(170, 200, 255, 0.85)',
    decayStart: 'rgba(220, 20, 60, 0.85)', // Crimson for all
    decayEnd: 'rgba(180, 10, 40, 0.85)',
    particleColor: 'rgba(180, 210, 255, 0.6)',
    glowColor: 'rgba(140, 180, 240, 0.5)'
  },
  // Scheme 2: Green-ish
  {
    backboneStart: 'rgba(180, 255, 210, 0.85)',
    backboneEnd: 'rgba(140, 240, 180, 0.85)',
    basepairStart: 'rgba(210, 255, 230, 0.85)',
    basepairEnd: 'rgba(170, 255, 200, 0.85)',
    decayStart: 'rgba(220, 20, 60, 0.85)',
    decayEnd: 'rgba(180, 10, 40, 0.85)',
    particleColor: 'rgba(180, 255, 210, 0.6)',
    glowColor: 'rgba(140, 240, 180, 0.5)'
  },
  // Scheme 3: Purple-ish
  {
    backboneStart: 'rgba(230, 180, 255, 0.85)',
    backboneEnd: 'rgba(200, 140, 240, 0.85)',
    basepairStart: 'rgba(240, 210, 255, 0.85)',
    basepairEnd: 'rgba(220, 170, 255, 0.85)',
    decayStart: 'rgba(220, 20, 60, 0.85)',
    decayEnd: 'rgba(180, 10, 40, 0.85)',
    particleColor: 'rgba(230, 180, 255, 0.6)',
    glowColor: 'rgba(200, 140, 240, 0.5)'
  }
];

const AnimatedLandingPage = () => {
  const { theme } = useTheme();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [rods, setRods] = useState<Rod[]>([]);
  const [helices, setHelices] = useState<{[key: string]: DNAHelix}>({});
  const [particles, setParticles] = useState<Particle[]>([]);
  const [activeStrands, setActiveStrands] = useState<number[]>([0, 0, 0]); // Tracks active helices for each strand type
  const canvasRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const transformationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    // Generate random rods with fluid appearance
    const initialRods: Rod[] = Array.from({ length: 150 }).map((_, i) => {
      const x = Math.random() * dimensions.width;
      const y = Math.random() * dimensions.height;
      const angle = Math.random() * Math.PI * 2;
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

  // Schedule DNA transformations
  useEffect(() => {
    // Start creating DNA strands with slight delays between them
    const initialCreation = setTimeout(() => formDNAHelix(0), 2000);
    const secondCreation = setTimeout(() => formDNAHelix(1), 4000);
    const thirdCreation = setTimeout(() => formDNAHelix(2), 6000);
    
    // Schedule regular transformations
    const scheduleNextTransformation = () => {
      const nextTime = 8000 + Math.random() * 4000; // 8-12 seconds
      transformationTimerRef.current = setTimeout(() => {
        transformRandomHelix();
        scheduleNextTransformation();
      }, nextTime);
    };
    
    // Start the transformation cycle after all helices are created
    setTimeout(scheduleNextTransformation, 10000);
    
    return () => {
      clearTimeout(initialCreation);
      clearTimeout(secondCreation);
      clearTimeout(thirdCreation);
      if (transformationTimerRef.current) {
        clearTimeout(transformationTimerRef.current);
      }
    };
  }, []);

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

      // Automatically create DNA helices if needed (one of each type)
      Object.values(DNA_COLOR_SCHEMES).forEach((_, index) => {
        const activeCount = Object.values(helices).filter(h => 
          h.strandIndex === index && 
          (h.state === 'forming' || h.state === 'stable' || h.state === 'unwinding' || h.state === 'rewinding')
        ).length;
        
        if (activeCount === 0 && Math.random() < 0.002) {
          formDNAHelix(index);
        }
      });
      
      // Update existing helices
      updateHelices(deltaTime);
      
      // Update particles
      updateParticles(deltaTime);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [rods, dimensions, helices]);
  
  // Function to form DNA helix with specific strand type
  const formDNAHelix = (strandIndex: number = Math.floor(Math.random() * 3)) => {
    // Find free rods
    const freeRods = rods.filter(rod => !rod.inHelix);
    
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
    const helixId = `helix-${strandIndex}-${Date.now()}-${Math.random()}`;
    const allRodIds = [...backboneRodIds, ...basepairRodIds];
    
    // Add 3D rotation values for the entire helix
    const perspective = 1200 + Math.random() * 400;
    const rotateX = (Math.random() - 0.5) * 20;
    const rotateY = (Math.random() - 0.5) * 20;
    
    // Get the color scheme for this strand
    const colorScheme = DNA_COLOR_SCHEMES[strandIndex];
    
    const newHelix: DNAHelix = {
      id: helixId,
      strandIndex,
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
      rotateY,
      state: 'forming',
      colorScheme
    };
    
    // Update the rods to be part of the helix
    setRods(prevRods => {
      return prevRods.map(rod => {
        if (allRodIds.includes(rod.id)) {
          const isBackbone = backboneRodIds.includes(rod.id);
          
          // Use colors from the color scheme
          const baseColor = isBackbone 
            ? colorScheme.backboneStart
            : colorScheme.basepairStart;
            
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
            shadowColor: isBackbone 
              ? colorScheme.glowColor
              : colorScheme.glowColor,
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

    // Update active strands count
    setActiveStrands(prev => {
      const newCounts = [...prev];
      newCounts[strandIndex]++;
      return newCounts;
    });
  };
  
  // Transform a random helix (unwind, rewind, or decay)
  const transformRandomHelix = () => {
    const stableHelices = Object.values(helices).filter(h => h.state === 'stable');
    if (stableHelices.length === 0) return;
    
    const randomHelix = stableHelices[Math.floor(Math.random() * stableHelices.length)];
    
    // Choose a random transformation
    const transformType = Math.random();
    
    if (transformType < 0.4) { // 40% chance to unwind
      setHelices(prev => ({
        ...prev,
        [randomHelix.id]: {
          ...randomHelix,
          state: 'unwinding',
          unwindProgress: 0
        }
      }));
      
      // Generate special transformation particles
      generateTransformationParticles(randomHelix, 'unwinding');
    } 
    else if (transformType < 0.8) { // 40% chance to decay
      setHelices(prev => ({
        ...prev,
        [randomHelix.id]: {
          ...randomHelix,
          state: 'decaying',
          decayProgress: 0,
          decaying: true
        }
      }));
      
      // Generate special transformation particles
      generateTransformationParticles(randomHelix, 'decaying');
    }
    else { // 20% chance to intertwine with another helix
      const otherHelices = stableHelices.filter(h => h.id !== randomHelix.id);
      
      if (otherHelices.length > 0) {
        const targetHelix = otherHelices[Math.floor(Math.random() * otherHelices.length)];
        
        setHelices(prev => ({
          ...prev,
          [randomHelix.id]: {
            ...randomHelix,
            state: 'rewinding',
            rewindProgress: 0,
            targetHelix: targetHelix.id
          }
        }));
        
        // Generate special transformation particles
        generateTransformationParticles(randomHelix, 'rewinding', targetHelix);
      }
    }
  };
  
  // Generate special particles for transformations
  const generateTransformationParticles = (helix: DNAHelix, transformType: string, targetHelix?: DNAHelix) => {
    const particleCount = transformType === 'decaying' ? 15 : 10;
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      // Position particles along the helix
      const angleOffset = Math.random() * Math.PI * 2;
      const verticalOffset = (Math.random() - 0.5) * helix.height;
      const radiusMultiplier = transformType === 'unwinding' ? 1.2 : 1;
      
      const x = helix.centerX + Math.cos(angleOffset) * (helix.width/2) * radiusMultiplier;
      const y = helix.centerY + Math.sin(angleOffset) * (helix.width/2) * radiusMultiplier + verticalOffset;
      
      // Particle color based on transformation and helix color scheme
      let particleColor;
      
      if (transformType === 'decaying') {
        particleColor = helix.colorScheme.decayStart.replace('0.85', '0.7');
      } else if (transformType === 'unwinding') {
        particleColor = helix.colorScheme.particleColor;
      } else {
        // For rewinding, use a mix of both helix colors if target exists
        if (targetHelix) {
          const mixRatio = Math.random();
          const color1 = helix.colorScheme.particleColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)!;
          const color2 = targetHelix.colorScheme.particleColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)!;
          
          const r = Math.round(parseInt(color1[1]) * (1-mixRatio) + parseInt(color2[1]) * mixRatio);
          const g = Math.round(parseInt(color1[2]) * (1-mixRatio) + parseInt(color2[2]) * mixRatio);
          const b = Math.round(parseInt(color1[3]) * (1-mixRatio) + parseInt(color2[3]) * mixRatio);
          const a = parseFloat(color1[4]) * (1-mixRatio) + parseFloat(color2[4]) * mixRatio;
          
          particleColor = `rgba(${r}, ${g}, ${b}, ${a})`;
        } else {
          particleColor = helix.colorScheme.particleColor;
        }
      }
      
      // Add directional velocity based on transformation type
      let vx, vy;
      
      if (transformType === 'decaying') {
        // Explosion effect for decay
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 0.5;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      } else if (transformType === 'unwinding') {
        // Unwinding - particles move outward perpendicular to helix axis
        const angle = angleOffset;
        const speed = 0.2 + Math.random() * 0.3;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      } else { // rewinding
        // Rewinding - particles move toward target if exists
        if (targetHelix) {
          const dx = targetHelix.centerX - x;
          const dy = targetHelix.centerY - y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const speed = 0.2 + Math.random() * 0.3;
          vx = (dx / dist) * speed;
          vy = (dy / dist) * speed;
        } else {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.1 + Math.random() * 0.2;
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed;
        }
      }
      
      newParticles.push({
        id: `trans-${Date.now()}-${Math.random()}`,
        x,
        y,
        vx,
        vy,
        size: 2 + Math.random() * 3,
        opacity: 0.5 + Math.random() * 0.4,
        lifespan: 1.5 + Math.random() * 2,
        age: 0,
        color: particleColor,
        blur: 2 + Math.random() * 1.5
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };
  
  // Update existing DNA helices
  const updateHelices = (deltaTime: number) => {
    const updatedHelices = {...helices};
    let helicesChanged = false;
    
    Object.keys(updatedHelices).forEach(helixId => {
      const helix = updatedHelices[helixId];
      
      // Update age
      helix.age += deltaTime / 1000; // Convert to seconds
      
      // Handle different helix states
      switch(helix.state) {
        case 'forming':
          // Update formation progress (over 4-6 seconds)
          const formationDuration = 4 + Math.random() * 2;
          if (helix.formationProgress < 1) {
            // Use cubic-bezier for organic formation
            const t = Math.min(1, helix.age / formationDuration);
            const cubic = (t: number) => {
              return t < 0.5 
                ? 4 * t * t * t 
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
            };
            
            helix.formationProgress = cubic(t);
            helicesChanged = true;
            
            // Gradually apply 3D rotation during formation
            helix.rotateX = (helix.rotateX || 0) * t;
            helix.rotateY = (helix.rotateY || 0) * t;
            
            // Generate ambient particles during formation
            if (Math.random() < 0.2) {
              generateAmbientParticle(helix);
            }
          } else {
            // Transition to stable state when fully formed
            helix.state = 'stable';
            helicesChanged = true;
          }
          break;
          
        case 'stable':
          // Generate occasional ambient particles
          if (Math.random() < 0.05) {
            generateAmbientParticle(helix);
          }
          
          // After some time in stable state, it can transform
          // This is handled by the transformRandomHelix function
          break;
          
        case 'unwinding':
          // Update unwinding progress (over 3-4 seconds)
          const unwindDuration = 3 + Math.random();
          if (helix.unwindProgress === undefined) helix.unwindProgress = 0;
          
          if (helix.unwindProgress < 1) {
            helix.unwindProgress += deltaTime / (unwindDuration * 1000);
            helicesChanged = true;
            
            // Generate particles during unwinding
            if (Math.random() < 0.15) {
              generateTransformationParticles(helix, 'unwinding');
            }
          } else {
            // Return to stable state when fully unwound, but with expanded width
            helix.state = 'stable';
            helix.width = helix.width * 1.8; // Expanded helix
            helicesChanged = true;
            
            // Schedule rewinding after a delay
            setTimeout(() => {
              if (updatedHelices[helixId] && updatedHelices[helixId].state === 'stable') {
                updatedHelices[helixId].state = 'rewinding';
                updatedHelices[helixId].rewindProgress = 0;
                setHelices({...updatedHelices});
              }
            }, 2000 + Math.random() * 1000);
          }
          break;
          
        case 'rewinding':
          // Update rewinding progress (over 3-4 seconds)
          const rewindDuration = 3 + Math.random();
          if (helix.rewindProgress === undefined) helix.rewindProgress = 0;
          
          if (helix.rewindProgress < 1) {
            helix.rewindProgress += deltaTime / (rewindDuration * 1000);
            helicesChanged = true;
            
            // Width contracts back to normal during rewinding
            helix.width = 26 + (helix.width - 26) * (1 - helix.rewindProgress);
            
            // Generate particles during rewinding
            if (Math.random() < 0.15) {
              generateTransformationParticles(helix, 'rewinding');
            }
          } else {
            // Return to stable state when fully rewound
            helix.state = 'stable';
            helix.width = 26; // Normal helix width
            helicesChanged = true;
          }
          break;
          
        case 'decaying':
          // Update decay progress (over 3-4 seconds)
          const decayDuration = 3 + Math.random();
          if (helix.decayProgress < 1) {
            helix.decayProgress += deltaTime / (decayDuration * 1000);
            helicesChanged = true;
            
            // Color transition to crimson
            const decayT = helix.decayProgress;
            setRods(prevRods => {
              return prevRods.map(rod => {
                if (rod.helixId === helixId) {
                  const isBasepair = rod.helixStrand === 'basepair';
                  
                  // Parse the start and end colors
                  const startColorMatch = (isBasepair ? 
                    helix.colorScheme.basepairStart : 
                    helix.colorScheme.backboneStart).match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
                  
                  const endColorMatch = helix.colorScheme.decayStart.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
                  
                  if (!startColorMatch || !endColorMatch) return rod;
                  
                  // Start RGB values
                  const startR = parseInt(startColorMatch[1]);
                  const startG = parseInt(startColorMatch[2]);
                  const startB = parseInt(startColorMatch[3]);
                  const startA = parseFloat(startColorMatch[4]);
                  
                  // End RGB values (crimson)
                  const endR = parseInt(endColorMatch[1]);
                  const endG = parseInt(endColorMatch[2]);
                  const endB = parseInt(endColorMatch[3]);
                  const endA = parseFloat(endColorMatch[4]);
                  
                  // Interpolate RGB values
                  const r = Math.round(startR + (endR - startR) * decayT);
                  const g = Math.round(startG + (endG - startG) * decayT);
                  const b = Math.round(startB + (endB - startB) * decayT);
                  const a = startA + (endA - startA) * decayT;
                  
                  // Add decay effects
                  const baseColor = `rgba(${r}, ${g}, ${b}, ${a - decayT * 0.25})`;
                  const shadowColor = `rgba(${r}, ${g/2}, ${b/2}, ${0.7 - decayT * 0.3})`;
                  
                  return {
                    ...rod,
                    color: baseColor,
                    gradientStart: baseColor,
                    gradientEnd: `rgba(${r-30}, ${g-30}, ${b-30}, ${a - decayT * 0.25})`,
                    shadowColor: shadowColor,
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
          } else {
            // Remove helix if fully decayed
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
            
            // Update active strands count
            setActiveStrands(prev => {
              const newCounts = [...prev];
              newCounts[helix.strandIndex]--;
              return newCounts;
            });
            
            return;
          }
          break;
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
      
      // Intertwine with target helix if rewinding with target
      if (helix.state === 'rewinding' && helix.targetHelix && updatedHelices[helix.targetHelix]) {
        const target = updatedHelices[helix.targetHelix];
        
        // Gradually move toward target
        const intertwineSpeed = 0.02; // Speed of intertwining
        const dx = target.centerX - helix.centerX;
        const dy = target.centerY - helix.centerY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist > 10) { // Don't get too close
          helix.centerX += dx * intertwineSpeed * (deltaTime / 16);
          helix.centerY += dy * intertwineSpeed * (deltaTime / 16);
          
          // Match rotation speed with target
          helix.vRotation = (helix.vRotation + target.vRotation) / 2;
        }
      }
      
      // Position rods for the DNA double helix based on the helix state
      positionHelixRods(helix, deltaTime);
    });
    
    if (helicesChanged) {
      setHelices(updatedHelices);
    }
  };
  
  // Position the rods in a helix based on its current state
  const positionHelixRods = (helix: DNAHelix, deltaTime: number) => {
    const basePairsPerTurn = 10;
    const turnHeight = helix.height / helix.turns;
    let widthMultiplier = 1;
    
    // Adjust width based on unwinding/rewinding state
    if (helix.state === 'unwinding' && helix.unwindProgress !== undefined) {
      widthMultiplier = 1 + helix.unwindProgress * 0.8; // Expand by up to 80%
    } else if (helix.state === 'rewinding' && helix.rewindProgress !== undefined) {
      // Start from expanded width and contract back
      widthMultiplier = 1 + 0.8 * (1 - helix.rewindProgress);
    }
    
    // Position backbone rods
    helix.backboneRods.forEach((rodId, index) => {
      const rodIndex = rods.findIndex(r => r.id === rodId);
      if (rodIndex === -1) return;
      
      const isLeftBackbone = index < helix.backboneRods.length / 2;
      const backboneIndex = isLeftBackbone 
        ? index 
        : index - helix.backboneRods.length / 2;
      
      // Formation progress affects scale
      let formationT = 0;
      
      if (helix.state === 'forming') {
        // Smooth formation animation
        formationT = Math.min(1, helix.formationProgress * 2); // Double speed for early appearance
      } else if (helix.state === 'stable' || helix.state === 'unwinding' || helix.state === 'rewinding') {
        formationT = 1; // Fully formed
      } else if (helix.state === 'decaying') {
        formationT = 1 - helix.decayProgress * 0.2; // Slight scale reduction during decay
      }
      
      // Calculate position along the helix
      const turnProgress = (backboneIndex % basePairsPerTurn) / basePairsPerTurn;
      const turnIndex = Math.floor(backboneIndex / basePairsPerTurn);
      
      // Vertical position
      const verticalProgress = (turnIndex + turnProgress) / helix.turns;
      const verticalOffset = -helix.height/2 + verticalProgress * helix.height;
      
      // Angle around the helix
      const angleOffset = turnProgress * Math.PI * 2 + (isLeftBackbone ? 0 : Math.PI);
      
      // Apply the helix rotation and width with unwinding adjustment
      const rotX = Math.cos(angleOffset + helix.rotation) * (helix.width/2 * widthMultiplier) * formationT;
      const rotY = Math.sin(angleOffset + helix.rotation) * (helix.width/2 * widthMultiplier) * formationT;
      
      // Final position with formation animation
      const targetX = helix.centerX + rotX;
      const targetY = helix.centerY + rotY + verticalOffset * formationT;
      
      // Angle for the rod - tangent to the helix curve
      const tangentAngle = angleOffset + helix.rotation + Math.PI/2;
      
      // Update the rod with easing
      setRods(prev => {
        const newRods = [...prev];
        const rod = newRods[rodIndex];
        if (!rod) return prev;
        
        // Get colors from the color scheme
        let gradientStart, gradientEnd;
        
        if (helix.state === 'decaying') {
          // During decay, transition to crimson
          const decayT = helix.decayProgress;
          
          // Parse start color
          const startColorMatch = helix.colorScheme.backboneStart.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
          const endColorMatch = helix.colorScheme.decayStart.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
          
          if (startColorMatch && endColorMatch) {
            // Start color
            const startR = parseInt(startColorMatch[1]);
            const startG = parseInt(startColorMatch[2]);
            const startB = parseInt(startColorMatch[3]);
            const startA = parseFloat(startColorMatch[4]);
            
            // End color (crimson)
            const endR = parseInt(endColorMatch[1]);
            const endG = parseInt(endColorMatch[2]);
            const endB = parseInt(endColorMatch[3]);
            const endA = parseFloat(endColorMatch[4]);
            
            // Interpolate RGB values for gradient start and end
            const rStart = Math.round(startR + (endR - startR) * decayT);
            const gStart = Math.round(startG + (endG - startG) * decayT);
            const bStart = Math.round(startB + (endB - startB) * decayT);
            const aStart = startA + (endA - startA) * decayT;
            
            const rEnd = Math.round((startR - 30) + (endR - 50 - (startR - 30)) * decayT);
            const gEnd = Math.round((startG - 30) + (endG - 10 - (startG - 30)) * decayT);
            const bEnd = Math.round((startB - 30) + (endB - 10 - (startB - 30)) * decayT);
            const aEnd = Math.max(0, aStart - 0.1);
            
            gradientStart = `rgba(${rStart}, ${gStart}, ${bStart}, ${aStart - decayT * 0.25})`;
            gradientEnd = `rgba(${rEnd}, ${gEnd}, ${bEnd}, ${aEnd - decayT * 0.25})`;
          } else {
            // Fallback if parsing fails
            gradientStart = helix.colorScheme.decayStart;
            gradientEnd = helix.colorScheme.decayEnd;
          }
        } else {
          // Normal state colors from scheme
          gradientStart = helix.colorScheme.backboneStart;
          gradientEnd = helix.colorScheme.backboneEnd;
        }
        
        // Enhanced shadow effect with directional light
        const shadowBlur = helix.state === 'decaying'
          ? 2 + helix.decayProgress * 3
          : 2 + (helix.state === 'forming' ? helix.formationProgress : 1) * 1.5;
          
        const shadowColor = helix.state === 'decaying'
          ? helix.colorScheme.decayStart.replace('0.85', `${0.4 + helix.decayProgress * 0.3}`)
          : helix.colorScheme.glowColor;
        
        // Apply 3D rotations from helix to rod
        const perspective = helix.perspective || 800;
        const rotateX = (helix.rotateX || 0) + Math.sin(angleOffset) * 5;
        const rotateY = (helix.rotateY || 0) + Math.cos(angleOffset) * 5;
        
        // Additional transforms based on helix state
        let additionalScale = 1;
        let additionalBlur = 0;
        
        if (helix.state === 'unwinding' && helix.unwindProgress !== undefined) {
          // During unwinding, apply some effects
          additionalBlur = helix.unwindProgress * 1.2;
          additionalScale = 1 - helix.unwindProgress * 0.1;
        } else if (helix.state === 'rewinding' && helix.rewindProgress !== undefined) {
          // During rewinding, apply some effects
          additionalBlur = (1 - helix.rewindProgress) * 1.2;
          additionalScale = 0.9 + helix.rewindProgress * 0.1;
        }
        
        newRods[rodIndex] = {
          ...rod,
          x: targetX,
          y: targetY,
          angle: tangentAngle,
          // Scale from 0 to 1 during formation, with additional state effects
          scale: (helix.state === 'forming' ? helix.formationProgress : 1) * additionalScale,
          // Add blur based on movement and state
          blur: (helix.state === 'decaying' ? rod.blur : Math.min(1, Math.sqrt(helix.vx*helix.vx + helix.vy*helix.vy) * 3)) + additionalBlur,
          // Maintain opacity based on state
          opacity: helix.state === 'decaying' 
            ? rod.opacity
            : 0.3 + 0.65 * (helix.state === 'forming' ? helix.formationProgress : 1),
          // Apply gradient
          gradient: true,
          gradientStart: gradientStart,
          gradientEnd: gradientEnd,
          // Shadow effects
          shadowBlur,
          shadowColor,
          // 3D effects
          perspective,
          rotateX,
          rotateY,
          // Thickness based on strand type
          thickness: 3.2
        };
        return newRods;
      });
    });
    
    // Position base pair rods
    helix.basepairRods.forEach((rodId, index) => {
      const rodIndex = rods.findIndex(r => r.id === rodId);
      if (rodIndex === -1) return;
      
      // Calculate formation progress based on helix state
      let formationT = 0;
      
      if (helix.state === 'forming') {
        // Base pairs appear slightly after backbones
        formationT = Math.max(0, Math.min(1, (helix.formationProgress - 0.2) * 1.25));
      } else if (helix.state === 'stable' || helix.state === 'unwinding' || helix.state === 'rewinding') {
        formationT = 1;
      } else if (helix.state === 'decaying') {
        formationT = 1 - helix.decayProgress * 0.2;
      }
      
      // Adjust width during transformations
      if (helix.state === 'unwinding' && helix.unwindProgress !== undefined) {
        widthMultiplier = 1 + helix.unwindProgress * 0.8;
      } else if (helix.state === 'rewinding' && helix.rewindProgress !== undefined) {
        widthMultiplier = 1 + 0.8 * (1 - helix.rewindProgress);
      }
      
      // Calculate positions along the helix
      const turnIndex = Math.floor(index / (basePairsPerTurn / 2));
      const pairProgress = (index % (basePairsPerTurn / 2)) / (basePairsPerTurn / 2);
      
      // Vertical position
      const verticalProgress = (turnIndex + pairProgress) / helix.turns;
      const verticalOffset = -helix.height/2 + verticalProgress * helix.height;
      
      // Angle around the helix - adjusted during unwinding/rewinding
      let angleOffset = pairProgress * Math.PI + helix.rotation;
      
      // During unwinding, make the base pairs more perpendicular
      if (helix.state === 'unwinding' && helix.unwindProgress !== undefined) {
        // Progressively rotate base pairs to be more perpendicular
        const unwoundAngle = (pairProgress * Math.PI + helix.rotation) % (Math.PI * 2);
        angleOffset = unwoundAngle + helix.unwindProgress * (Math.PI/2 - (unwoundAngle % (Math.PI/2)));
      } else if (helix.state === 'rewinding' && helix.rewindProgress !== undefined) {
        // Reverse of unwinding
        const unwoundAngle = (pairProgress * Math.PI + helix.rotation) % (Math.PI * 2);
        const perpOffset = Math.PI/2 - (unwoundAngle % (Math.PI/2));
        angleOffset = unwoundAngle + perpOffset * (1 - helix.rewindProgress);
      }
      
      // Position at center of helix
      const centerX = helix.centerX;
      const centerY = helix.centerY + verticalOffset * formationT;
      
      // Angle for base pair - perpendicular to backbone tangent
      const basePairAngle = angleOffset;
      
      // Apply 3D rotations
      const perspective = helix.perspective || 800;
      const rotateX = (helix.rotateX || 0) + Math.sin(angleOffset) * 10;
      const rotateY = (helix.rotateY || 0) + Math.cos(angleOffset) * 10;
      
      // Update the rod with 3D effects
      setRods(prev => {
        const newRods = [...prev];
        const rod = newRods[rodIndex];
        if (!rod) return prev;
        
        // Determine gradient colors for basepair
        let gradientStart, gradientEnd;
        
        if (helix.state === 'decaying') {
          // During decay, transition to crimson
          const decayT = helix.decayProgress;
          
          // Parse start color
          const startColorMatch = helix.colorScheme.basepairStart.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
          const endColorMatch = helix.colorScheme.decayStart.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
          
          if (startColorMatch && endColorMatch) {
            // Start color (base pair color)
            const startR = parseInt(startColorMatch[1]);
            const startG = parseInt(startColorMatch[2]);
            const startB = parseInt(startColorMatch[3]);
            const startA = parseFloat(startColorMatch[4]);
            
            // End color (crimson)
            const endR = parseInt(endColorMatch[1]);
            const endG = parseInt(endColorMatch[2]);
            const endB = parseInt(endColorMatch[3]);
            const endA = parseFloat(endColorMatch[4]);
            
            // Interpolate RGB values for gradient
            const rStart = Math.round(startR + (endR - startR) * decayT);
            const gStart = Math.round(startG + (endG - startG) * decayT);
            const bStart = Math.round(startB + (endB - startB) * decayT);
            const aStart = startA + (endA - startA) * decayT;
            
            const rEnd = Math.round((startR - 40) + (endR - 40 - (startR - 40)) * decayT);
            const gEnd = Math.round((startG - 40) + (endG - 10 - (startG - 40)) * decayT);
            const bEnd = Math.round((startB - 40) + (endB - 10 - (startB - 40)) * decayT);
            const aEnd = Math.max(0, aStart - 0.1);
            
            gradientStart = `rgba(${rStart}, ${gStart}, ${bStart}, ${aStart - decayT * 0.25})`;
            gradientEnd = `rgba(${rEnd}, ${gEnd}, ${bEnd}, ${aEnd - decayT * 0.25})`;
          } else {
            // Fallback
            gradientStart = helix.colorScheme.decayStart;
            gradientEnd = helix.colorScheme.decayEnd;
          }
        } else {
          // Normal state - colors from scheme
          gradientStart = helix.colorScheme.basepairStart;
          gradientEnd = helix.colorScheme.basepairEnd;
        }
        
        // Enhanced shadow effect for basepairs
        const shadowBlur = helix.state === 'decaying' 
          ? 2 + helix.decayProgress * 3.5
          : 2.5 + formationT * 2;
          
        const shadowColor = helix.state === 'decaying'
          ? helix.colorScheme.decayStart.replace('0.85', `${0.5 + helix.decayProgress * 0.3}`)
          : helix.colorScheme.glowColor;
        
        // Additional transforms based on helix state
        let additionalScale = 1;
        let additionalBlur = 0;
        
        if (helix.state === 'unwinding' && helix.unwindProgress !== undefined) {
          // During unwinding, apply some effects
          additionalBlur = helix.unwindProgress * 1.2;
          additionalScale = 1 - helix.unwindProgress * 0.1;
        } else if (helix.state === 'rewinding' && helix.rewindProgress !== undefined) {
          // During rewinding, apply some effects
          additionalBlur = (1 - helix.rewindProgress) * 1.2;
          additionalScale = 0.9 + helix.rewindProgress * 0.1;
        }
        
        newRods[rodIndex] = {
          ...rod,
          x: centerX,
          y: centerY,
          angle: basePairAngle,
          // Scale from 0 to 1 during formation, with additional state effects
          scale: formationT * additionalScale,
          // Add blur based on movement and state
          blur: (helix.state === 'decaying' ? rod.blur : Math.min(1, Math.sqrt(helix.vx*helix.vx + helix.vy*helix.vy) * 2)) + additionalBlur,
          // Adjust opacity
          opacity: helix.state === 'decaying' 
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
          // Base pair thickness
          thickness: 2.8
        };
        return newRods;
      });
    });
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
    
    // Particle color based on helix state and color scheme
    let particleColor;
    if (helix.state === 'decaying') {
      // Crimson particles during decay
      const alpha = 0.3 + Math.random() * 0.3;
      particleColor = helix.colorScheme.decayStart.replace('0.85', `${alpha}`);
    } else {
      // Use color scheme for particles
      const alpha = 0.2 + Math.random() * 0.25;
      particleColor = helix.colorScheme.particleColor;
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
    
    // Use decay color from scheme
    const decayColorMatch = helix.colorScheme.decayStart.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    
    if (!decayColorMatch) return; // Skip if color parsing fails
    
    // Get decay color components
    const r = parseInt(decayColorMatch[1]);
    const g = parseInt(decayColorMatch[2]);
    const b = parseInt(decayColorMatch[3]);
    
    // Vary intensity and alpha
    const intensity = 0.6 + Math.random() * 0.4;
    const rMod = Math.floor(r * intensity);
    const gMod = Math.floor(g * intensity);
    const bMod = Math.floor(b * intensity);
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
      color: `rgba(${rMod}, ${gMod}, ${bMod}, ${alpha})`,
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
                background: rod.gradient && rod.gradientStart && rod.gradientEnd
                  ? `linear-gradient(${rod.angle * (180/Math.PI)}deg, ${rod.gradientStart}, ${rod.gradientEnd})`
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
                    background: rod.gradientStart || rod.color,
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
                    background: rod.gradientEnd || rod.color,
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
                    background: rod.gradientStart || rod.color,
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
                    background: rod.gradientEnd || rod.color,
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
              background: helix.state === 'decaying' 
                ? `radial-gradient(circle, ${helix.colorScheme.decayStart.replace('0.85', `${0.2 * (1 - helix.decayProgress)}`)}) 0%, transparent 70%)`
                : `radial-gradient(circle, ${helix.colorScheme.glowColor.replace('0.5', `${0.15 * (helix.state === 'forming' ? helix.formationProgress : 1)}`)}) 0%, transparent 70%)`,
              opacity: helix.state === 'decaying' 
                ? 1 - helix.decayProgress 
                : (helix.state === 'forming' ? helix.formationProgress : 1),
              transform: `
                scale(${1 + (helix.state === 'forming' ? helix.formationProgress : 1) * 0.5}) 
                perspective(${helix.perspective || 800}px) 
                rotateX(${helix.rotateX || 0}deg) 
                rotateY(${helix.rotateY || 0}deg)
              `,
              transition: 'all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
              boxShadow: helix.state === 'decaying' 
                ? `0 0 50px ${helix.colorScheme.decayStart.replace('0.85', `${0.1 * (1 - helix.decayProgress)}`)})`
                : `0 0 50px ${helix.colorScheme.glowColor.replace('0.5', `${0.1 * (helix.state === 'forming' ? helix.formationProgress : 1)}`)}`,
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