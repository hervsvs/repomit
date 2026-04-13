
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import type { HistoryPoint, SimParams } from '../simulation/engine';

interface Props {
  history: HistoryPoint[];
  params: SimParams;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0f172a', border: '1px solid #334155', borderRadius: 8,
      padding: '8px 12px', fontFamily: 'monospace', fontSize: 12,
    }}>
      <div style={{ color: '#64748b', marginBottom: 4 }}>t = {label} min</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
          {p.dataKey === 'conductivity' ? ' μS/cm' : '%'}
        </div>
      ))}
    </div>
  );
};

export function TimeChart({ history, params }: Props) {
  return (
    <div style={{
      background: '#0f172a', border: '1px solid #1e293b',
      borderRadius: 12, padding: '16px 8px 8px',
    }}>
      <h3 style={{
        color: '#94a3b8', fontSize: 13, fontWeight: 600,
        letterSpacing: 1, textTransform: 'uppercase', marginLeft: 12, marginBottom: 12,
      }}>
        Historial — últimos {history.length} puntos
      </h3>

      {/* Level chart */}
      <div style={{ marginBottom: 4 }}>
        <div style={{ color: '#64748b', fontSize: 11, marginLeft: 12, marginBottom: 4 }}>NIVEL BATEA (%)</div>
        <ResponsiveContainer width="100%" height={160}>
          <ComposedChart data={history} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false}
              label={{ value: 'min', position: 'insideBottomRight', fill: '#475569', fontSize: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} width={32} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={params.maxLevel} stroke="#22c55e" strokeDasharray="4 2" strokeWidth={1} />
            <ReferenceLine y={params.minLevel} stroke="#f59e0b" strokeDasharray="4 2" strokeWidth={1} />
            <Line type="monotone" dataKey="level" name="Nivel" stroke="#38bdf8"
              dot={false} strokeWidth={2} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Conductivity chart */}
      <div>
        <div style={{ color: '#64748b', fontSize: 11, marginLeft: 12, marginBottom: 4 }}>CONDUCTIVIDAD (μS/cm)</div>
        <ResponsiveContainer width="100%" height={160}>
          <ComposedChart data={history} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false}
              label={{ value: 'min', position: 'insideBottomRight', fill: '#475569', fontSize: 10 }} />
            <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={params.maxConductivity} stroke="#ef4444" strokeDasharray="4 2" strokeWidth={1} />
            <ReferenceLine y={params.targetConductivity} stroke="#22c55e" strokeDasharray="4 2" strokeWidth={1} />
            <Line type="monotone" dataKey="conductivity" name="Conductividad"
              stroke="#a78bfa" dot={false} strokeWidth={2} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
