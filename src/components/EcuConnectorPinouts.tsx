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
  Car,
  Check,
} from 'lucide-react';

export interface BenchPinoutInfo {
  pinNumber: number;
  plug: string; // Plug chamber name e.g. 'PLUG_A_81PIN', 'PLUG_A_34PIN', etc.
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

export interface EcuBrandProfile {
  id: string;
  brandName: string;
  modelName: string;
  cavityInfo: string;
  popularVehiclesInPH: string;
  description: string;
  imageSrc: string;
  plugs: { id: string; label: string }[];
  essentialChecklist: { pin: string; role: string }[];
  pinouts: BenchPinoutInfo[];
}

export const ECU_BRAND_PROFILES: EcuBrandProfile[] = [
  // 1. Bosch ME7.5 (VAG Benchmark)
  {
    id: 'bosch-me75',
    brandName: 'Bosch Automotive',
    modelName: 'Bosch ME7.5 / ME7.1.1 (121-Pin)',
    cavityInfo: '121-Pin Dual Chamber (Plug A: 81-Pin / Plug B: 40-Pin)',
    popularVehiclesInPH: 'Volkswagen Polo/Golf, Audi A4/A6, VW Beetle 1.8T / 2.0L Petrol',
    description: 'Industry benchmark Bosch 16-bit ECU using C167 MCU. Common in European models and bench flashing training.',
    imageSrc: '/assets/images/ecu_connector_socket.jpg',
    plugs: [
      { id: 'ALL', label: 'All Plugs' },
      { id: 'PLUG_A_81PIN', label: 'Plug A (81-Pin)' },
      { id: 'PLUG_B_40PIN', label: 'Plug B (40-Pin)' },
    ],
    essentialChecklist: [
      { pin: 'Pin 1 & 2', role: 'Main Chassis Ground (KL31)' },
      { pin: 'Pin 3', role: '+12V Unswitched Permanent Memory (KL30)' },
      { pin: 'Pin 4', role: '+12V Switched Ignition Wake-up (KL15)' },
      { pin: 'Pin 43', role: 'K-Line Diagnostic (OBD-II Pin 7)' },
      { pin: 'Pin 58 / 62', role: 'CAN-H / CAN-L (120Ω Terminated)' },
      { pin: 'Pin 65', role: 'Boot Mode (1kΩ to GND for flashing)' },
    ],
    pinouts: [
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
        connectionInstruction: 'Connect to Bench Relay Coil 85 (or 100Ω pull-up to +12V)',
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
        connectionInstruction: 'Connect to Ground through 1kΩ or 100Ω resistor during power-up',
        electricalSpec: 'Active LOW on power-up to halt processor execution into internal bootloader',
        connectorCoords: { xPercent: 56.5, yPercent: 48.0 },
      },
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
        electricalSpec: 'Low-side MOSFET with 65V active clamp protection',
        associatedSimPinId: 'ecu-pin-10',
        connectorCoords: { xPercent: 69.5, yPercent: 48.0 },
      },
    ],
  },

  // 2. Toyota Denso 175822 / 275036 (Philippines' #1 Selling Vehicle ECU)
  {
    id: 'toyota-denso-175822',
    brandName: 'Toyota / Denso',
    modelName: 'Denso 175822 / 275036 (121-Pin Quad Plug)',
    cavityInfo: '121-Pin Quad Plug (Chamber A: 34P, B: 35P, C: 28P, D: 24P)',
    popularVehiclesInPH: 'Toyota Vios (1NZ-FE/2NZ-FE), Innova, Fortuner (1TR-FE/2TR-FE/2KD-FTV), Hilux 2005-2022',
    description: 'The most widely repaired ECU in the Philippines. Powers taxis, UV Express vans, private Vios sedans, and Hilux pickups.',
    imageSrc: '/assets/images/ecu_connector_socket.jpg',
    plugs: [
      { id: 'ALL', label: 'All Plugs' },
      { id: 'PLUG_A_34P', label: 'Plug A (34-Pin Power)' },
      { id: 'PLUG_B_35P', label: 'Plug B (35-Pin Sensor)' },
      { id: 'PLUG_C_28P', label: 'Plug C (28-Pin Driver)' },
    ],
    essentialChecklist: [
      { pin: 'Pin 1 (E1)', role: 'Engine Power Ground' },
      { pin: 'Pin 4 (+B / BAT)', role: 'Battery Permanent +12V Supply' },
      { pin: 'Pin 8 (IGSW)', role: 'Ignition Key Switch +12V Input' },
      { pin: 'Pin 12 (MREL)', role: 'Main EFI Relay Control Pull-Down' },
      { pin: 'Pin 16 (SIL)', role: 'K-Line / OBD-II Diagnostic Bus (Pin 7)' },
      { pin: 'Pin 22 & 23', role: 'CAN-H / CAN-L Powertrain Bus' },
    ],
    pinouts: [
      {
        pinNumber: 1,
        plug: 'PLUG_A_34P',
        label: 'E1',
        signalName: 'Main Chassis Ground Return',
        category: 'ground',
        nominalVoltage: 0.0,
        wireColor: 'Brown / Black (BN/BK)',
        colorHex: '#78350f',
        benchRole: 'Primary Engine Ground Return',
        connectionInstruction: 'Connect to Bench Power Supply (-) / Ground terminal',
        electricalSpec: '0.0V Solid Ground (Max 20A sink capability)',
        associatedSimPinId: 'ecu-pin-1',
        connectorCoords: { xPercent: 24.0, yPercent: 44.0 },
      },
      {
        pinNumber: 4,
        plug: 'PLUG_A_34P',
        label: '+B (BAT)',
        signalName: 'Permanent Battery Supply (+12V)',
        category: 'power',
        nominalVoltage: 12.6,
        wireColor: 'Red / Yellow (RD/YL)',
        colorHex: '#ef4444',
        benchRole: 'ECU SRAM & Memory Power',
        connectionInstruction: 'Connect to Bench Power Supply Positive (+12.6V constant)',
        electricalSpec: '+12.0V to +14.4V DC',
        associatedSimPinId: 'ecu-pin-3',
        connectorCoords: { xPercent: 28.0, yPercent: 44.0 },
      },
      {
        pinNumber: 8,
        plug: 'PLUG_A_34P',
        label: 'IGSW',
        signalName: 'Switched Ignition Power +12V',
        category: 'power',
        nominalVoltage: 12.6,
        wireColor: 'Black / Red (BK/RD)',
        colorHex: '#a855f7',
        benchRole: 'Ignition Switch Wake-up Trigger',
        connectionInstruction: 'Connect through Bench Toggle Switch to +12V',
        electricalSpec: '+12.6V Active, 0.0V Off',
        associatedSimPinId: 'ecu-pin-4',
        connectorCoords: { xPercent: 30.0, yPercent: 44.0 },
      },
      {
        pinNumber: 12,
        plug: 'PLUG_A_34P',
        label: 'MREL',
        signalName: 'Main EFI Relay Control Output',
        category: 'actuator_out',
        nominalVoltage: 12.6,
        wireColor: 'Blue / Black (BU/BK)',
        colorHex: '#3b82f6',
        benchRole: 'EFI Main Relay Coil Sink',
        connectionInstruction: 'Connect to Bench Relay Coil terminal (low-side sink when IGSW active)',
        electricalSpec: 'Low-side driver switch',
        associatedSimPinId: 'ecu-pin-12',
        connectorCoords: { xPercent: 33.0, yPercent: 48.0 },
      },
      {
        pinNumber: 16,
        plug: 'PLUG_A_34P',
        label: 'SIL',
        signalName: 'K-Line Diagnostic Bus (OBD-II Pin 7)',
        category: 'communication',
        nominalVoltage: 12.0,
        wireColor: 'Violet / White (VT/WH)',
        colorHex: '#10b981',
        benchRole: 'Techstream / OBD-II Scanner Diagnostics',
        connectionInstruction: 'Connect to OBD-II Diagnostic Connector Pin 7 (ISO 9141)',
        electricalSpec: '10.4 kbps UART bidirectional diagnostic line',
        associatedSimPinId: 'ecu-pin-16',
        connectorCoords: { xPercent: 41.0, yPercent: 48.0 },
      },
      {
        pinNumber: 22,
        plug: 'PLUG_A_34P',
        label: 'CANH',
        signalName: 'Toyota High-Speed CAN High',
        category: 'communication',
        nominalVoltage: 2.5,
        wireColor: 'Orange / Black (OG/BK)',
        colorHex: '#f97316',
        benchRole: 'Powertrain High-Speed CAN Bus (+)',
        connectionInstruction: 'Connect to OBD-II Pin 6 and 120Ω terminating resistor',
        electricalSpec: '2.5V Recessive, 3.5V Dominant (500 kbps)',
        associatedSimPinId: 'ecu-pin-13',
        connectorCoords: { xPercent: 51.5, yPercent: 44.5 },
      },
      {
        pinNumber: 23,
        plug: 'PLUG_A_34P',
        label: 'CANL',
        signalName: 'Toyota High-Speed CAN Low',
        category: 'communication',
        nominalVoltage: 2.5,
        wireColor: 'Orange / Brown (OG/BN)',
        colorHex: '#ea580c',
        benchRole: 'Powertrain High-Speed CAN Bus (-)',
        connectionInstruction: 'Connect to OBD-II Pin 14 and 120Ω terminating resistor',
        electricalSpec: '2.5V Recessive, 1.5V Dominant (500 kbps)',
        associatedSimPinId: 'ecu-pin-14',
        connectorCoords: { xPercent: 54.0, yPercent: 44.5 },
      },
      {
        pinNumber: 31,
        plug: 'PLUG_B_35P',
        label: 'VC',
        signalName: 'Regulated 5.00V Sensor Reference',
        category: 'power',
        nominalVoltage: 5.0,
        wireColor: 'Yellow / Red (YE/RD)',
        colorHex: '#eab308',
        benchRole: 'Precision 5.0V Sensor Rail',
        connectionInstruction: 'Supplies TPS and MAP Sensor VREF on bench',
        electricalSpec: '5.00V ± 0.05V (Max 100mA draw)',
        associatedSimPinId: 'ecu-pin-5',
        connectorCoords: { xPercent: 68.5, yPercent: 44.5 },
      },
      {
        pinNumber: 33,
        plug: 'PLUG_B_35P',
        label: 'E2',
        signalName: 'Sensor Clean Signal Ground',
        category: 'ground',
        nominalVoltage: 0.0,
        wireColor: 'Brown / Black (BN/BK)',
        colorHex: '#78716c',
        benchRole: 'Analog Sensor Dedicated Return',
        connectionInstruction: 'Connect to Sensor Low-Side Returns (Isolated from chassis noise)',
        electricalSpec: '0.0V Clean Sensor Return Plane',
        associatedSimPinId: 'ecu-pin-6',
        connectorCoords: { xPercent: 74.0, yPercent: 52.0 },
      },
      {
        pinNumber: 41,
        plug: 'PLUG_B_35P',
        label: 'VTA1',
        signalName: 'Throttle Position Sensor Track 1 (1NZ/1TR)',
        category: 'sensor_in',
        nominalVoltage: 0.7,
        wireColor: 'Green / White (GN/WH)',
        colorHex: '#22c55e',
        benchRole: 'Analog TPS Potentiometer Input',
        connectionInstruction: 'Connect to Bench TPS wiper (0.6V idle -> 4.2V WOT)',
        electricalSpec: '0.6V Idle, 4.2V WOT linear analog ADC',
        associatedSimPinId: 'ecu-pin-7',
        connectorCoords: { xPercent: 66.5, yPercent: 48.0 },
      },
      {
        pinNumber: 61,
        plug: 'PLUG_C_28P',
        label: '#10 (#1)',
        signalName: 'Cylinder 1 Fuel Injector Driver',
        category: 'actuator_out',
        nominalVoltage: 12.6,
        wireColor: 'Grey / Black (GY/BK)',
        colorHex: '#3b82f6',
        benchRole: 'Injector Solenoid Low-side Switch',
        connectionInstruction: 'Connect to Bench Injector Load Resistor (12Ω) to +12V',
        electricalSpec: 'Low-side N-channel MOSFET ground driver',
        associatedSimPinId: 'ecu-pin-10',
        connectorCoords: { xPercent: 69.5, yPercent: 48.0 },
      },
    ],
  },

  // 3. Mitsubishi Electric E6T (Montero Sport / Strada 4D56 / 4N15 Diesel)
  {
    id: 'mitsubishi-e6t',
    brandName: 'Mitsubishi Electric',
    modelName: 'Mitsubishi E6T / E6T7xx (3-Plug Diesel ECU)',
    cavityInfo: '3-Plug Chamber (Plug A: 26P, Plug B: 32P, Plug C: 35P)',
    popularVehiclesInPH: 'Mitsubishi Montero Sport, Strada/L200 (4D56 / 4N15 MIVEC), Lancer 4G18',
    description: 'Widely used in Mitsubishi midsize SUV & pickup models in PH. Requires precise 12V ignition wake-up and relay coil load.',
    imageSrc: '/assets/images/ecu_connector_socket.jpg',
    plugs: [
      { id: 'ALL', label: 'All Plugs' },
      { id: 'PLUG_A_26P', label: 'Plug A (Power & GND)' },
      { id: 'PLUG_B_32P', label: 'Plug B (Sensors)' },
      { id: 'PLUG_C_35P', label: 'Plug C (Injectors & Drivers)' },
    ],
    essentialChecklist: [
      { pin: 'Pin 1 & 2', role: 'Main Ground Return (GND)' },
      { pin: 'Pin 3 (VBAT)', role: 'Continuous Battery +12V Supply' },
      { pin: 'Pin 5 (IG_SW)', role: 'Ignition Key Switch Trigger (+12V)' },
      { pin: 'Pin 10 & 11', role: 'MUT-III Diagnostic CAN-H / CAN-L' },
      { pin: 'Pin 21', role: '5.00V Sensor Reference Output' },
    ],
    pinouts: [
      {
        pinNumber: 1,
        plug: 'PLUG_A_26P',
        label: 'GND_1',
        signalName: 'Main Power Ground 1',
        category: 'ground',
        nominalVoltage: 0.0,
        wireColor: 'Black (BK)',
        colorHex: '#78350f',
        benchRole: 'Primary Chassis Return',
        connectionInstruction: 'Connect to Bench Power Supply (-) Terminal',
        electricalSpec: '0.0V Power Ground Sink',
        associatedSimPinId: 'ecu-pin-1',
        connectorCoords: { xPercent: 24.5, yPercent: 44.5 },
      },
      {
        pinNumber: 3,
        plug: 'PLUG_A_26P',
        label: 'VBAT',
        signalName: 'Constant Battery Supply (+12V)',
        category: 'power',
        nominalVoltage: 12.6,
        wireColor: 'Red (RD)',
        colorHex: '#ef4444',
        benchRole: 'Continuous ECU Memory Power',
        connectionInstruction: 'Connect to Bench Power Supply Positive (+12.6V constant)',
        electricalSpec: '+12.6V DC Supply',
        associatedSimPinId: 'ecu-pin-3',
        connectorCoords: { xPercent: 28.0, yPercent: 44.5 },
      },
      {
        pinNumber: 5,
        plug: 'PLUG_A_26P',
        label: 'IG_SW',
        signalName: 'Switched Ignition Switch +12V',
        category: 'power',
        nominalVoltage: 12.6,
        wireColor: 'Black / White (BK/WH)',
        colorHex: '#a855f7',
        benchRole: 'Ignition Wake-up Trigger',
        connectionInstruction: 'Connect to Bench Toggle Switch from +12V',
        electricalSpec: '+12.6V Active Key-ON',
        associatedSimPinId: 'ecu-pin-4',
        connectorCoords: { xPercent: 30.0, yPercent: 44.5 },
      },
      {
        pinNumber: 10,
        plug: 'PLUG_A_26P',
        label: 'CAN_H',
        signalName: 'Powertrain High-Speed CAN High',
        category: 'communication',
        nominalVoltage: 2.5,
        wireColor: 'Orange (OG)',
        colorHex: '#f97316',
        benchRole: 'MUT-III & OBD-II Diagnostic CAN (+)',
        connectionInstruction: 'Connect to OBD-II Pin 6 and 120Ω terminating resistor',
        electricalSpec: '2.5V Recessive, 3.5V Dominant',
        associatedSimPinId: 'ecu-pin-13',
        connectorCoords: { xPercent: 51.5, yPercent: 44.5 },
      },
      {
        pinNumber: 11,
        plug: 'PLUG_A_26P',
        label: 'CAN_L',
        signalName: 'Powertrain High-Speed CAN Low',
        category: 'communication',
        nominalVoltage: 2.5,
        wireColor: 'Brown (BN)',
        colorHex: '#ea580c',
        benchRole: 'MUT-III & OBD-II Diagnostic CAN (-)',
        connectionInstruction: 'Connect to OBD-II Pin 14 and 120Ω terminating resistor',
        electricalSpec: '2.5V Recessive, 1.5V Dominant',
        associatedSimPinId: 'ecu-pin-14',
        connectorCoords: { xPercent: 54.0, yPercent: 44.5 },
      },
      {
        pinNumber: 21,
        plug: 'PLUG_B_32P',
        label: 'VREF',
        signalName: 'Regulated 5.00V Sensor Power',
        category: 'power',
        nominalVoltage: 5.0,
        wireColor: 'Violet (VT)',
        colorHex: '#eab308',
        benchRole: '5V Sensor Reference Voltage Rail',
        connectionInstruction: 'Feeds Bench Accelerator & Pressure Sensors',
        electricalSpec: '5.00V Regulated Supply',
        associatedSimPinId: 'ecu-pin-5',
        connectorCoords: { xPercent: 68.5, yPercent: 44.5 },
      },
    ],
  },

  // 4. Transtron Isuzu (D-Max / Mu-X 4JJ1-TCX 3.0L Diesel - PH Commercial Standard)
  {
    id: 'isuzu-transtron-4jj1',
    brandName: 'Isuzu / Transtron',
    modelName: 'Transtron 4JJ1 / 4JK1 Common Rail Diesel ECU',
    cavityInfo: '121-Pin Triple Heavy-Duty Chamber',
    popularVehiclesInPH: 'Isuzu D-Max, Mu-X, NHR/NKR Truck (4JJ1-TCX / 4JK1 2.5L & 3.0L Euro-4 Diesel)',
    description: 'The premier commercial diesel ECU in the Philippines. Controls common rail high-pressure fuel pumps and piezo injectors.',
    imageSrc: '/assets/images/ecu_connector_socket.jpg',
    plugs: [
      { id: 'ALL', label: 'All Plugs' },
      { id: 'PLUG_E_34P', label: 'Plug E (Engine & Power)' },
      { id: 'PLUG_C_35P', label: 'Plug C (Cab & Ignition)' },
      { id: 'PLUG_I_52P', label: 'Plug I (Injectors & High Voltage)' },
    ],
    essentialChecklist: [
      { pin: 'Pin E-01', role: 'Engine Power Ground' },
      { pin: 'Pin E-05', role: 'Constant Battery +12V' },
      { pin: 'Pin C-09', role: 'Switched Ignition Switch (+12V)' },
      { pin: 'Pin C-15 & C-16', role: 'Global Tech2 / G-Scan CAN High/Low' },
      { pin: 'Pin I-40', role: 'Common Rail High Voltage Injector Driver' },
    ],
    pinouts: [
      {
        pinNumber: 1,
        plug: 'PLUG_E_34P',
        label: 'GND_ENG',
        signalName: 'Heavy Duty Engine Ground Sink',
        category: 'ground',
        nominalVoltage: 0.0,
        wireColor: 'Brown / White (BN/WH)',
        colorHex: '#78350f',
        benchRole: 'High Current Ground Return',
        connectionInstruction: 'Connect to Bench Power Supply (-) Terminal',
        electricalSpec: '0.0V Ground Sink (Max 25A rating)',
        associatedSimPinId: 'ecu-pin-1',
        connectorCoords: { xPercent: 24.5, yPercent: 44.5 },
      },
      {
        pinNumber: 5,
        plug: 'PLUG_E_34P',
        label: 'BATT_12V',
        signalName: 'Permanent Battery Supply (+12V)',
        category: 'power',
        nominalVoltage: 12.6,
        wireColor: 'Red / Blue (RD/BU)',
        colorHex: '#ef4444',
        benchRole: 'ECU Memory & Injector Charge Capacitor Power',
        connectionInstruction: 'Connect to Bench Power Supply Positive (+12.6V constant)',
        electricalSpec: '+12.6V DC Main Power',
        associatedSimPinId: 'ecu-pin-3',
        connectorCoords: { xPercent: 28.0, yPercent: 44.5 },
      },
      {
        pinNumber: 9,
        plug: 'PLUG_C_35P',
        label: 'IGN_SW',
        signalName: 'Switched Ignition Power +12V',
        category: 'power',
        nominalVoltage: 12.6,
        wireColor: 'Black / Yellow (BK/YE)',
        colorHex: '#a855f7',
        benchRole: 'Ignition Key Switch Wake-up Input',
        connectionInstruction: 'Connect through Bench Toggle Switch from +12V',
        electricalSpec: '+12.6V Active Key-ON',
        associatedSimPinId: 'ecu-pin-4',
        connectorCoords: { xPercent: 30.0, yPercent: 44.5 },
      },
      {
        pinNumber: 15,
        plug: 'PLUG_C_35P',
        label: 'CAN_H',
        signalName: 'Isuzu Powertrain CAN High',
        category: 'communication',
        nominalVoltage: 2.5,
        wireColor: 'Orange (OG)',
        colorHex: '#f97316',
        benchRole: 'Tech2 / G-Scan / Diagnostic CAN (+)',
        connectionInstruction: 'Connect to OBD-II Diagnostic Pin 6 and 120Ω resistor',
        electricalSpec: '2.5V Recessive, 3.5V Dominant',
        associatedSimPinId: 'ecu-pin-13',
        connectorCoords: { xPercent: 51.5, yPercent: 44.5 },
      },
      {
        pinNumber: 16,
        plug: 'PLUG_C_35P',
        label: 'CAN_L',
        signalName: 'Isuzu Powertrain CAN Low',
        category: 'communication',
        nominalVoltage: 2.5,
        wireColor: 'Brown (BN)',
        colorHex: '#ea580c',
        benchRole: 'Tech2 / G-Scan / Diagnostic CAN (-)',
        connectionInstruction: 'Connect to OBD-II Diagnostic Pin 14 and 120Ω resistor',
        electricalSpec: '2.5V Recessive, 1.5V Dominant',
        associatedSimPinId: 'ecu-pin-14',
        connectorCoords: { xPercent: 54.0, yPercent: 44.5 },
      },
    ],
  },

  // 5. Keihin Honda PGM-FI (Civic / City / Jazz L13A / L15A / R18A - PH Compact Leader)
  {
    id: 'honda-keihin-pgmfi',
    brandName: 'Honda / Keihin',
    modelName: 'Keihin PGM-FI (3-Plug / 4-Plug ECU)',
    cavityInfo: 'Multi-Plug Compact Chamber (Plug A: 31P, Plug B: 24P, Plug C: 22P)',
    popularVehiclesInPH: 'Honda City, Civic, Jazz, CR-V (L13A / L15A / R18A / K20A Engine Families)',
    description: 'Standard Keihin PGM-FI ECU found across Honda vehicles in the PH market. Features dual VTEC and F-CAN bus communication.',
    imageSrc: '/assets/images/ecu_connector_socket.jpg',
    plugs: [
      { id: 'ALL', label: 'All Plugs' },
      { id: 'PLUG_A_31P', label: 'Plug A (Power/GND)' },
      { id: 'PLUG_B_24P', label: 'Plug B (Sensors)' },
      { id: 'PLUG_C_22P', label: 'Plug C (CAN/OBD)' },
    ],
    essentialChecklist: [
      { pin: 'Pin A-01 (PG1)', role: 'Power Ground Return' },
      { pin: 'Pin A-02 (IG1)', role: 'Ignition Key Switch +12V Input' },
      { pin: 'Pin A-03 (BACKUP)', role: 'Battery Permanent Memory +12V' },
      { pin: 'Pin C-10 & C-11', role: 'Honda HDS F-CAN High/Low Bus' },
      { pin: 'Pin B-20 (VCC1)', role: '5.00V Sensor Reference Supply' },
    ],
    pinouts: [
      {
        pinNumber: 1,
        plug: 'PLUG_A_31P',
        label: 'PG1',
        signalName: 'Main Power Ground 1',
        category: 'ground',
        nominalVoltage: 0.0,
        wireColor: 'Black (BLK)',
        colorHex: '#78350f',
        benchRole: 'Chassis Power Ground',
        connectionInstruction: 'Connect to Bench Power Supply (-) Terminal',
        electricalSpec: '0.0V Ground Return',
        associatedSimPinId: 'ecu-pin-1',
        connectorCoords: { xPercent: 24.5, yPercent: 44.5 },
      },
      {
        pinNumber: 2,
        plug: 'PLUG_A_31P',
        label: 'IG1',
        signalName: 'Switched Ignition Power +12V',
        category: 'power',
        nominalVoltage: 12.6,
        wireColor: 'Yellow / Black (YEL/BLK)',
        colorHex: '#a855f7',
        benchRole: 'Ignition Wake-up Input',
        connectionInstruction: 'Connect to Bench Toggle Switch from +12V',
        electricalSpec: '+12.6V Active Key-ON',
        associatedSimPinId: 'ecu-pin-4',
        connectorCoords: { xPercent: 30.0, yPercent: 44.5 },
      },
      {
        pinNumber: 3,
        plug: 'PLUG_A_31P',
        label: 'BACKUP',
        signalName: 'Permanent Battery Memory +12V',
        category: 'power',
        nominalVoltage: 12.6,
        wireColor: 'White / Red (WHT/RED)',
        colorHex: '#ef4444',
        benchRole: 'Continuous SRAM Power',
        connectionInstruction: 'Connect to Bench Power Supply Positive (+12.6V constant)',
        electricalSpec: '+12.6V DC Memory Supply',
        associatedSimPinId: 'ecu-pin-3',
        connectorCoords: { xPercent: 28.0, yPercent: 44.5 },
      },
      {
        pinNumber: 10,
        plug: 'PLUG_C_22P',
        label: 'F-CAN_H',
        signalName: 'Honda Fast CAN High',
        category: 'communication',
        nominalVoltage: 2.5,
        wireColor: 'Red (RED)',
        colorHex: '#f97316',
        benchRole: 'HDS Diagnostic & Instrument Cluster CAN (+)',
        connectionInstruction: 'Connect to OBD-II Diagnostic Pin 6 and 120Ω resistor',
        electricalSpec: '2.5V Recessive, 3.5V Dominant',
        associatedSimPinId: 'ecu-pin-13',
        connectorCoords: { xPercent: 51.5, yPercent: 44.5 },
      },
      {
        pinNumber: 11,
        plug: 'PLUG_C_22P',
        label: 'F-CAN_L',
        signalName: 'Honda Fast CAN Low',
        category: 'communication',
        nominalVoltage: 2.5,
        wireColor: 'White (WHT)',
        colorHex: '#ea580c',
        benchRole: 'HDS Diagnostic & Instrument Cluster CAN (-)',
        connectionInstruction: 'Connect to OBD-II Diagnostic Pin 14 and 120Ω resistor',
        electricalSpec: '2.5V Recessive, 1.5V Dominant',
        associatedSimPinId: 'ecu-pin-14',
        connectorCoords: { xPercent: 54.0, yPercent: 44.5 },
      },
    ],
  },

  // 6. Delphi MT20U / MT22U (Geely / Suzuki / Changan Popular Compact ECUs)
  {
    id: 'delphi-mt20u',
    brandName: 'Delphi Technologies',
    modelName: 'Delphi MT20U / MT22U / MT80',
    cavityInfo: '80-Pin Dual Chamber (Plug A: 40P, Plug B: 40P)',
    popularVehiclesInPH: 'Geely Coolray / Emgrand, Suzuki Jimny / Ertiga (K15B), Changan CS35, Chery Tiggo',
    description: 'Popular Delphi engine management system used across modern crossover and compact petrol models in PH.',
    imageSrc: '/assets/images/ecu_connector_socket.jpg',
    plugs: [
      { id: 'ALL', label: 'All Plugs' },
      { id: 'PLUG_A_40P', label: 'Plug A (Power/CAN)' },
      { id: 'PLUG_B_40P', label: 'Plug B (Sensors/Inj)' },
    ],
    essentialChecklist: [
      { pin: 'Pin 1 & 2', role: 'Main Ground (GND)' },
      { pin: 'Pin 3', role: 'Battery Permanent Supply (+12V)' },
      { pin: 'Pin 4', role: 'Ignition Key Switch (+12V)' },
      { pin: 'Pin 18 & 19', role: 'Diagnostic CAN High / Low' },
    ],
    pinouts: [
      {
        pinNumber: 1,
        plug: 'PLUG_A_40P',
        label: 'GND_1',
        signalName: 'Main Power Ground Return',
        category: 'ground',
        nominalVoltage: 0.0,
        wireColor: 'Black (BK)',
        colorHex: '#78350f',
        benchRole: 'Chassis Power Ground',
        connectionInstruction: 'Connect to Bench Power Supply (-) Terminal',
        electricalSpec: '0.0V Ground Return',
        associatedSimPinId: 'ecu-pin-1',
        connectorCoords: { xPercent: 24.5, yPercent: 44.5 },
      },
      {
        pinNumber: 3,
        plug: 'PLUG_A_40P',
        label: 'VBAT',
        signalName: 'Battery Permanent Supply (+12V)',
        category: 'power',
        nominalVoltage: 12.6,
        wireColor: 'Red (RD)',
        colorHex: '#ef4444',
        benchRole: 'ECU SRAM Power',
        connectionInstruction: 'Connect to Bench Power Supply Positive (+12.6V constant)',
        electricalSpec: '+12.6V DC Supply',
        associatedSimPinId: 'ecu-pin-3',
        connectorCoords: { xPercent: 28.0, yPercent: 44.5 },
      },
      {
        pinNumber: 4,
        plug: 'PLUG_A_40P',
        label: 'IGN',
        signalName: 'Switched Ignition Power +12V',
        category: 'power',
        nominalVoltage: 12.6,
        wireColor: 'Violet (VT)',
        colorHex: '#a855f7',
        benchRole: 'Ignition Switch Trigger',
        connectionInstruction: 'Connect to Bench Toggle Switch from +12V',
        electricalSpec: '+12.6V Active Key-ON',
        associatedSimPinId: 'ecu-pin-4',
        connectorCoords: { xPercent: 30.0, yPercent: 44.5 },
      },
      {
        pinNumber: 18,
        plug: 'PLUG_A_40P',
        label: 'CAN_H',
        signalName: 'Diagnostic CAN High',
        category: 'communication',
        nominalVoltage: 2.5,
        wireColor: 'Orange (OG)',
        colorHex: '#f97316',
        benchRole: 'OBD-II Diagnostic CAN (+)',
        connectionInstruction: 'Connect to OBD-II Pin 6 and 120Ω resistor',
        electricalSpec: '2.5V Recessive, 3.5V Dominant',
        associatedSimPinId: 'ecu-pin-13',
        connectorCoords: { xPercent: 51.5, yPercent: 44.5 },
      },
      {
        pinNumber: 19,
        plug: 'PLUG_A_40P',
        label: 'CAN_L',
        signalName: 'Diagnostic CAN Low',
        category: 'communication',
        nominalVoltage: 2.5,
        wireColor: 'Brown (BN)',
        colorHex: '#ea580c',
        benchRole: 'OBD-II Diagnostic CAN (-)',
        connectionInstruction: 'Connect to OBD-II Pin 14 and 120Ω resistor',
        electricalSpec: '2.5V Recessive, 1.5V Dominant',
        associatedSimPinId: 'ecu-pin-14',
        connectorCoords: { xPercent: 54.0, yPercent: 44.5 },
      },
    ],
  },
];

