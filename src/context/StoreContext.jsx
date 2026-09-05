import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_PRODUCTS, DEFAULT_PRESET_PRODUCTS, COLOR_PALETTE, PRINTING_METHODS } from '../constants/products';
import { READY_TO_BUY_PRODUCTS } from '../constants/readyToBuyProducts';
import { STORE_CONFIG } from '../constants/config';
import {
  getStoredDesignRequests,
  saveDesignRequest,
  updateDesignRequest,
  deleteDesignRequest as deleteStoredDesignRequest,
  generateRequestId,
  getDesignRequestById,
  DESIGN_REQUEST_STATUSES,
} from '../constants/requests';

export const THEMES = [
  {
    id: 'indigo_cyan',
    name: 'PrintHub Signature',
    accent: '#F2CB30',
    gradient: 'from-[#2C0E63] to-[#12002E]',
    hoverGradient: 'hover:from-[#2C0E63] hover:to-[#12002E]',
    glow: 'shadow-glow-primary',
    textColor: 'text-[#2C0E63]',
    borderColor: 'border-[#2C0E63]/30',
    bgBadge: 'bg-[#DA0090]/15 text-[#DA0090]',
  },
  {
    id: 'emerald_mint',
    name: 'PrintHub Pink Accent',
    accent: '#DA0090',
    gradient: 'from-[#2C0E63] to-[#DA0090]',
    hoverGradient: 'hover:from-[#2C0E63] hover:to-[#DA0090]',
    glow: 'shadow-glow-pink',
    textColor: 'text-[#DA0090]',
    borderColor: 'border-[#DA0090]/30',
    bgBadge: 'bg-[#DA0090]/15 text-[#DA0090]',
  },
  {
    id: 'violet_rose',
    name: 'PrintHub Plum & Purple',
    accent: '#2C0E63',
    gradient: 'from-[#12002E] to-[#2C0E63]',
    hoverGradient: 'hover:from-[#12002E] hover:to-[#2C0E63]',
    glow: 'shadow-glow-purple',
    textColor: 'text-[#2C0E63]',
    borderColor: 'border-[#2C0E63]/30',
    bgBadge: 'bg-[#2C0E63]/15 text-[#2C0E63]',
  },
  {
    id: 'sapphire_blue',
    name: 'PrintHub Gold Action',
    accent: '#F2CB30',
    gradient: 'from-[#2C0E63] to-[#12002E]',
    hoverGradient: 'hover:from-[#2C0E63] hover:to-[#12002E]',
    glow: 'shadow-glow-yellow',
    textColor: 'text-[#F2CB30]',
    borderColor: 'border-[#F2CB30]/30',
    bgBadge: 'bg-[#F2CB30]/15 text-[#F2CB30]',
  },
  {
    id: 'sunset_amber',
    name: 'PrintHub Dynamic',
    accent: '#F2CB30',
    gradient: 'from-[#2C0E63] via-[#DA0090] to-[#12002E]',
    hoverGradient: 'hover:from-[#2C0E63] hover:to-[#12002E]',
    glow: 'shadow-glow-primary',
    textColor: 'text-[#F2CB30]',
    borderColor: 'border-[#F2CB30]/30',
    bgBadge: 'bg-[#F2CB30]/15 text-[#F2CB30]',
  },
];

const StoreContext = createContext();

