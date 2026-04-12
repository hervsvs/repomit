

interface Props {
  value: number;
  max: number;
  threshold: number;
  target: number;
  label: string;
  unit: string;
}

export function ArcGauge({ value, max, threshold, target, label, unit }: Props) {
  const W = 200, H = 130;
  const cx = W / 2, cy = H - 20;
  const r = 80;
  const ratio = Math.min(value / max, 1);
  const needleAngle = Math.PI - ratio * Math.PI;

  const arcPath = (from: number, to: number, col: string, strokeW = 14) => {
    const x1 = cx + r * Math.cos(from);
    const y1 = cy + r * Math.sin(from);
    const x2 = cx + r * Math.cos(to);
    const y2 = cy + r * Math.sin(to);
    const large = Math.abs(to - from) > Math.PI ? 1 : 0;
    return (
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`}
        stroke={col}
        strokeWidth={strokeW}
        fill="none"
        strokeLinecap="round"
      />
    );
  };

  const thresholdRatio = threshold / max;
  const thresholdAngle = Math.PI - thresholdRatio * Math.PI;
  const targetRatio = target / max;
  const targetAngle = Math.PI - targetRatio * Math.PI;

  const nx = cx + (r - 10) * Math.cos(needleAngle);
  const ny = cy + (r - 10) * Math.sin(needleAngle);

  const color = value >= threshold ? '#ef4444' : value >= target ? '#f59e0b' : '#22c55e';

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={W} height={H}>
        {/* Background arc */}
        {arcPath(Math.PI, 0, '#1e293b', 16)}
        {/* Green zone: 0 → target */}
        {arcPath(Math.PI, targetAngle, '#166534', 14)}
        {/* Yellow zone: target → threshold */}
        {arcPath(targetAngle, thresholdAngle, '#78350f', 14)}
        {/* Red zone: threshold → max */}
        {arcPath(thresholdAngle, 0, '#7f1d1d', 14)}
        {/* Value arc */}
        {arcPath(Math.PI, needleAngle, color, 10)}

        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={nx} y2={ny}
          stroke="white" strokeWidth={2} strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={5} fill="#94a3b8" />

        {/* Tick marks at threshold and target */}
        {[{ a: thresholdAngle, c: '#ef4444' }, { a: targetAngle, c: '#22c55e' }].map(({ a, c }, i) => (
          <line key={i}
            x1={cx + (r - 20) * Math.cos(a)} y1={cy + (r - 20) * Math.sin(a)}
            x2={cx + (r + 4) * Math.cos(a)} y2={cy + (r + 4) * Math.sin(a)}
            stroke={c} strokeWidth={2}
          />
        ))}

        {/* Value text */}
        <text x={cx} y={cy - 14} textAnchor="middle" fill={color} fontSize={18} fontWeight="bold" fontFamily="monospace">
          {Math.round(value)}
        </text>
        <text x={cx} y={cy - 2} textAnchor="middle" fill="#64748b" fontSize={11} fontFamily="monospace">
          {unit}
        </text>
      </svg>
      <div style={{ color: '#94a3b8', fontSize: 13, marginTop: -8 }}>{label}</div>
    </div>
  );
}
