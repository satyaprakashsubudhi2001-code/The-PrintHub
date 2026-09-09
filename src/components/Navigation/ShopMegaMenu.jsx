import React, { useState, useRef } from 'react';
import { ArrowRight, Sparkles, ChevronRight, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * Compact Shop Mega-Menu Data
 * Strict 4-Color Luxury Palette:
 * - #183630 (Dark Green)
 * - #E5DAC9 (Beige)
 * - #E5C690 (Soft Gold)
 * - #B8A98F (Taupe / Highlight)
 */
const SHOP_CATEGORIES = [
  {
    id: 'men',
    label: 'MEN',
    tagline: "MEN • POPULAR STYLES",
    badge: 'Popular',
    subcategories: [
      { name: 'T-Shirts', query: 'Men T-Shirts', badge: 'CLASSIC', desc: '100% Combed Cotton, 180–220 GSM' },
      { name: 'Oversized T-Shirts', query: 'Men Oversized T-Shirts', badge: 'TRENDING', desc: 'Streetwear Boxy Fit, 240+ GSM' },
      { name: 'Hoodies', query: 'Men Hoodies', badge: 'WINTER', desc: 'Heavyweight Brushed Fleece' },
      { name: 'Sweatshirts', query: 'Men Sweatshirts', desc: 'Crewneck Pullovers & Blanks' },
      { name: 'Custom Apparel', query: 'Men Custom Apparel', badge: 'STUDIO', desc: 'Polos, Jackets & Bespoke Atelier Fits' },
    ],
    highlight: {
      tag: 'STREETWEAR DROP',
      title: "Men's Heavyweight Tees & Hoodies",
      subtitle: '240 GSM French Terry blanks with precision DTF custom printing.',
      actionLabel: 'SHOP ALL MEN →',
      searchQuery: 'Men',
    },
  },
  {
    id: 'women',
    label: 'WOMEN',
    tagline: "WOMEN • POPULAR STYLES",
    badge: 'Trending',
    subcategories: [
      { name: 'T-Shirts', query: 'Women T-Shirts', badge: 'ESSENTIAL', desc: 'Fitted & Regular Luxury Soft-Touch Cotton' },
      { name: 'Oversized T-Shirts', query: 'Women Oversized T-Shirts', badge: 'POPULAR', desc: 'Aesthetic Drop-Shoulder Relaxed Silhouettes' },
      { name: 'Crop / Relaxed Fit', query: 'Women Crop Relaxed Fit', badge: 'HOT', desc: 'Trendy Cropped Tops & Summer Fits' },
      { name: 'Hoodies', query: 'Women Hoodies', badge: 'COZY', desc: 'Cropped & Oversized Brushed Fleece' },
      { name: 'Custom Apparel', query: 'Women Custom Apparel', badge: 'STUDIO', desc: 'Athleisure, Coordinates & Custom Sets' },
    ],
    highlight: {
      tag: 'SUMMER ATELIER',
      title: "Women's Relaxed & Crop Fits",
      subtitle: 'Premium breathable cotton tops ready for vibrant custom artwork.',
      actionLabel: 'SHOP ALL WOMEN →',
      searchQuery: 'Women',
    },
  },
  {
    id: 'boys',
    label: 'BOYS',
    tagline: "BOYS • POPULAR STYLES",
    badge: 'Youth',
    subcategories: [
      { name: 'T-Shirts', query: 'Boys T-Shirts', badge: 'DAILY', desc: 'Durable, Breathable Bio-Washed Everyday Tees' },
      { name: 'Kids Apparel', query: 'Boys Kids Apparel', desc: 'Soft Hypoallergenic Fleece Sets & Hoodies' },
      { name: 'School T-Shirts', query: 'Boys School T-Shirts', badge: 'UNIFORM', desc: 'House Uniforms, Sports Tops & Kits' },
      { name: 'Event Merchandise', query: 'Boys Event Merchandise', desc: 'Summer Camps & Celebration Prints' },
      { name: 'Custom Kids Products', query: 'Boys Custom Kids Products', badge: 'STUDIO', desc: 'Personalized Names & Cartoon Graphics' },
    ],
    highlight: {
      tag: 'KIDS & SCHOOL',
      title: 'Durable Youth Uniforms & Tees',
      subtitle: 'Color-fast printing that withstands rough play & machine washing.',
      actionLabel: 'SHOP ALL BOYS →',
      searchQuery: 'Boys',
    },
  },
  {
    id: 'girls',
    label: 'GIRLS',
    tagline: "GIRLS • POPULAR STYLES",
    badge: 'Vibrant',
    subcategories: [
      { name: 'T-Shirts', query: 'Girls T-Shirts', badge: 'SOFT', desc: 'Bio-Washed Combed Cotton with Vibrant Prints' },
      { name: 'Kids Apparel', query: 'Girls Kids Apparel', desc: 'Fleece Hoodies & Cozy Everyday Sets' },
      { name: 'School T-Shirts', query: 'Girls School T-Shirts', badge: 'UNIFORM', desc: 'Sports Day Tops & Club Tees' },
      { name: 'Event Merchandise', query: 'Girls Event Merchandise', desc: 'Festive & Annual Day Merch' },
      { name: 'Custom Kids Products', query: 'Girls Custom Kids Products', badge: 'STUDIO', desc: 'Personalized Custom Prints & Badges' },
    ],
    highlight: {
      tag: 'GIRLS ATELIER',
      title: 'Vibrant Colors & Soft Fabrics',
      subtitle: 'Zero-crack kid-safe inks on ultra-gentle organic cotton fabrics.',
      actionLabel: 'SHOP ALL GIRLS →',
      searchQuery: 'Girls',
    },
  },
];

/**
 * Compact Desktop & Tablet Shop Mega-Menu Dropdown (hidden on mobile < md)
 * - Width: 65–75% of desktop (~880px to ~940px max)
 * - Height: ~360–420px (well under the 420–480px limit)
 * - Translucent: bg-[#183630]/94 backdrop-blur-xl allows hero section to remain visible
 * - Two-column compact layout (Left ~58%, Right ~42%)
 */
export function ShopMegaMenu({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) {
  const { navigateTo, setSearchQuery, setSelectedCategory } = useStore();
  const [selectedCatId, setSelectedCatId] = useState('women');
  const menuRef = useRef(null);

  const activeCategory = SHOP_CATEGORIES.find((c) => c.id === selectedCatId) || SHOP_CATEGORIES[0];

  const handleItemClick = (query) => {
    setSelectedCategory('all');
    setSearchQuery(query || '');
    navigateTo('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onClose?.();
  };

  const handleLaunch3D = () => {
    navigateTo('design-by-customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onClose?.();
  };

  return (
    <div
      ref={menuRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`hidden md:block absolute top-full left-0 sm:-left-3 md:-left-5 lg:-left-6 mt-1.5 z-50 w-[90vw] md:w-[740px] lg:w-[880px] xl:w-[980px] max-w-[980px] select-none transition-all duration-200 ease-out origin-top-left ${
        isOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto visible'
          : 'opacity-0 -translate-y-2 pointer-events-none invisible'
      }`}
      role="menu"
      aria-label="Shop Categories Mega Menu"
    >
      {/* Visual Pointer Caret directly below the Shop button */}
      <div className="relative">
        <div className="absolute -top-1.5 left-6 sm:left-9 md:left-11 lg:left-12 w-3 h-3 rotate-45 bg-[#183630] border-t border-l border-[#B8A98F]/50 shadow-xs z-20" />

        {/* Floating Translucent Dark Green Atelier Panel (Hero clearly visible around) */}
        <div
          className="relative overflow-hidden rounded-xl border border-[#B8A98F]/50 text-[#E5DAC9] shadow-[0_16px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          style={{ backgroundColor: 'rgba(24, 54, 48, 0.96)' }}
        >
          {/* Subtle Ambient Studio Background Glow */}
          <div className="absolute inset-0 pointer-events-none opacity-15 z-0">
            <div className="absolute -top-10 right-0 w-48 h-48 bg-[#E5C690]/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 left-0 w-48 h-48 bg-[#E5DAC9]/10 rounded-full blur-2xl" />
          </div>

          {/* =========================================================
              TOP COMPACT HEADER: SELECT CATEGORY + 4 BRACKET TABS
              ========================================================= */}
          <div
            className="relative z-10 px-4 pt-2.5 pb-2 border-b border-[#B8A98F]/25"
            style={{ backgroundColor: 'transparent' }}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[9px] font-mono tracking-widest uppercase text-[#B8A98F]/80">
                SELECT CATEGORY
              </span>
              <button
                type="button"
                onClick={() => handleItemClick('')}
                className="text-[10.5px] font-bold text-[#E5C690] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Browse Entire Catalogue</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* 4 Interactive Category Tabs with Signature [ Bracket ] Effect */}
            <div className="grid grid-cols-4 gap-2">
              {SHOP_CATEGORIES.map((cat) => {
                const isActive = cat.id === selectedCatId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onMouseEnter={() => setSelectedCatId(cat.id)}
                    onClick={() => setSelectedCatId(cat.id)}
                    className={`py-1.5 px-2 rounded-md text-xs font-bold tracking-wide transition-all duration-150 cursor-pointer flex items-center justify-center border text-center ${
                      isActive
                        ? 'bracket-category-tab-active border-[#B8A98F]/60 text-[#E5C690] bg-[#E5DAC9]/10 shadow-[0_0_12px_rgba(184,169,143,0.25)]'
                        : 'bracket-category-tab bg-[#E5DAC9]/5 border-transparent text-[#E5DAC9]/75 hover:text-[#E5C690] hover:bg-[#E5DAC9]/10'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* =========================================================
              MAIN CONTENT: BALANCED TWO-COLUMN LAYOUT (~60% Left, ~40% Right)
              ========================================================= */}
          <div className="relative z-10 p-3.5 grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
            
            {/* LEFT COLUMN (~60% Width): Compact Subcategories List (50-55px per row) */}
            <div className="md:col-span-7 flex flex-col space-y-1">
              <div className="flex items-center justify-between pb-1 mb-0.5 border-b border-[#B8A98F]/20">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#E5C690]">
                  {activeCategory.tagline}
                </span>
                <span className="text-[9.5px] text-[#B8A98F]/80 font-bold">
                  5 Styles
                </span>
              </div>

              <div className="space-y-1">
                {activeCategory.subcategories.map((sub) => (
                  <button
                    key={sub.name}
                    type="button"
                    onClick={() => handleItemClick(sub.query)}
                    className="w-full text-left px-3 py-1.5 min-h-[50px] max-h-[54px] rounded-lg transition-all duration-150 flex items-center justify-between group cursor-pointer border border-[#B8A98F]/20 hover:border-[#E5C690]/60 bg-[#E5DAC9]/[0.04] hover:bg-[#E5DAC9]/10"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#E5DAC9] group-hover:text-[#E5C690] transition-colors truncate">
                          {sub.name}
                        </span>
                        {sub.badge && (
                          <span className="text-[8px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider bg-[#E5C690] text-[#183630] shrink-0">
                            {sub.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#B8A98F] truncate group-hover:text-[#E5DAC9]/90 transition-colors leading-tight">
                        {sub.desc}
                      </span>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-[#E5C690] group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN (~40% Width): Natural Flowing Featured Card (NO Empty Void) */}
            <div className="md:col-span-5 p-3.5 rounded-lg border border-[#B8A98F]/30 relative overflow-hidden bg-[#E5DAC9]/[0.04] flex flex-col">
              {/* Subtle Atelier Silhouette Graphic */}
              <div className="absolute -right-3 -bottom-3 pointer-events-none opacity-10">
                <svg width="100" height="100" viewBox="0 0 52 52" fill="none">
                  <path
                    d="M 19 12 C 22 16 30 16 33 12"
                    stroke="#E5C690"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M 19 12 L 8 18 L 13 27 L 17 24 L 17 44 L 35 44 L 35 24 L 39 27 L 44 18 L 33 12"
                    stroke="#E5C690"
                    strokeWidth="1.2"
                  />
                </svg>
              </div>

              {/* Natural Content Flow — Buttons Immediately Follow Copy */}
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#183630] border border-[#B8A98F]/40 text-[8.5px] font-black uppercase tracking-wider text-[#E5C690] mb-2 w-fit">
                  <Sparkles className="w-2.5 h-2.5 text-[#E5C690]" />
                  <span>{activeCategory.highlight.tag}</span>
                </div>

                <h4 className="text-xs sm:text-sm font-black text-[#E5DAC9] mb-1 leading-snug">
                  {activeCategory.highlight.title}
                </h4>

                <p className="text-[10.5px] text-[#B8A98F] leading-relaxed mb-3.5">
                  {activeCategory.highlight.subtitle}
                </p>

                {/* Compact Action Buttons Naturally Following Content */}
                <div className="space-y-1.5 pt-2 border-t border-[#B8A98F]/20">
                  <button
                    type="button"
                    onClick={() => handleItemClick(activeCategory.highlight.searchQuery)}
                    className="w-full py-2 px-3 rounded-md text-[11px] font-black uppercase tracking-wide flex items-center justify-center gap-1.5 bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] transition-colors cursor-pointer shadow-xs"
                  >
                    <span>{activeCategory.highlight.actionLabel}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLaunch3D}
                    className="w-full py-1.5 px-3 rounded-md text-[11px] font-bold flex items-center justify-center gap-1.5 border border-[#B8A98F]/40 hover:border-[#E5C690] hover:bg-[#E5DAC9]/10 text-[#E5DAC9] hover:text-[#E5C690] transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#E5C690]" />
                    <span>Customize in 3D Studio</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

/**
 * Mobile Phone Optimized Shop Bottom Sheet (opens on mobile phone tap on Shop)
 * - Fixed bottom sheet with grab bar
 * - Translucent backdrop
 * - 4 large touch-friendly category tabs
 * - Thumb-friendly subcategory rows with 44px tap height
 * - Safe area padding for iPhones & Android phones
 */
export function ShopMobileSheet({ isOpen, onClose }) {
  const { navigateTo, setSearchQuery, setSelectedCategory } = useStore();
  const [selectedCatId, setSelectedCatId] = useState('women');

  if (!isOpen) return null;

  const activeCategory = SHOP_CATEGORIES.find((c) => c.id === selectedCatId) || SHOP_CATEGORIES[0];

  const handleItemClick = (query) => {
    setSelectedCategory('all');
    setSearchQuery(query || '');
    navigateTo('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onClose?.();
  };

  const handleLaunch3D = () => {
    navigateTo('design-by-customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
      {/* Translucent Dark Backdrop */}
      <div
        className="fixed inset-0 bg-[#183630]/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Modal Container */}
      <div
        className="relative z-10 w-full max-h-[85vh] max-h-[85dvh] rounded-t-3xl border-t border-x border-[#B8A98F]/40 text-[#E5DAC9] shadow-[0_-12px_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        style={{ backgroundColor: '#183630' }}
        role="dialog"
        aria-modal="true"
        aria-label="Shop Categories"
      >
        {/* Grab Handle */}
        <div className="pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-[#B8A98F]/40" />
        </div>

        {/* Header: Title + Close Button */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-[#B8A98F]/20 shrink-0">
          <span className="text-xs font-black uppercase tracking-wider text-[#E5C690]">
            SHOP BY CATEGORY
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleItemClick('')}
              className="text-[11px] font-bold text-[#E5C690] hover:underline cursor-pointer"
            >
              All Products →
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#E5DAC9]/10 text-[#E5DAC9] hover:text-[#E5C690] cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Category Tabs: [ MEN ] [ WOMEN ] [ BOYS ] [ GIRLS ] */}
        <div className="p-2.5 sm:p-3 border-b border-[#B8A98F]/20 shrink-0 bg-[#183630]/90">
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
            {SHOP_CATEGORIES.map((cat) => {
              const isActive = cat.id === selectedCatId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`py-2 px-0.5 xs:px-1 rounded-xl text-[11px] xs:text-xs font-bold transition-all text-center border cursor-pointer ${
                    isActive
                      ? 'bracket-category-tab-active border-[#B8A98F]/70'
                      : 'bracket-category-tab bg-[#E5DAC9]/5 border-transparent text-[#E5DAC9]/80'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Subcategories Content */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 overscroll-contain">
          <div className="flex items-center justify-between pb-1 border-b border-[#B8A98F]/15">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#E5C690]">
              {activeCategory.tagline}
            </span>
            <span className="text-[10px] text-[#B8A98F]/70">5 Styles</span>
          </div>

          {/* Subcategories items */}
          <div className="space-y-1.5">
            {activeCategory.subcategories.map((sub) => (
              <button
                key={sub.name}
                type="button"
                onClick={() => handleItemClick(sub.query)}
                className="w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 flex items-center justify-between group active:scale-[0.99] border border-transparent hover:border-[#B8A98F]/30 hover:bg-[#E5DAC9]/10 bg-[#E5DAC9]/5"
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-[#E5DAC9] group-hover:text-[#E5C690] transition-colors truncate">
                      {sub.name}
                    </span>
                    {sub.badge && (
                      <span className="text-[8px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider bg-[#E5DAC9]/15 text-[#E5C690] border border-[#B8A98F]/35 shrink-0">
                        {sub.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#B8A98F]/80 truncate group-hover:text-[#E5DAC9]/90 transition-colors">
                    {sub.desc}
                  </span>
                </div>

                <ChevronRight className="w-4 h-4 text-[#B8A98F]/60 group-hover:text-[#E5C690] shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions Sticky Footer */}
        <div className="p-3.5 border-t border-[#B8A98F]/30 bg-[#183630] space-y-2 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            onClick={() => handleItemClick(activeCategory.highlight.searchQuery)}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 bg-[#E5C690] active:bg-[#d9b87c] text-[#183630] transition-colors cursor-pointer shadow-sm"
          >
            <span>{activeCategory.highlight.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleLaunch3D}
            className="w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-[#B8A98F]/40 hover:border-[#E5C690] text-[#E5DAC9] hover:text-[#E5C690] transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E5C690]" />
            <span>Customize in 3D Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Mobile Expandable Shop Menu (for inside the hamburger mobile drawer)
 * Compact hierarchy:
 * SHOP
 *   [ MEN ]
 *      T-Shirts
 *      Hoodies
 *      Custom Apparel
 *   [ WOMEN ]
 *      T-Shirts
 *      Hoodies
 *      Custom Apparel
 *   [ BOYS ]
 *      T-Shirts
 *      Kids Apparel
 *   [ GIRLS ]
 *      T-Shirts
 *      Kids Apparel
 */
export function ShopMobileAccordion({ onNavigate, onClose }) {
  const [expandedCat, setExpandedCat] = useState('women');

  const handleSubClick = (query) => {
    onNavigate?.(query);
    onClose?.();
  };

  return (
    <div
      className="w-full space-y-2.5 rounded-2xl border border-[#B8A98F]/40 p-3.5 text-[#E5DAC9]"
      style={{ backgroundColor: '#183630' }}
    >
      <div className="flex items-center justify-between pb-1.5 border-b border-[#B8A98F]/20">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#E5C690]">
          SHOP BY CATEGORY
        </span>
        <button
          type="button"
          onClick={() => handleSubClick('')}
          className="text-[10px] font-bold text-[#E5C690] hover:underline"
        >
          All Products →
        </button>
      </div>

      {/* 4 Bracket Tabs */}
      <div className="grid grid-cols-2 gap-1.5">
        {SHOP_CATEGORIES.map((cat) => {
          const isExpanded = expandedCat === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer ${
                isExpanded
                  ? 'bracket-category-tab-active border-[#B8A98F]/70'
                  : 'bracket-category-tab bg-[#E5DAC9]/5 border-[#B8A98F]/20 text-[#E5DAC9]/80'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Compact Subcategories list */}
      {expandedCat && (
        <div className="pt-2 border-t border-[#B8A98F]/20 space-y-1 animate-in fade-in-50 duration-150">
          {SHOP_CATEGORIES.find((c) => c.id === expandedCat)?.subcategories.slice(0, 4).map((sub) => (
            <button
              key={sub.name}
              type="button"
              onClick={() => handleSubClick(sub.query)}
              className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between text-[#E5DAC9] hover:text-[#E5C690] hover:bg-[#E5DAC9]/10 transition-colors"
            >
              <span>{sub.name}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#B8A98F]/50" />
            </button>
          ))}

          <button
            type="button"
            onClick={() => handleSubClick(SHOP_CATEGORIES.find((c) => c.id === expandedCat)?.label)}
            className="w-full mt-1.5 py-2 rounded-lg text-center text-[11px] font-black bg-[#E5C690] text-[#183630] uppercase tracking-wider"
          >
            Explore All {SHOP_CATEGORIES.find((c) => c.id === expandedCat)?.label} →
          </button>
        </div>
      )}
    </div>
  );
}

export default ShopMegaMenu;
