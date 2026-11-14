import React, { useRef, useEffect, useState } from 'react';
import porscheDaySvg from '../../assets/porsche_day.svg';
import porscheNightSvg from '../../assets/porsche_night.svg';
import { useTheme } from '../../context/ThemeContext';
import StudioAeroHudDock from './StudioAeroHudDock';

/**
 * Porsche Studio Wind Tunnel Canvas
 * Dynamically swaps between porsche_day.svg and porsche_night.svg based on Day/Night Vision theme
 * Features an integrated Floating Control Dock HUD overlay for zero-scroll experimentation
 */
export default function StudioWindTunnelCanvas({
  wingAngle,    // 0 to 25 deg
  setWingAngle,
  rideHeight,   // -20 to +20 mm
  setRideHeight,
  airSpeedKmh,  // 100 to 300 km/h
  setAirSpeedKmh,
  drsActive,    // boolean
  setDrsActive,
}) {
  const { isDay } = useTheme();
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const [viewMode, setViewMode] = useState('studio'); // 'studio' | 'blueprint'
  
  const dayImgRef = useRef(null);
  const nightImgRef = useRef(null);

  // Preload both SVG graphics
  useEffect(() => {
    const dayImg = new Image();
    dayImg.src = porscheDaySvg;
    dayImg.onload = () => { dayImgRef.current = dayImg; };

    const nightImg = new Image();
    nightImg.src = porscheNightSvg;
    nightImg.onload = () => { nightImgRef.current = nightImg; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = Math.min(460, Math.max(340, canvas.parentElement.clientHeight || 390)));

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = Math.min(460, Math.max(340, canvas.parentElement.clientHeight || 390));
    };
    window.addEventListener('resize', handleResize);

    // Dynamic streamline particles (scales density and stretch with velocity)
    const maxStreamCount = 220;
    particlesRef.current = Array.from({ length: maxStreamCount }, (_, i) => ({
      x: Math.random() * width,
      y: 28 + (i / maxStreamCount) * (height - 70),
      speedFactor: 0.80 + Math.random() * 0.4,
      baseLength: 14 + Math.random() * 24,
      length: 18 + Math.random() * 24,
      alpha: 0.12 + Math.random() * 0.30,
    }));

    let time = 0;

    const render = () => {
      time += 0.018;
      ctx.clearRect(0, 0, width, height);

      // 1. Theme-Specific Studio Lighting Backdrop
      if (isDay) {
        // Day Vision: Clean & Bright Studio (Soft off-white / light silver shades #F8F9FA, #ECEFF1)
        const dayGrad = ctx.createRadialGradient(
          width * 0.5, height * 0.35, 30,
          width * 0.5, height * 0.5, width * 0.7
        );
        dayGrad.addColorStop(0, '#FFFFFF');
        dayGrad.addColorStop(0.5, '#F5F7FA');
        dayGrad.addColorStop(1, '#E9ECF1');
        ctx.fillStyle = dayGrad;
      } else {
        // Night Vision: Low-Light Command Center (#121316, #1A1C23)
        const nightGrad = ctx.createRadialGradient(
          width * 0.5, height * 0.35, 30,
          width * 0.5, height * 0.5, width * 0.7
        );
        nightGrad.addColorStop(0, '#1E232F');
        nightGrad.addColorStop(0.5, '#151922');
        nightGrad.addColorStop(1, '#0F1217');
        ctx.fillStyle = nightGrad;
      }
      ctx.fillRect(0, 0, width, height);

      // Ground plane coordinates (SVG aspect ratio 566 x 169 = 3.349)
      const groundY = height * 0.74 + (rideHeight * 0.5);
      const carLength = Math.min(width * 0.75, 620);
      const carHeight = carLength * (169 / 566);
      const carStartX = Math.round((width - carLength) / 2);
      const carEndX = carStartX + carLength;
      const carY = groundY - carHeight + 2;

      // Studio reflective floor grid
      ctx.strokeStyle = isDay ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x - 30, height);
        ctx.stroke();
      }

      // Ground baseline
      ctx.strokeStyle = isDay ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Soft ground ambient contact shadow
      const shadowGrad = ctx.createRadialGradient(
        carStartX + carLength * 0.5, groundY, 15,
        carStartX + carLength * 0.5, groundY, carLength * 0.52
      );
      if (isDay) {
        shadowGrad.addColorStop(0, 'rgba(15, 23, 42, 0.22)');
        shadowGrad.addColorStop(0.6, 'rgba(15, 23, 42, 0.06)');
        shadowGrad.addColorStop(1, 'transparent');
      } else {
        shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.90)');
        shadowGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.35)');
        shadowGrad.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(carStartX - 30, groundY - 2, carLength + 60, 22);

      // Tire contact patches directly under front & rear wheels
      const frontWheelX = carStartX + carLength * 0.245;
      const rearWheelX = carStartX + carLength * 0.775;
      const tirePatchWidth = carLength * 0.075;
      
      ctx.fillStyle = isDay ? 'rgba(15, 23, 42, 0.30)' : 'rgba(0, 0, 0, 0.95)';
      ctx.beginPath();
      ctx.ellipse(frontWheelX, groundY + 1, tirePatchWidth, 2.5, 0, 0, Math.PI * 2);
      ctx.ellipse(rearWheelX, groundY + 1, tirePatchWidth, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Dynamic Streamlines: Speed, Density, and Pressure Reactivity
      const vRatio = (airSpeedKmh - 100) / 200; // 0.0 at 100 km/h -> 1.0 at 300 km/h
      const streamVelocity = (airSpeedKmh / 100) * 5.2;
      const activeStreamCount = Math.round(130 + vRatio * 90); // 130 to 220 active particles

      particlesRef.current.slice(0, activeStreamCount).forEach((p) => {
        p.x += streamVelocity * p.speedFactor;
        if (p.x > width + 40) {
          p.x = -40;
          p.length = (p.baseLength || 18) * (1 + vRatio * 0.85); // Stretches with velocity
        }

        let curY = p.y;
        
        // Base velocity hue: subtle luminescent energetic shift at higher velocities
        let strokeColor = isDay
          ? `rgba(30, 41, 59, ${p.alpha * (0.75 + vRatio * 0.25)})`
          : `rgba(226, 232, 240, ${p.alpha * (0.85 + vRatio * 0.25)})`;

        // Streamline deflection around SVG vehicle silhouette
        if (p.x >= carStartX - 40 && p.x <= carEndX + 130) {
          const relX = (p.x - carStartX) / carLength;

          let profileTop;
          if (relX < 0.12) {
            profileTop = carY + carHeight * 0.68 - (relX / 0.12) * (carHeight * 0.28);
          } else if (relX < 0.36) {
            profileTop = carY + carHeight * 0.40 - ((relX - 0.12) / 0.24) * (carHeight * 0.35);
          } else if (relX < 0.56) {
            profileTop = carY + carHeight * 0.05 - Math.sin(((relX - 0.36) / 0.20) * Math.PI) * (carHeight * 0.06);
          } else if (relX < 0.84) {
            profileTop = carY + carHeight * 0.05 + ((relX - 0.56) / 0.28) * (carHeight * 0.40);
          } else {
            profileTop = carY + carHeight * 0.02;
          }

          const profileBottom = groundY - 6;

          if (curY < profileBottom && curY > profileTop - 45) {
            const pushUp = Math.max(0, (profileTop - curY) * 0.65 + 6);
            curY -= pushUp;

            // Nose Stagnation: Intensifies in Carmine Red with air pressure
            if (relX < 0.15) {
              const pressureAlpha = Math.min(1, p.alpha * (1.2 + vRatio * 0.8));
              strokeColor = `rgba(213, 0, 28, ${pressureAlpha})`;
            } else if (relX > 0.80) {
              // Rear Wing Downwash: Deflection increases with AoA and speed
              const wingDeflect = (wingAngle / 25) * 18 * (drsActive ? 0.3 : (1 + vRatio * 0.3));
              curY -= wingDeflect * Math.sin((relX - 0.80) * 10);

              if (drsActive) {
                // Low-drag DRS: clean, laminar emerald airflow
                strokeColor = isDay ? `rgba(16, 185, 129, ${p.alpha * 1.3})` : `rgba(148, 224, 0, ${p.alpha * 1.3})`;
              } else {
                // High Downforce: Induced vortex turbulence hue (Carmine to amber at high load)
                const turbAlpha = Math.min(1, p.alpha * (1.1 + (wingAngle / 25) * 0.6));
                strokeColor = wingAngle > 18
                  ? `rgba(213, 0, 28, ${turbAlpha})`
                  : (isDay ? `rgba(234, 88, 12, ${turbAlpha})` : `rgba(251, 146, 60, ${turbAlpha})`);
              }
            }
          }

          // Underbody Venturi ground effect suction: Intensifies with speed and lower ride height
          if (curY >= profileBottom && curY <= groundY) {
            const groundSuctionIntensity = Math.min(1.4, 0.8 + (Math.abs(rideHeight) / 20) * 0.4 + vRatio * 0.4);
            strokeColor = isDay 
              ? `rgba(5, 150, 105, ${p.alpha * groundSuctionIntensity})` 
              : `rgba(148, 224, 0, ${p.alpha * groundSuctionIntensity})`;
          }

          // Rear wake shedding turbulence: increases amplitude with wing angle and velocity
          if (relX > 0.92) {
            if (drsActive) {
              // Minimal wake when DRS is active
              curY += Math.sin(time * 8 + p.x * 0.03) * 1.5;
            } else {
              // Intense vortex shedding at high wing angle and velocity
              const wakeAmp = (wingAngle / 25) * 9 * (1 + vRatio * 0.5);
              curY += Math.sin(time * (10 + vRatio * 6) + p.x * 0.05) * wakeAmp;
            }
          }
        }

        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = drsActive ? 0.8 : (0.75 + vRatio * 0.3); // Micro thickness scaling with air pressure
        ctx.moveTo(p.x - p.length, curY);
        ctx.lineTo(p.x, curY);
        ctx.stroke();
      });

      // 3. Render Vehicle Vector Graphic (porsche_day.svg vs porsche_night.svg)
      ctx.save();

      const activeSvgImg = isDay ? (dayImgRef.current || nightImgRef.current) : (nightImgRef.current || dayImgRef.current);

      if (activeSvgImg && activeSvgImg.complete) {
        if (viewMode === 'studio') {
          // Render active vector graphic with subtle studio shadow (clean, right-side-up, centered)
          if (isDay) {
            // Day mode: clean, crisp vector graphic with soft studio contact shadow
            ctx.filter = 'drop-shadow(0 4px 14px rgba(0, 0, 0, 0.14))';
          } else {
            // Night mode: delicate high-contrast edge definition with deep studio ambiance
            ctx.filter = 'drop-shadow(0 0 1px rgba(255, 255, 255, 0.40)) drop-shadow(0 6px 18px rgba(0, 0, 0, 0.85))';
          }

          ctx.drawImage(activeSvgImg, carStartX, carY, carLength, carHeight);
          ctx.filter = 'none';

          // Active DRS Status Readout near rear wing
          if (drsActive) {
            const wingApexX = carStartX + carLength * 0.88;
            const wingApexY = carY + carHeight * 0.05;
            ctx.fillStyle = isDay ? '#059669' : '#94E000';
            ctx.font = '600 10px "JetBrains Mono", monospace';
            ctx.fillText('⚡ DRS ACTIVE (2° AoA)', wingApexX - 35, wingApexY - 14);
          }
        } else {
          // CAD Blueprint Mode
          ctx.drawImage(activeSvgImg, carStartX, carY, carLength, carHeight);

          ctx.strokeStyle = isDay ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 0.8;
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = isDay ? '#475569' : '#94A3B8';

          const wbY = groundY + 18;
          const frontAxleX = carStartX + carLength * 0.245;
          const rearAxleX = carStartX + carLength * 0.775;

          ctx.beginPath();
          ctx.moveTo(frontAxleX, wbY);
          ctx.lineTo(rearAxleX, wbY);
          ctx.stroke();
          ctx.fillText('WHEELBASE 2,457 MM', (frontAxleX + rearAxleX) / 2 - 55, wbY - 4);

          const lY = groundY + 34;
          ctx.beginPath();
          ctx.moveTo(carStartX, lY);
          ctx.lineTo(carEndX, lY);
          ctx.stroke();
          ctx.fillText('OVERALL LENGTH 4,572 MM', carStartX + carLength * 0.5 - 65, lY - 4);
        }
      }

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [wingAngle, rideHeight, airSpeedKmh, drsActive, viewMode, isDay]);

  return (
    <div className={`relative w-full h-[360px] md:h-[410px] rounded-xl overflow-hidden border transition-colors duration-300 ${
      isDay ? 'border-black/[0.08] bg-slate-50' : 'border-white/[0.08] bg-studio-950'
    }`}>
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating Control Dock (Top Left HUD Overlay) */}
      {setWingAngle && (
        <StudioAeroHudDock
          wingAngle={wingAngle}
          setWingAngle={setWingAngle}
          rideHeight={rideHeight}
          setRideHeight={setRideHeight}
          airSpeedKmh={airSpeedKmh}
          setAirSpeedKmh={setAirSpeedKmh}
          drsActive={drsActive}
          setDrsActive={setDrsActive}
        />
      )}

      {/* Top right Studio Mode Switch */}
      <div className={`absolute top-3.5 right-3.5 z-10 flex items-center space-x-1.5 backdrop-blur-md p-1 rounded-lg border text-xs transition-colors ${
        isDay ? 'bg-white/80 border-black/10' : 'bg-black/60 border-white/10'
      }`}>
        <button
          onClick={() => setViewMode('studio')}
          className={`px-2.5 py-1 rounded-md transition-all font-medium ${
            viewMode === 'studio'
              ? (isDay ? 'bg-slate-900 text-white shadow-sm' : 'bg-white/15 text-white')
              : (isDay ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white')
          }`}
        >
          Studio View
        </button>
        <button
          onClick={() => setViewMode('blueprint')}
          className={`px-2.5 py-1 rounded-md transition-all font-medium ${
            viewMode === 'blueprint'
              ? (isDay ? 'bg-slate-900 text-white shadow-sm' : 'bg-white/15 text-white')
              : (isDay ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white')
          }`}
        >
          CAD Blueprint
        </button>
      </div>

      {/* Bottom right model & telemetry status tag */}
      <div className={`absolute bottom-3.5 right-3.5 z-10 hidden sm:flex items-center space-x-3 text-[11px] font-mono backdrop-blur-md px-3 py-1.5 rounded-lg border transition-colors ${
        isDay ? 'bg-white/80 border-black/10 text-slate-600' : 'bg-black/60 border-white/10 text-zinc-400'
      }`}>
        <div className="flex items-center space-x-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isDay ? 'bg-emerald-600' : 'bg-porsche-acid'}`} />
          <span className={`font-sans font-semibold tracking-wide ${isDay ? 'text-slate-900' : 'text-white'}`}>
            911 GT3 RS
          </span>
        </div>
        <span className={isDay ? 'text-slate-300' : 'text-zinc-600'}>|</span>
        <span>AoA: <strong className={isDay ? 'text-slate-900' : 'text-white'}>{drsActive ? '2° (DRS)' : `${wingAngle}°`}</strong></span>
        <span className={isDay ? 'text-slate-300' : 'text-zinc-600'}>|</span>
        <span>RIDE: <strong className={isDay ? 'text-slate-900' : 'text-white'}>{rideHeight > 0 ? `+${rideHeight}` : rideHeight}mm</strong></span>
        <span className={isDay ? 'text-slate-300' : 'text-zinc-600'}>|</span>
        <span>VELOCITY: <strong className={isDay ? 'text-slate-900' : 'text-white'}>{airSpeedKmh} km/h</strong></span>
      </div>
    </div>
  );
}
