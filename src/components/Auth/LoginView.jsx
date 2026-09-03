import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Layers,
  Zap,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getWhatsAppAuthChatUrl, STORE_CONFIG } from '../../constants/config';
import confetti from 'canvas-confetti';

export function LoginView() {
  const {
    loginCustomer,
    navigateTo,
    currentTheme,
    storeSettings,
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = loginCustomer(email, password);
      setIsLoading(false);

      if (res.success) {
        setSuccessMessage(`Welcome back, ${res.user?.name || 'Creator'}!`);
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 },
        });

        setTimeout(() => {
          navigateTo('design-by-customer');
        }, 800);
      } else {
        setErrorMessage(res.message || 'Email or password is incorrect.');
      }
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const res = loginCustomer('google.user@printhub.com', 'google_auth_pass');
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage(`Welcome, Google User!`);
        navigateTo('design-by-customer');
      }
    }, 500);
  };

  const handleOpenWhatsApp = () => {
    window.open(getWhatsAppAuthChatUrl('login / sign-in support'), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex flex-col lg:flex-row bg-studio-950 text-slate-100 select-none overflow-hidden relative">
      {/* =========================================================================
         LEFT 45%: BRAND VISUAL STORYTELLING SECTION (DESKTOP)
         ========================================================================= */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[48%] relative bg-gradient-to-br from-indigo-950/60 via-studio-950 to-studio-950 p-10 xl:p-14 flex-col justify-between border-r border-slate-800/80 overflow-hidden">
        {/* Layered Spotlight & Dot Grid */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Top Branding */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${currentTheme.gradient} ${currentTheme.glow} flex items-center justify-center text-white text-sm font-black shadow-lg`}>
            PH
          </div>
          <div>
            <span className="text-base font-black text-white tracking-tight font-display block">
              The PrintHub <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase font-sans">STUDIO</span>
            </span>
            <span className="text-[11px] text-slate-400">Custom Merchandise & Direct-to-Garment</span>
          </div>
        </div>

        {/* Center Hero Visual Showcase */}
        <div className="my-auto space-y-6 max-w-lg">
          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 inline-flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct-to-Garment 3D Studio</span>
            </span>
            <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight font-display">
              Your ideas.<br />
              Your design.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-300 to-white">
                Your custom products.
              </span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Design T-shirts, hoodies, mugs, and caps with live 3D precision, multi-layer graphics, and commercial DTF queue dispatch.
            </p>
          </div>

          {/* Floating Feature Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>3D Precision Canvas</span>
              </div>
              <p className="text-[11px] text-slate-400">Interactive 360° product simulation with real-time UV texture mapping.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Express DTF Queue</span>
              </div>
              <p className="text-[11px] text-slate-400">Automated print-ready rasterization for industrial garment printers.</p>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-slate-800/80">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>256-Bit SSL Encrypted Session</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">v2.4 Production Ready</span>
        </div>
      </div>

      {/* =========================================================================
         RIGHT 55%: LOGIN FORM CONTAINER
         ========================================================================= */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Top Branding */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-2">
            <div className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${currentTheme.gradient} flex items-center justify-center text-white text-xs font-black`}>
              PH
            </div>
            <span className="text-base font-black text-white font-display">The PrintHub</span>
          </div>

          {/* Form Header */}
          <div className="space-y-1.5 text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-2">
              <span>Welcome Back</span>
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Login to continue customizing your personalized merchandise.
            </p>
          </div>

          {/* Error & Success Feedback Banners */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 block uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-300 block uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigateTo('forgot-password')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            {/* Submit Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} ${currentTheme.glow} text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login to Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-studio-950 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Or Continue With
            </span>
            <div className="border-t border-slate-800 w-full" />
          </div>

          {/* Social Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 hover:border-slate-600 text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.01]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Registration Redirect Link */}
          <div className="pt-2 text-center text-xs sm:text-sm text-slate-400">
            <span>New to The PrintHub? </span>
            <button
              type="button"
              onClick={() => navigateTo('register')}
              className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline"
            >
              Create an Account {STORE_CONFIG.welcomeBonusEnabled ? `(+₹${STORE_CONFIG.welcomeBonusAmount})` : ''} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
