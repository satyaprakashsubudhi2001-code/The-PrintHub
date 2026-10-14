import React from 'react';
import { X, CheckCircle2, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { PlacementDiagram } from './PlacementDiagram';

/**
 * Visual "Where should I print?" Guide Modal
 * Assists first-time customers in choosing the optimal placement for their design.
 */
export function PlacementHelpModal({ isOpen, onClose, onSelectPlacement }) {
  if (!isOpen) return null;

  const recommendations = [
    {
      id: 'left_chest',
      title: 'Brand / Company Logo',
      recommendedPlacement: 'Left Chest / Pocket Area',
      maxSize: '4" × 4"',
      desc: 'Subtle, professional, and industry standard for corporate merch, polo uniforms, and minimalist streetwear tags.',
      bestFor: 'Company logos, club crests, initials, small icons',
    },
    {
      id: 'center_chest',
      title: 'Main Artwork & Illustration',
      recommendedPlacement: 'Center Chest',
      maxSize: '12" × 14"',
      desc: 'Front-and-center high-visibility positioning. Perfect for graphic tees, typography, event art, and memes.',
      bestFor: 'Artwork, bold quotes, event posters, illustrations',
    },
    {
      id: 'full_back',
      title: 'Streetwear & Tour Graphic',
      recommendedPlacement: 'Full Back Statement',
      maxSize: '14" × 16"',
      desc: 'Large poster-sized artwork across the back. Pairs wonderfully with a small Left Chest logo on the front.',
      bestFor: 'Concert tour dates, large typography, brand statements',
    },
    {
      id: 'left_sleeve',
      title: 'Sleeve Accent & Flag',
      recommendedPlacement: 'Left / Right Sleeve',
      maxSize: '4" × 10"',
      desc: 'Vertical sleeve text, sponsor badge, or country flag along the bicep for high-end customized athletic apparel.',
      bestFor: 'Vertical lettering, league badges, flags, dates',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#183630]/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#183630] border border-[#B8A98F]/40 shadow-2xl overflow-hidden animate-in zoom-in-95 text-[#E5DAC9]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#B8A98F]/30 flex items-center justify-between bg-[#183630]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E5C690]/15 border border-[#B8A98F]/40 flex items-center justify-center text-[#E5C690]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#E5DAC9] font-display">
                WHERE SHOULD YOUR DESIGN GO?
              </h2>
              <p className="text-xs text-[#E5DAC9]/80">
                Quick visual guide to help you choose the best print placement
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#E5DAC9]/10 hover:bg-[#E5DAC9]/20 text-[#E5DAC9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto no-scrollbar flex-1 bg-[#183630]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-[#183630]/60 border border-[#B8A98F]/40 hover:border-[#E5C690] flex flex-col justify-between transition-all group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-[#E5C690] block">
                        {rec.title}
                      </span>
                      <h3 className="text-sm font-bold text-[#E5DAC9] group-hover:text-[#E5C690] transition-colors">
                        → {rec.recommendedPlacement}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#183630] text-[#E5DAC9] font-mono text-[9px] font-bold shrink-0 border border-[#B8A98F]/40">
                      {rec.maxSize}
                    </span>
                  </div>

                  <div className="w-full h-24 bg-[#183630] rounded-xl overflow-hidden border border-[#B8A98F]/30 p-1 flex items-center justify-center">
                    <PlacementDiagram placementId={rec.id} productId="round-neck-tshirt" className="w-full h-full" isSelected />
                  </div>

                  <p className="text-[11px] text-[#E5DAC9]/80 leading-relaxed">
                    {rec.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#B8A98F]/20 mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-[#E5DAC9]/60 truncate max-w-[160px]">
                    Best for: {rec.bestFor}
                  </span>
                  {onSelectPlacement && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPlacement(rec.id);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Select</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pro Tip Box */}
          <div className="p-3.5 rounded-2xl bg-[#E5DAC9]/10 border border-[#B8A98F]/40 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#E5C690] shrink-0" />
            <p className="text-xs text-[#E5DAC9]/90">
              <strong className="text-[#E5C690] font-bold">Pro Tip:</strong> You can select multiple placements (e.g. <span className="underline decoration-[#E5C690]">Left Chest</span> + <span className="underline decoration-[#E5C690]">Back Center</span>) to print separate graphics on both front and back!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#B8A98F]/30 bg-[#183630] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] font-bold text-xs transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlacementHelpModal;
