// ============================================================
// FLOODRISE – Type Definitions
// ============================================================

export type SystemState =
  | 'IDLE'
  | 'MONITORING'
  | 'FLOOD_DETECTED'
  | 'LIFTING'
  | 'ELEVATED'
  | 'WATER_RECEDING'
  | 'LOWERING'
  | 'EMERGENCY'
  | 'MAXIMUM_LIFT_REACHED';

export type OperatingMode = 'AUTOMATIC' | 'MANUAL';

export interface SimulationParams {
  initialPlatformElevation: number;   // metres
  sensorActivationLevel: number;      // metres (flood depth that trips sensors)
  initialFloorElevation: number;      // metres above ground
  desiredFloodClearance: number;      // metres above water surface
  maxHydraulicLift: number;           // metres
  liftingSpeed: number;               // metres per second
  loweringSpeed: number;              // metres per second
  safeLoweringThreshold: number;      // metres (flood depth below which lowering begins)
  safeConfirmationPeriod: number;     // seconds before lowering starts
}

export const DEFAULT_PARAMS: SimulationParams = {
  initialPlatformElevation: 0,
  sensorActivationLevel: 0.15,
  initialFloorElevation: 0.45,
  desiredFloodClearance: 0.50,
  maxHydraulicLift: 2.00,
  liftingSpeed: 0.15,
  loweringSpeed: 0.10,
  safeLoweringThreshold: 0.10,
  safeConfirmationPeriod: 10,
};

export interface SensorData {
  id: 'N' | 'S' | 'E' | 'W';
  label: string;
  position: [number, number, number];
  wet: boolean;
  warning: boolean;
  active: boolean; // manually triggered
}

export interface HydraulicActuatorData {
  id: 'FL' | 'FR' | 'RL' | 'RR'; // front-left, front-right, rear-left, rear-right
  extension: number;               // metres currently extended
  targetExtension: number;
  healthy: boolean;
}

export interface SimulationState {
  systemState: SystemState;
  operatingMode: OperatingMode;
  running: boolean;
  paused: boolean;
  time: number;                   // simulation seconds

  // Flood
  floodDepth: number;             // metres
  targetFloodDepth: number;

  // House / Platform
  platformElevation: number;      // metres above ground
  targetElevation: number;

  // Sensors
  sensors: SensorData[];
  activeSensorCount: number;
  waterLevelSensorDepth: number;

  // Hydraulics
  actuators: HydraulicActuatorData[];
  pumpActive: boolean;
  oilFlowing: boolean;
  requiredLift: number;
  hydraulicHealth: number;        // 0–100

  // Safety
  safeWaterTimer: number;         // seconds water has been below threshold

  // Emergency
  emergencyActive: boolean;
  faultMessage: string;

  // History for charts (last N seconds)
  history: HistoryPoint[];
}

export interface HistoryPoint {
  time: number;
  floodDepth: number;
  platformElevation: number;
  pistonExtension: number;
}

export interface DemoEvent {
  time: number;
  phase: number;
  label: string;
  description: string;
}
