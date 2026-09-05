import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Box,
  Image as ImageIcon,
  Check,
  X,
  AlertCircle,
  Eye,
  Sliders,
  Sparkles,
  RefreshCw,
  Layers,
  Palette,
  Tag,
  DollarSign,
  Maximize2,
  CheckCircle2,
  RotateCcw,
  PackagePlus,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MASTER_CALIBRATIONS } from '../../constants/printCalibration';

// Available 3D Models (.GLB)
const AVAILABLE_3D_MODELS = [
  { id: '/models/round-neck-tshirt.glb', label: 'Round Neck T-Shirt (Regular Fit)' },
  { id: '/models/oversized-tshirt.glb', label: 'Oversized Streetwear T-Shirt' },
  { id: '/models/polo-tshirt.glb', label: 'Classic Pique Polo T-Shirt' },
  { id: '/models/hoodie.glb', label: 'Heavyweight Pullover Hoodie' },
  { id: '/models/cup.glb', label: 'Glossy Ceramic Coffee Mug' },
  { id: '/models/cap.glb', label: 'Structured Snapback Cap' },
  { id: '/models/apron.glb', label: 'Chef & Barista Kitchen Apron' },
  { id: '/models/mouse-pad.glb', label: 'Speed Edition Desk Mouse Pad' },
  { id: '/models/photo-frame.glb', label: 'Acrylic Desk Photo Frame' },
  { id: '/models/badge.glb', label: 'Custom Pin Button Badges' },
];

// Curated 1-Click Product Presets (for fast catalog creation)
const PRODUCT_PRESETS = [
  {
    label: 'Round Neck T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/round-neck-tshirt.glb',
    variant: '180 GSM Single Jersey Combed Cotton',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    basePrice: 399,
    compareAtPrice: 599,
    categorySuggestion: 'T-Shirts',
    subtitle: '100% Combed Cotton • Bio-Washed • Pre-Shrunk Single Jersey',
    description: 'Classic unisex regular fit blank made with 180 GSM breathable combed cotton. Optimized for high-density DTF curing and screen printing.',
  },
  {
    label: 'Oversized Streetwear Tee',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/oversized-tshirt.glb',
    variant: '240 GSM Heavyweight Terry Loopknit',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    basePrice: 599,
    compareAtPrice: 899,
    categorySuggestion: 'Oversized',
    subtitle: '240 GSM Drop-Shoulder • Thick Ribbed Collar • Streetwear Cut',
    description: 'Heavyweight streetwear drop-shoulder blank. French terry loopknit fabric with reinforced neckband for premium modern silhouettes.',
  },
  {
    label: 'Heavyweight Pullover Hoodie',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/hoodie.glb',
    variant: '380 GSM Heavyweight Fleece',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    basePrice: 1199,
    compareAtPrice: 1699,
    categorySuggestion: 'Hoodies',
    subtitle: '380 GSM Cotton-Poly Fleece • Double Lined Hood • Kangaroo Pocket',
    description: 'Ultra-warm winter hoodie blank with double-needle construction, matching drawstrings with metal aglets, and pre-brushed interior.',
  },
  {
    label: 'Executive Pique Polo',
    image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/polo-tshirt.glb',
    variant: '240 GSM Honeycomb Matty Cotton',
    sizes: ['M', 'L', 'XL', '2XL', '3XL'],
    basePrice: 699,
    compareAtPrice: 999,
    categorySuggestion: 'Polo Shirts',
    subtitle: '100% Cotton Honeycomb Pique • Reinforced Rib Collar',
    description: 'Premium corporate and executive polo blank. Supports chest embroidery, thermal DTF and sleeve badges.',
  },
  {
    label: 'Ceramic Magic Coffee Mug',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/cup.glb',
    variant: '11oz / 325ml AAA Ceramic',
    sizes: ['11oz (325ml) Standard'],
    basePrice: 299,
    compareAtPrice: 449,
    categorySuggestion: 'Drinkware',
    subtitle: 'Microwave & Dishwasher Safe • High-Gloss Sublimation Finish',
    description: 'High-grade ceramic coffee cup with polymer coating for 360-degree all-over thermal wrap printing.',
  },
  {
    label: 'Structured Snapback Cap',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/cap.glb',
    variant: '6-Panel Wool-Acrylic Blend Twill',
    sizes: ['One Size (Adjustable Snap)'],
    basePrice: 499,
    compareAtPrice: 699,
    categorySuggestion: 'Headwear',
    subtitle: 'High Profile Crown • Flat Visor • Plastic Snapback Closure',
    description: 'Structured 6-panel streetwear cap with buckram reinforced front panels engineered for 3D puffed embroidery and DTF transfer.',
  },
  {
    label: 'Artisan Chef & Barista Apron',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/apron.glb',
    variant: '320 GSM Heavyweight Washed Canvas',
    sizes: ['Universal Adjustable'],
    basePrice: 799,
    compareAtPrice: 1099,
    categorySuggestion: 'Accessories',
    subtitle: '100% Cotton Canvas • Antique Brass Hardware • Cross-Back Straps',
    description: 'Commercial grade kitchen and studio apron with utility chest pocket and double front kangaroo utility pouches.',
  },
  {
    label: 'Custom Pin Button Badges',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/badge.glb',
    variant: '58mm Tinplate Metal with Mylar Film',
    sizes: ['58mm (2.25 inch) Standard'],
    basePrice: 99,
    compareAtPrice: 199,
    categorySuggestion: 'Badges & Pins',
    subtitle: 'Waterproof Mylar Coating • Steel Safety Pin Back',
    description: 'Vibrant full-color promotional pin button badge for events, brand merchandise, and corporate giveaways.',
  },
];

