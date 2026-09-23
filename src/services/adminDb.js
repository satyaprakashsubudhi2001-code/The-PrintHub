/**
 * The PrintHub — Centralized Business Database & Content Store
 * Provides persistent schemas, seed data, and calculation engines for:
 * - Homepage CMS (Draft & Published states)
 * - Announcements
 * - Social & Contact Settings
 * - SKU-level Inventory & Stock Movement History
 * - Orders (Online, Manual, WhatsApp, Walk-in)
 * - Expenses & Profit / Loss Engine
 * - Customers CRM
 * - 3D Studio Config
 * - Activity / Audit Logs
 * - Role-Based Permissions
 */

// Storage Keys
export const DB_KEYS = {
  HOMEPAGE: 'printhub_admin_homepage_cms',
  ANNOUNCEMENTS: 'printhub_admin_announcements',
  CONTACT_SETTINGS: 'printhub_admin_contact_settings',
  INVENTORY: 'printhub_admin_inventory',
  STOCK_MOVEMENTS: 'printhub_admin_stock_movements',
  ORDERS: 'printhub_admin_orders',
  EXPENSES: 'printhub_admin_expenses',
  CUSTOMERS: 'printhub_admin_customers',
  STUDIO_CONFIG: 'printhub_admin_studio_config',
  AUDIT_LOGS: 'printhub_admin_audit_logs',
  ACTIVE_ROLE: 'printhub_admin_active_role',
};

