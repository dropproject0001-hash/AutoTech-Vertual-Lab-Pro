import React, { useState } from 'react';
import {
  DEFAULT_ECU_PINS,
  DEFAULT_BENCH_COMPONENTS,
  DEFAULT_WIRES,
  solveCircuit,
} from './utils/circuitSolver';
import {
  EcuPin,
  BenchComponent,
  WireConnection,
  InjectedFault,
  FaultType,
  MultimeterState,
  PowerSupplyState,
} from './types/ecu';
import { BenchPowerSupply } from './components/BenchPowerSupply';
import { DigitalMultimeter } from './components/DigitalMultimeter';
import { FaultInjector } from './components/FaultInjector';
import { WiringCanvas } from './components/WiringCanvas';
import { Oscilloscope } from './components/Oscilloscope';
import { SchematicPcbScanner } from './components/SchematicPcbScanner';
import { EcuConnectorPinouts } from './components/EcuConnectorPinouts';
import {
  Zap,
  Activity,
  Layers,
  Cpu,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';

type LabTab = 'BENCH_LAB' | 'WIRING_DIAGRAM' | 'ECU_PINOUT' | 'OSCILLOSCOPE' | 'PCB_SCANNER';
type RackFilter = 'ALL' | 'DMM_POWER' | 'FAULT_MATRIX';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<LabTab>('BENCH_LAB');
  const [rackFilter, setRackFilter] = useState<RackFilter>('ALL');

  // Core Bench State
  const [powerSupply, setPowerSupply] = useState<PowerSupplyState>({
    voltageSetting: 12.6,
    currentLimit: 5.0,
    isOutputEnabled: true,
    preset: '12V_BENCH',
  });

  const [pins, setPins] = useState<EcuPin[]>(DEFAULT_ECU_PINS);
  const [components, setComponents] = useState<BenchComponent[]>(DEFAULT_BENCH_COMPONENTS);
  const [wires, setWires] = useState<WireConnection[]>(DEFAULT_WIRES);
  const [faults, setFaults] = useState<InjectedFault[]>([]);
  const [selectedPinId, setSelectedPinId] = useState<string | null>('ecu-pin-7'); // TPS_SIG default

  // Multimeter State
  const [multimeter, setMultimeter] = useState<MultimeterState>({
    mode: 'V_DC',
    redProbe: { attachedToPinId: 'ecu-pin-7', attachedLabel: 'TPS_SIG (Pin 7)' },
    blackProbe: { attachedToPinId: 'chassis-gnd', attachedLabel: 'Chassis GND (KL31)' },
    isPowered: true,
    rangeAuto: true,
    holdValue: false,
  });

  // Calculate live circuit solution based on all physical parameters
  const circuitSolution = solveCircuit(
    powerSupply,
    pins,
    faults,
    wires,
    components,
    multimeter
  );

  // Fault management handlers
  const handleAddFault = (pinId: string, faultType: FaultType, description: string) => {
    setFaults(prev => {
      const filtered = prev.filter(f => f.pinId !== pinId);
      return [...filtered, { pinId, faultType, description, timestamp: Date.now() }];
    });
  };

  const handleRemoveFault = (pinId: string) => {
    setFaults(prev => prev.filter(f => f.pinId !== pinId));
  };

  const handleClearAllFaults = () => {
    setFaults([]);
  };

  // Wire management
  const handleAddWire = (sourcePinId: string, targetPinId: string) => {
    const exists = wires.some(
      w =>
        (w.sourcePinId === sourcePinId && w.targetPinId === targetPinId) ||
        (w.sourcePinId === targetPinId && w.targetPinId === sourcePinId)
    );
    if (exists) return;

    const newWire: WireConnection = {
      id: `wire-${Date.now()}`,
      sourcePinId,
      targetPinId,
      color: '#06b6d4',
      label: 'Auxiliary Harness Lead',
      isCut: false,
      resistance: 0.05,
    };
    setWires(prev => [...prev, newWire]);
  };

  const handleToggleCutWire = (wireId: string) => {
    setWires(prev =>
      prev.map(w => (w.id === wireId ? { ...w, isCut: !w.isCut } : w))
    );
  };

  const handleDeleteWire = (wireId: string) => {
    setWires(prev => prev.filter(w => w.id !== wireId));
  };

  const handleUpdateComponentState = (compId: string, updates: Record<string, number | boolean | string>) => {
    setComponents(prev =>
      prev.map(c => (c.id === compId ? { ...c, state: { ...c.state, ...updates } } : c))
    );
  };

  // Reset entire laboratory to pristine factory state
  const handleResetLab = () => {
    setPowerSupply({
      voltageSetting: 12.6,
      currentLimit: 5.0,
      isOutputEnabled: true,
      preset: '12V_BENCH',
    });
    setPins(DEFAULT_ECU_PINS);
    setComponents(DEFAULT_BENCH_COMPONENTS);
    setWires(DEFAULT_WIRES);
    setFaults([]);
    setSelectedPinId('ecu-pin-7');
    setMultimeter({
      mode: 'V_DC',
      redProbe: { attachedToPinId: 'ecu-pin-7', attachedLabel: 'TPS_SIG (Pin 7)' },
      blackProbe: { attachedToPinId: 'chassis-gnd', attachedLabel: 'Chassis GND (KL31)' },
      isPowered: true,
      rangeAuto: true,
      holdValue: false,
    });
  };

  const hasCanFault = faults.some(f => f.pinId === 'ecu-pin-13' || f.pinId === 'ecu-pin-14');
  const hasInjectorFault = faults.some(f => f.pinId === 'ecu-pin-10');

  // Selected Pin details
  const selectedPin = pins.find(p => p.id === selectedPinId);

  return (
    <div className="flex flex-col h-screen bg-[#07090e] text-slate-100 font-sans select-none overflow-hidden">
      {/* 1. Strict 3-Zone Top Navigation Bar */}
      <header className="h-12 border-b border-slate-800 bg-slate-950 px-5 flex items-center justify-between gap-8 text-xs font-mono shrink-0">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-6 h-6 rounded bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold tracking-tight text-slate-100 text-sm whitespace-nowrap">
            Autoelectric Lab
          </span>
          <span className="text-slate-500 text-xs hidden lg:inline">· ECU Bench Testbed</span>
        </div>

        {/* Zone 2: Navigation Links (Single-Line Segmented Control) */}
        <nav className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('BENCH_LAB')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition ${
              activeTab === 'BENCH_LAB'
                ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bench Lab
          </button>
          <button
            onClick={() => setActiveTab('WIRING_DIAGRAM')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition ${
              activeTab === 'WIRING_DIAGRAM'
                ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Harness Wiring
          </button>
          <button
            onClick={() => setActiveTab('ECU_PINOUT')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition ${
              activeTab === 'ECU_PINOUT'
                ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ECU Pinouts & Socket
          </button>
          <button
            onClick={() => setActiveTab('OSCILLOSCOPE')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition ${
              activeTab === 'OSCILLOSCOPE'
                ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Oscilloscope
          </button>
          <button
            onClick={() => setActiveTab('PCB_SCANNER')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition ${
              activeTab === 'PCB_SCANNER'
                ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            PCB / AI Scanner
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Telemetry Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
            <span>DRAW:</span>
            <span className="text-amber-400 font-bold tabular-nums">
              {circuitSolution.supplyCurrentDrawAmps.toFixed(2)} A
            </span>
            <span className="text-slate-700">·</span>
            {circuitSolution.activeDTCs.length > 0 ? (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {circuitSolution.activeDTCs.length} FAULT
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> NOMINAL
              </span>
            )}
          </div>

          <button
            onClick={handleResetLab}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition whitespace-nowrap shrink-0"
            title="Reset Bench to Factory Setup"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bench</span>
          </button>
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 overflow-hidden p-3.5 flex gap-3.5">
        {/* TAB 1: BENCH LAB */}
        {activeTab === 'BENCH_LAB' && (
          <div className="flex-1 flex gap-3.5 overflow-hidden">
            {/* Left Instrument Column with Ergonomic Filter Tabs */}
            <div className="w-[390px] flex flex-col gap-2.5 overflow-hidden shrink-0">
              {/* Rack View Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px] font-mono shrink-0">
                <button
                  onClick={() => setRackFilter('ALL')}
                  className={`flex-1 py-1 rounded text-center transition ${
                    rackFilter === 'ALL' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Rack
                </button>
                <button
                  onClick={() => setRackFilter('DMM_POWER')}
                  className={`flex-1 py-1 rounded text-center transition ${
                    rackFilter === 'DMM_POWER' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  DMM & Power
                </button>
                <button
                  onClick={() => setRackFilter('FAULT_MATRIX')}
                  className={`flex-1 py-1 rounded text-center transition ${
                    rackFilter === 'FAULT_MATRIX' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fault Matrix
                </button>
              </div>

              {/* Scrollable Instruments Area */}
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
                {(rackFilter === 'ALL' || rackFilter === 'DMM_POWER') && (
                  <>
                    <BenchPowerSupply
                      powerSupply={powerSupply}
                      onChange={setPowerSupply}
                      actualCurrentAmps={circuitSolution.supplyCurrentDrawAmps}
                      isTripped={circuitSolution.isSupplyCurrentTripped}
                    />

                    <DigitalMultimeter
                      multimeter={multimeter}
                      onChange={setMultimeter}
                      reading={circuitSolution.multimeterReading}
                      pins={pins}
                      components={components}
                      selectedPinId={selectedPinId}
                    />
                  </>
                )}

                {(rackFilter === 'ALL' || rackFilter === 'FAULT_MATRIX') && (
                  <FaultInjector
                    pins={pins}
                    faults={faults}
                    activeDTCs={circuitSolution.activeDTCs}
                    onAddFault={handleAddFault}
                    onRemoveFault={handleRemoveFault}
                    onClearAll={handleClearAllFaults}
                    selectedPinId={selectedPinId}
                    onSelectPin={setSelectedPinId}
                  />
                )}
              </div>
            </div>

            {/* Right: Live Interactive Wiring Canvas */}
            <WiringCanvas
              pins={pins}
              wires={wires}
              components={components}
              nodeVoltages={circuitSolution.nodeVoltages}
              selectedPinId={selectedPinId}
              onSelectPin={setSelectedPinId}
              onAddWire={handleAddWire}
              onToggleCutWire={handleToggleCutWire}
              onDeleteWire={handleDeleteWire}
              multimeter={multimeter}
              onAttachProbe={(color, pinId, label) => {
                if (color === 'red') {
                  setMultimeter(prev => ({ ...prev, redProbe: { attachedToPinId: pinId, attachedLabel: label } }));
                } else {
                  setMultimeter(prev => ({ ...prev, blackProbe: { attachedToPinId: pinId, attachedLabel: label } }));
                }
              }}
              onUpdateComponentState={handleUpdateComponentState}
              isPowerOn={powerSupply.isOutputEnabled}
              onOpenEcuPinouts={() => setActiveTab('ECU_PINOUT')}
            />
          </div>
        )}

        {/* TAB 2: WIRING DIAGRAM (Expanded Full-Screen Harness Engine) */}
        {activeTab === 'WIRING_DIAGRAM' && (
          <div className="flex-1 flex flex-col gap-3 overflow-hidden">
            <WiringCanvas
              pins={pins}
              wires={wires}
              components={components}
              nodeVoltages={circuitSolution.nodeVoltages}
              selectedPinId={selectedPinId}
              onSelectPin={setSelectedPinId}
              onAddWire={handleAddWire}
              onToggleCutWire={handleToggleCutWire}
              onDeleteWire={handleDeleteWire}
              multimeter={multimeter}
              onAttachProbe={(color, pinId, label) => {
                if (color === 'red') {
                  setMultimeter(prev => ({ ...prev, redProbe: { attachedToPinId: pinId, attachedLabel: label } }));
                } else {
                  setMultimeter(prev => ({ ...prev, blackProbe: { attachedToPinId: pinId, attachedLabel: label } }));
                }
              }}
              onUpdateComponentState={handleUpdateComponentState}
              isPowerOn={powerSupply.isOutputEnabled}
              onOpenEcuPinouts={() => setActiveTab('ECU_PINOUT')}
            />
          </div>
        )}

        {/* TAB 3: ECU CONNECTOR & BENCH TEST PINOUTS */}
        {activeTab === 'ECU_PINOUT' && (
          <div className="flex-1 flex overflow-hidden">
            <EcuConnectorPinouts
              pins={pins}
              nodeVoltages={circuitSolution.nodeVoltages}
              selectedPinId={selectedPinId}
              onSelectPin={setSelectedPinId}
              multimeter={multimeter}
              onAttachProbe={(color, pinId, label) => {
                if (color === 'red') {
                  setMultimeter(prev => ({ ...prev, redProbe: { attachedToPinId: pinId, attachedLabel: label } }));
                } else {
                  setMultimeter(prev => ({ ...prev, blackProbe: { attachedToPinId: pinId, attachedLabel: label } }));
                }
              }}
              powerSupply={powerSupply}
            />
          </div>
        )}

        {/* TAB 4: OSCILLOSCOPE */}
        {activeTab === 'OSCILLOSCOPE' && (
          <div className="flex-1 flex flex-col gap-3 overflow-hidden">
            <Oscilloscope
              isPowerOn={powerSupply.isOutputEnabled}
              selectedSignal={hasCanFault ? 'CAN_BUS' : 'INJECTOR_PWM'}
              hasCanFault={hasCanFault}
              hasInjectorFault={hasInjectorFault}
            />
            {/* Split with Wiring Canvas for rapid testing */}
            <div className="flex-1 min-h-[360px] overflow-hidden">
              <WiringCanvas
                pins={pins}
                wires={wires}
                components={components}
                nodeVoltages={circuitSolution.nodeVoltages}
                selectedPinId={selectedPinId}
                onSelectPin={setSelectedPinId}
                onAddWire={handleAddWire}
                onToggleCutWire={handleToggleCutWire}
                onDeleteWire={handleDeleteWire}
                multimeter={multimeter}
                onAttachProbe={(color, pinId, label) => {
                  if (color === 'red') {
                    setMultimeter(prev => ({ ...prev, redProbe: { attachedToPinId: pinId, attachedLabel: label } }));
                  } else {
                    setMultimeter(prev => ({ ...prev, blackProbe: { attachedToPinId: pinId, attachedLabel: label } }));
                  }
                }}
                onUpdateComponentState={handleUpdateComponentState}
                isPowerOn={powerSupply.isOutputEnabled}
              />
            </div>
          </div>
        )}

        {/* TAB 4: PCB & AI SCHEMATIC SCANNER */}
        {activeTab === 'PCB_SCANNER' && (
          <div className="flex-1 flex overflow-hidden">
            <SchematicPcbScanner />
          </div>
        )}
      </div>

      {/* 3. Bottom Laboratory Status & Quick Probe Bar */}
      <footer className="h-9 border-t border-slate-800 bg-slate-950 px-4 flex items-center justify-between text-[11px] font-mono shrink-0 text-slate-400">
        <div className="flex items-center gap-4 truncate">
          <span className="truncate">
            TARGET PIN: <strong className="text-cyan-300">{selectedPin ? `${selectedPin.label} (#${selectedPin.pinNumber})` : 'None'}</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span className="whitespace-nowrap">
            DMM READING: <strong className="text-amber-300 font-bold">{circuitSolution.multimeterReading.display} {circuitSolution.multimeterReading.unit}</strong>
          </span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="whitespace-nowrap hidden sm:inline">
            HARNESS: <strong className="text-slate-200">{wires.filter(w => !w.isCut).length} Active / {wires.length} Wires</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (selectedPinId) {
                const label = selectedPin ? `${selectedPin.label} (${selectedPin.name})` : selectedPinId;
                setMultimeter(prev => ({
                  ...prev,
                  redProbe: { attachedToPinId: selectedPinId, attachedLabel: label },
                }));
              }
            }}
            className="text-[10px] text-rose-300 hover:text-white flex items-center gap-1 bg-rose-950/60 hover:bg-rose-900/60 px-2.5 py-1 rounded border border-rose-800/80 transition"
          >
            Attach Red Probe (+)
          </button>
          <button
            onClick={() => {
              setMultimeter(prev => ({
                ...prev,
                blackProbe: { attachedToPinId: 'chassis-gnd', attachedLabel: 'Chassis GND (KL31)' },
              }));
            }}
            className="text-[10px] text-slate-300 hover:text-white flex items-center gap-1 bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded border border-slate-700 transition"
          >
            Clip Black COM to GND
          </button>
        </div>
      </footer>
    </div>
  );
}
