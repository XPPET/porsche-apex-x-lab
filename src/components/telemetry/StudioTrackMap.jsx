import React from 'react';
import { TRACK_INFO, TRACK_PATH_POINTS } from '../../constants/trackData';
import { useTheme } from '../../context/ThemeContext';

export default function StudioTrackMap({
  lapDistance,
  sector,
  lapTimeMs,
  deltaToRecord,
}) {
  const { isDay } = useTheme();

  const formatLapTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    const millis = Math.floor((ms % 1000) / 10);
    return `${minutes}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(2, '0')}`;
  };

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

  const pathD = TRACK_PATH_POINTS.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '') + ' Z';

  const currentSectorObj = TRACK_INFO.sectors.find(s => s.id === sector) || TRACK_INFO.sectors[0];

  return (
    <div className="w-full flex flex-col justify-between">
      {/* Track Stats Bar */}
      <div className={`flex items-center justify-between pb-3 mb-2 border-b text-xs ${
        isDay ? 'border-black/[0.06]' : 'border-white/[0.06]'
      }`}>
        <div>
          <span className={`text-[11px] uppercase tracking-wider block ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>CIRCUIT</span>
          <span className={`font-semibold ${isDay ? 'text-slate-900' : 'text-white'}`}>{TRACK_INFO.name}</span>
        </div>
        <div>
          <span className={`text-[11px] uppercase tracking-wider block ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>RECORD</span>
          <span className={`font-mono ${isDay ? 'text-slate-700' : 'text-zinc-300'}`}>{TRACK_INFO.recordLapTime}</span>
        </div>
        <div>
          <span className={`text-[11px] uppercase tracking-wider block ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>LAP TIME</span>
          <span className={`font-mono font-medium num-tabular ${isDay ? 'text-slate-900' : 'text-white'}`}>{formatLapTime(lapTimeMs)}</span>
        </div>
        <div>
          <span className={`text-[11px] uppercase tracking-wider block ${isDay ? 'text-slate-400' : 'text-zinc-500'}`}>DELTA</span>
          <span className={`font-mono font-medium num-tabular ${deltaToRecord <= 0 ? (isDay ? 'text-emerald-600' : 'text-porsche-acid') : 'text-porsche-carmine'}`}>
            {deltaToRecord > 0 ? `+${deltaToRecord.toFixed(3)}s` : `${deltaToRecord.toFixed(3)}s`}
          </span>
        </div>
      </div>

      {/* Clean Track SVG */}
      <div className={`relative w-full h-[210px] md:h-[230px] rounded-xl flex items-center justify-center overflow-hidden border transition-colors ${
        isDay ? 'bg-slate-100/70 border-slate-200' : 'bg-studio-950 border-white/[0.05]'
      }`}>
        <svg viewBox="150 180 800 660" className="w-full h-full p-2 overflow-visible">
          {/* Track outline */}
          <path
            d={pathD}
            fill="none"
            stroke={isDay ? "rgba(15, 23, 42, 0.22)" : "rgba(255, 255, 255, 0.15)"}
            strokeWidth="5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Active Sector segment */}
          <path
            d={pathD}
            fill="none"
            stroke={isDay ? "rgba(16, 185, 129, 0.6)" : "rgba(148, 224, 0, 0.4)"}
            strokeWidth="2.5"
            strokeDasharray="8 6"
            strokeLinejoin="round"
          />

          {/* Car position dot */}
          <g transform={`translate(${carX}, ${carY})`}>
            <circle r="8" fill="rgba(213, 0, 28, 0.2)" />
            <circle r="4.5" fill="#D5001C" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        </svg>

        {/* Sector Badge */}
        <div className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-md backdrop-blur-md border text-[11px] ${
          isDay ? 'bg-white/90 border-slate-200 text-slate-700' : 'bg-black/60 border-white/10 text-zinc-300'
        }`}>
          Sector {sector}: <span className={`font-semibold ${isDay ? 'text-slate-900' : 'text-white'}`}>{currentSectorObj.name}</span>
        </div>

        {/* Distance Badge */}
        <div className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-md backdrop-blur-md border text-[11px] font-mono num-tabular ${
          isDay ? 'bg-white/90 border-slate-200 text-slate-600' : 'bg-black/60 border-white/10 text-zinc-400'
        }`}>
          {(lapDistance / 1000).toFixed(2)} / {(totalLength / 1000).toFixed(2)} km
        </div>
      </div>
    </div>
  );
}
