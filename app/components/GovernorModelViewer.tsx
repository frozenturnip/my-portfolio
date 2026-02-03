"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, OrbitControls, useGLTF } from "@react-three/drei";

function GovernorModel() {
  const { scene } = useGLTF("/projects/centrifugal-governor/governor-model.glb");

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/projects/centrifugal-governor/governor-model.glb");

export default function GovernorModelViewer() {
  return (
    <div className="w-full h-[360px] md:h-[420px] lg:h-[460px]">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} />
        <directionalLight position={[-4, 2, -4]} intensity={0.5} />
        <pointLight position={[0, 2, 3]} intensity={0.3} />

        <Suspense fallback={null}>
          <Bounds fit clip observe>
            <Center>
              <GovernorModel />
            </Center>
          </Bounds>
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
