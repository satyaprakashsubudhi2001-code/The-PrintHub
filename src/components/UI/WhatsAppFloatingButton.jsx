import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

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
      className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-30 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all group"
      title="Chat with Customer Support on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 fill-white text-emerald-500" />
      <span className="hidden sm:inline font-sans">Chat with Us</span>
    </a>
  );
}
