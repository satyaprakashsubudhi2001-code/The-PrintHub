import React, { useState } from 'react';
import {
  X,
  Wallet,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import confetti from 'canvas-confetti';

export function WalletTopupModal() {
  const {
    isWalletTopupOpen,
    setIsWalletTopupOpen,
    currentUser,
    addWalletMoney,
    currentTheme,
  } = useStore();

  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / GPay');
  const [successBanner, setSuccessBanner] = useState('');

  if (!isWalletTopupOpen || !currentUser) return null;

  const quickAmounts = [200, 500, 1000, 2000, 5000];

  const handleTopup = (e) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseInt(customAmount, 10) : amount;
    const res = addWalletMoney(finalAmount, paymentMethod);

    if (res.success) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      setSuccessBanner(`🎉 ₹${finalAmount} added to your PrintHub Wallet!`);
      setTimeout(() => {
        setSuccessBanner('');
        setIsWalletTopupOpen(false);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-md bg-studio-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-studio-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Add Money to Wallet</h3>
              <p className="text-[10px] text-slate-400">Current Balance: ₹{currentUser.walletBalance || 0}</p>
            </div>
          </div>

          <button
            onClick={() => setIsWalletTopupOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleTopup} className="p-6 space-y-5">
          {successBanner && (
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successBanner}</span>
            </div>
          )}

          {/* Quick Amounts */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-2">
              Select Recharge Amount:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amt) => {
                const isSelected = !customAmount && amount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2.5 rounded-xl text-xs font-black transition-all border ${
                      isSelected
                        ? `bg-gradient-to-r ${currentTheme.gradient} text-white border-transparent shadow-glow-primary`
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    ₹{amt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Or Enter Custom Amount:
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">₹</span>
              <input
                type="number"
                min="50"
                max="50000"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount..."
                className="w-full pl-8 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-2">
              Payment Gateway:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'UPI / GPay', label: 'UPI / GPay', icon: Smartphone },
                { id: 'Card', label: 'Debit / Credit', icon: CreditCard },
                { id: 'Netbanking', label: 'NetBanking', icon: Building },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 border transition-all ${
                      isSelected
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} ${currentTheme.glow} text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-102`}
          >
            <span>Proceed to Top-Up ₹{customAmount || amount}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
