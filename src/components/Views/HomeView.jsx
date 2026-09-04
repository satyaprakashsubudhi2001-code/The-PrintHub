import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Box,
  MessageCircle,
  Printer,
  Award,
  Star,
  Truck,
  UploadCloud,
  FileCheck,
  Clock,
  Check,
  Layers,
  ShoppingBag,
  ExternalLink,
  Palette,
  Compass,
  FileText,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../Products/ProductCard';
import { DEFAULT_PRESET_PRODUCTS } from '../../constants/products';
import { READY_TO_BUY_PRODUCTS } from '../../constants/readyToBuyProducts';

/**
 * HomeView — The PrintHub Visual Commercial Discovery Platform
 * Rich, colorful, engaging frontend designed with:
 * - Subtle layered background system (#F7F9FC base, soft radial glows, micro dot/grid patterns)
 * - Editorial Hero with soft lavender/blue gradient, blurred organic shapes, and 1:1 framed showcase
 * - Elevated Category section with curated color tints and hover lifts
 * - High-contrast Promotional Banners (Deep navy vs. Warm lavender/cream)
 * - Alternating surface rhythm across all sections (Zero plain white fatigue)
 * - Strictly preserving all existing direct WhatsApp & 3D Studio ordering workflows
 */
export function HomeView() {
  const {
    products,
    navigateTo,
    storeSettings,
    themeMode,
    setSelectedCategory,
  } = useStore();

  const isLight = themeMode === 'light';

  // Fallback to presets if needed
  const catalogProducts =
    products && products.length > 0 ? products : DEFAULT_PRESET_PRODUCTS;

  // Curated product slices
  const trendingProducts = catalogProducts.slice(0, 4);
  const readyToOrderPreview = (
    READY_TO_BUY_PRODUCTS && READY_TO_BUY_PRODUCTS.length > 0
      ? READY_TO_BUY_PRODUCTS
      : catalogProducts
  ).slice(0, 4);

  // Category navigation items with curated color tints
  const categoryList = [
    {
      id: 'tshirt',
      name: 'T-Shirts',
      categoryFilter: 'Apparel',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
      badge: 'Bestseller',
      bgTint: 'bg-blue-50/90 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/40',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300',
    },
    {
      id: 'hoodie',
      name: 'Hoodies',
      categoryFilter: 'Apparel',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
      badge: 'Winterwear',
      bgTint: 'bg-purple-50/90 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/40',
      iconBg: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300',
    },
    {
      id: 'polo',
      name: 'Polo Shirts',
      categoryFilter: 'Apparel',
      image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=400&q=80',
      badge: 'Corporate',
      bgTint: 'bg-indigo-50/90 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/40',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300',
    },
    {
      id: 'mug',
      name: 'Coffee Mugs',
      categoryFilter: 'Drinkware',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
      badge: 'Gifting',
      bgTint: 'bg-amber-50/90 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/40',
      iconBg: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300',
    },
    {
      id: 'cap',
      name: 'Caps & Hats',
      categoryFilter: 'Headwear',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80',
      badge: 'Headwear',
      bgTint: 'bg-cyan-50/90 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-900/40',
      iconBg: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-300',
    },
    {
      id: 'apron',
      name: 'Aprons',
      categoryFilter: 'Accessories',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80',
      badge: 'Kitchen',
      bgTint: 'bg-emerald-50/90 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300',
    },
    {
      id: 'badge',
      name: 'Pins & Badges',
      categoryFilter: 'Accessories',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      badge: 'Events',
      bgTint: 'bg-rose-50/90 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/40',
      iconBg: 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300',
    },
    {
      id: 'office',
      name: 'Desk & Office',
      categoryFilter: 'Corporate',
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=400&q=80',
      badge: 'Workplace',
      bgTint: 'bg-violet-50/90 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-900/40',
      iconBg: 'bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300',
    },
  ];

  // WhatsApp general enquiry deep-link
  const whatsappNumber = '917992801158';
  const whatsappGeneralUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hi The PrintHub team! I am looking for custom merchandise printing, pricing, and placing an order.'
  )}`;

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    navigateTo('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`select-none pb-20 transition-colors duration-300 ${
        isLight ? 'bg-[#F7F9FC] text-[#0F172A]' : 'bg-[#08080C] text-white'
      }`}
    >
      {/* =========================================================================
         1. HERO SECTION (Rich Editorial Composition with Layered Glow & Framing)
         ========================================================================= */}
      {/* =========================================================================
         1. HERO SECTION (Immersive Flagship Studio Background)
         ========================================================================= */}
      <section
        id="hero-section"
        className="relative overflow-hidden border-b min-h-[560px] sm:min-h-[620px] lg:min-h-[660px] xl:min-h-[700px] flex items-center py-12 sm:py-16 lg:py-20 transition-colors bg-[#070E20] border-[#182744] scroll-mt-24 sm:scroll-mt-32"
      >
        {/* Immersive Flagship Studio Background Image Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <img
            src="/hero-studio-bg.jpg"
            alt="The PrintHub Flagship Atelier & Apparel Studio"
            className="w-full h-full object-cover object-[center_top] sm:object-[80%_top] lg:object-right-top transition-transform duration-700"
          />

          {/* Deep Navy Left Shield Overlay: Completely prevents the photo's wall text from clashing with the headline */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070E20] via-[#070E20] sm:via-[#070E20]/95 md:via-[#070E20]/85 via-40% sm:via-48% to-[#070E20]/25 lg:to-transparent" />

          {/* Top Fade to seamless Header tone */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0B1630] via-[#0B1630]/60 to-transparent" />

          {/* Bottom Vignette to smooth transition into Category surface */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#08080C] via-[#08080C]/70 to-transparent" />
        </div>

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl space-y-6 text-left py-4">
            {/* Eyebrow Pill with CMYK Micro-Accents */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold tracking-wide border shadow-lg bg-[#0B1630]/85 border-[#3B82F6]/40 text-white backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" title="Cyan" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" title="Magenta" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FACC15]" title="Yellow" />
                <span className="w-2.5 h-2.5 rounded-full bg-white" title="Key" />
              </div>
              <span className="uppercase text-[11px] font-extrabold tracking-wider text-slate-100">
                PREMIUM CUSTOM PRINTING & MERCHANDISE ATELIER
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white drop-shadow-lg">
              Bring Your Ideas <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#60A5FA] to-[#A78BFA]">
                to Life.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg leading-relaxed font-normal text-slate-200 drop-shadow-md max-w-xl">
              Quality custom apparel, drinkware, headwear, and brand merchandise crafted for creators and businesses. Preview in interactive 3D and order directly via WhatsApp with zero MOQ.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  navigateTo('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-[0_8px_25px_rgba(59,130,246,0.4)] hover:shadow-[0_12px_32px_rgba(59,130,246,0.5)] transition-all flex items-center justify-center gap-2.5 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Box className="w-4 h-4" />
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  navigateTo('design-by-customer');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm border border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                <span>Launch 3D Customizer</span>
              </button>
            </div>

            {/* Quick Trust Highlights */}
            <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Minimum Orders</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>300 DPI Thermal DTF</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Express PAN-India</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         2. CATEGORY NAVIGATION ("Shop by Category" — Soft Elevated Surface)
         ========================================================================= */}
      <section
        id="shop-by-category"
        className={`py-12 sm:py-16 border-b transition-colors scroll-mt-24 sm:scroll-mt-32 ${
          isLight
            ? 'bg-[#F1F5F9]/80 border-slate-200/70'
            : 'bg-[#0A0A10] border-[#1A1A22]'
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-[#2563EB] dark:text-cyan-400 block mb-1">
                Explore The Archive
              </span>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isLight ? 'text-[#0B132B]' : 'text-white'
                }`}
              >
                Shop by Category
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select a silhouette to customize in 3D or browse ready-to-order catalog
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                navigateTo('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs sm:text-sm font-bold text-[#2563EB] hover:text-blue-700 dark:text-cyan-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Categories Grid (Desktop) & Horizontal Scroll (Mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
            {categoryList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.categoryFilter)}
                className={`group p-3 rounded-2xl border transition-all duration-200 flex flex-col items-center text-center cursor-pointer hover:-translate-y-1 shadow-xs hover:shadow-md ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-blue-400'
                    : 'bg-[#111218] border-[#222430] hover:border-cyan-500'
                }`}
              >
                {/* Controlled 1:1 Circular / Rounded Image Box with Curated Tint */}
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center p-2.5 mb-2.5 overflow-hidden transition-transform duration-300 group-hover:scale-105 border ${cat.bgTint}`}
                  style={{
                    aspectRatio: '1 / 1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                    }}
                    loading="lazy"
                  />
                </div>

                <span
                  className={`text-xs font-bold block truncate w-full ${
                    isLight ? 'text-slate-900 group-hover:text-[#2563EB]' : 'text-white group-hover:text-cyan-400'
                  }`}
                >
                  {cat.name}
                </span>

                <span className="text-[10px] text-slate-400 font-semibold block truncate w-full mt-0.5">
                  {cat.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
         3. FEATURED PRODUCTS ("Trending Products" — Clean White Surface)
         ========================================================================= */}
      <section
        id="trending-products"
        className={`py-14 sm:py-20 border-b transition-colors scroll-mt-24 sm:scroll-mt-32 ${
          isLight ? 'bg-white border-slate-200/80' : 'bg-[#08080C] border-[#181822]'
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-[#2563EB] dark:text-cyan-400 block mb-1">
                Customer Favorites
              </span>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isLight ? 'text-[#0B132B]' : 'text-white'
                }`}
              >
                Trending Products
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg">
                Crafted with heavyweight fabrics, precision DTF pigmentation, and zero MOQ.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('all');
                navigateTo('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`self-start sm:self-auto px-5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-[#14151C] hover:bg-[#1C1D26] border-[#282A38] text-white'
              }`}
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4-Column Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {trendingProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
         4. PROMOTIONAL BANNERS (High-Contrast Dual Compositions)
         ========================================================================= */}
      <section
        id="promotions-section"
        className={`py-14 sm:py-20 border-b transition-colors scroll-mt-24 sm:scroll-mt-32 ${
          isLight ? 'bg-[#F8F9FC] border-slate-200/80' : 'bg-[#0B0C12] border-[#1A1C26]'
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Banner 1: Deep Navy/Blue Gradient — Corporate & Bulk Branding */}
            <div
              className="p-8 sm:p-10 rounded-[28px] border relative overflow-hidden flex flex-col justify-between space-y-6 shadow-xl bg-gradient-to-br from-[#0B132B] via-[#0F1D40] to-[#1E3A8A] text-white border-blue-900/50"
            >
              {/* Subtle background glow */}
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

              <div className="space-y-3 z-10 max-w-md">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-400 text-slate-950 inline-block shadow-xs">
                  Corporate & Bulk Branding
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                  Make Your Brand Stand Out
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  Turnkey merchandise for startups and enterprises. Custom staff uniforms,
                  embroidered polos, executive drinkware, and conference swag kits with volume pricing.
                </p>
              </div>

              <div className="z-10 pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCategory('Corporate');
                    navigateTo('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-xl font-bold text-xs bg-white hover:bg-slate-100 text-slate-950 transition-all flex items-center gap-2 cursor-pointer shadow-md hover:-translate-y-0.5"
                >
                  <span>Explore Corporate Kits</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Decorative Subtle Icon Silhouette */}
              <div className="absolute -bottom-6 -right-6 w-36 h-36 opacity-10 pointer-events-none">
                <Printer className="w-full h-full text-cyan-400" />
              </div>
            </div>

            {/* Banner 2: Warm Lavender/Cream Gradient — Personalized Gifts */}
            <div
              className={`p-8 sm:p-10 rounded-[28px] border relative overflow-hidden flex flex-col justify-between space-y-6 shadow-xl ${
                isLight
                  ? 'bg-gradient-to-br from-[#FAF5FF] via-[#FFF7ED]/90 to-[#FDF4FF] border-purple-200/80 text-[#0B132B]'
                  : 'bg-gradient-to-br from-[#201526] via-[#1A1218] to-[#120E15] border-purple-900/40 text-white'
              }`}
            >
              {/* Subtle background glow */}
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

              <div className="space-y-3 z-10 max-w-md">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 inline-block shadow-xs">
                  Bespoke Keepsakes & Gifts
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                  Made For Special Moments
                </h3>
                <p className={`text-sm leading-relaxed font-normal ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Custom gifts crafted for every occasion. Photo-printed ceramic mugs, premium hoodies,
                  custom anniversary merch, and birthday keepsakes crafted with artisan care.
                </p>
              </div>

              <div className="z-10 pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCategory('Drinkware');
                    navigateTo('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-xl font-bold text-xs bg-[#0B132B] hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 transition-all flex items-center gap-2 cursor-pointer shadow-md hover:-translate-y-0.5"
                >
                  <span>Explore Personalized Gifts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Decorative Subtle Icon Silhouette */}
              <div className="absolute -bottom-6 -right-6 w-36 h-36 opacity-10 pointer-events-none">
                <Sparkles className="w-full h-full text-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         5. CUSTOMIZATION STUDIO SHOWCASE ("Have Your Own Design?")
         ========================================================================= */}
      <section
        className={`py-14 sm:py-20 border-b transition-colors ${
          isLight ? 'bg-[#F1F5F9]/70 border-slate-200/80' : 'bg-[#08080C] border-[#181822]'
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-[32px] border p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl bg-gradient-to-br from-[#0B1020] via-[#0F172A] to-[#131B30] text-white border-slate-800"
          >
            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

            {/* Glowing Corner Accents */}
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>DIRECT DESIGN ENGINE</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                  Have Your Own Design?
                </h2>

                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  Upload your artwork and turn your vision into physical merchandise.
                  Preview in real-time interactive 3D, calibrate placement dimensions in physical inches,
                  and receive instant transparent pricing quotes.
                </p>

                {/* Supported File Formats */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                    Supported Upload Formats:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {['PNG', 'JPG', 'JPEG', 'PDF'].map((format) => (
                      <span
                        key={format}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-white/10 text-white border border-white/15 backdrop-blur-xs"
                      >
                        .{format.toLowerCase()}
                      </span>
                    ))}
                    <span className="text-xs text-slate-400 ml-2">Up to 50 MB High-Definition</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      navigateTo('design-by-customer');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 py-4 rounded-xl font-bold text-sm bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all flex items-center gap-2.5 shadow-lg shadow-cyan-500/25 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Launch 3D Customizer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={whatsappGeneralUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-4 rounded-xl font-semibold text-sm border border-slate-700 bg-white/5 hover:bg-white/10 text-white transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Send Artwork via WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Right Feature Highlights: 4 Grid Pillars */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Interactive 3D Draping',
                    desc: 'Dual-axis 360° rotation with realistic fabric textures and lighting',
                    icon: Layers,
                  },
                  {
                    title: 'Physical Scale in Inches',
                    desc: 'Precise front, back, and pocket zones calibrated for production',
                    icon: Compass,
                  },
                  {
                    title: 'Free Digital Proofing',
                    desc: 'Digital vector mockup confirmed prior to industrial thermal printing',
                    icon: FileCheck,
                  },
                  {
                    title: 'Zero MOQ Threshold',
                    desc: 'Order 1 single prototype or produce a 10,000-unit merchandise drop',
                    icon: ShieldCheck,
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm space-y-2 hover:bg-white/10 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         6. READY TO ORDER MERCHANDISE ("Direct Instant Dispatch")
         ========================================================================= */}
      <section
        className={`py-14 sm:py-20 border-b transition-colors ${
          isLight ? 'bg-white border-slate-200/80' : 'bg-[#08080C] border-[#181822]'
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
                Instant Express Fulfillment
              </span>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isLight ? 'text-[#0B132B]' : 'text-white'
                }`}
              >
                Ready to Order
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg">
                Pre-printed graphic merchandise ready for same-day dispatch via direct WhatsApp ordering.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('all');
                navigateTo('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`self-start sm:self-auto px-5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-[#14151C] hover:bg-[#1C1D26] border-[#282A38] text-white'
              }`}
            >
              <span>Explore Ready Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4-Column Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {readyToOrderPreview.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
         7. FEATURED COLLECTIONS (Editorial Curated Capsules)
         ========================================================================= */}
      <section
        className={`py-14 sm:py-20 border-b transition-colors ${
          isLight ? 'bg-[#F8F9FC] border-slate-200/80' : 'bg-[#0B0C12] border-[#1A1C26]'
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold tracking-wider uppercase text-[#2563EB] dark:text-cyan-400">
              Curated Capsules
            </span>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isLight ? 'text-[#0B132B]' : 'text-white'
              }`}
            >
              Featured Collections
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Tailored merchandise packages for corporate onboardings, college fests, and brand launches
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Corporate Welcome Kits',
                desc: 'Branded notebooks, metal pens, stainless bottles & polo blanks',
                img: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=600&q=80',
                tag: 'Business',
                category: 'Corporate',
              },
              {
                title: 'Creator Streetwear',
                desc: '240 GSM oversized streetwear blanks with drop-shoulder silhouettes',
                img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
                tag: 'Streetwear',
                category: 'Apparel',
              },
              {
                title: 'Academic & College Fests',
                desc: 'High-volume hoodies, event badges, and custom team tees',
                img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
                tag: 'Campus',
                category: 'Apparel',
              },
              {
                title: 'Expo & Event Merchandise',
                desc: 'Lanyards, promotional caps, tote bags and giveaway merchandise',
                img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
                tag: 'Marketing',
                category: 'Headwear',
              },
            ].map((col, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedCategory(col.category);
                  navigateTo('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group rounded-2xl border overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-xs hover:shadow-lg ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-blue-300'
                    : 'bg-[#12131A] border-[#222432] hover:border-cyan-500/40'
                }`}
              >
                {/* Image Cover with Gradient Overlay */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={col.img}
                    alt={col.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-white text-slate-950 shadow-xs">
                    {col.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3
                      className={`text-base font-bold transition-colors ${
                        isLight ? 'text-slate-900 group-hover:text-[#2563EB]' : 'text-white group-hover:text-cyan-400'
                      }`}
                    >
                      {col.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {col.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-[#222432] flex items-center justify-between text-xs font-bold text-[#2563EB] dark:text-cyan-400">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
         8. TRUST / VALUE PILLARS (4 Core Standards)
         ========================================================================= */}
      <section
        className={`py-14 sm:py-18 border-b transition-colors ${
          isLight ? 'bg-[#F1F5F9]/70 border-slate-200/80' : 'bg-[#08080C] border-[#181822]'
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: '300 DPI Thermal DTF',
                desc: 'Industrial-grade pigmentation engineered for high stretch and 50+ wash durability.',
                color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50',
              },
              {
                icon: ShieldCheck,
                title: 'Zero MOQ Requirement',
                desc: 'Order a single custom prototype or produce thousands of units for pan-India events.',
                color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/50',
              },
              {
                icon: Truck,
                title: 'PAN-India Express',
                desc: 'Doorstep courier delivery with live tracking across metro and regional pin codes.',
                color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50',
              },
              {
                icon: Award,
                title: 'Free Digital Proofs',
                desc: 'Every custom design order is reviewed and verified with you before printing begins.',
                color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50',
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1 shadow-xs ${
                    isLight ? 'bg-white border-slate-200' : 'bg-[#12131A] border-[#222432]'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${pillar.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3
                    className={`text-sm sm:text-base font-bold mb-1.5 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
         9. WHATSAPP & CONTACT CTA (Direct Communication Banner)
         ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div
          className={`rounded-3xl border p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl transition-all ${
            isLight
              ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-emerald-200/80 text-[#0B132B]'
              : 'bg-gradient-to-r from-[#0D1D16] via-[#0E1A1F] to-[#0D1524] border-emerald-900/50 text-white'
          }`}
        >
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 border border-emerald-600/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              DIRECT WHATSAPP CONCIERGE
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Need Instant Help or Bulk Custom Quotes?
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Speak directly with our print production specialist on WhatsApp. Share artwork,
              request fabric swatches, or get bulk discount quotes in minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0">
            <a
              href={whatsappGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>Chat on WhatsApp (+91 79928 01158)</span>
            </a>

            <button
              type="button"
              onClick={() => {
                navigateTo('help');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                  : 'bg-white/5 hover:bg-white/10 border-white/20 text-white'
              }`}
            >
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeView;
