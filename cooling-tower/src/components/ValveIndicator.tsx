

interface ValveProps {
  open: boolean;
  label: string;
  description: string;
  openColor?: string;
}

export function ValveIndicator({ open, label, description, openColor = '#22c55e' }: ValveProps) {
  return (
    <div style={{
      background: '#0f172a',
      border: `2px solid ${open ? openColor : '#334155'}`,
      borderRadius: 10,
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      transition: 'border-color 0.3s',
      minWidth: 200,
    }}>
      {/* Valve icon */}
      <svg width={36} height={36}>
        {/* Pipe horizontal */}
        <rect x={0} y={15} width={36} height={6} rx={3} fill="#334155" />
        {/* Valve body */}
        <rect x={11} y={8} width={14} height={20} rx={3}
          fill={open ? openColor : '#475569'}
          style={{ transition: 'fill 0.3s' }}
        />
        {/* Handle */}
        <rect x={14} y={3} width={8} height={6} rx={2}
          fill={open ? openColor : '#64748b'}
          style={{ transition: 'fill 0.3s' }}
        />
        {/* Flow indicator */}
        {open && (
          <circle cx={18} cy={18} r={3} fill="white" opacity={0.8} />
        )}
      </svg>
      <div>
        <div style={{
          color: open ? openColor : '#64748b',
          fontWeight: 'bold',
          fontSize: 13,
          fontFamily: 'monospace',
          transition: 'color 0.3s',
        }}>
          {label}
          <span style={{
            marginLeft: 8,
            padding: '1px 6px',
            borderRadius: 4,
            background: open ? openColor + '22' : '#1e293b',
            fontSize: 11,
          }}>
            {open ? 'ABIERTA' : 'CERRADA'}
          </span>
        </div>
        <div style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>{description}</div>
      </div>
    </div>
  );
}
