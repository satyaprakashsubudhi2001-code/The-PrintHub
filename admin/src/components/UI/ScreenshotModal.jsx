import React from 'react';
import { X, Download, Camera } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function ScreenshotModal() {
  const {
    isScreenshotOpen,
    setIsScreenshotOpen,
    snapshotDataUrl,
    customizerProduct,
  } = useStore();

  if (!isScreenshotOpen || !snapshotDataUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `ThePrintHub_${customizerProduct.id}_3D_Render.png`;
    link.href = snapshotDataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-lg bg-studio-850 border border-slate-700/80 rounded-3xl p-5 shadow-2xl flex flex-col space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">3D Studio Render Snapshot</h3>
              <p className="text-[11px] text-slate-400">
                High-resolution WebGL photograph of your customized {customizerProduct.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsScreenshotOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full aspect-square rounded-2xl bg-slate-900 border border-slate-700/80 overflow-hidden flex items-center justify-center p-2 shadow-inner">
          <img
            src={snapshotDataUrl}
            alt="3D Customized Product Render"
            className="w-full h-full object-contain rounded-xl drop-shadow-2xl"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleDownload}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-xs shadow-glow-orange flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res Render (PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
