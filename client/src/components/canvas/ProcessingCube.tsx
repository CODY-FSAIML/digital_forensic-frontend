import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Wireframe } from "@react-three/drei";
import * as THREE from "three";
import { CanvasErrorBoundary } from "./ErrorBoundary";

function HologramCube() {
  const group = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerGeomRef = useRef<THREE.BufferGeometry | null>(null);
  const outerMatRef = useRef<THREE.Material | null>(null);
  const innerGeomRef = useRef<THREE.BufferGeometry | null>(null);
  const innerMatRef = useRef<THREE.Material | null>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (group.current) {
      group.current.rotation.y = time * 0.5;
      group.current.rotation.x = Math.sin(time * 0.5) * 0.5;
    }
    
    if (outerRef.current) {
      outerRef.current.rotation.x = time * 0.2;
      outerRef.current.rotation.z = time * 0.3;
    }
    
    if (innerRef.current) {
      innerRef.current.rotation.y = -time * 0.8;
      innerRef.current.rotation.z = time * 0.5;
      const scale = 1 + Math.sin(time * 3) * 0.1;
      innerRef.current.scale.set(scale, scale, scale);
    }
  });

  useEffect(() => {
    return () => {
      try {
        if (outerGeomRef.current) outerGeomRef.current.dispose();
        if (outerMatRef.current) (outerMatRef.current as any).dispose();
        if (innerGeomRef.current) innerGeomRef.current.dispose();
        if (innerMatRef.current) (innerMatRef.current as any).dispose();
      } catch (e) { /* ignore */ }
    };
  }, []);

  return (
    <group ref={group}>
      {/* Outer Cage */}
      <mesh ref={outerRef}>
        <icosahedronGeometry ref={outerGeomRef as any} args={[2, 0]} />
        <meshBasicMaterial ref={outerMatRef as any} color="#22d3ee" wireframe transparent opacity={0.3} />
        <Wireframe stroke={"#22d3ee"} thickness={0.05} />
      </mesh>
      
      {/* Inner Core */}
      <mesh ref={innerRef}>
        <octahedronGeometry ref={innerGeomRef as any} args={[1, 0]} />
        <meshStandardMaterial
          ref={innerMatRef as any}
          color="#020617"
          emissive="#22d3ee"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Glow effect */}
      <pointLight color="#22d3ee" intensity={2} distance={5} />
    </group>
  );
}

export default function ProcessingCube() {
  return (
    <div className="w-full h-[300px] flex flex-col items-center justify-center relative">
      <div className="absolute inset-0">
        <CanvasErrorBoundary>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ powerPreference: "high-performance", antialias: false, precision: "mediump" }}
            onCreated={(state) => {
              const gl = state.gl;
              const dom = gl.domElement as HTMLCanvasElement;

              function onLost(e: Event) {
                try { (e as Event).preventDefault(); } catch (err) {}
                console.warn("WebGL context lost");
              }

              function onRestored() {
                console.warn("WebGL context restored, re-rendering scene");
                try { state.invalidate(); } catch (err) {}
              }

              dom.addEventListener("webglcontextlost", onLost, false);
              dom.addEventListener("webglcontextrestored", onRestored, false);
            }}
          >
              <ambientLight intensity={0.5} />
              <HologramCube />
            </Canvas>
        </CanvasErrorBoundary>
      </div>
      
      <div className="z-10 mt-48 text-center">
        <div className="font-display text-[#22d3ee] tracking-[0.3em] uppercase text-xl animate-pulse">
          Processing
        </div>
        <div className="text-xs font-mono text-[#22d3ee]/60 mt-2 flex items-center justify-center gap-2">
          <span>GTX 1650 NEURAL ENGINE ACTIVE</span>
          <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-ping" />
        </div>
      </div>
    </div>
  );
}
