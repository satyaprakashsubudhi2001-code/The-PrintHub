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

function ViewLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-12 space-y-3">
      <div className="w-8 h-8 rounded-full border-3 border-[#E5E5E5] border-t-[#F2CB30] animate-spin" />
      <span className="text-xs font-bold text-slate-400">Loading Studio Experience...</span>
    </div>
  );
}

function MainAppShell() {
  const {
    currentPage,
    navigateTo,
    themeMode,
    quickViewProduct,
    setQuickViewProduct,
  } = useStore();

  const isLight = themeMode === 'light';

  const renderActivePage = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView />;
      case 'products':
        return <ProductsView />;
      case 'design-by-customer':
        return <DesignByCustomerView />;
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
      default:
        return <HomeView />;
    }
  };

  const isCustomizer = currentPage === 'design-by-customer';
  const isAdminSurface = ['admin', 'admin/dashboard', 'admin-login', 'admin/login'].includes(currentPage);

  return (
    <div className={`w-full max-w-full font-sans antialiased flex flex-col ${
      isAdminSurface
        ? 'bg-[#12002E] text-[#FFFFFF]'
        : 'bg-[#FFFFFF] text-[#12002E]'
    } min-h-screen overflow-x-hidden`}>
      {/* Universal Top Navigation (Storefront only) */}
      {!isAdminSurface && <Navbar />}

      {/* Main Page Content */}
      <main className="flex-1 flex flex-col">
        {renderActivePage()}
      </main>

      {/* Universal Footer (Hidden in Customizer & Admin) */}
      {!isCustomizer && !isAdminSurface && <Footer />}

      {/* Mobile Bottom Quick Navigation (Storefront pages) */}
      {!isCustomizer && !isAdminSurface && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t px-3 py-2 flex items-center justify-around shadow-2xl transition-all bg-[#2C0E63] border-[#12002E]/40 text-[#FFFFFF]">
          <button
            onClick={() => navigateTo('home')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              currentPage === 'home' ? 'text-[#F2CB30]' : 'text-white/70'
            }`}
          >
            <span className="text-base">🏠</span>
            <span>Home</span>
          </button>

          <button
            onClick={() => navigateTo('products')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              currentPage === 'products' ? 'text-[#F2CB30]' : 'text-white/70'
            }`}
          >
            <span className="text-base">👕</span>
            <span>Products</span>
          </button>

          <button
            onClick={() => navigateTo('design-by-customer')}
            className="flex flex-col items-center gap-0.5 text-[10px] font-black text-[#F2CB30]"
          >
            <span className="text-base">✨</span>
            <span>Studio</span>
          </button>

          <button
            onClick={() => navigateTo('offers')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              currentPage === 'offers' ? 'text-[#F2CB30]' : 'text-white/70'
            }`}
          >
            <span className="text-base">🏷️</span>
            <span>Offers</span>
          </button>

          <button
            onClick={() => navigateTo('help')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              currentPage === 'help' || currentPage === 'contact' ? 'text-[#F2CB30]' : 'text-white/70'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[94vh] overflow-y-auto my-auto rounded-3xl shadow-2xl">
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
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#12002E] text-white text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#DA0090]/20 text-[#DA0090] flex items-center justify-center text-2xl font-black shadow-md border border-[#DA0090]/30">
            👕
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Something went wrong</h2>
          <p className="text-xs text-slate-300 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred while loading this view.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="px-6 py-2.5 rounded-2xl bg-[#F2CB30] hover:bg-[#DA0090] hover:text-white text-[#12002E] text-xs font-black shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Reload The PrintHub
          </button>
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
