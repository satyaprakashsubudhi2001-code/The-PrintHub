import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  Award,
  Layers,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * The PrintHub — Studio Footer
 * Focused on custom design exploration, production capabilities, studio contact & WhatsApp handoff.
 */
export function Footer() {
  const { storeSettings, navigateTo } = useStore();

  return (
    <footer className="bg-[#05050A] border-t border-white/[0.08] text-slate-400 select-none pt-12 pb-12 w-full">
      {/* Top Value Badges Bar */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-white/[0.08]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6C4DF6]/10 text-[#06B6D4] flex items-center justify-center shrink-0 border border-[#6C4DF6]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Ultra-HD 300 DPI DTF</h4>
              <p className="text-[11px] text-slate-400">Vibrant, stretchable, durable print</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Multi-Location Printing</h4>
              <p className="text-[11px] text-slate-400">Chest, back, sleeves & wrap prints</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Zero Minimum Orders</h4>
              <p className="text-[11px] text-slate-400">Sample single piece to bulk orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Realistic 3D & 2D Studio</h4>
              <p className="text-[11px] text-slate-400">Calibrated physical inches preview</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand & Studio Overview */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white text-base font-black shadow-lg shadow-cyan-500/20">
              {storeSettings.logoText || 'PH'}
            </div>
            <div>
              <h3 className="font-display text-lg font-black text-white">
                {storeSettings.storeName}
              </h3>
              <p className="text-xs text-slate-400">{storeSettings.tagline}</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            India’s dedicated custom merchandise studio. Explore apparel blanks, create your concepts in our interactive studio, and submit your design requests directly to our production team.
          </p>

          {/* CMYK Color Mark */}
          <div className="flex items-center gap-2 pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
            <span className="text-[10px] font-mono text-slate-500 uppercase ml-1">ISO 12647 PRINT CALIBRATED</span>
          </div>
        </div>

        {/* Product Blanks */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Custom Product Blanks
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => navigateTo('products')}
                className="hover:text-white transition-colors"
              >
                👕 Regular Fit Round Neck T-Shirt
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('products')}
                className="hover:text-white transition-colors"
              >
                🔥 Oversized Heavyweight T-Shirt
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('products')}
                className="hover:text-white transition-colors"
              >
                👔 Classic Matty Pique Polo
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('products')}
                className="hover:text-white transition-colors"
              >
                🧥 380 GSM Pullover Fleece Hoodie
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('products')}
                className="hover:text-white transition-colors"
              >
                ☕ Ceramic Mugs & Coffee Drinkware
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('products')}
                className="hover:text-white transition-colors"
              >
                🧢 Snapback Caps & Badges
              </button>
            </li>
          </ul>
        </div>

        {/* Studio Workflow */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            How It Works
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => navigateTo('design-by-customer')}
                className="hover:text-lime-400 transition-colors font-semibold"
              >
                ✨ Open Interactive Design Studio
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('about-us')}
                className="hover:text-white transition-colors"
              >
                🏭 Printing Technologies & Factory
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('help')}
                className="hover:text-white transition-colors"
              >
                💬 WhatsApp & Gmail Support
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('help')}
                className="hover:text-white transition-colors"
              >
                ❓ Frequently Asked Questions
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('admin-login')}
                className="hover:text-cyan-400 transition-colors text-slate-500 flex items-center gap-1 mt-3"
              >
                <Lock className="w-3 h-3" />
                <span>Admin Command Center</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Facility */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Contact Production Facility
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />
              <span>{storeSettings.address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <a href={`tel:${storeSettings.phone}`} className="hover:text-white">
                {storeSettings.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#EC4899] shrink-0" />
              <a href={`mailto:${storeSettings.email}`} className="hover:text-white">
                {storeSettings.email}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{storeSettings.workingHours}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Sub-bar */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          © {new Date().getFullYear()} {storeSettings.storeName} Studio. All rights reserved. Custom Product Design & Manufacturing.
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <button onClick={() => navigateTo('about-us')} className="hover:text-white">About Us</button>
          <span>•</span>
          <button onClick={() => navigateTo('help')} className="hover:text-white">Support & FAQ</button>
          <span>•</span>
          <button onClick={() => navigateTo('admin-login')} className="hover:text-cyan-400">Staff Portal</button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
