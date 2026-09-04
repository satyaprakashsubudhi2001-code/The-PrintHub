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
  const { navigateTo, storeSettings, currentTheme, themeMode } = useStore();
  const isLight = themeMode === 'light';

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-16 select-none transition-colors duration-300 ${
      isLight ? 'text-slate-900' : 'text-white'
    }`}>
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
          isLight
            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
            : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          <span>India’s Most Advanced 3D Merchandise Studio</span>
        </div>
        <h1 className={`font-display text-3xl sm:text-5xl font-black tracking-tight ${
          isLight ? 'text-slate-950' : 'text-white'
        }`}>
          Crafting Custom Merchandise with Industrial Precision
        </h1>
        <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          Founded with a mission to bridge the gap between creative design and high-grade textile manufacturing, {storeSettings.storeName} empowers individuals, startups, creator brands, and enterprises to customize physical products in interactive 3D.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-3xl border space-y-3 transition-colors ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-md'
            : 'bg-[#0c101d] border-slate-700/60 shadow-xl'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/40">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Direct-to-Film (DTF) Technology</h3>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Our state-of-the-art Japanese DTF printers produce razor-sharp 300 DPI graphics with zero color limits, flexible stretch retention, and 50+ wash durability.
          </p>
        </div>

        <div className={`p-6 rounded-3xl border space-y-3 transition-colors ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-md'
            : 'bg-[#0c101d] border-slate-700/60 shadow-xl'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/40">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>OEKO-TEX Certified Inks</h3>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            We use 100% skin-safe, hypoallergenic, water-based inks that are gentle on baby skin and completely free of toxic heavy metals.
          </p>
        </div>

        <div className={`p-6 rounded-3xl border space-y-3 transition-colors ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-md'
            : 'bg-[#0c101d] border-slate-700/60 shadow-xl'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Zero Minimum Order Quality</h3>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Whether you need 1 customized anniversary mug or 5,000 corporate jerseys for an IT convention, we deliver with the exact same industrial rigor.
          </p>
        </div>
      </div>

      {/* Manufacturing & Craftsmanship Banner */}
      <div className={`rounded-3xl border p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center transition-colors ${
        isLight
          ? 'bg-white border-slate-200 shadow-xl'
          : 'bg-[#0c101d] border-slate-700 shadow-2xl'
      }`}>
        <div className="space-y-4">
          <span className={`text-xs font-bold uppercase tracking-wider ${
            isLight ? 'text-indigo-700' : 'text-indigo-400'
          }`}>
            Our Facility & Capabilities
          </span>
          <h2 className={`font-display text-2xl sm:text-3xl font-black ${
            isLight ? 'text-slate-950' : 'text-white'
          }`}>
            End-to-End Production Under One Roof
          </h2>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            Operating from our 25,000 sq.ft facility in Gurugram, we handle fabric knitting, precision laser cutting, direct-to-garment digital printing, 3D embroidery, and thermal ceramic sublimation.
          </p>

          <div className={`space-y-2 text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Over 150,000+ custom products printed every month</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>4-level automated & manual QC check before dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Pan-India priority courier network with 48h dispatch</span>
            </div>
          </div>

          <button
            onClick={() => navigateTo('design-by-customer')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} ${currentTheme.glow} text-white text-xs font-bold transition-all mt-2 shadow-lg active:scale-95`}
          >
            <Palette className="w-4 h-4" />
            <span>Customize Merchandise Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className={`aspect-[4/3] rounded-2xl overflow-hidden border shadow-2xl ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-700/80'
        }`}>
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