// =========================================================================
// 1. DEFAULT HOMEPAGE CONTENT (Preserving 100% of existing customer copy)
// =========================================================================
export const INITIAL_HOMEPAGE_CONTENT = {
  hero: {
    enabled: true,
    eyebrow: 'PREMIUM CUSTOM PRINTING & MERCHANDISE ATELIER',
    headlineLine1: 'Print Your Ideas.',
    headlineLine2: 'Make Them Yours.',
    subtitle:
      'Quality custom apparel, drinkware, stationery, and personalized gifts crafted for creators, brands, and businesses. Preview in real-time interactive 3D and order directly via WhatsApp with zero MOQ.',
    primaryCtaText: 'Start Printing',
    primaryCtaLink: 'design-by-customer',
    secondaryCtaText: 'Explore Collection',
    secondaryCtaLink: 'products',
    bgImageUrl: '/hero-studio-bg.jpg',
    bgImageAlt: 'The PrintHub Atelier',
  },
  featuredProducts: {
    enabled: true,
    tagline: 'CURATED APPAREL & MERCHANDISE',
    title: 'Featured Atelier Creations',
    subtitle: 'High-demand blanks engineered for vivid custom thermal printing and long-term durability.',
  },
  shopCategories: {
    enabled: true,
    tagline: 'TAXONOMY CATALOGUE',
    title: 'Explore By Category',
    subtitle: 'From single custom tees to bulk corporate merch, explore our core atelier collections.',
    categoriesList: [
      {
        title: 'Custom T-Shirts',
        category: 'Custom T-Shirts',
        tag: 'Apparel',
        icon: '👕',
        desc: 'Classic round-neck & oversized heavyweight tees with durable 300 DPI thermal transfers.',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Hoodies',
        category: 'Hoodies',
        tag: 'Outerwear',
        icon: '🧥',
        desc: 'Warm heavyweight 380 GSM fleece hoodies with vibrant chest and back graphic placement.',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Mugs',
        category: 'Mugs',
        tag: 'Drinkware',
        icon: '☕',
        desc: 'High-gloss photo-sublimated ceramic mugs with microwave and dishwasher safe finish.',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Business Cards',
        category: 'Business Cards',
        tag: 'Stationery',
        icon: '📇',
        desc: 'Velvet matte, gold-foiled, and spot UV visiting cards that leave an unforgettable impression.',
        image: 'https://images.unsplash.com/photo-1589330694653-dad6ef0140be?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Photo Frames',
        category: 'Photo Frames',
        tag: 'Wall Art',
        icon: '🖼️',
        desc: 'Gallery-grade acrylic and wooden photo frames preserving your precious memories.',
        image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Stickers',
        category: 'Stickers',
        tag: 'Die-Cut Vinyl',
        icon: '🏷️',
        desc: 'Waterproof, scratch-proof die-cut vinyl stickers and holographic custom kiss-cut sheets.',
        image: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Custom Gifts',
        category: 'Custom Gifts',
        tag: 'Keepsakes',
        icon: '🎁',
        desc: 'Personalized anniversary apparel, engraved keepsakes, and customized celebration boxes.',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Promotional Products',
        category: 'Promotional Products',
        tag: 'Corporate',
        icon: '📦',
        desc: 'Lanyards, tote bags, caps, corporate welcome kits, and conference merchandise.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  promotionalSections: {
    enabled: true,
    tagline: 'LIMITED ATELIER PROMOTION',
    title: 'Bulk Corporate & Event Printing',
    description: 'Get tiered wholesale discounts starting from 10+ units with complimentary digital proofing.',
    discountBadge: 'UP TO 35% OFF',
    ctaText: 'Request Wholesale Quote',
    ctaLink: 'bulk-orders',
  },
  trustBenefits: {
    enabled: true,
    tagline: 'WHY CHOOSE THE PRINTHUB',
    title: 'Precision Craftsmanship in Every Print',
    subtitle: 'From pixel to fabric, our industrial printing lines guarantee museum-quality fidelity.',
    items: [
      {
        step: '01',
        title: 'Idea',
        sub: 'Start with an idea.',
        desc: 'A sketch, your logo, a brand concept, or personal artwork you want to bring into the real world.',
      },
      {
        step: '02',
        title: 'Design',
        sub: 'Configure in 3D.',
        desc: 'Upload graphics or work directly with our atelier to calibrate print placement, scale, and colors.',
      },
      {
        step: '03',
        title: 'Create',
        sub: 'Master print calibration.',
        desc: 'Industrial 300 DPI thermal DTF or sublimation with meticulous multi-point quality inspection.',
      },
      {
        step: '04',
        title: 'Deliver',
        sub: 'Arrives at your doorstep.',
        desc: 'Securely packaged with tracking and priority-dispatched across all 28+ Indian states.',
      },
    ],
  },
  customPrinting: {
    enabled: true,
    tagline: 'HIGH-RESOLUTION DTF',
    title: '300 DPI Industrial Thermal Transfer',
    description: 'Zero minimum order quantity. True-to-life colors that survive 50+ wash cycles without fading or cracking.',
    ctaText: 'Launch Customizer',
    ctaLink: 'design-by-customer',
  },
  studio3D: {
    enabled: true,
    tagline: 'INTERACTIVE VISUALIZER',
    title: 'Configure Your Garment in 3D Space',
    description: 'Rotate 360°, scale graphics on front/back, preview realistic lighting, and approve your digital proof in seconds.',
    ctaText: 'Open 3D Studio',
    ctaLink: 'design-by-customer',
  },
  bulkOrders: {
    enabled: true,
    tagline: 'TIERED WHOLESALE',
    title: 'Scale Your Brand Merchandise',
    description: 'Special pricing for colleges, startups, corporate events, and creators launching their clothing lines.',
    ctaText: 'Bulk Enquiry',
    ctaLink: 'bulk-orders',
  },
  footerContent: {
    enabled: true,
    brandStory: "The PrintHub is a premium custom printing atelier delivering bespoke apparel, merchandise, and customized blanks with zero MOQ and 3D studio proofing.",
    copyrightNotice: '© 2026 The PrintHub. All rights reserved.',
    addressText: 'Plot 42, Textile Technology Park, Sector 18, Gurugram, Haryana 122015, India',
    workingHours: 'Mon - Sat: 9:00 AM - 8:00 PM IST',
  },
};

// =========================================================================
// 2. DEFAULT ANNOUNCEMENTS
// =========================================================================
export const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'proofs',
    text: 'Free Digital Proofs on All Custom Orders',
    highlight: 'Free',
    badge: 'CUSTOM',
    route: 'design-by-customer',
    enabled: true,
    priority: 1,
    startDate: '',
    endDate: '',
  },
  {
    id: 'express',
    text: 'Express PAN-India Dispatch Across 28+ States',
    highlight: 'Express',
    badge: 'PAN-INDIA',
    route: 'help',
    enabled: true,
    priority: 2,
    startDate: '',
    endDate: '',
  },
  {
    id: 'custom-easy',
    text: 'Custom Printing Made Easy with 3D Studio',
    highlight: 'Custom',
    badge: '3D STUDIO',
    route: 'products',
    enabled: true,
    priority: 3,
    startDate: '',
    endDate: '',
  },
  {
    id: 'bulk',
    text: 'Bulk Orders Available • Tiered Wholesale Discounts',
    highlight: 'Bulk',
    badge: 'WHOLESALE',
    route: 'bulk-orders',
    enabled: true,
    priority: 4,
    startDate: '',
    endDate: '',
  },
  {
    id: 'quality',
    text: 'Premium Quality 300 DPI Thermal DTF & Zero MOQ',
    highlight: 'Premium',
    badge: 'ZERO MOQ',
    route: 'about-us',
    enabled: true,
    priority: 5,
    startDate: '',
    endDate: '',
  },
  {
    id: 'ideas',
    text: 'Print Your Ideas. Make Them Yours.',
    highlight: 'Print',
    badge: 'ATELIER',
    route: 'products',
    enabled: true,
    priority: 6,
    startDate: '',
    endDate: '',
  },
];

