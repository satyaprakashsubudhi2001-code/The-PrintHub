import React from 'react';
import {
  Sparkles,
  Star,
  Eye,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * ProductCard Component — The PrintHub Luxury Product Card
 * Strict 4-Color Palette:
 * - #183630 (Primary Dark Green)
 * - #E5DAC9 (Primary Beige)
 * - #E5C690 (Primary Soft Gold)
 * - #B8A98F (Highlight Taupe)
 *
 * Strict Controlled Image Rule:
 * - aspect-ratio: 1 / 1
 * - display: flex; align-items: center; justify-content: center;
 * - object-fit: contain; width: 100%; height: 100%;
 */
export function ProductCard({ product }) {
  const {
    selectProduct,
    navigateTo,
    toggleWishlist,
    isWishlisted,
    setQuickViewProduct,
  } = useStore();

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);

  const isCustomizable =
    product.isCustomizable !== false &&
    (Boolean(product.modelPath) || Boolean(product.printAreas));

  const handleCardClick = () => {
    if (isCustomizable) {
      selectProduct(product);
      navigateTo('design-by-customer');
    } else {
      setQuickViewProduct(product);
    }
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (isCustomizable) {
      selectProduct(product);
      navigateTo('design-by-customer');
    } else {
      setQuickViewProduct(product);
    }
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const displayPrice = product.price || product.basePrice || 399;
  const comparePrice = product.compareAtPrice;
  const rating = product.rating || 4.8;
  const reviews = product.reviewsCount || product.reviewCount || 120;
  const imageUrl =
    product.image ||
    (Array.isArray(product.images) && product.images[0]) ||
    product.previewImage ||
    product.thumbnail ||
    '';

  return (
    <div
      onClick={handleCardClick}
      className="group relative rounded-2xl border border-[#B8A98F] bg-[#E5DAC9] hover:border-[#183630] hover:shadow-[0_12px_28px_rgba(24,54,48,0.14)] transition-all duration-200 flex flex-col justify-between overflow-hidden select-none cursor-pointer hover:-translate-y-1"
    >
      {/* 
        =======================================================================
        CONTROLLED PRODUCT IMAGE CONTAINER (Mandatory 1:1 Aspect Ratio + Contain)
        ======================================================================= 
      */}
      <div
        className="relative aspect-square w-full flex items-center justify-center p-4 sm:p-5 overflow-hidden transition-colors bg-[#E5DAC9]/60 border-b border-[#B8A98F]/30"
        style={{
          aspectRatio: '1 / 1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          style={{
            objectFit: 'contain',
            width: '100%',
            height: '100%',
          }}
          loading="lazy"
        />

        {/* Top-Left Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-xs bg-[#183630] text-[#E5C690] border border-[#B8A98F]/40">
              {product.badge}
            </span>
          )}
          {isCustomizable && !product.badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-xs bg-[#183630] text-[#E5DAC9] border border-[#B8A98F]/40">
              3D Custom
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full border backdrop-blur-md transition-all z-10 hover:scale-110 active:scale-95 ${
            wishlisted
              ? 'bg-[#E5C690] border-[#183630] text-[#183630] shadow-sm'
              : 'bg-[#E5DAC9]/80 border-[#B8A98F] text-[#183630]/70 hover:text-[#183630] hover:border-[#183630]'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-[#183630]' : ''}`} />
        </button>

        {/* Quick Hover Indicator (Desktop) */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 hidden sm:block">
          <div className="w-full py-2 rounded-xl text-center text-xs font-bold shadow-md flex items-center justify-center gap-1.5 backdrop-blur-md bg-[#183630] text-[#E5DAC9] border border-[#B8A98F]/40">
            <Eye className="w-3.5 h-3.5 text-[#E5C690]" />
            <span>{isCustomizable ? 'Open 3D Studio' : 'Quick View & Order'}</span>
          </div>
        </div>
      </div>

      {/* 
        =======================================================================
        PRODUCT DETAILS & SPECIFICATIONS
        ======================================================================= 
      */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-[#E5DAC9]">
        <div className="space-y-1.5">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-[11px] text-[#183630]/75">
              {product.category || 'Apparel'}
            </span>

            <div className="flex items-center gap-1 text-[11px] font-medium text-[#183630]/75">
              <Star className="w-3 h-3 text-[#E5C690] fill-[#E5C690]" />
              <span className="font-bold text-[#183630]">{rating}</span>
              <span>({reviews})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-1 transition-colors text-[#183630]">
            {product.name}
          </h3>

          {/* Subtitle / Description */}
          <p className="text-xs text-[#183630]/70 line-clamp-1 leading-relaxed">
            {product.subtitle ||
              product.description ||
              'High-definition print on premium grade fabric'}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-[#B8A98F]/30 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-[#183630]/60">
              {isCustomizable ? 'Starting At' : 'Price'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-[#183630]">
                ₹{displayPrice}
              </span>
              {comparePrice && comparePrice > displayPrice && (
                <span className="text-xs text-[#183630]/50 line-through">
                  ₹{comparePrice}
                </span>
              )}
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            type="button"
            onClick={handleActionClick}
            className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0 hover:scale-102 active:scale-98 bg-[#183630] text-[#E5DAC9] hover:text-[#E5C690] border border-[#B8A98F]/40 cursor-pointer"
          >
            {isCustomizable ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#E5C690]" />
                <span>Customize</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-3.5 h-3.5 text-[#E5C690]" />
                <span>Order Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
