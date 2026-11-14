import React from 'react';

/**
 * High-RPM 9,000 RPM Sci-Fi Motorsport Tachometer & Speedometer
 */
export default function TachometerGauge({
  rpm,
  maxRpm = 9000,
  speed,
  gear,
  throttle,
  brake,
}) {
  const rpmPercent = Math.min(100, Math.max(0, (rpm / maxRpm) * 100));

  // Shift light LED segments (10 segments)
  // 1-4 Green (6500-7500), 5-8 Amber (7500-8500), 9-10 Flashing Red (8500-9000)
  const shiftLeds = Array.from({ length: 12 }, (_, i) => {
    const thresholdRpm = 5500 + i * 290;
    const isLit = rpm >= thresholdRpm;
    let colorClass = 'bg-slate-800 border-white/5';

    if (isLit) {
      if (i < 4) {
        colorClass = 'bg-porsche-acid shadow-glow-acid border-porsche-acid';
      } else if (i < 9) {
        colorClass = 'bg-amber-400 shadow-[0_0_10px_#F59E0B] border-amber-400';
      } else {
        colorClass = 'bg-porsche-red shadow-glow-red border-porsche-red animate-pulse';
      }
    }
    return { id: i, isLit, colorClass };
  });

  // Calculate arc angles for circular tachometer
  // Arc spans 240 degrees (from 150° to 390°)
  const startAngle = 150;
  const totalAngle = 240;
  const currentAngle = startAngle + (rpmPercent / 100) * totalAngle;

  const radius = 95;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * (rpmPercent / 100) * (totalAngle / 360));

  return (
    <div className="flex flex-col items-center justify-center p-3 relative">
      {/* Shift Light Strip Banner */}
      <div className="w-full flex items-center justify-center space-x-1 mb-3 py-1 px-3 bg-black/60 rounded border border-white/10">
        <span className="text-[9px] font-mono text-slate-500 mr-1">SHIFT:</span>
        {shiftLeds.map((led) => (
          <div
            key={led.id}
            className={`w-3.5 h-2.5 rounded-xs border transition-all duration-75 ${led.colorClass}`}
          />
        ))}
      </div>

      {/* Main Circular Arc Gauge */}
      <div className="relative w-[230px] h-[210px] flex items-center justify-center">
        <svg className="w-full h-full -rotate-[150deg] overflow-visible" viewBox="0 0 240 240">
          {/* Background Track Arc */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${(totalAngle / 360) * circumference} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Active RPM Arc */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="transparent"
            stroke={rpm > 8500 ? '#E0001A' : rpm > 7200 ? '#F59E0B' : '#96FF00'}
            strokeWidth={strokeWidth}
            strokeDasharray={`${(totalAngle / 360) * circumference} ${circumference}`}
            strokeDashoffset={circumference * (1 - (rpmPercent / 100) * (totalAngle / 360))}
            strokeLinecap="round"
            className="transition-all duration-75"
          />
        </svg>

        {/* Center Display: Gear, Speed, RPM */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono select-none">
          {/* Current PDK Gear */}
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">PDK</span>
            <span className="text-4xl md:text-5xl font-black text-white text-glow-red">
              {gear}
            </span>
          </div>

          {/* Speed Display */}
          <div className="flex items-baseline space-x-1 -mt-1">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-100">
              {speed}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">KM/H</span>
          </div>

          {/* RPM numeric readout */}
          <div className="text-xs font-bold text-porsche-acid text-glow-acid mt-0.5">
            {rpm.toLocaleString()} <span className="text-[9px] text-slate-400">RPM</span>
          </div>

          {/* 9,000 RPM Redline Tag */}
          <div className="text-[9px] font-mono text-porsche-red uppercase tracking-wider mt-0.5">
            REDLINE 9,000
          </div>
        </div>
      </div>

      {/* Throttle & Brake Pedals Telemetry Bars */}
      <div className="w-full grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-white/10 font-mono">
        {/* Throttle */}
        <div className="p-2 rounded bg-white/5 border border-white/5">
          <div className="flex justify-between items-center text-[10px] mb-1">
            <span className="text-porsche-acid font-bold">THROTTLE</span>
            <span className="text-white font-bold">{throttle}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-lime-600 to-porsche-acid transition-all duration-75"
              style={{ width: `${throttle}%` }}
            />
          </div>
        </div>

        {/* Brake */}
        <div className="p-2 rounded bg-white/5 border border-white/5">
          <div className="flex justify-between items-center text-[10px] mb-1">
            <span className="text-porsche-red font-bold">BRAKE</span>
            <span className="text-white font-bold">{brake}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-700 to-porsche-red transition-all duration-75"
              style={{ width: `${brake}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
