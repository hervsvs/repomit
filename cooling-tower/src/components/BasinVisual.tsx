import { useEffect, useRef } from 'react';
import type { SimState, SimParams } from '../simulation/engine';

interface Props {
  state: SimState;
  params: SimParams;
}

export function BasinVisual({ state, params }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const waveOffsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width;
    const H = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Basin shell
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, W, H);

      // Conductivity-based water color: blue → teal → orange → red
      const cond = state.conductivity;
      const maxC = params.maxConductivity;
      const ratio = Math.min(cond / maxC, 1);
      const r = Math.round(ratio < 0.5 ? ratio * 2 * 180 : 180 + (ratio - 0.5) * 2 * 75);
      const g = Math.round(ratio < 0.5 ? 150 - ratio * 2 * 50 : 100 - (ratio - 0.5) * 2 * 80);
      const b = Math.round(ratio < 0.5 ? 255 - ratio * 2 * 100 : 155 - (ratio - 0.5) * 2 * 155);
      const waterColor = `rgb(${r},${g},${b})`;
      const waterDark = `rgba(${r},${g},${b},0.6)`;

      const waterTop = H - (state.level / 100) * H;

      // Animated wave surface
      waveOffsetRef.current += 0.04;
      ctx.beginPath();
      ctx.moveTo(0, waterTop);
      for (let x = 0; x <= W; x += 4) {
        const y = waterTop + Math.sin(x * 0.03 + waveOffsetRef.current) * 3 +
                  Math.sin(x * 0.07 + waveOffsetRef.current * 1.3) * 1.5;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, waterTop, 0, H);
      grad.addColorStop(0, waterColor);
      grad.addColorStop(1, waterDark);
      ctx.fillStyle = grad;
      ctx.fill();

      // Level reference lines
      const drawLine = (pct: number, label: string, color: string, dash: number[]) => {
        const y = H - (pct / 100) * H;
        ctx.setLineDash(dash);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = color;
        ctx.font = '11px monospace';
        ctx.fillText(label, 4, y - 4);
      };
      drawLine(params.maxLevel, `MAX ${params.maxLevel}%`, '#22c55e', [6, 3]);
      drawLine(params.minLevel, `MIN ${params.minLevel}%`, '#f59e0b', [6, 3]);

      // Level % text in center
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${state.level.toFixed(1)}%`, W / 2, H / 2 + 10);
      ctx.font = '13px monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText('nivel batea', W / 2, H / 2 + 28);
      ctx.textAlign = 'left';

      // Bubbles when makeup is open
      if (state.makeupOpen) {
        ctx.fillStyle = 'rgba(100,200,255,0.4)';
        for (let i = 0; i < 5; i++) {
          const bx = 20 + i * 18 + Math.sin(waveOffsetRef.current + i) * 4;
          const by = waterTop + 8 + i * 6;
          ctx.beginPath();
          ctx.arc(bx, by, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [state, params]);

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={300}
      style={{ borderRadius: 8, border: '2px solid #334155' }}
    />
  );
}
