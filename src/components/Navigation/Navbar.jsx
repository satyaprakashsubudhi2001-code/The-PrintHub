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
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Collections' },
    { id: 'design-by-customer', label: 'Custom Studio' },
    { id: 'about-us', label: 'Atelier' },
    { id: 'help', label: 'Concierge' },
  ];

  return (
    <header className="sticky top-0 z-40 select-none w-full max-w-full font-sans transition-all duration-300">
      {/* =========================================================================
         0. TOP LUXURY ANNOUNCEMENT STRIP
         ========================================================================= */}
      {showTopBar && (
        <div className={`text-[10px] tracking-fashion py-2 px-4 sm:px-8 border-b flex items-center justify-between gap-4 transition-all duration-300 uppercase ${
          isLight
            ? 'bg-[#111114] text-[#FAF9F6] border-neutral-900'
            : 'bg-[#070708] text-[#D8D4CC] border-neutral-850'
        }`}>
          <div className="flex items-center gap-3 truncate">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 text-neutral-200 font-mono text-[9px] font-bold">
              <span className="w-1 h-1 rounded-full bg-[#C8B896] animate-pulse" />
              ATELIER DIRECT
            </span>
            <span className="font-medium truncate tracking-fashion">
              BESPOKE APPAREL STUDIO • 240+ GSM HEAVYWEIGHT SILHOUETTES • PAN-INDIA DISPATCH
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-medium">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#C8B896] hover:text-white transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span className="hidden sm:inline">CONCIERGE</span>
            </a>
            <span className="text-neutral-700 hidden sm:inline">•</span>
            <button
              onClick={() => navigateTo('admin-login')}
              className="hover:text-white text-neutral-400 font-mono transition-colors hidden sm:inline"
              title="Open Admin Management Panel"
            >
              ADMIN
            </button>
            <button
              onClick={() => setShowTopBar(false)}
              className="p-0.5 rounded hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors"
              title="Dismiss announcement"
              aria-label="Dismiss announcement"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
         1. MAIN HEADER / BRAND BAR
         ========================================================================= */}
      <div
        className={`border-b backdrop-blur-md transition-all duration-300 ${
          isLight
            ? 'bg-[#FAF9F6]/95 border-[#E5E2DC] text-[#0E0E10]'
            : 'bg-[#0A0A0C]/95 border-[#1E1E24] text-[#F5F4F0]'
        }`}
      >
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4 lg:gap-8">
          {/* Left: Brand Logo (Fear of God / High-Fashion Typography) */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 text-left group shrink-0 focus:outline-none cursor-pointer"
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-display font-black text-sm tracking-widest border transition-all ${
              isLight
                ? 'bg-[#0E0E10] text-[#FAF9F6] border-[#0E0E10]'
                : 'bg-[#FAF9F6] text-[#0A0A0C] border-[#FAF9F6]'
            }`}>
              PH
            </div>
            <div className="flex flex-col shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-display text-base sm:text-lg font-black tracking-fashion uppercase whitespace-nowrap">
                  {storeSettings.storeName || 'THE PRINTHUB'}
                </span>
                <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono tracking-widest uppercase border ${
                  isLight
                    ? 'bg-[#EAE7E1] text-[#0E0E10] border-[#D6D2C8]'
                    : 'bg-[#18181C] text-[#C8B896] border-[#2A2A32]'
                }`}>
                  ATELIER
                </span>
              </div>
              <span className="text-[9px] tracking-fashion text-neutral-500 uppercase">
                Bespoke Merchandise & Silhouettes
              </span>
            </div>
          </button>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => navigateTo(link.id)}
                  className={`relative px-4 py-2 text-xs uppercase font-medium tracking-fashion transition-all cursor-pointer rounded-lg ${
                    isActive
                      ? isLight
                        ? 'bg-[#0E0E10] text-[#FAF9F6] shadow-sm'
                        : 'bg-[#FAF9F6] text-[#0A0A0C] shadow-sm font-bold'
                      : isLight
                      ? 'text-[#5A5854] hover:text-[#0E0E10] hover:bg-[#EAE7E1]/50'
                      : 'text-[#A09D95] hover:text-[#FAF9F6] hover:bg-[#18181C]'
                  }`}
                >
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Center-Right: Quick Search Bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3.5 pointer-events-none text-neutral-400" />
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Search heavyweight blanks, hoodies..."
              className={`w-full pl-9 pr-4 py-2 rounded-full text-xs font-medium focus:outline-none transition-all ${
                isLight
                  ? 'bg-[#F0EEEA] border border-[#E0DCD4] text-[#0E0E10] focus:bg-white focus:border-[#0E0E10] placeholder:text-neutral-400'
                  : 'bg-[#141418] border border-[#23232A] text-white focus:border-[#FAF9F6] placeholder:text-neutral-500'
              }`}
            />
          </form>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Primary "STUDIO 3D" Action Button */}
            <button
              onClick={() => navigateTo('design-by-customer')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-xs font-bold tracking-fashion uppercase transition-all duration-200 hover:scale-102 active:scale-98 cursor-pointer shadow-md ${
                isLight
                  ? 'bg-[#0E0E10] text-[#FAF9F6] hover:bg-[#232328]'
                  : 'bg-[#FAF9F6] text-[#0A0A0C] hover:bg-[#EAE7E1]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">CUSTOM STUDIO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Direct WhatsApp Concierge */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2.5 sm:px-3.5 sm:py-2.5 rounded-full border text-xs font-bold tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 ${
                isLight
                  ? 'border-[#D6D2C8] bg-[#F4F2EE] text-[#0E0E10] hover:bg-white'
                  : 'border-[#272730] bg-[#141418] text-[#C8B896] hover:text-white hover:bg-[#1A1A20]'
              }`}
              title="Chat with Concierge on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-mono text-[10px]">CONCIERGE</span>
            </a>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleThemeMode}
              className={`p-2.5 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                isLight
                  ? 'bg-[#F4F2EE] hover:bg-white border-[#E0DCD4] text-[#0E0E10]'
                  : 'bg-[#141418] hover:bg-[#1E1E24] border-[#272730] text-[#C8B896]'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle Theme"
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2.5 rounded-full border transition-colors cursor-pointer ${
                isLight
                  ? 'border-[#E0DCD4] bg-[#F4F2EE] text-[#0E0E10]'
                  : 'border-[#272730] bg-[#141418] text-[#F5F4F0]'
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
              ? 'bg-[#FAF9F6]/98 border-[#E5E2DC] text-[#0E0E10]'
              : 'bg-[#0A0A0C]/98 border-[#1E1E24] text-[#F5F4F0]'
          }`}
        >
          {/* Mobile Search */}
          <form onSubmit={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigateTo('products'); }} className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Search heavyweight blanks, hoodies..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none transition-all ${
                isLight
                  ? 'bg-white border border-[#E0DCD4] text-[#0E0E10]'
                  : 'bg-[#141418] border border-[#272730] text-white'
              }`}
            />
          </form>

          {/* Big CTA */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigateTo('design-by-customer');
            }}
            className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-fashion flex items-center justify-center gap-2 shadow-lg transition-all ${
              isLight
                ? 'bg-[#0E0E10] text-[#FAF9F6]'
                : 'bg-[#FAF9F6] text-[#0A0A0C]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>ENTER CUSTOM STUDIO</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo(link.id);
                  }}
                  className={`flex items-center justify-center p-3 rounded-xl text-xs font-bold text-center transition-all uppercase tracking-fashion border ${
                    isActive
                      ? isLight
                        ? 'bg-[#0E0E10] text-[#FAF9F6] border-[#0E0E10]'
                        : 'bg-[#FAF9F6] text-[#0A0A0C] border-[#FAF9F6]'
                      : isLight
                      ? 'bg-white border-[#E0DCD4] text-[#5A5854]'
                      : 'bg-[#141418] border-[#272730] text-[#A09D95]'
                  }`}
                >
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('admin-login');
              }}
              className="w-full py-2.5 rounded-xl bg-neutral-800/40 text-neutral-300 border border-neutral-700 font-bold text-xs flex items-center justify-center gap-2 font-mono uppercase tracking-wider"
            >
              <span>🔒 Atelier Admin</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-[#C8B896]/15 text-[#C8B896] border border-[#C8B896]/30 font-bold text-xs flex items-center justify-center gap-2 tracking-fashion uppercase"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
