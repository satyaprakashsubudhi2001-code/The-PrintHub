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
  MessageCircle,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * The PrintHub — Commercial Indian Custom Merchandise Footer
 * Clean, structured footer featuring value pillars, direct catalog navigation,
 * studio entry points, and contact/WhatsApp channels.
 */
export function Footer() {
  const { storeSettings, navigateTo, themeMode, setSelectedCategory } = useStore();
  const isLight = themeMode === 'light';

  const handleCategoryClick = (category) => {
    if (setSelectedCategory) {
      setSelectedCategory(category);
    }
    navigateTo('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`border-t select-none pt-12 pb-12 w-full transition-colors duration-300 ${
      isLight
        ? 'bg-white border-slate-200 text-slate-600'
        : 'bg-[#08080C] border-[#18181E] text-slate-400'
    }`}>
      {/* Top Value Badges Bar — 4 Core Pillars */}
      <div className={`max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b ${
        isLight ? 'border-slate-200' : 'border-[#18181E]'
      }`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isLight ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-[#12131A] border-[#222330] text-cyan-400'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                300 DPI Thermal DTF
              </h4>
              <p className="text-[11px] text-slate-500 font-normal">Ultra-sharp stretchable colors</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isLight ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-[#12131A] border-[#222330] text-indigo-400'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Zero MOQ Requirement
              </h4>
              <p className="text-[11px] text-slate-500 font-normal">Order 1 single unit or 10,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isLight ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-[#12131A] border-[#222330] text-emerald-400'
            }`}>
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                PAN-India Express
              </h4>
              <p className="text-[11px] text-slate-500 font-normal">Safe door delivery with tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isLight ? 'bg-cyan-50 border-cyan-100 text-cyan-600' : 'bg-[#12131A] border-[#222330] text-cyan-400'
            }`}>
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Free Digital Proofs
              </h4>
              <p className="text-[11px] text-slate-500 font-normal">Confirmed prior to printing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content Grid */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {/* Column 1: Brand & Bio */}
        <div className="space-y-4">
          <div className="flex items-center">
            <img
              src={isLight ? '/brand-light.png' : '/brand-dark.png'}
              alt="The PrintHub"
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </div>

          <p className="text-xs leading-relaxed text-slate-500">
            India's leading custom print studio and merchandise platform. We specialize in heavyweight apparel, corporate gifting, drinkware, and headwear with professional calibration and zero MOQ.
          </p>

          <div className="pt-2">
            <a
              href="https://wa.me/917992801158?text=Hello%20The%20PrintHub%2C%20I%20would%20like%20to%20place%20a%20print%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
              <span>Instant WhatsApp Concierge</span>
            </a>
          </div>
        </div>

        {/* Column 2: Product Categories */}
        <div className="space-y-3">
          <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Product Catalog
          </h4>
          <ul className="space-y-2 text-xs text-slate-500">
            <li>
              <button
                onClick={() => handleCategoryClick('Apparel')}
                className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors text-left flex items-center gap-1.5"
              >
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span>Heavyweight T-Shirts & Apparel</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCategoryClick('Drinkware')}
                className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors text-left flex items-center gap-1.5"
              >
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span>Ceramic & Magic Mugs</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCategoryClick('Headwear')}
                className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors text-left flex items-center gap-1.5"
              >
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span>Snapbacks & Baseball Caps</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCategoryClick('Accessories')}
                className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors text-left flex items-center gap-1.5"
              >
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span>Pin Badges & Chef Aprons</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCategoryClick('Corporate')}
                className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors text-left flex items-center gap-1.5"
              >
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span>Corporate Welcome Kits</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Quick Links & Services */}
        <div className="space-y-3">
          <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Studio & Services
          </h4>
          <ul className="space-y-2 text-xs text-slate-500">
            <li>
              <button
                onClick={() => { navigateTo('design-by-customer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-blue-600 dark:text-cyan-400 font-bold hover:underline flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3" />
                <span>Launch 3D Customizer Studio</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => { navigateTo('about-us'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
              >
                Printing Tech & Specifications
              </button>
            </li>
            <li>
              <button
                onClick={() => { navigateTo('help'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
              >
                Artwork Guidelines (PNG / PDF)
              </button>
            </li>
            <li>
              <button
                onClick={() => { navigateTo('help'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
              >
                Shipping & Bulk Delivery FAQs
              </button>
            </li>
            <li>
              <button
                onClick={() => { navigateTo('admin-login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex items-center gap-1.5 pt-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors font-mono text-[11px]"
              >
                <Lock className="w-3 h-3" />
                <span>Staff Admin Portal</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Production Facility */}
        <div className="space-y-3">
          <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Contact & Facility
          </h4>
          <div className="space-y-2.5 text-xs text-slate-500">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{storeSettings.address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a href={`tel:${storeSettings.phone}`} className="hover:text-blue-600 dark:hover:text-cyan-400">
                {storeSettings.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a href={`mailto:${storeSettings.email}`} className="hover:text-blue-600 dark:hover:text-cyan-400">
                {storeSettings.email}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{storeSettings.workingHours}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Sub-bar */}
      <div className={`max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 mt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
        isLight ? 'border-slate-200 text-slate-500' : 'border-[#18181E] text-slate-500'
      }`}>
        <div>
          © {new Date().getFullYear()} {storeSettings.storeName}. All rights reserved. Built for Indian creators & brands.
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigateTo('about-us')} className="hover:text-blue-600 dark:hover:text-cyan-400">About</button>
          <span>•</span>
          <button onClick={() => navigateTo('help')} className="hover:text-blue-600 dark:hover:text-cyan-400">Help & Support</button>
          <span>•</span>
          <a
            href="https://wa.me/917992801158"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-500 font-semibold"
          >
            WhatsApp Support
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
