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
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_PRODUCTS } from '../../constants/products';
import { ProductCard } from '../Products/ProductCard';

/**
 * The PrintHub — Premium Homepage & Product Exploration Experience
 * High-end modern e-commerce visual presentation with generous whitespace,
 * clear visual hierarchy, shop by category, product collections, promo banner & brand pillars.
 */
export function HomeView() {
  const {
    products,
    selectProduct,
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
      name: 'Apparel & Streetwear',
      subtitle: 'T-Shirts, Oversized Tees, Polos & Hoodies',
      itemCount: '4 Styles',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      badge: 'Most Popular',
    },
    {
      id: 'Drinkware',
      name: 'Mugs & Drinkware',
      subtitle: '11oz AAA Ceramic Coffee Mugs',
      itemCount: 'High Gloss Finish',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      badge: 'Zero Fade',
    },
    {
      id: 'Headwear',
      name: 'Caps & Headwear',
      subtitle: 'Structured Snapback & Baseball Caps',
      itemCount: 'Embroidered & DTF',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
      badge: 'Classic Fit',
    },
    {
      id: 'Accessories',
      name: 'Aprons & Badges',
      subtitle: 'Commercial Aprons & Enamel Pins',
      itemCount: 'Heavyweight Canvas',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      badge: 'Hospitality',
    },
  ];

  const handleCategoryClick = (catId) => {
    navigateTo('products');
  };

  const whatsappNumber = storeSettings?.whatsapp?.replace(/\D/g, '') || '917992801158';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hi The PrintHub team! I would like to inquire about custom merchandise and bulk manufacturing.'
  )}`;

  return (
    <div className={`space-y-20 lg:space-y-28 pb-24 select-none transition-colors duration-300 ${
      isLight ? 'text-slate-900 bg-[#F8F9FC]' : 'text-white bg-[#080812]'
    }`}>
      {/* =========================================================================
         1. LARGE IMPACT HERO SECTION
         ========================================================================= */}
      <section className={`relative overflow-hidden pt-10 sm:pt-16 pb-16 sm:pb-24 border-b ${
        isLight ? 'border-slate-200/80 bg-white' : 'border-slate-800/80 bg-[#070913]'
      }`}>
        {/* Ambient Subtle Gradients */}
        <div className={`absolute top-0 right-1/4 w-[650px] h-[450px] pointer-events-none blur-[140px] ${
          isLight
            ? 'bg-gradient-to-tr from-cyan-200/40 via-blue-100/40 to-transparent'
            : 'bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-transparent'
        }`} />

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Typography & CTAs (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Top pill badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-lime-400 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
                <span>Zero Minimum Orders • 300 DPI HD DTF Printing</span>
              </div>

              {/* Main Bold Headline */}
              <h1 className={`font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05] ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}>
                PRINT YOUR IDEAS. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 dark:from-lime-400 dark:via-cyan-400 dark:to-indigo-400">
                  MAKE THEM REAL.
                </span>
              </h1>

              {/* Supporting Subtext */}
              <p className={`text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}>
                India's dedicated custom merchandise studio. Upload your artwork, scale in exact physical inches, and preview your products in photorealistic 3D before placing your order.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigateTo('design-by-customer')}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_6px_25px_rgba(163,230,53,0.4)] hover:shadow-[0_8px_35px_rgba(163,230,53,0.6)] hover:scale-105 active:scale-95 transition-all font-display"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>OPEN 3D STUDIO</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('products')}
                  className={`w-full sm:w-auto px-8 py-4 rounded-full border font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all font-display hover:scale-105 active:scale-95 ${
                    isLight
                      ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-900 shadow-sm'
                      : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-white'
                  }`}
                >
                  <Box className={`w-4 h-4 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
                  <span>EXPLORE CATALOG</span>
                </button>
              </div>

              {/* Key Trust Stats Strip */}
              <div className={`grid grid-cols-3 gap-4 pt-8 border-t max-w-xl mx-auto lg:mx-0 text-left ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}>
                <div className="space-y-0.5">
                  <span className={`text-sm sm:text-base font-black font-display ${isLight ? 'text-slate-950' : 'text-white'}`}>100% Cotton</span>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Bio-Washed Blanks</p>
                </div>
                <div className="space-y-0.5">
                  <span className={`text-sm sm:text-base font-black font-display ${isLight ? 'text-slate-950' : 'text-white'}`}>300 DPI HD</span>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>DTF & Embroidery</p>
                </div>
                <div className="space-y-0.5">
                  <span className={`text-sm sm:text-base font-black font-display ${isLight ? 'text-emerald-700' : 'text-lime-400'}`}>WhatsApp</span>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Instant Handoff</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className={`relative rounded-3xl border p-6 sm:p-8 space-y-6 transition-all ${
                isLight
                  ? 'bg-white border-slate-200/90 shadow-2xl'
                  : 'bg-[#0c101d] border-slate-800 shadow-2xl'
              }`}>
                {/* Visual Header Strip */}
                <div className={`flex items-center justify-between border-b pb-4 ${
                  isLight ? 'border-slate-100' : 'border-slate-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse" />
                    <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      Live 3D Customizer Preview
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                    isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-800' : 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                  }`}>
                    Front & Back Calibrated
                  </span>
                </div>

                {/* Product Mockup Showcase Box */}
                <div className={`w-full aspect-square rounded-2xl p-6 flex items-center justify-center relative overflow-hidden group transition-colors ${
                  isLight ? 'bg-slate-50' : 'bg-slate-950'
                }`}>
                  <img
                    src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"
                    alt="Oversized Streetwear T-Shirt Preview"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className={`absolute inset-x-4 bottom-4 p-3.5 rounded-2xl backdrop-blur-md border flex items-center justify-between text-xs font-mono shadow-lg ${
                    isLight
                      ? 'bg-white/95 border-slate-200 text-slate-900'
                      : 'bg-slate-900/90 border-white/10 text-white'
                  }`}>
                    <div>
                      <span className="font-bold block">Oversized Streetwear Tee</span>
                      <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>240 GSM Heavyweight Cotton</span>
                    </div>
                    <span className={`text-sm font-black ${isLight ? 'text-emerald-700' : 'text-lime-400'}`}>₹599</span>
                  </div>
                </div>

                {/* Quick Studio Trigger CTA */}
                <button
                  type="button"
                  onClick={() => navigateTo('design-by-customer')}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 font-display transition-all active:scale-95"
                >
                  <Palette className="w-4 h-4" />
                  <span>CUSTOMIZE THIS BLANK IN 3D</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         2. SHOP BY CATEGORY SECTION
         ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-6 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div>
            <span className={`text-xs font-mono font-bold uppercase tracking-wider block ${
              isLight ? 'text-cyan-700' : 'text-lime-400'
            }`}>
              Curated Collections
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black font-display uppercase tracking-tight mt-1 ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}>
              Shop by Category
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('products')}
            className={`inline-flex items-center gap-2 text-xs font-mono font-bold uppercase transition-colors ${
              isLight ? 'text-slate-900 hover:text-cyan-700' : 'text-white hover:text-cyan-400'
            }`}
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`group relative rounded-3xl border overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between select-none ${
                isLight
                  ? 'bg-white border-slate-200/90 hover:border-slate-400 hover:shadow-xl'
                  : 'bg-[#0c101d] border-slate-800 hover:border-slate-600 hover:shadow-2xl'
              }`}
            >
              {/* Category Image Box */}
              <div className={`relative aspect-[4/3.2] overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-slate-950'}`}>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Floating Tag */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-slate-900/90 text-white border border-white/20 shadow-sm backdrop-blur-md">
                    {category.badge}
                  </span>
                </div>
              </div>

              {/* Category Card Info */}
              <div className="p-5 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className={`font-display text-base font-bold transition-colors ${
                    isLight ? 'text-slate-900 group-hover:text-cyan-700' : 'text-white group-hover:text-lime-400'
                  }`}>
                    {category.name}
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {category.subtitle}
                  </p>
                </div>

                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 shrink-0 ${
                  isLight ? 'bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white' : 'bg-slate-800 text-white group-hover:bg-lime-400 group-hover:text-slate-950'
                }`}>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
         3. NEW ARRIVALS & TRENDING PRODUCTS
         ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-6 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div>
            <span className={`text-xs font-mono font-bold uppercase tracking-wider block ${
              isLight ? 'text-cyan-700' : 'text-lime-400'
            }`}>
              Fresh In Studio
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black font-display uppercase tracking-tight mt-1 ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}>
              New Arrivals
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('products')}
            className={`inline-flex items-center gap-2 text-xs font-mono font-bold uppercase transition-colors ${
              isLight ? 'text-slate-900 hover:text-cyan-700' : 'text-white hover:text-cyan-400'
            }`}
          >
            <span>See All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Products Row */}
        {newArrivals.length === 0 ? (
          <div className={`p-10 text-center rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c101d] border-slate-800'} space-y-3`}>
            <Box className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className={`text-base font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
              New Arrivals Coming Soon
            </h4>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} max-w-md mx-auto`}>
              The product catalog is currently empty. You can add new blanks anytime from the Admin Command Center.
            </p>
            <button
              type="button"
              onClick={() => navigateTo('admin')}
              className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider font-display transition-all"
            >
              Add Products in Admin
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
         4. PROMOTIONAL BANNER SECTION
         ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative rounded-3xl overflow-hidden p-8 sm:p-14 lg:p-16 border transition-all ${
          isLight
            ? 'bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white border-slate-800 shadow-2xl'
            : 'bg-gradient-to-r from-slate-950 via-[#0b0f19] to-indigo-950 text-white border-slate-800 shadow-2xl'
        }`}>
          {/* Background Ambient Lights */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-cyan-500/20 via-lime-400/10 to-transparent blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-400/20 text-lime-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5" />
                <span>Bulk Merchandise & Creator Brands</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight leading-[1.1]">
                LOOKING FOR BULK DISCOUNTS <br />
                OR BRAND UNIFORMS?
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                We manufacture team merchandise, corporate apparel, esports jerseys, cafe staff wear, and creator merchandise with tier pricing from 20 to 500+ units.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 font-display transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>CHAT WITH FACTORY SPECIALIST</span>
                </a>

                <button
                  type="button"
                  onClick={() => navigateTo('design-by-customer')}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-lime-400/30 font-display transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>START CUSTOMIZING NOW</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 hidden lg:flex justify-end">
              <div className="w-72 aspect-square rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 flex flex-col justify-between shadow-2xl">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-lime-400 uppercase tracking-wider block">Production Tier</span>
                  <h4 className="text-xl font-bold text-white font-display">Fast Dispatch</h4>
                  <p className="text-xs text-slate-400">Printed in 24-48 Hours</p>
                </div>
                <div className="space-y-2 text-xs text-slate-300 font-mono">
                  <div className="flex justify-between border-b border-white/10 pb-1">
                    <span>1 - 5 Units:</span>
                    <strong className="text-white">Sample Tier</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-1">
                    <span>20 - 99 Units:</span>
                    <strong className="text-lime-400">15% Volume Off</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>100+ Units:</span>
                    <strong className="text-cyan-400">Bulk Factory Rate</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         5. BEST SELLERS SECTION
         ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-6 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div>
            <span className={`text-xs font-mono font-bold uppercase tracking-wider block ${
              isLight ? 'text-cyan-700' : 'text-lime-400'
            }`}>
              Most Ordered Blanks
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black font-display uppercase tracking-tight mt-1 ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}>
              Best Sellers
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('products')}
            className={`inline-flex items-center gap-2 text-xs font-mono font-bold uppercase transition-colors ${
              isLight ? 'text-slate-900 hover:text-cyan-700' : 'text-white hover:text-cyan-400'
            }`}
          >
            <span>View Full Leaderboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Products Row */}
        {bestSellers.length === 0 ? (
          <div className={`p-10 text-center rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c101d] border-slate-800'} space-y-3`}>
            <Box className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className={`text-base font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Best Sellers Leaderboard
            </h4>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} max-w-md mx-auto`}>
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
         6. BRAND / PRODUCTION VALUE PILLARS
         ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
            isLight ? 'text-cyan-700' : 'text-cyan-400'
          }`}>
            Industrial Quality Standards
          </span>
          <h2 className={`text-3xl sm:text-4xl font-black font-display uppercase tracking-tight ${
            isLight ? 'text-slate-950' : 'text-white'
          }`}>
            Why Choose The PrintHub
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`p-6 rounded-3xl border space-y-3 transition-colors ${
            isLight ? 'bg-white border-slate-200/90 shadow-sm' : 'bg-[#0c101d] border-slate-800 shadow-xl'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-bold font-display uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>
              300 DPI DTF Printing
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Commercial direct-to-film printing with stretch retention, vibrant colors, and 50+ wash durability.
            </p>
          </div>

          <div className={`p-6 rounded-3xl border space-y-3 transition-colors ${
            isLight ? 'bg-white border-slate-200/90 shadow-sm' : 'bg-[#0c101d] border-slate-800 shadow-xl'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-bold font-display uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>
              OEKO-TEX Safe Inks
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              100% skin-safe, water-based, hypoallergenic certified inks free from heavy metals and harsh chemicals.
            </p>
          </div>

          <div className={`p-6 rounded-3xl border space-y-3 transition-colors ${
            isLight ? 'bg-white border-slate-200/90 shadow-sm' : 'bg-[#0c101d] border-slate-800 shadow-xl'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Award className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-bold font-display uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Zero Minimum Order
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Order just 1 custom garment for yourself, or thousands of merchandise units for your brand or event.
            </p>
          </div>

          <div className={`p-6 rounded-3xl border space-y-3 transition-colors ${
            isLight ? 'bg-white border-slate-200/90 shadow-sm' : 'bg-[#0c101d] border-slate-800 shadow-xl'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-bold font-display uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>
              48h Express Dispatch
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Pan-India priority courier network with real-time AWB tracking and dedicated WhatsApp delivery updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeView;
