import React, { useEffect } from 'react';
import { MultimeterState, MultimeterMode, EcuPin, BenchComponent } from '../types/ecu';
import { Volume2, AlertTriangle, ArrowLeftRight, X, Disc, ChevronDown } from 'lucide-react';
import { playContinuityBeep } from '../utils/audioFeedback';

interface DigitalMultimeterProps {
  multimeter: MultimeterState;
  onChange: (updated: MultimeterState) => void;
  reading: {
    display: string;
    value: number;
    unit: string;
    isOverLimit: boolean;
    isWarning: boolean;
    warningMessage?: string;
    shouldBeep: boolean;
  };
  pins: EcuPin[];
  components: BenchComponent[];
  selectedPinId: string | null;
}

export const DigitalMultimeter: React.FC<DigitalMultimeterProps> = ({
  multimeter,
  onChange,
  reading,
  pins,
  components,
  selectedPinId,
}) => {
  // Beep effect
  useEffect(() => {
    if (multimeter.isPowered && multimeter.mode === 'CONTINUITY' && reading.shouldBeep) {
      playContinuityBeep(true);
    } else {
      playContinuityBeep(false);
    }

    return () => {
      playContinuityBeep(false);
    };
  }, [multimeter.isPowered, multimeter.mode, reading.shouldBeep]);

  const setMode = (mode: MultimeterMode) => {
    onChange({ ...multimeter, mode });
  };

  const attachRedProbe = (pinId: string, label: string) => {
    onChange({
      ...multimeter,
      redProbe: { attachedToPinId: pinId, attachedLabel: label },
    });
  };

  const attachBlackProbe = (pinId: string, label: string) => {
    onChange({
      ...multimeter,
      blackProbe: { attachedToPinId: pinId, attachedLabel: label },
    });
  };

  const swapProbes = () => {
    onChange({
      ...multimeter,
      redProbe: multimeter.blackProbe,
      blackProbe: multimeter.redProbe,
    });
  };

  const clearProbes = () => {
    onChange({
      ...multimeter,
      redProbe: { attachedToPinId: null, attachedLabel: 'Unconnected' },
      blackProbe: { attachedToPinId: null, attachedLabel: 'Unconnected' },
    });
  };

  // Build full list of all available terminals in the lab
  const allTerminals: { id: string; label: string; group: string }[] = [
    { id: 'chassis-gnd', label: 'Chassis Ground (KL31)', group: 'Reference Rails' },
    { id: 'bench-vbat', label: 'Power Supply (+12V VBat)', group: 'Reference Rails' },
    ...pins.map(p => ({ id: p.id, label: `${p.label} - ${p.name}`, group: 'ECU Breakout Header' })),
    ...components.flatMap(c =>
      c.pins.map(cp => ({ id: cp.id, label: `${c.name}: ${cp.label}`, group: 'Bench Components' }))
    ),
  ];

  return (
    <div className="bg-slate-900 border-2 border-amber-600/40 rounded-xl p-3.5 flex flex-col gap-3 shadow-md text-slate-100">
      {/* Top Brand Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="font-mono text-xs font-bold tracking-wider text-amber-400">
            AUTO-DMM 88V
          </span>
          <span className="text-[10px] font-mono text-slate-400">AUTOMOTIVE MULTIMETER</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChange({ ...multimeter, isPowered: !multimeter.isPowered })}
            className={`px-2 py-0.5 text-[10px] font-mono rounded border transition ${
              multimeter.isPowered
                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300 font-semibold'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            {multimeter.isPowered ? 'PWR ON' : 'PWR OFF'}
          </button>
        </div>
      </div>

      {/* High-Contrast LCD Screen */}
      <div className="bg-[#94a382] border-4 border-slate-950 rounded-lg p-3 text-slate-950 shadow-inner flex flex-col justify-between min-h-[92px]">
        {multimeter.isPowered ? (
          <>
            <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-wider text-slate-800">
              <div className="flex items-center gap-2">
                <span>AUTO</span>
                {multimeter.mode === 'CONTINUITY' && <Volume2 className="w-3 h-3 text-slate-900" />}
                {multimeter.mode === 'V_AC' && <span>AC~</span>}
                {multimeter.mode === 'V_DC' && <span>DC</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="uppercase">{multimeter.mode.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="flex items-baseline justify-end gap-2 my-0.5">
              <span className="text-3xl sm:text-4xl font-mono font-black tracking-tight tabular-nums text-slate-950">
                {reading.display}
              </span>
              <span className="text-base font-mono font-bold text-slate-900 w-10 text-left">
                {reading.unit}
              </span>
            </div>

            <div className="text-[10px] font-mono font-semibold text-slate-800 flex justify-between border-t border-slate-700/30 pt-1 truncate">
              <span className="truncate max-w-[150px]">+ RED: {multimeter.redProbe.attachedLabel}</span>
              <span className="truncate max-w-[150px]">- COM: {multimeter.blackProbe.attachedLabel}</span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-700/60 font-mono text-xs">
            [ METER POWERED OFF ]
          </div>
        )}
      </div>

      {/* Live Warning Banner */}
      {reading.isWarning && reading.warningMessage && (
        <div className="bg-rose-950/80 border border-rose-700 px-3 py-1.5 rounded flex items-start gap-2 text-[11px] text-rose-300 font-mono">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{reading.warningMessage}</span>
        </div>
      )}

      {/* Rotary Selector Dial Buttons */}
      <div className="grid grid-cols-6 gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
        <button
          onClick={() => setMode('V_DC')}
          className={`py-1.5 text-[10px] font-mono font-semibold rounded transition text-center ${
            multimeter.mode === 'V_DC'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          V DC
        </button>
        <button
          onClick={() => setMode('V_AC')}
          className={`py-1.5 text-[10px] font-mono font-semibold rounded transition text-center ${
            multimeter.mode === 'V_AC'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          V AC~
        </button>
        <button
          onClick={() => setMode('RESISTANCE')}
          className={`py-1.5 text-[10px] font-mono font-semibold rounded transition text-center ${
            multimeter.mode === 'RESISTANCE'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          Ω OHM
        </button>
        <button
          onClick={() => setMode('CONTINUITY')}
          className={`py-1.5 text-[10px] font-mono font-semibold rounded transition text-center flex items-center justify-center gap-1 ${
            multimeter.mode === 'CONTINUITY'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Volume2 className="w-3 h-3" />
          <span>BEEP</span>
        </button>
        <button
          onClick={() => setMode('FREQUENCY')}
          className={`py-1.5 text-[10px] font-mono font-semibold rounded transition text-center ${
            multimeter.mode === 'FREQUENCY'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          Hz / %
        </button>
        <button
          onClick={() => setMode('DIODE')}
          className={`py-1.5 text-[10px] font-mono font-semibold rounded transition text-center ${
            multimeter.mode === 'DIODE'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          -▷| -
        </button>
      </div>

      {/* Probes Lead Jacks & Connection Terminal Controls */}
      <div className="flex flex-col gap-2 pt-1 border-t border-slate-800">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400 uppercase tracking-wider">Probe Leads</span>
          <div className="flex gap-2">
            <button
              onClick={swapProbes}
              className="text-[10px] font-mono text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 transition"
            >
              <ArrowLeftRight className="w-3 h-3" /> Swap
            </button>
            <button
              onClick={clearProbes}
              className="text-[10px] font-mono text-slate-400 hover:text-rose-400 flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 transition"
            >
              <X className="w-3 h-3" /> Disconnect
            </button>
          </div>
        </div>

        {/* Lead Connection Terminal Rows */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          {/* Red Lead Card */}
          <div className="bg-slate-950 border-2 border-rose-600/50 p-2 rounded-lg flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-rose-400 flex items-center gap-1">
                <Disc className="w-3 h-3 text-rose-500 fill-rose-500" /> (+) RED PROBE
              </span>
            </div>
            {/* Quick dropdown for ANY terminal */}
            <select
              value={multimeter.redProbe.attachedToPinId || ''}
              onChange={e => {
                const target = allTerminals.find(t => t.id === e.target.value);
                if (target) attachRedProbe(target.id, target.label);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[10px] text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="">-- Choose Terminal --</option>
              {allTerminals.map(t => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Black Lead Card */}
          <div className="bg-slate-950 border-2 border-slate-700 p-2 rounded-lg flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-300 flex items-center gap-1">
                <Disc className="w-3 h-3 text-slate-400 fill-slate-400" /> (-) BLACK COM
              </span>
            </div>
            {/* Quick dropdown for ANY terminal */}
            <select
              value={multimeter.blackProbe.attachedToPinId || ''}
              onChange={e => {
                const target = allTerminals.find(t => t.id === e.target.value);
                if (target) attachBlackProbe(target.id, target.label);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[10px] text-slate-200 focus:outline-none focus:border-slate-500"
            >
              <option value="">-- Choose Terminal --</option>
              {allTerminals.map(t => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
