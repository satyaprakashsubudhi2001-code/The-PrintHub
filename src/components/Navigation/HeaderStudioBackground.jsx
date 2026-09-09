import React from 'react';

/**
 * HeaderStudioBackground Component — Luxury Custom Printing & Merchandise Studio Pattern
 * 
 * STRICT 4-COLOR PALETTE ONLY:
 * - #183630 (Primary Dark Green)
 * - #E5DAC9 (Primary Beige)
 * - #E5C690 (Primary Soft Gold)
 * - #B8A98F (Highlight Taupe)
 * 
 * Guaranteed:
 * - 100% pointer-events-none, inert, zero layout shift
 * - Does not obstruct or distract from logo or search bar
 * - Low-contrast, subtle opacities (0.04 - 0.12)
 * - High-end luxury printing studio aesthetic
 */
export function HeaderStudioBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* -------------------------------------------------------------
          1. LAYER 0: AMBIENT TONAL LIGHTING (Strict brand colors only)
          ------------------------------------------------------------- */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Subtle gold glow in the left negative space */}
          <radialGradient id="ambGoldLeft" cx="32%" cy="50%" r="28%">
            <stop offset="0%" stopColor="#E5C690" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#183630" stopOpacity="0" />
          </radialGradient>
          {/* Subtle beige glow in the right negative space */}
          <radialGradient id="ambBeigeRight" cx="78%" cy="50%" r="30%">
            <stop offset="0%" stopColor="#E5DAC9" stopOpacity="0.035" />
            <stop offset="100%" stopColor="#183630" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#ambGoldLeft)" />
        <rect width="100%" height="100%" fill="url(#ambBeigeRight)" />
      </svg>

      {/* -------------------------------------------------------------
          2. LAYER 1: FAR BACKGROUND DIE-LINES & CROP EDGES (Full Width)
          ------------------------------------------------------------- */}
      {/* Top and bottom subtle print guide rules */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#B8A98F]/20 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#B8A98F]/15 to-transparent" />

      {/* Top-Left Corner Crop Mark */}
      <div className="absolute top-1.5 left-2 sm:left-4 opacity-70">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <line x1="3" y1="0" x2="3" y2="12" stroke="#B8A98F" strokeWidth="0.75" />
          <line x1="0" y1="3" x2="12" y2="3" stroke="#B8A98F" strokeWidth="0.75" />
        </svg>
      </div>

      {/* Bottom-Left Corner Crop Mark */}
      <div className="absolute bottom-1.5 left-2 sm:left-4 opacity-70">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <line x1="3" y1="2" x2="3" y2="14" stroke="#B8A98F" strokeWidth="0.75" />
          <line x1="0" y1="11" x2="12" y2="11" stroke="#B8A98F" strokeWidth="0.75" />
        </svg>
      </div>

      {/* Top-Right Corner Crop Mark */}
      <div className="absolute top-1.5 right-2 sm:right-4 opacity-70">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <line x1="11" y1="0" x2="11" y2="12" stroke="#B8A98F" strokeWidth="0.75" />
          <line x1="2" y1="3" x2="14" y2="3" stroke="#B8A98F" strokeWidth="0.75" />
        </svg>
      </div>

      {/* Bottom-Right Corner Crop Mark */}
      <div className="absolute bottom-1.5 right-2 sm:right-4 opacity-70">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <line x1="11" y1="2" x2="11" y2="14" stroke="#B8A98F" strokeWidth="0.75" />
          <line x1="2" y1="11" x2="14" y2="11" stroke="#B8A98F" strokeWidth="0.75" />
        </svg>
      </div>

      {/* -------------------------------------------------------------
          3. LAYER 2: ALIGNED MERCHANDISE & STUDIO GRAPHICS
             Anchored inside max-w-[1500px] matching the header's container
          ------------------------------------------------------------- */}
      <div className="relative w-full max-w-[1500px] mx-auto h-full px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================
            ZONE A: LEFT NEGATIVE SPACE (Between Logo & Search Bar)
            Visible on lg+ screens where gap exists between Logo & Search
            ========================================================= */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7 absolute top-1/2 -translate-y-1/2 left-[28.5%] xl:left-[29.5%] z-0">
          
          {/* 1. Precision Ink Brayer / Roller Line Art */}
          <div className="flex flex-col items-center group/elem" title="Studio Ink Roller">
            <svg
              width="36"
              height="36"
              viewBox="0 0 44 44"
              fill="none"
              className="transition-transform duration-700 hover:rotate-6"
              style={{ opacity: 0.08 }}
            >
              {/* Roller Cylinder */}
              <rect x="7" y="6" width="30" height="10" rx="2" stroke="#E5C690" strokeWidth="1" />
              {/* Ink distribution dashed line */}
              <line x1="9" y1="11" x2="35" y2="11" stroke="#E5C690" strokeWidth="0.75" strokeDasharray="2 2" />
              {/* Spindle axle pins */}
              <line x1="4" y1="11" x2="7" y2="11" stroke="#E5C690" strokeWidth="1" />
              <line x1="37" y1="11" x2="40" y2="11" stroke="#E5C690" strokeWidth="1" />
              {/* Metal yoke arms */}
              <path d="M 4 11 L 4 16 L 20 23 L 20 27" stroke="#E5C690" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 40 11 L 40 16 L 24 23 L 24 27" stroke="#E5C690" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              {/* Ferrule */}
              <rect x="20" y="27" width="4" height="3" rx="0.5" stroke="#E5C690" strokeWidth="0.75" />
              {/* Wooden handle */}
              <path d="M 20.5 30 L 20 40 C 20 42 24 42 24 40 L 23.5 30 Z" stroke="#E5C690" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* 2. Ceramic Mug with Print Guideline */}
          <div className="flex flex-col items-center">
            <svg
              width="34"
              height="34"
              viewBox="0 0 44 44"
              fill="none"
              style={{ opacity: 0.075 }}
            >
              {/* Top Rim Oval */}
              <ellipse cx="20" cy="11" rx="12" ry="3.5" stroke="#E5DAC9" strokeWidth="1" />
              {/* Cylinder Body */}
              <path d="M 8 11 L 9 32 C 9 36 31 36 31 32 L 32 11" stroke="#E5DAC9" strokeWidth="1" strokeLinecap="round" />
              {/* Base curve */}
              <path d="M 10 32 C 10 35 30 35 30 32" stroke="#E5DAC9" strokeWidth="0.75" />
              {/* Handle */}
              <path d="M 32 15 C 38 15 39 27 31 28" stroke="#E5DAC9" strokeWidth="1" strokeLinecap="round" />
              <path d="M 32 18 C 35.5 18 36 24 31 25" stroke="#E5DAC9" strokeWidth="0.75" strokeLinecap="round" />
              {/* Print zone rectangle on mug */}
              <rect x="13" y="17" width="14" height="12" rx="1.5" stroke="#E5DAC9" strokeWidth="0.75" strokeDasharray="1.5 1.5" />
            </svg>
          </div>

          {/* 3. Small Print Registration Crosshair Target */}
          <div className="hidden xl:flex items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.1 }}>
              <circle cx="12" cy="12" r="7" stroke="#E5C690" strokeWidth="0.75" />
              <circle cx="12" cy="12" r="3.5" stroke="#E5C690" strokeWidth="0.6" />
              <circle cx="12" cy="12" r="1.2" fill="#E5C690" />
              <line x1="12" y1="2" x2="12" y2="22" stroke="#E5C690" strokeWidth="0.75" />
              <line x1="2" y1="12" x2="22" y2="12" stroke="#E5C690" strokeWidth="0.75" />
            </svg>
          </div>

          {/* 4. Fine Halftone Matrix (Left cluster) */}
          <div className="hidden 2xl:flex items-center">
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none" style={{ opacity: 0.08 }}>
              <circle cx="4" cy="4" r="1" fill="#E5DAC9" />
              <circle cx="10" cy="4" r="1" fill="#E5DAC9" />
              <circle cx="16" cy="4" r="1" fill="#E5DAC9" />
              <circle cx="22" cy="4" r="1" fill="#E5DAC9" />
              <circle cx="4" cy="9" r="1.2" fill="#E5C690" />
              <circle cx="10" cy="9" r="1.4" fill="#E5C690" />
              <circle cx="16" cy="9" r="1.2" fill="#E5C690" />
              <circle cx="22" cy="9" r="0.8" fill="#E5C690" />
              <circle cx="4" cy="14" r="0.8" fill="#B8A98F" />
              <circle cx="10" cy="14" r="1" fill="#B8A98F" />
              <circle cx="16" cy="14" r="1.2" fill="#B8A98F" />
              <circle cx="22" cy="14" r="1" fill="#B8A98F" />
            </svg>
          </div>

        </div>

        {/* =========================================================
            ZONE B: RIGHT NEGATIVE SPACE (Between Search & WhatsApp)
            Visible on md+ screens where space between Search & Actions exists
            ========================================================= */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 absolute top-1/2 -translate-y-1/2 right-[120px] sm:right-[140px] lg:right-[150px] xl:right-[165px] z-0">
          
          {/* 1. Halftone Dot Cluster (Right) */}
          <div className="hidden xl:flex items-center">
            <svg width="26" height="18" viewBox="0 0 26 18" fill="none" style={{ opacity: 0.08 }}>
              <circle cx="4" cy="4" r="1.2" fill="#E5C690" />
              <circle cx="10" cy="4" r="1" fill="#E5C690" />
              <circle cx="16" cy="4" r="1.2" fill="#E5C690" />
              <circle cx="22" cy="4" r="0.8" fill="#E5C690" />
              <circle cx="4" cy="9" r="1.4" fill="#E5DAC9" />
              <circle cx="10" cy="9" r="1.2" fill="#E5DAC9" />
              <circle cx="16" cy="9" r="1" fill="#E5DAC9" />
              <circle cx="22" cy="9" r="1.2" fill="#E5DAC9" />
              <circle cx="4" cy="14" r="0.8" fill="#B8A98F" />
              <circle cx="10" cy="14" r="1.2" fill="#B8A98F" />
              <circle cx="16" cy="14" r="0.8" fill="#B8A98F" />
              <circle cx="22" cy="14" r="1" fill="#B8A98F" />
            </svg>
          </div>

          {/* 2. Precision T-Shirt Apparel Outline */}
          <div className="flex flex-col items-center" title="Custom T-Shirt Printing">
            <svg
              width="40"
              height="40"
              viewBox="0 0 52 52"
              fill="none"
              style={{ opacity: 0.085 }}
            >
              {/* Crewneck Collar */}
              <path d="M 19 12 C 22 16 30 16 33 12" stroke="#E5C690" strokeWidth="1" strokeLinecap="round" />
              <path d="M 19 12 C 22 14 30 14 33 12" stroke="#E5C690" strokeWidth="0.75" />
              {/* T-Shirt Contour */}
              <path
                d="M 19 12 L 8 18 L 13 27 L 17 24 L 17 44 L 35 44 L 35 24 L 39 27 L 44 18 L 33 12"
                stroke="#E5C690"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Sleeve seams */}
              <line x1="8" y1="18" x2="13" y2="27" stroke="#E5C690" strokeWidth="0.75" />
              <line x1="44" y1="18" x2="39" y2="27" stroke="#E5C690" strokeWidth="0.75" />
              {/* Printable Imprint Box on Chest */}
              <rect x="21" y="19" width="10" height="14" rx="1" stroke="#E5C690" strokeWidth="0.75" strokeDasharray="1.5 1.5" />
              {/* Bottom hemline */}
              <line x1="17" y1="42" x2="35" y2="42" stroke="#E5C690" strokeWidth="0.6" />
            </svg>
          </div>

          {/* 3. Folded Merchandise Packaging / Gift Box */}
          <div className="hidden sm:flex flex-col items-center" title="Custom Packaging & Boxes">
            <svg
              width="36"
              height="36"
              viewBox="0 0 46 46"
              fill="none"
              style={{ opacity: 0.075 }}
            >
              {/* Top Face */}
              <path d="M 23 8 L 38 16 L 23 24 L 8 16 Z" stroke="#E5DAC9" strokeWidth="1" strokeLinejoin="round" />
              {/* Left Panel */}
              <path d="M 8 16 L 23 24 L 23 39 L 8 31 Z" stroke="#E5DAC9" strokeWidth="1" strokeLinejoin="round" />
              {/* Right Panel */}
              <path d="M 23 24 L 38 16 L 38 31 L 23 39 Z" stroke="#E5DAC9" strokeWidth="1" strokeLinejoin="round" />
              {/* Tuck Flap Crease */}
              <line x1="23" y1="8" x2="23" y2="12" stroke="#E5DAC9" strokeWidth="0.75" />
              {/* Packaging Tape / Ribbon */}
              <line x1="15.5" y1="12" x2="15.5" y2="27.5" stroke="#E5DAC9" strokeWidth="0.75" strokeDasharray="1.5 1.5" />
              <line x1="30.5" y1="12" x2="30.5" y2="27.5" stroke="#E5DAC9" strokeWidth="0.75" strokeDasharray="1.5 1.5" />
            </svg>
          </div>

          {/* 4. Kiss-Cut Sticker Sheet with Peel Corner */}
          <div className="hidden lg:flex flex-col items-center" title="Custom Stickers & Decals">
            <svg
              width="30"
              height="36"
              viewBox="0 0 40 46"
              fill="none"
              style={{ opacity: 0.075 }}
            >
              {/* Backing sheet */}
              <rect x="5" y="4" width="30" height="38" rx="2.5" stroke="#B8A98F" strokeWidth="1" />
              {/* Decal 1 */}
              <circle cx="14" cy="14" r="4.5" stroke="#B8A98F" strokeWidth="0.8" strokeDasharray="2 1.5" />
              {/* Decal 2 */}
              <circle cx="26" cy="14" r="4.5" stroke="#B8A98F" strokeWidth="0.8" strokeDasharray="2 1.5" />
              {/* Decal 3 (peel corner) */}
              <path d="M 9.5 28 A 4.5 4.5 0 1 0 17.5 28 A 4.5 4.5 0 0 0 15 24" stroke="#B8A98F" strokeWidth="0.8" />
              <path d="M 18 28 L 15 25 L 18 25 Z" stroke="#B8A98F" strokeWidth="0.75" fill="#B8A98F" fillOpacity="0.2" />
              {/* Decal 4 */}
              <circle cx="26" cy="28" r="4.5" stroke="#B8A98F" strokeWidth="0.8" strokeDasharray="2 1.5" />
            </svg>
          </div>

          {/* 5. Precision Color Calibration Step Wedge (Strictly 4 Brand Colors) */}
          <div className="hidden xl:flex flex-col items-center gap-1">
            <svg width="36" height="8" viewBox="0 0 36 8" fill="none" style={{ opacity: 0.12 }}>
              <rect x="1" y="1" width="7" height="6" fill="#183630" stroke="#B8A98F" strokeWidth="0.5" />
              <rect x="10" y="1" width="7" height="6" fill="#B8A98F" />
              <rect x="19" y="1" width="7" height="6" fill="#E5DAC9" />
              <rect x="28" y="1" width="7" height="6" fill="#E5C690" />
            </svg>
            <span className="text-[7px] font-mono tracking-widest text-[#B8A98F]/40 select-none uppercase">
              CMYK•CAL
            </span>
          </div>

          {/* 6. Metric / DPI Gauge Scale */}
          <div className="hidden 2xl:flex items-center">
            <svg width="38" height="10" viewBox="0 0 38 10" fill="none" style={{ opacity: 0.09 }}>
              <line x1="2" y1="8" x2="36" y2="8" stroke="#E5DAC9" strokeWidth="0.75" />
              <line x1="2" y1="2" x2="2" y2="8" stroke="#E5DAC9" strokeWidth="0.75" />
              <line x1="10" y1="4" x2="10" y2="8" stroke="#E5DAC9" strokeWidth="0.5" />
              <line x1="19" y1="2" x2="19" y2="8" stroke="#E5DAC9" strokeWidth="0.75" />
              <line x1="28" y1="4" x2="28" y2="8" stroke="#E5DAC9" strokeWidth="0.5" />
              <line x1="36" y1="2" x2="36" y2="8" stroke="#E5DAC9" strokeWidth="0.75" />
            </svg>
          </div>

        </div>

        {/* =========================================================
            ZONE C: SUBTLE FAR-LEFT AND FAR-RIGHT ACCENTS
            ========================================================= */}
        {/* Layered Business Cards (Far Left, behind/near logo perimeter) */}
        <div className="hidden 2xl:flex absolute top-1/2 -translate-y-1/2 left-2 z-0">
          <svg width="40" height="30" viewBox="0 0 48 38" fill="none" style={{ opacity: 0.07 }}>
            <rect x="6" y="10" width="32" height="19" rx="1.5" stroke="#B8A98F" strokeWidth="0.9" transform="rotate(-6 22 19)" />
            <g transform="rotate(4 25 18)">
              <rect x="9" y="8" width="32" height="19" rx="1.5" stroke="#B8A98F" strokeWidth="1" fill="#183630" fillOpacity="0.4" />
              <line x1="13" y1="12" x2="22" y2="12" stroke="#B8A98F" strokeWidth="0.75" />
              <line x1="13" y1="15" x2="35" y2="15" stroke="#B8A98F" strokeWidth="0.5" strokeDasharray="1 1" />
              <line x1="13" y1="18" x2="31" y2="18" stroke="#B8A98F" strokeWidth="0.5" strokeDasharray="1 1" />
              <line x1="13" y1="22" x2="20" y2="22" stroke="#B8A98F" strokeWidth="0.5" />
            </g>
          </svg>
        </div>

        {/* Hoodie Outline (Far Right, beyond WhatsApp button) */}
        <div className="hidden 2xl:flex absolute top-1/2 -translate-y-1/2 right-2 z-0">
          <svg width="38" height="38" viewBox="0 0 48 48" fill="none" style={{ opacity: 0.065 }}>
            <path d="M 18 16 C 18 8 30 8 30 16" stroke="#E5C690" strokeWidth="1" strokeLinecap="round" />
            <path d="M 21 16 C 21 11 27 11 27 16" stroke="#E5C690" strokeWidth="0.75" strokeLinecap="round" />
            <line x1="22" y1="16" x2="22" y2="23" stroke="#E5C690" strokeWidth="0.75" strokeLinecap="round" />
            <line x1="26" y1="16" x2="26" y2="22" stroke="#E5C690" strokeWidth="0.75" strokeLinecap="round" />
            <path
              d="M 18 16 L 9 21 L 13 29 L 16 27 L 16 42 L 32 42 L 32 27 L 35 29 L 39 21 L 30 16"
              stroke="#E5C690"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 19 33 L 29 33 L 31 38 L 17 38 Z" stroke="#E5C690" strokeWidth="0.75" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Bullseye Registration Target (Top Right edge) */}
        <div className="hidden lg:flex absolute top-2 right-[96px] z-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.09 }}>
            <circle cx="12" cy="12" r="7" stroke="#E5DAC9" strokeWidth="0.75" />
            <circle cx="12" cy="12" r="3.5" stroke="#E5DAC9" strokeWidth="0.6" />
            <circle cx="12" cy="12" r="1.2" fill="#E5DAC9" />
            <line x1="12" y1="2" x2="12" y2="22" stroke="#E5DAC9" strokeWidth="0.75" />
            <line x1="2" y1="12" x2="22" y2="12" stroke="#E5DAC9" strokeWidth="0.75" />
          </svg>
        </div>

        {/* Center Sub-Edge Registration Mark (Top center, well above search bar) */}
        <div className="hidden md:flex absolute top-1 left-1/2 -translate-x-1/2 z-0">
          <svg width="24" height="6" viewBox="0 0 24 6" fill="none" style={{ opacity: 0.08 }}>
            <line x1="0" y1="3" x2="24" y2="3" stroke="#B8A98F" strokeWidth="0.75" strokeDasharray="3 3" />
            <circle cx="12" cy="3" r="1.5" fill="#E5C690" />
          </svg>
        </div>

        {/* Center Sub-Edge Registration Mark (Bottom center, well below search bar) */}
        <div className="hidden md:flex absolute bottom-1 left-1/2 -translate-x-1/2 z-0">
          <svg width="24" height="6" viewBox="0 0 24 6" fill="none" style={{ opacity: 0.08 }}>
            <line x1="0" y1="3" x2="24" y2="3" stroke="#B8A98F" strokeWidth="0.75" strokeDasharray="3 3" />
            <circle cx="12" cy="3" r="1.5" fill="#E5C690" />
          </svg>
        </div>

      </div>
    </div>
  );
}

export default HeaderStudioBackground;
