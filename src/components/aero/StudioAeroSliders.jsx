import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function StudioAeroSliders({
  wingAngle,
  setWingAngle,
  rideHeight,
  setRideHeight,
  airSpeedKmh,
  setAirSpeedKmh,
  drsActive,
  setDrsActive,
}) {
  const { isDay } = useTheme();

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

  const presetBtnClass = isDay
    ? 'px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors'
    : 'px-2.5 py-1 text-xs font-medium rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/5 transition-colors';

  return (
    <div className="space-y-6">
      {/* Preset configurations bar */}
      <div className={`flex items-center justify-between pb-4 border-b ${isDay ? 'border-black/[0.06]' : 'border-white/[0.06]'}`}>
        <span className={`text-[11px] font-semibold tracking-wider uppercase ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>
          Aero Setup Presets
        </span>
        <div className="flex items-center space-x-1.5">
          <button onClick={() => applyPreset('maxDownforce')} className={presetBtnClass}>
            Max Downforce
          </button>
          <button onClick={() => applyPreset('balanced')} className={presetBtnClass}>
            Balanced
          </button>
          <button onClick={() => applyPreset('topSpeed')} className={presetBtnClass}>
            V-Max Low Drag
          </button>
        </div>
      </div>

      {/* Slider 1: Rear Wing Angle */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-baseline">
          <label className={`text-xs font-medium ${isDay ? 'text-slate-700' : 'text-zinc-300'}`}>
            Rear Wing Angle of Attack
          </label>
          <div className={`font-mono text-sm font-semibold num-tabular ${isDay ? 'text-slate-900' : 'text-white'}`}>
            {wingAngle}° <span className={`text-[11px] font-normal ${isDay ? 'text-slate-500' : 'text-zinc-500'}`}>AoA</span>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="25"
          step="1"
          value={wingAngle}
          onChange={(e) => handleWingChange(e.target.value)}
          className="w-full studio-slider studio-slider-carmine cursor-pointer"
        />
        <div className={`flex justify-between text-[10px] font-mono ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>
          <span>0° (MIN DRAG)</span>
          <span>12°</span>
          <span>25° (MAX LOAD)</span>
        </div>
      </div>

      {/* Slider 2: Ride Height */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-baseline">
          <label className={`text-xs font-medium ${isDay ? 'text-slate-700' : 'text-zinc-300'}`}>
            Chassis Ride Height
          </label>
          <div className={`font-mono text-sm font-semibold num-tabular ${isDay ? 'text-slate-900' : 'text-white'}`}>
            {rideHeight > 0 ? `+${rideHeight}` : rideHeight} <span className={`text-[11px] font-normal ${isDay ? 'text-slate-500' : 'text-zinc-500'}`}>MM</span>
          </div>
        </div>
        <input
          type="range"
          min="-20"
          max="20"
          step="1"
          value={rideHeight}
          onChange={(e) => handleRideHeightChange(e.target.value)}
          className="w-full studio-slider studio-slider-acid cursor-pointer"
        />
        <div className={`flex justify-between text-[10px] font-mono ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>
          <span>-20 mm (GROUND SUCTION)</span>
          <span>0 mm</span>
          <span>+20 mm</span>
        </div>
      </div>

      {/* Slider 3: Air Speed */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-baseline">
          <label className={`text-xs font-medium ${isDay ? 'text-slate-700' : 'text-zinc-300'}`}>
            Tunnel Flow Velocity
          </label>
          <div className={`font-mono text-sm font-semibold num-tabular ${isDay ? 'text-slate-900' : 'text-white'}`}>
            {airSpeedKmh} <span className={`text-[11px] font-normal ${isDay ? 'text-slate-500' : 'text-zinc-500'}`}>KM/H</span>
          </div>
        </div>
        <input
          type="range"
          min="100"
          max="300"
          step="5"
          value={airSpeedKmh}
          onChange={(e) => handleSpeedChange(e.target.value)}
          className="w-full studio-slider cursor-pointer"
        />
        <div className={`flex justify-between text-[10px] font-mono ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>
          <span>100 km/h</span>
          <span>200 km/h</span>
          <span>300 km/h (HIGH SPEED)</span>
        </div>
      </div>

      {/* Minimalist DRS Control */}
      <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
        isDay ? 'bg-slate-50/70 border-black/[0.06]' : 'bg-white/[0.02] border-white/[0.06]'
      }`}>
        <div>
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-semibold ${isDay ? 'text-slate-900' : 'text-white'}`}>DRS Hydraulic Actuation</span>
            {drsActive && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                isDay ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-porsche-acid/10 text-porsche-acid border-porsche-acid/20'
              }`}>
                ACTIVE
              </span>
            )}
          </div>
          <p className={`text-[12px] mt-0.5 ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>
            Hydraulically decouples wing flap for straight-line velocity
          </p>
        </div>

        <button
          onClick={toggleDrs}
          className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
            drsActive
              ? 'bg-porsche-carmine text-white border-porsche-carmine'
              : (isDay ? 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-slate-200' : 'bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] border-white/10')
          }`}
        >
          {drsActive ? 'DRS Deployed' : 'Engage DRS'}
        </button>
      </div>
    </div>
  );
}
