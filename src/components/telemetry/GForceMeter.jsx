import React, { useRef, useEffect } from 'react';

/**
 * High-Precision Friction Circle / G-Force Scatter Plot (GG Diagram)
 * Visualizes lateral (-2G to +2G) and longitudinal (-2G to +2G) acceleration
 */
export default function GForceMeter({ latG, lonG, gHistory = [] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const size = canvas.width = canvas.height = 280;
    const center = size / 2;
    const maxG = 2.0; // Scale: edge of circle is 2.0 G
    const radius = center - 24;

    ctx.clearRect(0, 0, size, size);

    // 1. Concentric G-circles (0.5G, 1.0G, 1.5G, 2.0G)
    const gRings = [0.5, 1.0, 1.5, 2.0];
    gRings.forEach((g) => {
      const r = (g / maxG) * radius;
      ctx.beginPath();
      ctx.arc(center, center, r, 0, Math.PI * 2);
      ctx.strokeStyle = g === 2.0 ? 'rgba(224, 0, 26, 0.4)' : g === 1.5 ? 'rgba(150, 255, 0, 0.3)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = g === 2.0 ? 1.5 : 1;
      ctx.stroke();

      // G label
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = g === 2.0 ? 'rgba(224, 0, 26, 0.7)' : 'rgba(255, 255, 255, 0.3)';
      ctx.fillText(`${g}G`, center + 3, center - r + 9);
    });

    // 2. Crosshair Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    // Horizontal (Lateral axis)
    ctx.beginPath();
    ctx.moveTo(center - radius, center);
    ctx.lineTo(center + radius, center);
    ctx.stroke();
    // Vertical (Longitudinal axis)
    ctx.beginPath();
    ctx.moveTo(center, center - radius);
    ctx.lineTo(center, center + radius);
    ctx.stroke();

    // Directional Labels
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('ACCEL (+LON)', center - 28, center - radius - 8);
    ctx.fillText('BRAKE (-LON)', center - 28, center + radius + 15);
    ctx.fillText('L (-LAT)', center - radius - 18, center + 3);
    ctx.fillText('R (+LAT)', center + radius + 6, center + 3);

    // 3. Draw History Trail (Fading Scatter Glow)
    gHistory.forEach((pt, idx) => {
      const px = center + (pt.lat / maxG) * radius;
      const py = center - (pt.lon / maxG) * radius;
      const alpha = (idx / gHistory.length) * 0.6;

      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150, 255, 0, ${alpha})`;
      ctx.fill();
    });

    // 4. Current Instantaneous G Point
    const currentX = center + (latG / maxG) * radius;
    const currentY = center - (lonG / maxG) * radius;

    // Glowing halo
    const glowGrad = ctx.createRadialGradient(currentX, currentY, 2, currentX, currentY, 16);
    glowGrad.addColorStop(0, 'rgba(224, 0, 26, 0.9)');
    glowGrad.addColorStop(0.5, 'rgba(224, 0, 26, 0.4)');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(currentX, currentY, 16, 0, Math.PI * 2);
    ctx.fill();

    // Solid core dot
    ctx.beginPath();
    ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#E0001A';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Connecting vector line from center
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = 'rgba(224, 0, 26, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [latG, lonG, gHistory]);

  const totalG = Math.sqrt(latG * latG + lonG * lonG).toFixed(2);

  return (
    <div className="flex flex-col items-center">
      {/* Canvas friction circle */}
      <div className="relative">
        <canvas ref={canvasRef} className="block w-[240px] h-[240px] md:w-[260px] md:h-[260px]" />
      </div>

      {/* Numeric G-Force Readouts */}
      <div className="w-full grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/10 text-center font-mono">
        <div className="p-1.5 rounded bg-white/5 border border-white/5">
          <div className="text-[10px] text-slate-400">LATERAL</div>
          <div className={`text-sm font-bold ${latG > 0 ? 'text-porsche-acid' : 'text-porsche-cyan'}`}>
            {latG > 0 ? `+${latG}` : latG} G
          </div>
        </div>
        <div className="p-1.5 rounded bg-white/5 border border-white/5">
          <div className="text-[10px] text-slate-400">LONGITUDINAL</div>
          <div className={`text-sm font-bold ${lonG > 0 ? 'text-porsche-acid' : 'text-porsche-red'}`}>
            {lonG > 0 ? `+${lonG}` : lonG} G
          </div>
        </div>
        <div className="p-1.5 rounded bg-white/5 border border-white/5">
          <div className="text-[10px] text-slate-400">COMBINED</div>
          <div className="text-sm font-bold text-white text-glow-red">
            {totalG} G
          </div>
        </div>
      </div>
    </div>
  );
}
