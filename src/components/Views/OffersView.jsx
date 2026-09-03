import React, { useState } from 'react';
import {
  Tag,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';
import { OFFERS_LIST, QUANTITY_TIERS } from '../../constants/products';
import { useStore } from '../../context/StoreContext';

export function OffersView() {
  const { navigateTo, currentTheme } = useStore();
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12 select-none">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 text-left">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
          <Tag className="w-4 h-4" />
          <span>Exclusive Promotions & Discounts</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-white mt-1">
          Active Deals & Coupon Codes
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Apply these coupon codes during checkout or customize in bulk for automatic volume discounts.
        </p>
      </div>

      {/* Coupon Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {OFFERS_LIST.map((offer) => {
          const isCopied = copiedCode === offer.code;
          return (
            <div
              key={offer.id}
              className="p-6 rounded-3xl glass-panel border border-slate-700/60 relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-indigo-500/60 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {offer.badge}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2 group-hover:text-indigo-400 transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{offer.desc}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-lg font-black text-indigo-400 font-display block">
                    {offer.discount}
                  </span>
                  <span className="text-[10px] text-slate-500">{offer.expiry}</span>
                </div>
              </div>

              {/* Coupon Code Action Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Coupon Code:</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-900 border border-indigo-500/40 text-xs font-mono font-bold text-indigo-400">
                    {offer.code}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(offer.code)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isCopied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulk Quantity Discount Breakdown Table */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-700/60 space-y-6">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-black text-white">
            Bulk Order Automatic Tier Discounts
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            No coupon code required! Volume discounts are calculated automatically in the 3D Customizer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {QUANTITY_TIERS.map((tier) => (
            <div
              key={tier.label}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-2 text-center"
            >
              <span className="text-xs font-bold text-slate-400">
                {tier.min === 100 ? '100+ pcs' : `${tier.min} - ${tier.max} pcs`}
              </span>
              <div className="text-xl font-black text-indigo-400 font-display">
                {tier.discountPercent === 0 ? 'Regular Price' : `${tier.discountPercent}% OFF`}
              </div>
              <span className="text-[10px] text-slate-500">{tier.label}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <button
            onClick={() => navigateTo('design-by-customer')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} ${currentTheme.glow} text-white text-xs font-bold hover:scale-105 transition-all`}
          >
            <span>Start Bulk Customization in 3D</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
