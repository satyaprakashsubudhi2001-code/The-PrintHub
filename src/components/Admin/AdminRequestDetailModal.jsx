import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  MessageCircle,
  Mail,
  Phone,
  CheckCircle2,
  FileText,
  Layers,
  Image as ImageIcon,
  User,
  Calendar,
  Save,
  Copy,
  Check,
  Package,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DESIGN_REQUEST_STATUSES } from '../../constants/requests';
import { generateDesignRequestZip, downloadSingleFile } from '../../services/packageExporter';

/**
 * The PrintHub — Admin Design Request Detail Modal
 * Full inspection of customer submissions, original artwork files, mockups,
 * ZIP package exports, direct customer communication (WhatsApp/Gmail), and status workflow.
 */
export function AdminRequestDetailModal({ request, onClose }) {
  const {
    updateDesignRequestStatus,
    updateDesignRequestNotes,
  } = useStore();

  const [copiedId, setCopiedId] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(request.status || 'NEW');
  const [adminNotes, setAdminNotes] = useState(request.adminNotes || '');
  const [isNotesSaved, setIsNotesSaved] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);

  if (!request) return null;

  // Copy Request ID
  const handleCopyId = () => {
    navigator.clipboard.writeText(request.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Status Change
  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    updateDesignRequestStatus(request.id, newStatus);
  };

  // Save Admin Notes
  const handleSaveNotes = () => {
    updateDesignRequestNotes(request.id, adminNotes);
    setIsNotesSaved(true);
    setTimeout(() => setIsNotesSaved(false), 2500);
  };

  // Export Full ZIP Package
  const handleExportZip = async () => {
    setIsExportingZip(true);
    try {
      await generateDesignRequestZip(request);
    } catch (err) {
      console.error('Failed to export ZIP package:', err);
    } finally {
      setIsExportingZip(false);
    }
  };

  // WhatsApp Customer Deep-link
  const whatsappNumber = request.customer?.mobile?.replace(/\D/g, '') || '';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello ${request.customer?.name || 'Customer'}! This is The PrintHub regarding your Design Request (${request.id}) for the ${request.product?.name}. We have reviewed your artwork and would like to confirm your specifications.`
  )}`;

  // Email Customer Link
  const mailtoUrl = `mailto:${request.customer?.email}?subject=${encodeURIComponent(
    `The PrintHub — Custom Design Request ${request.id}`
  )}&body=${encodeURIComponent(
    `Hi ${request.customer?.name},\n\nThank you for submitting your custom merchandise concept (${request.id}) for the ${request.product?.name}.\n\nOur production engineering team has reviewed your uploaded artwork.\n\nBest regards,\nThe PrintHub Team`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none overflow-y-auto">
      <div className="w-full max-w-4xl rounded-3xl bg-[#0a0e1a] border border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-[#0c1020] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-center p-1.5 shadow-sm">
              <img
                src="/logo-mark-white.png"
                alt="The PrintHub"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-mono">
                  {request.id}
                </h2>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="p-1 rounded text-slate-400 hover:text-white"
                  title="Copy Request ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Received on {new Date(request.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportZip}
              disabled={isExportingZip}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs uppercase font-mono shadow-sm transition-all"
            >
              <Package className="w-3.5 h-3.5" />
              <span>{isExportingZip ? 'BUNDLING ZIP...' : 'DOWNLOAD ZIP'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 font-sans text-xs">
          {/* Status and Direct Communication Bar */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">Status:</span>
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#0a0e1a] border border-slate-700 text-white font-mono font-bold text-xs focus:outline-none focus:border-cyan-400"
              >
                {Object.values(DESIGN_REQUEST_STATUSES).map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Customer</span>
              </a>

              <a
                href={mailtoUrl}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Customer</span>
              </a>
            </div>
          </div>

          {/* 2-Column Grid: Customer & Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Contact Card */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase font-display flex items-center gap-2 border-b border-slate-800 pb-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span>Customer Information</span>
              </h3>

              <div className="space-y-2 text-slate-300 font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">FULL NAME:</span>
                  <span className="font-bold text-white text-sm">{request.customer?.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">WHATSAPP / MOBILE:</span>
                  <span className="text-emerald-400 font-bold">{request.customer?.mobile}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">GMAIL / EMAIL:</span>
                  <span className="text-cyan-300">{request.customer?.email}</span>
                </div>
                {request.customer?.company && (
                  <div>
                    <span className="text-slate-500 block text-[10px]">COMPANY / BRAND:</span>
                    <span>{request.customer?.company}</span>
                  </div>
                )}
                {request.customer?.notes && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-slate-500 block text-[10px]">CUSTOMER NOTES:</span>
                    <p className="italic text-slate-200 mt-0.5">"{request.customer?.notes}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Product & Print Specs Card */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase font-display flex items-center gap-2 border-b border-slate-800 pb-2">
                <Printer className="w-4 h-4 text-lime-400" />
                <span>Product & Print Specifications</span>
              </h3>

              <div className="space-y-2 text-slate-300 font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">PRODUCT BLANK:</span>
                  <span className="font-bold text-white text-sm">{request.product?.name}</span>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span className="text-slate-500 block text-[10px]">COLOUR:</span>
                    <span className="font-bold text-white">{request.color?.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">SIZE:</span>
                    <span className="font-bold text-lime-400">{request.size}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">METHOD:</span>
                    <span>{request.printMethod || 'DTF 300 DPI'}</span>
                  </div>
                </div>

                {request.placements && request.placements.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-slate-500 block text-[10px]">PRINT PLACEMENTS:</span>
                    {request.placements.map((p) => (
                      <div key={p.placementId} className="flex justify-between bg-slate-900 p-1.5 rounded border border-slate-800 text-[11px]">
                        <span className="text-cyan-300">📍 {p.name}:</span>
                        <span className="text-white font-bold">{p.widthInches}" × {p.heightInches}"</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Original Artwork Files Repository */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-white uppercase font-display flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-400" />
                <span>Original Uploaded Artwork Files ({request.artworkFiles?.length || 0})</span>
              </h3>
            </div>

            {(!request.artworkFiles || request.artworkFiles.length === 0) ? (
              <p className="text-slate-500 italic">No original artwork files uploaded.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {request.artworkFiles.map((file) => (
                  <div
                    key={file.id || file.fileName}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {file.previewUrl ? (
                        <img src={file.previewUrl} alt="" className="w-9 h-9 rounded object-contain bg-black shrink-0" />
                      ) : (
                        <FileText className="w-7 h-7 text-cyan-400 shrink-0" />
                      )}
                      <div className="truncate font-mono">
                        <span className="font-bold text-white truncate block text-[11px]">{file.fileName}</span>
                        <span className="text-[10px] text-slate-400">{file.fileType} • {file.fileSize}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => downloadSingleFile(file.dataUrl, file.fileName)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Generated Mockups Section */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase font-display flex items-center gap-2 border-b border-slate-800 pb-2">
              <ImageIcon className="w-4 h-4 text-pink-400" />
              <span>Generated Product Mockups</span>
            </h3>

            {(!request.mockups || request.mockups.length === 0) ? (
              <p className="text-slate-500 italic">No mockups available.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {request.mockups.map((mock, idx) => (
                  <div
                    key={mock.id || idx}
                    className="group rounded-xl bg-slate-900 border border-slate-800 p-2 space-y-2 flex flex-col items-center"
                  >
                    <div className="w-full aspect-square rounded-lg bg-slate-950 p-2 flex items-center justify-center overflow-hidden">
                      <img src={mock.url} alt={mock.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="w-full flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400 truncate">{mock.name || 'mockup.jpg'}</span>
                      <button
                        type="button"
                        onClick={() => downloadSingleFile(mock.url, mock.name || 'mockup.jpg')}
                        className="text-cyan-400 hover:text-white"
                        title="Download Mockup"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Admin Internal Notes Editor */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase font-display">
                Admin Internal Production Notes
              </h3>
              {isNotesSaved && (
                <span className="text-[10px] font-mono text-lime-400 font-bold">Notes Saved ✓</span>
              )}
            </div>
            <textarea
              rows="3"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal production notes, quotes, or customer discussion notes here..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0e1a] border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 resize-none"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-cyan-400" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0c1020] flex items-center justify-between gap-4 shrink-0">
          <button
            type="button"
            onClick={handleExportZip}
            disabled={isExportingZip}
            className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs uppercase font-mono shadow-sm flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>{isExportingZip ? 'CREATING ZIP ARCHIVE...' : 'DOWNLOAD COMPLETE REQUEST (ZIP)'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-mono text-xs font-bold"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminRequestDetailModal;
