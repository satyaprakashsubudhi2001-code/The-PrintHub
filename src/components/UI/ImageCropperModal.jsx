import React, { useState, useCallback } from 'react';
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#071226]/80 backdrop-blur-md transition-all animate-in fade-in duration-200 ease-out" onClick={onCancel} />
      
      {/* Modal */}
      <div className="relative w-full max-w-xl rounded-[22px] bg-[#0B1020] border border-[rgba(255,255,255,0.08)] p-6 space-y-6 shadow-[0_24px_80px_rgba(0,0,0,0.40)] animate-in slide-in-from-bottom-2 zoom-in-[0.98] duration-200 ease-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-2 text-lime-400">
            <Crop className="w-5 h-5" />
            <h3 className="text-lg font-black font-display uppercase">Adjust Image</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative w-full h-[400px] bg-black rounded-xl overflow-hidden shrink-0">
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

        {/* Controls */}
        <div className="space-y-3 shrink-0">
          <div className="flex items-center gap-4">
            <ZoomIn className="w-5 h-5 text-slate-400" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              className="w-full accent-lime-400 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 shrink-0">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-bold hover:text-white"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-lime-400 text-slate-950 hover:bg-lime-300 text-xs font-mono font-black shadow-lg shadow-lime-400/20 disabled:opacity-50"
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
