import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Save,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import {
  IconWhatsApp,
  IconInstagram,
  IconFacebook,
  IconWhatsAppCatalog,
  IconGmail,
  IconGoogleMaps,
} from '../UI/ThePrintHubSocialIcons';
import { useStore } from '../../context/StoreContext';

export function AdminContactSettingsTab() {
  const {
    contactSettings = {},
    updateContactSetting,
    updateAllContactSettings,
    storeSettings = {},
    updateStoreSettings,
  } = useStore();

  const [form, setForm] = useState({
    whatsapp: contactSettings.whatsapp || '+91 98765 43210',
    whatsappCatalog: contactSettings.whatsappCatalog || 'https://wa.me/c/919876543210',
    instagram: contactSettings.instagram || 'https://instagram.com/theprinthub',
    facebook: contactSettings.facebook || 'https://facebook.com/theprinthub',
    gmail: contactSettings.gmail || 'theprinthub.official@gmail.com',
    googleMaps: contactSettings.googleMaps || 'https://maps.google.com/?q=The+PrintHub+Studio+Mumbai',
    phone: contactSettings.phone || '+91 98765 43210',
    email: contactSettings.email || 'orders@theprinthub.com',
    address: contactSettings.address || 'Atelier Plot 42, Print District, Lower Parel, Mumbai, MH 400013',
    hours: contactSettings.hours || 'Mon - Sat: 10:00 AM - 8:30 PM (Sun Closed)',
    slaGuarantee: contactSettings.slaGuarantee || '48-Hour Rush Production & Dispatch Guarantee',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAllContactSettings(form);
    // Also sync to legacy storeSettings for backward compatibility
    updateStoreSettings({
      storeName: storeSettings.storeName || 'The PrintHub',
      whatsapp: form.whatsapp,
      email: form.email,
      address: form.address,
      workingHours: form.hours,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-[#183630]">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#183630] uppercase font-display tracking-tight">
              Social Coordinates & Facility Dispatch Settings
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#183630] text-[#E5DAC9] text-[10px] font-bold">
              [ LIVE STOREFRONT CHANNELS ]
            </span>
          </div>
          <p className="text-[#183630]/75 text-xs font-sans mt-1">
            Centrally manage official WhatsApp, Instagram, Facebook, Catalog link, Gmail, and Google Maps coordinates. Instantly binds to customer Top Bar and Bottom Bar.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 rounded-xl bg-[#183630] text-[#E5C690] border border-[#B8A98F] flex items-center gap-2 font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#E5C690]" />
            <span>[ CHANGES SYNCED LIVE ]</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Social Media & Direct Messaging */}
          <div className="p-6 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#B8A98F]/40 pb-3">
              <Globe className="w-4 h-4 text-[#183630]" />
              <h3 className="text-xs font-bold text-[#183630] uppercase">
                1. Customer Top Bar & Social Links
              </h3>
            </div>

            <div className="space-y-3">
              {/* WhatsApp Direct */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#183630] font-bold flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-800" />
                    <span>WhatsApp Number *</span>
                  </label>
                  <a
                    href={`https://wa.me/${form.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#183630] hover:underline flex items-center gap-1"
                  >
                    <span>Test Chat</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="text"
                  required
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold"
                />
              </div>

              {/* WhatsApp Catalog Link */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#183630] font-bold flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-800" />
                    <span>WhatsApp Catalog URL</span>
                  </label>
                  {form.whatsappCatalog && (
                    <a
                      href={form.whatsappCatalog}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#183630] hover:underline flex items-center gap-1"
                    >
                      <span>Open Catalog</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={form.whatsappCatalog}
                  onChange={(e) => setForm({ ...form, whatsappCatalog: e.target.value })}
                  placeholder="https://wa.me/c/..."
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]"
                />
              </div>

              {/* Instagram URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#183630] font-bold flex items-center gap-1.5">
                    <IconInstagram className="w-3.5 h-3.5 text-pink-800" size={14} />
                    <span>Instagram Profile URL</span>
                  </label>
                  {form.instagram && (
                    <a
                      href={form.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#183630] hover:underline flex items-center gap-1"
                    >
                      <span>Test URL</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  placeholder="https://instagram.com/theprinthub"
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]"
                />
              </div>

              {/* Facebook URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#183630] font-bold flex items-center gap-1.5">
                    <IconFacebook className="w-3.5 h-3.5 text-blue-800" size={14} />
                    <span>Facebook Page URL</span>
                  </label>
                  {form.facebook && (
                    <a
                      href={form.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#183630] hover:underline flex items-center gap-1"
                    >
                      <span>Test URL</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={form.facebook}
                  onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                  placeholder="https://facebook.com/theprinthub"
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]"
                />
              </div>

              {/* Gmail / Support Email */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#183630] font-bold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-red-800" />
                    <span>Gmail / Customer Support Email</span>
                  </label>
                  {form.gmail && (
                    <a
                      href={`mailto:${form.gmail}`}
                      className="text-[10px] text-[#183630] hover:underline flex items-center gap-1"
                    >
                      <span>Send Test</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="email"
                  value={form.gmail}
                  onChange={(e) => setForm({ ...form, gmail: e.target.value })}
                  placeholder="theprinthub.official@gmail.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]"
                />
              </div>

              {/* Google Maps Link */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#183630] font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Google Maps Location URL</span>
                  </label>
                  {form.googleMaps && (
                    <a
                      href={form.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#183630] hover:underline flex items-center gap-1"
                    >
                      <span>Open Map</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={form.googleMaps}
                  onChange={(e) => setForm({ ...form, googleMaps: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Physical Atelier & Operational SLA */}
          <div className="p-6 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#B8A98F]/40 pb-3">
              <MapPin className="w-4 h-4 text-[#183630]" />
              <h3 className="text-xs font-bold text-[#183630] uppercase">
                2. Physical Studio & Dispatch SLA
              </h3>
            </div>

            <div className="space-y-3">
              {/* Studio Helpline */}
              <div>
                <label className="text-[#183630] font-bold block mb-1">
                  Atelier Direct Helpline Number
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]"
                />
              </div>

              {/* Invoicing Email */}
              <div>
                <label className="text-[#183630] font-bold block mb-1">
                  Orders & Commercial Invoicing Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]"
                />
              </div>

              {/* Physical Address */}
              <div>
                <label className="text-[#183630] font-bold block mb-1">
                  Factory & Printing Studio Address
                </label>
                <textarea
                  rows="3"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] resize-none"
                />
              </div>

              {/* Operating Hours */}
              <div>
                <label className="text-[#183630] font-bold block mb-1">
                  Operating Shift Hours
                </label>
                <input
                  type="text"
                  value={form.hours}
                  onChange={(e) => setForm({ ...form, hours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]"
                />
              </div>

              {/* SLA Guarantee */}
              <div>
                <label className="text-[#183630] font-bold block mb-1">
                  Production SLA Guarantee Badge
                </label>
                <input
                  type="text"
                  value={form.slaGuarantee}
                  onChange={(e) => setForm({ ...form, slaGuarantee: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-[#B8A98F]/40">
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5C690] border border-[#B8A98F] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all hover:shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>[ SAVE ALL SOCIAL & CONTACT SETTINGS ]</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
