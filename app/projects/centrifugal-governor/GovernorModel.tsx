"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Suspense, useEffect } from "react";

// Suppress texture loading errors - we're overriding materials anyway
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || "";
    // Suppress GLTFLoader texture loading errors
    if (message.includes("GLTFLoader") && message.includes("Couldn't load texture")) {
      return;
    }
    originalError.apply(console, args);
  };
}

function Model() {
  const { scene } = useGLTF("/projects/AME408Governor.glb");
  
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as any).isMesh) {
        const mesh = child as any;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat: any) => {
              // Disable texture maps to avoid loading errors
              if (mat.map) mat.map = null;
              if (mat.normalMap) mat.normalMap = null;
              if (mat.roughnessMap) mat.roughnessMap = null;
              if (mat.metalnessMap) mat.metalnessMap = null;
              mat.color.set(0.7, 0.7, 0.7); // Light grey color
            });
          } else {
            // Disable texture maps to avoid loading errors
            if (mesh.material.map) mesh.material.map = null;
            if (mesh.material.normalMap) mesh.material.normalMap = null;
            if (mesh.material.roughnessMap) mesh.material.roughnessMap = null;
            if (mesh.material.metalnessMap) mesh.material.metalnessMap = null;
            mesh.material.color.set(0.7, 0.7, 0.7); // Light grey color
          }
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={40} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} />;
}

export default function GovernorModel() {
  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-xl border border-sage/40 dark:border-darkaccent/30 overflow-hidden bg-linear-to-br from-sage/10 to-sage/5 dark:from-darkaccent/10 dark:to-darkaccent/5">
      <Canvas camera={{ position: [2, 0.5, 2], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <directionalLight position={[-10, -10, -5]} intensity={0.2} />
          <Model />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/projects/AME408Governor.glb");
