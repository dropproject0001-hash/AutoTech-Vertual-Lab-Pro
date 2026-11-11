import { EcuPin, FaultType, InjectedFault, WireConnection, BenchComponent, MultimeterState, PowerSupplyState, DiagnosticTroubleCode } from '../types/ecu';

export const DEFAULT_ECU_PINS: EcuPin[] = [
  { id: 'ecu-pin-1', pinNumber: 1, label: 'KL31', name: 'Power Ground 1', category: 'ground', nominalVoltage: 0.0, internalResistance: 0.08, description: 'Chassis/Engine Ground Return' },
  { id: 'ecu-pin-2', pinNumber: 2, label: 'KL31_2', name: 'Power Ground 2', category: 'ground', nominalVoltage: 0.0, internalResistance: 0.08, description: 'Power Ground Secondary' },
  { id: 'ecu-pin-3', pinNumber: 3, label: 'KL30', name: 'Battery Constant +12V', category: 'power', nominalVoltage: 12.6, internalResistance: 0.2, description: 'Unswitched Battery Supply (+30)' },
  { id: 'ecu-pin-4', pinNumber: 4, label: 'KL15', name: 'Ignition Switch Input', category: 'power', nominalVoltage: 12.6, internalResistance: 1200, description: 'Switched Terminal 15 (+15)' },
  { id: 'ecu-pin-5', pinNumber: 5, label: 'VREF_5V', name: 'Sensor 5V Reference', category: 'reference', nominalVoltage: 5.0, internalResistance: 8.5, description: 'Regulated 5.00V Supply (Max 150mA)' },
  { id: 'ecu-pin-6', pinNumber: 6, label: 'SGND', name: 'Sensor Clean Ground', category: 'ground', nominalVoltage: 0.0, internalResistance: 0.35, description: 'Analog Ground Reference' },
  { id: 'ecu-pin-7', pinNumber: 7, label: 'TPS_SIG', name: 'Throttle Position Signal', category: 'sensor_in', nominalVoltage: 0.85, internalResistance: 47000, description: 'Analog ADC input 0.5V - 4.5V' },
  { id: 'ecu-pin-8', pinNumber: 8, label: 'MAP_SIG', name: 'Manifold Pressure Signal', category: 'sensor_in', nominalVoltage: 1.45, internalResistance: 47000, description: 'Pressure Transducer Input' },
  { id: 'ecu-pin-9', pinNumber: 9, label: 'ECT_SIG', name: 'Coolant Temp Signal', category: 'sensor_in', nominalVoltage: 1.95, internalResistance: 2200, description: 'Internal Pull-Up 2.2kΩ to 5V' },
  { id: 'ecu-pin-10', pinNumber: 10, label: 'INJ_1', name: 'Injector 1 Driver', category: 'actuator_out', nominalVoltage: 12.6, internalResistance: 0.15, description: 'Low-Side MOSFET Sink to GND' },
  { id: 'ecu-pin-11', pinNumber: 11, label: 'IGN_1', name: 'Ignition Coil 1 Trigger', category: 'actuator_out', nominalVoltage: 0.0, internalResistance: 100, description: '5V Logic Trigger / Smart Coil' },
  { id: 'ecu-pin-12', pinNumber: 12, label: 'MRELAY', name: 'Main Relay Control', category: 'actuator_out', nominalVoltage: 12.6, internalResistance: 0.2, description: 'Low-side Relay Pull-Down' },
  { id: 'ecu-pin-13', pinNumber: 13, label: 'CAN_H', name: 'High-Speed CAN High', category: 'communication', nominalVoltage: 2.5, internalResistance: 60, description: 'Recessive 2.5V, Dominant 3.5V' },
  { id: 'ecu-pin-14', pinNumber: 14, label: 'CAN_L', name: 'High-Speed CAN Low', category: 'communication', nominalVoltage: 2.5, internalResistance: 60, description: 'Recessive 2.5V, Dominant 1.5V' },
  { id: 'ecu-pin-15', pinNumber: 15, label: 'O2_SIG', name: 'Oxygen Sensor 1 Bank 1', category: 'sensor_in', nominalVoltage: 0.45, internalResistance: 100000, description: 'Zirconia Nernst Cell 0.1V - 0.9V' },
  { id: 'ecu-pin-16', pinNumber: 16, label: 'FP_RELAY', name: 'Fuel Pump Relay Driver', category: 'actuator_out', nominalVoltage: 12.6, internalResistance: 0.2, description: 'Low-Side Ground Switched' },
];

