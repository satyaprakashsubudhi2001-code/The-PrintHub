import { MASTER_CALIBRATIONS, getProductPrintAreas } from './printCalibration';

// Pre-calibrated 3D & 2D templates available for catalog and 1-click loading by Admin
export const DEFAULT_PRESET_PRODUCTS = [
  {
    id: 'round-neck-tshirt',
    name: 'Round Neck T-Shirt (Regular Fit)',
    variant: 'Regular Fit',
    subtitle: '100% Combed Cotton • 180 GSM Single Jersey • Bio-Washed',
    category: 'Apparel',
    categoryKey: 'apparel',
    basePrice: 399,
    rating: 4.9,
    reviewsCount: 1840,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/round-neck-tshirt.glb',
    defaultColor: '#18181b',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    defaultSize: 'L',
    materialProps: { roughness: 0.85, metalness: 0.02, fabricType: 'Combed Cotton' },
    defaultCamera: { position: [0, 0, 2.9], target: [0, -0.05, 0], fov: 45 },
    supportedMethods: ['dtf', 'screen_print', 'embroidery'],
    cameraPresets: {
      front: [0, 0, 2.9],
      back: [0, 0, -2.9],
      left: [-2.9, 0, 0],
      right: [2.9, 0, 0],
      top: [0, 2.9, 0.4],
      reset: [0, 0, 2.9]
    },
    sales: {
      days7: 342,
      days14: 780,
      days30: 1950,
      allTime: 14200
    },
    badge: 'Best Seller',
    printAreas: MASTER_CALIBRATIONS['round-neck-tshirt'],
    defaultPrintArea: 'center_chest'
  },
  {
    id: 'oversized-tshirt',
    name: 'Round Neck T-Shirt (Oversized Fit)',
    variant: 'Oversized Streetwear',
    subtitle: '240 GSM Heavyweight Terry Cotton • Drop Shoulder Streetwear',
    category: 'Apparel',
    categoryKey: 'apparel',
    basePrice: 599,
    rating: 5.0,
    reviewsCount: 1290,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/oversized-tshirt.glb',
    defaultColor: '#27272a',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    defaultSize: 'L',
    materialProps: { roughness: 0.90, metalness: 0.02, fabricType: 'Heavyweight Loopknit' },
    defaultCamera: { position: [0, 0, 3.1], target: [0, -0.05, 0], fov: 45 },
    supportedMethods: ['dtf', 'screen_print', 'embroidery'],
    cameraPresets: {
      front: [0, 0, 3.1],
      back: [0, 0, -3.1],
      left: [-3.1, 0, 0],
      right: [3.1, 0, 0],
      top: [0, 3.1, 0.4],
      reset: [0, 0, 3.1]
    },
    sales: {
      days7: 420,
      days14: 910,
      days30: 2240,
      allTime: 18500
    },
    badge: '#1 Trending',
    printAreas: MASTER_CALIBRATIONS['oversized-tshirt'],
    defaultPrintArea: 'center_chest'
  },
  {
    id: 'polo-tshirt',
    name: 'Classic Pique Polo T-Shirt',
    variant: 'Matty Pique Knit',
    subtitle: '220 GSM Cotton Matty Pique • Knitted Rib Collar & Placket',
    category: 'Apparel',
    categoryKey: 'apparel',
    basePrice: 549,
    rating: 4.8,
    reviewsCount: 940,
    image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/polo-tshirt.glb',
    defaultColor: '#1e293b',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    defaultSize: 'L',
    materialProps: { roughness: 0.78, metalness: 0.05, fabricType: 'Pique Knit' },
    defaultCamera: { position: [0, 0, 2.9], target: [0, -0.05, 0], fov: 45 },
    supportedMethods: ['embroidery', 'dtf', 'screen_print'],
    cameraPresets: {
      front: [0, 0, 2.9],
      back: [0, 0, -2.9],
      left: [-2.9, 0, 0],
      right: [2.9, 0, 0],
      top: [0, 2.9, 0.4],
      reset: [0, 0, 2.9]
    },
    sales: {
      days7: 215,
      days14: 510,
      days30: 1340,
      allTime: 8900
    },
    badge: 'Corporate Fav',
    printAreas: MASTER_CALIBRATIONS['polo-tshirt'],
    defaultPrintArea: 'left_chest'
  },
  {
    id: 'hoodie',
    name: 'Heavyweight Pullover Hoodie',
    variant: 'Double-Lined Fleece',
    subtitle: '380 GSM Brushed Fleece • Double-Lined Hood & Kangaroo Pocket',
    category: 'Apparel',
    categoryKey: 'apparel',
    basePrice: 999,
    rating: 4.9,
    reviewsCount: 1650,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/hoodie.glb',
    defaultColor: '#0f172a',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    defaultSize: 'XL',
    materialProps: { roughness: 0.92, metalness: 0.02, fabricType: 'Brushed Fleece' },
    defaultCamera: { position: [0, 0, 3.2], target: [0, -0.08, 0], fov: 45 },
    supportedMethods: ['dtf', 'embroidery', 'screen_print'],
    cameraPresets: {
      front: [0, 0, 3.2],
      back: [0, 0, -3.2],
      left: [-3.2, 0, 0],
      right: [3.2, 0, 0],
      top: [0, 3.2, 0.4],
      reset: [0, 0, 3.2]
    },
    sales: {
      days7: 380,
      days14: 890,
      days30: 2150,
      allTime: 16400
    },
    badge: 'Winter Top Pick',
    printAreas: MASTER_CALIBRATIONS['hoodie'],
    defaultPrintArea: 'center_chest'
  },
  {
    id: 'jersey',
    name: 'Pro Athletic Sports Jersey',
    variant: 'Dry-Fit Honeycomb',
    subtitle: '100% Moisture-Wicking Honeycomb Mesh • Custom Names & Numbers',
    category: 'Sportswear',
    categoryKey: 'apparel',
    basePrice: 499,
    rating: 4.8,
    reviewsCount: 780,
    image: 'https://images.unsplash.com/photo-1580087433295-ab2600c1030e?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/jersey.glb',
    defaultColor: '#1e3a8a',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    defaultSize: 'L',
    materialProps: { roughness: 0.45, metalness: 0.15, fabricType: 'Dry-Fit Mesh' },
    defaultCamera: { position: [0, 0, 2.9], target: [0, -0.05, 0], fov: 45 },
    supportedMethods: ['dtf', 'sublimation'],
    cameraPresets: {
      front: [0, 0, 2.9],
      back: [0, 0, -2.9],
      left: [-2.9, 0, 0],
      right: [2.9, 0, 0],
      top: [0, 2.9, 0.4],
      reset: [0, 0, 2.9]
    },
    sales: {
      days7: 190,
      days14: 430,
      days30: 1120,
      allTime: 6700
    },
    badge: 'Team Special',
    printAreas: MASTER_CALIBRATIONS['round-neck-tshirt'],
    defaultPrintArea: 'center_chest'
  },
  {
    id: 'apron',
    name: 'Chef & Barista Kitchen Apron',
    variant: 'Adjustable Bib Twill',
    subtitle: 'Heavy Cotton Twill with Front Utility Pockets & Adjustable Straps',
    category: 'Accessories',
    categoryKey: 'accessories',
    basePrice: 349,
    rating: 4.7,
    reviewsCount: 460,
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/apron.glb',
    defaultColor: '#1c1917',
    sizes: ['Standard Adult (Adjustable)'],
    defaultSize: 'Standard Adult (Adjustable)',
    materialProps: { roughness: 0.85, metalness: 0.05, fabricType: 'Cotton Twill' },
    defaultCamera: { position: [0, 0, 2.8], target: [0, -0.1, 0], fov: 45 },
    supportedMethods: ['dtf', 'screen_print', 'embroidery'],
    cameraPresets: {
      front: [0, 0, 2.8],
      back: [0, 0, -2.8],
      left: [-2.8, 0, 0],
      right: [2.8, 0, 0],
      top: [0, 2.8, 0.4],
      reset: [0, 0, 2.8]
    },
    sales: {
      days7: 145,
      days14: 320,
      days30: 840,
      allTime: 4900
    },
    badge: 'Cafe & Kitchen',
    printAreas: MASTER_CALIBRATIONS['apron'],
    defaultPrintArea: 'apron_bib'
  },
  {
    id: 'cap',
    name: 'Structured Snapback Cap',
    variant: '6-Panel High Crown',
    subtitle: '100% Acrylic Twill • 6-Panel High Crown with Curved Visor',
    category: 'Headwear',
    categoryKey: 'accessories',
    basePrice: 299,
    rating: 4.8,
    reviewsCount: 1120,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/cap.glb',
    defaultColor: '#18181b',
    sizes: ['Adjustable (56-62cm)'],
    defaultSize: 'Adjustable (56-62cm)',
    materialProps: { roughness: 0.82, metalness: 0.08, fabricType: 'Acrylic Twill' },
    defaultCamera: { position: [0, 0.2, 2.2], target: [0, 0, 0], fov: 42 },
    supportedMethods: ['embroidery', 'dtf'],
    cameraPresets: {
      front: [0, 0.15, 2.2],
      back: [0, 0.15, -2.2],
      left: [-2.2, 0.15, 0],
      right: [2.2, 0.15, 0],
      top: [0, 2.2, 0.1],
      reset: [0, 0.2, 2.2]
    },
    sales: {
      days7: 290,
      days14: 670,
      days30: 1680,
      allTime: 12100
    },
    badge: 'Top Headwear',
    printAreas: MASTER_CALIBRATIONS['cap'],
    defaultPrintArea: 'cap_front'
  },
  {
    id: 'cup',
    name: 'Glossy Ceramic Coffee Cup / Mug',
    variant: '11oz Grade-AAA Glaze',
    subtitle: '11 oz Grade-AAA Ceramic • High Gloss Sublimation Wrap',
    category: 'Drinkware',
    categoryKey: 'drinkware',
    basePrice: 199,
    rating: 4.9,
    reviewsCount: 3100,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/cup.glb',
    defaultColor: '#f8fafc',
    sizes: ['11 oz (325 ml)', '15 oz (440 ml)'],
    defaultSize: '11 oz (325 ml)',
    materialProps: { roughness: 0.12, metalness: 0.05, fabricType: 'Glazed Ceramic' },
    defaultCamera: { position: [0, 0.15, 2.3], target: [0, 0, 0], fov: 42 },
    supportedMethods: ['sublimation'],
    cameraPresets: {
      front: [0, 0.1, 2.3],
      back: [0, 0.1, -2.3],
      left: [-2.3, 0.1, 0],
      right: [2.3, 0.1, 0],
      top: [0, 2.3, 0.1],
      reset: [0, 0.15, 2.3]
    },
    sales: {
      days7: 510,
      days14: 1190,
      days30: 2890,
      allTime: 24800
    },
    badge: '#1 Gifting Item',
    printAreas: MASTER_CALIBRATIONS['cup'],
    defaultPrintArea: 'cup_front'
  },
  {
    id: 'badge',
    name: 'Custom Pin Button Badges',
    variant: 'Pack of 5 Mylar Pins',
    subtitle: 'High Gloss Mylar Coated Metal Pin Back Badges (Pack of 5)',
    category: 'Accessories',
    categoryKey: 'accessories',
    basePrice: 99,
    rating: 4.8,
    reviewsCount: 890,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/badge.glb',
    defaultColor: '#f97316',
    sizes: ['44 mm (Standard)', '58 mm (Large)'],
    defaultSize: '58 mm (Large)',
    materialProps: { roughness: 0.18, metalness: 0.25, fabricType: 'Glossy Tinplate' },
    defaultCamera: { position: [0, 0, 1.8], target: [0, 0, 0], fov: 38 },
    supportedMethods: ['sublimation', 'dtf'],
    cameraPresets: {
      front: [0, 0, 1.8],
      back: [0, 0, -1.8],
      left: [-1.8, 0, 0],
      right: [1.8, 0, 0],
      top: [0, 1.8, 0.1],
      reset: [0, 0, 1.8]
    },
    sales: {
      days7: 310,
      days14: 720,
      days30: 1810,
      allTime: 15300
    },
    badge: 'Event Hit',
    printAreas: MASTER_CALIBRATIONS['badge'],
    defaultPrintArea: 'badge_face'
  },
  {
    id: 'mouse-pad',
    name: 'Speed Edition Gaming Mouse Pad',
    variant: 'Micro-Woven Cloth',
    subtitle: 'Micro-Woven Cloth Surface with Anti-Slip Natural Rubber Base',
    category: 'Desk & Office',
    categoryKey: 'office',
    basePrice: 249,
    rating: 4.9,
    reviewsCount: 1410,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/mouse-pad.glb',
    defaultColor: '#09090b',
    sizes: ['Standard (24x20cm)', 'XL Desk Mat (80x30cm)'],
    defaultSize: 'Standard (24x20cm)',
    materialProps: { roughness: 0.70, metalness: 0.05, fabricType: 'Micro-Woven Textile' },
    defaultCamera: { position: [0, 1.8, 1.2], target: [0, 0, 0], fov: 42 },
    supportedMethods: ['sublimation', 'dtf'],
    cameraPresets: {
      front: [0, 1.8, 1.2],
      back: [0, -1.8, 1.2],
      left: [-1.8, 0.8, 0],
      right: [1.8, 0.8, 0],
      top: [0, 2.2, 0.01],
      reset: [0, 1.8, 1.2]
    },
    sales: {
      days7: 280,
      days14: 640,
      days30: 1590,
      allTime: 13400
    },
    badge: 'Setup Essential',
    printAreas: [
      { id: 'mousepad_full', name: 'Full Edge-to-Edge Print', section: 'front', cameraView: 'front', bounds: { x: 0.08, y: 0.08, w: 0.84, h: 0.84 }, maxDimension: 'Full Surface', fee: 60 },
    ],
    defaultPrintArea: 'mousepad_full'
  },
  {
    id: 'photo-frame',
    name: 'Acrylic Wooden Desk Photo Frame',
    variant: 'Cast Acrylic Stand',
    subtitle: 'High-Definition UV Direct Print on Clear Acrylic with Solid Wood Base',
    category: 'Home & Decor',
    categoryKey: 'decor',
    basePrice: 449,
    rating: 4.9,
    reviewsCount: 820,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    modelPath: '/models/photo-frame.glb',
    defaultColor: '#ffffff',
    sizes: ['6 x 4 in Desk Frame', '8 x 6 in Table Frame', '12 x 8 in Wall Mount'],
    defaultSize: '8 x 6 in Table Frame',
    materialProps: { roughness: 0.15, metalness: 0.08, fabricType: 'Cast Acrylic Glass' },
    defaultCamera: { position: [0, 0.1, 2.4], target: [0, 0, 0], fov: 42 },
    supportedMethods: ['sublimation', 'dtf'],
    cameraPresets: {
      front: [0, 0.1, 2.4],
      back: [0, 0.1, -2.4],
      left: [-2.4, 0.1, 0],
      right: [2.4, 0.1, 0],
      top: [0, 2.4, 0.1],
      reset: [0, 0.1, 2.4]
    },
    sales: {
      days7: 195,
      days14: 480,
      days30: 1210,
      allTime: 9200
    },
    badge: 'Memory Gift',
    printAreas: [
      { id: 'frame_photo', name: 'Photo Surface', section: 'front', cameraView: 'front', bounds: { x: 0.12, y: 0.12, w: 0.76, h: 0.76 }, maxDimension: 'Edge-to-Edge HD', fee: 90 },
    ],
    defaultPrintArea: 'frame_photo'
  }
];

