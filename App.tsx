import React, { useState } from 'react';
import WaveCanvas from './components/WaveCanvas';
import Dynamic1DPlot from './components/LinePlots';
import Controls from './components/Controls';
import Theory from './components/Theory';
import { DEFAULT_ANGLE, DEFAULT_SPEED, SIDE_PLOT_SIZE } from './constants';

function App() {
  const [angle, setAngle] = useState<number>(DEFAULT_ANGLE);
  const [speed, setSpeed] = useState<number>(DEFAULT_SPEED);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [showComponent, setShowComponent] = useState<'total' | 'incident' | 'reflected'>('total');

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    EM
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
                斜入射波合成演示 (Plane Wave Oblique Incidence)
                </h1>
            </div>
            <div className="text-xs text-slate-400 hidden sm:block">
                Powered by React & Tailwind
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visualization */}
        <div className="lg:col-span-7 flex flex-col gap-6">
           
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
             {/* Visualization Grid Layout */}
             <div className="flex flex-col">
                {/* Row 1: Vertical Plot + Main Canvas */}
                <div className="flex flex-row">
                    <div className="border-r border-slate-200">
                        <Dynamic1DPlot 
                            angle={angle}
                            speed={speed}
                            isRunning={isRunning}
                            orientation="vertical"
                        />
                    </div>
                    <div>
                        <WaveCanvas 
                            angle={angle} 
                            speed={speed}
                            isRunning={isRunning} 
                            showComponent={showComponent} 
                        />
                    </div>
                </div>
                {/* Row 2: Spacer + Horizontal Plot */}
                <div className="flex flex-row">
                    {/* Spacer for Vertical Plot width */}
                    <div style={{ width: SIDE_PLOT_SIZE }} className="border-r border-slate-200 bg-slate-50"></div>
                    
                    <div className="border-t border-slate-200">
                        <Dynamic1DPlot 
                            angle={angle}
                            speed={speed}
                            isRunning={isRunning}
                            orientation="horizontal"
                        />
                    </div>
                    {/* Spacer for Envelope width (part of main canvas width) */}
                    {/* Main canvas has width 500. Sim width is 420. Side Plot Size is 80.
                        Vertical plot is 80.
                        Horizontal plot is 420.
                        So horizontal plot aligns with sim part.
                        We need to fill the rest if we want a complete box, but it's empty space.
                    */}
                </div>
             </div>
             <p className="mt-4 text-xs text-slate-400 text-center">
                左侧: 垂直分量 (驻波) &nbsp;&nbsp; | &nbsp;&nbsp; 中间: 2D 合成场 &nbsp;&nbsp; | &nbsp;&nbsp; 下方: 水平分量 (行波)
             </p>
           </div>
           
           <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
             <strong className="block mb-1">👀 观察指南:</strong>
             <ul className="list-disc pl-4 space-y-1">
                <li><strong>左侧 (竖直):</strong> 观察波形在原地上下振荡，某些位置（波节）始终不动。这就是垂直方向的<strong>驻波</strong>特性。</li>
                <li><strong>下方 (水平):</strong> 观察波形像传送带一样向右连续移动。这就是水平方向的<strong>行波</strong>特性。</li>
                <li><strong>中间 (2D):</strong> 这是上述两个分量合成的整体效果。</li>
             </ul>
           </div>

           <Theory />
        </div>

        {/* Right Column: Controls & Info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
            <Controls 
                angle={angle} 
                setAngle={setAngle}
                speed={speed}
                setSpeed={setSpeed}
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                showComponent={showComponent}
                setShowComponent={setShowComponent}
            />

            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-4">当前参数 (Parameters)</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-slate-50 rounded border border-slate-100">
                        <span className="text-slate-500 block text-xs">入射角 (θi)</span>
                        <span className="font-mono text-lg font-medium">{angle}°</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-100">
                        <span className="text-slate-500 block text-xs">相速 v_px</span>
                        <span className="font-mono text-lg font-medium">{(1 / Math.sin(Math.max(0.1, angle) * Math.PI / 180)).toFixed(2)} c</span>
                    </div>
                     <div className="p-3 bg-slate-50 rounded border border-slate-100">
                        <span className="text-slate-500 block text-xs">kx (行波分量)</span>
                        <span className="font-mono text-lg font-medium">{(Math.sin(angle * Math.PI / 180)).toFixed(3)} k</span>
                    </div>
                     <div className="p-3 bg-slate-50 rounded border border-slate-100">
                        <span className="text-slate-500 block text-xs">kz (驻波分量)</span>
                        <span className="font-mono text-lg font-medium">{(Math.cos(angle * Math.PI / 180)).toFixed(3)} k</span>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}

export default App;