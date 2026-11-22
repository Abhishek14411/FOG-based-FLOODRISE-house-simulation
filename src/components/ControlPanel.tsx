import React from 'react';
import { SimulationState, SimulationParams, DEFAULT_PARAMS } from '../types/simulation';

interface ControlPanelProps {
  simState: SimulationState;
  params: SimulationParams;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onDemo: () => void;
  onFloodChange: (depth: number) => void;
  onScenario: (scenario: number) => void;
  onModeChange: (mode: 'AUTOMATIC' | 'MANUAL') => void;
  onManualLift: () => void;
  onManualLower: () => void;
  onSensorTest: (sensorId: string) => void;
}

const SCENARIOS = [
  { label: '1. Normal Conditions',    depth: 0 },
  { label: '2. Low-Level Flooding',   depth: 0.3 },
  { label: '3. Moderate Flooding',    depth: 0.7 },
  { label: '4. Severe Flooding',      depth: 1.3 },
  { label: '5. Extreme Flooding',     depth: 2.5 },
];

const STATE_BG: Record<string, string> = {
  IDLE: '#374151',
  MONITORING: '#1e3a5f',
  FLOOD_DETECTED: '#78350f',
  LIFTING: '#713f12',
  ELEVATED: '#14532d',
  WATER_RECEDING: '#134e4a',
  LOWERING: '#4c1d95',
  EMERGENCY: '#7f1d1d',
  MAXIMUM_LIFT_REACHED: '#7f1d1d',
};

const s = {
  section: {
    background: '#1a2537',
    border: '1px solid #1f2937',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '8px',
  } as React.CSSProperties,
  sectionTitle: {
    color: '#60a5fa',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
    marginBottom: '8px',
    paddingBottom: '5px',
    borderBottom: '1px solid #1f2937',
  },
  btn: (color: string, full?: boolean): React.CSSProperties => ({
    padding: '7px 10px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '11px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    width: full ? '100%' : 'auto',
    transition: 'opacity 0.15s',
    ...(color === 'green'  ? { background: '#166534', color: '#bbf7d0' } :
        color === 'yellow' ? { background: '#78350f', color: '#fde68a' } :
        color === 'gray'   ? { background: '#374151', color: '#d1d5db' } :
        color === 'blue'   ? { background: '#1e3a8a', color: '#93c5fd' } :
        color === 'purple' ? { background: '#4c1d95', color: '#c4b5fd' } :
        color === 'red'    ? { background: '#7f1d1d', color: '#fca5a5' } :
        { background: '#374151', color: '#d1d5db' })
  }),
};

export function ControlPanel({ simState, params, onStart, onPause, onResume, onReset, onDemo, onFloodChange, onScenario, onModeChange, onManualLift, onManualLower, onSensorTest }: ControlPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* System State Badge */}
      <div style={{
        background: STATE_BG[simState.systemState] ?? '#374151',
        color: '#fff',
        textAlign: 'center',
        padding: '6px',
        borderRadius: '6px',
        fontWeight: 700,
        fontSize: '10px',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        marginBottom: '8px'
      }}>
        {simState.systemState.replace(/_/g, ' ')}
      </div>

      {/* Sim Controls */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Simulation Controls</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '5px' }}>
          {!simState.running && (
            <button onClick={onStart} style={{ ...s.btn('green'), flex: 1 }}>▶ START</button>
          )}
          {simState.running && !simState.paused && (
            <button onClick={onPause} style={{ ...s.btn('yellow'), flex: 1 }}>⏸ PAUSE</button>
          )}
          {simState.running && simState.paused && (
            <button onClick={onResume} style={{ ...s.btn('green'), flex: 1 }}>▶ RESUME</button>
          )}
          <button onClick={onReset} style={{ ...s.btn('gray'), flex: 1 }}>↺ RESET</button>
        </div>
        <button onClick={onDemo} style={{ ...s.btn('blue'), width: '100%' }}>
          🎬 PLAY AUTO DEMO
        </button>
      </div>

      {/* Mode */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Operating Mode</div>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '6px' }}>
          {(['AUTOMATIC', 'MANUAL'] as const).map(m => (
            <button key={m} onClick={() => onModeChange(m)} style={{
              flex: 1,
              padding: '6px',
              borderRadius: '5px',
              border: `1px solid ${simState.operatingMode === m ? '#3b82f6' : '#374151'}`,
              background: simState.operatingMode === m ? '#1d4ed8' : '#1f2937',
              color: simState.operatingMode === m ? '#fff' : '#9ca3af',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '11px',
            }}>
              {m === 'AUTOMATIC' ? '🤖 AUTO' : '🕹 MANUAL'}
            </button>
          ))}
        </div>
        {simState.operatingMode === 'MANUAL' && (
          <div style={{ display: 'flex', gap: '5px' }}>
            <button onClick={onManualLift}  style={{ ...s.btn('yellow'), flex: 1 }}>▲ LIFT</button>
            <button onClick={onManualLower} style={{ ...s.btn('purple'), flex: 1 }}>▼ LOWER</button>
          </div>
        )}
      </div>

      {/* Flood slider */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Flood Water Control</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ color: '#9ca3af', fontSize: '11px' }}>Flood Depth</span>
          <span style={{ color: '#60a5fa', fontFamily: 'monospace', fontWeight: 700, fontSize: '12px' }}>
            {simState.floodDepth.toFixed(2)} m
          </span>
        </div>
        <input
          type="range" min={0} max={3} step={0.01}
          value={simState.targetFloodDepth}
          onChange={e => onFloodChange(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: '#3b82f6' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '10px', marginTop: '2px' }}>
          <span>0 m</span><span>1.5 m</span><span>3 m</span>
        </div>
      </div>

      {/* Scenarios */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Flood Scenarios</div>
        {SCENARIOS.map((sc, i) => (
          <button key={i} onClick={() => onScenario(sc.depth)} style={{
            width: '100%',
            textAlign: 'left',
            padding: '6px 8px',
            marginBottom: '4px',
            borderRadius: '4px',
            border: '1px solid #1f2937',
            background: '#111827',
            color: '#d1d5db',
            cursor: 'pointer',
            fontSize: '11px',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1e3a5f')}
            onMouseLeave={e => (e.currentTarget.style.background = '#111827')}
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* Sensor Test */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Sensor Test</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          {simState.sensors.map(sen => (
            <button
              key={sen.id}
              onClick={() => onSensorTest(sen.id)}
              style={{
                padding: '6px 4px',
                borderRadius: '4px',
                border: `1px solid ${sen.wet || sen.active ? '#ef4444' : '#374151'}`,
                background: sen.wet || sen.active ? '#7f1d1d' : '#1f2937',
                color: sen.wet || sen.active ? '#fca5a5' : '#9ca3af',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: 700,
                lineHeight: '1.3',
                textAlign: 'center',
              }}
            >
              {sen.id === 'N' ? '↑ North' : sen.id === 'S' ? '↓ South' : sen.id === 'E' ? '→ East' : '← West'}
              <div style={{ fontWeight: 400, fontSize: '9px', marginTop: '2px' }}>
                {sen.wet || sen.active ? '💧 WET' : '✓ DRY'}
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
