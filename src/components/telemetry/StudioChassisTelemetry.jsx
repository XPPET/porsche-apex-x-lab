import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function StudioChassisTelemetry({
  brakeTemps,
  tirePressure,
  tireTemps,
  torqueVectoring,
}) {
  const { isDay } = useTheme();

  const getBrakeThermalClass = (temp) => {
    if (temp > 680) return 'text-porsche-carmine font-bold';
    if (temp > 520) return isDay ? 'text-amber-600 font-medium' : 'text-amber-400 font-medium';
    if (temp > 380) return isDay ? 'text-emerald-600 font-medium' : 'text-porsche-acid font-medium';
    return isDay ? 'text-slate-800' : 'text-zinc-300';
  };

  const renderWheelPod = (corner, label) => {
    const brakeT = brakeTemps[corner];
    const tireP = tirePressure[corner];
    const tireT = tireTemps[corner];
    const trq = torqueVectoring[corner];

    return (
      <div className={`p-3 rounded-xl border transition-all ${
        isDay
          ? 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300'
          : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'
      }`}>
        <div className={`flex justify-between items-center mb-2 pb-1.5 border-b ${
          isDay ? 'border-black/[0.06]' : 'border-white/[0.05]'
        }`}>
          <span className={`text-[11px] font-semibold tracking-wide ${
            isDay ? 'text-slate-900' : 'text-white'
          }`}>
            {label}
          </span>
          {trq > 0 && (
            <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border ${
              isDay
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                : 'text-porsche-acid bg-porsche-acid/10 border-porsche-acid/20'
            }`}>
              {trq}% PTV
            </span>
          )}
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center font-mono">
            <span className={`text-[10px] font-sans uppercase tracking-wider ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>Brake Rotor</span>
            <span className={`text-xs num-tabular font-semibold ${getBrakeThermalClass(brakeT)}`}>
              {brakeT} <span className="text-[10px] font-normal text-zinc-500">°C</span>
            </span>
          </div>

          <div className="flex justify-between items-center font-mono">
            <span className={`text-[10px] font-sans uppercase tracking-wider ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>Tire Pressure</span>
            <span className={`text-xs num-tabular ${isDay ? 'text-slate-800 font-medium' : 'text-zinc-200 font-medium'}`}>
              {typeof tireP === 'number' ? tireP.toFixed(2) : tireP} <span className="text-[10px] font-normal text-zinc-500">BAR</span>
              <span className={`text-[10px] ml-1.5 ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>
                ({(Number(tireP) * 14.5038).toFixed(1)} <span className="text-[9px]">PSI</span>)
              </span>
            </span>
          </div>

          <div className="flex justify-between items-center font-mono">
            <span className={`text-[10px] font-sans uppercase tracking-wider ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>Tire Carcass</span>
            <span className={`text-xs num-tabular ${isDay ? 'text-slate-800' : 'text-zinc-300'}`}>
              {tireT} <span className="text-[10px] font-normal text-zinc-500">°C</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* 4-Corner Layout */}
      <div className="grid grid-cols-2 gap-3">
        {renderWheelPod('fl', 'Front Left')}
        {renderWheelPod('fr', 'Front Right')}

        {/* Minimal Central Axle Bar */}
        <div className={`col-span-2 py-1 flex items-center justify-between text-[11px] px-2 font-mono ${
          isDay ? 'text-slate-400' : 'text-zinc-500'
        }`}>
          <span>FRONT AXLE</span>
          <span className={`font-sans text-[10px] uppercase tracking-wider ${isDay ? 'text-slate-600 font-medium' : 'text-zinc-400'}`}>
            PTV+ Differential Lock
          </span>
          <span>REAR AXLE</span>
        </div>

        {renderWheelPod('rl', 'Rear Left')}
        {renderWheelPod('rr', 'Rear Right')}
      </div>

      {/* Rear Axle Torque Vectoring Distribution Bar */}
      <div className={`p-3 rounded-xl border ${
        isDay ? 'bg-slate-50/80 border-slate-200/80' : 'bg-white/[0.02] border-white/[0.05]'
      }`}>
        <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
          <span className={`text-[11px] font-sans uppercase tracking-wider ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>Rear Torque Split (PTV+)</span>
          <span className={`font-mono text-xs num-tabular ${isDay ? 'text-slate-900' : 'text-white'}`}>
            <strong className={isDay ? 'text-slate-700' : 'text-zinc-300'}>{torqueVectoring.rl.toString().padStart(2, '0')}%</strong> <span className="text-[10px] text-zinc-500">L</span>
            <span className={`mx-1.5 ${isDay ? 'text-slate-300' : 'text-zinc-700'}`}>/</span>
            <strong className="text-porsche-carmine">{torqueVectoring.rr.toString().padStart(2, '0')}%</strong> <span className="text-[10px] text-porsche-carmine">R</span>
          </span>
        </div>
        <div className={`h-1.5 w-full rounded-full overflow-hidden flex ${isDay ? 'bg-slate-200' : 'bg-white/[0.06]'}`}>
          <div
            className={`h-full transition-all duration-150 ${isDay ? 'bg-slate-500' : 'bg-zinc-400'}`}
            style={{ width: `${torqueVectoring.rl}%` }}
          />
          <div
            className="h-full bg-porsche-carmine transition-all duration-150"
            style={{ width: `${torqueVectoring.rr}%` }}
          />
        </div>
      </div>
    </div>
  );
}
