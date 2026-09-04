import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  Award,
  Layers,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * The PrintHub — Atelier Luxury Footer (Fear of God & AllSaints Aesthetic)
 * Minimalist monochrome tones, architectural typography, material standards & atelier contact.
 */
export function Footer() {
  const { storeSettings, navigateTo, themeMode } = useStore();
  const isLight = themeMode === 'light';

  return (
    <footer className={`border-t select-none pt-14 pb-14 w-full transition-colors duration-300 ${
      isLight
        ? 'bg-fog-stone border-fog-sand text-stone-600'
        : 'bg-fog-950 border-fog-900 text-stone-400'
    }`}>
      {/* Top Value Badges Bar — Understated Luxury Standards */}
      <div className={`max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b ${
        isLight ? 'border-fog-sand' : 'border-fog-900'
      }`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
              isLight ? 'bg-white border-stone-200 text-fog-950 shadow-sm' : 'bg-fog-900 border-fog-800 text-fog-gold'
            }`}>
              <Sparkles className="w-4 h-4 text-fog-gold" />
            </div>
            <div>
              <h4 className={`text-xs font-mono font-bold tracking-wider uppercase ${isLight ? 'text-fog-950' : 'text-fog-bone'}`}>
                300 DPI Thermal DTF
              </h4>
              <p className="text-[11px] text-stone-500 font-sans">High-density stretchable pigmentation</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
              isLight ? 'bg-white border-stone-200 text-fog-950 shadow-sm' : 'bg-fog-900 border-fog-800 text-fog-gold'
            }`}>
              <Layers className="w-4 h-4 text-fog-gold" />
            </div>
            <div>
              <h4 className={`text-xs font-mono font-bold tracking-wider uppercase ${isLight ? 'text-fog-950' : 'text-fog-bone'}`}>
                Multi-Panel Placement
              </h4>
              <p className="text-[11px] text-stone-500 font-sans">Calibrated front, back & sleeve zones</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
              isLight ? 'bg-white border-stone-200 text-fog-950 shadow-sm' : 'bg-fog-900 border-fog-800 text-fog-gold'
            }`}>
              <ShieldCheck className="w-4 h-4 text-fog-gold" />
            </div>
            <div>
              <h4 className={`text-xs font-mono font-bold tracking-wider uppercase ${isLight ? 'text-fog-950' : 'text-fog-bone'}`}>
                Zero MOQ Threshold
              </h4>
              <p className="text-[11px] text-stone-500 font-sans">Single bespoke prototype to bulk drops</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
              isLight ? 'bg-white border-stone-200 text-fog-950 shadow-sm' : 'bg-fog-900 border-fog-800 text-fog-gold'
            }`}>
              <Award className="w-4 h-4 text-fog-gold" />
            </div>
            <div>
              <h4 className={`text-xs font-mono font-bold tracking-wider uppercase ${isLight ? 'text-fog-950' : 'text-fog-bone'}`}>
                3D Physical Mannequin
              </h4>
              <p className="text-[11px] text-stone-500 font-sans">Dual-axis interactive live draping</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand & Atelier Overview */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-display font-light text-xs tracking-widest ${
              isLight ? 'bg-fog-950 text-white border-fog-950' : 'bg-white text-fog-950 border-white'
            }`}>
              PH
            </div>
            <div>
              <h3 className={`font-display text-sm font-semibold tracking-[0.2em] uppercase ${
                isLight ? 'text-fog-950' : 'text-white'
              }`}>
                THE PRINTHUB
              </h3>
              <p className="text-[10px] font-mono tracking-widest uppercase text-fog-gold">ATELIER MERCHANDISE</p>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-stone-500 font-sans font-light">
            India's bespoke custom merchandise atelier. Engineered silhouettes, precision scale calibration in physical inches, and master artisan finishing.
          </p>

          {/* Minimal Industrial Certification Mark */}
          <div className="flex items-center gap-2 pt-2">
            <span className="w-2 h-2 rounded-full bg-fog-gold" />
            <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">
              ISO 12647-7 COLOR CERTIFIED
            </span>
          </div>
        </div>

        {/* Product Silhouettes */}
        <div className="space-y-3.5">
          <h4 className="text-[11px] font-mono tracking-[0.2em] uppercase text-fog-gold block">
            Bespoke Silhouettes
          </h4>
          <ul className="space-y-2.5 text-xs font-sans text-stone-500">
            <li>
              <button
                onClick={() => navigateTo('products')}
                className={`transition-colors text-left ${isLight ? 'hover:text-fog-950' : 'hover:text-fog-bone'}`}
              >
                240 GSM Oversized Streetwear Tee
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('products')}
                className={`transition-colors text-left ${isLight ? 'hover:text-fog-950' : 'hover:text-fog-bone'}`}
              >
                180 GSM Bio-Washed Combed Cotton Blank
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('products')}
                className={`transition-colors text-left ${isLight ? 'hover:text-fog-950' : 'hover:text-fog-bone'}`}
              >
                Classic Matty Pique Polo
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('products')}
                className={`transition-colors text-left ${isLight ? 'hover:text-fog-950' : 'hover:text-fog-bone'}`}
              >
                380 GSM Heavy French Terry Hoodie
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('products')}
                className={`transition-colors text-left ${isLight ? 'hover:text-fog-950' : 'hover:text-fog-bone'}`}
              >
                AAA Ceramic & Matte Black Vessels
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('products')}
                className={`transition-colors text-left ${isLight ? 'hover:text-fog-950' : 'hover:text-fog-bone'}`}
              >
                Structured 6-Panel Snapback Caps
              </button>
            </li>
          </ul>
        </div>

        {/* Atelier Workflow */}
        <div className="space-y-3.5">
          <h4 className="text-[11px] font-mono tracking-[0.2em] uppercase text-fog-gold block">
            Atelier Navigation
          </h4>
          <ul className="space-y-2.5 text-xs font-sans text-stone-500">
            <li>
              <button
                onClick={() => navigateTo('design-by-customer')}
                className="font-medium text-fog-950 dark:text-fog-stone hover:underline transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-fog-gold" />
                <span>Open 3D Customizer Studio</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('about-us')}
                className={`transition-colors ${isLight ? 'hover:text-fog-950' : 'hover:text-fog-bone'}`}
              >
                Printing Technologies & Facility
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('help')}
                className={`transition-colors ${isLight ? 'hover:text-fog-950' : 'hover:text-fog-bone'}`}
              >
                WhatsApp Direct Concierge
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('help')}
                className={`transition-colors ${isLight ? 'hover:text-fog-950' : 'hover:text-fog-bone'}`}
              >
                Frequently Asked Inquiries
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('admin-login')}
                className="flex items-center gap-1.5 pt-2 text-stone-400 hover:text-fog-gold transition-colors font-mono text-[11px]"
              >
                <Lock className="w-3 h-3" />
                <span>Atelier Command Portal</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Production Facility */}
        <div className="space-y-3.5">
          <h4 className="text-[11px] font-mono tracking-[0.2em] uppercase text-fog-gold block">
            Production Facility
          </h4>
          <div className="space-y-3 text-xs text-stone-500 font-sans">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
              <span>{storeSettings.address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <a href={`tel:${storeSettings.phone}`} className={isLight ? 'hover:text-fog-950' : 'hover:text-fog-bone'}>
                {storeSettings.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <a href={`mailto:${storeSettings.email}`} className={isLight ? 'hover:text-fog-950' : 'hover:text-fog-bone'}>
                {storeSettings.email}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{storeSettings.workingHours}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Sub-bar */}
      <div className={`max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono tracking-wider ${
        isLight
          ? 'border-fog-sand text-stone-500'
          : 'border-fog-900 text-stone-500'
      }`}>
        <div>
          © {new Date().getFullYear()} {storeSettings.storeName} ATELIER. ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigateTo('about-us')} className={isLight ? 'hover:text-fog-950' : 'hover:text-white'}>About Us</button>
          <span>•</span>
          <button onClick={() => navigateTo('help')} className={isLight ? 'hover:text-fog-950' : 'hover:text-white'}>Support</button>
          <span>•</span>
          <button onClick={() => navigateTo('admin-login')} className="hover:text-fog-gold">Staff Portal</button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

