import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_PRODUCTS, COLOR_PALETTE, PRINTING_METHODS } from '../constants/products';
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

  // UI Theme Mode: 'dark' (Default) vs 'light'
  const [themeMode, setThemeModeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('printhub_theme_mode') || 'dark';
    }
    return 'dark';
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
    tagline: 'Custom Merch & Product Design Studio',
    logoType: 'badge',
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

  // Product Catalog
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // Active Customizer Product State
  const [customizerProduct, setCustomizerProduct] = useState(INITIAL_PRODUCTS[0]);
  const [customizerColor, setCustomizerColor] = useState(INITIAL_PRODUCTS[0].defaultColor);
  const [selectedSize, setSelectedSize] = useState(INITIAL_PRODUCTS[0].defaultSize || 'L');
  const [activePlacementId, setActivePlacementId] = useState(INITIAL_PRODUCTS[0].defaultPrintArea || 'center_chest');

  // Multi-placement artwork & text layers: { [placementId]: { dataUrl, fileName, widthInches, heightInches, xInches, yInches, rotation, aspect, maxAreaW, maxAreaH, surface, text, font, textColor } }
  const [placementDesigns, setPlacementDesigns] = useState({});

  const selectProduct = useCallback((product) => {
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

  const loginAdmin = useCallback((credentials) => {
    const adminEmail = STORE_CONFIG.adminCredentials?.email || 'admin@theprinthub.com';
    const adminPass = STORE_CONFIG.adminCredentials?.password || 'admin123';

    if (credentials.email === adminEmail && credentials.password === adminPass) {
      const userObj = {
        name: 'The PrintHub Admin',
        email: adminEmail,
        role: 'SUPER_ADMIN',
        loginAt: new Date().toISOString(),
      };
      setAdminUser(userObj);
      if (typeof window !== 'undefined') {
        localStorage.setItem('printhub_admin_session', JSON.stringify(userObj));
      }
      return { success: true };
    }
    return { success: false, message: 'Invalid administrator credentials' };
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
