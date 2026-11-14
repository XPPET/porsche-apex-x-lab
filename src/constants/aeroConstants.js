// Porsche 911 GT3 RS (992) Aerodynamic Physics Model
export const AERO_CONSTANTS = {
  airDensity: 1.225, // kg/m^3 at sea level 15°C
  frontalArea: 2.12, // m^2
  baseCd: 0.34,      // Baseline drag coefficient with wing at 0°
  baseCl: 0.32,      // Baseline lift/downforce coefficient
  enginePowerKW: 386, // 525 PS = ~386.1 kW
  drivetrainEfficiency: 0.88, // PDK dual-clutch transmission efficiency
  rollingResistanceCoeff: 0.015, // High-performance Michelin Cup 2 R tires
  carMassKg: 1450, // Curb weight with Weissach package
};

/**
 * Calculates aerodynamic forces and performance metrics based on user sliders
 * @param {number} wingAngle - Rear wing angle in degrees (0° to 25°)
 * @param {number} rideHeight - Ride height offset in mm (-20mm to +20mm)
 * @param {number} airSpeedKmh - Air/Vehicle speed in km/h (100 to 300)
 * @param {boolean} drsActive - Drag Reduction System active state
 */
export function calculateAeroMetrics(wingAngle, rideHeight, airSpeedKmh, drsActive = false) {
  const speedMs = airSpeedKmh / 3.6;
  const q = 0.5 * AERO_CONSTANTS.airDensity * Math.pow(speedMs, 2);

  // Induced Drag from rear wing angle (degrees)
  let wingCd = 0.0062 * wingAngle + 0.00012 * Math.pow(wingAngle, 2);
  
  // Downforce coefficient from rear wing
  let wingCl = 0.045 * wingAngle - 0.00035 * Math.pow(wingAngle, 2);

  // Ground effect modifier from ride height (negative = lower = more ground effect suction)
  // Optimal ground effect is around -15mm to -10mm before choking
  const groundEffectCl = -0.0035 * rideHeight + (rideHeight < -15 ? -0.02 : 0);
  const groundEffectCd = -0.0008 * rideHeight;

  // DRS (Drag Reduction System) effect
  if (drsActive) {
    wingCd *= 0.42; // 58% reduction in wing induced drag
    wingCl *= 0.55; // 45% reduction in wing downforce
  }

  const Cd = Math.max(0.28, Number((AERO_CONSTANTS.baseCd + wingCd + groundEffectCd).toFixed(3)));
  const Cl = Math.max(0.15, Number((AERO_CONSTANTS.baseCl + wingCl + groundEffectCl).toFixed(3)));

  // Forces in Newtons
  const downforceNewtons = Math.round(q * AERO_CONSTANTS.frontalArea * Cl);
  const dragNewtons = Math.round(q * AERO_CONSTANTS.frontalArea * Cd);
  const downforceKg = Math.round(downforceNewtons / 9.80665);

  // Aerodynamic efficiency: Lift to Drag ratio (L/D)
  const aeroEfficiency = Number((Cl / Cd).toFixed(2));

  // Front / Rear aero balance estimation
  // Higher wing angle shifts aero balance rearward; lower front ride height shifts balance forward
  const rearBiasBase = 68; // 68% rear, 32% front baseline
  const rearShift = (wingAngle / 25) * 6 - (rideHeight / 20) * 4;
  const rearBalance = Math.min(76, Math.max(62, Number((rearBiasBase + rearShift).toFixed(1))));
  const frontBalance = Number((100 - rearBalance).toFixed(1));

  // Estimate theoretical top speed by solving power balance:
  // P_engine * efficiency = (0.5 * rho * A * Cd * v^3) + (m * g * Cr * v)
  // We use numerical approximation for accuracy
  let estimatedTopSpeedKmh = 300;
  const netPowerWatts = AERO_CONSTANTS.enginePowerKW * 1000 * AERO_CONSTANTS.drivetrainEfficiency;

  for (let v = 50; v <= 120; v += 0.2) {
    const aeroRes = 0.5 * AERO_CONSTANTS.airDensity * AERO_CONSTANTS.frontalArea * Cd * Math.pow(v, 3);
    const rollRes = AERO_CONSTANTS.carMassKg * 9.80665 * AERO_CONSTANTS.rollingResistanceCoeff * v;
    if (aeroRes + rollRes >= netPowerWatts) {
      estimatedTopSpeedKmh = Math.round(v * 3.6);
      break;
    }
  }

  return {
    Cd,
    Cl,
    downforceNewtons,
    downforceKg,
    dragNewtons,
    aeroEfficiency,
    frontBalance,
    rearBalance,
    estimatedTopSpeedKmh,
    dynamicPressurePa: Math.round(q),
  };
}

/**
 * Generate curve data for Downforce vs Drag across wing angles (0° to 25°)
 */
export function generateAeroCurveData(currentAirSpeed, currentRideHeight, drsActive) {
  const angles = [0, 5, 10, 15, 20, 25];
  const labels = angles.map(a => `${a}°`);
  const downforceData = [];
  const dragData = [];
  const efficiencyData = [];

  angles.forEach(angle => {
    const res = calculateAeroMetrics(angle, currentRideHeight, currentAirSpeed, drsActive);
    downforceData.push(res.downforceNewtons);
    dragData.push(res.dragNewtons);
    efficiencyData.push(res.aeroEfficiency);
  });

  return { labels, downforceData, dragData, efficiencyData };
}

/**
 * Generate curve data across speeds (100 to 300 km/h)
 */
export function generateSpeedCurveData(wingAngle, rideHeight, drsActive) {
  const speeds = [100, 140, 180, 220, 260, 300];
  const labels = speeds.map(s => `${s} km/h`);
  const downforceData = [];
  const dragData = [];

  speeds.forEach(spd => {
    const res = calculateAeroMetrics(wingAngle, rideHeight, spd, drsActive);
    downforceData.push(res.downforceNewtons);
    dragData.push(res.dragNewtons);
  });

  return { labels, downforceData, dragData };
}
