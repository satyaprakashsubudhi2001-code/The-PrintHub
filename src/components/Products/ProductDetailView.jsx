import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  Zap,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  MessageSquare,
  Package,
  Palette,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

export function ProductDetailView({ product, onBack, onSelectRelated }) {
  const {
    readyToBuyProducts,
    toggleWishlist,
    isWishlisted,
    addReadyToBuyToCart,
    storeSettings,
    setQuickViewProduct,
    selectProduct,
    navigateTo,
    themeMode,
  } = useStore();

  const isLight = themeMode === 'light';

  const [activeImage, setActiveImage] = useState(product?.images?.[0] || product?.image);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || { name: 'Standard', hex: '#000000' });
  const [selectedSize, setSelectedSize] = useState(product?.defaultSize || product?.sizes?.[0] || 'L');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  // Related products from same category or collection
  const relatedProducts = readyToBuyProducts
    .filter((p) => p.id !== product.id && (p.categoryKey === product.categoryKey || p.collection === product.collection))
    .slice(0, 4);

  // WhatsApp Support pre-filled deep-link
  const whatsappNumber = storeSettings?.whatsapp?.replace(/\D/g, '') || '919876543210';
  const whatsappMsg = encodeURIComponent(
    `Hi The PrintHub, I am interested in purchasing "${product.name}", Size: ${selectedSize}, Color: ${selectedColor.name}. Is this available for express shipping?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  const handleAddToCart = () => {
    addReadyToBuyToCart({
      product,
      selectedColor,
      selectedSize,
      quantity,
      buyNow: false,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addReadyToBuyToCart({
      product,
      selectedColor,
      selectedSize,
      quantity,
      buyNow: true,
    });
  };

  return (
    <div className={`min-h-screen ${isLight ? 'bg-[#F8F9FC] text-[#0F172A]' : 'bg-[#080812] text-white'} pt-4 pb-28 sm:py-8 px-3 sm:px-8 select-none space-y-8 sm:space-y-12 animate-in fade-in w-full max-w-full overflow-x-hidden`}>
      <div className="max-w-[1500px] mx-auto space-y-6 sm:space-y-10">
        {/* Breadcrumb Navigation */}
        <div className={`flex items-center justify-between border-b ${isLight ? 'border-slate-200' : 'border-white/10'} pb-4`}>
          <button
            type="button"
            onClick={onBack}
            className={`flex items-center gap-2 text-xs font-bold ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'} transition-colors`}
          >
            <ArrowLeft className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#06B6D4]'}`} />
            <span>Back to Products Catalog</span>
          </button>

          <div className={`flex items-center gap-3 text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} font-mono`}>
            <span>{product.collection}</span>
            <span>/</span>
            <span className={`${isLight ? 'text-slate-900' : 'text-white'} font-bold`}>{product.category}</span>
          </div>
        </div>

        {/* 2-Column Split: Gallery Left, Details Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: IMAGE GALLERY (7 COLS) */}
          <div className="lg:col-span-7 space-y-4">
            <div className={`relative aspect-[4/3.5] rounded-3xl ${isLight ? 'bg-white border border-slate-200 shadow-xl' : 'bg-[#101022] border border-white/10 shadow-2xl'} overflow-hidden group`}>
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.badge && (
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase font-mono tracking-wider ${
                    isLight ? 'bg-white/90 text-indigo-700 border border-indigo-200 shadow-md' : 'bg-[#101022]/90 text-[#06B6D4] border border-[#06B6D4]/30 shadow-md'
                  }`}>
                    {product.badge}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase font-mono bg-[#EC4899] text-white shadow-md">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md transition-all z-10 shadow-md ${
                  wishlisted
                    ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40 scale-110'
                    : isLight
                    ? 'bg-white/80 text-slate-400 hover:text-rose-500 border border-slate-200'
                    : 'bg-[#101022]/80 text-slate-400 hover:text-rose-400 border border-white/10'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
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
                    className={`w-20 h-20 rounded-2xl border-2 overflow-hidden shrink-0 transition-all ${
                      activeImage === img
                        ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                        : isLight
                        ? 'border-slate-200 opacity-70 hover:opacity-100'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT SPECIFICATIONS & ACTIONS (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full ${
                  isLight
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'bg-[#6C4DF6]/20 text-[#06B6D4] border border-[#06B6D4]/30'
                } text-[10px] font-black uppercase font-mono`}>
                  {product.isCustomizable ? '🎨 CUSTOMIZABLE MERCHANDISE' : '🛍 READY-TO-BUY MERCHANDISE'}
                </span>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} font-mono`}>SKU: {product.sku}</span>
              </div>

              <h1 className={`text-2xl sm:text-3xl font-black ${isLight ? 'text-slate-900' : 'text-white'} font-display leading-tight`}>
                {product.name}
              </h1>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{product.rating || '4.9'}</span>
                </div>
                <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>•</span>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>({product.reviewCount || '85'} customer reviews)</span>
                <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>•</span>
                <span className="text-emerald-600 font-bold font-mono">In Stock ({product.stock || 25} left)</span>
              </div>

              {/* Price Banner */}
              <div className={`p-4 rounded-2xl ${isLight ? 'bg-white border border-slate-200/90 shadow-sm' : 'bg-[#101022] border border-white/10 shadow-lg'} flex items-baseline justify-between`}>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl sm:text-3xl font-black ${isLight ? 'text-slate-900' : 'text-white'} font-mono`}>
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-slate-400 line-through font-mono">
                        MRP ₹{product.compareAtPrice}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Inclusive of all GST taxes • Free Shipping on ₹999+</span>
                </div>

                {discountPercent > 0 && (
                  <span className={`px-2.5 py-1 rounded-xl ${
                    isLight
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  } font-black text-xs font-mono`}>
                    Save ₹{product.compareAtPrice - product.price}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'} leading-relaxed font-medium`}>
              {product.description}
            </p>

            {/* Color Swatches */}
            <div className="space-y-2">
              <label className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'} flex items-center justify-between`}>
                <span>Color: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{selectedColor.name}</strong></span>
                <span className={`text-[11px] ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>{product.colors?.length} Colors Available</span>
              </label>
              <div className="flex items-center gap-2.5">
                {product.colors && product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor.name === c.name
                        ? isLight
                          ? 'scale-110 border-indigo-600 ring-2 ring-indigo-500/30 shadow-md'
                          : 'scale-110 border-white ring-2 ring-[#06B6D4] shadow-lg'
                        : isLight
                        ? 'border-slate-300 opacity-80 hover:opacity-100'
                        : 'border-white/20 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Size: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{selectedSize}</strong>
                </span>
                <span className="text-indigo-600 font-bold text-[11px] cursor-pointer hover:underline">Size Guide</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes && product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedSize === sz
                        ? isLight
                          ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                          : 'bg-[#6C4DF6] border-[#6C4DF6] text-white shadow-lg shadow-[#6C4DF6]/30'
                        : isLight
                        ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        : 'bg-[#101022] border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className={`flex items-center justify-between p-3.5 rounded-2xl ${isLight ? 'bg-white border border-slate-200/90 shadow-sm' : 'bg-[#101022] border border-white/10 shadow-lg'} text-xs`}>
              <div className="flex items-center gap-3">
                <span className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Quantity:</span>
                <div className={`flex items-center rounded-xl ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-[#080812] border border-white/10'} p-1`}>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`w-7 h-7 rounded-lg ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'} flex items-center justify-center font-bold text-sm`}
                  >
                    −
                  </button>
                  <span className={`w-8 text-center font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'} text-sm`}>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className={`w-7 h-7 rounded-lg ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'} flex items-center justify-center font-bold text-sm`}
                  >
                    +
                  </button>
                </div>
              </div>

              <span className={`text-xs ${isLight ? 'text-emerald-700' : 'text-emerald-400'} font-mono font-bold`}>
                ✓ Available for Fast Shipping
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Buy Now (₹{(product.price * quantity).toLocaleString()})</span>
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-2xl ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-300'
                    : 'bg-[#101022] hover:bg-[#16162E] text-white border border-white/15'
                } font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm`}
              >
                <ShoppingBag className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#06B6D4]'}`} />
                <span>{isAdded ? 'Added to Cart ✓' : 'Add to Cart'}</span>
              </button>

              {/* Optional: Customize in 3D Button if Customizable */}
              {product.isCustomizable !== false && (
                <button
                  type="button"
                  onClick={() => {
                    selectProduct(product);
                    navigateTo('design-by-customer');
                  }}
                  className={`w-full py-3.5 rounded-2xl ${
                    isLight
                      ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                      : 'bg-[#6C4DF6]/20 hover:bg-[#6C4DF6]/30 text-[#06B6D4] border border-[#06B6D4]/40'
                  } font-bold text-xs flex items-center justify-center gap-2 transition-all`}
                >
                  <Palette className="w-4 h-4" />
                  <span>🎨 Customize this Product with Your Design in 3D</span>
                </button>
              )}
            </div>

            {/* Trust Points */}
            <div className={`grid grid-cols-2 gap-3 text-xs ${isLight ? 'text-slate-500 border-slate-200' : 'text-slate-400 border-white/10'} pt-2 border-t`}>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Express Air Delivery (2–4 Days)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Razorpay & UPI Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                <span>7 Days Print Defect Replacement</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#EC4899] shrink-0" />
                <span>Tamper-Proof Box Packaging</span>
              </div>
            </div>

            {/* WhatsApp Support Direct Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className={`p-3.5 rounded-2xl ${
                isLight
                  ? 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800'
                  : 'bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300'
              } text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Need help? Chat with us on WhatsApp regarding this product</span>
            </a>
          </div>
        </div>

        {/* BOTTOM: YOU MAY ALSO LIKE (RELATED PRODUCTS) */}
        {relatedProducts.length > 0 && (
          <div className={`space-y-6 pt-8 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
            <div>
              <h2 className={`text-lg sm:text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'} font-display uppercase tracking-tight`}>
                You May Also Like
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Curated merchandise and apparel from the same collection
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                  onOpenQuickView={(p) => setQuickViewProduct(p)}
                  onOpenDetail={(p) => onSelectRelated(p)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
