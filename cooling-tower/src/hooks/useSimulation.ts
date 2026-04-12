import { useState, useEffect, useRef, useCallback } from 'react';
import type { SimState, SimParams, HistoryPoint } from '../simulation/engine';
import { INITIAL_STATE, DEFAULT_PARAMS, stepSimulation } from '../simulation/engine';

const SIM_SPEED = 5;       // sim-minutes per real second
const TICK_MS = 100;       // real milliseconds per tick
const DT = (SIM_SPEED * TICK_MS) / 1000; // sim-minutes per tick
const MAX_HISTORY = 300;   // points kept

export function useSimulation() {
  const [params, setParams] = useState<SimParams>(DEFAULT_PARAMS);
  const [state, setState] = useState<SimState>(INITIAL_STATE);
  const [history, setHistory] = useState<HistoryPoint[]>([
    { time: 0, level: INITIAL_STATE.level, conductivity: INITIAL_STATE.conductivity },
  ]);
  const [running, setRunning] = useState(true);

  const stateRef = useRef<SimState>(INITIAL_STATE);
  const paramsRef = useRef<SimParams>(DEFAULT_PARAMS);

  // Keep refs in sync so the interval closure always sees fresh values
  useEffect(() => { paramsRef.current = params; }, [params]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const next = stepSimulation(stateRef.current, paramsRef.current, DT);
      stateRef.current = next;
      setState(next);
      setHistory(prev => {
        const point: HistoryPoint = {
          time: Math.round(next.time),
          level: parseFloat(next.level.toFixed(1)),
          conductivity: Math.round(next.conductivity),
        };
        const updated = [...prev, point];
        return updated.length > MAX_HISTORY ? updated.slice(updated.length - MAX_HISTORY) : updated;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [running]);

  const updateParam = useCallback(<K extends keyof SimParams>(key: K, value: SimParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    stateRef.current = INITIAL_STATE;
    setState(INITIAL_STATE);
    setHistory([{ time: 0, level: INITIAL_STATE.level, conductivity: INITIAL_STATE.conductivity }]);
  }, []);

  return { state, params, history, running, setRunning, updateParam, reset };
}
