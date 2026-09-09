import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  FileText,
  Bell,
  Image as ImageIcon,
  ShoppingBag,
  Grid,
  Layers,
  Package,
  PlusCircle,
  DollarSign,
  Receipt,
  BarChart3,
  Sliders,
  Users,
  PhoneCall,
  ShieldCheck,
  Activity,
  LogOut,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminDashboardTab } from '../Admin/AdminDashboardTab';
import { AdminHomepageCmsTab } from '../Admin/AdminHomepageCmsTab';
import { AdminAnnouncementTab } from '../Admin/AdminAnnouncementTab';
import { AdminImageManagerTab } from '../Admin/AdminImageManagerTab';
import { AdminProductsTab } from '../Admin/AdminProductsTab';
import { AdminCategoriesTab } from '../Admin/AdminCategoriesTab';
import { AdminStockTab } from '../Admin/AdminStockTab';
import { AdminOrdersTab } from '../Admin/AdminOrdersTab';
import { AdminManualOrderTab } from '../Admin/AdminManualOrderTab';
import { AdminFinanceTab } from '../Admin/AdminFinanceTab';
import { AdminExpensesTab } from '../Admin/AdminExpensesTab';
import { AdminReportsTab } from '../Admin/AdminReportsTab';
import { AdminDesignRequestsTab } from '../Admin/AdminDesignRequestsTab';
import { Admin3DStudioConfigTab } from '../Admin/Admin3DStudioConfigTab';
import { AdminCustomersTab } from '../Admin/AdminCustomersTab';
import { AdminContactSettingsTab } from '../Admin/AdminContactSettingsTab';
import { AdminAuditLogTab } from '../Admin/AdminAuditLogTab';
import { AdminRolesTab } from '../Admin/AdminRolesTab';

/**
 * The PrintHub — Complete Atelier Command Center
 * Unified enterprise management portal controlling all storefront content,
 * inventory, orders, financials, customizer settings, and security.
 *
 * Strictly adheres to the 4-Color Palette:
 * - Primary Dark Green: #183630
 * - Primary Beige: #E5DAC9
 * - Primary Soft Gold: #E5C690
 * - Highlight Taupe: #B8A98F
 */
