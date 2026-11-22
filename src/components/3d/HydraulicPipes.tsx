import React from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HydraulicPipesProps {
  platformElevation: number;
  pumpActive: boolean;
  pumpPosition: [number, number, number];
  cylinderPositions: [number, number, number][];
}

export function HydraulicPipes({ platformElevation, pumpActive, pumpPosition, cylinderPositions }: HydraulicPipesProps) {
  const matRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  useFrame(({ clock }) => {
    if (!pumpActive) {
      matRefs.current.forEach(m => { if (m) m.emissiveIntensity = 0; });
      return;
    }
    const t = clock.getElapsedTime();
    const pulse = 0.25 + Math.sin(t * 5) * 0.15;
    matRefs.current.forEach(m => { if (m) m.emissiveIntensity = pulse; });
  });

  const pipeColor = pumpActive ? '#e07000' : '#333';

  return (
    <group>
      {cylinderPositions.map((cp, i) => {
        const start = new THREE.Vector3(pumpPosition[0], 0.08, pumpPosition[2]);
        const end = new THREE.Vector3(cp[0], 0.08, cp[2]);
        const dir = new THREE.Vector3().subVectors(end, start);
        const len = dir.length();
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        // Rotate so Y-axis cylinder aligns with the XZ direction
        const angle = Math.atan2(dir.x, dir.z);

        return (
          <mesh key={i} position={[mid.x, 0.08, mid.z]} rotation={[Math.PI / 2, 0, angle]}>
            <cylinderGeometry args={[0.025, 0.025, len, 6]} />
            <meshStandardMaterial
              ref={(el) => { matRefs.current[i] = el; }}
              color={pipeColor}
              emissive="#ff6600"
              emissiveIntensity={0}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}
