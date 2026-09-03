import React from 'react';
import { Sparkles, Plus, Star, Flame, Crown, Zap } from 'lucide-react';
import { useCustomizer } from '../../../context/CustomizerContext';
import { CLIPARTS } from '../../../constants/presets';

export function ClipartTab() {
  const { addClipart, selectedPrintArea } = useCustomizer();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Vector Clipart & Badges</span>
          <span className="text-xs text-brand-400 font-semibold uppercase">
            {selectedPrintArea.replace('_', ' ')}
          </span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          High-definition vector symbols, stamps, and sports emblems.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CLIPARTS.map((item) => (
          <button
            key={item.id}
            onClick={() => addClipart(item)}
            className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/90 hover:border-brand-500/60 transition-all flex flex-col items-center gap-2 group text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-900/90 p-2.5 flex items-center justify-center border border-slate-700/60 group-hover:scale-110 transition-transform">
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: item.svg }}
              />
            </div>
            <span className="text-xs font-bold text-slate-200 group-hover:text-brand-400">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
