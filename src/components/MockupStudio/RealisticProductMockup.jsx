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
      className="relative w-full max-w-[620px] aspect-square flex items-center justify-center transition-transform duration-200 select-none"
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

  // SVG Silhouette Path
  const getBodyPath = () => {
    if (isLeft) {
      return "M 42 16 Q 50 14 58 18 L 68 30 L 62 58 L 52 52 L 54 88 L 34 88 L 36 50 L 30 46 L 36 28 Z";
    }
    if (isRight) {
      return "M 58 16 Q 50 14 42 18 L 32 30 L 38 58 L 48 52 L 46 88 L 66 88 L 64 50 L 70 46 L 64 28 Z";
    }
    if (isOversized) {
      return "M 30 18 L 40 23 C 46 25 54 25 60 23 L 70 18 L 94 30 L 82 56 L 74 50 L 74 90 L 26 90 L 26 50 L 18 56 L 6 30 Z";
    }
    return "M 32 18 L 42 23 C 47 25 53 25 58 23 L 68 18 L 90 28 L 80 50 L 72 46 L 72 88 L 28 88 L 28 46 L 20 50 L 10 28 Z";
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full object-contain overflow-visible">
        <defs>
          {/* Micro Cotton Weave Pattern */}
          <pattern id="cottonWeave" width="2" height="2" patternUnits="userSpaceOnUse">
            <rect width="2" height="2" fill="none" />
            <path d="M 0 1 L 2 1 M 1 0 L 1 2" stroke="#000000" strokeWidth="0.15" strokeOpacity="0.18" />
          </pattern>

          {/* Directional Studio Shading Gradient */}
          <linearGradient id="tshirtStudioLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.38" />
          </linearGradient>

          {/* Torso Depth Gradient */}
          <linearGradient id="torsoShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="60%" stopColor="#000000" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* ========================================================
           LAYER 1: DYNAMIC FABRIC BASE COLOR
           ======================================================== */}
        <path
          d={getBodyPath()}
          fill={color}
          className="transition-colors duration-300"
        />

        {/* ========================================================
           LAYER 2: COTTON TEXTURE GRAIN (Multiply)
           ======================================================== */}
        <path
          d={getBodyPath()}
          fill="url(#cottonWeave)"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* ========================================================
           LAYER 3: NATURAL FOLDS & TORSO SHADOWS (Multiply)
           ======================================================== */}
        <g style={{ mixBlendMode: 'multiply' }} opacity="0.85">
          {/* Main directional torso shading */}
          <path d={getBodyPath()} fill="url(#torsoShadow)" />

          {/* Natural Armpit & Side Crease Shadows */}
          {!isLeft && !isRight && (
            <>
              {/* Left Armpit Fold */}
              <path d="M 28 46 Q 36 54 34 68 Q 30 56 28 46" fill="#000000" opacity="0.35" />
              <path d="M 32 48 Q 42 62 38 78 Q 34 64 32 48" fill="#000000" opacity="0.2" />

              {/* Right Armpit Fold */}
              <path d="M 72 46 Q 64 54 66 68 Q 70 56 72 46" fill="#000000" opacity="0.35" />
              <path d="M 68 48 Q 58 62 62 78 Q 66 64 68 48" fill="#000000" opacity="0.2" />

              {/* Subtle Waist Drape Folds */}
              <path d="M 36 78 Q 50 82 64 78 Q 50 85 36 78" fill="#000000" opacity="0.25" />
              <path d="M 30 86 Q 50 89 70 86 Q 50 91 30 86" fill="#000000" opacity="0.3" />

              {/* Chest Drape Curves */}
              <path d="M 40 32 Q 50 38 60 32 Q 50 36 40 32" fill="#000000" opacity="0.15" />
            </>
          )}

          {/* Sleeve Folds */}
          <path d="M 20 48 Q 16 38 12 30" stroke="#000000" strokeWidth="1.2" strokeOpacity="0.4" fill="none" />
          <path d="M 80 48 Q 84 38 88 30" stroke="#000000" strokeWidth="1.2" strokeOpacity="0.4" fill="none" />
        </g>

        {/* ========================================================
           LAYER 4: STUDIO LIGHTING & SPECULAR HIGHLIGHTS (Screen / Overlay)
           ======================================================== */}
        <g style={{ mixBlendMode: 'screen' }} opacity="0.75">
          {/* Top Shoulder Rim Light */}
          <path d={getBodyPath()} fill="url(#tshirtStudioLight)" />

          {/* Left Shoulder Highlight */}
          <path d="M 32 18 L 42 23 L 28 32 L 14 26 Z" fill="#ffffff" opacity="0.25" />
          {/* Right Shoulder Highlight */}
          <path d="M 68 18 L 58 23 L 72 32 L 86 26 Z" fill="#ffffff" opacity="0.18" />

          {/* Chest Specular Ridge */}
          <ellipse cx="50" cy="38" rx="16" ry="8" fill="#ffffff" opacity="0.08" />
        </g>

        {/* ========================================================
           LAYER 5: COLLAR RIBBING, SEAMS & HEM STITCHING
           ======================================================== */}
        <g>
          {isBack ? (
            // Back Collar
            <g>
              <path d="M 42 23 Q 50 19 58 23" fill="none" stroke="#000000" strokeWidth="2.5" strokeOpacity="0.5" strokeLinecap="round" />
              <path d="M 42 23 Q 50 19 58 23" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.3" strokeLinecap="round" />
              <path d="M 41 25 Q 50 21 59 25" fill="none" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="1 1" />
            </g>
          ) : !isLeft && !isRight ? (
            // Front Collar Ribbing
            <g>
              {/* Inner Neck Shadow */}
              <path d="M 42 23 Q 50 19 58 23 Q 50 31 42 23 Z" fill="#090d16" opacity="0.9" />
              <path d="M 46 22 Q 50 20 54 22 Q 50 26 46 22 Z" fill="#182032" opacity="0.6" />
              {/* Ribbed Band */}
              <path d="M 42 23 Q 50 31 58 23" fill="none" stroke="#000000" strokeWidth="2.8" strokeOpacity="0.6" strokeLinecap="round" />
              <path d="M 42 23 Q 50 31 58 23" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.3" strokeLinecap="round" />
              {/* Double Needle Collar Stitch */}
              <path d="M 41 25 Q 50 33 59 25" fill="none" stroke="#000000" strokeWidth="0.6" strokeOpacity="0.4" strokeDasharray="1 0.8" />
            </g>
          ) : null}

          {/* Shoulder Seams */}
          <line x1="32" y1="18" x2="42" y2="23" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="1.2 0.8" />
          <line x1="68" y1="18" x2="58" y2="23" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="1.2 0.8" />

          {/* Sleeve Hem Stitching */}
          <line x1="10" y1="28" x2="20" y2="50" stroke="#000000" strokeWidth="0.7" strokeOpacity="0.3" />
          <line x1="90" y1="28" x2="80" y2="50" stroke="#000000" strokeWidth="0.7" strokeOpacity="0.3" />

          {/* Bottom Hem Double Stitch */}
          <line x1="28" y1="86.5" x2="72" y2="86.5" stroke="#000000" strokeWidth="0.7" strokeOpacity="0.35" strokeDasharray="1.2 0.8" />
        </g>
      </svg>
    </div>
  );
}

