import React from 'react';
import { Check, Palette, Sparkles, Sliders } from 'lucide-react';
import { useCustomizer } from '../../../context/CustomizerContext';
import { COLOR_PALETTE } from '../../../constants/products';

export function ColorTab() {
  const { productColor, setProductColor, selectedProduct } = useCustomizer();

  const currentColorObj = COLOR_PALETTE.find(
    (c) => c.hex.toLowerCase() === productColor.toLowerCase()
  ) || { name: 'Custom Color', hex: productColor };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Garment Color & Tone</span>
          <span className="text-xs text-brand-400 font-semibold">
            {currentColorObj.name}
          </span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Instant PBR fabric tinting. Designs and logos remain fully intact.
        </p>
      </div>

      {/* Preset Swatches Grid */}
      <div className="grid grid-cols-4 gap-3">
        {COLOR_PALETTE.map((col) => {
          const isSelected = productColor.toLowerCase() === col.hex.toLowerCase();
          return (
            <button
              key={col.hex}
              onClick={() => setProductColor(col.hex)}
              title={col.name}
              className={`group flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all border ${
                isSelected
                  ? 'bg-slate-800 border-brand-500 shadow-glow-orange ring-2 ring-brand-500/50'
                  : 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/80 hover:border-slate-600'
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl shadow-md flex items-center justify-center transition-transform group-hover:scale-105 border border-black/20"
                style={{ backgroundColor: col.hex }}
              >
                {isSelected && (
                  <Check
                    className="w-4 h-4 stroke-[3]"
                    style={{ color: col.textColor }}
                  />
                )}
              </div>
              <span className="text-[10px] text-slate-300 text-center font-medium truncate w-full">
                {col.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom Color Wheel / Hex Input */}
      <div className="p-3.5 rounded-2xl glass-panel border border-slate-700/60 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
          <span className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-brand-400" />
            Custom Color Picker
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {productColor.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="color"
            value={productColor}
            onChange={(e) => setProductColor(e.target.value)}
            className="w-12 h-10 rounded-xl bg-transparent cursor-pointer border-0 p-0 shadow-inner"
          />
          <div className="flex-1">
            <input
              type="text"
              value={productColor}
              onChange={(e) => setProductColor(e.target.value)}
              placeholder="#000000"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Fabric Material Specs Badge */}
      <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">
            {selectedProduct.materialProps?.fabricType || 'PBR Fabric Material'}
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Rendered with realistic micro-weave normal displacement and physical roughness.
          </p>
        </div>
      </div>
    </div>
  );
}
