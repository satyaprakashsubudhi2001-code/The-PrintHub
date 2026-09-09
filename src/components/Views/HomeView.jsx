import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Box,
  MessageCircle,
  Clock,
  Layers,
  ShoppingBag,
  ExternalLink,
  Compass,
  FileCheck,
  UploadCloud,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DynamicStatsRibbon } from '../UI/DynamicStatsRibbon';

/**
 * 8 Custom Product Visual Categories explicitly specified:
 * 1. Custom T-shirts
 * 2. Hoodies
 * 3. Mugs
 * 4. Business cards
 * 5. Photo frames
 * 6. Stickers
 * 7. Custom gifts
 * 8. Promotional products
 */
const EIGHT_PRODUCT_CATEGORIES = [
  {
    title: 'Custom T-Shirts',
    category: 'Custom T-Shirts',
    tag: 'Apparel',
    icon: '👕',
    desc: 'Classic round-neck & oversized heavyweight tees with durable 300 DPI thermal transfers.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Hoodies',
    category: 'Hoodies',
    tag: 'Outerwear',
    icon: '🧥',
    desc: 'Warm heavyweight 380 GSM fleece hoodies with vibrant chest and back graphic placement.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Mugs',
    category: 'Mugs',
    tag: 'Drinkware',
    icon: '☕',
    desc: 'High-gloss photo-sublimated ceramic mugs with microwave and dishwasher safe finish.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Business Cards',
    category: 'Business Cards',
    tag: 'Stationery',
    icon: '📇',
    desc: 'Velvet matte, gold-foiled, and spot UV visiting cards that leave an unforgettable impression.',
    image: 'https://images.unsplash.com/photo-1589330694653-dad6ef0140be?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Photo Frames',
    category: 'Photo Frames',
    tag: 'Wall Art',
    icon: '🖼️',
    desc: 'Gallery-grade acrylic and wooden photo frames preserving your precious memories.',
    image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Stickers',
    category: 'Stickers',
    tag: 'Die-Cut Vinyl',
    icon: '🏷️',
    desc: 'Waterproof, scratch-proof die-cut vinyl stickers and holographic custom kiss-cut sheets.',
    image: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Custom Gifts',
    category: 'Custom Gifts',
    tag: 'Keepsakes',
    icon: '🎁',
    desc: 'Personalized anniversary apparel, engraved keepsakes, and customized celebration boxes.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Promotional Products',
    category: 'Promotional Products',
    tag: 'Corporate',
    icon: '📦',
    desc: 'Lanyards, tote bags, caps, corporate welcome kits, and conference merchandise.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Idea',
    sub: 'Start with an idea.',
    desc: 'A sketch, your logo, a brand concept, or personal artwork you want to bring into the real world.',
  },
  {
    step: '02',
    title: 'Design',
    sub: 'Configure in 3D.',
    desc: 'Upload graphics or work directly with our atelier to calibrate print placement, scale, and colors.',
  },
  {
    step: '03',
    title: 'Create',
    sub: 'Master print calibration.',
    desc: 'Industrial 300 DPI thermal DTF or sublimation with meticulous multi-point quality inspection.',
  },
  {
    step: '04',
    title: 'Deliver',
    sub: 'Arrives at your doorstep.',
    desc: 'Securely packaged with tracking and priority-dispatched across all 28+ Indian states.',
  },
];