/**
 * 2. PHOTOREALISTIC PIQUÉ POLO T-SHIRT
 * Features structured fold-down ribbed collar, 2-button placket with pearlescent buttons, and piqué honeycomb texture.
 */
function PoloMockup({ color, side = 'front' }) {
  const isBack = side === 'back';

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full object-contain overflow-visible">
        <defs>
          {/* Piqué Honeycomb Texture */}
          <pattern id="piqueWeave" width="2.5" height="2.5" patternUnits="userSpaceOnUse">
            <rect width="2.5" height="2.5" fill="none" />
            <circle cx="1.25" cy="1.25" r="0.65" fill="#000000" fillOpacity="0.22" />
          </pattern>

          <linearGradient id="poloHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Base Garment */}
        <path
          d="M 33 18 L 43 23 C 48 24 52 24 57 23 L 67 18 L 88 28 L 78 48 L 71 45 L 71 88 L 29 88 L 29 45 L 22 48 L 12 28 Z"
          fill={color}
          className="transition-colors duration-300"
        />

        {/* Piqué Texture Weave */}
        <path
          d="M 33 18 L 43 23 C 48 24 52 24 57 23 L 67 18 L 88 28 L 78 48 L 71 45 L 71 88 L 29 88 L 29 45 L 22 48 L 12 28 Z"
          fill="url(#piqueWeave)"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Shadow & Depth */}
        <g style={{ mixBlendMode: 'multiply' }} opacity="0.8">
          <path d="M 29 45 Q 36 55 34 70" stroke="#000000" strokeWidth="2" strokeOpacity="0.3" fill="none" />
          <path d="M 71 45 Q 64 55 66 70" stroke="#000000" strokeWidth="2" strokeOpacity="0.3" fill="none" />
        </g>

        {/* Studio Highlights */}
        <path
          d="M 33 18 L 43 23 C 48 24 52 24 57 23 L 67 18 L 88 28 L 78 48 L 71 45 L 71 88 L 29 88 L 29 45 L 22 48 L 12 28 Z"
          fill="url(#poloHighlight)"
          style={{ mixBlendMode: 'screen' }}
          opacity="0.65"
        />

        {/* Polo Collar & Placket Details */}
        {!isBack ? (
          <g>
            {/* Placket Base */}
            <rect x="47" y="24" width="6" height="22" rx="1" fill="#0f172a" opacity="0.85" />
            <line x1="50" y1="24" x2="50" y2="44" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.3" />

            {/* Pearlescent Buttons */}
            <circle cx="50" cy="30" r="1.3" fill="#e2e8f0" stroke="#475569" strokeWidth="0.4" />
            <circle cx="50" cy="38" r="1.3" fill="#e2e8f0" stroke="#475569" strokeWidth="0.4" />

            {/* Folded Ribbed Collars */}
            <path d="M 38 20 L 50 28 L 44 38 L 34 23 Z" fill={color} stroke="#000000" strokeWidth="1" />
            <path d="M 62 20 L 50 28 L 56 38 L 66 23 Z" fill={color} stroke="#000000" strokeWidth="1" />
          </g>
        ) : (
          <path d="M 43 23 Q 50 18 57 23" fill="none" stroke="#000000" strokeWidth="3" strokeOpacity="0.6" />
        )}
      </svg>
    </div>
  );
}

