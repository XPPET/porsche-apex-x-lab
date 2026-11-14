import React from 'react';
import { Shield, Zap, Flame, Cpu, Gauge, Compass } from 'lucide-react';
import { POWERTRAINS } from '../../constants/powertrainData';

export default function PowertrainSpecsCard() {
  const { ice, ev } = POWERTRAINS;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
      {/* ICE Card: 911 GT3 RS */}
      <div className="p-4 rounded border border-porsche-red/30 bg-gradient-to-b from-porsche-red/[0.08] to-black/80 relative overflow-hidden">
        {/* Top badge */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-porsche-red" />
              <h4 className="text-base font-bold text-white tracking-wide uppercase">
                {ice.name}
              </h4>
            </div>
            <div className="text-xs text-red-300/80 mt-0.5">{ice.subtitle}</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-porsche-red/20 border border-porsche-red/40 text-[10px] text-porsche-red font-bold">
            9,000 RPM NA
          </span>
        </div>

        {/* Specs table */}
        <div className="space-y-2 text-xs divide-y divide-white/5">
          <div className="flex justify-between py-1">
            <span className="text-slate-400">ENGINE CONFIG:</span>
            <span className="text-slate-200 font-semibold">{ice.engineType}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">DISPLACEMENT:</span>
            <span className="text-slate-200 font-semibold">{ice.displacement}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">MAX OUTPUT:</span>
            <span className="text-porsche-red font-bold">{ice.maxPowerPS} PS ({ice.maxPowerKW} kW) @ 8,500 RPM</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">PEAK TORQUE:</span>
            <span className="text-slate-200 font-semibold">{ice.maxTorqueNm} Nm @ 6,300 RPM</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">TRANSMISSION:</span>
            <span className="text-slate-200 font-semibold">{ice.transmission}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">POWER-TO-WEIGHT:</span>
            <span className="text-porsche-red font-bold">{ice.powerToWeight}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">ACOUSTIC PROFILE:</span>
            <span className="text-amber-300 font-semibold">{ice.soundProfile}</span>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-slate-400 border-t border-white/10 pt-2 italic">
          "{ice.description}"
        </p>
      </div>

      {/* EV Card: Taycan Turbo GT */}
      <div className="p-4 rounded border border-porsche-acid/30 bg-gradient-to-b from-porsche-acid/[0.08] to-black/80 relative overflow-hidden">
        {/* Top badge */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-porsche-acid" />
              <h4 className="text-base font-bold text-white tracking-wide uppercase">
                {ev.name}
              </h4>
            </div>
            <div className="text-xs text-lime-300/80 mt-0.5">{ev.subtitle}</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-porsche-acid/20 border border-porsche-acid/40 text-[10px] text-porsche-acid font-bold">
            1,108 PS PSM
          </span>
        </div>

        {/* Specs table */}
        <div className="space-y-2 text-xs divide-y divide-white/5">
          <div className="flex justify-between py-1">
            <span className="text-slate-400">POWERTRAIN CONFIG:</span>
            <span className="text-slate-200 font-semibold">{ev.engineType}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">ENERGY STORAGE:</span>
            <span className="text-slate-200 font-semibold">{ev.displacement}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">MAX OUTPUT:</span>
            <span className="text-porsche-acid font-bold">{ev.maxPowerPS} PS ({ev.maxPowerKW} kW) Attack Mode</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">PEAK TORQUE:</span>
            <span className="text-slate-200 font-semibold">{ev.maxTorqueNm} Nm Instantaneous</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">TRANSMISSION:</span>
            <span className="text-slate-200 font-semibold">{ev.transmission}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">POWER-TO-WEIGHT:</span>
            <span className="text-porsche-acid font-bold">{ev.powerToWeight}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">ACOUSTIC PROFILE:</span>
            <span className="text-cyan-300 font-semibold">{ev.soundProfile}</span>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-slate-400 border-t border-white/10 pt-2 italic">
          "{ev.description}"
        </p>
      </div>
    </div>
  );
}
