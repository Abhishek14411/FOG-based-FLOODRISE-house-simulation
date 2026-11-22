// ============================================================
// FLOODRISE – Simulation Engine (pure logic, no Three.js)
// ============================================================
import {
  SimulationState,
  SimulationParams,
  SensorData,
  HydraulicActuatorData,
  HistoryPoint,
  DEFAULT_PARAMS,
} from '../types/simulation';

const MAX_HISTORY = 300;

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function makeSensors(): SensorData[] {
  return [
    { id: 'N', label: 'Sensor 1 – North', position: [0, 0,  2.8], wet: false, warning: false, active: false },
    { id: 'S', label: 'Sensor 2 – South', position: [0, 0, -2.8], wet: false, warning: false, active: false },
    { id: 'E', label: 'Sensor 3 – East',  position: [ 2.8, 0, 0], wet: false, warning: false, active: false },
    { id: 'W', label: 'Sensor 4 – West',  position: [-2.8, 0, 0], wet: false, warning: false, active: false },
  ];
}

function makeActuators(): HydraulicActuatorData[] {
  return [
    { id: 'FL', extension: 0, targetExtension: 0, healthy: true },
    { id: 'FR', extension: 0, targetExtension: 0, healthy: true },
    { id: 'RL', extension: 0, targetExtension: 0, healthy: true },
    { id: 'RR', extension: 0, targetExtension: 0, healthy: true },
  ];
}

export function createInitialState(): SimulationState {
  return {
    systemState: 'IDLE',
    operatingMode: 'AUTOMATIC',
    running: false,
    paused: false,
    time: 0,
    floodDepth: 0,
    targetFloodDepth: 0,
    platformElevation: 0,
    targetElevation: 0,
    sensors: makeSensors(),
    activeSensorCount: 0,
    waterLevelSensorDepth: 0,
    actuators: makeActuators(),
    pumpActive: false,
    oilFlowing: false,
    requiredLift: 0,
    hydraulicHealth: 100,
    safeWaterTimer: 0,
    emergencyActive: false,
    faultMessage: '',
    history: [],
  };
}

