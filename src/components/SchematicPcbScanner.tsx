import React, { useState } from 'react';
import { analyzePcbImage } from '../services/pcbImageAnalysisService';
import { ImageAnalysisResult, ImageAnalysisComponent, ImageAnalysisNet } from '../server/services/imageAnalysisTypes';
import {
  Upload,
  Cpu,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  FileCode,
  Download,
  FolderOpen,
  Plus,
  RefreshCw,
  Eye,
  EyeOff,
  Search,
  Edit2,
  Trash2,
} from 'lucide-react';

interface SampleBoard {
  id: string;
  name: string;
  type: string;
  components: ImageAnalysisComponent[];
  nets: ImageAnalysisNet[];
  summary: string;
}

const SAMPLE_BOARDS: SampleBoard[] = [
  {
    id: 'sample-power-stage',
    name: 'ECU 5V Power Supply & Clamping Stage',
    type: 'Automotive ECU Power PCB',
    summary: 'Infineon TLE4275 5V Low-Dropout Regulator with reverse polarity Schottky protection & filter bulk caps.',
    components: [
      {
        refDes: 'U1',
        category: 'VOLTAGE_REGULATOR',
        marking: 'TLE4275G',
        decodedValue: '5.0V / 450mA LDO',
        packageType: 'TO-263-5',
        bbox: { ymin: 170, xmin: 240, ymax: 330, xmax: 420 },
        confidenceScore: 0.94,
        verificationStatus: 'UNVERIFIED',
        circuitFunction: 'Main ECU 5V Reference & Logic Power Rail',
        terminalIds: ['U1-VIN', 'U1-GND', 'U1-VOUT', 'U1-RESET', 'U1-DELAY'],
        notes: 'Visual observation matches Bosch ME7.5 power circuit topology.',
      },
      {
        refDes: 'D1',
        category: 'DIODE',
        marking: 'B540C',
        decodedValue: '40V / 5A Schottky',
        packageType: 'SMC',
        bbox: { ymin: 180, xmin: 90, ymax: 260, xmax: 180 },
        confidenceScore: 0.91,
        verificationStatus: 'UNVERIFIED',
        circuitFunction: 'Reverse Battery Polarity Protection',
        terminalIds: ['D1-A', 'D1-K'],
      },
      {
        refDes: 'C1',
        category: 'ELECTROLYTIC_CAP',
        marking: '470uF 35V',
        decodedValue: '470 µF',
        packageType: 'Radial SMD',
        bbox: { ymin: 290, xmin: 90, ymax: 400, xmax: 190 },
        confidenceScore: 0.88,
        verificationStatus: 'UNVERIFIED',
        circuitFunction: 'Input Battery Ripple Filter',
        terminalIds: ['C1-POS', 'C1-NEG'],
      },
      {
        refDes: 'C2',
        category: 'CAPACITOR',
        marking: '22uF',
        decodedValue: '22 µF Tantalum',
        packageType: 'EIA 7343',
        bbox: { ymin: 190, xmin: 470, ymax: 260, xmax: 550 },
        confidenceScore: 0.86,
        verificationStatus: 'UNVERIFIED',
        circuitFunction: 'Output Stability Filter',
        terminalIds: ['C2-POS', 'C2-NEG'],
      },
      {
        refDes: 'TVS1',
        category: 'TVS_DIODE',
        marking: 'SMBJ24CA',
        decodedValue: '24V Bidirectional TVS',
        packageType: 'SMB',
        bbox: { ymin: 310, xmin: 470, ymax: 380, xmax: 540 },
        confidenceScore: 0.89,
        verificationStatus: 'UNVERIFIED',
        circuitFunction: 'Load Dump ISO 7637-2 Transient Suppression',
        terminalIds: ['TVS-1', 'TVS-2'],
      },
    ],
    nets: [
      {
        name: 'NET_KL30_VBAT',
        signalType: 'BATTERY_POWER',
        connectedComponentRefs: ['D1', 'C1'],
        connectedTerminalIds: ['D1-A', 'C1-POS'],
        tracePoints: [{ x: 90, y: 220 }, { x: 135, y: 220 }, { x: 135, y: 345 }],
        confidenceScore: 0.92,
        verificationStatus: 'UNVERIFIED',
        isComplete: true,
      },
      {
        name: 'NET_5V_REGULATED',
        signalType: '5V_LOGIC',
        connectedComponentRefs: ['U1', 'C2'],
        connectedTerminalIds: ['U1-VOUT', 'C2-POS'],
        tracePoints: [{ x: 420, y: 250 }, { x: 470, y: 225 }],
        confidenceScore: 0.89,
        verificationStatus: 'UNVERIFIED',
        isComplete: true,
      },
      {
        name: 'NET_CHASSIS_GND',
        signalType: 'GROUND',
        connectedComponentRefs: ['U1', 'C1', 'C2', 'TVS1'],
        connectedTerminalIds: ['U1-GND', 'C1-NEG', 'C2-NEG', 'TVS-2'],
        tracePoints: [{ x: 135, y: 345 }, { x: 330, y: 330 }, { x: 505, y: 345 }],
        confidenceScore: 0.95,
        verificationStatus: 'UNVERIFIED',
        isComplete: true,
      },
    ],
  },
  {
    id: 'sample-can-stage',
    name: 'High-Speed CAN Transceiver Stage',
    type: 'CAN Bus Interface PCB',
    summary: 'PCA82C250 / TJA1050 automotive transceiver with split termination and common-mode choke filter.',
    components: [
      {
        refDes: 'U2',
        category: 'CAN_TRANSCEIVER',
        marking: 'TJA1050',
        decodedValue: 'High-Speed CAN 1 Mbps',
        packageType: 'SOIC-8',
        bbox: { ymin: 200, xmin: 250, ymax: 330, xmax: 380 },
        confidenceScore: 0.96,
        verificationStatus: 'UNVERIFIED',
        circuitFunction: 'Physical CAN Bus Interface',
        terminalIds: ['U2-TXD', 'U2-GND', 'U2-VCC', 'U2-RXD', 'U2-VREF', 'U2-CANL', 'U2-CANH', 'U2-RS'],
      },
      {
        refDes: 'R1',
        category: 'RESISTOR',
        marking: '60R0',
        decodedValue: '60.4 Ω 1%',
        packageType: '0805',
        bbox: { ymin: 180, xmin: 440, ymax: 230, xmax: 500 },
        confidenceScore: 0.92,
        verificationStatus: 'UNVERIFIED',
        circuitFunction: 'Split Termination Upper Arm (60Ω to Common)',
        terminalIds: ['R1-1', 'R1-2'],
      },
      {
        refDes: 'R2',
        category: 'RESISTOR',
        marking: '60R0',
        decodedValue: '60.4 Ω 1%',
        packageType: '0805',
        bbox: { ymin: 250, xmin: 440, ymax: 300, xmax: 500 },
        confidenceScore: 0.92,
        verificationStatus: 'UNVERIFIED',
        circuitFunction: 'Split Termination Lower Arm (60Ω to Common)',
        terminalIds: ['R2-1', 'R2-2'],
      },
      {
        refDes: 'C3',
        category: 'CAPACITOR',
        marking: '4n7',
        decodedValue: '4.7 nF',
        packageType: '0603',
        bbox: { ymin: 320, xmin: 450, ymax: 360, xmax: 490 },
        confidenceScore: 0.85,
        verificationStatus: 'UNVERIFIED',
        circuitFunction: 'Split Termination Common-Mode RF Ground Filter',
        terminalIds: ['C3-1', 'C3-2'],
      },
    ],
    nets: [
      {
        name: 'NET_CAN_HIGH',
        signalType: 'CAN_DIFFERENTIAL',
        connectedComponentRefs: ['U2', 'R1'],
        connectedTerminalIds: ['U2-CANH', 'R1-1'],
        tracePoints: [{ x: 380, y: 240 }, { x: 440, y: 205 }],
        confidenceScore: 0.94,
        verificationStatus: 'UNVERIFIED',
        isComplete: true,
      },
      {
        name: 'NET_CAN_LOW',
        signalType: 'CAN_DIFFERENTIAL',
        connectedComponentRefs: ['U2', 'R2'],
        connectedTerminalIds: ['U2-CANL', 'R2-1'],
        tracePoints: [{ x: 380, y: 280 }, { x: 440, y: 275 }],
        confidenceScore: 0.94,
        verificationStatus: 'UNVERIFIED',
        isComplete: true,
      },
    ],
  },
];

