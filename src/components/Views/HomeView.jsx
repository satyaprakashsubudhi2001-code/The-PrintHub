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
import { DynamicStatsRibbon } from '../UI/DynamicStatsRibbon';

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
const WHAT_WE_CREATE_ITEMS = [
  {
    title: 'Custom T-Shirts',
    tag: 'Apparel',
    desc: 'Classic round-neck & oversized heavyweight tees with durable 300 DPI transfers.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    category: 'Apparel',
  },
  {
    title: 'Hoodies & Fleece',
    tag: 'Outerwear',
    desc: 'Warm loopknit hoodies with vibrant chest and back graphic placement.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    category: 'Hoodies',
  },
  {
    title: 'Event Merchandise',
    tag: 'Occasions',
    desc: 'Custom tees, badges, and wristbands for fests, conferences, and sports meets.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    category: 'Apparel',
  },
  {
    title: 'Business Apparel',
    tag: 'Corporate',
    desc: 'Clean embroidered polos and uniform tees for startup teams and enterprises.',
    image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
    category: 'Corporate',
  },
  {
    title: 'Brand Merchandise',
    tag: 'Creators',
    desc: 'Limited-edition drop collections and capsule merchandise for digital creators.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    category: 'Apparel',
  },
  {
    title: 'Custom Gifts',
    tag: 'Keepsakes',
    desc: 'Personalized anniversary apparel, birthday tees, and custom celebration prints.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    category: 'Drinkware',
  },
  {
    title: 'Team & Group Tees',
    tag: 'Squads',
    desc: 'Matching group apparel for college batches, community runs, and hackathons.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    category: 'Apparel',
  },
  {
    title: 'Ceramic Mugs & Blanks',
    tag: 'Drinkware',
    desc: 'High-gloss photo-sublimated ceramic mugs with microwave and dishwasher safety.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    category: 'Drinkware',
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Idea',
    sub: 'Start with an idea.',
    desc: 'A sketch, a slogan, your company logo, or an inspirational concept you want to see in the physical world.',
  },
  {
    step: '02',
    title: 'Design',
    sub: 'Turn your idea into a design.',
    desc: 'Upload your graphic or work with us directly to format dimensions, colors, and 3D preview alignment.',
  },
  {
    step: '03',
    title: 'Create',
    sub: 'We bring the design to life.',
    desc: 'Industrial DTF printing, precision heat-pressing, and meticulous multi-point quality inspection.',
  },
  {
    step: '04',
    title: 'Deliver',
    sub: 'You receive something made for you.',
    desc: 'Securely packaged and priority-dispatched across India directly to your hands.',
  },
];

