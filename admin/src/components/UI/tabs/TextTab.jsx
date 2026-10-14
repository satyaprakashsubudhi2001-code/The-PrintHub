import React, { useState } from 'react';
import {
  Type,
  Plus,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  Sliders,
  Palette,
  CircleDot,
} from 'lucide-react';
import { useCustomizer } from '../../../context/CustomizerContext';
import { FONTS } from '../../../constants/presets';
import { COLOR_PALETTE } from '../../../constants/products';

export function TextTab() {
  const {
    texts,
    addText,
    updateText,
    activeLayer,
    setActiveLayer,
    selectedPrintArea,
  } = useCustomizer();

  const [inputVal, setInputVal] = useState('THE PRINTHUB');

  // Find active text layer if any
  const currentText = texts.find((t) => t.id === activeLayer.id);

  const handleAddNewText = () => {
    addText(inputVal || 'CUSTOM TEXT');
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Typography & Custom Text</span>
          <span className="text-xs text-brand-400 font-semibold uppercase">
            {selectedPrintArea.replace('_', ' ')}
          </span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Add curved typography, vintage fonts, strokes & drop shadows.
        </p>
      </div>

      {/* Quick Add Text Input Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Enter custom slogan or team name..."
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-medium"
        />
        <button
          onClick={handleAddNewText}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-xs font-bold shadow-glow-orange flex items-center gap-1.5 shrink-0 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* If a Text Layer is currently active, show in-depth typography controls */}
      {currentText ? (
        <div className="space-y-4 p-4 rounded-2xl glass-panel border border-brand-500/40 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-400 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              Editing Text Layer
            </span>
            <span className="text-[10px] text-slate-400">Live 3D Update</span>
          </div>

          {/* Edit String */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Text Content
            </label>
            <input
              type="text"
              value={currentText.text}
              onChange={(e) => updateText(currentText.id, { text: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          {/* Font Selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
              Font Family ({FONTS.length} Google Webfonts)
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {FONTS.map((font) => (
                <button
                  key={font.name}
                  onClick={() => updateText(currentText.id, { fontFamily: font.fontFamily })}
                  className={`px-3 py-2 rounded-xl text-xs text-left transition-all border ${
                    currentText.fontFamily === font.fontFamily
                      ? 'bg-brand-500/20 border-brand-500 text-brand-400 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                  style={{ fontFamily: font.fontFamily.split(',')[0] }}
                >
                  <span className="text-xs block truncate">{font.name}</span>
                  <span className="text-[9px] text-slate-400 block">{font.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Style Buttons: Bold, Italic, Alignment */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button
                onClick={() => updateText(currentText.id, { bold: !currentText.bold })}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  currentText.bold ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateText(currentText.id, { italic: !currentText.italic })}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  currentText.italic ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button
                onClick={() => updateText(currentText.id, { textAlign: 'left' })}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  currentText.textAlign === 'left' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateText(currentText.id, { textAlign: 'center' })}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  currentText.textAlign === 'center' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateText(currentText.id, { textAlign: 'right' })}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  currentText.textAlign === 'right' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => updateText(currentText.id, { shadow: !currentText.shadow })}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
                currentText.shadow
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Shadow
            </button>
          </div>

          {/* Text Fill Color */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
              Text Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentText.fillColor || '#ffffff'}
                onChange={(e) => updateText(currentText.id, { fillColor: e.target.value })}
                className="w-9 h-9 rounded-xl bg-transparent cursor-pointer border-0"
              />
              <div className="flex-1 flex gap-1.5 overflow-x-auto py-1">
                {COLOR_PALETTE.slice(0, 8).map((col) => (
                  <button
                    key={col.hex}
                    onClick={() => updateText(currentText.id, { fillColor: col.hex })}
                    className="w-7 h-7 rounded-lg shrink-0 border border-black/30 transition-transform hover:scale-110"
                    style={{ backgroundColor: col.hex }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Curved Text Arc Slider */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1">
              <span>Curved Text Arc</span>
              <span className="font-mono text-brand-400">{currentText.curved || 0}°</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={currentText.curved || 0}
              onChange={(e) => updateText(currentText.id, { curved: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Stroke Width Slider */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1">
              <span>Outline / Stroke Width</span>
              <span className="font-mono text-brand-400">{currentText.strokeWidth || 0}px</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="8"
                step="0.5"
                value={currentText.strokeWidth || 0}
                onChange={(e) => updateText(currentText.id, { strokeWidth: parseFloat(e.target.value) })}
                className="flex-1 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <input
                type="color"
                value={currentText.strokeColor || '#000000'}
                onChange={(e) => updateText(currentText.id, { strokeColor: e.target.value })}
                className="w-7 h-7 rounded-lg bg-transparent cursor-pointer border-0 shrink-0"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 text-center">
          <p className="text-xs text-slate-400">
            Type text above and click <span className="text-brand-400 font-bold">Add</span>, or select an existing text layer from the Layers tab to customize.
          </p>
        </div>
      )}
    </div>
  );
}
