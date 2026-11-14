// Nürburgring Nordschleife Track Telemetry & Simulation Data
export const TRACK_INFO = {
  name: "Nürburgring Nordschleife",
  subName: "The Green Hell",
  lengthMeters: 20832,
  recordLapTime: "6:49.328", // 911 GT3 RS official lap time by Jörg Bergmeister
  recordHolder: "Porsche 911 GT3 RS (992)",
  sectors: [
    { id: 1, name: "Tiergarten & Hatzenbach", length: 2850, baseSpeed: 245, highG: true },
    { id: 2, name: "Flugplatz & Schwedenkreuz", length: 3400, baseSpeed: 285, highG: true },
    { id: 3, name: "Fuchsröhre & Adenauer Forst", length: 3100, baseSpeed: 195, highG: true },
    { id: 4, name: "Kallenhard & Bergwerk", length: 2900, baseSpeed: 165, highG: true },
    { id: 5, name: "Klostertal & Karussell", length: 3300, baseSpeed: 140, highG: true },
    { id: 6, name: "Wippermann & Pflanzgarten", length: 2600, baseSpeed: 210, highG: true },
    { id: 7, name: "Schwalbenschwanz & Döttinger Höhe", length: 2682, baseSpeed: 305, highG: false }
  ]
};

// 2D SVG track coordinates normalized between 0-1000 for track map rendering
export const TRACK_PATH_POINTS = [
  { x: 740, y: 780, s: 7 }, // Döttinger Höhe
  { x: 860, y: 760, s: 7 },
  { x: 890, y: 700, s: 1 }, // Antoniusbuche
  { x: 850, y: 640, s: 1 }, // Tiergarten
  { x: 780, y: 580, s: 1 }, // Hohenrain
  { x: 730, y: 530, s: 1 }, // Hatzenbach
  { x: 670, y: 490, s: 1 }, // Hocheichen
  { x: 620, y: 440, s: 2 }, // Quiddelbacher Höhe
  { x: 570, y: 390, s: 2 }, // Flugplatz
  { x: 520, y: 330, s: 2 }, // Schwedenkreuz
  { x: 470, y: 280, s: 2 }, // Aremberg
  { x: 420, y: 240, s: 3 }, // Fuchsröhre
  { x: 380, y: 220, s: 3 },
  { x: 340, y: 240, s: 3 }, // Adenauer Forst
  { x: 300, y: 270, s: 3 }, // Metzgesfeld
  { x: 260, y: 320, s: 4 }, // Kallenhard
  { x: 230, y: 380, s: 4 }, // Wehrseifen
  { x: 210, y: 450, s: 4 }, // Breidscheid
  { x: 230, y: 510, s: 4 }, // Ex-Mühle
  { x: 270, y: 560, s: 4 }, // Bergwerk
  { x: 320, y: 610, s: 5 }, // Kesselchen
  { x: 370, y: 650, s: 5 }, // Klostertal
  { x: 420, y: 680, s: 5 }, // Steilstrecke
  { x: 460, y: 710, s: 5 }, // Karussell
  { x: 520, y: 690, s: 6 }, // Hohe Acht
  { x: 560, y: 650, s: 6 }, // Hedwigshöhe
  { x: 600, y: 610, s: 6 }, // Wippermann
  { x: 640, y: 570, s: 6 }, // Eschbach
  { x: 670, y: 610, s: 6 }, // Brünnchen
  { x: 680, y: 670, s: 6 }, // Pflanzgarten
  { x: 690, y: 720, s: 6 }, // Sprunghügel
  { x: 710, y: 750, s: 7 }, // Schwalbenschwanz
  { x: 730, y: 770, s: 7 }, // Galgenkopf
];