export const DEFAULT_BENCH_COMPONENTS: BenchComponent[] = [
  {
    id: 'comp-tps',
    name: 'Throttle Position Sensor (TPS)',
    type: 'sensor',
    x: 480,
    y: 60,
    pins: [
      { id: 'tps-vcc', label: '5V VCC', type: 'power', relativeX: 0, relativeY: 46 },
      { id: 'tps-sig', label: 'WIPER SIG', type: 'output', relativeX: 0, relativeY: 78 },
      { id: 'tps-gnd', label: 'GND', type: 'ground', relativeX: 0, relativeY: 110 },
    ],
    state: { throttleAnglePercent: 20 },
  },
  {
    id: 'comp-map',
    name: 'Manifold Pressure (MAP)',
    type: 'sensor',
    x: 480,
    y: 220,
    pins: [
      { id: 'map-vcc', label: '5V VCC', type: 'power', relativeX: 0, relativeY: 46 },
      { id: 'map-sig', label: 'PRESSURE SIG', type: 'output', relativeX: 0, relativeY: 78 },
      { id: 'map-gnd', label: 'GND', type: 'ground', relativeX: 0, relativeY: 110 },
    ],
    state: { pressureKpa: 42 },
  },
  {
    id: 'comp-ect',
    name: 'Coolant Temp Sensor (ECT)',
    type: 'sensor',
    x: 480,
    y: 380,
    pins: [
      { id: 'ect-sig', label: 'THERMISTOR +', type: 'input', relativeX: 0, relativeY: 46 },
      { id: 'ect-gnd', label: 'GND RETURN', type: 'ground', relativeX: 0, relativeY: 78 },
    ],
    state: { tempCelsius: 85 },
  },
  {
    id: 'comp-inj',
    name: 'Cylinder 1 Fuel Injector',
    type: 'actuator',
    x: 770,
    y: 60,
    pins: [
      { id: 'inj-vbat', label: '+12V BATTERY', type: 'power', relativeX: 0, relativeY: 46 },
      { id: 'inj-ctrl', label: 'ECU SINK CTRL', type: 'input', relativeX: 0, relativeY: 78 },
    ],
    state: { coilResistanceOhms: 12.5, isFiring: true },
  },
  {
    id: 'comp-relay',
    name: 'Main System Relay (ISO)',
    type: 'relay',
    x: 770,
    y: 210,
    pins: [
      { id: 'relay-30', label: 'PIN 30 (+12V IN)', type: 'power', relativeX: 0, relativeY: 46 },
      { id: 'relay-87', label: 'PIN 87 (LOAD OUT)', type: 'output', relativeX: 0, relativeY: 78 },
      { id: 'relay-86', label: 'PIN 86 (COIL +)', type: 'power', relativeX: 0, relativeY: 110 },
      { id: 'relay-85', label: 'PIN 85 (COIL -)', type: 'input', relativeX: 0, relativeY: 142 },
    ],
    state: { isLatched: true, coilResistanceOhms: 85 },
  },
  {
    id: 'comp-can',
    name: 'CAN Bus Terminator (120Ω)',
    type: 'bus_node',
    x: 770,
    y: 400,
    pins: [
      { id: 'can-term-h', label: 'CAN-H TERMINAL', type: 'input', relativeX: 0, relativeY: 46 },
      { id: 'can-term-l', label: 'CAN-L TERMINAL', type: 'input', relativeX: 0, relativeY: 78 },
    ],
    state: { terminatingResistanceOhms: 120 },
  },
];

