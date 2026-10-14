import React, { useState, useEffect, useRef } from 'react';
import { Phone, CheckCircle2, RefreshCw, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import confetti from 'canvas-confetti';

export function VerifyPhoneView() {
  const { verifyOtpAndLogin, activeOtpInfo, navigateTo, currentTheme } = useStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRefs = useRef([]);

  const phoneNumber = activeOtpInfo?.target || '+91 98765 43210';

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const chars = value.slice(0, 6).split('');
      const newOtp = [...otp];
      chars.forEach((c, i) => {
        if (i < 6) newOtp[i] = c;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(chars.length, 5)]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const enteredCode = otp.join('');
    if (enteredCode.length < 6) {
      setErrorMessage('Please enter all 6 digits of the OTP code.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      const res = verifyOtpAndLogin(enteredCode);
      setIsVerifying(false);
      if (res.success) {
        confetti({ particleCount: 90, spread: 60 });
        navigateTo('design-by-customer');
      } else {
        setErrorMessage(res.message || 'Invalid OTP. Please try again.');
      }
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex flex-col justify-center items-center p-6 sm:p-12 bg-studio-950 text-slate-100 select-none relative">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl text-center space-y-6">
        {/* Icon */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-glow-emerald">
          <Phone className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white font-display">Verify Your Phone 📱</h1>
          <p className="text-xs text-slate-400">
            We've dispatched a 6-digit verification OTP code to:
          </p>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 font-bold">
            {phoneNumber}
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 6 Digit Input Grid */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 py-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-13 sm:w-12 sm:h-14 rounded-2xl bg-slate-950 border border-slate-700 text-center font-mono text-lg sm:text-xl font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          ))}
        </div>

        {/* Action Button */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} ${currentTheme.glow} text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50`}
          >
            {isVerifying ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify & Login</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Resend OTP */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            {countdown > 0 ? (
              <span>Resend code in 00:{countdown < 10 ? `0${countdown}` : countdown}</span>
            ) : (
              <button
                onClick={() => setCountdown(30)}
                className="text-indigo-400 hover:underline font-bold"
              >
                Resend Code Now
              </button>
            )}

            <button
              onClick={() => navigateTo('login')}
              className="text-slate-400 hover:text-white"
            >
              Change Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
