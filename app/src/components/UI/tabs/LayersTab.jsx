import React from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Image as ImageIcon,
  Type,
  Sparkles,
  MoveUp,
  MoveDown,
} from 'lucide-react';
import { useCustomizer } from '../../../context/CustomizerContext';

export function LayersTab() {
  const {
    designs,
    updateDesign,
    removeDesign,
    duplicateDesign,
    texts,
    updateText,
    removeText,
    duplicateText,
    cliparts,
    updateClipart,
    removeClipart,
    activeLayer,
    setActiveLayer,
  } = useCustomizer();

  const allLayers = [
    ...designs.map((d) => ({ ...d, layerType: 'design' })),
    ...texts.map((t) => ({ ...t, layerType: 'text', name: `Text: "${t.text}"` })),
    ...cliparts.map((c) => ({ ...c, layerType: 'clipart' })),
  ];

  if (allLayers.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 text-center space-y-2">
        <Layers className="w-8 h-8 text-slate-500 mx-auto" />
        <h4 className="text-xs font-bold text-slate-300">No Layers Added Yet</h4>
        <p className="text-[11px] text-slate-500">
          Upload an image, type custom text, or select a clipart to start customizing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Active Layers Stack</span>
          <span className="text-xs text-brand-400 font-semibold">
            {allLayers.length} Layers
          </span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Select, hide, duplicate, or remove artwork and typography layers.
        </p>
      </div>

      <div className="space-y-2">
        {allLayers.map((layer) => {
          const isSelected = activeLayer.id === layer.id;

          const toggleVisibility = (e) => {
            e.stopPropagation();
            const nextVis = layer.visible === false ? true : false;
            if (layer.layerType === 'design') updateDesign(layer.id, { visible: nextVis });
            else if (layer.layerType === 'text') updateText(layer.id, { visible: nextVis });
            else if (layer.layerType === 'clipart') updateClipart(layer.id, { visible: nextVis });
          };

          const handleDuplicate = (e) => {
            e.stopPropagation();
            if (layer.layerType === 'design') duplicateDesign(layer.id);
            else if (layer.layerType === 'text') duplicateText(layer.id);
          };

          const handleDelete = (e) => {
            e.stopPropagation();
            if (layer.layerType === 'design') removeDesign(layer.id);
            else if (layer.layerType === 'text') removeText(layer.id);
            else if (layer.layerType === 'clipart') removeClipart(layer.id);
          };

          return (
            <div
              key={layer.id}
              onClick={() => setActiveLayer({ id: layer.id, type: layer.layerType })}
              className={`p-3 rounded-2xl transition-all border flex items-center justify-between gap-3 cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/95 border-brand-500 shadow-glow-orange ring-1 ring-brand-500'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs shrink-0 border ${
                    layer.layerType === 'text'
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                      : layer.layerType === 'clipart'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                  }`}
                >
                  {layer.layerType === 'text' ? (
                    <Type className="w-4 h-4" />
                  ) : layer.layerType === 'clipart' ? (
                    <Sparkles className="w-4 h-4" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate">
                    {layer.name || 'Custom Layer'}
                  </span>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">
                    {layer.printArea.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Visibility */}
                <button
                  onClick={toggleVisibility}
                  title={layer.visible === false ? 'Show' : 'Hide'}
                  className={`p-1.5 rounded-lg transition-colors ${
                    layer.visible === false
                      ? 'text-slate-500 hover:text-slate-300'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {layer.visible === false ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Duplicate */}
                <button
                  onClick={handleDuplicate}
                  title="Duplicate"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  onClick={handleDelete}
                  title="Delete"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
