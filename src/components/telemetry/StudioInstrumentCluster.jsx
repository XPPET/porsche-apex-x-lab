import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function StudioInstrumentCluster({
  rpm,
  maxRpm = 9000,
  speed,
  gear,
  throttle,
  brake,
}) {
  const { isDay } = useTheme();
  const rpmPercent = Math.min(100, Math.max(0, (rpm / maxRpm) * 100));

  const shiftSegments = Array.from({ length: 10 }, (_, i) => {
    const threshold = 6000 + i * 300;
    const isLit = rpm >= threshold;
    let colorClass = isDay ? 'bg-slate-200' : 'bg-white/[0.06]';

    if (isLit) {
      if (i < 5) {
        colorClass = isDay ? 'bg-emerald-600' : 'bg-porsche-acid';
      } else if (i < 8) {
        colorClass = 'bg-amber-400';
      } else {
        colorClass = 'bg-porsche-carmine animate-pulse';
      }
    }
    return { id: i, isLit, colorClass };
  });

  const radius = 88;
  const strokeWidth = 8;
  const totalAngle = 220;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - (rpmPercent / 100) * (totalAngle / 360));

  return (
    <div className="flex flex-col items-center justify-center p-2">
      {/* Shift Light Strip */}
      <div className="w-full flex items-center justify-center space-x-1 mb-2">
        {shiftSegments.map((seg) => (
          <div
            key={seg.id}
            className={`w-3.5 h-1.5 rounded-sm transition-all duration-75 ${seg.colorClass}`}
          />
        ))}
      </div>

      {/* Main Tachometer Gauge Arc */}
      <div className="relative w-[220px] h-[195px] flex items-center justify-center">
        <svg className="w-full h-full -rotate-[160deg] overflow-visible" viewBox="0 0 220 220">
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="transparent"
            stroke={isDay ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.06)"}
            strokeWidth={strokeWidth}
            strokeDasharray={`${(totalAngle / 360) * circumference} ${circumference}`}
            strokeLinecap="round"
          />

          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="transparent"
            stroke={rpm > 8500 ? '#D5001C' : (isDay ? '#0F172A' : '#FFFFFF')}
            strokeWidth={strokeWidth}
            strokeDasharray={`${(totalAngle / 360) * circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-75"
          />
        </svg>

        {/* Center Digital Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <div className={`text-[10px] font-semibold tracking-widest uppercase ${
            isDay ? 'text-slate-400' : 'text-zinc-500'
          }`}>
            PDK GEAR
          </div>
          <div className={`text-4xl font-bold tracking-tight -my-1 font-mono ${
            isDay ? 'text-slate-900' : 'text-white'
          }`}>
            {gear}
          </div>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className={`text-2xl font-light font-mono num-tabular ${
              isDay ? 'text-slate-900 font-normal' : 'text-white'
            }`}>
              {speed}
            </span>
            <span className={`text-[10px] font-medium ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>KM/H</span>
          </div>
          <div className={`text-[11px] font-mono mt-0.5 num-tabular ${
            isDay ? 'text-slate-600' : 'text-zinc-400'
          }`}>
            {rpm.toLocaleString()} <span className={`text-[9px] ${isDay ? 'text-slate-400' : 'text-zinc-600'}`}>RPM</span>
          </div>
        </div>
      </div>

      {/* Throttle & Brake Horizontal Telemetry Meters */}
      <div className={`w-full grid grid-cols-2 gap-3 mt-1 pt-3 border-t ${
        isDay ? 'border-black/[0.06]' : 'border-white/[0.06]'
      }`}>
        <div>
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className={isDay ? 'text-slate-500' : 'text-zinc-400'}>Throttle</span>
            <span className={`font-mono text-xs num-tabular ${isDay ? 'text-slate-900 font-semibold' : 'text-white'}`}>{throttle}%</span>
          </div>
          <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDay ? 'bg-slate-200' : 'bg-white/[0.06]'}`}>
            <div
              className={`h-full rounded-full transition-all duration-75 ${isDay ? 'bg-emerald-600' : 'bg-porsche-acid'}`}
              style={{ width: `${throttle}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className={isDay ? 'text-slate-500' : 'text-zinc-400'}>Brake</span>
            <span className={`font-mono text-xs num-tabular ${isDay ? 'text-slate-900 font-semibold' : 'text-white'}`}>{brake}%</span>
          </div>
          <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDay ? 'bg-slate-200' : 'bg-white/[0.06]'}`}>
            <div
              className="h-full bg-porsche-carmine rounded-full transition-all duration-75"
              style={{ width: `${brake}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
