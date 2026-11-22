// ============================================================
// FLOODRISE – Automatic Demo Sequencer
// ============================================================
import { SimulationState } from '../types/simulation';
import { DemoEvent } from '../types/simulation';

export interface DemoStep {
  time: number;
  action: (state: SimulationState) => Partial<SimulationState>;
  event: DemoEvent;
}

export function buildDemoScript(baseTime: number): DemoStep[] {
  const t = (offset: number) => baseTime + offset;

  return [
    {
      time: t(0),
      event: { time: 0, phase: 1, label: 'PHASE 1', description: 'Normal condition – house at ground level, all sensors dry.' },
      action: (s) => ({ targetFloodDepth: 0 }),
    },
    {
      time: t(3),
      event: { time: 3, phase: 2, label: 'PHASE 2', description: 'Flood beginning – water rising slowly around foundation.' },
      action: (s) => ({ targetFloodDepth: 0.1 }),
    },
    {
      time: t(8),
      event: { time: 8, phase: 3, label: 'PHASE 3', description: 'Sensor activation – moisture sensors detect water ingress.' },
      action: (s) => ({ targetFloodDepth: 0.25 }),
    },
    {
      time: t(12),
      event: { time: 12, phase: 4, label: 'PHASE 4', description: 'Controller activated – calculating required lift = 0.30 m.' },
      action: (s) => ({ targetFloodDepth: 0.4 }),
    },
    {
      time: t(15),
      event: { time: 15, phase: 5, label: 'PHASE 5', description: 'Hydraulic pump ON – oil flowing to all four cylinders.' },
      action: (s) => ({ targetFloodDepth: 0.6 }),
    },
    {
      time: t(20),
      event: { time: 20, phase: 6, label: 'PHASE 6', description: 'House lifting – pistons extending, platform rising.' },
      action: (s) => ({ targetFloodDepth: 0.9 }),
    },
    {
      time: t(28),
      event: { time: 28, phase: 7, label: 'PHASE 7', description: 'Flood protection achieved – clearance maintained above water.' },
      action: (s) => ({ targetFloodDepth: 1.1 }),
    },
    {
      time: t(38),
      event: { time: 38, phase: 8, label: 'PHASE 8', description: 'Water receding – flood depth decreasing.' },
      action: (s) => ({ targetFloodDepth: 0.05 }),
    },
    {
      time: t(55),
      event: { time: 55, phase: 9, label: 'PHASE 9', description: 'Automatic descent – pistons retracting, house lowering.' },
      action: (s) => ({ targetFloodDepth: 0 }),
    },
    {
      time: t(75),
      event: { time: 75, phase: 10, label: 'PHASE 10', description: '✅ DEMONSTRATION COMPLETE – System normal, house at ground level.' },
      action: (s) => ({}),
    },
  ];
}
