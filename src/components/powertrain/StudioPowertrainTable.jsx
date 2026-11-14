import React from 'react';
import { POWERTRAINS } from '../../constants/powertrainData';
import { useTheme } from '../../context/ThemeContext';

export default function StudioPowertrainTable() {
  const { isDay } = useTheme();
  const { ice, ev } = POWERTRAINS;

  const rows = [
    { label: 'Powertrain Concept', iceVal: ice.engineType, evVal: ev.engineType },
    { label: 'Displacement / Battery', iceVal: ice.displacement, evVal: ev.displacement },
    { label: 'Peak Power Output', iceVal: `${ice.maxPowerPS} PS (${ice.maxPowerKW} kW) @ 8,500 RPM`, evVal: `${ev.maxPowerPS} PS (${ev.maxPowerKW} kW) Attack Mode`, highlight: true },
    { label: 'Peak Torque', iceVal: `${ice.maxTorqueNm} Nm @ 6,300 RPM`, evVal: `${ev.maxTorqueNm} Nm Instantaneous`, highlight: true },
    { label: 'Rev Limit / Max RPM', iceVal: '9,000 RPM (Mechanical Screamer)', evVal: '16,000 RPM (Motor Speed)' },
    { label: 'Transmission', iceVal: ice.transmission, evVal: ev.transmission },
    { label: 'Drive Configuration', iceVal: ice.driveType, evVal: ev.driveType },
    { label: 'Homologated Weight', iceVal: `${ice.baseWeightKg} kg (Weissach Package)`, evVal: `${ev.baseWeightKg} kg (Carbon Spec)` },
    { label: 'Power-to-Weight Ratio', iceVal: ice.powerToWeight, evVal: ev.powerToWeight, highlight: true },
    { label: 'Official 0–100 km/h', iceVal: ice.official0to100, evVal: ev.official0to100, highlight: true },
    { label: 'Quarter Mile (402m)', iceVal: ice.officialQuarterMile, evVal: ev.officialQuarterMile, highlight: true },
    { label: 'V-Max Top Speed', iceVal: ice.officialTopSpeed, evVal: ev.officialTopSpeed },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className={`border-b ${isDay ? 'border-black/[0.08] text-slate-500' : 'border-white/[0.08] text-zinc-400'}`}>
            <th className="py-3 px-4 font-medium uppercase tracking-wider text-[11px] w-1/3">
              Engineering Specification
            </th>
            <th className={`py-3 px-4 font-semibold w-1/3 ${isDay ? 'text-slate-900' : 'text-white'}`}>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-porsche-carmine" />
                <span>911 GT3 RS (4.0L Boxer)</span>
              </div>
            </th>
            <th className={`py-3 px-4 font-semibold w-1/3 ${isDay ? 'text-slate-900' : 'text-white'}`}>
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${isDay ? 'bg-emerald-600' : 'bg-porsche-acid'}`} />
                <span>Taycan Turbo GT (Dual-Motor)</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isDay ? 'divide-black/[0.04]' : 'divide-white/[0.04]'}`}>
          {rows.map((r, idx) => (
            <tr key={idx} className={`transition-colors ${isDay ? 'hover:bg-black/[0.02]' : 'hover:bg-white/[0.02]'}`}>
              <td className={`py-3 px-4 font-medium ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>
                {r.label}
              </td>
              <td className={`py-3 px-4 font-mono ${
                r.highlight ? (isDay ? 'text-slate-900 font-semibold' : 'text-white font-medium') : (isDay ? 'text-slate-700' : 'text-zinc-300')
              }`}>
                {r.iceVal}
              </td>
              <td className={`py-3 px-4 font-mono ${
                r.highlight ? (isDay ? 'text-slate-900 font-semibold' : 'text-white font-medium') : (isDay ? 'text-slate-700' : 'text-zinc-300')
              }`}>
                {r.evVal}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