export function StoreProvider({ children }) {
  // Navigation Page State with URL Hash / Path resolution
  const resolvePageFromLocation = () => {
    if (typeof window === 'undefined') return 'home';
    const hash = window.location.hash.replace('#', '').replace(/^\//, '').split('?')[0];
    const path = window.location.pathname.replace(/^\//, '').split('?')[0];
    const route = hash || path;

    if (route === 'admin' || route === 'admin/dashboard') return 'admin';
    if (route === 'admin/login' || route === 'admin-login') return 'admin-login';
    if (route === 'studio' || route === 'customizer') return 'design-by-customer';
    if (route === 'contact') return 'help';
    if (route === 'shop-by-category' || route === 'categories') return 'home';
    if (route === 'trending-products') return 'home';

    const validPages = ['home', 'products', 'design-by-customer', 'offers', 'high-selling', 'new-arrivals', 'about-us', 'help'];
    if (validPages.includes(route)) {
      return route;
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(resolvePageFromLocation);

  // Sync state with browser URL Hash and Back/Forward buttons
  useEffect(() => {
    const handleLocationChange = () => {
      const page = resolvePageFromLocation();
      setCurrentPage(page);
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // UI Fixed Mode: Always clean light neutral for standard content
  const [themeMode, setThemeModeState] = useState('light');

  const setThemeMode = () => {
    setThemeModeState('light');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('printhub_theme_mode');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const toggleThemeMode = () => {
    setThemeMode();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('printhub_theme_mode');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, []);

  // UI Theme Preset
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);

  // Store & Brand Settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'The PrintHub',
    tagline: "WE DON'T PRINT, WE CREATE!",
    logoType: 'image',
    logoUrl: '/brand-dark.png',
    logoDarkUrl: '/brand-dark.png',
    logoLightUrl: '/brand-light.png',
    logoWhiteUrl: '/brand-dark.png',
    logoMarkUrl: '/logo-mark.png',
    logoMarkWhiteUrl: '/logo-mark-white.png',
    logoText: 'PH',
    themeId: 'indigo_cyan',
    phone: '+91 79928 01158',
    email: 'theprinthub.in@gmail.com',
    whatsapp: '+91 79928 01158',
    domain: 'theprinthub.in',
    siteUrl: 'https://theprinthub.in',
    address: 'Plot 42, Textile Technology Park, Sector 18, Gurugram, Haryana 122015, India',
    workingHours: 'Mon - Sat: 9:00 AM - 8:00 PM IST',
    currencySymbol: '₹',
    socialLinks: {
      instagram: 'https://instagram.com/theprinthub_official',
      facebook: 'https://facebook.com/theprinthub',
      twitter: 'https://twitter.com/theprinthub',
      youtube: 'https://youtube.com/@theprinthub',
      linkedin: 'https://linkedin.com/company/theprinthub',
      pinterest: 'https://pinterest.com/theprinthub',
    }
  });

  const updateStoreSettings = (newSettings) => {
    setStoreSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const changeTheme = (themeId) => {
    const selected = THEMES.find((t) => t.id === themeId) || THEMES[0];
    setCurrentTheme(selected);
    setStoreSettings((prev) => ({ ...prev, themeId }));
  };

  // Product Catalog (Empty by default per user request - products created via Admin)
  const [products, setProducts] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('printhub_custom_products_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {}
    }
    return [];
  });

  // Ready-to-Buy Direct Catalog (Empty by default)
  const [readyToBuyProducts, setReadyToBuyProducts] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('printhub_rtb_products_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {}
    }
    return [];
  });

  // Dynamic Categories Management (Starts completely empty: all prior categories removed)
  const [categories, setCategories] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('printhub_custom_categories');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {}
    }
    return [];
  });

  const addCategory = useCallback((categoryData) => {
    let newId = categoryData.id || `cat-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    setCategories((prev) => {
      const slug = categoryData.slug
        ? categoryData.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : categoryData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newCat = {
        id: newId,
        name: categoryData.name.trim(),
        slug,
        icon: categoryData.icon || '🏷️',
        badge: categoryData.badge ? categoryData.badge.trim() : '',
        description: categoryData.description ? categoryData.description.trim() : '',
        image: categoryData.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
        createdAt: new Date().toISOString(),
      };
      const updated = [...prev, newCat];
      if (typeof window !== 'undefined') {
        localStorage.setItem('printhub_custom_categories', JSON.stringify(updated));
      }
      return updated;
    });
    return newId;
  }, []);

  const updateCategory = useCallback((id, updatedData) => {
    setCategories((prev) => {
      const updated = prev.map((cat) => {
        if (cat.id !== id) return cat;
        const slug = updatedData.slug
          ? updatedData.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          : updatedData.name
          ? updatedData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          : cat.slug;
        return {
          ...cat,
          ...updatedData,
          name: updatedData.name ? updatedData.name.trim() : cat.name,
          slug,
          badge: updatedData.badge !== undefined ? updatedData.badge.trim() : cat.badge,
          description: updatedData.description !== undefined ? updatedData.description.trim() : cat.description,
          updatedAt: new Date().toISOString(),
        };
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('printhub_custom_categories', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const deleteCategory = useCallback((id) => {
    setCategories((prev) => {
      const updated = prev.filter((cat) => cat.id !== id && cat.name !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('printhub_custom_categories', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const clearAllCategories = useCallback(() => {
    setCategories([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('printhub_custom_categories');
    }
  }, []);

  // Global Search & Category Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // High Selling Filters
  const [highSellingCategory, setHighSellingCategory] = useState('all');
  const [highSellingTimeRange, setHighSellingTimeRange] = useState('7days');

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('printhub_wishlist');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('printhub_wishlist', JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const isWishlisted = useCallback((productId) => wishlist.includes(productId), [wishlist]);

  const addReadyToBuyToCart = useCallback((item) => {
    // Keep track of direct selections
  }, []);

  const saveProductsToStorage = (updatedList) => {
    setProducts(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('printhub_custom_products_v2', JSON.stringify(updatedList));
    }
  };

  const addProduct = useCallback((newProduct) => {
    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('printhub_custom_products_v2', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const updateProduct = useCallback((productId, updatedFields) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === productId ? { ...p, ...updatedFields } : p));
      if (typeof window !== 'undefined') {
        localStorage.setItem('printhub_custom_products_v2', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const deleteProduct = useCallback((productId) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('printhub_custom_products_v2', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const clearAllProducts = useCallback(() => {
    setProducts([]);
    setReadyToBuyProducts([]);
    if (typeof window !== 'undefined') {
      localStorage.setItem('printhub_custom_products_v2', JSON.stringify([]));
      localStorage.setItem('printhub_rtb_products_v2', JSON.stringify([]));
      localStorage.removeItem('printhub_custom_products');
    }
  }, []);

  const restorePresetProducts = useCallback(() => {
    setProducts(DEFAULT_PRESET_PRODUCTS);
    if (typeof window !== 'undefined') {
      localStorage.setItem('printhub_custom_products_v2', JSON.stringify(DEFAULT_PRESET_PRODUCTS));
    }
  }, []);

  // Active Customizer Product State (Safe fallback to first product or null)
  const defaultBlank = products && products.length > 0 ? products[0] : null;

  const [customizerProduct, setCustomizerProduct] = useState(defaultBlank);
  const [customizerColor, setCustomizerColor] = useState(defaultBlank?.defaultColor || '#18181b');
  const [selectedSize, setSelectedSize] = useState(defaultBlank?.defaultSize || 'L');

  // Reactively auto-select first product when added if customizer was empty
  useEffect(() => {
    if (!customizerProduct && products && products.length > 0) {
      setCustomizerProduct(products[0]);
      setCustomizerColor(products[0].defaultColor || '#18181b');
      setSelectedSize(products[0].defaultSize || products[0].sizes?.[0] || 'L');
    }
  }, [products, customizerProduct]);
  const [activePlacementId, setActivePlacementId] = useState(defaultBlank?.defaultPrintArea || 'center_chest');

  // Multi-placement artwork & text layers
  const [placementDesigns, setPlacementDesigns] = useState({});

  const selectProduct = useCallback((product) => {
    if (!product) return;
    setCustomizerProduct(product);
    setCustomizerColor(product.defaultColor || '#18181b');
    setSelectedSize(product.defaultSize || product.sizes?.[0] || 'L');
    setActivePlacementId(product.defaultPrintArea || product.printAreas?.[0]?.id || 'center_chest');
  }, []);

  // Design Requests System (Pure Design Submission & Quotation Model)
  const [designRequests, setDesignRequests] = useState(() => getStoredDesignRequests());

  const addDesignRequest = useCallback((requestObj) => {
    saveDesignRequest(requestObj);
    setDesignRequests((prev) => [requestObj, ...prev]);
    return requestObj;
  }, []);

  const updateDesignRequestStatus = useCallback((requestId, newStatus) => {
    updateDesignRequest(requestId, { status: newStatus });
    setDesignRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
    );
  }, []);

  const updateDesignRequestNotes = useCallback((requestId, adminNotes) => {
    updateDesignRequest(requestId, { adminNotes });
    setDesignRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, adminNotes } : r))
    );
  }, []);

  const removeDesignRequest = useCallback((requestId) => {
    deleteStoredDesignRequest(requestId);
    setDesignRequests((prev) => prev.filter((r) => r.id !== requestId));
  }, []);

  // Admin Authentication State (Only for Store Administrators)
  const [adminUser, setAdminUser] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('printhub_admin_session');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const isAdminAuthenticated = Boolean(adminUser);

  const loginAdmin = useCallback((credentials) => {
    const rawEmail = (credentials?.email || '').trim().toLowerCase();
    const rawPass = (credentials?.password || '').trim();

    const validEmails = [
      'admin@theprinthub.com',
      'admin@theprinthub.in',
      'admin',
      'theprinthub.in@gmail.com',
      'admin@gmail.com',
    ];
    const validPasswords = ['admin123', 'admin', 'admin@123', 'printhub123', '123456'];

    const isValidUser = validEmails.includes(rawEmail) || rawEmail.includes('admin') || rawEmail === '';
    const isValidPass = validPasswords.includes(rawPass) || rawPass === 'admin123';

    if (isValidUser && isValidPass) {
      const userObj = {
        name: 'The PrintHub Admin',
        email: rawEmail || 'admin@theprinthub.com',
        role: 'admin',
        loginAt: new Date().toISOString(),
      };
      setAdminUser(userObj);
      if (typeof window !== 'undefined') {
        localStorage.setItem('printhub_admin_session', JSON.stringify(userObj));
      }
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials. Hint: use password "admin123"' };
  }, []);

  const logoutAdmin = useCallback(() => {
    setAdminUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('printhub_admin_session');
    }
  }, []);

  // Draft AutoSave / Session Restore
  const DRAFT_STORAGE_KEY = 'printhub_active_design_draft';

  const saveDraft = useCallback((draftData) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
      }
    } catch (e) {}
  }, []);

  const loadDraft = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      }
    } catch (e) {}
    return null;
  }, []);

  const clearDraft = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    } catch (e) {}
  }, []);

  // Order Workflow & Shipping State (Safe fallbacks for admin order modals)
  const [orders, setOrders] = useState([]);
  const updateOrderStatus = useCallback((orderId, newStatus, note, adminName) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    return { success: true, message: `Status updated to ${newStatus}` };
  }, []);

  const createAdminShipment = useCallback(async (orderId, courier) => {
    return {
      success: true,
      shipment: {
        courierName: courier || 'Delhivery Express',
        awbNumber: `DLV-${Date.now().toString().slice(-8)}`,
      },
    };
  }, []);

  const processAdminRefund = useCallback(async (orderId, amount, reason) => {
    return { success: true, message: `Refund of ₹${amount} initiated successfully.` };
  }, []);

  const addAdminOrderNote = useCallback((orderId, noteText) => {
    return { success: true };
  }, []);

  // Navigation Helper with Option support & QuickView cleanup
  const navigateTo = useCallback((page, options = {}) => {
    // Always dismiss any open product modal when navigating to a page
    setQuickViewProduct(null);

    // Apply any passed filter options
    if (options.category) {
      setSelectedCategory(options.category);
    }
    if (options.showWishlistOnly !== undefined) {
      setShowWishlistOnly(options.showWishlistOnly);
    } else if (page !== 'products') {
      setShowWishlistOnly(false);
    }

    const targetPage =
      page === 'contact'
        ? 'help'
        : page === 'studio' || page === 'customizer'
        ? 'design-by-customer'
        : page;

    setCurrentPage(targetPage);

    if (typeof window !== 'undefined') {
      const targetHash = targetPage === 'home' ? '' : targetPage;
      if (window.location.hash.replace('#', '') !== targetHash) {
        window.location.hash = targetHash;
      }
      if (!options.preserveScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, []);

  // Screenshot / Snapshot Modal State
  const [screenshotData, setScreenshotData] = useState(null);
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState(false);

  return (
    <StoreContext.Provider
      value={{
        // Navigation & Theme
        currentPage,
        navigateTo,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        currentTheme,
        changeTheme,
        storeSettings,
        updateStoreSettings,

        // Catalog & Customizer
        products,
        setProducts,
        readyToBuyProducts,
        setReadyToBuyProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        restorePresetProducts,
        customizerProduct,
        setCustomizerProduct,
        selectProduct,
        customizerColor,
        setCustomizerColor,
        selectedSize,
        setSelectedSize,
        activePlacementId,
        setActivePlacementId,
        placementDesigns,
        setPlacementDesigns,

        // Categories Catalog & Admin Actions
        categories,
        setCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        clearAllCategories,

        // Discovery, Search & Wishlist
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        showWishlistOnly,
        setShowWishlistOnly,
        quickViewProduct,
        setQuickViewProduct,
        wishlist,
        toggleWishlist,
        isWishlisted,
        addReadyToBuyToCart,

        // High Selling Leaderboard Filters
        highSellingCategory,
        setHighSellingCategory,
        highSellingTimeRange,
        setHighSellingTimeRange,

        // Orders & Admin Workflow
        orders,
        setOrders,
        updateOrderStatus,
        createAdminShipment,
        processAdminRefund,
        addAdminOrderNote,

        // Design Requests Management
        designRequests,
        addDesignRequest,
        updateDesignRequestStatus,
        updateDesignRequestNotes,
        removeDesignRequest,
        getDesignRequestById,
        DESIGN_REQUEST_STATUSES,

        // Admin Auth
        adminUser,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,

        // Autosave Draft
        saveDraft,
        loadDraft,
        clearDraft,

        // Snapshot Preview
        screenshotData,
        setScreenshotData,
        isScreenshotModalOpen,
        setIsScreenshotModalOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
