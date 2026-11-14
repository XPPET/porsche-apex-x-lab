import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function MetricCard({
  label,
  value,
  unit,
  subtext,
  delta,
  accent = 'default', // 'carmine' | 'acid' | 'default'
}) {
  const { isDay } = useTheme();

  const accentPip = {
    carmine: 'bg-porsche-carmine',
    acid: isDay ? 'bg-emerald-600' : 'bg-porsche-acid',
    default: isDay ? 'bg-slate-400' : 'bg-zinc-600',
  }[accent] || (isDay ? 'bg-slate-400' : 'bg-zinc-600');

  return (
    <div className="studio-card rounded-xl p-5 relative overflow-hidden group">
      {/* Top row: Label & Delta */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className={`w-1.5 h-1.5 rounded-full ${accentPip}`} />
          <span className={`text-[11px] font-semibold tracking-wider uppercase ${
            isDay ? 'text-slate-600' : 'text-zinc-400'
          }`}>
            {label}
          </span>
        </div>
        {delta && (
          <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded border ${
            isDay ? 'text-slate-600 bg-slate-100 border-slate-200' : 'text-zinc-400 bg-white/[0.04] border-white/5'
          }`}>
            {delta}
          </span>
        )}
      </div>

      {/* Numerical display */}
      <div className="flex items-baseline space-x-1.5 mt-1">
        <span className={`text-2xl lg:text-3xl font-light tracking-tight font-mono num-tabular ${
          isDay ? 'text-slate-900 font-normal' : 'text-white'
        }`}>
          {value}
        </span>
        {unit && (
          <span className={`text-xs font-medium uppercase tracking-normal ${
            isDay ? 'text-slate-500' : 'text-zinc-400'
          }`}>
            {unit}
          </span>
        )}
      </div>

      {/* Subtext description */}
      {subtext && (
        <p className={`text-[12px] mt-2 font-normal truncate ${
          isDay ? 'text-slate-500' : 'text-zinc-500'
        }`}>
          {subtext}
        </p>
      )}
    </div>
  );
}
