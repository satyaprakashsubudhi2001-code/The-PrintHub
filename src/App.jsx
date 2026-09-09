import React, { Suspense, lazy } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navigation/Navbar';
import { Footer } from './components/Navigation/Footer';
import { HomeView } from './components/Views/HomeView';
import { ProductsView } from './components/Views/ProductsView';
import { DesignByCustomerView } from './components/Views/DesignByCustomerView';
import { ProductDetailView } from './components/Products/ProductDetailView';
import { ScreenshotModal } from './components/UI/ScreenshotModal';
import { WhatsAppButton } from './components/Navigation/WhatsAppButton';

const BulkOrdersView = lazy(() =>
  import('./components/Views/BulkOrdersView').then((m) => ({ default: m.BulkOrdersView }))
);
const AdminView = lazy(() =>
  import('./components/Views/AdminView').then((m) => ({ default: m.AdminView }))
);
const AdminLoginView = lazy(() =>
  import('./components/Admin/AdminLoginView').then((m) => ({ default: m.AdminLoginView }))
);
const ProtectedAdminRoute = lazy(() =>
  import('./components/Admin/ProtectedAdminRoute').then((m) => ({ default: m.ProtectedAdminRoute }))
);
const AboutUsView = lazy(() =>
  import('./components/Views/AboutUsView').then((m) => ({ default: m.AboutUsView }))
);
const HelpView = lazy(() =>
  import('./components/Views/HelpView').then((m) => ({ default: m.HelpView }))
);
const OffersView = lazy(() =>
  import('./components/Views/OffersView').then((m) => ({ default: m.OffersView }))
);
const HighSellingView = lazy(() =>
  import('./components/Views/HighSellingView').then((m) => ({ default: m.HighSellingView }))
);
const NewArrivalsView = lazy(() =>
  import('./components/Views/NewArrivalsView').then((m) => ({ default: m.NewArrivalsView }))
);
const AccountView = lazy(() =>
  import('./components/Views/AccountView').then((m) => ({ default: m.AccountView }))
);

function ViewLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-12 space-y-3 bg-[#E5DAC9]">
      <div className="w-8 h-8 rounded-full border-3 border-[#B8A98F]/40 border-t-[#E5C690] animate-spin" />
      <span className="text-xs font-bold text-[#183630]/75">Loading Atelier Experience...</span>
    </div>
  );
}

