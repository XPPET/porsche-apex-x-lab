import React, { useState, useEffect } from 'react';
import { Play, Pause, FastForward, RotateCcw } from 'lucide-react';
import StudioCard from '../common/StudioCard';
import StudioInstrumentCluster from './StudioInstrumentCluster';
import StudioGForceMeter from './StudioGForceMeter';
import StudioChassisTelemetry from './StudioChassisTelemetry';
import StudioTrackMap from './StudioTrackMap';
import StudioTelemetryStream from './StudioTelemetryStream';
import { createInitialTelemetryState, simulateNextTelemetryTick } from '../../constants/trackData';
import { useTheme } from '../../context/ThemeContext';

export default function TelemetryLab() {
  const { isDay } = useTheme();
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [telemetry, setTelemetry] = useState(createInitialTelemetryState);
  const [history, setHistory] = useState([createInitialTelemetryState()]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const next = simulateNextTelemetryTick(prev, simSpeed);
        setHistory((h) => {
          const updated = [...h, next];
          if (updated.length > 50) updated.shift();
          return updated;
        });
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  const toggleSimulation = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleSpeed = () => {
    setSimSpeed(simSpeed === 1 ? 2 : 1);
  };

  const resetTelemetry = () => {
    setTelemetry(createInitialTelemetryState());
    setHistory([createInitialTelemetryState()]);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Command Bar */}
      <div className={`studio-card rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 transition-colors ${
        isDay ? 'border-black/[0.08]' : ''
      }`}>
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${
              isPlaying ? (isDay ? 'bg-emerald-600' : 'bg-porsche-acid') : 'bg-amber-400'
            }`} />
            <span className={`font-semibold ${isDay ? 'text-slate-900' : 'text-white'}`}>
              {isPlaying ? 'Live Telemetry Feed' : 'Telemetry Paused'}
            </span>
          </div>
          <span className={isDay ? 'text-slate-300' : 'text-zinc-600'}>•</span>
          <span className={`font-mono text-[11px] ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>
            CAN-BUS 100Hz
          </span>
          <span className={isDay ? 'text-slate-300' : 'text-zinc-600'}>•</span>
          <span className={isDay ? 'text-slate-500' : 'text-zinc-400'}>
            Porsche 911 GT3 RS
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSimulation}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 border ${
              isPlaying
                ? (isDay ? 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200' : 'bg-white/[0.04] border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.08]')
                : 'bg-porsche-carmine text-white border-porsche-carmine shadow-sm'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Feed</span>
              </>
            )}
          </button>

          <button
            onClick={toggleSpeed}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              simSpeed === 2
                ? (isDay ? 'bg-slate-900 text-white border-slate-900' : 'bg-white/15 text-white border-white/20')
                : (isDay ? 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900' : 'bg-white/[0.04] text-zinc-400 border-white/10 hover:text-white')
            }`}
          >
            {simSpeed}x
          </button>

          <button
            onClick={resetTelemetry}
            className={`p-1.5 rounded-lg text-xs border transition-all ${
              isDay
                ? 'border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900'
                : 'border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white'
            }`}
            title="Reset telemetry"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 1: Instrument Cluster, G-Force Scatter, 4-Corner Chassis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <StudioCard
            category="POWERTRAIN DYNAMICS"
            title="Digital Cockpit"
            subtitle="Engine speed, transmission ratio, and pedal inputs"
          >
            <StudioInstrumentCluster
              rpm={telemetry.rpm}
              maxRpm={telemetry.maxRpm}
              speed={telemetry.speed}
              gear={telemetry.gear}
              throttle={telemetry.throttle}
              brake={telemetry.brake}
            />
          </StudioCard>
        </div>

        <div className="lg:col-span-4">
          <StudioCard
            category="ACCELERATION FORCES"
            title="Friction Circle (GG Diagram)"
            subtitle="Lateral and longitudinal tire adhesion limit"
          >
            <StudioGForceMeter
              latG={telemetry.latG}
              lonG={telemetry.lonG}
              gHistory={telemetry.gHistory}
            />
          </StudioCard>
        </div>

        <div className="lg:col-span-4">
          <StudioCard
            category="CORNER TELEMETRY"
            title="Chassis & Thermals"
            subtitle="Carbon ceramic rotor temperatures, tire PSI, and PTV+"
          >
            <StudioChassisTelemetry
              brakeTemps={telemetry.brakeTemps}
              tirePressure={telemetry.tirePressure}
              tireTemps={telemetry.tireTemps}
              torqueVectoring={telemetry.torqueVectoring}
            />
          </StudioCard>
        </div>
      </div>

      {/* Row 2: Nürburgring Track Map & Streaming Telemetry Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <StudioCard
            category="CIRCUIT TRACKING"
            title="Nürburgring Nordschleife"
            subtitle="20.832 km lap progression and sector split times"
          >
            <StudioTrackMap
              lapDistance={telemetry.lapDistance}
              sector={telemetry.sector}
              lapTimeMs={telemetry.lapTimeMs}
              deltaToRecord={telemetry.deltaToRecord}
            />
          </StudioCard>
        </div>

        <div className="lg:col-span-6">
          <StudioCard
            category="TELEMETRY BUFFER"
            title="Channel Timeline Stream"
            subtitle="Real-time multi-channel telemetry buffer"
          >
            <StudioTelemetryStream telemetryHistory={history} />
          </StudioCard>
        </div>
      </div>
    </div>
  );
}