// =========================================================================
// 3. DEFAULT SOCIAL & CONTACT SETTINGS
// =========================================================================
export const INITIAL_CONTACT_SETTINGS = {
  whatsapp: '+91 79928 01158',
  whatsappCatalog: 'https://wa.me/c/917992801158',
  instagram: 'https://instagram.com/theprinthub_official',
  facebook: 'https://facebook.com/theprinthub',
  gmail: 'theprinthub.in@gmail.com',
  googleMaps: 'https://maps.google.com/?q=The+PrintHub+Sector+18+Gurugram',
  phone: '+91 79928 01158',
  email: 'theprinthub.in@gmail.com',
  address: 'Plot 42, Textile Technology Park, Sector 18, Gurugram, Haryana 122015, India',
  hours: 'Mon - Sat: 9:00 AM - 8:00 PM IST',
  supportHours: 'Mon - Sat: 9:00 AM - 8:00 PM IST',
  slaGuarantee: '48-Hour Rush Production & Dispatch Guarantee',
};

// =========================================================================
// 4. SKU-LEVEL INVENTORY (Clean state)
// =========================================================================
export const INITIAL_INVENTORY = [];

// =========================================================================
// 5. DEFAULT STOCK MOVEMENTS HISTORY (Clean state)
// =========================================================================
export const INITIAL_STOCK_MOVEMENTS = [];

// =========================================================================
// 6. DEFAULT ORDERS (Clean state)
// =========================================================================
export const INITIAL_ORDERS = [];

// =========================================================================
// 7. DEFAULT OPERATIONAL EXPENSES (Clean state)
// =========================================================================
export const INITIAL_EXPENSES = [];

// =========================================================================
// 8. DEFAULT CUSTOMERS CRM (Clean state)
// =========================================================================
export const INITIAL_CUSTOMERS = [];

// =========================================================================
// 9. DEFAULT AUDIT / ACTIVITY LOGS (Clean state)
// =========================================================================
export const INITIAL_AUDIT_LOGS = [];

