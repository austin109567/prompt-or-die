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

// Geometric shapes we'll form
const geometricShapes = [
  { name: 'triangle', sides: 3 },
  { name: 'square', sides: 4 },
  { name: 'pentagon', sides: 5 },
  { name: 'hexagon', sides: 6 },
  { name: 'octagon', sides: 8 }
];

interface LineSegment {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  vx: number;
  vy: number;
  angle: number;
  vAngle: number;
  length: number;
  color: string;
  opacity: number;
  inShape: boolean;
  shapeId?: string;
}

interface GeometricShape {
  id: string;
  segments: string[];
  centerX: number;
  centerY: number;
  vx: number;
  vy: number;
  rotation: number;
  vRotation: number;
  type: string;
  size: number;
  inMolecule: boolean;
  moleculeId?: string;
}

interface Molecule {
  id: string;
  shapes: string[];
  centerX: number;
  centerY: number;
  vx: number;
  vy: number;
  rotation: number;
  vRotation: number;
  size: number;
  age: number;
  fading: boolean;
}

const AnimatedLandingPage = () => {
  const { theme } = useTheme();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [lineSegments, setLineSegments] = useState<LineSegment[]>([]);
  const [shapes, setShapes] = useState<{[key: string]: GeometricShape}>({});
  const [molecules, setMolecules] = useState<{[key: string]: Molecule}>({});
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

  // Initialize line segments after dimensions are set
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    // Generate random line segments
    const initialSegments: LineSegment[] = Array.from({ length: 80 }).map((_, i) => {
      const centerX = Math.random() * dimensions.width;
      const centerY = Math.random() * dimensions.height;
      const angle = Math.random() * Math.PI * 2;
      const length = 15 + Math.random() * 20;
      
      return {
        id: `segment-${i}`,
        startX: centerX - (Math.cos(angle) * length/2),
        startY: centerY - (Math.sin(angle) * length/2),
        endX: centerX + (Math.cos(angle) * length/2),
        endY: centerY + (Math.sin(angle) * length/2),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        angle: angle,
        vAngle: (Math.random() - 0.5) * 0.02,
        length: length,
        color: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
        opacity: 0.6 + Math.random() * 0.4,
        inShape: false
      };
    });

    setLineSegments(initialSegments);
  }, [dimensions, theme]);

  // Animation loop
  useEffect(() => {
    if (lineSegments.length === 0 || !canvasRef.current) return;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Update line segments
      setLineSegments(prevSegments => {
        return prevSegments.map(segment => {
          if (segment.inShape) return segment;
          
          // Move the line segment
          let newStartX = segment.startX + segment.vx * (deltaTime / 16);
          let newStartY = segment.startY + segment.vy * (deltaTime / 16);
          let newEndX = segment.endX + segment.vx * (deltaTime / 16);
          let newEndY = segment.endY + segment.vy * (deltaTime / 16);
          
          // Rotate the line segment around its center
          const centerX = (newStartX + newEndX) / 2;
          const centerY = (newStartY + newEndY) / 2;
          const newAngle = segment.angle + segment.vAngle * (deltaTime / 16);
          
          newStartX = centerX - Math.cos(newAngle) * segment.length/2;
          newStartY = centerY - Math.sin(newAngle) * segment.length/2;
          newEndX = centerX + Math.cos(newAngle) * segment.length/2;
          newEndY = centerY + Math.sin(newAngle) * segment.length/2;
          
          // Bounce off walls
          let newVx = segment.vx;
          let newVy = segment.vy;
          
          if (newStartX < 0 || newEndX < 0) {
            newVx = Math.abs(segment.vx);
          } else if (newStartX > dimensions.width || newEndX > dimensions.width) {
            newVx = -Math.abs(segment.vx);
          }
          
          if (newStartY < 0 || newEndY < 0) {
            newVy = Math.abs(segment.vy);
          } else if (newStartY > dimensions.height || newEndY > dimensions.height) {
            newVy = -Math.abs(segment.vy);
          }
          
          // Slight random movement
          if (Math.random() < 0.02) {
            newVx += (Math.random() - 0.5) * 0.05;
            newVy += (Math.random() - 0.5) * 0.05;
            
            // Limit speed
            const speed = Math.sqrt(newVx * newVx + newVy * newVy);
            if (speed > 0.8) {
              newVx = (newVx / speed) * 0.8;
              newVy = (newVy / speed) * 0.8;
            }
          }
          
          return {
            ...segment,
            startX: newStartX,
            startY: newStartY,
            endX: newEndX,
            endY: newEndY,
            vx: newVx,
            vy: newVy,
            angle: newAngle
          };
        });
      });

      // Try to form geometric shapes
      if (Math.random() < 0.01) {
        formGeometricShape();
      }
      
      // Update existing shapes
      updateShapes(deltaTime);
      
      // Try to form molecules
      if (Math.random() < 0.01 && Object.keys(shapes).length >= 2) {
        formMolecule();
      }
      
      // Update existing molecules
      updateMolecules(deltaTime);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [lineSegments, dimensions, shapes, molecules]);
  
  // Function to form geometric shapes from line segments
  const formGeometricShape = () => {
    // Find free line segments
    const freeSegments = lineSegments.filter(segment => !segment.inShape);
    
    if (freeSegments.length < 3) return; // Need at least 3 segments for a triangle
    
    // Choose a random shape type
    const shapeType = geometricShapes[Math.floor(Math.random() * geometricShapes.length)];
    
    if (freeSegments.length < shapeType.sides) return;
    
    // Choose random position for shape center
    const centerX = Math.random() * (dimensions.width * 0.8) + (dimensions.width * 0.1);
    const centerY = Math.random() * (dimensions.height * 0.8) + (dimensions.height * 0.1);
    
    // Choose random segments
    const selectedSegmentIds = freeSegments
      .sort(() => Math.random() - 0.5)
      .slice(0, shapeType.sides)
      .map(segment => segment.id);
    
    // Create a new shape
    const shapeId = `shape-${Date.now()}-${Math.random()}`;
    const newShape: GeometricShape = {
      id: shapeId,
      segments: selectedSegmentIds,
      centerX,
      centerY,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      rotation: Math.random() * Math.PI * 2,
      vRotation: (Math.random() - 0.5) * 0.02,
      type: shapeType.name,
      size: shapeType.sides * 15, // Base size on number of sides
      inMolecule: false
    };
    
    // Update the segments to be part of the shape
    setLineSegments(prevSegments => {
      return prevSegments.map(segment => {
        if (selectedSegmentIds.includes(segment.id)) {
          return {
            ...segment,
            inShape: true,
            shapeId,
            color: 'rgba(255, 255, 255, 0.8)'
          };
        }
        return segment;
      });
    });
    
    // Add the new shape
    setShapes(prevShapes => ({
      ...prevShapes,
      [shapeId]: newShape
    }));
  };
  
  // Update existing shapes (movement, rotation)
  const updateShapes = (deltaTime: number) => {
    const updatedShapes = {...shapes};
    
    Object.keys(updatedShapes).forEach(shapeId => {
      const shape = updatedShapes[shapeId];
      
      // Skip shapes that are part of molecules
      if (shape.inMolecule) return;
      
      // Update position
      shape.centerX += shape.vx * (deltaTime / 16);
      shape.centerY += shape.vy * (deltaTime / 16);
      
      // Bounce off walls
      if (shape.centerX < shape.size || shape.centerX > dimensions.width - shape.size) {
        shape.vx = -shape.vx;
      }
      if (shape.centerY < shape.size || shape.centerY > dimensions.height - shape.size) {
        shape.vy = -shape.vy;
      }
      
      // Update rotation
      shape.rotation += shape.vRotation * (deltaTime / 16);
      
      // Position the segments around the center to form the shape
      const angleStep = (Math.PI * 2) / shape.segments.length;
      
      shape.segments.forEach((segmentId, index) => {
        const segmentIndex = lineSegments.findIndex(s => s.id === segmentId);
        if (segmentIndex !== -1) {
          const angle = shape.rotation + (index * angleStep);
          const radius = shape.size / 2;
          
          const segment = lineSegments[segmentIndex];
          const segmentLength = segment.length;
          
          // Calculate new position for the segment
          const segmentCenterX = shape.centerX + Math.cos(angle) * radius;
          const segmentCenterY = shape.centerY + Math.sin(angle) * radius;
          
          // Position the segment tangentially to the shape
          const segmentAngle = angle + Math.PI/2; // Tangential to the radius
          
          const newSegment = {
            ...segment,
            startX: segmentCenterX - Math.cos(segmentAngle) * segmentLength/2,
            startY: segmentCenterY - Math.sin(segmentAngle) * segmentLength/2,
            endX: segmentCenterX + Math.cos(segmentAngle) * segmentLength/2,
            endY: segmentCenterY + Math.sin(segmentAngle) * segmentLength/2,
            angle: segmentAngle
          };
          
          // Update the segment in the lineSegments array
          setLineSegments(prev => {
            const newSegments = [...prev];
            newSegments[segmentIndex] = newSegment;
            return newSegments;
          });
        }
      });
    });
    
    setShapes(updatedShapes);
  };
  
  // Form molecules from shapes
  const formMolecule = () => {
    // Find free shapes
    const freeShapes = Object.values(shapes).filter(shape => !shape.inMolecule);
    
    if (freeShapes.length < 2) return; // Need at least 2 shapes
    
    // Choose 2-3 random shapes
    const numShapes = Math.min(2 + Math.floor(Math.random() * 2), freeShapes.length);
    const selectedShapes = freeShapes
      .sort(() => Math.random() - 0.5)
      .slice(0, numShapes);
    
    // Calculate center position (average of selected shapes)
    const centerX = selectedShapes.reduce((sum, shape) => sum + shape.centerX, 0) / selectedShapes.length;
    const centerY = selectedShapes.reduce((sum, shape) => sum + shape.centerY, 0) / selectedShapes.length;
    
    // Calculate size based on component shapes
    const size = selectedShapes.reduce((sum, shape) => sum + shape.size, 0) * 0.8;
    
    // Create a new molecule
    const moleculeId = `molecule-${Date.now()}-${Math.random()}`;
    const newMolecule: Molecule = {
      id: moleculeId,
      shapes: selectedShapes.map(shape => shape.id),
      centerX,
      centerY,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      rotation: Math.random() * Math.PI * 2,
      vRotation: (Math.random() - 0.5) * 0.01,
      size,
      age: 0,
      fading: false
    };
    
    // Update the shapes to be part of the molecule
    const updatedShapes = {...shapes};
    selectedShapes.forEach(shape => {
      if (updatedShapes[shape.id]) {
        updatedShapes[shape.id].inMolecule = true;
        updatedShapes[shape.id].moleculeId = moleculeId;
      }
    });
    
    // Update line segments color for shapes in the molecule
    setLineSegments(prev => {
      return prev.map(segment => {
        const shapeId = segment.shapeId;
        if (shapeId && selectedShapes.some(shape => shape.id === shapeId)) {
          return {
            ...segment,
            color: 'rgba(200, 200, 255, 0.9)' // Slightly blue for molecules
          };
        }
        return segment;
      });
    });
    
    setShapes(updatedShapes);
    
    // Add the new molecule
    setMolecules(prevMolecules => ({
      ...prevMolecules,
      [moleculeId]: newMolecule
    }));
  };
  
  // Update existing molecules
  const updateMolecules = (deltaTime: number) => {
    const updatedMolecules = {...molecules};
    let moleculesChanged = false;
    
    Object.keys(updatedMolecules).forEach(moleculeId => {
      const molecule = updatedMolecules[moleculeId];
      
      // Update age
      molecule.age += deltaTime / 1000; // Convert to seconds
      
      // Check if molecule should start fading (after 5 seconds)
      if (!molecule.fading && molecule.age > 5) {
        molecule.fading = true;
        
        // Change color of line segments to red
        setLineSegments(prev => {
          return prev.map(segment => {
            const shapeId = segment.shapeId;
            if (shapeId && molecule.shapes.includes(shapeId)) {
              return {
                ...segment,
                color: 'rgba(139, 0, 0, 0.9)' // Deep crimson red
              };
            }
            return segment;
          });
        });
      }
      
      // Remove molecule if it's been fading for more than 3 seconds
      if (molecule.fading && molecule.age > 8) {
        // Release shapes from the molecule
        molecule.shapes.forEach(shapeId => {
          if (shapes[shapeId]) {
            // Release line segments from shapes
            setLineSegments(prev => {
              return prev.map(segment => {
                if (segment.shapeId === shapeId) {
                  // Reset segment to free floating
                  const centerX = (segment.startX + segment.endX) / 2;
                  const centerY = (segment.startY + segment.endY) / 2;
                  const length = segment.length;
                  const angle = Math.random() * Math.PI * 2;
                  
                  return {
                    ...segment,
                    startX: centerX - Math.cos(angle) * length/2,
                    startY: centerY - Math.sin(angle) * length/2,
                    endX: centerX + Math.cos(angle) * length/2,
                    endY: centerY + Math.sin(angle) * length/2,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    angle: angle,
                    vAngle: (Math.random() - 0.5) * 0.02,
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                    opacity: 0.6 + Math.random() * 0.4,
                    inShape: false,
                    shapeId: undefined
                  };
                }
                return segment;
              });
            });
            
            // Also update the shapes state to remove the shapes
            setShapes(prevShapes => {
              const updated = {...prevShapes};
              delete updated[shapeId];
              return updated;
            });
          }
        });
        
        // Delete the molecule
        delete updatedMolecules[moleculeId];
        moleculesChanged = true;
        return;
      }
      
      // Update position
      molecule.centerX += molecule.vx * (deltaTime / 16);
      molecule.centerY += molecule.vy * (deltaTime / 16);
      
      // Bounce off walls
      if (molecule.centerX < molecule.size || molecule.centerX > dimensions.width - molecule.size) {
        molecule.vx = -molecule.vx;
      }
      if (molecule.centerY < molecule.size || molecule.centerY > dimensions.height - molecule.size) {
        molecule.vy = -molecule.vy;
      }
      
      // Update rotation
      molecule.rotation += molecule.vRotation * (deltaTime / 16);
      
      // Position the shapes around the center
      const angleStep = (Math.PI * 2) / molecule.shapes.length;
      
      molecule.shapes.forEach((shapeId, index) => {
        if (shapes[shapeId]) {
          const shape = shapes[shapeId];
          const angle = molecule.rotation + (index * angleStep);
          const radius = molecule.size / 2;
          
          // Position the shape
          const shapeX = molecule.centerX + Math.cos(angle) * radius;
          const shapeY = molecule.centerY + Math.sin(angle) * radius;
          
          // Update the shape position in the shapes state
          setShapes(prevShapes => {
            const updated = {...prevShapes};
            if (updated[shapeId]) {
              updated[shapeId] = {
                ...updated[shapeId],
                centerX: shapeX,
                centerY: shapeY,
                rotation: angle + Math.PI/2 // Rotate shapes to face outward
              };
            }
            return updated;
          });
        }
      });
    });
    
    if (moleculesChanged) {
      setMolecules(updatedMolecules);
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
      {/* Canvas for line segments and shapes */}
      <div 
        ref={canvasRef} 
        className="absolute inset-0 overflow-hidden"
      >
        {lineSegments.map(segment => (
          <motion.div
            key={segment.id}
            className="absolute"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
            animate={{
              x: 0,
              y: 0,
              transition: { duration: 0.1, ease: 'linear' }
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                width: `${Math.sqrt(Math.pow(segment.endX - segment.startX, 2) + Math.pow(segment.endY - segment.startY, 2))}px`,
                height: '1.5px',
                backgroundColor: segment.color,
                opacity: segment.opacity,
                transformOrigin: '0 0',
                left: segment.startX,
                top: segment.startY,
                transform: `rotate(${Math.atan2(segment.endY - segment.startY, segment.endX - segment.startX)}rad)`,
              }}
            />
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