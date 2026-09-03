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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0c101d] border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white font-display">
                WHERE SHOULD YOUR DESIGN GO?
              </h2>
              <p className="text-xs text-slate-400">
                Quick visual guide to help you choose the best print placement
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto no-scrollbar flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 flex flex-col justify-between transition-all group hover:bg-slate-900"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 block">
                        {rec.title}
                      </span>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        → {rec.recommendedPlacement}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[9px] font-bold shrink-0">
                      {rec.maxSize}
                    </span>
                  </div>

                  <div className="w-full h-24 bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800/60 p-1 flex items-center justify-center">
                    <PlacementDiagram placementId={rec.id} productId="round-neck-tshirt" className="w-full h-full" isSelected />
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {rec.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/60 mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 truncate max-w-[160px]">
                    Best for: {rec.bestFor}
                  </span>
                  {onSelectPlacement && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPlacement(rec.id);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-black font-bold text-[10px] flex items-center gap-1 transition-all"
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
          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            <p className="text-xs text-cyan-200">
              <strong className="text-white font-bold">Pro Tip:</strong> You can select multiple placements (e.g. <span className="underline decoration-cyan-400">Left Chest</span> + <span className="underline decoration-cyan-400">Back Center</span>) to print separate graphics on both front and back!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlacementHelpModal;
