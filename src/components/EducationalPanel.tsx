import React, { useState } from 'react';

const COMPONENTS = [
  {
    icon: '💧',
    name: 'Moisture Sensors',
    desc: 'Four perimeter sensors detect electrical conductivity changes when floodwater contacts them. Placed at N, S, E, W positions around foundation.',
  },
  {
    icon: '📏',
    name: 'Water-Level Sensor',
    desc: 'Ultrasonic depth sensor measures flood depth continuously, sending real-time telemetry to the central hydraulic controller.',
  },
  {
    icon: '🖥️',
    name: 'Central Controller',
    desc: 'Runs the control state machine, calculates required lift = flood depth + 0.50m clearance - floor height, and commands the pump.',
  },
  {
    icon: '⚙️',
    name: 'Hydraulic Pump',
    desc: 'Motor-driven high pressure gear pump supplies pressurized fluid through the manifold network to all four corners.',
  },
  {
    icon: '🏗️',
    name: 'Hydraulic Cylinders',
    desc: 'Four synchronized heavy-duty telescopic cylinders extend simultaneously to elevate the reinforced house platform evenly.',
  },
  {
    icon: '🛢️',
    name: 'Hydraulic Fluid',
    desc: 'Incompressible mineral oil ensures instantaneous, rigid force transmission and millimeter-accurate elevation synchronization.',
  },
  {
    icon: '🏠',
    name: 'Lifting Platform',
    desc: 'Steel-reinforced perimeter cradle beneath the house slab, transferring lifting loads without structural distortion.',
  },
  {
    icon: '🤖',
    name: 'Automatic Failsafe',
    desc: 'Automatic descent occurs only after flood recedes below 0.10m for a confirmed 10-second safety hysteresis window.',
  },
];

const FLOW_STEPS = [
  'FLOOD DETECTED',
  'SENSORS ACTIVATE',
  'CONTROLLER PROCESSES',
  'PUMP STARTS',
  'CYLINDERS EXTEND',
  'HOUSE RISES',
  'WATER RECEDES',
  'SAFE LOWERING',
];

export function EducationalPanel() {
  const [activeStep, setActiveStep] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((s) => (s + 1) % FLOW_STEPS.length);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      background: '#1a2537',
      border: '1px solid #1f2937',
      borderRadius: '8px',
      padding: '12px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        color: '#60a5fa',
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        marginBottom: '10px'
      }}>
        📚 How The FloodRise Hydraulic System Works
      </div>

      {/* Animated Flow Diagram */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '12px',
        paddingBottom: '10px',
        borderBottom: '1px solid #1f2937'
      }}>
        {FLOW_STEPS.map((step, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 700,
                transition: 'all 0.3s',
                background: i === activeStep ? '#2563eb' : '#111827',
                color: i === activeStep ? '#ffffff' : '#9ca3af',
                border: i === activeStep ? '1px solid #60a5fa' : '1px solid #1f2937',
                boxShadow: i === activeStep ? '0 0 10px rgba(37, 99, 235, 0.5)' : 'none'
              }}
            >
              {step}
            </div>
            {i < FLOW_STEPS.length - 1 && (
              <span style={{ color: i < activeStep ? '#60a5fa' : '#374151', fontSize: '11px' }}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Component Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '8px'
      }}>
        {COMPONENTS.map((c, i) => (
          <div key={i} style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '6px',
            padding: '8px 10px'
          }}>
            <div style={{ fontSize: '16px', marginBottom: '2px' }}>{c.icon}</div>
            <div style={{ color: '#93c5fd', fontWeight: 700, fontSize: '11px', marginBottom: '2px' }}>{c.name}</div>
            <div style={{ color: '#9ca3af', fontSize: '10px', lineHeight: 1.4 }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
