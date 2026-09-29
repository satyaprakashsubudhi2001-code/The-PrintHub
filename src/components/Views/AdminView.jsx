import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard, FileText, Bell, Image as ImageIcon, ShoppingBag, Grid, Layers, Package,
  PlusCircle, DollarSign, Receipt, BarChart3, Sliders, Users, PhoneCall, ShieldCheck, Activity,
  LogOut, ExternalLink, Menu, X
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

export function AdminView() {
  const {
    adminUser, logoutAdmin, navigateTo, storeSettings, products = [], categories = [],
    adminOrders = [], inventory = [], designRequests = [], customers = [],
    announcements = [], homepageContent = {}, publishAllHomepageDrafts, adminRole,
  } = useStore();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [publishBannerDismissed, setPublishBannerDismissed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Status badges & KPI counts for navigation items
  const newRequestsCount = useMemo(() => designRequests.filter((r) => r.status === 'NEW').length, [designRequests]);
  const lowStockCount = useMemo(() => inventory.filter((i) => (Number(i.currentStock) || 0) <= (Number(i.minStock) || 5)).length, [inventory]);
  const pendingOrdersCount = useMemo(() => adminOrders.filter((o) => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'IN_PRODUCTION').length, [adminOrders]);
  const hasDrafts = homepageContent?.hasUnpublishedDrafts;

  const handlePublishAll = () => { publishAllHomepageDrafts(); };
  const handleLogout = () => { logoutAdmin(); navigateTo('home'); };

  const MODULES = [
    {
      group: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      group: 'CATALOG',
      items: [
        { id: 'products', label: 'Products', icon: ShoppingBag, badge: products.length > 0 ? `${products.length}` : null },
        { id: 'categories', label: 'Categories', icon: Grid, badge: categories.length > 0 ? `${categories.length}` : null }
      ]
    },
    {
      group: 'INVENTORY',
      items: [
        { id: 'stock', label: 'Stock & Inventory', icon: Layers, badge: lowStockCount > 0 ? `${lowStockCount} LOW` : null, alert: lowStockCount > 0 }
      ]
    },
    {
      group: 'ORDERS',
      items: [
        { id: 'orders', label: 'Orders Fulfillment', icon: Package, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} ACTIVE` : null },
        { id: 'manual-order', label: 'Manual Order / POS', icon: PlusCircle }
      ]
    },
    {
      group: 'CUSTOMERS',
      items: [
        { id: 'customers', label: 'Customers', icon: Users, badge: customers.length > 0 ? `${customers.length}` : null },
        { id: 'requests', label: 'Design Requests', icon: Package, badge: newRequestsCount > 0 ? `${newRequestsCount} NEW` : null, alert: newRequestsCount > 0 }
      ]
    },
    {
      group: 'CONTENT',
      items: [
        { id: 'cms', label: 'Homepage CMS', icon: FileText, badge: hasDrafts ? 'DRAFTS' : null, alert: hasDrafts },
        { id: 'announcements', label: 'Announcements', icon: Bell, badge: announcements.length > 0 ? `${announcements.length}` : null },
        { id: 'images', label: 'Media & Images', icon: ImageIcon }
      ]
    },
    {
      group: 'FINANCE',
      items: [
        { id: 'finance', label: 'P&L / Financial', icon: DollarSign },
        { id: 'expenses', label: 'Expenses Ledger', icon: Receipt },
        { id: 'reports', label: 'Executive Reports', icon: BarChart3 }
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'studio3d', label: '3D Studio Config', icon: Sliders },
        { id: 'contact', label: 'Contact & Social', icon: PhoneCall },
        { id: 'audit', label: 'Audit Log', icon: Activity },
        { id: 'roles', label: 'Roles & RBAC', icon: ShieldCheck, badge: adminRole?.badge || 'FULL ACCESS' }
      ]
    }
  ];

  const selectTab = (tabId) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false); // Close drawer on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4EBDD] text-[#18302B] select-none font-sans flex flex-col md:flex-row overflow-x-hidden">
      {/* MOBILE HEADER */}
      <div className="md:hidden sticky top-0 z-40 bg-[#183630] border-b border-[#B8A98F]/30 px-4 py-3 flex items-center justify-between text-[#E5DAC9]">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-1 -ml-1 text-[#E5C690]">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-sm uppercase tracking-tight">Command Center</span>
          </div>
        </div>
        <button onClick={handleLogout} className="p-1 text-[#E5C690] hover:text-[#E5DAC9]">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#183630]/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen z-50 bg-[#183630] text-[#E5DAC9] border-r border-[#B8A98F]/20 flex flex-col transition-transform duration-300 ease-in-out w-[260px] shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 flex items-center justify-between border-b border-[#B8A98F]/20 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#183630] border border-[#B8A98F]/40 flex items-center justify-center p-1 shadow-md shrink-0">
              <img src="/logo-mark-symbol.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display font-black text-xs uppercase tracking-tight block leading-none">THE PRINTHUB</span>
              <span className="text-[9px] font-mono text-[#E5C690] uppercase tracking-wider block mt-1">Atelier Command</span>
            </div>
          </div>
          <button className="md:hidden p-1 text-[#B8A98F] hover:text-[#E5C690]" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-6">
          {MODULES.map((module) => (
            <div key={module.group}>
              <h3 className="px-2 mb-2 text-[10px] font-mono font-bold text-[#B8A98F]/70 tracking-widest uppercase">{module.group}</h3>
              <ul className="space-y-0.5">
                {module.items.map((tab) => {
                  const active = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => selectTab(tab.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                          active
                            ? 'bg-[#E7C47F]/15 text-[#E7C47F] shadow-sm'
                            : 'text-[#E5DAC9]/80 hover:bg-[#E5DAC9]/5 hover:text-[#E7C47F]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${active ? 'text-[#E7C47F]' : 'text-[#B8A98F]'}`} />
                          <span>{tab.label}</span>
                        </div>
                        {tab.badge && (
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black font-mono tracking-wider ${
                            tab.alert ? 'bg-[#C94C4C] text-white animate-pulse' : active ? 'bg-[#E7C47F]/20 text-[#E7C47F]' : 'bg-[#E5DAC9]/10 text-[#B8A98F]'
                          }`}>
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#B8A98F]/20 shrink-0">
          <button onClick={() => navigateTo('home')} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#E5DAC9]/10 text-[#E5C690] text-xs font-bold hover:bg-[#E5DAC9]/20 transition-colors mb-2">
            <ExternalLink className="w-4 h-4" />
            <span>Storefront</span>
          </button>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#E7C47F] text-[#183630] text-xs font-bold hover:bg-[#d9b87c] transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Unpublished Drafts Banner */}
        {hasDrafts && !publishBannerDismissed && (
          <div className="bg-[#E7C47F] px-4 sm:px-8 py-2.5 text-[#18302B] font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm z-30 relative">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C94C4C] animate-ping shrink-0" />
              <span className="font-bold">UNPUBLISHED DRAFTS: Homepage copy modified in draft mode.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={handlePublishAll} className="px-3 py-1 rounded bg-[#18302B] text-[#E7C47F] hover:bg-[#123B34] font-bold text-[10px] uppercase shadow-sm transition-all cursor-pointer">Publish All</button>
              <button onClick={() => setPublishBannerDismissed(true)} className="p-1 text-[#18302B]/60 hover:text-[#18302B] cursor-pointer">✕</button>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && <AdminDashboardTab onNavigate={(tabKey) => setActiveTab(tabKey)} />}
          {activeTab === 'cms' && <AdminHomepageCmsTab onNavigateToImages={() => setActiveTab('images')} />}
          {activeTab === 'announcements' && <AdminAnnouncementTab />}
          {activeTab === 'images' && <AdminImageManagerTab />}
          {activeTab === 'products' && <AdminProductsTab onNavigateToCategories={() => setActiveTab('categories')} />}
          {activeTab === 'categories' && <AdminCategoriesTab />}
          {activeTab === 'stock' && <AdminStockTab />}
          {activeTab === 'orders' && <AdminOrdersTab onNavigateToManualOrder={() => setActiveTab('manual-order')} />}
          {activeTab === 'manual-order' && <AdminManualOrderTab onOrderCreated={() => setActiveTab('orders')} />}
          {activeTab === 'finance' && <AdminFinanceTab />}
          {activeTab === 'expenses' && <AdminExpensesTab />}
          {activeTab === 'reports' && <AdminReportsTab />}
          {activeTab === 'requests' && <AdminDesignRequestsTab />}
          {activeTab === 'studio3d' && <Admin3DStudioConfigTab />}
          {activeTab === 'customers' && <AdminCustomersTab />}
          {activeTab === 'contact' && <AdminContactSettingsTab />}
          {activeTab === 'audit' && <AdminAuditLogTab />}
          {activeTab === 'roles' && <AdminRolesTab />}
        </main>
      </div>
    </div>
  );
}

export default AdminView;
