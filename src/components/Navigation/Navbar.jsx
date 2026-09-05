import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Search,
  Heart,
  MessageCircle,
  Phone,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * The PrintHub — Professional Header & Navigation
 * Commercial product discovery header featuring:
 * - Top Announcement Bar
 * - Large Centered Live Search Bar
 * - Dynamic Logo Lockup
 * - Wishlist & Direct WhatsApp Contact Actions
 * - Two-tier layout with dedicated Sub-Navigation Bar
 * - Mobile responsive navigation with horizontal scroll and docked search
 */
export function Navbar() {
  const {
    currentPage,
    navigateTo,
    themeMode,
    storeSettings,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    wishlist = [],
    showWishlistOnly,
    setShowWishlistOnly,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  // Keep local search input synced with context
  useEffect(() => {
    setLocalSearch(searchQuery || '');
  }, [searchQuery]);

  // Close mobile drawer on desktop resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLight = themeMode === 'light';

  // Active section tracking for single-page scroll navigation on Home page
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (currentPage !== 'home') {
      setActiveSection('');
      return;
    }

    const handleScroll = () => {
      const scrollPos = window.scrollY + 180; // account for sticky header offset

      const offersEl = document.getElementById('promotions-section');
      const trendingEl = document.getElementById('trending-products');
      const categoriesEl = document.getElementById('shop-by-category');

      if (offersEl && scrollPos >= offersEl.offsetTop) {
        setActiveSection('offers');
      } else if (trendingEl && scrollPos >= trendingEl.offsetTop) {
        setActiveSection('new-arrivals');
      } else if (categoriesEl && scrollPos >= categoriesEl.offsetTop) {
        setActiveSection('categories');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  // Smooth scroll helper that accounts for sticky header height
  const scrollToSection = (sectionId, navKey) => {
    setActiveSection(navKey);
    const scrollTarget = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        const headerOffset = 100;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    };

    if (currentPage !== 'home') {
      navigateTo('home');
      setTimeout(scrollTarget, 150);
      setTimeout(scrollTarget, 400);
    } else {
      scrollTarget();
    }
  };

  const handleWishlistClick = () => {
    if (setShowWishlistOnly) {
      setShowWishlistOnly(true);
    }
    setSelectedCategory('all');
    navigateTo('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // WhatsApp quick deep-link
  const whatsappNumber = storeSettings?.whatsapp?.replace(/\D/g, '') || '917992801158';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hi The PrintHub team! I would like to enquire about custom merchandise printing and product catalog.'
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

  // Main Sub-Navigation items with responsive active state
  const subNavLinks = [
    {
      id: 'home',
      label: 'Home',
      action: () => {
        setActiveSection('home');
        if (currentPage !== 'home') {
          navigateTo('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      isActive: currentPage === 'home' && (activeSection === 'home' || !activeSection),
    },
    {
      id: 'products',
      label: 'Products',
      action: () => {
        setSelectedCategory('all');
        navigateTo('products');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: currentPage === 'products' && selectedCategory === 'all',
    },
    {
      id: 'categories',
      label: 'Categories',
      action: () => scrollToSection('shop-by-category', 'categories'),
      isActive: currentPage === 'home' && activeSection === 'categories',
    },
    {
      id: 'new-arrivals',
      label: 'New Arrivals',
      action: () => {
        navigateTo('new-arrivals');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: currentPage === 'new-arrivals',
    },
    {
      id: 'custom-products',
      label: 'Custom Products',
      badge: '3D Studio',
      action: () => {
        navigateTo('design-by-customer');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: currentPage === 'design-by-customer',
    },
    {
      id: 'offers',
      label: 'Offers',
      badge: 'Deals',
      action: () => {
        navigateTo('offers');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: currentPage === 'offers',
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
    <header className="sticky top-0 z-40 select-none w-full max-w-full font-sans transition-all duration-300 shadow-sm">
      {/* =========================================================================
         0. TOP ANNOUNCEMENT BAR (#12002E Deep Plum)
         ========================================================================= */}
      {showTopBar && (
        <div className="text-xs py-1.5 px-4 sm:px-8 border-b flex items-center justify-between gap-4 transition-all duration-300 bg-[#12002E] text-white border-[#2C0E63]/60">
          <div className="flex items-center gap-2 sm:gap-3 truncate text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#DA0090]/20 text-[#DA0090] font-semibold text-[10px] tracking-wide border border-[#DA0090]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DA0090] animate-pulse" />
              PRINT EXPERTS
            </span>
            <span className="font-medium truncate text-white/90">
              Free Digital Proofs on All Custom Orders • Express PAN-India Dispatch
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-[11px] font-medium">
            <a
              href={`tel:${storeSettings?.phone || '+917992801158'}`}
              className="hidden md:flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#F2CB30]" />
              <span>{storeSettings?.phone || '+91 79928 01158'}</span>
            </a>
            <span className="text-white/30 hidden md:inline">•</span>
            <button
              onClick={() => navigateTo('admin-login')}
              className="text-white/70 hover:text-white transition-colors hidden sm:inline text-[10px] font-mono uppercase tracking-wider cursor-pointer"
              title="Admin Gateway"
            >
              Staff Portal
            </button>
            <button
              onClick={() => setShowTopBar(false)}
              className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Dismiss announcement"
              aria-label="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
         1. MAIN HEADER / BRAND & SEARCH BAR (#2C0E63 Primary Purple)
         ========================================================================= */}
      <div className="border-b transition-all duration-300 bg-[#2C0E63] border-[#12002E]/40 text-[#FFFFFF] shadow-sm">
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 lg:h-[84px] flex items-center justify-between gap-4 lg:gap-8">
          {/* Left: Brand Logo Lockup (approx 25-28%) */}
          <div className="w-auto lg:w-[28%] flex items-center shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 sm:gap-3.5 text-left group focus:outline-none cursor-pointer py-1 transition-opacity duration-200 hover:opacity-95"
              title="The PrintHub - We Don't Print, We Create!"
              aria-label="The PrintHub Home"
            >
              {/* Logo Mark Container */}
              <div className="w-11 h-11 sm:w-13 sm:h-13 lg:w-[58px] lg:h-[58px] rounded-[14px] p-1.5 sm:p-2 flex items-center justify-center shrink-0 transition-all duration-200 bg-[#12002E]/50 border border-white/15 shadow-[0_4px_14px_rgba(0,0,0,0.25)] group-hover:border-[#DA0090]/50 group-hover:shadow-[0_4px_18px_rgba(218,0,144,0.3)]">
                <img
                  src="/logo-mark-symbol.png"
                  alt="The PrintHub Symbol"
                  className="w-full h-full object-contain select-none"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col justify-center text-left">
                <span className="font-['Outfit',sans-serif] text-lg sm:text-[21px] lg:text-[25px] font-bold tracking-[2px] sm:tracking-[2.5px] lg:tracking-[3px] uppercase leading-none select-none text-[#FFFFFF] drop-shadow-sm">
                  THE PRINTHUB
                </span>

                {/* Subtle Hairline Accent Line & Secondary Tagline */}
                <div className="hidden sm:flex flex-col mt-1">
                  <div className="h-[1.5px] w-12 lg:w-16 bg-gradient-to-r from-[#F2CB30] to-transparent rounded-full mb-0.5 opacity-90" />
                  <span className="text-[9.5px] lg:text-[11px] font-medium tracking-[2px] lg:tracking-[2.5px] uppercase select-none whitespace-nowrap text-white/80">
                    WE DON'T PRINT, WE CREATE!
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Center: Large Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative flex-1 max-w-xl mx-2 lg:mx-6"
          >
            <Search className="w-4 h-4 absolute left-4 pointer-events-none text-white/60" />
            <input
              type="text"
              value={localSearch}
              onChange={handleSearchChange}
              placeholder="Search products, categories and more..."
              className="w-full pl-11 pr-10 py-2.5 rounded-full text-sm font-medium focus:outline-none transition-all shadow-inner bg-[#12002E]/60 border border-white/15 text-[#FFFFFF] placeholder:text-white/60 focus:bg-[#12002E]/90 focus:border-[#F2CB30] focus:ring-2 focus:ring-[#F2CB30]/25"
            />
            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3.5 p-1 rounded-full cursor-pointer text-white/60 hover:text-white"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistClick}
              className="relative p-2.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer bg-[#12002E]/50 hover:bg-[#12002E] border-white/15 hover:border-[#DA0090] text-[#FFFFFF]"
              title="Saved Items"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${
                wishlist.length > 0
                  ? 'text-[#DA0090] fill-[#DA0090]'
                  : 'text-white/80'
              }`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DA0090] text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Direct WhatsApp CTA Button (Primary Navbar CTA: #F2CB30 background, #12002E text) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold bg-[#F2CB30] hover:bg-[#e0b925] text-[#12002E] shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer"
              title="Chat with The PrintHub on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#12002E]/20" />
              <span className="whitespace-nowrap">WhatsApp Us</span>
            </a>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full border transition-colors cursor-pointer bg-[#12002E]/50 border-white/15 text-[#FFFFFF]"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Full-Width Search Input */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className={`w-4 h-4 absolute left-3.5 pointer-events-none ${
              isLight ? 'text-slate-400' : 'text-[#E5E5E5]/60'
            }`} />
            <input
              type="text"
              value={localSearch}
              onChange={handleSearchChange}
              placeholder="Search products, categories and more..."
              className="w-full pl-10 pr-9 py-2 rounded-full text-xs font-medium focus:outline-none transition-all bg-[#12002E]/60 border border-white/15 text-[#FFFFFF] placeholder:text-white/60 focus:border-[#F2CB30]"
            />
            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 p-1 rounded-full text-white/60 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* =========================================================================
         2. NAVIGATION BAR (#2C0E63 Primary Purple)
         ========================================================================= */}
      <div className="border-b transition-colors bg-[#2C0E63] border-[#12002E]/40 text-[#FFFFFF]">
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2 text-xs font-medium scroll-smooth">
            {subNavLinks.map((link) => {
              return (
                <button
                  key={link.id}
                  onClick={link.action}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    link.isActive
                      ? 'bg-[#12002E]/60 text-[#F2CB30] font-bold shadow-[0_2px_10px_rgba(242,203,48,0.2)] border border-[#F2CB30]/60 scale-[1.02]'
                      : 'text-white/90 hover:text-[#F2CB30] hover:bg-white/5 active:scale-95'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider border transition-colors ${
                      link.isActive
                        ? 'bg-[#F2CB30] text-[#12002E] border-[#F2CB30]'
                        : 'bg-[#DA0090]/20 text-[#DA0090] border-[#DA0090]/30'
                    }`}>
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
         3. MOBILE & TABLET DRAWER (#2C0E63 Primary Purple)
         ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b px-4 py-5 space-y-4 animate-in slide-in-from-top-3 shadow-2xl backdrop-blur-2xl bg-[#2C0E63]/98 border-[#12002E]/40 text-[#FFFFFF]">
          {/* Direct WhatsApp Action in Mobile Drawer (Primary CTA: #F2CB30 bg, #12002E text) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-3 rounded-xl font-bold text-xs bg-[#F2CB30] hover:bg-[#e0b925] text-[#12002E] flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-[#12002E]/20" />
            <span>Chat on WhatsApp (+91 79928 01158)</span>
          </a>

          {/* Big CTA for 3D Studio (#F2CB30 bg, #12002E text) */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigateTo('design-by-customer');
            }}
            className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-md transition-all bg-[#F2CB30] hover:bg-[#e0b925] text-[#12002E]"
          >
            <Sparkles className="w-4 h-4" />
            <span>LAUNCH 3D CUSTOM STUDIO</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
            {subNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  link.action();
                }}
                className={`flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all border ${
                  link.isActive
                    ? 'bg-[#12002E] text-[#F2CB30] border-[#F2CB30]/60 shadow-[0_2px_10px_rgba(242,203,48,0.15)] font-bold'
                    : 'bg-[#12002E]/40 border-white/10 text-white hover:bg-[#12002E]/70'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    link.isActive
                      ? 'bg-[#F2CB30] text-[#12002E]'
                      : 'bg-[#DA0090]/20 text-[#DA0090]'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
            <span>The PrintHub Support</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('admin-login');
              }}
              className="text-[#F2CB30] hover:text-[#e0b925] font-mono text-[11px] cursor-pointer"
            >
              Staff Portal →
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
