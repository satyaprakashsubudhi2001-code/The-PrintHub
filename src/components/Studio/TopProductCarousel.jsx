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
    <div className="w-full bg-[#0B0B18] border-b border-white/[0.08] px-3 sm:px-5 py-2 relative select-none shrink-0 z-20 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3">
        {/* Left Studio Label */}
        <div className="hidden lg:flex items-center gap-2 shrink-0 pr-3 border-r border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
          <span className="text-[11px] font-black tracking-widest text-slate-300 uppercase font-mono whitespace-nowrap">
            Select Product
          </span>
        </div>

        {/* Carousel Container with Arrow Navigation */}
        <div className="relative flex-1 flex items-center min-w-0">
          {/* Scroll Left Button */}
          <button
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute left-0 z-10 w-7 h-7 -ml-2 rounded-full bg-[#101022] border border-white/20 text-slate-300 hover:text-white items-center justify-center shadow-lg transition-all hover:scale-110"
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
                  className={`group relative flex items-center gap-2.5 px-3 py-1.5 rounded-2xl transition-all shrink-0 border whitespace-nowrap ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#6C4DF6]/30 to-[#06B6D4]/30 border-[#06B6D4] shadow-lg shadow-[#6C4DF6]/20 ring-1 ring-[#06B6D4]'
                      : 'bg-[#101022] border-white/[0.08] hover:bg-[#16162E] hover:border-white/20 text-slate-300'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-[#080812] border border-white/10 shrink-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#6C4DF6]/40 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="text-left flex flex-col min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-bold whitespace-nowrap ${
                          isSelected ? 'text-white font-black' : 'text-slate-200'
                        }`}
                      >
                        {p.name.split('(')[0].trim()}
                      </span>
                      {p.badge && (
                        <span className="hidden xl:inline-block px-1.5 py-0.5 rounded text-[8px] font-black bg-[#6C4DF6]/20 text-[#06B6D4] border border-[#06B6D4]/30 uppercase font-mono">
                          {p.badge.split(' ')[0]}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      From <span className="text-[#06B6D4] font-bold">₹{p.basePrice}</span>
                    </span>
                  </div>

                  {/* Active Indicator Bar */}
                  {isSelected && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-[#06B6D4]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute right-0 z-10 w-7 h-7 -mr-2 rounded-full bg-[#101022] border border-white/20 text-slate-300 hover:text-white items-center justify-center shadow-lg transition-all hover:scale-110"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