export function tickSimulation(
  prev: SimulationState,
  dt: number,
  params: SimulationParams = DEFAULT_PARAMS
): SimulationState {
  if (!prev.running || prev.paused) return prev;

  const s = { ...prev };
  s.actuators = prev.actuators.map(a => ({ ...a }));
  s.sensors = prev.sensors.map(sen => ({ ...sen }));
  s.time = prev.time + dt;

  // ── 1. Flood water convergence ──────────────────────────────
  const floodSpeed = 0.08; // metres per simulation-second
  if (Math.abs(s.floodDepth - s.targetFloodDepth) < 0.001) {
    s.floodDepth = s.targetFloodDepth;
  } else {
    s.floodDepth = lerp(s.floodDepth, s.targetFloodDepth, Math.min(1, floodSpeed * dt));
  }
  s.waterLevelSensorDepth = s.floodDepth;

  // ── 2. Update sensors ───────────────────────────────────────
  let activeSensorCount = 0;
  for (const sen of s.sensors) {
    if (!sen.active) {
      sen.wet = s.floodDepth >= params.sensorActivationLevel;
    }
    sen.warning = sen.wet && s.floodDepth > params.sensorActivationLevel * 2;
    if (sen.wet || sen.active) activeSensorCount++;
  }
  s.activeSensorCount = activeSensorCount;

  // ── 3. Required lift calculation ────────────────────────────
  s.requiredLift = clamp(
    s.floodDepth + params.desiredFloodClearance - params.initialFloorElevation,
    0,
    params.maxHydraulicLift
  );

  // ── 4. State machine ────────────────────────────────────────
  if (s.operatingMode === 'AUTOMATIC') {
    switch (s.systemState) {
      case 'IDLE':
        s.systemState = 'MONITORING';
        break;

      case 'MONITORING':
        if (s.activeSensorCount > 0) {
          s.systemState = 'FLOOD_DETECTED';
        }
        break;

      case 'FLOOD_DETECTED':
        s.pumpActive = true;
        s.oilFlowing = true;
        s.systemState = 'LIFTING';
        break;

      case 'LIFTING': {
        const atTarget = Math.abs(s.platformElevation - s.requiredLift) < 0.01;
        if (s.requiredLift >= params.maxHydraulicLift - 0.01) {
          s.systemState = 'MAXIMUM_LIFT_REACHED';
        } else if (atTarget) {
          s.systemState = 'ELEVATED';
        } else if (s.activeSensorCount === 0 && s.floodDepth < params.sensorActivationLevel) {
          s.systemState = 'WATER_RECEDING';
        }
        break;
      }

      case 'ELEVATED':
        if (s.requiredLift > s.platformElevation + 0.05) {
          s.systemState = 'LIFTING';
        } else if (s.floodDepth < params.safeLoweringThreshold) {
          s.safeWaterTimer += dt;
          if (s.safeWaterTimer >= params.safeConfirmationPeriod) {
            s.systemState = 'WATER_RECEDING';
          }
        } else {
          s.safeWaterTimer = 0;
        }
        break;

      case 'MAXIMUM_LIFT_REACHED':
        if (s.floodDepth > params.maxHydraulicLift + params.initialFloorElevation) {
          s.emergencyActive = true;
          s.faultMessage = 'FLOOD EXCEEDS MAXIMUM LIFTING CAPACITY – EMERGENCY!';
          s.systemState = 'EMERGENCY';
        } else if (s.floodDepth < params.safeLoweringThreshold) {
          s.safeWaterTimer += dt;
          if (s.safeWaterTimer >= params.safeConfirmationPeriod) {
            s.emergencyActive = false;
            s.faultMessage = '';
            s.systemState = 'WATER_RECEDING';
          }
        } else {
          s.safeWaterTimer = 0;
        }
        break;

      case 'WATER_RECEDING':
        if (s.floodDepth < params.safeLoweringThreshold) {
          s.safeWaterTimer += dt;
          if (s.safeWaterTimer >= params.safeConfirmationPeriod) {
            s.systemState = 'LOWERING';
            s.safeWaterTimer = 0;
          }
        } else {
          s.safeWaterTimer = 0;
          if (s.floodDepth >= params.sensorActivationLevel) {
            s.systemState = 'LIFTING';
          }
        }
        break;

      case 'LOWERING': {
        const atGround = s.platformElevation < 0.01;
        if (atGround) {
          s.platformElevation = 0;
          s.pumpActive = false;
          s.oilFlowing = false;
          s.systemState = 'MONITORING';
        }
        break;
      }

      case 'EMERGENCY':
        // Stay until water recedes
        if (s.floodDepth < params.safeLoweringThreshold) {
          s.safeWaterTimer += dt;
          if (s.safeWaterTimer >= params.safeConfirmationPeriod) {
            s.emergencyActive = false;
            s.faultMessage = '';
            s.systemState = 'LOWERING';
          }
        } else {
          s.safeWaterTimer = 0;
        }
        break;
    }
  }

  // ── 5. Platform elevation movement ──────────────────────────
  if (s.systemState === 'LIFTING' || s.systemState === 'ELEVATED' || s.systemState === 'MAXIMUM_LIFT_REACHED') {
    s.targetElevation = s.requiredLift;
  } else if (s.systemState === 'LOWERING' || s.systemState === 'MONITORING' || s.systemState === 'IDLE') {
    s.targetElevation = 0;
  }

  const liftDir = s.targetElevation > s.platformElevation ? 1 : -1;
  const speed = liftDir > 0 ? params.liftingSpeed : params.loweringSpeed;
  const delta = speed * dt;
  if (Math.abs(s.platformElevation - s.targetElevation) <= delta) {
    s.platformElevation = s.targetElevation;
  } else {
    s.platformElevation += liftDir * delta;
  }
  s.platformElevation = clamp(s.platformElevation, 0, params.maxHydraulicLift);

  // ── 6. Actuators follow platform ────────────────────────────
  for (const act of s.actuators) {
    act.targetExtension = s.platformElevation;
    act.extension = s.platformElevation; // synchronized
  }

  // ── 7. History ──────────────────────────────────────────────
  const histPoint: HistoryPoint = {
    time: Math.round(s.time * 10) / 10,
    floodDepth: Math.round(s.floodDepth * 1000) / 1000,
    platformElevation: Math.round(s.platformElevation * 1000) / 1000,
    pistonExtension: Math.round(s.platformElevation * 1000) / 1000,
  };
  const newHistory = [...prev.history, histPoint];
  s.history = newHistory.length > MAX_HISTORY ? newHistory.slice(newHistory.length - MAX_HISTORY) : newHistory;

  return s;
}

export function resetSimulation(): SimulationState {
  return createInitialState();
}
