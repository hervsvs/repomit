
import { useSimulation } from './hooks/useSimulation';
import { BasinVisual } from './components/BasinVisual';
import { ArcGauge } from './components/ConductivityGauge';
import { ValveIndicator } from './components/ValveIndicator';
import { ControlPanel } from './components/ControlPanel';
import { TimeChart } from './components/TimeChart';
import { StatusPanel } from './components/StatusPanel';
import './App.css';

export default function App() {
  const { state, params, history, running, setRunning, updateParam, reset } = useSimulation();

  return (
    <div className="app-root">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <svg width={28} height={28} viewBox="0 0 28 28" style={{ marginRight: 10 }}>
            <rect x={8} y={2} width={12} height={20} rx={3} fill="#1e40af" />
            <rect x={6} y={20} width={16} height={4} rx={2} fill="#1d4ed8" />
            <line x1={14} y1={2} x2={14} y2={6} stroke="#60a5fa" strokeWidth={2} />
            <circle cx={14} cy={12} r={3} fill="#93c5fd" />
            <path d="M 10 10 Q 14 6 18 10" stroke="#bfdbfe" strokeWidth={1.5} fill="none" />
          </svg>
          <div>
            <div className="header-title">Torre de Enfriamiento — Simulador</div>
            <div className="header-sub">Modelo de batea · evaporación · calidad de agua</div>
          </div>
        </div>
        <div className="header-controls">
          <button
            className={`btn ${running ? 'btn-warning' : 'btn-success'}`}
            onClick={() => setRunning(r => !r)}
          >
            {running ? '⏸ Pausar' : '▶ Reanudar'}
          </button>
          <button className="btn btn-ghost" onClick={reset}>↺ Reset</button>
          <div className={`status-dot ${running ? 'running' : 'paused'}`}>
            {running ? 'EN CURSO' : 'PAUSADO'}
          </div>
        </div>
      </header>

      {/* Main grid */}
      <main className="app-grid">

        {/* Column 1 — Basin + Valves */}
        <div className="col-basin">
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div className="section-label">Batea</div>
            <BasinVisual state={state} params={params} />
          </div>

          <div className="card">
            <div className="section-label" style={{ marginBottom: 12 }}>Válvulas</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <ValveIndicator
                open={state.blowdownOpen}
                label="Válvula rechazo"
                description={`Activa ≥ ${params.maxConductivity} μS/cm`}
                openColor="#ef4444"
              />
              <ValveIndicator
                open={state.makeupOpen}
                label="Válvula reposición"
                description={`Activa ≤ ${params.minLevel}% nivel`}
                openColor="#22c55e"
              />
            </div>
          </div>
        </div>

        {/* Column 2 — Gauges + Status */}
        <div className="col-gauges">
          <div className="card">
            <div className="section-label" style={{ marginBottom: 8 }}>Conductividad</div>
            <ArcGauge
              value={state.conductivity}
              max={params.maxConductivity * 1.2}
              threshold={params.maxConductivity}
              target={params.targetConductivity}
              label="Concentración en batea"
              unit="μS/cm"
            />
          </div>

          <div className="card">
            <div className="section-label" style={{ marginBottom: 8 }}>Evaporación</div>
            <ArcGauge
              value={state.evapRate * 60}
              max={15}
              threshold={10}
              target={6}
              label="Tasa de evaporación"
              unit="%/hora"
            />
          </div>

          <StatusPanel state={state} params={params} />
        </div>

        {/* Column 3 — Controls */}
        <div className="col-controls">
          <ControlPanel params={params} updateParam={updateParam} />
        </div>

        {/* Full-width chart row */}
        <div className="col-chart">
          <TimeChart history={history} params={params} />
        </div>

      </main>
    </div>
  );
}
