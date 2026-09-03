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
} from 'lucide-react';
import { RealisticProductMockup } from './RealisticProductMockup';
import { getCalibratedPrintArea } from '../../constants/printCalibration';

/**
 * Interactive Mockup Stage
 * Renders the photorealistic product mockup with an interactive, constrained
 * print overlay for moving, dragging, resizing, and rotating the uploaded artwork.
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
  const currentW = designData?.widthInches ?? (maxAreaWidthInches * 0.75);
  const currentH = designData?.heightInches ?? (maxAreaHeightInches * 0.65);
  const currentX = designData?.xInches ?? 0; // 0 = centered horizontally
  const currentY = designData?.yInches ?? 0; // 0 = centered vertically
  const currentRot = designData?.rotation ?? 0;

  // Pointer Down on Design: Start Dragging
  const handlePointerDownDrag = (e) => {
    if (!isInteractive || !designData?.dataUrl) return;
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
    if (!isInteractive || !designData?.dataUrl) return;
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    startPointerRef.current = { x: e.clientX, y: e.clientY };
    startDesignRef.current = { x: currentX, y: currentY, w: currentW, h: currentH, aspect: currentW / Math.max(0.1, currentH) };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Pointer Down on Rotate Handle
  const handlePointerDownRotate = (e) => {
    if (!isInteractive || !designData?.dataUrl) return;
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
      const halfW = currentW / 2;
      const halfH = currentH / 2;
      const maxBoundX = (maxAreaWidthInches / 2) - halfW;
      const maxBoundY = (maxAreaHeightInches / 2) - halfH;

      const rawNewX = (startDesignRef.current?.x || 0) + deltaInchX;
      const rawNewY = (startDesignRef.current?.y || 0) + deltaInchY;

      const clampedX = Math.max(-maxBoundX, Math.min(maxBoundX, rawNewX));
      const clampedY = Math.max(-maxBoundY, Math.min(maxBoundY, rawNewY));

      onUpdateDesign({
        xInches: parseFloat(clampedX.toFixed(2)),
        yInches: parseFloat(clampedY.toFixed(2)),
      });
    } else if (isResizingRef.current) {
      const deltaInchW = (deltaPixelX / pixelsPerInchX) * 2;
      const rawW = Math.max(2.0, Math.min(maxAreaWidthInches, (startDesignRef.current?.w || 8.0) + deltaInchW));
      const aspect = startDesignRef.current?.aspect || 1;
      const rawH = rawW / aspect;

      if (rawH <= maxAreaHeightInches) {
        onUpdateDesign({
          widthInches: parseFloat(rawW.toFixed(2)),
          heightInches: parseFloat(rawH.toFixed(2)),
        });
      }
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

  // Calculate percentage styling for design inside the printable boundary
  const designWidthPercent = (currentW / maxAreaWidthInches) * 100;
  const designHeightPercent = (currentH / maxAreaHeightInches) * 100;
  const designLeftPercent = 50 + (currentX / maxAreaWidthInches) * 100;
  const designTopPercent = 50 + (currentY / maxAreaHeightInches) * 100;

  return (
    <div className="relative w-full max-w-[580px] aspect-square mx-auto flex items-center justify-center select-none">
      {/* 1. Underlying Photorealistic Product Mockup */}
      <RealisticProductMockup
        product={product}
        color={color}
        activeSide={activeSide}
        showGuideline={false}
        zoom={1}
      />

      {/* 2. Interactive Print Boundary Frame */}
      <div
        ref={printAreaRef}
        className={`absolute z-30 transition-all ${
          showGuide
            ? 'border-2 border-dashed border-cyan-400/60 rounded-xl bg-cyan-400/[0.03]'
            : 'pointer-events-none'
        }`}
        style={{
          left: `${bounds.x * 100}%`,
          top: `${bounds.y * 100}%`,
          width: `${bounds.w * 100}%`,
          height: `${bounds.h * 100}%`,
        }}
      >
        {/* Print Dimension & Placement Tag */}
        {showGuide && (
          <div className="absolute -top-3.5 left-2 px-2 py-0.5 rounded-md bg-slate-950 border border-cyan-500/50 text-[9px] font-mono font-bold text-cyan-300 shadow-md whitespace-nowrap">
            {placementLabel.toUpperCase()}: {maxAreaWidthInches}" × {maxAreaHeightInches}"
          </div>
        )}

        {/* 3. Drag, Move & Resize Artwork Overlay */}
        {designData?.dataUrl && (
          <div
            onPointerDown={handlePointerDownDrag}
            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing group ${
              isInteractive ? 'hover:ring-2 hover:ring-cyan-400 rounded-lg p-0.5' : ''
            }`}
            style={{
              left: `${designLeftPercent}%`,
              top: `${designTopPercent}%`,
              width: `${designWidthPercent}%`,
              height: `${designHeightPercent}%`,
              transform: `translate(-50%, -50%) rotate(${currentRot}deg)`,
              touchAction: 'none',
            }}
          >
            <img
              src={designData.dataUrl}
              alt="Custom Print Artwork"
              className="w-full h-full object-contain pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] filter"
              style={{
                mixBlendMode: product.id === 'cup' ? 'multiply' : 'normal',
              }}
            />

            {/* Corner Resize Handles */}
            {isInteractive && (
              <>
                {/* Top-Right Rotation Handle */}
                <div
                  onPointerDown={handlePointerDownRotate}
                  className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center cursor-alias shadow-lg transition-transform hover:scale-125 z-40"
                  title="Drag to Rotate"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </div>

                {/* Bottom-Right Resize Handle */}
                <div
                  onPointerDown={handlePointerDownResize}
                  className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center cursor-nwse-resize shadow-lg transition-transform hover:scale-125 z-40"
                  title="Drag to Resize in Inches"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                {/* Center Move Indicator on Hover */}
                <div className="absolute inset-0 border border-cyan-400/40 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="px-2 py-0.5 rounded bg-black/80 text-[10px] text-cyan-300 font-mono font-bold shadow">
                    {currentW}" × {currentH}"
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Empty state hint if no design uploaded for this side */}
        {!designData?.dataUrl && showGuide && (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            <span className="text-[11px] font-semibold text-slate-400 font-mono">
              Ready for Artwork
            </span>
            <span className="text-[9px] text-slate-500 font-mono mt-0.5">
              Max Print: {maxAreaWidthInches}" × {maxAreaHeightInches}"
            </span>
          </div>
        )}
      </div>

      {/* 4. Front / Back / Sleeve Fast Switcher Badge Bar */}
      {availableSides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 p-1 rounded-2xl bg-[#090d18]/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl">
          {availableSides.map((side) => {
            const isActive = activeSide === side;
            return (
              <button
                key={side}
                type="button"
                onClick={() => onSideChange(side)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono uppercase transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{side === 'front' ? '👕 Front' : side === 'back' ? '🔄 Back' : side === 'left' ? '👈 Left Sleeve' : side === 'right' ? '👉 Right Sleeve' : side}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