export function AdminView() {
  const {
    adminUser,
    logoutAdmin,
    navigateTo,
    storeSettings,
    products = [],
    categories = [],
    adminOrders = [],
    inventory = [],
    designRequests = [],
    customers = [],
    announcements = [],
    homepageContent = {},
    publishAllHomepageDrafts,
    adminRole,
    changeAdminRole,
  } = useStore();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [publishBannerDismissed, setPublishBannerDismissed] = useState(false);
  const [isModulesMenuOpen, setIsModulesMenuOpen] = useState(false);

  // Tabs horizontal scroll ref and state
  const tabsContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!tabsContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  const scrollTabs = (direction) => {
    if (!tabsContainerRef.current) return;
    const scrollAmount = 300;
    tabsContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const selectTab = (tabId) => {
    setActiveTab(tabId);
    setIsModulesMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(`nav-tab-${tabId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 50);
  };

  // Status badges & KPI counts for navigation items
  const newRequestsCount = useMemo(
    () => designRequests.filter((r) => r.status === 'NEW').length,
    [designRequests]
  );
  const lowStockCount = useMemo(
    () => inventory.filter((i) => (Number(i.currentStock) || 0) <= (Number(i.minStock) || 5)).length,
    [inventory]
  );
  const pendingOrdersCount = useMemo(
    () => adminOrders.filter((o) => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'IN_PRODUCTION').length,
    [adminOrders]
  );

  const hasDrafts = homepageContent?.hasUnpublishedDrafts;

  const handlePublishAll = () => {
    publishAllHomepageDrafts();
  };

  const handleLogout = () => {
    logoutAdmin();
    navigateTo('home');
  };

  // Nav item definitions
  const NAV_TABS = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard, badge: null },
    { id: 'cms', label: 'HOMEPAGE CMS', icon: FileText, badge: hasDrafts ? 'DRAFTS' : null, alert: hasDrafts },
    { id: 'announcements', label: 'ANNOUNCEMENTS', icon: Bell, badge: announcements.length > 0 ? `${announcements.length}` : null },
    { id: 'images', label: 'MEDIA & IMAGES', icon: ImageIcon, badge: null },
    { id: 'products', label: 'PRODUCTS', icon: ShoppingBag, badge: products.length > 0 ? `${products.length}` : null },
    { id: 'categories', label: 'CATEGORIES', icon: Grid, badge: categories.length > 0 ? `${categories.length}` : null },
    { id: 'stock', label: 'STOCK & INVENTORY', icon: Layers, badge: lowStockCount > 0 ? `${lowStockCount} LOW` : null, alert: lowStockCount > 0 },
    { id: 'orders', label: 'ORDERS FULFILLMENT', icon: Package, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} ACTIVE` : null },
    { id: 'manual-order', label: 'MANUAL ORDER (POS)', icon: PlusCircle, badge: 'NEW' },
    { id: 'finance', label: 'P&L FINANCIALS', icon: DollarSign, badge: null },
    { id: 'expenses', label: 'EXPENSES LEDGER', icon: Receipt, badge: null },
    { id: 'reports', label: 'EXECUTIVE REPORTS', icon: BarChart3, badge: null },
    { id: 'requests', label: 'DESIGN REQUESTS', icon: Package, badge: newRequestsCount > 0 ? `${newRequestsCount} NEW` : null, alert: newRequestsCount > 0 },
    { id: 'studio3d', label: '3D STUDIO CONFIG', icon: Sliders, badge: null },
    { id: 'customers', label: 'CLIENT CRM', icon: Users, badge: customers.length > 0 ? `${customers.length}` : null },
    { id: 'contact', label: 'CONTACT & SOCIAL', icon: PhoneCall, badge: null },
    { id: 'audit', label: 'AUDIT LOG', icon: Activity, badge: null },
    { id: 'roles', label: 'ROLES & RBAC', icon: ShieldCheck, badge: adminRole?.badge || 'FULL ACCESS' },
  ];

  return (
    <div className="min-h-screen bg-[#E5DAC9] text-[#183630] select-none font-sans pb-24">
      {/* Top Header (#183630 Primary Dark Green) */}
      <header className="sticky top-0 z-40 bg-[#183630] border-b border-[#B8A98F]/30 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 text-[#E5DAC9] shadow-md">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#183630] border border-[#B8A98F]/40 flex items-center justify-center p-1.5 shadow-md shrink-0">
            <img
              src="/logo-mark-symbol.png"
              alt="The PrintHub"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm sm:text-base text-[#E5DAC9] uppercase tracking-tight">
                {storeSettings?.storeName || 'The PrintHub'} Atelier Command Center
              </span>
              <span className="px-2 py-0.5 rounded bg-[#E5C690]/20 text-[#E5C690] border border-[#B8A98F]/40 text-[9px] font-mono font-bold">
                SECURE
              </span>
            </div>
            <span className="text-[10px] text-[#E5DAC9]/70 font-mono block">
              Operator: {adminUser?.email || 'admin@theprinthub.com'} • Tier:{' '}
              <span className="text-[#E5C690] font-bold">{adminRole?.name || adminRole?.id || 'Super Administrator'}</span>
            </span>
          </div>
        </div>

        {/* Right Actions & Shortcuts */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Storefront Link */}
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E5DAC9]/10 border border-[#B8A98F]/40 text-xs font-mono text-[#E5C690] hover:text-[#E5DAC9] hover:bg-[#E5DAC9]/20 transition-colors cursor-pointer"
            title="Open Live Customer Storefront"
          >
            <span>Customer Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E5C690] text-[#183630] hover:bg-[#d9b87c] text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Unpublished CMS Drafts Global Notification Banner */}
      {hasDrafts && !publishBannerDismissed && (
        <div className="bg-[#E5C690] border-b border-[#B8A98F] px-4 sm:px-8 py-2.5 text-[#183630] font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping shrink-0" />
            <span className="font-bold">
              [ UNPUBLISHED DRAFTS ]: You have modified homepage copy saved in draft mode.
            </span>
            <span className="text-[11px] text-[#183630]/80 hidden md:inline">
              Storefront visitors will see current live text until you publish.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePublishAll}
              className="px-3 py-1 rounded-xl bg-[#183630] text-[#E5C690] hover:bg-[#183630]/90 font-bold text-[11px] cursor-pointer shadow-sm transition-all"
            >
              [ PUBLISH ALL TO STOREFRONT ]
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cms')}
              className="px-2.5 py-1 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold text-[11px] cursor-pointer"
            >
              REVIEW IN CMS
            </button>
            <button
              type="button"
              onClick={() => setPublishBannerDismissed(true)}
              className="p-1 text-[#183630]/60 hover:text-[#183630] text-xs font-bold"
              title="Dismiss Notice"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Horizontal Navigation Tabs Bar (#183630 with [ Bracket ] treatment) */}
      <div className="sticky top-[61px] z-30 bg-[#183630] border-b border-[#B8A98F]/30 px-3 sm:px-6 text-[#E5DAC9] shadow-sm">
        <div className="max-w-[1700px] mx-auto flex items-center relative py-1.5">
          {/* Scroll Left Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollTabs('left')}
              className="shrink-0 p-1.5 mr-1 rounded-lg bg-[#183630] border border-[#B8A98F]/50 text-[#E5C690] hover:bg-[#E5DAC9]/20 hover:text-[#E5DAC9] transition-all shadow-md cursor-pointer z-10"
              title="Scroll Tabs Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Left Fade Indicator */}
          {canScrollLeft && (
            <div className="absolute left-7 top-0 bottom-0 w-8 bg-gradient-to-r from-[#183630] to-transparent pointer-events-none z-10" />
          )}

          {/* Scrollable Tabs Track */}
          <div
            ref={tabsContainerRef}
            onScroll={checkScroll}
            onWheel={(e) => {
              if (e.deltaY !== 0 && tabsContainerRef.current) {
                tabsContainerRef.current.scrollLeft += e.deltaY;
              }
            }}
            className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 scroll-smooth"
          >
            {NAV_TABS.map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  id={`nav-tab-${tab.id}`}
                  key={tab.id}
                  type="button"
                  onClick={() => selectTab(tab.id)}
                  className={`py-2 px-3 text-[11px] font-mono font-bold tracking-wider rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer whitespace-nowrap select-none ${
                    active
                      ? 'bg-[#E5DAC9]/15 text-[#E5C690] border border-[#B8A98F]/60 font-black shadow-xs'
                      : 'text-[#E5DAC9]/75 hover:text-[#E5C690] hover:bg-[#E5DAC9]/10 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-[#E5C690]' : 'text-[#E5DAC9]/60'}`} />
                  <span className="tracking-wide">
                    {active ? (
                      <>
                        <span className="text-[#B8A98F] font-black mr-0.5">[</span>
                        <span>{tab.label}</span>
                        <span className="text-[#B8A98F] font-black ml-0.5">]</span>
                      </>
                    ) : (
                      tab.label
                    )}
                  </span>
                  {tab.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[9px] font-black font-mono border ${
                        tab.alert
                          ? 'bg-amber-600 text-white border-amber-500 animate-pulse'
                          : active
                          ? 'bg-[#E5C690] text-[#183630] border-[#E5C690]'
                          : 'bg-[#E5DAC9]/20 text-[#E5C690] border-[#B8A98F]/40'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Fade Indicator */}
          {canScrollRight && (
            <div className="absolute right-28 top-0 bottom-0 w-8 bg-gradient-to-l from-[#183630] to-transparent pointer-events-none z-10" />
          )}

          {/* Scroll Right Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollTabs('right')}
              className="shrink-0 p-1.5 ml-1 rounded-lg bg-[#183630] border border-[#B8A98F]/50 text-[#E5C690] hover:bg-[#E5DAC9]/20 hover:text-[#E5DAC9] transition-all shadow-md cursor-pointer z-10"
              title="Scroll Tabs Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Quick Jump Dropdown Trigger */}
          <div className="relative shrink-0 ml-2">
            <button
              type="button"
              onClick={() => setIsModulesMenuOpen(!isModulesMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#E5DAC9]/10 hover:bg-[#E5DAC9]/20 border border-[#B8A98F]/40 text-[11px] font-mono font-bold text-[#E5C690] transition-colors cursor-pointer"
              title="Jump directly to any module"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Jump To</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isModulesMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isModulesMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsModulesMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 max-h-[75vh] overflow-y-auto rounded-2xl bg-[#183630] border border-[#B8A98F] p-3 shadow-2xl z-50 text-[#E5DAC9] font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#B8A98F]/30">
                    <span className="font-bold text-[#E5C690] uppercase tracking-wider text-[11px]">
                      All 18 Command Center Modules
                    </span>
                    <span className="text-[10px] text-[#E5DAC9]/60">Quick Access</span>
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    {NAV_TABS.map((t) => {
                      const isActive = activeTab === t.id;
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => selectTab(t.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-[#E5C690] text-[#183630] font-bold'
                              : 'hover:bg-[#E5DAC9]/15 text-[#E5DAC9]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="text-[11px]">{t.label}</span>
                          </div>
                          {t.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#183630]/20">
                              {t.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Command Center Stage */}
      <main className="max-w-[1700px] mx-auto px-4 sm:px-8 py-8 animate-in fade-in">
        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {activeTab === 'dashboard' && (
          <AdminDashboardTab
            onNavigate={(tabKey) => setActiveTab(tabKey)}
          />
        )}

        {/* TAB 2: HOMEPAGE CMS */}
        {activeTab === 'cms' && (
          <AdminHomepageCmsTab
            onNavigateToImages={() => setActiveTab('images')}
          />
        )}

        {/* TAB 3: ANNOUNCEMENTS MANAGER */}
        {activeTab === 'announcements' && (
          <AdminAnnouncementTab />
        )}

        {/* TAB 4: IMAGE & MEDIA MANAGER */}
        {activeTab === 'images' && (
          <AdminImageManagerTab />
        )}

        {/* TAB 5: PRODUCT CATALOG */}
        {activeTab === 'products' && (
          <AdminProductsTab
            onNavigateToCategories={() => setActiveTab('categories')}
          />
        )}

        {/* TAB 6: CATEGORIES TAXONOMY */}
        {activeTab === 'categories' && (
          <AdminCategoriesTab />
        )}

        {/* TAB 7: STOCK & INVENTORY */}
        {activeTab === 'stock' && (
          <AdminStockTab />
        )}

        {/* TAB 8: ORDERS FULFILLMENT */}
        {activeTab === 'orders' && (
          <AdminOrdersTab
            onNavigateToManualOrder={() => setActiveTab('manual-order')}
          />
        )}

        {/* TAB 9: MANUAL ORDER (POS) */}
        {activeTab === 'manual-order' && (
          <AdminManualOrderTab
            onOrderCreated={() => setActiveTab('orders')}
          />
        )}

        {/* TAB 10: PROFIT & LOSS FINANCIALS */}
        {activeTab === 'finance' && (
          <AdminFinanceTab />
        )}

        {/* TAB 11: EXPENSES LEDGER */}
        {activeTab === 'expenses' && (
          <AdminExpensesTab />
        )}

        {/* TAB 12: EXECUTIVE REPORTS */}
        {activeTab === 'reports' && (
          <AdminReportsTab />
        )}

        {/* TAB 13: DESIGN REQUESTS QUEUE */}
        {activeTab === 'requests' && (
          <AdminDesignRequestsTab />
        )}

        {/* TAB 14: 3D STUDIO CONFIG */}
        {activeTab === 'studio3d' && (
          <Admin3DStudioConfigTab />
        )}

        {/* TAB 15: CLIENT CRM DIRECTORY */}
        {activeTab === 'customers' && (
          <AdminCustomersTab />
        )}

        {/* TAB 16: CONTACT & SOCIAL SETTINGS */}
        {activeTab === 'contact' && (
          <AdminContactSettingsTab />
        )}

        {/* TAB 17: SECURITY & ACTIVITY AUDIT LOG */}
        {activeTab === 'audit' && (
          <AdminAuditLogTab />
        )}

        {/* TAB 18: ROLES & RBAC */}
        {activeTab === 'roles' && (
          <AdminRolesTab />
        )}
      </main>
    </div>
  );
}

export default AdminView;
