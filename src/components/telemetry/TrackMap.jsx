import React from 'react';
import { Flag, Timer, TrendingUp, Navigation } from 'lucide-react';
import { TRACK_INFO, TRACK_PATH_POINTS } from '../../constants/trackData';

export default function TrackMap({
  lapDistance,
  sector,
  lapTimeMs,
  deltaToRecord,
  speed,
}) {
  // Format lap time ms to mm:ss.ms
  const formatLapTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    const millis = Math.floor((ms % 1000) / 10);
    return `${minutes}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(2, '0')}`;
  };

  // Interpolate car marker position along TRACK_PATH_POINTS based on lapDistance
  const totalLength = TRACK_INFO.lengthMeters;
  const progressRatio = (lapDistance % totalLength) / totalLength;
  const pointIndexFloat = progressRatio * TRACK_PATH_POINTS.length;
  const currIndex = Math.floor(pointIndexFloat) % TRACK_PATH_POINTS.length;
  const nextIndex = (currIndex + 1) % TRACK_PATH_POINTS.length;
  const fraction = pointIndexFloat - Math.floor(pointIndexFloat);

  const ptA = TRACK_PATH_POINTS[currIndex];
  const ptB = TRACK_PATH_POINTS[nextIndex];

  const carX = ptA.x + (ptB.x - ptA.x) * fraction;
  const carY = ptA.y + (ptB.y - ptA.y) * fraction;

  // Build SVG path string from points
  const pathD = TRACK_PATH_POINTS.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '') + ' Z';

  const currentSectorObj = TRACK_INFO.sectors.find(s => s.id === sector) || TRACK_INFO.sectors[0];

  return (
    <div className="w-full h-full flex flex-col justify-between font-mono">
      {/* Track Telemetry HUD Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded bg-black/60 border border-white/10 text-xs">
        <div className="flex items-center space-x-2">
          <Flag className="w-4 h-4 text-porsche-acid" />
          <div>
            <span className="text-slate-400 text-[10px]">CURRENT TRACK:</span>
            <div className="text-white font-bold">{TRACK_INFO.name}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-right">
          <div>
            <span className="text-slate-400 text-[10px]">LAP RECORD:</span>
            <div className="text-slate-300 font-bold">{TRACK_INFO.recordLapTime}</div>
          </div>
          <div className="pl-3 border-l border-white/10">
            <span className="text-slate-400 text-[10px]">LIVE TIME:</span>
            <div className="text-white font-bold text-sm text-glow-acid">
              {formatLapTime(lapTimeMs)}
            </div>
          </div>
          <div className="pl-3 border-l border-white/10">
            <span className="text-slate-400 text-[10px]">DELTA:</span>
            <div className={`font-bold ${deltaToRecord <= 0 ? 'text-porsche-acid' : 'text-porsche-red'}`}>
              {deltaToRecord > 0 ? `+${deltaToRecord.toFixed(3)}s` : `${deltaToRecord.toFixed(3)}s`}
            </div>
          </div>
        </div>
      </div>

      {/* SVG Track Map Canvas */}
      <div className="relative w-full h-[220px] md:h-[240px] my-2 rounded border border-white/5 bg-porsche-darker/90 overflow-hidden flex items-center justify-center">
        {/* Background circuit grid */}
        <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />

        <svg viewBox="150 180 800 660" className="w-full h-full p-2 overflow-visible">
          {/* Track Shadow/Glow */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(0, 240, 255, 0.15)"
            strokeWidth="18"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Main Track Outline */}
          <path
            d={pathD}
            fill="none"
            stroke="#1E293B"
            strokeWidth="8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Active Sector Highlighting */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(150, 255, 0, 0.4)"
            strokeWidth="3"
            strokeDasharray="12 6"
            strokeLinejoin="round"
          />

          {/* Car Position Marker */}
          <g transform={`translate(${carX}, ${carY})`}>
            {/* Pulsing beacon */}
            <circle r="14" fill="rgba(224, 0, 26, 0.35)" className="animate-ping" />
            <circle r="8" fill="#E0001A" stroke="#FFFFFF" strokeWidth="2" />
            <circle r="3" fill="#FFFFFF" />
          </g>
        </svg>

        {/* Current Sector Badge */}
        <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/80 border border-white/10 text-[10px] text-slate-300">
          SECTOR {sector}: <span className="text-porsche-acid font-bold">{currentSectorObj.name}</span>
        </div>

        {/* Live Distance Meter */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 border border-white/10 text-[10px] text-slate-400">
          KM <span className="text-white font-bold">{(lapDistance / 1000).toFixed(2)}</span> / {(totalLength / 1000).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
