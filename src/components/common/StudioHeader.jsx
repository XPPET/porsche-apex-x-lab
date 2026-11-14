import React, { useState, useEffect } from 'react';
import { Wind, Activity, Zap, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function StudioHeader({ activeModule, setActiveModule }) {
  const { theme, toggleTheme, isDay } = useTheme();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (mod) => {
    setActiveModule(mod);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const modules = [
    { id: 'aero', index: '01', label: 'Wind Tunnel', fullLabel: 'Virtual Wind Tunnel', icon: Wind },
    { id: 'telemetry', index: '02', label: 'Telemetry', fullLabel: 'Telemetry & Dynamics', icon: Activity },
    { id: 'powertrain', index: '03', label: 'Powertrain', fullLabel: 'Powertrain Lab', icon: Zap },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full backdrop-blur-2xl border-b transition-colors duration-300 ${
      isDay
        ? 'bg-white/80 border-black/[0.08] shadow-[0_1px_16px_rgba(0,0,0,0.04)]'
        : 'bg-[#0E1117]/80 border-white/[0.07] shadow-[0_1px_20px_rgba(0,0,0,0.35)]'
    }`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleTabChange('aero')}>
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
              isDay
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white/[0.05] border-white/10 text-white group-hover:border-porsche-carmine/50'
            }`}>
              <span className="font-bold text-xs tracking-widest">P</span>
            </div>
            <div>
              <div className={`text-[11px] font-bold tracking-[0.22em] uppercase transition-colors ${
                isDay ? 'text-slate-900' : 'text-white'
              }`}>
                PORSCHE
              </div>
              <div className={`text-[10px] font-medium tracking-wider uppercase transition-colors ${
                isDay ? 'text-slate-500' : 'text-zinc-500'
              }`}>
                Apex-X Studio
              </div>
            </div>
          </div>

          <div className={`hidden lg:block h-5 w-[1px] ${isDay ? 'bg-black/[0.08]' : 'bg-white/[0.08]'}`} />

          <div className="hidden lg:flex items-center space-x-2 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-porsche-acid animate-pulse" />
            <span className={`font-mono text-[11px] font-medium ${isDay ? 'text-slate-700' : 'text-zinc-300'}`}>
              TELEMETRY 100Hz
            </span>
            <span className={isDay ? 'text-slate-400' : 'text-zinc-600'}>•</span>
            <span className={isDay ? 'text-slate-500' : 'text-zinc-400'}>
              911 GT3 RS
            </span>
          </div>
        </div>

        {/* Center: Minimalist Module Tabs */}
        <nav className={`flex items-center space-x-1 sm:space-x-2 p-1 rounded-xl border transition-colors ${
          isDay
            ? 'bg-black/[0.03] border-black/[0.06]'
            : 'bg-white/[0.02] border-white/[0.06]'
        }`}>
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeModule === m.id;

            let tabActiveStyles = '';
            if (isActive) {
              tabActiveStyles = isDay
                ? 'bg-white text-slate-900 shadow-sm border border-black/10'
                : 'bg-white/[0.08] text-white shadow-sm border border-white/10';
            } else {
              tabActiveStyles = isDay
                ? 'text-slate-500 hover:text-slate-900 hover:bg-black/[0.02]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]';
            }

            return (
              <button
                key={m.id}
                onClick={() => handleTabChange(m.id)}
                className={`relative px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-2 ${tabActiveStyles}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-porsche-carmine' : (isDay ? 'text-slate-400' : 'text-zinc-500')}`} />
                <span className={`hidden sm:inline font-mono text-[10px] ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>{m.index}</span>
                <span>{m.label}</span>

                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-porsche-carmine rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Day/Night Vision Toggle, Audio & Clock */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Day & Night Vision Toggle Button */}
          <button
            onClick={handleThemeToggle}
            className={`px-3 py-1.5 rounded-xl border flex items-center space-x-2 text-xs font-medium transition-all duration-300 shadow-sm ${
              isDay
                ? 'bg-white text-slate-800 border-black/10 hover:border-black/20 hover:bg-slate-50'
                : 'bg-white/[0.04] text-zinc-300 border-white/10 hover:border-white/20 hover:bg-white/[0.08]'
            }`}
            title={`Switch to ${isDay ? 'Night Vision (Low-Light Command Center)' : 'Day Vision (Clean & Bright Studio)'}`}
          >
            {isDay ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                <span className="font-mono text-[11px] font-semibold tracking-wide uppercase">DAY VISION</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-mono text-[11px] font-semibold tracking-wide uppercase">NIGHT VISION</span>
              </>
            )}
          </button>

          <div className="hidden md:flex items-center space-x-2 text-xs font-mono">
            <span className={`num-tabular font-medium ${isDay ? 'text-slate-700' : 'text-zinc-300'}`}>{timeStr}</span>
            <span className={isDay ? 'text-slate-400' : 'text-zinc-600'}>CET</span>
          </div>
        </div>
      </div>
    </header>
  );
}
