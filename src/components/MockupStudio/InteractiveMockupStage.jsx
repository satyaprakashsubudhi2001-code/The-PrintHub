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
 * draggable print overlay frame for moving, resizing, and positioning print artwork or "Ready for Artwork" box
 * seamlessly across both the front and back of the garment.
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
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const isRotatingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const dragPointerIdRef = useRef(null);
  const startPointerRef = useRef({ x: 0, y: 0 });
  const startDesignRef = useRef(null);

  // Local drag offset for instantaneous 120fps visual feedback
  const [liveDragOffset, setLiveDragOffset] = useState({ x: 0, y: 0 });

  const isBackSide = activeSide === 'back';

  // Calibrated print area configuration from single source of truth
  const calibratedArea = getCalibratedPrintArea(product?.id, size, activePlacementId);

  // Garment printable torso zone geometry tailored per garment and side
  const torso = (() => {
    if (product?.id === 'cup') {
      return { x: 0.22, y: 0.24, w: 0.54, h: 0.52, maxWInches: 8.5, maxHInches: 3.75 };
    }
    if (product?.id === 'cap') {
      return { x: 0.24, y: 0.24, w: 0.52, h: 0.42, maxWInches: 7.5, maxHInches: 4.5 };
    }
    if (product?.id === 'apron') {
      return { x: 0.24, y: 0.18, w: 0.52, h: 0.60, maxWInches: 14.0, maxHInches: 18.0 };
    }
    // Default apparel (T-Shirt, Oversized, Polo, Hoodie, Jersey)
    if (isBackSide) {
      return { x: 0.24, y: 0.16, w: 0.52, h: 0.64, maxWInches: 14.0, maxHInches: 18.0 };
    }
    return { x: 0.24, y: 0.18, w: 0.52, h: 0.62, maxWInches: 14.0, maxHInches: 18.0 };
  })();

  // Maximum printable dimensions in physical inches for this placement
  const maxAreaWidthInches = designData?.maxAreaW || calibratedArea?.maxWidthInches || torso.maxWInches;
  const maxAreaHeightInches = designData?.maxAreaH || calibratedArea?.maxHeightInches || torso.maxHInches;

  // Active design dimensions
  const defaultW = Math.min(maxAreaWidthInches, Math.max(2, parseFloat((maxAreaWidthInches * 0.8).toFixed(1))));
  const defaultH = Math.min(maxAreaHeightInches, Math.max(2, parseFloat((maxAreaHeightInches * 0.75).toFixed(1))));

  const currentW = Math.min(maxAreaWidthInches, Math.max(1, designData?.widthInches ?? defaultW));
  const currentH = Math.min(maxAreaHeightInches, Math.max(1, designData?.heightInches ?? defaultH));
  const currentX = designData?.xInches ?? 0; // 0 = centered horizontally
  const currentY = designData?.yInches ?? 0; // 0 = centered vertically
  const currentRot = designData?.rotation ?? 0;

  // Percent scale conversion factors
  const pctPerInchX = torso.w / torso.maxWInches;
  const pctPerInchY = torso.h / torso.maxHInches;

  // Base center anchor for current placement in container percentage
  const defaultCenterPctX = calibratedArea?.bounds
    ? calibratedArea.bounds.x + calibratedArea.bounds.w / 2
    : torso.x + torso.w / 2;

  const defaultCenterPctY = calibratedArea?.bounds
    ? calibratedArea.bounds.y + calibratedArea.bounds.h / 2
    : torso.y + (isBackSide ? torso.h * 0.35 : torso.h * 0.40);

  // Box dimensions in container percentage
  const boxWidthPct = currentW * pctPerInchX * 100;
  const boxHeightPct = currentH * pctPerInchY * 100;

  // Box center in container percentage
  const boxCenterPctX = (defaultCenterPctX + (currentX + liveDragOffset.x) * pctPerInchX) * 100;
  const boxCenterPctY = (defaultCenterPctY + (currentY + liveDragOffset.y) * pctPerInchY) * 100;

  // Start dragging
  const handlePointerDownDrag = (e) => {
    if (!isInteractive) return;
    e.preventDefault();
    e.stopPropagation();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragPointerIdRef.current = e.pointerId;
    startPointerRef.current = { x: e.clientX, y: e.clientY };
    startDesignRef.current = { x: currentX, y: currentY, w: currentW, h: currentH };
    setLiveDragOffset({ x: 0, y: 0 });

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Start resizing
  const handlePointerDownResize = (e) => {
    if (!isInteractive) return;
    e.preventDefault();
    e.stopPropagation();

    isResizingRef.current = true;
    dragPointerIdRef.current = e.pointerId;
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

  // Start rotating
  const handlePointerDownRotate = (e) => {
    if (!isInteractive) return;
    e.preventDefault();
    e.stopPropagation();

    isRotatingRef.current = true;
    dragPointerIdRef.current = e.pointerId;
    startPointerRef.current = { x: e.clientX, y: e.clientY };
    startDesignRef.current = { rot: currentRot };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = useCallback((e) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    // Pixels per physical inch inside the container
    const pixelsPerInchX = (containerRect.width * torso.w) / torso.maxWInches;
    const pixelsPerInchY = (containerRect.height * torso.h) / torso.maxHInches;

    const deltaPixelX = e.clientX - startPointerRef.current.x;
    const deltaPixelY = e.clientY - startPointerRef.current.y;

    if (Math.abs(deltaPixelX) > 2 || Math.abs(deltaPixelY) > 2) {
      hasMovedRef.current = true;
    }

    if (isDraggingRef.current) {
      const deltaInchX = deltaPixelX / Math.max(1, pixelsPerInchX);
      const deltaInchY = deltaPixelY / Math.max(1, pixelsPerInchY);

      // Clamping limits based on the full garment torso area
      const halfW = currentW / 2;
      const halfH = currentH / 2;

      const minXInches = ((torso.x + (halfW * pctPerInchX)) - defaultCenterPctX) / pctPerInchX;
      const maxXInches = (((torso.x + torso.w) - (halfW * pctPerInchX)) - defaultCenterPctX) / pctPerInchX;
      const minYInches = ((torso.y + (halfH * pctPerInchY)) - defaultCenterPctY) / pctPerInchY;
      const maxYInches = (((torso.y + torso.h) - (halfH * pctPerInchY)) - defaultCenterPctY) / pctPerInchY;

      const rawNewX = (startDesignRef.current?.x || 0) + deltaInchX;
      const rawNewY = (startDesignRef.current?.y || 0) + deltaInchY;

      const clampedX = Math.max(minXInches, Math.min(maxXInches, rawNewX));
      const clampedY = Math.max(minYInches, Math.min(maxYInches, rawNewY));

      setLiveDragOffset({
        x: clampedX - (startDesignRef.current?.x || 0),
        y: clampedY - (startDesignRef.current?.y || 0),
      });

      onUpdateDesign({
        xInches: parseFloat(clampedX.toFixed(2)),
        yInches: parseFloat(clampedY.toFixed(2)),
        widthInches: currentW,
        heightInches: currentH,
      });
    } else if (isResizingRef.current) {
      const deltaInchW = (deltaPixelX / Math.max(1, pixelsPerInchX)) * 2;
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
  }, [
    currentW,
    currentH,
    maxAreaWidthInches,
    maxAreaHeightInches,
    defaultCenterPctX,
    defaultCenterPctY,
    pctPerInchX,
    pctPerInchY,
    torso,
    onUpdateDesign,
  ]);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
    isResizingRef.current = false;
    isRotatingRef.current = false;
    setLiveDragOffset({ x: 0, y: 0 });

    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  // Clean up listeners on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  const placementLabel = calibratedArea?.name || (isBackSide ? 'BACK PRINT AREA' : 'FRONT PRINT AREA');

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

      {/* 2. Garment Printable Torso Zone Boundary Guide */}
      {showGuide && (
        <div
          className="absolute border border-dashed border-cyan-500/25 rounded-2xl pointer-events-none transition-all"
          style={{
            left: `${torso.x * 100}%`,
            top: `${torso.y * 100}%`,
            width: `${torso.w * 100}%`,
            height: `${torso.h * 100}%`,
          }}
        >
          <div className="absolute -top-3 right-2 px-2 py-0.5 rounded bg-slate-950/95 text-[8px] font-mono text-cyan-400/90 border border-slate-800 shadow-md">
            {isBackSide ? 'BACK PRINT ZONE' : 'FRONT PRINT ZONE'}: {torso.maxWInches}" × {torso.maxHInches}"
          </div>
        </div>
      )}

      {/* 3. DYNAMIC ACTIVE PRINT BOX ("Ready for Artwork" or Placed Artwork) */}
      <div
        onPointerDown={handlePointerDownDrag}
        className={`absolute pointer-events-auto cursor-grab active:cursor-grabbing group select-none transition-shadow ${
          isInteractive
            ? 'hover:ring-2 hover:ring-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]'
            : ''
        } ${
          designData?.dataUrl
            ? 'rounded-lg'
            : 'border-2 border-dashed border-cyan-400 rounded-2xl bg-cyan-950/40 backdrop-blur-[2px]'
        }`}
        style={{
          left: `${boxCenterPctX}%`,
          top: `${boxCenterPctY}%`,
          width: `${boxWidthPct}%`,
          height: `${boxHeightPct}%`,
          transform: `translate(-50%, -50%) rotate(${currentRot}deg)`,
          touchAction: 'none',
        }}
      >
        {/* Active Dimensions & Placement Label Tag */}
        {showGuide && (
          <div className="absolute -top-4.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950 border border-cyan-400/90 text-[9px] font-mono font-black text-cyan-300 shadow-2xl whitespace-nowrap z-40 flex items-center gap-1.5 pointer-events-none">
            <Move className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
            <span>{placementLabel.toUpperCase()}: {currentW}" × {currentH}"</span>
          </div>
        )}

        {/* Artwork Placed */}
        {designData?.dataUrl ? (
          <div className="w-full h-full relative">
            <img
              src={designData.dataUrl}
              alt="Custom Print Artwork"
              className="w-full h-full object-contain pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
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
          /* Dynamic "Ready for Artwork" Placeholder with Full Drag & Click Support */
          <div
            onClick={() => {
              if (!hasMovedRef.current) {
                onOpenFileUpload();
              }
            }}
            className="w-full h-full flex flex-col items-center justify-center text-center p-2 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-cyan-500/25 text-cyan-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-glow-cyan">
              <Move className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-white font-mono tracking-wide">
              Ready for Artwork
            </span>
            <span className="text-[10px] text-cyan-300 font-mono font-bold mt-0.5">
              {currentW}" × {currentH}"
            </span>
            <span className="text-[8px] text-slate-300 font-mono mt-0.5 hidden sm:block">
              Drag to Reposition Anywhere • Resize Handles
            </span>
          </div>
        )}

        {/* Interactive Resize and Rotate Handles */}
        {isInteractive && (
          <>
            {/* Top-Right Rotation Handle */}
            <div
              onPointerDown={handlePointerDownRotate}
              className="absolute -top-3.5 -right-3.5 w-7 h-7 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center cursor-alias shadow-2xl transition-transform hover:scale-125 z-50 pointer-events-auto active:scale-95"
              title="Drag to Rotate"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </div>

            {/* Bottom-Right Resize Handle */}
            <div
              onPointerDown={handlePointerDownResize}
              className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center cursor-nwse-resize shadow-2xl transition-transform hover:scale-125 z-50 pointer-events-auto active:scale-95"
              title="Drag to Resize Dimensions"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </div>
          </>
        )}
      </div>

      {/* 4. Unified Front / Back Angle Switcher Bar */}
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
