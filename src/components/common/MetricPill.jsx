import React from 'react';

export default function MetricPill({
  label,
  value,
  unit,
  subtext,
  delta,
  variant = 'neutral', // 'red' | 'acid' | 'cyan' | 'neutral'
  icon: Icon,
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  const colorMap = {
    red: {
      text: 'text-porsche-red text-glow-red',
      border: 'border-porsche-red/30',
      bg: 'bg-porsche-red/5',
      badge: 'text-porsche-red bg-porsche-red/10 border-porsche-red/30',
    },
    acid: {
      text: 'text-porsche-acid text-glow-acid',
      border: 'border-porsche-acid/30',
      bg: 'bg-porsche-acid/5',
      badge: 'text-porsche-acid bg-porsche-acid/10 border-porsche-acid/30',
    },
    cyan: {
      text: 'text-porsche-cyan text-glow-cyan',
      border: 'border-porsche-cyan/30',
      bg: 'bg-porsche-cyan/5',
      badge: 'text-porsche-cyan bg-porsche-cyan/10 border-porsche-cyan/30',
    },
    neutral: {
      text: 'text-slate-100',
      border: 'border-white/10',
      bg: 'bg-white/5',
      badge: 'text-slate-300 bg-white/5 border-white/10',
    }
  };

  const c = colorMap[variant] || colorMap.neutral;

  const valueSizeClass =
    size === 'lg' ? 'text-3xl md:text-4xl' :
    size === 'sm' ? 'text-lg md:text-xl' :
    'text-2xl md:text-3xl';

  return (
    <div className={`p-3.5 rounded border ${c.border} ${c.bg} backdrop-blur-sm relative overflow-hidden transition-all duration-200 hover:border-white/30`}>
      {/* Background digital grid subtle accent */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center space-x-1.5">
          {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-slate-400">
            {label}
          </span>
        </div>
        {delta !== undefined && (
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${delta > 0 ? 'text-porsche-acid border-porsche-acid/30 bg-porsche-acid/10' : delta < 0 ? 'text-porsche-red border-porsche-red/30 bg-porsche-red/10' : 'text-slate-400 border-white/10'}`}>
            {delta > 0 ? `+${delta}` : delta}
          </span>
        )}
      </div>

      <div className="flex items-baseline space-x-1.5 font-mono">
        <span className={`font-bold tracking-tight ${valueSizeClass} ${c.text}`}>
          {value}
        </span>
        {unit && (
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {unit}
          </span>
        )}
      </div>

      {subtext && (
        <div className="mt-1 text-[11px] font-mono text-slate-400 truncate">
          {subtext}
        </div>
      )}
    </div>
  );
}
