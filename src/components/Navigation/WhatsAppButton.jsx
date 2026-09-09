import React from 'react';
import { useStore } from '../../context/StoreContext';
import { WhatsAppIcon } from '../UI/WhatsAppIcon';

/**
 * Premium Floating WhatsApp Support Widget
 * Features the official original-color WhatsApp icon (#25D366).
 */
export function WhatsAppButton() {
  const { storeSettings, isShopMenuOpen } = useStore();
  const rawNumber = storeSettings?.whatsapp || storeSettings?.whatsappNumber || storeSettings?.supportPhone || '+917992801158';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

  const defaultMessage = encodeURIComponent(
    `Hi The PrintHub Support! I'm on your website and would like help with a custom merchandise order.`
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${defaultMessage}`;

  return (
    <aside
      aria-label="WhatsApp live chat support"
      className={`fixed right-3 sm:right-6 z-40 select-none group transition-all duration-300 ${
        isShopMenuOpen
          ? 'bottom-[calc(3.75rem+env(safe-area-inset-bottom,0px))] sm:bottom-3 opacity-60 scale-90 hover:opacity-100 hover:scale-95'
          : 'bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 opacity-100 scale-100'
      }`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with The PrintHub on WhatsApp"
        className="flex items-center gap-2.5 px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-full bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] hover:text-[#E5C690] font-bold text-xs sm:text-sm shadow-[0_8px_25px_rgba(24,54,48,0.35)] hover:shadow-[0_0_20px_rgba(37,211,102,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 border border-[#B8A98F]"
      >
        {/* Official WhatsApp Brand Icon */}
        <div className="flex items-center justify-center shrink-0">
          <WhatsAppIcon className="w-6 h-6 drop-shadow-sm transition-transform duration-300 group-hover:scale-110" size={24} />
        </div>

        {/* Text Label on Desktop */}
        <span className="hidden sm:inline font-bold tracking-wide text-[#E5DAC9]">
          Chat on WhatsApp
        </span>
      </a>
    </aside>
  );
}

export default WhatsAppButton;
