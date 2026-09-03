/**
 * The PrintHub — Custom Design Request & Communication System
 * Core Data Models, Initial Sample Requests, and Persistence Helpers
 */

export const DESIGN_REQUEST_STATUSES = {
  NEW: { id: 'NEW', label: 'New Request', color: 'cyan', badgeBg: 'bg-cyan-500/20', textColor: 'text-cyan-400', border: 'border-cyan-500/30' },
  UNDER_REVIEW: { id: 'UNDER_REVIEW', label: 'Under Review', color: 'amber', badgeBg: 'bg-amber-500/20', textColor: 'text-amber-400', border: 'border-amber-500/30' },
  CUSTOMER_CONTACTED: { id: 'CUSTOMER_CONTACTED', label: 'Customer Contacted', color: 'indigo', badgeBg: 'bg-indigo-500/20', textColor: 'text-indigo-400', border: 'border-indigo-500/30' },
  COMPLETED: { id: 'COMPLETED', label: 'Completed', color: 'emerald', badgeBg: 'bg-emerald-500/20', textColor: 'text-emerald-400', border: 'border-emerald-500/30' },
  ARCHIVED: { id: 'ARCHIVED', label: 'Archived', color: 'slate', badgeBg: 'bg-slate-500/20', textColor: 'text-slate-400', border: 'border-slate-500/30' },
};

export const INITIAL_DESIGN_REQUESTS = [
  {
    id: 'PH-2026-00001',
    createdAt: '2026-09-02T14:30:00.000Z',
    customer: {
      name: 'Vikram Malhotra',
      mobile: '+91 98765 43210',
      email: 'vikram.m@gmail.com',
      company: 'Apex Esports Club',
      notes: 'Please keep the chest logo centered and crisp. Need by next Friday if possible.',
    },
    product: {
      id: 'oversized-tshirt',
      name: 'Round Neck T-Shirt (Oversized Fit)',
      variant: '240 GSM Heavyweight Terry Drop Shoulder',
      category: 'Apparel',
      basePrice: 599,
    },
    color: {
      name: 'Pitch Black',
      hex: '#18181b',
    },
    size: 'XL',
    printMethod: 'DTF (Direct-to-Film 300 DPI)',
    placements: [
      {
        placementId: 'left_chest',
        name: 'Left Chest / Pocket',
        surface: 'front',
        widthInches: 4.0,
        heightInches: 4.0,
        xInches: 0,
        yInches: 0,
        maxAreaW: 4.5,
        maxAreaH: 4.5,
        fee: 80,
      },
      {
        placementId: 'full_back',
        name: 'Full Back Statement',
        surface: 'back',
        widthInches: 14.0,
        heightInches: 16.0,
        xInches: 0,
        yInches: 0,
        maxAreaW: 16.0,
        maxAreaH: 20.0,
        fee: 180,
      },
    ],
    artworkFiles: [
      {
        id: 'file_01',
        placementId: 'left_chest',
        fileName: 'apex-crest-logo.png',
        fileType: 'image/png',
        fileSize: '1.2 MB',
        resolution: '2400 x 2400 px (300 DPI)',
        dataUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'file_02',
        placementId: 'full_back',
        fileName: 'apex-cyber-graphic.png',
        fileType: 'image/png',
        fileSize: '4.8 MB',
        resolution: '4200 x 4800 px (300 DPI)',
        dataUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
        previewUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
      },
    ],
    textLayers: [
      {
        placementId: 'full_back',
        text: 'APEX ESPORTS 2026',
        font: 'Montserrat ExtraBold',
        fontSize: 28,
        color: '#ffffff',
        xInches: 0,
        yInches: 6.5,
        rotation: 0,
      },
    ],
    mockups: [
      {
        id: 'mock_front',
        name: 'front.jpg',
        side: 'front',
        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'mock_back',
        name: 'back.jpg',
        side: 'back',
        url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      },
    ],
    status: 'NEW',
    adminNotes: 'High priority esports merchandise. Verified high-resolution artwork.',
  },
  {
    id: 'PH-2026-00002',
    createdAt: '2026-09-02T16:15:00.000Z',
    customer: {
      name: 'Priya Sharma',
      mobile: '+91 91234 56789',
      email: 'priya.sharma@gmail.com',
      company: 'Brew & Bean Cafe',
      notes: 'For barista uniforms. Need gold thread embroidery on apron bib.',
    },
    product: {
      id: 'apron',
      name: 'Chef & Barista Kitchen Apron',
      variant: 'Adjustable Heavy Cotton Twill',
      category: 'Accessories',
      basePrice: 349,
    },
    color: {
      name: 'Espresso Brown',
      hex: '#1c1917',
    },
    size: 'Standard Adult (Adjustable)',
    printMethod: 'Precision Embroidery',
    placements: [
      {
        placementId: 'apron_bib',
        name: 'Bib / Center Chest',
        surface: 'front',
        widthInches: 8.0,
        heightInches: 8.0,
        xInches: 0,
        yInches: 0,
        maxAreaW: 9.0,
        maxAreaH: 9.0,
        fee: 80,
      },
    ],
    artworkFiles: [
      {
        id: 'file_03',
        placementId: 'apron_bib',
        fileName: 'brew-and-bean-logo.svg',
        fileType: 'image/svg+xml',
        fileSize: '450 KB',
        resolution: 'Vector SVG (Infinitely Scalable)',
        dataUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80',
        previewUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80',
      },
    ],
    textLayers: [],
    mockups: [
      {
        id: 'mock_apron',
        name: 'front.jpg',
        side: 'front',
        url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80',
      },
    ],
    status: 'CUSTOMER_CONTACTED',
    adminNotes: 'Contacted on WhatsApp. Customer confirmed 20 units.',
  },
];

const STORAGE_KEY = 'the_printhub_design_requests';

/**
 * Retrieve all design requests from LocalStorage or initialize with defaults
 */
export function getStoredDesignRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load design requests from storage:', err);
  }
  return INITIAL_DESIGN_REQUESTS;
}

/**
 * Generate sequential Request ID (e.g. PH-2026-00003)
 */
export function generateRequestId() {
  const currentYear = new Date().getFullYear();
  const existing = getStoredDesignRequests();
  const nextNum = existing.length + 1;
  const padded = String(nextNum).padStart(5, '0');
  return `PH-${currentYear}-${padded}`;
}

/**
 * Save new design request to storage
 */
export function saveDesignRequest(requestObj) {
  try {
    const existing = getStoredDesignRequests();
    const updated = [requestObj, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to save design request:', err);
    return false;
  }
}

/**
 * Update an existing design request
 */
export function updateDesignRequest(requestId, updates) {
  try {
    const existing = getStoredDesignRequests();
    const index = existing.findIndex((r) => r.id === requestId);
    if (index !== -1) {
      existing[index] = { ...existing[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      return true;
    }
  } catch (err) {
    console.error('Failed to update design request:', err);
  }
  return false;
}

/**
 * Delete a design request
 */
export function deleteDesignRequest(requestId) {
  try {
    const existing = getStoredDesignRequests();
    const filtered = existing.filter((r) => r.id !== requestId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to delete design request:', err);
    return false;
  }
}

/**
 * Find design request by ID
 */
export function getDesignRequestById(requestId) {
  const existing = getStoredDesignRequests();
  return existing.find((r) => r.id.toLowerCase() === requestId.trim().toLowerCase()) || null;
}