export const SchematicPcbScanner: React.FC = () => {
  const [selectedBoard, setSelectedBoard] = useState<SampleBoard>(SAMPLE_BOARDS[0]);
  const [components, setComponents] = useState<ImageAnalysisComponent[]>(SAMPLE_BOARDS[0].components);
  const [nets, setNets] = useState<ImageAnalysisNet[]>(SAMPLE_BOARDS[0].nets);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('AI ANALYSIS READY · Technician review required');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [selectedCompRef, setSelectedCompRef] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'VERIFIED' | 'UNVERIFIED'>('ALL');

  // Layer Visibility
  const [showComponents, setShowComponents] = useState(true);
  const [showNets, setShowNets] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // Load sample board
  const loadSample = (board: SampleBoard) => {
    setSelectedBoard(board);
    setComponents(board.components);
    setNets(board.nets);
    setUploadedImageUrl(null);
    setSelectedCompRef(null);
    setStatusMessage(`Loaded preset: ${board.name}`);
  };

  // Upload handler
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2 MB limit for browser local storage.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async e => {
      const dataUrl = e.target?.result as string;
      setUploadedImageUrl(dataUrl);

      const imageBase64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;

      setIsAnalyzing(true);
      setStatusMessage('AI ANALYSIS RUNNING: Neural vision processing...');

      try {
        const analysis: ImageAnalysisResult = await analyzePcbImage({
          imageBase64,
          documentName: file.name,
          documentType: 'pcb',
        });

        if (analysis.components && analysis.components.length > 0) {
          const normalizedComps = analysis.components.map(c => ({
            ...c,
            verificationStatus: 'UNVERIFIED' as const,
          }));
          setComponents(normalizedComps);
          setNets(analysis.nets || []);
          setStatusMessage(
            `AI ANALYSIS COMPLETE: ${normalizedComps.length} components detected (${(analysis.confidenceScore * 100).toFixed(0)}% confidence). Technician sign-off required.`
          );
        } else {
          setStatusMessage('MANUAL REVIEW REQUIRED: Image loaded. No confident components identified by AI.');
        }
      } catch (err) {
        console.warn('AI analysis fallback to manual:', err);
        setStatusMessage('AI ANALYSIS UNAVAILABLE: Provider offline. Manual review mode active.');
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Add Manual Component
  const handleAddManualComponent = () => {
    const nextIndex = components.length + 1;
    const newComp: ImageAnalysisComponent = {
      refDes: `TP${nextIndex}`,
      category: 'TEST_POINT',
      marking: 'TP',
      decodedValue: 'N/A',
      packageType: 'SMD Test Pad',
      bbox: { ymin: 120, xmin: 300, ymax: 160, xmax: 340 },
      confidenceScore: 1.0,
      verificationStatus: 'VERIFIED',
      circuitFunction: 'Manual Technician Observation',
      terminalIds: [`TP${nextIndex}-1`],
      notes: 'Added manually during visual board inspection.',
    };
    setComponents(prev => [...prev, newComp]);
    setSelectedCompRef(newComp.refDes);
  };

  // Delete Component
  const handleDeleteComponent = (refDes: string) => {
    setComponents(prev => prev.filter(c => c.refDes !== refDes));
    if (selectedCompRef === refDes) setSelectedCompRef(null);
  };

  // Technician Verification Action
  const verifyComponent = (refDes: string) => {
    setComponents(prev =>
      prev.map(c =>
        c.refDes === refDes
          ? {
              ...c,
              verificationStatus: c.verificationStatus === 'VERIFIED' ? 'UNVERIFIED' : 'VERIFIED',
              notes:
                c.verificationStatus === 'VERIFIED'
                  ? 'Reverted to unverified status'
                  : 'Verified by Senior Auto-Electrician against OEM schematics.',
            }
          : c
      )
    );
  };

  // JSON Export / Backup
  const exportProjectJson = () => {
    const project = {
      boardName: selectedBoard.name,
      timestamp: new Date().toISOString(),
      components,
      nets,
      source: 'Autoelectric Lab PCB Inspection Engine',
    };
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autoelectric-pcb-${selectedBoard.id}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered components
  const filteredComponents = components.filter(c => {
    const matchesSearch =
      c.refDes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.marking.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.decodedValue.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === 'VERIFIED') return c.verificationStatus === 'VERIFIED';
    if (filterMode === 'UNVERIFIED') return c.verificationStatus === 'UNVERIFIED';
    return true;
  });

  const selectedComponent = components.find(c => c.refDes === selectedCompRef);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden text-slate-100 shadow-sm">
      {/* Top Banner Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 p-2.5 bg-slate-900 text-xs font-mono gap-2">
        <div className="flex items-center gap-3">
          <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-bold text-slate-200 whitespace-nowrap">PCB & SCHEMATIC SCANNER</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-[11px] text-cyan-300 truncate max-w-[340px]">{statusMessage}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Sample Presets */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400">PRESETS:</span>
            {SAMPLE_BOARDS.map(sb => (
              <button
                key={sb.id}
                onClick={() => loadSample(sb)}
                className={`px-2 py-0.5 text-[10px] rounded border transition ${
                  selectedBoard.id === sb.id && !uploadedImageUrl
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-200 font-semibold'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {sb.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Add Manual Observation */}
          <button
            onClick={handleAddManualComponent}
            className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded transition"
            title="Add Manual Component"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Part</span>
          </button>

          {/* Upload Button */}
          <label className="flex items-center gap-1 px-2.5 py-1 bg-cyan-700 hover:bg-cyan-600 text-white rounded cursor-pointer font-semibold transition">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload PCB/Schematic</span>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>

          {/* Export JSON */}
          <button
            onClick={exportProjectJson}
            className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded transition"
            title="Export JSON Backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Dual Workspace: Canvas Left + Component Inspector Right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Interactive Canvas */}
        <div className="flex-1 relative bg-[#070b12] border-r border-slate-800 flex flex-col overflow-hidden">
          {/* HUD Layer Controls */}
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur border border-slate-800 p-1 rounded-lg text-[11px] font-mono text-slate-300 shadow">
            <button
              onClick={() => setShowComponents(!showComponents)}
              className={`px-2 py-0.5 rounded flex items-center gap-1 transition ${
                showComponents ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-500'
              }`}
            >
              {showComponents ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>Components</span>
            </button>
            <button
              onClick={() => setShowNets(!showNets)}
              className={`px-2 py-0.5 rounded flex items-center gap-1 transition ${
                showNets ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-500'
              }`}
            >
              {showNets ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>Copper Nets</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-slate-900/90 backdrop-blur border border-slate-800 p-1 rounded-lg shadow">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-mono px-1.5 text-slate-400 tabular-nums">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.1))}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button
              onClick={() => setZoomLevel(1.0)}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              title="Reset 100%"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* SVG PCB Viewport */}
          <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
            <div
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
              className="relative w-[720px] h-[480px] bg-[#0c1815] border-4 border-[#16362e] rounded-xl shadow-2xl overflow-hidden select-none"
            >
              {uploadedImageUrl ? (
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded PCB Document"
                  className="absolute inset-0 w-full h-full object-contain opacity-80"
                />
              ) : (
                <svg className="absolute inset-0 w-full h-full">
                  {/* FR4 Board Texture & Copper Ground Pour */}
                  <rect width="100%" height="100%" fill="#0a1d18" />
                  <circle cx="360" cy="240" r="230" fill="#0d2b23" opacity="0.4" />

                  {/* Silkscreen Grid */}
                  <path d="M 40 40 L 680 40 L 680 440 L 40 440 Z" fill="none" stroke="#235c4d" strokeWidth="1.5" strokeDasharray="6,4" />
                  <text x="60" y="70" fill="#448d79" fontSize="12" fontFamily="monospace" fontWeight="bold">
                    AUTOELECTRIC LAB // {selectedBoard.name.toUpperCase()}
                  </text>
                  <text x="60" y="88" fill="#2d6d5d" fontSize="9" fontFamily="monospace">
                    TOP LAYER SILKSCREEN · 1oz COPPER · AUTOMOTIVE GRADE AEC-Q100
                  </text>

                  {/* Copper Traces Layer */}
                  {showNets &&
                    nets.map(net => {
                      const points = net.tracePoints.map(p => `${p.x},${p.y}`).join(' ');
                      return (
                        <g key={net.name}>
                          <polyline
                            points={points}
                            fill="none"
                            stroke="#eab308"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.8"
                          />
                          <polyline
                            points={points}
                            fill="none"
                            stroke="#ca8a04"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          {net.tracePoints.map((p, idx) => (
                            <circle key={idx} cx={p.x} cy={p.y} r="5.5" fill="#facc15" stroke="#713f12" strokeWidth="1.5" />
                          ))}
                        </g>
                      );
                    })}
                </svg>
              )}

              {/* Bounding Boxes & Component Overlays */}
              {showComponents &&
                components.map(comp => {
                  const isSelected = selectedCompRef === comp.refDes;
                  const isVerified = comp.verificationStatus === 'VERIFIED';

                  const top = comp.bbox.ymin;
                  const left = comp.bbox.xmin;
                  const width = comp.bbox.xmax - comp.bbox.xmin;
                  const height = comp.bbox.ymax - comp.bbox.ymin;

                  return (
                    <div
                      key={comp.refDes}
                      onClick={() => setSelectedCompRef(comp.refDes)}
                      style={{ top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px` }}
                      className={`absolute cursor-pointer border-2 transition-all flex flex-col justify-between p-1.5 rounded-sm ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/70 shadow-xl ring-2 ring-cyan-400/50'
                          : isVerified
                          ? 'border-emerald-500/80 bg-emerald-950/35 hover:border-emerald-400'
                          : 'border-amber-500/80 bg-amber-950/25 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold leading-none">
                        <span className={isSelected ? 'text-cyan-300' : isVerified ? 'text-emerald-300' : 'text-amber-300'}>
                          {comp.refDes}
                        </span>
                        {isVerified ? (
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <span className="text-[8px] text-amber-400 bg-amber-950/80 px-1 py-0.2 rounded border border-amber-800">
                            AI
                          </span>
                        )}
                      </div>

                      <div className="text-[9px] font-mono truncate text-slate-200 leading-tight">
                        {comp.marking || comp.category}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Right: Inspection & Verification Inspector Panel */}
        <aside className="w-84 bg-slate-900 p-3.5 flex flex-col gap-3 overflow-y-auto text-xs font-mono border-l border-slate-800 shrink-0">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-semibold text-slate-200">COMPONENT REGISTRY</span>
            <span className="text-[10px] text-slate-400 font-bold">{components.length} Observations</span>
          </div>

          {/* Search & Status Filter */}
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search refDes, marking, part..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800">
              <button
                onClick={() => setFilterMode('ALL')}
                className={`flex-1 py-1 text-[10px] font-semibold rounded text-center transition ${
                  filterMode === 'ALL' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({components.length})
              </button>
              <button
                onClick={() => setFilterMode('VERIFIED')}
                className={`flex-1 py-1 text-[10px] font-semibold rounded text-center transition ${
                  filterMode === 'VERIFIED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Verified ({components.filter(c => c.verificationStatus === 'VERIFIED').length})
              </button>
              <button
                onClick={() => setFilterMode('UNVERIFIED')}
                className={`flex-1 py-1 text-[10px] font-semibold rounded text-center transition ${
                  filterMode === 'UNVERIFIED' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                AI ({components.filter(c => c.verificationStatus === 'UNVERIFIED').length})
              </button>
            </div>
          </div>

          {/* Selected Component Inspector Card */}
          {selectedComponent ? (
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex flex-col gap-2 shadow">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-cyan-400">{selectedComponent.refDes}</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                      selectedComponent.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                        : 'bg-amber-950 border-amber-700 text-amber-300'
                    }`}
                  >
                    {selectedComponent.verificationStatus}
                  </span>
                  <button
                    onClick={() => handleDeleteComponent(selectedComponent.refDes)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                    title="Delete Observation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400 pt-1.5 border-t border-slate-800">
                <div>Category: <span className="text-slate-200">{selectedComponent.category}</span></div>
                <div>Package: <span className="text-slate-200">{selectedComponent.packageType}</span></div>
                <div>Marking: <span className="text-slate-200">{selectedComponent.marking || 'N/A'}</span></div>
                <div>Value: <span className="text-slate-200">{selectedComponent.decodedValue}</span></div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>AI Confidence:</span>
                <span className="text-cyan-400 font-bold tabular-nums">
                  {(selectedComponent.confidenceScore * 100).toFixed(0)}%
                </span>
              </div>

              <div className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block font-bold">Circuit Role:</span>
                {selectedComponent.circuitFunction}
              </div>

              {selectedComponent.notes && (
                <div className="text-[10px] text-slate-400 italic">
                  Note: {selectedComponent.notes}
                </div>
              )}

              {/* Technician Sign-Off Action */}
              <button
                onClick={() => verifyComponent(selectedComponent.refDes)}
                className={`mt-1 py-2 px-3 rounded font-semibold text-xs flex items-center justify-center gap-2 transition ${
                  selectedComponent.verificationStatus === 'VERIFIED'
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>
                  {selectedComponent.verificationStatus === 'VERIFIED'
                    ? 'Revoke Verification (Mark Unverified)'
                    : 'Confirm & Verify (Technician Sign-Off)'}
                </span>
              </button>
            </div>
          ) : (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded text-slate-400 text-center text-xs">
              Click any component on the board to review observations or sign off.
            </div>
          )}

          {/* Observations List */}
          <div className="flex flex-col gap-1 pt-1 border-t border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              Component Registry ({filteredComponents.length}):
            </span>
            <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
              {filteredComponents.map(comp => (
                <div
                  key={comp.refDes}
                  onClick={() => setSelectedCompRef(comp.refDes)}
                  className={`p-2 rounded border flex items-center justify-between cursor-pointer transition ${
                    selectedCompRef === comp.refDes
                      ? 'bg-slate-800 border-cyan-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-cyan-400 font-mono">{comp.refDes}</span>
                    <span className="text-slate-400 text-[10px] truncate max-w-[130px]">
                      {comp.decodedValue || comp.category}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-semibold shrink-0 ${
                      comp.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {comp.verificationStatus === 'VERIFIED' ? 'VERIFIED' : 'AI'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