export const INITIAL_PRODUCTS = DEFAULT_PRESET_PRODUCTS;

export const COLOR_PALETTE = [
  { name: 'Obsidian Black', hex: '#121214', category: 'dark', textColor: '#ffffff' },
  { name: 'Pure Snow White', hex: '#f8fafc', category: 'light', textColor: '#0f172a' },
  { name: 'Midnight Navy', hex: '#0f172a', category: 'dark', textColor: '#ffffff' },
  { name: 'Heather Charcoal', hex: '#334155', category: 'dark', textColor: '#ffffff' },
  { name: 'French Heather Grey', hex: '#94a3b8', category: 'neutral', textColor: '#0f172a' },
  { name: 'Crimson Scarlet', hex: '#dc2626', category: 'vibrant', textColor: '#ffffff' },
  { name: 'Electric Royal Blue', hex: '#2563eb', category: 'vibrant', textColor: '#ffffff' },
  { name: 'Deep Forest Green', hex: '#14532d', category: 'dark', textColor: '#ffffff' },
  { name: 'Sage Green', hex: '#65a30d', category: 'pastel', textColor: '#ffffff' },
  { name: 'Warm Sandstone', hex: '#d6c7b2', category: 'neutral', textColor: '#0f172a' },
  { name: 'Mustard Goldenrod', hex: '#eab308', category: 'vibrant', textColor: '#0f172a' },
  { name: 'Sunset Terracotta', hex: '#ea580c', category: 'vibrant', textColor: '#ffffff' },
  { name: 'Dusty Lavender Pink', hex: '#c084fc', category: 'pastel', textColor: '#0f172a' },
  { name: 'Blush Coral', hex: '#fb7185', category: 'pastel', textColor: '#0f172a' },
  { name: 'Cyber Neon Lime', hex: '#84cc16', category: 'vibrant', textColor: '#0f172a' },
  { name: 'Dark Burgundy Wine', hex: '#4c0519', category: 'dark', textColor: '#ffffff' },
];

