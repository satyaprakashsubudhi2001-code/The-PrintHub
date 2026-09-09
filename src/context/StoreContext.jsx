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
import {
  DB_KEYS,
  INITIAL_HOMEPAGE_CONTENT,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CONTACT_SETTINGS,
  INITIAL_INVENTORY,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_ORDERS,
  INITIAL_EXPENSES,
  INITIAL_CUSTOMERS,
  INITIAL_AUDIT_LOGS,
  ADMIN_ROLES,
  computeFinancialOverview,
  loadAdminDatabase,
  saveAdminData,
} from '../services/adminDb';

export const THEMES = [
  {
    id: 'printhub_atelier',
    name: 'PrintHub Atelier Dark Green',
    accent: '#E5C690',
    gradient: 'from-[#183630] to-[#183630]',
    hoverGradient: 'hover:from-[#183630] hover:to-[#183630]',
    glow: 'shadow-lg',
    textColor: 'text-[#E5DAC9]',
    borderColor: 'border-[#B8A98F]/40',
    bgBadge: 'bg-[#E5C690]/20 text-[#183630]',
  },
  {
    id: 'printhub_gold',
    name: 'PrintHub Soft Gold',
    accent: '#E5C690',
    gradient: 'from-[#E5C690] to-[#B8A98F]',
    hoverGradient: 'hover:from-[#E5C690] hover:to-[#B8A98F]',
    glow: 'shadow-md',
    textColor: 'text-[#183630]',
    borderColor: 'border-[#B8A98F]/60',
    bgBadge: 'bg-[#183630]/10 text-[#183630]',
  },
  {
    id: 'printhub_beige',
    name: 'PrintHub Classic Beige',
    accent: '#183630',
    gradient: 'from-[#E5DAC9] to-[#E5DAC9]',
    hoverGradient: 'hover:from-[#E5DAC9] hover:to-[#E5DAC9]',
    glow: 'shadow-sm',
    textColor: 'text-[#183630]',
    borderColor: 'border-[#B8A98F]',
    bgBadge: 'bg-[#183630] text-[#E5DAC9]',
  },
  {
    id: 'printhub_taupe',
    name: 'PrintHub Taupe Highlight',
    accent: '#B8A98F',
    gradient: 'from-[#183630] to-[#183630]',
    hoverGradient: 'hover:from-[#183630] hover:to-[#183630]',
    glow: 'shadow-md',
    textColor: 'text-[#E5DAC9]',
    borderColor: 'border-[#E5C690]/40',
    bgBadge: 'bg-[#B8A98F]/20 text-[#183630]',
  },
];

