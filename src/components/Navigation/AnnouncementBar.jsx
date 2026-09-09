import React, { useState, useMemo } from 'react';
import { Phone, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
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
 * AnnouncementBar Component — Dynamic Infinite Marquee Top Bar for The PrintHub
 * Inspired by luxury atelier digital tickers.
 *
 * Strict 4-Color Luxury System:
 * - #183630 (Primary Dark Green background & badge bg)
 * - #E5DAC9 (Primary Beige for announcement text)
 * - #E5C690 (Primary Soft Gold for key highlights & phone)
 * - #B8A98F (Highlight Taupe for borders & close icon)
 *
 * Height: 52–58px on desktop, compact on mobile.
 * Continuous right-to-left seamless infinite loop.
 */

const ANNOUNCEMENTS = [
  {
    id: 'proofs',
    route: 'design-by-customer',
    render: () => (
      <span>
        <strong className="text-[#E5C690] font-black uppercase tracking-wide">Free</strong> Digital Proofs on All{' '}
        <strong className="text-[#E5C690] font-bold">Custom</strong> Orders
      </span>
    ),
  },
  {
    id: 'express',
    route: 'help',
    render: () => (
      <span>
        <strong className="text-[#E5C690] font-black uppercase tracking-wide">Express</strong>{' '}
        <strong className="text-[#E5C690] font-black tracking-wide">PAN-India</strong> Dispatch Across 28+ States
      </span>
    ),
  },
  {
    id: 'custom-easy',
    route: 'products',
    render: () => (
      <span>
        <strong className="text-[#E5C690] font-black uppercase tracking-wide">Custom</strong> Printing Made Easy with 3D Studio
      </span>
    ),
  },
  {
    id: 'bulk',
    route: 'bulk-orders',
    render: () => (
      <span>
        <strong className="text-[#E5C690] font-black uppercase tracking-wide">Bulk</strong> Orders Available • Tiered Wholesale Discounts
      </span>
    ),
  },
  {
    id: 'quality',
    route: 'about-us',
    render: () => (
      <span>
        <strong className="text-[#E5C690] font-black uppercase tracking-wide">Premium</strong> Quality 300 DPI Thermal DTF & Zero MOQ
      </span>
    ),
  },
  {
    id: 'ideas',
    route: 'products',
    render: () => (
      <span>
        <strong className="text-[#E5C690] font-black uppercase tracking-wide">Print</strong> Your Ideas.{' '}
        <strong className="text-[#E5C690] font-bold">Make Them Yours.</strong>
      </span>
    ),
  },
];

export function AnnouncementBar() {
  const { navigateTo, storeSettings, announcements: storeAnnouncements = [], contactSettings = {} } = useStore();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const phone = storeSettings?.phone || contactSettings?.whatsapp || '+91 79928 01158';

  // Dynamic Announcements from Admin or fallback to initial defaults
  const activeAnnouncements = useMemo(() => {
    const fromStore = storeAnnouncements.filter((a) => a.active !== false);
    if (fromStore.length > 0) {
      return fromStore.map((item) => ({
        id: item.id,
        route: item.route || 'design-by-customer',
        render: () => (
          <span>
            {item.highlight && (
              <strong className="text-[#E5C690] font-black uppercase tracking-wide mr-1">
                {item.highlight}
              </strong>
            )}
            {item.text}
          </span>
        ),
      }));
    }
    return ANNOUNCEMENTS;
  }, [storeAnnouncements]);

  // Helper to safely extract string values from contactSettings (handling strings, objects, numbers)
  const resolveContactString = (item, fallback = '') => {
    if (!item) return fallback;
    if (typeof item === 'string') return item;
    if (typeof item === 'object') return item.value || item.url || fallback;
    return String(item);
  };

  const rawWhatsApp = resolveContactString(contactSettings?.whatsapp, '+91 79928 01158');
  const cleanDigits = String(rawWhatsApp).replace(/\D/g, '');
  const whatsappUrl = cleanDigits
    ? `https://wa.me/${cleanDigits}`
    : OFFICIAL_CONTACT_LINKS.WHATSAPP_URL;

  const instagramUrl = resolveContactString(contactSettings?.instagram, OFFICIAL_CONTACT_LINKS.INSTAGRAM_URL);
  const facebookUrl = resolveContactString(contactSettings?.facebook, OFFICIAL_CONTACT_LINKS.FACEBOOK_URL);
  const catalogUrl = resolveContactString(contactSettings?.whatsappCatalog, OFFICIAL_CONTACT_LINKS.WHATSAPP_CATALOG_URL);
  const gmailRaw = resolveContactString(contactSettings?.gmail, OFFICIAL_CONTACT_LINKS.EMAIL_ADDRESS);
  const gmailUrl = String(gmailRaw).startsWith('mailto:')
    ? gmailRaw
    : `mailto:${gmailRaw}?subject=${encodeURIComponent('Inquiry: Custom Printing - The PrintHub')}`;
  const mapsUrl = resolveContactString(contactSettings?.googleMaps, OFFICIAL_CONTACT_LINKS.GOOGLE_MAPS_URL);

  const handleMessageClick = (route) => {
    if (route) {
      navigateTo(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      role="region"
      aria-label="Announcements and updates"
      className="relative w-full h-[50px] sm:h-[54px] lg:h-[56px] bg-[#183630] border-b border-[#B8A98F]/30 overflow-hidden flex items-center justify-between text-[#E5DAC9] select-none z-50 transition-all duration-300"
    >
      {/* =====================================================================
          1. LEFT STATIC BADGE (● PRINT EXPERTS)
          ===================================================================== */}
      <div className="relative z-20 flex items-center pl-3 sm:pl-5 lg:pl-8 pr-2 sm:pr-4 shrink-0 bg-[#183630]">
        <div className="inline-flex items-center gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#183630] text-[#E5C690] border border-[#B8A98F] text-[10px] sm:text-xs font-bold tracking-wider shadow-sm transition-transform hover:scale-102">
          <span className="w-2 h-2 rounded-full bg-[#E5C690] animate-pulse shrink-0" />
          <span className="whitespace-nowrap uppercase tracking-widest font-black text-[10px] sm:text-[11px]">
            PRINT EXPERTS
          </span>
        </div>
      </div>

      {/* =====================================================================
          2. MIDDLE: INFINITE CONTINUOUS HORIZONTAL MARQUEE
          ===================================================================== */}
      <div className="relative flex-1 h-full overflow-hidden flex items-center mx-1 sm:mx-3 group">
        {/* Soft Left Mask Fade (#183630) */}
        <div className="absolute left-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-r from-[#183630] via-[#183630]/90 to-transparent z-10 pointer-events-none" />

        {/* Dual Sequence Infinite Marquee Track (Right -> Left seamless loop) */}
        <div className="animate-marquee-track flex items-center cursor-pointer">
          {/* Copy 1: Primary Sequence */}
          <div className="flex items-center shrink-0">
            {activeAnnouncements.map((item) => (
              <div key={`track-1-${item.id}`} className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleMessageClick(item.route)}
                  className="inline-flex items-center text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap text-[#E5DAC9] hover:text-[#E5C690] px-2.5 sm:px-3.5 py-1 rounded-lg transition-all duration-200 hover:bg-[#E5DAC9]/10 hover:shadow-[0_0_12px_rgba(184,169,143,0.35)] cursor-pointer"
                  title="Click to view details"
                >
                  {item.render()}
                </button>
                {/* Decorative Diamond Divider */}
                <span className="mx-3 sm:mx-5 text-[#E5C690] text-[10px] sm:text-xs select-none opacity-80 shrink-0">
                  ◆
                </span>
              </div>
            ))}
          </div>

          {/* Copy 2: Duplicate Sequence for mathematically seamless infinite ticker */}
          <div className="flex items-center shrink-0" aria-hidden="true">
            {activeAnnouncements.map((item) => (
              <div key={`track-2-${item.id}`} className="flex items-center shrink-0">
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => handleMessageClick(item.route)}
                  className="inline-flex items-center text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap text-[#E5DAC9] hover:text-[#E5C690] px-2.5 sm:px-3.5 py-1 rounded-lg transition-all duration-200 hover:bg-[#E5DAC9]/10 hover:shadow-[0_0_12px_rgba(184,169,143,0.35)] cursor-pointer"
                  title="Click to view details"
                >
                  {item.render()}
                </button>
                {/* Decorative Diamond Divider */}
                <span className="mx-3 sm:mx-5 text-[#E5C690] text-[10px] sm:text-xs select-none opacity-80 shrink-0">
                  ◆
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Soft Right Mask Fade (#183630) */}
        <div className="absolute right-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-l from-[#183630] via-[#183630]/90 to-transparent z-10 pointer-events-none" />
      </div>

      {/* =====================================================================
          3. RIGHT STATIC: SECONDARY "CONNECT" AREA (6 Options) + CLOSE
          ===================================================================== */}
      <div className="relative z-20 flex items-center gap-1 sm:gap-1.5 lg:gap-2 pr-2.5 sm:pr-4 lg:pr-6 pl-2 sm:pl-3 shrink-0 bg-[#183630] border-l border-[#B8A98F]/20">
        {/* Subtle "CONNECT" Hierarchy Label */}
        <div className="hidden xl:flex items-center gap-1 text-[9px] font-mono tracking-widest text-[#B8A98F]/70 uppercase select-none mr-0.5">
          <span>CONNECT</span>
          <span className="text-[#B8A98F]/40">:</span>
        </div>

        {/* 6 Clickable Social & Contact Links (Secondary Emphasis) */}
        <div className="flex items-center gap-1">
          {/* 1. WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact The PrintHub on WhatsApp"
            title={`Chat on WhatsApp (${rawWhatsApp})`}
            className="bracket-social-pill p-1 rounded text-xs text-[#E5DAC9]/70 hover:text-[#E5C690] transition-colors flex items-center gap-1 cursor-pointer opacity-80 hover:opacity-100"
          >
            <IconWhatsApp className="w-3.5 h-3.5 text-[#B8A98F] group-hover:text-[#E5C690] shrink-0" size={13} />
            <span className="hidden 2xl:inline text-[10px] font-medium">WhatsApp</span>
          </a>

          <span className="hidden 2xl:inline text-[#B8A98F]/30 select-none text-[9px]">•</span>

          {/* 2. Instagram */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow The PrintHub on Instagram"
            title="The PrintHub Instagram Profile"
            className="bracket-social-pill p-1 rounded text-xs text-[#E5DAC9]/70 hover:text-[#E5C690] transition-colors flex items-center gap-1 cursor-pointer opacity-80 hover:opacity-100"
          >
            <IconInstagram className="w-3.5 h-3.5 text-[#B8A98F] group-hover:text-[#E5C690] shrink-0" size={13} />
            <span className="hidden 2xl:inline text-[10px] font-medium">Instagram</span>
          </a>

          <span className="hidden 2xl:inline text-[#B8A98F]/30 select-none text-[9px]">•</span>

          {/* 3. Facebook */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Connect with The PrintHub on Facebook"
            title="The PrintHub Facebook Page"
            className="bracket-social-pill p-1 rounded text-xs text-[#E5DAC9]/70 hover:text-[#E5C690] transition-colors flex items-center gap-1 cursor-pointer opacity-80 hover:opacity-100"
          >
            <IconFacebook className="w-3.5 h-3.5 text-[#B8A98F] group-hover:text-[#E5C690] shrink-0" size={13} />
            <span className="hidden 2xl:inline text-[10px] font-medium">Facebook</span>
          </a>

          <span className="hidden 2xl:inline text-[#B8A98F]/30 select-none text-[9px]">•</span>

          {/* 4. WhatsApp Catalog */}
          <a
            href={catalogUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Browse The PrintHub WhatsApp Business Catalog"
            title="Browse WhatsApp Business Catalog"
            className="bracket-social-pill p-1 rounded text-xs text-[#E5DAC9]/70 hover:text-[#E5C690] transition-colors flex items-center gap-1 cursor-pointer opacity-80 hover:opacity-100"
          >
            <IconWhatsAppCatalog className="w-3.5 h-3.5 text-[#B8A98F] group-hover:text-[#E5C690] shrink-0" size={13} />
            <span className="hidden 2xl:inline text-[10px] font-medium">Catalog</span>
          </a>

          <span className="hidden 2xl:inline text-[#B8A98F]/30 select-none text-[9px]">•</span>

          {/* 5. Gmail */}
          <a
            href={gmailUrl}
            aria-label="Email The PrintHub via Gmail"
            title={`Email: ${contactSettings.gmail || OFFICIAL_CONTACT_LINKS.EMAIL_ADDRESS}`}
            className="bracket-social-pill p-1 rounded text-xs text-[#E5DAC9]/70 hover:text-[#E5C690] transition-colors flex items-center gap-1 cursor-pointer opacity-80 hover:opacity-100"
          >
            <IconGmail className="w-3.5 h-3.5 text-[#B8A98F] group-hover:text-[#E5C690] shrink-0" size={13} />
            <span className="hidden 2xl:inline text-[10px] font-medium">Gmail</span>
          </a>

          <span className="hidden 2xl:inline text-[#B8A98F]/30 select-none text-[9px]">•</span>

          {/* 6. Google Maps */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View The PrintHub Atelier on Google Maps"
            title="The PrintHub Atelier Google Maps Location"
            className="bracket-social-pill p-1 rounded text-xs text-[#E5DAC9]/70 hover:text-[#E5C690] transition-colors flex items-center gap-1 cursor-pointer opacity-80 hover:opacity-100"
          >
            <IconGoogleMaps className="w-3.5 h-3.5 text-[#B8A98F] group-hover:text-[#E5C690] shrink-0" size={13} />
            <span className="hidden 2xl:inline text-[10px] font-medium">Maps</span>
          </a>
        </div>

        <span className="text-[#B8A98F]/25 select-none">•</span>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="inline-flex items-center justify-center text-xs font-bold text-[#B8A98F]/80 hover:text-[#E5DAC9] transition-colors cursor-pointer p-1 rounded hover:bg-[#E5DAC9]/10 shrink-0"
          title="Dismiss Top Announcement Bar"
          aria-label="Dismiss Top Announcement Bar"
        >
          <X className="w-3.5 h-3.5 text-[#B8A98F]" />
        </button>
      </div>
    </div>
  );
}

export default AnnouncementBar;
