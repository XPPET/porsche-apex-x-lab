import React, { useState, useMemo } from 'react';
import StudioCard from '../common/StudioCard';
import MetricCard from '../common/MetricCard';
import StudioWindTunnelCanvas from './StudioWindTunnelCanvas';
import StudioAeroChart from './StudioAeroChart';
import { calculateAeroMetrics } from '../../constants/aeroConstants';
import { useTheme } from '../../context/ThemeContext';

export default function AeroLab() {
  const { isDay } = useTheme();
  const [wingAngle, setWingAngle] = useState(15);
  const [rideHeight, setRideHeight] = useState(-10);
  const [airSpeedKmh, setAirSpeedKmh] = useState(200);
  const [drsActive, setDrsActive] = useState(false);

  const metrics = useMemo(() => {
    return calculateAeroMetrics(wingAngle, rideHeight, airSpeedKmh, drsActive);
  }, [wingAngle, rideHeight, airSpeedKmh, drsActive]);

  // Front & rear axle dynamic downforce load breakdown
  const frontLoadN = Math.round(metrics.downforceNewtons * (metrics.frontBalance / 100));
  const rearLoadN = Math.round(metrics.downforceNewtons * (metrics.rearBalance / 100));

  return (
    <div className="space-y-5">
      {/* Hero Virtual Wind Tunnel with Floating Telemetry HUD Control Dock */}
      <StudioCard
        category="AERODYNAMIC SIMULATION"
        title="Virtual Wind Tunnel"
        subtitle="Active boundary layer streamlines, ground effect suction, and DRS flow analysis"
        badge={drsActive ? "DRS ACTIVE (2°)" : (isDay ? "DAYLIGHT STUDIO" : "NIGHT TELEMETRY")}
        badgeVariant={drsActive ? "acid" : "default"}
        noPadding
      >
        <div className="p-2 sm:p-2.5">
          <StudioWindTunnelCanvas
            wingAngle={wingAngle}
            setWingAngle={setWingAngle}
            rideHeight={rideHeight}
            setRideHeight={setRideHeight}
            airSpeedKmh={airSpeedKmh}
            setAirSpeedKmh={setAirSpeedKmh}
            drsActive={drsActive}
            setDrsActive={setDrsActive}
          />
        </div>
      </StudioCard>

      {/* Immediate Real-Time Aerodynamic Telemetry Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Downforce"
          value={metrics.downforceNewtons.toLocaleString()}
          unit="N"
          subtext={`Equivalent to ${metrics.downforceKg} kg vertical load`}
          accent="acid"
        />

        <MetricCard
          label="Drag Coefficient"
          value={metrics.Cd.toFixed(3)}
          unit="Cd"
          subtext={`Induced drag force: ${metrics.dragNewtons.toLocaleString()} N`}
          accent="carmine"
        />

        <MetricCard
          label="Top Speed (V-Max)"
          value={metrics.estimatedTopSpeedKmh}
          unit="km/h"
          subtext={drsActive ? "Low-drag DRS configuration" : "Drag-limited top speed"}
          accent="default"
        />

        <MetricCard
          label="Aero Efficiency"
          value={metrics.aeroEfficiency}
          unit="L/D"
          subtext={`Front: ${metrics.frontBalance}% | Rear: ${metrics.rearBalance}%`}
          accent="default"
        />
      </div>

      {/* Split Desktop Section: Axle Balance Breakdown & Aero Polar Trade-Off Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Aero Balance & Axle Distribution */}
        <div className="lg:col-span-6">
          <StudioCard
            category="AXLE DISTRIBUTION"
            title="Aero Balance Split"
            subtitle="Dynamic pitch stability and axle vertical load apportionment"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`text-xs font-semibold ${isDay ? 'text-slate-800' : 'text-zinc-200'}`}>
                  Dynamic Axle Balance
                </span>
                <div className={`text-xs font-mono num-tabular ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>
                  Front <strong className={`font-semibold ${isDay ? 'text-slate-900' : 'text-white'}`}>{metrics.frontBalance}%</strong> ({frontLoadN.toLocaleString()} N)
                  <span className={`mx-2 ${isDay ? 'text-slate-300' : 'text-zinc-600'}`}>/</span>
                  Rear <strong className="text-porsche-carmine font-semibold">{metrics.rearBalance}%</strong> ({rearLoadN.toLocaleString()} N)
                </div>
              </div>

              {/* Minimal Proportional Bar */}
              <div className={`h-2.5 w-full rounded-full overflow-hidden flex ${isDay ? 'bg-slate-200' : 'bg-white/[0.06]'}`}>
                <div
                  className={`h-full transition-all duration-200 rounded-l-full ${isDay ? 'bg-slate-700' : 'bg-zinc-200'}`}
                  style={{ width: `${metrics.frontBalance}%` }}
                />
                <div
                  className="h-full bg-porsche-carmine transition-all duration-200 rounded-r-full"
                  style={{ width: `${metrics.rearBalance}%` }}
                />
              </div>

              {/* Aerodynamic surfaces load mapping */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-black/[0.05] dark:border-white/[0.05]">
                <div className={`p-2.5 rounded-lg border ${
                  isDay ? 'bg-slate-50 border-slate-200/80' : 'bg-white/[0.02] border-white/5'
                }`}>
                  <div className={`text-[10px] font-mono uppercase tracking-wider ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Front Axle Aero
                  </div>
                  <div className={`text-sm font-semibold font-mono num-tabular mt-0.5 ${isDay ? 'text-slate-900' : 'text-white'}`}>
                    {frontLoadN.toLocaleString()} N
                  </div>
                  <div className={`text-[10px] mt-0.5 ${isDay ? 'text-slate-500' : 'text-zinc-500'}`}>
                    Active diffuser & hood nostrils
                  </div>
                </div>

                <div className={`p-2.5 rounded-lg border ${
                  isDay ? 'bg-slate-50 border-slate-200/80' : 'bg-white/[0.02] border-white/5'
                }`}>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-porsche-carmine">
                    Rear Axle Aero
                  </div>
                  <div className="text-sm font-semibold font-mono num-tabular mt-0.5 text-porsche-carmine">
                    {rearLoadN.toLocaleString()} N
                  </div>
                  <div className={`text-[10px] mt-0.5 ${isDay ? 'text-slate-500' : 'text-zinc-500'}`}>
                    Swan-neck wing & underbody Venturis
                  </div>
                </div>
              </div>
            </div>
          </StudioCard>
        </div>

        {/* Right: Empirical Aero Polar Curve */}
        <div className="lg:col-span-6">
          <StudioCard
            category="EMPIRICAL ANALYSIS"
            title="Aero Polar Trade-Off"
            subtitle="Induced drag penalty versus vertical aerodynamic load"
          >
            <StudioAeroChart
              wingAngle={drsActive ? 2 : wingAngle}
              rideHeight={rideHeight}
              airSpeedKmh={airSpeedKmh}
              drsActive={drsActive}
            />
          </StudioCard>
        </div>
      </div>
    </div>
  );
}
