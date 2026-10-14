import React, { useRef, useEffect, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { renderCustomizerCanvas } from '../3D/TextureCompositor';

/**
 * Photorealistic Product Mockup Component
 * Renders studio-lighting blank product models (T-Shirts, Hoodies, Cups, Caps, Aprons, etc.)
 * with dynamic multi-layer color tinting, natural fabric folds, studio highlights, and realistic print blending.
 */
export function RealisticProductMockup({
  product,
  color = '#18181b',
  activeSide = 'front',
  showGuideline = false,
  zoom = 1,
}) {
  const {
    designs,
    texts,
    cliparts,
    selectedPrintArea,
  } = useStore();

  const printCanvasRef = useRef(null);
  const containerRef = useRef(null);

  // Calculate current active print area configuration
  const currentAreaConfig = useMemo(() => {
    if (!product?.printAreas || product.printAreas.length === 0) return null;
    const matched = product.printAreas.find(
      (a) => a.section === activeSide || a.id === selectedPrintArea || a.cameraView === activeSide
    );
    return matched || product.printAreas[0];
  }, [product, activeSide, selectedPrintArea]);

  // Render designs & text onto the print layer canvas
  useEffect(() => {
    let isMounted = true;
    const renderPrintArea = async () => {
      if (!printCanvasRef.current) return;
      
      await renderCustomizerCanvas({
        canvas: printCanvasRef.current,
        printAreas: product?.printAreas || [],
        designs: designs || [],
        texts: texts || [],
        cliparts: cliparts || [],
        showGuide: false,
        activePrintAreaId: currentAreaConfig?.id || selectedPrintArea,
        width: 1024,
        height: 1024,
      });
    };

    renderPrintArea();
    return () => {
      isMounted = false;
    };
  }, [product, designs, texts, cliparts, currentAreaConfig, selectedPrintArea, activeSide]);

  // Printable Area Dimensions (% relative to container)
  const bounds = currentAreaConfig?.bounds || { x: 0.3, y: 0.22, w: 0.4, h: 0.45 };
  const printAreaStyle = {
    left: `${bounds.x * 100}%`,
    top: `${bounds.y * 100}%`,
    width: `${bounds.w * 100}%`,
    height: `${bounds.h * 100}%`,
  };

  // Determine which blank product model to render
  const renderProductBlank = () => {
    switch (product?.id) {
      case 'round-neck-tshirt':
      case 'oversized-tshirt':
        return <TShirtMockup color={color} isOversized={product?.id === 'oversized-tshirt'} side={activeSide} />;
      case 'polo-tshirt':
        return <PoloMockup color={color} side={activeSide} />;
      case 'hoodie':
        return <HoodieMockup color={color} side={activeSide} />;
      case 'cup':
        return <CupMockup color={color} side={activeSide} />;
      case 'cap':
        return <CapMockup color={color} side={activeSide} />;
      case 'apron':
        return <ApronMockup color={color} side={activeSide} />;
      case 'badge':
        return <BadgeMockup color={color} side={activeSide} />;
      default:
        return <TShirtMockup color={color} isOversized={false} side={activeSide} />;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[660px] aspect-square flex items-center justify-center transition-transform duration-200 select-none"
      style={{ transform: `scale(${zoom})` }}
    >
      {/* Studio Backdrop & Contact Shadow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Soft Radial Studio Spotlight */}
        <div className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-b from-white/[0.04] via-cyan-500/[0.02] to-transparent blur-2xl" />
        {/* Bottom Ambient Floor Shadow */}
        <div className="absolute -bottom-2 w-[70%] h-12 bg-black/70 blur-2xl rounded-full" />
      </div>

      {/* Base Photorealistic Blank Product Model */}
      <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
        {renderProductBlank()}

        {/* Dynamic High-Definition Custom Print Area */}
        <div
          className="absolute z-20 pointer-events-none flex items-center justify-center transition-all overflow-hidden"
          style={printAreaStyle}
        >
          <canvas
            ref={printCanvasRef}
            width={1024}
            height={1024}
            className="w-full h-full object-contain pointer-events-auto"
            style={{
              mixBlendMode: color === '#f8fafc' || color === '#ffffff' ? 'multiply' : 'normal',
              opacity: 0.96,
            }}
          />

          {/* Subtle Dotted Print Guide (Shown when toggle is active) */}
          {showGuideline && (
            <div className="absolute inset-0 border-2 border-dashed border-cyan-400/60 rounded-xl pointer-events-none bg-cyan-400/[0.02]">
              <span className="absolute -top-3 left-2 px-2 py-0.5 rounded bg-[#080812] border border-cyan-500/50 text-[9px] font-bold text-cyan-400 uppercase font-mono tracking-wider shadow-sm">
                PRINT AREA
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 1. PHOTOREALISTIC T-SHIRT (Regular & Oversized Fit)
 * Multi-layer rendering: Base Tint + Natural Folds & Shadows + Studio Highlight Overlay + Collar Ribbing
 */
function TShirtMockup({ color, isOversized = false, side = 'front' }) {
  const isBack = side === 'back';
  const isLeft = side === 'left';
  const isRight = side === 'right';

  // Organic 3D Tailored Garment Silhouette Path (Smooth Curves, No Rigid Polygons)
  const getBodyPath = () => {
    if (isLeft) {
      return "M 42 16 C 46 14 54 14 58 17 C 64 24 67 30 68 34 C 66 46 63 56 61 58 C 56 55 53 53 52 52 L 53 88 C 45 89 39 89 33 88 L 35 50 C 32 48 30 46 30 44 C 32 36 34 26 36 24 Z";
    }
    if (isRight) {
      return "M 58 16 C 54 14 46 14 42 17 C 36 24 33 30 32 34 C 34 46 37 56 39 58 C 44 55 47 53 48 52 L 47 88 C 55 89 61 89 67 88 L 65 50 C 68 48 70 46 70 44 C 68 36 66 26 64 24 Z";
    }
    if (isBack) {
      // High ergonomic back neckline
      if (isOversized) {
        return "M 30 18 C 34 19 39 20 42 20.5 C 47 18.5 53 18.5 58 20.5 C 61 20 66 19 70 18 C 79 22 88 27 94 30 C 93 38 88 52 82 56 C 78 54 75 51 74 50 L 74 90 C 58 91 42 91 26 90 L 26 50 C 25 51 22 54 18 56 C 12 52 7 38 6 30 C 12 27 21 22 30 18 Z";
      }
      return "M 32 18 C 36 19 40 20 43 20.5 C 47 18.5 53 18.5 57 20.5 C 60 20 64 19 68 18 C 76 21 84 25 89 28 C 88 34 85 45 80 50 C 77 49 74 47 72 46 C 72 54 71 78 72 88 C 58 89.5 42 89.5 28 88 C 29 78 28 54 28 46 C 26 47 23 49 20 50 C 15 45 12 34 11 28 C 16 25 24 21 32 18 Z";
    }
    // Front with natural crew neck scoop
    if (isOversized) {
      return "M 30 18 C 34 19 39 20 42 22 C 47 25.5 53 25.5 58 22 C 61 20 66 19 70 18 C 79 22 88 27 94 30 C 93 38 88 52 82 56 C 78 54 75 51 74 50 L 74 90 C 58 91 42 91 26 90 L 26 50 C 25 51 22 54 18 56 C 12 52 7 38 6 30 C 12 27 21 22 30 18 Z";
    }
    return "M 32 18 C 36 19 40 20 43 22 C 47 25.5 53 25.5 57 22 C 60 20 64 19 68 18 C 76 21 84 25 89 28 C 88 34 85 45 80 50 C 77 49 74 47 72 46 C 72 54 71 78 72 88 C 58 89.5 42 89.5 28 88 C 29 78 28 54 28 46 C 26 47 23 49 20 50 C 15 45 12 34 11 28 C 16 25 24 21 32 18 Z";
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full object-contain overflow-visible">
        <defs>
          {/* Volumetric 3D Torso Lighting (Smooth Softbox Studio Light) */}
          <radialGradient id="tshirtVolume" cx="50%" cy="38%" r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="55%" stopColor="#000000" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.38" />
          </radialGradient>

          {/* Directional Rim Light Gradient */}
          <linearGradient id="tshirtRimLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="12%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="88%" stopColor="#000000" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>

          {/* Soft Drop Shadow & Ambient Occlusion Filter */}
          <filter id="softAo" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>

        {/* ========================================================
           LAYER 1: SMOOTH FABRIC BASE COLOR
           ======================================================== */}
        <path
          d={getBodyPath()}
          fill={color}
          className="transition-colors duration-300"
        />

        {/* ========================================================
           LAYER 2: 3D VOLUMETRIC STUDIO SHADING (Soft Spherical Light)
           ======================================================== */}
        <path
          d={getBodyPath()}
          fill="url(#tshirtVolume)"
          style={{ mixBlendMode: 'multiply' }}
          opacity="0.92"
        />

        {/* ========================================================
           LAYER 3: STUDIO RIM LIGHT & LATERAL DEPTH
           ======================================================== */}
        <path
          d={getBodyPath()}
          fill="url(#tshirtRimLight)"
          style={{ mixBlendMode: 'overlay' }}
          opacity="0.8"
        />

        {/* ========================================================
           LAYER 4: NATURAL SOFT FABRIC DRAPES & SEAM AO (Gaussian Softened)
           ======================================================== */}
        <g style={{ mixBlendMode: 'multiply' }} opacity="0.6">
          {!isLeft && !isRight && (
            <>
              {/* Soft Armpit Ambient Shadows (Gentle Curves with Blur, No Harsh Polygons) */}
              <path
                d="M 27 46 C 31 52 32 64 30 72 C 28 62 27 52 27 46 Z"
                fill="#000000"
                filter="url(#softAo)"
                opacity="0.45"
              />
              <path
                d="M 73 46 C 69 52 68 64 70 72 C 72 62 73 52 73 46 Z"
                fill="#000000"
                filter="url(#softAo)"
                opacity="0.45"
              />

              {/* Front vs Back Natural Creases */}
              {isBack ? (
                <>
                  {/* Subtle Spine Contour Line */}
                  <line
                    x1="50"
                    y1="24"
                    x2="50"
                    y2="78"
                    stroke="#000000"
                    strokeWidth="1.2"
                    strokeOpacity="0.18"
                    strokeLinecap="round"
                    filter="url(#softAo)"
                  />
                  {/* Soft Shoulder Blade Shading */}
                  <ellipse cx="38" cy="38" rx="6" ry="12" fill="#000000" opacity="0.1" filter="url(#softAo)" />
                  <ellipse cx="62" cy="38" rx="6" ry="12" fill="#000000" opacity="0.1" filter="url(#softAo)" />
                </>
              ) : (
                <>
                  {/* Gentle Chest Contour */}
                  <path
                    d="M 38 34 C 44 38 56 38 62 34"
                    stroke="#000000"
                    strokeWidth="1.2"
                    strokeOpacity="0.15"
                    fill="none"
                    filter="url(#softAo)"
                  />
                  {/* Waist Gentle Curve */}
                  <path
                    d="M 35 76 C 45 80 55 80 65 76"
                    stroke="#000000"
                    strokeWidth="1.2"
                    strokeOpacity="0.2"
                    fill="none"
                    filter="url(#softAo)"
                  />
                </>
              )}
            </>
          )}

          {/* Sleeve Underarm Shadows */}
          <path d="M 21 48 C 17 38 14 32 12 29" stroke="#000000" strokeWidth="1.0" strokeOpacity="0.3" fill="none" />
          <path d="M 79 48 C 83 38 86 32 88 29" stroke="#000000" strokeWidth="1.0" strokeOpacity="0.3" fill="none" />
        </g>

        {/* ========================================================
           LAYER 5: COLLAR RIBBING, SEAMS & HEM STITCHING
           ======================================================== */}
        <g>
          {isBack ? (
            // BACK HIGH COLLAR & YOKE
            <g>
              {/* Inner front neck drop shadow visible through back neckline */}
              <path d="M 43 20.5 C 47 25 53 25 57 20.5 C 53 19 47 19 43 20.5 Z" fill="#090d16" opacity="0.88" />
              {/* Internal printed brand/size tag */}
              <rect x="47.5" y="21.5" width="5" height="2" rx="0.5" fill="#334155" opacity="0.8" />
              <line x1="48.5" y1="22.5" x2="51.5" y2="22.5" stroke="#94a3b8" strokeWidth="0.35" />
              
              {/* Back High Ribbed Collar Band */}
              <path d="M 43 20.5 C 47 17.5 53 17.5 57 20.5" fill="none" stroke="#000000" strokeWidth="2.8" strokeOpacity="0.75" strokeLinecap="round" />
              <path d="M 43 20.5 C 47 17.5 53 17.5 57 20.5" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.3" strokeLinecap="round" />
              
              {/* Back Collar Double-needle Stitching */}
              <path d="M 42 22 C 47 19 53 19 58 22" fill="none" stroke="#000000" strokeWidth="0.6" strokeOpacity="0.35" strokeDasharray="1 0.8" />
              
              {/* Back Shoulder Yoke Seam across Upper Back */}
              <path d="M 33 26 C 45 28 55 28 67 26" fill="none" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.35" strokeDasharray="1.2 0.8" />
            </g>
          ) : !isLeft && !isRight ? (
            // FRONT CREW NECK RIBBING
            <g>
              {/* Inner Neck Depth Shadow */}
              <path d="M 43 22 C 47 18 53 18 57 22 C 53 30 47 30 43 22 Z" fill="#090d16" opacity="0.9" />
              <path d="M 46 21 C 48 19 52 19 54 21 C 52 25 48 25 46 21 Z" fill="#182032" opacity="0.6" />
              
              {/* Ribbed Band Tubular Structure */}
              <path d="M 43 22 C 47 30 53 30 57 22" fill="none" stroke="#000000" strokeWidth="2.8" strokeOpacity="0.65" strokeLinecap="round" />
              <path d="M 43 22 C 47 30 53 30 57 22" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.3" strokeLinecap="round" />
              
              {/* Double Needle Collar Stitch */}
              <path d="M 42 24 C 47 32 53 32 58 24" fill="none" stroke="#000000" strokeWidth="0.6" strokeOpacity="0.4" strokeDasharray="1 0.8" />
            </g>
          ) : null}

          {/* Shoulder Raglan / Inset Seams */}
          <path d="M 32 18 C 36 19 40 20 43 22" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.35" strokeDasharray="1.2 0.8" fill="none" />
          <path d="M 68 18 C 64 19 60 20 57 22" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.35" strokeDasharray="1.2 0.8" fill="none" />

          {/* Sleeve Hem Stitching */}
          <path d="M 11 28 C 14 36 17 44 20 50" stroke="#000000" strokeWidth="0.6" strokeOpacity="0.3" fill="none" />
          <path d="M 89 28 C 86 36 83 44 80 50" stroke="#000000" strokeWidth="0.6" strokeOpacity="0.3" fill="none" />

          {/* Bottom Hem Stitching */}
          <path d="M 28 86.5 C 42 88 58 88 72 86.5" stroke="#000000" strokeWidth="0.7" strokeOpacity="0.3" strokeDasharray="1.2 0.8" fill="none" />
        </g>
      </svg>
    </div>
  );
}

/**
 * 2. PHOTOREALISTIC PIQUÉ POLO T-SHIRT
 * Features structured fold-down ribbed collar, 2-button placket with pearlescent buttons, and smooth tailored drape.
 */
function PoloMockup({ color, side = 'front' }) {
  const isBack = side === 'back';

  const getPoloBodyPath = () => {
    if (isBack) {
      return "M 32 18 C 36 19 40 20 43 20.5 C 47 18.5 53 18.5 57 20.5 C 60 20 64 19 68 18 C 76 21 84 25 89 28 C 88 34 85 45 80 50 C 77 49 74 47 72 46 C 72 54 71 78 72 88 C 58 89.5 42 89.5 28 88 C 29 78 28 54 28 46 C 26 47 23 49 20 50 C 15 45 12 34 11 28 C 16 25 24 21 32 18 Z";
    }
    return "M 32 18 C 36 19 40 20 43 22 C 47 24 53 24 57 22 C 60 20 64 19 68 18 C 76 21 84 25 89 28 C 88 34 85 45 80 50 C 77 49 74 47 72 46 C 72 54 71 78 72 88 C 58 89.5 42 89.5 28 88 C 29 78 28 54 28 46 C 26 47 23 49 20 50 C 15 45 12 34 11 28 C 16 25 24 21 32 18 Z";
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full object-contain overflow-visible">
        <defs>
          <radialGradient id="poloVolume" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#000000" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
          </radialGradient>

          <filter id="poloSoftAo" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* 1. Base Garment */}
        <path
          d={getPoloBodyPath()}
          fill={color}
          className="transition-colors duration-300"
        />

        {/* 2. 3D Volumetric Studio Shading */}
        <path
          d={getPoloBodyPath()}
          fill="url(#poloVolume)"
          style={{ mixBlendMode: 'multiply' }}
          opacity="0.9"
        />

        {/* 3. Soft Natural Drape Shadows */}
        <g style={{ mixBlendMode: 'multiply' }} opacity="0.55">
          <path
            d="M 27 46 C 31 52 32 64 30 72 C 28 62 27 52 27 46 Z"
            fill="#000000"
            filter="url(#poloSoftAo)"
            opacity="0.45"
          />
          <path
            d="M 73 46 C 69 52 68 64 70 72 C 72 62 73 52 73 46 Z"
            fill="#000000"
            filter="url(#poloSoftAo)"
            opacity="0.45"
          />
        </g>

        {/* 4. Structured Polo Collar & Placket */}
        {!isBack ? (
          <g>
            {/* Placket Under-layer */}
            <rect x="47" y="24" width="6" height="20" rx="1.5" fill="#090d16" opacity="0.85" />
            <line x1="50" y1="24" x2="50" y2="42" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.3" />

            {/* Pearlescent Buttons */}
            <circle cx="50" cy="29" r="1.3" fill="#f1f5f9" stroke="#334155" strokeWidth="0.4" />
            <circle cx="50" cy="37" r="1.3" fill="#f1f5f9" stroke="#334155" strokeWidth="0.4" />

            {/* Natural Folded Ribbed Wings */}
            <path
              d="M 37 19 C 41 22 47 26 50 28 C 46 36 43 37 40 37 C 36 28 35 22 37 19 Z"
              fill={color}
              stroke="#000000"
              strokeWidth="1"
              strokeOpacity="0.7"
            />
            <path
              d="M 63 19 C 59 22 53 26 50 28 C 54 36 57 37 60 37 C 64 28 65 22 63 19 Z"
              fill={color}
              stroke="#000000"
              strokeWidth="1"
              strokeOpacity="0.7"
            />
          </g>
        ) : (
          <g>
            <path d="M 43 20.5 C 47 18 53 18 57 20.5" fill="none" stroke="#000000" strokeWidth="3" strokeOpacity="0.7" strokeLinecap="round" />
            <path d="M 43 20.5 C 47 18 53 18 57 20.5" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.3" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
}

/**
 * 3. PHOTOREALISTIC HEAVYWEIGHT HOODIE
 * Features double-lined 3D curved hood, braided drawstrings with aglets, and curved kangaroo pocket.
 */
function HoodieMockup({ color, side = 'front' }) {
  const isBack = side === 'back';

  const getHoodieBodyPath = () => {
    return "M 30 19 C 34 20 38 22 42 23 C 47 23 53 23 58 23 C 62 22 66 20 70 19 C 78 23 88 28 93 32 C 91 42 85 58 79 62 C 76 60 74 56 73 54 L 73 90 C 58 91.5 42 91.5 27 90 L 27 54 C 26 56 24 60 21 62 C 15 58 9 42 7 32 C 12 28 22 23 30 19 Z";
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full object-contain overflow-visible">
        <defs>
          <radialGradient id="hoodieVolume" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#000000" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
          </radialGradient>

          <filter id="hoodieSoftAo" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>

        {/* 1. Main Torso Body */}
        <path
          d={getHoodieBodyPath()}
          fill={color}
          className="transition-colors duration-300"
        />

        {/* 2. 3D Volume Shading */}
        <path
          d={getHoodieBodyPath()}
          fill="url(#hoodieVolume)"
          style={{ mixBlendMode: 'multiply' }}
          opacity="0.9"
        />

        {/* 3. Kangaroo Pocket (Front View Only) */}
        {!isBack && (
          <g>
            <path
              d="M 34 60 C 44 61 56 61 66 60 C 69 72 68 83 67 85 C 55 86 45 86 33 85 C 32 83 31 72 34 60 Z"
              fill={color}
              stroke="#000000"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
            {/* Pocket Welts */}
            <path d="M 34 60 C 32 72 33 82 33 85" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
            <path d="M 66 60 C 68 72 67 82 67 85" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
          </g>
        )}

        {/* 4. Volumetric Curved Hood Structure */}
        <path
          d="M 34 22 C 32 7 68 7 66 22 C 60 26 40 26 34 22 Z"
          fill={color}
          stroke="#000000"
          strokeWidth="1.2"
          strokeOpacity="0.7"
        />
        <path d="M 38 22 C 44 14 56 14 62 22 C 56 25 44 25 38 22 Z" fill="#090d16" opacity="0.92" />

        {/* 5. Braided Drawstrings */}
        {!isBack && (
          <g>
            <path d="M 44 23 C 43 32 44 38 45 42" stroke="#e2e8f0" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 56 23 C 57 32 56 38 55 42" stroke="#e2e8f0" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            {/* Metal Aglets */}
            <rect x="44.2" y="41" width="1.6" height="3" rx="0.5" fill="#94a3b8" />
            <rect x="54.2" y="41" width="1.6" height="3" rx="0.5" fill="#94a3b8" />
          </g>
        )}
      </svg>
    </div>
  );
}

/**
 * 4. PHOTOREALISTIC 11OZ CERAMIC MUG
 * Glossy ceramic glaze reflections, cylindrical depth curvature, and rounded rim highlights.
 */
function CupMockup({ color, side = 'front' }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <svg viewBox="0 0 100 100" className="w-full h-full object-contain overflow-visible">
        <defs>
          {/* Ceramic Cylindrical Gradient */}
          <linearGradient id="ceramicCylinder" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.4" />
            <stop offset="15%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="85%" stopColor="#000000" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
          </linearGradient>

          {/* Glaze Reflection Streak */}
          <linearGradient id="glazeStreak" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Handle */}
        <path
          d="M 76 32 C 92 32 92 68 76 68"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          className="transition-colors duration-300"
        />
        <path
          d="M 76 32 C 92 32 92 68 76 68"
          fill="none"
          stroke="#000000"
          strokeWidth="7"
          strokeOpacity="0.25"
          strokeLinecap="round"
        />

        {/* Mug Body */}
        <rect
          x="20"
          y="22"
          width="58"
          height="60"
          rx="5"
          fill={color}
          className="transition-colors duration-300"
        />

        {/* Cylindrical 3D Shading */}
        <rect
          x="20"
          y="22"
          width="58"
          height="60"
          rx="5"
          fill="url(#ceramicCylinder)"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Glaze Specular Streak */}
        <path d="M 28 26 L 28 78" stroke="url(#glazeStreak)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

        {/* Mug Rim & Inner Shadow */}
        <ellipse cx="49" cy="22" rx="29" ry="4" fill={color} stroke="#000000" strokeWidth="0.8" />
        <ellipse cx="49" cy="22" rx="27" ry="3" fill="#090d16" opacity="0.75" />
        <ellipse cx="49" cy="22" rx="26" ry="2.5" fill="#182032" opacity="0.5" />
      </svg>
    </div>
  );
}

/**
 * 5. PHOTOREALISTIC STRUCTURED SNAPBACK CAP
 * 6-panel twill crown with sewn eyelets and stitched visor.
 */
function CapMockup({ color, side = 'front' }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <svg viewBox="0 0 100 100" className="w-full h-full object-contain overflow-visible">
        <defs>
          <linearGradient id="capShading" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#000000" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* Crown Body */}
        <path
          d="M 20 56 C 18 28 82 28 80 56 Z"
          fill={color}
          className="transition-colors duration-300"
        />
        <path
          d="M 20 56 C 18 28 82 28 80 56 Z"
          fill="url(#capShading)"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Curved Visor */}
        <path
          d="M 10 56 Q 50 72 90 56 Q 50 64 10 56 Z"
          fill={color}
          stroke="#000000"
          strokeWidth="1"
        />
        <path
          d="M 10 56 Q 50 72 90 56 Q 50 64 10 56 Z"
          fill="#000000"
          opacity="0.25"
        />

        {/* Visor Stitched Arcs */}
        <path d="M 16 57 Q 50 68 84 57" fill="none" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="1 1" />

        {/* Panel Seams & Top Button */}
        <line x1="50" y1="30" x2="50" y2="56" stroke="#000000" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="1 0.8" />
        <line x1="50" y1="30" x2="32" y2="56" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.35" strokeDasharray="1 0.8" />
        <line x1="50" y1="30" x2="68" y2="56" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.35" strokeDasharray="1 0.8" />
        <circle cx="50" cy="30" r="2.2" fill={color} stroke="#000000" strokeWidth="0.8" />

        {/* Sewn Eyelets */}
        <circle cx="38" cy="40" r="1.2" fill="#090d16" stroke="#000000" strokeWidth="0.5" />
        <circle cx="62" cy="40" r="1.2" fill="#090d16" stroke="#000000" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

/**
 * 6. PHOTOREALISTIC KITCHEN & BARISTA APRON
 * Canvas twill weave, neck strap with brass buckle, and utility pockets.
 */
function ApronMockup({ color, side = 'front' }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-3">
      <svg viewBox="0 0 100 100" className="w-full h-full object-contain overflow-visible">
        <defs>
          <linearGradient id="apronShade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Neck Strap */}
        <path d="M 38 12 Q 50 6 62 12" fill="none" stroke="#334155" strokeWidth="3" />

        {/* Apron Body */}
        <path
          d="M 34 16 L 66 16 L 66 40 L 80 50 L 78 88 L 22 88 L 20 50 L 34 40 Z"
          fill={color}
          className="transition-colors duration-300"
        />
        <path
          d="M 34 16 L 66 16 L 66 40 L 80 50 L 78 88 L 22 88 L 20 50 L 34 40 Z"
          fill="url(#apronShade)"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Front Utility Pocket */}
        <path
          d="M 28 58 L 72 58 L 72 82 L 28 82 Z"
          fill={color}
          stroke="#000000"
          strokeWidth="1"
          strokeOpacity="0.6"
        />
        <line x1="50" y1="58" x2="50" y2="82" stroke="#000000" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="1.5 1" />

        {/* Waist Straps */}
        <path d="M 20 50 L 8 54" stroke="#334155" strokeWidth="2.5" />
        <path d="M 80 50 L 92 54" stroke="#334155" strokeWidth="2.5" />
      </svg>
    </div>
  );
}

/**
 * 7. PHOTOREALISTIC PIN BUTTON BADGE
 * High-gloss mylar dome reflection curve and tinplate rim.
 */
function BadgeMockup({ color, side = 'front' }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <svg viewBox="0 0 100 100" className="w-full h-full object-contain overflow-visible">
        <defs>
          <linearGradient id="badgeDome" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* Outer Metal Crimped Rim */}
        <circle cx="50" cy="50" r="40" fill="#334155" stroke="#475569" strokeWidth="1.5" />

        {/* Face Color Base */}
        <circle cx="50" cy="50" r="37" fill={color} className="transition-colors duration-300" />

        {/* Mylar Gloss Dome */}
        <circle cx="50" cy="50" r="37" fill="url(#badgeDome)" style={{ mixBlendMode: 'overlay' }} />

        {/* Specular Curved Reflection */}
        <path d="M 24 34 Q 50 18 76 34 Q 50 26 24 34 Z" fill="#ffffff" opacity="0.45" />
      </svg>
    </div>
  );
}

export default RealisticProductMockup;
