import React from 'react';
import { Sliders, Zap, Fuel, BatteryCharging, Weight, RotateCcw } from 'lucide-react';

export default function PowertrainControls({
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
  const handlePowerModeChange = (mode) => {
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
    <div className="space-y-4">
      {/* Header action */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center">
          <Sliders className="w-3.5 h-3.5 mr-1 text-porsche-cyan" /> POWERTRAIN & CHASSIS TUNING
        </span>
        <button
          onClick={resetSpecs}
          className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center space-x-1"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          <span>RESET TO OEM SPECS</span>
        </button>
      </div>

      {/* EV Power Delivery / Attack Mode Selector */}
      <div className="p-3 rounded border border-white/10 bg-white/[0.02]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center">
            <Zap className="w-3.5 h-3.5 mr-1.5 text-porsche-acid" /> EV Power Delivery Mode
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-porsche-acid/10 border border-porsche-acid/30 text-porsche-acid font-bold">
            {powerMode === 'attack' ? '1,108 PS (OVERBOOST)' : powerMode === 'track' ? '850 PS (DYNAMIC)' : '760 PS (CONTINUOUS)'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handlePowerModeChange('attack')}
            className={`py-2 px-2 rounded border font-mono text-xs text-center transition-all ${
              powerMode === 'attack'
                ? 'bg-porsche-acid text-black border-porsche-acid font-extrabold shadow-glow-acid'
                : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
            }`}
          >
            ATTACK MODE
            <div className="text-[9px] opacity-80">1,108 PS / 1,340 Nm</div>
          </button>
          <button
            onClick={() => handlePowerModeChange('track')}
            className={`py-2 px-2 rounded border font-mono text-xs text-center transition-all ${
              powerMode === 'track'
                ? 'bg-porsche-cyan text-black border-porsche-cyan font-extrabold shadow-glow-cyan'
                : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
            }`}
          >
            TRACK MODE
            <div className="text-[9px] opacity-80">850 PS / 1,180 Nm</div>
          </button>
          <button
            onClick={() => handlePowerModeChange('endurance')}
            className={`py-2 px-2 rounded border font-mono text-xs text-center transition-all ${
              powerMode === 'endurance'
                ? 'bg-white/30 text-white border-white font-extrabold'
                : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
            }`}
          >
            ENDURANCE
            <div className="text-[9px] opacity-80">760 PS / 1,050 Nm</div>
          </button>
        </div>
      </div>

      {/* Sliders Grid: Weights & Fuel/SOC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* ICE 911 GT3 RS Weight Slider */}
        <div className="p-3 rounded border border-porsche-red/25 bg-porsche-red/[0.03]">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-mono font-semibold text-red-200 uppercase tracking-wider flex items-center">
              <Weight className="w-3.5 h-3.5 mr-1 text-porsche-red" /> 911 GT3 RS Curb Weight
            </span>
            <span className="text-sm font-mono font-bold text-porsche-red">
              {iceWeight} kg
            </span>
          </div>
          <input
            type="range"
            min="1350"
            max="1600"
            step="10"
            value={iceWeight}
            onChange={(e) => setIceWeight(Number(e.target.value))}
            className="w-full hud-slider-red cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>1,350 kg (CLUBSPORT)</span>
            <span>1,450 kg (OEM)</span>
            <span>1,600 kg (BALLAST)</span>
          </div>
        </div>

        {/* EV Taycan Turbo GT Weight Slider */}
        <div className="p-3 rounded border border-porsche-acid/25 bg-porsche-acid/[0.03]">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-mono font-semibold text-lime-200 uppercase tracking-wider flex items-center">
              <Weight className="w-3.5 h-3.5 mr-1 text-porsche-acid" /> Taycan Turbo GT Weight
            </span>
            <span className="text-sm font-mono font-bold text-porsche-acid">
              {evWeight} kg
            </span>
          </div>
          <input
            type="range"
            min="2050"
            max="2450"
            step="10"
            value={evWeight}
            onChange={(e) => setEvWeight(Number(e.target.value))}
            className="w-full hud-slider-acid cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>2,050 kg (CARBON SPEC)</span>
            <span>2,220 kg (WEISSACH)</span>
            <span>2,450 kg (LOADED)</span>
          </div>
        </div>

        {/* ICE Fuel Load Slider */}
        <div className="p-3 rounded border border-white/10 bg-white/[0.02]">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center">
              <Fuel className="w-3.5 h-3.5 mr-1 text-slate-400" /> GT3 RS Fuel Tank Load
            </span>
            <span className="text-sm font-mono font-bold text-white">
              {iceFuelLoad}% ({Math.round(iceFuelLoad * 0.64)} L)
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={iceFuelLoad}
            onChange={(e) => setIceFuelLoad(Number(e.target.value))}
            className="w-full hud-slider-red cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>10% (QUALIFYING FUEL)</span>
            <span>100% (FULL 64L TANK)</span>
          </div>
        </div>

        {/* EV Battery SOC Slider */}
        <div className="p-3 rounded border border-white/10 bg-white/[0.02]">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center">
              <BatteryCharging className="w-3.5 h-3.5 mr-1 text-porsche-acid" /> Taycan Battery SOC
            </span>
            <span className="text-sm font-mono font-bold text-porsche-acid">
              {evBatterySoc}% ({Math.round(evBatterySoc * 0.97)} kWh)
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={evBatterySoc}
            onChange={(e) => setEvBatterySoc(Number(e.target.value))}
            className="w-full hud-slider-acid cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>20% (DERATED)</span>
            <span>95%+ (OPTIMAL 800V DISCHARGE)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
