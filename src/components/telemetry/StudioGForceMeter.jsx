import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function StudioGForceMeter({ latG, lonG, gHistory = [] }) {
  const { isDay } = useTheme();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const size = canvas.width = canvas.height = 240;
    const center = size / 2;
    const maxG = 2.0;
    const radius = center - 22;

    ctx.clearRect(0, 0, size, size);

    // Subtle concentric circles (0.5G, 1.0G, 1.5G, 2.0G)
    const rings = [0.5, 1.0, 1.5, 2.0];
    rings.forEach((g) => {
      const r = (g / maxG) * radius;
      ctx.beginPath();
      ctx.arc(center, center, r, 0, Math.PI * 2);
      ctx.strokeStyle = g === 2.0
        ? 'rgba(213, 0, 28, 0.3)'
        : (isDay ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.06)');
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = isDay ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.25)';
      ctx.fillText(`${g}G`, center + 3, center - r + 9);
    });

    // Crosshairs
    ctx.strokeStyle = isDay ? 'rgba(0, 0, 0, 0.10)' : 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(center - radius, center);
    ctx.lineTo(center + radius, center);
    ctx.moveTo(center, center - radius);
    ctx.lineTo(center, center + radius);
    ctx.stroke();

    // Directional Markers
    ctx.font = '9px "Inter", sans-serif';
    ctx.fillStyle = isDay ? '#64748B' : '#64748B';
    ctx.fillText('ACCEL', center - 14, center - radius - 6);
    ctx.fillText('BRAKE', center - 14, center + radius + 14);
    ctx.fillText('L', center - radius - 12, center + 3);
    ctx.fillText('R', center + radius + 6, center + 3);

    // History Trail
    gHistory.forEach((pt, idx) => {
      const px = center + (pt.lat / maxG) * radius;
      const py = center - (pt.lon / maxG) * radius;
      const alpha = (idx / gHistory.length) * 0.45;

      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = isDay ? `rgba(16, 185, 129, ${alpha})` : `rgba(148, 224, 0, ${alpha})`;
      ctx.fill();
    });

    // Current Acceleration Point
    const currentX = center + (latG / maxG) * radius;
    const currentY = center - (lonG / maxG) * radius;

    // High-contrast glowing live acceleration point (Porsche Acid Green in Night / Carmine Red in Day)
    const glowColor = isDay ? '#D5001C' : '#94E000';

    // Connecting acceleration vector
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = isDay ? 'rgba(213, 0, 28, 0.45)' : 'rgba(148, 224, 0, 0.50)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Outer luminous halo
    const haloGrad = ctx.createRadialGradient(currentX, currentY, 1, currentX, currentY, 12);
    haloGrad.addColorStop(0, isDay ? 'rgba(213, 0, 28, 0.45)' : 'rgba(148, 224, 0, 0.50)');
    haloGrad.addColorStop(0.5, isDay ? 'rgba(213, 0, 28, 0.15)' : 'rgba(148, 224, 0, 0.18)');
    haloGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(currentX, currentY, 12, 0, Math.PI * 2);
    ctx.fill();

    // High-contrast border ring
    ctx.beginPath();
    ctx.arc(currentX, currentY, 5.5, 0, Math.PI * 2);
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Intense vibrant core pip
    ctx.beginPath();
    ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
    ctx.fillStyle = glowColor;
    ctx.fill();

    // Ultra-bright specular highlight dot
    ctx.beginPath();
    ctx.arc(currentX, currentY, 1, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  }, [latG, lonG, gHistory, isDay]);

  const totalG = Math.sqrt(latG * latG + lonG * lonG).toFixed(2);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <canvas ref={canvasRef} className="block w-[220px] h-[220px]" />
      </div>

      <div className={`w-full grid grid-cols-3 gap-2 mt-3 pt-3 border-t text-center font-mono ${
        isDay ? 'border-black/[0.06]' : 'border-white/[0.06]'
      }`}>
        <div className={`p-2 rounded-lg border ${
          isDay ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/[0.04]'
        }`}>
          <div className={`text-[10px] font-sans ${isDay ? 'text-slate-500' : 'text-zinc-500'}`}>LATERAL</div>
          <div className={`text-xs font-semibold mt-0.5 num-tabular ${isDay ? 'text-slate-900' : 'text-white'}`}>
            {latG > 0 ? `+${latG}` : latG} G
          </div>
        </div>
        <div className={`p-2 rounded-lg border ${
          isDay ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/[0.04]'
        }`}>
          <div className={`text-[10px] font-sans ${isDay ? 'text-slate-500' : 'text-zinc-500'}`}>LONGITUDINAL</div>
          <div className={`text-xs font-semibold mt-0.5 num-tabular ${isDay ? 'text-slate-900' : 'text-white'}`}>
            {lonG > 0 ? `+${lonG}` : lonG} G
          </div>
        </div>
        <div className={`p-2 rounded-lg border ${
          isDay ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/[0.04]'
        }`}>
          <div className={`text-[10px] font-sans ${isDay ? 'text-slate-500' : 'text-zinc-500'}`}>TOTAL G</div>
          <div className="text-xs font-semibold text-porsche-carmine mt-0.5 num-tabular">
            {totalG} G
          </div>
        </div>
      </div>
    </div>
  );
}
