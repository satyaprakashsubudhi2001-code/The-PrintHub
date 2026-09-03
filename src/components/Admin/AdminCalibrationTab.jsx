import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Sliders,
  Save,
  RotateCcw,
  CheckCircle2,
  Maximize2,
  Move,
  Layers,
  Sparkles,
  Download,
  AlertCircle,
  Eye,
  Info,
} from 'lucide-react';
import {
  MASTER_CALIBRATIONS,
  GARMENT_SIZE_DIMENSIONS,
  getCalibratedPrintArea,
  saveCalibrationOverride,
  resetCalibrationOverrides,
} from '../../constants/printCalibration';
import { INITIAL_PRODUCTS } from '../../constants/products';
import { RealisticProductMockup } from '../MockupStudio/RealisticProductMockup';

/**
 * Interactive Admin Print Placement Calibration Tool
 * Allows administrators to visually calibrate physical print boundaries and dimensions
 * for every product, size, surface, and placement directly on the realistic product.
 */
export function AdminCalibrationTab() {
  const [selectedProductId, setSelectedProductId] = useState('round-neck-tshirt');
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedPlacementId, setSelectedPlacementId] = useState('left_chest');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Available products
  const productsList = useMemo(() => {
    return [
      { id: 'round-neck-tshirt', name: 'Round Neck T-Shirt (Regular)' },
      { id: 'oversized-tshirt', name: 'Round Neck T-Shirt (Oversized)' },
      { id: 'polo-tshirt', name: 'Polo T-Shirt (Piqué)' },
      { id: 'hoodie', name: 'Heavyweight Pullover Hoodie' },
      { id: 'apron', name: 'Chef & Barista Apron' },
      { id: 'cup', name: '11oz Ceramic Coffee Mug' },
      { id: 'cap', name: 'Structured Snapback Cap' },
      { id: 'badge', name: 'Custom Pin Button Badge' },
    ];
  }, []);

  // Available placements for selected product
  const availablePlacements = useMemo(() => {
    return MASTER_CALIBRATIONS[selectedProductId] || MASTER_CALIBRATIONS['round-neck-tshirt'];
  }, [selectedProductId]);

  // Ensure selected placement exists for current product
  useEffect(() => {
    if (!availablePlacements.some((p) => p.id === selectedPlacementId)) {
      setSelectedPlacementId(availablePlacements[0]?.id || 'center_chest');
    }
  }, [selectedProductId, availablePlacements, selectedPlacementId]);

  // Active calibration object
  const activeCalibration = useMemo(() => {
    return getCalibratedPrintArea(selectedProductId, selectedSize, selectedPlacementId);
  }, [selectedProductId, selectedSize, selectedPlacementId]);

  // Local editable state for interactive tuning
  const [bounds, setBounds] = useState(activeCalibration.bounds);
  const [maxWidthInches, setMaxWidthInches] = useState(activeCalibration.maxWidthInches);
  const [maxHeightInches, setMaxHeightInches] = useState(activeCalibration.maxHeightInches);
  const [name, setName] = useState(activeCalibration.name);

  // Sync state when active calibration changes
  useEffect(() => {
    setBounds(activeCalibration.bounds);
    setMaxWidthInches(activeCalibration.maxWidthInches);
    setMaxHeightInches(activeCalibration.maxHeightInches);
    setName(activeCalibration.name);
  }, [activeCalibration]);

  // Selected product object for realistic mockup rendering
  const activeProductObj = useMemo(() => {
    return INITIAL_PRODUCTS.find((p) => p.id === selectedProductId) || INITIAL_PRODUCTS[0];
  }, [selectedProductId]);

  // Dragging & Resizing Refs for interactive preview stage
  const stageRef = useRef(null);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const startPointerRef = useRef({ x: 0, y: 0 });
  const startBoundsRef = useRef(bounds);

  const handlePointerDownDrag = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startPointerRef.current = { x: e.clientX, y: e.clientY };
    startBoundsRef.current = { ...bounds };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerDownResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    startPointerRef.current = { x: e.clientX, y: e.clientY };
    startBoundsRef.current = { ...bounds };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    if (!stageRef.current) return;
    const stageRect = stageRef.current.getBoundingClientRect();
    const deltaXPercent = (e.clientX - startPointerRef.current.x) / stageRect.width;
    const deltaYPercent = (e.clientY - startPointerRef.current.y) / stageRect.height;

    if (isDraggingRef.current) {
      const newX = Math.max(0.02, Math.min(0.98 - startBoundsRef.current.w, startBoundsRef.current.x + deltaXPercent));
      const newY = Math.max(0.02, Math.min(0.98 - startBoundsRef.current.h, startBoundsRef.current.y + deltaYPercent));
      setBounds((prev) => ({
        ...prev,
        x: parseFloat(newX.toFixed(3)),
        y: parseFloat(newY.toFixed(3)),
      }));
    } else if (isResizingRef.current) {
      const newW = Math.max(0.05, Math.min(0.95 - startBoundsRef.current.x, startBoundsRef.current.w + deltaXPercent));
      const newH = Math.max(0.05, Math.min(0.95 - startBoundsRef.current.y, startBoundsRef.current.h + deltaYPercent));
      setBounds((prev) => ({
        ...prev,
        w: parseFloat(newW.toFixed(3)),
        h: parseFloat(newH.toFixed(3)),
      }));
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    isResizingRef.current = false;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  };

  // Save Calibration to LocalStorage & Engine
  const handleSave = () => {
    const success = saveCalibrationOverride(selectedProductId, selectedPlacementId, {
      name,
      bounds,
      maxWidthInches: parseFloat(maxWidthInches),
      maxHeightInches: parseFloat(maxHeightInches),
      maxDimension: `${maxWidthInches}" × ${maxHeightInches}"`,
    });
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  // Reset to Factory Default
  const handleReset = () => {
    resetCalibrationOverrides(selectedProductId);
    const master = MASTER_CALIBRATIONS[selectedProductId]?.find((p) => p.id === selectedPlacementId);
    if (master) {
      setBounds(master.bounds);
      setMaxWidthInches(master.maxWidthInches);
      setMaxHeightInches(master.maxHeightInches);
      setName(master.name);
    }
  };

  const garmentDims = GARMENT_SIZE_DIMENSIONS[selectedProductId]?.[selectedSize] || { widthInches: 22, heightInches: 29 };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 select-none animate-in fade-in">
      {/* Toast */}
      {saveSuccess && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-sm shadow-2xl animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5" />
          <span>Calibration successfully saved to system!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold uppercase">
              Admin Tool
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white font-display">
              PRINT PLACEMENT & COORDINATE CALIBRATOR
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visually calibrate physical print zones, inch boundaries, and wearer perspectives for real manufacturing output.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Factory</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-black flex items-center gap-1.5 shadow-md hover:shadow-glow-cyan transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Calibration</span>
          </button>
        </div>
      </div>

      {/* Top Filter Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-3xl bg-[#0c101d] border border-slate-800 shadow-xl">
        {/* Product Selector */}
        <div>
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
            1. Select Product:
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 cursor-pointer font-mono"
          >
            {productsList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Size Selector */}
        <div>
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
            2. Select Garment Size:
          </label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 cursor-pointer font-mono"
          >
            {['S', 'M', 'L', 'XL', '2XL', '3XL'].map((s) => (
              <option key={s} value={s}>
                Size {s} ({GARMENT_SIZE_DIMENSIONS[selectedProductId]?.[s]?.widthInches || 22}"W × {GARMENT_SIZE_DIMENSIONS[selectedProductId]?.[s]?.heightInches || 29}"H)
              </option>
            ))}
          </select>
        </div>

        {/* Placement Selector */}
        <div>
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
            3. Select Print Placement:
          </label>
          <select
            value={selectedPlacementId}
            onChange={(e) => setSelectedPlacementId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-cyan-400 focus:outline-none focus:border-cyan-500 cursor-pointer font-mono"
          >
            {availablePlacements.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.surface?.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main 2-Column Calibration Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Visual Canvas */}
        <div className="lg:col-span-7 space-y-3">
          <div
            ref={stageRef}
            className="relative w-full aspect-square rounded-3xl bg-[#090d18] border border-slate-800 p-6 flex items-center justify-center shadow-2xl overflow-hidden"
          >
            {/* Base Product Mockup */}
            <RealisticProductMockup
              product={activeProductObj}
              color="#1e293b"
              activeSide={activeCalibration.surface || 'front'}
              showGuideline={false}
              zoom={1}
            />

            {/* Interactive Calibrated Bounding Box */}
            <div
              onPointerDown={handlePointerDownDrag}
              className="absolute z-40 border-2 border-dashed border-cyan-400 bg-cyan-400/15 rounded-xl cursor-move shadow-[0_0_20px_rgba(6,182,212,0.3)] flex flex-col items-center justify-between p-2 select-none group"
              style={{
                left: `${bounds.x * 100}%`,
                top: `${bounds.y * 100}%`,
                width: `${bounds.w * 100}%`,
                height: `${bounds.h * 100}%`,
              }}
            >
              {/* Top Placement Name Tag */}
              <div className="px-2 py-0.5 rounded bg-black/90 border border-cyan-500 text-[10px] font-mono font-bold text-cyan-300 shadow whitespace-nowrap">
                {activeCalibration.name}
              </div>

              {/* Center Dimension Info */}
              <div className="text-[11px] font-mono font-bold text-white text-center drop-shadow">
                {maxWidthInches}" × {maxHeightInches}"
              </div>

              {/* Bottom Right Resize Handle */}
              <div
                onPointerDown={handlePointerDownResize}
                className="absolute -bottom-2.5 -right-2.5 w-6 h-6 rounded-full bg-cyan-400 hover:bg-white text-black flex items-center justify-center cursor-nwse-resize shadow-lg z-50 transition-transform hover:scale-125"
                title="Drag to resize print area"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
            <Move className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Click and drag inside the cyan box to move. Drag bottom-right corner to resize.</span>
          </div>
        </div>

        {/* Right Column: Physical Coordinate Controls */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-[#0c101d] border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                Active Placement Specs
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {activeCalibration.name}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              {activeCalibration.surface?.toUpperCase()} VIEW
            </span>
          </div>

          {/* Physical Dimensions Inputs */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono font-bold text-slate-400 block mb-1">
                  MAX PRINT WIDTH (INCHES)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={maxWidthInches}
                  onChange={(e) => setMaxWidthInches(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono font-bold text-slate-400 block mb-1">
                  MAX PRINT HEIGHT (INCHES)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={maxHeightInches}
                  onChange={(e) => setMaxHeightInches(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Normalized Coordinate Bounds */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                Normalized Coordinate Bounds (0.0 to 1.0):
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>X Position: <strong className="text-cyan-400">{bounds.x}</strong> ({(bounds.x * 100).toFixed(1)}%)</div>
                <div>Y Position: <strong className="text-cyan-400">{bounds.y}</strong> ({(bounds.y * 100).toFixed(1)}%)</div>
                <div>Width: <strong className="text-cyan-400">{bounds.w}</strong> ({(bounds.w * 100).toFixed(1)}%)</div>
                <div>Height: <strong className="text-cyan-400">{bounds.h}</strong> ({(bounds.h * 100).toFixed(1)}%)</div>
              </div>
            </div>

            {/* Wearer Perspective Info */}
            <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                <Info className="w-4 h-4" />
                <span>Wearer Perspective Alignment:</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Wearer's Left Chest is positioned on the viewer's right side (X: ~56%). Wearer's Right Chest is positioned on the viewer's left side (X: ~24%).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            <span>SAVE CALIBRATION SETTINGS</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminCalibrationTab;
