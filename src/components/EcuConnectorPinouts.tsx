import React, { useState } from 'react';
import { EcuPin, MultimeterState, PowerSupplyState } from '../types/ecu';
import {
  Cpu,
  Zap,
  Activity,
  Disc,
  Search,
  CheckCircle2,
  Info,
  Maximize2,
  ExternalLink,
  ShieldAlert,
  Sliders,
  Layers,
  ArrowRight,
  Terminal,
} from 'lucide-react';

export interface BenchPinoutInfo {
  pinNumber: number;
  plug: 'PLUG_A_81PIN' | 'PLUG_B_40PIN';
  label: string;
  signalName: string;
  category: 'power' | 'ground' | 'communication' | 'sensor_in' | 'actuator_out' | 'boot';
  nominalVoltage: number;
  wireColor: string;
  colorHex: string;
  benchRole: string;
  connectionInstruction: string;
  electricalSpec: string;
  associatedSimPinId?: string; // Links to live circuit simulation
  connectorCoords?: { xPercent: number; yPercent: number }; // Relative position on the connector image
}

export const ECU_BENCH_PINOUTS: BenchPinoutInfo[] = [
  // --- PLUG A (81-Pin Chamber: Power, Ground, Communication, Power Relay, Boot) ---
  {
    pinNumber: 1,
    plug: 'PLUG_A_81PIN',
    label: 'KL31',
    signalName: 'Main Power Ground 1',
    category: 'ground',
    nominalVoltage: 0.0,
    wireColor: 'Brown (BN)',
    colorHex: '#78350f',
    benchRole: 'Primary Chassis Ground Return',
    connectionInstruction: 'Connect to Bench Power Supply Negative (-) / Ground Terminal',
    electricalSpec: '0.0V Ground Sink (Max 15A)',
    associatedSimPinId: 'ecu-pin-1',
    connectorCoords: { xPercent: 24.5, yPercent: 44.5 },
  },
  {
    pinNumber: 2,
    plug: 'PLUG_A_81PIN',
    label: 'KL31_2',
    signalName: 'Main Power Ground 2',
    category: 'ground',
    nominalVoltage: 0.0,
    wireColor: 'Brown (BN)',
    colorHex: '#78350f',
    benchRole: 'Secondary Power Ground Return',
    connectionInstruction: 'Bridge with Pin 1 to Bench Power Supply Negative (-)',
    electricalSpec: '0.0V Ground Sink (Redundant Safety Ground)',
    associatedSimPinId: 'ecu-pin-2',
    connectorCoords: { xPercent: 26.2, yPercent: 44.5 },
  },
  {
    pinNumber: 3,
    plug: 'PLUG_A_81PIN',
    label: 'KL30',
    signalName: 'Permanent Battery Supply (+12V)',
    category: 'power',
    nominalVoltage: 12.6,
    wireColor: 'Red / Blue (RD/BU)',
    colorHex: '#ef4444',
    benchRole: 'Continuous ECU Memory & Microcontroller VBat',
    connectionInstruction: 'Connect to Bench Power Supply Positive (+12.6V constant)',
    electricalSpec: '+12.0V - +14.4V DC (Quiescent draw ~40mA)',
    associatedSimPinId: 'ecu-pin-3',
    connectorCoords: { xPercent: 28.0, yPercent: 44.5 },
  },
  {
    pinNumber: 4,
    plug: 'PLUG_A_81PIN',
    label: 'KL15',
    signalName: 'Switched Ignition +12V',
    category: 'power',
    nominalVoltage: 12.6,
    wireColor: 'Black / Violet (BK/VT)',
    colorHex: '#a855f7',
    benchRole: 'Ignition Wake-up Trigger',
    connectionInstruction: 'Connect to Bench Toggle Switch from +12V (Turns ECU ON/OFF)',
    electricalSpec: '+12.6V Active, 0.0V Sleep / Off',
    associatedSimPinId: 'ecu-pin-4',
    connectorCoords: { xPercent: 29.8, yPercent: 44.5 },
  },
  {
    pinNumber: 21,
    plug: 'PLUG_A_81PIN',
    label: 'MRELAY',
    signalName: 'Main Engine Relay Control (J271)',
    category: 'actuator_out',
    nominalVoltage: 12.6,
    wireColor: 'Blue / Yellow (BU/YE)',
    colorHex: '#3b82f6',
    benchRole: 'ECU-Controlled Relay Pull-Down Sink',
    connectionInstruction: 'Connect to Bench Relay Coil 85 (or 100Ω pull-up to +12V for bench testing)',
    electricalSpec: 'Low-side MOSFET ground switch (Sinks coil current when ignition active)',
    associatedSimPinId: 'ecu-pin-12',
    connectorCoords: { xPercent: 32.5, yPercent: 48.0 },
  },
  {
    pinNumber: 43,
    plug: 'PLUG_A_81PIN',
    label: 'K-LINE',
    signalName: 'Bidirectional Serial Diagnostics (ISO 9141-2)',
    category: 'communication',
    nominalVoltage: 12.0,
    wireColor: 'Green / White (GN/WH)',
    colorHex: '#10b981',
    benchRole: 'OBD-II Diagnostic & Flash Communication',
    connectionInstruction: 'Connect to Bench OBD-II Port Pin 7 (or KKL/VCDS USB cable K-line)',
    electricalSpec: '10.4 kbps UART (High idle at +12V, pulled low during data packets)',
    associatedSimPinId: 'ecu-pin-16',
    connectorCoords: { xPercent: 41.0, yPercent: 48.0 },
  },
  {
    pinNumber: 58,
    plug: 'PLUG_A_81PIN',
    label: 'CAN_H',
    signalName: 'High-Speed CAN High (ISO 11898)',
    category: 'communication',
    nominalVoltage: 2.5,
    wireColor: 'Orange / Black (OG/BK)',
    colorHex: '#f97316',
    benchRole: '500 kbps Powertrain High-Speed CAN Bus (+)',
    connectionInstruction: 'Connect to Bench OBD-II Port Pin 6 and 120Ω terminating resistor',
    electricalSpec: '2.5V Recessive, 3.5V Dominant',
    associatedSimPinId: 'ecu-pin-13',
    connectorCoords: { xPercent: 51.5, yPercent: 44.5 },
  },
  {
    pinNumber: 62,
    plug: 'PLUG_A_81PIN',
    label: 'CAN_L',
    signalName: 'High-Speed CAN Low (ISO 11898)',
    category: 'communication',
    nominalVoltage: 2.5,
    wireColor: 'Orange / Brown (OG/BN)',
    colorHex: '#ea580c',
    benchRole: '500 kbps Powertrain High-Speed CAN Bus (-)',
    connectionInstruction: 'Connect to Bench OBD-II Port Pin 14 and 120Ω terminating resistor',
    electricalSpec: '2.5V Recessive, 1.5V Dominant',
    associatedSimPinId: 'ecu-pin-14',
    connectorCoords: { xPercent: 54.0, yPercent: 44.5 },
  },
  {
    pinNumber: 65,
    plug: 'PLUG_A_81PIN',
    label: 'BOOT',
    signalName: 'Microcontroller Boot Mode Pin',
    category: 'boot',
    nominalVoltage: 3.3,
    wireColor: 'Grey (GY)',
    colorHex: '#64748b',
    benchRole: 'Infineon C167 / ST10 Boot Mode Flash & Recovery',
    connectionInstruction: 'Connect to Ground through 1kΩ or 100Ω resistor during power-up for boot mode flashing',
    electricalSpec: 'Active LOW on power-up to halt processor execution into internal bootloader',
    connectorCoords: { xPercent: 56.5, yPercent: 48.0 },
  },
  {
    pinNumber: 18,
    plug: 'PLUG_A_81PIN',
    label: 'O2_HTR',
    signalName: 'Oxygen Sensor 1 Heater Driver',
    category: 'actuator_out',
    nominalVoltage: 12.6,
    wireColor: 'White / Red (WH/RD)',
    colorHex: '#ec4899',
    benchRole: 'Heated O2 Sensor Element PWM Sink',
    connectionInstruction: 'Connect to Bench 10Ω/20W load resistor to +12V',
    electricalSpec: '100Hz PWM Low-side switch (Max 4A load)',
    associatedSimPinId: 'ecu-pin-15',
    connectorCoords: { xPercent: 30.5, yPercent: 52.0 },
  },
  {
    pinNumber: 61,
    plug: 'PLUG_A_81PIN',
    label: 'VSS',
    signalName: 'Vehicle Speed Sensor Input',
    category: 'sensor_in',
    nominalVoltage: 11.5,
    wireColor: 'Blue / White (BU/WH)',
    colorHex: '#06b6d4',
    benchRole: 'Transmission Hall VSS Pulses',
    connectionInstruction: 'Connect to Function Generator (0-12V square wave, 0-250 Hz)',
    electricalSpec: 'Digital frequency input with internal pull-up to +12V',
    connectorCoords: { xPercent: 53.0, yPercent: 48.0 },
  },

  // --- PLUG B (40-Pin Chamber: Sensors, Injectors, Ignition Triggers) ---
  {
    pinNumber: 98,
    plug: 'PLUG_B_40PIN',
    label: 'VREF_5V',
    signalName: 'Regulated 5.00V Sensor Supply',
    category: 'power',
    nominalVoltage: 5.0,
    wireColor: 'Violet / Red (VT/RD)',
    colorHex: '#eab308',
    benchRole: 'Precision 5.00V Reference Rail for Analog Sensors',
    connectionInstruction: 'Feeds TPS, MAP, and Pressure Sensors on Bench',
    electricalSpec: '5.00V ± 0.05V (Max current 150mA with thermal short-circuit protection)',
    associatedSimPinId: 'ecu-pin-5',
    connectorCoords: { xPercent: 68.5, yPercent: 44.5 },
  },
  {
    pinNumber: 108,
    plug: 'PLUG_B_40PIN',
    label: 'SGND',
    signalName: 'Analog Sensor Clean Ground Return',
    category: 'ground',
    nominalVoltage: 0.0,
    wireColor: 'Brown / Blue (BN/BU)',
    colorHex: '#78716c',
    benchRole: 'Dedicated Analog Ground Return (Noise-Isolated)',
    connectionInstruction: 'Connect to Sensor Low-Side Returns (Do NOT short to noisy chassis GND)',
    electricalSpec: '0.0V Analog Return with dedicated internal star ground plane',
    associatedSimPinId: 'ecu-pin-6',
    connectorCoords: { xPercent: 74.0, yPercent: 52.0 },
  },
  {
    pinNumber: 92,
    plug: 'PLUG_B_40PIN',
    label: 'TPS_SIG',
    signalName: 'Throttle Position Sensor Signal 1 (G79)',
    category: 'sensor_in',
    nominalVoltage: 0.85,
    wireColor: 'Green / Black (GN/BK)',
    colorHex: '#22c55e',
    benchRole: 'Analog Potentiometer 1 Track Input',
    connectionInstruction: 'Connect to Bench TPS Wiper or 0.5V - 4.5V variable voltage source',
    electricalSpec: '0.50V (Idle / Closed) to 4.50V (Wide Open Throttle)',
    associatedSimPinId: 'ecu-pin-7',
    connectorCoords: { xPercent: 66.5, yPercent: 48.0 },
  },
  {
    pinNumber: 93,
    plug: 'PLUG_B_40PIN',
    label: 'TPS_SIG2',
    signalName: 'Throttle Position Sensor Signal 2 (G185)',
    category: 'sensor_in',
    nominalVoltage: 4.15,
    wireColor: 'Yellow / Green (YE/GN)',
    colorHex: '#84cc16',
    benchRole: 'Inverted Safety Redundant Potentiometer Track',
    connectionInstruction: 'Connect to Dual Potentiometer Wiper (Inverse of Track 1)',
    electricalSpec: '4.50V (Idle / Closed) to 0.50V (Wide Open Throttle)',
    connectorCoords: { xPercent: 67.5, yPercent: 48.0 },
  },
  {
    pinNumber: 83,
    plug: 'PLUG_B_40PIN',
    label: 'ECT_SIG',
    signalName: 'Engine Coolant Temp Sensor Signal (G62)',
    category: 'sensor_in',
    nominalVoltage: 1.95,
    wireColor: 'Blue / Brown (BU/BN)',
    colorHex: '#f97316',
    benchRole: 'Coolant Thermistor NTC Input',
    connectionInstruction: 'Connect to Bench ECT Thermistor or decade resistance box (250Ω - 3.5kΩ)',
    electricalSpec: 'Internal 2.2kΩ pull-up to +5.0V; 3.89V @ 10°C, 0.48V @ 90°C',
    associatedSimPinId: 'ecu-pin-9',
    connectorCoords: { xPercent: 64.0, yPercent: 44.5 },
  },
  {
    pinNumber: 101,
    plug: 'PLUG_B_40PIN',
    label: 'MAP_SIG',
    signalName: 'Manifold Absolute Pressure Signal (G71)',
    category: 'sensor_in',
    nominalVoltage: 1.45,
    wireColor: 'Grey / Green (GY/GN)',
    colorHex: '#06b6d4',
    benchRole: 'Piezo-Resistive Pressure Transducer ADC Input',
    connectionInstruction: 'Connect to Bench MAP Sensor or 0 - 5V pressure simulator',
    electricalSpec: 'Linear ADC range: ~1.2V @ 20 kPa (idle vacuum), ~4.6V @ 100 kPa (atmospheric)',
    associatedSimPinId: 'ecu-pin-8',
    connectorCoords: { xPercent: 71.0, yPercent: 48.0 },
  },
  {
    pinNumber: 96,
    plug: 'PLUG_B_40PIN',
    label: 'INJ_1',
    signalName: 'Cylinder 1 Fuel Injector Driver',
    category: 'actuator_out',
    nominalVoltage: 12.6,
    wireColor: 'Grey / Yellow (GY/YE)',
    colorHex: '#3b82f6',
    benchRole: 'Solenoid Low-Side Ground Switch Output',
    connectionInstruction: 'Connect to Bench Injector Solenoid (12-16Ω) or LED test light to +12V',
    electricalSpec: 'Low-side MOSFET with 65V active clamp protection against flyback spikes',
    associatedSimPinId: 'ecu-pin-10',
    connectorCoords: { xPercent: 69.5, yPercent: 48.0 },
  },
  {
    pinNumber: 97,
    plug: 'PLUG_B_40PIN',
    label: 'INJ_2',
    signalName: 'Cylinder 2 Fuel Injector Driver',
    category: 'actuator_out',
    nominalVoltage: 12.6,
    wireColor: 'Grey / Red (GY/RD)',
    colorHex: '#2563eb',
    benchRole: 'Solenoid Low-Side Ground Switch Output',
    connectionInstruction: 'Connect to Bench Injector Solenoid (12-16Ω) to +12V',
    electricalSpec: 'Low-side MOSFET with 65V active clamp protection',
    connectorCoords: { xPercent: 70.0, yPercent: 48.0 },
  },
  {
    pinNumber: 87,
    plug: 'PLUG_B_40PIN',
    label: 'IGN_1',
    signalName: 'Cylinder 1 Ignition Coil Trigger',
    category: 'actuator_out',
    nominalVoltage: 0.0,
    wireColor: 'Green / Yellow (GN/YE)',
    colorHex: '#eab308',
    benchRole: 'Smart Coil Logic Trigger Output',
    connectionInstruction: 'Connect to Bench Oscilloscope Channel 1 or Smart Coil Input',
    electricalSpec: '5V Active-High logic pulse (2.0 - 3.2ms dwell period)',
    associatedSimPinId: 'ecu-pin-11',
    connectorCoords: { xPercent: 65.5, yPercent: 44.5 },
  },
  {
    pinNumber: 110,
    plug: 'PLUG_B_40PIN',
    label: 'RPM_CKP',
    signalName: 'Crankshaft Speed / Position Sensor (G28)',
    category: 'sensor_in',
    nominalVoltage: 0.0,
    wireColor: 'White / Blue (WH/BU)',
    colorHex: '#38bdf8',
    benchRole: '60-2 Tooth Variable Reluctance / VR Input',
    connectionInstruction: 'Connect to Bench Crank Wheel Simulator or AC signal generator (800 - 1000Ω coil)',
    electricalSpec: 'AC sine wave with missing 2-tooth gap for top-dead-center sync',
    connectorCoords: { xPercent: 75.0, yPercent: 52.0 },
  },
];

