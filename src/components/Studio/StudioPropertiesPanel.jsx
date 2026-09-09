import React from 'react';
import {
  AlignCenter,
  Maximize2,
  FlipHorizontal,
  RotateCcw,
  Trash2,
  Copy,
  Lock,
  Unlock,
  MoveUp,
  MoveDown,
  Sliders,
  Bold,
  Italic,
  AlignLeft,
  AlignRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { FONTS } from '../../constants/presets';

export function StudioPropertiesPanel() {
  const {
    customizerProduct,
    selectedPrintArea,
    designs,
    updateDesign,
    duplicateDesign,
    removeDesign,
    texts,
    updateText,
    duplicateText,
    removeText,
    moveLayerUp,
    moveLayerDown,
    toggleLayerLock,
    activeLayer,
    setActiveLayer,
    centerActiveLayer,
    fitActiveLayer,
    resetActiveLayer,
  } = useStore();

  const currentDesign = activeLayer.type === 'design' ? designs.find((d) => d.id === activeLayer.id) : null;
  const currentText = activeLayer.type === 'text' ? texts.find((t) => t.id === activeLayer.id) : null;
  const currentItem = currentDesign || currentText;

  const activePrintAreaDef = customizerProduct?.printAreas?.find((a) => a.id === selectedPrintArea) || customizerProduct?.printAreas?.[0];

  return (
    <aside className="w-full lg:w-[280px] xl:w-[310px] bg-[#E5DAC9] border-t lg:border-t-0 lg:border-l border-[#B8A98F]/50 flex flex-col shrink-0 z-20 overflow-hidden lg:h-full min-h-[360px] lg:min-h-0 select-none text-[#183630]">
      {/* Header */}
      <div className="p-3 bg-[#183630] border-b border-[#B8A98F]/40 flex items-center justify-between shrink-0 text-[#E5DAC9]">
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-[#E5C690]" />
          <span className="text-xs font-black text-[#E5DAC9] uppercase font-mono tracking-wider">
            {currentItem ? 'LAYER PROPERTIES' : 'PROPERTIES'}
          </span>
        </div>

        {currentItem && (
          <button
            onClick={() => setActiveLayer({ id: null, type: null })}
            className="text-[10px] text-[#E5DAC9]/70 hover:text-[#E5DAC9] font-bold transition-colors cursor-pointer"
          >
            Deselect
          </button>
        )}
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
        {/* 1. CONTEXTUAL VIEW: IMAGE / DESIGN LAYER SELECTED */}
        {currentDesign && (
          <div className="space-y-3 animate-in fade-in">
            {/* Title & Quick Actions */}
            <div className="p-2.5 rounded-2xl bg-[#183630]/10 border border-[#B8A98F] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={currentDesign.dataUrl}
                  alt={currentDesign.name}
                  className="w-7 h-7 object-contain rounded-lg bg-[#183630]/20 p-0.5 border border-[#B8A98F]/50"
                />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[#183630] truncate block max-w-[120px]">
                    {currentDesign.name}
                  </span>
                  <span className="text-[9px] text-[#183630]/70 font-mono block">
                    {activePrintAreaDef?.name || 'Front'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => toggleLayerLock(currentDesign.id, 'design')}
                  className="p-1 text-[#183630]/60 hover:text-[#183630] cursor-pointer"
                  title={currentDesign.locked ? 'Unlock Layer' : 'Lock Layer'}
                >
                  {currentDesign.locked ? <Lock className="w-3.5 h-3.5 text-[#183630]" /> : <Unlock className="w-3.5 h-3.5 text-[#183630]/50" />}
                </button>
                <button
                  onClick={() => duplicateDesign(currentDesign.id)}
                  className="p-1 text-[#183630]/60 hover:text-[#183630] cursor-pointer"
                  title="Duplicate Layer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => removeDesign(currentDesign.id)}
                  className="p-1 text-[#183630]/60 hover:text-[#183630] cursor-pointer"
                  title="Delete Layer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Actions Grid (Center, Fit, Flip, Reset) */}
            <div className="grid grid-cols-4 gap-1">
              <button
                onClick={centerActiveLayer}
                className="py-1.5 px-1 rounded-xl bg-[#183630]/10 hover:bg-[#183630]/20 text-[#183630] text-[10px] font-bold border border-[#B8A98F] flex flex-col items-center gap-0.5 transition-colors cursor-pointer"
                title="Center on printable area"
              >
                <AlignCenter className="w-3 h-3 text-[#183630]" />
                <span>Center</span>
              </button>
              <button
                onClick={fitActiveLayer}
                className="py-1.5 px-1 rounded-xl bg-[#183630]/10 hover:bg-[#183630]/20 text-[#183630] text-[10px] font-bold border border-[#B8A98F] flex flex-col items-center gap-0.5 transition-colors cursor-pointer"
                title="Fit to boundary"
              >
                <Maximize2 className="w-3 h-3 text-[#183630]" />
                <span>Fit</span>
              </button>
              <button
                onClick={() => updateDesign(currentDesign.id, { flipX: !currentDesign.flipX })}
                className="py-1.5 px-1 rounded-xl bg-[#183630]/10 hover:bg-[#183630]/20 text-[#183630] text-[10px] font-bold border border-[#B8A98F] flex flex-col items-center gap-0.5 transition-colors cursor-pointer"
                title="Flip horizontally"
              >
                <FlipHorizontal className="w-3 h-3 text-[#183630]" />
                <span>Flip</span>
              </button>
              <button
                onClick={resetActiveLayer}
                className="py-1.5 px-1 rounded-xl bg-[#183630]/10 hover:bg-[#183630]/20 text-[#183630] text-[10px] font-bold border border-[#B8A98F] flex flex-col items-center gap-0.5 transition-colors cursor-pointer"
                title="Reset transform"
              >
                <RotateCcw className="w-3 h-3 text-[#183630]" />
                <span>Reset</span>
              </button>
            </div>

            {/* Sliders: Scale / Rotation / Opacity */}
            <div className="space-y-3 p-3 rounded-2xl bg-[#183630]/5 border border-[#B8A98F]">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-[#183630] font-mono">
                  <span>Scale:</span>
                  <span className="text-[#183630]">{Math.round((currentDesign.scale || 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.2"
                  step="0.02"
                  value={currentDesign.scale || 1}
                  onChange={(e) => updateDesign(currentDesign.id, { scale: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-[#E5DAC9] rounded-lg cursor-pointer accent-[#183630]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-[#183630] font-mono">
                  <span>Rotation:</span>
                  <span className="text-[#183630]">{currentDesign.rotation || 0}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={currentDesign.rotation || 0}
                  onChange={(e) => updateDesign(currentDesign.id, { rotation: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-[#E5DAC9] rounded-lg cursor-pointer accent-[#183630]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-[#183630] font-mono">
                  <span>Opacity:</span>
                  <span className="text-[#183630]">{Math.round((currentDesign.opacity || 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={currentDesign.opacity || 1}
                  onChange={(e) => updateDesign(currentDesign.id, { opacity: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-[#E5DAC9] rounded-lg cursor-pointer accent-[#183630]"
                />
              </div>
            </div>

            {/* Layer Ordering */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#183630]/10 border border-[#B8A98F] text-[11px]">
              <span className="font-bold text-[#183630]">Layer Stack:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveLayerUp(currentDesign.id, 'design')}
                  className="px-2 py-1 rounded-lg bg-[#183630] text-[#E5DAC9] text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <MoveUp className="w-3 h-3" />
                  <span>Up</span>
                </button>
                <button
                  onClick={() => moveLayerDown(currentDesign.id, 'design')}
                  className="px-2 py-1 rounded-lg bg-[#183630] text-[#E5DAC9] text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <MoveDown className="w-3 h-3" />
                  <span>Down</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. CONTEXTUAL VIEW: TEXT LAYER SELECTED */}
        {currentText && (
          <div className="space-y-3 animate-in fade-in">
            {/* Slogan Input */}
            <div>
              <label className="text-[10px] font-bold text-[#183630]/70 uppercase block mb-1 font-mono">
                Text Content:
              </label>
              <input
                type="text"
                value={currentText.text}
                onChange={(e) => updateText(currentText.id, { text: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-xs text-[#183630] focus:outline-none focus:border-[#183630]"
              />
            </div>

            {/* Font Picker */}
            <div>
              <label className="text-[10px] font-bold text-[#183630]/70 uppercase block mb-1 font-mono">
                Font Family:
              </label>
              <select
                value={currentText.fontFamily}
                onChange={(e) => updateText(currentText.id, { fontFamily: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-xs text-[#183630] font-bold cursor-pointer"
              >
                {FONTS.map((f) => (
                  <option key={f.name} value={f.fontFamily}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Styling (Bold, Italic, Align) */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#183630]/10 border border-[#B8A98F]">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateText(currentText.id, { bold: !currentText.bold })}
                  className={`p-1.5 rounded-lg text-xs cursor-pointer ${currentText.bold ? 'bg-[#183630] text-[#E5DAC9] font-black' : 'text-[#183630]/60 hover:text-[#183630]'}`}
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateText(currentText.id, { italic: !currentText.italic })}
                  className={`p-1.5 rounded-lg text-xs cursor-pointer ${currentText.italic ? 'bg-[#183630] text-[#E5DAC9] font-black' : 'text-[#183630]/60 hover:text-[#183630]'}`}
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateText(currentText.id, { textAlign: 'left' })}
                  className={`p-1.5 rounded-lg text-xs cursor-pointer ${currentText.textAlign === 'left' ? 'bg-[#183630] text-[#E5DAC9] font-black' : 'text-[#183630]/60 hover:text-[#183630]'}`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateText(currentText.id, { textAlign: 'center' })}
                  className={`p-1.5 rounded-lg text-xs cursor-pointer ${currentText.textAlign === 'center' ? 'bg-[#183630] text-[#E5DAC9] font-black' : 'text-[#183630]/60 hover:text-[#183630]'}`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateText(currentText.id, { textAlign: 'right' })}
                  className={`p-1.5 rounded-lg text-xs cursor-pointer ${currentText.textAlign === 'right' ? 'bg-[#183630] text-[#E5DAC9] font-black' : 'text-[#183630]/60 hover:text-[#183630]'}`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Text Color Picker */}
            <div className="p-2.5 rounded-2xl bg-[#183630]/10 border border-[#B8A98F] flex items-center justify-between">
              <span className="text-xs font-bold text-[#183630]">Fill Color:</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentText.fillColor || '#183630'}
                  onChange={(e) => updateText(currentText.id, { fillColor: e.target.value })}
                  className="w-6 h-6 rounded-lg bg-transparent cursor-pointer border-0"
                />
                <span className="text-xs font-mono text-[#183630] font-bold">{currentText.fillColor || '#183630'}</span>
              </div>
            </div>

            {/* Text Sliders (Size, Rotation) */}
            <div className="space-y-3 p-3 rounded-2xl bg-[#183630]/5 border border-[#B8A98F]">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-[#183630] font-mono">
                  <span>Font Size:</span>
                  <span className="text-[#183630]">{currentText.fontSize || 40}px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="120"
                  value={currentText.fontSize || 40}
                  onChange={(e) => updateText(currentText.id, { fontSize: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-[#E5DAC9] rounded-lg cursor-pointer accent-[#183630]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-[#183630] font-mono">
                  <span>Rotation:</span>
                  <span className="text-[#183630]">{currentText.rotation || 0}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={currentText.rotation || 0}
                  onChange={(e) => updateText(currentText.id, { rotation: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-[#E5DAC9] rounded-lg cursor-pointer accent-[#183630]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={centerActiveLayer}
                className="flex-1 py-1.5 rounded-xl bg-[#183630] text-[#E5DAC9] text-xs font-bold cursor-pointer"
              >
                Center
              </button>
              <button
                onClick={() => removeText(currentText.id)}
                className="px-3 py-1.5 rounded-xl bg-[#183630]/10 text-[#183630] text-xs font-bold border border-[#B8A98F] cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* 3. NO SELECTION / OVERVIEW STATE */}
        {!currentItem && (
          <div className="p-6 rounded-2xl bg-[#183630]/5 border border-[#B8A98F] text-center space-y-2">
            <span className="text-2xl text-[#183630]">✦</span>
            <h4 className="text-xs font-bold text-[#183630]">Select any layer</h4>
            <p className="text-[11px] text-[#183630]/70">
              Click on any artwork or text on the product preview to adjust its position, scale, and color.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
