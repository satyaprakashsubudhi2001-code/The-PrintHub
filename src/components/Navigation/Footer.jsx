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
  const { storeSettings, navigateTo, setSelectedCategory, categories = [] } = useStore();

  const handleCategoryClick = (category) => {
    if (setSelectedCategory) {
      setSelectedCategory(category);
    }
    navigateTo('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#2C0E63]/50 select-none pt-12 pb-12 w-full bg-[#12002E] text-white">
      {/* Top Value Badges Bar — 4 Core Pillars */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-[#2C0E63]/40">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-[#2C0E63]/60 border-[#DA0090]/30 text-[#DA0090]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                300 DPI Thermal DTF
              </h4>
              <p className="text-[11px] text-white/70 font-normal">Ultra-sharp stretchable colors</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-[#2C0E63]/60 border-[#DA0090]/30 text-[#DA0090]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Zero MOQ Requirement
              </h4>
              <p className="text-[11px] text-white/70 font-normal">Order 1 single unit or 10,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-[#2C0E63]/60 border-[#DA0090]/30 text-[#DA0090]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                PAN-India Express
              </h4>
              <p className="text-[11px] text-white/70 font-normal">Safe door delivery with tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-[#2C0E63]/60 border-[#DA0090]/30 text-[#DA0090]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Free Digital Proofs
              </h4>
              <p className="text-[11px] text-white/70 font-normal">Confirmed prior to printing</p>
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
              src="/brand-dark.png"
              alt="The PrintHub"
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </div>

          <p className="text-xs leading-relaxed text-white/75">
            India's leading custom print studio and merchandise platform. We specialize in heavyweight apparel, corporate gifting, drinkware, and headwear with professional calibration and zero MOQ.
          </p>

          <div className="pt-2">
            <a
              href="https://wa.me/917992801158?text=Hello%20The%20PrintHub%2C%20I%20would%20like%20to%20place%20a%20print%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F2CB30] hover:bg-[#e0b925] text-[#12002E] font-bold text-xs shadow-sm transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#12002E]/20" />
              <span>Instant WhatsApp Concierge</span>
            </a>
          </div>
        </div>

        {/* Column 2: Product Categories */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Product Catalog
          </h4>
          <ul className="space-y-2 text-xs text-white/80">
            {categories.length > 0 ? (
              categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.name)}
                    className="hover:text-[#F2CB30] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3 text-[#DA0090]" />
                    <span>
                      {cat.icon ? `${cat.icon} ` : ''}
                      {cat.name}
                    </span>
                  </button>
                </li>
              ))
            ) : (
              <>
                <li>
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className="hover:text-[#F2CB30] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3 text-[#DA0090]" />
                    <span>All Products Catalog</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigateTo('design-by-customer');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#F2CB30] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3 text-[#DA0090]" />
                    <span>Custom 3D Studio</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Column 3: Quick Links & Services */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Studio & Services
          </h4>
          <ul className="space-y-2 text-xs text-white/80">
            <li>
              <button
                onClick={() => { navigateTo('design-by-customer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-[#F2CB30] font-bold hover:underline flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#DA0090]" />
                <span>Launch 3D Customizer Studio</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => { navigateTo('about-us'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-[#F2CB30] transition-colors"
              >
                Printing Tech & Specifications
              </button>
            </li>
            <li>
              <button
                onClick={() => { navigateTo('help'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-[#F2CB30] transition-colors"
              >
                Artwork Guidelines (PNG / PDF)
              </button>
            </li>
            <li>
              <button
                onClick={() => { navigateTo('help'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-[#F2CB30] transition-colors"
              >
                Shipping & Bulk Delivery FAQs
              </button>
            </li>
            <li>
              <button
                onClick={() => { navigateTo('admin-login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex items-center gap-1.5 pt-1 text-white/60 hover:text-[#F2CB30] transition-colors font-mono text-[11px]"
              >
                <Lock className="w-3 h-3 text-[#DA0090]" />
                <span>Staff Admin Portal</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Production Facility */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Contact & Facility
          </h4>
          <div className="space-y-2.5 text-xs text-white/80">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-[#DA0090] shrink-0 mt-0.5" />
              <span>{storeSettings.address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-3.5 h-3.5 text-[#DA0090] shrink-0" />
              <a href={`tel:${storeSettings.phone}`} className="hover:text-[#F2CB30]">
                {storeSettings.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-[#DA0090] shrink-0" />
              <a href={`mailto:${storeSettings.email}`} className="hover:text-[#F2CB30]">
                {storeSettings.email}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-3.5 h-3.5 text-[#DA0090] shrink-0" />
              <span>{storeSettings.workingHours}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Sub-bar */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 mt-4 border-t border-[#2C0E63]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
        <div>
          © {new Date().getFullYear()} {storeSettings.storeName}. All rights reserved. Built for Indian creators & brands.
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigateTo('about-us')} className="hover:text-[#F2CB30]">About</button>
          <span className="text-[#DA0090]">•</span>
          <button onClick={() => navigateTo('help')} className="hover:text-[#F2CB30]">Help & Support</button>
          <span className="text-[#DA0090]">•</span>
          <a
            href="https://wa.me/917992801158"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F2CB30] font-semibold"
          >
            WhatsApp Support
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