// =========================================================================
// 10. ROLE-BASED ACCESS PERMISSION PROFILES
// =========================================================================
export const ADMIN_ROLES = {
  SUPER_ADMIN: {
    id: 'SUPER_ADMIN',
    name: 'Super Administrator',
    badge: 'FULL ACCESS',
    canManageCatalog: true,
    canManageStock: true,
    canManageOrders: true,
    canManageFinance: true,
    canManageCustomers: true,
    canManageCms: true,
    canManageSettings: true,
    canExportReports: true,
    canDeleteRecords: true,
  },
  ADMIN: {
    id: 'ADMIN',
    name: 'Atelier Operations Admin',
    badge: 'OPERATIONS',
    canManageCatalog: true,
    canManageStock: true,
    canManageOrders: true,
    canManageFinance: true,
    canManageCustomers: true,
    canManageCms: true,
    canManageSettings: false,
    canExportReports: true,
    canDeleteRecords: false,
  },
  STAFF: {
    id: 'STAFF',
    name: 'Print Line & Support Staff',
    badge: 'STAFF',
    canManageCatalog: false,
    canManageStock: true,
    canManageOrders: true,
    canManageFinance: false, // Protected financial data hidden from staff
    canManageCustomers: true,
    canManageCms: false,
    canManageSettings: false,
    canExportReports: false,
    canDeleteRecords: false,
  },
};

// =========================================================================
// 11. FINANCIAL P&L AND REPORTING ENGINE
// =========================================================================

/**
 * Computes comprehensive financial health across orders and operational expenses
 */
