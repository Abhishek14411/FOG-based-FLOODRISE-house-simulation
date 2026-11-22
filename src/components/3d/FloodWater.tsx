import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloodWaterProps {
  floodDepth: number;
}

export function FloodWater({ floodDepth }: FloodWaterProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Animated water surface using time
  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Subtle color pulse to simulate water movement
      const t = clock.getElapsedTime();
      materialRef.current.opacity = 0.65 + Math.sin(t * 1.5) * 0.05;
    }
    if (meshRef.current) {
      // Water plane sits at floodDepth height
      meshRef.current.position.y = floodDepth > 0 ? floodDepth * 0.5 : -10;
    }
  });

  const waterVisible = floodDepth > 0.01;

  return (
    <group>
      {/* Main water volume */}
      <mesh ref={meshRef} position={[0, floodDepth * 0.5, 0]} receiveShadow>
        <boxGeometry args={[30, Math.max(floodDepth, 0.02), 30]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#1a6fa8"
          transparent
          opacity={0.65}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {/* Animated water surface plane */}
      {waterVisible && (
        <WaterSurface depth={floodDepth} />
      )}

      {/* Water level indicator pole */}
      <WaterLevelIndicator floodDepth={floodDepth} />
    </group>
  );
}

function WaterSurface({ depth }: { depth: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    // Simple wave – displace y slightly
    meshRef.current.position.y = depth + Math.sin(t * 2) * 0.015;
    // Rotate uv to simulate flow
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    if (mat.map) {
      mat.map.offset.x = (t * 0.02) % 1;
      mat.map.offset.y = (t * 0.015) % 1;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, depth, 0]}>
      <planeGeometry args={[30, 30, 32, 32]} />
      <meshStandardMaterial
        color="#2196f3"
        transparent
        opacity={0.5}
        roughness={0.05}
        metalness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function WaterLevelIndicator({ floodDepth }: { floodDepth: number }) {
  const poleRef = useRef<THREE.Mesh>(null);

  return (
    <group position={[5, 0, 5]}>
      {/* Pole */}
      <mesh>
        <cylinderGeometry args={[0.04, 0.04, 4, 8]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Water level marker */}
      <mesh position={[0, floodDepth, 0]}>
        <boxGeometry args={[0.3, 0.05, 0.05]} />
        <meshStandardMaterial color={floodDepth > 1.5 ? '#ff4444' : floodDepth > 0.5 ? '#ff8c00' : '#44ff88'} emissive={floodDepth > 1.5 ? '#ff0000' : '#000'} emissiveIntensity={0.3} />
      </mesh>
      {/* Label markings at 0.5m intervals */}
      {[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0].map((h) => (
        <mesh key={h} position={[0.2, h, 0]}>
          <boxGeometry args={[0.15, 0.02, 0.02]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
      ))}
    </group>
  );
}
