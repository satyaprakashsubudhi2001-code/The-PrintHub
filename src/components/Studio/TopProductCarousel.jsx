import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function TopProductCarousel() {
  const { products, customizerProduct, selectProduct } = useStore();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#183630] border-b border-[#B8A98F]/40 px-3 sm:px-5 py-2 relative select-none shrink-0 z-20 backdrop-blur-md text-[#E5DAC9]">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3">
        {/* Left Studio Label */}
        <div className="hidden lg:flex items-center gap-2 shrink-0 pr-3 border-r border-[#B8A98F]/30">
          <span className="w-2 h-2 rounded-full bg-[#E5C690] animate-pulse" />
          <span className="text-[11px] font-black tracking-widest text-[#E5DAC9] uppercase font-mono whitespace-nowrap">
            Select Product
          </span>
        </div>

        {/* Carousel Container with Arrow Navigation */}
        <div className="relative flex-1 flex items-center min-w-0">
          {/* Scroll Left Button */}
          <button
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute left-0 z-10 w-7 h-7 -ml-2 rounded-full bg-[#183630] border border-[#B8A98F] text-[#E5DAC9] hover:bg-[#B8A98F]/20 items-center justify-center shadow-lg transition-all cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Cards Track */}
          <div
            ref={scrollRef}
            className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 px-1 sm:px-6 w-full scroll-smooth"
          >
            {products.map((p) => {
              const isSelected = customizerProduct.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => selectProduct(p)}
                  className={`group relative flex items-center gap-2.5 px-3 py-1.5 rounded-2xl transition-all shrink-0 border whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#E5DAC9] text-[#183630] border-[#E5C690] shadow-md'
                      : 'bg-[#183630] text-[#E5DAC9] border-[#B8A98F]/40 hover:border-[#B8A98F]'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-[#183630]/20 border border-[#B8A98F]/40 shrink-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#183630]/60 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-[#E5C690] stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="text-left flex flex-col min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-bold whitespace-nowrap ${
                          isSelected ? 'text-[#183630] font-black' : 'text-[#E5DAC9]'
                        }`}
                      >
                        {p.name.split('(')[0].trim()}
                      </span>
                      {p.badge && (
                        <span className={`hidden xl:inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono border ${
                          isSelected ? 'bg-[#183630] text-[#E5DAC9] border-[#183630]' : 'bg-[#E5C690]/20 text-[#E5C690] border-[#E5C690]/40'
                        }`}>
                          {p.badge.split(' ')[0]}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-[#183630]/80' : 'text-[#E5DAC9]/70'}`}>
                      From <span className={`font-bold ${isSelected ? 'text-[#183630]' : 'text-[#E5C690]'}`}>₹{p.basePrice}</span>
                    </span>
                  </div>

                  {/* Active Indicator Bar */}
                  {isSelected && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-[#183630]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute right-0 z-10 w-7 h-7 -ml-2 rounded-full bg-[#183630] border border-[#B8A98F] text-[#E5DAC9] hover:bg-[#B8A98F]/20 items-center justify-center shadow-lg transition-all cursor-pointer"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
