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
    <div className="w-full bg-[#2C0E63] border-b border-white/10 px-3 sm:px-5 py-2 relative select-none shrink-0 z-20 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3">
        {/* Left Studio Label */}
        <div className="hidden lg:flex items-center gap-2 shrink-0 pr-3 border-r border-white/15">
          <span className="w-2 h-2 rounded-full bg-[#F2CB30] animate-pulse" />
          <span className="text-[11px] font-black tracking-widest text-slate-200 uppercase font-mono whitespace-nowrap">
            Select Product
          </span>
        </div>

        {/* Carousel Container with Arrow Navigation */}
        <div className="relative flex-1 flex items-center min-w-0">
          {/* Scroll Left Button */}
          <button
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute left-0 z-10 w-7 h-7 -ml-2 rounded-full bg-[#12002E] border border-white/20 text-slate-200 hover:text-white items-center justify-center shadow-lg transition-all hover:scale-110"
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
                      ? 'bg-[#12002E] border-[#F2CB30] shadow-lg shadow-[#F2CB30]/20 ring-1 ring-[#F2CB30]'
                      : 'bg-[#2C0E63]/60 border-white/15 hover:bg-[#12002E]/60 text-slate-200'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-[#12002E] border border-white/15 shrink-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#DA0090]/50 flex items-center justify-center">
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
                        <span className="hidden xl:inline-block px-1.5 py-0.5 rounded text-[8px] font-black bg-[#DA0090]/25 text-[#DA0090] border border-[#DA0090]/40 uppercase font-mono">
                          {p.badge.split(' ')[0]}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-300 font-mono">
                      From <span className="text-[#F2CB30] font-bold">₹{p.basePrice}</span>
                    </span>
                  </div>

                  {/* Active Indicator Bar */}
                  {isSelected && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-[#F2CB30]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute right-0 z-10 w-7 h-7 -ml-2 rounded-full bg-[#12002E] border border-white/20 text-slate-200 hover:text-white items-center justify-center shadow-lg transition-all hover:scale-110"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
