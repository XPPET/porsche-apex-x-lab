import React from 'react';
import { Sliders, Gauge, Shield, ArrowDownUp, Zap, RotateCcw } from 'lucide-react';

export default function AeroSliders({
  wingAngle,
  setWingAngle,
  rideHeight,
  setRideHeight,
  airSpeedKmh,
  setAirSpeedKmh,
  drsActive,
  setDrsActive,
}) {
  const handleWingChange = (val) => {
    setWingAngle(Number(val));
  };

  const handleRideHeightChange = (val) => {
    setRideHeight(Number(val));
  };

  const handleSpeedChange = (val) => {
    setAirSpeedKmh(Number(val));
  };

  const toggleDrs = () => {
    setDrsActive(!drsActive);
  };

  const applyPreset = (preset) => {
    if (preset === 'maxDownforce') {
      setWingAngle(25);
      setRideHeight(-15);
      setAirSpeedKmh(240);
      setDrsActive(false);
    } else if (preset === 'topSpeed') {
      setWingAngle(2);
      setRideHeight(-5);
      setAirSpeedKmh(295);
      setDrsActive(true);
    } else if (preset === 'balanced') {
      setWingAngle(12);
      setRideHeight(-10);
      setAirSpeedKmh(200);
      setDrsActive(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Quick Aero Presets */}
      <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-white/10">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mr-1 flex items-center">
          <Sliders className="w-3 h-3 mr-1 text-porsche-acid" /> CONFIG PRESETS:
        </span>
        <button
          onClick={() => applyPreset('maxDownforce')}
          className="px-2.5 py-1 text-xs font-mono rounded border border-porsche-red/40 bg-porsche-red/10 text-red-200 hover:bg-porsche-red/25 transition-all hover:border-porsche-red"
        >
          MAX DOWNFORCE
        </button>
        <button
          onClick={() => applyPreset('topSpeed')}
          className="px-2.5 py-1 text-xs font-mono rounded border border-porsche-acid/40 bg-porsche-acid/10 text-lime-200 hover:bg-porsche-acid/25 transition-all hover:border-porsche-acid"
        >
          LOW DRAG / V-MAX
        </button>
        <button
          onClick={() => applyPreset('balanced')}
          className="px-2.5 py-1 text-xs font-mono rounded border border-porsche-cyan/40 bg-porsche-cyan/10 text-cyan-200 hover:bg-porsche-cyan/25 transition-all hover:border-porsche-cyan"
        >
          BALANCED TRACK
        </button>
      </div>

      {/* Slider 1: Rear Wing Angle (0° to 25°) */}
      <div className="p-3.5 rounded border border-white/10 bg-white/[0.02]">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Rear Wing Attack Angle (AoA)
            </span>
          </div>
          <div className="flex items-baseline space-x-1 font-mono">
            <span className="text-xl font-bold text-porsche-red text-glow-red">
              {wingAngle}°
            </span>
            <span className="text-[10px] text-slate-400 uppercase">DEG</span>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="25"
          step="1"
          value={wingAngle}
          onChange={(e) => handleWingChange(e.target.value)}
          className="w-full hud-slider-red cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
          <span>0° (LOW DRAG)</span>
          <span>12° (NEUTRAL)</span>
          <span>25° (MAX VERTICAL LOAD)</span>
        </div>
      </div>

      {/* Slider 2: Ride Height (-20mm to +20mm) */}
      <div className="p-3.5 rounded border border-white/10 bg-white/[0.02]">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Chassis Ride Height (Ground Effect)
            </span>
          </div>
          <div className="flex items-baseline space-x-1 font-mono">
            <span className="text-xl font-bold text-porsche-acid text-glow-acid">
              {rideHeight > 0 ? `+${rideHeight}` : rideHeight}
            </span>
            <span className="text-[10px] text-slate-400 uppercase">MM</span>
          </div>
        </div>
        <input
          type="range"
          min="-20"
          max="20"
          step="1"
          value={rideHeight}
          onChange={(e) => handleRideHeightChange(e.target.value)}
          className="w-full hud-slider-acid cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
          <span>-20mm (GROUND EFFECT SUCTION)</span>
          <span>0mm (NOMINAL)</span>
          <span>+20mm (HIGH CLEARANCE)</span>
        </div>
      </div>

      {/* Slider 3: Air Speed (100 to 300 km/h) */}
      <div className="p-3.5 rounded border border-white/10 bg-white/[0.02]">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Tunnel Air Velocity (Flow Speed)
            </span>
          </div>
          <div className="flex items-baseline space-x-1 font-mono">
            <span className="text-xl font-bold text-porsche-cyan text-glow-cyan">
              {airSpeedKmh}
            </span>
            <span className="text-[10px] text-slate-400 uppercase">KM/H</span>
          </div>
        </div>
        <input
          type="range"
          min="100"
          max="300"
          step="5"
          value={airSpeedKmh}
          onChange={(e) => handleSpeedChange(e.target.value)}
          className="w-full hud-slider-red cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
          <span>100 km/h (LOW CORNER)</span>
          <span>200 km/h (HIGH SWEEPER)</span>
          <span>300 km/h (DÖTTINGER HÖHE)</span>
        </div>
      </div>

      {/* Active DRS Toggle & Actuator */}
      <div className="p-3.5 rounded border border-white/10 bg-gradient-to-r from-black/60 to-white/[0.03] flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Zap className={`w-4 h-4 ${drsActive ? 'text-porsche-acid animate-pulse' : 'text-slate-400'}`} />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-200">
              DRS (Drag Reduction System)
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            Hydraulically flattens rear wing blade to minimize drag
          </p>
        </div>

        <button
          onClick={toggleDrs}
          className={`px-4 py-2 rounded font-mono font-bold text-xs tracking-wider border transition-all duration-200 flex items-center space-x-2 ${
            drsActive 
              ? 'bg-porsche-acid text-black border-porsche-acid shadow-glow-acid' 
              : 'bg-white/5 border-white/20 text-slate-300 hover:text-white hover:border-white/40'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${drsActive ? 'bg-black animate-ping' : 'bg-slate-500'}`} />
          <span>{drsActive ? 'DRS DEPLOYED' : 'ENGAGE DRS'}</span>
        </button>
      </div>
    </div>
  );
}
