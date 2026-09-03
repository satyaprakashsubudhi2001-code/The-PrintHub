import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
  ArrowRight,
  Palette,
  Box,
  Home,
  Info,
  Phone,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * The PrintHub — Streamlined Customer Header & Studio Navigation
 * Pure Custom Product Exploration, Design Studio & WhatsApp / Email Platform
 * Clean navigation: HOME, PRODUCTS, DESIGN STUDIO, ABOUT, CONTACT + START DESIGNING CTA
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

  // Navigation Links for Customer Exploration & Studio
  const navLinks = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'products', label: 'PRODUCTS', icon: Box },
    { id: 'design-by-customer', label: 'DESIGN STUDIO', icon: Palette, highlight: true },
    { id: 'about-us', label: 'ABOUT', icon: Info },
    { id: 'help', label: 'CONTACT', icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-40 select-none shadow-2xl w-full max-w-full font-sans">
      {/* =========================================================================
         0. TOP STUDIO ANNOUNCEMENT STRIP
         ========================================================================= */}
      {showTopBar && (
        <div className="bg-[#05070e] text-slate-300 text-[11px] font-mono py-1.5 px-3 sm:px-6 lg:px-8 border-b border-slate-800/80 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300">
          <div className="flex items-center gap-2 truncate text-slate-300">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse shrink-0" />
            <span className="font-bold text-white tracking-wide text-[10px] sm:text-[11px] truncate">
              CUSTOM MERCHANDISE STUDIO
            </span>
            <span className="hidden md:inline text-slate-400">• 300 DPI HD DTF PRINTING • ZERO MOQ</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-slate-400 shrink-0 text-[10px] sm:text-[11px]">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WHATSAPP SUPPORT</span>
            </a>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <button
              onClick={() => navigateTo('help')}
              className="hover:text-white transition-colors hidden sm:inline"
            >
              NEED HELP?
            </button>
            <button
              onClick={() => setShowTopBar(false)}
              className="p-0.5 rounded hover:bg-slate-800 text-slate-500 hover:text-white transition-colors ml-1"
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
        className={`backdrop-blur-2xl border-b transition-all duration-300 ${
          isLight
            ? 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
            : 'bg-[#070913]/98 border-slate-800 text-white shadow-[0_10px_30px_rgba(0,0,0,0.7)]'
        }`}
      >
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group shrink-0 focus:outline-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white text-xs sm:text-sm font-black tracking-wider group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.4)] shrink-0">
              PH
            </div>
            <div className="flex flex-col shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className={`font-display text-base sm:text-lg xl:text-xl font-black tracking-tight transition-colors uppercase whitespace-nowrap ${
                    isLight ? 'text-slate-900 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-400'
                  }`}
                >
                  {storeSettings.storeName || 'THE PRINTHUB'}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-lime-400/20 text-lime-500 dark:text-lime-400 border border-lime-400/40 text-[8px] sm:text-[9px] font-black uppercase font-mono tracking-wider shadow-sm">
                  STUDIO
                </span>
              </div>
            </div>
          </button>

          {/* Center Links (Desktop: lg screens and above) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => navigateTo(link.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black tracking-wider transition-all font-display ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                      : link.highlight
                      ? isLight
                        ? 'text-cyan-700 hover:text-cyan-900 bg-cyan-50 border border-cyan-300 hover:border-cyan-500'
                        : 'text-cyan-300 hover:text-white bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${link.highlight && !isActive ? (isLight ? 'text-cyan-600' : 'text-cyan-400') : ''}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Primary "START DESIGNING" CTA Button */}
            <button
              onClick={() => navigateTo('design-by-customer')}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-black tracking-wider uppercase shadow-[0_0_20px_rgba(163,230,53,0.4)] hover:shadow-[0_0_30px_rgba(163,230,53,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 font-display"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-spin-slow" />
              <span>START DESIGNING</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>

            {/* Direct WhatsApp Quick Contact Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline font-mono">WHATSAPP</span>
            </a>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleThemeMode}
              className={`p-2 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-amber-600'
                  : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-amber-400'
              }`}
              title={isLight ? 'Switch to Dark Studio Mode' : 'Switch to Light Mode'}
              aria-label="Toggle Theme"
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl border transition-colors ${
                isLight
                  ? 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
              }`}
              title="Open Mobile Navigation Menu"
              aria-label="Open Mobile Navigation Menu"
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
          className={`lg:hidden border-t px-4 py-5 space-y-4 animate-in slide-in-from-top-4 shadow-2xl backdrop-blur-2xl ${
            isLight
              ? 'bg-white/98 border-slate-200 text-slate-900'
              : 'bg-[#070913]/98 border-slate-800 text-white'
          }`}
        >
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigateTo('design-by-customer');
            }}
            className="w-full py-3.5 rounded-2xl bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.4)] font-display"
          >
            <Sparkles className="w-4 h-4" />
            <span>START DESIGNING NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>

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
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all font-display uppercase tracking-wider ${
                    isActive
                      ? isLight
                        ? 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : isLight
                      ? 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-950'
                      : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-500" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Continue on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
