import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';
import { simulateQuarterMileRace } from '../../constants/powertrainData';
import { useTheme } from '../../context/ThemeContext';

export default function StudioDragRaceRunner({
  iceWeight,
  evWeight,
  powerMode,
  iceFuelLoad,
  evBatterySoc,
}) {
  const { isDay } = useTheme();
  const [raceState, setRaceState] = useState('idle');
  const [treeStage, setTreeStage] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [raceResults, setRaceResults] = useState(null);
  const [liveIceProgress, setLiveIceProgress] = useState(0);
  const [liveEvProgress, setLiveEvProgress] = useState(0);
  const [liveIceSpeed, setLiveIceSpeed] = useState(0);
  const [liveEvSpeed, setLiveEvSpeed] = useState(0);

  const raceTimerRef = useRef(null);
  const stageTimeoutRef = useRef(null);
  const pendingResultsRef = useRef(null);

  useEffect(() => {
    return () => {
      if (raceTimerRef.current) clearInterval(raceTimerRef.current);
      if (stageTimeoutRef.current) clearTimeout(stageTimeoutRef.current);
    };
  }, []);

  const startRace = () => {
    if (raceState === 'staging' || raceState === 'running') return;

    setRaceState('staging');
    setTreeStage(1);
    setElapsedTime(0);
    setLiveIceProgress(0);
    setLiveEvProgress(0);
    setLiveIceSpeed(0);
    setLiveEvSpeed(0);
    setRaceResults(null);

    const netIceWeight = iceWeight + (iceFuelLoad * 0.48);
    const netEvWeight = evWeight;
    const simResults = simulateQuarterMileRace(
      { weightKg: netIceWeight },
      { weightKg: netEvWeight, powerMode }
    );
    pendingResultsRef.current = simResults;

    // Staging sequence
    stageTimeoutRef.current = setTimeout(() => {
      setTreeStage(2);

      stageTimeoutRef.current = setTimeout(() => {
        setTreeStage(3);

        stageTimeoutRef.current = setTimeout(() => {
          setTreeStage(4);

          stageTimeoutRef.current = setTimeout(() => {
            setTreeStage(5);

            stageTimeoutRef.current = setTimeout(() => {
              setTreeStage(6);
              setRaceState('running');

              const startTime = Date.now();
              const raceMaxTime = Math.max(simResults.ice.tQuarterMile, simResults.ev.tQuarterMile);

              raceTimerRef.current = setInterval(() => {
                const now = Date.now();
                const curSec = (now - startTime) / 1000;
                setElapsedTime(Number(curSec.toFixed(2)));

                const getStatus = (targetTime, maxSpeed) => {
                  if (curSec >= targetTime) {
                    return { progress: 100, speed: maxSpeed };
                  }
                  const ratio = curSec / targetTime;
                  const progress = Math.min(100, Math.pow(ratio, 1.45) * 100);
                  const speed = Math.round(ratio * maxSpeed * 1.15);
                  return { progress, speed };
                };

                const iceStatus = getStatus(simResults.ice.tQuarterMile, simResults.ice.trapSpeedKmh);
                const evStatus = getStatus(simResults.ev.tQuarterMile, simResults.ev.trapSpeedKmh);

                setLiveIceProgress(iceStatus.progress);
                setLiveIceSpeed(iceStatus.speed);
                setLiveEvProgress(evStatus.progress);
                setLiveEvSpeed(evStatus.speed);

                if (curSec >= raceMaxTime + 0.25) {
                  clearInterval(raceTimerRef.current);
                  setRaceState('finished');
                  setLiveIceProgress(100);
                  setLiveEvProgress(100);
                  setRaceResults(pendingResultsRef.current);
                }
              }, 30);
            }, 400);
          }, 400);
        }, 400);
      }, 400);
    }, 400);
  };

  const resetRace = () => {
    if (raceTimerRef.current) clearInterval(raceTimerRef.current);
    if (stageTimeoutRef.current) clearTimeout(stageTimeoutRef.current);
    setRaceState('idle');
    setTreeStage(0);
    setElapsedTime(0);
    setLiveIceProgress(0);
    setLiveEvProgress(0);
    setLiveIceSpeed(0);
    setLiveEvSpeed(0);
    setRaceResults(null);
    pendingResultsRef.current = null;
  };

  // Calculate live lead delta in meters
  const iceDistMeters = Math.round((liveIceProgress / 100) * 402);
  const evDistMeters = Math.round((liveEvProgress / 100) * 402);
  const meterDelta = evDistMeters - iceDistMeters;

  return (
    <div className="space-y-6">
      {/* Control Header & Staging Tree */}
      <div className={`flex flex-wrap items-center justify-between gap-4 pb-4 border-b ${
        isDay ? 'border-black/[0.06]' : 'border-white/[0.06]'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-1.5 p-1 rounded-lg border ${
            isDay ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/10'
          }`}>
            <div className={`w-2.5 h-2.5 rounded-full ${treeStage >= 1 ? 'bg-cyan-500' : (isDay ? 'bg-slate-300' : 'bg-white/10')}`} title="Pre-Stage" />
            <div className={`w-2.5 h-2.5 rounded-full ${treeStage >= 2 ? 'bg-cyan-500' : (isDay ? 'bg-slate-300' : 'bg-white/10')}`} title="Stage" />
            <div className={`w-[1px] h-3 mx-0.5 ${isDay ? 'bg-slate-300' : 'bg-white/20'}`} />
            <div className={`w-2.5 h-2.5 rounded-full ${treeStage === 3 ? 'bg-amber-400' : (isDay ? 'bg-slate-300' : 'bg-white/10')}`} />
            <div className={`w-2.5 h-2.5 rounded-full ${treeStage === 4 ? 'bg-amber-400' : (isDay ? 'bg-slate-300' : 'bg-white/10')}`} />
            <div className={`w-2.5 h-2.5 rounded-full ${treeStage === 5 ? 'bg-amber-400' : (isDay ? 'bg-slate-300' : 'bg-white/10')}`} />
            <div className={`w-[1px] h-3 mx-0.5 ${isDay ? 'bg-slate-300' : 'bg-white/20'}`} />
            <div className={`w-2.5 h-2.5 rounded-full ${treeStage === 6 ? (isDay ? 'bg-emerald-500' : 'bg-porsche-acid') : (isDay ? 'bg-slate-300' : 'bg-white/10')}`} title="Green Launch" />
          </div>

          <span className={`text-xs font-medium ${isDay ? 'text-slate-600' : 'text-zinc-400'}`}>
            {treeStage === 6 ? 'Launch Green' : treeStage >= 3 ? 'Staging Countdown' : treeStage >= 1 ? 'Pre-Stage Staged' : 'Ready'}
          </span>
        </div>

        {/* Elapsed Timer & Launch Action */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className={`text-[10px] uppercase tracking-wider block font-sans ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>Elapsed Time</span>
            <span className={`font-mono text-base font-semibold num-tabular ${isDay ? 'text-slate-900' : 'text-white'}`}>{elapsedTime.toFixed(2)}s</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={startRace}
              disabled={raceState === 'staging' || raceState === 'running'}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                raceState === 'running'
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : raceState === 'staging'
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                  : 'bg-porsche-carmine hover:bg-porsche-carmineHover text-white shadow-sm'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{raceState === 'running' ? 'Running' : raceState === 'staging' ? 'Staging...' : 'Launch Benchmark'}</span>
            </button>

            <button
              onClick={resetRace}
              className={`p-2 rounded-lg border transition-all ${
                isDay
                  ? 'border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900'
                  : 'border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white'
              }`}
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Clean Drag Lanes */}
      <div className="space-y-4">
        {/* Lane 1: 911 GT3 RS with theme-aware SVG */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className={`font-semibold flex items-center space-x-2 ${isDay ? 'text-slate-900' : 'text-white'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-porsche-carmine" />
              <span>911 GT3 RS (4.0L Boxer NA)</span>
            </span>
            <span className={`font-mono text-[11px] num-tabular ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>
              {liveIceSpeed} km/h • {Math.round((liveIceProgress / 100) * 402)} m
            </span>
          </div>

          <div className={`w-full h-11 rounded-lg border relative overflow-hidden flex items-center transition-colors ${
            isDay ? 'bg-slate-100/90 border-slate-200' : 'bg-studio-950 border-white/[0.06]'
          }`}>
            <div className={`absolute inset-x-0 h-[1px] border-b border-dashed ${isDay ? 'border-slate-300' : 'border-white/10'}`} />
            <div className={`absolute right-0 top-0 bottom-0 w-2 border-l ${isDay ? 'border-slate-300 bg-slate-200/50' : 'border-white/20 bg-white/[0.02]'}`} />

            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-75 flex items-center space-x-1.5"
              style={{ left: `calc(${liveIceProgress * 0.90}% + 4px)` }}
            >
              <div className={`w-14 h-5 rounded border flex items-center justify-center ${
                isDay
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : 'bg-porsche-carmine/20 border-porsche-carmine/40 text-rose-400'
              }`}>
                <span className="text-[9px] font-bold tracking-wider">RWD ICE</span>
              </div>
              <span className="text-[10px] font-mono font-semibold text-white bg-porsche-carmine px-1.5 py-0.5 rounded shadow-sm">
                GT3 RS
              </span>
            </div>
          </div>
        </div>

        {/* Lane 2: Taycan Turbo GT */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className={`font-semibold flex items-center space-x-2 ${isDay ? 'text-slate-900' : 'text-white'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isDay ? 'bg-emerald-600' : 'bg-porsche-acid'}`} />
              <span>Taycan Turbo GT (Dual-Motor PSM)</span>
            </span>
            <span className={`font-mono text-[11px] num-tabular ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>
              {liveEvSpeed} km/h • {Math.round((liveEvProgress / 100) * 402)} m
            </span>
          </div>

          <div className={`w-full h-11 rounded-lg border relative overflow-hidden flex items-center transition-colors ${
            isDay ? 'bg-slate-100/90 border-slate-200' : 'bg-studio-950 border-white/[0.06]'
          }`}>
            <div className={`absolute inset-x-0 h-[1px] border-b border-dashed ${isDay ? 'border-slate-300' : 'border-white/10'}`} />
            <div className={`absolute right-0 top-0 bottom-0 w-2 border-l ${isDay ? 'border-slate-300 bg-slate-200/50' : 'border-white/20 bg-white/[0.02]'}`} />

            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-75 flex items-center space-x-1.5"
              style={{ left: `calc(${liveEvProgress * 0.90}% + 4px)` }}
            >
              <div className={`w-14 h-5 rounded border flex items-center justify-center ${
                isDay
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-porsche-acid/20 border-porsche-acid/40 text-porsche-acid'
              }`}>
                <span className="text-[9px] font-bold tracking-wider">AWD EV</span>
              </div>
              <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded shadow-sm ${
                isDay ? 'bg-emerald-600 text-white' : 'bg-porsche-acid text-black'
              }`}>
                TURBO GT
              </span>
            </div>
          </div>
        </div>

        {/* Distance Markers */}
        <div className={`flex justify-between text-[10px] font-mono pt-1 ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>
          <span>0 m</span>
          <span>100 m</span>
          <span>201 m (1/8 mi)</span>
          <span>300 m</span>
          <span className={isDay ? 'text-slate-700 font-medium' : 'text-zinc-300'}>402 m (1/4 mi)</span>
        </div>
      </div>

      {/* Live Animated Side-by-Side Acceleration Progress Tracker (Active during Staging & Run) */}
      {(raceState === 'staging' || raceState === 'running') && (
        <div className={`mt-4 p-4 rounded-xl border space-y-3.5 transition-all duration-200 ${
          isDay
            ? 'bg-slate-50 border-slate-200 shadow-sm'
            : 'bg-white/[0.03] border-white/10 shadow-lg'
        }`}>
          <div className="flex items-center justify-between text-xs pb-2 border-b border-black/[0.06] dark:border-white/[0.06]">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${
                raceState === 'running' ? 'bg-porsche-carmine animate-ping' : 'bg-amber-400 animate-pulse'
              }`} />
              <span className={`font-semibold tracking-wide ${isDay ? 'text-slate-900' : 'text-white'}`}>
                {raceState === 'staging' ? 'Christmas Tree Staging Countdown' : 'Live Quarter-Mile Telemetry Stream'}
              </span>
            </div>

            <div className="flex items-center space-x-3 font-mono text-[11px]">
              {raceState === 'running' && (
                <span className={`px-2 py-0.5 rounded font-medium ${
                  meterDelta > 2
                    ? (isDay ? 'text-emerald-700 bg-emerald-50' : 'text-porsche-acid bg-porsche-acid/10')
                    : meterDelta < -2
                    ? 'text-porsche-carmine bg-porsche-carmine/10'
                    : 'text-zinc-400'
                }`}>
                  {meterDelta > 2
                    ? `Taycan +${meterDelta}m`
                    : meterDelta < -2
                    ? `GT3 RS +${Math.abs(meterDelta)}m`
                    : 'Dead Heat ±0m'}
                </span>
              )}
              <span className={`num-tabular font-semibold text-xs ${isDay ? 'text-slate-900' : 'text-white'}`}>
                {elapsedTime.toFixed(2)}s
              </span>
            </div>
          </div>

          {/* Dual Side-by-Side Live Progression Bars */}
          <div className="space-y-2.5">
            {/* Lane 1: 911 GT3 RS */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className={`flex items-center space-x-1.5 font-medium ${isDay ? 'text-slate-800' : 'text-zinc-200'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-porsche-carmine" />
                  <span>911 GT3 RS</span>
                </span>
                <span className={`num-tabular ${isDay ? 'text-slate-600' : 'text-zinc-400'}`}>
                  {liveIceSpeed} km/h • {iceDistMeters}m / 402m ({liveIceProgress.toFixed(0)}%)
                </span>
              </div>
              <div className={`h-2 w-full rounded-full overflow-hidden ${isDay ? 'bg-slate-200' : 'bg-white/[0.06]'}`}>
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-porsche-carmine rounded-full transition-all duration-75"
                  style={{ width: `${liveIceProgress}%` }}
                />
              </div>
            </div>

            {/* Lane 2: Taycan Turbo GT */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className={`flex items-center space-x-1.5 font-medium ${isDay ? 'text-slate-800' : 'text-zinc-200'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isDay ? 'bg-emerald-600' : 'bg-porsche-acid'}`} />
                  <span>Taycan Turbo GT</span>
                </span>
                <span className={`num-tabular ${isDay ? 'text-slate-600' : 'text-zinc-400'}`}>
                  {liveEvSpeed} km/h • {evDistMeters}m / 402m ({liveEvProgress.toFixed(0)}%)
                </span>
              </div>
              <div className={`h-2 w-full rounded-full overflow-hidden ${isDay ? 'bg-slate-200' : 'bg-white/[0.06]'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-75 ${
                    isDay ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-lime-400 to-porsche-acid'
                  }`}
                  style={{ width: `${liveEvProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Time Slip Result Table (Revealed after Finish Line) */}
      {raceState === 'finished' && raceResults && (
        <div className={`mt-4 p-4 rounded-xl border space-y-3 ${
          isDay ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/[0.06]'
        }`}>
          <div className={`flex items-center justify-between pb-2 border-b ${
            isDay ? 'border-black/[0.06]' : 'border-white/[0.06]'
          }`}>
            <div className="flex items-center space-x-2">
              <Trophy className={`w-4 h-4 ${isDay ? 'text-amber-500' : 'text-porsche-acid'}`} />
              <span className={`text-xs font-semibold ${isDay ? 'text-slate-900' : 'text-white'}`}>Official Benchmark Time Slip</span>
            </div>
            <div className="text-xs">
              Winner: <strong className={raceResults.winner === 'ev' ? (isDay ? 'text-emerald-700' : 'text-porsche-acid') : 'text-porsche-carmine'}>
                {raceResults.winner === 'ev' ? 'Taycan Turbo GT' : '911 GT3 RS'}
              </strong>
              <span className={`ml-1.5 ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>(-{raceResults.deltaQuarterMile}s delta)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
            <div className={`p-2.5 rounded-lg border ${
              isDay ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/[0.02] border-white/[0.04]'
            }`}>
              <span className={`text-[10px] font-sans block mb-1 ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>0–100 km/h</span>
              <div className={`font-mono font-medium ${isDay ? 'text-slate-900' : 'text-white'}`}>
                <span className="text-porsche-carmine">{raceResults.ice.t0to100}s</span> vs <span className={isDay ? 'text-emerald-700' : 'text-porsche-acid'}>{raceResults.ev.t0to100}s</span>
              </div>
            </div>

            <div className={`p-2.5 rounded-lg border ${
              isDay ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/[0.02] border-white/[0.04]'
            }`}>
              <span className={`text-[10px] font-sans block mb-1 ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>0–200 km/h</span>
              <div className={`font-mono font-medium ${isDay ? 'text-slate-900' : 'text-white'}`}>
                <span className="text-porsche-carmine">{raceResults.ice.t0to200}s</span> vs <span className={isDay ? 'text-emerald-700' : 'text-porsche-acid'}>{raceResults.ev.t0to200}s</span>
              </div>
            </div>

            <div className={`p-2.5 rounded-lg border ${
              isDay ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/[0.02] border-white/[0.04]'
            }`}>
              <span className={`text-[10px] font-sans block mb-1 ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>Quarter Mile (402m)</span>
              <div className={`font-mono font-semibold ${isDay ? 'text-slate-900' : 'text-white'}`}>
                <span className="text-porsche-carmine">{raceResults.ice.tQuarterMile}s</span> vs <span className={isDay ? 'text-emerald-700' : 'text-porsche-acid'}>{raceResults.ev.tQuarterMile}s</span>
              </div>
            </div>

            <div className={`p-2.5 rounded-lg border ${
              isDay ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/[0.02] border-white/[0.04]'
            }`}>
              <span className={`text-[10px] font-sans block mb-1 ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>Trap Velocity</span>
              <div className={`font-mono font-medium ${isDay ? 'text-slate-900' : 'text-white'}`}>
                <span className="text-porsche-carmine">{raceResults.ice.trapSpeedKmh}k</span> vs <span className={isDay ? 'text-emerald-700' : 'text-porsche-acid'}>{raceResults.ev.trapSpeedKmh}k</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
