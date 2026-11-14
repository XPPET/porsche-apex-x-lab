import React, { useState } from 'react';
import { Sliders, Zap, ChevronDown, ChevronUp, Wind } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function StudioAeroHudDock({
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
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const toggleDrs = () => {
    setDrsActive(!drsActive);
  };

  const presetBtnClass = (active) => `
    px-2 py-1 rounded-md text-[10px] font-medium tracking-tight transition-all duration-150 border
    ${active 
      ? (isDay ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white/20 text-white border-white/25 shadow-sm')
      : (isDay ? 'bg-black/[0.04] text-slate-700 hover:bg-black/[0.08] border-black/[0.06]' : 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] border-white/10')
    }
  `;

  return (
    <div className={`absolute top-3.5 left-3.5 z-20 transition-all duration-300 ${
      isCollapsed ? 'w-auto' : 'w-[285px] sm:w-[305px]'
    }`}>
      <div className={`rounded-xl backdrop-blur-3xl border shadow-2xl transition-all duration-300 overflow-hidden ${
        isDay
          ? 'bg-white/80 border-black/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.95)] text-slate-800'
          : 'bg-[#0E1117]/75 border-white/[0.12] shadow-[0_16px_44px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] text-slate-100'
      }`}>
        {/* Header / Collapse Bar */}
        <div 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center justify-between px-3 py-2 border-b select-none cursor-pointer group ${
            isDay ? 'border-black/[0.06] bg-black/[0.02] hover:bg-black/[0.04]' : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${drsActive ? (isDay ? 'bg-emerald-600' : 'bg-porsche-acid') : 'bg-porsche-carmine'} animate-pulse`} />
            <div className="flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-porsche-carmine" />
              <span className="text-[11px] font-bold tracking-wider uppercase">
                Aero Controls
              </span>
            </div>
            {isCollapsed && (
              <span className={`text-[10px] font-mono ml-1 hidden sm:inline ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>
                {drsActive ? 'DRS (2°)' : `${wingAngle}°`} • {rideHeight > 0 ? `+${rideHeight}` : rideHeight}mm • {airSpeedKmh}km/h
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(!isCollapsed);
            }}
            className={`p-1 rounded-md transition-colors ${
              isDay ? 'hover:bg-black/[0.06] text-slate-500' : 'hover:bg-white/10 text-zinc-400'
            }`}
            title={isCollapsed ? 'Expand Aero Controls' : 'Minimize to Pill'}
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Body */}
        {!isCollapsed && (
          <div className="p-3 space-y-3">
            {/* Quick Presets & DRS Toggle */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => applyPreset('maxDownforce')}
                  className={presetBtnClass(wingAngle === 25 && rideHeight === -15)}
                >
                  Max Load
                </button>
                <button
                  onClick={() => applyPreset('balanced')}
                  className={presetBtnClass(wingAngle === 12 && rideHeight === -10)}
                >
                  Balanced
                </button>
                <button
                  onClick={() => applyPreset('topSpeed')}
                  className={presetBtnClass(drsActive || (wingAngle === 2 && rideHeight === -5))}
                >
                  V-Max
                </button>
              </div>

              {/* Instant DRS Button */}
              <button
                onClick={toggleDrs}
                className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold tracking-wide transition-all duration-150 flex items-center space-x-1 border ${
                  drsActive
                    ? (isDay
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-porsche-acid text-black border-porsche-acid shadow-sm')
                    : (isDay
                        ? 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
                        : 'bg-white/[0.05] text-zinc-400 hover:text-white border-white/10')
                }`}
                title="Toggle Drag Reduction System"
              >
                <Zap className={`w-3 h-3 ${drsActive ? 'fill-current' : ''}`} />
                <span>{drsActive ? 'DRS: 2°' : 'DRS: OFF'}</span>
              </button>
            </div>

            {/* Slider 1: Rear Wing Angle (AoA) */}
            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <label className={`text-[11px] font-medium ${isDay ? 'text-slate-700' : 'text-zinc-300'}`}>
                  Rear Wing Angle
                </label>
                <span className={`font-mono text-xs font-semibold num-tabular ${
                  drsActive ? (isDay ? 'text-emerald-700' : 'text-porsche-acid') : (isDay ? 'text-slate-900' : 'text-white')
                }`}>
                  {drsActive ? '2° (DRS OPEN)' : `${wingAngle}° AoA`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={drsActive ? 2 : wingAngle}
                onChange={(e) => {
                  if (drsActive) setDrsActive(false);
                  setWingAngle(Number(e.target.value));
                }}
                className="w-full studio-slider studio-slider-carmine"
              />
              <div className={`flex justify-between text-[9px] font-mono ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>
                <span>0° Min</span>
                <span>12° High</span>
                <span>25° Max</span>
              </div>
            </div>

            {/* Slider 2: Ride Height */}
            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <label className={`text-[11px] font-medium ${isDay ? 'text-slate-700' : 'text-zinc-300'}`}>
                  Chassis Ride Height
                </label>
                <span className={`font-mono text-xs font-semibold num-tabular ${isDay ? 'text-slate-900' : 'text-white'}`}>
                  {rideHeight > 0 ? `+${rideHeight}` : rideHeight} mm
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                step="1"
                value={rideHeight}
                onChange={(e) => setRideHeight(Number(e.target.value))}
                className="w-full studio-slider studio-slider-acid"
              />
              <div className={`flex justify-between text-[9px] font-mono ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>
                <span>-20mm Ground Suction</span>
                <span>0</span>
                <span>+20mm</span>
              </div>
            </div>

            {/* Slider 3: Air Speed Velocity */}
            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <label className={`text-[11px] font-medium ${isDay ? 'text-slate-700' : 'text-zinc-300'}`}>
                  Wind Tunnel Velocity
                </label>
                <span className={`font-mono text-xs font-semibold num-tabular ${isDay ? 'text-slate-900' : 'text-white'}`}>
                  {airSpeedKmh} km/h
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="300"
                step="5"
                value={airSpeedKmh}
                onChange={(e) => setAirSpeedKmh(Number(e.target.value))}
                className="w-full studio-slider"
              />
              <div className={`flex justify-between text-[9px] font-mono ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>
                <span>100 km/h</span>
                <span>200 km/h</span>
                <span>300 km/h</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