export const PRINTING_METHODS = [
  {
    id: 'dtf',
    name: 'HD Direct-to-Film (DTF)',
    tag: 'Most Popular',
    description: 'Ultra-vibrant, razor-sharp details, infinite colors, durable stretch feel.',
    feePerArea: 0,
    minQty: 1,
  },
  {
    id: 'screen_print',
    name: 'Premium Screen Printing',
    tag: 'Best for Bulk',
    description: 'Classic breathable ink with soft hand-feel. Ideal for bold spot colors.',
    feePerArea: -20,
    minQty: 10,
  },
  {
    id: 'embroidery',
    name: 'High-Density 3D Embroidery',
    tag: 'Luxury Texture',
    description: 'Rich stitched thread relief for executive corporate & streetwear look.',
    feePerArea: 80,
    minQty: 5,
  },
  {
    id: 'sublimation',
    name: 'All-Over HD Sublimation',
    tag: 'Seamless Gloss',
    description: 'Zero feel, permanent dye fusion into polyester & ceramic surfaces.',
    feePerArea: 40,
    minQty: 1,
  }
];

export const QUANTITY_TIERS = [
  { min: 1, max: 4, discountPercent: 0, label: 'Standard Retail' },
  { min: 5, max: 19, discountPercent: 15, label: 'Small Team (15% Off)' },
  { min: 20, max: 49, discountPercent: 25, label: 'Organization (25% Off)' },
  { min: 50, max: 99, discountPercent: 35, label: 'Bulk Batch (35% Off)' },
  { min: 100, max: 9999, discountPercent: 45, label: 'Enterprise Wholesale (45% Off)' },
];

