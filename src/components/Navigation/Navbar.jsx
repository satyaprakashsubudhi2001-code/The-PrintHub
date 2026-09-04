import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
  ArrowRight,
  Box,
  Home,
  Info,
  Phone,
  MessageCircle,
  Search,
  Layers,
  ShoppingBag,
  Flame,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * The PrintHub — Premium Header & Navigation
 * Crisp, modern e-commerce header matching high-end design specifications
 */
export function Navbar() {
  const {
    currentPage,
    navigateTo,
    storeSettings,
    themeMode,
    toggleThemeMode,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

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

  // WhatsApp quick deep-link
  const whatsappNumber = storeSettings?.whatsapp?.replace(/\D/g, '') || '917992801158';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hi The PrintHub team! I would like to enquire about custom merchandise design and bulk production.'
  )}`;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigateTo('products');
  };

  // Main Navigation Links
  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Shop Products', icon: Box },
    { id: 'about-us', label: 'About Studio', icon: Info },
    { id: 'help', label: 'Track & Help', icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-40 select-none w-full max-w-full font-sans transition-all duration-300">
      {/* =========================================================================
         0. TOP ANNOUNCEMENT STRIP
         ========================================================================= */}
      {showTopBar && (
        <div className={`text-xs py-2 px-4 sm:px-8 border-b flex items-center justify-between gap-4 transition-all duration-300 ${
          isLight
            ? 'bg-slate-950 text-slate-200 border-slate-900'
            : 'bg-[#05070e] text-slate-300 border-slate-800'
        }`}>
          <div className="flex items-center gap-3 truncate">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-400 font-mono text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
              Express Delivery
            </span>
            <span className="text-[11px] sm:text-xs font-medium truncate">
              Zero Minimum Orders • 300 DPI HD DTF Printing Pan-India
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono">WHATSAPP SUPPORT</span>
            </a>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <button
              onClick={() => navigateTo('admin-login')}
              className="hover:text-cyan-400 text-cyan-500 font-mono font-bold transition-colors hidden sm:inline"
              title="Open Admin Management Panel"
            >
              ADMIN PANEL
            </button>
            <button
              onClick={() => navigateTo('help')}
              className="hover:text-white transition-colors hidden md:inline font-medium text-slate-300"
            >
              Track Request
            </button>
            <button
              onClick={() => setShowTopBar(false)}
              className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Dismiss announcement"
              aria-label="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
         1. MAIN HEADER / BRAND BAR
         ========================================================================= */}
      <div
        className={`border-b backdrop-blur-xl transition-all duration-300 ${
          isLight
            ? 'bg-white/95 border-slate-200/90 text-slate-900 shadow-sm'
            : 'bg-[#080812]/95 border-slate-800/90 text-white shadow-xl'
        }`}
      >
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4 lg:gap-8">
          {/* Left: Brand Logo */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 text-left group shrink-0 focus:outline-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white text-sm sm:text-base font-black tracking-wider group-hover:scale-105 transition-transform shadow-md shadow-cyan-500/20 shrink-0">
              PH
            </div>
            <div className="flex flex-col shrink-0">
              <div className="flex items-center gap-2">
                <span
                  className={`font-display text-lg sm:text-xl font-black tracking-tight uppercase whitespace-nowrap transition-colors ${
                    isLight ? 'text-slate-950 group-hover:text-cyan-700' : 'text-white group-hover:text-cyan-400'
                  }`}
                >
                  {storeSettings.storeName || 'THE PRINTHUB'}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-lime-400/20 text-lime-700 dark:text-lime-400 border border-lime-400/30 text-[9px] font-black uppercase font-mono tracking-wider">
                  STUDIO
                </span>
              </div>
              <span className={`text-[10px] font-medium tracking-wide uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Custom Merchandise & Apparel
              </span>
            </div>
          </button>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => navigateTo(link.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all font-display uppercase ${
                    isActive
                      ? isLight
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md shadow-cyan-500/30'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Center-Right: Quick Search Bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center relative flex-1 max-w-xs">
            <Search className={`w-4 h-4 absolute left-3.5 pointer-events-none ${isLight ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Search custom tees, hoodies..."
              className={`w-full pl-10 pr-4 py-2 rounded-full text-xs font-medium focus:outline-none transition-all ${
                isLight
                  ? 'bg-slate-100/90 border border-slate-200 text-slate-800 focus:bg-white focus:border-cyan-600 placeholder:text-slate-400'
                  : 'bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 placeholder:text-slate-500'
              }`}
            />
          </form>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Primary "START DESIGNING" Action Button */}
            <button
              onClick={() => navigateTo('design-by-customer')}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-black tracking-wider uppercase shadow-[0_4px_20px_rgba(163,230,53,0.35)] hover:shadow-[0_6px_25px_rgba(163,230,53,0.5)] hover:scale-105 active:scale-95 transition-all font-display"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden xs:inline">DESIGN IN 3D</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>

            {/* Direct WhatsApp Action */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 sm:px-3.5 sm:py-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
              title="Chat with Production on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden md:inline font-mono">WHATSAPP</span>
            </a>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleThemeMode}
              className={`p-2.5 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-amber-400'
              }`}
              title={isLight ? 'Switch to Dark Studio Mode' : 'Switch to Light Mode'}
              aria-label="Toggle Theme"
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2.5 rounded-full border transition-colors ${
                isLight
                  ? 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
              }`}
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
         2. MOBILE & TABLET DRAWER
         ========================================================================= */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-b px-4 py-6 space-y-4 animate-in slide-in-from-top-4 shadow-2xl backdrop-blur-2xl ${
            isLight
              ? 'bg-white/98 border-slate-200 text-slate-900'
              : 'bg-[#080812]/98 border-slate-800 text-white'
          }`}
        >
          {/* Mobile Search */}
          <form onSubmit={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigateTo('products'); }} className="relative">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Search customizable products..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none transition-all ${
                isLight
                  ? 'bg-slate-100 border border-slate-200 text-slate-900 focus:border-cyan-600'
                  : 'bg-slate-900 border border-slate-800 text-white focus:border-cyan-400'
              }`}
            />
          </form>

          {/* Big CTA */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigateTo('design-by-customer');
            }}
            className="w-full py-3.5 rounded-2xl bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg font-display"
          >
            <Sparkles className="w-4 h-4" />
            <span>LAUNCH 3D DESIGN STUDIO</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo(link.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-left transition-all font-display uppercase tracking-wider ${
                    isActive
                      ? isLight
                        ? 'bg-slate-900 text-white'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : isLight
                      ? 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('admin-login');
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 font-bold text-xs flex items-center justify-center gap-2 font-mono uppercase"
            >
              <span>🔒 Admin Command Center</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Continue on WhatsApp Support</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
