import React from 'react';
import {
  Palette,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Box,
  MessageCircle,
  Printer,
  RefreshCw,
  Award,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_PRODUCTS } from '../../constants/products';

/**
 * The PrintHub — Homepage & Product Exploration Hub
 * Pure Custom Merchandise Design & Submission Platform
 */
export function HomeView() {
  const {
    products,
    selectProduct,
    navigateTo,
    storeSettings,
  } = useStore();

  const allProducts = products && products.length > 0 ? products : INITIAL_PRODUCTS;

  const handleStartDesigningProduct = (prod) => {
    selectProduct(prod);
    navigateTo('design-by-customer');
  };

  const whatsappNumber = storeSettings?.whatsapp?.replace(/\D/g, '') || '917992801158';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hi The PrintHub team! I would like to inquire about custom merchandise and bulk manufacturing.'
  )}`;

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 select-none">
      {/* =========================================================================
         1. HERO SECTION
         ========================================================================= */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 pb-12 sm:pb-20 border-b border-white/[0.08]">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none" />

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-400/15 border border-lime-400/30 text-lime-400 text-xs font-mono font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Zero Minimum Orders • 300 DPI DTF Printing</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-display uppercase tracking-tight leading-[1.08]">
                CUSTOM MERCHANDISE <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-cyan-400 to-indigo-400">
                  DESIGNED BY YOU.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                Explore premium apparel and accessory blanks, create your concepts in our photorealistic design studio, and submit your design requests directly to our production team.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigateTo('design-by-customer')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(163,230,53,0.4)] hover:shadow-[0_0_35px_rgba(163,230,53,0.6)] hover:scale-105 active:scale-95 transition-all font-display"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>OPEN DESIGN STUDIO</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('products')}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all font-display hover:scale-105 active:scale-95"
                >
                  <Box className="w-4 h-4 text-cyan-400" />
                  <span>EXPLORE PRODUCT BLANKS</span>
                </button>
              </div>

              {/* Quality Keypoints Strip */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm font-black text-white font-mono">100% Cotton</span>
                  <p className="text-[10px] text-slate-400">Bio-Washed Blanks</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm font-black text-white font-mono">300 DPI HD</span>
                  <p className="text-[10px] text-slate-400">DTF & Embroidery</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm font-black text-lime-400 font-mono">WhatsApp</span>
                  <p className="text-[10px] text-slate-400">Instant Handoff</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-[#0c101d] border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      INTERACTIVE STUDIO PREVIEW
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold">
                    3D / 2D CALIBRATED
                  </span>
                </div>

                <div className="w-full aspect-square rounded-2xl bg-slate-950 p-6 flex items-center justify-center relative overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"
                    alt="Oversized T-Shirt Preview"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-4 bottom-4 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">Oversized Streetwear Tee</span>
                    <span className="text-lime-400 font-bold">Starting from ₹599</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigateTo('design-by-customer')}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 font-display hover:brightness-110 transition-all"
                >
                  <Palette className="w-4 h-4" />
                  <span>LAUNCH THIS BLANK IN STUDIO</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         2. CORE 8 PRODUCT BLANKS SECTION
         ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <span className="text-xs font-mono font-bold text-lime-400 uppercase tracking-wider block">
              CUSTOM PRODUCT CATALOG
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-display uppercase tracking-tight mt-1">
              CHOOSE A MERCHANDISE BLANK
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              8 premium product categories ready for your high-resolution custom graphics.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('products')}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase"
          >
            <span>View All Specs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 8 Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allProducts.map((prod) => (
            <div
              key={prod.id}
              className="group relative rounded-3xl bg-[#0c101d] border border-slate-800 hover:border-lime-400/60 transition-all duration-300 flex flex-col justify-between p-5 hover:-translate-y-1.5 hover:shadow-2xl select-none"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-lime-400/15 border border-lime-400/30 text-lime-400 text-[10px] font-black font-mono">
                    {prod.badge || 'POPULAR'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    Starting from ₹{prod.basePrice}
                  </span>
                </div>

                <div className="w-full aspect-square rounded-2xl bg-slate-950 p-4 mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-1 mb-4">
                  <h3 className="font-display text-base font-bold text-white group-hover:text-lime-400 transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {prod.subtitle || '100% Combed Cotton • Bio-Washed • 300 DPI High-Density DTF Ready'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleStartDesigningProduct(prod)}
                className="w-full py-3 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(163,230,53,0.3)] font-display transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>START DESIGNING</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
         3. HOW IT WORKS / CUSTOMER JOURNEY
         ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            SEAMLESS WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
            HOW THE PRINTHUB WORKS
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Zero friction, zero registration hurdles. From your concept to production handoff in 3 steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-[#0c101d] border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-600/30 flex items-center justify-center text-lg font-black font-mono">
              01
            </div>
            <h3 className="text-lg font-bold text-white font-display uppercase">
              Choose Product & Placements
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select your blank from regular tees, oversized tees, hoodies, polosp, aprons, mugs, caps, and badges. Choose front, chest, back, sleeves, or full wrap print locations.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0c101d] border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-lg font-black font-mono">
              02
            </div>
            <h3 className="text-lg font-bold text-white font-display uppercase">
              Upload & Calibrate in Studio
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload multiple artwork files (PNG, JPG, PDF) or create text layers. Scale, rotate, lock aspect ratios, and calibrate physical print dimensions in exact inches.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0c101d] border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-lime-400/20 text-lime-400 border border-lime-400/30 flex items-center justify-center text-lg font-black font-mono">
              03
            </div>
            <h3 className="text-lg font-bold text-white font-display uppercase">
              Submit & WhatsApp Handoff
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your name, WhatsApp, and Gmail. Receive an instant Request ID. Continue directly on WhatsApp with our production engineers for quotes and delivery schedules.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
         4. WHATSAPP & PRODUCTION CTA BANNER
         ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/30 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left shadow-2xl">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>DIRECT FACTORY SUPPORT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase">
              HAVE A BULK OR CUSTOM MERCH PROJECT?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Speak directly with our print production team over WhatsApp for specialized corporate uniforms, event merchandise, esports jerseys, or cafe apparel.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] font-display transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>CHAT ON WHATSAPP</span>
            </a>

            <button
              type="button"
              onClick={() => navigateTo('design-by-customer')}
              className="px-8 py-4 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.4)] font-display transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>START DESIGNING</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeView;
