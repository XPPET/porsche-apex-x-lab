// Porsche Powertrain Comparison Specifications & Physics Models

export const POWERTRAINS = {
  ice: {
    id: "ice",
    name: "911 GT3 RS 4.0L Boxer",
    subtitle: "Naturally Aspirated Flat-6",
    color: "#E0001A",
    colorGlow: "rgba(224, 0, 26, 0.4)",
    badgeColor: "bg-red-500/10 text-red-400 border-red-500/30",
    engineType: "4.0L Naturally Aspirated 6-Cylinder Boxer",
    displacement: "3,996 cc",
    valvetrain: "Rigid rocker arms with individual throttle bodies",
    maxPowerPS: 525,
    maxPowerKW: 386,
    maxPowerRPM: 8500,
    maxTorqueNm: 465,
    maxTorqueRPM: 6300,
    redlineRPM: 9000,
    idleRPM: 950,
    transmission: "7-Speed Porsche Doppelkupplung (PDK)",
    driveType: "Rear-Wheel Drive (RWD) with PTV+",
    baseWeightKg: 1450,
    frontWeightDist: 38, // 38% front / 62% rear
    aeroCd: 0.38,
    frontalArea: 2.12,
    official0to100: "3.2 s",
    official0to200: "10.6 s",
    officialQuarterMile: "10.9 s",
    officialTopSpeed: "296 km/h",
    powerToWeight: "2.76 kg/PS",
    soundProfile: "Mechanical 9,000 RPM Flat-6 Symphony",
    description: "Pure motorsport heritage. Ultra-responsive individual throttle bodies delivering linear, high-revving naturally aspirated acoustic bliss."
  },
  ev: {
    id: "ev",
    name: "Taycan Turbo GT Dual-Motor",
    subtitle: "Permanent Magnet Synchronous (PSM)",
    color: "#96FF00",
    colorGlow: "rgba(150, 255, 0, 0.4)",
    badgeColor: "bg-lime-500/10 text-lime-400 border-lime-500/30",
    engineType: "Dual Permanent Magnet Synchronous Motors + SiC Inverter",
    displacement: "97 kWh Battery (800V Architecture)",
    valvetrain: "Hairpin winding stator & Silicon Carbide pulse inverters",
    maxPowerPS: 1108, // Attack Mode with Overboost
    maxPowerKW: 815,
    maxPowerRPM: 8000,
    maxTorqueNm: 1340,
    maxTorqueRPM: 3500, // Instant torque flat from 0 to 4500 RPM
    redlineRPM: 16000,
    idleRPM: 0,
    transmission: "2-Speed Transmission (Rear) + 1-Speed (Front)",
    driveType: "All-Wheel Drive (AWD) with Dynamic Torque Vectoring",
    baseWeightKg: 2220,
    frontWeightDist: 49, // 49% front / 51% rear
    aeroCd: 0.25,
    frontalArea: 2.33,
    official0to100: "2.2 s",
    official0to200: "6.4 s",
    officialQuarterMile: "9.4 s",
    officialTopSpeed: "305 km/h",
    powerToWeight: "2.00 kg/PS",
    soundProfile: "Porsche Electric Sport Sound (800V Pulse Harmonic)",
    description: "Instantaneous electro-kinetic catapult. 1,340 Nm of instantaneous torque routed through intelligent all-wheel torque vectoring."
  }
};

/**
 * Generates dyno curve lookup points across engine RPM (0 to 9000 for ICE, scaled for comparison)
 */
export function generateDynoCurves(powerDeliveryMode = "track") {
  // RPM steps
  const rpmSteps = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 8500, 9000];
  const labels = rpmSteps.map(r => `${r}`);

  // ICE Dyno: Naturally aspirated curve (Torque peaks at 6,300 RPM, Power peaks at 8,500 RPM)
  const iceTorque = [
    280, // 1000
    320, // 2000
    370, // 3000
    410, // 4000
    440, // 5000
    465, // 6000
    455, // 7000
    430, // 8000
    410, // 8500
    380  // 9000
  ];

  const icePower = rpmSteps.map((rpm, i) => {
    // Power (PS) = (Torque (Nm) * RPM) / 7023.5
    return Math.round((iceTorque[i] * rpm) / 7023.5);
  });

  // EV Dyno: Equivalent motor speed scale
  // Mode affects EV peak boost: "attack" = 1108 PS, "track" = 850 PS, "endurance" = 760 PS
  const evMultiplier = powerDeliveryMode === "attack" ? 1.0 : powerDeliveryMode === "track" ? 0.88 : 0.78;
  const evMaxTorque = Math.round(1340 * evMultiplier);

  const evTorque = [
    evMaxTorque, // 1000: Instant torque
    evMaxTorque, // 2000
    evMaxTorque, // 3000
    Math.round(evMaxTorque * 0.98), // 4000
    Math.round(evMaxTorque * 0.88), // 5000
    Math.round(evMaxTorque * 0.75), // 6000
    Math.round(evMaxTorque * 0.65), // 7000
    Math.round(evMaxTorque * 0.55), // 8000
    Math.round(evMaxTorque * 0.50), // 8500
    Math.round(evMaxTorque * 0.45)  // 9000
  ];

  const evPower = rpmSteps.map((rpm, i) => {
    // Power (PS)
    let p = Math.round((evTorque[i] * rpm * 1.5) / 7023.5);
    const maxAllowed = Math.round(1108 * evMultiplier);
    return Math.min(maxAllowed, p);
  });

  return {
    labels,
    ice: { torque: iceTorque, power: icePower },
    ev: { torque: evTorque, power: evPower },
  };
}

