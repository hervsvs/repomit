
import type { SimState, SimParams } from '../simulation/engine';

interface StatRowProps {
  label: string;
  value: string;
  color?: string;
  subtext?: string;
}

function StatRow({ label, value, color = '#e2e8f0', subtext }: StatRowProps) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      padding: '8px 0', borderBottom: '1px solid #1e293b',
    }}>
      <div>
        <div style={{ color: '#64748b', fontSize: 12 }}>{label}</div>
        {subtext && <div style={{ color: '#334155', fontSize: 10 }}>{subtext}</div>}
      </div>
      <div style={{ color, fontFamily: 'monospace', fontSize: 15, fontWeight: 'bold' }}>{value}</div>
    </div>
  );
}

interface Props {
  state: SimState;
  params: SimParams;
}

function simTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} hs`;
}

export function StatusPanel({ state, params }: Props) {
  const condStatus = state.conductivity >= params.maxConductivity
    ? { label: 'ALTA — rechazo activo', color: '#ef4444' }
    : state.conductivity >= params.targetConductivity
    ? { label: 'ELEVADA', color: '#f59e0b' }
    : { label: 'Normal', color: '#22c55e' };

  const levelStatus = state.level <= params.minLevel
    ? { label: 'BAJO — reposición activa', color: '#f59e0b' }
    : state.level >= params.maxLevel
    ? { label: 'MÁXIMO', color: '#22c55e' }
    : { label: 'Normal', color: '#38bdf8' };

  return (
    <div style={{
      background: '#0f172a', border: '1px solid #1e293b',
      borderRadius: 12, padding: 20,
    }}>
      <h3 style={{
        color: '#94a3b8', fontSize: 13, fontWeight: 600,
        letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase',
      }}>
        Estado del sistema
      </h3>

      <StatRow label="Tiempo simulado" value={simTime(state.time)} />
      <StatRow label="Nivel batea" value={`${state.level.toFixed(1)} %`}
        color={levelStatus.color} subtext={levelStatus.label} />
      <StatRow label="Conductividad" value={`${Math.round(state.conductivity)} μS/cm`}
        color={condStatus.color} subtext={condStatus.label} />
      <StatRow label="Tasa de evaporación" value={`${(state.evapRate * 60).toFixed(2)} %/h`}
        color="#94a3b8" />
      <StatRow label="Temperatura ambiente" value={`${params.ambientTemp} °C`} color="#f97316" />
      <StatRow label="Humedad relativa" value={`${params.humidity} %`} color="#06b6d4" />
      <StatRow label="Carga de máquina" value={`${params.machineLoad} %`} color="#a855f7" />

      <div style={{ marginTop: 12, fontSize: 11, color: '#334155', fontStyle: 'italic' }}>
        Velocidad sim.: 5 min/s · Agua de reposición: {params.makeupConductivity} μS/cm
      </div>
    </div>
  );
}
