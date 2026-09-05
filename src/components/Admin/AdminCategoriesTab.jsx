import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Layers,
  Sparkles,
  Image as ImageIcon,
  AlertCircle,
  FolderPlus,
  Grid,
  List,
  ArrowUpRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

// Curated royalty-free visual image presets for 1-click category creation
const PRESET_CATEGORY_IMAGES = [
  {
    label: 'T-Shirts & Apparel',
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    icon: '👕',
  },
  {
    label: 'Oversized Streetwear',
    url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80',
    icon: '⚡',
  },
  {
    label: 'Hoodies & Sweatshirts',
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    icon: '🧥',
  },
  {
    label: 'Polo & Collared',
    url: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=600&q=80',
    icon: '👔',
  },
  {
    label: 'Drinkware & Mugs',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    icon: '☕',
  },
  {
    label: 'Caps & Headwear',
    url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
    icon: '🧢',
  },
  {
    label: 'Badges & Pins',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    icon: '🎖️',
  },
  {
    label: 'Kitchen & Aprons',
    url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80',
    icon: '🍳',
  },
  {
    label: 'Desk & Accessories',
    url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
    icon: '💻',
  },
];

const EMOJI_PRESETS = ['👕', '⚡', '🧥', '👔', '☕', '🧢', '🎖️', '🍳', '💻', '🎨', '🏷️', '💎', '📦', '✨', '🔥', '👟'];

const BADGE_PRESETS = ['None', 'Best Seller', 'New Drop', 'Trending', 'Hot', 'Corporate Pick', 'Limited'];