export function HomeView() {
  const {
    categories = [],
    adminUser,
    navigateTo,
    storeSettings,
    themeMode,
    setSelectedCategory,
  } = useStore();

  const isLight = themeMode === 'light';



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
    <div className="select-none pb-20 bg-white text-[#12002E]">
      {/* =========================================================================
         1. HERO SECTION (#12002E Deep Plum Flagship Background)
         ========================================================================= */}
      <section
        id="hero-section"
        className="relative overflow-hidden border-b min-h-[560px] sm:min-h-[620px] lg:min-h-[660px] xl:min-h-[700px] flex items-center py-12 sm:py-16 lg:py-20 bg-[#12002E] border-[#2C0E63]/40 scroll-mt-24 sm:scroll-mt-32"
      >
        {/* Immersive Flagship Studio Background Image Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <img
            src="/hero-studio-bg.jpg"
            alt="The PrintHub Flagship Atelier & Apparel Studio"
            className="w-full h-full object-cover object-[center_top] sm:object-[80%_top] lg:object-right-top transition-transform duration-700 opacity-75"
          />

          {/* Deep Plum Left Shield Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#12002E] via-[#12002E] sm:via-[#12002E]/95 md:via-[#12002E]/85 via-40% sm:via-48% to-[#12002E]/30 lg:to-transparent" />

          {/* Top Fade */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#12002E] via-[#12002E]/60 to-transparent" />

          {/* Bottom Vignette */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#12002E] via-[#12002E]/70 to-transparent" />
        </div>

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl space-y-6 text-left py-4">
            {/* Eyebrow Pill with CMYK / Creative Micro-Accents */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold tracking-wide border shadow-lg bg-[#12002E]/85 border-[#DA0090]/40 text-white backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DA0090]" title="Pink Accent" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F2CB30]" title="Yellow Action" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#2C0E63]" title="Brand Purple" />
                <span className="w-2.5 h-2.5 rounded-full bg-white" title="Light Neutral" />
              </div>
              <span className="uppercase text-[11px] font-extrabold tracking-wider text-white">
                PREMIUM CUSTOM PRINTING & MERCHANDISE ATELIER
              </span>
            </div>

            {/* Main Heading (#FFFFFF heading with #F2CB30 highlighted words) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white drop-shadow-lg">
              Bring Your Ideas <br />
              <span className="text-[#F2CB30]">
                to Life.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg leading-relaxed font-normal text-white/85 drop-shadow-md max-w-xl">
              Quality custom apparel, drinkware, headwear, and brand merchandise crafted for creators and businesses. Preview in interactive 3D and order directly via WhatsApp with zero MOQ.
            </p>

            {/* Primary & Secondary Action CTAs (Primary: #F2CB30 background, #12002E text) */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  navigateTo('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-[#F2CB30] hover:bg-[#e0b925] text-[#12002E] shadow-[0_8px_25px_rgba(242,203,48,0.35)] hover:shadow-[0_12px_32px_rgba(242,203,48,0.45)] transition-all flex items-center justify-center gap-2.5 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
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
                <Sparkles className="w-4 h-4 text-[#F2CB30]" />
                <span>Launch 3D Customizer</span>
              </button>
            </div>

            {/* Quick Trust Highlights */}
            <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-white/80">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F2CB30] shrink-0" />
                <span>Zero Minimum Orders</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F2CB30] shrink-0" />
                <span>300 DPI Thermal DTF</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F2CB30] shrink-0" />
                <span>Express PAN-India</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         2. DYNAMIC ATELIER METRICS ("Why Clients Choose The PrintHub")
         ========================================================================= */}
      <DynamicStatsRibbon isLight={false} />

      {/* =========================================================================
         3. CATEGORY NAVIGATION ("Shop by Category" — Clean Light Surface)
         ========================================================================= */}
      <section
        id="shop-by-category"
        className="py-12 sm:py-16 border-b border-slate-200 bg-white scroll-mt-24 sm:scroll-mt-32"
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-[#DA0090] block mb-1">
                Explore The Archive
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2C0E63]">
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
              className="text-xs sm:text-sm font-bold text-[#2C0E63] hover:text-[#DA0090] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Categories Grid */}
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.name)}
                  className="group p-3 rounded-2xl border border-slate-200 hover:border-[#2C0E63] bg-white transition-all duration-200 flex flex-col items-center text-center cursor-pointer hover:-translate-y-1 shadow-xs hover:shadow-md"
                >
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center p-1.5 mb-2.5 overflow-hidden transition-transform duration-300 group-hover:scale-105 border border-slate-200 relative bg-slate-50"
                    style={{ aspectRatio: '1 / 1' }}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-xl"
                      loading="lazy"
                    />
                    <span className="absolute bottom-1 right-1 text-xs p-0.5 bg-black/60 rounded backdrop-blur-sm">
                      {cat.icon || '🏷️'}
                    </span>
                  </div>

                  <span className="text-xs font-bold block truncate w-full text-[#2C0E63] group-hover:text-[#DA0090] transition-colors">
                    {cat.name}
                  </span>

                  <span className="text-[10px] text-slate-400 font-semibold block truncate w-full mt-0.5">
                    {cat.badge || 'Explore'}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl border border-slate-200 bg-slate-50 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#DA0090]/10 text-[#DA0090] flex items-center justify-center text-xl">
                ✨
              </div>
              <h3 className="text-base font-bold text-[#2C0E63]">
                Custom Categories Under Configuration
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No categories have been created yet. You can create custom merchandise categories in the Admin Command Center.
              </p>
              <div className="pt-1 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigateTo('products')}
                  className="px-4 py-2 rounded-xl bg-[#F2CB30] text-[#12002E] font-bold text-xs hover:bg-[#e0b925] transition-colors cursor-pointer"
                >
                  Browse All Products
                </button>
                {adminUser && (
                  <button
                    type="button"
                    onClick={() => navigateTo('admin')}
                    className="px-4 py-2 rounded-xl bg-[#2C0E63] text-white border border-[#2C0E63] font-mono text-xs font-bold hover:bg-[#12002E] transition-colors cursor-pointer"
                  >
                    Manage Categories
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===============================================================      {/* =========================================================================
         WHAT WE CREATE (Visual Merchandise Showcase with Curated Images)
         ========================================================================= */}
      <section
        id="what-we-create"
        className="py-16 sm:py-24 border-b border-slate-200 bg-slate-50/70 scroll-mt-24 sm:scroll-mt-32"
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#DA0090] block">
              OUR MERCHANDISE RANGE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight uppercase text-[#2C0E63]">
              WHAT WE CREATE
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
              Explore the diverse range of custom merchandise crafted in our studio with industrial-grade pigmentation and zero minimum thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHAT_WE_CREATE_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="group rounded-2xl sm:rounded-3xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl hover:border-[#2C0E63]"
              >
                {/* Image Cover */}
                <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#12002E]/80 backdrop-blur-md text-[#F2CB30] border border-[#F2CB30]/30 shadow-xs">
                    {item.tag}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-[#2C0E63] group-hover:text-[#DA0090] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-600">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (item.category) {
                          setSelectedCategory(item.category);
                        }
                        navigateTo('design-by-customer');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-extrabold text-[#2C0E63] hover:text-[#DA0090] flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>Customize This</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
         FROM IDEA TO PRODUCT (4-Step Visual Process)
         ========================================================================= */}
      <section
        id="how-it-works-section"
        className="py-16 sm:py-24 border-b border-slate-200 bg-white scroll-mt-24 sm:scroll-mt-32"
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#DA0090] block">
              HOW IT WORKS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight uppercase text-[#2C0E63]">
              FROM IDEA TO PRODUCT
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
              A straightforward, transparent journey from your imagination to your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white relative transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl hover:border-[#2C0E63] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#2C0E63]/10 text-[#2C0E63] font-mono text-base font-black flex items-center justify-center mb-5 border border-[#2C0E63]/20 shadow-xs">
                    {step.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#2C0E63]">
                    {step.title}
                  </h3>
                  <p className="text-xs font-bold text-[#DA0090] mt-1 mb-3">
                    “{step.sub}”
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>Step {step.step} of 04</span>
                  <span className="w-2 h-2 rounded-full bg-[#F2CB30]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
         5. CUSTOMIZATION STUDIO SHOWCASE (#12002E Deep Plum)
         ========================================================================= */}
      <section className="py-14 sm:py-20 border-b border-slate-200 bg-white">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-white/10 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl bg-[#12002E] text-white">
            {/* Glowing Corner Accents */}
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#DA0090]/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#F2CB30]/15 blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#DA0090]/20 text-[#DA0090] border border-[#DA0090]/30">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>DIRECT DESIGN ENGINE</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                  Have Your Own Design?
                </h2>

                <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
                  Upload your artwork and turn your vision into physical merchandise.
                  Preview in real-time interactive 3D, calibrate placement dimensions in physical inches,
                  and receive instant transparent pricing quotes.
                </p>

                {/* Supported File Formats */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-white/60 block uppercase tracking-wider">
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
                    <span className="text-xs text-white/60 ml-2">Up to 50 MB High-Definition</span>
                  </div>
                </div>

                {/* Action Buttons (Primary CTA: #F2CB30 bg, #12002E text) */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      navigateTo('design-by-customer');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 py-4 rounded-xl font-bold text-sm bg-[#F2CB30] hover:bg-[#e0b925] text-[#12002E] transition-all flex items-center gap-2.5 shadow-lg shadow-[#F2CB30]/25 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Launch 3D Customizer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={whatsappGeneralUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-4 rounded-xl font-semibold text-sm border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-4 h-4 text-[#F2CB30]" />
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
                      <div className="w-8 h-8 rounded-lg bg-[#2C0E63] text-[#F2CB30] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[11px] text-white/70 leading-relaxed">
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
         6. WHATSAPP & CONTACT CTA (#2C0E63 Primary Brand Banner)
         ========================================================================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="rounded-3xl border border-[#12002E]/40 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl transition-all bg-[#2C0E63] text-white">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#12002E]/60 text-[#F2CB30] border border-[#F2CB30]/30">
              <span className="w-2 h-2 rounded-full bg-[#F2CB30] animate-pulse" />
              DIRECT WHATSAPP CONCIERGE
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Need Instant Help or Bulk Custom Quotes?
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-white/80">
              Speak directly with our print production specialist on WhatsApp. Share artwork,
              request fabric swatches, or get bulk discount quotes in minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0">
            <a
              href={whatsappGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-[#F2CB30] hover:bg-[#e0b925] text-[#12002E] transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 fill-[#12002E]/20" />
              <span>Chat on WhatsApp (+91 79928 01158)</span>
            </a>

            <button
              type="button"
              onClick={() => {
                navigateTo('help');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
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
