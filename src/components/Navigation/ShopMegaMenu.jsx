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
const SHOP_GROUPS = [
  { id: 'men', label: 'MAN', tagline: "MAN • POPULAR STYLES", audience: 'MAN' },
  { id: 'women', label: 'WOMEN', tagline: "WOMEN • POPULAR STYLES", audience: 'WOMAN' },
  { id: 'boys', label: 'BOYS', tagline: "BOYS • POPULAR STYLES", audience: 'BOYS' },
  { id: 'girls', label: 'GIRLS', tagline: "GIRLS • POPULAR STYLES", audience: 'GIRLS' },
];

/**
 * Compact Desktop & Tablet Shop Mega-Menu Dropdown (hidden on mobile < md)
 */
export function ShopMegaMenu({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) {
  const { navigateTo, setSearchQuery, setSelectedCategory, categories = [] } = useStore();
  const [selectedCatId, setSelectedCatId] = useState('men');
  const menuRef = useRef(null);

  const activeCategories = categories.filter(c => c.status !== 'INACTIVE');
  const activeGroup = SHOP_GROUPS.find((g) => g.id === selectedCatId) || SHOP_GROUPS[0];

  const groupCategories = activeCategories
    .filter(c => c.audience && c.audience.toUpperCase() === activeGroup.audience)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const handleItemClick = (catId) => {
    setSelectedCategory(catId);
    setSearchQuery('');
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
      <div className="relative">
        <div className="absolute -top-1.5 left-6 sm:left-9 md:left-11 lg:left-12 w-3 h-3 rotate-45 bg-[#183630] border-t border-l border-[#B8A98F]/50 shadow-xs z-20" />

        <div
          className="relative overflow-hidden rounded-xl border border-[#B8A98F]/50 text-[#E5DAC9] shadow-[0_16px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          style={{ backgroundColor: 'rgba(24, 54, 48, 0.96)' }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-15 z-0">
            <div className="absolute -top-10 right-0 w-48 h-48 bg-[#E5C690]/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 left-0 w-48 h-48 bg-[#E5DAC9]/10 rounded-full blur-2xl" />
          </div>

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
                onClick={() => handleItemClick('all')}
                className="text-[10.5px] font-bold text-[#E5C690] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Browse Entire Catalogue</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {SHOP_GROUPS.map((cat) => {
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

          <div className="relative z-10 p-3.5 grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
            <div className="md:col-span-7 flex flex-col space-y-1">
              <div className="flex items-center justify-between pb-1 mb-0.5 border-b border-[#B8A98F]/20">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#E5C690]">
                  {activeGroup.tagline}
                </span>
                <span className="text-[9.5px] text-[#B8A98F]/80 font-bold">
                  {groupCategories.length} Styles
                </span>
              </div>

              <div className="space-y-1 overflow-y-auto max-h-[220px] pr-1 no-scrollbar">
                {groupCategories.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[100px] text-center px-4 rounded-lg bg-[#E5DAC9]/[0.02] border border-[#B8A98F]/10">
                    <span className="text-[#B8A98F]/60 text-[10px] uppercase font-bold tracking-widest block mb-1">Empty</span>
                    <span className="text-xs text-[#E5DAC9]/60 font-sans">No categories available.</span>
                  </div>
                ) : (
                  groupCategories.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleItemClick(sub.id)}
                      className="w-full text-left px-3 py-1.5 min-h-[50px] max-h-[54px] rounded-lg transition-all duration-150 flex items-center justify-between group cursor-pointer border border-[#B8A98F]/20 hover:border-[#E5C690]/60 bg-[#E5DAC9]/[0.04] hover:bg-[#E5DAC9]/10"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {sub.icon && (
                          <span className="text-base shrink-0 opacity-80 group-hover:opacity-100">{sub.icon}</span>
                        )}
                        <div className="flex flex-col min-w-0">
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
                          {sub.description && (
                            <span className="text-[10px] text-[#B8A98F] truncate group-hover:text-[#E5DAC9]/90 transition-colors leading-tight">
                              {sub.description}
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="w-3.5 h-3.5 text-[#E5C690] group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="md:col-span-5 p-3.5 rounded-lg border border-[#B8A98F]/30 relative overflow-hidden bg-[#E5DAC9]/[0.04] flex flex-col">
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

              <div className="relative z-10">
                {groupCategories.length > 0 ? (
                  <>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#183630] border border-[#B8A98F]/40 text-[8.5px] font-black uppercase tracking-wider text-[#E5C690] mb-2 w-fit">
                      <Sparkles className="w-2.5 h-2.5 text-[#E5C690]" />
                      <span>{groupCategories[0].badge || 'FEATURED'}</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-[#E5DAC9] mb-1 leading-snug truncate">
                      {groupCategories[0].name}
                    </h4>

                    <p className="text-[10.5px] text-[#B8A98F] leading-relaxed mb-3.5 line-clamp-2 h-[30px]">
                      {groupCategories[0].description || `Explore our premium ${groupCategories[0].name.toLowerCase()} collection.`}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-[#B8A98F]/20">
                      <button
                        type="button"
                        onClick={() => handleItemClick(groupCategories[0].id)}
                        className="w-full py-2 px-3 rounded-md text-[11px] font-black uppercase tracking-wide flex items-center justify-center gap-1.5 bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] transition-colors cursor-pointer shadow-xs"
                      >
                        <span>SHOP {groupCategories[0].name.toUpperCase()} →</span>
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
                  </>
                ) : (
                  <>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#183630] border border-[#B8A98F]/40 text-[8.5px] font-black uppercase tracking-wider text-[#E5C690] mb-2 w-fit">
                      <Sparkles className="w-2.5 h-2.5 text-[#E5C690]" />
                      <span>FRESH DROPS</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-[#E5DAC9] mb-1 leading-snug">
                      New Styles Dropping Soon
                    </h4>

                    <p className="text-[10.5px] text-[#B8A98F] leading-relaxed mb-3.5 h-[30px]">
                      Check back shortly for our latest drops in this category.
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-[#B8A98F]/20">
                      <button
                        type="button"
                        onClick={handleLaunch3D}
                        className="w-full py-2 px-3 rounded-md text-[11px] font-bold flex items-center justify-center gap-1.5 border border-[#B8A98F]/40 hover:border-[#E5C690] hover:bg-[#E5DAC9]/10 text-[#E5DAC9] hover:text-[#E5C690] transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#E5C690]" />
                        <span>Customize in 3D Studio</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export function ShopMobileSheet({ isOpen, onClose }) {
  const { navigateTo, setSearchQuery, setSelectedCategory, categories = [] } = useStore();
  const [selectedCatId, setSelectedCatId] = useState('women');

  if (!isOpen) return null;

  const activeCategories = categories.filter(c => c.status !== 'INACTIVE');
  const activeGroup = SHOP_GROUPS.find((c) => c.id === selectedCatId) || SHOP_GROUPS[0];

  const groupCategories = activeCategories
    .filter(c => (c.audience || 'MAN').toUpperCase() === activeGroup.audience)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const handleItemClick = (catId) => {
    setSelectedCategory(catId);
    setSearchQuery('');
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
      <div
        className="fixed inset-0 bg-[#183630]/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative z-10 w-full max-h-[85vh] max-h-[85dvh] rounded-t-3xl border-t border-x border-[#B8A98F]/40 text-[#E5DAC9] shadow-[0_-12px_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        style={{ backgroundColor: '#183630' }}
        role="dialog"
        aria-modal="true"
        aria-label="Shop Categories"
      >
        <div className="pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-[#B8A98F]/40" />
        </div>

        <div className="px-4 py-2 flex items-center justify-between border-b border-[#B8A98F]/20 shrink-0">
          <span className="text-xs font-black uppercase tracking-wider text-[#E5C690]">
            SHOP BY CATEGORY
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleItemClick('all')}
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

        <div className="p-2.5 sm:p-3 border-b border-[#B8A98F]/20 shrink-0 bg-[#183630]/90">
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
            {SHOP_GROUPS.map((cat) => {
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

        <div className="p-4 overflow-y-auto space-y-3 flex-1 overscroll-contain">
          <div className="flex items-center justify-between pb-1 border-b border-[#B8A98F]/15">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#E5C690]">
              {activeGroup.tagline}
            </span>
            <span className="text-[10px] text-[#B8A98F]/70">{groupCategories.length} Styles</span>
          </div>

          <div className="space-y-1.5">
            {groupCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[100px] text-center px-4 rounded-lg bg-[#E5DAC9]/[0.02] border border-[#B8A98F]/10">
                <span className="text-[#B8A98F]/60 text-[10px] uppercase font-bold tracking-widest block mb-1">Empty</span>
                <span className="text-xs text-[#E5DAC9]/60 font-sans">No categories available.</span>
              </div>
            ) : (
              groupCategories.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleItemClick(sub.id)}
                  className="w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 flex items-center justify-between group active:scale-[0.99] border border-transparent hover:border-[#B8A98F]/30 hover:bg-[#E5DAC9]/10 bg-[#E5DAC9]/5"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {sub.icon && (
                      <span className="text-base shrink-0 opacity-80 group-hover:opacity-100">{sub.icon}</span>
                    )}
                    <div className="flex flex-col min-w-0">
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
                      {sub.description && (
                        <span className="text-[10px] text-[#B8A98F]/80 truncate group-hover:text-[#E5DAC9]/90 transition-colors block mt-0.5">
                          {sub.description}
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#B8A98F]/60 group-hover:text-[#E5C690] shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>

        <div className="p-3.5 border-t border-[#B8A98F]/30 bg-[#183630] space-y-2 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
          {groupCategories.length > 0 && (
            <button
              type="button"
              onClick={() => handleItemClick(groupCategories[0].id)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 bg-[#E5C690] active:bg-[#d9b87c] text-[#183630] transition-colors cursor-pointer shadow-sm"
            >
              <span>SHOP {groupCategories[0].name.toUpperCase()} →</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

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

export function ShopMobileAccordion({ onNavigate, onClose }) {
  const { categories = [], setSelectedCategory, setSearchQuery } = useStore();
  const [expandedCat, setExpandedCat] = useState('women');

  const activeCategories = categories.filter(c => c.status !== 'INACTIVE');

  const handleSubClick = (catId) => {
    if (catId === 'all') {
      setSelectedCategory('all');
      setSearchQuery('');
    } else {
      setSelectedCategory(catId);
      setSearchQuery('');
    }
    onNavigate?.();
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
          onClick={() => handleSubClick('all')}
          className="text-[10px] font-bold text-[#E5C690] hover:underline"
        >
          All Products →
        </button>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {SHOP_GROUPS.map((cat) => {
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

      {expandedCat && (
        <div className="pt-2 border-t border-[#B8A98F]/20 space-y-1 animate-in fade-in-50 duration-150">
          {(() => {
            const group = SHOP_GROUPS.find((g) => g.id === expandedCat);
            const groupCats = activeCategories
              .filter(c => c.audience && c.audience.toUpperCase() === group.audience)
              .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
            
            if (groupCats.length === 0) {
              return (
                <div className="py-3 text-center text-[10px] text-[#B8A98F]/60">
                  No categories yet
                </div>
              );
            }
            
            return groupCats.slice(0, 4).map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => handleSubClick(sub.id)}
                className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between text-[#E5DAC9] hover:text-[#E5C690] hover:bg-[#E5DAC9]/10 transition-colors"
              >
                <span>{sub.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#B8A98F]/50" />
              </button>
            ));
          })()}

          {activeCategories.filter(c => c.audience && c.audience.toUpperCase() === SHOP_GROUPS.find(g => g.id === expandedCat).audience).length > 4 && (
            <button
              type="button"
              onClick={() => handleSubClick('all')}
              className="w-full mt-1.5 py-2 rounded-lg text-center text-[11px] font-black bg-[#E5C690] text-[#183630] uppercase tracking-wider"
            >
              Explore All {SHOP_GROUPS.find((c) => c.id === expandedCat)?.label} →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ShopMegaMenu;
