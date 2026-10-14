import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Box,
  Sliders,
  FileCode,
  Download,
  Eye,
  Check,
  Layers,
  Sparkles,
  Printer,
} from 'lucide-react';
import { useCustomizer } from '../../context/CustomizerContext';
import { PRODUCTS } from '../../constants/products';
import { renderCustomizerCanvas } from '../3D/TextureCompositor';

export function AdminStudioModal() {
  const {
    isAdminOpen,
    setIsAdminOpen,
    selectedProduct,
    selectProduct,
    designs,
    texts,
    cliparts,
    cartItems,
  } = useCustomizer();

  const [activeTab, setActiveTab] = useState('uv_calibrator');
  const [selectedAreaIndex, setSelectedAreaIndex] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(cartItems[0] || null);

  if (!isAdminOpen) return null;

  const currentArea = selectedProduct.printAreas[selectedAreaIndex] || selectedProduct.printAreas[0];

  // Export 300 DPI Production Print File
  const handleExportPrintFile = async () => {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 4096;
    exportCanvas.height = 4096;

    await renderCustomizerCanvas({
      canvas: exportCanvas,
      printAreas: selectedProduct.printAreas,
      designs,
      texts,
      cliparts,
      showGuide: false,
      exportMode: true,
      width: 4096,
      height: 4096,
    });

    const dataUrl = exportCanvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `PrintHub_${selectedProduct.id}_${currentArea?.id || 'production'}_300DPI.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-4xl max-h-[90vh] bg-studio-850 border border-slate-700/80 rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-studio-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Admin 3D Product & UV Calibration Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  v2.4 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Manage 3D GLTF models, UV printable boundary calibration & production export
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Sub-Header */}
        <div className="flex items-center gap-2 px-5 py-2 bg-studio-900/60 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('uv_calibrator')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'uv_calibrator'
                ? 'bg-cyan-500 text-black shadow-glow-cyan'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            UV Print Area Calibrator
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-cyan-500 text-black shadow-glow-cyan'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Customer Orders & JSON Specs
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'uv_calibrator' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Product & Area Settings */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Assigned 3D Product Model
                  </label>
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-700">
                    <Box className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs font-mono text-cyan-300 flex-1">
                      {selectedProduct.modelPath}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">
                      GLTF / GLB
                    </span>
                  </div>
                </div>

                {/* Print Zones List */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Select Printable Zone to Calibrate
                  </label>
                  <div className="space-y-2">
                    {selectedProduct.printAreas.map((area, idx) => (
                      <button
                        key={area.id}
                        onClick={() => setSelectedAreaIndex(idx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                          selectedAreaIndex === idx
                            ? 'bg-cyan-500/10 border-cyan-500/60 text-cyan-300 font-bold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>{area.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {area.maxDimension}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bounds Sliders */}
                {currentArea && (
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-white flex items-center justify-between">
                      <span>UV Coordinate Bounds</span>
                      <span className="font-mono text-cyan-400">
                        {currentArea.name}
                      </span>
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Origin X (UV)</span>
                          <span className="font-mono">{currentArea.bounds.x}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={currentArea.bounds.x}
                          onChange={(e) => {
                            currentArea.bounds.x = parseFloat(e.target.value);
                          }}
                          className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Origin Y (UV)</span>
                          <span className="font-mono">{currentArea.bounds.y}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={currentArea.bounds.y}
                          onChange={(e) => {
                            currentArea.bounds.y = parseFloat(e.target.value);
                          }}
                          className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: 2D UV Map Preview & Export */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white">
                    Production Print Export (300 DPI High-Res)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Export high-resolution raster graphic formatted for DTF / Screen print machines without garment backdrop.
                  </p>

                  <button
                    onClick={handleExportPrintFile}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-black font-black text-xs shadow-glow-cyan flex items-center justify-center gap-2 transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Download Production DTF Print File (4096px PNG)</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 text-xs">
                  <div className="font-bold text-white mb-1">UV Print Area Mapping Engine</div>
                  All product printable bounds are dynamically calculated in normalized coordinate space and scaled smoothly to high-res textures.
                </div>
              </div>
            </div>
          ) : (
            /* Orders Tab */
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white">
                Customer Orders & Customization JSON Specs
              </h4>
              {cartItems.length === 0 ? (
                <p className="text-xs text-slate-400">No customer orders placed in this session.</p>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white">
                            Order #{order.id.slice(-6).toUpperCase()} - {order.productName}
                          </span>
                          <p className="text-[10px] text-slate-400">
                            {order.size} • {order.colorName} • Qty: {order.quantity} • ₹{order.totalPrice}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          DTF Ready
                        </span>
                      </div>

                      {/* Raw JSON Spec */}
                      <pre className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                        {JSON.stringify(order.config, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
