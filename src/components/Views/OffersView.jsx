import React, { useState } from 'react';
import {
  Tag,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Percent,
} from 'lucide-react';
import { OFFERS_LIST, QUANTITY_TIERS } from '../../constants/products';
import { useStore } from '../../context/StoreContext';

export function OffersView() {
  const { navigateTo, currentTheme, themeMode } = useStore();
  const [copiedCode, setCopiedCode] = useState(null);

  const isLight = themeMode === 'light';

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 select-none bg-[#FFFFFF] text-[#12002E]">
      <div className="max-w-[1500px] mx-auto space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <button
            onClick={() => navigateTo('home')}
            className="hover:text-[#DA0090] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-[#2C0E63] font-bold">
            Offers & Deals
          </span>
        </div>

        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 via-purple-50/20 to-slate-50 shadow-sm transition-all">
          <div className="flex items-center gap-2 text-xs font-bold text-[#DA0090] uppercase tracking-wider mb-2">
            <Tag className="w-4 h-4" />
            <span>Exclusive Promotions & Discounts</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#2C0E63]">
            Active Deals & Coupon Codes
          </h1>
          <p className="text-xs sm:text-sm mt-2 max-w-2xl text-slate-600">
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
                className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white shadow-sm hover:border-[#2C0E63] hover:shadow-md relative overflow-hidden flex flex-col justify-between space-y-5 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border inline-block bg-[#DA0090]/15 text-[#DA0090] border-[#DA0090]/30"
                    >
                      {offer.badge}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#2C0E63] group-hover:text-[#DA0090] transition-colors">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {offer.desc}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xl sm:text-2xl font-black font-mono block text-[#2C0E63]">
                      {offer.discount}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {offer.expiry}
                    </span>
                  </div>
                </div>

                {/* Coupon Code Action Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Coupon:</span>
                    <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider border bg-slate-100 border-slate-200 text-slate-800">
                      {offer.code}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(offer.code)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer bg-[#F2CB30] hover:bg-[#DA0090] hover:text-white text-[#12002E] shadow-sm"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Code Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bulk Quantity Discount Breakdown Table */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#DA0090] uppercase tracking-wider">
              <Percent className="w-4 h-4" />
              <span>Automatic Volume Scaling</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#2C0E63]">
              Bulk Order Automatic Tier Discounts
            </h2>
            <p className="text-xs text-slate-600">
              No coupon code needed! Volume discounts are computed live during customized 3D design generation and instant checkout quotes.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {QUANTITY_TIERS.map((tier) => (
              <div
                key={tier.label}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-2 text-center transition-all"
              >
                <span className="text-xs font-bold text-slate-400">
                  {tier.min === 100 ? '100+ pcs' : `${tier.min} - ${tier.max} pcs`}
                </span>
                <div
                  className={`text-xl font-black font-mono ${
                    tier.discountPercent > 0
                      ? 'text-[#DA0090]'
                      : 'text-slate-800'
                  }`}
                >
                  {tier.discountPercent === 0 ? 'Base Price' : `${tier.discountPercent}% OFF`}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{tier.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Need custom printing for more than 500+ units? Speak directly with our production manager for custom mill fabric runs.
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  navigateTo('products');
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold border border-[#2C0E63] text-[#2C0E63] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Browse Catalog
              </button>
              <button
                onClick={() => navigateTo('design-by-customer')}
                className="px-6 py-2.5 rounded-xl bg-[#F2CB30] hover:bg-[#DA0090] hover:text-white text-[#12002E] font-black text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open 3D Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OffersView;
