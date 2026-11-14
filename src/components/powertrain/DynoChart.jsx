import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { generateDynoCurves } from '../../constants/powertrainData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DynoChart({ powerMode = 'attack' }) {
  const [viewMetric, setViewMetric] = useState('both'); // 'power' | 'torque' | 'both'
  const dynoData = generateDynoCurves(powerMode);

  const datasets = [];

  if (viewMetric === 'both' || viewMetric === 'power') {
    datasets.push({
      label: '4.0L Boxer ICE Power (PS)',
      data: dynoData.ice.power,
      borderColor: '#E0001A',
      backgroundColor: 'rgba(224, 0, 26, 0.1)',
      borderWidth: 2.5,
      tension: 0.35,
      fill: false,
      pointRadius: 3,
      yAxisID: 'yPower',
    });
    datasets.push({
      label: 'Dual-Motor EV Power (PS)',
      data: dynoData.ev.power,
      borderColor: '#96FF00',
      backgroundColor: 'rgba(150, 255, 0, 0.1)',
      borderWidth: 2.5,
      tension: 0.35,
      fill: false,
      pointRadius: 3,
      yAxisID: 'yPower',
    });
  }

  if (viewMetric === 'both' || viewMetric === 'torque') {
    datasets.push({
      label: '4.0L Boxer ICE Torque (Nm)',
      data: dynoData.ice.torque,
      borderColor: '#FF6B6B',
      borderDash: [5, 4],
      borderWidth: 2,
      tension: 0.35,
      fill: false,
      pointRadius: 3,
      yAxisID: 'yTorque',
    });
    datasets.push({
      label: 'Dual-Motor EV Torque (Nm)',
      data: dynoData.ev.torque,
      borderColor: '#B4FF33',
      borderDash: [5, 4],
      borderWidth: 2,
      tension: 0.35,
      fill: false,
      pointRadius: 3,
      yAxisID: 'yTorque',
    });
  }

  const chartConfig = {
    labels: dynoData.labels,
    datasets,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 350,
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94A3B8',
          font: { family: 'JetBrains Mono', size: 10, weight: 'bold' },
          boxWidth: 12,
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(8, 12, 20, 0.95)',
        titleFont: { family: 'JetBrains Mono', size: 12, weight: 'bold' },
        bodyFont: { family: 'JetBrains Mono', size: 11 },
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8', font: { family: 'JetBrains Mono', size: 10 } },
        title: {
          display: true,
          text: 'ENGINE / MOTOR ROTATIONAL SPEED (RPM)',
          color: '#64748B',
          font: { family: 'JetBrains Mono', size: 10, weight: 'bold' },
        },
      },
      yPower: {
        type: 'linear',
        position: 'left',
        min: 0,
        max: 1250,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: '#96FF00',
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (val) => `${val} PS`,
        },
        title: {
          display: true,
          text: 'HORSEPOWER (PS)',
          color: '#96FF00',
          font: { family: 'JetBrains Mono', size: 10, weight: 'bold' },
        },
      },
      yTorque: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 1500,
        grid: { drawOnChartArea: false },
        ticks: {
          color: '#E0001A',
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (val) => `${val} Nm`,
        },
        title: {
          display: true,
          text: 'TORQUE (Nm)',
          color: '#E0001A',
          font: { family: 'JetBrains Mono', size: 10, weight: 'bold' },
        },
      },
    },
  };

  return (
    <div className="w-full">
      {/* View Toggle */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          CHASSIS DYNAMOMETER TELEMETRY
        </span>
        <div className="flex items-center space-x-1 bg-white/5 p-1 rounded border border-white/10">
          <button
            onClick={() => setViewMetric('both')}
            className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
              viewMetric === 'both' ? 'bg-white/20 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            COMBINED
          </button>
          <button
            onClick={() => setViewMetric('power')}
            className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
              viewMetric === 'power' ? 'bg-porsche-acid/20 text-porsche-acid font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            POWER (PS)
          </button>
          <button
            onClick={() => setViewMetric('torque')}
            className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
              viewMetric === 'torque' ? 'bg-porsche-red/20 text-porsche-red font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            TORQUE (Nm)
          </button>
        </div>
      </div>

      <div className="w-full h-[280px] md:h-[320px]">
        <Line data={chartConfig} options={chartOptions} />
      </div>

      <div className="mt-2.5 p-2 rounded bg-black/40 border border-white/5 text-[10px] font-mono text-slate-400 flex justify-between">
        <span className="text-porsche-red font-semibold">
          • ICE: Linear power crescendo reaching 525 PS at 8,500 RPM screamer
        </span>
        <span className="text-porsche-acid font-semibold">
          • EV: 1,340 Nm instantaneous torque from 0 RPM flat plateau
        </span>
      </div>
    </div>
  );
}
