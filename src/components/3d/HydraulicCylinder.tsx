import React from 'react';
import { useRef } from 'react';
import * as THREE from 'three';

interface HydraulicCylinderProps {
  position: [number, number, number];
  extension: number;   // metres extended
  maxExtension: number;
  pumpActive: boolean;
}

export function HydraulicCylinder({ position, extension, maxExtension, pumpActive }: HydraulicCylinderProps) {
  const cylinderHeight = 1.2;   // body height when retracted
  const pistonRadius = 0.07;
  const bodyRadius = 0.12;

  // Colour of hydraulic fluid indicator
  const fluidColor = pumpActive ? '#ff9500' : '#555';
  const pistonColor = '#b0c4de';

  return (
    <group position={position}>
      {/* Base mounting plate */}
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[0.4, 0.06, 0.4]} />
        <meshStandardMaterial color="#444" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Outer cylinder body */}
      <mesh position={[0, cylinderHeight / 2 + 0.06, 0]} castShadow>
        <cylinderGeometry args={[bodyRadius, bodyRadius, cylinderHeight, 16]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Cylinder top cap */}
      <mesh position={[0, cylinderHeight + 0.09, 0]}>
        <cylinderGeometry args={[bodyRadius + 0.02, bodyRadius + 0.02, 0.06, 16]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Hydraulic port / connection nub */}
      <mesh position={[bodyRadius + 0.04, cylinderHeight * 0.4 + 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.1, 8]} />
        <meshStandardMaterial color={fluidColor} emissive={pumpActive ? '#ff6600' : '#000'} emissiveIntensity={pumpActive ? 0.4 : 0} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Piston rod – extends upward */}
      <mesh position={[0, cylinderHeight + 0.09 + extension / 2, 0]} castShadow>
        <cylinderGeometry args={[pistonRadius, pistonRadius, Math.max(extension, 0.01) + 0.1, 12]} />
        <meshStandardMaterial color={pistonColor} metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Piston head / top bracket */}
      <mesh position={[0, cylinderHeight + 0.09 + extension + 0.06, 0]}>
        <cylinderGeometry args={[bodyRadius - 0.01, bodyRadius - 0.01, 0.1, 16]} />
        <meshStandardMaterial color="#2d6a9f" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Oil pipe – runs from port down to ground */}
      <mesh position={[bodyRadius + 0.04, cylinderHeight * 0.2 + 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.4, 6]} />
        <meshStandardMaterial color={pumpActive ? '#ff9500' : '#333'} emissive={pumpActive ? '#ff6600' : '#000'} emissiveIntensity={pumpActive ? 0.3 : 0} />
      </mesh>
    </group>
  );
}
