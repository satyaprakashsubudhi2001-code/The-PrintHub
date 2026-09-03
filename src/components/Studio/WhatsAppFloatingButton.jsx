import React, { useState } from 'react';
import { MessageCircle, Sparkles, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getWhatsAppChatUrl } from '../../constants/config';
import { COLOR_PALETTE, PRINTING_METHODS } from '../../constants/products';

export function WhatsAppFloatingButton() {
  const {
    customizerProduct,
    customizerColor,
    selectedSize,
    quantity,
    printingMethod,
    calculatePricing,
  } = useStore();

  const [showTooltip, setShowTooltip] = useState(false);
  const pricing = calculatePricing();

  const colorObj = COLOR_PALETTE.find((c) => c.hex.toLowerCase() === customizerColor.toLowerCase()) || { name: 'Custom Shade' };
  const methodObj = PRINTING_METHODS.find((m) => m.id === printingMethod) || PRINTING_METHODS[0];

  const handleOpenWhatsApp = () => {
    const url = getWhatsAppChatUrl({
      productName: customizerProduct.name,
      variant: customizerProduct.variant,
      colorName: colorObj.name,
      size: selectedSize,
      quantity,
      printingMethodName: methodObj.name,
      totalPrice: pricing.totalPrice,
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-20 md:bottom-24 right-4 sm:right-6 z-40 flex items-center gap-2.5 select-none">
      {/* Interactive Tooltip Card on Hover */}
      {showTooltip && (
        <div className="hidden sm:flex flex-col p-2.5 rounded-2xl bg-slate-900/95 border border-emerald-500/40 text-slate-200 text-xs shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-2 max-w-[200px]">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Need Design Help?</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
            Chat directly with The PrintHub studio experts on WhatsApp!
          </p>
        </div>
      )}

      {/* Floating WhatsApp Action Button */}
      <button
        onClick={handleOpenWhatsApp}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Chat with The PrintHub on WhatsApp"
        className="group relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_0_25px_rgba(37,211,102,0.45)] hover:shadow-[0_0_35px_rgba(37,211,102,0.65)] hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto"
        title="Chat on WhatsApp"
      >
        {/* Soft pulsing ripple */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 fill-current transition-transform group-hover:rotate-12"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.969.54 1.777.82 2.796.82 3.183 0 5.769-2.586 5.77-5.767 0-3.182-2.587-5.768-5.77-5.768zm0 10.455c-.886 0-1.636-.25-2.393-.687l-.171-.099-1.579.414.421-1.54-.112-.178c-.48-.763-.733-1.517-.732-2.599.001-2.586 2.104-4.688 4.69-4.688 2.587 0 4.69 2.102 4.69 4.688 0 2.587-2.103 4.689-4.69 4.689zm3.178-3.487c-.174-.087-1.028-.507-1.187-.565-.159-.058-.275-.087-.391.087-.116.174-.449.565-.55.681-.101.116-.203.13-.377.043-.174-.087-.735-.271-1.4-.864-.517-.461-.867-1.03-.968-1.204-.101-.174-.011-.268.076-.355.078-.078.174-.203.261-.304.087-.101.116-.174.174-.29.058-.116.029-.217-.014-.304-.043-.087-.391-.942-.536-1.29-.141-.339-.285-.293-.391-.299l-.333-.006c-.116 0-.304.043-.464.217-.159.174-.608.594-.608 1.45s.623 1.681.71 1.797c.087.116 1.226 1.872 2.97 2.625.415.179.739.286.992.366.417.132.796.114 1.096.069.335-.05 1.028-.42 1.173-.826.145-.406.145-.754.101-.826-.043-.072-.159-.116-.333-.203z" />
        </svg>
      </button>
    </div>
  );
}
