import React, { useState } from 'react';
import StudioCard from '../common/StudioCard';
import StudioDynoChart from './StudioDynoChart';
import StudioPowertrainControls from './StudioPowertrainControls';
import StudioDragRaceRunner from './StudioDragRaceRunner';
import StudioPowertrainTable from './StudioPowertrainTable';

export default function PowertrainLab() {
  const [iceWeight, setIceWeight] = useState(1450);
  const [evWeight, setEvWeight] = useState(2220);
  const [powerMode, setPowerMode] = useState('attack');
  const [iceFuelLoad, setIceFuelLoad] = useState(50);
  const [evBatterySoc, setEvBatterySoc] = useState(95);

  return (
    <div className="space-y-6">
      {/* Top Banner: Drag Strip Benchmark */}
      <StudioCard
        category="ACCELERATION BENCHMARK"
        title="Quarter Mile (402m) Drag Strip Simulator"
        subtitle="Dynamic traction and power-to-weight acceleration physics"
        badge={powerMode === 'attack' ? "ATTACK MODE 1,108 PS" : "TRACK SPEC"}
        badgeVariant={powerMode === 'attack' ? "acid" : "default"}
      >
        <StudioDragRaceRunner
          iceWeight={iceWeight}
          evWeight={evWeight}
          powerMode={powerMode}
          iceFuelLoad={iceFuelLoad}
          evBatterySoc={evBatterySoc}
        />
      </StudioCard>

      {/* Middle Grid: Dyno Chart & Powertrain Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <StudioCard
            category="DYNAMOMETER SPECTRUM"
            title="Power & Torque Delivery Curves"
            subtitle="Linear 9,000 RPM NA boxer howl vs instant 1,340 Nm electric catapult"
          >
            <StudioDynoChart powerMode={powerMode} />
          </StudioCard>
        </div>

        <div className="lg:col-span-5">
          <StudioCard
            category="POWERTRAIN SETUP"
            title="Weight & Energy Parameters"
            subtitle="Vehicle mass, power delivery mapping, and energy levels"
          >
            <StudioPowertrainControls
              iceWeight={iceWeight}
              setIceWeight={setIceWeight}
              evWeight={evWeight}
              setEvWeight={setEvWeight}
              powerMode={powerMode}
              setPowerMode={setPowerMode}
              iceFuelLoad={iceFuelLoad}
              setIceFuelLoad={setIceFuelLoad}
              evBatterySoc={evBatterySoc}
              setEvBatterySoc={setEvBatterySoc}
            />
          </StudioCard>
        </div>
      </div>

      {/* Bottom: Clean Side-by-Side Comparison Table */}
      <StudioCard
        category="ENGINEERING SPECIFICATIONS"
        title="Porsche Motorsport Powertrain Comparison"
        subtitle="Homologated technical specifications: 911 GT3 RS (992) vs Taycan Turbo GT"
        noPadding
      >
        <StudioPowertrainTable />
      </StudioCard>
    </div>
  );
}
