import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Smartphone,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Plus,
  LogOut,
  ChevronRight,
  TrendingUp,
  History,
  CreditCard,
  Building,
  Key,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import confetti from 'canvas-confetti';

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    currentUser,
    loginCustomer,
    logoutCustomer,
    sendOtp,
    verifyOtpAndLogin,
    activeOtpInfo,
    currentTheme,
    navigateTo,
    setIsWalletTopupOpen,
    savedDesigns,
    deleteSavedDesign,
    loadCustomization,
  } = useStore();

  const [activeTab, setActiveTab] = useState('customer');
  const [authMethod, setAuthMethod] = useState('mobile'); // 'mobile' | 'email'
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [errorMessage, setErrorMessage] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  // Sync tab with mode
  useEffect(() => {
    if (currentUser && (authModalMode === 'profile' || authModalMode === 'wallet')) {
      setActiveTab('customer');
    } else {
      setActiveTab('customer');
    }
  }, [authModalMode, currentUser]);

  // Countdown timer for OTP
  useEffect(() => {
    let timer;
    if (authModalMode === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [authModalMode, countdown]);

  if (!isAuthModalOpen) return null;

  // Handle Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const target = authMethod === 'mobile' ? mobileNumber : emailAddress;

    if (!target || target.trim().length < 4) {
      setErrorMessage(
        authMethod === 'mobile'
          ? 'Please enter a valid 10-digit mobile number'
          : 'Please enter a valid email address'
      );
      return;
    }

    const code = sendOtp(target, authMethod, fullName);
    setOtpCode(code); // Pre-fill for user convenience
    setCountdown(60);
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!otpCode || otpCode.length < 6) {
      setErrorMessage('Please enter the 6-digit OTP');
      return;
    }

    const res = verifyOtpAndLogin(otpCode);
    if (res.success) {
      setSuccessBanner(res.message);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        setSuccessBanner('');
      }, 3000);
    } else {
      setErrorMessage(res.message || 'Invalid OTP code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-md bg-[#12002E] border border-[#E5E5E5]/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* =========================================================================
           MODAL HEADER (100% Customer Facing)
           ========================================================================= */}
        <div className="p-4 bg-[#2C0E63] border-b border-[#E5E5E5]/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#12002E] border border-[#E5E5E5]/15 flex items-center justify-center p-1 shadow-sm">
              <img
                src="/logo-mark-white.png"
                alt="The PrintHub"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-xs font-black text-white block font-display">The PrintHub</span>
              <span className="text-[10px] text-slate-400">Customer Account & Studio Access</span>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#12002E] transition-all"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =========================================================================
           MODAL SCROLLABLE CONTENT BODY
           ========================================================================= */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Notification Alerts */}
          {successBanner && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successBanner}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* =========================================================================
             CUSTOMER AUTH & PROFILE MODAL BODY
             ========================================================================= */}
          {currentUser ? (
              /* A. Customer Logged In Dashboard & Profile */
              <div className="space-y-5 animate-in fade-in">
                {/* Profile Information Card */}
                <div className="p-4 rounded-2xl bg-[#2C0E63] border border-[#E5E5E5]/15 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg shrink-0"
                      style={{ backgroundColor: currentUser.avatarColor || currentTheme.accent }}
                    >
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white truncate">{currentUser.name}</h3>
                        {currentUser.isVerified && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-black text-emerald-300 uppercase">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 font-mono mt-0.5">{currentUser.mobile}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    </div>
                  </div>

                  {/* Immediate Logout Button */}
                  <button
                    onClick={logoutCustomer}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition-all shrink-0 flex items-center gap-1"
                    title="Log Out Customer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Log Out</span>
                  </button>
                </div>

                {/* Interactive Wallet Balance Card */}
                <div className="relative p-5 rounded-3xl bg-[#12002E] border border-[#F2CB30]/30 shadow-lg overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#F2CB30]/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#F2CB30]">
                      <Wallet className="w-4 h-4" />
                      <span>Customer Wallet Balance</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-[#F2CB30]/20 text-[10px] font-bold text-[#F2CB30] border border-[#F2CB30]/30">
                      Active Balance
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-white font-display">
                      ₹{currentUser.walletBalance?.toLocaleString() || 0}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">INR</span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => setIsWalletTopupOpen(true)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#F2CB30] hover:bg-[#DA0090] text-[#12002E] text-xs font-black shadow-md shadow-[#F2CB30]/20 hover:scale-102 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>+ Add Wallet Money</span>
                    </button>

                    <button
                      onClick={() => {
                        closeAuthModal();
                        navigateTo('offers');
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-[#2C0E63] hover:bg-[#2C0E63] text-slate-200 text-xs font-semibold border border-[#E5E5E5]/15 transition-all"
                    >
                      Coupons
                    </button>
                  </div>
                </div>

                {/* Wallet Passbook Transactions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-[#F2CB30]" />
                      <span>Wallet Passbook & Ledger</span>
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {currentUser.walletTransactions?.length || 0} entries
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {currentUser.walletTransactions && currentUser.walletTransactions.length > 0 ? (
                      currentUser.walletTransactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="p-2.5 rounded-xl bg-[#2C0E63] border border-[#E5E5E5]/15 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                                tx.type === 'credit'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-rose-500/20 text-rose-400'
                              }`}
                            >
                              {tx.type === 'credit' ? '+' : '-'}
                            </span>
                            <div>
                              <span className="font-semibold text-white block text-[11px] truncate max-w-[180px]">
                                {tx.title}
                              </span>
                              <span className="text-[9px] text-slate-500 block">
                                {new Date(tx.date).toLocaleDateString()} • {tx.status || 'Success'}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`font-mono font-bold ${
                              tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-300'
                            }`}
                          >
                            {tx.type === 'credit' ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-slate-500">
                        No transactions recorded yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Saved Custom Designs Section */}
                <div className="space-y-2 pt-2 border-t border-[#E5E5E5]/15">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#F2CB30]" />
                      <span>My Saved Custom Designs</span>
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {savedDesigns?.length || 0} saved
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {savedDesigns && savedDesigns.length > 0 ? (
                      savedDesigns.map((des) => (
                        <div
                          key={des.id}
                          className="p-2.5 rounded-xl bg-[#2C0E63] border border-[#E5E5E5]/15 flex items-center justify-between gap-2.5 text-xs group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={des.previewImage}
                              alt={des.name}
                              className="w-9 h-9 object-cover rounded-lg bg-[#12002E] p-0.5 border border-[#E5E5E5]/15 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-white block text-xs truncate">
                                {des.name}
                              </span>
                              <span className="text-[10px] text-[#F2CB30] block">
                                ₹{des.totalPrice} • {des.size}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                closeAuthModal();
                                loadCustomization(des);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#F2CB30]/20 text-[#F2CB30] hover:bg-[#F2CB30]/30 text-[10px] font-bold transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteSavedDesign(des.id)}
                              className="p-1 text-slate-500 hover:text-rose-400"
                              title="Delete Saved Design"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-3 text-xs text-slate-500">
                        No saved designs yet. Click "Save" in the designer to keep your creations.
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-[#E5E5E5]/15 flex justify-between items-center">
                  <button
                    onClick={() => {
                      closeAuthModal();
                      navigateTo('design-by-customer');
                    }}
                    className="text-xs font-semibold text-[#F2CB30] hover:underline"
                  >
                    Start Customizing Merch →
                  </button>

                  <button
                    onClick={logoutCustomer}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold border border-rose-500/40 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            ) : authModalMode === 'otp' ? (
              /* B. Customer OTP Verification Screen */
              <div className="space-y-5 animate-in fade-in">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-[#F2CB30]/20 text-[#F2CB30] border border-[#F2CB30]/30 flex items-center justify-center mx-auto">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Enter OTP Verification Code</h3>
                  <p className="text-xs text-slate-400">
                    A 6-digit security code was dispatched to{' '}
                    <span className="text-[#F2CB30] font-mono font-bold">
                      {activeOtpInfo?.target || (authMethod === 'mobile' ? `+91 ${mobileNumber}` : emailAddress)}
                    </span>
                  </p>
                </div>

                {/* Quick Auto-fill Banner for Instant Testing */}
                <div className="p-3 rounded-2xl bg-[#2C0E63] border border-[#F2CB30]/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#F2CB30]">
                    <Sparkles className="w-4 h-4 text-[#F2CB30]" />
                    <span>Auto-Generated Test OTP:</span>
                    <span className="font-mono font-black text-[#F2CB30] tracking-wider">
                      {activeOtpInfo?.code || otpCode || '654321'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpCode(activeOtpInfo?.code || '654321')}
                    className="px-2 py-1 rounded-lg bg-[#F2CB30] text-[#12002E] text-[10px] font-black"
                  >
                    Auto Fill
                  </button>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#12002E] border border-[#E5E5E5]/20 text-center text-2xl font-mono tracking-[0.6em] text-white focus:outline-none focus:border-[#F2CB30] shadow-inner font-black"
                      autoFocus
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#F2CB30]" />
                      <span>{countdown > 0 ? `Resend in ${countdown}s` : 'Code expired'}</span>
                    </div>

                    <button
                      type="button"
                      disabled={countdown > 0}
                      onClick={handleSendOtp}
                      className="text-[#F2CB30] hover:underline font-semibold disabled:opacity-40"
                    >
                      Resend OTP
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-[#F2CB30] hover:bg-[#DA0090] text-[#12002E] text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#F2CB30]/20 transition-all hover:scale-102"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Login (+₹500 Bonus)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthModalMode('login')}
                    className="w-full text-center text-xs text-slate-400 hover:text-slate-200"
                  >
                    ← Change Mobile Number / Email
                  </button>
                </form>
              </div>
            ) : (
              /* C. Customer Login & Registration Form */
              <form onSubmit={handleSendOtp} className="space-y-4 animate-in fade-in">
                {/* Welcome Bonus Callout */}
                <div className="p-3.5 rounded-2xl bg-[#2C0E63] border border-[#F2CB30]/30 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#F2CB30]/20 text-[#F2CB30]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">₹500 Instant Welcome Bonus</h4>
                    <p className="text-[10px] text-slate-300">
                      Sign in with your mobile number or email ID to get ₹500 in your PrintHub Wallet immediately!
                    </p>
                  </div>
                </div>

                {/* Method Switcher: Mobile vs Email */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#12002E] border border-[#E5E5E5]/15">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('mobile');
                      setErrorMessage('');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      authMethod === 'mobile'
                        ? 'bg-[#2C0E63] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile (OTP)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('email');
                      setErrorMessage('');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      authMethod === 'email'
                        ? 'bg-[#2C0E63] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email ID</span>
                  </button>
                </div>

                {/* Customer Full Name */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Your Full Name:
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12002E] border border-[#E5E5E5]/20 text-xs text-white focus:outline-none focus:border-[#F2CB30]"
                    />
                  </div>
                </div>

                {/* Mobile or Email Input */}
                {authMethod === 'mobile' ? (
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      10-Digit Mobile Number:
                    </label>
                    <div className="flex gap-2">
                      <span className="px-3 py-2.5 rounded-xl bg-[#12002E] border border-[#E5E5E5]/20 text-xs font-bold text-slate-300 flex items-center">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#12002E] border border-[#E5E5E5]/20 text-xs text-white focus:outline-none focus:border-[#F2CB30] font-mono"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Email Address:
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12002E] border border-[#E5E5E5]/20 text-xs text-white focus:outline-none focus:border-[#F2CB30]"
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#F2CB30] hover:bg-[#DA0090] text-[#12002E] text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#F2CB30]/20 transition-all hover:scale-102 mt-2"
                >
                  <span>Send Verification OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
        </div>
      </div>
    </div>
  );
}
