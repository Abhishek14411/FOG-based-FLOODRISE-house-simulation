import React from 'react';
import { SimulationState } from '../types/simulation';

interface TelemetryDashboardProps {
  simState: SimulationState;
}

const ss = {
  section: {
    background: '#1a2537',
    border: '1px solid #1f2937',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '8px',
  } as React.CSSProperties,
  title: {
    color: '#60a5fa',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
    marginBottom: '8px',
    paddingBottom: '5px',
    borderBottom: '1px solid #1f2937',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 0',
    borderBottom: '1px solid #111827',
    fontSize: '11px',
  } as React.CSSProperties,
};

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function TelemetryDashboard({ simState }: TelemetryDashboardProps) {
  const clearance = simState.platformElevation + 0.45 - simState.floodDepth;
  const piston = simState.actuators[0]?.extension ?? 0;

  const metrics = [
    { label: 'Flood Depth',      value: `${simState.floodDepth.toFixed(3)} m`,        color: simState.floodDepth > 1 ? '#f87171' : simState.floodDepth > 0.1 ? '#fbbf24' : '#4ade80' },
    { label: 'House Elevation',  value: `+${simState.platformElevation.toFixed(3)} m`, color: '#60a5fa' },
    { label: 'Required Lift',    value: `${simState.requiredLift.toFixed(3)} m`,        color: '#fbbf24' },
    { label: 'Piston Extension', value: `${piston.toFixed(3)} m`,                     color: '#22d3ee' },
    { label: 'Active Sensors',   value: `${simState.activeSensorCount} / 4`,           color: simState.activeSensorCount > 0 ? '#f87171' : '#4ade80' },
    { label: 'Pump Status',      value: simState.pumpActive ? 'ACTIVE' : 'STANDBY',    color: simState.pumpActive ? '#4ade80' : '#6b7280' },
    { label: 'Mode',             value: simState.operatingMode,                        color: '#a78bfa' },
    { label: 'State',            value: simState.systemState.replace(/_/g, ' '),        color: '#93c5fd' },
    { label: 'Clearance',        value: `${clearance.toFixed(3)} m`,                   color: clearance < 0.1 ? '#f87171' : '#4ade80' },
    { label: 'Hyd. Health',      value: `${simState.hydraulicHealth}%`,                color: '#4ade80' },
  ];

  return (
    <div>
      {/* Emergency Alert */}
      {simState.emergencyActive && (
        <div style={{
          background: '#7f1d1d',
          border: '1px solid #ef4444',
          borderRadius: '6px',
          padding: '8px',
          color: '#fca5a5',
          fontSize: '11px',
          fontWeight: 700,
          marginBottom: '8px',
        }}>
          ⚠ {simState.faultMessage}
        </div>
      )}

      {/* Live Metrics */}
      <div style={ss.section}>
        <div style={ss.title}>Live Telemetry</div>
        {metrics.map((m, i) => (
          <div key={i} style={ss.row}>
            <span style={{ color: '#6b7280' }}>{m.label}</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: m.color }}>{m.value}</span>
          </div>
        ))}
      </div>

      {/* Actuators */}
      <div style={ss.section}>
        <div style={ss.title}>Hydraulic Actuators</div>
        {simState.actuators.map(act => (
          <div key={act.id} style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
              <span style={{ color: '#6b7280' }}>Cylinder {act.id}</span>
              <span style={{ fontFamily: 'monospace', color: '#22d3ee', fontWeight: 700 }}>{act.extension.toFixed(3)} m</span>
            </div>
            <div style={{ background: '#111827', borderRadius: '3px', height: '6px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min((act.extension / 2.0) * 100, 100)}%`,
                background: act.healthy ? '#06b6d4' : '#ef4444',
                borderRadius: '3px',
                transition: 'width 0.1s',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Sensors */}
      <div style={ss.section}>
        <div style={ss.title}>Moisture Sensors</div>
        {simState.sensors.map(sen => (
          <div key={sen.id} style={ss.row}>
            <span style={{ color: '#6b7280', fontSize: '11px' }}>{sen.label}</span>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '3px',
              background: sen.wet ? '#7f1d1d' : '#14532d',
              color: sen.wet ? '#fca5a5' : '#86efac',
            }}>
              {sen.wet ? '💧 WET' : '✓ DRY'}
            </span>
          </div>
        ))}
      </div>

      {/* Clock */}
      <div style={{
        background: '#1a2537',
        border: '1px solid #1f2937',
        borderRadius: '8px',
        padding: '10px',
        textAlign: 'center',
      }}>
        <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '2px' }}>SIM TIME</div>
        <div style={{ color: '#60a5fa', fontFamily: 'monospace', fontWeight: 700, fontSize: '22px' }}>
          {formatTime(simState.time)}
        </div>
      </div>
    </div>
  );
}
