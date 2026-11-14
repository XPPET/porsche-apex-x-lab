import React from 'react';
import { Disc, Thermometer, Gauge, ArrowRightLeft } from 'lucide-react';

/**
 * 4-Corner Chassis Telemetry: Brake Temps, Tire Pressures, and Torque Vectoring
 */
export default function WheelTelemetry({
  brakeTemps,
  tirePressure,
  tireTemps,
  torqueVectoring,
}) {
  const getBrakeColor = (temp) => {
    if (temp > 680) return 'text-porsche-red text-glow-red animate-pulse';
    if (temp > 520) return 'text-amber-400';
    if (temp > 380) return 'text-porsche-acid';
    return 'text-porsche-cyan';
  };

  const getBrakeBg = (temp) => {
    if (temp > 680) return 'bg-porsche-red/20 border-porsche-red';
    if (temp > 520) return 'bg-amber-500/20 border-amber-500';
    if (temp > 380) return 'bg-porsche-acid/20 border-porsche-acid';
    return 'bg-porsche-cyan/20 border-porsche-cyan';
  };

  const renderWheelBox = (corner, title) => {
    const brakeT = brakeTemps[corner];
    const tireP = tirePressure[corner];
    const tireT = tireTemps[corner];
    const torque = torqueVectoring[corner];

    return (
      <div className="p-2.5 rounded border border-white/10 bg-black/60 font-mono relative overflow-hidden">
        {/* Corner Tag */}
        <div className="flex justify-between items-center mb-1 pb-1 border-b border-white/10">
          <span className="text-[11px] font-bold text-slate-200 tracking-wider">
            {title} ({corner.toUpperCase()})
          </span>
          {torque > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-porsche-acid/10 border border-porsche-acid/40 text-porsche-acid font-bold">
              {torque}% TRQ
            </span>
          )}
        </div>

        {/* Brake Temp */}
        <div className="flex justify-between items-center text-[11px] my-1">
          <span className="text-slate-400 flex items-center">
            <Disc className="w-3 h-3 mr-1 text-slate-500" /> BRAKE DISC:
          </span>
          <span className={`font-bold ${getBrakeColor(brakeT)}`}>
            {brakeT}°C
          </span>
        </div>

        {/* Tire Pressure & Temp */}
        <div className="flex justify-between items-center text-[11px] my-1">
          <span className="text-slate-400 flex items-center">
            <Gauge className="w-3 h-3 mr-1 text-slate-500" /> PRESSURE:
          </span>
          <span className="text-slate-200 font-semibold">
            {tireP} bar <span className="text-[9px] text-slate-400">({(tireP * 14.5038).toFixed(1)} PSI)</span>
          </span>
        </div>

        <div className="flex justify-between items-center text-[11px] my-1">
          <span className="text-slate-400 flex items-center">
            <Thermometer className="w-3 h-3 mr-1 text-slate-500" /> TIRE SURFACE:
          </span>
          <span className="text-slate-200 font-semibold">
            {tireT}°C
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full relative">
      {/* Central Chassis Wireframe Overlay */}
      <div className="grid grid-cols-2 gap-4 relative">
        {/* Top Row: Front Wheels */}
        {renderWheelBox('fl', 'FRONT LEFT')}
        {renderWheelBox('fr', 'FRONT RIGHT')}

        {/* Visual Axle / Chassis Representation */}
        <div className="col-span-2 py-1 flex items-center justify-center">
          <div className="w-full h-8 rounded border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-between px-4 text-[10px] font-mono text-slate-400">
            <span>FRONT AXLE (BRAKE STEER)</span>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-porsche-acid animate-ping" />
              <span className="text-slate-200 font-bold uppercase">PTV+ TORQUE VECTORING</span>
            </div>
            <span>REAR AXLE (E-DIFF LOCK)</span>
          </div>
        </div>

        {/* Bottom Row: Rear Wheels */}
        {renderWheelBox('rl', 'REAR LEFT')}
        {renderWheelBox('rr', 'REAR RIGHT')}
      </div>

      {/* Rear Axle Torque Vectoring Dynamic Bar */}
      <div className="mt-3 p-2.5 rounded bg-black/40 border border-white/10 font-mono">
        <div className="flex justify-between items-center text-[10px] mb-1">
          <span className="text-slate-400 flex items-center">
            <ArrowRightLeft className="w-3 h-3 mr-1 text-porsche-acid" /> REAR TORQUE VECTORING BIAS:
          </span>
          <span className="text-slate-200 font-bold">
            RL: <span className="text-porsche-acid">{torqueVectoring.rl}%</span> | RR: <span className="text-porsche-cyan">{torqueVectoring.rr}%</span>
          </span>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-lime-600 to-porsche-acid transition-all duration-150"
            style={{ width: `${torqueVectoring.rl}%` }}
          />
          <div
            className="h-full bg-gradient-to-r from-cyan-600 to-porsche-cyan transition-all duration-150"
            style={{ width: `${torqueVectoring.rr}%` }}
          />
        </div>
      </div>
    </div>
  );
}