export const OFFERS_LIST = [
  {
    id: 'offer_1',
    code: 'FIRST10',
    title: 'Flat 10% Off on First Custom Order',
    desc: 'Valid on all custom T-Shirts, Hoodies, Mugs & Photo Frames with zero minimum order value.',
    discount: '10% OFF',
    minOrder: '₹0',
    expiry: 'Never Expires',
    badge: 'New User'
  },
  {
    id: 'offer_2',
    code: 'BULKPRINT25',
    title: '25% Off on Bulk Orders (20+ Pcs)',
    desc: 'Perfect for startups, college festivals, sports teams and corporate events.',
    discount: '25% OFF',
    minOrder: '20 Items',
    expiry: 'Active All Year',
    badge: 'Best for Teams'
  },
  {
    id: 'offer_3',
    code: 'FREESHIP',
    title: 'Free Express Pan-India Delivery',
    desc: 'Enjoy free doorstep delivery on all customized merchandise carts above ₹999.',
    discount: 'FREE SHIPPING',
    minOrder: '₹999',
    expiry: 'Limited Time',
    badge: 'Popular'
  },
  {
    id: 'offer_4',
    code: 'MUGCOMBO',
    title: 'Buy 3 Ceramic Mugs & Get 1 Free',
    desc: 'Design personalized photo coffee cups for family or office desks.',
    discount: 'BUY 3 GET 1',
    minOrder: '4 Mugs',
    expiry: 'Festive Deal',
    badge: 'Gifting Special'
  }
];
