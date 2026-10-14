import React, { useState, useMemo } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function ResetPasswordView() {
  const { resetPassword, navigateTo, currentTheme } = useStore();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const passwordCriteria = useMemo(() => {
    return {
      hasLength: newPassword.length >= 8,
      hasUpper: /[A-Z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
    };
  }, [newPassword]);

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (passwordCriteria.hasLength) score++;
    if (passwordCriteria.hasUpper) score++;
    if (passwordCriteria.hasNumber) score++;
    if (score === 0) return { label: 'Empty', color: 'bg-slate-700', width: '0%' };
    if (score <= 1) return { label: 'Weak', color: 'bg-rose-500', width: '33%' };
    if (score === 2) return { label: 'Medium', color: 'bg-amber-500', width: '66%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  }, [passwordCriteria]);

  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!passwordCriteria.hasLength || !passwordCriteria.hasNumber) {
      setErrorMessage('Password must be at least 8 characters and include a number.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      resetPassword('customer@example.com', newPassword);
      setIsLoading(false);
      setSuccess(true);
    }, 700);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex flex-col justify-center items-center p-6 sm:p-12 bg-studio-950 text-slate-100 select-none relative">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Back link */}
        <button
          onClick={() => navigateTo('login')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </button>

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white font-display">Create New Password 🔒</h1>
          <p className="text-xs text-slate-400">
            Set a strong password for your PrintHub account.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-4 py-2 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Password Updated Successfully!</span>
              </div>
              <p className="text-xs text-emerald-200">
                Your account password has been updated. You can now login with your new credentials.
              </p>
            </div>

            <button
              onClick={() => navigateTo('login')}
              className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} text-white font-black text-sm shadow-xl flex items-center justify-center gap-2`}
            >
              <span>Login to Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  New Password
                </label>
                {newPassword.length > 0 && (
                  <span className={`text-[10px] font-bold ${passwordStrength.label === 'Strong' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {passwordStrength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
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
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Confirm New Password
                </label>
                {confirmPassword.length > 0 && (
                  <span className={`text-[10px] font-bold flex items-center gap-1 ${isMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isMatch ? <><Check className="w-3 h-3" /> Match</> : 'Mismatch'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
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

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} ${currentTheme.glow} text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Update Password</span>
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
