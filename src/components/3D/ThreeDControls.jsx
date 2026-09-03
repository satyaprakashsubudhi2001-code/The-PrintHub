import React, { useState } from 'react';
import {
  Rotate3d,
  Camera,
  Sun,
  Grid,
  Maximize2,
  Minimize2,
  RefreshCw,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { STUDIO_ENVIRONMENTS } from '../../constants/presets';

export function ThreeDControls({ onTakeSnapshot, onToggleFullscreen, isFullscreen }) {
  const {
    cameraPreset,
    setCameraView,
    isAutoRotate,
    setIsAutoRotate,
    showPrintBoundary,
    setShowPrintBoundary,
    showWireframe,
    setShowWireframe,
    activeEnvironment,
    setActiveEnvironment,
    currentTheme,
  } = useStore();

  const [showEnvMenu, setShowEnvMenu] = useState(false);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-4 z-10 select-none">
      {/* Top Floating Bar */}
      <div className="flex items-center justify-between w-full">
        {/* Environment selector */}
        <div className="relative pointer-events-auto">
          <button
            onClick={() => setShowEnvMenu(!showEnvMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs font-medium text-slate-200 hover:text-white hover:border-indigo-500/50 transition-all shadow-studio-subtle"
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>{activeEnvironment.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showEnvMenu && (
            <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl glass-dropdown p-2 z-50 border border-slate-700/60 animate-in fade-in slide-in-from-top-2">
              <div className="text-[10px] font-bold tracking-wider text-slate-400 px-2 py-1 uppercase">
                Studio Environments
              </div>
              <div className="space-y-1 mt-1">
                {STUDIO_ENVIRONMENTS.map((env) => (
                  <button
                    key={env.id}
                    onClick={() => {
                      setActiveEnvironment(env);
                      setShowEnvMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex flex-col transition-all ${
                      activeEnvironment.id === env.id
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{env.name}</span>
                      {activeEnvironment.id === env.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal mt-0.5 line-clamp-1">
                      {env.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Right Quick Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Print Area Bounds Toggle */}
          <button
            onClick={() => setShowPrintBoundary(!showPrintBoundary)}
            title="Toggle Print Boundary Guide"
            className={`p-2 rounded-xl glass-panel text-xs transition-all ${
              showPrintBoundary
                ? 'text-indigo-400 border-indigo-500/50 bg-indigo-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Wireframe Toggle */}
          <button
            onClick={() => setShowWireframe(!showWireframe)}
            title="Toggle Wireframe Mesh"
            className={`p-2 rounded-xl glass-panel text-xs transition-all ${
              showWireframe
                ? 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Auto-Rotate 360 */}
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            title="Toggle 360° Auto-Spin"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl glass-panel text-xs font-medium transition-all ${
              isAutoRotate
                ? 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Rotate3d className={`w-4 h-4 ${isAutoRotate ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">360° Spin</span>
          </button>

          {/* Snapshot Capture */}
          <button
            onClick={onTakeSnapshot}
            title="Capture High-Res 3D Snapshot"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r ${currentTheme.gradient} ${currentTheme.glow} text-white text-xs font-semibold transition-all`}
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Snapshot</span>
          </button>

          {/* Fullscreen Toggle */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white text-xs transition-all"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Center Gesture Hint */}
      <div className="self-center flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel-subtle text-[11px] text-slate-300/90 pointer-events-none backdrop-blur-md">
        <span>🔄 Drag to Rotate 360°</span>
        <span className="text-slate-600">•</span>
        <span>🔍 Scroll to Zoom</span>
      </div>

      {/* Bottom Floating Camera View Dials */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 pointer-events-auto pb-1">
        <div className="flex items-center p-1.5 rounded-2xl glass-panel gap-1 shadow-2xl border border-slate-700/60">
          <button
            onClick={() => setCameraView('front')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              cameraPreset === 'front'
                ? `bg-gradient-to-r ${currentTheme.gradient} text-white ${currentTheme.glow}`
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            Front View
          </button>

          <button
            onClick={() => setCameraView('back')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              cameraPreset === 'back'
                ? `bg-gradient-to-r ${currentTheme.gradient} text-white ${currentTheme.glow}`
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            Back View
          </button>

          <button
            onClick={() => setCameraView('left')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all hidden sm:block ${
              cameraPreset === 'left'
                ? `bg-gradient-to-r ${currentTheme.gradient} text-white ${currentTheme.glow}`
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            Left
          </button>

          <button
            onClick={() => setCameraView('right')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all hidden sm:block ${
              cameraPreset === 'right'
                ? `bg-gradient-to-r ${currentTheme.gradient} text-white ${currentTheme.glow}`
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            Right
          </button>

          <div className="w-[1px] h-5 bg-slate-700 mx-1"></div>

          <button
            onClick={() => setCameraView('reset')}
            title="Reset Camera View"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
