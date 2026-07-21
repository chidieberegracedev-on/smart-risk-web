"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Environment, Lightformer, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// ── Aegis orb: a dark liquid-metal distorted sphere, lit with blue/green
// rim light so it reads as a premium "protective" object. Sits inside a
// drifting particle constellation. All code-built, no external assets.

function Orb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.12;
    ref.current.rotation.z = Math.sin(t * 0.15) * 0.08;
  });
  return (
    <mesh ref={ref} scale={1.55}>
      <icosahedronGeometry args={[1, 48]} />
      <MeshDistortMaterial
        color="#0b0b12"
        envMapIntensity={1.15}
        metalness={0.98}
        roughness={0.22}
        distort={0.32}
        speed={1.35}
      />
    </mesh>
  );
}

// A soft inner halo that glows through/behind the orb.
function Halo() {
  return (
    <mesh position={[0, 0, -0.6]} scale={2.6}>
      <circleGeometry args={[1, 48]} />
      <meshBasicMaterial
        color="#5B8CFF"
        transparent
        opacity={0.14}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function Constellation({ count = 1300 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a spherical shell around the orb
      const r = 2.6 + Math.random() * 3.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.03;
    ref.current.rotation.x = Math.sin(t * 0.05) * 0.06;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        color="#7ea2ff"
        size={0.022}
        sizeAttenuation
        depthWrite={false}
        opacity={0.85}
      />
    </points>
  );
}

// Gentle camera parallax toward the pointer — physical, not gimmicky.
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.x * 0.28,
      0.04
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -pointer.y * 0.18,
      0.04
    );
  });
  return <group ref={group}>{children}</group>;
}

export default function AegisScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5], fov: 42 }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 2, 4]} intensity={40} color="#5B8CFF" />
      <pointLight position={[-4, -2, 2]} intensity={22} color="#3FB97F" />
      <pointLight position={[0, 4, -3]} intensity={30} color="#ffffff" />

      <Rig>
        <Halo />
        <Orb />
        <Constellation />
      </Rig>

      {/* Local light probes for metallic reflections — no remote HDR fetch. */}
      <Environment resolution={64}>
        <Lightformer form="rect" intensity={2.2} position={[2, 2, 3]} scale={5} color="#5B8CFF" />
        <Lightformer form="rect" intensity={1.3} position={[-3, -1, 2]} scale={5} color="#3FB97F" />
        <Lightformer form="circle" intensity={1.8} position={[0, 3, -2]} scale={3} color="#ffffff" />
      </Environment>
    </Canvas>
  );
}
