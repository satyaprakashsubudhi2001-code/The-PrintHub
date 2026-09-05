import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Zap,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  MessageCircle,
  Package,
  Palette,
  Mail,
  Check,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

/**
 * ProductDetailView — The PrintHub Product Quick Detail & Direct Ordering View
 * Strict adherence to Controlled Image Rule:
 * - aspect-ratio: 1 / 1
 * - display: flex; align-items: center; justify-content: center;
 * - object-fit: contain; width: 100%; height: 100%;
 * Direct WhatsApp & Email ordering flow (No traditional checkout wall).
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
    themeMode,
  } = useStore();

  const isLight = themeMode === 'light';

  const [activeImage, setActiveImage] = useState(
    product?.images?.[0] || product?.image || '/brand-dark.png'
  );
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0] || { name: 'Standard', hex: '#000000' }
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
  const whatsappNumber = '917992801158';
  const totalPrice = unitPrice * quantity;
  const whatsappOrderMsg = encodeURIComponent(
    `Hello The PrintHub! I would like to place an order:\n\n` +
    `• Product: ${product.name}\n` +
    `• Quantity: ${quantity}\n` +
    `• Size: ${selectedSize}\n` +
    `• Color: ${selectedColor.name}\n` +
    `• Total Estimated: ₹${totalPrice.toLocaleString()}\n\n` +
    `Please share details and payment method for dispatch.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappOrderMsg}`;

  // Email Direct Ordering Link
  const mailtoUrl = `mailto:theprinthub.in@gmail.com?subject=${encodeURIComponent(
    `Order Request: ${product.name} (${quantity} units)`
  )}&body=${whatsappOrderMsg}`;

  const handleOpenCustomizer = () => {
    selectProduct(product);
    if (setQuickViewProduct) setQuickViewProduct(null);
    navigateTo('design-by-customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#12002E] pt-4 pb-28 sm:py-8 px-4 sm:px-8 select-none space-y-8 sm:space-y-12 animate-in fade-in w-full max-w-full overflow-x-hidden">
      <div className="max-w-[1500px] mx-auto space-y-6 sm:space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#DA0090] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products Catalog</span>
          </button>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{product.category || 'Merchandise'}</span>
            <span>/</span>
            <span className="text-[#2C0E63] font-bold">{product.name}</span>
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
              className="relative aspect-square rounded-3xl flex items-center justify-center p-6 sm:p-8 overflow-hidden transition-all bg-white border border-slate-200 shadow-sm"
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
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#DA0090] text-white shadow-sm">
                    {product.badge}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-rose-500 text-white shadow-xs">
                    {discountPercent}% OFF
                  </span>
                )}
                {isCustomizable && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#2C0E63] border border-white/20 text-white shadow-xs">
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
                    ? 'bg-[#DA0090] text-white scale-105'
                    : 'bg-white/90 text-slate-400 hover:text-[#DA0090] border border-slate-200'
                }`}
                title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
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
                        ? 'border-[#2C0E63] ring-2 ring-[#2C0E63]/20'
                        : 'border-slate-200 bg-white opacity-70 hover:opacity-100'
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
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#DA0090]/15 text-[#DA0090] border border-[#DA0090]/30">
                  {isCustomizable ? '3D CUSTOMIZABLE BLANK' : 'READY TO ORDER'}
                </span>
                <span className="text-xs text-slate-400">Direct Factory Fulfillment</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-[#2C0E63]">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 text-[#F2CB30] font-bold">
                  <Star className="w-4 h-4 fill-[#F2CB30]" />
                  <span>{product.rating || '4.8'}</span>
                </div>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">({product.reviewsCount || product.reviewCount || 95} verified customer reviews)</span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-600 font-bold">In Stock & Ready</span>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl flex items-baseline justify-between bg-white border border-slate-200 shadow-sm">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl sm:text-3xl font-black text-[#12002E]">
                      ₹{unitPrice.toLocaleString()}
                    </span>
                    {comparePrice && comparePrice > unitPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        MRP ₹{comparePrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">All GST Taxes Included • Free Shipping on ₹999+</span>
                </div>

                {discountPercent > 0 && (
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#F2CB30]/20 text-[#12002E] border border-[#F2CB30]/40">
                    Save ₹{(comparePrice - unitPrice).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {product.description || product.subtitle || 'Manufactured with high-durability combed fabric and reinforced double-needle stitching for lasting prints.'}
            </p>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Color: <strong className="text-slate-900">{selectedColor.name}</strong></span>
                  <span className="text-[11px] text-slate-400">{product.colors.length} Available</span>
                </label>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColor.name === c.name
                          ? 'scale-110 border-white ring-2 ring-[#2C0E63]'
                          : 'border-slate-300 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    Size: <strong className="text-slate-900">{selectedSize}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#2C0E63] border-[#2C0E63] text-white font-extrabold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white text-xs shadow-sm">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center rounded-xl border border-slate-200 p-1 bg-slate-100">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-lg text-slate-600 hover:bg-white flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-lg text-slate-600 hover:bg-white flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <span className="text-emerald-600 font-bold">
                ✓ Ready for Quick Dispatch
              </span>
            </div>

            {/* Direct Order Actions */}
            <div className="space-y-3 pt-2">
              {/* Primary WhatsApp Direct Order Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl bg-[#F2CB30] hover:bg-[#DA0090] hover:text-white text-[#12002E] font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current/20" />
                <span>Order Now via WhatsApp (₹{totalPrice.toLocaleString()})</span>
              </a>

              {/* 3D Customizer Studio Button if product is customizable */}
              {isCustomizable && (
                <button
                  type="button"
                  onClick={handleOpenCustomizer}
                  className="w-full py-3.5 rounded-2xl border border-[#2C0E63] bg-white hover:bg-slate-50 text-[#2C0E63] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#DA0090]" />
                  <span>Open 3D Studio to Add Your Own Custom Design</span>
                </button>
              )}

              {/* Email Direct Order Fallback */}
              <a
                href={mailtoUrl}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors bg-white hover:bg-slate-50 text-slate-700"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Prefer Email? Send Order Details via Gmail</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-200 text-slate-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#DA0090] shrink-0" />
                <span>Express PAN-India Delivery (2–4 Days)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#DA0090] shrink-0" />
                <span>Direct Verified Manufacturer</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#DA0090] shrink-0" />
                <span>Defect-Free Quality Assurance</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#DA0090] shrink-0" />
                <span>Damage-Proof Packaging</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-slate-200">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#2C0E63]">
                You May Also Like
              </h2>
              <p className="text-xs text-slate-500">
                Curated merchandise and blanks from the same collection
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
