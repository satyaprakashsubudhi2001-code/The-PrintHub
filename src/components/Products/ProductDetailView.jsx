import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  MessageCircle,
  Package,
  Mail,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { WhatsAppIcon } from '../UI/WhatsAppIcon';

/**
 * ProductDetailView — The PrintHub Luxury Product Detail & Direct Ordering View
 * Strictly 4-Color Luxury System:
 * - #183630 (Primary Dark Green)
 * - #E5DAC9 (Primary Beige)
 * - #E5C690 (Primary Soft Gold)
 * - #B8A98F (Highlight Taupe)
 *
 * Size Selector: S  M  [ L ]  XL with ambient [ Bracket ] indicator and glow.
 * Strict 1:1 image ratio.
 */
export function ProductDetailView({ product, onBack, onSelectRelated }) {
  const {
    readyToBuyProducts = [],
    toggleWishlist,
    isWishlisted,
    storeSettings,
    setQuickViewProduct,
    selectProduct,
    navigateTo,
  } = useStore();

  const [activeImage, setActiveImage] = useState(
    product?.images?.[0] || product?.image || '/logo-mark-symbol.png'
  );
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0] || { name: 'Standard', hex: '#183630' }
  );
  const [selectedSize, setSelectedSize] = useState(
    product?.defaultSize || product?.sizes?.[0] || 'L'
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const unitPrice = product.price || product.basePrice || 399;
  const comparePrice = product.compareAtPrice;
  const discountPercent = comparePrice && comparePrice > unitPrice
    ? Math.round(((comparePrice - unitPrice) / comparePrice) * 100)
    : 0;

  const isCustomizable =
    product.isCustomizable !== false &&
    (Boolean(product.modelPath) || Boolean(product.printAreas));

  // Related products from same category or collection
  const relatedProducts = (readyToBuyProducts || [])
    .filter((p) => p.id !== product.id && (p.categoryKey === product.categoryKey || p.category === product.category))
    .slice(0, 4);

  // WhatsApp Direct Ordering Link
  const whatsappNumber = storeSettings?.whatsapp?.replace(/\D/g, '') || '917992801158';
  const totalPrice = unitPrice * quantity;
  const whatsappOrderMsg = encodeURIComponent(
    `Hello The PrintHub! I would like to place an order:\n\n` +
    `• Product: ${product.name}\n` +
    `• Quantity: ${quantity}\n` +
    `• Size: [ ${selectedSize} ]\n` +
    `• Color: ${selectedColor.name}\n` +
    `• Total Estimated: ₹${totalPrice.toLocaleString()}\n\n` +
    `Please confirm delivery timeline and payment details.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappOrderMsg}`;

  // Email Direct Ordering Link
  const mailtoUrl = `mailto:${storeSettings?.email || 'theprinthub.in@gmail.com'}?subject=${encodeURIComponent(
    `Order Request: ${product.name} (${quantity} units)`
  )}&body=${whatsappOrderMsg}`;

  const handleOpenCustomizer = () => {
    selectProduct(product);
    if (setQuickViewProduct) setQuickViewProduct(null);
    navigateTo('design-by-customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sizesList = product.sizes && product.sizes.length > 0
    ? product.sizes
    : ['S', 'M', 'L', 'XL', '2XL'];

  return (
    <div className="min-h-screen bg-[#E5DAC9] text-[#183630] pt-4 pb-28 sm:py-8 px-4 sm:px-8 select-none space-y-8 sm:space-y-12 animate-in fade-in w-full max-w-full overflow-x-hidden">
      <div className="max-w-[1500px] mx-auto space-y-6 sm:space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between border-b border-[#B8A98F]/40 pb-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-[#183630]/80 hover:text-[#183630] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products Catalog</span>
          </button>

          <div className="flex items-center gap-3 text-xs text-[#183630]/60">
            <span>{product.category || 'Merchandise'}</span>
            <span>/</span>
            <span className="text-[#183630] font-bold">{product.name}</span>
          </div>
        </div>

        {/* 2-Column Split: Gallery Left, Details Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* 
            ===================================================================
            LEFT: CONTROLLED IMAGE GALLERY (Strict 1:1 Aspect Ratio + Contain)
            ===================================================================
          */}
          <div className="lg:col-span-6 space-y-4">
            <div
              className="relative aspect-square rounded-3xl flex items-center justify-center p-6 sm:p-8 overflow-hidden transition-all bg-[#E5DAC9] border border-[#B8A98F] shadow-sm"
              style={{
                aspectRatio: '1 / 1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300"
                style={{
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                }}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.badge && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#183630] text-[#E5C690] border border-[#B8A98F] shadow-sm">
                    {product.badge}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-[#E5C690] text-[#183630] border border-[#B8A98F] shadow-xs">
                    {discountPercent}% OFF
                  </span>
                )}
                {isCustomizable && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#183630] text-[#E5DAC9] border border-[#B8A98F]/40 shadow-xs">
                    3D Customizable
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md transition-all z-10 cursor-pointer shadow-xs ${
                  wishlisted
                    ? 'bg-[#E5C690] text-[#183630] border border-[#183630]'
                    : 'bg-[#E5DAC9] text-[#183630]/70 hover:text-[#183630] border border-[#B8A98F]'
                }`}
                title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#183630]' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-18 h-18 rounded-2xl border-2 flex items-center justify-center p-1 shrink-0 transition-all cursor-pointer ${
                      activeImage === img
                        ? 'border-[#183630] shadow-[0_0_12px_rgba(184,169,143,0.45)]'
                        : 'border-[#B8A98F]/50 bg-[#E5DAC9] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 
            ===================================================================
            RIGHT: PRODUCT DETAILS & DIRECT ORDERING ACTIONS
            ===================================================================
          */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E5C690]/30 text-[#183630] border border-[#B8A98F]">
                  {isCustomizable ? '3D CUSTOMIZABLE BLANK' : 'READY TO ORDER'}
                </span>
                <span className="text-xs text-[#183630]/60">Direct Atelier Fulfillment</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight text-[#183630]">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 text-[#183630] font-bold">
                  <Star className="w-4 h-4 fill-[#E5C690] text-[#E5C690]" />
                  <span>{product.rating || '4.8'}</span>
                </div>
                <span className="text-[#B8A98F]">•</span>
                <span className="text-[#183630]/75">
                  ({product.reviewsCount || product.reviewCount || 95} verified customer reviews)
                </span>
                <span className="text-[#B8A98F]">•</span>
                <span className="text-[#183630] font-bold">In Stock & Ready</span>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-3xl flex items-baseline justify-between bg-[#E5DAC9] border border-[#B8A98F] shadow-sm">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl sm:text-3xl font-black text-[#183630]">
                      ₹{unitPrice.toLocaleString()}
                    </span>
                    {comparePrice && comparePrice > unitPrice && (
                      <span className="text-sm text-[#183630]/50 line-through">
                        MRP ₹{comparePrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#183630]/60">All GST Taxes Included • Free Shipping on ₹999+</span>
                </div>

                {discountPercent > 0 && (
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#E5C690] text-[#183630] border border-[#B8A98F]">
                    Save ₹{(comparePrice - unitPrice).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#183630]/80 leading-relaxed">
              {product.description || product.subtitle || 'Manufactured with high-durability combed fabric and reinforced double-needle stitching for lasting prints.'}
            </p>

            {/* Color Swatches with Bracket Highlight */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#183630] flex items-center justify-between">
                  <span>Color: <strong>[ {selectedColor.name} ]</strong></span>
                  <span className="text-[11px] text-[#183630]/60">{product.colors.length} Available</span>
                </label>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c, idx) => {
                    const isSelected = selectedColor.name === c.name;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-250 cursor-pointer relative ${
                          isSelected
                            ? 'scale-110 border-[#183630] ring-2 ring-[#B8A98F] shadow-[0_0_12px_rgba(184,169,143,0.5)]'
                            : 'border-[#B8A98F] opacity-75 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector: S M [ L ] XL with [ Bracket ] treatment */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#183630]">
                  Size Selector:
                </span>
                <span className="text-[11px] text-[#183630]/60 font-mono">
                  Active: [ {selectedSize} ]
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {sizesList.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all duration-250 text-center cursor-pointer ${
                        isSelected
                          ? 'bracket-selected-dark font-black text-[#E5C690]'
                          : 'bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] hover:border-[#183630]'
                      }`}
                    >
                      {isSelected ? `[ ${sz} ]` : sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#B8A98F] bg-[#E5DAC9] text-xs shadow-sm">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#183630]">Quantity:</span>
                <div className="flex items-center rounded-xl border border-[#B8A98F] p-1 bg-[#E5DAC9]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-lg text-[#183630] hover:bg-[#183630]/10 flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-[#183630]">[ {quantity} ]</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-lg text-[#183630] hover:bg-[#183630]/10 flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <span className="text-[#183630] font-bold text-[11px]">
                ✓ Ready for Quick Dispatch
              </span>
            </div>

            {/* Direct Order Actions */}
            <div className="space-y-3 pt-2">
              {/* Primary Buy Now / WhatsApp Direct Order Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] border border-[#B8A98F] font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <WhatsAppIcon size={18} className="w-4 h-4 shrink-0" />
                <span>Buy Now via WhatsApp (₹{totalPrice.toLocaleString()})</span>
              </a>

              {/* Secondary Add to Cart / 3D Customizer Studio Button */}
              {isCustomizable ? (
                <button
                  type="button"
                  onClick={handleOpenCustomizer}
                  className="w-full py-3.5 rounded-2xl border border-[#B8A98F] bg-[#183630] text-[#E5DAC9] hover:text-[#E5C690] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#E5C690]" />
                  <span>Open 3D Studio to Add Custom Design</span>
                </button>
              ) : (
                <a
                  href={mailtoUrl}
                  className="w-full py-2.5 rounded-xl border border-[#B8A98F] text-xs font-semibold flex items-center justify-center gap-2 transition-colors bg-[#E5DAC9] hover:bg-[#183630]/5 text-[#183630]"
                >
                  <Mail className="w-3.5 h-3.5 text-[#183630]" />
                  <span>Order via Email Confirmation</span>
                </a>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-[#B8A98F]/40 text-[#183630]/80">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#183630] shrink-0" />
                <span>Express PAN-India Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#183630] shrink-0" />
                <span>Verified Direct Atelier</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#183630] shrink-0" />
                <span>Defect-Free Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#183630] shrink-0" />
                <span>Damage-Proof Packaging</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-[#B8A98F]/40">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#183630]">
                You May Also Like
              </h2>
              <p className="text-xs text-[#183630]/70">
                Curated merchandise and blanks from the same collection
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectRelated) {
                      onSelectRelated(relProduct);
                    }
                  }}
                >
                  <ProductCard product={relProduct} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailView;
