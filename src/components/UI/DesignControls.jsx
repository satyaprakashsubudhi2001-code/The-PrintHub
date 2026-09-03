import React from 'react';
import {
  Move,
  Maximize2,
  RotateCw,
  AlignCenter,
  Sparkles,
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
  Copy,
  Trash2,
  Sliders,
  Eye,
} from 'lucide-react';
import { useCustomizer } from '../../context/CustomizerContext';

export function DesignControls() {
  const {
    activeLayer,
    designs,
    updateDesign,
    duplicateDesign,
    removeDesign,
    texts,
    updateText,
    duplicateText,
    removeText,
    cliparts,
    updateClipart,
    removeClipart,
    centerActiveLayer,
    fitActiveLayer,
    resetActiveLayer,
  } = useCustomizer();

  // Find active item
  let item = null;
  if (activeLayer.type === 'design') {
    item = designs.find((d) => d.id === activeLayer.id);
  } else if (activeLayer.type === 'text') {
    item = texts.find((t) => t.id === activeLayer.id);
  } else if (activeLayer.type === 'clipart') {
    item = cliparts.find((c) => c.id === activeLayer.id);
  }

  if (!item) {
    return (
      <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/40 text-center">
        <p className="text-xs text-slate-400">
          Select an artwork or text layer to adjust position, scale & rotation.
        </p>
      </div>
    );
  }

  const handleUpdate = (updates) => {
    if (activeLayer.type === 'design') updateDesign(item.id, updates);
    else if (activeLayer.type === 'text') updateText(item.id, updates);
    else if (activeLayer.type === 'clipart') updateClipart(item.id, updates);
  };

  const handleFlipH = () => {
    handleUpdate({ flipX: !item.flipX });
  };

  const handleFlipV = () => {
    handleUpdate({ flipY: !item.flipY });
  };

  return (
    <div className="space-y-4 p-4 rounded-2xl glass-panel border border-slate-700/60 animate-in fade-in select-none">
      {/* Header with Quick Actions */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-bold text-white block">
            {item.name || (activeLayer.type === 'text' ? `Text: "${item.text}"` : 'Layer Transform')}
          </span>
          <span className="text-[10px] text-brand-400 font-mono uppercase">
            ZONE: {item.printArea.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (activeLayer.type === 'design') duplicateDesign(item.id);
              else if (activeLayer.type === 'text') duplicateText(item.id);
            }}
            title="Duplicate Layer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (activeLayer.type === 'design') removeDesign(item.id);
              else if (activeLayer.type === 'text') removeText(item.id);
              else if (activeLayer.type === 'clipart') removeClipart(item.id);
            }}
            title="Delete Layer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Helper Alignment Buttons */}
      <div className="grid grid-cols-4 gap-1.5">
        <button
          onClick={centerActiveLayer}
          className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-brand-500/50 text-slate-300 hover:text-white text-[10px] font-semibold transition-all"
        >
          <AlignCenter className="w-3.5 h-3.5 text-brand-400" />
          <span>Center</span>
        </button>

        <button
          onClick={fitActiveLayer}
          className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-brand-500/50 text-slate-300 hover:text-white text-[10px] font-semibold transition-all"
        >
          <Maximize2 className="w-3.5 h-3.5 text-brand-accent" />
          <span>Fit Area</span>
        </button>

        <button
          onClick={handleFlipH}
          className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-brand-500/50 text-slate-300 hover:text-white text-[10px] font-semibold transition-all"
        >
          <FlipHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span>Flip H</span>
        </button>

        <button
          onClick={resetActiveLayer}
          className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-brand-500/50 text-slate-300 hover:text-white text-[10px] font-semibold transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sliders: Scale */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>Scale / Size</span>
          <span className="font-mono text-brand-400">{Math.round((item.scale || 1) * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.2"
          max="2.2"
          step="0.02"
          value={item.scale || 1}
          onChange={(e) => handleUpdate({ scale: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />
      </div>

      {/* Sliders: Rotation */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>Rotation Angle</span>
          <span className="font-mono text-brand-400">{item.rotation || 0}°</span>
        </div>
        <input
          type="range"
          min="-180"
          max="180"
          value={item.rotation || 0}
          onChange={(e) => handleUpdate({ rotation: parseInt(e.target.value) })}
          className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />
      </div>

      {/* Sliders: X Position */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>Horizontal Position (X)</span>
          <span className="font-mono text-brand-400">
            {(item.x || 0) > 0 ? `+${Math.round((item.x || 0) * 100)}` : Math.round((item.x || 0) * 100)}
          </span>
        </div>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={item.x || 0}
          onChange={(e) => handleUpdate({ x: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />
      </div>

      {/* Sliders: Y Position */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>Vertical Position (Y)</span>
          <span className="font-mono text-brand-400">
            {(item.y || 0) > 0 ? `+${Math.round((item.y || 0) * 100)}` : Math.round((item.y || 0) * 100)}
          </span>
        </div>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={item.y || 0}
          onChange={(e) => handleUpdate({ y: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />
      </div>

      {/* Sliders: Opacity */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>Layer Opacity</span>
          <span className="font-mono text-brand-400">
            {Math.round((item.opacity !== undefined ? item.opacity : 1) * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={item.opacity !== undefined ? item.opacity : 1}
          onChange={(e) => handleUpdate({ opacity: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />
      </div>
    </div>
  );
}