// Telemetry state simulation generator
export function createInitialTelemetryState() {
  return {
    timestamp: 0,
    speed: 214, // km/h
    rpm: 7850,
    maxRpm: 9000,
    gear: 5,
    throttle: 88, // 0 - 100%
    brake: 0,     // 0 - 100%
    steeringAngle: -12.4, // degrees
    latG: 1.34,    // lateral acceleration in G (+ is right, - is left)
    lonG: 0.42,    // longitudinal acceleration (+ is accel, - is braking)
    drsActive: false,
    sector: 2,
    lapDistance: 4520, // meters
    lapTimeMs: 82400, // 1:22.400
    deltaToRecord: -0.42, // delta vs 6:49.328 in seconds (- is faster)
    brakeTemps: {
      fl: 485, // °C
      fr: 512,
      rl: 420,
      rr: 435,
    },
    tirePressure: {
      fl: 2.15, // bar
      fr: 2.22,
      rl: 2.05,
      rr: 2.10,
    },
    tireTemps: {
      fl: 88, // °C
      fr: 94,
      rl: 82,
      rr: 85,
    },
    torqueVectoring: {
      fl: 0,   // GT3 RS is RWD with PTV+ electronic rear diff lock & front braking steer
      fr: 0,
      rl: 46,  // % of total rear drive torque
      rr: 54,  // torque vectoring pushing outside wheel in right turn
    },
    gHistory: [
      { lat: 0.2, lon: 0.8 },
      { lat: 0.5, lon: 0.6 },
      { lat: 0.9, lon: 0.2 },
      { lat: 1.2, lon: -0.2 },
      { lat: 1.45, lon: -0.6 },
    ]
  };
}

/**
 * Procedurally updates the live telemetry state by simulating physics along a dynamic lap
 */