/**
 * 3. PHOTOREALISTIC HEAVYWEIGHT HOODIE
 * Features double-lined hood, thick braided drawstrings, and ribbed kangaroo pocket with deep crease shadows.
 */
function HoodieMockup({ color, side = 'front' }) {
  const isBack = side === 'back';

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full object-contain overflow-visible">
        <defs>
          <linearGradient id="hoodieDepth" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#000000" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Main Body */}
        <path
          d="M 30 20 L 40 25 L 60 25 L 70 20 L 92 32 L 80 62 L 72 56 L 72 88 L 28 88 L 28 56 L 20 62 L 8 32 Z"
          fill={color}
          className="transition-colors duration-300"
        />

        {/* Depth Gradient */}
        <path
          d="M 30 20 L 40 25 L 60 25 L 70 20 L 92 32 L 80 62 L 72 56 L 72 88 L 28 88 L 28 56 L 20 62 L 8 32 Z"
          fill="url(#hoodieDepth)"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Kangaroo Pocket */}
        {!isBack && (
          <g>
            <path
              d="M 35 60 L 65 60 L 68 84 L 32 84 Z"
              fill={color}
              stroke="#000000"
              strokeWidth="1.2"
              strokeOpacity="0.5"
            />
            {/* Pocket Shadow & Side Openings */}
            <path d="M 35 60 L 32 84" stroke="#000000" strokeWidth="2" strokeOpacity="0.5" />
            <path d="M 65 60 L 68 84" stroke="#000000" strokeWidth="2" strokeOpacity="0.5" />
          </g>
        )}

        {/* Hood Structure */}
        <path
          d="M 36 22 C 34 8 66 8 64 22 C 58 26 42 26 36 22 Z"
          fill={color}
          stroke="#000000"
          strokeWidth="1.2"
        />
        <path d="M 40 22 Q 50 14 60 22" fill="#090d16" opacity="0.9" />

        {/* Drawstrings */}
        {!isBack && (
          <g>
            <path d="M 46 22 Q 44 34 45 42" stroke="#e2e8f0" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 54 22 Q 56 34 55 42" stroke="#e2e8f0" strokeWidth="1.2" fill="none" strokeLinecap="round" />
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