// Fallback constant for backwards compatibility
export const ECU_BENCH_PINOUTS = ECU_BRAND_PROFILES[0].pinouts;

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
  const [selectedBrandId, setSelectedBrandId] = useState<string>('toyota-denso-175822'); // Default Toyota Denso (PH #1)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlugFilter, setSelectedPlugFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [showOverlayMarkers, setShowOverlayMarkers] = useState(true);

  // Get current active brand profile
  const activeBrand = ECU_BRAND_PROFILES.find(b => b.id === selectedBrandId) || ECU_BRAND_PROFILES[0];
  const [activePinDetail, setActivePinDetail] = useState<BenchPinoutInfo>(activeBrand.pinouts[0]);

  // Handle brand profile change
  const handleBrandChange = (brandId: string) => {
    setSelectedBrandId(brandId);
    const newBrand = ECU_BRAND_PROFILES.find(b => b.id === brandId) || ECU_BRAND_PROFILES[0];
    setSelectedPlugFilter('ALL');
    setActivePinDetail(newBrand.pinouts[0]);
  };

  // Filtered pins list
  const filteredPins = activeBrand.pinouts.filter(p => {
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
    <div className="flex-1 flex flex-col gap-3 overflow-y-auto lg:overflow-hidden bg-slate-950 text-slate-100 p-2 font-mono select-none">
      
      {/* 1. ECU Brand Family Selector Header Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col gap-3 shadow-md shrink-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/file_0000000098d48211abb177ce752b7b0e_62980da7.png"
              alt="AutoElectric Lab Pro Official Logo"
              className="h-8 w-auto object-contain rounded border border-cyan-500/40 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-slate-100 tracking-wide uppercase">
                  {activeBrand.modelName}
                </h2>
                <span className="text-[10px] text-cyan-400 bg-cyan-950/70 border border-cyan-800 px-2 py-0.5 rounded font-semibold">
                  {activeBrand.cavityInfo}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                <strong className="text-amber-300">PH Popular Vehicles:</strong> {activeBrand.popularVehiclesInPH}
              </p>
            </div>
          </div>

          {/* ECU Brand Select Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">ECU BRAND:</span>
            <select
              value={selectedBrandId}
              onChange={e => handleBrandChange(e.target.value)}
              className="bg-slate-950 border-2 border-cyan-500/80 text-cyan-300 font-bold rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full md:w-72 shadow-md cursor-pointer"
            >
              {ECU_BRAND_PROFILES.map(brand => (
                <option key={brand.id} value={brand.id} className="bg-slate-950 text-slate-100 font-mono">
                  {brand.brandName} — {brand.modelName.split('(')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick ECU Brand Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {ECU_BRAND_PROFILES.map(brand => {
            const isSelected = brand.id === selectedBrandId;
            return (
              <button
                key={brand.id}
                onClick={() => handleBrandChange(brand.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-md ring-1 ring-cyan-300'
                    : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                <Car className="w-3 h-3" />
                <span>{brand.brandName.split('/')[0]}</span>
                {isSelected && <Check className="w-3 h-3 text-cyan-200" />}
              </button>
            );
          })}
        </div>

        {/* Search & Plug Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search pin #, label, signal..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
              />
            </div>

            {/* Dynamic Plug Chamber Filter */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {activeBrand.plugs.map(plug => (
                <button
                  key={plug.id}
                  onClick={() => setSelectedPlugFilter(plug.id)}
                  className={`px-2.5 py-1 rounded transition text-[10.5px] ${
                    selectedPlugFilter === plug.id ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {plug.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowOverlayMarkers(!showOverlayMarkers)}
            className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition ${
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

      {/* 2. Main Two-Column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 overflow-y-auto lg:overflow-hidden min-h-0">
        
        {/* Left Column: Actual ECU Image & Interactive Connector Face */}
        <div className="flex-1 flex flex-col gap-2 bg-slate-900 border border-slate-800 rounded-xl p-3 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">PHYSICAL CONNECTOR RECEPTACLE</span>
              <span className="text-slate-500 text-[10px]">· Face View ({activeBrand.brandName})</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>{activeBrand.cavityInfo.split('(')[0]}</span>
            </div>
          </div>

          {/* High-Resolution Photo Container with Pin Overlay */}
          <div className="relative h-64 sm:h-80 lg:flex-1 bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center group">
            <img
              src={activeBrand.imageSrc}
              alt={`${activeBrand.modelName} Connector Face Socket`}
              className="w-full h-full object-contain select-none"
            />

            {/* Interactive Pin Tracking Marker Overlay */}
            {showOverlayMarkers && (
              <div className="absolute inset-0 pointer-events-auto">
                {activeBrand.pinouts.map(pin => {
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
                  {activePinDetail.plug}
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
                  className="px-2.5 py-1 text-xs rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-300 font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Disc className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>Attach Red Probe (+)</span>
                </button>
                <button
                  onClick={() => {
                    const simId = activePinDetail.associatedSimPinId || `ecu-pin-${activePinDetail.pinNumber}`;
                    onAttachProbe('black', simId, `Pin ${activePinDetail.pinNumber} - ${activePinDetail.label}`);
                  }}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Disc className="w-3.5 h-3.5 text-slate-400 fill-slate-400" />
                  <span>Attach Black COM (-)</span>
                </button>
              </div>

              {activePinDetail.category === 'boot' && (
                <div className="text-[10px] text-amber-400 bg-amber-950/50 border border-amber-800/80 px-2 py-1 rounded flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Boot Mode Pin: Requires 1kΩ pull-down to GND</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Complete Bench Pinout Table with Tracking Numbers */}
        <div className="w-full lg:w-[480px] flex flex-col gap-2 bg-slate-900 border border-slate-800 rounded-xl p-3 overflow-hidden shadow-inner shrink-0">
          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">BENCH PINOUT DIRECTORY</span>
              <span className="text-slate-500 text-[10px]">({filteredPins.length} Pins Tracked)</span>
            </div>
            {/* Category Quick Filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-[10px] text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="power">Power Supplies (+12V / 5V)</option>
              <option value="ground">Grounds (Chassis / Sensor Return)</option>
              <option value="communication">CAN & Diagnostic Comms</option>
              <option value="sensor_in">Analog Sensor Inputs</option>
              <option value="actuator_out">Actuators & Injector Drivers</option>
              <option value="boot">Boot Mode Recovery</option>
            </select>
          </div>

          {/* Essential Bench Test Checklist Card for Active Brand */}
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-cyan-400 font-bold text-[10px]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                MINIMUM BENCH FLASH & TEST WIRING ({activeBrand.brandName}):
              </span>
              <span className="text-slate-400 font-normal">{activeBrand.essentialChecklist.length} Essential Wires</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-300">
              {activeBrand.essentialChecklist.map((item, idx) => (
                <div key={idx}>
                  • <strong>{item.pin}</strong>: {item.role}
                </div>
              ))}
            </div>
          </div>

          {/* Pinout List Table */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 max-h-[440px] lg:max-h-none">
            {filteredPins.map(pin => {
              const isSelected = activePinDetail.pinNumber === pin.pinNumber;
              const isRedProbe = multimeter.redProbe.attachedToPinId === pin.associatedSimPinId;
              const isBlackProbe = multimeter.blackProbe.attachedToPinId === pin.associatedSimPinId;
              const v = getSimulatedVoltage(pin);

              return (
                <div
                  key={`${pin.plug}-${pin.pinNumber}`}
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
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: pin.colorHex }}
                      />
                      <span className="truncate">{pin.wireColor}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 truncate max-w-[180px] sm:max-w-[240px]">{pin.benchRole}</span>
                    </div>
                    <span className="text-slate-500 font-mono shrink-0 ml-1">
                      {pin.plug}
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