export const DEFAULT_WIRES: WireConnection[] = [
  { id: 'wire-1', sourcePinId: 'ecu-pin-5', targetPinId: 'tps-vcc', color: '#eab308', label: '5V VREF -> TPS VCC', isCut: false, resistance: 0.05 },
  { id: 'wire-2', sourcePinId: 'ecu-pin-7', targetPinId: 'tps-sig', color: '#22c55e', label: 'TPS SIG -> ECU Pin 7', isCut: false, resistance: 0.05 },
  { id: 'wire-3', sourcePinId: 'ecu-pin-6', targetPinId: 'tps-gnd', color: '#78716c', label: 'TPS GND -> ECU SGND', isCut: false, resistance: 0.05 },

  { id: 'wire-4', sourcePinId: 'ecu-pin-5', targetPinId: 'map-vcc', color: '#eab308', label: '5V VREF -> MAP VCC', isCut: false, resistance: 0.05 },
  { id: 'wire-5', sourcePinId: 'ecu-pin-8', targetPinId: 'map-sig', color: '#06b6d4', label: 'MAP SIG -> ECU Pin 8', isCut: false, resistance: 0.05 },
  { id: 'wire-6', sourcePinId: 'ecu-pin-6', targetPinId: 'map-gnd', color: '#78716c', label: 'MAP GND -> ECU SGND', isCut: false, resistance: 0.05 },

  { id: 'wire-7', sourcePinId: 'ecu-pin-9', targetPinId: 'ect-sig', color: '#f97316', label: 'ECT SIG -> ECU Pin 9', isCut: false, resistance: 0.05 },
  { id: 'wire-8', sourcePinId: 'ecu-pin-6', targetPinId: 'ect-gnd', color: '#78716c', label: 'ECT GND -> ECU SGND', isCut: false, resistance: 0.05 },

  { id: 'wire-9', sourcePinId: 'ecu-pin-10', targetPinId: 'inj-ctrl', color: '#3b82f6', label: 'ECU INJ1 -> Injector Sink', isCut: false, resistance: 0.05 },

  { id: 'wire-10', sourcePinId: 'ecu-pin-13', targetPinId: 'can-term-h', color: '#6366f1', label: 'CAN_H -> Bus Terminator', isCut: false, resistance: 0.05 },
  { id: 'wire-11', sourcePinId: 'ecu-pin-14', targetPinId: 'can-term-l', color: '#a855f7', label: 'CAN_L -> Bus Terminator', isCut: false, resistance: 0.05 },
];

export interface CircuitSolution {
  nodeVoltages: Record<string, number>;
  nodeResistances: Record<string, number>;
  wireCurrentsMa: Record<string, number>;
  supplyCurrentDrawAmps: number;
  isSupplyCurrentTripped: boolean;
  activeDTCs: DiagnosticTroubleCode[];
  multimeterReading: {
    display: string;
    value: number;
    unit: string;
    isOverLimit: boolean;
    isWarning: boolean;
    warningMessage?: string;
    shouldBeep: boolean;
  };
}

