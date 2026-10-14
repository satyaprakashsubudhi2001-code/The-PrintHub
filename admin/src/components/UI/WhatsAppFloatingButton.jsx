import React from 'react';
import { useStore } from '../../context/StoreContext';
import { WhatsAppIcon } from './WhatsAppIcon';

export function WhatsAppFloatingButton() {
  const { storeSettings, currentPage } = useStore();

  const phone = (storeSettings?.whatsapp || '+91 98765 43210').replace(/\D/g, '');
  const message = encodeURIComponent(
    `Hi The PrintHub Support! I'm browsing your online store (page: ${currentPage}) and need assistance with custom printing.`
  );
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-30 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] border border-[#B8A98F] font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all group cursor-pointer"
      title="Chat with Customer Support on WhatsApp"
    >
      <WhatsAppIcon size={20} className="w-5 h-5 shrink-0" />
      <span className="hidden sm:inline font-sans text-[#E5DAC9]">Chat with Us</span>
    </a>
  );
}
