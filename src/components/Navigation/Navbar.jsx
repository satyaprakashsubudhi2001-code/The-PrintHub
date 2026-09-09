import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Search,
  MessageCircle,
  Phone,
  ShoppingBag,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AnnouncementBar } from './AnnouncementBar';
import { WhatsAppIcon } from '../UI/WhatsAppIcon';
import { HeaderStudioBackground } from './HeaderStudioBackground';
import { ShopMegaMenu, ShopMobileSheet, ShopMobileAccordion } from './ShopMegaMenu';

/**
 * The PrintHub — Luxury Header & Navigation
 * Strictly compliant 4-Color Luxury System:
 * - #183630 (Primary Dark Green)
 * - #E5DAC9 (Primary Beige)
 * - #E5C690 (Primary Soft Gold)
 * - #B8A98F (Highlight Taupe)
 *
 * Signature ambient [ Bracket ] selector on active items with 250ms smooth transition.
 */
export function Navbar() {
  const {
    currentPage,
    navigateTo,
    storeSettings,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setIsShopMenuOpen,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  // Desktop & Mobile Shop Mega-Menu States
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);
  const shopTimeoutRef = useRef(null);
  const shopContainerRef = useRef(null);

  // Sync open state to context for floating widgets (WhatsApp button)
  useEffect(() => {
    setIsShopMenuOpen?.(shopDropdownOpen);
  }, [shopDropdownOpen, setIsShopMenuOpen]);

  // Close desktop dropdown on route navigation
  useEffect(() => {
    setShopDropdownOpen(false);
  }, [currentPage]);

  // Click outside & Escape key listeners for desktop dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shopContainerRef.current && !shopContainerRef.current.contains(e.target)) {
        setShopDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
    };
  }, []);

  const handleShopMouseEnter = () => {
    if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
    setShopDropdownOpen(true);
  };

  const handleShopMouseLeave = () => {
    shopTimeoutRef.current = setTimeout(() => {
      setShopDropdownOpen(false);
    }, 220);
  };

  const handleShopClick = () => {
    setShopDropdownOpen((prev) => !prev);
  };

  // Sync local search input with global context
  useEffect(() => {
    setLocalSearch(searchQuery || '');
  }, [searchQuery]);

  // Auto-close mobile drawer on desktop resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // WhatsApp concierge direct link
  const whatsappNumber = storeSettings?.whatsapp?.replace(/\D/g, '') || '917992801158';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hi The PrintHub team! I would like to enquire about custom merchandise printing and catalogue pricing.'
  )}`;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch.trim());
    if (currentPage !== 'products') {
      navigateTo('products');
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalSearch(val);
    setSearchQuery(val);
    if (val.trim() && currentPage !== 'products') {
      navigateTo('products');
    }
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
  };

  // 6 Required Main Navigation Links
  const navLinks = [
    {
      id: 'home',
      label: 'Home',
      action: () => {
        navigateTo('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: currentPage === 'home',
    },
    {
      id: 'shop',
      label: 'Shop',
      action: () => {
        setShopDropdownOpen((prev) => !prev);
      },
      isActive: currentPage === 'products' || currentPage === 'shop' || shopDropdownOpen,
    },
    {
      id: 'custom-printing',
      label: 'Custom Printing',
      badge: '3D Studio',
      action: () => {
        navigateTo('design-by-customer');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: currentPage === 'design-by-customer',
    },
    {
      id: 'bulk-orders',
      label: 'Bulk Orders',
      action: () => {
        navigateTo('bulk-orders');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: currentPage === 'bulk-orders',
    },
    {
      id: 'about',
      label: 'About',
      action: () => {
        navigateTo('about-us');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: currentPage === 'about-us',
    },
    {
      id: 'contact',
      label: 'Contact',
      action: () => {
        navigateTo('help');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: currentPage === 'help' || currentPage === 'contact',
    },
  ];

  return (
    <header className="sticky top-0 z-40 select-none w-full max-w-full font-sans transition-all duration-300 shadow-md">
      {/* =========================================================================
         0. DYNAMIC ANNOUNCEMENT / TOP MARQUEE BAR (Infinite Right -> Left Ticker)
         ========================================================================= */}
      <AnnouncementBar />

      {/* =========================================================================
         1. MAIN BRAND & SEARCH HEADER (#183630 Dominant Dark Green)
         ========================================================================= */}
      <div className="relative overflow-hidden border-b transition-all duration-300 bg-[#183630] border-[#B8A98F]/30 text-[#E5DAC9]">
        {/* Subtle luxury custom printing & merchandise studio background pattern */}
        <HeaderStudioBackground />

        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 lg:h-[84px] flex items-center justify-between gap-4 lg:gap-8">
          {/* Left: Brand Logo Lockup (Seamless, clean, no patch) */}
          <div className="w-auto lg:w-[28%] flex items-center shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 sm:gap-3.5 text-left group focus:outline-none cursor-pointer py-1 transition-opacity duration-200 hover:opacity-95"
              title="The PrintHub - Print Your Ideas. Make Them Yours."
              aria-label="The PrintHub Home"
            >
              {/* Seamless Floating Shield Mark (No boxy patch) */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                <img
                  src="/logo-mark-symbol.png"
                  alt="The PrintHub Symbol"
                  className="w-full h-full object-contain select-none filter drop-shadow-[0_2px_10px_rgba(229,198,144,0.35)]"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              {/* Uploaded Official Wordmark Graphic (Illuminated in #E5DAC9 Beige & #E5C690 Gold) */}
              <img
                src="/brand-wordmark.png"
                alt="The PrintHub - We don't print, we create!"
                className="h-7 xs:h-8 sm:h-9 lg:h-10 w-auto max-w-[155px] xs:max-w-[190px] sm:max-w-none object-contain select-none filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
              />
            </button>
          </div>

          {/* Center: Live Search Bar (#E5DAC9 Beige Input with #183630 Text) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative flex-1 max-w-xl mx-2 lg:mx-6"
          >
            <Search className="w-4 h-4 absolute left-4 pointer-events-none text-[#183630]/60" />
            <input
              type="text"
              value={localSearch}
              onChange={handleSearchChange}
              placeholder="Search products, blanks, and custom merchandise..."
              className="w-full pl-11 pr-10 py-2.5 rounded-full text-sm font-semibold focus:outline-none transition-all shadow-inner bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] placeholder:text-[#183630]/60 focus:bg-[#E5DAC9] focus:border-[#E5C690] focus:ring-2 focus:ring-[#E5C690]/40"
            />
            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3.5 p-1 rounded-full cursor-pointer text-[#183630]/60 hover:text-[#183630]"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Right: Actions (Shop Now removed per user request) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Direct WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border border-[#B8A98F]/60 text-[#E5DAC9] hover:text-[#E5C690] hover:border-[#E5C690] hover:bg-[#E5DAC9]/10 transition-all cursor-pointer shadow-xs"
              title="Chat with The PrintHub on WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 drop-shadow-xs" size={16} />
              <span className="whitespace-nowrap font-bold">WhatsApp</span>
            </a>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full border transition-colors cursor-pointer bg-[#183630] border-[#B8A98F]/40 text-[#E5DAC9] hover:text-[#E5C690]"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Full-Width Search Input */}
        <div className="relative z-10 md:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 pointer-events-none text-[#183630]/60" />
            <input
              type="text"
              value={localSearch}
              onChange={handleSearchChange}
              placeholder="Search products, blanks, merchandise..."
              className="w-full pl-10 pr-9 py-2 rounded-full text-xs font-semibold focus:outline-none transition-all bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] placeholder:text-[#183630]/60 focus:border-[#E5C690]"
            />
            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 p-1 rounded-full text-[#183630]/60 hover:text-[#183630]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* =========================================================================
         2. SUB-NAVIGATION BAR (#183630 with [ Bracket ] Ambient Selector)
         ========================================================================= */}
      <div className="relative border-b transition-colors bg-[#183630] border-[#B8A98F]/30 text-[#E5DAC9]">
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 sm:gap-3 overflow-x-auto md:overflow-visible no-scrollbar py-2.5 text-xs font-semibold scroll-smooth">
            {navLinks.map((link) => {
              const active = link.isActive;

              // Specialized Shop Navigation Item with Dynamic Dropdown / Mega-Menu
              if (link.id === 'shop') {
                return (
                  <div
                    key={link.id}
                    ref={shopContainerRef}
                    className="relative shrink-0"
                    onMouseEnter={handleShopMouseEnter}
                    onMouseLeave={handleShopMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={handleShopClick}
                      className={`px-3 sm:px-4 py-1.5 rounded-lg whitespace-nowrap transition-all duration-250 flex items-center gap-1 cursor-pointer shrink-0 ${
                        active || shopDropdownOpen
                          ? 'bracket-selected-dark text-[#E5C690] font-black'
                          : 'text-[#E5DAC9]/85 hover:text-[#E5C690] hover:bg-[#E5DAC9]/10 active:scale-95'
                      }`}
                      aria-expanded={shopDropdownOpen}
                      aria-haspopup="true"
                    >
                      <span>{link.label}</span>
                    </button>

                    {/* Desktop Shop Mega-Menu Dropdown Directly Below Shop Item */}
                    <ShopMegaMenu
                      isOpen={shopDropdownOpen}
                      onClose={() => setShopDropdownOpen(false)}
                      onMouseEnter={handleShopMouseEnter}
                      onMouseLeave={handleShopMouseLeave}
                    />
                  </div>
                );
              }

              return (
                <button
                  key={link.id}
                  onClick={link.action}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg whitespace-nowrap transition-all duration-250 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    active
                      ? 'bracket-selected-dark text-[#E5C690] font-black'
                      : 'text-[#E5DAC9]/85 hover:text-[#E5C690] hover:bg-[#E5DAC9]/10 active:scale-95'
                  }`}
                >
                  {/* Clean label without double brackets */}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider border transition-colors ${
                        active
                          ? 'bg-[#E5C690] text-[#183630] border-[#E5C690]'
                          : 'bg-[#E5DAC9]/20 text-[#E5C690] border-[#B8A98F]/40'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* =========================================================================
         3. MOBILE & TABLET DRAWER (#183630 Background)
         ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b px-4 py-5 space-y-4 animate-in slide-in-from-top-3 shadow-2xl backdrop-blur-2xl bg-[#183630] border-[#B8A98F]/30 text-[#E5DAC9]">
          {/* Direct WhatsApp Action in Mobile Drawer */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-3 rounded-xl font-bold text-xs bg-[#E5DAC9]/10 hover:bg-[#E5DAC9]/20 text-[#E5DAC9] border border-[#B8A98F]/40 flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <WhatsAppIcon className="w-4 h-4 drop-shadow-xs" size={18} />
            <span>Chat on WhatsApp (+91 79928 01158)</span>
          </a>

          {/* Big CTA for 3D Customizer Studio */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigateTo('design-by-customer');
            }}
            className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-md transition-all bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630]"
          >
            <Sparkles className="w-4 h-4" />
            <span>LAUNCH 3D CUSTOM STUDIO</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Navigation Links Grid with Bracket indicator */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#B8A98F]/30">
            {navLinks.map((link) => {
              // Expandable Shop button in mobile drawer
              if (link.id === 'shop') {
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => setMobileShopExpanded((prev) => !prev)}
                    className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all border ${
                      mobileShopExpanded || link.isActive
                        ? 'bracket-selected-dark text-[#E5C690] border-[#B8A98F]'
                        : 'bg-[#183630] border-[#B8A98F]/30 text-[#E5DAC9] hover:border-[#E5C690]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-250 ${
                        mobileShopExpanded ? 'rotate-180 text-[#E5C690]' : 'text-[#B8A98F]'
                      }`}
                    />
                  </button>
                );
              }

              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    link.action();
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all border ${
                    link.isActive
                      ? 'bracket-selected-dark text-[#E5C690] border-[#B8A98F]'
                      : 'bg-[#183630] border-[#B8A98F]/30 text-[#E5DAC9] hover:border-[#E5C690]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-[#E5C690] text-[#183630]">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile-Friendly Expandable Shop Accordion: SHOP -> [ MEN ] [ WOMEN ] [ BOYS ] [ GIRLS ] */}
          {mobileShopExpanded && (
            <div className="pt-2 animate-in fade-in-50 duration-200">
              <ShopMobileAccordion
                onNavigate={(query) => {
                  setSelectedCategory('all');
                  setSearchQuery(query || '');
                  navigateTo('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onClose={() => {
                  setMobileMenuOpen(false);
                  setMobileShopExpanded(false);
                }}
              />
            </div>
          )}

          <div className="pt-3 border-t border-[#B8A98F]/30 flex items-center justify-between text-xs text-[#E5DAC9]/75 font-medium">
            <span>The PrintHub Atelier</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('admin-login');
              }}
              className="text-[#E5C690] hover:underline font-mono text-[11px] font-bold cursor-pointer"
            >
              Staff Portal →
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
         4. MOBILE PHONE SHOP BOTTOM SHEET (Smooth slide-up modal for phones)
         ========================================================================= */}
      <ShopMobileSheet
        isOpen={shopDropdownOpen}
        onClose={() => setShopDropdownOpen(false)}
      />
    </header>
  );
}

export default Navbar;