/**
 * Live Physics Simulation for Drag Race benchmark (0-100 km/h, 0-200 km/h, Quarter Mile)
 * @param {object} iceParams { weightKg, gearRatioBonus }
 * @param {object} evParams { weightKg, powerMode, gearRatioBonus }
 */
export function simulateQuarterMileRace(iceParams, evParams) {
  const dt = 0.02; // 20ms physics time step
  const maxTime = 16.0; // 16 seconds max simulation length
  const targetDistance = 402.336; // Quarter Mile in meters (1320 feet)

  // Simulation states
  const runSim = (vehicleType, params) => {
    const isIce = vehicleType === "ice";
    const mass = params.weightKg;
    const cd = isIce ? 0.38 : 0.25;
    const frontalArea = isIce ? 2.12 : 2.33;
    const rho = 1.225;
    const muTire = isIce ? 1.35 : 1.50; // EV AWD has superior launch grip
    const powerMultiplier = !isIce && params.powerMode === "attack" ? 1.0 : !isIce && params.powerMode === "track" ? 0.90 : !isIce ? 0.82 : 1.0;
    const peakPowerWatts = (isIce ? 525 : 1108) * 735.498 * powerMultiplier;

    let time = 0;
    let distance = 0;
    let speed = 0; // m/s
    let t0to100 = null;
    let t0to200 = null;
    let tQuarterMile = null;
    let trapSpeedKmh = null;

    const timeSeries = [];

    while (time <= maxTime && distance < targetDistance + 20) {
      const speedKmh = speed * 3.6;

      if (!t0to100 && speedKmh >= 100) {
        t0to100 = Number(time.toFixed(2));
      }
      if (!t0to200 && speedKmh >= 200) {
        t0to200 = Number(time.toFixed(2));
      }
      if (!tQuarterMile && distance >= targetDistance) {
        tQuarterMile = Number(time.toFixed(2));
        trapSpeedKmh = Math.round(speedKmh);
      }

      // Record snapshot every 0.1s for graph rendering
      if (Math.round(time * 100) % 10 === 0 || distance >= targetDistance) {
        timeSeries.push({
          time: Number(time.toFixed(2)),
          distance: Math.min(targetDistance, Math.round(distance)),
          speedKmh: Math.round(speedKmh),
        });
      }

      // Aerodynamic drag force
      const fDrag = 0.5 * rho * frontalArea * cd * Math.pow(speed, 2);
      // Rolling resistance force
      const fRoll = mass * 9.81 * 0.015;

      // Wheel drive force calculation
      let fDriveMax;
      if (speed < 4.0) {
        // Launch traction limited by tire friction & normal force
        fDriveMax = mass * 9.81 * muTire * (isIce ? 0.62 : 1.0);
      } else {
        // Power limited: F = P / v
        fDriveMax = peakPowerWatts / speed;
        // Cap by maximum tire traction
        const tractionLimit = mass * 9.81 * muTire;
        fDriveMax = Math.min(fDriveMax, tractionLimit);
      }

      // Net acceleration
      const fNet = Math.max(0, fDriveMax - fDrag - fRoll);
      const accel = fNet / mass;

      speed += accel * dt;
      distance += speed * dt;
      time += dt;
    }

    return {
      t0to100: t0to100 || 3.2,
      t0to200: t0to200 || 10.6,
      tQuarterMile: tQuarterMile || 10.9,
      trapSpeedKmh: trapSpeedKmh || 215,
      timeSeries,
    };
  };

  const iceResult = runSim("ice", iceParams);
  const evResult = runSim("ev", evParams);

  return {
    ice: iceResult,
    ev: evResult,
    winner: iceResult.tQuarterMile < evResult.tQuarterMile ? "ice" : "ev",
    deltaQuarterMile: Number(Math.abs(iceResult.tQuarterMile - evResult.tQuarterMile).toFixed(2)),
  };
}
