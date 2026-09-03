import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Check, Plus, AlertCircle } from 'lucide-react';
import { useCustomizer } from '../../../context/CustomizerContext';
import { SAMPLE_ARTWORKS } from '../../../constants/presets';

export function UploadTab() {
  const { addDesign, selectedPrintArea, selectedProduct } = useCustomizer();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileUpload = (file) => {
    if (!file) return;

    // Check file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.svg') && !file.name.endsWith('.pdf')) {
      alert('Please upload a PNG, JPG, JPEG, SVG, or WebP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      addDesign(dataUrl, file.name.replace(/\.[^/.]+$/, ''));
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Upload Custom Artwork</span>
          <span className="text-xs text-brand-400 font-semibold uppercase">
            {selectedPrintArea.replace('_', ' ')}
          </span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Supports PNG, JPG, SVG & WebP. Instant 3D UV mapping.
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center text-center ${
          isDragging
            ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
            : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/80 hover:border-slate-500'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500/20 to-amber-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 mb-3 shadow-inner">
          <Upload className="w-6 h-6" />
        </div>

        <h4 className="text-xs font-bold text-white">
          Click to upload or drag & drop
        </h4>
        <p className="text-[11px] text-slate-400 mt-1">
          PNG, JPG, SVG or WebP (High Resolution recommended)
        </p>

        <span className="mt-3 px-3 py-1 rounded-full bg-brand-500 text-white text-[11px] font-bold shadow-glow-orange flex items-center gap-1.5">
          <Plus className="w-3 h-3" />
          Choose File
        </span>
      </div>

      {uploadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Artwork mapped successfully onto 3D model!</span>
        </div>
      )}

      {/* Sample Artworks Library */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Curated Studio Artworks
          </h4>
          <span className="text-[10px] text-slate-400">Click to apply</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {SAMPLE_ARTWORKS.map((art) => (
            <button
              key={art.id}
              onClick={() => addDesign(art.dataUrl, art.name)}
              className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/90 hover:border-brand-500/60 transition-all flex flex-col items-center gap-2 group text-left"
            >
              <div className="w-full aspect-square rounded-xl bg-slate-900/90 p-2 flex items-center justify-center border border-slate-700/60 group-hover:scale-105 transition-transform">
                <img
                  src={art.dataUrl}
                  alt={art.name}
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>
              <div className="w-full">
                <span className="text-[11px] font-bold text-slate-200 block truncate group-hover:text-brand-400">
                  {art.name}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {art.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