// Popular Commercial Apparel Colors for 1-click swatch additions
const POPULAR_COLORS = [
  { name: 'Obsidian Black', hex: '#18181b' },
  { name: 'Pure White', hex: '#f8fafc' },
  { name: 'Heather Grey', hex: '#64748b' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Forest Green', hex: '#15803d' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Maroon Wine', hex: '#881337' },
  { name: 'Sandstone Beige', hex: '#d6c7b2' },
  { name: 'Lavender Purple', hex: '#c084fc' },
  { name: 'Acid Charcoal', hex: '#334155' },
];

const ALL_PRINT_METHODS = [
  { id: 'dtf', label: 'HD Direct-to-Film (DTF)' },
  { id: 'screen_print', label: 'Premium Screen Printing' },
  { id: 'embroidery', label: 'High-Density 3D Embroidery' },
  { id: 'sublimation', label: 'All-Over HD Sublimation' },
];

const BADGE_OPTIONS = [
  'None',
  'Best Seller',
  '#1 Trending',
  'New Arrival',
  'Hot Drop',
  'Corporate Fav',
  'Winter Top Pick',
  'Limited Edition',
  'Top Rated',
];

export function AdminProductsTab({ onNavigateToCategories }) {
  const {
    products = [],
    categories = [],
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    selectProduct,
    navigateTo,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Form State with Comprehensive Options
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    variant: '',
    subtitle: '',
    description: '',
    category: '',
    basePrice: 499,
    compareAtPrice: 799,
    badge: 'New Arrival',
    image: PRODUCT_PRESETS[0].image,
    modelPath: PRODUCT_PRESETS[0].modelPath,
    defaultColor: '#18181b',
    colors: [
      { name: 'Obsidian Black', hex: '#18181b' },
      { name: 'Pure White', hex: '#f8fafc' },
    ],
    defaultSize: 'L',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    supportedMethods: ['dtf', 'screen_print', 'embroidery'],
    stock: 50,
    isCustomizable: true,
    isReadyToBuy: true,
    tags: 'Streetwear, Cotton, Custom Print',
  });

  const [customSizesInput, setCustomSizesInput] = useState('S, M, L, XL, 2XL');
  const [formError, setFormError] = useState('');

  // Auto-fill category when categories load if empty
  const defaultCategory = categories[0]?.name || 'Apparel';

  // Open Modal for New Product
  const handleOpenAddModal = (preset = null) => {
    setEditingProduct(null);
    const newId = `product-${Date.now().toString(36)}`;
    const matchedCategory = preset
      ? categories.find(
          (c) =>
            c.name.toLowerCase() === preset.categorySuggestion?.toLowerCase() ||
            c.slug === preset.categorySuggestion?.toLowerCase()
        )?.name || defaultCategory
      : defaultCategory;

    setFormData({
      id: newId,
      name: preset ? preset.label : '',
      variant: preset ? preset.variant : '240 GSM Combed Cotton',
      subtitle: preset ? preset.subtitle : '100% Premium Cotton • Custom HD-DTF Ready',
      description: preset ? preset.description : 'High-density combed fabric with reinforced stitching for vibrant multi-color printing.',
      category: matchedCategory,
      basePrice: preset ? preset.basePrice : 499,
      compareAtPrice: preset ? preset.compareAtPrice : 799,
      badge: 'New Arrival',
      image: preset ? preset.image : PRODUCT_PRESETS[0].image,
      modelPath: preset ? preset.modelPath : PRODUCT_PRESETS[0].modelPath,
      defaultColor: '#18181b',
      colors: [
        { name: 'Obsidian Black', hex: '#18181b' },
        { name: 'Pure White', hex: '#f8fafc' },
      ],
      defaultSize: preset?.sizes?.[0] || 'L',
      sizes: preset?.sizes || ['S', 'M', 'L', 'XL', '2XL'],
      supportedMethods: ['dtf', 'screen_print', 'embroidery'],
      stock: 50,
      isCustomizable: true,
      isReadyToBuy: true,
      tags: 'Cotton, Custom Print, Unisex',
    });
    setCustomSizesInput(preset ? preset.sizes.join(', ') : 'S, M, L, XL, 2XL');
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      id: prod.id,
      name: prod.name || '',
      variant: prod.variant || '',
      subtitle: prod.subtitle || '',
      description: prod.description || '',
      category: prod.category || defaultCategory,
      basePrice: prod.basePrice || prod.price || 0,
      compareAtPrice: prod.compareAtPrice || 0,
      badge: prod.badge || 'None',
      image: prod.image || prod.images?.[0] || '',
      modelPath: prod.modelPath || '/models/round-neck-tshirt.glb',
      defaultColor: prod.defaultColor || '#18181b',
      colors: prod.colors && prod.colors.length > 0 ? prod.colors : [{ name: 'Default', hex: prod.defaultColor || '#18181b' }],
      defaultSize: prod.defaultSize || 'L',
      sizes: prod.sizes || ['S', 'M', 'L', 'XL', '2XL'],
      supportedMethods: prod.supportedMethods || ['dtf'],
      stock: prod.stock || 50,
      isCustomizable: prod.isCustomizable !== false,
      isReadyToBuy: prod.isReadyToBuy !== false,
      tags: Array.isArray(prod.tags) ? prod.tags.join(', ') : prod.tags || '',
    });
    setCustomSizesInput((prod.sizes || ['S', 'M', 'L', 'XL', '2XL']).join(', '));
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Name change handler with auto-ID generation
  const handleNameChange = (val) => {
    setFormData((prev) => {
      const autoId = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return {
        ...prev,
        name: val,
        id: editingProduct ? prev.id : autoId || `product-${Date.now().toString(36)}`,
      };
    });
  };

  // Color toggler helper
  const toggleColorSwatch = (colorObj) => {
    setFormData((prev) => {
      const exists = prev.colors.some((c) => c.hex.toLowerCase() === colorObj.hex.toLowerCase());
      const nextColors = exists
        ? prev.colors.filter((c) => c.hex.toLowerCase() !== colorObj.hex.toLowerCase())
        : [...prev.colors, colorObj];
      return {
        ...prev,
        colors: nextColors.length > 0 ? nextColors : [colorObj],
        defaultColor: nextColors.length > 0 ? nextColors[0].hex : colorObj.hex,
      };
    });
  };

  // Print method toggler helper
  const togglePrintMethod = (methodId) => {
    setFormData((prev) => {
      const exists = prev.supportedMethods.includes(methodId);
      const next = exists
        ? prev.supportedMethods.filter((m) => m !== methodId)
        : [...prev.supportedMethods, methodId];
      return {
        ...prev,
        supportedMethods: next.length > 0 ? next : ['dtf'],
      };
    });
  };

  // Handle Form Submit (Create or Update)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Product Title is required.');
      return;
    }
    if (!formData.id.trim()) {
      setFormError('Product SKU / Identifier is required.');
      return;
    }

    const parsedSizes = customSizesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Auto-bind calibrated print areas if matching known model
    let printAreas = MASTER_CALIBRATIONS['round-neck-tshirt'];
    if (formData.modelPath.includes('polo')) {
      printAreas = MASTER_CALIBRATIONS['polo-tshirt'];
    } else if (formData.modelPath.includes('oversized')) {
      printAreas = MASTER_CALIBRATIONS['oversized-tshirt'];
    } else if (formData.modelPath.includes('hoodie')) {
      printAreas = MASTER_CALIBRATIONS['hoodie'];
    } else if (formData.modelPath.includes('cup')) {
      printAreas = MASTER_CALIBRATIONS['cup'];
    } else if (formData.modelPath.includes('cap')) {
      printAreas = MASTER_CALIBRATIONS['cap'];
    } else if (formData.modelPath.includes('apron')) {
      printAreas = MASTER_CALIBRATIONS['apron'];
    } else if (formData.modelPath.includes('badge')) {
      printAreas = MASTER_CALIBRATIONS['badge'];
    }

    const parsedTags = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      sizes: parsedSizes.length > 0 ? parsedSizes : ['Standard'],
      basePrice: Number(formData.basePrice) || 0,
      price: Number(formData.basePrice) || 0,
      compareAtPrice: Number(formData.compareAtPrice) || 0,
      stock: Number(formData.stock) || 0,
      rating: editingProduct?.rating || 4.9,
      reviewsCount: editingProduct?.reviewsCount || 120,
      category: formData.category || defaultCategory,
      categoryKey: (formData.category || defaultCategory).toLowerCase().replace(/\s+/g, '-'),
      badge: formData.badge === 'None' ? '' : formData.badge,
      printAreas: editingProduct?.printAreas || printAreas,
      defaultPrintArea: printAreas?.[0]?.id || 'center_chest',
      tags: parsedTags,
      images: [formData.image],
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    setIsAddModalOpen(false);
  };

  // Filter products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'ALL') {
        const catLower = selectedCategory.toLowerCase();
        const pCat = (p.category || '').toLowerCase();
        const pKey = (p.categoryKey || '').toLowerCase();
        if (pCat !== catLower && pKey !== catLower) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.name?.toLowerCase().includes(q);
        const matchId = p.id?.toLowerCase().includes(q);
        const matchSubtitle = p.subtitle?.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchSubtitle) return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in select-none">
      {/* =========================================================================
         1. TOP HEADER & METRICS
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0c101d] border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-black font-mono uppercase">
              CATALOG COMMAND
            </span>
            <span className="text-xs font-mono text-slate-400 font-bold">
              {products.length} {products.length === 1 ? 'Product' : 'Products'} Active
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight">
            Merchandise & Blank Products
          </h2>
          <p className="text-xs text-slate-400 font-sans max-w-2xl">
            Configure custom 3D customizable blanks and ready-to-buy store merchandise with calibrated print zones, color swatches, and sizing.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {products.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>CLEAR ALL</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleOpenAddModal()}
            className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs font-mono uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-transform cursor-pointer hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>CREATE NEW PRODUCT</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Clearing All Products */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0c101d] border border-rose-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-display font-black text-lg text-white uppercase">Remove All Products?</h3>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              This will remove all {products.length} products from your active database. The storefront and customizer will reflect the empty state until you create new products.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-bold hover:text-white"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllProducts();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-mono font-bold hover:bg-rose-600 shadow-md"
              >
                YES, REMOVE ALL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         2. FILTER & SEARCH BAR (when products exist)
         ========================================================================= */}
      {products.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#0c101d] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
            {['ALL', ...categories.map((c) => c.name)].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold tracking-wider shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-lime-400 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
            {categories.length === 0 && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-mono text-slate-500 italic">No categories created yet</span>
                {onNavigateToCategories && (
                  <button
                    type="button"
                    onClick={onNavigateToCategories}
                    className="px-2.5 py-1 rounded-lg bg-lime-400/10 border border-lime-400/30 text-lime-400 hover:bg-lime-400/20 text-[10px] font-mono font-bold transition-colors"
                  >
                    + Create Category
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, SKU, fabric..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* =========================================================================
         3. EMPTY STATE (When catalog is empty)
         ========================================================================= */}
      {products.length === 0 && (
        <div className="p-12 sm:p-16 rounded-3xl bg-[#0c101d] border border-slate-800 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 shadow-inner">
            <PackagePlus className="w-10 h-10 stroke-[1.5]" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight">
              No Products in Catalog
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              All previous products have been removed. Use the button below to configure your own merchandise products with custom pricing, 3D rigs, sizes, and print calibration.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleOpenAddModal()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-lime-400 text-slate-950 hover:bg-lime-300 font-mono font-black text-xs uppercase tracking-wider shadow-xl shadow-lime-400/20 transition-transform cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>CREATE FIRST PRODUCT</span>
            </button>
          </div>

          {/* Quick Starter Inspiration */}
          <div className="pt-8 border-t border-slate-800/60 max-w-2xl mx-auto">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
              1-Click Starter Presets (Click to prefill and create)
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PRODUCT_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleOpenAddModal(preset)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-lime-400/40 text-slate-300 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-lime-400" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         4. PRODUCTS GRID
         ========================================================================= */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="group rounded-2xl bg-[#0c101d] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-cyan-500/5"
            >
              <div>
                {/* Product Cover Image */}
                <div className="relative h-48 bg-slate-950 overflow-hidden flex items-center justify-center">
                  <img
                    src={prod.image || prod.images?.[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-transparent to-black/30" />

                  {/* Badge */}
                  {prod.badge && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-lime-400 text-slate-950 font-mono font-black text-[10px] uppercase shadow">
                      {prod.badge}
                    </span>
                  )}

                  {/* 3D Rig Badge */}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-cyan-300 font-mono text-[9px] font-bold flex items-center gap-1">
                    <Box className="w-3 h-3 text-cyan-400" />
                    <span>3D RIG</span>
                  </span>

                  {/* Pricing tag */}
                  <div className="absolute bottom-2 left-3 flex items-baseline gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800">
                    <span className="text-white font-black text-sm font-mono">
                      ₹{prod.basePrice || prod.price || 0}
                    </span>
                    {prod.compareAtPrice > (prod.basePrice || prod.price) && (
                      <span className="text-slate-500 text-[10px] line-through font-mono">
                        ₹{prod.compareAtPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 uppercase font-bold">
                      {prod.category || 'General'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Stock: {prod.stock ?? 50}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-white text-sm uppercase leading-tight line-clamp-1 group-hover:text-cyan-400 transition-colors">
                    {prod.name}
                  </h3>

                  {prod.variant && (
                    <p className="text-[11px] font-mono text-slate-400 line-clamp-1">
                      {prod.variant}
                    </p>
                  )}

                  {/* Available Colors preview */}
                  {prod.colors && prod.colors.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      {prod.colors.slice(0, 5).map((col, idx) => (
                        <span
                          key={idx}
                          title={col.name}
                          className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-xs"
                          style={{ backgroundColor: col.hex }}
                        />
                      ))}
                      {prod.colors.length > 5 && (
                        <span className="text-[9px] font-mono text-slate-500">
                          +{prod.colors.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    selectProduct(prod.id);
                    navigateTo('design-by-customer');
                  }}
                  className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 font-bold"
                  title="Open in 3D Studio"
                >
                  <Eye className="w-3 h-3" />
                  <span>3D STUDIO</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(prod)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                    title="Edit Product Parameters"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteProduct(prod.id)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
         5. ADD / EDIT PRODUCT MODAL (COMPREHENSIVE PARAMETERS)
         ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-3xl rounded-3xl bg-[#0c101d] border border-slate-800 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto my-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-lime-400 uppercase tracking-wider block">
                  {editingProduct ? 'EDIT PRODUCT' : 'CONFIGURE NEW PRODUCT'}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white font-display uppercase mt-0.5">
                  {editingProduct ? editingProduct.name : 'Merchandise Parameters'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-6 font-mono text-xs">
              {/* Row 1: Title & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Classic Pique Polo T-Shirt"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Product SKU / Unique ID *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingProduct}
                    placeholder="e.g. polo-tshirt"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white disabled:opacity-60 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Category, Variant & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-slate-400 uppercase font-bold block">
                      Category *
                    </label>
                    {onNavigateToCategories && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddModalOpen(false);
                          onNavigateToCategories();
                        }}
                        className="text-[10px] text-lime-400 hover:text-lime-300 font-mono font-bold underline cursor-pointer"
                      >
                        + Categories Manager
                      </button>
                    )}
                  </div>
                  {categories.length > 0 ? (
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-1">
                      <input
                        type="text"
                        placeholder="Type category name..."
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-white focus:border-amber-400 focus:outline-none"
                      />
                      <span className="text-[10px] text-amber-400/90 block font-mono">
                        Tip: Add categories in Categories tab for auto grouping.
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Variant / Fabric Knit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 240 GSM Combed Cotton"
                    value={formData.variant}
                    onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Badge Tag
                  </label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {BADGE_OPTIONS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Pricing & Inventory */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Base Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Compare at MRP (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Stock Inventory Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Photo URL & 3D Model Rig with Quick Presets */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 uppercase font-bold block mb-1.5">
                      Product Photography Image URL *
                    </label>
                    <div className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                        <img
                          src={formData.image || PRODUCT_PRESETS[0].image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = PRODUCT_PRESETS[0].image;
                          }}
                        />
                      </div>
                      <input
                        type="url"
                        required
                        placeholder="https://images.unsplash.com/..."
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 uppercase font-bold block mb-1.5">
                      3D Model (.GLB) Rig Path *
                    </label>
                    <select
                      value={formData.modelPath}
                      onChange={(e) => setFormData({ ...formData, modelPath: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 focus:border-cyan-400 focus:outline-none"
                    >
                      {AVAILABLE_3D_MODELS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 1-Click Visual Photo Presets */}
                <div className="pt-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-2">
                    Or select from curated photo presets (auto-pairs 3D model):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRODUCT_PRESETS.slice(0, 4).map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            image: p.image,
                            modelPath: p.modelPath,
                            variant: prev.variant || p.variant,
                          }))
                        }
                        className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          formData.image === p.image
                            ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <img src={p.image} alt={p.label} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        <span className="text-[10px] truncate">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 5: Color Swatches Manager */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-400 uppercase font-bold block">
                    Product Available Colors ({formData.colors.length} selected)
                  </label>
                  <span className="text-[10px] text-slate-500">Click colors to toggle</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_COLORS.map((col) => {
                    const isSelected = formData.colors.some(
                      (c) => c.hex.toLowerCase() === col.hex.toLowerCase()
                    );
                    return (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => toggleColorSwatch(col)}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[11px] font-mono transition-all border ${
                          isSelected
                            ? 'bg-slate-900 border-lime-400 text-white shadow-xs'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-lime-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 6: Print Methods & Sizing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Supported Print Methods
                  </label>
                  <div className="space-y-1.5">
                    {ALL_PRINT_METHODS.map((pm) => {
                      const isChecked = formData.supportedMethods.includes(pm.id);
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => togglePrintMethod(pm.id)}
                          className={`w-full px-3 py-1.5 rounded-xl border text-left text-xs font-mono flex items-center justify-between transition-colors ${
                            isChecked
                              ? 'bg-lime-400/10 border-lime-400/40 text-lime-400'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{pm.label}</span>
                          {isChecked && <Check className="w-3.5 h-3.5 text-lime-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Available Sizes (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. S, M, L, XL, 2XL"
                    value={customSizesInput}
                    onChange={(e) => setCustomSizesInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none mb-2"
                  />
                  {/* Size chips */}
                  <div className="flex flex-wrap gap-1">
                    {['S, M, L, XL, 2XL', 'XS, S, M, L, XL, 2XL, 3XL', '11oz Standard', 'One Size (Adjustable)'].map(
                      (presetStr) => (
                        <button
                          key={presetStr}
                          type="button"
                          onClick={() => setCustomSizesInput(presetStr)}
                          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300"
                        >
                          {presetStr}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Row 7: Subtitle, Description & Tags */}
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Subtitle / Feature Highlights
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Combed Cotton • 240 GSM • Bio-Washed"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Full Description
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Describe product materials, wash care instructions, or printing advice..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none font-sans text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Search Tags & Keywords (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Streetwear, Heavyweight, Unisex, DTF"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-lime-400 text-slate-950 hover:bg-lime-300 text-xs font-mono font-black shadow-lg shadow-lime-400/20 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingProduct ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductsTab;
