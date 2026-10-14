import React, { useState } from 'react';
import { Mail, CheckCircle2, RefreshCw, ArrowRight, ExternalLink } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function VerifyEmailView() {
  const { currentUser, navigateTo, currentTheme } = useStore();
  const [resendStatus, setResendStatus] = useState('');
  const [isResending, setIsResending] = useState(false);

  const email = currentUser?.email || 'user@example.com';

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setResendStatus(`Verification link resent to ${email}!`);
      setTimeout(() => setResendStatus(''), 4000);
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex flex-col justify-center items-center p-6 sm:p-12 bg-studio-950 text-slate-100 select-none relative">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl text-center space-y-6">
        {/* Icon */}
        <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-glow-primary">
          <Mail className="w-8 h-8" />
        </div>

        {/* Title & Email Info */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white font-display">Check Your Email ✉️</h1>
          <p className="text-xs text-slate-300">
            We've sent an account verification link to:
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 font-bold">
            {email}
          </div>
        </div>

        {resendStatus && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-in fade-in">
            {resendStatus}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <a
            href={`https://${email.includes('@') ? email.split('@')[1] : 'mail.google.com'}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${currentTheme.gradient} text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all`}
          >
            <span>Open Email Inbox</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <div className="flex items-center justify-between pt-2 text-xs">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-slate-400 hover:text-white font-bold flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>Resend Email</span>
            </button>

            <button
              onClick={() => navigateTo('login')}
              className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline"
            >
              Back to Login →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
