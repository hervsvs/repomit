
import type { SimParams } from '../simulation/engine';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  color?: string;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step = 1, unit, color = '#3b82f6', onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ color: '#94a3b8', fontSize: 13 }}>{label}</span>
        <span style={{ color: '#e2e8f0', fontFamily: 'monospace', fontSize: 13, fontWeight: 'bold' }}>
          {value}{unit}
        </span>
      </div>
      <div style={{ position: 'relative', height: 6, background: '#1e293b', borderRadius: 3 }}>
        <div style={{
          position: 'absolute', height: '100%', width: `${pct}%`,
          background: color, borderRadius: 3, transition: 'width 0.1s',
        }} />
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', marginTop: 2, accentColor: color, cursor: 'pointer' }}
      />
    </div>
  );
}

interface Props {
  params: SimParams;
  updateParam: <K extends keyof SimParams>(key: K, value: SimParams[K]) => void;
}

export function ControlPanel({ params, updateParam }: Props) {
  return (
    <div style={{
      background: '#0f172a',
      border: '1px solid #1e293b',
      borderRadius: 12,
      padding: 20,
    }}>
      <h3 style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, letterSpacing: 1, marginBottom: 16, textTransform: 'uppercase' }}>
        Variables de operación
      </h3>

      <Slider label="Temperatura ambiente" value={params.ambientTemp}
        min={15} max={45} unit="°C" color="#f97316"
        onChange={v => updateParam('ambientTemp', v)} />

      <Slider label="Humedad relativa" value={params.humidity}
        min={10} max={90} unit="%" color="#06b6d4"
        onChange={v => updateParam('humidity', v)} />

      <Slider label="Carga de máquina" value={params.machineLoad}
        min={0} max={100} unit="%" color="#a855f7"
        onChange={v => updateParam('machineLoad', v)} />

      <hr style={{ border: 'none', borderTop: '1px solid #1e293b', margin: '16px 0' }} />

      <h3 style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, letterSpacing: 1, marginBottom: 16, textTransform: 'uppercase' }}>
        Parámetros de control
      </h3>

      <Slider label="Nivel mínimo (activar reposición)" value={params.minLevel}
        min={5} max={50} unit="%" color="#f59e0b"
        onChange={v => updateParam('minLevel', v)} />

      <Slider label="Nivel máximo (cortar reposición)" value={params.maxLevel}
        min={50} max={95} unit="%" color="#22c55e"
        onChange={v => updateParam('maxLevel', v)} />

      <Slider label="Conductividad máx. (abrir rechazo)" value={params.maxConductivity}
        min={500} max={4000} step={50} unit=" μS/cm" color="#ef4444"
        onChange={v => updateParam('maxConductivity', v)} />

      <Slider label="Conductividad objetivo (cerrar rechazo)" value={params.targetConductivity}
        min={300} max={2000} step={50} unit=" μS/cm" color="#22c55e"
        onChange={v => updateParam('targetConductivity', v)} />
    </div>
  );
}
