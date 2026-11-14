import React from 'react';

export default function HudCard({
  title,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = 'text-porsche-acid border-porsche-acid/30 bg-porsche-acid/10',
  accentColor = 'red', // 'red' | 'acid' | 'cyan' | 'neutral'
  children,
  className = '',
  headerAction,
}) {
  const bracketClass = 
    accentColor === 'acid' ? 'hud-bracket-acid' : 
    accentColor === 'cyan' ? 'hud-bracket-cyan' : 
    accentColor === 'neutral' ? '' : 'hud-bracket';

  const panelClass =
    accentColor === 'acid' ? 'hud-panel-acid' :
    accentColor === 'red' ? 'hud-panel-red' :
    'hud-panel';

  const titleGlow =
    accentColor === 'acid' ? 'text-glow-acid' :
    accentColor === 'cyan' ? 'text-glow-cyan' :
    accentColor === 'red' ? 'text-glow-red' : '';

  return (
    <div className={`relative rounded-sm overflow-hidden p-4 md:p-5 ${panelClass} ${bracketClass} ${className}`}>
      {/* Corner decorative tick marks */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20 pointer-events-none" />

      {/* Header section if title provided */}
      {title && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            {Icon && (
              <div className={`p-1.5 rounded bg-white/5 border border-white/10 ${accentColor === 'acid' ? 'text-porsche-acid' : accentColor === 'red' ? 'text-porsche-red' : 'text-porsche-cyan'}`}>
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h3 className={`font-mono text-sm md:text-base font-bold tracking-wider uppercase text-slate-100 ${titleGlow}`}>
                  {title}
                </h3>
                {badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${badgeColor}`}>
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-[11px] font-mono text-slate-400 tracking-wide mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {headerAction && (
            <div className="flex items-center space-x-2">
              {headerAction}
            </div>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
