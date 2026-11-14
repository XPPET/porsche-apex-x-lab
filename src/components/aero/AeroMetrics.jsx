import React from 'react';
import { Gauge, ArrowDown, Wind, Compass, Zap, Activity } from 'lucide-react';
import MetricPill from '../common/MetricPill';

export default function AeroMetrics({ metrics, drsActive }) {
  const {
    Cd,
    Cl,
    downforceNewtons,
    downforceKg,
    dragNewtons,
    aeroEfficiency,
    frontBalance,
    rearBalance,
    estimatedTopSpeedKmh,
    dynamicPressurePa,
  } = metrics;

  return (
    <div className="space-y-4">
      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricPill
          label="Total Downforce"
          value={downforceNewtons.toLocaleString()}
          unit="N"
          subtext={`Equivalent to ${downforceKg} kg vertical load`}
          variant="acid"
          icon={ArrowDown}
          size="lg"
        />

        <MetricPill
          label="Drag Coefficient"
          value={Cd.toFixed(3)}
          unit="Cd"
          subtext={`Induced Drag: ${dragNewtons.toLocaleString()} N`}
          variant="red"
          icon={Wind}
          size="lg"
        />

        <MetricPill
          label="Estimated Top Speed"
          value={estimatedTopSpeedKmh}
          unit="km/h"
          subtext={drsActive ? "DRS V-Max configuration" : "Aero-limited top speed"}
          variant="cyan"
          icon={Gauge}
          size="lg"
        />

        <MetricPill
          label="Aero Efficiency"
          value={aeroEfficiency}
          unit="L/D"
          subtext={`Cl: ${Cl.toFixed(2)} | q: ${dynamicPressurePa} Pa`}
          variant="neutral"
          icon={Activity}
          size="lg"
        />
      </div>

      {/* Aero Balance Front vs Rear Bar */}
      <div className="p-3.5 rounded border border-white/10 bg-white/[0.02]">
        <div className="flex justify-between items-center mb-1.5 text-xs font-mono">
          <span className="text-slate-400 uppercase tracking-wider flex items-center">
            <Compass className="w-3.5 h-3.5 mr-1.5 text-porsche-cyan" /> AERO BALANCE DISTRIBUTION:
          </span>
          <div className="space-x-3">
            <span className="text-slate-300">FRONT: <strong className="text-porsche-cyan">{frontBalance}%</strong></span>
            <span className="text-slate-300">REAR: <strong className="text-porsche-red">{rearBalance}%</strong></span>
          </div>
        </div>

        {/* Proportional visual bar */}
        <div className="h-3 w-full bg-slate-900 rounded-sm overflow-hidden flex border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-cyan-600 to-porsche-cyan transition-all duration-300 relative group"
            style={{ width: `${frontBalance}%` }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-black font-extrabold">
              F {frontBalance}%
            </span>
          </div>
          <div
            className="h-full bg-gradient-to-r from-porsche-red to-red-600 transition-all duration-300 relative group"
            style={{ width: `${rearBalance}%` }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-white font-extrabold">
              R {rearBalance}%
            </span>
          </div>
        </div>

        <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
          <span>FRONT AXLE (DIFFUSER + NOSTRILS)</span>
          <span>REAR AXLE (SWAN-NECK WING + VENTURI TUNNEL)</span>
        </div>
      </div>
    </div>
  );
}
