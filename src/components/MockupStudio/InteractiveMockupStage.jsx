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

  const currentW = Math.min(maxAreaWidthInches, Math.max(0.5, designData?.widthInches ?? defaultW));
  const currentH = Math.min(maxAreaHeightInches, Math.max(0.5, designData?.heightInches ?? defaultH));
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

  // 1. Maintain a live params ref so move/up handlers are completely stable and never drop listeners
  const paramsRef = useRef({});
  paramsRef.current = {
    currentW,
    currentH,
    currentX,
    currentY,
    currentRot,
    maxAreaWidthInches,
    maxAreaHeightInches,
    defaultCenterPctX,
    defaultCenterPctY,
    pctPerInchX,
    pctPerInchY,
    torso,
    onUpdateDesign,
  };

  // 2. Active interaction session ref (drag, resize, rotate)
  const activeSessionRef = useRef(null);

  // 3. Stable global move handler (never detached mid-drag)
  const handleGlobalPointerMove = useCallback((e) => {
    const session = activeSessionRef.current;
    if (!session || !containerRef.current) return;

    const p = paramsRef.current;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pixelsPerInchX = (containerRect.width * p.torso.w) / p.torso.maxWInches;
    const pixelsPerInchY = (containerRect.height * p.torso.h) / p.torso.maxHInches;

    const deltaPixelX = e.clientX - session.startX;
    const deltaPixelY = e.clientY - session.startY;

    if (Math.abs(deltaPixelX) > 2 || Math.abs(deltaPixelY) > 2) {
      session.hasMoved = true;
    }

    if (session.type === 'drag') {
      const deltaInchX = deltaPixelX / Math.max(1, pixelsPerInchX);
      const deltaInchY = deltaPixelY / Math.max(1, pixelsPerInchY);

      const halfW = p.currentW / 2;
      const halfH = p.currentH / 2;

      const minX = ((p.torso.x + halfW * p.pctPerInchX) - p.defaultCenterPctX) / p.pctPerInchX;
      const maxX = (((p.torso.x + p.torso.w) - halfW * p.pctPerInchX) - p.defaultCenterPctX) / p.pctPerInchX;
      const minY = ((p.torso.y + halfH * p.pctPerInchY) - p.defaultCenterPctY) / p.pctPerInchY;
      const maxY = (((p.torso.y + p.torso.h) - halfH * p.pctPerInchY) - p.defaultCenterPctY) / p.pctPerInchY;

      const safeMinX = Math.min(minX, maxX);
      const safeMaxX = Math.max(minX, maxX);
      const safeMinY = Math.min(minY, maxY);
      const safeMaxY = Math.max(minY, maxY);

      const clampedX = Math.max(safeMinX, Math.min(safeMaxX, session.startDesignX + deltaInchX));
      const clampedY = Math.max(safeMinY, Math.min(safeMaxY, session.startDesignY + deltaInchY));

      session.lastClampedX = clampedX;
      session.lastClampedY = clampedY;

      setLiveDragOffset({
        x: clampedX - session.startDesignX,
        y: clampedY - session.startDesignY,
      });

      // Synchronize in real time
      p.onUpdateDesign({
        xInches: parseFloat(clampedX.toFixed(2)),
        yInches: parseFloat(clampedY.toFixed(2)),
        widthInches: p.currentW,
        heightInches: p.currentH,
      });
    } else if (session.type === 'resize') {
      const deltaInchW = deltaPixelX / Math.max(1, pixelsPerInchX);
      const deltaInchH = deltaPixelY / Math.max(1, pixelsPerInchY);

      // Smooth, responsive diagonal resize
      const effectiveDelta = (deltaInchW + deltaInchH * session.aspect) / 2;
      const rawW = Math.max(0.5, Math.min(p.maxAreaWidthInches, session.startDesignW + effectiveDelta));
      const rawH = Math.max(0.5, Math.min(p.maxAreaHeightInches, parseFloat((rawW / session.aspect).toFixed(2))));

      session.lastW = rawW;
      session.lastH = rawH;

      p.onUpdateDesign({
        widthInches: parseFloat(rawW.toFixed(2)),
        heightInches: parseFloat(rawH.toFixed(2)),
      });
    } else if (session.type === 'rotate') {
      const deltaRot = (deltaPixelX * 0.8) % 360;
      let newRot = Math.round((session.startRot + deltaRot) / 5) * 5;
      if (newRot < 0) newRot += 360;
      session.lastRot = newRot;
      p.onUpdateDesign({ rotation: newRot });
    }
  }, []);

  // 4. Stable global pointer up handler
  const handleGlobalPointerUp = useCallback((e) => {
    const session = activeSessionRef.current;
    if (!session) return;

    window.removeEventListener('pointermove', handleGlobalPointerMove);
    window.removeEventListener('pointerup', handleGlobalPointerUp);
    window.removeEventListener('pointercancel', handleGlobalPointerUp);

    const p = paramsRef.current;

    if (session.type === 'drag') {
      p.onUpdateDesign({
        xInches: parseFloat(session.lastClampedX.toFixed(2)),
        yInches: parseFloat(session.lastClampedY.toFixed(2)),
        widthInches: p.currentW,
        heightInches: p.currentH,
      });
      setLiveDragOffset({ x: 0, y: 0 });
    } else if (session.type === 'resize') {
      p.onUpdateDesign({
        widthInches: parseFloat(session.lastW.toFixed(2)),
        heightInches: parseFloat(session.lastH.toFixed(2)),
      });
    } else if (session.type === 'rotate') {
      p.onUpdateDesign({
        rotation: session.lastRot,
      });
    }

    activeSessionRef.current = null;
  }, [handleGlobalPointerMove]);

  // Clean up on component unmount ONLY
  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [handleGlobalPointerMove, handleGlobalPointerUp]);

  // Start dragging
  const handlePointerDownDrag = (e) => {
    if (!isInteractive) return;
    e.preventDefault();
    e.stopPropagation();

    const p = paramsRef.current;
    activeSessionRef.current = {
      type: 'drag',
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startDesignX: p.currentX,
      startDesignY: p.currentY,
      startDesignW: p.currentW,
      startDesignH: p.currentH,
      lastClampedX: p.currentX,
      lastClampedY: p.currentY,
      hasMoved: false,
    };

    setLiveDragOffset({ x: 0, y: 0 });

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: false });
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);
  };

  // Start resizing
  const handlePointerDownResize = (e) => {
    if (!isInteractive) return;
    e.preventDefault();
    e.stopPropagation();

    const p = paramsRef.current;
    activeSessionRef.current = {
      type: 'resize',
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startDesignW: p.currentW,
      startDesignH: p.currentH,
      aspect: p.currentW / Math.max(0.1, p.currentH),
      lastW: p.currentW,
      lastH: p.currentH,
      hasMoved: false,
    };

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: false });
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);
  };

  // Start rotating
  const handlePointerDownRotate = (e) => {
    if (!isInteractive) return;
    e.preventDefault();
    e.stopPropagation();

    const p = paramsRef.current;
    activeSessionRef.current = {
      type: 'rotate',
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startRot: p.currentRot,
      lastRot: p.currentRot,
      hasMoved: false,
    };

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: false });
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);
  };

  const placementLabel = calibratedArea?.name || (isBackSide ? 'BACK PRINT AREA' : 'FRONT PRINT AREA');

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[620px] aspect-square mx-auto flex items-center justify-center select-none"
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
          className="absolute border border-dashed border-[#F2CB30]/40 rounded-2xl pointer-events-none transition-all"
          style={{
            left: `${torso.x * 100}%`,
            top: `${torso.y * 100}%`,
            width: `${torso.w * 100}%`,
            height: `${torso.h * 100}%`,
          }}
        >
          <div className="absolute -top-3 right-2 px-2 py-0.5 rounded bg-[#12002E]/95 text-[8px] font-mono text-[#F2CB30] border border-white/20 shadow-md">
            {isBackSide ? 'BACK PRINT ZONE' : 'FRONT PRINT ZONE'}: {torso.maxWInches}" × {torso.maxHInches}"
          </div>
        </div>
      )}

      {/* 3. DYNAMIC ACTIVE PRINT BOX ("Ready for Artwork" or Placed Artwork) */}
      <div
        onPointerDown={handlePointerDownDrag}
        className={`absolute pointer-events-auto cursor-grab active:cursor-grabbing group select-none transition-shadow ${
          isInteractive
            ? 'hover:ring-2 hover:ring-[#F2CB30] hover:shadow-[0_0_25px_rgba(242,203,48,0.35)]'
            : ''
        } ${
          designData?.dataUrl
            ? 'rounded-lg'
            : 'border-2 border-dashed border-[#F2CB30] rounded-2xl bg-[#12002E]/60 backdrop-blur-[2px]'
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
          <div className="absolute -top-4.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#12002E] border border-[#F2CB30] text-[9px] font-mono font-black text-[#F2CB30] shadow-2xl whitespace-nowrap z-40 flex items-center gap-1.5 pointer-events-none">
            <Move className="w-2.5 h-2.5 text-[#F2CB30] animate-pulse" />
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
            <div className="absolute inset-0 border border-[#F2CB30]/40 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="px-2 py-0.5 rounded bg-black/80 text-[10px] text-[#F2CB30] font-mono font-bold shadow">
                {currentW}" × {currentH}"
              </div>
            </div>
          </div>
        ) : (
          /* Dynamic "Ready for Artwork" Placeholder with Full Drag & Click Support */
          <div
            onClick={() => {
              if (!activeSessionRef.current?.hasMoved) {
                onOpenFileUpload();
              }
            }}
            className="w-full h-full flex flex-col items-center justify-center text-center p-2 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#F2CB30]/20 text-[#F2CB30] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <Move className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-white font-mono tracking-wide">
              Ready for Artwork
            </span>
            <span className="text-[10px] text-[#F2CB30] font-mono font-bold mt-0.5">
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
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-[#F2CB30] hover:bg-[#DA0090] text-[#12002E] flex items-center justify-center cursor-alias shadow-[0_0_15px_rgba(242,203,48,0.6)] transition-all hover:scale-115 z-50 pointer-events-auto active:scale-95 touch-none"
              title="Drag to Rotate"
            >
              <RotateCw className="w-4 h-4 stroke-[2.5]" />
            </div>

            {/* Bottom-Right Resize Handle */}
            <div
              onPointerDown={handlePointerDownResize}
              className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-[#F2CB30] hover:bg-[#DA0090] text-[#12002E] flex items-center justify-center cursor-nwse-resize shadow-[0_0_15px_rgba(242,203,48,0.6)] transition-all hover:scale-115 z-50 pointer-events-auto active:scale-95 touch-none"
              title="Drag to Resize Dimensions"
            >
              <Maximize2 className="w-4 h-4 stroke-[2.5]" />
            </div>
          </>
        )}
      </div>

      {/* 4. Unified Front / Back Angle Switcher Bar */}
      {availableSides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 p-1 rounded-2xl bg-[#12002E]/95 backdrop-blur-xl border border-[#2C0E63]/40 shadow-2xl">
          {availableSides.map((side) => {
            const isActive = activeSide === side;
            return (
              <button
                key={side}
                type="button"
                onClick={() => onSideChange(side)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold font-mono uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#F2CB30] text-[#12002E] font-black shadow-[0_0_15px_rgba(242,203,48,0.4)] scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-[#2C0E63]'
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
