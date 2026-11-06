import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Layers,
  Info,
  Sliders,
  CheckCircle2,
  ChevronRight,
  Eye,
  Clock,
  Dna,
  Activity,
  Flame,
  Sun
} from 'lucide-react';
import {
  CELL_TYPES,
  ORGANELLES,
  STAINING_METHODS,
  EXPANDED_ORGANISMS,
  CellKingdom,
  CellOrganismModel,
  OrganelleInfo,
  StainingMethod
} from '../data/cellData';
import { TimeControlBar, TimeControlState } from './TimeControlBar';

interface CellMicroscopeProps {
  currentKingdom: CellKingdom;
  onSelectKingdom: (kingdom: CellKingdom) => void;
  selectedOrganelleId: string | null;
  onSelectOrganelle: (id: string | null) => void;
  selectedOrganismId?: string | null;
  onSelectOrganismId?: (id: string | null) => void;
}

export const CellMicroscope: React.FC<CellMicroscopeProps> = ({
  currentKingdom,
  onSelectKingdom,
  selectedOrganelleId,
  onSelectOrganelle,
  selectedOrganismId,
  onSelectOrganismId,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(400); // 100, 400, 1000, 2500
  const [stainId, setStainId] = useState<string>('natural');
  const [focusOffset, setFocusOffset] = useState<number>(0); // -6 to +6, 0 is crisp
  const [hoveredOrganelleId, setHoveredOrganelleId] = useState<string | null>(null);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Time control simulation state
  const [timeState, setTimeState] = useState<TimeControlState>({
    isPlaying: true,
    speed: 1,
    timeSec: 0,
    maxTimeSec: 60,
    direction: 'forward',
  });

  // Ticker for micro-motion (cilia beating, streaming, pulsatile vacuole)
  useEffect(() => {
    if (!timeState.isPlaying) return;
    const interval = setInterval(() => {
      setTimeState((prev) => {
        const delta = 0.05 * prev.speed * (prev.direction === 'forward' ? 1 : -1);
        let nextTime = prev.timeSec + delta;
        if (nextTime >= prev.maxTimeSec) nextTime = 0;
        else if (nextTime < 0) nextTime = prev.maxTimeSec;
        return { ...prev, timeSec: Number(nextTime.toFixed(2)) };
      });
    }, 50);
    return () => clearInterval(interval);
  }, [timeState.isPlaying, timeState.speed, timeState.direction, timeState.maxTimeSec]);

  const cell = CELL_TYPES[currentKingdom];
  const activeStain = STAINING_METHODS.find((s) => s.id === stainId) || STAINING_METHODS[0];
  const activeOrganelle = selectedOrganelleId ? ORGANELLES[selectedOrganelleId] : null;

  // Organisms belonging to the current kingdom
  const kingdomOrganisms: CellOrganismModel[] = Object.values(EXPANDED_ORGANISMS).filter(
    (org) => org.kingdom === currentKingdom
  );

  const activeOrganism: CellOrganismModel | null = selectedOrganismId
    ? EXPANDED_ORGANISMS[selectedOrganismId] || null
    : null;

  // Zoom scale multiplier
  const scale = zoomLevel === 100 ? 0.75 : zoomLevel === 400 ? 1.0 : zoomLevel === 1000 ? 1.45 : 2.0;
  const blurAmount = Math.abs(focusOffset) * 0.35;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(400);
    setPan({ x: 0, y: 0 });
    setFocusOffset(0);
  };

  // Wave phase for animated organelles
  const wave = Math.sin(timeState.timeSec * 4);
  const pulse = (Math.sin(timeState.timeSec * 2) + 1) / 2;

  // Organelle glow helper
  const isOrganelleActive = (id: string) => selectedOrganelleId === id || hoveredOrganelleId === id;
  const isOrganelleStained = (id: string) => activeStain.highlightedOrganelles.includes(id);

  const getGlow = (id: string, defaultColor: string, defaultWidth: number = 1.5) => {
    const active = isOrganelleActive(id);
    const stained = isOrganelleStained(id);
    return {
      stroke: active ? '#FBBF24' : defaultColor,
      strokeWidth: active ? Math.max(4, defaultWidth + 2) : stained ? Math.max(3, defaultWidth + 1) : defaultWidth,
      filter: active
        ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))'
        : stained
        ? 'drop-shadow(0 0 5px rgba(99, 102, 241, 0.6))'
        : undefined,
      cursor: 'pointer' as const,
    };
  };

  // Specialized SVG morphology renderers
  const renderCellGraphic = () => {
    // If a specialized organism is selected, render specific morphology!
    if (selectedOrganismId === 'animal_neuron') {
      return (
        <g>
          {/* Neuron Axon with Myelin Sheath */}
          <path d="M 450 350 C 520 380, 580 430, 680 480" fill="none" stroke="#6366F1" strokeWidth="8" strokeLinecap="round" />
          {/* Myelin segments */}
          <g
            onClick={(e) => { e.stopPropagation(); onSelectOrganelle('axon_myelin'); }}
            onMouseEnter={() => setHoveredOrganelleId('axon_myelin')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('axon_myelin', '#818CF8', 2)}
          >
            <rect x="470" y="355" width="45" height="18" rx="6" fill="#818CF8" opacity="0.85" transform="rotate(20 470 355)" />
            <rect x="530" y="385" width="45" height="18" rx="6" fill="#818CF8" opacity="0.85" transform="rotate(25 530 385)" />
            <rect x="590" y="420" width="50" height="18" rx="6" fill="#818CF8" opacity="0.85" transform="rotate(30 590 420)" />
          </g>
          {/* Synaptic terminal branches */}
          <path d="M 670 475 L 710 470 M 670 475 L 720 495 M 670 475 L 705 520" stroke="#818CF8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="712" cy="470" r="4" fill="#F59E0B" />
          <circle cx="722" cy="495" r="4" fill="#F59E0B" />
          <circle cx="707" cy="520" r="4" fill="#F59E0B" />

          {/* Neuron Soma (Body) & Dendrites */}
          <path
            d="M 320 220 C 350 180, 410 170, 450 210 C 490 250, 480 320, 440 360 C 380 390, 310 380, 270 330 C 240 280, 280 240, 320 220 Z"
            fill="url(#animalCytoplasmGrad)"
            onClick={() => onSelectOrganelle('plasma_membrane')}
            onMouseEnter={() => setHoveredOrganelleId('plasma_membrane')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('plasma_membrane', '#38BDF8', 2)}
          />
          {/* Dendrites branches spreading */}
          <path d="M 320 220 L 250 160 M 250 160 L 210 130 M 250 160 L 240 190" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          <path d="M 410 170 L 430 110 M 430 110 L 400 80 M 430 110 L 460 75" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          <path d="M 270 330 L 200 370 M 200 370 L 170 350 M 200 370 L 175 410" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />

          {/* Nucleus in Soma */}
          <g
            onClick={(e) => { e.stopPropagation(); onSelectOrganelle('nucleus'); }}
            onMouseEnter={() => setHoveredOrganelleId('nucleus')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('nucleus', '#818CF8', 2)}
          >
            <circle cx="360" cy="280" r="45" fill="url(#nucleusGrad)" />
            <circle cx="360" cy="280" r="16" fill="#312E81" opacity="0.85" />
          </g>
          {/* Mitochondria in Soma and near Axon */}
          <g
            onClick={(e) => { e.stopPropagation(); onSelectOrganelle('mitochondria'); }}
            onMouseEnter={() => setHoveredOrganelleId('mitochondria')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('mitochondria', '#EA580C', 1.5)}
          >
            <ellipse cx="430" cy="270" rx="16" ry="9" fill="url(#mitoGrad)" transform="rotate(30 430 270)" />
            <ellipse cx="320" cy="340" rx="16" ry="9" fill="url(#mitoGrad)" transform="rotate(-20 320 340)" />
            <ellipse cx="460" cy="340" rx="12" ry="7" fill="url(#mitoGrad)" transform="rotate(40 460 340)" />
          </g>
        </g>
      );
    }

    if (selectedOrganismId === 'plant_guard_cell') {
      return (
        <g>
          {/* Guard Cells flanking Stoma Pore */}
          {/* Left Kidney Guard Cell */}
          <path
            d="M 370 200 C 310 230, 290 350, 360 420 C 375 400, 375 250, 370 200 Z"
            fill="url(#plantCytoplasmGrad)"
            onClick={(e) => { e.stopPropagation(); onSelectOrganelle('stoma_pore'); }}
            onMouseEnter={() => setHoveredOrganelleId('stoma_pore')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('stoma_pore', '#22C55E', 3)}
          />
          {/* Right Kidney Guard Cell */}
          <path
            d="M 430 200 C 490 230, 510 350, 440 420 C 425 400, 425 250, 430 200 Z"
            fill="url(#plantCytoplasmGrad)"
            onClick={(e) => { e.stopPropagation(); onSelectOrganelle('stoma_pore'); }}
            onMouseEnter={() => setHoveredOrganelleId('stoma_pore')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('stoma_pore', '#22C55E', 3)}
          />
          {/* Central Stoma Aperture Pore (dilating with pulse) */}
          <ellipse
            cx="400"
            cy="310"
            rx={8 + pulse * 6}
            ry={45}
            fill="#0F172A"
            onClick={(e) => { e.stopPropagation(); onSelectOrganelle('stoma_pore'); }}
            {...getGlow('stoma_pore', '#10B981', 2)}
          />
          {/* Chloroplasts in guard cells */}
          <g
            onClick={(e) => { e.stopPropagation(); onSelectOrganelle('chloroplast'); }}
            onMouseEnter={() => setHoveredOrganelleId('chloroplast')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('chloroplast', '#15803D', 1.5)}
          >
            <ellipse cx="330" cy="270" rx="14" ry="8" fill="url(#chloroGrad)" transform="rotate(45 330 270)" />
            <ellipse cx="340" cy="350" rx="14" ry="8" fill="url(#chloroGrad)" transform="rotate(-30 340 350)" />
            <ellipse cx="470" cy="270" rx="14" ry="8" fill="url(#chloroGrad)" transform="rotate(-45 470 270)" />
            <ellipse cx="460" cy="350" rx="14" ry="8" fill="url(#chloroGrad)" transform="rotate(30 460 350)" />
          </g>
          {/* Nuclei in guard cells */}
          <g
            onClick={(e) => { e.stopPropagation(); onSelectOrganelle('nucleus'); }}
            onMouseEnter={() => setHoveredOrganelleId('nucleus')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('nucleus', '#818CF8', 1.5)}
          >
            <circle cx="330" cy="310" r="15" fill="url(#nucleusGrad)" />
            <circle cx="470" cy="310" r="15" fill="url(#nucleusGrad)" />
          </g>
        </g>
      );
    }

    if (selectedOrganismId === 'protist_paramecium') {
      return (
        <g>
          {/* Cilia border vibrating with wave */}
          <path
            d="M 220 180 C 350 140, 550 160, 600 240 C 640 320, 620 400, 540 450 C 420 520, 240 500, 180 400 C 130 310, 150 220, 220 180 Z"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="3"
            strokeDasharray="4 4"
            transform={`rotate(${wave * 0.8} 380 320)`}
          />

          {/* Paramecium Body (Slipper shape) */}
          <path
            d="M 230 190 C 350 150, 540 170, 590 250 C 630 330, 610 390, 530 440 C 420 500, 250 490, 190 390 C 140 310, 160 230, 230 190 Z"
            fill="url(#protistCytoplasmGrad)"
            onClick={() => onSelectOrganelle('plasma_membrane')}
            onMouseEnter={() => setHoveredOrganelleId('plasma_membrane')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('plasma_membrane', '#06B6D4', 2)}
          />

          {/* Oral groove & Cytostome */}
          <path d="M 450 200 C 430 260, 390 310, 350 330" fill="none" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />

          {/* Contractile Vacuole with radiating canals (pulsing!) */}
          <g
            onClick={(e) => { e.stopPropagation(); onSelectOrganelle('contractile_vacuole'); }}
            onMouseEnter={() => setHoveredOrganelleId('contractile_vacuole')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('contractile_vacuole', '#0284C7', 2)}
          >
            <circle cx="260" cy="270" r={16 + pulse * 10} fill="url(#vacuoleGrad)" opacity="0.8" />
            <circle cx="510" cy="370" r={16 + (1 - pulse) * 10} fill="url(#vacuoleGrad)" opacity="0.8" />
          </g>

          {/* Macronucleus & Micronucleus */}
          <g
            onClick={(e) => { e.stopPropagation(); onSelectOrganelle('nucleus'); }}
            onMouseEnter={() => setHoveredOrganelleId('nucleus')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('nucleus', '#818CF8', 2)}
          >
            {/* Kidney-shaped Macronucleus */}
            <ellipse cx="380" cy="300" rx="42" ry="24" fill="url(#nucleusGrad)" transform="rotate(-15 380 300)" />
            {/* Round Micronucleus */}
            <circle cx="410" cy="275" r="8" fill="#F43F5E" />
          </g>

          {/* Food vacuoles */}
          <circle cx="320" cy="360" r="14" fill="#10B981" opacity="0.6" stroke="#059669" strokeWidth="1" />
          <circle cx="450" cy="340" r="12" fill="#F59E0B" opacity="0.6" stroke="#D97706" strokeWidth="1" />
          <circle cx="480" cy="270" r="15" fill="#3B82F6" opacity="0.6" stroke="#2563EB" strokeWidth="1" />
        </g>
      );
    }

    if (selectedOrganismId === 'protist_amoeba') {
      return (
        <g>
          {/* Dynamic Amoeba Pseudopodia Shape */}
          <path
            d={`M 260 180 C ${320 + wave * 15} 120, ${480 - wave * 10} 140, 560 210 C ${650 + wave * 12} 280, 630 380, 550 440 C ${470 - wave * 15} 510, 310 520, 220 440 C ${140 - wave * 10} 350, 170 230, 260 180 Z`}
            fill="url(#protistCytoplasmGrad)"
            onClick={() => onSelectOrganelle('plasma_membrane')}
            onMouseEnter={() => setHoveredOrganelleId('plasma_membrane')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('plasma_membrane', '#0EA5E9', 2)}
          />

          {/* Nucleus */}
          <g
            onClick={(e) => { e.stopPropagation(); onSelectOrganelle('nucleus'); }}
            onMouseEnter={() => setHoveredOrganelleId('nucleus')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('nucleus', '#818CF8', 2)}
          >
            <circle cx="380" cy="320" r="35" fill="url(#nucleusGrad)" />
            <circle cx="380" cy="320" r="12" fill="#312E81" />
          </g>

          {/* Contractile Vacuole */}
          <circle
            cx="460"
            cy="270"
            r={18 + pulse * 8}
            fill="url(#vacuoleGrad)"
            onClick={(e) => { e.stopPropagation(); onSelectOrganelle('contractile_vacuole'); }}
            {...getGlow('contractile_vacuole', '#0284C7', 2)}
          />

          {/* Food vacuoles with captured diatom/bacteria */}
          <circle cx="290" cy="270" r="20" fill="#10B981" opacity="0.5" stroke="#059669" strokeWidth="1.5" />
          <circle cx="340" cy="410" r="16" fill="#F59E0B" opacity="0.5" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="490" cy="380" r="22" fill="#6366F1" opacity="0.4" stroke="#4F46E5" strokeWidth="1.5" />
        </g>
      );
    }

    if (selectedOrganismId === 'protist_euglena') {
      return (
        <g>
          {/* Emergent Whip Flagellum */}
          <path
            d={`M 220 220 Q ${160 + wave * 25} 170 ${110 + wave * 30} 140 T ${60 - wave * 20} 90`}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Euglena Spindle Body */}
          <path
            d="M 210 220 C 270 190, 470 230, 580 310 C 500 370, 310 390, 210 260 C 195 240, 195 235, 210 220 Z"
            fill="url(#protistCytoplasmGrad)"
            onClick={() => onSelectOrganelle('plasma_membrane')}
            onMouseEnter={() => setHoveredOrganelleId('plasma_membrane')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('plasma_membrane', '#10B981', 2)}
          />

          {/* Red Stigma Eyespot (Photoreceptor) */}
          <g
            onClick={(e) => { e.stopPropagation(); onSelectOrganelle('stigma_eyespot'); }}
            onMouseEnter={() => setHoveredOrganelleId('stigma_eyespot')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('stigma_eyespot', '#EF4444', 2)}
          >
            <circle cx="240" cy="235" r="9" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
          </g>

          {/* Ribbon Chloroplasts */}
          <g
            onClick={(e) => { e.stopPropagation(); onSelectOrganelle('chloroplast'); }}
            onMouseEnter={() => setHoveredOrganelleId('chloroplast')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('chloroplast', '#15803D', 1.5)}
          >
            <ellipse cx="320" cy="270" rx="22" ry="8" fill="url(#chloroGrad)" transform="rotate(20 320 270)" />
            <ellipse cx="410" cy="290" rx="22" ry="8" fill="url(#chloroGrad)" transform="rotate(10 410 290)" />
            <ellipse cx="490" cy="310" rx="20" ry="7" fill="url(#chloroGrad)" transform="rotate(5 490 310)" />
          </g>

          {/* Nucleus */}
          <g
            onClick={(e) => { e.stopPropagation(); onSelectOrganelle('nucleus'); }}
            onMouseEnter={() => setHoveredOrganelleId('nucleus')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('nucleus', '#818CF8', 2)}
          >
            <circle cx="370" cy="285" r="26" fill="url(#nucleusGrad)" />
            <circle cx="370" cy="285" r="9" fill="#312E81" />
          </g>
        </g>
      );
    }

    if (selectedOrganismId === 'bacteria_bacillus_spore') {
      return (
        <g>
          {/* Rod Mother Cell Wall */}
          <rect
            x="200"
            y="220"
            width="400"
            height="160"
            rx="80"
            fill="url(#bacWallGrad)"
            onClick={() => onSelectOrganelle('cell_wall')}
            onMouseEnter={() => setHoveredOrganelleId('cell_wall')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('cell_wall', '#059669', 3)}
          />

          {/* Inner Plasma Membrane */}
          <rect
            x="215"
            y="235"
            width="370"
            height="130"
            rx="65"
            fill="url(#bacteriaCytoplasmGrad)"
            onClick={() => onSelectOrganelle('plasma_membrane')}
            onMouseEnter={() => setHoveredOrganelleId('plasma_membrane')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('plasma_membrane', '#10B981', 1.5)}
          />

          {/* Nucleoid chromatin fiber */}
          <path
            d="M 270 300 Q 310 260 340 300 T 380 310 T 330 330 Z"
            fill="none"
            onClick={(e) => { e.stopPropagation(); onSelectOrganelle('nucleoid'); }}
            {...getGlow('nucleoid', '#34D399', 2)}
          />

          {/* Highly refractile glowing Endospore */}
          <g
            onClick={(e) => { e.stopPropagation(); onSelectOrganelle('endospore'); }}
            onMouseEnter={() => setHoveredOrganelleId('endospore')}
            onMouseLeave={() => setHoveredOrganelleId(null)}
            {...getGlow('endospore', '#F59E0B', 3)}
          >
            {/* Outer spore coat */}
            <ellipse cx="480" cy="300" rx="55" ry="42" fill="#1E293B" stroke="#F59E0B" strokeWidth="4" />
            {/* Cortex */}
            <ellipse cx="480" cy="300" rx="42" ry="32" fill="#047857" stroke="#10B981" strokeWidth="2" />
            {/* Spore Core containing DNA and calcium dipicolinate */}
            <ellipse cx="480" cy="300" rx="25" ry="18" fill="#FDE68A" />
          </g>
        </g>
      );
    }

    if (selectedOrganismId === 'bacteria_cyanobacteria') {
      return (
        <g>
          {/* Cyanobacteria Spiral / Disc Filament */}
          <g>
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i}>
                <rect
                  x={180 + i * 85}
                  y="240"
                  width="80"
                  height="140"
                  rx="15"
                  fill="#0D9488"
                  stroke="#14B8A6"
                  strokeWidth="2.5"
                />
                {/* Internal photosynthetic thylakoid lamellae folds */}
                <path
                  d={`M ${195 + i * 85} 260 Q ${220 + i * 85} 280 ${245 + i * 85} 260`}
                  fill="none"
                  stroke="#5EEAD4"
                  strokeWidth="2"
                  opacity="0.7"
                />
                <path
                  d={`M ${195 + i * 85} 320 Q ${220 + i * 85} 340 ${245 + i * 85} 320`}
                  fill="none"
                  stroke="#5EEAD4"
                  strokeWidth="2"
                  opacity="0.7"
                />
                {/* Nucleoid region */}
                <circle cx={220 + i * 85} cy="300" r="10" fill="#0F766E" stroke="#2DD4BF" strokeWidth="1" />
              </g>
            ))}
          </g>
        </g>
      );
    }

    // Default: Kingdom General Models
    switch (currentKingdom) {
      case 'animal':
        return (
          <g>
            {/* Cytoplasm & Plasma Membrane */}
            <path
              d="M 220 120 C 340 70, 560 90, 640 180 C 730 280, 710 440, 600 520 C 490 600, 270 590, 180 500 C 90 410, 100 230, 220 120 Z"
              fill="url(#animalCytoplasmGrad)"
              onClick={() => onSelectOrganelle('plasma_membrane')}
              onMouseEnter={() => setHoveredOrganelleId('plasma_membrane')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              {...getGlow('plasma_membrane', '#38BDF8', 2)}
            />

            {/* Cytoskeleton microfilaments */}
            <path d="M 240 180 Q 320 260 400 200 Q 520 250 600 230" fill="none" stroke="#60A5FA" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
            <path d="M 200 350 Q 280 400 390 350 Q 500 450 580 430" fill="none" stroke="#60A5FA" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />

            {/* Rough ER folds */}
            <g
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('endoplasmic_reticulum'); }}
              onMouseEnter={() => setHoveredOrganelleId('endoplasmic_reticulum')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              className="transition-all"
            >
              <path
                d="M 280 230 C 270 170, 480 160, 500 210 M 270 250 C 250 150, 500 140, 520 220 M 260 270 C 240 130, 520 120, 540 230"
                fill="none"
                {...getGlow('endoplasmic_reticulum', '#818CF8', 4)}
              />
            </g>

            {/* Nucleus */}
            <g
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('nucleus'); }}
              onMouseEnter={() => setHoveredOrganelleId('nucleus')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              className="transition-all"
            >
              <circle cx="390" cy="320" r="88" fill="url(#nucleusGrad)" {...getGlow('nucleus', '#6366F1', 3)} />
              <circle cx="410" cy="300" r="28" fill="#312E81" opacity="0.85" />
            </g>

            {/* Mitochondria */}
            <g
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('mitochondria'); }}
              onMouseEnter={() => setHoveredOrganelleId('mitochondria')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              className="transition-all"
            >
              <ellipse cx="260" cy="420" rx="36" ry="18" fill="url(#mitoGrad)" transform="rotate(-30 260 420)" {...getGlow('mitochondria', '#EA580C', 2)} />
              <ellipse cx="530" cy="270" rx="34" ry="16" fill="url(#mitoGrad)" transform="rotate(45 530 270)" {...getGlow('mitochondria', '#EA580C', 2)} />
              <ellipse cx="330" cy="480" rx="32" ry="16" fill="url(#mitoGrad)" transform="rotate(15 330 480)" {...getGlow('mitochondria', '#EA580C', 2)} />
            </g>

            {/* Golgi Apparatus */}
            <g
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('golgi_apparatus'); }}
              onMouseEnter={() => setHoveredOrganelleId('golgi_apparatus')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              className="transition-all"
            >
              <path
                d="M 480 390 C 530 380, 570 410, 590 430 M 490 410 C 540 400, 580 430, 600 450 M 500 430 C 550 420, 590 450, 610 470"
                fill="none"
                {...getGlow('golgi_apparatus', '#EC4899', 4)}
              />
            </g>

            {/* Lysosomes */}
            <g
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('lysosome'); }}
              onMouseEnter={() => setHoveredOrganelleId('lysosome')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              className="transition-all"
            >
              <circle cx="210" cy="300" r="16" fill="#F43F5E" {...getGlow('lysosome', '#E11D48', 1.5)} />
              <circle cx="480" cy="210" r="14" fill="#F43F5E" {...getGlow('lysosome', '#E11D48', 1.5)} />
            </g>

            {/* Centrosome */}
            <g
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('centrosome'); }}
              onMouseEnter={() => setHoveredOrganelleId('centrosome')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              className="transition-all"
            >
              <circle cx="320" cy="240" r="12" fill="#EAB308" opacity="0.8" {...getGlow('centrosome', '#CA8A04', 1.5)} />
            </g>
          </g>
        );

      case 'plant':
        return (
          <g>
            {/* Rigid Cell Wall */}
            <polygon
              points="160,100 620,90 690,490 570,550 170,540 110,260"
              fill="none"
              strokeLinejoin="round"
              onClick={() => onSelectOrganelle('cell_wall')}
              onMouseEnter={() => setHoveredOrganelleId('cell_wall')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              {...getGlow('cell_wall', '#15803D', 14)}
            />

            {/* Plant Plasma Membrane & Cytoplasm */}
            <polygon
              points="170,110 610,100 680,480 560,540 180,530 120,265"
              fill="url(#plantCytoplasmGrad)"
              onClick={() => onSelectOrganelle('plasma_membrane')}
              onMouseEnter={() => setHoveredOrganelleId('plasma_membrane')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              {...getGlow('plasma_membrane', '#86EFAC', 2)}
            />

            {/* Central Vacuole */}
            <path
              d="M 230 180 C 430 160, 540 190, 560 360 C 580 480, 460 480, 310 470 C 220 460, 200 320, 230 180 Z"
              fill="url(#vacuoleGrad)"
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('central_vacuole'); }}
              onMouseEnter={() => setHoveredOrganelleId('central_vacuole')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              {...getGlow('central_vacuole', '#38BDF8', 2)}
            />

            {/* Chloroplasts */}
            <g
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('chloroplast'); }}
              onMouseEnter={() => setHoveredOrganelleId('chloroplast')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              className="transition-all"
            >
              <ellipse cx="200" cy="160" rx="34" ry="18" fill="url(#chloroGrad)" transform="rotate(25 200 160)" {...getGlow('chloroplast', '#15803D', 2)} />
              <ellipse cx="580" cy="170" rx="36" ry="20" fill="url(#chloroGrad)" transform="rotate(-30 580 170)" {...getGlow('chloroplast', '#15803D', 2)} />
              <ellipse cx="610" cy="380" rx="34" ry="18" fill="url(#chloroGrad)" transform="rotate(70 610 380)" {...getGlow('chloroplast', '#15803D', 2)} />
              <ellipse cx="240" cy="500" rx="32" ry="18" fill="url(#chloroGrad)" transform="rotate(-15 240 500)" {...getGlow('chloroplast', '#15803D', 2)} />
            </g>

            {/* Plant Nucleus */}
            <g
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('nucleus'); }}
              onMouseEnter={() => setHoveredOrganelleId('nucleus')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              className="transition-all"
            >
              <circle cx="580" cy="280" r="50" fill="url(#nucleusGrad)" {...getGlow('nucleus', '#6366F1', 2.5)} />
              <circle cx="590" cy="275" r="16" fill="#312E81" />
            </g>

            {/* Plant Mitochondria */}
            <g
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('mitochondria'); }}
              onMouseEnter={() => setHoveredOrganelleId('mitochondria')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              className="transition-all"
            >
              <ellipse cx="180" cy="360" rx="28" ry="14" fill="url(#mitoGrad)" transform="rotate(80 180 360)" {...getGlow('mitochondria', '#EA580C', 1.5)} />
            </g>
          </g>
        );

      case 'fungi':
        return (
          <g>
            {/* Chitin Wall */}
            <path
              d="M 230 180 C 320 90, 520 110, 600 220 C 680 340, 620 480, 520 530 C 380 580, 220 530, 170 430 C 120 330, 160 230, 230 180 Z"
              fill="none"
              onClick={() => onSelectOrganelle('cell_wall')}
              onMouseEnter={() => setHoveredOrganelleId('cell_wall')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              {...getGlow('cell_wall', '#D97706', 9)}
            />

            {/* Cytoplasm */}
            <path
              d="M 235 185 C 320 100, 510 120, 590 225 C 665 340, 610 470, 515 520 C 380 570, 230 520, 180 425 C 130 330, 170 235, 235 185 Z"
              fill="url(#fungiCytoplasmGrad)"
              onClick={() => onSelectOrganelle('plasma_membrane')}
              onMouseEnter={() => setHoveredOrganelleId('plasma_membrane')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              {...getGlow('plasma_membrane', '#FCD34D', 2)}
            />

            {/* Fungi Nucleus */}
            <g
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('nucleus'); }}
              onMouseEnter={() => setHoveredOrganelleId('nucleus')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              className="transition-all"
            >
              <circle cx="360" cy="310" r="65" fill="url(#nucleusGrad)" {...getGlow('nucleus', '#6366F1', 2.5)} />
              <circle cx="370" cy="300" r="20" fill="#312E81" />
            </g>

            {/* Fungi Vacuole */}
            <circle
              cx="480"
              cy="390"
              r="48"
              fill="url(#vacuoleGrad)"
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('central_vacuole'); }}
              onMouseEnter={() => setHoveredOrganelleId('central_vacuole')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              {...getGlow('central_vacuole', '#38BDF8', 2)}
            />

            {/* Fungi Mitochondria */}
            <g
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('mitochondria'); }}
              onMouseEnter={() => setHoveredOrganelleId('mitochondria')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              className="transition-all"
            >
              <ellipse cx="260" cy="270" rx="30" ry="15" fill="url(#mitoGrad)" transform="rotate(45 260 270)" {...getGlow('mitochondria', '#EA580C', 1.5)} />
              <ellipse cx="450" cy="210" rx="28" ry="14" fill="url(#mitoGrad)" transform="rotate(-30 450 210)" {...getGlow('mitochondria', '#EA580C', 1.5)} />
            </g>
          </g>
        );

      case 'protist':
        return (
          <g>
            {/* Protist Euglena/Paramecium shape */}
            <path
              d="M 180 280 C 220 180, 480 160, 590 240 C 670 310, 620 440, 520 490 C 370 540, 240 480, 180 400 C 140 340, 150 310, 180 280 Z"
              fill="url(#protistCytoplasmGrad)"
              onClick={() => onSelectOrganelle('plasma_membrane')}
              onMouseEnter={() => setHoveredOrganelleId('plasma_membrane')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              {...getGlow('plasma_membrane', '#06B6D4', 2.5)}
            />

            {/* Flagellum with live wave */}
            <path
              d={`M 180 280 Q ${120 + wave * 20} 220, ${90 + wave * 25} 150 T ${50 - wave * 15} 90`}
              fill="none"
              strokeLinecap="round"
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('flagella'); }}
              onMouseEnter={() => setHoveredOrganelleId('flagella')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              {...getGlow('flagella', '#06B6D4', 4)}
            />

            {/* Protist Nucleus */}
            <g
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('nucleus'); }}
              onMouseEnter={() => setHoveredOrganelleId('nucleus')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              className="transition-all"
            >
              <circle cx="430" cy="330" r="60" fill="url(#nucleusGrad)" {...getGlow('nucleus', '#6366F1', 2.5)} />
              <circle cx="430" cy="330" r="18" fill="#312E81" />
            </g>

            {/* Chloroplast in Euglena */}
            <g
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('chloroplast'); }}
              onMouseEnter={() => setHoveredOrganelleId('chloroplast')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              className="transition-all"
            >
              <ellipse cx="320" cy="240" rx="30" ry="15" fill="url(#chloroGrad)" transform="rotate(35 320 240)" {...getGlow('chloroplast', '#15803D', 2)} />
              <ellipse cx="500" cy="250" rx="32" ry="16" fill="url(#chloroGrad)" transform="rotate(-25 500 250)" {...getGlow('chloroplast', '#15803D', 2)} />
            </g>

            {/* Contractile Vacuole */}
            <circle
              cx="260"
              cy="340"
              r={24 + pulse * 6}
              fill="url(#vacuoleGrad)"
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('contractile_vacuole'); }}
              onMouseEnter={() => setHoveredOrganelleId('contractile_vacuole')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              {...getGlow('contractile_vacuole', '#0284C7', 2)}
            />
          </g>
        );

      case 'bacteria':
        return (
          <g>
            {/* Capsule */}
            <rect
              x="200"
              y="180"
              width="380"
              height="240"
              rx="120"
              fill="none"
              strokeDasharray="6 4"
              onClick={() => onSelectOrganelle('capsule')}
              onMouseEnter={() => setHoveredOrganelleId('capsule')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              {...getGlow('capsule', '#047857', 16)}
            />

            {/* Peptidoglycan Cell Wall */}
            <rect
              x="210"
              y="190"
              width="360"
              height="220"
              rx="110"
              fill="none"
              onClick={() => onSelectOrganelle('cell_wall')}
              onMouseEnter={() => setHoveredOrganelleId('cell_wall')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              {...getGlow('cell_wall', '#059669', 9)}
            />

            {/* Plasma Membrane & Cytoplasm */}
            <rect
              x="220"
              y="200"
              width="340"
              height="200"
              rx="100"
              fill="url(#bacteriaCytoplasmGrad)"
              onClick={() => onSelectOrganelle('plasma_membrane')}
              onMouseEnter={() => setHoveredOrganelleId('plasma_membrane')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              {...getGlow('plasma_membrane', '#34D399', 2)}
            />

            {/* Nucleoid (ADN vòng trần) */}
            <g
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('nucleoid'); }}
              onMouseEnter={() => setHoveredOrganelleId('nucleoid')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              className="transition-all"
            >
              <path
                d="M 310 270 C 350 230, 420 250, 440 280 C 470 310, 430 350, 390 330 C 350 310, 320 340, 310 320 Z"
                fill="none"
                strokeDasharray="2 2"
                {...getGlow('nucleoid', '#10B981', 4)}
              />
            </g>

            {/* Flagellum with wave */}
            <path
              d={`M 560 300 Q ${650 + wave * 15} 250, ${710 + wave * 20} 320 T ${800 - wave * 15} 290`}
              fill="none"
              strokeLinecap="round"
              onClick={(e) => { e.stopPropagation(); onSelectOrganelle('flagella'); }}
              onMouseEnter={() => setHoveredOrganelleId('flagella')}
              onMouseLeave={() => setHoveredOrganelleId(null)}
              {...getGlow('flagella', '#10B981', 3.5)}
            />
          </g>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Left/Main Column: Controls & Stage */}
      <div className="flex-1 w-full space-y-4">
        {/* Kingdom Switcher Tab Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['animal', 'plant', 'fungi', 'protist', 'bacteria'] as CellKingdom[]).map((k) => {
              const info = CELL_TYPES[k];
              const isSelected = currentKingdom === k;
              return (
                <button
                  key={k}
                  onClick={() => {
                    onSelectKingdom(k);
                    if (onSelectOrganismId) onSelectOrganismId(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 ring-1 ring-blue-400/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: info.colorTheme }}
                  />
                  <span>{info.nameVi.split(' (')[0]}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 font-mono px-2">
            Kính hiển vi: <span className="text-blue-400 font-semibold">{cell.nameEn}</span>
          </div>
        </div>

        {/* Organism Selector Bar (Expanded Library with 18 Organisms) */}
        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5 px-1 shrink-0">
            <Dna className="w-3.5 h-3.5 text-blue-400" />
            <span>Mẫu loài ({kingdomOrganisms.length} dạng):</span>
          </span>

          <button
            onClick={() => onSelectOrganismId && onSelectOrganismId(null)}
            className={`px-2.5 py-1 rounded-md transition-all ${
              !selectedOrganismId
                ? 'bg-slate-700 text-white font-medium shadow-sm'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Mẫu điển hình ({cell.nameVi.split(' (')[0]})
          </button>

          {kingdomOrganisms.map((org) => {
            const isSelected = selectedOrganismId === org.id;
            return (
              <button
                key={org.id}
                onClick={() => onSelectOrganismId && onSelectOrganismId(org.id)}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/50'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: org.colorTheme }} />
                <span>{org.nameVi.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Time Control Bar */}
        <TimeControlBar
          state={timeState}
          onTogglePlay={() => setTimeState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))}
          onSetSpeed={(speed) => setTimeState((prev) => ({ ...prev, speed }))}
          onStep={(dir) =>
            setTimeState((prev) => {
              const delta = (dir === 'forward' ? 1 : -1) * 0.5;
              const nextTime = Math.max(0, Math.min(prev.maxTimeSec, prev.timeSec + delta));
              return { ...prev, timeSec: Number(nextTime.toFixed(2)) };
            })
          }
          onRewindToggle={() =>
            setTimeState((prev) => ({
              ...prev,
              direction: prev.direction === 'forward' ? 'backward' : 'forward',
            }))
          }
          onReset={() => setTimeState((prev) => ({ ...prev, timeSec: 0 }))}
          onSeek={(time) => setTimeState((prev) => ({ ...prev, timeSec: time }))}
          label="Tốc độ vận động tế bào (Cilia, Roi bơi & Dòng tế bào chất Cyclosis)"
        />

        {/* Microscope Stage Viewport */}
        <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-[520px] select-none">
          {/* Circular aperture lens border overlay */}
          <div className="absolute inset-0 pointer-events-none rounded-2xl border-[16px] border-slate-950 z-20 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]" />

          {/* Reticle / Micrometer scale lines */}
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-25">
            <div className="w-full h-[1px] bg-cyan-400" />
            <div className="h-full w-[1px] bg-cyan-400 absolute" />
            <div className="w-48 h-48 rounded-full border border-cyan-400 absolute" />
            <div className="w-96 h-96 rounded-full border border-cyan-400/50 absolute" />
          </div>

          {/* Lens HUD Top Left: Organism & Magnification */}
          <div className="absolute top-5 left-5 z-30 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-xl px-3.5 py-2 text-xs flex flex-col gap-0.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeOrganism ? activeOrganism.colorTheme : cell.colorTheme }} />
              {activeOrganism ? activeOrganism.nameVi : cell.nameVi}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Độ phóng đại: <span className="text-amber-400 font-semibold">{zoomLevel}x</span> · Thước đo: ~{cell.averageSizeMicrons}
            </span>
          </div>

          {/* Staining Filter Badge Top Right */}
          <div className="absolute top-5 right-5 z-30 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-300 flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>Nhuộm: <strong className="text-white">{activeStain.nameVi.split(' (')[0]}</strong></span>
          </div>

          {/* Live Zoom / Focus / Pan Viewport */}
          <div
            className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center relative overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg
              viewBox="0 0 800 600"
              className="w-full h-full transition-transform duration-100 ease-out"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                filter: `blur(${blurAmount}px) ${activeStain.filterCss}`,
              }}
            >
              <defs>
                {/* Gradients for organelles */}
                <radialGradient id="animalCytoplasmGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
                </radialGradient>
                <radialGradient id="plantCytoplasmGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#064E3B" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#022C22" stopOpacity="0.85" />
                </radialGradient>
                <radialGradient id="fungiCytoplasmGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#78350F" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#451A03" stopOpacity="0.85" />
                </radialGradient>
                <radialGradient id="protistCytoplasmGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0E7490" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#164E63" stopOpacity="0.85" />
                </radialGradient>
                <radialGradient id="bacteriaCytoplasmGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#065F46" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#022C22" stopOpacity="0.9" />
                </radialGradient>
                <radialGradient id="nucleusGrad" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#A5B4FC" />
                  <stop offset="60%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#3730A3" />
                </radialGradient>
                <radialGradient id="mitoGrad" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#FDBA74" />
                  <stop offset="70%" stopColor="#EA580C" />
                  <stop offset="100%" stopColor="#9A3412" />
                </radialGradient>
                <radialGradient id="chloroGrad" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#86EFAC" />
                  <stop offset="70%" stopColor="#16A34A" />
                  <stop offset="100%" stopColor="#14532D" />
                </radialGradient>
                <radialGradient id="vacuoleGrad" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
                </radialGradient>
                <linearGradient id="bacWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#047857" />
                  <stop offset="100%" stopColor="#064E3B" />
                </linearGradient>
              </defs>

              {renderCellGraphic()}
            </svg>
          </div>

          {/* Bottom Floating Control Bar (Zoom, Focus, Stains, Reset) */}
          <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-xl px-4 py-2.5 text-xs">
            {/* Magnification presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold mr-1">Vật kính:</span>
              {[100, 400, 1000, 2500].map((z) => (
                <button
                  key={z}
                  onClick={() => setZoomLevel(z)}
                  className={`px-2.5 py-1 rounded font-mono font-semibold transition-all ${
                    zoomLevel === z
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {z}x
                </button>
              ))}
            </div>

            {/* Fine Focus Micrometer Dial */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Ốc vi cấp:</span>
              <input
                type="range"
                min="-6"
                max="6"
                step="0.5"
                value={focusOffset}
                onChange={(e) => setFocusOffset(parseFloat(e.target.value))}
                className="w-24 accent-blue-500 cursor-pointer"
              />
              <span className={`font-mono text-[11px] ${focusOffset === 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                {focusOffset === 0 ? 'Sắc nét' : `${focusOffset > 0 ? '+' : ''}${focusOffset}`}
              </span>
            </div>

            {/* Staining Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">Thuốc nhuộm:</span>
              <select
                value={stainId}
                onChange={(e) => setStainId(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {STAINING_METHODS.map((stain) => (
                  <option key={stain.id} value={stain.id}>
                    {stain.nameVi.split(' (')[0]}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={resetView}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1"
              title="Đặt lại khung nhìn (Reset)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Gốc</span>
            </button>
          </div>
        </div>

        {/* Organelle Click-Highlight Chips */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">
              Bào quan hiện diện trong mẫu ({cell.organellesIncluded.length}):
            </span>
            <span className="text-[11px]">Click để xem giải phẫu & chức năng</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cell.organellesIncluded.map((orgId) => {
              const org = ORGANELLES[orgId];
              if (!org) return null;
              const isSelected = selectedOrganelleId === orgId;
              const isHovered = hoveredOrganelleId === orgId;
              return (
                <button
                  key={orgId}
                  onClick={() => onSelectOrganelle(isSelected ? null : orgId)}
                  onMouseEnter={() => setHoveredOrganelleId(orgId)}
                  onMouseLeave={() => setHoveredOrganelleId(null)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                      : isHovered
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: org.markerColor }}
                  />
                  <span>{org.nameVi}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Detailed Biological Inspector Card */}
      <div className="w-full lg:w-96 flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        {activeOrganelle ? (
          <div className="flex flex-col h-full animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] text-blue-400 font-mono tracking-wide uppercase">
                  {activeOrganelle.nameEn}
                </span>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activeOrganelle.markerColor }}
                  />
                  {activeOrganelle.nameVi}
                </h3>
              </div>
              <button
                onClick={() => onSelectOrganelle(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/60 cursor-pointer"
              >
                Đóng
              </button>
            </div>

            <div className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">
                {activeOrganelle.description}
              </div>

              <div>
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Chức năng sinh học
                </h4>
                <p className="text-slate-300 leading-relaxed bg-slate-800/40 p-2.5 rounded border border-slate-800/70">
                  {activeOrganelle.functionVi}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  Cấu trúc siêu vi
                </h4>
                <p className="text-slate-300 leading-relaxed bg-slate-800/40 p-2.5 rounded border border-slate-800/70">
                  {activeOrganelle.ultrastructureVi}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  Thành phần sinh hóa
                </h4>
                <p className="text-slate-300 leading-relaxed bg-slate-800/40 p-2.5 rounded border border-slate-800/70">
                  {activeOrganelle.biochemistryVi}
                </p>
              </div>

              {activeOrganelle.evolutionVi && (
                <div>
                  <h4 className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Thuyết tiến hóa & Nội cộng sinh
                  </h4>
                  <p className="text-purple-200/90 leading-relaxed bg-purple-950/30 p-2.5 rounded border border-purple-900/50">
                    {activeOrganelle.evolutionVi}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  Phản ứng nhuộm hiển vi
                </h4>
                <p className="text-slate-400 leading-relaxed bg-slate-800/40 p-2.5 rounded border border-slate-800/70 text-[11px]">
                  {activeOrganelle.stainingNotes}
                </p>
              </div>

              <div className="pt-2">
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Hiện diện ở 5 giới sinh vật
                </h4>
                <div className="grid grid-cols-5 gap-1 text-center font-mono text-[10px]">
                  {(['animal', 'plant', 'fungi', 'protist', 'bacteria'] as CellKingdom[]).map((k) => {
                    const present = activeOrganelle.presence[k];
                    return (
                      <div
                        key={k}
                        className={`p-1.5 rounded border ${
                          present
                            ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-300'
                            : 'bg-slate-950/40 border-slate-800 text-slate-600'
                        }`}
                      >
                        <div className="font-sans font-semibold mb-0.5">
                          {k === 'animal' ? 'Đ.Vật' : k === 'plant' ? 'T.Vật' : k === 'fungi' ? 'Nấm' : k === 'protist' ? 'N.Sinh' : 'V.Khuẩn'}
                        </div>
                        <div>{present ? '✓ Có' : '—'}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : activeOrganism ? (
          /* Profile of Specialized Organism */
          <div className="flex flex-col h-full animate-fadeIn">
            <div className="pb-3 border-b border-slate-800">
              <span className="text-[11px] text-blue-400 font-mono tracking-wide">
                {activeOrganism.scientificName}
              </span>
              <h3 className="text-lg font-bold text-slate-100 mt-0.5 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeOrganism.colorTheme }} />
                {activeOrganism.nameVi}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Phân loại: <span className="text-slate-200">{activeOrganism.classificationVi}</span>
              </p>
            </div>

            <div className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">
                {activeOrganism.scientificSummaryVi}
              </div>

              <div>
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  Chức năng chuyên hóa
                </h4>
                <p className="text-slate-300 leading-relaxed bg-slate-800/40 p-2.5 rounded border border-slate-800/70">
                  {activeOrganism.specializedRoleVi}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Cấu trúc độc đáo (Unique Ultrastructures)
                </h4>
                <ul className="space-y-1.5">
                  {activeOrganism.uniqueStructuresVi.map((struct, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300 bg-slate-800/40 p-2 rounded border border-slate-800/60">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{struct}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Chuyển hóa & Sinh lý
                </h4>
                <div className="space-y-1">
                  {activeOrganism.metabolismTypes.map((m, idx) => (
                    <div key={idx} className="text-xs text-emerald-400 font-medium bg-emerald-950/30 border border-emerald-900/40 px-2.5 py-1.5 rounded">
                      ⚡ {m}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Phương pháp nhuộm tiêu bản
                </h4>
                <ul className="space-y-1">
                  {activeOrganism.stainingReactions.map((stain, idx) => (
                    <li key={idx} className="text-slate-400 text-[11px] bg-slate-800/40 px-2.5 py-1 rounded border border-slate-800/60">
                      🧪 {stain}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="pb-3 border-b border-slate-800">
              <span className="text-[11px] text-blue-400 font-mono tracking-wide">
                {cell.taxonVi}
              </span>
              <h3 className="text-lg font-bold text-slate-100 mt-0.5">
                {cell.nameVi}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Bản chất: <span className="text-slate-200 font-semibold">{cell.cellNature}</span>
              </p>
            </div>

            <div className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">
                {cell.scientificSummaryVi}
              </div>

              <div>
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Đặc điểm hình thái nhận diện
                </h4>
                <ul className="space-y-2">
                  {cell.keyFeaturesVi.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300 bg-slate-800/40 p-2 rounded border border-slate-800/60">
                      <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Con đường chuyển hóa & Năng lượng
                </h4>
                <div className="space-y-1">
                  {cell.metabolismTypes.map((m, idx) => (
                    <div key={idx} className="text-xs text-emerald-400 font-medium bg-emerald-950/30 border border-emerald-900/40 px-2.5 py-1.5 rounded">
                      ⚡ {m}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Hình thức phân bào
                </h4>
                <p className="text-slate-300 bg-slate-800/40 p-2 rounded border border-slate-800/60">
                  {cell.reproductionType}
                </p>
              </div>

              <div className="p-3 bg-blue-950/30 border border-blue-900/40 rounded-lg text-blue-200 text-[11px]">
                💡 <span className="font-semibold">Mẹo quan sát:</span> Chọn bất kỳ loài nào trong danh sách mẫu loài bên trên (Neuron, Tế bào khí khổng, Trùng đế giày, Vi khuẩn sinh bào tử...) hoặc click vào bào quan để kiểm tra hồ sơ siêu vi chi tiết!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