export function simulateNextTelemetryTick(prevState, speedMultiplier = 1) {
  const dt = 0.05 * speedMultiplier; // 50ms simulation step
  let { speed, rpm, gear, throttle, brake, latG, lonG, sector, lapDistance, lapTimeMs, deltaToRecord, brakeTemps, tirePressure, tireTemps, torqueVectoring, gHistory } = prevState;

  lapTimeMs += dt * 1000;
  const speedMs = speed / 3.6;
  lapDistance = (lapDistance + speedMs * dt) % TRACK_INFO.lengthMeters;

  // Track phase cycling: straight, braking, corner entry, apex, exit
  const cycle = (lapDistance % 2000) / 2000; // 0 to 1 loop
  let targetSpeed = 220;
  let targetThrottle = 100;
  let targetBrake = 0;
  let targetLatG = 0;
  let drs = false;

  if (cycle < 0.25) {
    // High speed straight / acceleration
    targetSpeed = 295;
    targetThrottle = 100;
    targetBrake = 0;
    targetLatG = Math.sin(lapDistance * 0.01) * 0.2;
    drs = cycle > 0.05 && cycle < 0.22;
  } else if (cycle < 0.40) {
    // Hard braking zone before high G bend
    targetSpeed = 120;
    targetThrottle = 0;
    targetBrake = 85;
    targetLatG = Math.sin(lapDistance * 0.03) * 0.4;
    drs = false;
  } else if (cycle < 0.75) {
    // High G cornering sequence (Carousel / Fuchsröhre)
    targetSpeed = 155 + Math.sin(lapDistance * 0.02) * 25;
    targetThrottle = 45;
    targetBrake = 0;
    targetLatG = 1.45 * Math.sin(lapDistance * 0.02);
    drs = false;
  } else {
    // Corner exit & burst acceleration
    targetSpeed = 240;
    targetThrottle = 90;
    targetBrake = 0;
    targetLatG = 0.6 * Math.cos(lapDistance * 0.01);
    drs = false;
  }

  // Smooth interpolation toward targets with noise
  const jitter = (Math.random() - 0.5) * 2;
  speed += (targetSpeed - speed) * 0.08 + jitter * 0.5;
  speed = Math.max(60, Math.min(315, speed));

  throttle += (targetThrottle - throttle) * 0.2;
  brake += (targetBrake - brake) * 0.25;

  // Realistic PDK Gear & RPM mapping
  const gearRatios = [0, 48, 85, 130, 180, 235, 285, 320]; // max speed per gear
  let selectedGear = 1;
  for (let g = 1; g <= 7; g++) {
    if (speed <= gearRatios[g]) {
      selectedGear = g;
      break;
    }
    selectedGear = 7;
  }
  gear = selectedGear;

  const minRpmInGear = 4200;
  const prevRatio = gear > 1 ? gearRatios[gear - 1] : 0;
  const gearSpan = gearRatios[gear] - prevRatio;
  const fractionInGear = (speed - prevRatio) / gearSpan;
  rpm = Math.round(minRpmInGear + fractionInGear * (9000 - minRpmInGear) + (Math.random() - 0.5) * 60);
  rpm = Math.max(3500, Math.min(9050, rpm));

  // G-Force computation
  latG += (targetLatG - latG) * 0.15 + (Math.random() - 0.5) * 0.05;
  latG = Number(latG.toFixed(2));

  // Long G: positive on acceleration, negative on braking
  if (brake > 10) {
    lonG = -((brake / 100) * 1.55 + (Math.random() - 0.5) * 0.08);
  } else {
    lonG = (throttle / 100) * 0.95 - (speed / 300) * 0.35 + (Math.random() - 0.5) * 0.04;
  }
  lonG = Number(lonG.toFixed(2));

  // Update G scatter history (maintain last 25 points for glowing friction trail)
  const newGHistory = [...gHistory, { lat: latG, lon: lonG }];
  if (newGHistory.length > 28) newGHistory.shift();

  // Dynamic Brake Temperatures (°C)
  const brakeHeatFactor = brake * 0.12;
  const coolingRate = 0.6;
  const newBrakeTemps = {
    fl: Math.round(Math.min(780, Math.max(320, brakeTemps.fl + brakeHeatFactor * 1.2 - coolingRate + (latG > 0 ? 1 : 0)))),
    fr: Math.round(Math.min(780, Math.max(320, brakeTemps.fr + brakeHeatFactor * 1.2 - coolingRate + (latG < 0 ? 1 : 0)))),
    rl: Math.round(Math.min(650, Math.max(280, brakeTemps.rl + brakeHeatFactor * 0.8 - coolingRate))),
    rr: Math.round(Math.min(650, Math.max(280, brakeTemps.rr + brakeHeatFactor * 0.8 - coolingRate))),
  };

  // Tire Pressure (bar) increases with heat
  const newTirePressure = {
    fl: Number((2.10 + (newBrakeTemps.fl - 300) * 0.0003).toFixed(2)),
    fr: Number((2.10 + (newBrakeTemps.fr - 300) * 0.0003).toFixed(2)),
    rl: Number((2.00 + (newBrakeTemps.rl - 300) * 0.0003).toFixed(2)),
    rr: Number((2.00 + (newBrakeTemps.rr - 300) * 0.0003).toFixed(2)),
  };

  // Tire Temperatures (°C)
  const newTireTemps = {
    fl: Math.round(Math.min(115, Math.max(70, 75 + Math.abs(latG) * 12 + (newBrakeTemps.fl - 400) * 0.03))),
    fr: Math.round(Math.min(115, Math.max(70, 75 + Math.abs(latG) * 12 + (newBrakeTemps.fr - 400) * 0.03))),
    rl: Math.round(Math.min(115, Math.max(70, 72 + Math.abs(latG) * 8 + (throttle / 100) * 10))),
    rr: Math.round(Math.min(115, Math.max(70, 72 + Math.abs(latG) * 8 + (throttle / 100) * 10))),
  };

  // Torque Vectoring rear axle split based on lateral G
  // When cornering right (latG > 0), send more torque to outside left wheel (RL)
  let rlPercent = 50;
  let rrPercent = 50;
  if (throttle > 5) {
    const bias = latG * 18; // shift up to +/- 30%
    rlPercent = Math.min(85, Math.max(15, Math.round(50 + bias)));
    rrPercent = 100 - rlPercent;
  }

  // Active sector detection
  let currentSector = 1;
  let distAccum = 0;
  for (let i = 0; i < TRACK_INFO.sectors.length; i++) {
    distAccum += TRACK_INFO.sectors[i].length;
    if (lapDistance <= distAccum) {
      currentSector = TRACK_INFO.sectors[i].id;
      break;
    }
  }

  // Delta time drift
  deltaToRecord = Number((deltaToRecord + (Math.random() - 0.51) * 0.005).toFixed(3));

  return {
    timestamp: Date.now(),
    speed: Math.round(speed),
    rpm,
    maxRpm: 9000,
    gear,
    throttle: Math.round(throttle),
    brake: Math.round(brake),
    steeringAngle: Number((latG * -14.5).toFixed(1)),
    latG,
    lonG,
    drsActive: drs,
    sector: currentSector,
    lapDistance: Math.round(lapDistance),
    lapTimeMs: Math.round(lapTimeMs),
    deltaToRecord,
    brakeTemps: newBrakeTemps,
    tirePressure: newTirePressure,
    tireTemps: newTireTemps,
    torqueVectoring: {
      fl: 0,
      fr: 0,
      rl: rlPercent,
      rr: rrPercent,
    },
    gHistory: newGHistory,
  };
}
