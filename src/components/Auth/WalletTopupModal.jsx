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
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#183630', '#E5DAC9', '#E5C690', '#B8A98F'],
      });
      setSuccessBanner(`🎉 ₹${finalAmount} added to your PrintHub Wallet!`);
      setTimeout(() => {
        setSuccessBanner('');
        setIsWalletTopupOpen(false);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#183630]/70 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-md bg-[#E5DAC9] border-2 border-[#B8A98F] rounded-3xl shadow-2xl overflow-hidden text-[#183630]">
        {/* Header */}
        <div className="p-4 bg-[#183630] border-b border-[#B8A98F]/40 flex items-center justify-between text-[#E5DAC9]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#E5C690]/20 text-[#E5C690]">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#E5DAC9]">Add Money to Wallet</h3>
              <p className="text-[10px] text-[#E5DAC9]/70">Current Balance: ₹{currentUser.walletBalance || 0}</p>
            </div>
          </div>

          <button
            onClick={() => setIsWalletTopupOpen(false)}
            className="p-2 rounded-xl text-[#E5DAC9]/70 hover:text-[#E5DAC9] hover:bg-[#B8A98F]/20 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleTopup} className="p-6 space-y-5">
          {successBanner && (
            <div className="p-3 rounded-2xl bg-[#183630] border border-[#B8A98F] text-[#E5C690] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#E5C690]" />
              <span>{successBanner}</span>
            </div>
          )}

          {/* Quick Amounts */}
          <div>
            <label className="text-[11px] font-bold text-[#183630] block mb-2">
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
                    className={`py-2.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-[#183630] text-[#E5DAC9] border-[#183630] shadow-md'
                        : 'bg-[#E5DAC9] border-[#B8A98F] text-[#183630] hover:border-[#183630]'
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
            <label className="text-[11px] font-bold text-[#183630] block mb-1">
              Or Custom Amount (₹):
            </label>
            <input
              type="number"
              min="50"
              max="50000"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="e.g. 1500"
              className="w-full px-4 py-2.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-xs text-[#183630] font-mono focus:outline-none focus:border-[#183630]"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-[11px] font-bold text-[#183630] block mb-2">
              Payment Method:
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                { name: 'UPI / GPay', icon: Smartphone },
                { name: 'Credit / Debit Card', icon: CreditCard },
                { name: 'NetBanking', icon: Building },
              ].map((m) => (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => setPaymentMethod(m.name)}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                    paymentMethod === m.name
                      ? 'bg-[#183630] text-[#E5DAC9] border-[#183630]'
                      : 'bg-[#E5DAC9] border-[#B8A98F] text-[#183630] hover:border-[#183630]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <m.icon className="w-4 h-4" />
                    <span className="font-semibold">{m.name}</span>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    paymentMethod === m.name ? 'border-[#E5C690] bg-[#E5C690]' : 'border-[#B8A98F]'
                  }`}>
                    {paymentMethod === m.name && <div className="w-1.5 h-1.5 rounded-full bg-[#183630]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] border border-[#B8A98F] font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span>Confirm & Add ₹{customAmount || amount}</span>
            <ArrowRight className="w-4 h-4 text-[#E5C690]" />
          </button>
        </form>
      </div>
    </div>
  );
}