export function HomeView() {
  const {
    navigateTo,
    setSelectedCategory,
    storeSettings,
    homepageContent = {},
  } = useStore();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  const published = homepageContent?.published || {};
  const heroData = published.hero || {
    eyebrow: 'PREMIUM CUSTOM PRINTING & MERCHANDISE ATELIER',
    headline: 'Print Your Ideas.',
    highlight: 'Make Them Yours.',
    description: 'Quality custom apparel, drinkware, stationery, and personalized gifts crafted for creators, brands, and businesses. Preview in real-time interactive 3D and order directly via WhatsApp with zero MOQ.',
    primaryCtaText: 'Start Printing',
    secondaryCtaText: 'Explore Products',
  };

  const whatsappNumber = storeSettings?.whatsapp?.replace(/\D/g, '') || '917992801158';
  const whatsappGeneralUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hi The PrintHub team! I am looking for custom merchandise printing, pricing, and placing an order.'
  )}`;

  const handleCategorySelect = (categoryName) => {
    setActiveCategoryFilter(categoryName);
    setSelectedCategory(categoryName);
    navigateTo('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="select-none pb-20 bg-[#E5DAC9] text-[#183630]">
      {/* =========================================================================
         1. HERO SECTION (#183630 Dominant Dark Green with #E5C690 & #E5DAC9)
         ========================================================================= */}
      <section
        id="hero-section"
        className="relative overflow-hidden border-b min-h-[560px] sm:min-h-[620px] lg:min-h-[660px] xl:min-h-[700px] flex items-center py-12 sm:py-16 lg:py-20 bg-[#183630] text-[#E5DAC9] border-[#B8A98F]/30"
      >
        {/* Background Image Layer with Dark Green multiply blend */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <img
            src="/hero-studio-bg.jpg"
            alt="The PrintHub Atelier"
            className="w-full h-full object-cover object-[center_top] sm:object-[80%_top] lg:object-right-top opacity-35 mix-blend-luminosity"
          />

          {/* Dark Green Gradient Shields */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#183630] via-[#183630]/95 md:via-[#183630]/90 to-[#183630]/60 lg:to-[#183630]/30" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#183630] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#183630] to-transparent" />
        </div>

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl space-y-6 text-left py-4">
            {/* Atelier Eyebrow Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold tracking-wide border shadow-sm bg-[#183630] border-[#B8A98F]/40 text-[#E5C690] backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5C690]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#B8A98F]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5DAC9]" />
              </div>
              <span className="uppercase text-[11px] font-extrabold tracking-wider text-[#E5DAC9]">
                {heroData.eyebrow || 'PREMIUM CUSTOM PRINTING & MERCHANDISE ATELIER'}
              </span>
            </div>

            {/* Main Headline (Print Your Ideas. Make Them Yours.) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-[#E5DAC9] drop-shadow-sm">
              {heroData.headline || 'Print Your Ideas.'} <br />
              <span className="text-[#E5C690]">{heroData.highlight || 'Make Them Yours.'}</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg leading-relaxed font-normal text-[#E5DAC9]/90 max-w-xl">
              {heroData.description || 'Quality custom apparel, drinkware, stationery, and personalized gifts crafted for creators, brands, and businesses. Preview in real-time interactive 3D and order directly via WhatsApp with zero MOQ.'}
            </p>

            {/* Required Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
              {/* Primary: Start Printing */}
              <button
                type="button"
                onClick={() => {
                  navigateTo('design-by-customer');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] shadow-[0_8px_25px_rgba(229,198,144,0.3)] transition-all flex items-center justify-center gap-2.5 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#183630]" />
                <span>{heroData.primaryCtaText || 'Start Printing'}</span>
                <ArrowRight className="w-4 h-4 text-[#183630]" />
              </button>

              {/* Secondary: Explore Products */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  navigateTo('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm border border-[#B8A98F]/50 bg-[#E5DAC9]/10 hover:bg-[#E5DAC9]/20 text-[#E5DAC9] backdrop-blur-md transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Box className="w-4 h-4 text-[#E5C690]" />
                <span>{heroData.secondaryCtaText || 'Explore Products'}</span>
              </button>
            </div>

            {/* Quick Trust Highlights */}
            <div className="pt-6 border-t border-[#B8A98F]/30 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-bold text-[#E5DAC9]/85">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E5C690] shrink-0" />
                <span>Zero Minimum Orders</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E5C690] shrink-0" />
                <span>300 DPI Thermal DTF</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E5C690] shrink-0" />
                <span>Express PAN-India</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         2. DYNAMIC ATELIER METRICS RIBBON (Why Clients Choose The PrintHub)
         ========================================================================= */}
      <DynamicStatsRibbon />

      {/* =========================================================================
         3. 8 CUSTOM PRODUCT VISUAL CATEGORIES (Prominently Featured)
         ========================================================================= */}
      <section
        id="shop-by-category"
        className="py-16 sm:py-24 border-b border-[#B8A98F]/30 bg-[#E5DAC9] scroll-mt-24 sm:scroll-mt-32"
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black tracking-widest uppercase text-[#183630]/70 block mb-1">
                OUR BESPOKE MERCHANDISE ARCHIVE
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#183630]">
                8 Core Product Categories
              </h2>
              <p className="text-xs sm:text-sm text-[#183630]/80 mt-1 max-w-xl">
                Explore our full line of custom merchandise manufactured with industrial-grade pigmentation and zero minimum thresholds.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('all');
                navigateTo('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs sm:text-sm font-bold text-[#183630] hover:text-[#183630]/80 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#183630]" />
            </button>
          </div>

          {/* Interactive Category Filter Pills with [ Bracket ] treatment */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-250 cursor-pointer ${
                activeCategoryFilter === 'all'
                  ? 'bracket-selected font-black shadow-sm'
                  : 'bg-[#E5DAC9] border border-[#B8A98F]/50 text-[#183630]/80 hover:border-[#183630]'
              }`}
            >
              {activeCategoryFilter === 'all' ? '[ All 8 Categories ]' : 'All Categories'}
            </button>
            {EIGHT_PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategoryFilter(cat.category)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-250 cursor-pointer flex items-center gap-1.5 ${
                  activeCategoryFilter === cat.category
                    ? 'bracket-selected font-black shadow-sm'
                    : 'bg-[#E5DAC9] border border-[#B8A98F]/50 text-[#183630]/80 hover:border-[#183630]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{activeCategoryFilter === cat.category ? `[ ${cat.title} ]` : cat.title}</span>
              </button>
            ))}
          </div>

          {/* 8 Product Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EIGHT_PRODUCT_CATEGORIES.filter(
              (cat) => activeCategoryFilter === 'all' || activeCategoryFilter === cat.category
            ).map((item, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-[#B8A98F] bg-[#E5DAC9] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-[0_12px_28px_rgba(24,54,48,0.12)] hover:border-[#183630]"
              >
                {/* Image Cover */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#183630]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#183630]/80 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#183630]/85 backdrop-blur-md text-[#E5C690] border border-[#B8A98F]/40 shadow-xs">
                    {item.tag}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <h3 className="text-base sm:text-lg font-bold text-[#183630] group-hover:text-[#183630]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs leading-relaxed text-[#183630]/75">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#B8A98F]/40 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleCategorySelect(item.category)}
                      className="text-xs font-black text-[#183630] hover:text-[#183630] flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>Explore {item.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-[#183630]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
         4. FROM IDEA TO PRODUCT (4-Step Process)
         ========================================================================= */}
      <section
        id="how-it-works-section"
        className="py-16 sm:py-24 border-b border-[#B8A98F]/30 bg-[#E5DAC9]"
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#183630]/70 block">
              HOW WE WORK
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#183630]">
              From Idea to Finished Product
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-[#183630]/80">
              A transparent, high-precision workflow from your digital graphic to real physical merchandise.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-6 sm:p-8 rounded-3xl border border-[#B8A98F] bg-[#E5DAC9] relative transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-lg hover:border-[#183630] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#183630] text-[#E5C690] font-mono text-base font-black flex items-center justify-center mb-5 border border-[#B8A98F]/40 shadow-xs">
                    {step.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#183630]">
                    {step.title}
                  </h3>
                  <p className="text-xs font-bold text-[#183630]/80 mt-1 mb-3">
                    “{step.sub}”
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#183630]/75">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-[#B8A98F]/30 flex items-center justify-between text-[11px] font-bold text-[#183630]/60">
                  <span>Step {step.step} of 04</span>
                  <span className="w-2 h-2 rounded-full bg-[#E5C690]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
         5. CUSTOMIZATION STUDIO SHOWCASE (#183630 Dark Green Atelier Box)
         ========================================================================= */}
      <section className="py-14 sm:py-20 border-b border-[#B8A98F]/30 bg-[#E5DAC9]">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-[#B8A98F]/40 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl bg-[#183630] text-[#E5DAC9]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#E5DAC9]/10 text-[#E5C690] border border-[#B8A98F]/40">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>DIRECT 3D DESIGN STUDIO</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-[#E5DAC9]">
                  Have Your Own Custom Design?
                </h2>

                <p className="text-sm sm:text-base text-[#E5DAC9]/85 max-w-xl leading-relaxed">
                  Upload your artwork and turn your imagination into physical reality.
                  Preview in real-time interactive 3D, calibrate placement dimensions in physical inches,
                  and order directly on WhatsApp.
                </p>

                {/* Formats Supported */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#E5DAC9]/70 block uppercase tracking-wider">
                    Supported Upload Formats:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {['PNG', 'JPG', 'JPEG', 'PDF'].map((format) => (
                      <span
                        key={format}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#E5DAC9]/10 text-[#E5DAC9] border border-[#B8A98F]/40"
                      >
                        .{format.toLowerCase()}
                      </span>
                    ))}
                    <span className="text-xs text-[#E5DAC9]/70 ml-2">Up to 50 MB High-Definition</span>
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      navigateTo('design-by-customer');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 py-4 rounded-xl font-bold text-sm bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] transition-all flex items-center gap-2.5 shadow-lg shadow-[#E5C690]/25 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Launch 3D Customizer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={whatsappGeneralUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-4 rounded-xl font-semibold text-sm border border-[#B8A98F]/50 bg-[#E5DAC9]/10 hover:bg-[#E5DAC9]/20 text-[#E5DAC9] transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-4 h-4 text-[#E5C690]" />
                    <span>Send Artwork via WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Right Feature Highlights: 4 Grid Pillars */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Interactive 3D Preview',
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
                      className="p-4.5 rounded-2xl border border-[#B8A98F]/30 bg-[#E5DAC9]/5 backdrop-blur-sm space-y-2 hover:bg-[#E5DAC9]/10 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#E5DAC9]/15 text-[#E5C690] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-[#E5DAC9]">{item.title}</h4>
                      <p className="text-[11px] text-[#E5DAC9]/75 leading-relaxed">
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
         6. WHATSAPP & BULK ORDER CTA SECTION (#183630 Dominant Banner)
         ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="rounded-3xl border border-[#B8A98F]/40 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl transition-all bg-[#183630] text-[#E5DAC9]">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#E5DAC9]/15 text-[#E5C690] border border-[#B8A98F]/40">
              <span className="w-2 h-2 rounded-full bg-[#E5C690] animate-pulse" />
              DIRECT WHATSAPP CONCIERGE
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#E5DAC9]">
              Need Instant Help or Bulk Custom Quotes?
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-[#E5DAC9]/80">
              Speak directly with our print production specialist on WhatsApp. Share artwork,
              request fabric swatches, or get bulk enterprise pricing quotes in minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0">
            <a
              href={whatsappGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 text-[#183630]" />
              <span>Chat on WhatsApp (+91 79928 01158)</span>
            </a>

            <button
              type="button"
              onClick={() => {
                navigateTo('bulk-orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm border border-[#B8A98F]/50 bg-[#E5DAC9]/10 hover:bg-[#E5DAC9]/20 text-[#E5DAC9] transition-all cursor-pointer"
            >
              <span>Bulk Order Inquiries</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeView;
