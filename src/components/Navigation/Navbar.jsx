import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
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
 * - Dynamic Logo Lockup (Dark/Light)
 * - Wishlist & Direct WhatsApp Contact Actions
 * - Two-tier layout with dedicated Sub-Navigation Bar
 * - Mobile responsive navigation with horizontal scroll and docked search
 */
export function Navbar() {
  const {
    currentPage,
    navigateTo,
    storeSettings,
    themeMode,
    toggleThemeMode,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    wishlist = [],
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
        const headerOffset = 120;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    };

    if (currentPage !== 'home') {
      navigateTo('home');
      setTimeout(scrollTarget, 100);
    } else {
      scrollTarget();
    }
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
      action: () => scrollToSection('trending-products', 'new-arrivals'),
      isActive: currentPage === 'home' && activeSection === 'new-arrivals',
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
      action: () => scrollToSection('promotions-section', 'offers'),
      isActive: currentPage === 'home' && activeSection === 'offers',
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
         0. TOP ANNOUNCEMENT BAR
         ========================================================================= */}
      {showTopBar && (
        <div
          className="text-xs py-1.5 px-4 sm:px-8 border-b flex items-center justify-between gap-4 transition-all duration-300 bg-[#070E20] text-slate-300 border-[#182744]"
        >
          <div className="flex items-center gap-2 sm:gap-3 truncate text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] font-semibold text-[10px] tracking-wide border border-[#3B82F6]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
              PRINT EXPERTS
            </span>
            <span className="font-medium truncate text-slate-200">
              Free Digital Proofs on All Custom Orders • Express PAN-India Dispatch
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-[11px] font-medium">
            <a
              href={`tel:${storeSettings?.phone || '+917992801158'}`}
              className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#3B82F6]" />
              <span>{storeSettings?.phone || '+91 79928 01158'}</span>
            </a>
            <span className="text-slate-600 hidden md:inline">•</span>
            <button
              onClick={() => navigateTo('admin-login')}
              className="text-slate-400 hover:text-white transition-colors hidden sm:inline text-[10px] font-mono uppercase tracking-wider"
              title="Admin Gateway"
            >
              Staff Portal
            </button>
            <button
              onClick={() => setShowTopBar(false)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Dismiss announcement"
              aria-label="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
         1. MAIN HEADER / BRAND & SEARCH BAR (#0B1630)
         ========================================================================= */}
      <div
        className="border-b transition-all duration-300 bg-[#0B1630] border-[#182744] text-[#FFFFFF]"
      >
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 lg:h-[84px] flex items-center justify-between gap-4 lg:gap-8">
          {/* Left: Brand Logo Lockup (approx 25-28%) */}
          <div className="w-auto lg:w-[28%] flex items-center shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 sm:gap-3.5 text-left group focus:outline-none cursor-pointer py-1 transition-opacity duration-200 hover:opacity-95"
              title="The PrintHub - We Don't Print, We Create!"
              aria-label="The PrintHub Home"
            >
              {/* Logo Mark Container (Refined glass/navy container with soft shadow, 14px radius, 54-60px desktop) */}
              <div
                className="w-11 h-11 sm:w-13 sm:h-13 lg:w-[58px] lg:h-[58px] rounded-[14px] p-1.5 sm:p-2 flex items-center justify-center shrink-0 transition-all duration-200 group-hover:border-white/20 group-hover:shadow-[0_4px_18px_rgba(59,130,246,0.15)]"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                }}
              >
                <img
                  src="/logo-mark-symbol.png"
                  alt="The PrintHub Symbol"
                  className="w-full h-full object-contain select-none"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              {/* Brand Typography (Authoritative Wordmark + Subtle Accent + Tagline) */}
              <div className="flex flex-col justify-center text-left">
                <span className="font-['Outfit',sans-serif] text-lg sm:text-[21px] lg:text-[25px] font-bold text-[#FFFFFF] tracking-[2px] sm:tracking-[2.5px] lg:tracking-[3px] uppercase leading-none select-none drop-shadow-sm">
                  THE PRINTHUB
                </span>

                {/* Optional Subtle Hairline Accent Line & Secondary Tagline */}
                <div className="hidden sm:flex flex-col mt-1">
                  <div className="h-[1.5px] w-12 lg:w-16 bg-gradient-to-r from-[#2563EB] to-transparent rounded-full mb-0.5 opacity-75" />
                  <span
                    className="text-[9.5px] lg:text-[11px] font-medium tracking-[2px] lg:tracking-[2.5px] uppercase select-none whitespace-nowrap"
                    style={{ color: 'rgba(255, 255, 255, 0.60)' }}
                  >
                    WE DON'T PRINT, WE CREATE!
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Center: Large Search Bar (Desktop) (#182744) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative flex-1 max-w-xl mx-2 lg:mx-6"
          >
            <Search className="w-4 h-4 absolute left-4 pointer-events-none text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={handleSearchChange}
              placeholder="Search products, categories and more..."
              className="w-full pl-11 pr-10 py-2.5 rounded-full text-sm font-medium focus:outline-none transition-all shadow-inner bg-[#182744] border border-[#23355A] text-[#FFFFFF] placeholder:text-slate-400 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/25"
            />
            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
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
              onClick={() => {
                setSelectedCategory('all');
                navigateTo('products');
              }}
              className="relative p-2.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer bg-[#182744] hover:bg-[#1f3358] border-[#23355A] hover:border-[#3B82F6] text-[#FFFFFF]"
              title="Saved Items"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-200'}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#3B82F6] text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Direct WhatsApp CTA Button (#00A878) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold bg-[#00A878] hover:bg-[#00966B] text-[#FFFFFF] shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer"
              title="Chat with The PrintHub on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
              <span className="whitespace-nowrap">WhatsApp Us</span>
            </a>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleThemeMode}
              className="p-2.5 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer bg-[#182744] hover:bg-[#1f3358] border-[#23355A] hover:border-[#3B82F6] text-[#FFFFFF]"
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle Theme"
            >
              {isLight ? <Moon className="w-4 h-4 text-slate-200" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full border transition-colors cursor-pointer bg-[#182744] border-[#23355A] text-[#FFFFFF]"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Full-Width Search Input (#182744) */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 pointer-events-none text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={handleSearchChange}
              placeholder="Search products, categories and more..."
              className="w-full pl-10 pr-9 py-2 rounded-full text-xs font-medium focus:outline-none transition-all bg-[#182744] border border-[#23355A] text-[#FFFFFF] placeholder:text-slate-400 focus:border-[#3B82F6]"
            />
            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* =========================================================================
         2. NAVIGATION BAR (#101D3A, Text #FFFFFF, Accent #3B82F6)
         ========================================================================= */}
      <div
        className="border-b transition-colors bg-[#101D3A] border-[#182744] text-[#FFFFFF]"
      >
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2 text-xs font-medium scroll-smooth">
            {subNavLinks.map((link) => {
              return (
                <button
                  key={link.id}
                  onClick={link.action}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    link.isActive
                      ? 'bg-[#182744] text-[#3B82F6] font-bold shadow-[0_2px_10px_rgba(59,130,246,0.2)] border border-[#3B82F6]/60 scale-[1.02]'
                      : 'text-slate-200 hover:text-white hover:bg-[#182744]/70 active:scale-95'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider border transition-colors ${
                      link.isActive
                        ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                        : 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30'
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
         3. MOBILE & TABLET DRAWER
         ========================================================================= */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-b px-4 py-5 space-y-4 animate-in slide-in-from-top-3 shadow-2xl backdrop-blur-2xl bg-[#0B1630]/98 border-[#182744] text-[#FFFFFF]"
        >
          {/* Direct WhatsApp Action in Mobile Drawer (#00A878) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-3 rounded-xl font-bold text-xs bg-[#00A878] hover:bg-[#00966B] text-[#FFFFFF] flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp (+91 79928 01158)</span>
          </a>

          {/* Big CTA for 3D Studio (#3B82F6) */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigateTo('design-by-customer');
            }}
            className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-md transition-all bg-[#3B82F6] hover:bg-[#2563EB] text-white"
          >
            <Sparkles className="w-4 h-4" />
            <span>LAUNCH 3D CUSTOM STUDIO</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#182744]">
            {subNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  link.action();
                }}
                className={`flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all border ${
                  link.isActive
                    ? 'bg-[#182744] text-[#3B82F6] border-[#3B82F6]/60 shadow-[0_2px_10px_rgba(59,130,246,0.15)] font-bold'
                    : 'bg-[#101D3A] border-[#182744] text-[#FFFFFF] hover:bg-[#182744]'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    link.isActive ? 'bg-[#3B82F6] text-white' : 'bg-[#3B82F6]/20 text-[#3B82F6]'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#182744] flex items-center justify-between text-xs text-slate-500">
            <span>The PrintHub Support</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('admin-login');
              }}
              className="text-blue-600 dark:text-cyan-400 font-mono text-[11px]"
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
