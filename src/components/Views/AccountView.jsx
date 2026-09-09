import React, { useState } from 'react';
import {
  User,
  Palette,
  Package,
  Bookmark,
  Wallet,
  Settings,
  HelpCircle,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Clock,
  Tag,
  CreditCard,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ORDER_STATUSES } from '../../constants/orderWorkflow';

/**
 * Customer Account Atelier View
 * Adopts the exact same design language as The PrintHub Atelier Command Center:
 * - Header with official logo mark symbol
 * - Bold uppercase "THE PRINTHUB ATELIER COMMAND CENTER" header lockup
 * - SECURE badge
 * - Monospaced "Customer Portal: [email]" coordinate subtitle
 * - Strict 4-color palette: #183630, #E5DAC9, #E5C690, #B8A98F
 */
export function AccountView() {
  const {
    currentUser,
    logoutCustomer,
    navigateTo,
    activeAccountTab,
    setActiveAccountTab,
    setIsWalletTopupOpen,
    savedDesigns,
    loadCustomization,
    removeSavedDesign,
    orders,
    setActiveTrackingOrder,
  } = useStore();

  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [passwordToast, setPasswordToast] = useState('');

  if (!currentUser) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center p-6 bg-[#183630] text-[#E5DAC9] select-none">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#183630] border border-[#B8A98F]/40 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#183630] border border-[#B8A98F]/60 text-[#E5C690] flex items-center justify-center mx-auto p-2 shadow-lg">
            <img
              src="/logo-mark-symbol.png"
              alt="The PrintHub"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-[#E5DAC9] font-display uppercase tracking-tight">
              Customer Account Access
            </h2>
            <p className="text-xs text-[#B8A98F] leading-relaxed">
              Please sign in or create an account to view your personalized designs, orders, and wallet balance.
            </p>
          </div>
          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => navigateTo('login')}
              className="flex-1 py-3 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-black shadow-md cursor-pointer transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigateTo('register')}
              className="flex-1 py-3 rounded-xl bg-[#E5DAC9]/10 hover:bg-[#E5DAC9]/20 text-[#E5DAC9] border border-[#B8A98F]/40 text-xs font-bold cursor-pointer transition-all"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordToast('Passwords do not match.');
      return;
    }
    setPasswordToast('Password updated successfully!');
    setPasswordForm({ current: '', new: '', confirm: '' });
    setTimeout(() => setPasswordToast(''), 3500);
  };

  const navItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'designs', label: 'My Designs', icon: Palette },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'saved', label: `Saved Designs (${savedDesigns?.length || 0})`, icon: Bookmark },
    { id: 'wallet', label: `Wallet (₹${currentUser.walletBalance || 0})`, icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen w-full bg-[#183630] text-[#E5DAC9] select-none pb-14">
      {/* =========================================================================
         CUSTOMER ACCOUNT HEADER (Exact Parallel to The PrintHub Atelier Command Center)
         ========================================================================= */}
      <header className="sticky top-0 z-30 bg-[#183630] border-b border-[#B8A98F]/30 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 text-[#E5DAC9]">
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
                THE PRINTHUB ATELIER COMMAND CENTER
              </span>
              <span className="px-2 py-0.5 rounded bg-[#E5C690]/20 text-[#E5C690] border border-[#B8A98F]/40 text-[9px] font-mono font-bold">
                SECURE
              </span>
            </div>
            <span className="text-[10px] text-[#E5DAC9]/70 font-mono block">
              Customer Portal: {currentUser?.email || 'customer@theprinthub.com'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E5DAC9]/10 border border-[#B8A98F]/40 text-xs font-mono text-[#E5C690] hover:text-[#E5DAC9] transition-colors cursor-pointer"
          >
            <span>Customer Storefront</span>
          </button>

          <button
            type="button"
            onClick={() => {
              logoutCustomer();
              navigateTo('home');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E5C690] text-[#183630] hover:bg-[#d9b87c] text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Sub-Header Customer Identity Bar */}
      <div className="w-full bg-[#183630] border-b border-[#B8A98F]/20 px-4 sm:px-8 py-5">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E5C690] text-[#183630] flex items-center justify-center text-xl font-black shadow-lg border border-[#B8A98F]">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-[#E5DAC9] font-display uppercase tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E5C690]/20 text-[#E5C690] border border-[#B8A98F]/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Creator</span>
                </span>
              </div>
              <p className="text-xs text-[#B8A98F] mt-0.5 font-mono">
                {currentUser.email} • {currentUser.mobile}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2.5 px-4 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/30 flex items-center gap-3">
              <Wallet className="w-4 h-4 text-[#E5C690]" />
              <div>
                <span className="text-[9px] text-[#B8A98F] block uppercase font-mono font-bold">
                  Wallet Balance
                </span>
                <span className="text-sm font-black text-[#E5DAC9] font-mono">
                  ₹{currentUser.walletBalance || 0}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsWalletTopupOpen(true)}
              className="p-2.5 px-4 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-black shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Money</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container: Sidebar + Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-6 flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar Menu */}
        <aside className="w-full lg:w-64 shrink-0 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeAccountTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'help') {
                    navigateTo('help');
                  } else {
                    setActiveAccountTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bracket-selected-dark text-[#E5C690] bg-[#E5DAC9]/10 border border-[#B8A98F]/60 font-black'
                    : 'bg-[#E5DAC9]/5 hover:bg-[#E5DAC9]/10 text-[#E5DAC9]/80 hover:text-[#E5C690] border border-[#B8A98F]/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#E5C690]" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 text-[#B8A98F]" />
              </button>
            );
          })}

          <button
            onClick={() => {
              logoutCustomer();
              navigateTo('home');
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-[#E5DAC9]/70 hover:text-[#E5C690] hover:bg-[#E5DAC9]/10 border border-[#B8A98F]/30 transition-all mt-4 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#E5C690]" />
            <span>Logout Session</span>
          </button>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 min-w-0">
          {/* ===================================================================
             TAB 1: MY PROFILE
             =================================================================== */}
          {activeAccountTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 shadow-md space-y-5">
                <div className="flex items-center justify-between border-b border-[#B8A98F]/20 pb-4">
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-[#E5DAC9] font-display uppercase tracking-tight">
                      Personal Details
                    </h2>
                    <p className="text-xs text-[#B8A98F]">Manage your creator identity & contact coordinates</p>
                  </div>
                  <span className="text-xs text-[#E5C690] font-mono font-bold">ID: {currentUser.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/20 space-y-1">
                    <span className="text-[10px] text-[#B8A98F] uppercase font-mono font-bold">Full Name</span>
                    <p className="font-bold text-[#E5DAC9] text-sm">{currentUser.name}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/20 space-y-1">
                    <span className="text-[10px] text-[#B8A98F] uppercase font-mono font-bold">Email Address</span>
                    <p className="font-bold text-[#E5DAC9] text-sm">{currentUser.email}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/20 space-y-1">
                    <span className="text-[10px] text-[#B8A98F] uppercase font-mono font-bold">Mobile Phone</span>
                    <p className="font-bold text-[#E5DAC9] text-sm">{currentUser.mobile}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/20 space-y-1">
                    <span className="text-[10px] text-[#B8A98F] uppercase font-mono font-bold">Registration Date</span>
                    <p className="font-bold text-[#E5DAC9] text-sm">{currentUser.registeredDate || '2026-08-31'}</p>
                  </div>
                </div>
              </div>

              {/* Password & Security Card */}
              <div className="p-6 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 shadow-md space-y-4">
                <div>
                  <h2 className="text-sm sm:text-base font-black text-[#E5DAC9] font-display uppercase tracking-tight">
                    Security & Password
                  </h2>
                  <p className="text-xs text-[#B8A98F]">Update your customer portal password</p>
                </div>

                {passwordToast && (
                  <div className="p-3 rounded-xl bg-[#E5C690]/20 border border-[#B8A98F]/40 text-[#E5C690] text-xs font-bold">
                    {passwordToast}
                  </div>
                )}

                <form onSubmit={handlePasswordUpdate} className="space-y-3 max-w-md">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#183630] border border-[#B8A98F]/40 text-xs text-[#E5DAC9] placeholder:text-[#E5DAC9]/40 focus:outline-none focus:border-[#E5C690]"
                    required
                  />
                  <input
                    type="password"
                    placeholder="New Password (min 8 chars)"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#183630] border border-[#B8A98F]/40 text-xs text-[#E5DAC9] placeholder:text-[#E5DAC9]/40 focus:outline-none focus:border-[#E5C690]"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#183630] border border-[#B8A98F]/40 text-xs text-[#E5DAC9] placeholder:text-[#E5DAC9]/40 focus:outline-none focus:border-[#E5C690]"
                    required
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-bold transition-all cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ===================================================================
             TAB 2: MY DESIGNS
             =================================================================== */}
          {activeAccountTab === 'designs' && (
            <div className="p-6 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 shadow-md space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#B8A98F]/20 pb-3">
                <div>
                  <h2 className="text-sm sm:text-base font-black text-[#E5DAC9] font-display uppercase tracking-tight">
                    My Custom Creations
                  </h2>
                  <p className="text-xs text-[#B8A98F]">Resume customizing or re-order your personalized products</p>
                </div>
                <button
                  onClick={() => navigateTo('design-by-customer')}
                  className="px-4 py-2 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Design</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/25 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">👕</span>
                    <div>
                      <span className="text-xs font-bold text-[#E5DAC9] block">Streetwear Oversized T-Shirt</span>
                      <span className="text-[10px] text-[#B8A98F] font-mono">Variant: Black • DTF Print (2 Areas)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateTo('design-by-customer')}
                    className="px-3 py-1.5 rounded-xl bg-[#E5C690] text-[#183630] hover:bg-[#d9b87c] text-xs font-bold cursor-pointer"
                  >
                    Edit →
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/25 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">☕</span>
                    <div>
                      <span className="text-xs font-bold text-[#E5DAC9] block">Ceramic 11oz Coffee Mug</span>
                      <span className="text-[10px] text-[#B8A98F] font-mono">Variant: White • 360° Wrap Sublimation</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateTo('design-by-customer')}
                    className="px-3 py-1.5 rounded-xl bg-[#E5C690] text-[#183630] hover:bg-[#d9b87c] text-xs font-bold cursor-pointer"
                  >
                    Edit →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
             TAB 3: MY ORDERS
             =================================================================== */}
          {activeAccountTab === 'orders' && (
            <div className="p-6 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 shadow-md space-y-4 animate-in fade-in">
              <div className="border-b border-[#B8A98F]/20 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm sm:text-base font-black text-[#E5DAC9] font-display uppercase tracking-tight">
                    My Customized Orders ({orders?.length || 0})
                  </h2>
                  <p className="text-xs text-[#B8A98F]">Track industrial DTF printing, dispatch, and delivery timeline</p>
                </div>

                <button
                  onClick={() => navigateTo('design-by-customer')}
                  className="px-3 py-1.5 rounded-xl bg-[#E5C690] text-[#183630] hover:bg-[#d9b87c] text-xs font-bold cursor-pointer"
                >
                  + New Order
                </button>
              </div>

              <div className="space-y-3">
                {!orders || orders.length === 0 ? (
                  <div className="p-8 text-center text-[#B8A98F] text-xs bg-[#E5DAC9]/5 rounded-xl border border-[#B8A98F]/20">
                    No orders placed yet. Start designing your custom merchandise now!
                  </div>
                ) : (
                  orders.map((ord) => {
                    const statusObj = ORDER_STATUSES[ord.orderStatus] || { label: ord.orderStatus, badge: 'bg-[#E5C690]/20 text-[#E5C690] border-[#B8A98F]/40' };

                    return (
                      <div
                        key={ord.id}
                        className="p-4 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#E5C690]/50 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#E5DAC9] font-mono">#{ord.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-mono border ${statusObj.badge}`}>
                              {statusObj.label}
                            </span>
                          </div>
                          <p className="text-xs text-[#B8A98F]">
                            {ord.items.map((it) => `${it.quantity}x ${it.productName}`).join(', ')} • Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          {ord.shipment?.awbNumber && (
                            <span className="text-[10px] text-[#E5C690] font-mono block">
                              AWB: {ord.shipment.awbNumber} ({ord.shipment.courierName})
                            </span>
                          )}
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                          <div className="text-left sm:text-right">
                            <span className="text-xs font-bold text-[#E5DAC9] font-display">₹{ord.total?.toLocaleString()} Paid</span>
                            <span className="text-[10px] text-[#E5C690] block font-mono">
                              {ord.paymentMethod?.toUpperCase()} ({ord.paymentStatus})
                            </span>
                          </div>

                          <button
                            onClick={() => setActiveTrackingOrder(ord)}
                            className="px-3 py-1.5 rounded-xl bg-[#E5DAC9]/10 hover:bg-[#E5DAC9]/20 text-[#E5C690] hover:text-[#E5DAC9] text-xs font-bold border border-[#B8A98F]/30 flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <span>Track Order →</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ===================================================================
             TAB 4: SAVED DESIGNS
             =================================================================== */}
          {activeAccountTab === 'saved' && (
            <div className="p-6 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 shadow-md space-y-4 animate-in fade-in">
              <div className="border-b border-[#B8A98F]/20 pb-3">
                <h2 className="text-sm sm:text-base font-black text-[#E5DAC9] font-display uppercase tracking-tight">
                  Saved Custom Designs ({savedDesigns?.length || 0})
                </h2>
                <p className="text-xs text-[#B8A98F]">Personalized merchandise templates saved to your cloud locker</p>
              </div>

              {!savedDesigns || savedDesigns.length === 0 ? (
                <div className="p-10 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/20 text-center space-y-2">
                  <Bookmark className="w-8 h-8 text-[#B8A98F] mx-auto" />
                  <p className="text-xs font-bold text-[#E5DAC9]">No saved designs yet.</p>
                  <p className="text-[10px] text-[#B8A98F]">Click "♡ Save Design" inside the customizer to bookmark your artwork.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedDesigns.map((saved) => (
                    <div
                      key={saved.id}
                      className="p-4 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/25 flex items-center justify-between gap-3 hover:border-[#E5C690]/50 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={saved.productImage}
                          alt={saved.productName}
                          className="w-12 h-12 object-cover rounded-xl border border-[#B8A98F]/30 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#E5DAC9] truncate">{saved.productName}</h4>
                          <span className="text-[10px] text-[#E5C690] font-mono block font-bold">₹{saved.price}</span>
                          <span className="text-[9px] text-[#B8A98F]">{saved.savedAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            loadCustomization(saved.customization);
                            navigateTo('design-by-customer');
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-[#E5C690] text-[#183630] hover:bg-[#d9b87c] text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Open</span>
                        </button>
                        <button
                          onClick={() => removeSavedDesign(saved.id)}
                          className="p-1.5 text-[#B8A98F] hover:text-[#E5C690] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===================================================================
             TAB 5: WALLET & PASSBOOK
             =================================================================== */}
          {activeAccountTab === 'wallet' && (
            <div className="p-6 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 shadow-md space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#B8A98F]/20 pb-4">
                <div>
                  <h2 className="text-sm sm:text-base font-black text-[#E5DAC9] font-display uppercase tracking-tight">
                    PrintHub Wallet & Passbook
                  </h2>
                  <p className="text-xs text-[#B8A98F]">Use wallet balance for instant 1-click checkout with 0% gateway failure</p>
                </div>
                <button
                  onClick={() => setIsWalletTopupOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Top-up Wallet</span>
                </button>
              </div>

              {/* Transactions Ledger */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#E5DAC9] uppercase font-mono tracking-wider block">
                  Transaction Ledger
                </span>
                <div className="space-y-1.5">
                  {(currentUser.walletTransactions || []).map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/20 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs bg-[#183630] text-[#E5C690] border border-[#B8A98F]/40">
                          {tx.type === 'credit' ? '+' : '-'}
                        </div>
                        <div>
                          <span className="font-bold text-[#E5DAC9] block">{tx.title}</span>
                          <span className="text-[10px] text-[#B8A98F] font-mono">{new Date(tx.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black font-mono text-[#E5C690]">
                          {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                        </span>
                        <span className="text-[9px] text-[#B8A98F] block uppercase">{tx.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
             TAB 6: SETTINGS
             =================================================================== */}
          {activeAccountTab === 'settings' && (
            <div className="p-6 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 shadow-md space-y-4 animate-in fade-in">
              <div className="border-b border-[#B8A98F]/20 pb-3">
                <h2 className="text-sm sm:text-base font-black text-[#E5DAC9] font-display uppercase tracking-tight">
                  Account Preferences
                </h2>
                <p className="text-xs text-[#B8A98F]">Configure studio alerts and production notifications</p>
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/25 cursor-pointer">
                  <div>
                    <span className="font-bold text-[#E5DAC9] block">WhatsApp Production Updates</span>
                    <span className="text-[10px] text-[#B8A98F]">Receive dispatch and tracking alerts directly on WhatsApp</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-[#E5C690] cursor-pointer" />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/25 cursor-pointer">
                  <div>
                    <span className="font-bold text-[#E5DAC9] block">Special Creator Discounts</span>
                    <span className="text-[10px] text-[#B8A98F]">Get early access to weekly limited garment drops</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-[#E5C690] cursor-pointer" />
                </label>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AccountView;
