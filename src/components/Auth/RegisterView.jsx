import React, { useState, useMemo } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Check,
  X,
  Gift,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getWhatsAppAuthChatUrl, STORE_CONFIG } from '../../constants/config';
import confetti from 'canvas-confetti';

export function RegisterView() {
  const {
    registerCustomer,
    navigateTo,
    currentTheme,
  } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Real-time Field Validations
  const isNameValid = name.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = phone.replace(/\D/g, '').length >= 10;

  // Password Strength Evaluation
  const passwordCriteria = useMemo(() => {
    return {
      hasLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (passwordCriteria.hasLength) score++;
    if (passwordCriteria.hasUpper) score++;
    if (passwordCriteria.hasNumber) score++;
    if (passwordCriteria.hasSpecial) score++;

    if (score === 0) return { label: 'Empty', color: 'bg-slate-700', width: '0%' };
    if (score <= 2) return { label: 'Weak', color: 'bg-rose-500', width: '33%' };
    if (score === 3) return { label: 'Medium', color: 'bg-amber-500', width: '66%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  }, [passwordCriteria]);

  const isPasswordMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isNameValid) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!isEmailValid) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!passwordCriteria.hasLength || !passwordCriteria.hasNumber) {
      setErrorMessage('Password must be at least 8 characters and include at least one number.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-check.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms & Conditions to register.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = registerCustomer({
        name,
        email,
        mobile: phone,
        password,
      });

      setIsLoading(false);
      if (res.success) {
        setSuccessMessage(`Welcome to The PrintHub, ${name}! ${STORE_CONFIG.welcomeBonusEnabled ? `₹${STORE_CONFIG.welcomeBonusAmount} Welcome Bonus Added!` : ''}`);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });

        setTimeout(() => {
          navigateTo('design-by-customer');
        }, 1200);
      } else {
        setErrorMessage(res.message || 'An account with this email already exists.');
      }
    }, 700);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex flex-col lg:flex-row bg-studio-950 text-slate-100 select-none overflow-hidden relative">
      {/* =========================================================================
         LEFT 45%: PRODUCT COLLAGE & STUDIO SHOWCASE (DESKTOP)
         ========================================================================= */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[46%] relative bg-gradient-to-br from-indigo-950/60 via-studio-950 to-studio-950 p-10 xl:p-14 flex-col justify-between border-r border-slate-800/80 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${currentTheme.gradient} ${currentTheme.glow} flex items-center justify-center text-white text-sm font-black shadow-lg`}>
            PH
          </div>
          <div>
            <span className="text-base font-black text-white tracking-tight font-display block">
              The PrintHub <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase font-sans">STUDIO</span>
            </span>
            <span className="text-[11px] text-slate-400">Creator & Enterprise Printing Suite</span>
          </div>
        </div>

        {/* Showcase Collage */}
        <div className="my-auto space-y-6 max-w-lg">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 inline-flex items-center gap-1.5 shadow-sm">
              <Gift className="w-3.5 h-3.5" />
              <span>₹500 Welcome Bonus Credit</span>
            </span>
            <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight font-display">
              Create. Customize.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-300 to-white">
                Wear your creativity.
              </span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Join thousands of creators, sports teams, and modern brands building high-fidelity custom apparel.
            </p>
          </div>

          {/* Product Silhouette Matrix */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <span className="text-2xl">👕</span>
              <div>
                <span className="text-xs font-bold text-white block">T-Shirts & Polos</span>
                <span className="text-[10px] text-slate-400">Bio-Washed 220 GSM Cotton</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <span className="text-2xl">🧥</span>
              <div>
                <span className="text-xs font-bold text-white block">Hoodies & Jackets</span>
                <span className="text-[10px] text-slate-400">Heavyweight 380 GSM Fleece</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <span className="text-2xl">☕</span>
              <div>
                <span className="text-xs font-bold text-white block">Ceramic Drinkware</span>
                <span className="text-[10px] text-slate-400">11oz High-Gloss Sublimation</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <span className="text-2xl">🧢</span>
              <div>
                <span className="text-xs font-bold text-white block">Caps & Badges</span>
                <span className="text-[10px] text-slate-400">3D Structured Snapbacks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-slate-800/80">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Commercial License & Privacy Assured</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">ISO 9001:2026</span>
        </div>
      </div>

      {/* =========================================================================
         RIGHT 55%: REGISTRATION FORM
         ========================================================================= */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-lg space-y-5">
          {/* Mobile Top Branding */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-1">
            <div className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${currentTheme.gradient} flex items-center justify-center text-white text-xs font-black`}>
              PH
            </div>
            <span className="text-base font-black text-white font-display">The PrintHub</span>
          </div>

          {/* Header */}
          <div className="space-y-1 text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-2">
              <span>Create Your Account</span>
              <span className="text-2xl">✨</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Join The PrintHub and start designing custom products in real-time 3D.
            </p>
          </div>

          {/* Welcome Bonus Notice Pill */}
          {STORE_CONFIG.welcomeBonusEnabled && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-indigo-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
              <Gift className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Welcome Offer:</strong> ₹{STORE_CONFIG.welcomeBonusAmount} instant wallet credits added automatically upon account setup!
              </span>
            </div>
          )}

          {/* Errors / Feedback */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Full Name
                </label>
                {name.length > 0 && (
                  <span className={`text-[10px] font-bold flex items-center gap-1 ${isNameValid ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {isNameValid ? <><Check className="w-3 h-3" /> Looks good</> : 'Too short'}
                  </span>
                )}
              </div>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Satya Nadella"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Email Address */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Email Address
                  </label>
                  {email.length > 0 && (
                    <span className={`text-[10px] font-bold flex items-center gap-1 ${isEmailValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isEmailValid ? <><Check className="w-3 h-3" /> Valid</> : 'Invalid'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="satya@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Phone Number
                  </label>
                  {phone.length > 0 && (
                    <span className={`text-[10px] font-bold flex items-center gap-1 ${isPhoneValid ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {isPhoneValid ? <><Check className="w-3 h-3" /> Valid</> : '10 digits'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                {password.length > 0 && (
                  <span className={`text-[10px] font-bold ${passwordStrength.label === 'Strong' ? 'text-emerald-400' : passwordStrength.label === 'Medium' ? 'text-amber-400' : 'text-rose-400'}`}>
                    Strength: {passwordStrength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Progress Bar */}
              {password.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 pt-0.5">
                    <span className={passwordCriteria.hasLength ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      ✓ 8+ chars
                    </span>
                    <span className={passwordCriteria.hasUpper ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      ✓ 1 uppercase
                    </span>
                    <span className={passwordCriteria.hasNumber ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      ✓ 1 number
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Confirm Password
                </label>
                {confirmPassword.length > 0 && (
                  <span className={`text-[10px] font-bold flex items-center gap-1 ${isPasswordMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPasswordMatch ? <><Check className="w-3 h-3" /> Passwords match</> : 'Do not match'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                  required
                />
                <span>
                  I agree to the{' '}
                  <span className="text-indigo-400 hover:underline">Terms of Service</span> and{' '}
                  <span className="text-indigo-400 hover:underline">Privacy Policy</span>.
                </span>
              </label>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} ${currentTheme.glow} text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Redirect to Login */}
          <div className="pt-2 text-center text-xs sm:text-sm text-slate-400">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={() => navigateTo('login')}
              className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline"
            >
              Login Instead →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
