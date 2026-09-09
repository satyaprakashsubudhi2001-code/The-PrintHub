import React, { useState } from 'react';
import {
  Edit3,
  CheckCircle2,
  Eye,
  Save,
  Send,
  RotateCcw,
  Layers,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * AdminHomepageCmsTab Component — Full Homepage Content Management System
 * Controls every sentence and banner on the customer homepage.
 * 3-Stage Safety Architecture: [ Edit ] -> [ Save Draft ] -> [ Preview ] -> [ Publish ]
 * Strict 4-Color Luxury System.
 */
export function AdminHomepageCmsTab({ onPreviewStorefront }) {
  const {
    homepageContent,
    saveHomepageDraft,
    publishHomepageSection,
    publishAllHomepageDrafts,
    revertHomepageDraft,
  } = useStore();

  const [activeSection, setActiveSection] = useState('hero');
  const [editForms, setEditForms] = useState(() => {
    return JSON.parse(JSON.stringify(homepageContent?.draft || {}));
  });
  const [notificationToast, setNotificationToast] = useState('');

  const showToast = (msg) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(''), 3000);
  };

  const handleFieldChange = (sectionKey, field, value) => {
    setEditForms((prev) => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || {}),
        [field]: value,
      },
    }));
  };

  const handleSaveDraft = (sectionKey) => {
    saveHomepageDraft(sectionKey, editForms[sectionKey]);
    showToast(`✓ Draft for "${sectionKey.toUpperCase()}" saved to staging!`);
  };

  const handlePublish = (sectionKey) => {
    // First save the current form into draft, then publish
    saveHomepageDraft(sectionKey, editForms[sectionKey]);
    publishHomepageSection(sectionKey);
    showToast(`🚀 "${sectionKey.toUpperCase()}" successfully published to live customer storefront!`);
  };

  const handleRevert = (sectionKey) => {
    revertHomepageDraft(sectionKey);
    setEditForms((prev) => ({
      ...prev,
      [sectionKey]: JSON.parse(JSON.stringify(homepageContent?.published?.[sectionKey] || {})),
    }));
    showToast(`↩ "${sectionKey.toUpperCase()}" draft reverted to live published version.`);
  };

  const handleToggleEnable = (sectionKey) => {
    const currentEnabled = Boolean(editForms[sectionKey]?.enabled !== false);
    handleFieldChange(sectionKey, 'enabled', !currentEnabled);
    saveHomepageDraft(sectionKey, { enabled: !currentEnabled });
    showToast(`Section ${!currentEnabled ? 'Enabled' : 'Disabled'} in draft.`);
  };

  const sectionsList = [
    { id: 'hero', label: '1. Hero Section', desc: 'Eyebrow, headlines, copy, CTAs, and background' },
    { id: 'featuredProducts', label: '2. Featured Products Header', desc: 'Section header copy & tags' },
    { id: 'shopCategories', label: '3. Shop Categories Showcase', desc: '8 visual product categories & copy' },
    { id: 'promotionalSections', label: '4. Promotional Banner', desc: 'Discounts, bulk offers & banner CTA' },
    { id: 'trustBenefits', label: '5. Trust & Benefits Steps', desc: '4-step craftsmanship workflow' },
    { id: 'customPrinting', label: '6. Custom Printing (DTF)', desc: 'Industrial printing callout copy' },
    { id: 'studio3D', label: '7. 3D Studio Visualizer', desc: 'Interactive 3D copy & CTA labels' },
    { id: 'bulkOrders', label: '8. Bulk & Corporate Orders', desc: 'Wholesale copy & discount text' },
    { id: 'footerContent', label: '9. Footer & Brand Story', desc: 'Story summary, copyright & hours' },
  ];

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* =====================================================================
          TOP CMS CONTROL BANNER
          ===================================================================== */}
      <div className="p-4 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[#E5DAC9]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5C690] font-bold block">
            LIVE STOREFRONT CMS
          </span>
          <h2 className="text-lg font-black tracking-tight font-display text-[#E5DAC9]">
            Homepage Content Management
          </h2>
          <p className="text-xs text-[#B8A98F] mt-0.5">
            Every customer-facing sentence on the homepage is dynamically managed here with zero hardcoding.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onPreviewStorefront}
            className="px-3.5 py-2 rounded-xl bg-[#E5DAC9]/10 hover:bg-[#E5DAC9]/20 text-[#E5C690] border border-[#B8A98F]/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>[ Preview Storefront ]</span>
          </button>

          <button
            type="button"
            onClick={publishAllHomepageDrafts}
            className="px-4 py-2 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish All Drafts</span>
          </button>
        </div>
      </div>

      {notificationToast && (
        <div className="p-3.5 rounded-xl bg-[#183630] border border-[#E5C690] text-[#E5C690] text-xs font-bold font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#E5C690] shrink-0" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* =====================================================================
          SPLIT LAYOUT: SECTIONS TREE (LEFT 35%) & SECTION EDITOR (RIGHT 65%)
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left 4 Cols: Sections Tree */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 space-y-2 text-[#E5DAC9]">
          <span className="text-[10px] font-mono text-[#B8A98F] uppercase tracking-wider block pb-2 border-b border-[#B8A98F]/20 font-bold">
            HOMEPAGE SECTIONS
          </span>

          <div className="space-y-1 pt-1">
            {sectionsList.map((sec) => {
              const active = activeSection === sec.id;
              const isEnabled = editForms[sec.id]?.enabled !== false;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer border ${
                    active
                      ? 'bracket-selected-dark text-[#E5C690] bg-[#E5DAC9]/10 border-[#B8A98F]/70 font-black'
                      : 'bg-[#E5DAC9]/5 text-[#E5DAC9]/80 border-transparent hover:text-[#E5C690] hover:bg-[#E5DAC9]/10'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-xs font-bold block truncate">
                      {active ? `[ ${sec.label} ]` : sec.label}
                    </span>
                    <span className="text-[10px] text-[#B8A98F] block truncate">
                      {sec.desc}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                      isEnabled
                        ? 'bg-[#E5C690]/20 text-[#E5C690] border-[#E5C690]/40'
                        : 'bg-[#E5DAC9]/10 text-[#B8A98F] border-[#B8A98F]/20'
                    }`}
                  >
                    {isEnabled ? 'ACTIVE' : 'OFF'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Dedicated Section Editor */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 space-y-6 text-[#E5DAC9]">
          {/* Section Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#B8A98F]/20 pb-4">
            <div>
              <span className="text-[10px] font-mono text-[#E5C690] uppercase font-bold">
                EDITING SECTION
              </span>
              <h3 className="text-base font-black tracking-tight font-display text-[#E5DAC9] uppercase">
                {sectionsList.find((s) => s.id === activeSection)?.label}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleEnable(activeSection)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border cursor-pointer ${
                  editForms[activeSection]?.enabled !== false
                    ? 'bg-[#E5C690]/20 text-[#E5C690] border-[#E5C690]/40'
                    : 'bg-[#E5DAC9]/10 text-[#B8A98F] border-[#B8A98F]/20'
                }`}
              >
                <span>{editForms[activeSection]?.enabled !== false ? 'Enabled' : 'Disabled'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleRevert(activeSection)}
                className="px-2.5 py-1.5 rounded-lg bg-[#E5DAC9]/5 hover:bg-[#E5DAC9]/10 text-[#B8A98F] hover:text-[#E5DAC9] text-xs font-mono cursor-pointer border border-[#B8A98F]/20"
                title="Revert Draft"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleSaveDraft(activeSection)}
                className="px-3.5 py-1.5 rounded-lg bg-[#E5DAC9]/10 hover:bg-[#E5DAC9]/20 text-[#E5C690] border border-[#B8A98F]/40 text-xs font-mono font-bold cursor-pointer transition-all"
              >
                <span>[ Save Draft ]</span>
              </button>

              <button
                type="button"
                onClick={() => handlePublish(activeSection)}
                className="px-4 py-1.5 rounded-lg bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-mono font-black uppercase tracking-wider cursor-pointer shadow-xs transition-all"
              >
                <span>Publish</span>
              </button>
            </div>
          </div>

          {/* ===================================================================
              FIELD EDITORS BY SECTION
              =================================================================== */}

          {/* 1. HERO SECTION */}
          {activeSection === 'hero' && (
            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Eyebrow Badge Pill</label>
                <input
                  type="text"
                  value={editForms.hero?.eyebrow || ''}
                  onChange={(e) => handleFieldChange('hero', 'eyebrow', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Headline (Line 1 - White/Beige)</label>
                  <input
                    type="text"
                    value={editForms.hero?.headlineLine1 || ''}
                    onChange={(e) => handleFieldChange('hero', 'headlineLine1', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#E5C690] uppercase text-[10px] font-bold">Headline (Line 2 - Soft Gold)</label>
                  <input
                    type="text"
                    value={editForms.hero?.headlineLine2 || ''}
                    onChange={(e) => handleFieldChange('hero', 'headlineLine2', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5C690] focus:outline-none focus:border-[#E5C690]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Supporting Paragraph / Subtitle</label>
                <textarea
                  rows={3}
                  value={editForms.hero?.subtitle || ''}
                  onChange={(e) => handleFieldChange('hero', 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Primary Button Label</label>
                  <input
                    type="text"
                    value={editForms.hero?.primaryCtaText || ''}
                    onChange={(e) => handleFieldChange('hero', 'primaryCtaText', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Secondary Button Label</label>
                  <input
                    type="text"
                    value={editForms.hero?.secondaryCtaText || ''}
                    onChange={(e) => handleFieldChange('hero', 'secondaryCtaText', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Hero Background Image Path / URL</label>
                <input
                  type="text"
                  value={editForms.hero?.bgImageUrl || ''}
                  onChange={(e) => handleFieldChange('hero', 'bgImageUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>
            </div>
          )}

          {/* 2. FEATURED PRODUCTS */}
          {activeSection === 'featuredProducts' && (
            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Section Tagline</label>
                <input
                  type="text"
                  value={editForms.featuredProducts?.tagline || ''}
                  onChange={(e) => handleFieldChange('featuredProducts', 'tagline', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Section Title</label>
                <input
                  type="text"
                  value={editForms.featuredProducts?.title || ''}
                  onChange={(e) => handleFieldChange('featuredProducts', 'title', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Section Description</label>
                <textarea
                  rows={2}
                  value={editForms.featuredProducts?.subtitle || ''}
                  onChange={(e) => handleFieldChange('featuredProducts', 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>
            </div>
          )}

          {/* 3. PROMOTIONAL SECTIONS */}
          {activeSection === 'promotionalSections' && (
            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Eyebrow Tag</label>
                  <input
                    type="text"
                    value={editForms.promotionalSections?.tagline || ''}
                    onChange={(e) => handleFieldChange('promotionalSections', 'tagline', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#E5C690] uppercase text-[10px] font-bold">Discount Badge</label>
                  <input
                    type="text"
                    value={editForms.promotionalSections?.discountBadge || ''}
                    onChange={(e) => handleFieldChange('promotionalSections', 'discountBadge', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5C690] focus:outline-none focus:border-[#E5C690]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Promotion Title</label>
                <input
                  type="text"
                  value={editForms.promotionalSections?.title || ''}
                  onChange={(e) => handleFieldChange('promotionalSections', 'title', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Promotion Description</label>
                <textarea
                  rows={2}
                  value={editForms.promotionalSections?.description || ''}
                  onChange={(e) => handleFieldChange('promotionalSections', 'description', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Button CTA Label</label>
                <input
                  type="text"
                  value={editForms.promotionalSections?.ctaText || ''}
                  onChange={(e) => handleFieldChange('promotionalSections', 'ctaText', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>
            </div>
          )}

          {/* 4. CUSTOM PRINTING / 3D STUDIO / BULK CALLOUTS */}
          {(activeSection === 'customPrinting' || activeSection === 'studio3D' || activeSection === 'bulkOrders') && (
            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Eyebrow Tagline</label>
                <input
                  type="text"
                  value={editForms[activeSection]?.tagline || ''}
                  onChange={(e) => handleFieldChange(activeSection, 'tagline', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Section Heading</label>
                <input
                  type="text"
                  value={editForms[activeSection]?.title || ''}
                  onChange={(e) => handleFieldChange(activeSection, 'title', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Description Text</label>
                <textarea
                  rows={2}
                  value={editForms[activeSection]?.description || ''}
                  onChange={(e) => handleFieldChange(activeSection, 'description', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Button CTA Text</label>
                <input
                  type="text"
                  value={editForms[activeSection]?.ctaText || ''}
                  onChange={(e) => handleFieldChange(activeSection, 'ctaText', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>
            </div>
          )}

          {/* 5. FOOTER CONTENT */}
          {activeSection === 'footerContent' && (
            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Atelier Story Paragraph</label>
                <textarea
                  rows={3}
                  value={editForms.footerContent?.brandStory || ''}
                  onChange={(e) => handleFieldChange('footerContent', 'brandStory', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Physical Atelier Address</label>
                <input
                  type="text"
                  value={editForms.footerContent?.addressText || ''}
                  onChange={(e) => handleFieldChange('footerContent', 'addressText', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Operating Hours</label>
                  <input
                    type="text"
                    value={editForms.footerContent?.workingHours || ''}
                    onChange={(e) => handleFieldChange('footerContent', 'workingHours', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Copyright Line</label>
                  <input
                    type="text"
                    value={editForms.footerContent?.copyrightNotice || ''}
                    onChange={(e) => handleFieldChange('footerContent', 'copyrightNotice', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. OTHER SECTIONS FALLBACK */}
          {activeSection !== 'hero' &&
            activeSection !== 'featuredProducts' &&
            activeSection !== 'promotionalSections' &&
            activeSection !== 'customPrinting' &&
            activeSection !== 'studio3D' &&
            activeSection !== 'bulkOrders' &&
            activeSection !== 'footerContent' && (
              <div className="p-4 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/20 space-y-2">
                <span className="text-xs font-bold text-[#E5DAC9] block">
                  {sectionsList.find((s) => s.id === activeSection)?.label} Managed
                </span>
                <p className="text-[11px] text-[#B8A98F]">
                  Section status is currently {editForms[activeSection]?.enabled !== false ? 'Active' : 'Disabled'}.
                  Use the top action bar to toggle visibility, preview, or publish.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default AdminHomepageCmsTab;
