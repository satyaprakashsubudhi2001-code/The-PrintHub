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
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MASTER_CALIBRATIONS } from '../../constants/printCalibration';
import { DEFAULT_PRESET_PRODUCTS } from '../../constants/products';

// Built-in 3D Models available for instant binding
const AVAILABLE_3D_MODELS = [
  { id: '/models/round-neck-tshirt.glb', label: 'Round Neck T-Shirt (Regular Fit)' },
  { id: '/models/oversized-tshirt.glb', label: 'Oversized Streetwear T-Shirt' },
  { id: '/models/polo-tshirt.glb', label: 'Classic Pique Polo T-Shirt' },
  { id: '/models/hoodie.glb', label: 'Heavyweight Pullover Hoodie' },
  { id: '/models/jersey.glb', label: 'Athletic Sports Jersey' },
  { id: '/models/cup.glb', label: 'Glossy Ceramic Coffee Mug' },
  { id: '/models/cap.glb', label: 'Structured Snapback Cap' },
  { id: '/models/apron.glb', label: 'Chef & Barista Kitchen Apron' },
  { id: '/models/mouse-pad.glb', label: 'Speed Edition Desk Mouse Pad' },
  { id: '/models/photo-frame.glb', label: 'Acrylic Desk Photo Frame' },
  { id: '/models/badge.glb', label: 'Custom Pin Button Badges' },
];

const CATEGORIES_LIST = [
  'Apparel',
  'Drinkware',
  'Headwear',
  'Accessories',
  'Sportswear',
  'Desk & Office',
  'Home & Decor',
];

const BADGE_OPTIONS = [
  'None',
  'Best Seller',
  '#1 Trending',
  'New Arrival',
  'Corporate Fav',
  'Winter Top Pick',
  'Limited Edition',
  'Top Rated',
];

