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
// 4. DEFAULT SKU-LEVEL INVENTORY
// =========================================================================
export const INITIAL_INVENTORY = [
  {
    sku: 'TSH-OVR-BLK-M',
    productId: 'blank_oversized_tee',
    productName: 'Streetwear Oversized T-Shirt',
    variant: 'Black / M',
    size: 'M',
    color: 'Black',
    openingStock: 150,
    currentStock: 124,
    reservedStock: 8,
    soldQuantity: 18,
    damagedQuantity: 0,
    returnedQuantity: 0,
    minStockLevel: 25,
    unitCost: 190,
    supplier: 'Vardhman Mills Tirupur',
    status: 'IN STOCK',
  },
  {
    sku: 'TSH-OVR-BLK-L',
    productId: 'blank_oversized_tee',
    productName: 'Streetwear Oversized T-Shirt',
    variant: 'Black / L',
    size: 'L',
    color: 'Black',
    openingStock: 200,
    currentStock: 168,
    reservedStock: 12,
    soldQuantity: 20,
    damagedQuantity: 0,
    returnedQuantity: 0,
    minStockLevel: 30,
    unitCost: 190,
    supplier: 'Vardhman Mills Tirupur',
    status: 'IN STOCK',
  },
  {
    sku: 'TSH-OVR-WHT-L',
    productId: 'blank_oversized_tee',
    productName: 'Streetwear Oversized T-Shirt',
    variant: 'White / L',
    size: 'L',
    color: 'White',
    openingStock: 100,
    currentStock: 14,
    reservedStock: 4,
    soldQuantity: 82,
    damagedQuantity: 0,
    returnedQuantity: 0,
    minStockLevel: 20,
    unitCost: 185,
    supplier: 'Vardhman Mills Tirupur',
    status: 'LOW STOCK',
  },
  {
    sku: 'HOD-HVY-BLK-XL',
    productId: 'blank_fleece_hoodie',
    productName: 'Heavyweight Fleece Hoodie',
    variant: 'Black / XL',
    size: 'XL',
    color: 'Black',
    openingStock: 80,
    currentStock: 52,
    reservedStock: 5,
    soldQuantity: 23,
    damagedQuantity: 0,
    returnedQuantity: 0,
    minStockLevel: 15,
    unitCost: 450,
    supplier: 'Ludhiana Knits Atelier',
    status: 'IN STOCK',
  },
  {
    sku: 'HOD-HVY-MNT-L',
    productId: 'blank_fleece_hoodie',
    productName: 'Heavyweight Fleece Hoodie',
    variant: 'Sage Green / L',
    size: 'L',
    color: 'Sage Green',
    openingStock: 50,
    currentStock: 0,
    reservedStock: 0,
    soldQuantity: 50,
    damagedQuantity: 0,
    returnedQuantity: 0,
    minStockLevel: 10,
    unitCost: 460,
    supplier: 'Ludhiana Knits Atelier',
    status: 'OUT OF STOCK',
  },
  {
    sku: 'MUG-CRM-11OZ',
    productId: 'blank_ceramic_mug',
    productName: 'Ceramic 11oz Coffee Mug',
    variant: 'Gloss White',
    size: '11oz',
    color: 'White',
    openingStock: 300,
    currentStock: 245,
    reservedStock: 10,
    soldQuantity: 45,
    damagedQuantity: 0,
    returnedQuantity: 0,
    minStockLevel: 40,
    unitCost: 48,
    supplier: 'Khurja Ceramics Ltd',
    status: 'IN STOCK',
  },
  {
    sku: 'VIS-CRD-MAT-100',
    productId: 'blank_visiting_cards',
    productName: 'Velvet Matte Business Cards (Pack of 100)',
    variant: '350 GSM Velvet',
    size: '3.5 x 2 in',
    color: 'Matte',
    openingStock: 500,
    currentStock: 380,
    reservedStock: 20,
    soldQuantity: 100,
    damagedQuantity: 0,
    returnedQuantity: 0,
    minStockLevel: 50,
    unitCost: 110,
    supplier: 'ITC Paperboards',
    status: 'IN STOCK',
  },
];