function MainAppShell() {
  const {
    currentPage,
    navigateTo,
    quickViewProduct,
    setQuickViewProduct,
  } = useStore();

  const renderActivePage = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView />;
      case 'shop':
      case 'products':
        return <ProductsView />;
      case 'design-by-customer':
      case 'custom-printing':
        return <DesignByCustomerView />;
      case 'bulk-orders':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <BulkOrdersView />
          </Suspense>
        );
      case 'offers':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <OffersView />
          </Suspense>
        );
      case 'high-selling':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <HighSellingView />
          </Suspense>
        );
      case 'new-arrivals':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <NewArrivalsView />
          </Suspense>
        );
      case 'about':
      case 'about-us':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <AboutUsView />
          </Suspense>
        );
      case 'help':
      case 'contact':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <HelpView />
          </Suspense>
        );
      case 'admin':
      case 'admin/dashboard':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <ProtectedAdminRoute>
              <AdminView />
            </ProtectedAdminRoute>
          </Suspense>
        );
      case 'admin-login':
      case 'admin/login':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <AdminLoginView />
          </Suspense>
        );
      case 'account':
      case 'customer-account':
      case 'profile':
        return (
          <Suspense fallback={<ViewLoadingFallback />}>
            <AccountView />
          </Suspense>
        );
      default:
        return <HomeView />;
    }
  };

  const isCustomizer = currentPage === 'design-by-customer' || currentPage === 'custom-printing';
  const isAdminSurface = [
    'admin',
    'admin/dashboard',
    'admin-login',
    'admin/login',
  ].includes(currentPage);
  const isStandaloneSurface = [
    'admin',
    'admin/dashboard',
    'admin-login',
    'admin/login',
    'account',
    'customer-account',
    'profile',
  ].includes(currentPage);

  return (
    <div
      className={`w-full max-w-full font-sans antialiased flex flex-col ${
        isStandaloneSurface
          ? 'bg-[#183630] text-[#E5DAC9]'
          : 'bg-[#E5DAC9] text-[#183630]'
      } min-h-screen overflow-x-hidden`}
    >
      {/* Universal Top Navigation (Storefront only) */}
      {!isStandaloneSurface && <Navbar />}

      {/* Main Page Content with bottom clearance for mobile navigation */}
      <main className={`flex-1 flex flex-col ${!isCustomizer && !isStandaloneSurface ? 'pb-16 lg:pb-0' : ''}`}>
        {renderActivePage()}
      </main>

      {/* Universal Footer (Hidden in Customizer & Standalone Command Centers) */}
      {!isCustomizer && !isStandaloneSurface && <Footer />}

      {/* Mobile Bottom Quick Navigation (Storefront pages with iOS Safe Area) */}
      {!isCustomizer && !isStandaloneSurface && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] flex items-center justify-around shadow-2xl transition-all bg-[#183630] border-[#B8A98F]/30 text-[#E5DAC9]">
          <button
            onClick={() => navigateTo('home')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              currentPage === 'home' ? 'text-[#E5C690] font-black' : 'text-[#E5DAC9]/70'
            }`}
          >
            <span className="text-base">🏠</span>
            <span>{currentPage === 'home' ? '[ Home ]' : 'Home'}</span>
          </button>

          <button
            onClick={() => navigateTo('products')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              currentPage === 'products' || currentPage === 'shop'
                ? 'text-[#E5C690] font-black'
                : 'text-[#E5DAC9]/70'
            }`}
          >
            <span className="text-base">👕</span>
            <span>{currentPage === 'products' || currentPage === 'shop' ? '[ Shop ]' : 'Shop'}</span>
          </button>

          <button
            onClick={() => navigateTo('design-by-customer')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-black ${
              currentPage === 'design-by-customer' ? 'text-[#E5C690]' : 'text-[#E5DAC9]/85'
            }`}
          >
            <span className="text-base">✨</span>
            <span>Custom</span>
          </button>

          <button
            onClick={() => navigateTo('bulk-orders')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              currentPage === 'bulk-orders' ? 'text-[#E5C690] font-black' : 'text-[#E5DAC9]/70'
            }`}
          >
            <span className="text-base">📦</span>
            <span>Bulk</span>
          </button>

          <button
            onClick={() => navigateTo('help')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              currentPage === 'help' || currentPage === 'contact'
                ? 'text-[#E5C690] font-black'
                : 'text-[#E5DAC9]/70'
            }`}
          >
            <span className="text-base">💬</span>
            <span>Contact</span>
          </button>
        </div>
      )}

      {/* Floating WhatsApp Support Button */}
      {!isAdminSurface && <WhatsAppButton />}

      {/* Ready-to-Buy Product Detail Modal (Direct WhatsApp Order Flow) */}
      {!isAdminSurface && quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-[#183630]/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[92vh] sm:max-h-[94vh] overflow-y-auto my-auto rounded-2xl sm:rounded-3xl shadow-2xl border border-[#B8A98F]/40 bg-[#E5DAC9]">
            <ProductDetailView
              product={quickViewProduct}
              onBack={() => setQuickViewProduct(null)}
              onSelectRelated={(p) => setQuickViewProduct(p)}
            />
          </div>
        </div>
      )}

      {/* Snapshot Preview Modal */}
      {!isAdminSurface && <ScreenshotModal />}
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('The PrintHub UI Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#183630] text-[#E5DAC9] text-center space-y-4 font-mono">
          <div className="w-16 h-16 rounded-3xl bg-[#E5DAC9]/10 text-[#E5C690] flex items-center justify-center text-2xl font-black shadow-md border border-[#B8A98F]/30">
            👕
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-sans">Something went wrong</h2>
          <div className="p-3 rounded-xl bg-black/40 border border-rose-500/30 text-rose-300 text-xs max-w-lg font-mono">
            {this.state.error?.message || 'An unexpected error occurred while loading this view.'}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-2xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-black shadow-md transition-all cursor-pointer"
            >
              [ Reload The PrintHub ]
            </button>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                  sessionStorage.clear();
                } catch (e) {}
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="px-6 py-2.5 rounded-2xl bg-[#183630] border border-[#B8A98F] hover:border-[#E5C690] text-[#E5DAC9] text-xs font-bold transition-all cursor-pointer"
            >
              [ Reset Cache & Reload ]
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
    <ErrorBoundary>
      <StoreProvider>
        <MainAppShell />
      </StoreProvider>
    </ErrorBoundary>
  );
}
