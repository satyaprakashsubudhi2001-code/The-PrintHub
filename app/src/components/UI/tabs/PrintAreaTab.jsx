import React from 'react';
import { Check, Target, Compass, Sparkles, MapPin } from 'lucide-react';
import { useCustomizer } from '../../../context/CustomizerContext';

export function PrintAreaTab() {
  const {
    selectedProduct,
    selectedPrintArea,
    setSelectedPrintArea,
    setCameraView,
    designs,
    texts,
    cliparts,
  } = useCustomizer();

  const handleSelectArea = (area) => {
    setSelectedPrintArea(area.id);
    if (area.cameraView) {
      setCameraView(area.cameraView);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Printable Areas</span>
          <span className="text-xs text-brand-400 font-semibold">
            {selectedProduct.printAreas.length} Zones Available
          </span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Select a printable zone. The 3D camera will automatically pivot to face it.
        </p>
      </div>

      {/* Print Areas Grid */}
      <div className="space-y-2.5">
        {selectedProduct.printAreas.map((area) => {
          const isSelected = selectedPrintArea === area.id;

          // Count layers placed in this specific area
          const layerCount =
            designs.filter((d) => d.printArea === area.id).length +
            texts.filter((t) => t.printArea === area.id).length +
            cliparts.filter((c) => c.printArea === area.id).length;

          return (
            <button
              key={area.id}
              onClick={() => handleSelectArea(area)}
              className={`w-full text-left p-3.5 rounded-2xl transition-all relative border flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-slate-800/95 border-brand-500 shadow-glow-orange ring-1 ring-brand-500'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border transition-colors ${
                    isSelected
                      ? 'bg-brand-500/20 border-brand-500/50 text-brand-400'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <Target className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {area.name}
                    </span>
                    {layerCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        {layerCount} {layerCount === 1 ? 'layer' : 'layers'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="capitalize">{area.section} zone</span>
                    <span>•</span>
                    <span className="font-mono text-slate-400">{area.maxDimension}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-200">
                    +₹{area.fee}
                  </span>
                  <p className="text-[10px] text-slate-400">print fee</p>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
