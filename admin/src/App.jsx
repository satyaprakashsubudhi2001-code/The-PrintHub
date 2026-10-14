import React, { Suspense, lazy } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AdminView } from './components/Admin/AdminView';
import { AdminLoginView } from './components/Admin/AdminLoginView';

function AdminLoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#04060c] text-slate-100 font-mono">
      <div className="w-10 h-10 rounded-full border-4 border-slate-800 border-t-cyan-500 animate-spin" />
      <span className="text-xs font-bold text-slate-400 mt-4 tracking-wider uppercase">Connecting to Secure Staff Gateway...</span>
    </div>
  );
}

function AdminAppShell() {
  const { adminUser } = useStore();

  if (!adminUser) {
    return <AdminLoginView />;
  }

  return <AdminView />;
}

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('The PrintHub Admin UI Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#04060c] text-slate-100 text-center space-y-4 font-mono">
          <div className="w-16 h-16 rounded-3xl bg-slate-900 text-rose-400 flex items-center justify-center text-2xl font-black shadow-md border border-rose-500/30">
            ⚠️
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-sans text-white">Admin Console Error</h2>
          <div className="p-4 rounded-xl bg-black/60 border border-rose-500/30 text-rose-300 text-xs max-w-lg font-mono">
            {this.state.error?.message || 'An unexpected error occurred in the command center.'}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black shadow-md transition-all cursor-pointer"
            >
              [ Reload Admin Console ]
            </button>
            <button
              onClick={() => {
                try {
                  sessionStorage.clear();
                  localStorage.removeItem('printhub_admin_session');
                } catch (e) {}
                window.location.href = '/';
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              [ Reset Session & Re-login ]
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AdminErrorBoundary>
      <StoreProvider>
        <AdminAppShell />
      </StoreProvider>
    </AdminErrorBoundary>
  );
}
