import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Box,
  Image as ImageIcon,
  Phone,
  Mail,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Check,
  Sparkles,
  Save,
  Palette,
  Users,
  Search,
  Eye,
  Sliders,
  Maximize2,
  LogOut,
  Package,
  MessageCircle,
  Clock,
  CheckCircle2,
  Download,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DESIGN_REQUEST_STATUSES } from '../../constants/requests';
import { AdminRequestDetailModal } from '../Admin/AdminRequestDetailModal';
import { AdminCalibrationTab } from '../Admin/AdminCalibrationTab';
import { AdminProductsTab } from '../Admin/AdminProductsTab';
import { AdminCategoriesTab } from '../Admin/AdminCategoriesTab';
import { generateDesignRequestZip } from '../../services/packageExporter';

/**
 * The PrintHub — Dedicated Admin Command Center
 * Manage Products, Customer Custom Design Requests, View/Download Artwork Files & Mockups,
 * Export Complete Request ZIP Packages, Contact Customers, and Calibrate Print Dimensions.
 */
export function AdminView() {
  const {
    designRequests = [],
    adminUser,
    logoutAdmin,
    navigateTo,
    storeSettings,
    updateStoreSettings,
    products = [],
    categories = [],
    updateDesignRequestStatus,
  } = useStore();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'requests' | 'calibration' | 'settings'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Stats calculation
  const totalCount = designRequests.length;
  const newCount = designRequests.filter((r) => r.status === 'NEW').length;
  const reviewCount = designRequests.filter((r) => r.status === 'UNDER_REVIEW').length;
  const contactedCount = designRequests.filter((r) => r.status === 'CUSTOMER_CONTACTED').length;
  const completedCount = designRequests.filter((r) => r.status === 'COMPLETED').length;

  // Filtered Requests List
  const filteredRequests = useMemo(() => {
    return designRequests.filter((req) => {
      if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = req.id?.toLowerCase().includes(q);
        const matchName = req.customer?.name?.toLowerCase().includes(q);
        const matchPhone = req.customer?.mobile?.toLowerCase().includes(q);
        const matchEmail = req.customer?.email?.toLowerCase().includes(q);
        const matchProduct = req.product?.name?.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchPhone && !matchEmail && !matchProduct) return false;
      }
      return true;
    });
  }, [designRequests, statusFilter, searchQuery]);

  // Handle Logout
  const handleLogout = () => {
    logoutAdmin();
    navigateTo('home');
  };

  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 select-none pb-20 font-sans">
      {/* Detail Modal Inspector */}
      {selectedRequest && (
        <AdminRequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 bg-[#090d1c]/95 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center p-1.5 shadow-md">
            <img
              src="/logo-mark-white.png"
              alt="The PrintHub"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm sm:text-base text-white uppercase tracking-tight">
                {storeSettings.storeName} Admin Command Center
              </span>
              <span className="px-2 py-0.5 rounded bg-lime-400/20 text-lime-400 border border-lime-400/30 text-[9px] font-mono font-bold">
                SECURE
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Logged in as: {adminUser?.email || 'admin@theprinthub.com'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 hover:text-white transition-colors"
          >
            <span>Customer Storefront</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 text-xs font-mono font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="bg-[#0a0e20] border-b border-slate-800 px-4 sm:px-8">
        <div className="max-w-[1500px] mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'products', label: 'PRODUCT CATALOG', count: products.length > 0 ? `${products.length} ITEMS` : 'EMPTY' },
            { id: 'categories', label: 'CATEGORIES', count: categories.length > 0 ? `${categories.length} CATS` : 'EMPTY' },
            { id: 'requests', label: 'DESIGN REQUESTS QUEUE', count: newCount > 0 ? `${newCount} NEW` : null },
            { id: 'calibration', label: 'PRINT AREA CALIBRATIONS' },
            { id: 'settings', label: 'STUDIO & CONTACT SETTINGS' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 px-4 text-xs font-mono font-bold tracking-wider border-b-2 transition-all shrink-0 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-lime-400 text-lime-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="px-1.5 py-0.5 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30 text-[10px] font-black font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 0: PRODUCT CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <main className="max-w-[1500px] mx-auto px-4 sm:px-8 py-8 animate-in fade-in">
          <AdminProductsTab onNavigateToCategories={() => setActiveTab('categories')} />
        </main>
      )}

      {/* TAB: CATEGORIES TAXONOMY MANAGEMENT */}
      {activeTab === 'categories' && (
        <main className="max-w-[1500px] mx-auto px-4 sm:px-8 py-8 animate-in fade-in">
          <AdminCategoriesTab />
        </main>
      )}

      {/* TAB 1: DESIGN REQUESTS QUEUE */}
      {activeTab === 'requests' && (
        <main className="max-w-[1500px] mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0c101d] border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">TOTAL REQUESTS</span>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">{totalCount}</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c101d] border border-cyan-500/30 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">NEW SUBMISSIONS</span>
              <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">{newCount}</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c101d] border border-indigo-500/30 space-y-1">
              <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">CONTACTED</span>
              <div className="text-2xl sm:text-3xl font-black text-indigo-300 font-mono">{contactedCount}</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c101d] border border-emerald-500/30 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">COMPLETED</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">{completedCount}</div>
            </div>
          </div>

          {/* Search and Status Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0c101d] border border-slate-800">
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
              {['ALL', 'NEW', 'UNDER_REVIEW', 'CUSTOMER_CONTACTED', 'COMPLETED', 'ARCHIVED'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold tracking-wider shrink-0 transition-all ${
                    statusFilter === st
                      ? 'bg-lime-400 text-slate-950 font-black shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Request ID, customer, product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Requests Table */}
          <div className="rounded-3xl bg-[#0c101d] border border-slate-800 overflow-hidden shadow-2xl">
            {filteredRequests.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Package className="w-8 h-8 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">No design requests found</h3>
                <p className="text-xs text-slate-500 font-mono">Try adjusting your search query or status filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#0e1424] border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Request ID</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Product & Specs</th>
                      <th className="py-3.5 px-4">Placements & Files</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredRequests.map((req) => {
                      const statusDef = DESIGN_REQUEST_STATUSES[req.status] || {
                        label: req.status,
                        badgeBg: 'bg-slate-800',
                        textColor: 'text-slate-300',
                      };

                      const whatsappNumber = req.customer?.mobile?.replace(/\D/g, '') || '';
                      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        `Hello ${req.customer?.name}! This is The PrintHub regarding your Custom Design Request (${req.id}).`
                      )}`;

                      return (
                        <tr key={req.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-4 px-4 font-bold text-cyan-300">
                            {req.id}
                          </td>

                          <td className="py-4 px-4 text-slate-400 text-[11px]">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-bold text-white block">{req.customer?.name}</span>
                            <span className="text-[11px] text-emerald-400 block">{req.customer?.mobile}</span>
                            <span className="text-[10px] text-slate-500 block truncate max-w-[150px]">{req.customer?.email}</span>
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-bold text-slate-200 block">{req.product?.name}</span>
                            <span className="text-[11px] text-slate-400 block font-sans">
                              {req.color?.name} • Size {req.size}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <span className="text-slate-300 block font-bold">
                              {req.placements?.length || 0} Print Location(s)
                            </span>
                            <span className="text-[10px] text-cyan-400 block">
                              {req.artworkFiles?.length || 0} Artwork File(s)
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusDef.badgeBg} ${statusDef.textColor} border ${statusDef.border || 'border-transparent'}`}>
                              {statusDef.label}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedRequest(req)}
                                className="px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-[11px] uppercase transition-colors"
                              >
                                Inspect
                              </button>

                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>

                              <button
                                type="button"
                                onClick={() => generateDesignRequestZip(req)}
                                className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:text-white transition-colors"
                                title="Download Complete Request ZIP"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      )}

      {/* TAB 2: PRODUCT CALIBRATION MATRIX */}
      {activeTab === 'calibration' && (
        <main className="max-w-[1500px] mx-auto px-4 sm:px-8 py-8 animate-in fade-in">
          <AdminCalibrationTab />
        </main>
      )}

      {/* TAB 3: STUDIO & CONTACT SETTINGS */}
      {activeTab === 'settings' && (
        <main className="max-w-3xl mx-auto px-4 sm:px-8 py-8 space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-[#0c101d] border border-slate-800 space-y-5">
            <h2 className="text-base font-bold text-white uppercase font-display border-b border-slate-800 pb-3">
              Production Facility & Contact Details
            </h2>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Studio Brand Name</label>
                <input
                  type="text"
                  value={storeSettings.storeName}
                  onChange={(e) => updateStoreSettings({ storeName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">WhatsApp Support Number</label>
                <input
                  type="text"
                  value={storeSettings.whatsapp}
                  onChange={(e) => updateStoreSettings({ whatsapp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Production Facility Email</label>
                <input
                  type="email"
                  value={storeSettings.email}
                  onChange={(e) => updateStoreSettings({ email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Factory Address</label>
                <textarea
                  rows="2"
                  value={storeSettings.address}
                  onChange={(e) => updateStoreSettings({ address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white resize-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Working Production Hours</label>
                <input
                  type="text"
                  value={storeSettings.workingHours}
                  onChange={(e) => updateStoreSettings({ workingHours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default AdminView;
