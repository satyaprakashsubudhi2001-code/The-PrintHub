import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Layers,
  DollarSign,
  Maximize2,
  CheckCircle2,
  Settings,
  Eye,
  Plus,
  Trash2,
  Save,
} from 'lucide-react';
import { AdminCalibrationTab } from './AdminCalibrationTab';
import { useStore } from '../../context/StoreContext';

export function Admin3DStudioConfigTab() {
  const [subView, setSubView] = useState('calibrator'); // 'calibrator' | 'pricing' | 'presets'
  const { logAdminActivity } = useStore();

  const [printFeeConfig, setPrintFeeConfig] = useState({
    basePrintIncluded: true,
    frontPrintFee: 0,
    backPrintFee: 150,
    sleevePrintFee: 80,
    hoodPrintFee: 120,
    dtfFilmDpi: 300,
    maxUploadSizeMb: 50,
    minResolutionPx: 1200,
    allowEmbroidery: true,
    embroideryFee: 200,
  });

  const [savedMessage, setSavedMessage] = useState(false);

  const handleSavePricing = (e) => {
    e.preventDefault();
    logAdminActivity('3D_STUDIO', 'UPDATE_PRINT_PRICING', 'STUDIO_FEES', { config: printFeeConfig });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-[#183630]">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#183630] uppercase font-display tracking-tight">
              3D Customizer Studio & Print Area Calibrator
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#183630] text-[#E5DAC9] text-[10px] font-bold">
              [ FACTORY SPECIFICATION ]
            </span>
          </div>
          <p className="text-[#183630]/75 text-xs font-sans mt-1">
            Configure customizer printable product dimensions, print placement coordinates (chest, back, sleeves), DPI rendering limits, and extra placement printing fees.
          </p>
        </div>

        {/* Sub-view switcher buttons with [ Bracket ] treatment */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubView('calibrator')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subView === 'calibrator'
                ? 'bracket-selected font-black text-[#183630]'
                : 'bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]/80 hover:border-[#183630]'
            }`}
          >
            {subView === 'calibrator' ? '[ 3D VISUAL CALIBRATOR ]' : '3D VISUAL CALIBRATOR'}
          </button>

          <button
            type="button"
            onClick={() => setSubView('pricing')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subView === 'pricing'
                ? 'bracket-selected font-black text-[#183630]'
                : 'bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]/80 hover:border-[#183630]'
            }`}
          >
            {subView === 'pricing' ? '[ PRINT FEES & LIMITS ]' : 'PRINT FEES & LIMITS'}
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-2xl bg-[#183630] text-[#E5DAC9] border border-[#B8A98F] flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#E5C690]" />
          <span>[ 3D STUDIO PRICING AND RESOLUTION LIMITS UPDATED ]</span>
        </div>
      )}

      {/* SUB-VIEW 1: INTERACTIVE 3D VISUAL CALIBRATOR */}
      {subView === 'calibrator' && (
        <div className="animate-in fade-in">
          <AdminCalibrationTab />
        </div>
      )}

      {/* SUB-VIEW 2: PRINT FEES & LIMITS */}
      {subView === 'pricing' && (
        <form onSubmit={handleSavePricing} className="animate-in fade-in space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Extra Location Fees */}
            <div className="p-6 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-[#B8A98F]/40 pb-3">
                <DollarSign className="w-4 h-4 text-[#183630]" />
                <h3 className="text-xs font-bold text-[#183630] uppercase">
                  Multi-Location Print Surcharges
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[#183630] font-bold block mb-1">
                    Front Print Included in Base Price
                  </label>
                  <select
                    value={printFeeConfig.basePrintIncluded ? 'true' : 'false'}
                    onChange={(e) =>
                      setPrintFeeConfig({ ...printFeeConfig, basePrintIncluded: e.target.value === 'true' })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold"
                  >
                    <option value="true">YES - Front Print Included in Base Price</option>
                    <option value="false">NO - Extra Fee Applies to Front</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#183630] font-bold block mb-1">
                    Back Print Add-on Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={printFeeConfig.backPrintFee}
                    onChange={(e) =>
                      setPrintFeeConfig({ ...printFeeConfig, backPrintFee: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold"
                  />
                </div>

                <div>
                  <label className="text-[#183630] font-bold block mb-1">
                    Sleeve Print Add-on Fee (₹ per sleeve)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={printFeeConfig.sleevePrintFee}
                    onChange={(e) =>
                      setPrintFeeConfig({ ...printFeeConfig, sleevePrintFee: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold"
                  />
                </div>

                <div>
                  <label className="text-[#183630] font-bold block mb-1">
                    Embroidery Digitization & Stitching Surcharge (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={printFeeConfig.embroideryFee}
                    onChange={(e) =>
                      setPrintFeeConfig({ ...printFeeConfig, embroideryFee: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Right: Technical Resolution & File Specs */}
            <div className="p-6 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-[#B8A98F]/40 pb-3">
                <Sliders className="w-4 h-4 text-[#183630]" />
                <h3 className="text-xs font-bold text-[#183630] uppercase">
                  Artwork DPI & Ingestion Specs
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[#183630] font-bold block mb-1">
                    Target Print Quality DPI (Direct-to-Film)
                  </label>
                  <select
                    value={printFeeConfig.dtfFilmDpi}
                    onChange={(e) =>
                      setPrintFeeConfig({ ...printFeeConfig, dtfFilmDpi: parseInt(e.target.value) || 300 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold"
                  >
                    <option value="150">150 DPI (Fast Draft)</option>
                    <option value="300">300 DPI (Commercial High-Definition)</option>
                    <option value="600">600 DPI (Ultra Fine Luxury)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#183630] font-bold block mb-1">
                    Maximum Customer File Upload Size (MB)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={printFeeConfig.maxUploadSizeMb}
                    onChange={(e) =>
                      setPrintFeeConfig({ ...printFeeConfig, maxUploadSizeMb: parseInt(e.target.value) || 50 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold"
                  />
                </div>

                <div>
                  <label className="text-[#183630] font-bold block mb-1">
                    Minimum Recommended Resolution (Pixels Width)
                  </label>
                  <input
                    type="number"
                    min="800"
                    step="100"
                    value={printFeeConfig.minResolutionPx}
                    onChange={(e) =>
                      setPrintFeeConfig({ ...printFeeConfig, minResolutionPx: parseInt(e.target.value) || 1200 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#B8A98F]/40">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5C690] border border-[#B8A98F] font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>[ SAVE 3D STUDIO PRICING & RULES ]</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
