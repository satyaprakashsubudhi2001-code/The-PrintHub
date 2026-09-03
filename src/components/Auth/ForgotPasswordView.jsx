import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function ForgotPasswordView() {
  const { forgotPassword, navigateTo, currentTheme } = useStore();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      forgotPassword(email);
      setIsLoading(false);
      setSuccess(true);
    }, 700);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex flex-col justify-center items-center p-6 sm:p-12 bg-studio-950 text-slate-100 select-none relative">
      {/* Glow Backdrop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Back Link */}
        <button
          onClick={() => navigateTo('login')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </button>

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white font-display">Forgot Password? 🔑</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Don't worry. Enter your registered email address and we will dispatch a secure reset link.
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success State */}
        {success ? (
          <div className="space-y-4 py-2 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Reset Link Sent!</span>
              </div>
              <p className="text-xs text-emerald-200">
                We've sent password reset instructions to <strong>{email}</strong>. Please check your inbox and spam folder.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => navigateTo('reset-password')}
                className={`w-full py-3 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} text-white text-xs font-black shadow-md flex items-center justify-center gap-2`}
              >
                <span>Proceed to Set New Password</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateTo('login')}
                className="w-full py-2.5 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white"
              >
                Return to Login
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 block uppercase tracking-wider">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="satya@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} ${currentTheme.glow} text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
