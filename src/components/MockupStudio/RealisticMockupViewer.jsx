import React, { useState, useRef } from 'react';
import {
  RotateCcw,
  Sun,
  ZoomIn,
  ZoomOut,
  Camera,
  Maximize2,
  Minimize2,
  Rotate3d,
  Layers,
  Sparkles,
  Check,
  Compass,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { RealisticProductMockup } from './RealisticProductMockup';
import { Product3DViewer } from '../3D/Product3DViewer';

export function RealisticMockupViewer({ isFullscreen, onToggleFullscreen }) {
  const {
    customizerProduct,
    customizerColor,
    cameraPreset,
    setCameraView,
    showPrintBoundary,
    setShowPrintBoundary,
    activeEnvironment,
    setSnapshotDataUrl,
    setIsScreenshotOpen,
    selectedPrintArea,
    setSelectedPrintArea,
  } = useStore();

  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState('2d'); // '2d' | '3d'
  const viewerContainerRef = useRef(null);

  // Available Views / Sides
  const availableViews = [
    { id: 'front', label: 'Front View', icon: '👕' },
    { id: 'back', label: 'Back View', icon: '🔄' },
  ];

  if (customizerProduct.id === 'cup') {
    availableViews.push({ id: 'wrap', label: '360° Wrap', icon: '☕' });
  } else if (customizerProduct.id === 'cap') {
    availableViews.push({ id: 'left', label: 'Side View', icon: '🧢' });
  }

  const activeSide = cameraPreset === 'back' ? 'back' : cameraPreset === 'wrap' ? 'wrap' : cameraPreset === 'left' ? 'left' : 'front';

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(1.5, Math.round((prev + 0.1) * 10) / 10));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.7, Math.round((prev - 0.1) * 10) / 10));
  const handleResetZoom = () => setZoom(1);

  // Switch Side
  const handleSideSwitch = (sideId) => {
    setViewMode('2d');
    setCameraView(sideId);
    const targetArea = customizerProduct.printAreas?.find(
      (a) => a.section === sideId || a.cameraView === sideId || a.id.includes(sideId)
    );
    if (targetArea) {
      setSelectedPrintArea(targetArea.id);
    }
  };

  // High-Resolution Snapshot Capture
  const handleTakeSnapshot = () => {
    if (!viewerContainerRef.current) return;

    if (viewMode === '3d') {
      const canvas3d = viewerContainerRef.current.querySelector('canvas');
      if (canvas3d) {
        const dataUrl = canvas3d.toDataURL('image/png', 1.0);
        setSnapshotDataUrl(dataUrl);
        setIsScreenshotOpen(true);
      }
      return;
    }

    const svgElement = viewerContainerRef.current.querySelector('svg');
    const canvasElement = viewerContainerRef.current.querySelector('canvas');

    if (svgElement && canvasElement) {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 1200;
      exportCanvas.height = 1200;
      const ctx = exportCanvas.getContext('2d');

      // Studio dark background
      ctx.fillStyle = '#080812';
      ctx.fillRect(0, 0, 1200, 1200);

      // Floor radial glow
      const grad = ctx.createRadialGradient(600, 750, 50, 600, 750, 450);
      grad.addColorStop(0, 'rgba(108, 77, 246, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 400, 1200, 800);

      const xml = new XMLSerializer().serializeToString(svgElement);
      const svg64 = btoa(unescape(encodeURIComponent(xml)));
      const image64 = 'data:image/svg+xml;base64,' + svg64;

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 150, 100, 900, 900);
        // Draw the custom printed canvas on top
        ctx.drawImage(canvasElement, 390, 280, 420, 420);
        setSnapshotDataUrl(exportCanvas.toDataURL('image/png', 1.0));
        setIsScreenshotOpen(true);
      };
      img.src = image64;
    }
  };

  return (
    <div
      ref={viewerContainerRef}
      className="relative w-full h-full bg-[#080812] flex flex-col justify-between select-none overflow-hidden print-grid-bg"
    >
      {/* =========================================================================
         1. CANVAS TOP BAR (Lighting Info, Product Title, Guide & Snapshot)
         ========================================================================= */}
      <div className="flex items-center justify-between p-3.5 z-20 shrink-0">
        {/* Left: Product & Angle Info */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101022] border border-white/10 text-xs shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white text-[11px] sm:text-xs">
              {customizerProduct.name.split('(')[0]}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-[#06B6D4] font-mono text-[10px] uppercase font-bold">
              {activeSide.toUpperCase()} VIEW
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#101022]/80 border border-white/10 text-[10px] text-slate-400">
            <Sun className="w-3 h-3 text-amber-400" />
            <span>Studio Neutral</span>
          </div>
        </div>

        {/* Right: Quick Action Controls (Guide, Snapshot) */}
        <div className="flex items-center gap-1.5">
          {/* Guide Boundary Toggle */}
          <button
            onClick={() => setShowPrintBoundary(!showPrintBoundary)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
              showPrintBoundary
                ? 'bg-[#06B6D4]/20 border-[#06B6D4]/50 text-[#06B6D4]'
                : 'bg-[#101022] border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Toggle Print Boundary Guide"
          >
            <span className="text-[10px]">📏</span>
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* Snapshot Trigger */}
          <button
            onClick={handleTakeSnapshot}
            className="px-2.5 py-1 rounded-xl bg-[#101022] hover:bg-[#16162E] border border-white/10 text-white text-xs font-bold flex items-center gap-1 shadow-md transition-all"
            title="Export High-Res Snapshot"
          >
            <Camera className="w-3.5 h-3.5 text-[#6C4DF6]" />
            <span className="hidden sm:inline">Snapshot</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
         2. DOMINANT CENTER PRODUCT CANVAS (65–80% Canvas Height)
         ========================================================================= */}
      <div className="flex-1 w-full flex items-center justify-center relative min-h-0 overflow-hidden px-4">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute w-[450px] sm:w-[550px] h-[450px] sm:h-[550px] bg-gradient-to-tr from-[#6C4DF6]/15 via-[#2563EB]/10 to-[#06B6D4]/15 rounded-full blur-3xl pointer-events-none" />

        {viewMode === '3d' ? (
          <div className="w-full h-full relative flex items-center justify-center">
            <Product3DViewer isAutoRotateDefault={false} />
            <button
              onClick={() => setViewMode('2d')}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-[#101022] border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow-xl hover:scale-105 transition-all z-30"
            >
              <span>✕ Exit 3D Orbit</span>
            </button>
          </div>
        ) : (
          <div className="w-full h-full max-h-[82vh] flex items-center justify-center">
            <RealisticProductMockup
              product={customizerProduct}
              color={customizerColor}
              activeSide={activeSide}
              showGuideline={showPrintBoundary}
              zoom={zoom}
            />
          </div>
        )}
      </div>

      {/* =========================================================================
         3. BOTTOM CANVAS OVERLAYS: 360° CTA & ZOOM CONTROLLER
         ========================================================================= */}
      <div className="flex items-center justify-between p-3.5 z-20 shrink-0">
        {/* Left/Center: Signature 360° Studio CTA */}
        <div>
          {viewMode === '2d' && (
            <button
              onClick={() => setViewMode('3d')}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#6C4DF6] via-[#2563EB] to-[#06B6D4] text-white text-xs font-black shadow-lg shadow-[#6C4DF6]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
            >
              <Rotate3d className="w-4 h-4 text-cyan-200 group-hover:rotate-180 transition-transform duration-700" />
              <span>✨ VIEW IN 360°</span>
            </button>
          )}
        </div>

        {/* Right: Zoom Controls Cluster */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#101022]/90 border border-white/10 shadow-xl backdrop-blur-md">
          <button
            onClick={handleZoomOut}
            className="w-7 h-7 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span
            onClick={handleResetZoom}
            className="px-2 text-xs font-mono font-bold text-white cursor-pointer hover:text-[#06B6D4] transition-colors"
            title="Click to Reset 100%"
          >
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            className="w-7 h-7 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
