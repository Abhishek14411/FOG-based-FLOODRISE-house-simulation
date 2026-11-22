import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HydraulicPumpProps {
  active: boolean;
  position: [number, number, number];
}

export function HydraulicPump({ active, position }: HydraulicPumpProps) {
  const pumpRef = useRef<THREE.Group>(null);
  const impellerRef = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (impellerRef.current && active) {
      impellerRef.current.rotation.y += dt * 8;
    }
  });

  return (
    <group ref={pumpRef} position={position}>
      {/* Pump body */}
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.35, 0.35]} />
        <meshStandardMaterial color="#1b4f72" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Motor housing */}
      <mesh position={[0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.14, 0.14, 0.3, 12]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Impeller indicator */}
      <mesh ref={impellerRef} position={[0.52, 0, 0]}>
        <torusGeometry args={[0.08, 0.02, 6, 12]} />
        <meshStandardMaterial color={active ? '#ff9500' : '#555'} emissive={active ? '#ff6600' : '#000'} emissiveIntensity={active ? 0.5 : 0} />
      </mesh>
      {/* Reservoir */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.4, 0.2, 0.3]} />
        <meshStandardMaterial color="#0d2137" metalness={0.7} roughness={0.3} transparent opacity={0.85} />
      </mesh>
      {/* Oil level in reservoir */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.38, 0.17, 0.28]} />
        <meshStandardMaterial color={active ? '#c27600' : '#8b4513'} transparent opacity={0.7} roughness={0.5} />
      </mesh>
      {/* Status LED */}
      <mesh position={[0, 0.2, 0.18]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={active ? '#00ff44' : '#ff4444'} emissive={active ? '#00ff44' : '#ff4444'} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}
