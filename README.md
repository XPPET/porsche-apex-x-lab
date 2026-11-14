# Porsche Apex-X Studio | Aerodynamic Engineering & Telemetry Lab

> **A minimalist, high-end automotive design & telemetry engineering suite.** Built following the design principles of **Porsche Design** and **Apple-level minimalism**: deep graphite/charcoal monochromatic base, subtle frosted glassmorphism, restrained Porsche Carmine Red (`#D5001C`) and subtle Electric Acid Green accents, clean geometric typography (`Inter`), and monospace numerals (`JetBrains Mono`).

---

## 🏎️ Design Philosophy & Aesthetic System

- **Monochromatic Studio Palette:** Deep slate/charcoal canvas (`#07090D`, `#0D1016`, `#121620`) paired with delicate 1px borders (`rgba(255, 255, 255, 0.08)`) and frosted glass surfaces.
- **Restrained Automotive Accents:**
  - **Porsche Carmine Red (`#D5001C`):** Reserved strictly for active indicators, redline alerts, and key metric highlights.
  - **Electric Acid Green (`#94E000`):** Used subtly for DRS activation badges, optimal thermal ranges, and EV powertrain indicators.
  - **Zero Visual Noise:** NO gaudy neon glows, blinding border glows, heavy drop shadows, or cheap gaming scanlines.
- **Precision Typography:**
  - **Body & Headings:** `Inter` geometric sans-serif with ample whitespace, precise kerning, and clear visual hierarchy.
  - **Telemetry Numbers:** `JetBrains Mono` with tabular numerals (`num-tabular`) for precision readouts.
- **Vehicle Representation:**
  - High-end vector SVG / Canvas blueprint side profile accurately representing the iconic **Porsche 911 GT3 RS (992 generation)**: characteristic flyline, authentic swan-neck wing mount, front fender louvers, center-lock wheels, ceramic brakes, and active hydraulic articulation.

---

## 🛠️ Modules Overview

### 1. Virtual Wind Tunnel & Aerodynamics Studio
- **Clean Studio-Like Canvas:** Ultra-thin vector streamlines (`lineWidth: 0.85px`) flowing smoothly around the 911 GT3 RS body profile.
- **Interactive Vehicle Articulation:** Real-time wing angle tilt (0°–25°), chassis ride height compression (-20mm to +20mm) simulating Venturi ground effect suction, and active DRS flap opening.
- **View Mode Switch:** Seamless toggle between *Studio Flow* and architectural *CAD Blueprint* with wheelbase and length dimension callouts.
- **Digital Tuning Studio Sliders:** Minimalist slider tracks with fluid interaction and quick presets (*Max Downforce*, *Balanced*, *V-Max Low Drag*).
- **Minimalist Editorial Metric Cards:** Large, crisp numerals for Downforce (Newtons & kg load), Drag Coefficient ($C_d$), Top Speed ($v_{\text{max}}$), and Aero Balance front/rear percentage split.
- **Aero Trade-Off Graph:** Soft Chart.js line graph with subtle grid lines comparing Downforce vs. Drag across angle and velocity sweeps.

### 2. Telemetry & G-Force Hub
- **Digital Cockpit Cluster:** Inspired by the modern Porsche 992 curved digital instrument cluster: 9,000 RPM tachometer with sequential LED shift lights, large digital speed readout, PDK gear numeral, and clean throttle/brake meters.
- **Minimalist Friction Circle (GG Diagram):** Restrained G-force scatter plot with subtle concentric 0.5G–2.0G adhesion limit rings, crosshairs, and decaying historical points without visual clutter.
- **Architectural Chassis Telemetry:** 4-corner layout showing carbon-ceramic brake rotor temperatures (°C with subtle thermal status), tire pressures (bar & psi), surface temperatures, and Porsche Torque Vectoring (PTV+) dynamic split bar.
- **Nürburgring Nordschleife Vector Map:** Clean track path with vehicle beacon traversing 20.832 km, lap timer, and delta vs. the 6:49.328 record.
- **Streaming Telemetry Buffer:** Soft multi-channel line chart tracking velocity, throttle, and brake over time.
- **Simulation Actions:** Start/Pause feed, 1x/2x speed multipliers, and reset.

### 3. Powertrain Comparator (ICE vs EV)
- **Side-by-Side Comparison Table:** Clean, editorial table contrasting the **Naturally Aspirated 4.0L Boxer Flat-6 (911 GT3 RS)** against the **Dual-Motor PSM (Taycan Turbo GT)** across all homologated technical specs.
- **Dyno Curves Graph:** Clean Chart.js graph comparing Power (PS) and Torque (Nm) output across engine/motor RPM with filter controls.
- **Chassis & Power Controls:** Sliders for vehicle curb weight, fuel load, battery state of charge, and EV power delivery modes (*Attack Mode 1,108 PS*, *Track Mode 850 PS*, *Endurance 760 PS*).
- **Quarter Mile Drag Benchmark Runner:** Staging tree countdown lights, dual asphalt drag strip lanes with GT3 RS and Turbo GT car markers, live split times (0–100, 0–200, 1/4 mile ET, trap speed), and official time slip.

---

## 🚀 Running Locally

```bash
# Development Server
npm run dev

# Production Build
npm run build
```
Live at `http://localhost:3000/`.
