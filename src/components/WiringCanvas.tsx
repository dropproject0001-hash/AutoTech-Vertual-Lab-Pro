import React, { useState } from 'react';
import { EcuPin, WireConnection, BenchComponent, MultimeterState } from '../types/ecu';
import {
  Scissors,
  Wrench,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Link2,
  Disc,
  Sliders,
  Trash2,
  Activity,
  Flame,
  Check,
  X,
} from 'lucide-react';

interface WiringCanvasProps {
  pins: EcuPin[];
  wires: WireConnection[];
  components: BenchComponent[];
  nodeVoltages: Record<string, number>;
  selectedPinId: string | null;
  onSelectPin: (pinId: string) => void;
  onAddWire: (sourcePinId: string, targetPinId: string) => void;
  onToggleCutWire: (wireId: string) => void;
  onDeleteWire: (wireId: string) => void;
  multimeter: MultimeterState;
  onAttachProbe: (color: 'red' | 'black', pinId: string, label: string) => void;
  onUpdateComponentState: (compId: string, updates: Record<string, number | boolean | string>) => void;
  isPowerOn: boolean;
}

export const WiringCanvas: React.FC<WiringCanvasProps> = ({
  pins,
  wires,
  components,
  nodeVoltages,
  selectedPinId,
  onSelectPin,
  onAddWire,
  onToggleCutWire,
  onDeleteWire,
  multimeter,
  onAttachProbe,
  onUpdateComponentState,
  isPowerOn,
}) => {
  const [wireSourcePin, setWireSourcePin] = useState<{ id: string; label: string } | null>(null);
  const [hoveredWireId, setHoveredWireId] = useState<string | null>(null);
  const [activePinMenuId, setActivePinMenuId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // Exact Layout Constants for 100% Mathematical Terminal Alignment
  const ECU_BOX_X = 24;
  const ECU_BOX_Y = 24;
  const ECU_BOX_WIDTH = 236;
  const ECU_HEADER_HEIGHT = 40;
  const ECU_ROW_HEIGHT = 36; // 32px height + 4px gap

  const COMP_WIDTH = 230;
  const COMP_HEADER_HEIGHT = 38;
  const COMP_ROW_HEIGHT = 34; // 30px height + 4px gap

  // Mathematical Coordinate Calculator
  const getPinCoords = (pinId: string): { x: number; y: number } => {
    // 1. ECU Pins
    const ecuIndex = pins.findIndex(p => p.id === pinId);
    if (ecuIndex !== -1) {
      return {
        x: ECU_BOX_X + ECU_BOX_WIDTH,
        y: ECU_BOX_Y + ECU_HEADER_HEIGHT + ecuIndex * ECU_ROW_HEIGHT + 16,
      };
    }

    // 2. Component Pins
    for (const comp of components) {
      const pinIndex = comp.pins.findIndex(p => p.id === pinId);
      if (pinIndex !== -1) {
        return {
          x: comp.x,
          y: comp.y + COMP_HEADER_HEIGHT + pinIndex * COMP_ROW_HEIGHT + 15,
        };
      }
    }

    if (pinId === 'chassis-gnd') return { x: ECU_BOX_X + ECU_BOX_WIDTH, y: 640 };
    if (pinId === 'bench-vbat') return { x: ECU_BOX_X + ECU_BOX_WIDTH, y: 15 };

    return { x: 200, y: 200 };
  };

  const handlePinAction = (pinId: string, label: string) => {
    onSelectPin(pinId);
    setActivePinMenuId(activePinMenuId === pinId ? null : pinId);

    if (wireSourcePin) {
      if (wireSourcePin.id !== pinId) {
        onAddWire(wireSourcePin.id, pinId);
      }
      setWireSourcePin(null);
      setActivePinMenuId(null);
    }
  };

  // Get coordinates for probes
  const redCoords = multimeter.redProbe.attachedToPinId
    ? getPinCoords(multimeter.redProbe.attachedToPinId)
    : null;
  const blackCoords = multimeter.blackProbe.attachedToPinId
    ? getPinCoords(multimeter.blackProbe.attachedToPinId)
    : null;

  return (
    <div className="relative flex-1 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col select-none shadow-inner">
      {/* Canvas Top Status HUD */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-3 bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 shadow">
        <div className="flex items-center gap-1.5 font-semibold text-cyan-400">
          <Activity className="w-3.5 h-3.5" />
          <span>HARNESS SCHEMATIC ENGINE</span>
        </div>
        <span className="text-slate-700">|</span>
        {wireSourcePin ? (
          <div className="flex items-center gap-2 text-amber-400 animate-pulse font-medium">
            <Link2 className="w-3.5 h-3.5" />
            <span>Connect &ldquo;{wireSourcePin.label}&rdquo; &rarr; Click target terminal</span>
            <button
              onClick={() => setWireSourcePin(null)}
              className="text-[10px] text-slate-400 hover:text-white underline ml-1"
            >
              Cancel
            </button>
          </div>
        ) : (
          <span className="text-slate-400 text-[11px]">
            Click any pin jack to route wires or attach multimeter probes
          </span>
        )}
      </div>

      {/* Zoom / Reset HUD */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-slate-900/90 backdrop-blur border border-slate-800 p-1 rounded-lg text-slate-300 shadow">
        <button
          onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11px] font-mono px-1.5 text-slate-400 tabular-nums">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoomLevel(1.0)}
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
          title="Reset View 100%"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        <div
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
          className="relative transition-transform duration-100 min-w-[1060px] min-h-[690px]"
        >
          {/* SVG Connection Layer */}
          <svg className="w-[1060px] h-[690px] block pointer-events-auto">
            {/* Engineering Grid */}
            <defs>
              <pattern id="benchCanvasGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#1e293b" />
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#0f172a" strokeWidth="0.5" />
              </pattern>

              <filter id="wireGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="100%" height="100%" fill="url(#benchCanvasGrid)" />

            {/* Automotive Wires */}
            {wires.map(wire => {
              const start = getPinCoords(wire.sourcePinId);
              const end = getPinCoords(wire.targetPinId);
              const dx = end.x - start.x;
              const ctrl1X = start.x + dx * 0.45;
              const ctrl2X = end.x - dx * 0.45;
              const pathD = `M ${start.x} ${start.y} C ${ctrl1X} ${start.y}, ${ctrl2X} ${end.y}, ${end.x} ${end.y}`;

              const isHovered = hoveredWireId === wire.id;
              const midX = (start.x + end.x) / 2;
              const midY = (start.y + end.y) / 2;

              return (
                <g
                  key={wire.id}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredWireId(wire.id)}
                  onMouseLeave={() => setHoveredWireId(null)}
                >
                  {/* Broad invisible hit area for easy clicking */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="16"
                    onClick={() => onToggleCutWire(wire.id)}
                  />

                  {/* Wire Outer Jacket */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={wire.isCut ? '#475569' : wire.color}
                    strokeWidth={isHovered ? '4.5' : '3'}
                    strokeDasharray={wire.isCut ? '6,6' : undefined}
                    opacity={wire.isCut ? 0.35 : 0.9}
                    filter={isHovered && !wire.isCut ? 'url(#wireGlow)' : undefined}
                    className="transition-all"
                  />

                  {/* Animated electron current flow (when powered & continuous) */}
                  {isPowerOn && !wire.isCut && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeDasharray="4,18"
                      strokeDashoffset="0"
                      className="animate-pulse"
                      opacity="0.75"
                    />
                  )}

                  {/* Terminal Connection Beads */}
                  <circle cx={start.x} cy={start.y} r="3.5" fill={wire.isCut ? '#475569' : wire.color} />
                  <circle cx={end.x} cy={end.y} r="3.5" fill={wire.isCut ? '#475569' : wire.color} />

                  {/* Cut Wire Badge */}
                  {wire.isCut && (
                    <g transform={`translate(${midX}, ${midY})`}>
                      <circle r="11" fill="#dc2626" />
                      <Scissors className="w-3.5 h-3.5 text-white -translate-x-[7px] -translate-y-[7px]" />
                    </g>
                  )}

                  {/* Wire Interactive Hover Tooltip */}
                  {isHovered && (
                    <g transform={`translate(${midX}, ${midY - 22})`} className="pointer-events-none">
                      <rect
                        x="-80"
                        y="-14"
                        width="160"
                        height="28"
                        rx="5"
                        fill="#020617"
                        stroke="#06b6d4"
                        strokeWidth="1.5"
                        className="shadow-xl"
                      />
                      <text
                        x="0"
                        y="4"
                        fill="#e2e8f0"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {wire.isCut ? 'Click to Repair Harness Wire' : 'Click to Cut Wire'}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Virtual Multimeter Red Probe Cable Lead */}
            {redCoords && (
              <g className="pointer-events-none">
                <path
                  d={`M 15 20 C 15 ${redCoords.y - 40}, ${redCoords.x - 60} ${redCoords.y}, ${redCoords.x} ${redCoords.y}`}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <circle cx={redCoords.x} cy={redCoords.y} r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                <circle cx={redCoords.x} cy={redCoords.y} r="2" fill="#ffffff" />
                {/* Needle Probe Tip Graphic */}
                <g transform={`translate(${redCoords.x}, ${redCoords.y})`}>
                  <line x1="-16" y1="-8" x2="0" y2="0" stroke="#f87171" strokeWidth="3" />
                  <text x="10" y="-8" fill="#f87171" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    [+] RED DMM
                  </text>
                </g>
              </g>
            )}

            {/* Virtual Multimeter Black Probe Cable Lead */}
            {blackCoords && (
              <g className="pointer-events-none">
                <path
                  d={`M 15 670 C 15 ${blackCoords.y + 40}, ${blackCoords.x - 60} ${blackCoords.y}, ${blackCoords.x} ${blackCoords.y}`}
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <circle cx={blackCoords.x} cy={blackCoords.y} r="6" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
                <circle cx={blackCoords.x} cy={blackCoords.y} r="2" fill="#ffffff" />
                <g transform={`translate(${blackCoords.x}, ${blackCoords.y})`}>
                  <line x1="-16" y1="8" x2="0" y2="0" stroke="#94a3b8" strokeWidth="3" />
                  <text x="10" y="14" fill="#cbd5e1" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    [-] COM DMM
                  </text>
                </g>
              </g>
            )}
          </svg>

          {/* HTML Overlay 1: ECU Module & Breakout Headers */}
          <div
            style={{
              position: 'absolute',
              top: `${ECU_BOX_Y}px`,
              left: `${ECU_BOX_X}px`,
              width: `${ECU_BOX_WIDTH}px`,
            }}
            className="bg-slate-900 border-2 border-slate-700 rounded-xl p-3 shadow-2xl"
          >
            {/* Header */}
            <div className="h-[36px] flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-100">ECU BREAKOUT</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">ME7.5 1.8T</span>
            </div>

            {/* Pin Rows */}
            <div className="flex flex-col gap-1">
              {pins.map(pin => {
                const isSelected = selectedPinId === pin.id;
                const isWireSource = wireSourcePin?.id === pin.id;
                const isMenuOpen = activePinMenuId === pin.id;
                const v = nodeVoltages[pin.id] !== undefined ? nodeVoltages[pin.id] : pin.nominalVoltage;

                const isRedProbe = multimeter.redProbe.attachedToPinId === pin.id;
                const isBlackProbe = multimeter.blackProbe.attachedToPinId === pin.id;

                let categoryBg = 'bg-slate-950/80 border-slate-800 text-slate-300';
                if (pin.category === 'ground') categoryBg = 'border-stone-700 text-stone-300 bg-stone-950/60';
                if (pin.category === 'power') categoryBg = 'border-amber-800 text-amber-300 bg-amber-950/40';
                if (pin.category === 'reference') categoryBg = 'border-yellow-700 text-yellow-300 bg-yellow-950/40';
                if (pin.category === 'communication') categoryBg = 'border-indigo-800 text-indigo-300 bg-indigo-950/40';

                return (
                  <div key={pin.id} className="relative h-[32px]">
                    <div
                      onClick={() => handlePinAction(pin.id, pin.label)}
                      className={`h-full flex items-center justify-between px-2.5 rounded-md border text-[11px] font-mono cursor-pointer transition ${categoryBg} ${
                        isSelected ? 'ring-2 ring-cyan-400 border-cyan-400 font-bold' : 'hover:border-slate-600'
                      } ${isWireSource ? 'ring-2 ring-amber-400 animate-pulse' : ''}`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] text-slate-500 font-mono w-4">{pin.pinNumber}</span>
                        <span className="font-semibold">{pin.label}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] tabular-nums text-slate-400">{v.toFixed(1)}V</span>
                        {/* Terminal Jack Circle */}
                        <div
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition ${
                            isWireSource
                              ? 'bg-amber-400 border-white'
                              : 'bg-slate-800 border-slate-600 group-hover:border-cyan-400'
                          }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                        </div>
                      </div>

                      {/* Lead Probe Indicators */}
                      {(isRedProbe || isBlackProbe) && (
                        <div className="absolute -left-3 flex flex-col gap-0.5">
                          {isRedProbe && <div className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />}
                          {isBlackProbe && <div className="w-2.5 h-2.5 rounded-full bg-slate-300 ring-2 ring-black" />}
                        </div>
                      )}
                    </div>

                    {/* Contextual Pin Menu Popover */}
                    {isMenuOpen && (
                      <div className="absolute left-[242px] top-0 z-30 w-44 bg-slate-900 border border-slate-700 rounded-lg p-1.5 shadow-2xl flex flex-col gap-1 text-[10px] font-mono">
                        <button
                          onClick={() => {
                            onAttachProbe('red', pin.id, `${pin.label} (${pin.name})`);
                            setActivePinMenuId(null);
                          }}
                          className="px-2 py-1 text-left text-rose-300 hover:bg-rose-950/60 rounded flex items-center gap-1.5"
                        >
                          <Disc className="w-3 h-3 text-rose-400" />
                          <span>Attach Red Probe (+)</span>
                        </button>
                        <button
                          onClick={() => {
                            onAttachProbe('black', pin.id, `${pin.label} (${pin.name})`);
                            setActivePinMenuId(null);
                          }}
                          className="px-2 py-1 text-left text-slate-300 hover:bg-slate-800 rounded flex items-center gap-1.5"
                        >
                          <Disc className="w-3 h-3 text-slate-400" />
                          <span>Attach Black COM (-)</span>
                        </button>
                        <button
                          onClick={() => {
                            setWireSourcePin({ id: pin.id, label: pin.label });
                            setActivePinMenuId(null);
                          }}
                          className="px-2 py-1 text-left text-cyan-300 hover:bg-cyan-950/60 rounded flex items-center gap-1.5"
                        >
                          <Link2 className="w-3 h-3 text-cyan-400" />
                          <span>Route Wire From Here</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* HTML Overlay 2: Bench Components */}
          {components.map(comp => (
            <div
              key={comp.id}
              style={{
                position: 'absolute',
                left: `${comp.x}px`,
                top: `${comp.y}px`,
                width: `${COMP_WIDTH}px`,
              }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-xl"
            >
              {/* Component Card Header */}
              <div className="h-[34px] flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                <span className="text-xs font-mono font-semibold text-slate-200">{comp.name}</span>
                <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider">{comp.type}</span>
              </div>

              {/* Component Pin Terminal Rows */}
              <div className="flex flex-col gap-1 mb-2">
                {comp.pins.map(cp => {
                  const isSelected = selectedPinId === cp.id;
                  const isWireSource = wireSourcePin?.id === cp.id;
                  const isMenuOpen = activePinMenuId === cp.id;
                  const v = nodeVoltages[cp.id] !== undefined ? nodeVoltages[cp.id] : 0.0;
                  const isRedProbe = multimeter.redProbe.attachedToPinId === cp.id;
                  const isBlackProbe = multimeter.blackProbe.attachedToPinId === cp.id;

                  return (
                    <div key={cp.id} className="relative h-[30px]">
                      <div
                        onClick={() => handlePinAction(cp.id, `${comp.name}: ${cp.label}`)}
                        className={`h-full flex items-center justify-between px-2 rounded border text-[10px] font-mono cursor-pointer transition bg-slate-950 ${
                          isSelected ? 'ring-1 ring-cyan-400 border-cyan-400 text-white' : 'border-slate-800 text-slate-300 hover:border-slate-700'
                        } ${isWireSource ? 'ring-1 ring-amber-400 animate-pulse' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          {/* Left Terminal Jack */}
                          <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition ${
                              isWireSource ? 'bg-amber-400 border-white' : 'bg-slate-800 border-slate-600'
                            }`}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                          </div>
                          <span>{cp.label}</span>
                        </div>
                        <span className="text-slate-400 tabular-nums">{v.toFixed(2)}V</span>

                        {(isRedProbe || isBlackProbe) && (
                          <div className="absolute -left-2.5 flex flex-col gap-0.5">
                            {isRedProbe && <div className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-1 ring-white" />}
                            {isBlackProbe && <div className="w-2.5 h-2.5 rounded-full bg-slate-300 ring-1 ring-black" />}
                          </div>
                        )}
                      </div>

                      {/* Component Contextual Menu */}
                      {isMenuOpen && (
                        <div className="absolute left-[236px] top-0 z-30 w-44 bg-slate-900 border border-slate-700 rounded-lg p-1.5 shadow-2xl flex flex-col gap-1 text-[10px] font-mono">
                          <button
                            onClick={() => {
                              onAttachProbe('red', cp.id, `${comp.name}: ${cp.label}`);
                              setActivePinMenuId(null);
                            }}
                            className="px-2 py-1 text-left text-rose-300 hover:bg-rose-950/60 rounded flex items-center gap-1.5"
                          >
                            <Disc className="w-3 h-3 text-rose-400" />
                            <span>Attach Red Probe (+)</span>
                          </button>
                          <button
                            onClick={() => {
                              onAttachProbe('black', cp.id, `${comp.name}: ${cp.label}`);
                              setActivePinMenuId(null);
                            }}
                            className="px-2 py-1 text-left text-slate-300 hover:bg-slate-800 rounded flex items-center gap-1.5"
                          >
                            <Disc className="w-3 h-3 text-slate-400" />
                            <span>Attach Black COM (-)</span>
                          </button>
                          <button
                            onClick={() => {
                              setWireSourcePin({ id: cp.id, label: `${comp.name}: ${cp.label}` });
                              setActivePinMenuId(null);
                            }}
                            className="px-2 py-1 text-left text-cyan-300 hover:bg-cyan-950/60 rounded flex items-center gap-1.5"
                          >
                            <Link2 className="w-3 h-3 text-cyan-400" />
                            <span>Route Wire From Here</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Live Physical Component Controls */}
              {comp.id === 'comp-tps' && (
                <div className="bg-slate-950 p-2 rounded-md border border-slate-800 text-[10px] font-mono flex flex-col gap-1.5 mt-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>THROTTLE ANGLE:</span>
                    <span className="text-amber-400 font-bold tabular-nums">
                      {comp.state?.throttleAnglePercent ?? 20}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(comp.state?.throttleAnglePercent as number) ?? 20}
                    onChange={e => onUpdateComponentState(comp.id, { throttleAnglePercent: parseInt(e.target.value) })}
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                  />
                  <div className="text-[9px] text-slate-500 flex justify-between">
                    <span>Closed (0.5V)</span>
                    <span>WOT (4.5V)</span>
                  </div>
                </div>
              )}

              {comp.id === 'comp-map' && (
                <div className="bg-slate-950 p-2 rounded-md border border-slate-800 text-[10px] font-mono flex flex-col gap-1.5 mt-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>MANIFOLD PRESSURE:</span>
                    <span className="text-cyan-400 font-bold tabular-nums">
                      {comp.state?.pressureKpa ?? 42} kPa
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={(comp.state?.pressureKpa as number) ?? 42}
                    onChange={e => onUpdateComponentState(comp.id, { pressureKpa: parseInt(e.target.value) })}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                  />
                  <div className="text-[9px] text-slate-500 flex justify-between">
                    <span>Idle Vac (20 kPa)</span>
                    <span>Atmo (100 kPa)</span>
                  </div>
                </div>
              )}

              {comp.id === 'comp-ect' && (
                <div className="bg-slate-950 p-2 rounded-md border border-slate-800 text-[10px] font-mono flex flex-col gap-1.5 mt-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>COOLANT TEMP:</span>
                    <span className="text-orange-400 font-bold tabular-nums">
                      {comp.state?.tempCelsius ?? 85}°C
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="115"
                    value={(comp.state?.tempCelsius as number) ?? 85}
                    onChange={e => onUpdateComponentState(comp.id, { tempCelsius: parseInt(e.target.value) })}
                    className="w-full accent-orange-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                  />
                  <div className="text-[9px] text-slate-500 flex justify-between">
                    <span>Cold (10°C / 2.5kΩ)</span>
                    <span>Hot (90°C / 250Ω)</span>
                  </div>
                </div>
              )}

              {comp.id === 'comp-inj' && (
                <div className="bg-slate-950 p-2 rounded-md border border-slate-800 text-[10px] font-mono flex items-center justify-between mt-1">
                  <span className="text-slate-400">PULSE:</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    PULSING 2.5ms
                  </span>
                </div>
              )}

              {comp.id === 'comp-relay' && (
                <div className="bg-slate-950 p-2 rounded-md border border-slate-800 text-[10px] font-mono flex items-center justify-between mt-1">
                  <span className="text-slate-400">CONTACTS:</span>
                  <span className="text-emerald-400 font-semibold">LATCHED 30&rarr;87</span>
                </div>
              )}

              {comp.id === 'comp-can' && (
                <div className="bg-slate-950 p-2 rounded-md border border-slate-800 text-[10px] font-mono flex items-center justify-between text-slate-400 mt-1">
                  <span>RESISTOR:</span>
                  <span className="text-indigo-400 font-semibold">120Ω SPLIT (ISO 11898)</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
