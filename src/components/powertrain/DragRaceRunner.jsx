import React, { useState, useEffect, useRef } from 'react';
import { Flag, Play, RotateCcw, Trophy, Timer, Zap, Gauge } from 'lucide-react';
import { simulateQuarterMileRace } from '../../constants/powertrainData';

export default function DragRaceRunner({
  iceWeight,
  evWeight,
  powerMode,
  iceFuelLoad,
  evBatterySoc,
}) {
  const [raceState, setRaceState] = useState('idle'); // 'idle' | 'staging' | 'running' | 'finished'
  const [treeStage, setTreeStage] = useState(0); // 0=off, 1=pre-stage, 2=stage, 3=amber1, 4=amber2, 5=amber3, 6=green
  const [elapsedTime, setElapsedTime] = useState(0);
  const [raceResults, setRaceResults] = useState(null);
  const [liveIceProgress, setLiveIceProgress] = useState(0); // 0 to 100%
  const [liveEvProgress, setLiveEvProgress] = useState(0);
  const [liveIceSpeed, setLiveIceSpeed] = useState(0);
  const [liveEvSpeed, setLiveEvSpeed] = useState(0);

  const raceTimerRef = useRef(null);
  const stageTimeoutRef = useRef(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (raceTimerRef.current) clearInterval(raceTimerRef.current);
      if (stageTimeoutRef.current) clearTimeout(stageTimeoutRef.current);
    };
  }, []);

  const startRace = () => {
    if (raceState === 'staging' || raceState === 'running') return;

    // Reset states
    setRaceState('staging');
    setTreeStage(1);
    setElapsedTime(0);
    setLiveIceProgress(0);
    setLiveEvProgress(0);
    setLiveIceSpeed(0);
    setLiveEvSpeed(0);
    setRaceResults(null);

    // Run physics simulation to get exact time series
    // Adjust weights based on fuel/battery
    const netIceWeight = iceWeight + (iceFuelLoad * 0.48); // ~0.75 kg per liter
    const netEvWeight = evWeight;
    const simResults = simulateQuarterMileRace(
      { weightKg: netIceWeight },
      { weightKg: netEvWeight, powerMode }
    );
    setRaceResults(simResults);

    // Staging light sequence:
    // Pre-stage (1) -> Stage (2) -> Amber 1 (3) -> Amber 2 (4) -> Amber 3 (5) -> Green (6)
    stageTimeoutRef.current = setTimeout(() => {
      setTreeStage(2);

      stageTimeoutRef.current = setTimeout(() => {
        setTreeStage(3);

        stageTimeoutRef.current = setTimeout(() => {
          setTreeStage(4);

          stageTimeoutRef.current = setTimeout(() => {
            setTreeStage(5);

            stageTimeoutRef.current = setTimeout(() => {
              // GREEN LIGHT! LAUNCH!
              setTreeStage(6);
              setRaceState('running');

              const startTime = Date.now();
              const raceMaxTime = Math.max(simResults.ice.tQuarterMile, simResults.ev.tQuarterMile);

              raceTimerRef.current = setInterval(() => {
                const now = Date.now();
                const curSec = (now - startTime) / 1000;
                setElapsedTime(Number(curSec.toFixed(2)));

                // Interpolate vehicle progress
                const getVehicleStatus = (series, targetTime) => {
                  if (curSec >= targetTime) {
                    return { progress: 100, speed: series[series.length - 1].speedKmh };
                  }
                  const ratio = curSec / targetTime;
                  // Non-linear acceleration curve
                  const progress = Math.min(100, Math.pow(ratio, 1.4) * 100);
                  const speed = Math.round(ratio * series[series.length - 1].speedKmh * 1.15);
                  return { progress, speed };
                };

                const iceStatus = getVehicleStatus(simResults.ice.timeSeries, simResults.ice.tQuarterMile);
                const evStatus = getVehicleStatus(simResults.ev.timeSeries, simResults.ev.tQuarterMile);

                setLiveIceProgress(iceStatus.progress);
                setLiveIceSpeed(iceStatus.speed);
                setLiveEvProgress(evStatus.progress);
                setLiveEvSpeed(evStatus.speed);

                if (curSec >= raceMaxTime + 0.3) {
                  clearInterval(raceTimerRef.current);
                  setRaceState('finished');
                  setLiveIceProgress(100);
                  setLiveEvProgress(100);
                }
              }, 30);
            }, 400); // Amber 3 to Green
          }, 400); // Amber 2 to Amber 3
        }, 400); // Amber 1 to Amber 2
      }, 500); // Stage to Amber 1
    }, 400); // Pre-stage to Stage
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
  };

  return (
    <div className="space-y-4">
      {/* Control Strip & Christmas Tree Header */}
      <div className="p-3 rounded border border-white/10 bg-black/70 flex flex-wrap items-center justify-between gap-3">
        {/* Christmas Tree Visualizer */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 p-1 rounded bg-black/90 border border-white/10">
            {/* Stage bulbs */}
            <div className={`w-3 h-3 rounded-full border ${treeStage >= 1 ? 'bg-cyan-400 shadow-[0_0_8px_#00F0FF] border-cyan-300' : 'bg-slate-800 border-white/5'}`} title="Pre-Stage" />
            <div className={`w-3 h-3 rounded-full border ${treeStage >= 2 ? 'bg-cyan-400 shadow-[0_0_8px_#00F0FF] border-cyan-300' : 'bg-slate-800 border-white/5'}`} title="Stage" />
            <div className="w-[1px] h-4 bg-white/20 mx-1" />
            {/* Amber count down */}
            <div className={`w-3 h-3 rounded-full border ${treeStage === 3 ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B] border-amber-300' : 'bg-slate-800 border-white/5'}`} />
            <div className={`w-3 h-3 rounded-full border ${treeStage === 4 ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B] border-amber-300' : 'bg-slate-800 border-white/5'}`} />
            <div className={`w-3 h-3 rounded-full border ${treeStage === 5 ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B] border-amber-300' : 'bg-slate-800 border-white/5'}`} />
            <div className="w-[1px] h-4 bg-white/20 mx-1" />
            {/* Green GO bulb */}
            <div className={`w-3 h-3 rounded-full border ${treeStage === 6 ? 'bg-porsche-acid shadow-glow-acid border-porsche-acid animate-pulse' : 'bg-slate-800 border-white/5'}`} title="Green Launch" />
          </div>

          <div className="font-mono text-xs">
            <span className="text-slate-400">TREE STATUS: </span>
            <span className={`font-bold ${treeStage === 6 ? 'text-porsche-acid text-glow-acid' : treeStage >= 1 ? 'text-amber-400' : 'text-slate-400'}`}>
              {treeStage === 6 ? 'GREEN LIGHT! GO!' : treeStage >= 3 ? 'STAGING COUNTDOWN...' : treeStage >= 1 ? 'PRE-STAGE READY' : 'STANDBY'}
            </span>
          </div>
        </div>

        {/* Live Elapsed Time Ticker */}
        <div className="flex items-center space-x-3">
          <div className="font-mono text-center">
            <div className="text-[10px] text-slate-400">ELAPSED TIME</div>
            <div className="text-lg md:text-xl font-black text-white text-glow-cyan">
              {elapsedTime.toFixed(2)}s
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={startRace}
              disabled={raceState === 'staging' || raceState === 'running'}
              className={`px-4 py-2 rounded font-mono font-bold text-xs tracking-wider border transition-all flex items-center space-x-2 ${
                raceState === 'running'
                  ? 'bg-porsche-acid/20 border-porsche-acid text-porsche-acid animate-pulse cursor-not-allowed'
                  : raceState === 'staging'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 cursor-not-allowed'
                  : 'bg-porsche-acid text-black border-porsche-acid shadow-glow-acid hover:scale-105'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{raceState === 'running' ? 'RACE IN PROGRESS' : raceState === 'staging' ? 'STAGING...' : 'LAUNCH DRAG RACE'}</span>
            </button>

            <button
              onClick={resetRace}
              className="p-2 rounded font-mono text-xs border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20"
              title="Reset race strip"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Drag Strip with 2 Lanes */}
      <div className="p-4 rounded border border-white/10 bg-porsche-darker/95 relative overflow-hidden font-mono">
        {/* Track Distance Markers */}
        <div className="flex justify-between text-[10px] text-slate-500 pb-2 border-b border-white/10">
          <span>START LINE (0m)</span>
          <span>60 FT (18m)</span>
          <span>1/8 MILE (201m)</span>
          <span>1000 FT (304m)</span>
          <span className="text-porsche-acid font-bold">1/4 MILE TRAP (402m)</span>
        </div>

        {/* Lane 1: Porsche 911 GT3 RS (ICE) */}
        <div className="my-4 relative">
          <div className="flex justify-between items-center text-xs mb-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-porsche-red" />
              <span className="font-bold text-red-200">LANE 1: 911 GT3 RS 4.0L BOXER (ICE)</span>
            </div>
            <div className="space-x-3 text-slate-300 text-[11px]">
              <span>SPEED: <strong className="text-white">{liveIceSpeed} km/h</strong></span>
              <span>DISTANCE: <strong className="text-porsche-red">{Math.round((liveIceProgress / 100) * 402)} m</strong></span>
            </div>
          </div>

          {/* Asphalt Track Surface */}
          <div className="w-full h-10 bg-slate-950 rounded border border-white/10 relative overflow-hidden flex items-center">
            {/* Center dashed line */}
            <div className="absolute inset-x-0 h-[1px] border-b border-dashed border-white/15" />
            
            {/* Finish beam checkerboard */}
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-r from-transparent to-white/20 border-l border-white/40" />

            {/* Car Avatar Marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-75 flex items-center"
              style={{ left: `calc(${liveIceProgress * 0.92}% + 4px)` }}
            >
              <div className="px-2.5 py-1 rounded bg-porsche-red text-white text-[10px] font-black border border-white shadow-glow-red flex items-center space-x-1 whitespace-nowrap">
                <span>911 GT3 RS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lane 2: Porsche Taycan Turbo GT (EV) */}
        <div className="my-4 relative">
          <div className="flex justify-between items-center text-xs mb-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-porsche-acid" />
              <span className="font-bold text-lime-200">LANE 2: TAYCAN TURBO GT DUAL-MOTOR (EV)</span>
            </div>
            <div className="space-x-3 text-slate-300 text-[11px]">
              <span>SPEED: <strong className="text-white">{liveEvSpeed} km/h</strong></span>
              <span>DISTANCE: <strong className="text-porsche-acid">{Math.round((liveEvProgress / 100) * 402)} m</strong></span>
            </div>
          </div>

          {/* Asphalt Track Surface */}
          <div className="w-full h-10 bg-slate-950 rounded border border-white/10 relative overflow-hidden flex items-center">
            {/* Center dashed line */}
            <div className="absolute inset-x-0 h-[1px] border-b border-dashed border-white/15" />
            
            {/* Finish beam checkerboard */}
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-r from-transparent to-white/20 border-l border-white/40" />

            {/* Car Avatar Marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-75 flex items-center"
              style={{ left: `calc(${liveEvProgress * 0.92}% + 4px)` }}
            >
              <div className="px-2.5 py-1 rounded bg-porsche-acid text-black text-[10px] font-black border border-black shadow-glow-acid flex items-center space-x-1 whitespace-nowrap">
                <span>TURBO GT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Results Time Slip */}
      {raceResults && (
        <div className="p-4 rounded border border-white/10 bg-black/80 font-mono animate-fadeIn">
          {/* Winner Banner */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold uppercase tracking-wider text-slate-100">
                OFFICIAL DRAG STRIP TIME SLIP:
              </span>
            </div>
            <div className="text-xs">
              WINNER: <strong className={raceResults.winner === 'ev' ? 'text-porsche-acid text-glow-acid' : 'text-porsche-red text-glow-red'}>
                {raceResults.winner === 'ev' ? 'TAYCAN TURBO GT (EV)' : '911 GT3 RS (ICE)'}
              </strong>
              <span className="text-slate-400 ml-2">(-{raceResults.deltaQuarterMile}s margin)</span>
            </div>
          </div>

          {/* Side by Side Split Time Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded bg-white/5 border border-white/5">
              <div className="text-[10px] text-slate-400">0 - 100 KM/H</div>
              <div className="flex justify-around items-baseline mt-1 font-bold">
                <span className="text-porsche-red">{raceResults.ice.t0to100}s</span>
                <span className="text-slate-600">vs</span>
                <span className="text-porsche-acid">{raceResults.ev.t0to100}s</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-white/5 border border-white/5">
              <div className="text-[10px] text-slate-400">0 - 200 KM/H</div>
              <div className="flex justify-around items-baseline mt-1 font-bold">
                <span className="text-porsche-red">{raceResults.ice.t0to200}s</span>
                <span className="text-slate-600">vs</span>
                <span className="text-porsche-acid">{raceResults.ev.t0to200}s</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-white/5 border border-white/5">
              <div className="text-[10px] text-slate-400">1/4 MILE ET (400M)</div>
              <div className="flex justify-around items-baseline mt-1 font-bold text-sm">
                <span className="text-porsche-red">{raceResults.ice.tQuarterMile}s</span>
                <span className="text-slate-600">vs</span>
                <span className="text-porsche-acid">{raceResults.ev.tQuarterMile}s</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-white/5 border border-white/5">
              <div className="text-[10px] text-slate-400">TRAP SPEED</div>
              <div className="flex justify-around items-baseline mt-1 font-bold">
                <span className="text-porsche-red">{raceResults.ice.trapSpeedKmh} km/h</span>
                <span className="text-slate-600">vs</span>
                <span className="text-porsche-acid">{raceResults.ev.trapSpeedKmh} km/h</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
