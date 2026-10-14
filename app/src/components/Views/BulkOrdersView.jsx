import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, MessageCircle, Package, ShieldCheck, Truck, Users } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { WhatsAppIcon } from '../UI/WhatsAppIcon';

/**
 * BulkOrdersView — Commercial Indian Enterprise & Team Custom Merchandise
 * Adheres strictly to the 4-Color Palette: #183630, #E5DAC9, #E5C690, #B8A98F
 * Features bracket option interactions for tiered volume selection.
 */
export function BulkOrdersView() {
  const { storeSettings } = useStore();
  const [selectedTier, setSelectedTier] = useState('100-500');
  const [selectedProductType, setSelectedProductType] = useState('T-Shirts');
  const [customUnits, setCustomUnits] = useState('250');

  const tiers = [
    { id: '25-100', label: '25 - 100 pcs', discount: '15% Off' },
    { id: '100-500', label: '100 - 500 pcs', discount: '25% Off' },
    { id: '500-1000', label: '500 - 1,000 pcs', discount: '35% Off' },
    { id: '1000+', label: '1,000+ pcs', discount: 'Custom Atelier Quote' },
  ];

  const productTypes = [
    'T-Shirts',
    'Hoodies',
    'Ceramic Mugs',
    'Business Cards',
    'Tote Bags',
    'Caps & Headwear',
  ];

  const whatsappNumber = '917992801158';
  const whatsappMsg = encodeURIComponent(
    `Hello The PrintHub! I would like to request a bulk order quotation:\n\n` +
    `• Product Category: ${selectedProductType}\n` +
    `• Estimated Volume Tier: ${selectedTier}\n` +
    `• Target Quantity: ${customUnits} units\n\n` +
    `Please share pricing breakdown, fabric samples, and digital proof options.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  return (
    <div className="min-h-screen bg-[#E5DAC9] text-[#183630] pb-24 select-none">
      {/* Hero Header */}
      <section className="bg-[#183630] text-[#E5DAC9] py-16 sm:py-20 px-4 sm:px-8 border-b border-[#B8A98F]/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E5DAC9]/10 text-[#E5C690] border border-[#B8A98F]/40">
            <Users className="w-3.5 h-3.5" />
            <span>Corporate, Colleges & Brand Merchandise</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-[#E5DAC9]">
            Volume Printing with <br />
            <span className="text-[#E5C690]">Atelier Precision.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#E5DAC9]/85 max-w-2xl mx-auto leading-relaxed">
            Equip your entire organization, event, or startup with consistent Pantone-calibrated print runs. Dedicated account management, complimentary digital proofs, and PAN-India logistics.
          </p>
        </div>
      </section>

      {/* Main Bulk Configurator Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 -mt-8 relative z-20">
        <div className="bg-[#E5DAC9] border-2 border-[#B8A98F] rounded-2xl p-6 sm:p-10 shadow-ph-elevated space-y-8">
          {/* Step 1: Product Selection with Bracket Interaction */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#183630]/75">
              1. Select Merchandise Category
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {productTypes.map((prod) => {
                const isSelected = selectedProductType === prod;
                return (
                  <button
                    key={prod}
                    onClick={() => setSelectedProductType(prod)}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bracket-selected bg-[#183630] text-[#E5DAC9] border border-[#B8A98F]'
                        : 'bracket-option bg-[#E5DAC9] text-[#183630] border border-[#B8A98F]/60 hover:border-[#183630]'
                    }`}
                  >
                    <span>{prod}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Volume Tier Selection with Bracket Interaction */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#183630]/75">
              2. Select Order Volume Tier
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {tiers.map((t) => {
                const isSelected = selectedTier === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTier(t.id)}
                    className={`p-4 rounded-xl text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bracket-selected bg-[#183630] text-[#E5DAC9] border-[#B8A98F]'
                        : 'bracket-option bg-[#E5DAC9] text-[#183630] border-[#B8A98F]/60 hover:border-[#183630]'
                    }`}
                  >
                    <div className="text-sm font-black">{t.label}</div>
                    <div className={`text-xs mt-1 font-semibold ${isSelected ? 'text-[#E5C690]' : 'text-[#183630]/75'}`}>
                      {t.discount}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Exact Units Input & Quote Generator */}
          <div className="pt-4 border-t border-[#B8A98F]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-bold text-[#183630]/80 mb-1.5">
                Target Estimated Units
              </label>
              <input
                type="number"
                value={customUnits}
                onChange={(e) => setCustomUnits(e.target.value)}
                min="25"
                max="10000"
                className="w-full sm:w-48 px-4 py-2.5 rounded-lg text-sm font-bold bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]"
              />
            </div>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto"
              >
                <WhatsAppIcon size={18} className="w-4 h-4 shrink-0" />
                <span>Instant Bulk WhatsApp Quote</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Features Pillars */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-beige p-6 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#183630] text-[#E5C690] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-base font-black text-[#183630]">Pantone Lab Calibration</h4>
          <p className="text-xs text-[#183630]/80 leading-relaxed">
            Exact match color grading across all garment batches with zero shade variance.
          </p>
        </div>

        <div className="card-beige p-6 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#183630] text-[#E5C690] flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <h4 className="text-base font-black text-[#183630]">Pre-Production Physical Proof</h4>
          <p className="text-xs text-[#183630]/80 leading-relaxed">
            We courier a physical printed sample for leadership sign-off prior to bulk production.
          </p>
        </div>

        <div className="card-beige p-6 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#183630] text-[#E5C690] flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h4 className="text-base font-black text-[#183630]">Multi-Office Distribution</h4>
          <p className="text-xs text-[#183630]/80 leading-relaxed">
            Split-dispatch across multiple domestic and international corporate hubs with tracking.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BulkOrdersView;
