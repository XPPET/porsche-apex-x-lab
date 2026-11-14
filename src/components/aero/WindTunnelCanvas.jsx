import React, { useRef, useEffect } from 'react';

/**
 * 2D / 2.5D High-Performance Wind Tunnel Canvas Simulation
 * Renders aerodynamic streamlines, pressure contours, and Porsche 911 GT3 RS active aero elements
 */
export default function WindTunnelCanvas({
  wingAngle,    // 0 to 25 deg
  rideHeight,   // -20 to +20 mm
  airSpeedKmh,  // 100 to 300 km/h
  drsActive,    // boolean
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = Math.min(480, Math.max(340, canvas.parentElement.clientHeight || 380)));

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = Math.min(480, Math.max(340, canvas.parentElement.clientHeight || 380));
    };
    window.addEventListener('resize', handleResize);

    // Initialize 240 particles for aerodynamic streamlines
    const particleCount = 220;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: 40 + Math.random() * (height - 80),
      speedFactor: 0.8 + Math.random() * 0.4,
      length: 12 + Math.random() * 24,
      alpha: 0.3 + Math.random() * 0.7,
      isUnderbody: false,
    }));

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Sci-Fi Background Wind Tunnel Grid & Measurement Rulers
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;

      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Ground plane with reflective grid line
      const groundY = height * 0.78 + (rideHeight * 0.7); // Shift with ride height
      const carBaseY = groundY - 12; // Car sits above ground

      // Ground conveyor belt line
      ctx.strokeStyle = 'rgba(150, 255, 0, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Moving ground belt markers (simulates moving ground plane in modern wind tunnels)
      const beltOffset = (time * (airSpeedKmh * 0.8)) % 60;
      ctx.strokeStyle = 'rgba(150, 255, 0, 0.2)';
      ctx.lineWidth = 1;
      for (let bx = -60 + beltOffset; bx < width; bx += 40) {
        ctx.beginPath();
        ctx.moveTo(bx, groundY);
        ctx.lineTo(bx - 15, groundY + 8);
        ctx.stroke();
      }

      // 2. Compute Car Dimensions & Anchor Points
      const carLength = Math.min(width * 0.65, 520);
      const carStartX = width * 0.22;
      const carEndX = carStartX + carLength;

      // 3. Draw Aerodynamic Streamlines / Smoke Particles
      const streamVelocity = (airSpeedKmh / 120) * 8;

      particlesRef.current.forEach((p) => {
        p.x += streamVelocity * p.speedFactor;
        if (p.x > width + 20) {
          p.x = -20;
          p.y = 40 + Math.random() * (height - 80);
          p.length = 14 + Math.random() * 24;
        }

        // Deflect particles around the car body profile
        let defY = p.y;
        let flowColor = 'rgba(0, 240, 255, '; // Default cyan laminar flow
        let isTurbulent = false;

        // Front splitter & nose deflection
        if (p.x >= carStartX - 30 && p.x <= carEndX) {
          const relX = (p.x - carStartX) / carLength; // 0 to 1

          // Car roof curve profile approximation
          let carProfileTop;
          if (relX < 0.12) {
            // Front splitter & bumper
            carProfileTop = carBaseY - 32 * (relX / 0.12);
          } else if (relX < 0.35) {
            // Hood line rising to windshield
            carProfileTop = carBaseY - 32 - 40 * ((relX - 0.12) / 0.23);
          } else if (relX < 0.60) {
            // Roof peak
            carProfileTop = carBaseY - 72 - 14 * Math.sin(((relX - 0.35) / 0.25) * Math.PI);
          } else if (relX < 0.85) {
            // Rear window slope to engine lid
            carProfileTop = carBaseY - 72 + 35 * ((relX - 0.60) / 0.25);
          } else {
            // Rear tail & wing region
            carProfileTop = carBaseY - 37;
          }

          const carProfileBottom = carBaseY - 6;

          // Upper airflow compression
          if (p.y < carProfileBottom && p.y > carProfileTop - 45) {
            const pushUp = Math.max(0, (carProfileTop - p.y) * 0.65 + 10);
            defY -= pushUp;
            // Pressure gradient: High pressure stagnation point at front
            if (relX < 0.15) {
              flowColor = 'rgba(224, 0, 26, '; // Red high pressure
            } else if (relX > 0.78) {
              // Rear wing region deflection
              const wingLift = (wingAngle / 25) * 18 * (drsActive ? 0.45 : 1);
              defY -= wingLift * Math.sin((relX - 0.78) * 10);
              flowColor = drsActive ? 'rgba(0, 240, 255, ' : 'rgba(224, 0, 26, ';
            } else {
              flowColor = 'rgba(150, 255, 0, '; // Acid green high velocity over roof
            }
          }

          // Underbody Venturi tunnel flow
          if (p.y >= carProfileBottom && p.y <= groundY) {
            // Ground effect venturi accelerates air
            flowColor = 'rgba(150, 255, 0, ';
            p.length = 26; // Stretched streamline
          }

          // Rear turbulent wake vortex zone
          if (relX > 0.92) {
            const wakeTurbulence = Math.sin(time * 12 + p.x * 0.05) * (wingAngle * 0.45);
            defY += wakeTurbulence;
            isTurbulent = true;
            flowColor = 'rgba(224, 0, 26, ';
          }
        }

        // Behind the car wake trail
        if (p.x > carEndX) {
          const distBehind = p.x - carEndX;
          const vortex = Math.sin(time * 8 + p.x * 0.02) * (wingAngle * 0.4) * Math.exp(-distBehind / 250);
          defY += vortex;
          if (wingAngle > 12 && !drsActive) {
            flowColor = 'rgba(255, 120, 0, ';
          }
        }

        // Draw particle streak
        ctx.beginPath();
        ctx.strokeStyle = `${flowColor}${p.alpha})`;
        ctx.lineWidth = isTurbulent ? 1.5 : 1.2;
        ctx.moveTo(p.x - p.length, defY);
        ctx.lineTo(p.x, defY);
        ctx.stroke();
      });

      // 4. Render Porsche 911 GT3 RS Silhouette with High-Tech Wireframe/Solid styling
      ctx.save();

      // Shadow on ground
      const groundShadowGrad = ctx.createRadialGradient(
        carStartX + carLength * 0.5, groundY, 10,
        carStartX + carLength * 0.5, groundY, carLength * 0.55
      );
      groundShadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
      groundShadowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = groundShadowGrad;
      ctx.fillRect(carStartX - 20, groundY - 4, carLength + 40, 16);

      // Car Body Path
      ctx.beginPath();
      // Front splitter
      ctx.moveTo(carStartX, carBaseY);
      ctx.lineTo(carStartX - 10, carBaseY - 2); // Splitter lip
      ctx.lineTo(carStartX - 6, carBaseY - 14); // Front air dam
      ctx.lineTo(carStartX + 20, carBaseY - 24); // Front bumper curve
      ctx.lineTo(carStartX + 55, carBaseY - 32); // Front hood edge
      // Wheel arch front
      ctx.arc(carStartX + 95, carBaseY - 12, 28, Math.PI, 0, false);
      // Front fender top / nostril louvers
      ctx.lineTo(carStartX + 145, carBaseY - 34);
      // Windshield A-pillar
      ctx.lineTo(carStartX + 200, carBaseY - 74);
      // Roofline
      ctx.bezierCurveTo(
        carStartX + 240, carBaseY - 82,
        carStartX + 300, carBaseY - 80,
        carStartX + 340, carBaseY - 68
      );
      // Rear engine lid / fastback slope
      ctx.bezierCurveTo(
        carStartX + 380, carBaseY - 56,
        carStartX + 420, carBaseY - 42,
        carStartX + 460, carBaseY - 38
      );
      // Rear ducktail spoiler base
      ctx.lineTo(carStartX + carLength - 10, carBaseY - 38);
      ctx.lineTo(carStartX + carLength, carBaseY - 35);
      // Rear bumper & massive diffuser
      ctx.lineTo(carStartX + carLength + 4, carBaseY - 20);
      ctx.lineTo(carStartX + carLength - 5, carBaseY - 4);
      // Rear diffuser strakes
      ctx.lineTo(carStartX + carLength - 25, carBaseY + 2);
      // Rear wheel arch
      ctx.arc(carStartX + 385, carBaseY - 12, 28, 0, Math.PI, true);
      // Underbody flat floor
      ctx.lineTo(carStartX + 125, carBaseY);
      ctx.closePath();

      // Body fill with carbon / dark metallic gradient
      const bodyGrad = ctx.createLinearGradient(carStartX, carBaseY - 85, carStartX, carBaseY);
      bodyGrad.addColorStop(0, '#1E293B');
      bodyGrad.addColorStop(0.5, '#0F172A');
      bodyGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Cyber neon body outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Windshield & side glass
      ctx.beginPath();
      ctx.moveTo(carStartX + 202, carBaseY - 71);
      ctx.lineTo(carStartX + 250, carBaseY - 76);
      ctx.lineTo(carStartX + 325, carBaseY - 66);
      ctx.lineTo(carStartX + 325, carBaseY - 46);
      ctx.lineTo(carStartX + 195, carBaseY - 46);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Wheels (GT3 RS forged magnesium center-lock wheels)
      const drawWheel = (wx, wy) => {
        ctx.beginPath();
        ctx.arc(wx, wy, 24, 0, Math.PI * 2);
        ctx.fillStyle = '#080C14';
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Carbon ceramic brake rotor
        ctx.beginPath();
        ctx.arc(wx, wy, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#1E293B';
        ctx.fill();

        // Acid green brake caliper (Porsche signature)
        ctx.beginPath();
        ctx.arc(wx - 8, wy - 8, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#96FF00';
        ctx.fill();

        // Center lock nut (Porsche red)
        ctx.beginPath();
        ctx.arc(wx, wy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#E0001A';
        ctx.fill();
      };

      drawWheel(carStartX + 95, carBaseY - 12);
      drawWheel(carStartX + 385, carBaseY - 12);

      // 5. Active Swan-Neck Rear Wing with DRS Actuation!
      // Real 911 GT3 RS features upper swan-neck uprights where wing element hangs beneath
      const wingPivotX = carStartX + carLength - 20;
      const wingPivotY = carBaseY - 65;

      // Swan neck pylon uprights
      ctx.beginPath();
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 3;
      ctx.moveTo(carStartX + carLength - 45, carBaseY - 38);
      ctx.bezierCurveTo(
        carStartX + carLength - 40, carBaseY - 60,
        carStartX + carLength - 25, carBaseY - 78,
        wingPivotX, wingPivotY - 8
      );
      ctx.stroke();

      // Wing Main Blade and Flap
      ctx.save();
      ctx.translate(wingPivotX, wingPivotY);

      // Tilt wing based on slider angle (- angle in rad)
      // When DRS active, flatten angle to ~3°
      const actualTilt = drsActive ? 3 : wingAngle;
      const angleRad = -(actualTilt * Math.PI) / 180;
      ctx.rotate(angleRad);

      // Main aerodynamic wing foil
      ctx.beginPath();
      ctx.moveTo(-28, 2);
      ctx.bezierCurveTo(-15, -8, 15, -6, 28, 0);
      ctx.lineTo(26, 4);
      ctx.bezierCurveTo(15, 0, -15, -1, -28, 2);
      ctx.closePath();

      // Wing color: Porsche Guards Red with glowing edges
      ctx.fillStyle = '#E0001A';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Wing endplate with GT3 RS moniker accent
      ctx.fillStyle = '#080C14';
      ctx.fillRect(20, -12, 10, 22);
      ctx.strokeStyle = '#E0001A';
      ctx.strokeRect(20, -12, 10, 22);

      // DRS Flap actuator hydraulic piston
      if (drsActive) {
        ctx.strokeStyle = '#96FF00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(12, -18);
        ctx.stroke();
      }

      ctx.restore();

      // 6. On-Canvas HUD HUD Overlays (Vector Reticles & Aero Vector)
      // Vector arrow showing Downforce magnitude
      const downforceMag = 20 + (wingAngle / 25) * 50 + (airSpeedKmh / 300) * 40;
      const arrowX = carStartX + carLength * 0.72;
      const arrowY = carBaseY - 75;

      ctx.strokeStyle = '#96FF00';
      ctx.fillStyle = '#96FF00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX, arrowY + downforceMag);
      ctx.stroke();
      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(arrowX - 5, arrowY + downforceMag - 8);
      ctx.lineTo(arrowX, arrowY + downforceMag);
      ctx.lineTo(arrowX + 5, arrowY + downforceMag - 8);
      ctx.fill();

      // Text label for vector
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#96FF00';
      ctx.fillText(`F_DOWNFORCE`, arrowX + 8, arrowY + downforceMag * 0.5);

      // DRS Status HUD Pill directly on canvas
      if (drsActive) {
        ctx.fillStyle = 'rgba(150, 255, 0, 0.9)';
        ctx.fillRect(wingPivotX - 35, wingPivotY - 32, 70, 18);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 9px "Orbitron", sans-serif';
        ctx.fillText('DRS OPEN', wingPivotX - 26, wingPivotY - 20);
      }

      // Wind Tunnel Boundary Layer Legend
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText(`AIR VELOCITY: ${airSpeedKmh} KM/H | WING: ${wingAngle}° | RIDE: ${rideHeight > 0 ? `+${rideHeight}` : rideHeight}mm`, 18, 26);

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [wingAngle, rideHeight, airSpeedKmh, drsActive]);

  return (
    <div className="relative w-full h-[320px] md:h-[390px] rounded border border-white/10 bg-porsche-darker/90 overflow-hidden">
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />

      {/* Top right HUD badge */}
      <div className="absolute top-3 right-3 z-10 flex items-center space-x-2">
        <div className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-mono text-slate-300">
          BOUNDARY LAYER: <span className="text-porsche-acid">LAMINAR</span>
        </div>
        <div className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-mono text-slate-300">
          SCALE: <span className="text-porsche-cyan">1:1 FULL VEHICLE</span>
        </div>
      </div>

      {/* Dynamic Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
