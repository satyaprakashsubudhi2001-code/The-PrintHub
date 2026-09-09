import React, { useState } from 'react';
import {
  Tag,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Percent,
} from 'lucide-react';
import { OFFERS_LIST, QUANTITY_TIERS } from '../../constants/products';
import { useStore } from '../../context/StoreContext';

export function OffersView() {
  const { navigateTo } = useStore();
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 select-none bg-[#E5DAC9] text-[#183630]">
      <div className="max-w-[1500px] mx-auto space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#183630]/70">
          <button
            onClick={() => navigateTo('home')}
            className="hover:text-[#183630] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-[#183630] font-bold">
            Offers & Deals
          </span>
        </div>

        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl border border-[#B8A98F] bg-[#183630] text-[#E5DAC9] shadow-md transition-all">
          <div className="flex items-center gap-2 text-xs font-bold text-[#E5C690] uppercase tracking-wider mb-2">
            <Tag className="w-4 h-4 text-[#E5C690]" />
            <span>Exclusive Promotions & Discounts</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#E5DAC9]">
            Active Deals & Coupon Codes
          </h1>
          <p className="text-xs sm:text-sm mt-2 max-w-2xl text-[#E5DAC9]/80">
            Use these verified coupon codes for instant discounts, or enjoy automatic tiered pricing when placing volume orders in our 3D Studio.
          </p>
        </div>

        {/* Coupon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {OFFERS_LIST.map((offer) => {
            const isCopied = copiedCode === offer.code;
            return (
              <div
                key={offer.id}
                className="p-6 sm:p-7 rounded-3xl border-2 border-[#B8A98F] bg-[#E5DAC9] shadow-sm hover:border-[#183630] relative overflow-hidden flex flex-col justify-between space-y-5 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border inline-block bg-[#E5C690]/30 text-[#183630] border-[#B8A98F]"
                    >
                      {offer.badge}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#183630] transition-colors">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-[#183630]/80">
                      {offer.desc}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xl sm:text-2xl font-black font-mono block text-[#183630]">
                      {offer.discount}
                    </span>
                    <span className="text-[10px] text-[#183630]/60 font-medium">
                      {offer.expiry}
                    </span>
                  </div>
                </div>

                {/* Coupon Code Action Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-[#B8A98F]/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#183630]/70">Coupon:</span>
                    <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider border bg-[#183630]/10 border-[#B8A98F] text-[#183630]">
                      {offer.code}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(offer.code)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] shadow-sm"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-[#E5C690]" /> : <Copy className="w-3.5 h-3.5 text-[#E5DAC9]" />}
                    <span>{isCopied ? 'Code Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bulk Quantity Discount Breakdown Table */}
        <div className="p-6 sm:p-8 rounded-3xl border border-[#B8A98F] bg-[#E5DAC9] shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#183630] uppercase tracking-wider">
              <Percent className="w-4 h-4 text-[#183630]" />
              <span>Automatic Volume Scaling</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#183630]">
              Bulk Order Automatic Tier Discounts
            </h2>
            <p className="text-xs text-[#183630]/80">
              No coupon code needed! Volume discounts are computed live during customized 3D design generation and instant checkout quotes.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {QUANTITY_TIERS.map((tier) => (
              <div
                key={tier.label}
                className="p-4 rounded-2xl border border-[#B8A98F] bg-[#183630]/5 flex flex-col justify-between space-y-2 text-center transition-all"
              >
                <span className="text-xs font-bold text-[#183630]/70">
                  {tier.min === 100 ? '100+ pcs' : `${tier.min} - ${tier.max} pcs`}
                </span>
                <div
                  className="text-xl font-black font-mono text-[#183630]"
                >
                  {tier.discountPercent === 0 ? 'Base Price' : `${tier.discountPercent}% OFF`}
                </div>
                <span className="text-[10px] text-[#183630]/70 font-medium">{tier.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#B8A98F]/50">
            <p className="text-xs text-[#183630]/80">
              Need custom printing for more than 500+ units? Speak directly with our production manager for custom mill fabric runs.
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  navigateTo('products');
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold border border-[#183630] text-[#183630] hover:bg-[#183630]/10 transition-colors cursor-pointer"
              >
                Browse Catalog
              </button>
              <button
                onClick={() => navigateTo('design-by-customer')}
                className="px-6 py-2.5 rounded-xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] font-black text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E5C690]" />
                <span>Open 3D Studio</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E5C690]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OffersView;
