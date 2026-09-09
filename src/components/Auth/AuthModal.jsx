import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Mail,
  ArrowRight,
  Sparkles,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Plus,
  LogOut,
  History,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    currentUser,
    logoutCustomer,
    sendOtp,
    verifyOtpAndLogin,
    activeOtpInfo,
    navigateTo,
    setIsWalletTopupOpen,
    savedDesigns,
    deleteSavedDesign,
    loadCustomization,
  } = useStore();

  const [authMethod, setAuthMethod] = useState('mobile'); // 'mobile' | 'email'
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [errorMessage, setErrorMessage] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

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

    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit code');
      return;
    }

    const res = verifyOtpAndLogin(otpCode);
    if (res.success) {
      setSuccessBanner('✓ Login Successful! Welcome to The PrintHub.');
      setTimeout(() => {
        setSuccessBanner('');
        closeAuthModal();
      }, 1200);
    } else {
      setErrorMessage(res.message || 'Invalid OTP code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#183630]/70 backdrop-blur-md select-none animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#E5DAC9] border-2 border-[#B8A98F] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#183630]">
        {/* Header matching The PrintHub Atelier Command Center design */}
        <div className="p-4 sm:p-5 bg-[#183630] border-b border-[#B8A98F]/40 flex items-center justify-between text-[#E5DAC9]">
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

          <button
            onClick={closeAuthModal}
            className="p-2 rounded-xl text-[#E5DAC9]/70 hover:text-[#E5C690] hover:bg-[#B8A98F]/20 transition-all cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Notification Alerts */}
          {successBanner && (
            <div className="p-3.5 rounded-2xl bg-[#183630] border border-[#B8A98F] text-[#E5C690] text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#E5C690] shrink-0" />
              <span>{successBanner}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-[#183630] border border-[#B8A98F] text-[#E5DAC9] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-[#E5C690] shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {currentUser ? (
            /* A. Customer Logged In Dashboard & Profile */
            <div className="space-y-5 animate-in fade-in">
              {/* Profile Information Card */}
              <div className="p-4 rounded-2xl bg-[#183630] border border-[#B8A98F] flex items-center justify-between gap-3 text-[#E5DAC9]">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#183630] bg-[#E5C690] text-lg font-black shadow-lg shrink-0">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#E5DAC9] truncate">{currentUser.name}</h3>
                      {currentUser.isVerified && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#E5C690]/20 border border-[#E5C690]/40 text-[9px] font-black text-[#E5C690] uppercase">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#E5DAC9]/70 font-mono mt-0.5">{currentUser.mobile}</p>
                    <p className="text-[11px] text-[#E5DAC9]/60 truncate">{currentUser.email}</p>
                  </div>
                </div>

                <button
                  onClick={logoutCustomer}
                  className="p-2 rounded-xl bg-[#183630] hover:bg-[#B8A98F]/20 border border-[#B8A98F] text-[#E5DAC9] text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                  title="Log Out Customer"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#E5C690]" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </div>

              {/* Interactive Wallet Balance Card */}
              <div className="p-5 rounded-3xl bg-[#183630] border border-[#B8A98F] shadow-md text-[#E5DAC9]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#E5C690]">
                    <Wallet className="w-4 h-4" />
                    <span>Customer Wallet Balance</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-[#E5C690]/20 text-[10px] font-bold text-[#E5C690] border border-[#E5C690]/30">
                    Active Balance
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#E5DAC9] font-display">
                    ₹{currentUser.walletBalance?.toLocaleString() || 0}
                  </span>
                  <span className="text-xs text-[#E5DAC9]/60 font-mono">INR</span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => setIsWalletTopupOpen(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-black shadow-md cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>+ Add Wallet Money</span>
                  </button>

                  <button
                    onClick={() => {
                      closeAuthModal();
                      navigateTo('offers');
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-[#183630] hover:bg-[#183630]/80 text-[#E5DAC9] text-xs font-semibold border border-[#B8A98F] transition-all cursor-pointer"
                  >
                    Coupons
                  </button>
                </div>
              </div>

              {/* Wallet Passbook Transactions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#183630] flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-[#183630]" />
                    <span>Wallet Passbook & Ledger</span>
                  </h4>
                  <span className="text-[10px] text-[#183630]/60 font-mono">
                    {currentUser.walletTransactions?.length || 0} entries
                  </span>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {currentUser.walletTransactions && currentUser.walletTransactions.length > 0 ? (
                    currentUser.walletTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-2.5 rounded-xl bg-[#183630]/5 border border-[#B8A98F] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs bg-[#183630] text-[#E5DAC9]"
                          >
                            {tx.type === 'credit' ? '+' : '-'}
                          </span>
                          <div>
                            <span className="font-semibold text-[#183630] block text-[11px] truncate max-w-[180px]">
                              {tx.title}
                            </span>
                            <span className="text-[9px] text-[#183630]/60 block">
                              {new Date(tx.date).toLocaleDateString()} • {tx.status || 'Success'}
                            </span>
                          </div>
                        </div>

                        <span className="font-mono font-bold text-[#183630]">
                          {tx.type === 'credit' ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-[#183630]/60">
                      No transactions recorded yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Saved Custom Designs Section */}
              <div className="space-y-2 pt-2 border-t border-[#B8A98F]/40">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#183630] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#183630]" />
                    <span>My Saved Custom Designs</span>
                  </h4>
                  <span className="text-[10px] text-[#183630]/60 font-mono">
                    {savedDesigns?.length || 0} saved
                  </span>
                </div>

                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {savedDesigns && savedDesigns.length > 0 ? (
                    savedDesigns.map((des) => (
                      <div
                        key={des.id}
                        className="p-2.5 rounded-xl bg-[#183630]/5 border border-[#B8A98F] flex items-center justify-between gap-2.5 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={des.previewImage}
                            alt={des.name}
                            className="w-9 h-9 object-cover rounded-lg bg-[#183630]/10 p-0.5 border border-[#B8A98F] shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-[#183630] block text-xs truncate">
                              {des.name}
                            </span>
                            <span className="text-[10px] text-[#183630]/70 block">
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
                            className="px-2.5 py-1 rounded-lg bg-[#183630] text-[#E5DAC9] text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteSavedDesign(des.id)}
                            className="p-1 text-[#183630]/50 hover:text-[#183630] cursor-pointer"
                            title="Delete Saved Design"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-3 text-xs text-[#183630]/60">
                      No saved designs yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-[#B8A98F]/40 flex justify-between items-center">
                <button
                  onClick={() => {
                    closeAuthModal();
                    navigateTo('design-by-customer');
                  }}
                  className="text-xs font-semibold text-[#183630] hover:underline cursor-pointer"
                >
                  Start Customizing Merch →
                </button>

                <button
                  onClick={logoutCustomer}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#183630] text-[#E5DAC9] text-xs font-bold border border-[#B8A98F] transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#E5C690]" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : authModalMode === 'otp' ? (
            /* B. Customer OTP Verification Screen */
            <div className="space-y-5 animate-in fade-in">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-[#183630] text-[#E5C690] border border-[#B8A98F] flex items-center justify-center mx-auto">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#183630]">Enter OTP Verification Code</h3>
                <p className="text-xs text-[#183630]/70">
                  A 6-digit security code was dispatched to{' '}
                  <span className="text-[#183630] font-mono font-bold">
                    {activeOtpInfo?.target || (authMethod === 'mobile' ? `+91 ${mobileNumber}` : emailAddress)}
                  </span>
                </p>
              </div>

              {/* Quick Auto-fill Banner for Instant Testing */}
              <div className="p-3 rounded-2xl bg-[#183630] border border-[#B8A98F] flex items-center justify-between text-[#E5DAC9]">
                <div className="flex items-center gap-2 text-xs text-[#E5DAC9]">
                  <Sparkles className="w-4 h-4 text-[#E5C690]" />
                  <span>Auto-Generated Test OTP:</span>
                  <span className="font-mono font-black text-[#E5C690] tracking-wider">
                    {activeOtpInfo?.code || otpCode || '654321'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpCode(activeOtpInfo?.code || '654321')}
                  className="px-2 py-1 rounded-lg bg-[#E5C690] text-[#183630] text-[10px] font-black cursor-pointer"
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
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#E5DAC9] border-2 border-[#B8A98F] text-center text-2xl font-mono tracking-[0.6em] text-[#183630] focus:outline-none focus:border-[#183630] shadow-inner font-black"
                    autoFocus
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#183630]/70">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#183630]" />
                    <span>{countdown > 0 ? `Resend in ${countdown}s` : 'Code expired'}</span>
                  </div>

                  <button
                    type="button"
                    disabled={countdown > 0}
                    onClick={handleSendOtp}
                    className="text-[#183630] hover:underline font-semibold disabled:opacity-40 cursor-pointer"
                  >
                    Resend OTP
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#E5C690]" />
                  <span>Verify & Login (+₹500 Bonus)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="w-full text-center text-xs text-[#183630]/70 hover:text-[#183630] cursor-pointer"
                >
                  ← Change Mobile Number / Email
                </button>
              </form>
            </div>
          ) : (
            /* C. Customer Login & Registration Form */
            <form onSubmit={handleSendOtp} className="space-y-4 animate-in fade-in">
              {/* Welcome Bonus Callout */}
              <div className="p-3.5 rounded-2xl bg-[#183630] border border-[#B8A98F] flex items-center gap-3 text-[#E5DAC9]">
                <div className="p-2 rounded-xl bg-[#E5C690]/20 text-[#E5C690]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#E5DAC9]">₹500 Instant Welcome Bonus</h4>
                  <p className="text-[10px] text-[#E5DAC9]/70">
                    Sign in with your mobile number or email ID to get ₹500 in your PrintHub Wallet immediately!
                  </p>
                </div>
              </div>

              {/* Method Switcher: Mobile vs Email */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#183630]/10 border border-[#B8A98F]">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('mobile');
                    setErrorMessage('');
                  }}
                  className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    authMethod === 'mobile'
                      ? 'bg-[#183630] text-[#E5DAC9] shadow-sm'
                      : 'text-[#183630]/70 hover:text-[#183630]'
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
                  className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    authMethod === 'email'
                      ? 'bg-[#183630] text-[#E5DAC9] shadow-sm'
                      : 'text-[#183630]/70 hover:text-[#183630]'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email ID</span>
                </button>
              </div>

              {/* Customer Full Name */}
              <div>
                <label className="text-[11px] font-bold text-[#183630] block mb-1">
                  Your Full Name:
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-[#183630]/50" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-xs text-[#183630] focus:outline-none focus:border-[#183630]"
                  />
                </div>
              </div>

              {/* Mobile or Email Input */}
              {authMethod === 'mobile' ? (
                <div>
                  <label className="text-[11px] font-bold text-[#183630] block mb-1">
                    10-Digit Mobile Number:
                  </label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2.5 rounded-xl bg-[#183630]/10 border border-[#B8A98F] text-xs font-bold text-[#183630] flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-xs text-[#183630] focus:outline-none focus:border-[#183630] font-mono"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-[11px] font-bold text-[#183630] block mb-1">
                    Email Address:
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#183630]/50" />
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-xs text-[#183630] focus:outline-none focus:border-[#183630]"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer mt-2"
              >
                <span>Send Verification OTP</span>
                <ArrowRight className="w-4 h-4 text-[#E5C690]" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
