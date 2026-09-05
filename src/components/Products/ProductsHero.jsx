import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Flame,
} from 'lucide-react';

export function ProductsHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#12002E] via-[#2C0E63] to-[#12002E] border border-[#2C0E63]/30 p-6 sm:p-10 shadow-2xl select-none text-white">
      {/* Ambient background glows & print grid */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#DA0090]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#F2CB30]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12002E] border border-[#DA0090]/40 shadow-sm text-[#F2CB30] text-xs font-black uppercase font-mono tracking-wider">
          <Flame className="w-3.5 h-3.5 text-[#DA0090] fill-[#DA0090]" />
          <span>The PrintHub Merchandise Catalog</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight leading-none uppercase">
          READY-TO-WEAR.<br />
          <span className="text-[#F2CB30] block">
            READY-TO-PRINT.
          </span>
          READY TO BUY.
        </h1>

        <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
          Explore our catalog of finished streetwear designs or customize any apparel in 3D. Highest-grade 100% bio-washed cotton cured with industrial HD-DTF for zero fade.
        </p>

        {/* Feature Pills */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap pt-2 text-xs text-slate-200 font-medium">
          <div className="flex items-center gap-1.5 bg-[#12002E]/80 border border-white/10 px-3 py-1.5 rounded-xl shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#DA0090]" />
            <span>Curated PrintHub Designs</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#12002E]/80 border border-white/10 px-3 py-1.5 rounded-xl shadow-sm">
            <Truck className="w-3.5 h-3.5 text-[#F2CB30]" />
            <span>2–4 Days Express Air Shipping</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#12002E]/80 border border-white/10 px-3 py-1.5 rounded-xl shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DA0090]" />
            <span>100% Cotton Bio-Washed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
