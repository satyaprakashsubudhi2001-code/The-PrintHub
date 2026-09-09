import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getWhatsAppChatUrl } from '../../constants/config';
import { COLOR_PALETTE, PRINTING_METHODS } from '../../constants/products';
import { WhatsAppIcon } from '../UI/WhatsAppIcon';

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
        <div className="hidden sm:flex flex-col p-2.5 rounded-2xl bg-[#183630] border border-[#B8A98F] text-[#E5DAC9] text-xs shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-2 max-w-[200px]">
          <div className="flex items-center gap-1.5 text-[#E5C690] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#E5C690]" />
            <span>Need Design Help?</span>
          </div>
          <p className="text-[11px] text-[#E5DAC9]/80 mt-1 leading-snug">
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
        className="group relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] border border-[#B8A98F] flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto cursor-pointer"
        title="Chat on WhatsApp"
      >
        <WhatsAppIcon size={28} className="w-7 h-7 shrink-0 transition-transform group-hover:scale-110" />
      </button>
    </div>
  );
}
