import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Cpu,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function AdminLoginView() {
  const { loginAdmin, navigateTo } = useStore();
  const [identifier, setIdentifier] = useState('admin@theprinthub.com');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!passcode) {
      setErrorMessage('Please enter administrator security credentials.');
      return;
    }

    setIsLoading(true);
    // Authenticate with admin credentials
    const res = loginAdmin({ email: identifier.trim(), password: passcode.trim() });
    setIsLoading(false);

    if (res && res.success) {
      navigateTo('admin');
    } else {
      setErrorMessage(res?.message || 'Access Denied: Invalid administrator password.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-8 bg-[#04060c] text-slate-100 select-none relative overflow-hidden">
      {/* Ambient Spotlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#090d18] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-2xl space-y-6">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-mono font-black shadow-glow-cyan">
              PH
            </div>
            <div>
              <span className="text-xs font-black text-white block font-display tracking-wide">
                The PrintHub
              </span>
              <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ADMIN PORTAL</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>SECURE</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1 text-left">
          <h1 className="text-xl sm:text-2xl font-black text-white font-display">
            Staff Gateway 🛡
          </h1>
          <p className="text-xs text-slate-400">
            Authorized personnel only. Access design requests, original artwork files, and factory calibrations.
          </p>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in font-mono">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-bold">Admin Email / ID</label>
            <input
              type="email"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-bold">Security Password</label>
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                required
                placeholder="Enter admin password (admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 font-display transition-all disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'VERIFYING...' : 'SIGN IN TO COMMAND CENTER'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors"
          >
            ← Return to Customer Storefront
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginView;
