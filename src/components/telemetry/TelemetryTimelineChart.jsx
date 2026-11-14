import React, { useRef, useEffect } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TelemetryTimelineChart({ telemetryHistory = [] }) {
  // Use the last 30 data points
  const recentData = telemetryHistory.slice(-30);

  const labels = recentData.map((_, i) => `${i}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Speed (km/h)',
        data: recentData.map((d) => d.speed),
        borderColor: '#00F0FF',
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        yAxisID: 'ySpeed',
      },
      {
        label: 'Throttle (%)',
        data: recentData.map((d) => d.throttle),
        borderColor: '#96FF00',
        borderWidth: 1.5,
        tension: 0.3,
        pointRadius: 0,
        yAxisID: 'yPedals',
      },
      {
        label: 'Brake (%)',
        data: recentData.map((d) => d.brake),
        borderColor: '#E0001A',
        borderWidth: 1.5,
        tension: 0.3,
        pointRadius: 0,
        yAxisID: 'yPedals',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false, // Turn off heavy animations for real-time streaming
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
          boxWidth: 10,
          padding: 10,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(8, 12, 20, 0.95)',
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 10 },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: false,
      },
      ySpeed: {
        type: 'linear',
        position: 'left',
        min: 0,
        max: 330,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: '#00F0FF',
          font: { family: 'JetBrains Mono', size: 9 },
          callback: (v) => `${v}k`,
        },
      },
      yPedals: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 100,
        grid: { drawOnChartArea: false },
        ticks: {
          color: '#94A3B8',
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
