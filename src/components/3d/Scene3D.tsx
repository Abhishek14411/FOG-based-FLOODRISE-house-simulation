import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, Sky, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { HouseModel } from './HouseModel';
import { FloodWater } from './FloodWater';
import { SimulationState } from '../../types/simulation';

interface Scene3DProps {
  simState: SimulationState;
  transparent: boolean;
  cameraView: 'default' | 'side' | 'top';
}

function LoadingFallback() {
  return (
    <Html center>
      <div style={{
        color: '#60a5fa',
        fontFamily: 'monospace',
        fontSize: '14px',
        background: '#0a0f1a',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #1e3a5f'
      }}>
        ⏳ Loading 3D Scene...
      </div>
    </Html>
  );
}

export function Scene3D({ simState, transparent, cameraView }: Scene3DProps) {
  const camPos: [number, number, number] =
    cameraView === 'side'  ? [14, 5, 1]    :
    cameraView === 'top'   ? [0.1, 22, 0.1] :
    [11, 8, 11];

  return (
    <Canvas
      shadows
      style={{ width: '100%', height: '100%', background: '#0d1b2a' }}
      gl={{ antialias: true, powerPreference: 'default' }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        {/* Camera */}
        <PerspectiveCamera makeDefault position={camPos} fov={55} near={0.1} far={200} />
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={3}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 2, 0]}
        />

        {/* Sky */}
        <Sky sunPosition={[10, 5, 10]} turbidity={8} rayleigh={0.5} />

        {/* Lighting */}
        <ambientLight intensity={0.6} color="#c8d8ff" />
        <directionalLight
          position={[12, 20, 10]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={70}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          color="#fffbe8"
        />
        <pointLight position={[-6, 4, -6]} intensity={0.5} color="#4488ff" />
        <pointLight position={[6, 4, 6]} intensity={0.4} color="#ff9944" />
        <hemisphereLight args={['#2244aa', '#112200', 0.5]} />

        {/* Ground grid */}
        <Grid
          args={[40, 40]}
          position={[0, 0.001, 0]}
          cellSize={1}
          cellColor="#1a2a3a"
          sectionSize={5}
          sectionColor="#224488"
          fadeDistance={28}
        />

        {/* House + Hydraulics */}
        <HouseModel simState={simState} transparent={transparent} />

        {/* Flood Water */}
        <FloodWater floodDepth={simState.floodDepth} />

        {/* Atmospheric fog */}
        <fog attach="fog" args={['#1a2a3a', 35, 80]} />
      </Suspense>
    </Canvas>
  );
}
