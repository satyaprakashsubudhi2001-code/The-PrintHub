import React, { useState } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Edit2,
  Eye,
  Save,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * AdminImageManagerTab Component — Visual Asset Library
 * Manages customer website imagery (hero backgrounds, category banners, badges, mockups)
 * Strict 4-Color Luxury System.
 */
export function AdminImageManagerTab() {
  const { homepageContent, saveHomepageDraft, logAdminActivity } = useStore();

  const [imagesList, setImagesList] = useState([
    {
      id: 'img-hero-bg',
      title: 'Hero Studio Background',
      section: 'Hero Section',
      url: homepageContent?.published?.hero?.bgImageUrl || '/hero-studio-bg.jpg',
      altText: 'The PrintHub Atelier Workspace',
      enabled: true,
      dimensions: '1920 x 1080 px',
    },
    {
      id: 'img-brand-logo',
      title: 'Official Brand Shield Logo',
      section: 'Universal Header & Nav',
      url: '/logo-mark-symbol.png',
      altText: 'The PrintHub Symbol',
      enabled: true,
      dimensions: '512 x 512 px',
    },
    {
      id: 'img-brand-wordmark',
      title: 'Official Wordmark Graphic',
      section: 'Universal Header',
      url: '/brand-wordmark.png',
      altText: "The PrintHub - We don't print, we create!",
      enabled: true,
      dimensions: '800 x 200 px',
    },
    {
      id: 'img-cat-tees',
      title: 'Custom T-Shirts Category Visual',
      section: 'Taxonomy Showcase',
      url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      altText: 'Custom Printed T-Shirt Apparel',
      enabled: true,
      dimensions: '800 x 800 px',
    },
    {
      id: 'img-cat-hoodies',
      title: 'Hoodies Category Visual',
      section: 'Taxonomy Showcase',
      url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      altText: 'Heavyweight Custom Hoodie',
      enabled: true,
      dimensions: '800 x 800 px',
    },
    {
      id: 'img-cat-mugs',
      title: 'Mugs Category Visual',
      section: 'Taxonomy Showcase',
      url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      altText: 'Ceramic Sublimated Mugs',
      enabled: true,
      dimensions: '800 x 800 px',
    },
  ]);

  const [selectedImage, setSelectedImage] = useState(imagesList[0]);
  const [editingFields, setEditingFields] = useState(imagesList[0]);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSelectImage = (img) => {
    setSelectedImage(img);
    setEditingFields(img);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        setEditingFields((prev) => ({
          ...prev,
          url: dataUrl,
        }));
        showToast('Image file loaded! Click "Save Image Metadata" to apply.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImageChanges = () => {
    setImagesList((prev) =>
      prev.map((item) => (item.id === editingFields.id ? { ...editingFields } : item))
    );
    setSelectedImage(editingFields);

    // If hero bg was changed, update hero draft
    if (editingFields.id === 'img-hero-bg') {
      saveHomepageDraft('hero', { bgImageUrl: editingFields.url, bgImageAlt: editingFields.altText });
    }

    logAdminActivity?.('IMAGE_ASSET_UPDATED', 'Image Library', editingFields.title, 'Previous URL', editingFields.url.slice(0, 40));
    showToast(`✓ Image metadata for "${editingFields.title}" saved.`);
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[#E5DAC9]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5C690] font-bold block">
            VISUAL ASSETS
          </span>
          <h2 className="text-lg font-black tracking-tight font-display text-[#E5DAC9]">
            Image Asset Library & Replacement
          </h2>
          <p className="text-xs text-[#B8A98F] mt-0.5">
            Safely preview, upload replacements, and manage alt text for customer images.
          </p>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-[#183630] border border-[#E5C690] text-[#E5C690] text-xs font-bold font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#E5C690] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Grid: Image Selector (Left 5 Cols) & Image Inspector (Right 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left 5 Cols: Asset Gallery */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 space-y-3 text-[#E5DAC9]">
          <span className="text-[10px] font-mono text-[#B8A98F] uppercase font-bold tracking-wider block border-b border-[#B8A98F]/20 pb-2">
            WEBSITE ASSETS ({imagesList.length})
          </span>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {imagesList.map((img) => {
              const isSelected = selectedImage?.id === img.id;
              return (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => handleSelectImage(img)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bracket-selected-dark text-[#E5C690] bg-[#E5DAC9]/10 border-[#B8A98F]/70'
                      : 'bg-[#E5DAC9]/5 text-[#E5DAC9]/80 border-transparent hover:border-[#B8A98F]/40 hover:bg-[#E5DAC9]/10'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.altText}
                    className="w-12 h-12 rounded-lg object-cover bg-[#183630] border border-[#B8A98F]/30 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold block truncate">
                      {isSelected ? `[ ${img.title} ]` : img.title}
                    </span>
                    <span className="text-[10px] text-[#B8A98F] block truncate">
                      {img.section} • {img.dimensions}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Image Inspector & Replacement */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 space-y-5 text-[#E5DAC9]">
          <div className="flex items-center justify-between border-b border-[#B8A98F]/20 pb-3">
            <div>
              <span className="text-[10px] font-mono text-[#E5C690] font-bold uppercase">ASSET INSPECTOR</span>
              <h3 className="text-sm font-black font-display uppercase tracking-tight text-[#E5DAC9]">
                {editingFields.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={handleSaveImageChanges}
              className="px-4 py-1.5 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-mono font-black uppercase tracking-wider cursor-pointer shadow-xs"
            >
              <span>Save Changes</span>
            </button>
          </div>

          {/* Visual Preview Container */}
          <div className="p-4 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/25 flex flex-col items-center justify-center space-y-2">
            <div className="w-full max-h-64 flex items-center justify-center overflow-hidden rounded-lg bg-[#183630] border border-[#B8A98F]/30 p-1">
              <img
                src={editingFields.url}
                alt={editingFields.altText}
                className="max-h-56 w-auto object-contain rounded"
              />
            </div>
            <span className="text-[10px] font-mono text-[#B8A98F]">
              Live Preview: {editingFields.dimensions}
            </span>
          </div>

          {/* Replacement Controls */}
          <div className="space-y-3 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Image URL or Local Asset Path</label>
              <input
                type="text"
                value={editingFields.url}
                onChange={(e) => setEditingFields({ ...editingFields, url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
              />
            </div>

            {/* Upload Replacement File */}
            <div className="p-3 rounded-xl bg-[#E5DAC9]/5 border border-dashed border-[#B8A98F]/40 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] text-[#B8A98F]">
                <UploadCloud className="w-4 h-4 text-[#E5C690]" />
                <span>Upload replacement image from computer:</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="text-xs text-[#E5DAC9] file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-[#E5C690] file:text-[#183630] file:cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Title / Label</label>
                <input
                  type="text"
                  value={editingFields.title}
                  onChange={(e) => setEditingFields({ ...editingFields, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Accessibility Alt Text (SEO)</label>
                <input
                  type="text"
                  value={editingFields.altText}
                  onChange={(e) => setEditingFields({ ...editingFields, altText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminImageManagerTab;
