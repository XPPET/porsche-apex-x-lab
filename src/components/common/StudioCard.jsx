import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function StudioCard({
  title,
  subtitle,
  category,
  badge,
  badgeVariant = 'default', // 'default' | 'carmine' | 'acid'
  action,
  children,
  className = '',
  noPadding = false,
}) {
  const { isDay } = useTheme();

  const badgeClasses = {
    default: isDay ? 'text-slate-600 bg-slate-100 border-slate-200' : 'text-zinc-400 bg-white/[0.04] border-white/10',
    carmine: 'text-porsche-carmine bg-porsche-carmine/10 border-porsche-carmine/20',
    acid: isDay ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-porsche-acid bg-porsche-acid/10 border-porsche-acid/20',
  };

  return (
    <div className={`studio-card rounded-xl overflow-hidden relative ${className}`}>
      {(title || category) && (
        <div className={`flex items-center justify-between px-6 pt-5 pb-4 border-b ${
          isDay ? 'border-black/[0.06]' : 'border-white/[0.05]'
        }`}>
          <div>
            {category && (
              <span className={`text-[11px] font-semibold tracking-wider uppercase block mb-0.5 ${
                isDay ? 'text-slate-500' : 'text-zinc-500'
              }`}>
                {category}
              </span>
            )}
            <div className="flex items-center space-x-2.5">
              <h3 className={`text-sm font-semibold tracking-tight ${
                isDay ? 'text-slate-900' : 'text-white'
              }`}>
                {title}
              </h3>
              {badge && (
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${badgeClasses[badgeVariant] || badgeClasses.default}`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className={`text-xs mt-0.5 ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>
                {subtitle}
              </p>
            )}
          </div>

          {action && (
            <div className="flex items-center space-x-2">
              {action}
            </div>
          )}
        </div>
      )}

      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
}