export function computeFinancialOverview(orders = [], expenses = [], filterRange = 'ALL') {
  const now = new Date();

  const filteredOrders = orders.filter((ord) => {
    if (filterRange === 'ALL') return true;
    const orderDate = new Date(ord.date);
    if (filterRange === 'TODAY') {
      return orderDate.toDateString() === now.toDateString();
    }
    if (filterRange === '7DAYS') {
      return (now - orderDate) / (1000 * 60 * 60 * 24) <= 7;
    }
    if (filterRange === '30DAYS') {
      return (now - orderDate) / (1000 * 60 * 60 * 24) <= 30;
    }
    if (filterRange === 'THIS_MONTH') {
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const filteredExpenses = expenses.filter((exp) => {
    if (filterRange === 'ALL') return true;
    const expDate = new Date(exp.date);
    if (filterRange === 'TODAY') {
      return expDate.toDateString() === now.toDateString();
    }
    if (filterRange === '7DAYS') {
      return (now - expDate) / (1000 * 60 * 60 * 24) <= 7;
    }
    if (filterRange === '30DAYS') {
      return (now - expDate) / (1000 * 60 * 60 * 24) <= 30;
    }
    if (filterRange === 'THIS_MONTH') {
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Gross Revenue
  const totalRevenue = filteredOrders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  
  // Cost of Goods Sold (Product Blanks + Printing Supplies directly allocated to orders)
  const totalCogs = filteredOrders.reduce((acc, o) => acc + (Number(o.totalCost) || 0), 0);
  
  // Gross Profit before overhead
  const grossProfit = totalRevenue - totalCogs;

  // Operating Expenses (Inks, Packaging, Marketing, Utilities, Maintenance)
  const totalOperatingExpenses = filteredExpenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

  // Net Profit or Loss
  const netProfitOrLoss = grossProfit - totalOperatingExpenses;
  const isProfit = netProfitOrLoss >= 0;
  const netProfit = isProfit ? netProfitOrLoss : 0;
  const netLoss = isProfit ? 0 : Math.abs(netProfitOrLoss);
  const profitMarginPercent = totalRevenue > 0 ? ((netProfitOrLoss / totalRevenue) * 100).toFixed(1) : '0.0';

  // Order Counts
  const totalOrdersCount = filteredOrders.length;
  const completedOrdersCount = filteredOrders.filter((o) => o.orderStatus === 'Delivered' || o.orderStatus === 'Packed').length;
  const pendingOrdersCount = filteredOrders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;

  return {
    totalRevenue,
    totalCogs,
    grossProfit,
    totalOperatingExpenses,
    netProfit,
    netLoss,
    netProfitOrLoss,
    profitMarginPercent,
    totalOrdersCount,
    completedOrdersCount,
    pendingOrdersCount,
    filteredOrders,
    filteredExpenses,
  };
}

/**
 * Purges known legacy demo records from localStorage automatically
 */
export function purgeLegacyDemoData() {
  if (typeof window === 'undefined') return;
  try {
    const keysToCheck = [
      { key: DB_KEYS.ORDERS, marker: 'ORD-9842' },
      { key: DB_KEYS.EXPENSES, marker: 'EXP-501' },
      { key: DB_KEYS.CUSTOMERS, marker: 'CUST-001' },
      { key: DB_KEYS.STOCK_MOVEMENTS, marker: 'SM-1001' },
      { key: DB_KEYS.INVENTORY, marker: 'TSH-OVR-' },
      { key: DB_KEYS.AUDIT_LOGS, marker: 'LOG-901' },
      { key: 'the_printhub_design_requests', marker: 'PH-2026-00001' },
    ];

    keysToCheck.forEach(({ key, marker }) => {
      const stored = localStorage.getItem(key);
      if (stored && stored.includes(marker)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    });
  } catch (e) {
    console.warn('[adminDb] Demo purge error:', e);
  }
}

/**
 * Unconditionally resets all transactional business data to a fresh clean slate
 */
export function clearAllDatabaseDemoData() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.EXPENSES, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.CUSTOMERS, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.STOCK_MOVEMENTS, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.INVENTORY, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.AUDIT_LOGS, JSON.stringify([]));
    localStorage.setItem('the_printhub_design_requests', JSON.stringify([]));
  } catch (e) {
    console.warn('[adminDb] clearAllDatabaseDemoData error:', e);
  }
}

/**
 * Loads data from localStorage or provides robust initial fallback
 */
export function loadAdminDatabase() {
  if (typeof window === 'undefined') {
    return {
      homepage: { draft: INITIAL_HOMEPAGE_CONTENT, published: INITIAL_HOMEPAGE_CONTENT },
      announcements: INITIAL_ANNOUNCEMENTS,
      contactSettings: INITIAL_CONTACT_SETTINGS,
      inventory: INITIAL_INVENTORY,
      stockMovements: INITIAL_STOCK_MOVEMENTS,
      orders: INITIAL_ORDERS,
      expenses: INITIAL_EXPENSES,
      customers: INITIAL_CUSTOMERS,
      auditLogs: INITIAL_AUDIT_LOGS,
    };
  }

  // Auto-purge any stale mock data on load
  purgeLegacyDemoData();

  const loadItem = (key, fallback) => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(`[adminDb] Error loading ${key}:`, e);
    }
    return fallback;
  };

  return {
    homepage: loadItem(DB_KEYS.HOMEPAGE, {
      draft: INITIAL_HOMEPAGE_CONTENT,
      published: INITIAL_HOMEPAGE_CONTENT,
    }),
    announcements: loadItem(DB_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS),
    contactSettings: loadItem(DB_KEYS.CONTACT_SETTINGS, INITIAL_CONTACT_SETTINGS),
    inventory: loadItem(DB_KEYS.INVENTORY, INITIAL_INVENTORY),
    stockMovements: loadItem(DB_KEYS.STOCK_MOVEMENTS, INITIAL_STOCK_MOVEMENTS),
    orders: loadItem(DB_KEYS.ORDERS, INITIAL_ORDERS),
    expenses: loadItem(DB_KEYS.EXPENSES, INITIAL_EXPENSES),
    customers: loadItem(DB_KEYS.CUSTOMERS, INITIAL_CUSTOMERS),
    auditLogs: loadItem(DB_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS),
  };
}

/**
 * Persists a specific domain back to localStorage
 */
export function saveAdminData(key, data) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`[adminDb] Failed to save key ${key}:`, e);
    }
  }
}
