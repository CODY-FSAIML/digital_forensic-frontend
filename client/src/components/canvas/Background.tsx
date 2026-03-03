import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { CanvasErrorBoundary } from "./ErrorBoundary";

function ParticleField() {
  const count = 2000;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    // Make light follow mouse
    if (light.current) {
      light.current.position.x = (state.pointer.x * state.viewport.width) / 2;
      light.current.position.y = (state.pointer.y * state.viewport.height) / 2;
    }

    // Move particles
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      // Mouse interaction
      particle.mx += (state.pointer.x * 10 - particle.mx) * 0.01;
      particle.my += (state.pointer.y * 10 - particle.my) * 0.01;
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      if (mesh.current) {
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
    });
    
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <pointLight ref={light} distance={40} intensity={8} color="#22d3ee" />
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshPhongMaterial color="#020617" emissive="#0ea5e9" emissiveIntensity={0.5} />
      </instancedMesh>
    </>
  );
}

function GridBackground() {
  return (
    <gridHelper args={[100, 100, '#22d3ee', '#020617']} position={[0, -10, 0]} />
  );
}

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020617] overflow-hidden pointer-events-none">
      <CanvasErrorBoundary fallback={<div className="absolute inset-0 bg-[#020617] opacity-80" />}>
        <Canvas camera={{ position: [0, 0, 15], fov: 75 }} gl={{ powerPreference: "low-power" }}>
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.5} />
          <ParticleField />
          <GridBackground />
          <fog attach="fog" args={['#020617', 10, 40]} />
        </Canvas>
      </CanvasErrorBoundary>
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)] opacity-70 z-0" />
    </div>
  );
}
