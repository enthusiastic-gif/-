import React from 'react';
import { Play, Pause, FastForward, Activity } from 'lucide-react';

interface ControlsProps {
  angle: number;
  setAngle: (val: number) => void;
  speed: number;
  setSpeed: (val: number) => void;
  isRunning: boolean;
  setIsRunning: (val: boolean) => void;
  showComponent: 'total' | 'incident' | 'reflected';
  setShowComponent: (val: 'total' | 'incident' | 'reflected') => void;
}

const Controls: React.FC<ControlsProps> = ({
  angle,
  setAngle,
  speed,
  setSpeed,
  isRunning,
  setIsRunning,
  showComponent,
  setShowComponent,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-800">控制面板 (Controls)</h2>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors ${
            isRunning ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
          }`}
        >
          {isRunning ? <><Pause size={18} /> 暂停</> : <><Play size={18} /> 播放</>}
        </button>
      </div>

      {/* Angle Slider */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-slate-600 items-end">
          <label htmlFor="angle-slider" className="font-medium">入射角 (Incident Angle) θᵢ</label>
          <span className="font-mono text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">{angle}°</span>
        </div>
        <input
          id="angle-slider"
          type="range"
          min="0"
          max="89"
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500"
        />
        <div className="flex justify-between text-xs text-slate-400 px-1">
          <span>0° (垂直入射)</span>
          <span>90° (掠入射)</span>
        </div>
      </div>

      {/* Speed Slider */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between text-sm text-slate-600 items-end">
          <label htmlFor="speed-slider" className="font-medium flex items-center gap-1"><FastForward size={14}/> 动画速度 (Speed)</label>
          <span className="font-mono text-slate-500 text-xs">{speed.toFixed(2)}x</span>
        </div>
        <input
          id="speed-slider"
          type="range"
          min="0.01"
          max="0.2"
          step="0.01"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500 hover:accent-slate-400"
        />
      </div>

      {/* View Mode */}
      <div className="space-y-3 pt-2">
        <span className="text-sm font-medium text-slate-600 flex items-center gap-1"><Activity size={14}/> 显示模式 (View Mode)</span>
        <div className="grid grid-cols-3 gap-2">
          {(['total', 'incident', 'reflected'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setShowComponent(mode)}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all capitalize border ${
                showComponent === mode
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {mode === 'total' ? '合成波 (Total)' : mode === 'incident' ? '入射波' : '反射波'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Controls;