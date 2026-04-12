export interface SimState {
  level: number;           // 0-100% basin fill
  conductivity: number;    // μS/cm
  tdsMass: number;         // internal: solids mass (conductivity * level units)
  blowdownOpen: boolean;
  makeupOpen: boolean;
  time: number;            // sim minutes elapsed
  evapRate: number;        // % per sim-minute
}

export interface SimParams {
  ambientTemp: number;       // °C
  humidity: number;          // %
  machineLoad: number;       // %
  minLevel: number;          // % — makeup activates below this
  maxLevel: number;          // % — makeup deactivates above this
  maxConductivity: number;   // μS/cm — blowdown opens above this
  targetConductivity: number;// μS/cm — blowdown closes at or below this
  makeupConductivity: number;// μS/cm — treated water conductivity
  blowdownRate: number;      // % level per sim-minute
  makeupRate: number;        // % level per sim-minute
}

export const DEFAULT_PARAMS: SimParams = {
  ambientTemp: 30,
  humidity: 50,
  machineLoad: 70,
  minLevel: 25,
  maxLevel: 85,
  maxConductivity: 2000,
  targetConductivity: 1200,
  makeupConductivity: 150,
  blowdownRate: 0.35,
  makeupRate: 0.55,
};

export const INITIAL_STATE: SimState = {
  level: 70,
  conductivity: 800,
  tdsMass: 70 * 800,
  blowdownOpen: false,
  makeupOpen: false,
  time: 0,
  evapRate: 0,
};

export function calcEvapRate(params: SimParams): number {
  const { ambientTemp, humidity, machineLoad } = params;
  const tempFactor = 1 + (ambientTemp - 20) * 0.045;
  const humidFactor = 1 - (humidity / 100) * 0.72;
  return (
    0.09 *
    (machineLoad / 100) *
    Math.max(tempFactor, 0.05) *
    Math.max(humidFactor, 0.04)
  );
}

export function stepSimulation(
  state: SimState,
  params: SimParams,
  dt: number // sim-minutes
): SimState {
  let { level, tdsMass, blowdownOpen, makeupOpen, time } = state;
  const evapRate = calcEvapRate(params);

  // Valve hysteresis logic
  const conductivity = level > 0 ? tdsMass / level : 0;
  if (conductivity >= params.maxConductivity) blowdownOpen = true;
  if (conductivity <= params.targetConductivity) blowdownOpen = false;
  if (level <= params.minLevel) makeupOpen = true;
  if (level >= params.maxLevel) makeupOpen = false;

  // Evaporation: water leaves, dissolved solids stay
  const evapDelta = Math.min(evapRate * dt, level);
  level -= evapDelta;
  // tdsMass unchanged

  // Blowdown: drain high-conductivity water (solids leave proportionally)
  if (blowdownOpen && level > 2) {
    const drain = Math.min(params.blowdownRate * dt, level - 2);
    const currentCond = level > 0 ? tdsMass / level : 0;
    tdsMass -= currentCond * drain;
    level -= drain;
  }

  // Makeup: add low-conductivity treated water
  if (makeupOpen && level < 100) {
    const fill = Math.min(params.makeupRate * dt, 100 - level);
    tdsMass += params.makeupConductivity * fill;
    level += fill;
  }

  level = Math.max(0, Math.min(100, level));
  const newConductivity = level > 0 ? tdsMass / level : 0;

  return {
    level,
    conductivity: newConductivity,
    tdsMass,
    blowdownOpen,
    makeupOpen,
    time: time + dt,
    evapRate,
  };
}

export interface HistoryPoint {
  time: number;
  level: number;
  conductivity: number;
}