export function AdminCategoriesTab() {
  const {
    categories = [],
    addCategory,
    updateCategory,
    deleteCategory,
    clearAllCategories,
    products = [],
    readyToBuyProducts = [],
    navigateTo,
    setSelectedCategory,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formError, setFormError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '👕',
    badge: '',
    description: '',
    image: PRESET_CATEGORY_IMAGES[0].url,
  });

  // Calculate product counts for each category
  const allCatalogProducts = useMemo(() => {
    return [...products, ...(readyToBuyProducts || [])];
  }, [products, readyToBuyProducts]);

  const categoryProductCounts = useMemo(() => {
    const counts = {};
    allCatalogProducts.forEach((prod) => {
      const catName = (prod.category || '').toLowerCase();
      const catKey = (prod.categoryKey || '').toLowerCase();
      categories.forEach((cat) => {
        const targetName = cat.name.toLowerCase();
        const targetSlug = (cat.slug || '').toLowerCase();
        if (catName === targetName || catKey === targetSlug || catName === targetSlug) {
          counts[cat.id] = (counts[cat.id] || 0) + 1;
        }
      });
    });
    return counts;
  }, [allCatalogProducts, categories]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.slug && c.slug.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.badge && c.badge.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

  // Open modal to add category
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      icon: '👕',
      badge: '',
      description: '',
      image: PRESET_CATEGORY_IMAGES[0].url,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal to edit category
  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      icon: cat.icon || '🏷️',
      badge: cat.badge || '',
      description: cat.description || '',
      image: cat.image || PRESET_CATEGORY_IMAGES[0].url,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Name change handler with auto-slugification
  const handleNameChange = (val) => {
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: editingCategory ? prev.slug : autoSlug,
    }));
  };

  // Form submit handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Category Name is required.');
      return;
    }

    const finalSlug = formData.slug.trim()
      ? formData.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check duplicate slug
    const duplicate = categories.find(
      (c) => c.slug === finalSlug && (!editingCategory || c.id !== editingCategory.id)
    );
    if (duplicate) {
      setFormError(`A category with identifier "${finalSlug}" already exists.`);
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formData.name.trim(),
        slug: finalSlug,
        icon: formData.icon,
        badge: formData.badge === 'None' ? '' : formData.badge,
        description: formData.description,
        image: formData.image.trim() || PRESET_CATEGORY_IMAGES[0].url,
      });
    } else {
      addCategory({
        name: formData.name.trim(),
        slug: finalSlug,
        icon: formData.icon,
        badge: formData.badge === 'None' ? '' : formData.badge,
        description: formData.description,
        image: formData.image.trim() || PRESET_CATEGORY_IMAGES[0].url,
      });
    }

    setIsModalOpen(false);
  };

  // Handle delete category
  const handleDeleteCategory = (catId) => {
    deleteCategory(catId);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in select-none">
      {/* =========================================================================
         1. TOP TOOLBAR & CONTROLS
         ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#0c101d] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-lime-400/20 text-lime-400 border border-lime-400/30">
              <Layers className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-lime-400 uppercase tracking-wider">
              Category Taxonomy
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
              {categories.length} {categories.length === 1 ? 'CATEGORY' : 'CATEGORIES'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight mt-1">
            Storefront & Blank Categories
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-2xl">
            Configure custom merchandise categories. Created categories automatically propagate to the Customer Home Carousel, Products Filter Sidebar, and Product Creator.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {categories.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-mono font-bold transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>CLEAR ALL</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-400 text-slate-950 hover:bg-lime-300 text-xs font-mono font-black shadow-lg shadow-lime-400/20 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>CREATE NEW CATEGORY</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Clearing All Categories */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0c101d] border border-rose-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-display font-black text-lg text-white uppercase">Remove All Categories?</h3>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              This will remove all {categories.length} categories from the storefront and filters. Products will remain safe in your catalog.
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
                  clearAllCategories();
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
         2. SEARCH & VIEW CONTROLS (when categories exist)
         ========================================================================= */}
      {categories.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0c101d] border border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search category name, slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:border-lime-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl border text-xs font-mono transition-all ${
                viewMode === 'grid'
                  ? 'bg-lime-400/20 text-lime-400 border-lime-400/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl border text-xs font-mono transition-all ${
                viewMode === 'table'
                  ? 'bg-lime-400/20 text-lime-400 border-lime-400/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
         3. EMPTY STATE (When no categories exist)
         ========================================================================= */}
      {categories.length === 0 && (
        <div className="p-12 sm:p-16 rounded-3xl bg-[#0c101d] border border-slate-800/80 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 shadow-inner">
            <FolderPlus className="w-10 h-10 stroke-[1.5]" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight">
              No Categories Created Yet
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              All previous default categories have been removed. You have complete control to create custom categories with tailored names, icons, images, and badges.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-lime-400 text-slate-950 hover:bg-lime-300 font-mono font-black text-xs uppercase tracking-wider shadow-xl shadow-lime-400/20 transition-transform cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>CREATE FIRST CATEGORY</span>
            </button>
          </div>

          {/* Quick Starter Inspiration */}
          <div className="pt-8 border-t border-slate-800/60 max-w-xl mx-auto">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Quick Preset Inspiration (Click to prefill)
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PRESET_CATEGORY_IMAGES.slice(0, 5).map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setFormData({
                      name: preset.label,
                      slug: preset.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                      icon: preset.icon,
                      badge: 'New',
                      description: `Premium quality custom printed ${preset.label.toLowerCase()} collection.`,
                      image: preset.url,
                    });
                    setFormError('');
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-lime-400/40 text-slate-300 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5"
                >
                  <span>{preset.icon}</span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         4. GRID VIEW
         ========================================================================= */}
      {categories.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((cat) => {
            const prodCount = categoryProductCounts[cat.id] || 0;
            return (
              <div
                key={cat.id}
                className="group rounded-2xl bg-[#0c101d] border border-slate-800 hover:border-lime-400/40 transition-all flex flex-col overflow-hidden hover:shadow-xl hover:shadow-lime-400/5"
              >
                {/* Cover Image & Overlays */}
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-transparent to-black/40" />

                  {/* Icon badge */}
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/80 flex items-center justify-center text-xl shadow-lg">
                    {cat.icon || '🏷️'}
                  </div>

                  {/* Optional status badge */}
                  {cat.badge && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-lime-400/90 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow">
                      {cat.badge}
                    </div>
                  )}

                  {/* Slug tag bottom left */}
                  <div className="absolute bottom-2 left-3">
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-cyan-300 border border-cyan-400/30">
                      #{cat.slug || cat.id}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-display font-black text-base text-white uppercase group-hover:text-lime-400 transition-colors">
                      {cat.name}
                    </h3>
                    {cat.description ? (
                      <p className="text-xs text-slate-400 font-sans mt-1 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 italic font-sans mt-1">
                        No description provided.
                      </p>
                    )}
                  </div>

                  {/* Metadata & Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-lime-400"></span>
                      <span>{prodCount} Products</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(cat)}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {deleteConfirmId === cat.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="px-2 py-1 rounded-lg bg-rose-500 text-white text-[10px] font-mono font-bold hover:bg-rose-600 shadow"
                            title="Confirm Delete"
                          >
                            YES
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-mono hover:text-white"
                          >
                            NO
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(cat.id)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
         5. TABLE VIEW
         ========================================================================= */}
      {categories.length > 0 && viewMode === 'table' && (
        <div className="rounded-2xl bg-[#0c101d] border border-slate-800 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Preview</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug / ID</th>
                <th className="py-3 px-4">Badge</th>
                <th className="py-3 px-4">Products</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCategories.map((cat) => {
                const prodCount = categoryProductCounts[cat.id] || 0;
                return (
                  <tr key={cat.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden relative">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 right-0 text-xs p-0.5 bg-black/60 rounded">
                          {cat.icon || '🏷️'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      <div>{cat.name}</div>
                      {cat.description && (
                        <div className="text-[10px] text-slate-400 font-sans truncate max-w-xs font-normal">
                          {cat.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-cyan-300 font-mono">#{cat.slug || cat.id}</td>
                    <td className="py-3 px-4">
                      {cat.badge ? (
                        <span className="px-2 py-0.5 rounded bg-lime-400/20 text-lime-400 border border-lime-400/30 text-[10px] font-bold">
                          {cat.badge}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-lime-400 font-bold">{prodCount}</span> items
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {deleteConfirmId === cat.id ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="px-2 py-1 rounded bg-rose-500 text-white text-[10px] font-bold"
                            >
                              YES
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px]"
                            >
                              NO
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(cat.id)}
                            className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================
         6. ADD / EDIT CATEGORY MODAL
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0c101d] border border-slate-800 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto my-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-lime-400 uppercase tracking-wider block">
                  {editingCategory ? 'EDIT CATEGORY' : 'CREATE CATEGORY'}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white font-display uppercase mt-0.5">
                  {editingCategory ? editingCategory.name : 'Configure Category Parameters'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5 font-mono text-xs">
              {/* Row 1: Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oversized T-Shirts"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-lime-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Slug / Unique Key
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. oversized-tshirts"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 font-sans block mt-1">
                    Used for internal URL routing and filter indexing.
                  </span>
                </div>
              </div>

              {/* Row 2: Icon & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Emoji / Icon
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center w-12 h-12">
                      {formData.icon || '🏷️'}
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. 👕"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-lime-400 focus:outline-none"
                    />
                  </div>
                  {/* Preset Emojis */}
                  <div className="flex flex-wrap gap-1">
                    {EMOJI_PRESETS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: emoji })}
                        className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                          formData.icon === emoji
                            ? 'bg-lime-400 text-slate-950 font-bold scale-110'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1.5">
                    Badge / Tag (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Best Seller, Trending, New"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-lime-400 focus:outline-none mb-2"
                  />
                  {/* Preset Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {BADGE_PRESETS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setFormData({ ...formData, badge: b === 'None' ? '' : b })}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                          (b === 'None' && !formData.badge) || formData.badge === b
                            ? 'bg-lime-400/20 text-lime-400 border border-lime-400/40 font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Cover Image */}
              <div>
                <label className="text-slate-400 uppercase font-bold block mb-1.5">
                  Cover Image URL
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start mb-3">
                  <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 relative">
                    <img
                      src={formData.image || PRESET_CATEGORY_IMAGES[0].url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = PRESET_CATEGORY_IMAGES[0].url;
                      }}
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-lime-400 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 font-sans block">
                      Choose from curated visual presets below or paste an image URL.
                    </span>
                  </div>
                </div>

                {/* Preset image selector */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">
                    Quick Preset Visuals:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {PRESET_CATEGORY_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            image: preset.url,
                            icon: prev.icon || preset.icon,
                          }))
                        }
                        className={`group relative rounded-xl border overflow-hidden p-1 text-left transition-all ${
                          formData.image === preset.url
                            ? 'border-lime-400 bg-lime-400/10 shadow-md'
                            : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                        }`}
                      >
                        <div className="aspect-video rounded-lg overflow-hidden relative">
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 right-1 text-xs">{preset.icon}</span>
                        </div>
                        <span className="text-[10px] font-sans truncate block text-slate-300 group-hover:text-white mt-1">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 4: Description */}
              <div>
                <label className="text-slate-400 uppercase font-bold block mb-1.5">
                  Description / Subtitle
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Ultra-heavyweight combed French terry loopknit cotton with high-density HD-DTF curing."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-lime-400 focus:outline-none resize-none font-sans text-xs"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-lime-400 text-slate-950 hover:bg-lime-300 text-xs font-mono font-black shadow-lg shadow-lime-400/20"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingCategory ? 'UPDATE CATEGORY' : 'SAVE CATEGORY'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategoriesTab;
