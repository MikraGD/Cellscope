import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
  Clock,
  Gauge
} from 'lucide-react';

export interface TimeControlState {
  isPlaying: boolean;
  speed: number; // 0.25, 0.5, 1, 2, 5, 10
  timeSec: number;
  maxTimeSec: number;
  direction: 'forward' | 'backward';
}

interface TimeControlBarProps {
  state: TimeControlState;
  onTogglePlay: () => void;
  onSetSpeed: (speed: number) => void;
  onStep: (direction: 'forward' | 'backward') => void;
  onRewindToggle: () => void;
  onReset: () => void;
  onSeek: (timeSec: number) => void;
  label?: string;
  compact?: boolean;
}

export const TimeControlBar: React.FC<TimeControlBarProps> = ({
  state,
  onTogglePlay,
  onSetSpeed,
  onStep,
  onRewindToggle,
  onReset,
  onSeek,
  label = 'Dòng thời gian mô phỏng',
  compact = false,
}) => {
  const speeds = [0.25, 0.5, 1, 2, 5, 10];

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = Math.floor(sec % 60);
    const tenths = Math.floor((sec % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}.${tenths}s`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col gap-2.5 text-xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Title & Live Time indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{label}</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="font-mono text-cyan-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {formatTime(state.timeSec)}
          </div>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
            state.isPlaying ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
          }`}>
            {state.isPlaying ? (state.direction === 'forward' ? `▶ Đang chạy (${state.speed}x)` : `◀ Đang tua lùi (${state.speed}x)`) : '⏸ Tạm dừng'}
          </span>
        </div>

        {/* Playback action buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {/* Rewind Direction Toggle */}
          <button
            onClick={onRewindToggle}
            className={`p-1.5 rounded transition cursor-pointer ${
              state.direction === 'backward' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Đảo chiều phát lùi"
            aria-label="Đảo chiều phát lùi"
          >
            <Rewind className="w-3.5 h-3.5" />
          </button>

          {/* Step Backward 1 frame */}
          <button
            onClick={() => onStep('backward')}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Lùi 1 bước (Khung hình)"
            aria-label="Lùi 1 bước"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={onTogglePlay}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded transition flex items-center gap-1 cursor-pointer"
            title={state.isPlaying ? 'Tạm dừng mô phỏng (Phím Space)' : 'Phát tiếp mô phỏng'}
            aria-label={state.isPlaying ? 'Tạm dừng' : 'Phát tiếp'}
          >
            {state.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{state.isPlaying ? 'Dừng' : 'Chạy'}</span>
          </button>

          {/* Step Forward 1 frame */}
          <button
            onClick={() => onStep('forward')}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Tiến 1 bước (Khung hình)"
            aria-label="Tiến 1 bước"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Fast-forward toggle */}
          <button
            onClick={() => {
              const nextSpeed = state.speed < 5 ? 5 : 10;
              onSetSpeed(nextSpeed);
            }}
            className={`p-1.5 rounded transition cursor-pointer ${
              state.speed >= 5 ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Tua siêu tốc (5x/10x)"
            aria-label="Tua siêu tốc"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>

          {/* Reset button */}
          <button
            onClick={onReset}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Đặt lại thời gian về 00:00"
            aria-label="Đặt lại thời gian"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Multiplier segmented buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-500 font-mono px-1 flex items-center gap-0.5">
            <Gauge className="w-3 h-3 text-slate-400" />
            Tốc độ:
          </span>
          {speeds.map((spd) => (
            <button
              key={spd}
              onClick={() => onSetSpeed(spd)}
              className={`px-2 py-0.5 rounded font-mono text-[11px] transition cursor-pointer ${
                state.speed === spd
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Scrubbing timeline slider */}
      {!compact && (
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-500 font-mono">00:00</span>
          <input
            type="range"
            min="0"
            max={state.maxTimeSec}
            step="0.1"
            value={state.timeSec}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 font-mono">{formatTime(state.maxTimeSec)}</span>
        </div>
      )}
    </div>
  );
};
