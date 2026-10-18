import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';
import { X, Crop, ZoomIn, Check } from 'lucide-react';

export default function ImageCropperModal({ 
  imageSrc, 
  onCropComplete, 
  onCancel,
  aspectRatio = 1 
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Prevent background page scrolling while modal is open
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error('Failed to crop image', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#071226]/80 backdrop-blur-md transition-all animate-in fade-in duration-200 ease-out" 
        onClick={onCancel} 
      />
      
      {/* Modal Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="cropper-modal-title"
        className="relative w-full max-w-xl max-h-[92vh] sm:max-h-[88vh] rounded-[22px] bg-[#0B1020] border border-[rgba(255,255,255,0.08)] shadow-[0_24px_80px_rgba(0,0,0,0.60)] animate-in slide-in-from-bottom-2 zoom-in-[0.98] duration-200 ease-out flex flex-col overflow-hidden my-auto"
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 sm:px-6 py-4 shrink-0 bg-[#0B1020]">
          <div className="flex items-center gap-2 text-lime-400">
            <Crop className="w-5 h-5" />
            <h3 id="cropper-modal-title" className="text-lg font-black font-display uppercase tracking-wide">
              Adjust Image
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close modal"
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 overscroll-contain">
          {/* Responsive Cropper Container */}
          <div className="relative w-full h-[260px] sm:h-[340px] md:h-[380px] max-h-[46vh] bg-black rounded-xl overflow-hidden shrink-0 border border-slate-800/80 shadow-inner">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onCropComplete={handleCropComplete}
              onZoomChange={setZoom}
              classes={{
                containerClassName: 'h-full w-full',
              }}
            />
          </div>

          {/* Zoom Controls */}
          <div className="space-y-2 shrink-0 pt-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <ZoomIn className="w-4 h-4 text-lime-400" /> Zoom Level
              </span>
              <span className="text-lime-400 font-bold">{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.05}
              aria-label="Zoom slider"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-lime-400 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 font-mono text-center">
              Drag image to reposition &bull; Use slider or scroll wheel to zoom
            </p>
          </div>
        </div>

        {/* Fixed Action Footer */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 sm:gap-3 px-5 sm:px-6 py-3.5 border-t border-slate-800 shrink-0 bg-[#0B1020]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-bold hover:text-white transition-colors cursor-pointer"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={() => onCropComplete(imageSrc)}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold hover:bg-cyan-500/10 transition-colors cursor-pointer"
            title="Use original uncropped image"
          >
            USE ORIGINAL
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-lime-400 text-slate-950 hover:bg-lime-300 text-xs font-mono font-black shadow-lg shadow-lime-400/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <span className="animate-pulse">PROCESSING...</span>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>CROP & SAVE</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
