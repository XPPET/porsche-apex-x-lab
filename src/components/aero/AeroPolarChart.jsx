import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { generateAeroCurveData, generateSpeedCurveData } from '../../constants/aeroConstants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AeroPolarChart({
  wingAngle,
  rideHeight,
  airSpeedKmh,
  drsActive,
}) {
  const [chartMode, setChartMode] = useState('angle'); // 'angle' | 'speed'

  // Generate curve data
  const angleData = generateAeroCurveData(airSpeedKmh, rideHeight, drsActive);
  const speedData = generateSpeedCurveData(wingAngle, rideHeight, drsActive);

  const activeData = chartMode === 'angle' ? angleData : speedData;

  const chartConfig = {
    labels: activeData.labels,
    datasets: [
      {
        label: 'Downforce Fd (N)',
        data: activeData.downforceData,
        borderColor: '#96FF00',
        backgroundColor: 'rgba(150, 255, 0, 0.12)',
        borderWidth: 2.5,
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#96FF00',
        pointBorderColor: '#05080E',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        yAxisID: 'yDownforce',
      },
      {
        label: 'Aerodynamic Drag Fx (N)',
        data: activeData.dragData,
        borderColor: '#E0001A',
        backgroundColor: 'rgba(224, 0, 26, 0.08)',
        borderWidth: 2,
        borderDash: [5, 4],
        tension: 0.35,
        fill: false,
        pointBackgroundColor: '#E0001A',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverRadius: 7,
        yAxisID: 'yDrag',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
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
          font: { family: 'JetBrains Mono', size: 11, weight: 'bold' },
          boxWidth: 12,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(8, 12, 20, 0.95)',
        titleFont: { family: 'JetBrains Mono', size: 12, weight: 'bold' },
        bodyFont: { family: 'JetBrains Mono', size: 11 },
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
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
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8', font: { family: 'JetBrains Mono', size: 10 } },
        title: {
          display: true,
          text: chartMode === 'angle' ? 'REAR WING ANGLE OF ATTACK' : 'TUNNEL AIR VELOCITY',
          color: '#64748B',
          font: { family: 'JetBrains Mono', size: 10, weight: 'bold' },
        },
      },
      yDownforce: {
        type: 'linear',
        position: 'left',
        grid: { color: 'rgba(150, 255, 0, 0.08)' },
        ticks: {
          color: '#96FF00',
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (val) => `${val} N`,
        },
        title: {
          display: true,
          text: 'DOWNFORCE (Fd)',
          color: '#96FF00',
          font: { family: 'JetBrains Mono', size: 10, weight: 'bold' },
        },
      },
      yDrag: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: {
          color: '#E0001A',
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (val) => `${val} N`,
        },
        title: {
          display: true,
          text: 'DRAG FORCE (Fx)',
          color: '#E0001A',
          font: { family: 'JetBrains Mono', size: 10, weight: 'bold' },
        },
      },
    },
  };

  return (
    <div className="w-full">
      {/* Chart mode selection tabs */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          AERO POLAR TRADE-OFF SPECTRUM
        </span>
        <div className="flex items-center space-x-1 bg-white/5 p-1 rounded border border-white/10">
          <button
            onClick={() => setChartMode('angle')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
              chartMode === 'angle'
                ? 'bg-porsche-acid/20 text-porsche-acid border border-porsche-acid/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SWEEP WING ANGLE (0-25°)
          </button>
          <button
            onClick={() => setChartMode('speed')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
              chartMode === 'speed'
                ? 'bg-porsche-cyan/20 text-porsche-cyan border border-porsche-cyan/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SWEEP SPEED (100-300 KM/H)
          </button>
        </div>
      </div>

      {/* Chart.js render box */}
      <div className="w-full h-[250px] md:h-[280px]">
        <Line data={chartConfig} options={chartOptions} />
      </div>

      {/* Bottom aero trade-off tip */}
      <div className="mt-3 p-2 rounded bg-black/40 border border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-porsche-acid" />
          <span>CURRENT EFFICIENCY L/D RATIO:</span>
          <span className="text-porsche-acid font-bold">
            {activeData.efficiencyData ? activeData.efficiencyData[Math.round(wingAngle / 5)] : '1.85'}
          </span>
        </div>
        <span className="text-slate-500">
          * Induced drag scales quadratically with wing AoA (Induced Vortex Drag)
        </span>
      </div>
    </div>
  );
}
