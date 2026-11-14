import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function StudioPowertrainControls({
  iceWeight,
  setIceWeight,
  evWeight,
  setEvWeight,
  powerMode,
  setPowerMode,
  iceFuelLoad,
  setIceFuelLoad,
  evBatterySoc,
  setEvBatterySoc,
}) {
  const { isDay } = useTheme();

  const handlePowerMode = (mode) => {
    setPowerMode(mode);
  };

  const resetSpecs = () => {
    setIceWeight(1450);
    setEvWeight(2220);
    setPowerMode('attack');
    setIceFuelLoad(50);
    setEvBatterySoc(95);
  };

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className={`flex items-center justify-between pb-3 border-b ${isDay ? 'border-black/[0.06]' : 'border-white/[0.06]'}`}>
        <span className={`text-[11px] font-semibold tracking-wider uppercase ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>
          Chassis & Power Parameters
        </span>
        <button
          onClick={resetSpecs}
          className={`text-xs flex items-center space-x-1 transition-colors ${
            isDay ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          <span>Reset OEM Specs</span>
        </button>
      </div>

      {/* EV Power Delivery Mode Selection */}
      <div className="space-y-2">
        <label className={`text-xs font-medium ${isDay ? 'text-slate-700' : 'text-zinc-300'}`}>
          EV Power Output Configuration
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handlePowerMode('attack')}
            className={`py-2 px-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
              powerMode === 'attack'
                ? (isDay ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm' : 'bg-porsche-acid/15 border-porsche-acid text-white')
                : (isDay ? 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900' : 'bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:text-white')
            }`}
          >
            <div className={`font-semibold ${isDay && powerMode === 'attack' ? 'text-emerald-900' : (isDay ? 'text-slate-900' : 'text-white')}`}>Attack Mode</div>
            <div className={`text-[10px] font-mono mt-0.5 ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>1,108 PS / 1,340 Nm</div>
          </button>

          <button
            onClick={() => handlePowerMode('track')}
            className={`py-2 px-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
              powerMode === 'track'
                ? (isDay ? 'bg-white border-slate-300 text-slate-900 shadow-sm' : 'bg-white/15 border-white/20 text-white')
                : (isDay ? 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900' : 'bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:text-white')
            }`}
          >
            <div className={`font-semibold ${isDay ? 'text-slate-900' : 'text-white'}`}>Track Mode</div>
            <div className={`text-[10px] font-mono mt-0.5 ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>850 PS / 1,180 Nm</div>
          </button>

          <button
            onClick={() => handlePowerMode('endurance')}
            className={`py-2 px-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
              powerMode === 'endurance'
                ? (isDay ? 'bg-white border-slate-300 text-slate-900 shadow-sm' : 'bg-white/15 border-white/20 text-white')
                : (isDay ? 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900' : 'bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:text-white')
            }`}
          >
            <div className={`font-semibold ${isDay ? 'text-slate-900' : 'text-white'}`}>Endurance</div>
            <div className={`text-[10px] font-mono mt-0.5 ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>760 PS / 1,050 Nm</div>
          </button>
        </div>
      </div>

      {/* Weight Adjustments */}
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className={`text-xs font-medium ${isDay ? 'text-slate-700' : 'text-zinc-300'}`}>
              911 GT3 RS Curb Weight
            </label>
            <span className={`font-mono text-sm font-semibold num-tabular ${isDay ? 'text-slate-900' : 'text-white'}`}>
              {iceWeight} <span className={`text-[11px] font-normal ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>KG</span>
            </span>
          </div>
          <input
            type="range"
            min="1350"
            max="1600"
            step="10"
            value={iceWeight}
            onChange={(e) => setIceWeight(Number(e.target.value))}
            className="w-full studio-slider studio-slider-carmine cursor-pointer"
          />
          <div className={`flex justify-between text-[10px] font-mono ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>
            <span>1,350 kg (Clubsport)</span>
            <span>1,450 kg (OEM)</span>
            <span>1,600 kg</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className={`text-xs font-medium ${isDay ? 'text-slate-700' : 'text-zinc-300'}`}>
              Taycan Turbo GT Weight
            </label>
            <span className={`font-mono text-sm font-semibold num-tabular ${isDay ? 'text-slate-900' : 'text-white'}`}>
              {evWeight} <span className={`text-[11px] font-normal ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>KG</span>
            </span>
          </div>
          <input
            type="range"
            min="2050"
            max="2450"
            step="10"
            value={evWeight}
            onChange={(e) => setEvWeight(Number(e.target.value))}
            className="w-full studio-slider studio-slider-acid cursor-pointer"
          />
          <div className={`flex justify-between text-[10px] font-mono ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>
            <span>2,050 kg (Carbon Spec)</span>
            <span>2,220 kg (Weissach)</span>
            <span>2,450 kg</span>
          </div>
        </div>
      </div>

      {/* Fuel Load & Battery SOC */}
      <div className={`grid grid-cols-2 gap-4 pt-2 border-t ${isDay ? 'border-black/[0.06]' : 'border-white/[0.06]'}`}>
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className={`text-xs font-medium ${isDay ? 'text-slate-700' : 'text-zinc-300'}`}>
              Fuel Tank Load
            </label>
            <span className={`font-mono text-xs font-medium ${isDay ? 'text-slate-900' : 'text-white'}`}>
              {iceFuelLoad}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={iceFuelLoad}
            onChange={(e) => setIceFuelLoad(Number(e.target.value))}
            className="w-full studio-slider cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className={`text-xs font-medium ${isDay ? 'text-slate-700' : 'text-zinc-300'}`}>
              Battery SOC
            </label>
            <span className={`font-mono text-xs font-medium ${isDay ? 'text-emerald-700 font-semibold' : 'text-porsche-acid'}`}>
              {evBatterySoc}%
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={evBatterySoc}
            onChange={(e) => setEvBatterySoc(Number(e.target.value))}
            className="w-full studio-slider studio-slider-acid cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
