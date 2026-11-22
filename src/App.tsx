import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Scene3D } from './components/3d/Scene3D';
import { ControlPanel } from './components/ControlPanel';
import { TelemetryDashboard } from './components/TelemetryDashboard';
import { FloodChart } from './components/FloodChart';
import { EventTimeline } from './components/EventTimeline';
import { EducationalPanel } from './components/EducationalPanel';
import { SimulationState, DemoEvent, DEFAULT_PARAMS } from './types/simulation';
import { createInitialState, tickSimulation, resetSimulation } from './simulation/SimulationEngine';
import { buildDemoScript, DemoStep } from './simulation/DemoSequencer';

const FIXED_DT = 1 / 30;

export default function App() {
  const [simState, setSimState] = useState<SimulationState>(createInitialState);
  const [events, setEvents] = useState<DemoEvent[]>([]);
  const [transparent, setTransparent] = useState(false);
  const [cameraView, setCameraView] = useState<'default' | 'side' | 'top'>('default');
  const [demoActive, setDemoActive] = useState(false);
  const [showEdu, setShowEdu] = useState(false);

  const lastTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);
  const stateRef = useRef<SimulationState>(createInitialState());
  const demoStepsRef = useRef<DemoStep[]>([]);
  const demoStepIndexRef = useRef<number>(0);
  const demoActiveRef = useRef(false);

  useEffect(() => { demoActiveRef.current = demoActive; }, [demoActive]);

  // ── Animation loop ──────────────────────────────────────────
  useEffect(() => {
    let animId: number;
    const loop = (timestamp: number) => {
      const wallDt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;
      accumulatorRef.current += wallDt;

      while (accumulatorRef.current >= FIXED_DT) {
        const next = tickSimulation(stateRef.current, FIXED_DT, DEFAULT_PARAMS);
        stateRef.current = next;
        accumulatorRef.current -= FIXED_DT;

        if (demoActiveRef.current && demoStepsRef.current.length > 0) {
          const stepIdx = demoStepIndexRef.current;
          if (stepIdx < demoStepsRef.current.length) {
            const step = demoStepsRef.current[stepIdx];
            if (next.time >= step.time) {
              const patch = step.action(next);
              stateRef.current = { ...stateRef.current, ...patch };
              const ev: DemoEvent = { ...step.event, time: Math.round(next.time * 10) / 10 };
              setEvents(prev => [...prev, ev]);
              demoStepIndexRef.current += 1;
              if (demoStepIndexRef.current >= demoStepsRef.current.length) {
                demoActiveRef.current = false;
                setDemoActive(false);
              }
            }
          }
        }
      }
      setSimState({ ...stateRef.current });
      animId = requestAnimationFrame(loop);
    };
    lastTimeRef.current = performance.now();
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // ── Handlers ────────────────────────────────────────────────
  const handleStart = useCallback(() => {
    stateRef.current = { ...stateRef.current, running: true, paused: false, systemState: 'MONITORING' };
    setSimState({ ...stateRef.current });
    setEvents(prev => [...prev, { time: 0, phase: 0, label: 'SIM', description: 'Simulation started. System entering MONITORING state.' }]);
  }, []);

  const handlePause = useCallback(() => {
    stateRef.current = { ...stateRef.current, paused: true };
    setSimState({ ...stateRef.current });
  }, []);

  const handleResume = useCallback(() => {
    stateRef.current = { ...stateRef.current, paused: false };
    lastTimeRef.current = performance.now();
    setSimState({ ...stateRef.current });
  }, []);

  const handleReset = useCallback(() => {
    demoActiveRef.current = false;
    setDemoActive(false);
    demoStepsRef.current = [];
    demoStepIndexRef.current = 0;
    const fresh = resetSimulation();
    stateRef.current = fresh;
    setSimState(fresh);
    setEvents([]);
  }, []);

  const handleDemo = useCallback(() => {
    const fresh = resetSimulation();
    fresh.running = true;
    fresh.paused = false;
    fresh.systemState = 'MONITORING';
    fresh.operatingMode = 'AUTOMATIC';
    stateRef.current = fresh;
    setSimState(fresh);
    setEvents([{ time: 0, phase: 0, label: 'DEMO', description: 'Automatic demonstration started – watch the house rise!' }]);
    demoStepsRef.current = buildDemoScript(0);
    demoStepIndexRef.current = 0;
    demoActiveRef.current = true;
    setDemoActive(true);
  }, []);

  const handleFloodChange = useCallback((depth: number) => {
    stateRef.current = { ...stateRef.current, targetFloodDepth: depth };
    setSimState({ ...stateRef.current });
  }, []);

  const handleScenario = useCallback((depth: number) => {
    stateRef.current = { ...stateRef.current, targetFloodDepth: depth };
    setSimState({ ...stateRef.current });
  }, []);

  const handleModeChange = useCallback((mode: 'AUTOMATIC' | 'MANUAL') => {
    stateRef.current = { ...stateRef.current, operatingMode: mode };
    setSimState({ ...stateRef.current });
  }, []);

  const handleManualLift = useCallback(() => {
    const target = Math.min(stateRef.current.targetElevation + 0.2, DEFAULT_PARAMS.maxHydraulicLift);
    stateRef.current = { ...stateRef.current, targetElevation: target, pumpActive: true, oilFlowing: true };
    setSimState({ ...stateRef.current });
  }, []);

  const handleManualLower = useCallback(() => {
    if (stateRef.current.floodDepth >= DEFAULT_PARAMS.safeLoweringThreshold) return;
    const target = Math.max(stateRef.current.targetElevation - 0.2, 0);
    stateRef.current = { ...stateRef.current, targetElevation: target };
    setSimState({ ...stateRef.current });
  }, []);

  const handleSensorTest = useCallback((sensorId: string) => {
    const sensors = stateRef.current.sensors.map(sen =>
      sen.id === sensorId ? { ...sen, active: !sen.active, wet: !sen.active } : sen
    );
    stateRef.current = { ...stateRef.current, sensors };
    setSimState({ ...stateRef.current });
  }, []);

  // State badge colour
  const stateBadgeStyle: React.CSSProperties = simState.emergencyActive
    ? { background: '#7f1d1d', color: '#fca5a5', animation: 'pulse 1s infinite' }
    : simState.systemState === 'ELEVATED' ? { background: '#14532d', color: '#86efac' }
    : simState.systemState === 'LIFTING'  ? { background: '#713f12', color: '#fde68a' }
    : simState.systemState === 'MONITORING' ? { background: '#1e3a5f', color: '#93c5fd' }
    : { background: '#1f2937', color: '#9ca3af' };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#030712',
      color: '#f9fafb',
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      fontSize: '13px'
    }}>

      {/* ═══ HEADER ═══════════════════════════════════════════ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 14px',
        background: '#111827',
        borderBottom: '1px solid #1f2937',
        flexShrink: 0,
        height: '52px'
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🏠</span>
          <div>
            <div style={{ color: '#60a5fa', fontWeight: 700, fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>
              FloodRise
            </div>
            <div style={{ color: '#6b7280', fontSize: '11px' }}>
              Automatic Hydraulic Flood-Resistant House Simulator
            </div>
          </div>
        </div>

        {/* Status badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            ...stateBadgeStyle,
            padding: '3px 10px',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            ● {simState.systemState.replace(/_/g, ' ')}
          </span>
          {simState.pumpActive && (
            <span style={{ background: '#78350f', color: '#fcd34d', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
              ⚙ PUMP ON
            </span>
          )}
          {demoActive && (
            <span style={{ background: '#1e3a8a', color: '#93c5fd', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
              ▶ AUTO DEMO
            </span>
          )}
          {simState.emergencyActive && (
            <span style={{ background: '#7f1d1d', color: '#fca5a5', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
              ⚠ EMERGENCY
            </span>
          )}
        </div>

        {/* Camera + X-Ray buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['default', 'side', 'top'] as const).map(v => (
            <button key={v} onClick={() => setCameraView(v)} style={{
              padding: '4px 10px',
              borderRadius: '4px',
              border: `1px solid ${cameraView === v ? '#3b82f6' : '#374151'}`,
              background: cameraView === v ? '#1d4ed8' : '#1f2937',
              color: cameraView === v ? '#fff' : '#9ca3af',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 600
            }}>
              {v === 'default' ? '🎥 Persp' : v === 'side' ? '↔ Side' : '⬆ Top'}
            </button>
          ))}
          <button onClick={() => setTransparent(v => !v)} style={{
            padding: '4px 10px',
            borderRadius: '4px',
            border: `1px solid ${transparent ? '#6366f1' : '#374151'}`,
            background: transparent ? '#4338ca' : '#1f2937',
            color: transparent ? '#fff' : '#9ca3af',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 600
          }}>
            🔍 X-Ray
          </button>
          <button onClick={() => setShowEdu(v => !v)} style={{
            padding: '4px 10px',
            borderRadius: '4px',
            border: `1px solid ${showEdu ? '#059669' : '#374151'}`,
            background: showEdu ? '#065f46' : '#1f2937',
            color: showEdu ? '#6ee7b7' : '#9ca3af',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 600
          }}>
            📚 Guide
          </button>
        </div>
      </div>

      {/* ═══ MAIN ROW ══════════════════════════════════════════ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* LEFT PANEL */}
        <div style={{
          width: '230px',
          flexShrink: 0,
          background: '#111827',
          borderRight: '1px solid #1f2937',
          overflowY: 'auto',
          padding: '10px'
        }}>
          <ControlPanel
            simState={simState}
            params={DEFAULT_PARAMS}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onReset={handleReset}
            onDemo={handleDemo}
            onFloodChange={handleFloodChange}
            onScenario={handleScenario}
            onModeChange={handleModeChange}
            onManualLift={handleManualLift}
            onManualLower={handleManualLower}
            onSensorTest={handleSensorTest}
          />
        </div>

        {/* CENTER: 3D VIEWPORT */}
        <div style={{ flex: 1, position: 'relative', minWidth: 0, background: '#0d1b2a' }}>
          <Scene3D simState={simState} transparent={transparent} cameraView={cameraView} />

          {/* HUD Overlay */}
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'rgba(3,7,18,0.85)',
            border: '1px solid #1e3a5f',
            borderRadius: '8px',
            padding: '10px 14px',
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: '1.8',
            pointerEvents: 'none'
          }}>
            <div><span style={{ color: '#60a5fa' }}>Flood  </span><span style={{ color: '#fff' }}>{simState.floodDepth.toFixed(3)} m</span></div>
            <div><span style={{ color: '#4ade80' }}>House  </span><span style={{ color: '#fff' }}>+{simState.platformElevation.toFixed(3)} m</span></div>
            <div><span style={{ color: '#fbbf24' }}>Piston </span><span style={{ color: '#fff' }}>{(simState.actuators[0]?.extension ?? 0).toFixed(3)} m</span></div>
            <div><span style={{ color: '#a78bfa' }}>Sensors </span><span style={{ color: simState.activeSensorCount > 0 ? '#f87171' : '#4ade80' }}>{simState.activeSensorCount}/4 active</span></div>
          </div>

          {/* Instructions */}
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#374151',
            fontSize: '11px',
            pointerEvents: 'none'
          }}>
            🖱 Left-drag: rotate  •  Scroll: zoom  •  Right-drag: pan
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{
          width: '230px',
          flexShrink: 0,
          background: '#111827',
          borderLeft: '1px solid #1f2937',
          overflowY: 'auto',
          padding: '10px'
        }}>
          <TelemetryDashboard simState={simState} />
        </div>
      </div>

      {/* ═══ BOTTOM ROW ════════════════════════════════════════ */}
      <div style={{
        flexShrink: 0,
        background: '#111827',
        borderTop: '1px solid #1f2937',
        height: '220px',
        display: 'flex',
        gap: '10px',
        padding: '10px',
        overflow: 'hidden'
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <FloodChart history={simState.history} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <EventTimeline events={events} currentTime={simState.time} />
        </div>
      </div>

      {/* ═══ EDUCATION PANEL (toggled) ═══════════════════════ */}
      {showEdu && (
        <div style={{
          flexShrink: 0,
          background: '#0f172a',
          borderTop: '1px solid #1e3a5f',
          padding: '12px',
          maxHeight: '260px',
          overflowY: 'auto'
        }}>
          <EducationalPanel />
        </div>
      )}
    </div>
  );
}