export function AdminProductsTab() {
  const {
    products = [],
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    restorePresetProducts,
    selectProduct,
    navigateTo,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    variant: '',
    subtitle: '',
    description: '',
    category: 'Apparel',
    basePrice: 499,
    compareAtPrice: 799,
    badge: 'Best Seller',
    image: '',
    modelPath: '/models/round-neck-tshirt.glb',
    defaultColor: '#18181b',
    defaultSize: 'L',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    supportedMethods: ['dtf', 'screen_print', 'embroidery'],
    stock: 50,
  });

  const [customSizesInput, setCustomSizesInput] = useState('S, M, L, XL, 2XL');
  const [formError, setFormError] = useState('');

  // Open Modal for New Product
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    const newId = `product-${Date.now().toString(36)}`;
    setFormData({
      id: newId,
      name: '',
      variant: 'Standard Quality Fit',
      subtitle: '100% Premium Cotton • Custom HD-DTF Ready',
      description: 'High-density combed fabric with reinforced stitching for vibrant multi-color printing.',
      category: 'Apparel',
      basePrice: 499,
      compareAtPrice: 799,
      badge: 'New Arrival',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
      modelPath: '/models/round-neck-tshirt.glb',
      defaultColor: '#18181b',
      defaultSize: 'L',
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      supportedMethods: ['dtf', 'screen_print', 'embroidery'],
      stock: 50,
    });
    setCustomSizesInput('S, M, L, XL, 2XL');
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
      category: prod.category || 'Apparel',
      basePrice: prod.basePrice || 0,
      compareAtPrice: prod.compareAtPrice || 0,
      badge: prod.badge || 'None',
      image: prod.image || '',
      modelPath: prod.modelPath || '/models/round-neck-tshirt.glb',
      defaultColor: prod.defaultColor || '#18181b',
      defaultSize: prod.defaultSize || 'L',
      sizes: prod.sizes || ['S', 'M', 'L', 'XL', '2XL'],
      supportedMethods: prod.supportedMethods || ['dtf'],
      stock: prod.stock || 50,
    });
    setCustomSizesInput((prod.sizes || ['S', 'M', 'L', 'XL', '2XL']).join(', '));
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Handle Form Submit (Create or Update)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Product Name is required.');
      return;
    }
    if (!formData.id.trim()) {
      setFormError('Product SKU / ID is required.');
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

    const payload = {
      ...formData,
      sizes: parsedSizes.length > 0 ? parsedSizes : ['Standard'],
      basePrice: Number(formData.basePrice) || 0,
      compareAtPrice: Number(formData.compareAtPrice) || 0,
      stock: Number(formData.stock) || 0,
      rating: editingProduct?.rating || 4.9,
      reviewsCount: editingProduct?.reviewsCount || 120,
      categoryKey: formData.category.toLowerCase().replace(/\s+/g, '-'),
      badge: formData.badge === 'None' ? '' : formData.badge,
      printAreas: editingProduct?.printAreas || printAreas,
      defaultPrintArea: printAreas?.[0]?.id || 'center_chest',
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
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
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
    <div className="space-y-8 animate-in fade-in">
      {/* Top Header Metrics & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0c101d] border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-black font-mono uppercase">
              CATALOG MANAGEMENT
            </span>
            <span className="text-xs font-mono text-slate-400 font-bold">
              {products.length} Active Blanks in Database
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight">
            Customizable Product Catalog
          </h2>
          <p className="text-xs text-slate-400">
            Create, calibrate, edit, and configure all garments, drinkware, and merchandise for the 3D Customizer and storefront.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs font-mono uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Add New Product</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRestoreConfirm(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
            title="Populate pre-calibrated apparel & accessories templates"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Load Presets</span>
          </button>

          {products.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove All</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modals */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#0c101d] border border-rose-500/40 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-display">Remove All Products?</h3>
            <p className="text-xs text-slate-400">
              This will completely delete all {products.length} products from the catalog. Storefront and studio will be empty until new products are added.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllProducts();
                  setShowClearConfirm(false);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono"
              >
                Yes, Remove All
              </button>
            </div>
          </div>
        </div>
      )}

      {showRestoreConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#0c101d] border border-cyan-500/40 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-display">Load Pre-Calibrated Templates?</h3>
            <p className="text-xs text-slate-400">
              This will populate the catalog with 10 industry-standard blank templates (T-Shirts, Oversized Tees, Polos, Hoodies, Jerseies, Mugs, Caps, Aprons, Frames, Badges) complete with 3D models and print area coordinates.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRestoreConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  restorePresetProducts();
                  setShowRestoreConfirm(false);
                }}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black font-mono"
              >
                Load Template Blanks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0c101d] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
          {['ALL', ...CATEGORIES_LIST].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold tracking-wider shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-lime-400 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Products Table / Empty State */}
      <div className="rounded-3xl bg-[#0c101d] border border-slate-800 overflow-hidden shadow-2xl">
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <Box className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No Products in Catalog</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {products.length === 0
                  ? 'Your database is currently empty. You can add a new custom product from scratch or load pre-calibrated blanks in 1-click.'
                  : 'No products match your current search or category filter.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs font-mono uppercase shadow-md"
              >
                + Add First Product
              </button>
              {products.length === 0 && (
                <button
                  type="button"
                  onClick={() => setShowRestoreConfirm(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 hover:text-white text-xs font-mono font-bold"
                >
                  Load Blank Presets
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#0e1424] border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                <tr>
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Product Name & Variant</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Base Price</th>
                  <th className="py-3.5 px-4">Sizes & 3D Model</th>
                  <th className="py-3.5 px-4">Badge</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-900/50 transition-colors">
                    {/* Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center overflow-hidden">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                      </div>
                    </td>

                    {/* Name & ID */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">{prod.name}</span>
                      <span className="text-[10px] text-cyan-400 block">{prod.id}</span>
                      <span className="text-[11px] text-slate-400 font-sans truncate max-w-[220px] block">
                        {prod.subtitle || prod.variant}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px]">
                        {prod.category}
                      </span>
                    </td>

                    {/* Pricing */}
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-400 font-bold block">₹{prod.basePrice}</span>
                      {prod.compareAtPrice > prod.basePrice && (
                        <span className="text-[10px] text-slate-500 line-through block">
                          ₹{prod.compareAtPrice}
                        </span>
                      )}
                    </td>

                    {/* Sizes & 3D */}
                    <td className="py-3.5 px-4">
                      <span className="text-slate-300 text-[11px] block">
                        {prod.sizes?.length || 0} Sizes: {prod.sizes?.slice(0, 3).join(', ')}{prod.sizes?.length > 3 ? '...' : ''}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate max-w-[150px] block">
                        3D: {prod.modelPath?.split('/').pop() || 'None'}
                      </span>
                    </td>

                    {/* Badge */}
                    <td className="py-3.5 px-4">
                      {prod.badge ? (
                        <span className="px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30 text-[10px] font-bold">
                          {prod.badge}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[10px]">Standard</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            selectProduct(prod);
                            navigateTo('design-by-customer');
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 transition-colors"
                          title="Open in 3D Studio"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                          title="Edit Product Parameters"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================================
         ADD / EDIT PRODUCT MODAL (COMPREHENSIVE PARAMETERS)
         ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl bg-[#0c101d] border border-slate-800 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto my-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-lime-400 uppercase tracking-wider block">
                  {editingProduct ? 'EDIT PRODUCT' : 'CREATE NEW MERCHANDISE BLANK'}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white font-display uppercase mt-0.5">
                  {editingProduct ? editingProduct.name : 'Product Parameters Configuration'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-6 font-mono text-xs">
              {/* Row 1: Name & ID */}
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Variant / Fabric Knit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 220 GSM Cotton Matty"
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

              {/* Row 3: Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Compare at Price (MRP ₹)
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
                    Stock Quantity
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

              {/* Row 4: Image URL & 3D Model Path */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Product Photography Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    3D Model (.GLB) Rig Path *
                  </label>
                  <select
                    value={formData.modelPath}
                    onChange={(e) => setFormData({ ...formData, modelPath: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {AVAILABLE_3D_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>{m.label} ({m.id})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Available Sizes */}
              <div>
                <label className="text-slate-400 uppercase font-bold block mb-1.5">
                  Available Sizes (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. XS, S, M, L, XL, 2XL, 3XL"
                  value={customSizesInput}
                  onChange={(e) => setCustomSizesInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Row 6: Subtitle & Description */}
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Subtitle / Feature Highlights
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Combed Cotton • 180 GSM Single Jersey • Bio-Washed"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black uppercase tracking-wider font-display shadow-lg shadow-lime-400/20"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
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
