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
import { WhatsAppFloatingButton } from '../Studio/WhatsAppFloatingButton';
import { ORDER_STATUSES } from '../../constants/orderWorkflow';

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
    addToCart,
    currentTheme,
    orders,
    setActiveTrackingOrder,
  } = useStore();

  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [passwordToast, setPasswordToast] = useState('');

  if (!currentUser) {
    return (
      <div className="min-h-[calc(100vh-64px)] w-full flex flex-col justify-center items-center p-6 bg-studio-950 text-slate-100 select-none">
        <div className="w-full max-w-md p-8 rounded-3xl bg-studio-900 border border-slate-800 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white font-display">Account Access Required</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Please login or create an account to view your personalized designs, orders, and wallet balance.
          </p>
          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => navigateTo('login')}
              className={`flex-1 py-3 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} text-white text-xs font-black shadow-md`}
            >
              Login Now
            </button>
            <button
              onClick={() => navigateTo('register')}
              className="flex-1 py-3 rounded-2xl bg-slate-800 text-slate-200 text-xs font-bold hover:text-white"
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
    { id: 'saved', label: `Saved Designs (${savedDesigns.length})`, icon: Bookmark },
    { id: 'wallet', label: `Wallet (₹${currentUser.walletBalance || 0})`, icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-studio-950 text-slate-100 select-none pb-14">
      {/* Header Banner */}
      <div className="w-full bg-gradient-to-r from-indigo-950/80 via-studio-900 to-studio-950 border-b border-slate-800/80 px-4 sm:px-8 py-8">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-xl ring-2 ring-indigo-500/40"
              style={{ backgroundColor: currentUser.avatarColor || '#6366f1' }}
            >
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white font-display">{currentUser.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Creator</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.email} • {currentUser.mobile}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2.5 px-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center gap-3">
              <Wallet className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Wallet Balance</span>
                <span className="text-sm font-black text-white font-mono">₹{currentUser.walletBalance || 0}</span>
              </div>
            </div>
            <button
              onClick={() => setIsWalletTopupOpen(true)}
              className={`p-3 px-4 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} text-white text-xs font-black shadow-md flex items-center gap-1.5 hover:scale-105 transition-all`}
            >
              <Plus className="w-4 h-4" />
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
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${currentTheme.gradient} text-white shadow-md font-black`
                    : 'bg-studio-900/80 hover:bg-studio-850 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            );
          })}

          <button
            onClick={() => {
              logoutCustomer();
              navigateTo('home');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all mt-4"
          >
            <LogOut className="w-4 h-4" />
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
              <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-base font-black text-white font-display">Personal Details</h2>
                    <p className="text-xs text-slate-400">Manage your creator identity & contact coordinates</p>
                  </div>
                  <span className="text-xs text-indigo-400 font-mono font-bold">ID: {currentUser.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Full Name</span>
                    <p className="font-bold text-white text-sm">{currentUser.name}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Email Address</span>
                    <p className="font-bold text-white text-sm">{currentUser.email}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Mobile Phone</span>
                    <p className="font-bold text-white text-sm">{currentUser.mobile}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Registration Date</span>
                    <p className="font-bold text-white text-sm">{currentUser.registeredDate || '2026-08-31'}</p>
                  </div>
                </div>
              </div>

              {/* Password & Security Card */}
              <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4">
                <div>
                  <h2 className="text-base font-black text-white font-display">Security & Password</h2>
                  <p className="text-xs text-slate-400">Update your account password</p>
                </div>

                {passwordToast && (
                  <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                    {passwordToast}
                  </div>
                )}

                <form onSubmit={handlePasswordUpdate} className="space-y-3 max-w-md">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <input
                    type="password"
                    placeholder="New Password (min 8 chars)"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <button
                    type="submit"
                    className={`px-5 py-2.5 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} text-white text-xs font-bold shadow-md hover:scale-105 transition-all`}
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
            <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-black text-white font-display">My Custom Creations</h2>
                  <p className="text-xs text-slate-400">Resume customizing or re-order your personalized products</p>
                </div>
                <button
                  onClick={() => navigateTo('design-by-customer')}
                  className={`px-4 py-2 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} text-white text-xs font-bold shadow-md flex items-center gap-1.5`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Design</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">👕</span>
                    <div>
                      <span className="text-xs font-bold text-white block">Streetwear Oversized T-Shirt</span>
                      <span className="text-[10px] text-slate-400 font-mono">Variant: Black • DTF Print (2 Areas)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateTo('design-by-customer')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-xs font-bold"
                  >
                    Edit →
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">☕</span>
                    <div>
                      <span className="text-xs font-bold text-white block">Ceramic 11oz Coffee Mug</span>
                      <span className="text-[10px] text-slate-400 font-mono">Variant: White • 360° Wrap Sublimation</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateTo('design-by-customer')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-xs font-bold"
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
            <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4 animate-in fade-in">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-white font-display">My Customized Orders ({orders.length})</h2>
                  <p className="text-xs text-slate-400">Track industrial DTF printing, dispatch, and delivery timeline</p>
                </div>

                <button
                  onClick={() => navigateTo('design-by-customer')}
                  className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${currentTheme.gradient} text-white text-xs font-bold shadow-sm`}
                >
                  + New Order
                </button>
              </div>

              <div className="space-y-3">
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs bg-slate-950 rounded-2xl">
                    No orders placed yet. Start designing your custom merchandise now!
                  </div>
                ) : (
                  orders.map((ord) => {
                    const statusObj = ORDER_STATUSES[ord.orderStatus] || { label: ord.orderStatus, badge: 'bg-indigo-500/20 text-indigo-300' };

                    return (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white font-mono">#{ord.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-mono border ${statusObj.badge}`}>
                              {statusObj.label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            {ord.items.map((it) => `${it.quantity}x ${it.productName}`).join(', ')} • Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          {ord.shipment?.awbNumber && (
                            <span className="text-[10px] text-cyan-400 font-mono block">
                              AWB: {ord.shipment.awbNumber} ({ord.shipment.courierName})
                            </span>
                          )}
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                          <div className="text-left sm:text-right">
                            <span className="text-xs font-bold text-white font-display">₹{ord.total.toLocaleString()} Paid</span>
                            <span className="text-[10px] text-emerald-400 block font-mono">
                              {ord.paymentMethod?.toUpperCase()} ({ord.paymentStatus})
                            </span>
                          </div>

                          <button
                            onClick={() => setActiveTrackingOrder(ord)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1 transition-all"
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
            <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4 animate-in fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base font-black text-white font-display">Saved Custom Designs ({savedDesigns.length})</h2>
                <p className="text-xs text-slate-400">Personalized merchandise templates saved to your cloud locker</p>
              </div>

              {savedDesigns.length === 0 ? (
                <div className="p-10 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                  <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-400">No saved designs yet.</p>
                  <p className="text-[10px] text-slate-500">Click "♡ Save Design" inside the customizer to bookmark your artwork.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedDesigns.map((saved) => (
                    <div
                      key={saved.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={saved.productImage}
                          alt={saved.productName}
                          className="w-12 h-12 object-cover rounded-xl border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{saved.productName}</h4>
                          <span className="text-[10px] text-indigo-400 font-mono block font-bold">₹{saved.price}</span>
                          <span className="text-[9px] text-slate-500">{saved.savedAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            loadCustomization(saved.customization);
                            navigateTo('design-by-customer');
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-xs font-bold flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Open</span>
                        </button>
                        <button
                          onClick={() => removeSavedDesign(saved.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400"
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
            <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-black text-white font-display">PrintHub Wallet & Passbook</h2>
                  <p className="text-xs text-slate-400">Use wallet balance for instant 1-click checkout with 0% gateway failure</p>
                </div>
                <button
                  onClick={() => setIsWalletTopupOpen(true)}
                  className={`px-4 py-2 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} text-white text-xs font-black shadow-md flex items-center gap-1.5`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Top-up Wallet</span>
                </button>
              </div>

              {/* Transactions Ledger */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Transaction Ledger</span>
                <div className="space-y-1.5">
                  {(currentUser.walletTransactions || []).map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                            tx.type === 'credit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {tx.type === 'credit' ? '+' : '-'}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{tx.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{new Date(tx.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-black font-mono ${
                            tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                        </span>
                        <span className="text-[9px] text-slate-500 block uppercase">{tx.status}</span>
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
            <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4 animate-in fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base font-black text-white font-display">Account Preferences</h2>
                <p className="text-xs text-slate-400">Configure studio alerts and production notifications</p>
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <div>
                    <span className="font-bold text-white block">WhatsApp Production Updates</span>
                    <span className="text-[10px] text-slate-400">Receive dispatch and tracking alerts directly on WhatsApp</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600 bg-slate-900" />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <div>
                    <span className="font-bold text-white block">Special Creator Discounts</span>
                    <span className="text-[10px] text-slate-400">Get early access to weekly limited garment drops</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600 bg-slate-900" />
                </label>
              </div>
            </div>
          )}
        </main>
      </div>

      <WhatsAppFloatingButton />
    </div>
  );
}
