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

export const INITIAL_DESIGN_REQUESTS = [];

const STORAGE_KEY = 'the_printhub_design_requests';

/**
 * Retrieve all design requests from LocalStorage or initialize with defaults
 */
export function getStoredDesignRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      if (raw.includes('PH-2026-00001') || raw.includes('Vikram Malhotra')) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        return [];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
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
