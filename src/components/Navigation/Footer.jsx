import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  Award,
  Lock,
  MessageCircle,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from './BrandLogo';
import { OFFICIAL_CONTACT_LINKS } from '../../constants/config';
import {
  IconWhatsApp,
  IconInstagram,
  IconFacebook,
  IconWhatsAppCatalog,
  IconGmail,
  IconGoogleMaps,
} from '../UI/ThePrintHubSocialIcons';

/**
 * The PrintHub — Luxury Footer
 * Strictly adhering to the 4-Color Luxury System:
 * - #183630 (Primary Dark Green background)
 * - #E5DAC9 (Primary Beige text)
 * - #E5C690 (Primary Soft Gold accents & buttons)
 * - #B8A98F (Highlight Taupe borders)
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

  const whatsappNumber = storeSettings?.whatsapp?.replace(/\D/g, '') || '917992801158';

  return (
    <footer className="border-t border-[#B8A98F]/30 select-none pt-12 pb-24 lg:pb-12 w-full bg-[#183630] text-[#E5DAC9]">
      {/* Top Value Badges Bar — 4 Core Pillars */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-[#B8A98F]/25">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-[#E5DAC9]/10 border-[#B8A98F]/40 text-[#E5C690]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5C690]">
                300 DPI Thermal DTF
              </h4>
              <p className="text-[11px] text-[#E5DAC9]/75 font-normal">Ultra-sharp stretchable pigments</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-[#E5DAC9]/10 border-[#B8A98F]/40 text-[#E5C690]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5C690]">
                Zero MOQ Guarantee
              </h4>
              <p className="text-[11px] text-[#E5DAC9]/75 font-normal">Order 1 single unit or 10,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-[#E5DAC9]/10 border-[#B8A98F]/40 text-[#E5C690]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5C690]">
                PAN-India Express
              </h4>
              <p className="text-[11px] text-[#E5DAC9]/75 font-normal">Fast, insured delivery to your door</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-[#E5DAC9]/10 border-[#B8A98F]/40 text-[#E5C690]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5C690]">
                Free Digital Proofs
              </h4>
              <p className="text-[11px] text-[#E5DAC9]/75 font-normal">Confirmed prior to printing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content Grid */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {/* Column 1: Brand & Bio */}
        <div className="space-y-4">
          <BrandLogo variant="dark" size="md" />

          <p className="text-xs leading-relaxed text-[#E5DAC9]/80">
            India's bespoke print atelier and personalized merchandise platform.
            Specializing in heavyweight apparel, corporate collections, drinkware, and custom gifts with master calibration and zero MOQ.
          </p>

          <div className="pt-2">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                'Hello The PrintHub! I would like to place an order or request a quote.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] font-bold text-xs shadow-sm transition-all hover:scale-102 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#183630]" />
              <span>Instant WhatsApp Concierge</span>
            </a>
          </div>
        </div>

        {/* Column 2: Product Categories */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5C690]">
            Product Catalog
          </h4>
          <ul className="space-y-2 text-xs text-[#E5DAC9]/80">
            {categories.length > 0 ? (
              categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.name)}
                    className="hover:text-[#E5C690] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3 text-[#B8A98F]" />
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
                    onClick={() => handleCategoryClick('Custom T-Shirts')}
                    className="hover:text-[#E5C690] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3 text-[#B8A98F]" />
                    <span>👕 Custom T-Shirts</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('Hoodies')}
                    className="hover:text-[#E5C690] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3 text-[#B8A98F]" />
                    <span>🧥 Premium Hoodies</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('Mugs')}
                    className="hover:text-[#E5C690] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3 text-[#B8A98F]" />
                    <span>☕ Ceramic Drinkware</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className="hover:text-[#E5C690] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3 text-[#B8A98F]" />
                    <span>All Products Archive</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Column 3: Quick Links & Services */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5C690]">
            Studio & Services
          </h4>
          <ul className="space-y-2 text-xs text-[#E5DAC9]/80">
            <li>
              <button
                onClick={() => {
                  navigateTo('design-by-customer');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[#E5C690] font-bold hover:underline flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#E5C690]" />
                <span>Launch 3D Customizer Studio</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigateTo('bulk-orders');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#E5C690] transition-colors"
              >
                Bulk & Corporate Inquiries
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigateTo('about-us');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#E5C690] transition-colors"
              >
                Printing Tech & Atelier Standards
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigateTo('help');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#E5C690] transition-colors"
              >
                Artwork Guidelines (PNG / PDF)
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigateTo('admin-login');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 pt-1 text-[#E5DAC9]/60 hover:text-[#E5C690] transition-colors font-mono text-[11px]"
              >
                <Lock className="w-3 h-3 text-[#B8A98F]" />
                <span>Staff Admin Portal</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Production Facility */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5C690]">
            Contact & Atelier
          </h4>
          <div className="space-y-2.5 text-xs text-[#E5DAC9]/85">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-[#E5C690] shrink-0 mt-0.5" />
              <span>{storeSettings?.address || 'Industrial Area, Phase 2, New Delhi, India'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-3.5 h-3.5 text-[#E5C690] shrink-0" />
              <a href={`tel:${storeSettings?.phone || '+917992801158'}`} className="hover:text-[#E5C690]">
                {storeSettings?.phone || '+91 79928 01158'}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-[#E5C690] shrink-0" />
              <a href={`mailto:${storeSettings?.email || 'theprinthub.in@gmail.com'}`} className="hover:text-[#E5C690]">
                {storeSettings?.email || 'theprinthub.in@gmail.com'}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-3.5 h-3.5 text-[#E5C690] shrink-0" />
              <span>{storeSettings?.workingHours || 'Mon - Sat: 10:00 AM - 8:00 PM'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          DEDICATED "CONNECT WITH THE PRINTHUB" SECTION
          6 Official Clickable Social & Contact Links:
          WhatsApp • Instagram • Facebook • WhatsApp Catalog • Gmail • Google Maps
          Mobile: 2x3 Grid • Desktop: Clean flex row with [ Bracket ] interaction
          ========================================================================= */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#B8A98F]/25">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Section Title & Description */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E5C690]" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#E5C690]">
                CONNECT WITH THE PRINTHUB
              </span>
            </div>
            <p className="text-xs text-[#E5DAC9]/75 max-w-md">
              Official direct atelier channels for bespoke orders, catalog inquiries, and studio consultations.
            </p>
          </div>

          {/* 6 Interactive Clickable Links (2x3 Grid on Mobile, Flex on Desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap items-center gap-2 sm:gap-2.5">
            {/* 1. WhatsApp */}
            <a
              href={OFFICIAL_CONTACT_LINKS.WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact The PrintHub on WhatsApp"
              className="bracket-social-pill px-3.5 py-2.5 rounded-xl border border-[#B8A98F]/40 bg-[#E5DAC9]/5 text-xs font-bold text-[#E5DAC9] hover:text-[#E5C690] hover:border-[#E5C690]/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <IconWhatsApp className="w-4 h-4 text-[#E5C690] shrink-0" size={16} />
              <span>WhatsApp</span>
            </a>

            {/* 2. Instagram */}
            <a
              href={OFFICIAL_CONTACT_LINKS.INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow The PrintHub on Instagram"
              className="bracket-social-pill px-3.5 py-2.5 rounded-xl border border-[#B8A98F]/40 bg-[#E5DAC9]/5 text-xs font-bold text-[#E5DAC9] hover:text-[#E5C690] hover:border-[#E5C690]/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <IconInstagram className="w-4 h-4 text-[#E5C690] shrink-0" size={16} />
              <span>Instagram</span>
            </a>

            {/* 3. Facebook */}
            <a
              href={OFFICIAL_CONTACT_LINKS.FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect with The PrintHub on Facebook"
              className="bracket-social-pill px-3.5 py-2.5 rounded-xl border border-[#B8A98F]/40 bg-[#E5DAC9]/5 text-xs font-bold text-[#E5DAC9] hover:text-[#E5C690] hover:border-[#E5C690]/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <IconFacebook className="w-4 h-4 text-[#E5C690] shrink-0" size={16} />
              <span>Facebook</span>
            </a>

            {/* 4. WhatsApp Catalog */}
            <a
              href={OFFICIAL_CONTACT_LINKS.WHATSAPP_CATALOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Browse The PrintHub WhatsApp Business Catalog"
              className="bracket-social-pill px-3.5 py-2.5 rounded-xl border border-[#B8A98F]/40 bg-[#E5DAC9]/5 text-xs font-bold text-[#E5DAC9] hover:text-[#E5C690] hover:border-[#E5C690]/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <IconWhatsAppCatalog className="w-4 h-4 text-[#E5C690] shrink-0" size={16} />
              <span className="whitespace-nowrap">WhatsApp Catalog</span>
            </a>

            {/* 5. Gmail */}
            <a
              href={OFFICIAL_CONTACT_LINKS.GMAIL_URL}
              aria-label="Email The PrintHub via Gmail"
              className="bracket-social-pill px-3.5 py-2.5 rounded-xl border border-[#B8A98F]/40 bg-[#E5DAC9]/5 text-xs font-bold text-[#E5DAC9] hover:text-[#E5C690] hover:border-[#E5C690]/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <IconGmail className="w-4 h-4 text-[#E5C690] shrink-0" size={16} />
              <span>Gmail</span>
            </a>

            {/* 6. Google Maps */}
            <a
              href={OFFICIAL_CONTACT_LINKS.GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View The PrintHub Atelier on Google Maps"
              className="bracket-social-pill px-3.5 py-2.5 rounded-xl border border-[#B8A98F]/40 bg-[#E5DAC9]/5 text-xs font-bold text-[#E5DAC9] hover:text-[#E5C690] hover:border-[#E5C690]/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <IconGoogleMaps className="w-4 h-4 text-[#E5C690] shrink-0" size={16} />
              <span>Google Maps</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Sub-bar */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 mt-4 border-t border-[#B8A98F]/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E5DAC9]/70">
        <div>
          © {new Date().getFullYear()} {storeSettings?.storeName || 'The PrintHub'}. All rights reserved. Built for Indian creators & enterprises.
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigateTo('about-us')} className="hover:text-[#E5C690]">
            About
          </button>
          <span className="text-[#B8A98F]">•</span>
          <button onClick={() => navigateTo('help')} className="hover:text-[#E5C690]">
            Help & FAQs
          </button>
          <span className="text-[#B8A98F]">•</span>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E5C690] font-semibold"
          >
            WhatsApp Support
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