// =========================================================================
// 5. DEFAULT STOCK MOVEMENTS HISTORY
// =========================================================================
export const INITIAL_STOCK_MOVEMENTS = [
  {
    id: 'SM-1001',
    sku: 'TSH-OVR-BLK-M',
    productName: 'Streetwear Oversized T-Shirt',
    variant: 'Black / M',
    quantity: 150,
    type: 'ADD',
    reason: 'Initial Inventory Stocking',
    supplier: 'Vardhman Mills Tirupur',
    unitCost: 190,
    totalCost: 28500,
    date: '2026-08-15T10:30:00.000Z',
    admin: 'admin@theprinthub.com',
  },
  {
    id: 'SM-1002',
    sku: 'TSH-OVR-BLK-L',
    productName: 'Streetwear Oversized T-Shirt',
    variant: 'Black / L',
    quantity: 200,
    type: 'ADD',
    reason: 'Initial Inventory Stocking',
    supplier: 'Vardhman Mills Tirupur',
    unitCost: 190,
    totalCost: 38000,
    date: '2026-08-15T10:45:00.000Z',
    admin: 'admin@theprinthub.com',
  },
  {
    id: 'SM-1003',
    sku: 'HOD-HVY-BLK-XL',
    productName: 'Heavyweight Fleece Hoodie',
    variant: 'Black / XL',
    quantity: 80,
    type: 'ADD',
    reason: 'New Purchase Order Batch #409',
    supplier: 'Ludhiana Knits Atelier',
    unitCost: 450,
    totalCost: 36000,
    date: '2026-08-20T14:10:00.000Z',
    admin: 'admin@theprinthub.com',
  },
  {
    id: 'SM-1004',
    sku: 'MUG-CRM-11OZ',
    productName: 'Ceramic 11oz Coffee Mug',
    variant: 'Gloss White',
    quantity: 300,
    type: 'ADD',
    reason: 'Bulk Crate Delivery',
    supplier: 'Khurja Ceramics Ltd',
    unitCost: 48,
    totalCost: 14400,
    date: '2026-08-22T11:00:00.000Z',
    admin: 'admin@theprinthub.com',
  },
];