export function solveCircuit(
  powerSupply: PowerSupplyState,
  pins: EcuPin[],
  faults: InjectedFault[],
  wires: WireConnection[],
  components: BenchComponent[],
  multimeter: MultimeterState
): CircuitSolution {
  const nodeVoltages: Record<string, number> = {};
  const nodeResistances: Record<string, number> = {};
  const wireCurrentsMa: Record<string, number> = {};
  const dtcs: DiagnosticTroubleCode[] = [];

  const isPowerOn = powerSupply.isOutputEnabled && powerSupply.voltageSetting > 0.4;
  const vSupply = isPowerOn ? powerSupply.voltageSetting : 0.0;

  // Build connected node clusters
  const getConnectedPinIds = (startPinId: string): string[] => {
    const visited = new Set<string>([startPinId]);
    const queue = [startPinId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      wires.forEach(w => {
        if (!w.isCut) {
          if (w.sourcePinId === current && !visited.has(w.targetPinId)) {
            visited.add(w.targetPinId);
            queue.push(w.targetPinId);
          } else if (w.targetPinId === current && !visited.has(w.sourcePinId)) {
            visited.add(w.sourcePinId);
            queue.push(w.sourcePinId);
          }
        }
      });
    }
    return Array.from(visited);
  };

  // Reference rails
  nodeVoltages['chassis-gnd'] = 0.0;
  nodeVoltages['bench-vbat'] = vSupply;
  nodeVoltages['bench-gnd'] = 0.0;
  nodeResistances['chassis-gnd'] = 0.02;
  nodeResistances['bench-vbat'] = 0.05;
  nodeResistances['bench-gnd'] = 0.02;

  // Base ECU Pin Voltages
  pins.forEach(pin => {
    let baseV = 0.0;
    let baseR = 1000000;

    if (!isPowerOn) {
      baseV = 0.0;
      if (pin.category === 'ground') baseR = pin.internalResistance;
      else if (pin.category === 'power') baseR = 1200;
      else if (pin.id === 'ecu-pin-5') baseR = 4700;
      else if (pin.id === 'ecu-pin-9') baseR = 2200;
      else if (pin.id === 'ecu-pin-13' || pin.id === 'ecu-pin-14') baseR = 60;
      else baseR = 47000;
    } else {
      if (pin.category === 'ground') {
        baseV = 0.0;
        baseR = pin.internalResistance;
      } else if (pin.id === 'ecu-pin-3' || pin.id === 'ecu-pin-4') {
        baseV = vSupply;
        baseR = 1200;
      } else if (pin.id === 'ecu-pin-5') {
        baseV = vSupply >= 6.5 ? 5.0 : Math.max(0, vSupply - 1.2);
        baseR = 4700;
      } else if (pin.id === 'ecu-pin-6') {
        baseV = 0.01;
        baseR = 0.35;
      } else if (pin.id === 'ecu-pin-7') {
        const tpsComp = components.find(c => c.id === 'comp-tps');
        const angle = (tpsComp?.state?.throttleAnglePercent as number) ?? 20;
        baseV = 0.5 + (angle / 100) * 4.0;
        baseR = 2500;
      } else if (pin.id === 'ecu-pin-8') {
        const mapComp = components.find(c => c.id === 'comp-map');
        const kpa = (mapComp?.state?.pressureKpa as number) ?? 42;
        baseV = 0.8 + ((kpa - 20) / 80) * 3.7;
        baseR = 3200;
      } else if (pin.id === 'ecu-pin-9') {
        const ectComp = components.find(c => c.id === 'comp-ect');
        const temp = (ectComp?.state?.tempCelsius as number) ?? 85;
        const rNtc = Math.max(50, 2500 * Math.exp(-0.03 * (temp - 20)));
        baseV = (5.0 * rNtc) / (2200 + rNtc);
        baseR = (2200 * rNtc) / (2200 + rNtc);
      } else if (pin.id === 'ecu-pin-10') {
        baseV = vSupply;
        baseR = 12.5;
      } else if (pin.id === 'ecu-pin-13') {
        baseV = 2.5 + 0.95;
        baseR = 60;
      } else if (pin.id === 'ecu-pin-14') {
        baseV = 2.5 - 0.95;
        baseR = 60;
      } else if (pin.id === 'ecu-pin-15') {
        // Oxygen Sensor closed loop simulation: 0.45V nominal
        baseV = 0.45;
        baseR = 100000;
      } else {
        baseV = pin.nominalVoltage;
        baseR = 10000;
      }
    }

    nodeVoltages[pin.id] = baseV;
    nodeResistances[pin.id] = baseR;
  });

  // Propagate to components
  components.forEach(comp => {
    comp.pins.forEach(cp => {
      const connected = getConnectedPinIds(cp.id);
      let resolvedV = 0.0;
      let resolvedR = 1000000;

      for (const otherId of connected) {
        if (nodeVoltages[otherId] !== undefined) {
          resolvedV = nodeVoltages[otherId];
          resolvedR = nodeResistances[otherId] || 1000000;
          break;
        }
      }

      if (cp.id === 'inj-vbat' || cp.id === 'relay-30' || cp.id === 'relay-86') {
        resolvedV = vSupply;
        resolvedR = 0.1;
      }

      nodeVoltages[cp.id] = resolvedV;
      nodeResistances[cp.id] = resolvedR;
    });
  });

  // Calculate total supply current
  let totalCurrentDrawAmps = 0.0;
  if (isPowerOn) {
    totalCurrentDrawAmps = 0.19 + (vSupply / 12.6) * 0.08;
    // Injector load
    const injConnected = getConnectedPinIds('inj-ctrl');
    if (injConnected.includes('ecu-pin-10')) {
      totalCurrentDrawAmps += (vSupply / 12.5) * 0.18; // 180mA average PWM draw
    }
    // Relay coil load
    totalCurrentDrawAmps += vSupply / 85; // ~148mA
  }

  // Apply Injected Electrical Faults
  faults.forEach(fault => {
    const pin = pins.find(p => p.id === fault.pinId);
    if (!pin) return;

    const affected = getConnectedPinIds(pin.id);

    if (fault.faultType === 'OPEN_CIRCUIT') {
      affected.forEach(pId => {
        if (pId === pin.id) {
          if (pin.category === 'sensor_in') {
            nodeVoltages[pId] = 0.01;
            nodeResistances[pId] = 10000000;
          }
        }
      });

      if (pin.id === 'ecu-pin-5') {
        dtcs.push({
          code: 'P0641',
          system: 'Sensor Reference Voltage A',
          description: 'Sensor Reference Voltage "A" Circuit Open (5V Rail Dropped)',
          severity: 'CRITICAL',
          status: 'ACTIVE',
          associatedPinIds: [pin.id],
        });
      } else if (pin.id === 'ecu-pin-7') {
        dtcs.push({
          code: 'P0122',
          system: 'Throttle Position Sensor',
          description: 'TPS Circuit Low Input / Open Circuit Detected',
          severity: 'WARNING',
          status: 'ACTIVE',
          associatedPinIds: [pin.id],
        });
      } else if (pin.id === 'ecu-pin-10') {
        dtcs.push({
          code: 'P0201',
          system: 'Fuel Metering',
          description: 'Cylinder 1 Injector Circuit / Open',
          severity: 'CRITICAL',
          status: 'ACTIVE',
          associatedPinIds: [pin.id],
        });
      } else if (pin.id === 'ecu-pin-13' || pin.id === 'ecu-pin-14') {
        dtcs.push({
          code: 'U0001',
          system: 'CAN Communication Network',
          description: 'High Speed CAN Communication Bus Open Circuit',
          severity: 'CRITICAL',
          status: 'ACTIVE',
          associatedPinIds: [pin.id],
        });
      }
    } else if (fault.faultType === 'SHORT_TO_GND') {
      affected.forEach(pId => {
        nodeVoltages[pId] = 0.00;
        nodeResistances[pId] = 0.04;
      });

      if (pin.category === 'power' || pin.id === 'ecu-pin-3' || pin.id === 'ecu-pin-5') {
        totalCurrentDrawAmps += 7.8;
        dtcs.push({
          code: 'P0562',
          system: 'System Power Supply',
          description: 'System Voltage Low / Dead Short to Ground on Power Rail',
          severity: 'CRITICAL',
          status: 'ACTIVE',
          associatedPinIds: [pin.id],
        });
      } else if (pin.id === 'ecu-pin-7') {
        dtcs.push({
          code: 'P0122',
          system: 'Throttle Position Sensor',
          description: 'TPS Signal Shorted to Chassis Ground (0.00V detected)',
          severity: 'WARNING',
          status: 'ACTIVE',
          associatedPinIds: [pin.id],
        });
      } else if (pin.id === 'ecu-pin-8') {
        dtcs.push({
          code: 'P0107',
          system: 'Manifold Absolute Pressure',
          description: 'MAP Sensor Circuit Low Input (Shorted to Ground)',
          severity: 'WARNING',
          status: 'ACTIVE',
          associatedPinIds: [pin.id],
        });
      } else if (pin.id === 'ecu-pin-13' || pin.id === 'ecu-pin-14') {
        dtcs.push({
          code: 'U0001',
          system: 'CAN Network',
          description: 'High Speed CAN Bus Line Shorted to Chassis Ground',
          severity: 'CRITICAL',
          status: 'ACTIVE',
          associatedPinIds: [pin.id],
        });
      }
    } else if (fault.faultType === 'SHORT_TO_VBAT') {
      affected.forEach(pId => {
        nodeVoltages[pId] = vSupply;
        nodeResistances[pId] = 0.2;
      });

      if (pin.id === 'ecu-pin-7') {
        dtcs.push({
          code: 'P0123',
          system: 'Throttle Position Sensor',
          description: 'TPS Signal High Input (Shorted to Battery +12V)',
          severity: 'CRITICAL',
          status: 'ACTIVE',
          associatedPinIds: [pin.id],
        });
      } else if (pin.id === 'ecu-pin-5') {
        dtcs.push({
          code: 'P0653',
          system: 'Sensor Reference Voltage B',
          description: 'Sensor Reference Voltage Circuit High (+12V Overvoltage on 5V bus)',
          severity: 'CRITICAL',
          status: 'ACTIVE',
          associatedPinIds: [pin.id],
        });
      } else if (pin.id === 'ecu-pin-10') {
        dtcs.push({
          code: 'P0261',
          system: 'Injector Driver',
          description: 'Cylinder 1 Injector Circuit Shorted to Battery Rail',
          severity: 'CRITICAL',
          status: 'ACTIVE',
          associatedPinIds: [pin.id],
        });
      }
    } else if (fault.faultType.startsWith('HIGH_RESISTANCE')) {
      const addedR = fault.faultType === 'HIGH_RESISTANCE_50R' ? 50 : fault.faultType === 'HIGH_RESISTANCE_250R' ? 250 : 1000;
      affected.forEach(pId => {
        nodeResistances[pId] = (nodeResistances[pId] || 0) + addedR;
        if (pin.category === 'sensor_in') {
          nodeVoltages[pId] = (nodeVoltages[pId] || 1.0) * (addedR > 200 ? 0.42 : 0.84);
        } else if (pin.category === 'power') {
          nodeVoltages[pId] = Math.max(0, (nodeVoltages[pId] || 12.0) - (0.5 * addedR * 0.04));
        }
      });

      if (pin.id === 'ecu-pin-7') {
        dtcs.push({
          code: 'P0121',
          system: 'Throttle Position Sensor',
          description: `TPS Range/Performance Defect (+${addedR}Ω Harness Resistance)`,
          severity: 'WARNING',
          status: 'ACTIVE',
          associatedPinIds: [pin.id],
        });
      } else if (pin.id === 'ecu-pin-1') {
        dtcs.push({
          code: 'P0560',
          system: 'System Power & Ground',
          description: `Main Ground Pin Fretting Corrosion (+${addedR}Ω Resistance)`,
          severity: 'CRITICAL',
          status: 'ACTIVE',
          associatedPinIds: [pin.id],
        });
      }
    }
  });

  // Calculate live wire currents
  wires.forEach(w => {
    if (w.isCut) {
      wireCurrentsMa[w.id] = 0.0;
      return;
    }
    const v1 = nodeVoltages[w.sourcePinId] ?? 0.0;
    const v2 = nodeVoltages[w.targetPinId] ?? 0.0;
    const delta = Math.abs(v1 - v2);

    let cur = 0.0;
    if (w.id === 'wire-1' || w.id === 'wire-4') cur = 18.5; // 5V sensor draw
    else if (w.id === 'wire-2') cur = 1.2; // ADC signal current
    else if (w.id === 'wire-9') cur = isPowerOn ? 180.0 : 0.0; // Injector sink pulse
    else if (w.id === 'wire-10' || w.id === 'wire-11') cur = isPowerOn ? 25.0 : 0.0; // CAN termination current
    else cur = (delta / Math.max(1, w.resistance)) * 1000;

    wireCurrentsMa[w.id] = parseFloat(cur.toFixed(1));
  });

  // Handle cut wires DTCs
  wires.forEach(w => {
    if (w.isCut) {
      if (w.id === 'wire-2') {
        dtcs.push({
          code: 'P0122',
          system: 'Throttle Position Sensor',
          description: 'TPS Signal Wire Cut (Open Circuit)',
          severity: 'WARNING',
          status: 'ACTIVE',
          associatedPinIds: ['ecu-pin-7'],
        });
        nodeVoltages['ecu-pin-7'] = 0.01;
      } else if (w.id === 'wire-1') {
        dtcs.push({
          code: 'P0122',
          system: 'Sensor Power',
          description: 'TPS Sensor 5V Supply Wire Cut',
          severity: 'WARNING',
          status: 'ACTIVE',
          associatedPinIds: ['ecu-pin-5'],
        });
        nodeVoltages['tps-vcc'] = 0.0;
        nodeVoltages['tps-sig'] = 0.0;
        nodeVoltages['ecu-pin-7'] = 0.0;
      }
    }
  });

  // Current limit trip
  const isSupplyCurrentTripped = totalCurrentDrawAmps > powerSupply.currentLimit;
  if (isSupplyCurrentTripped) {
    totalCurrentDrawAmps = powerSupply.currentLimit;
    Object.keys(nodeVoltages).forEach(k => {
      if (nodeVoltages[k] > 0.5) nodeVoltages[k] *= 0.12;
    });
  }

  // Multimeter reading resolution
  const redPin = multimeter.redProbe.attachedToPinId;
  const blackPin = multimeter.blackProbe.attachedToPinId;

  let mmDisplay = '0.000';
  let mmValue = 0.0;
  let mmUnit = 'V DC';
  let isOverLimit = false;
  let isWarning = false;
  let warningMessage: string | undefined = undefined;
  let shouldBeep = false;

  const getVoltage = (id: string | null) => (id && nodeVoltages[id] !== undefined ? nodeVoltages[id] : 0.0);
  const getResistance = (id: string | null) => (id && nodeResistances[id] !== undefined ? nodeResistances[id] : 10000000);

  if (!redPin && !blackPin) {
    mmDisplay = '---.-';
    mmValue = 0;
    mmUnit = '';
  } else if (!redPin || !blackPin) {
    if (multimeter.mode === 'V_DC' || multimeter.mode === 'V_AC') {
      mmValue = 0.002;
      mmDisplay = '0.002';
      mmUnit = 'V';
      isWarning = true;
      warningMessage = 'Connect both Red (+) and Black (-) COM probes to take differential measurement.';
    } else {
      mmDisplay = 'O.L';
      mmValue = 9999999;
      mmUnit = 'Ω';
      isOverLimit = true;
    }
  } else {
    const vRed = getVoltage(redPin);
    const vBlack = getVoltage(blackPin);
    const deltaV = vRed - vBlack;

    if (multimeter.mode === 'V_DC') {
      mmValue = deltaV;
      mmUnit = 'V';
      mmDisplay = deltaV.toFixed(3);
    } else if (multimeter.mode === 'V_AC') {
      const isPwm = redPin.includes('inj') || redPin.includes('can');
      const ripple = isPwm ? 0.88 : isPowerOn ? 0.024 : 0.001;
      mmValue = ripple;
      mmUnit = 'V~';
      mmDisplay = ripple.toFixed(3);
    } else if (multimeter.mode === 'RESISTANCE') {
      if (isPowerOn && (vRed > 0.5 || vBlack > 0.5)) {
        isWarning = true;
        warningMessage = 'LIVE VOLTAGE DETECTED! Turn OFF power supply to measure resistance and protect meter fuse.';
        mmDisplay = 'ERR.V';
        mmValue = 0;
        mmUnit = 'Ω';
      } else {
        const r1 = getResistance(redPin);
        const r2 = getResistance(blackPin);
        let netR = 0.0;

        if (redPin === blackPin) {
          netR = 0.02;
        } else if ((redPin === 'ecu-pin-1' && blackPin === 'chassis-gnd') || (blackPin === 'ecu-pin-1' && redPin === 'chassis-gnd')) {
          netR = r1 + 0.02;
        } else if ((redPin === 'ecu-pin-13' && blackPin === 'ecu-pin-14') || (redPin === 'can-term-h' && blackPin === 'can-term-l')) {
          netR = 60.1;
        } else if (redPin.includes('inj') && blackPin.includes('inj')) {
          netR = 12.5;
        } else {
          netR = Math.abs(r1 - r2) + 0.12;
          if (netR > 500000) netR = 9999999;
        }

        mmValue = netR;
        if (netR >= 2000000) {
          mmDisplay = 'O.L';
          isOverLimit = true;
          mmUnit = 'MΩ';
        } else if (netR >= 1000) {
          mmDisplay = (netR / 1000).toFixed(2);
          mmUnit = 'kΩ';
        } else {
          mmDisplay = netR.toFixed(1);
          mmUnit = 'Ω';
        }
      }
    } else if (multimeter.mode === 'CONTINUITY') {
      if (isPowerOn && (vRed > 0.5 || vBlack > 0.5)) {
        isWarning = true;
        warningMessage = 'CIRCUIT ENERGIZED! Turn OFF power supply before continuity test.';
        mmDisplay = 'ERR.V';
      } else {
        const isDirect = redPin === blackPin || getConnectedPinIds(redPin).includes(blackPin);
        const netR = isDirect ? 0.04 : 9999999;
        mmValue = netR;
        if (netR < 30) {
          mmDisplay = netR.toFixed(1);
          mmUnit = 'Ω';
          shouldBeep = true;
        } else {
          mmDisplay = 'O.L';
          isOverLimit = true;
          mmUnit = 'Ω';
        }
      }
    } else if (multimeter.mode === 'FREQUENCY') {
      if (isPowerOn && (redPin.includes('inj') || redPin.includes('ign'))) {
        mmValue = 50.0;
        mmDisplay = '50.00';
        mmUnit = 'Hz';
      } else if (isPowerOn && (redPin.includes('can') || blackPin.includes('can'))) {
        mmValue = 500000;
        mmDisplay = '500.0';
        mmUnit = 'kHz';
      } else {
        mmValue = 0.0;
        mmDisplay = '0.00';
        mmUnit = 'Hz';
      }
    } else if (multimeter.mode === 'DIODE') {
      if (isPowerOn) {
        mmDisplay = 'ERR.V';
        isWarning = true;
        warningMessage = 'Turn OFF circuit power for diode voltage drop test.';
      } else {
        if (redPin.includes('vcc') || redPin.includes('5v') || redPin.includes('vbat')) {
          mmValue = 0.624;
          mmDisplay = '0.624';
          mmUnit = 'V';
        } else {
          mmDisplay = 'O.L';
          isOverLimit = true;
          mmUnit = 'V';
        }
      }
    }
  }

  return {
    nodeVoltages,
    nodeResistances,
    wireCurrentsMa,
    supplyCurrentDrawAmps: totalCurrentDrawAmps,
    isSupplyCurrentTripped,
    activeDTCs: dtcs,
    multimeterReading: {
      display: mmDisplay,
      value: mmValue,
      unit: mmUnit,
      isOverLimit,
      isWarning,
      warningMessage,
      shouldBeep,
    },
  };
}
