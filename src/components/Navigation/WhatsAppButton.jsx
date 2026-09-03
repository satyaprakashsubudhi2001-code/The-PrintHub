import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * Premium Floating WhatsApp Support Widget
 * Supports desktop pill ("Chat with us") and mobile floating circular button.
 * Configured dynamically from Store Settings or fallback support number.
 */
export function WhatsAppButton() {
  const { storeSettings } = useStore();
  const rawNumber = storeSettings?.whatsapp || storeSettings?.whatsappNumber || storeSettings?.supportPhone || '+917992801158';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

  const defaultMessage = encodeURIComponent(
    `Hi The PrintHub Support! I'm on your website and would like help with a custom merchandise order.`
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${defaultMessage}`;

  return (
    <aside aria-label="WhatsApp live chat support" className="fixed bottom-6 right-6 z-40 select-none group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with The PrintHub on WhatsApp"
        className="flex items-center gap-2.5 px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_8px_25px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 border border-emerald-300/40"
      >
        {/* WhatsApp Icon with Online Pulse */}
        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-slate-950 fill-slate-950" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-200 border-2 border-emerald-600 animate-pulse" />
        </div>

        {/* Text Label on Desktop */}
        <span className="hidden sm:inline font-black tracking-wide font-display text-slate-950">
          Chat with us
        </span>
      </a>
    </aside>
  );
}

export default WhatsAppButton;
