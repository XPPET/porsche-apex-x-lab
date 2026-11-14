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
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { generateAeroCurveData, generateSpeedCurveData } from '../../constants/aeroConstants';
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

export default function StudioAeroChart({
  wingAngle,
  rideHeight,
  airSpeedKmh,
  drsActive,
}) {
  const { isDay } = useTheme();
  const [chartMode, setChartMode] = useState('angle');

  const angleData = generateAeroCurveData(airSpeedKmh, rideHeight, drsActive);
  const speedData = generateSpeedCurveData(wingAngle, rideHeight, drsActive);

  const activeData = chartMode === 'angle' ? angleData : speedData;

  const chartConfig = {
    labels: activeData.labels,
    datasets: [
      {
        label: 'Downforce Fd (N)',
        data: activeData.downforceData,
        borderColor: isDay ? '#059669' : '#94E000',
        backgroundColor: isDay ? 'rgba(5, 150, 105, 0.08)' : 'rgba(148, 224, 0, 0.05)',
        borderWidth: 1.8,
        tension: 0.35,
        fill: true,
        pointBackgroundColor: isDay ? '#059669' : '#94E000',
        pointBorderColor: isDay ? '#FFFFFF' : '#0E1117',
        pointBorderWidth: 1.5,
        pointRadius: 3,
        pointHoverRadius: 6,
        yAxisID: 'yDownforce',
      },
      {
        label: 'Aerodynamic Drag Fx (N)',
        data: activeData.dragData,
        borderColor: '#D5001C',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderDash: [4, 4],
        tension: 0.35,
        fill: false,
        pointBackgroundColor: '#D5001C',
        pointBorderColor: isDay ? '#FFFFFF' : '#0E1117',
        pointBorderWidth: 1.5,
        pointRadius: 3,
        pointHoverRadius: 6,
        yAxisID: 'yDrag',
      },
    ],
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
          font: { family: 'Inter', size: 11, weight: '500' },
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: isDay ? 'rgba(255, 255, 255, 0.98)' : 'rgba(14, 17, 23, 0.95)',
        titleColor: isDay ? '#0F172A' : '#FFFFFF',
        bodyColor: isDay ? '#334155' : '#CBD5E1',
        titleFont: { family: 'Inter', size: 12, weight: '600' },
        bodyFont: { family: 'JetBrains Mono', size: 11 },
        borderColor: isDay ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        callbacks: {
          label: (context) => {
            const val = context.parsed.y;
            return ` ${context.dataset.label}: ${val.toLocaleString()} N (${Math.round(val / 9.81)} kg)`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: isDay ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: isDay ? '#64748B' : '#64748B', font: { family: 'JetBrains Mono', size: 10 } },
      },
      yDownforce: {
        type: 'linear',
        position: 'left',
        grid: { color: isDay ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.03)' },
        ticks: {
          color: isDay ? '#059669' : '#94A3B8',
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (val) => `${val} N`,
        },
        title: {
          display: true,
          text: 'DOWNFORCE',
          color: isDay ? '#059669' : '#64748B',
          font: { family: 'Inter', size: 9, weight: '600' },
        },
      },
      yDrag: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: {
          color: isDay ? '#D5001C' : '#64748B',
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (val) => `${val} N`,
        },
        title: {
          display: true,
          text: 'DRAG FORCE',
          color: isDay ? '#D5001C' : '#64748B',
          font: { family: 'Inter', size: 9, weight: '600' },
        },
      },
    },
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-medium ${isDay ? 'text-slate-500' : 'text-zinc-400'}`}>
          Aerodynamic Trade-Off Response
        </span>
        <div className={`flex items-center space-x-1 p-1 rounded-lg border transition-colors ${
          isDay ? 'bg-black/[0.03] border-black/[0.06]' : 'bg-white/[0.03] border-white/[0.06]'
        }`}>
          <button
            onClick={() => setChartMode('angle')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              chartMode === 'angle'
                ? (isDay ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/10 text-white')
                : (isDay ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-white')
            }`}
          >
            Angle of Attack (0–25°)
          </button>
          <button
            onClick={() => setChartMode('speed')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              chartMode === 'speed'
                ? (isDay ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/10 text-white')
                : (isDay ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-white')
            }`}
          >
            Velocity Sweep (100–300 km/h)
          </button>
        </div>
      </div>

      <div className="w-full h-[260px]">
        <Line data={chartConfig} options={chartOptions} />
      </div>
    </div>
  );
}