interface EcuConnectorPinoutsProps {
  pins: EcuPin[];
  nodeVoltages: Record<string, number>;
  selectedPinId: string | null;
  onSelectPin: (pinId: string) => void;
  multimeter: MultimeterState;
  onAttachProbe: (color: 'red' | 'black', pinId: string, label: string) => void;
  powerSupply: PowerSupplyState;
}

export const EcuConnectorPinouts: React.FC<EcuConnectorPinoutsProps> = ({
  pins,
  nodeVoltages,
  selectedPinId,
  onSelectPin,
  multimeter,
  onAttachProbe,
  powerSupply,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlugFilter, setSelectedPlugFilter] = useState<'ALL' | 'PLUG_A_81PIN' | 'PLUG_B_40PIN'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [activePinDetail, setActivePinDetail] = useState<BenchPinoutInfo>(ECU_BENCH_PINOUTS[2]); // Default Pin 3 KL30
  const [showOverlayMarkers, setShowOverlayMarkers] = useState(true);

  // Filtered pins list
  const filteredPins = ECU_BENCH_PINOUTS.filter(p => {
    const matchesSearch =
      searchQuery === '' ||
      p.pinNumber.toString().includes(searchQuery) ||
      p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.signalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.benchRole.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlug = selectedPlugFilter === 'ALL' || p.plug === selectedPlugFilter;
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;

    return matchesSearch && matchesPlug && matchesCategory;
  });

  const getSimulatedVoltage = (pin: BenchPinoutInfo): number => {
    if (pin.associatedSimPinId && nodeVoltages[pin.associatedSimPinId] !== undefined) {
      return nodeVoltages[pin.associatedSimPinId];
    }
    return pin.nominalVoltage;
  };

  return (
    <div className="flex-1 flex flex-col gap-3 overflow-hidden bg-slate-950 text-slate-100 p-2 font-mono select-none">
      {/* Top Banner & Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-100 tracking-wide">
                BOSCH ME7.5 ECU CONNECTOR & BENCH TEST PINOUTS
              </h2>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/70 border border-cyan-800 px-1.5 py-0.2 rounded font-semibold">
                121-PIN DUAL CAVITY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Actual physical connector face with pin tracking numbers, signal descriptions, and bench test harness connections.
            </p>
          </div>
        </div>

        {/* Search & Plug Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search pin #, signal, KL..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44"
            />
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedPlugFilter('ALL')}
              className={`px-2.5 py-1 rounded transition text-[11px] ${
                selectedPlugFilter === 'ALL' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Plugs
            </button>
            <button
              onClick={() => setSelectedPlugFilter('PLUG_A_81PIN')}
              className={`px-2.5 py-1 rounded transition text-[11px] ${
                selectedPlugFilter === 'PLUG_A_81PIN' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Plug A (81-Pin)
            </button>
            <button
              onClick={() => setSelectedPlugFilter('PLUG_B_40PIN')}
              className={`px-2.5 py-1 rounded transition text-[11px] ${
                selectedPlugFilter === 'PLUG_B_40PIN' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Plug B (40-Pin)
            </button>
          </div>

          <button
            onClick={() => setShowOverlayMarkers(!showOverlayMarkers)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition ${
              showOverlayMarkers
                ? 'bg-cyan-950/80 border-cyan-600 text-cyan-300 font-semibold'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
            title="Toggle Interactive Pin Markers on Photograph"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pin Overlay: {showOverlayMarkers ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 overflow-hidden min-h-0">
        {/* Left Column: Actual ECU Image & Interactive Connector Face */}
        <div className="flex-1 flex flex-col gap-2 bg-slate-900 border border-slate-800 rounded-xl p-3 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">PHYSICAL CONNECTOR RECEPTACLE</span>
              <span className="text-slate-500 text-[10px]">· Face View (Harness Side Facing ECU)</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Plug A (81-Pin Power/CAN/K-Line)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Plug B (40-Pin Sensors/Inj)
              </span>
            </div>
          </div>

          {/* High-Resolution Photo Container with Pin Overlay */}
          <div className="relative flex-1 bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center group">
            <img
              src="/assets/images/ecu_connector_socket.jpg"
              alt="Bosch ME7.5 ECU Connector Socket Face with Gold Terminal Pins"
              className="w-full h-full object-contain select-none"
            />

            {/* Interactive Pin Tracking Marker Overlay */}
            {showOverlayMarkers && (
              <div className="absolute inset-0 pointer-events-auto">
                {ECU_BENCH_PINOUTS.map(pin => {
                  if (!pin.connectorCoords) return null;
                  const isSelected = activePinDetail.pinNumber === pin.pinNumber;
                  const isRedProbe = multimeter.redProbe.attachedToPinId === pin.associatedSimPinId;
                  const isBlackProbe = multimeter.blackProbe.attachedToPinId === pin.associatedSimPinId;

                  return (
                    <div
                      key={pin.pinNumber}
                      onClick={() => {
                        setActivePinDetail(pin);
                        if (pin.associatedSimPinId) onSelectPin(pin.associatedSimPinId);
                      }}
                      style={{
                        position: 'absolute',
                        left: `${pin.connectorCoords.xPercent}%`,
                        top: `${pin.connectorCoords.yPercent}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="cursor-pointer group/pin z-10"
                      title={`Pin #${pin.pinNumber} - ${pin.label} (${pin.signalName})`}
                    >
                      {/* Pulsing Target Dot */}
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-cyan-400 border-white ring-4 ring-cyan-400/50 scale-125 z-20'
                            : isRedProbe
                            ? 'bg-rose-500 border-white ring-4 ring-rose-500/50 scale-110 z-20 animate-pulse'
                            : isBlackProbe
                            ? 'bg-slate-300 border-black ring-4 ring-slate-400/50 scale-110 z-20 animate-pulse'
                            : pin.plug === 'PLUG_A_81PIN'
                            ? 'bg-cyan-500/80 border-cyan-200 hover:scale-125 hover:bg-cyan-300'
                            : 'bg-amber-500/80 border-amber-200 hover:scale-125 hover:bg-amber-300'
                        }`}
                      >
                        <span className="text-[7px] font-bold text-slate-950 font-mono">
                          {pin.pinNumber}
                        </span>
                      </div>

                      {/* Tooltip on Hover */}
                      <div className="opacity-0 group-hover/pin:opacity-100 pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-950 border border-cyan-500 text-white text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap z-30 transition">
                        <strong>#{pin.pinNumber} {pin.label}</strong> ({pin.signalName})
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Helper Badge */}
            <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded border border-slate-800 text-[10px] text-slate-400">
              Click any pin pinout number to inspect bench test wiring & attach multimeter probes
            </div>
          </div>

          {/* Selected Pin Deep Inspection Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-3.5 h-3.5 rounded-full border border-white"
                  style={{ backgroundColor: activePinDetail.colorHex }}
                />
                <span className="font-bold text-sm text-cyan-300">
                  PIN #{activePinDetail.pinNumber} · {activePinDetail.label}
                </span>
                <span className="text-slate-400 text-xs">({activePinDetail.signalName})</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">VOLTAGE:</span>
                <span className="text-amber-400 font-bold tabular-nums">
                  {getSimulatedVoltage(activePinDetail).toFixed(2)} V
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[9px]">CONNECTOR PLUG</span>
                <span className="font-semibold text-slate-200">
                  {activePinDetail.plug === 'PLUG_A_81PIN' ? 'Plug A (81-Pin Main)' : 'Plug B (40-Pin Sensor)'}
                </span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[9px]">HARNESS WIRE COLOR</span>
                <span className="font-semibold" style={{ color: activePinDetail.colorHex }}>
                  {activePinDetail.wireColor}
                </span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[9px]">SIGNAL CATEGORY</span>
                <span className="font-semibold text-cyan-300 uppercase">
                  {activePinDetail.category.replace('_', ' ')}
                </span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[9px]">BENCH ROLE</span>
                <span className="font-semibold text-slate-200 truncate block">
                  {activePinDetail.benchRole}
                </span>
              </div>
            </div>

            <div className="bg-slate-900/90 p-2 rounded border border-slate-800 text-[11px] flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[10px]">
                <Terminal className="w-3 h-3" />
                <span>BENCH CONNECTION INSTRUCTION:</span>
              </div>
              <p className="text-slate-300 text-[11px] font-sans">
                {activePinDetail.connectionInstruction}
              </p>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                <strong className="text-slate-300">Spec:</strong> {activePinDetail.electricalSpec}
              </div>
            </div>

            {/* Quick Actions for Selected Pin */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const simId = activePinDetail.associatedSimPinId || `ecu-pin-${activePinDetail.pinNumber}`;
                    onAttachProbe('red', simId, `Pin ${activePinDetail.pinNumber} - ${activePinDetail.label}`);
                  }}
                  className="px-2.5 py-1 text-xs rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-300 font-semibold flex items-center gap-1.5 transition"
                >
                  <Disc className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>Attach Red Probe (+)</span>
                </button>
                <button
                  onClick={() => {
                    const simId = activePinDetail.associatedSimPinId || `ecu-pin-${activePinDetail.pinNumber}`;
                    onAttachProbe('black', simId, `Pin ${activePinDetail.pinNumber} - ${activePinDetail.label}`);
                  }}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-semibold flex items-center gap-1.5 transition"
                >
                  <Disc className="w-3.5 h-3.5 text-slate-400 fill-slate-400" />
                  <span>Attach Black COM (-)</span>
                </button>
              </div>

              {activePinDetail.category === 'boot' && (
                <div className="text-[10px] text-amber-400 bg-amber-950/50 border border-amber-800/80 px-2 py-1 rounded flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>C167 Boot Mode Pin: Requires 1kΩ pull-down to GND</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Complete Bench Pinout Table with Tracking Numbers */}
        <div className="w-full lg:w-[480px] flex flex-col gap-2 bg-slate-900 border border-slate-800 rounded-xl p-3 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">BENCH PINOUT DIRECTORY</span>
              <span className="text-slate-500 text-[10px]">({filteredPins.length} Pins Tracked)</span>
            </div>
            {/* Category Quick Filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-[10px] text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="power">Power Supplies (+12V / 5V)</option>
              <option value="ground">Grounds (KL31 / SGND)</option>
              <option value="communication">CAN & K-Line Comms</option>
              <option value="sensor_in">Analog Sensor Inputs</option>
              <option value="actuator_out">Actuators / Drivers</option>
              <option value="boot">Boot Mode Recovery</option>
            </select>
          </div>

          {/* Minimal Bench Test Quick Start Checklist */}
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-cyan-400 font-bold text-[10px]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                MINIMUM BENCH FLASH & TEST CONNECTIONS (ME7.5):
              </span>
              <span className="text-slate-400 font-normal">5 Essential Wires</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-300">
              <div>• <strong>Pin 1 & 2</strong>: GND (KL31)</div>
              <div>• <strong>Pin 3</strong>: +12V Constant (KL30)</div>
              <div>• <strong>Pin 4</strong>: +12V Switched (KL15)</div>
              <div>• <strong>Pin 43</strong>: K-Line (OBD2 Pin 7)</div>
              <div>• <strong>Pin 58/62</strong>: CAN-H/L (120Ω Term)</div>
              <div>• <strong>Pin 65</strong>: Boot Mode (to GND)</div>
            </div>
          </div>

          {/* Pinout List Table */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5">
            {filteredPins.map(pin => {
              const isSelected = activePinDetail.pinNumber === pin.pinNumber;
              const isRedProbe = multimeter.redProbe.attachedToPinId === pin.associatedSimPinId;
              const isBlackProbe = multimeter.blackProbe.attachedToPinId === pin.associatedSimPinId;
              const v = getSimulatedVoltage(pin);

              return (
                <div
                  key={pin.pinNumber}
                  onClick={() => {
                    setActivePinDetail(pin);
                    if (pin.associatedSimPinId) onSelectPin(pin.associatedSimPinId);
                  }}
                  className={`p-2 rounded-lg border text-xs cursor-pointer transition flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Tracking Number Badge */}
                      <span className="w-6 h-6 rounded bg-slate-900 border border-slate-700 font-bold flex items-center justify-center text-cyan-300 text-[11px]">
                        #{pin.pinNumber}
                      </span>
                      <div>
                        <span className="font-bold text-slate-100">{pin.label}</span>
                        <span className="text-[10px] text-slate-400 ml-1.5">{pin.signalName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold tabular-nums text-[11px]">
                        {v.toFixed(1)}V
                      </span>
                      {/* Probe Indicator Badges */}
                      {isRedProbe && (
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" title="Red DMM Probe Attached" />
                      )}
                      {isBlackProbe && (
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300 ring-2 ring-black" title="Black COM Probe Attached" />
                      )}
                    </div>
                  </div>

                  {/* Wire color and bench connection note */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60 pt-1 mt-0.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: pin.colorHex }}
                      />
                      <span>{pin.wireColor}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 truncate max-w-[200px]">{pin.benchRole}</span>
                    </div>
                    <span className="text-slate-500 font-mono">
                      {pin.plug === 'PLUG_A_81PIN' ? 'Plug A' : 'Plug B'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
