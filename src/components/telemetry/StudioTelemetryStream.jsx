import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function StudioTelemetryStream({ telemetryHistory = [] }) {
  const { isDay } = useTheme();
  const recentData = telemetryHistory.slice(-28);
  const labels = recentData.map((_, i) => `${i}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Velocity (km/h)',
        data: recentData.map((d) => d.speed),
        borderColor: isDay ? '#0F172A' : '#E2E8F0',
        backgroundColor: 'transparent',
        borderWidth: 1.8,
        tension: 0.35,
        pointRadius: 0,
        yAxisID: 'ySpeed',
      },
      {
        label: 'Throttle (%)',
        data: recentData.map((d) => d.throttle),
        borderColor: isDay ? '#059669' : '#94E000',
        borderWidth: 1.4,
        tension: 0.35,
        pointRadius: 0,
        yAxisID: 'yPedals',
      },
      {
        label: 'Brake (%)',
        data: recentData.map((d) => d.brake),
        borderColor: '#D5001C',
        borderWidth: 1.4,
        tension: 0.35,
        pointRadius: 0,
        yAxisID: 'yPedals',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
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
        titleFont: { family: 'Inter', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 10 },
        borderColor: isDay ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        padding: 8,
      },
    },
    scales: {
      x: { display: false },
      ySpeed: {
        type: 'linear',
        position: 'left',
        min: 0,
        max: 330,
        grid: { color: isDay ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.03)' },
        ticks: {
          color: isDay ? '#475569' : '#94A3B8',
          font: { family: 'JetBrains Mono', size: 9 },
          callback: (v) => `${v}`,
        },
      },
      yPedals: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 100,
        grid: { drawOnChartArea: false },
        ticks: {
          color: isDay ? '#64748B' : '#64748B',
          font: { family: 'JetBrains Mono', size: 9 },
          callback: (v) => `${v}%`,
        },
      },
    },
  };

  return (
    <div className="w-full h-[180px]">
      <Line data={chartData} options={options} />
    </div>
  );
}
