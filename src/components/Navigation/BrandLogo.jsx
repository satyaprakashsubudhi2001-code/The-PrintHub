import React from 'react';
import { useStore } from '../../context/StoreContext';

/**
 * BrandLogo — Unified Commercial Brand Lockup for The PrintHub
 * Adheres strictly to the 4-color palette: #183630, #E5DAC9, #E5C690, #B8A98F
 */
export function BrandLogo({
  variant = 'dark', // 'dark' (on #183630) | 'light' (on #E5DAC9)
  size = 'md', // 'sm' | 'md' | 'lg'
  badge = null,
  clickable = true,
  onClick,
  className = '',
}) {
  let navigateTo = null;
  try {
    const store = useStore();
    navigateTo = store?.navigateTo;
  } catch (e) {
    // Fallback if rendered outside StoreContext
  }

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else if (clickable && navigateTo) {
      navigateTo('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isLight = variant === 'light';

  const sizeConfig = {
    sm: {
      container: 'w-9 h-9 rounded-xl p-1',
      wordmarkH: 'h-7 sm:h-8',
      title: 'text-base font-bold tracking-[1.5px]',
      tagline: 'text-[8.5px] tracking-[1.5px]',
    },
    md: {
      container: 'w-10 h-10 sm:w-11 sm:h-11 rounded-[13px] p-1.5',
      wordmarkH: 'h-8 sm:h-9',
      title: 'text-lg sm:text-xl font-bold tracking-[2px]',
      tagline: 'text-[9px] sm:text-[9.5px] tracking-[2px]',
    },
    lg: {
      container: 'w-11 h-11 sm:w-13 sm:h-13 rounded-[14px] p-1.5 sm:p-2',
      wordmarkH: 'h-9 sm:h-10 lg:h-11',
      title: 'text-xl sm:text-2xl font-bold tracking-[2.5px]',
      tagline: 'text-[10px] sm:text-[11px] tracking-[2px]',
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon Shield Container - Seamless floating icon without boxy patch */}
      <div
        className={`${currentSize.container} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105`}
      >
        <img
          src="/logo-mark-symbol.png"
          alt="The PrintHub Symbol"
          className="w-full h-full object-contain select-none filter drop-shadow-[0_2px_10px_rgba(229,198,144,0.35)]"
          loading="eager"
        />
      </div>

      {/* Brand Wordmark (Illuminated in #E5DAC9 Beige & #E5C690 Gold) */}
      <div className="flex flex-col justify-center text-left">
        <div className="flex items-center gap-2">
          <img
            src="/brand-wordmark.png"
            alt="The PrintHub - We don't print, we create!"
            className={`${currentSize.wordmarkH} w-auto object-contain select-none filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]`}
          />
          {badge && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#E5C690] text-[#183630] border border-[#B8A98F] uppercase tracking-wider whitespace-nowrap">
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (clickable) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="group text-left focus:outline-none cursor-pointer py-0.5 transition-opacity duration-200 hover:opacity-95"
        title="The PrintHub - Print Your Ideas. Make Them Yours."
        aria-label="The PrintHub Home"
      >
        {content}
      </button>
    );
  }

  return content;
}

export default BrandLogo;

