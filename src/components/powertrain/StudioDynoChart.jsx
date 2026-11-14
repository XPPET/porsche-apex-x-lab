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
import { useTheme } from '../../context/ThemeContext';

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

export default function StudioDynoChart({ powerMode = 'attack' }) {
  const { isDay } = useTheme();
  const [metricFilter, setMetricFilter] = useState('both');
  const dynoData = generateDynoCurves(powerMode);

  const datasets = [];

  if (metricFilter === 'both' || metricFilter === 'power') {
    datasets.push({
      label: '4.0L Boxer Power (PS)',
      data: dynoData.ice.power,
      borderColor: '#D5001C',
      backgroundColor: 'transparent',
      borderWidth: 1.8,
      tension: 0.35,
      pointRadius: 2.5,
      pointBackgroundColor: '#D5001C',
      yAxisID: 'yPower',
    });
    datasets.push({
      label: 'Dual-Motor EV Power (PS)',
      data: dynoData.ev.power,
      borderColor: isDay ? '#059669' : '#94E000',
      backgroundColor: 'transparent',
      borderWidth: 1.8,
      tension: 0.35,
      pointRadius: 2.5,
      pointBackgroundColor: isDay ? '#059669' : '#94E000',
      yAxisID: 'yPower',
    });
  }

  if (metricFilter === 'both' || metricFilter === 'torque') {
    datasets.push({
      label: '4.0L Boxer Torque (Nm)',
      data: dynoData.ice.torque,
      borderColor: isDay ? 'rgba(213, 0, 28, 0.4)' : 'rgba(213, 0, 28, 0.5)',
      borderDash: [4, 4],
      borderWidth: 1.4,
      tension: 0.35,
      pointRadius: 2,
      pointBackgroundColor: 'rgba(213, 0, 28, 0.5)',
      yAxisID: 'yTorque',
    });
    datasets.push({
      label: 'Dual-Motor EV Torque (Nm)',
      data: dynoData.ev.torque,
      borderColor: isDay ? 'rgba(5, 150, 105, 0.5)' : 'rgba(148, 224, 0, 0.5)',
      borderDash: [4, 4],
      borderWidth: 1.4,
      tension: 0.35,
      pointRadius: 2,
      pointBackgroundColor: isDay ? 'rgba(5, 150, 105, 0.5)' : 'rgba(148, 224, 0, 0.5)',
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
    animation: { duration: 250 },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: isDay ? '#475569' : '#94A3B8',
          font: { family: 'Inter', size: 10, weight: '500' },
          boxWidth: 8,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: isDay ? 'rgba(255, 255, 255, 0.98)' : 'rgba(14, 17, 23, 0.95)',
        titleColor: isDay ? '#0F172A' : '#FFFFFF',
        bodyColor: isDay ? '#334155' : '#CBD5E1',
        titleFont: { family: 'Inter', size: 12, weight: '600' },
        bodyFont: { family: 'JetBrains Mono', size: 11 },
        borderColor: isDay ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: isDay ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: isDay ? '#64748B' : '#64748B', font: { family: 'JetBrains Mono', size: 10 } },
        title: {
          display: true,
          text: 'ENGINE / MOTOR SPEED (RPM)',
          color: isDay ? '#64748B' : '#64748B',
          font: { family: 'Inter', size: 9, weight: '600' },
        },
      },
      yPower: {
        type: 'linear',
        position: 'left',
        min: 0,
        max: 1200,
        grid: { color: isDay ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.03)' },
        ticks: {
          color: isDay ? '#059669' : '#94A3B8',
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (v) => `${v} PS`,
        },
        title: {
          display: true,
          text: 'HORSEPOWER',
          color: isDay ? '#059669' : '#64748B',
          font: { family: 'Inter', size: 9, weight: '600' },
        },
      },
      yTorque: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 1500,
        grid: { drawOnChartArea: false },
        ticks: {
          color: '#D5001C',
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (v) => `${v} Nm`,
        },
        title: {
          display: true,
          text: 'TORQUE',
          color: '#D5001C',
          font: { family: 'Inter', size: 9, weight: '600' },
        },
      },
    },
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-medium ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>
          Dyno Output Curves
        </span>
        <div className={`flex items-center space-x-1 p-1 rounded-lg border transition-colors ${
          isDay ? 'bg-black/[0.03] border-black/[0.06]' : 'bg-white/[0.03] border-white/[0.06]'
        }`}>
          <button
            onClick={() => setMetricFilter('both')}
            className={`px-2 py-0.5 text-xs rounded-md font-medium transition-all ${
              metricFilter === 'both'
                ? (isDay ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/10 text-white')
                : (isDay ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-white')
            }`}
          >
            Combined
          </button>
          <button
            onClick={() => setMetricFilter('power')}
            className={`px-2 py-0.5 text-xs rounded-md font-medium transition-all ${
              metricFilter === 'power'
                ? (isDay ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/10 text-white')
                : (isDay ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-white')
            }`}
          >
            Power (PS)
          </button>
          <button
            onClick={() => setMetricFilter('torque')}
            className={`px-2 py-0.5 text-xs rounded-md font-medium transition-all ${
              metricFilter === 'torque'
                ? (isDay ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/10 text-white')
                : (isDay ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-white')
            }`}
          >
            Torque (Nm)
          </button>
        </div>
      </div>

      <div className="w-full h-[280px]">
        <Line data={chartConfig} options={chartOptions} />
      </div>
    </div>
  );
}
