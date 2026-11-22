import React, { useMemo } from 'react';
import { HydraulicCylinder } from './HydraulicCylinder';
import { HydraulicPump } from './HydraulicPump';
import { HydraulicPipes } from './HydraulicPipes';
import { MoistureSensor } from './MoistureSensor';
import { SimulationState } from '../../types/simulation';

interface HouseModelProps {
  simState: SimulationState;
  transparent: boolean;
}

const CYLINDER_POSITIONS: [number, number, number][] = [
  [-1.6, 0, -1.6],  // FL
  [ 1.6, 0, -1.6],  // FR
  [-1.6, 0,  1.6],  // RL
  [ 1.6, 0,  1.6],  // RR
];

const PUMP_POSITION: [number, number, number] = [-3.5, 0.2, 0];
const BASE_CYLINDER_HEIGHT = 1.38; // matches cylinder body height + mount

export function HouseModel({ simState, transparent }: HouseModelProps) {
  const elev = simState.platformElevation;
  const ext = simState.actuators[0]?.extension ?? 0;
  const housePosY = elev + BASE_CYLINDER_HEIGHT + 0.06;

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#2d5a1b" roughness={0.9} />
      </mesh>

      {/* Road/path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 7]} receiveShadow>
        <planeGeometry args={[4, 10]} />
        <meshStandardMaterial color="#555" roughness={0.9} />
      </mesh>

      {/* Four Hydraulic Cylinders */}
      {CYLINDER_POSITIONS.map((pos, i) => (
        <HydraulicCylinder
          key={i}
          position={pos}
          extension={ext}
          maxExtension={2.0}
          pumpActive={simState.pumpActive}
        />
      ))}

      {/* Hydraulic Pump */}
      <HydraulicPump active={simState.pumpActive} position={PUMP_POSITION} />

      {/* Hydraulic Pipes */}
      <HydraulicPipes
        platformElevation={elev}
        pumpActive={simState.pumpActive}
        pumpPosition={PUMP_POSITION}
        cylinderPositions={CYLINDER_POSITIONS}
      />

      {/* Moisture Sensors */}
      {simState.sensors.map((sensor) => (
        <MoistureSensor key={sensor.id} sensor={sensor} platformElevation={elev} />
      ))}

      {/* Lifting Platform */}
      <group position={[0, BASE_CYLINDER_HEIGHT + 0.06 + elev, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[4.2, 0.2, 4.2]} />
          <meshStandardMaterial color="#3a3a5c" metalness={0.7} roughness={0.3} transparent={transparent} opacity={transparent ? 0.3 : 1} />
        </mesh>
        {/* Reinforcement grid lines */}
        {[-1.5, -0.5, 0.5, 1.5].map((x) => (
          <mesh key={`rx-${x}`} position={[x, 0.11, 0]}>
            <boxGeometry args={[0.04, 0.04, 4.2]} />
            <meshStandardMaterial color="#555" metalness={0.9} />
          </mesh>
        ))}
        {[-1.5, -0.5, 0.5, 1.5].map((z) => (
          <mesh key={`rz-${z}`} position={[0, 0.11, z]}>
            <boxGeometry args={[4.2, 0.04, 0.04]} />
            <meshStandardMaterial color="#555" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* House sits on platform */}
      <HouseStructure posY={housePosY} transparent={transparent} />
    </group>
  );
}

function HouseStructure({ posY, transparent }: { posY: number; transparent: boolean }) {
  const wallOpacity = transparent ? 0.15 : 1;
  const wallTransparent = transparent;

  return (
    <group position={[0, posY, 0]}>
      {/* Foundation / ground floor slab */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.0, 0.15, 4.0]} />
        <meshStandardMaterial color="#c9b99a" roughness={0.8} transparent={wallTransparent} opacity={wallOpacity} />
      </mesh>

      {/* Ground floor walls */}
      {/* Front wall */}
      <mesh position={[0, 1.3, 2.0]} castShadow>
        <boxGeometry args={[4.0, 2.5, 0.2]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.7} transparent={wallTransparent} opacity={wallOpacity} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 1.3, -2.0]} castShadow>
        <boxGeometry args={[4.0, 2.5, 0.2]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.7} transparent={wallTransparent} opacity={wallOpacity} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-2.0, 1.3, 0]} castShadow>
        <boxGeometry args={[0.2, 2.5, 4.0]} />
        <meshStandardMaterial color="#ede8df" roughness={0.7} transparent={wallTransparent} opacity={wallOpacity} />
      </mesh>
      {/* Right wall */}
      <mesh position={[2.0, 1.3, 0]} castShadow>
        <boxGeometry args={[0.2, 2.5, 4.0]} />
        <meshStandardMaterial color="#ede8df" roughness={0.7} transparent={wallTransparent} opacity={wallOpacity} />
      </mesh>

      {/* Ground floor ceiling / 2nd floor slab */}
      <mesh position={[0, 2.57, 0]}>
        <boxGeometry args={[4.0, 0.14, 4.0]} />
        <meshStandardMaterial color="#ddd" roughness={0.6} transparent={wallTransparent} opacity={wallOpacity} />
      </mesh>

      {/* Ground floor front door */}
      <mesh position={[0, 0.95, 2.11]}>
        <boxGeometry args={[0.8, 1.9, 0.05]} />
        <meshStandardMaterial color="#6b4c2a" roughness={0.6} />
      </mesh>

      {/* Ground floor windows – front */}
      <mesh position={[-1.2, 1.4, 2.11]}>
        <boxGeometry args={[0.8, 0.9, 0.05]} />
        <meshStandardMaterial color="#aaddff" metalness={0.3} roughness={0.0} transparent opacity={0.6} />
      </mesh>
      <mesh position={[1.2, 1.4, 2.11]}>
        <boxGeometry args={[0.8, 0.9, 0.05]} />
        <meshStandardMaterial color="#aaddff" metalness={0.3} roughness={0.0} transparent opacity={0.6} />
      </mesh>

      {/* Ground floor windows – back */}
      <mesh position={[-1.0, 1.4, -2.11]}>
        <boxGeometry args={[0.7, 0.8, 0.05]} />
        <meshStandardMaterial color="#aaddff" metalness={0.3} roughness={0.0} transparent opacity={0.6} />
      </mesh>
      <mesh position={[1.0, 1.4, -2.11]}>
        <boxGeometry args={[0.7, 0.8, 0.05]} />
        <meshStandardMaterial color="#aaddff" metalness={0.3} roughness={0.0} transparent opacity={0.6} />
      </mesh>

      {/* 2nd floor walls */}
      <mesh position={[0, 3.8, 1.9]} castShadow>
        <boxGeometry args={[3.8, 2.3, 0.2]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.7} transparent={wallTransparent} opacity={wallOpacity} />
      </mesh>
      <mesh position={[0, 3.8, -1.9]} castShadow>
        <boxGeometry args={[3.8, 2.3, 0.2]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.7} transparent={wallTransparent} opacity={wallOpacity} />
      </mesh>
      <mesh position={[-1.9, 3.8, 0]} castShadow>
        <boxGeometry args={[0.2, 2.3, 3.8]} />
        <meshStandardMaterial color="#ddd8cc" roughness={0.7} transparent={wallTransparent} opacity={wallOpacity} />
      </mesh>
      <mesh position={[1.9, 3.8, 0]} castShadow>
        <boxGeometry args={[0.2, 2.3, 3.8]} />
        <meshStandardMaterial color="#ddd8cc" roughness={0.7} transparent={wallTransparent} opacity={wallOpacity} />
      </mesh>

      {/* 2nd floor windows */}
      <mesh position={[-0.9, 4.0, 2.01]}>
        <boxGeometry args={[0.7, 0.8, 0.05]} />
        <meshStandardMaterial color="#aaddff" transparent opacity={0.65} roughness={0.0} metalness={0.2} />
      </mesh>
      <mesh position={[0.9, 4.0, 2.01]}>
        <boxGeometry args={[0.7, 0.8, 0.05]} />
        <meshStandardMaterial color="#aaddff" transparent opacity={0.65} roughness={0.0} metalness={0.2} />
      </mesh>

      {/* Balcony slab – front 2nd floor */}
      <mesh position={[0, 2.65, 2.4]}>
        <boxGeometry args={[2.0, 0.08, 0.6]} />
        <meshStandardMaterial color="#aaa" roughness={0.6} />
      </mesh>
      {/* Balcony rail posts */}
      {[-0.9, 0, 0.9].map((x) => (
        <mesh key={x} position={[x, 2.95, 2.68]}>
          <boxGeometry args={[0.04, 0.6, 0.04]} />
          <meshStandardMaterial color="#888" metalness={0.7} />
        </mesh>
      ))}
      {/* Balcony rail top */}
      <mesh position={[0, 3.22, 2.68]}>
        <boxGeometry args={[2.0, 0.04, 0.04]} />
        <meshStandardMaterial color="#888" metalness={0.7} />
      </mesh>

      {/* Pitched roof */}
      <Roof />

      {/* Chimney */}
      <mesh position={[0.8, 5.3, -0.5]} castShadow>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Roof() {
  // Create a pitched roof using two angled panels
  const leftRoofRef = React.useRef(null);
  return (
    <group position={[0, 4.95, 0]}>
      {/* Left slope */}
      <mesh rotation={[0, 0, Math.PI / 6]} position={[-1.1, 0.4, 0]} castShadow>
        <boxGeometry args={[2.4, 0.15, 4.4]} />
        <meshStandardMaterial color="#8b2500" roughness={0.7} />
      </mesh>
      {/* Right slope */}
      <mesh rotation={[0, 0, -Math.PI / 6]} position={[1.1, 0.4, 0]} castShadow>
        <boxGeometry args={[2.4, 0.15, 4.4]} />
        <meshStandardMaterial color="#8b2500" roughness={0.7} />
      </mesh>
      {/* Ridge cap */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.2, 0.15, 4.4]} />
        <meshStandardMaterial color="#6b1a00" roughness={0.6} />
      </mesh>
      {/* Front gable */}
      <mesh position={[0, 0.5, 2.2]}>
        <cylinderGeometry args={[0.0, 2.3, 1.1, 3]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.7} />
      </mesh>
      {/* Back gable */}
      <mesh position={[0, 0.5, -2.2]}>
        <cylinderGeometry args={[0.0, 2.3, 1.1, 3]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.7} />
      </mesh>
    </group>
  );
}
