import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Activity, 
  Zap, 
  Volume2, 
  VolumeX, 
  Radio, 
  Cpu, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export default function HudHeader({ activeModule, setActiveModule }) {
  const [currentTime, setCurrentTime] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [ping, setPing] = useState(8);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}.${ms} CET`);
    };

    const interval = setInterval(updateClock, 40);
    const pingInterval = setInterval(() => {
      setPing(Math.floor(7 + Math.random() * 4));
    }, 2500);

    return () => {
      clearInterval(interval);
      clearInterval(pingInterval);
    };
  }, []);

  const handleTabClick = (moduleId) => {
    setActiveModule(moduleId);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const navItems = [
    {
      id: 'aero',
      number: 'MOD-01',
      label: 'Virtual Wind Tunnel',
      sublabel: 'Active Aerodynamics & Aero Polar',
      icon: Wind,
      color: 'red',
    },
    {
      id: 'telemetry',
      number: 'MOD-02',
      label: 'Telemetry & G-Force',
      sublabel: 'Live Nürburgring Command Center',
      icon: Activity,
      color: 'acid',
    },
    {
      id: 'powertrain',
      number: 'MOD-03',
      label: 'Powertrain Comparator',
      sublabel: '4.0L Boxer NA vs Dual-Motor EV',
      icon: Zap,
      color: 'cyan',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-porsche-darker/95 backdrop-blur-md border-b border-white/10 shadow-2xl">
      {/* Top micro-ticker / system telemetry status strip */}
      <div className="hidden sm:flex items-center justify-between px-4 lg:px-8 py-1 bg-black/60 border-b border-white/5 text-[10px] font-mono text-slate-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-porsche-acid animate-pulse"></span>
            <span className="text-porsche-acid font-bold tracking-wider">APEX-X SYSTEM ONLINE</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center space-x-1">
            <Radio className="w-3 h-3 text-porsche-cyan" />
            <span>CAN-BUS LINK: 100Hz</span>
          </div>
          <span className="text-white/20">|</span>
          <span>LATENCY: {ping}ms</span>
          <span className="text-white/20">|</span>
          <span>CHASSIS: 992-GT3-RS / T-TURBO-GT</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500">SESSION TIME:</span>
            <span className="text-slate-200 font-bold">{currentTime}</span>
          </div>
          <span className="text-white/20">|</span>
          <span className="text-porsche-red font-semibold">SECURITY: FIA HOMOLOGATED</span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="px-4 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-3.5">
            {/* Stylized Porsche Crest / High-Tech Escutcheon */}
            <div className="relative group cursor-pointer" onClick={() => handleTabClick('aero')}>
              <div className="w-10 h-10 rounded border border-porsche-red/50 bg-gradient-to-br from-porsche-red/20 to-black/80 flex items-center justify-center shadow-glow-red/20">
                <span className="font-orbitron font-black text-xl text-white tracking-widest group-hover:text-porsche-red transition-colors">
                  P
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-porsche-acid rounded-full"></div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-orbitron text-xs tracking-[0.3em] font-extrabold text-porsche-red uppercase">
                  PORSCHE
                </span>
                <span className="px-1.5 py-0.2 bg-white/10 rounded text-[9px] font-mono text-slate-300">
                  APEX-X
                </span>
              </div>
              <h1 className="font-mono text-base md:text-lg font-black tracking-wider text-white uppercase flex items-center">
                Aero & Telemetry Lab
              </h1>
            </div>
          </div>

          {/* Sound Mute Toggle for mobile */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={handleMuteToggle}
              className={`p-2 rounded border transition-colors ${isMuted ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-white/15 text-slate-300 hover:text-white bg-white/5'}`}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 3 Interactive Module Tabs */}
        <nav className="flex items-center justify-center space-x-1.5 md:space-x-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            
            let activeStyles = '';
            if (isActive) {
              if (item.color === 'red') {
                activeStyles = 'bg-gradient-to-b from-porsche-red/20 to-porsche-red/5 border-porsche-red text-white shadow-glow-red/25';
              } else if (item.color === 'acid') {
                activeStyles = 'bg-gradient-to-b from-porsche-acid/20 to-porsche-acid/5 border-porsche-acid text-white shadow-glow-acid/25';
              } else {
                activeStyles = 'bg-gradient-to-b from-porsche-cyan/20 to-porsche-cyan/5 border-porsche-cyan text-white shadow-glow-cyan/25';
              }
            } else {
              activeStyles = 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-100 hover:border-white/20 hover:bg-white/[0.06]';
            }

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`relative px-3.5 py-2 md:px-4 md:py-2.5 rounded border transition-all duration-200 flex items-center space-x-2.5 text-left group min-w-[140px] md:min-w-[190px] ${activeStyles}`}
              >
                {/* Active corner tab highlight */}
                {isActive && (
                  <span className={`absolute -top-1 left-2 w-3 h-1 rounded-sm ${item.color === 'acid' ? 'bg-porsche-acid' : item.color === 'red' ? 'bg-porsche-red' : 'bg-porsche-cyan'}`} />
                )}

                <div className={`p-1.5 rounded ${isActive ? (item.color === 'acid' ? 'bg-porsche-acid/20 text-porsche-acid' : item.color === 'red' ? 'bg-porsche-red/20 text-porsche-red' : 'bg-porsche-cyan/20 text-porsche-cyan') : 'bg-white/5 text-slate-400 group-hover:text-slate-200'}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[9px] font-mono font-semibold tracking-widest text-slate-500 uppercase">
                      {item.number}
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                    )}
                  </div>
                  <div className="text-xs md:text-sm font-mono font-bold tracking-tight truncate text-slate-100">
                    {item.label}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Desktop Audio & Utility Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={handleMuteToggle}
            className={`px-3 py-2 rounded border font-mono text-xs flex items-center space-x-2 transition-all ${isMuted ? 'border-red-500/40 text-red-400 bg-red-500/10' : 'border-white/10 text-slate-300 hover:text-white hover:border-white/20 bg-white/5'}`}
            title={isMuted ? 'Unmute Audio Synthesis' : 'Mute Audio'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-porsche-red" />
                <span>AUDIO: OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-porsche-acid" />
                <span>AUDIO: ON</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
