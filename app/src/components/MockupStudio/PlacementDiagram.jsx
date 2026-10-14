import React from 'react';
import { getCalibratedPrintArea } from '../../constants/printCalibration';

/**
 * Professional Vector Silhouette Placement Diagram
 * Visually communicates exact print zones on garments and merchandise.
 * Strictly compliant 4-Color Luxury System:
 * - #183630 (Primary Dark Green)
 * - #E5DAC9 (Primary Beige)
 * - #E5C690 (Primary Soft Gold)
 * - #B8A98F (Highlight Taupe)
 */
export function PlacementDiagram({
  placementId,
  productId = 'round-neck-tshirt',
  isSelected = false,
  color = '#183630',
  className = 'w-full h-36',
}) {
  const isCap = productId === 'cap';
  const isMug = productId === 'cup';
  const isApron = productId === 'apron';
  const isBadge = productId === 'badge';
  const isHoodie = productId === 'hoodie';
  const isPolo = productId === 'polo-tshirt';

  // Retrieve exact calibrated bounds from single source of truth
  const calibrated = getCalibratedPrintArea(productId, 'L', placementId);
  const bounds = calibrated?.bounds || { x: 0.30, y: 0.22, w: 0.40, h: 0.42 };
  const surface = calibrated?.surface || 'front';

  // Surface orientation label
  const getOrientationLabel = () => {
    if (surface === 'back' || ['upper_back', 'full_back', 'cup_back', 'cap_back'].includes(placementId)) return 'BACK VIEW';
    if (surface === 'left' || ['left_sleeve', 'cap_left'].includes(placementId)) return 'LEFT SIDE';
    if (surface === 'right' || ['right_sleeve', 'cap_right'].includes(placementId)) return 'RIGHT SIDE';
    if (placementId === 'cup_wrap') return '360° WRAP';
    return 'FRONT VIEW';
  };

  // Render highlighted zone overlay directly from calibrated bounds
  const renderHighlightZone = () => {
    if (isBadge) {
      return (
        <circle
          cx="50"
          cy="50"
          r="28"
          className={isSelected ? 'fill-[#E5C690]/50 stroke-[#E5C690] stroke-[1.5]' : 'fill-[#E5C690]/25 stroke-[#E5C690]/60 stroke-[1.2]'}
          strokeDasharray="2 2"
        />
      );
    }

    return (
      <rect
        x={bounds.x * 100}
        y={bounds.y * 100}
        width={bounds.w * 100}
        height={bounds.h * 100}
        rx="3"
        className={isSelected ? 'fill-[#E5C690]/50 stroke-[#E5C690] stroke-[1.5]' : 'fill-[#E5C690]/25 stroke-[#E5C690]/60 stroke-[1.2]'}
        strokeDasharray="2 2"
      />
    );
  };

  // Base SVG silhouette by product
  const renderBaseGarment = () => {
    if (isMug) {
      return (
        <g className="transition-colors">
          {/* Mug Silhouette */}
          <rect x="20" y="22" width="58" height="60" rx="6" fill="#183630" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="1.5" />
          {/* Handle */}
          <path d="M 78 32 C 92 32 92 68 78 68" fill="none" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="4.5" strokeLinecap="round" />
          {/* Glaze highlight */}
          <path d="M 26 28 L 26 74" stroke="#E5DAC9" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    }

    if (isCap) {
      return (
        <g className="transition-colors">
          {/* Crown */}
          <path d="M 20 56 C 18 28 82 28 80 56 Z" fill="#183630" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="1.5" />
          {/* Curved Visor */}
          <path d="M 10 56 Q 50 72 90 56 Q 50 64 10 56 Z" fill="#183630" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="1.5" />
          {/* Seams */}
          <line x1="50" y1="30" x2="50" y2="56" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="1 1" />
        </g>
      );
    }

    if (isApron) {
      return (
        <g className="transition-colors">
          {/* Neck strap */}
          <path d="M 38 12 Q 50 6 62 12" fill="none" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="2.5" />
          {/* Apron Bib & Skirt */}
          <path d="M 34 16 L 66 16 L 66 40 L 80 50 L 78 88 L 22 88 L 20 50 L 34 40 Z" fill="#183630" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="1.5" />
          {/* Pocket line */}
          <path d="M 28 58 L 72 58 L 72 82 L 28 82 Z" fill="#183630" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="1.2" strokeDasharray="2 2" />
        </g>
      );
    }

    if (isBadge) {
      return (
        <g className="transition-colors">
          <circle cx="50" cy="50" r="38" fill="#183630" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="2" />
          <circle cx="50" cy="50" r="32" fill="#183630" stroke="#E5DAC9" strokeOpacity="0.15" strokeWidth="1.5" />
        </g>
      );
    }

    // Default: T-Shirt / Hoodie / Polo Silhouette
    return (
      <g className="transition-colors">
        {/* T-Shirt Silhouette */}
        <path
          d="M 32 18 L 42 24 C 47 26 53 26 58 24 L 68 18 L 88 28 L 78 48 L 70 44 L 70 86 L 30 86 L 30 44 L 22 48 L 12 28 Z"
          fill="#183630"
          stroke="#B8A98F"
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Collar / Neckline */}
        {surface === 'back' ? (
          // Back Collar
          <path d="M 42 24 Q 50 20 58 24" fill="none" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
        ) : isPolo ? (
          // Polo Collar & Placket
          <g>
            <path d="M 40 22 L 50 27 L 60 22 L 56 38 L 50 30 L 44 38 Z" fill="#183630" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="1.2" />
            <line x1="50" y1="28" x2="50" y2="44" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="1.5" />
          </g>
        ) : isHoodie ? (
          // Hoodie Cords & Kangaroo Pocket
          <g>
            <path d="M 40 22 Q 50 30 60 22" fill="none" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="2" />
            <path d="M 36 65 L 64 65 L 60 84 L 40 84 Z" fill="#183630" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 2" />
          </g>
        ) : (
          // Round Neck Front Collar
          <path d="M 42 24 Q 50 30 58 24" fill="none" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
        )}

        {/* Shoulder Seams */}
        <line x1="32" y1="18" x2="42" y2="24" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="1" />
        <line x1="68" y1="18" x2="58" y2="24" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="1" />
        <line x1="30" y1="44" x2="22" y2="48" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="1" />
        <line x1="70" y1="44" x2="78" y2="48" stroke="#B8A98F" strokeOpacity="0.4" strokeWidth="1" />
      </g>
    );
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* SVG Container */}
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full object-contain filter transition-all duration-300 ${
          isSelected
            ? 'drop-shadow-[0_0_12px_rgba(229,198,144,0.45)] scale-105'
            : 'drop-shadow-[0_4px_8px_rgba(24,54,48,0.25)]'
        }`}
      >
        {/* Garment / Item Body */}
        {renderBaseGarment()}

        {/* Calibrated Highlighted Print Area */}
        {renderHighlightZone()}
      </svg>

      {/* Orientation Tag */}
      <span
        className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-black uppercase tracking-wider border transition-colors ${
          isSelected
            ? 'bg-[#183630] text-[#E5C690] border-[#B8A98F]/40 shadow-sm'
            : 'bg-[#183630]/90 text-[#E5DAC9]/75 border-[#B8A98F]/30'
        }`}
      >
        {getOrientationLabel()}
      </span>
    </div>
  );
}

export default PlacementDiagram;
