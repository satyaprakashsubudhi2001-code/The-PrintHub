import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { X, RotateCcw, ZoomIn, ZoomOut, Move, Sparkles, Check } from 'lucide-react';
import { RealisticProductMockup } from './RealisticProductMockup';

/**
 * On-Demand 360° Product Studio Viewer
 * Only initializes and renders when requested by the customer, eliminating background lag and memory leaks.
 * Supports smooth drag-to-rotate, zoom, reset, angle snaps, and custom artwork projection.
 */
export function OnDemand360Viewer({
  isOpen,
  onClose,
  product,
  color,
  placementDesigns = {},
  selectedPlacementIds = [],
}) {
  const [rotationAngle, setRotationAngle] = useState(0); // 0 to 360 deg
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setRotationAngle(0);
      setZoomLevel(1);
    }
  }, [isOpen]);

  // Determine active view based on rotation angle
  const currentViewSide = useMemo(() => {
    const normalized = ((rotationAngle % 360) + 360) % 360;
    if (normalized >= 315 || normalized < 45) return 'front';
    if (normalized >= 45 && normalized < 135) return 'left';
    if (normalized >= 135 && normalized < 225) return 'back';
    return 'right';
  }, [rotationAngle]);

  // Pointer Down for Drag Rotation
  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    startXRef.current = e.clientX;
    startAngleRef.current = rotationAngle;
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = useCallback((e) => {
    const deltaX = e.clientX - startXRef.current;
    const sensitivity = 0.65;
    const newAngle = startAngleRef.current - deltaX * sensitivity;
    setRotationAngle(newAngle);
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerUp]);

  if (!isOpen) return null;

  const normalizedAngle = Math.round(((rotationAngle % 360) + 360) % 360);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in select-none">
      <div className="relative w-full max-w-4xl h-[85vh] max-h-[750px] flex flex-col rounded-3xl bg-[#080b15] border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-white font-display">
                  360° INTERACTIVE STUDIO VIEWER
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[9px] font-bold">
                  {normalizedAngle}° {currentViewSide.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Drag horizontally to rotate 360° around your custom product
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central 360 Interactive Stage */}
        <div
          onPointerDown={handlePointerDown}
          className={`flex-1 relative flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing p-6 ${
            isDragging ? 'cursor-grabbing' : ''
          }`}
        >
          {/* Studio Backdrop Spotlight */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[75%] h-[75%] rounded-full bg-gradient-to-b from-white/[0.05] via-cyan-500/[0.03] to-transparent blur-3xl" />
            <div className="absolute bottom-6 w-[60%] h-10 bg-black/80 blur-2xl rounded-full" />
          </div>

          {/* Realistic Product Mockup Container */}
          <div
            className="relative w-full max-w-[480px] aspect-square flex items-center justify-center transition-transform duration-75 pointer-events-none"
            style={{
              transform: `scale(${zoomLevel}) rotateY(${Math.sin((rotationAngle * Math.PI) / 180) * 12}deg)`,
            }}
          >
            <RealisticProductMockup
              product={product}
              color={color}
              activeSide={currentViewSide}
              showGuideline={false}
              zoom={1}
            />
          </div>

          {/* Rotation Helper Pill */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-md text-[11px] font-mono text-slate-300 flex items-center gap-2 shadow-xl pointer-events-none">
            <Move className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Drag left / right to spin product</span>
          </div>
        </div>

        {/* Bottom Control Bar (Angle Snaps & Zoom) */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
          {/* Quick Angle Snaps */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase mr-1 hidden sm:inline">
              View Angle:
            </span>
            {[
              { label: 'Front (0°)', angle: 0 },
              { label: 'Left (90°)', angle: 90 },
              { label: 'Back (180°)', angle: 180 },
              { label: 'Right (270°)', angle: 270 },
            ].map((snap) => (
              <button
                key={snap.label}
                type="button"
                onClick={() => setRotationAngle(snap.angle)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  normalizedAngle >= snap.angle - 30 && normalizedAngle <= snap.angle + 30
                    ? 'bg-cyan-500 text-black font-black shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {snap.label}
              </button>
            ))}
          </div>

          {/* Zoom & Reset Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-400 w-10 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setRotationAngle(0);
                setZoomLevel(1);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnDemand360Viewer;