// =========================================================================
// 6. DEFAULT ORDERS (Online, Manual, WhatsApp, Walk-in)
// =========================================================================
export const INITIAL_ORDERS = [
  {
    id: 'ORD-9842',
    orderNumber: '#9842',
    channel: 'online',
    customer: {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      phone: '+91 98112 34567',
      address: 'A-402, Nirvana Country, Sector 50, Gurugram 122018',
    },
    date: '2026-09-08T11:20:00.000Z',
    items: [
      {
        sku: 'TSH-OVR-BLK-L',
        name: 'Streetwear Oversized T-Shirt',
        variant: 'Black / L',
        quantity: 2,
        price: 699,
        unitCost: 240, // blank 190 + print 50
        printArea: 'Center Chest + Upper Back',
      },
    ],
    subtotal: 1398,
    discount: 100,
    shipping: 0,
    tax: 65,
    total: 1363,
    totalCost: 480,
    netProfit: 883,
    marginPercent: 64.8,
    paymentStatus: 'PAID',
    paymentMethod: 'UPI / Razorpay',
    orderStatus: 'Printing',
    notes: 'Prioritize chest print resolution 300 DPI.',
  },
  {
    id: 'ORD-9843',
    orderNumber: '#9843',
    channel: 'whatsapp',
    customer: {
      name: 'Priya Mehra (Zomato Merch Lead)',
      email: 'priya.mehra@zomato.com',
      phone: '+91 98710 88990',
      address: 'Zomato HQ, DLF Phase 5, Gurugram 122002',
    },
    date: '2026-09-09T09:15:00.000Z',
    items: [
      {
        sku: 'TSH-OVR-BLK-M',
        name: 'Streetwear Oversized T-Shirt',
        variant: 'Black / M',
        quantity: 15,
        price: 550,
        unitCost: 220,
        printArea: 'Pocket Logo + Back Vector',
      },
    ],
    subtotal: 8250,
    discount: 500,
    shipping: 250,
    tax: 400,
    total: 8400,
    totalCost: 3300,
    netProfit: 5100,
    marginPercent: 60.7,
    paymentStatus: 'PAID',
    paymentMethod: 'Bank Transfer (NEFT)',
    orderStatus: 'Packed',
    notes: 'WhatsApp confirmation provided with vector logo file.',
  },
  {
    id: 'ORD-9844',
    orderNumber: '#9844',
    channel: 'manual_walkin',
    customer: {
      name: 'Karan Malhotra',
      email: 'karan.malhotra@creativeminds.io',
      phone: '+91 99990 12345',
      address: 'Walk-in Atelier Client, Gurugram',
    },
    date: '2026-09-09T16:40:00.000Z',
    items: [
      {
        sku: 'HOD-HVY-BLK-XL',
        name: 'Heavyweight Fleece Hoodie',
        variant: 'Black / XL',
        quantity: 5,
        price: 1399,
        unitCost: 520, // blank 450 + thermal print 70
        printArea: 'Center Chest Embroidery Look',
      },
    ],
    subtotal: 6995,
    discount: 400,
    shipping: 0,
    tax: 330,
    total: 6925,
    totalCost: 2600,
    netProfit: 4325,
    marginPercent: 62.5,
    paymentStatus: 'PAID',
    paymentMethod: 'Cash',
    orderStatus: 'Delivered',
    notes: 'Walk-in pickup at Atelier counter.',
  },
  {
    id: 'ORD-9845',
    orderNumber: '#9845',
    channel: 'online',
    customer: {
      name: 'Simran Kaur',
      email: 'simran.kaur98@gmail.com',
      phone: '+91 98100 54321',
      address: 'Flat 12B, Palm Springs, Golf Course Road, Gurugram',
    },
    date: '2026-09-10T00:30:00.000Z',
    items: [
      {
        sku: 'MUG-CRM-11OZ',
        name: 'Ceramic 11oz Coffee Mug',
        variant: 'Gloss White',
        quantity: 2,
        price: 299,
        unitCost: 65, // blank 48 + sublimation 17
        printArea: '360 Wrap',
      },
    ],
    subtotal: 598,
    discount: 50,
    shipping: 49,
    tax: 27,
    total: 624,
    totalCost: 130,
    netProfit: 494,
    marginPercent: 79.1,
    paymentStatus: 'PAID',
    paymentMethod: 'UPI / GPay',
    orderStatus: 'Processing',
    notes: 'Gift wrap requested with message card.',
  },
];

// =========================================================================
// 7. DEFAULT OPERATIONAL EXPENSES
// =========================================================================
export const INITIAL_EXPENSES = [
  {
    id: 'EXP-501',
    name: 'Industrial DTF White & CMYK Inks 5L Set',
    category: 'Ink',
    amount: 14500,
    date: '2026-08-25T11:00:00.000Z',
    paymentMethod: 'Corporate Card',
    description: 'SubliSmart Pro 5-bottle pigment inks for Roland printing line.',
    notes: 'Batch #IK-9921',
  },
  {
    id: 'EXP-502',
    name: 'Garment Corrugated Boxes & Butter Paper (500 pcs)',
    category: 'Packaging',
    amount: 6200,
    date: '2026-08-28T14:30:00.000Z',
    paymentMethod: 'UPI',
    description: 'Branded eco-friendly kraft boxes with gold sticker seals.',
    notes: 'Delivered by PackRight Faridabad',
  },
  {
    id: 'EXP-503',
    name: 'Industrial Heat Press Teflon Sheet Replacement & Servicing',
    category: 'Machine maintenance',
    amount: 3800,
    date: '2026-09-02T16:00:00.000Z',
    paymentMethod: 'Bank Transfer',
    description: 'Calibration of temperature sensors and pneumatic pressure pads.',
    notes: 'Technician: Rajesh Sharma Engineers',
  },
  {
    id: 'EXP-504',
    name: 'Instagram Sponsored Ads Campaign (Drop #4)',
    category: 'Marketing',
    amount: 8500,
    date: '2026-09-05T09:00:00.000Z',
    paymentMethod: 'Corporate Card',
    description: 'Targeted ad set for oversized tees across Delhi-NCR and Mumbai.',
    notes: 'ROI tracking via Meta Business Suite',
  },
  {
    id: 'EXP-505',
    name: 'Atelier Studio Electricity & Air Cooling',
    category: 'Electricity',
    amount: 9400,
    date: '2026-09-07T10:00:00.000Z',
    paymentMethod: 'Net Banking',
    description: 'Monthly utility consumption for climate-controlled printing room.',
    notes: 'DHBVN Bill #8812903',
  },
];

