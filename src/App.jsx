import React, { useState } from 'react';
import StudioHeader from './components/common/StudioHeader';
import AeroLab from './components/aero/AeroLab';
import TelemetryLab from './components/telemetry/TelemetryLab';
import PowertrainLab from './components/powertrain/PowertrainLab';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const [activeModule, setActiveModule] = useState('aero');
  const { isDay } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col relative selection:bg-porsche-carmine selection:text-white transition-colors duration-300 ${
      isDay ? 'bg-day-900 text-slate-800' : 'bg-studio-900 text-slate-100'
    }`}>
      {/* Subtle Studio Ambient Lighting */}
      <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] pointer-events-none z-0 blur-3xl transition-opacity duration-300 ${
        isDay
          ? 'bg-gradient-to-b from-black/[0.03] to-transparent'
          : 'bg-gradient-to-b from-white/[0.02] to-transparent'
      }`} />

      {/* Studio Navigation Header */}
      <StudioHeader activeModule={activeModule} setActiveModule={setActiveModule} />

      {/* Main Viewport */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {activeModule === 'aero' && <AeroLab />}
        {activeModule === 'telemetry' && <TelemetryLab />}
        {activeModule === 'powertrain' && <PowertrainLab />}
      </main>

      {/* Minimalist Editorial Footer */}
      <footer className={`w-full border-t py-6 px-4 sm:px-6 lg:px-8 text-xs relative z-10 transition-colors duration-300 ${
        isDay
          ? 'border-black/[0.06] bg-white/80 backdrop-blur-md text-slate-500'
          : 'border-white/[0.06] bg-studio-950/80 backdrop-blur-md text-zinc-500'
      }`}>
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-xs">
            <span className={`font-bold tracking-widest uppercase ${isDay ? 'text-slate-900' : 'text-white'}`}>
              PORSCHE
            </span>
            <span className={isDay ? 'text-slate-300' : 'text-zinc-700'}>|</span>
            <span className={isDay ? 'text-slate-600' : 'text-zinc-400'}>Apex-X Studio // Aerodynamic Engineering & Telemetry Lab</span>
          </div>

          <div className={`flex items-center space-x-4 text-[11px] font-mono ${isDay ? 'text-slate-500' : 'text-zinc-500'}`}>
            <span>911 GT3 RS (992) & TAYCAN TURBO GT</span>
            <span className={isDay ? 'text-slate-300' : 'text-zinc-700'}>|</span>
            <span>100HZ TELEMETRY LINK</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
