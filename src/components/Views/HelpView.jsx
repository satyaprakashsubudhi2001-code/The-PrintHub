import React, { useState } from 'react';
import {
  HelpCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  Search,
  Package,
  Truck,
  Clock,
  MessageCircle,
  FileText,
  Printer,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getDesignRequestById } from '../../constants/requests';

/**
 * Help & Public Design Request Tracker View
 * Allows customers to track custom design requests by Request ID (e.g. PH-2026-00001)
 * and view frequently asked questions.
 */
export function HelpView() {
  const { storeSettings, designRequests = [] } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchedRequest, setSearchedRequest] = useState(null);
  const [searchError, setSearchError] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [enquirySent, setEnquirySent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const faqs = [
    {
      q: 'How does the Design Request & Quotation process work?',
      a: 'Choose any product blank, upload your artwork, scale it in exact physical inches, and submit your request (no payment required upfront). Our print technicians review your artwork resolution and contact you via WhatsApp/Email with the final quotation and production schedule.',
    },
    {
      q: 'What file formats are supported for custom artwork upload?',
      a: 'We accept PNG, JPG, JPEG, SVG, WebP, and PDF formats. For optimal print sharpness, we recommend vector SVGs or transparent PNGs at 300 DPI resolution.',
    },
    {
      q: 'Can I print on multiple locations (Front Chest, Back, and Sleeves)?',
      a: 'Yes! In our studio, you can select any combination of calibrated print areas (Center Chest, Left Pocket, Full Back, Left Sleeve, Right Sleeve) and upload independent graphics for each location.',
    },
    {
      q: 'What is the production turnaround and shipping timeline across India?',
      a: 'Once you confirm your quotation, custom orders are printed within 24 to 48 hours. Courier transit via Delhivery or BlueDart takes 2 to 4 business days.',
    },
    {
      q: 'Is there a Minimum Order Quantity (MOQ)?',
      a: 'No MOQ at all! You can order just 1 single customized garment or merchandise piece, or get volume tier discounts for 20+ to 500+ team/brand orders.',
    },
    {
      q: 'How durable is the Direct-to-Film (DTF) print?',
      a: 'Our DTF prints are tested for 50+ machine washes without cracking, peeling, or fading. We use commercial double-powder heat press curing.',
    },
  ];

  // Search design request by ID
  const handleSearchRequest = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // Search in local context first, then storage
    const found =
      designRequests.find(
        (r) =>
          r.id.toLowerCase() === query.toLowerCase() ||
          r.customer?.mobile?.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, ''))
      ) || getDesignRequestById(query);

    if (found) {
      setSearchedRequest(found);
      setSearchError(false);
    } else {
      setSearchedRequest(null);
      setSearchError(true);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setEnquirySent(true);
    setTimeout(() => {
      setEnquirySent(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  // Status mapping for pipeline display
  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'NEW':
        return 1;
      case 'UNDER_REVIEW':
        return 2;
      case 'QUOTE_PENDING':
        return 3;
      case 'CUSTOMER_CONFIRMED':
        return 4;
      case 'IN_PRODUCTION':
        return 5;
      case 'READY_TO_SHIP':
        return 6;
      case 'SHIPPED':
        return 7;
      case 'DELIVERED':
        return 8;
      default:
        return 1;
    }
  };

  const statusSteps = [
    { num: 1, label: 'Request Received' },
    { num: 2, label: 'Artwork Review' },
    { num: 3, label: 'Quote Ready' },
    { num: 4, label: 'Confirmed' },
    { num: 5, label: 'In Production' },
    { num: 6, label: 'Ready to Ship' },
    { num: 7, label: 'Shipped' },
    { num: 8, label: 'Delivered' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12 select-none text-slate-900 bg-white">
      {/* Header */}
      <div className="border-b border-[#E5E5E5] pb-6">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#DA0090]">
          <HelpCircle className="w-4 h-4 text-[#DA0090]" />
          <span>Track Request & Customer Support</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black mt-1 uppercase text-[#2C0E63]">
          TRACK YOUR DESIGN REQUEST
        </h1>
        <p className="text-xs sm:text-sm mt-1 text-slate-600">
          Enter your Request ID (e.g. <strong className="text-[#2C0E63] font-bold">PH-2026-00001</strong>) to view the live design review, quotation, and production status.
        </p>
      </div>

      {/* =========================================================================
         1. LIVE REQUEST TRACKER TOOL
         ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] bg-white shadow-xl space-y-6">
        <form onSubmit={handleSearchRequest} className="max-w-2xl flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Request ID (e.g. PH-2026-00001)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm font-mono uppercase focus:outline-none transition-all bg-slate-50 border border-[#E5E5E5] text-slate-900 focus:border-[#2C0E63] focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-[#F2CB30] hover:bg-[#e0b925] text-[#12002E] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 font-display transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>TRACK REQUEST</span>
          </button>
        </form>

        {searchError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-mono">
            No design request found with ID "{searchQuery}". Please check the ID or contact support.
          </div>
        )}

        {/* Live Search Result Card */}
        {searchedRequest && (
          <div className="p-6 rounded-2xl border border-[#E5E5E5] bg-slate-50 space-y-6 animate-in fade-in transition-colors">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E5] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
                  REQUEST STATUS
                </span>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black font-mono text-[#2C0E63]">
                    {searchedRequest.id}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border bg-[#DA0090]/15 text-[#DA0090] border-[#DA0090]/30">
                    {searchedRequest.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-500">
                Created: {new Date(searchedRequest.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Visual Status Progress Pipeline */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-[#2C0E63]">
                Production Progress:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {statusSteps.map((step) => {
                  const currentIdx = getStatusStepIndex(searchedRequest.status);
                  const isDone = step.num <= currentIdx;
                  const isCurrent = step.num === currentIdx;

                  return (
                    <div
                      key={step.num}
                      className={`p-2.5 rounded-xl border text-center font-mono text-[10px] transition-all ${
                        isCurrent
                          ? 'bg-[#F2CB30] text-[#12002E] border-[#F2CB30] font-black shadow-[0_0_15px_rgba(242,203,48,0.3)]'
                          : isDone
                          ? 'bg-[#2C0E63]/10 border-[#2C0E63]/30 text-[#2C0E63] font-bold'
                          : 'bg-white border-[#E5E5E5] text-slate-400'
                      }`}
                    >
                      <div className="flex justify-center mb-1">
                        {isDone ? <Check className="w-3 h-3 text-[#DA0090]" /> : <span>{step.num}</span>}
                      </div>
                      <span className="leading-tight block">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Product & Quotation Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
              <div className="p-4 rounded-xl border border-[#E5E5E5] bg-white text-slate-800 space-y-1.5">
                <span className="text-[10px] uppercase font-bold block text-slate-500">
                  Product Details
                </span>
                <div><span className="text-slate-500">Product:</span> {searchedRequest.product.name}</div>
                <div><span className="text-slate-500">Colour:</span> {searchedRequest.color.name}</div>
                <div><span className="text-slate-500">Size:</span> {searchedRequest.size}</div>
                <div><span className="text-slate-500">Print Method:</span> {searchedRequest.printMethod}</div>
              </div>

              <div className="p-4 rounded-xl border border-[#E5E5E5] bg-white text-slate-800 space-y-1.5">
                <span className="text-[10px] uppercase font-bold block text-slate-500">
                  Quotation & Delivery
                </span>
                {searchedRequest.quote?.totalQuote ? (
                  <div>
                    <span className="text-slate-500">Quotation Total:</span>{' '}
                    <strong className="text-sm text-[#2C0E63]">₹{searchedRequest.quote.totalQuote}</strong>
                  </div>
                ) : (
                  <div className="text-[#DA0090] font-semibold">⏳ Quotation currently being prepared by team</div>
                )}
                {searchedRequest.shipment?.trackingNumber ? (
                  <div>
                    <span className="text-slate-500">Tracking AWB:</span>{' '}
                    <span className="font-bold text-[#2C0E63]">{searchedRequest.shipment.trackingNumber}</span> ({searchedRequest.shipment.partner})
                  </div>
                ) : (
                  <div className="text-slate-500">Courier Tracking: Pending dispatch</div>
                )}
              </div>
            </div>

            {/* WhatsApp Quick Trigger */}
            <div className="pt-2 flex justify-end">
              <a
                href={`https://wa.me/${(storeSettings?.whatsapp || storeSettings?.whatsappNumber || '917992801158').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello The PrintHub, I would like an update regarding my Request ID: ${searchedRequest.id}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#F2CB30] hover:bg-[#e0b925] text-[#12002E] font-black text-xs uppercase tracking-wider flex items-center gap-2 font-display transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-[#12002E]/20" />
                <span>Chat with Production Specialist</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
         2. FAQ & DIRECT CONTACT FORM
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: FAQs */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-lg font-black font-display uppercase mb-2 text-[#2C0E63]">
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-[#E5E5E5] bg-white shadow-sm overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm transition-colors text-slate-900 hover:text-[#2C0E63]"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 shrink-0 text-[#DA0090]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-4 pt-0 text-xs leading-relaxed border-t border-[#E5E5E5] bg-slate-50/50 text-slate-600 animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Quick Contact Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl border border-[#E5E5E5] bg-white shadow-xl space-y-4">
            <h3 className="text-base font-black font-display uppercase text-[#2C0E63]">
              SEND US A MESSAGE
            </h3>

            {enquirySent ? (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-mono text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                <p className="font-bold">Message Sent Successfully!</p>
                <p className="text-[11px] text-slate-600">Our support desk will reply within 2 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono font-bold block mb-1 text-[#2C0E63]">
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E5E5] text-slate-900 focus:outline-none focus:border-[#2C0E63] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold block mb-1 text-[#2C0E63]">
                    GMAIL / EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl font-mono bg-slate-50 border border-[#E5E5E5] text-slate-900 focus:outline-none focus:border-[#2C0E63] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold block mb-1 text-[#2C0E63]">
                    MESSAGE / INQUIRY
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E5E5E5] text-slate-900 focus:outline-none focus:border-[#2C0E63] focus:bg-white transition-colors"
                  />
                </div>

                {/* Primary Submit Button: #F2CB30 background, #12002E text */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#F2CB30] hover:bg-[#e0b925] text-[#12002E] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 font-display transition-all active:scale-95 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SUBMIT INQUIRY</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpView;
