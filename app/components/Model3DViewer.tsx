"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Color interpolation for stress visualization
function getStressColor(stress: number): THREE.Color {
  // stress: 0 = no stress (blue), 1 = max stress (red)
  // Blue -> Cyan -> Green -> Yellow -> Red
  const clampedStress = Math.max(0, Math.min(1, stress));
  
  if (clampedStress < 0.25) {
    // Blue to Cyan
    const t = clampedStress / 0.25;
    return new THREE.Color(0, t, 1);
  } else if (clampedStress < 0.5) {
    // Cyan to Green
    const t = (clampedStress - 0.25) / 0.25;
    return new THREE.Color(0, 1, 1 - t);
  } else if (clampedStress < 0.75) {
    // Green to Yellow
    const t = (clampedStress - 0.5) / 0.25;
    return new THREE.Color(t, 1, 0);
  } else {
    // Yellow to Red
    const t = (clampedStress - 0.75) / 0.25;
    return new THREE.Color(1, 1 - t, 0);
  }
}

interface BeamProps {
  onForceChange?: (force: number) => void;
  onDraggingChange?: (isDragging: boolean) => void;
}

function DeformableBeam({ onForceChange, onDraggingChange }: BeamProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const [appliedForce, setAppliedForce] = useState(0);
  const [forcePosition, setForcePosition] = useState(0.5); // 0-1 along beam
  const [isDragging, setIsDragging] = useState(false);
  const initialPointerY = useRef<number | null>(null);
  
  // Notify parent when dragging state changes
  const updateDragging = useCallback((dragging: boolean) => {
    setIsDragging(dragging);
    onDraggingChange?.(dragging);
  }, [onDraggingChange]);
  
  // Beam parameters
  const beamLength = 4;
  const beamHeight = 0.3;
  const beamDepth = 0.5;
  const segments = 32;
  // Tensile force limit (max force that can be applied)
  const TENSILE_LIMIT = 0.5;
  
  // Create initial geometry
  const initialPositions = useMemo(() => {
    const geometry = new THREE.BoxGeometry(beamLength, beamHeight, beamDepth, segments, 4, 4);
    return geometry.attributes.position.array.slice();
  }, []);

  // Calculate deformation and stress colors
  const updateBeam = useCallback(() => {
    if (!geometryRef.current) return;
    
    const positions = geometryRef.current.attributes.position;
    const colors = geometryRef.current.attributes.color;
    
    for (let i = 0; i < positions.count; i++) {
      const originalX = initialPositions[i * 3];
      const originalY = initialPositions[i * 3 + 1];
      const originalZ = initialPositions[i * 3 + 2];
      
      // Normalized position along beam (0 to 1)
      const normalizedX = (originalX + beamLength / 2) / beamLength;
      
      // Calculate deflection using cantilever beam formula approximation
      // Fixed at left end (x = 0), force applied at forcePosition
      let deflection = 0;
      let stress = 0;
      
      if (normalizedX <= forcePosition) {
        // Before force application point
        const x = normalizedX;
        const a = forcePosition;
        deflection = appliedForce * x * x * (3 * a - x) / (6 * a * a * a + 0.001);
        // Stress is proportional to second derivative (bending moment)
        stress = Math.abs(appliedForce * (a - x) / (a + 0.001));
      } else {
        // After force application point - continues deflecting
        const x = normalizedX;
        const a = forcePosition;
        deflection = appliedForce * a * a * (3 * x - a) / (6 * a * a * a + 0.001);
        stress = Math.abs(appliedForce * 0.1); // Lower stress after force point
      }
      
      // Apply deflection (scale it down for visual effect)
      const scaledDeflection = deflection * 0.8;
      
      // Vertices at top and bottom of beam deflect differently (shows bending)
      const yFactor = originalY / (beamHeight / 2);
      const stretchFactor = 1 + yFactor * scaledDeflection * 0.1;
      
      positions.setXYZ(
        i,
        originalX * stretchFactor,
        originalY + scaledDeflection * (originalY > 0 ? 0.8 : 1.2),
        originalZ
      );
      
      // Calculate stress color
      // Higher stress at fixed end and at force application point
      const distanceToForce = Math.abs(normalizedX - forcePosition);
      const distanceToFixed = normalizedX;
      const localStress = stress * (1 - distanceToForce * 0.5) * (1 + (1 - distanceToFixed) * 0.3);
      const normalizedStress = Math.min(1, localStress * 2);
      
      const color = getStressColor(normalizedStress);
      colors.setXYZ(i, color.r, color.g, color.b);
    }
    
    positions.needsUpdate = true;
    colors.needsUpdate = true;
    geometryRef.current.computeVertexNormals();
  }, [appliedForce, forcePosition, initialPositions, beamLength, beamHeight]);

  // Only update beam, no spring-back: force is only present while dragging
  useFrame(() => {
    updateBeam();
  });

  // Track global mouse movement while dragging
  const latestForcePosition = useRef(forcePosition);
  latestForcePosition.current = forcePosition;


  // Stable refs for handlers
  const isDraggingRef = useRef(isDragging);
  isDraggingRef.current = isDragging;
  const onForceChangeRef = useRef(onForceChange);
  onForceChangeRef.current = onForceChange;
  const updateDraggingRef = useRef(updateDragging);
  updateDraggingRef.current = updateDragging;

  // Handler refs
  const handleGlobalPointerMoveRef = useRef<(e: PointerEvent) => void>(() => {});
  const handleGlobalPointerUpRef = useRef<() => void>(() => {});

  handleGlobalPointerMoveRef.current = (e: PointerEvent) => {
    if (!isDraggingRef.current || initialPointerY.current === null) return;
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    const camera = (meshRef.current as any)?.parent?.parent?.parent?.camera;
    if (!camera) return;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);
    let deltaY = intersection.y - initialPointerY.current;
    let force = -deltaY * 2;
    force = Math.max(-TENSILE_LIMIT, Math.min(TENSILE_LIMIT, force));
    setAppliedForce(force);
    onForceChangeRef.current?.(Math.abs(force));
  };

  handleGlobalPointerUpRef.current = () => {
    updateDraggingRef.current(false);
    setAppliedForce(0);
    initialPointerY.current = null;
    window.removeEventListener('pointermove', handleGlobalPointerMoveRef.current!);
    window.removeEventListener('pointerup', handleGlobalPointerUpRef.current!);
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    updateDragging(true);
    if (e.point) {
      const normalizedX = (e.point.x + beamLength / 2) / beamLength;
      setForcePosition(Math.max(0.1, Math.min(0.9, normalizedX)));
      initialPointerY.current = e.point.y;
    }
    window.addEventListener('pointermove', handleGlobalPointerMoveRef.current!);
    window.addEventListener('pointerup', handleGlobalPointerUpRef.current!);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    // No-op: handled globally
  };

  const handlePointerUp = () => {
    // No-op: handled globally
  };

  // Create geometry with vertex colors
  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(beamLength, beamHeight, beamDepth, segments, 4, 4);
    
    // Add color attribute
    const colors = new Float32Array(geo.attributes.position.count * 3);
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = 0;     // R
      colors[i + 1] = 0.5; // G
      colors[i + 2] = 1;   // B (start with blue - no stress)
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geo;
  }, []);

  return (
    <group>
      {/* Main deformable beam */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <primitive object={geometry} ref={geometryRef} attach="geometry" />
        <meshStandardMaterial
          vertexColors
          roughness={0.4}
          metalness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Fixed support indicator (left end) */}
      <mesh position={[-beamLength / 2 - 0.15, 0, 0]}>
        <boxGeometry args={[0.2, beamHeight * 2, beamDepth * 1.5]} />
        <meshStandardMaterial color="#374151" roughness={0.8} />
      </mesh>

      {/* Ground/base */}
      <mesh position={[-beamLength / 2 - 0.25, -beamHeight * 1.2, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.4, 0.08, beamDepth * 1.8]} />
        <meshStandardMaterial color="#4b5563" roughness={0.9} />
      </mesh>
      <mesh position={[-beamLength / 2 - 0.35, -beamHeight * 1.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.4, 0.08, beamDepth * 1.8]} />
        <meshStandardMaterial color="#4b5563" roughness={0.9} />
      </mesh>

      {/* Force arrow indicator */}
      {appliedForce !== 0 && (
        <group position={[forcePosition * beamLength - beamLength / 2, beamHeight / 2 + 0.3, 0]}>
          <mesh rotation={[0, 0, appliedForce > 0 ? Math.PI : 0]}>
            <coneGeometry args={[0.1, 0.3, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, appliedForce > 0 ? 0.35 : -0.35, 0]}>
            <cylinderGeometry args={[0.03, 0.03, Math.abs(appliedForce) * 0.5, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Stress legend component
function StressLegend() {
  return (
    <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-1">
      <div className="flex justify-between text-[0.5rem] text-zinc-500">
        <span>Low σ</span>
        <span>High σ</span>
      </div>
      <div 
        className="h-2 rounded-full"
        style={{
          background: 'linear-gradient(to right, #0066ff, #00ffff, #00ff00, #ffff00, #ff0000)'
        }}
      />
    </div>
  );
}

interface Model3DViewerProps {
  className?: string;
}

export default function Model3DViewer({
  className = "",
}: Model3DViewerProps) {
  return (
    <div className={`w-full h-full relative ${className}`}>
      <Canvas
        camera={{ position: [4, 4, 4], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} />
        <pointLight position={[0, 2, 3]} intensity={0.3} />

        {/* Deformable beam */}
        <DeformableBeam />
      </Canvas>
      {/* Stress legend */}
      <StressLegend />
      {/* Instruction hint */}
      <div className="absolute top-8 left-0 right-0 text-center">
        <p className="text-[0.5rem] text-zinc-400">Click & drag beam to apply force</p>
      </div>
    </div>
  );
}
