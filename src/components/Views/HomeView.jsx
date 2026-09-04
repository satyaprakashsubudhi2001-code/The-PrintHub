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
  Award,
  Flame,
  Star,
  Truck,
  HeartHandshake,
  Scissors,
  Compass,
  Check,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../Products/ProductCard';

/**
 * The PrintHub — Fear of God & AllSaints Inspired High-Fashion Atelier Experience
 * Editorial lookbook presentation, architectural typography, warm stone / bone / obsidian palette,
 * 4-step bespoke tailoring process, and industrial craftsmanship standards.
 */
export function HomeView() {
  const {
    products,
    navigateTo,
    storeSettings,
    themeMode,
  } = useStore();

  const isLight = themeMode === 'light';
  const allProducts = products || [];

  // Split products for curated collections
  const newArrivals = allProducts.slice(0, 4);
  const bestSellers = allProducts.slice(2, 6);

  const categories = [
    {
      id: 'Apparel',
      name: 'Heavyweight Streetwear',
      subtitle: '240+ GSM Oversized Tees, Polos & Terry Hoodies',
      itemCount: 'Architectural Cuts',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      badge: 'Core Silhouette',
    },
    {
      id: 'Drinkware',
      name: 'Matte & Ceramic Vessels',
      subtitle: '11oz AAA Grade High Gloss & Matte Black Mugs',
      itemCount: 'Zero-Fade Thermal Fusion',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      badge: 'Studio Drinkware',
    },
    {
      id: 'Headwear',
      name: 'Architectural Headwear',
      subtitle: 'Structured 6-Panel Snapback & Wool-Blend Caps',
      itemCount: '3D High-Density & DTF',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
      badge: 'Structured Crown',
    },
    {
      id: 'Accessories',
      name: 'Atelier Accoutrements',
      subtitle: '14oz Canvas Barista Aprons & Enamel Badges',
      itemCount: 'Heavyweight Hardware',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      badge: 'Bespoke Uniforms',
    },
  ];

  const handleCategoryClick = () => {
    navigateTo('products');
  };

  const whatsappNumber = storeSettings?.whatsapp?.replace(/\D/g, '') || '917992801158';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hi The PrintHub Atelier team! I would like to inquire about bespoke custom merchandise and bulk manufacturing.'
  )}`;

  return (
    <div className={`space-y-24 lg:space-y-36 pb-32 select-none transition-colors duration-300 ${
      isLight ? 'text-fog-950 bg-fog-bone' : 'text-fog-stone bg-fog-950'
    }`}>
      {/* =========================================================================
         1. FEAR OF GOD EDITORIAL HERO SECTION
         ========================================================================= */}
      <section className={`relative overflow-hidden pt-12 sm:pt-20 pb-20 sm:pb-32 border-b ${
        isLight ? 'border-fog-sand/80 bg-fog-bone' : 'border-fog-900 bg-fog-950'
      }`}>
        {/* Subtle Ambient Vignette */}
        <div className={`absolute top-0 right-1/4 w-[750px] h-[550px] pointer-events-none blur-[160px] opacity-40 ${
          isLight
            ? 'bg-gradient-to-tr from-amber-100/60 via-stone-200/40 to-transparent'
            : 'bg-gradient-to-tr from-stone-800/30 via-zinc-900/40 to-transparent'
        }`} />

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Architectural Typography & CTAs (7 Cols) */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              {/* Minimal Luxury Ticker Capsule */}
              <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-[11px] font-mono tracking-[0.2em] uppercase transition-colors ${
                isLight
                  ? 'bg-white border-fog-sand text-fog-800 shadow-sm'
                  : 'bg-fog-900/80 border-fog-800 text-fog-gold shadow-sm'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-fog-gold animate-ping" />
                <span>COLLECTION 2026 // BESPOKE MERCHANDISE ATELIER</span>
              </div>

              {/* High-Fashion Statement Headline (Fear of God Aesthetic) */}
              <div className="space-y-2">
                <h1 className={`font-display text-4xl sm:text-6xl lg:text-7xl font-light uppercase tracking-[0.14em] leading-[1.06] ${
                  isLight ? 'text-fog-950' : 'text-fog-bone'
                }`}>
                  ARCHITECTURAL <br className="hidden sm:inline" />
                  <span className="font-semibold tracking-[0.16em]">SILHOUETTES.</span> <br />
                  <span className={`italic font-serif font-normal lowercase tracking-normal text-3xl sm:text-5xl lg:text-6xl ${
                    isLight ? 'text-stone-500' : 'text-fog-sand/80'
                  }`}>
                    tailored for your vision.
                  </span>
                </h1>
              </div>

              {/* Supporting Subtext — Bespoke Tailoring Tone (The Pant Project & AllSaints) */}
              <p className={`text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans ${
                isLight ? 'text-stone-600 font-normal' : 'text-stone-400 font-light'
              }`}>
                Engineered garment blanks meets modern precision customizer. Scale your artwork in true physical inches, calibrate multi-panel front and back zones, and inspect photorealistic 3D draping before bespoke production.
              </p>

              {/* Fear of God Minimalist Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigateTo('design-by-customer')}
                  className="btn-luxury-primary w-full sm:w-auto px-9 py-4 rounded-full text-xs font-mono tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-fog-gold" />
                  <span>LAUNCH 3D ATELIER</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('products')}
                  className="btn-luxury-ghost w-full sm:w-auto px-8 py-4 rounded-full text-xs font-mono tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>VIEW SILHOUETTES</span>
                </button>
              </div>

              {/* Material Craftsmanship Specifications (Bear House / Pant Project Inspired) */}
              <div className={`grid grid-cols-3 gap-6 pt-10 border-t max-w-xl mx-auto lg:mx-0 text-left ${
                isLight ? 'border-fog-sand' : 'border-fog-900'
              }`}>
                <div className="space-y-1">
                  <span className={`text-xs sm:text-sm font-mono font-bold tracking-wider uppercase block ${
                    isLight ? 'text-fog-950' : 'text-fog-bone'
                  }`}>
                    240+ GSM
                  </span>
                  <p className="text-[11px] text-stone-500 uppercase tracking-widest font-mono">French Terry & Cotton</p>
                </div>
                <div className="space-y-1">
                  <span className={`text-xs sm:text-sm font-mono font-bold tracking-wider uppercase block ${
                    isLight ? 'text-fog-950' : 'text-fog-bone'
                  }`}>
                    300 DPI HD
                  </span>
                  <p className="text-[11px] text-stone-500 uppercase tracking-widest font-mono">Artisanal DTF Ink</p>
                </div>
                <div className="space-y-1">
                  <span className={`text-xs sm:text-sm font-mono font-bold tracking-wider uppercase block ${
                    isLight ? 'text-fog-950' : 'text-fog-gold'
                  }`}>
                    0 MOQ
                  </span>
                  <p className="text-[11px] text-stone-500 uppercase tracking-widest font-mono">Single Piece to Bulk</p>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fashion Lookbook Showcase (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className={`relative rounded-3xl border p-6 sm:p-8 space-y-6 transition-all ${
                isLight
                  ? 'bg-white border-fog-sand/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)]'
                  : 'bg-fog-900/90 border-fog-800 shadow-[0_25px_60px_rgba(0,0,0,0.4)]'
              }`}>
                {/* Lookbook Header Minimal Bar */}
                <div className={`flex items-center justify-between border-b pb-4 ${
                  isLight ? 'border-fog-sand' : 'border-fog-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-fog-gold animate-pulse" />
                    <span className={`text-[11px] font-mono tracking-[0.2em] uppercase font-bold ${
                      isLight ? 'text-fog-900' : 'text-fog-stone'
                    }`}>
                      Live 3D Atelier Stage
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase border ${
                    isLight
                      ? 'bg-stone-100 border-stone-300 text-stone-700'
                      : 'bg-fog-950 border-fog-800 text-fog-gold'
                  }`}>
                    Physical Calibration
                  </span>
                </div>

                {/* Editorial Product Lookbook Container */}
                <div className={`w-full aspect-[4/4.2] rounded-2xl p-6 flex items-center justify-center relative overflow-hidden group transition-colors ${
                  isLight ? 'bg-fog-stone' : 'bg-fog-950'
                }`}>
                  <img
                    src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"
                    alt="Bespoke Oversized Streetwear Silhouette Preview"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Floating Atelier Spec Overlay */}
                  <div className={`absolute inset-x-4 bottom-4 p-4 rounded-xl backdrop-blur-md border flex items-center justify-between text-xs font-mono shadow-lg transition-all ${
                    isLight
                      ? 'bg-white/95 border-fog-sand text-fog-950'
                      : 'bg-fog-900/90 border-fog-800 text-fog-stone'
                  }`}>
                    <div>
                      <span className="font-bold tracking-wider uppercase block text-[11px]">Bespoke Heavyweight Tee</span>
                      <span className="text-[10px] text-stone-500 tracking-wider uppercase">240 GSM Bio-Washed Combed Cotton</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-widest text-stone-400 block">Atelier Base</span>
                      <span className={`text-sm font-mono font-bold ${isLight ? 'text-fog-950' : 'text-fog-gold'}`}>₹599</span>
                    </div>
                  </div>
                </div>

                {/* Direct Studio Initiation CTA */}
                <button
                  type="button"
                  onClick={() => navigateTo('design-by-customer')}
                  className="btn-luxury-primary w-full py-4 rounded-xl text-xs font-mono tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Palette className="w-3.5 h-3.5 text-fog-gold" />
                  <span>CUSTOMIZE THIS SILHOUETTE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         2. THE 4-STEP BESPOKE ATELIER PROCESS (THE PANT PROJECT / BEAR HOUSE INSPIRATION)
         ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-8 ${
          isLight ? 'border-fog-sand' : 'border-fog-900'
        }`}>
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase block text-fog-gold">
              Bespoke Craftsmanship Workflow
            </span>
            <h2 className={`text-2xl sm:text-4xl font-light uppercase tracking-[0.14em] mt-1 font-display ${
              isLight ? 'text-fog-950' : 'text-fog-bone'
            }`}>
              How The Atelier Works
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-sans text-stone-500 max-w-md">
            From digital artwork calibration to master artisan garment finishing in 4 disciplined steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className={`p-8 rounded-3xl border space-y-4 relative transition-all duration-300 ${
            isLight
              ? 'bg-white border-fog-sand hover:border-fog-800/40 shadow-sm hover:shadow-lg'
              : 'bg-fog-900/60 border-fog-800 hover:border-fog-700 shadow-lg'
          }`}>
            <span className="text-2xl font-display font-light text-stone-400">01</span>
            <h3 className={`text-base font-bold font-display uppercase tracking-wider ${
              isLight ? 'text-fog-950' : 'text-fog-bone'
            }`}>
              Select Silhouette & GSM
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              Choose from curated 240+ GSM French Terry, Combed Cotton, and matty pique blanks engineered for durability and tailored drape.
            </p>
          </div>

          {/* Step 2 */}
          <div className={`p-8 rounded-3xl border space-y-4 relative transition-all duration-300 ${
            isLight
              ? 'bg-white border-fog-sand hover:border-fog-800/40 shadow-sm hover:shadow-lg'
              : 'bg-fog-900/60 border-fog-800 hover:border-fog-700 shadow-lg'
          }`}>
            <span className="text-2xl font-display font-light text-stone-400">02</span>
            <h3 className={`text-base font-bold font-display uppercase tracking-wider ${
              isLight ? 'text-fog-950' : 'text-fog-bone'
            }`}>
              Digital Atelier Placement
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              Upload vector graphics or typography. Position across center chest, oversized back, or subtle collar zones.
            </p>
          </div>

          {/* Step 3 */}
          <div className={`p-8 rounded-3xl border space-y-4 relative transition-all duration-300 ${
            isLight
              ? 'bg-white border-fog-sand hover:border-fog-800/40 shadow-sm hover:shadow-lg'
              : 'bg-fog-900/60 border-fog-800 hover:border-fog-700 shadow-lg'
          }`}>
            <span className="text-2xl font-display font-light text-stone-400">03</span>
            <h3 className={`text-base font-bold font-display uppercase tracking-wider ${
              isLight ? 'text-fog-950' : 'text-fog-bone'
            }`}>
              Physical Inch Calibration
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              Adjust scale directly in exact real-world inches with responsive multi-corner handles and live 3D mannequin rendering.
            </p>
          </div>

          {/* Step 4 */}
          <div className={`p-8 rounded-3xl border space-y-4 relative transition-all duration-300 ${
            isLight
              ? 'bg-white border-fog-sand hover:border-fog-800/40 shadow-sm hover:shadow-lg'
              : 'bg-fog-900/60 border-fog-800 hover:border-fog-700 shadow-lg'
          }`}>
            <span className="text-2xl font-display font-light text-stone-400">04</span>
            <h3 className={`text-base font-bold font-display uppercase tracking-wider ${
              isLight ? 'text-fog-950' : 'text-fog-bone'
            }`}>
              Artisanal DTF Production
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              Finished using 300 DPI high-definition DTF thermal curing for stretch retention, vivid pigmentation, and 50+ wash lifespan.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
         3. CURATED SILHOUETTES & CATEGORIES (MYNTRA LUXE & ALLSAINTS INSPIRATION)
         ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-6 ${
          isLight ? 'border-fog-sand' : 'border-fog-900'
        }`}>
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase block text-fog-gold">
              Curated Silhouettes
            </span>
            <h2 className={`text-2xl sm:text-4xl font-light uppercase tracking-[0.14em] mt-1 font-display ${
              isLight ? 'text-fog-950' : 'text-fog-bone'
            }`}>
              Shop by Category
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('products')}
            className={`inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase transition-colors ${
              isLight ? 'text-fog-950 hover:text-stone-600' : 'text-fog-stone hover:text-fog-gold'
            }`}
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Category Cards Grid — High-End Lookbook Aspect Ratio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={handleCategoryClick}
              className={`group relative rounded-3xl border overflow-hidden transition-all duration-500 cursor-pointer flex flex-col justify-between select-none ${
                isLight
                  ? 'bg-white border-fog-sand hover:border-fog-800/60 shadow-sm hover:shadow-xl'
                  : 'bg-fog-900/90 border-fog-800 hover:border-stone-500 shadow-xl hover:shadow-2xl'
              }`}
            >
              {/* Category Image Box */}
              <div className={`relative aspect-[4/4.8] overflow-hidden ${isLight ? 'bg-stone-100' : 'bg-fog-950'}`}>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />

                {/* Floating Minimal Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-3 py-1 rounded-full text-[9px] font-mono tracking-[0.2em] uppercase bg-black/80 text-fog-stone border border-white/10 backdrop-blur-md">
                    {category.badge}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute inset-x-4 bottom-4 space-y-1 text-white">
                  <h3 className="font-display text-lg font-bold tracking-wide">
                    {category.name}
                  </h3>
                  <p className="text-[11px] text-stone-300 font-sans line-clamp-1">
                    {category.subtitle}
                  </p>
                </div>
              </div>

              {/* Bottom Card Strip */}
              <div className={`p-4 flex items-center justify-between border-t ${
                isLight ? 'border-fog-sand bg-white' : 'border-fog-800 bg-fog-900'
              }`}>
                <span className="text-[11px] font-mono text-stone-400 uppercase tracking-widest">
                  {category.itemCount}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:translate-x-1 ${
                  isLight
                    ? 'bg-fog-stone text-fog-950 group-hover:bg-fog-950 group-hover:text-white'
                    : 'bg-fog-800 text-fog-stone group-hover:bg-white group-hover:text-fog-950'
                }`}>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
         4. NEW ARRIVALS & TRENDING SILHOUETTES
         ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-6 ${
          isLight ? 'border-fog-sand' : 'border-fog-900'
        }`}>
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase block text-fog-gold">
              Fresh In Atelier
            </span>
            <h2 className={`text-2xl sm:text-4xl font-light uppercase tracking-[0.14em] mt-1 font-display ${
              isLight ? 'text-fog-950' : 'text-fog-bone'
            }`}>
              New Arrivals
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('products')}
            className={`inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase transition-colors ${
              isLight ? 'text-fog-950 hover:text-stone-600' : 'text-fog-stone hover:text-fog-gold'
            }`}
          >
            <span>Explore All Silhouettes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Products Grid */}
        {newArrivals.length === 0 ? (
          <div className={`p-12 text-center rounded-3xl border ${isLight ? 'bg-white border-fog-sand' : 'bg-fog-900 border-fog-800'} space-y-4`}>
            <Box className="w-10 h-10 text-stone-400 mx-auto" />
            <h4 className={`text-base font-display font-bold uppercase tracking-wider ${isLight ? 'text-fog-950' : 'text-white'}`}>
              New Arrivals In Preparation
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Curate and introduce new blank silhouettes anytime via the Admin Atelier Portal.
            </p>
            <button
              type="button"
              onClick={() => navigateTo('admin')}
              className="btn-luxury-primary px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest"
            >
              Open Admin Command
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
         5. BESPOKE BULK & CREATOR ATELIER BANNER (FEAR OF GOD MONOCHROME LUXURY)
         ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative rounded-3xl overflow-hidden p-8 sm:p-14 lg:p-16 border transition-all ${
          isLight
            ? 'bg-fog-950 text-white border-fog-900 shadow-2xl'
            : 'bg-fog-900 text-fog-stone border-fog-800 shadow-2xl'
        }`}>
          {/* Subtle Ambient Gold Vignette */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-amber-500/10 via-stone-500/5 to-transparent blur-[140px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-fog-gold text-xs font-mono tracking-[0.2em] uppercase border border-white/10">
                <Flame className="w-3.5 h-3.5 text-fog-gold" />
                <span>Bulk Production & Brand Atelier Tier</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-light font-display uppercase tracking-[0.14em] leading-[1.12]">
                BESPOKE RUNS FOR <br />
                <span className="font-semibold text-fog-bone">BRANDS & ENTERPRISES</span>
              </h2>

              <p className="text-sm sm:text-base text-stone-400 max-w-xl leading-relaxed font-sans font-light">
                We manufacture team merchandise, high-density streetwear drops, cafe uniforms, and creator capsules with tiered pricing from 20 to 500+ units.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-[0.2em] font-mono flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>CONSULT WITH ATELIER SPECIALIST</span>
                </a>

                <button
                  type="button"
                  onClick={() => navigateTo('design-by-customer')}
                  className="btn-luxury-ghost w-full sm:w-auto px-8 py-4 rounded-full text-xs font-mono uppercase tracking-[0.2em] flex items-center justify-center gap-2 border-white/20 text-white hover:bg-white/10 transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-fog-gold" />
                  <span>START CUSTOMIZING NOW</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 hidden lg:flex justify-end">
              <div className="w-72 aspect-square rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 flex flex-col justify-between shadow-2xl">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-fog-gold uppercase tracking-[0.2em] block">Dispatch Cadence</span>
                  <h4 className="text-lg font-light uppercase tracking-wider text-white font-display">Priority Turnaround</h4>
                  <p className="text-xs text-stone-400">Printed in 24-48 Hours</p>
                </div>
                <div className="space-y-2.5 text-xs text-stone-300 font-mono">
                  <div className="flex justify-between border-b border-white/10 pb-1.5">
                    <span>1 - 5 Units:</span>
                    <strong className="text-white">Sample Tier</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-1.5">
                    <span>20 - 99 Units:</span>
                    <strong className="text-fog-gold">15% Volume Privilege</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>100+ Units:</span>
                    <strong className="text-fog-bone">Bespoke Atelier Rate</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         6. BEST SELLERS
         ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-6 ${
          isLight ? 'border-fog-sand' : 'border-fog-900'
        }`}>
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase block text-fog-gold">
              Signature Blanks
            </span>
            <h2 className={`text-2xl sm:text-4xl font-light uppercase tracking-[0.14em] mt-1 font-display ${
              isLight ? 'text-fog-950' : 'text-fog-bone'
            }`}>
              Best Sellers
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('products')}
            className={`inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase transition-colors ${
              isLight ? 'text-fog-950 hover:text-stone-600' : 'text-fog-stone hover:text-fog-gold'
            }`}
          >
            <span>Explore Entire Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Products Grid */}
        {bestSellers.length === 0 ? (
          <div className={`p-10 text-center rounded-3xl border ${isLight ? 'bg-white border-fog-sand' : 'bg-fog-900 border-fog-800'} space-y-3`}>
            <Box className="w-10 h-10 text-stone-400 mx-auto" />
            <h4 className={`text-base font-display font-bold uppercase tracking-wider ${isLight ? 'text-fog-950' : 'text-white'}`}>
              Best Sellers Archive
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              No items in catalog yet. Manage and add products from the Admin Panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
         7. INDUSTRIAL QUALITY & ATELIER PILLARS (ALLSAINTS INSPIRATION)
         ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-fog-gold block">
            Craftsmanship Benchmarks
          </span>
          <h2 className={`text-2xl sm:text-4xl font-light uppercase tracking-[0.14em] font-display ${
            isLight ? 'text-fog-950' : 'text-fog-bone'
          }`}>
            Why Choose The Atelier
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`p-7 rounded-3xl border space-y-3 transition-colors ${
            isLight ? 'bg-white border-fog-sand shadow-sm' : 'bg-fog-900/60 border-fog-800 shadow-xl'
          }`}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
              isLight ? 'bg-stone-100 text-fog-950 border-stone-200' : 'bg-fog-950 text-fog-gold border-fog-800'
            }`}>
              <Printer className="w-5 h-5" />
            </div>
            <h3 className={`text-sm font-bold font-display uppercase tracking-wider ${isLight ? 'text-fog-950' : 'text-white'}`}>
              300 DPI HD Thermal Curing
            </h3>
            <p className="text-xs leading-relaxed text-stone-500 font-sans">
              Commercial direct-to-film printing with stretch retention, high pigment density, and 50+ wash longevity.
            </p>
          </div>

          <div className={`p-7 rounded-3xl border space-y-3 transition-colors ${
            isLight ? 'bg-white border-fog-sand shadow-sm' : 'bg-fog-900/60 border-fog-800 shadow-xl'
          }`}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
              isLight ? 'bg-stone-100 text-fog-950 border-stone-200' : 'bg-fog-950 text-fog-gold border-fog-800'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className={`text-sm font-bold font-display uppercase tracking-wider ${isLight ? 'text-fog-950' : 'text-white'}`}>
              OEKO-TEX Certified Inks
            </h3>
            <p className="text-xs leading-relaxed text-stone-500 font-sans">
              100% skin-safe, hypoallergenic, water-based certified inks free from harmful aromatic solvents.
            </p>
          </div>

          <div className={`p-7 rounded-3xl border space-y-3 transition-colors ${
            isLight ? 'bg-white border-fog-sand shadow-sm' : 'bg-fog-900/60 border-fog-800 shadow-xl'
          }`}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
              isLight ? 'bg-stone-100 text-fog-950 border-stone-200' : 'bg-fog-950 text-fog-gold border-fog-800'
            }`}>
              <Award className="w-5 h-5" />
            </div>
            <h3 className={`text-sm font-bold font-display uppercase tracking-wider ${isLight ? 'text-fog-950' : 'text-white'}`}>
              Zero Minimum Threshold
            </h3>
            <p className="text-xs leading-relaxed text-stone-500 font-sans">
              Order a single bespoke prototype for your personal wardrobe, or orchestrate large-scale brand drops.
            </p>
          </div>

          <div className={`p-7 rounded-3xl border space-y-3 transition-colors ${
            isLight ? 'bg-white border-fog-sand shadow-sm' : 'bg-fog-900/60 border-fog-800 shadow-xl'
          }`}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
              isLight ? 'bg-stone-100 text-fog-950 border-stone-200' : 'bg-fog-950 text-fog-gold border-fog-800'
            }`}>
              <Truck className="w-5 h-5" />
            </div>
            <h3 className={`text-sm font-bold font-display uppercase tracking-wider ${isLight ? 'text-fog-950' : 'text-white'}`}>
              Express Pan-India Dispatch
            </h3>
            <p className="text-xs leading-relaxed text-stone-500 font-sans">
              Priority air logistics network with real-time tracking and dedicated WhatsApp delivery coordination.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeView;

