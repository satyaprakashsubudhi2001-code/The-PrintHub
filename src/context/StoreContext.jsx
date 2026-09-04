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
    name: 'Electric Indigo (Default)',
    accent: '#6366f1',
    gradient: 'from-indigo-500 via-indigo-600 to-cyan-500',
    hoverGradient: 'hover:from-indigo-600 hover:to-cyan-600',
    glow: 'shadow-glow-primary',
    textColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/40',
    bgBadge: 'bg-indigo-500/20',
  },
  {
    id: 'emerald_mint',
    name: 'Emerald Luxury',
    accent: '#10b981',
    gradient: 'from-emerald-500 via-teal-600 to-cyan-500',
    hoverGradient: 'hover:from-emerald-600 hover:to-cyan-600',
    glow: 'shadow-glow-emerald',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgBadge: 'bg-emerald-500/20',
  },
  {
    id: 'violet_rose',
    name: 'Cyber Violet & Pink',
    accent: '#8b5cf6',
    gradient: 'from-violet-500 via-purple-600 to-pink-500',
    hoverGradient: 'hover:from-violet-600 hover:to-pink-600',
    glow: 'shadow-glow-violet',
    textColor: 'text-violet-400',
    borderColor: 'border-violet-500/40',
    bgBadge: 'bg-violet-500/20',
  },
  {
    id: 'sapphire_blue',
    name: 'Royal Sapphire',
    accent: '#2563eb',
    gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    hoverGradient: 'hover:from-blue-700 hover:to-cyan-600',
    glow: 'shadow-glow-cyan',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/40',
    bgBadge: 'bg-blue-500/20',
  },
  {
    id: 'sunset_amber',
    name: 'Solar Amber & Gold',
    accent: '#f59e0b',
    gradient: 'from-amber-500 via-orange-600 to-rose-500',
    hoverGradient: 'hover:from-amber-600 hover:to-rose-600',
    glow: 'shadow-glow-primary',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgBadge: 'bg-amber-500/20',
  },
];

const StoreContext = createContext();

export function StoreProvider({ children }) {
  // Navigation Page State with URL Hash / Path resolution
  const getInitialPage = () => {
    if (typeof window === 'undefined') return 'home';
    const hash = window.location.hash.replace('#', '').replace(/^\//, '');
    const path = window.location.pathname.replace(/^\//, '');
    const route = hash || path;
    if (route === 'admin' || route === 'admin/dashboard') return 'admin';
    if (route === 'admin/login' || route === 'admin-login') return 'admin-login';
    if (['products', 'design-by-customer', 'high-selling', 'about-us', 'help'].includes(route)) {
      return route;
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);

  // UI Theme Mode: 'light' (Default) vs 'dark'
  const [themeMode, setThemeModeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('printhub_theme_mode') || 'light';
    }
    return 'light';
  });

  const setThemeMode = (mode) => {
    setThemeModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('printhub_theme_mode', mode);
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const toggleThemeMode = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (themeMode === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    }
  }, [themeMode]);

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

  // Product Catalog (Loaded from localStorage or initial presets)
  const [products, setProducts] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('printhub_custom_products');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_PRODUCTS;
  });

  // Ready-to-Buy Direct Catalog
  const [readyToBuyProducts, setReadyToBuyProducts] = useState(READY_TO_BUY_PRODUCTS);

  // Global Search & Category Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

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
      localStorage.setItem('printhub_custom_products', JSON.stringify(updatedList));
    }
  };

  const addProduct = useCallback((newProduct) => {
    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('printhub_custom_products', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const updateProduct = useCallback((productId, updatedFields) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === productId ? { ...p, ...updatedFields } : p));
      if (typeof window !== 'undefined') {
        localStorage.setItem('printhub_custom_products', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const deleteProduct = useCallback((productId) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('printhub_custom_products', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const clearAllProducts = useCallback(() => {
    setProducts([]);
    if (typeof window !== 'undefined') {
      localStorage.setItem('printhub_custom_products', JSON.stringify([]));
    }
  }, []);

  const restorePresetProducts = useCallback(() => {
    setProducts(DEFAULT_PRESET_PRODUCTS);
    if (typeof window !== 'undefined') {
      localStorage.setItem('printhub_custom_products', JSON.stringify(DEFAULT_PRESET_PRODUCTS));
    }
  }, []);

  // Active Customizer Product State (Safe fallback to first product or template)
  const defaultBlank = products && products.length > 0 ? products[0] : (DEFAULT_PRESET_PRODUCTS[0] || null);

  const [customizerProduct, setCustomizerProduct] = useState(defaultBlank);
  const [customizerColor, setCustomizerColor] = useState(defaultBlank?.defaultColor || '#18181b');
  const [selectedSize, setSelectedSize] = useState(defaultBlank?.defaultSize || 'L');
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

  // Navigation Helper
  const navigateTo = useCallback((page) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.location.hash = page === 'home' ? '' : page;
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

        // Discovery, Search & Wishlist
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        quickViewProduct,
        setQuickViewProduct,
        wishlist,
        toggleWishlist,
        isWishlisted,
        addReadyToBuyToCart,

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