export const DEFAULT_8_CATEGORIES = [
  {
    id: 'cat-custom-tshirts',
    name: 'Custom T-Shirts',
    slug: 'custom-t-shirts',
    icon: '👕',
    badge: 'Popular',
    description: 'Round-neck & oversized 100% cotton custom printed tees.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-hoodies',
    name: 'Hoodies',
    slug: 'hoodies',
    icon: '🧥',
    badge: 'Fleece',
    description: 'Heavyweight fleece hoodies with custom chest and back graphics.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-mugs',
    name: 'Mugs',
    slug: 'mugs',
    icon: '☕',
    badge: 'Drinkware',
    description: 'Ceramic coffee mugs with dishwasher-safe vibrant photo printing.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-business-cards',
    name: 'Business Cards',
    slug: 'business-cards',
    icon: '📇',
    badge: 'Stationery',
    description: 'Premium visiting cards with velvet matte and spot UV options.',
    image: 'https://images.unsplash.com/photo-1589330694653-dad6ef0140be?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-photo-frames',
    name: 'Photo Frames',
    slug: 'photo-frames',
    icon: '🖼️',
    badge: 'Wall Art',
    description: 'High-clarity acrylic and wooden frames for custom photography.',
    image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-stickers',
    name: 'Stickers',
    slug: 'stickers',
    icon: '🏷️',
    badge: 'Die-Cut Vinyl',
    description: 'Waterproof, scratch-proof vinyl stickers and laptop decals.',
    image: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-custom-gifts',
    name: 'Custom Gifts',
    slug: 'custom-gifts',
    icon: '🎁',
    badge: 'Keepsakes',
    description: 'Personalized anniversary, birthday, and special celebration gifts.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-promotional-products',
    name: 'Promotional Products',
    slug: 'promotional-products',
    icon: '📦',
    badge: 'Corporate',
    description: 'Lanyards, tote bags, caps, and branded promotional merchandise.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString(),
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
    if (route === 'studio' || route === 'customizer' || route === 'custom-printing') return 'design-by-customer';
    if (route === 'contact') return 'help';
    if (route === 'about') return 'about-us';
    if (route === 'shop') return 'products';
    if (route === 'bulk' || route === 'bulk-orders') return 'bulk-orders';
    if (route === 'shop-by-category' || route === 'categories') return 'home';
    if (route === 'trending-products') return 'home';

    const validPages = ['home', 'products', 'design-by-customer', 'bulk-orders', 'offers', 'high-selling', 'new-arrivals', 'about-us', 'help'];
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

  // Product Catalog (Defaults to pre-calibrated products if empty)
  const [products, setProducts] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('printhub_custom_products_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_PRESET_PRODUCTS || [];
  });

  // Ready-to-Buy Direct Catalog
  const [readyToBuyProducts, setReadyToBuyProducts] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('printhub_rtb_products_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return [];
  });

  // Dynamic Categories Management (Defaults to the 8 core brand categories)
  const [categories, setCategories] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('printhub_custom_categories');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_8_CATEGORIES;
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

  // Load initial unified admin data from localStorage / adminDb
  const [adminDbState] = useState(() => loadAdminDatabase());

  const [homepageContent, setHomepageContent] = useState(
    () => adminDbState.homepage || { draft: INITIAL_HOMEPAGE_CONTENT, published: INITIAL_HOMEPAGE_CONTENT }
  );
  const [announcements, setAnnouncements] = useState(
    () => adminDbState.announcements || INITIAL_ANNOUNCEMENTS
  );

  const normalizeContactSettings = (raw) => {
    if (!raw) return INITIAL_CONTACT_SETTINGS;
    const resolve = (val, fallback = '') => {
      if (!val) return fallback;
      if (typeof val === 'string') return val;
      if (typeof val === 'object') return val.value || val.url || fallback;
      return String(val);
    };
    return {
      whatsapp: resolve(raw.whatsapp, INITIAL_CONTACT_SETTINGS.whatsapp),
      whatsappCatalog: resolve(raw.whatsappCatalog, INITIAL_CONTACT_SETTINGS.whatsappCatalog),
      instagram: resolve(raw.instagram, INITIAL_CONTACT_SETTINGS.instagram),
      facebook: resolve(raw.facebook, INITIAL_CONTACT_SETTINGS.facebook),
      gmail: resolve(raw.gmail, INITIAL_CONTACT_SETTINGS.gmail),
      googleMaps: resolve(raw.googleMaps, INITIAL_CONTACT_SETTINGS.googleMaps),
      phone: resolve(raw.phone, INITIAL_CONTACT_SETTINGS.phone),
      email: resolve(raw.email, INITIAL_CONTACT_SETTINGS.email),
      address: resolve(raw.address, INITIAL_CONTACT_SETTINGS.address),
      hours: resolve(raw.hours || raw.supportHours, INITIAL_CONTACT_SETTINGS.hours || 'Mon - Sat: 9:00 AM - 8:00 PM IST'),
      slaGuarantee: resolve(raw.slaGuarantee, INITIAL_CONTACT_SETTINGS.slaGuarantee),
    };
  };

  const [contactSettings, setContactSettings] = useState(
    () => normalizeContactSettings(adminDbState.contactSettings)
  );
  const [inventory, setInventory] = useState(
    () => adminDbState.inventory || INITIAL_INVENTORY
  );
  const [stockMovements, setStockMovements] = useState(
    () => adminDbState.stockMovements || INITIAL_STOCK_MOVEMENTS
  );
  const [expenses, setExpenses] = useState(
    () => adminDbState.expenses || INITIAL_EXPENSES
  );
  const [customers, setCustomers] = useState(
    () => adminDbState.customers || INITIAL_CUSTOMERS
  );
  const [auditLogs, setAuditLogs] = useState(
    () => adminDbState.auditLogs || INITIAL_AUDIT_LOGS
  );
  const [adminRole, setAdminRole] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(DB_KEYS.ACTIVE_ROLE);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed === 'string' && ADMIN_ROLES[parsed]) {
            return ADMIN_ROLES[parsed];
          }
          if (parsed && typeof parsed === 'object' && parsed.id && ADMIN_ROLES[parsed.id]) {
            return ADMIN_ROLES[parsed.id];
          }
          if (parsed && typeof parsed === 'object' && parsed.name) {
            return parsed;
          }
        }
      } catch (e) {}
    }
    return ADMIN_ROLES.SUPER_ADMIN;
  });

  // Orders State (defaults to initialDb.orders)
  const [orders, setOrders] = useState(() => {
    if (adminDbState.orders && adminDbState.orders.length > 0) return adminDbState.orders;
    return INITIAL_ORDERS;
  });

  // 1. Audit Logging Action
  const logAdminActivity = useCallback((action, section, record, oldValue, newValue) => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      admin: adminUser?.email || 'admin@theprinthub.com',
      action,
      section,
      record: String(record || ''),
      oldValue: String(oldValue || ''),
      newValue: String(newValue || ''),
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => {
      const updated = [newLog, ...prev.slice(0, 199)];
      saveAdminData(DB_KEYS.AUDIT_LOGS, updated);
      return updated;
    });
  }, [adminUser]);

  // 2. Homepage CMS Draft & Publish Actions
  const saveHomepageDraft = useCallback((sectionKey, sectionData) => {
    setHomepageContent((prev) => {
      const updated = {
        ...prev,
        draft: {
          ...prev.draft,
          [sectionKey]: {
            ...prev.draft[sectionKey],
            ...sectionData,
          },
        },
      };
      saveAdminData(DB_KEYS.HOMEPAGE, updated);
      logAdminActivity('HOMEPAGE_DRAFT_SAVED', sectionKey, sectionKey, 'Previous Draft', 'Updated Draft');
      return updated;
    });
  }, [logAdminActivity]);

  const publishHomepageSection = useCallback((sectionKey) => {
    setHomepageContent((prev) => {
      const targetDraft = prev.draft[sectionKey];
      const updated = {
        ...prev,
        published: {
          ...prev.published,
          [sectionKey]: targetDraft,
        },
      };
      saveAdminData(DB_KEYS.HOMEPAGE, updated);
      logAdminActivity('HOMEPAGE_SECTION_PUBLISHED', sectionKey, sectionKey, 'Published', JSON.stringify(targetDraft).slice(0, 50));
      return updated;
    });
  }, [logAdminActivity]);

  const publishAllHomepageDrafts = useCallback(() => {
    setHomepageContent((prev) => {
      const updated = {
        ...prev,
        published: { ...prev.draft },
      };
      saveAdminData(DB_KEYS.HOMEPAGE, updated);
      logAdminActivity('HOMEPAGE_ALL_PUBLISHED', 'All Homepage Sections', 'all', 'Drafts', 'Live Storefront');
      return updated;
    });
  }, [logAdminActivity]);

  const revertHomepageDraft = useCallback((sectionKey) => {
    setHomepageContent((prev) => {
      const publishedVersion = prev.published[sectionKey];
      const updated = {
        ...prev,
        draft: {
          ...prev.draft,
          [sectionKey]: publishedVersion,
        },
      };
      saveAdminData(DB_KEYS.HOMEPAGE, updated);
      logAdminActivity('HOMEPAGE_DRAFT_REVERTED', sectionKey, sectionKey, 'Draft', 'Reverted to Published');
      return updated;
    });
  }, [logAdminActivity]);

  // 3. Announcements Management Actions
  const addAnnouncement = useCallback((announcementData) => {
    setAnnouncements((prev) => {
      const newAnn = {
        id: announcementData.id || `ann-${Date.now().toString(36)}`,
        text: announcementData.text || '',
        highlight: announcementData.highlight || '',
        badge: announcementData.badge || 'PROMO',
        route: announcementData.route || 'products',
        enabled: announcementData.enabled !== false,
        priority: announcementData.priority || prev.length + 1,
        startDate: announcementData.startDate || '',
        endDate: announcementData.endDate || '',
      };
      const updated = [...prev, newAnn];
      saveAdminData(DB_KEYS.ANNOUNCEMENTS, updated);
      logAdminActivity('ANNOUNCEMENT_ADDED', 'Announcements', newAnn.id, '', newAnn.text);
      return updated;
    });
  }, [logAdminActivity]);

  const updateAnnouncement = useCallback((id, updatedFields) => {
    setAnnouncements((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, ...updatedFields } : a));
      saveAdminData(DB_KEYS.ANNOUNCEMENTS, updated);
      logAdminActivity('ANNOUNCEMENT_UPDATED', 'Announcements', id, 'Existing', JSON.stringify(updatedFields).slice(0, 40));
      return updated;
    });
  }, [logAdminActivity]);

  const deleteAnnouncement = useCallback((id) => {
    setAnnouncements((prev) => {
      const target = prev.find((a) => a.id === id);
      const updated = prev.filter((a) => a.id !== id);
      saveAdminData(DB_KEYS.ANNOUNCEMENTS, updated);
      logAdminActivity('ANNOUNCEMENT_DELETED', 'Announcements', id, target?.text || '', 'Deleted');
      return updated;
    });
  }, [logAdminActivity]);

  const reorderAnnouncements = useCallback((reorderedList) => {
    setAnnouncements(reorderedList);
    saveAdminData(DB_KEYS.ANNOUNCEMENTS, reorderedList);
    logAdminActivity('ANNOUNCEMENTS_REORDERED', 'Announcements', 'List', 'Previous Order', 'New Order');
  }, [logAdminActivity]);

  // 4. Contact & Social Settings Actions
  const updateContactSetting = useCallback((settingKey, updatedData) => {
    setContactSettings((prev) => {
      const updated = {
        ...prev,
        [settingKey]: {
          ...(prev[settingKey] || {}),
          ...updatedData,
        },
      };
      saveAdminData(DB_KEYS.CONTACT_SETTINGS, updated);
      logAdminActivity('CONTACT_SETTING_UPDATED', 'Contact & Social', settingKey, 'Existing', updatedData.value || updatedData.url || 'Updated');
      return updated;
    });
  }, [logAdminActivity]);

  const updateAllContactSettings = useCallback((newSettings) => {
    setContactSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveAdminData(DB_KEYS.CONTACT_SETTINGS, updated);
      logAdminActivity('CONTACT_SETTINGS_BULK_UPDATE', 'Contact & Social', 'Global', 'Old Settings', 'New Settings');
      return updated;
    });
  }, [logAdminActivity]);

  // 5. Inventory & Stock Management Actions
  const adjustStock = useCallback((sku, deltaQuantity, type = 'ADJUSTMENT', reason = 'Manual Adjustment', supplier = '', unitCost = 0) => {
    let affectedItem = null;
    setInventory((prev) => {
      const updated = prev.map((item) => {
        if (item.sku !== sku) return item;
        const currentStock = Math.max(0, (item.currentStock || 0) + Number(deltaQuantity));
        const status = currentStock === 0 ? 'OUT OF STOCK' : currentStock <= (item.minStockLevel || 10) ? 'LOW STOCK' : 'IN STOCK';
        affectedItem = { ...item, currentStock, status };
        return affectedItem;
      });
      saveAdminData(DB_KEYS.INVENTORY, updated);
      return updated;
    });

    if (affectedItem) {
      const movementRecord = {
        id: `SM-${Date.now().toString().slice(-4)}`,
        sku,
        productName: affectedItem.productName,
        variant: affectedItem.variant,
        quantity: deltaQuantity,
        type,
        reason,
        supplier: supplier || affectedItem.supplier || 'N/A',
        unitCost: unitCost || affectedItem.unitCost || 0,
        totalCost: Math.abs(deltaQuantity) * (unitCost || affectedItem.unitCost || 0),
        date: new Date().toISOString(),
        admin: adminUser?.email || 'admin@theprinthub.com',
      };
      setStockMovements((prev) => {
        const updated = [movementRecord, ...prev];
        saveAdminData(DB_KEYS.STOCK_MOVEMENTS, updated);
        return updated;
      });
      logAdminActivity('STOCK_ADJUSTMENT', 'Inventory', sku, `${affectedItem.currentStock - deltaQuantity} units`, `${affectedItem.currentStock} units (${deltaQuantity > 0 ? '+' : ''}${deltaQuantity})`);
    }
  }, [adminUser, logAdminActivity]);

  const addStockItem = useCallback((newStockItem) => {
    setInventory((prev) => {
      const updated = [...prev, newStockItem];
      saveAdminData(DB_KEYS.INVENTORY, updated);
      logAdminActivity('STOCK_ITEM_CREATED', 'Inventory', newStockItem.sku, '', `${newStockItem.productName} (${newStockItem.variant})`);
      return updated;
    });
  }, [logAdminActivity]);

  // 6. Orders & Manual Order Creation
  const createManualOrder = useCallback((orderData) => {
    const rawId = Date.now().toString().slice(-4);
    const orderId = `ORD-${rawId}`;
    const orderNumber = `#${rawId}`;

    const items = orderData.items || [];
    const subtotal = items.reduce((sum, it) => sum + (Number(it.price) * Number(it.quantity)), 0);
    const discount = Number(orderData.discount) || 0;
    const shipping = Number(orderData.shipping) || 0;
    const tax = Number(orderData.tax) || 0;
    const total = Math.max(0, subtotal - discount + shipping + tax);

    // Auto-calculate cost & profit
    const totalCost = items.reduce((sum, it) => sum + ((Number(it.unitCost) || 0) * Number(it.quantity)), 0);
    const netProfit = total - totalCost;
    const marginPercent = total > 0 ? Number(((netProfit / total) * 100).toFixed(1)) : 0;

    const newOrder = {
      id: orderId,
      orderNumber,
      channel: orderData.channel || 'manual_whatsapp',
      customer: {
        name: orderData.customerName || 'Walk-in Client',
        email: orderData.customerEmail || 'client@theprinthub.com',
        phone: orderData.customerPhone || '+91 79928 01158',
        address: orderData.customerAddress || 'Direct Atelier Handover',
      },
      date: new Date().toISOString(),
      items,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      totalCost,
      netProfit,
      marginPercent,
      paymentStatus: orderData.paymentStatus || 'PAID',
      paymentMethod: orderData.paymentMethod || 'UPI / WhatsApp Pay',
      orderStatus: orderData.orderStatus || 'Confirmed',
      notes: orderData.notes || 'Created via Admin Manual Order Entry',
    };

    // Auto-deduct inventory for recognized SKUs
    items.forEach((it) => {
      if (it.sku) {
        adjustStock(it.sku, -Math.abs(Number(it.quantity)), 'ORDER_DEDUCT', `Manual Order ${orderId}`, 'Client Sale', it.unitCost);
      }
    });

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      saveAdminData(DB_KEYS.ORDERS, updated);
      logAdminActivity('MANUAL_ORDER_CREATED', 'Orders', orderId, '', `Total ₹${total} (${items.length} items)`);
      return updated;
    });

    // Also register/update in customers CRM
    setCustomers((prev) => {
      const existing = prev.find((c) => c.email === newOrder.customer.email || c.phone === newOrder.customer.phone);
      if (existing) {
        const updated = prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                ordersCount: (c.ordersCount || 0) + 1,
                totalSpent: (c.totalSpent || 0) + total,
                lastOrderDate: newOrder.date,
              }
            : c
        );
        saveAdminData(DB_KEYS.CUSTOMERS, updated);
        return updated;
      } else {
        const newCust = {
          id: `CUST-${Date.now().toString().slice(-4)}`,
          name: newOrder.customer.name,
          email: newOrder.customer.email,
          phone: newOrder.customer.phone,
          city: 'Atelier Direct',
          state: 'Haryana',
          ordersCount: 1,
          totalSpent: total,
          lastOrderDate: newOrder.date,
          status: 'ACTIVE',
          notes: 'Added via Manual Order Entry',
        };
        const updated = [newCust, ...prev];
        saveAdminData(DB_KEYS.CUSTOMERS, updated);
        return updated;
      }
    });

    return newOrder;
  }, [adjustStock, logAdminActivity]);

  const updateOrderStatus = useCallback((orderId, newStatus, note, adminName) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: newStatus,
              notes: note ? `${o.notes || ''} [${new Date().toLocaleTimeString()}]: ${note}` : o.notes,
            }
          : o
      );
      saveAdminData(DB_KEYS.ORDERS, updated);
      logAdminActivity('ORDER_STATUS_UPDATED', 'Orders', orderId, 'Status Update', newStatus);
      return updated;
    });
    return { success: true, message: `Status updated to ${newStatus}` };
  }, [logAdminActivity]);

  const updateAdminOrder = useCallback((orderId, updatedFields) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, ...updatedFields } : o));
      saveAdminData(DB_KEYS.ORDERS, updated);
      logAdminActivity('ORDER_EDITED', 'Orders', orderId, 'Existing', JSON.stringify(updatedFields).slice(0, 40));
      return updated;
    });
  }, [logAdminActivity]);

  const deleteAdminOrder = useCallback((orderId) => {
    setOrders((prev) => {
      const target = prev.find((o) => o.id === orderId);
      const updated = prev.filter((o) => o.id !== orderId);
      saveAdminData(DB_KEYS.ORDERS, updated);
      logAdminActivity('ORDER_DELETED', 'Orders', orderId, target?.orderNumber || orderId, 'Deleted');
      return updated;
    });
  }, [logAdminActivity]);

  const createAdminShipment = useCallback(async (orderId, courier) => {
    const awb = `DLV-${Date.now().toString().slice(-8)}`;
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: 'Shipped',
              shipment: {
                courierName: courier || 'Delhivery Express',
                awbNumber: awb,
              },
            }
          : o
      );
      saveAdminData(DB_KEYS.ORDERS, updated);
      logAdminActivity('SHIPMENT_CREATED', 'Orders', orderId, 'Pre-Shipment', `Courier: ${courier} AWB: ${awb}`);
      return updated;
    });
    return {
      success: true,
      shipment: {
        courierName: courier || 'Delhivery Express',
        awbNumber: awb,
      },
    };
  }, [logAdminActivity]);

  const processAdminRefund = useCallback(async (orderId, amount, reason) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentStatus: 'REFUNDED',
              orderStatus: 'Cancelled',
              notes: `${o.notes || ''} [Refund ₹${amount}: ${reason}]`,
            }
          : o
      );
      saveAdminData(DB_KEYS.ORDERS, updated);
      logAdminActivity('ORDER_REFUNDED', 'Orders', orderId, 'Paid', `Refunded ₹${amount} - ${reason}`);
      return updated;
    });
    return { success: true, message: `Refund of ₹${amount} initiated successfully.` };
  }, [logAdminActivity]);

  const addAdminOrderNote = useCallback((orderId, noteText) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId ? { ...o, notes: `${o.notes || ''}\n${noteText}` } : o
      );
      saveAdminData(DB_KEYS.ORDERS, updated);
      logAdminActivity('ORDER_NOTE_ADDED', 'Orders', orderId, '', noteText);
      return updated;
    });
    return { success: true };
  }, [logAdminActivity]);

  // 7. Operational Expenses Actions
  const addExpense = useCallback((expenseData) => {
    const newExp = {
      id: `EXP-${Date.now().toString().slice(-3)}`,
      name: expenseData.name || 'Miscellaneous Operational Expense',
      category: expenseData.category || 'Other',
      amount: Number(expenseData.amount) || 0,
      date: expenseData.date || new Date().toISOString(),
      paymentMethod: expenseData.paymentMethod || 'UPI',
      description: expenseData.description || '',
      notes: expenseData.notes || '',
    };
    setExpenses((prev) => {
      const updated = [newExp, ...prev];
      saveAdminData(DB_KEYS.EXPENSES, updated);
      logAdminActivity('EXPENSE_RECORDED', 'Finance', newExp.id, '', `${newExp.name}: ₹${newExp.amount}`);
      return updated;
    });
    return newExp;
  }, [logAdminActivity]);

  const updateExpense = useCallback((id, updatedFields) => {
    setExpenses((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...updatedFields } : e));
      saveAdminData(DB_KEYS.EXPENSES, updated);
      logAdminActivity('EXPENSE_UPDATED', 'Finance', id, 'Existing', `₹${updatedFields.amount || 'Updated'}`);
      return updated;
    });
  }, [logAdminActivity]);

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => {
      const target = prev.find((e) => e.id === id);
      const updated = prev.filter((e) => e.id !== id);
      saveAdminData(DB_KEYS.EXPENSES, updated);
      logAdminActivity('EXPENSE_DELETED', 'Finance', id, target?.name || '', 'Deleted');
      return updated;
    });
  }, [logAdminActivity]);

  // 8. Customers CRM Actions
  const updateCustomerNotes = useCallback((customerId, notes) => {
    setCustomers((prev) => {
      const updated = prev.map((c) => (c.id === customerId ? { ...c, notes } : c));
      saveAdminData(DB_KEYS.CUSTOMERS, updated);
      logAdminActivity('CUSTOMER_NOTES_UPDATED', 'Customers', customerId, 'Old Notes', notes);
      return updated;
    });
  }, [logAdminActivity]);

  // 9. Role Permissions
  const changeAdminRole = useCallback((roleKeyOrObj) => {
    let roleKey = roleKeyOrObj;
    if (roleKeyOrObj && typeof roleKeyOrObj === 'object' && roleKeyOrObj.id) {
      roleKey = roleKeyOrObj.id;
    }
    const roleObj = ADMIN_ROLES[roleKey] || ADMIN_ROLES.SUPER_ADMIN;
    setAdminRole(roleObj);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DB_KEYS.ACTIVE_ROLE, JSON.stringify(roleObj));
    }
    logAdminActivity('ADMIN_ROLE_SWITCHED', 'Permissions', roleObj.name, 'Switched Role', roleObj.badge);
  }, [logAdminActivity]);

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

  // Shop Mega-Menu open state (coordinates floating widgets like WhatsApp button)
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);

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

        // Shop Mega-Menu State
        isShopMenuOpen,
        setIsShopMenuOpen,

        // ==========================================
        // Expanded Business & Admin Database Values
        // ==========================================
        homepageContent,
        setHomepageContent,
        saveHomepageDraft,
        publishHomepageSection,
        publishAllHomepageDrafts,
        revertHomepageDraft,

        announcements,
        setAnnouncements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        reorderAnnouncements,

        contactSettings,
        setContactSettings,
        updateContactSetting,
        updateAllContactSettings,

        inventory,
        setInventory,
        stockMovements,
        setStockMovements,
        adjustStock,
        addStockItem,

        createManualOrder,
        updateAdminOrder,
        deleteAdminOrder,

        expenses,
        setExpenses,
        addExpense,
        updateExpense,
        deleteExpense,

        customers,
        setCustomers,
        updateCustomerNotes,

        auditLogs,
        setAuditLogs,
        logAdminActivity,

        adminRole,
        changeAdminRole,
        ADMIN_ROLES,
        computeFinancialOverview,
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
