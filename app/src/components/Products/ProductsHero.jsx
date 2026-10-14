import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Flame,
} from 'lucide-react';

export function ProductsHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#183630] border border-[#B8A98F]/40 p-6 sm:p-10 shadow-2xl select-none text-[#E5DAC9]">
      <div className="relative z-10 max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183630] border border-[#B8A98F]/50 shadow-sm text-[#E5C690] text-xs font-black uppercase font-mono tracking-wider">
          <Flame className="w-3.5 h-3.5 text-[#E5C690] fill-[#E5C690]" />
          <span>The PrintHub Merchandise Catalog</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#E5DAC9] font-display tracking-tight leading-none uppercase">
          READY-TO-WEAR.<br />
          <span className="text-[#E5C690] block">
            READY-TO-PRINT.
          </span>
          READY TO BUY.
        </h1>

        <p className="text-xs sm:text-sm text-[#E5DAC9]/80 max-w-xl leading-relaxed">
          Explore our catalog of finished streetwear designs or customize any apparel in 3D. Highest-grade 100% bio-washed cotton cured with industrial HD-DTF for zero fade.
        </p>

        {/* Feature Pills */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap pt-2 text-xs text-[#E5DAC9] font-medium">
          <div className="flex items-center gap-1.5 bg-[#183630] border border-[#B8A98F]/40 px-3 py-1.5 rounded-xl shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E5C690]" />
            <span>Curated PrintHub Designs</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#183630] border border-[#B8A98F]/40 px-3 py-1.5 rounded-xl shadow-sm">
            <Truck className="w-3.5 h-3.5 text-[#E5C690]" />
            <span>2–4 Days Express Air Shipping</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#183630] border border-[#B8A98F]/40 px-3 py-1.5 rounded-xl shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E5C690]" />
            <span>100% Cotton Bio-Washed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
