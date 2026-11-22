import React from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SensorData } from '../../types/simulation';

interface MoistureSensorProps {
  sensor: SensorData;
  platformElevation: number;
}

export function MoistureSensor({ sensor, platformElevation }: MoistureSensorProps) {
  const lightRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (lightRef.current && sensor.wet) {
      const t = clock.getElapsedTime();
      const mat = lightRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(t * 4) * 0.3;
    }
  });

  const color = sensor.wet
    ? (sensor.warning ? '#ff8c00' : '#ff3333')
    : '#00ff44';

  const [x, , z] = sensor.position;

  return (
    <group position={[x, 0, z]}>
      {/* Sensor stake */}
      <mesh>
        <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
        <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Sensor body */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.06]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Status LED */}
      <mesh ref={lightRef} position={[0, 0.32, 0.04]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={sensor.wet ? 0.8 : 0.4}
        />
      </mesh>

      {/* Label plate */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.08, 0.04, 0.02]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
    </group>
  );
}
