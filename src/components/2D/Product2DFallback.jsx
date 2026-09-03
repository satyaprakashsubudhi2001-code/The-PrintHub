import React, { useRef, useEffect } from 'react';
import { Box } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { renderCustomizerCanvas } from '../3D/TextureCompositor';

export function Product2DFallback({ onSwitchTo3D }) {
  const {
    customizerProduct,
    customizerColor,
    designs,
    texts,
    cliparts,
    selectedPrintArea,
    showPrintBoundary,
  } = useStore();

  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      renderCustomizerCanvas({
        canvas: canvasRef.current,
        printAreas: customizerProduct.printAreas || [],
        designs,
        texts,
        cliparts,
        showGuide: showPrintBoundary,
        activePrintAreaId: selectedPrintArea,
        width: 1024,
        height: 1024,
      });
    }
  }, [
    customizerProduct,
    designs,
    texts,
    cliparts,
    selectedPrintArea,
    showPrintBoundary,
  ]);

  return (
    <div className="relative w-full h-full bg-studio-900 flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <span>⚡ 2D Flat Mockup Mode</span>
        </div>

        <button
          onClick={onSwitchTo3D}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-glow-orange transition-all"
        >
          <Box className="w-3.5 h-3.5" />
          <span>Switch to 3D Viewer</span>
        </button>
      </div>

      <div className="relative w-[340px] sm:w-[420px] aspect-square flex items-center justify-center">
        {customizerProduct.image ? (
          <img
            src={customizerProduct.image}
            alt={customizerProduct.name}
            className="w-full h-full object-cover rounded-3xl drop-shadow-2xl opacity-80"
          />
        ) : (
          <div
            className="w-full h-full rounded-3xl"
            style={{ backgroundColor: customizerColor }}
          />
        )}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>

      <p className="text-xs text-slate-400 mt-4">
        Interactive 2D Flat Mockup • Real-time layer compositing active
      </p>
    </div>
  );
}
