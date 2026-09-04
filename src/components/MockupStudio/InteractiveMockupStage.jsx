import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCw,
  Move,
  Maximize2,
  Lock,
  Unlock,
  Eye,
  RotateCcw,
  Sparkles,
  Check,
  Upload,
} from 'lucide-react';
import { RealisticProductMockup } from './RealisticProductMockup';
import { getCalibratedPrintArea } from '../../constants/printCalibration';

/**
 * Interactive Mockup Stage
 * Renders the photorealistic product mockup with an interactive, dynamically scalable,
 * draggable print overlay frame for moving, resizing, and positioning print artwork or "Ready for Artwork" box.
 */
export function InteractiveMockupStage({
  product,
  color,
  size = 'L',
  activeSide = 'front',
  activePlacementId = null,
  designData = null, // { dataUrl, widthInches, heightInches, xInches, yInches, rotation, maxAreaW, maxAreaH }
  onUpdateDesign = () => {},
  isInteractive = true,
  showGuide = true,
  onSideChange = () => {},
  onOpenFileUpload = () => {},
  availableSides = ['front', 'back'],
}) {
  const containerRef = useRef(null);
  const printAreaRef = useRef(null);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const isRotatingRef = useRef(false);
  const startPointerRef = useRef({ x: 0, y: 0 });
  const startDesignRef = useRef(null);

  // Calibrated print area configuration from single source of truth
  const calibratedArea = getCalibratedPrintArea(product?.id, size, activePlacementId);

  // Maximum printable dimensions in physical inches for this product & placement
  const maxAreaWidthInches = designData?.maxAreaW || calibratedArea?.maxWidthInches || 12.0;
  const maxAreaHeightInches = designData?.maxAreaH || calibratedArea?.maxHeightInches || 14.0;

  // Active design transform (in physical inches relative to center)
  const defaultW = Math.min(maxAreaWidthInches, Math.max(2, parseFloat((maxAreaWidthInches * 0.8).toFixed(1))));
  const defaultH = Math.min(maxAreaHeightInches, Math.max(2, parseFloat((maxAreaHeightInches * 0.8).toFixed(1))));

  const currentW = Math.min(maxAreaWidthInches, Math.max(1, designData?.widthInches ?? defaultW));
  const currentH = Math.min(maxAreaHeightInches, Math.max(1, designData?.heightInches ?? defaultH));
  const currentX = designData?.xInches ?? 0; // 0 = centered horizontally
  const currentY = designData?.yInches ?? 0; // 0 = centered vertically
  const currentRot = designData?.rotation ?? 0;

  // Pointer Down on Design or Ready for Artwork Box: Start Dragging
  const handlePointerDownDrag = (e) => {
    if (!isInteractive) return;
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    startPointerRef.current = { x: e.clientX, y: e.clientY };
    startDesignRef.current = { x: currentX, y: currentY, w: currentW, h: currentH };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Pointer Down on Resize Handle (Bottom Right Corner)
  const handlePointerDownResize = (e) => {
    if (!isInteractive) return;
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    startPointerRef.current = { x: e.clientX, y: e.clientY };
    startDesignRef.current = {
      x: currentX,
      y: currentY,
      w: currentW,
      h: currentH,
      aspect: currentW / Math.max(0.1, currentH),
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Pointer Down on Rotate Handle
  const handlePointerDownRotate = (e) => {
    if (!isInteractive) return;
    e.preventDefault();
    e.stopPropagation();
    isRotatingRef.current = true;
    startPointerRef.current = { x: e.clientX, y: e.clientY };
    startDesignRef.current = { rot: currentRot };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = useCallback((e) => {
    if (!printAreaRef.current) return;
    const rect = printAreaRef.current.getBoundingClientRect();
    const pixelsPerInchX = rect.width / maxAreaWidthInches;
    const pixelsPerInchY = rect.height / maxAreaHeightInches;

    const deltaPixelX = e.clientX - startPointerRef.current.x;
    const deltaPixelY = e.clientY - startPointerRef.current.y;

    if (isDraggingRef.current) {
      const deltaInchX = deltaPixelX / pixelsPerInchX;
      const deltaInchY = deltaPixelY / pixelsPerInchY;

      // Bounds constraint (keep design inside printable box)
      const maxBoundX = Math.max(0, (maxAreaWidthInches - currentW) / 2);
      const maxBoundY = Math.max(0, (maxAreaHeightInches - currentH) / 2);

      const rawNewX = (startDesignRef.current?.x || 0) + deltaInchX;
      const rawNewY = (startDesignRef.current?.y || 0) + deltaInchY;

      const clampedX = Math.max(-maxBoundX, Math.min(maxBoundX, rawNewX));
      const clampedY = Math.max(-maxBoundY, Math.min(maxBoundY, rawNewY));

      onUpdateDesign({
        xInches: parseFloat(clampedX.toFixed(2)),
        yInches: parseFloat(clampedY.toFixed(2)),
        widthInches: currentW,
        heightInches: currentH,
      });
    } else if (isResizingRef.current) {
      const deltaInchW = (deltaPixelX / pixelsPerInchX) * 2;
      const rawW = Math.max(1.5, Math.min(maxAreaWidthInches, (startDesignRef.current?.w || 8.0) + deltaInchW));
      const aspect = startDesignRef.current?.aspect || (currentW / Math.max(0.1, currentH));
      const rawH = Math.max(1.5, Math.min(maxAreaHeightInches, parseFloat((rawW / aspect).toFixed(2))));

      onUpdateDesign({
        widthInches: parseFloat(rawW.toFixed(2)),
        heightInches: parseFloat(rawH.toFixed(2)),
      });
    } else if (isRotatingRef.current) {
      const deltaRot = (deltaPixelX * 0.8) % 360;
      let newRot = Math.round(((startDesignRef.current?.rot || 0) + deltaRot) / 5) * 5;
      if (newRot < 0) newRot += 360;
      onUpdateDesign({ rotation: newRot });
    }
  }, [currentW, currentH, maxAreaWidthInches, maxAreaHeightInches, onUpdateDesign]);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
    isResizingRef.current = false;
    isRotatingRef.current = false;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  // Printable Area Dimensions (% relative to mockup container)
  const bounds = calibratedArea?.bounds || { x: 0.30, y: 0.22, w: 0.40, h: 0.42 };
  const placementLabel = calibratedArea?.name || 'PRINT AREA';

  // Dynamic box scaling (% relative to the printable boundary region)
  const boxWidthPercent = Math.min(100, Math.max(10, (currentW / maxAreaWidthInches) * 100));
  const boxHeightPercent = Math.min(100, Math.max(10, (currentH / maxAreaHeightInches) * 100));
  const boxCenterX = 50 + (currentX / maxAreaWidthInches) * 100;
  const boxCenterY = 50 + (currentY / maxAreaHeightInches) * 100;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[580px] aspect-square mx-auto flex items-center justify-center select-none"
    >
      {/* 1. Underlying Photorealistic Product Mockup */}
      <RealisticProductMockup
        product={product}
        color={color}
        activeSide={activeSide}
        showGuideline={false}
        zoom={1}
      />

      {/* 2. Calibration Coordinate Frame Container */}
      <div
        ref={printAreaRef}
        className="absolute z-30 pointer-events-none"
        style={{
          left: `${bounds.x * 100}%`,
          top: `${bounds.y * 100}%`,
          width: `${bounds.w * 100}%`,
          height: `${bounds.h * 100}%`,
        }}
      >
        {/* Subtle Maximum Printable Limit Boundary (Dotted outline) */}
        {showGuide && (
          <div className="absolute inset-0 border border-dashed border-cyan-500/25 rounded-xl pointer-events-none">
            <div className="absolute -top-3 right-1 px-1.5 py-0.5 rounded bg-slate-950/90 text-[8px] font-mono text-slate-400 border border-slate-800">
              Max Zone: {maxAreaWidthInches}" × {maxAreaHeightInches}"
            </div>
          </div>
        )}

        {/* 3. DYNAMIC ACTIVE PRINT BOX ("Ready for Artwork" or Placed Design) */}
        <div
          onPointerDown={handlePointerDownDrag}
          className={`absolute pointer-events-auto cursor-grab active:cursor-grabbing group select-none transition-shadow ${
            isInteractive
              ? 'hover:ring-2 hover:ring-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]'
              : ''
          } ${
            designData?.dataUrl
              ? 'rounded-lg'
              : 'border-2 border-dashed border-cyan-400 rounded-2xl bg-cyan-950/35 backdrop-blur-[2px]'
          }`}
          style={{
            left: `${boxCenterX}%`,
            top: `${boxCenterY}%`,
            width: `${boxWidthPercent}%`,
            height: `${boxHeightPercent}%`,
            transform: `translate(-50%, -50%) rotate(${currentRot}deg)`,
            touchAction: 'none',
          }}
        >
          {/* Active Physical Dimensions & Placement Tag */}
          {showGuide && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950 border border-cyan-400/90 text-[9px] font-mono font-black text-cyan-300 shadow-xl whitespace-nowrap z-40 flex items-center gap-1.5">
              <Move className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
              <span>{placementLabel.toUpperCase()}: {currentW}" × {currentH}"</span>
            </div>
          )}

          {/* Placed Artwork View */}
          {designData?.dataUrl ? (
            <div className="w-full h-full relative">
              <img
                src={designData.dataUrl}
                alt="Custom Print Artwork"
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] filter"
                style={{
                  mixBlendMode: product?.id === 'cup' ? 'multiply' : 'normal',
                }}
              />
              <div className="absolute inset-0 border border-cyan-400/40 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="px-2 py-0.5 rounded bg-black/80 text-[10px] text-cyan-300 font-mono font-bold shadow">
                  {currentW}" × {currentH}"
                </div>
              </div>
            </div>
          ) : (
            /* Dynamic "Ready for Artwork" Placeholder */
            <div
              onClick={() => onOpenFileUpload()}
              className="w-full h-full flex flex-col items-center justify-center text-center p-2 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-glow-cyan">
                <Move className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] sm:text-xs font-black text-white font-mono tracking-wide">
                Ready for Artwork
              </span>
              <span className="text-[10px] text-cyan-300 font-mono font-bold mt-0.5">
                {currentW}" × {currentH}"
              </span>
              <span className="text-[8px] text-slate-400 font-mono mt-0.5 hidden sm:block">
                Drag to Move • Resize Handles
              </span>
            </div>
          )}

          {/* Interactive Resize and Rotate Handles */}
          {isInteractive && (
            <>
              {/* Top-Right Rotation Handle */}
              <div
                onPointerDown={handlePointerDownRotate}
                className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center cursor-alias shadow-xl transition-transform hover:scale-125 z-50 pointer-events-auto"
                title="Drag to Rotate"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </div>

              {/* Bottom-Right Resize Handle */}
              <div
                onPointerDown={handlePointerDownResize}
                className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center cursor-nwse-resize shadow-xl transition-transform hover:scale-125 z-50 pointer-events-auto"
                title="Drag to Resize Dimensions"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 4. Unified Front / Back Fast Angle Switcher Bar */}
      {availableSides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 p-1 rounded-2xl bg-[#090d18]/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl">
          {availableSides.map((side) => {
            const isActive = activeSide === side;
            return (
              <button
                key={side}
                type="button"
                onClick={() => onSideChange(side)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold font-mono uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>{side === 'front' ? '👕 FRONT' : side === 'back' ? '🔄 BACK' : side === 'left' ? '👈 LEFT SLEEVE' : side === 'right' ? '👉 RIGHT SLEEVE' : side}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default InteractiveMockupStage;