// =========================================================================
// 8. DEFAULT CUSTOMERS CRM
// =========================================================================
export const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@gmail.com',
    phone: '+91 98112 34567',
    city: 'Gurugram',
    state: 'Haryana',
    ordersCount: 4,
    totalSpent: 6240,
    lastOrderDate: '2026-09-08T11:20:00.000Z',
    status: 'ACTIVE',
    notes: 'Regular streetwear creator. Prefers heavy drop-shoulder cotton.',
  },
  {
    id: 'CUST-002',
    name: 'Priya Mehra',
    email: 'priya.mehra@zomato.com',
    phone: '+91 98710 88990',
    city: 'Gurugram',
    state: 'Haryana',
    ordersCount: 3,
    totalSpent: 28400,
    lastOrderDate: '2026-09-09T09:15:00.000Z',
    status: 'VIP',
    notes: 'Corporate account manager at Zomato. Contact for bulk seasonal orders.',
  },
  {
    id: 'CUST-003',
    name: 'Karan Malhotra',
    email: 'karan.malhotra@creativeminds.io',
    phone: '+91 99990 12345',
    city: 'New Delhi',
    state: 'Delhi',
    ordersCount: 2,
    totalSpent: 11425,
    lastOrderDate: '2026-09-09T16:40:00.000Z',
    status: 'ACTIVE',
    notes: 'Design studio director. Prefers matte finish visiting cards & hoodies.',
  },
  {
    id: 'CUST-004',
    name: 'Simran Kaur',
    email: 'simran.kaur98@gmail.com',
    phone: '+91 98100 54321',
    city: 'Gurugram',
    state: 'Haryana',
    ordersCount: 1,
    totalSpent: 624,
    lastOrderDate: '2026-09-10T00:30:00.000Z',
    status: 'ACTIVE',
    notes: 'New direct consumer. Personalized mugs & gifts.',
  },
];

// =========================================================================
// 9. DEFAULT AUDIT / ACTIVITY LOGS
// =========================================================================
export const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-901',
    admin: 'admin@theprinthub.com',
    action: 'INVENTORY_RESTOCK',
    section: 'Inventory',
    record: 'TSH-OVR-BLK-L',
    oldValue: '118 units',
    newValue: '168 units (+50)',
    timestamp: '2026-09-08T14:22:10.000Z',
  },
  {
    id: 'LOG-902',
    admin: 'admin@theprinthub.com',
    action: 'ORDER_STATUS_UPDATE',
    section: 'Orders',
    record: 'ORD-9843',
    oldValue: 'Processing',
    newValue: 'Packed',
    timestamp: '2026-09-09T11:45:00.000Z',
  },
  {
    id: 'LOG-903',
    admin: 'admin@theprinthub.com',
    action: 'HOMEPAGE_CMS_PUBLISH',
    section: 'Hero Section',
    record: 'hero',
    oldValue: 'Draft Saved',
    newValue: 'Published to Live Storefront',
    timestamp: '2026-09-09T15:30:00.000Z',
  },
  {
    id: 'LOG-904',
    admin: 'admin@theprinthub.com',
    action: 'EXPENSE_RECORDED',
    section: 'Finance',
    record: 'EXP-505',
    oldValue: 'None',
    newValue: '₹9,400 Utility bill logged',
    timestamp: '2026-09-09T17:10:00.000Z',
  },
];

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
