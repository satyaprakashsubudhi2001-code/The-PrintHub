import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Heart,
  Layers,
  CheckCircle2,
  Palette,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function AboutUsView() {
  const { navigateTo, storeSettings, currentTheme } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-16 select-none">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>India’s Most Advanced 3D Merchandise Studio</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
          Crafting Custom Merchandise with Industrial Precision
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Founded with a mission to bridge the gap between creative design and high-grade textile manufacturing, {storeSettings.storeName} empowers individuals, startups, creator brands, and enterprises to customize physical products in interactive 3D.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-slate-700/60 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/40">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Direct-to-Film (DTF) Technology</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our state-of-the-art Japanese DTF printers produce razor-sharp 300 DPI graphics with zero color limits, flexible stretch retention, and 50+ wash durability.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-slate-700/60 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">OEKO-TEX Certified Inks</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We use 100% skin-safe, hypoallergenic, water-based inks that are gentle on baby skin and completely free of toxic heavy metals.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-slate-700/60 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Zero Minimum Order Quality</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Whether you need 1 customized anniversary mug or 5,000 corporate jerseys for an IT convention, we deliver with the exact same industrial rigor.
          </p>
        </div>
      </div>

      {/* Manufacturing & Craftsmanship Banner */}
      <div className="rounded-3xl glass-panel border border-slate-700 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Our Facility & Capabilities
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            End-to-End Production Under One Roof
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Operating from our 25,000 sq.ft facility in Gurugram, we handle fabric knitting, precision laser cutting, direct-to-garment digital printing, 3D embroidery, and thermal ceramic sublimation.
          </p>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Over 150,000+ custom products printed every month</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>4-level automated & manual QC check before dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pan-India priority courier network with 48h dispatch</span>
            </div>
          </div>

          <button
            onClick={() => navigateTo('design-by-customer')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} ${currentTheme.glow} text-white text-xs font-bold transition-all mt-2`}
          >
            <Palette className="w-4 h-4" />
            <span>Customize Merchandise Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
            alt="PrintHub Factory Studio"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
