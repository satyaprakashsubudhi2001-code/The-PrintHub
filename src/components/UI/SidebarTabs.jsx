import React, { useState } from 'react';
import {
  Box,
  Palette,
  Target,
  Upload,
  Type,
  Sparkles,
  Layers,
  Sliders,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ProductTab } from './tabs/ProductTab';
import { ColorTab } from './tabs/ColorTab';
import { PrintAreaTab } from './tabs/PrintAreaTab';
import { UploadTab } from './tabs/UploadTab';
import { TextTab } from './tabs/TextTab';
import { ClipartTab } from './tabs/ClipartTab';
import { LayersTab } from './tabs/LayersTab';
import { DesignControls } from './DesignControls';
import { useCustomizer } from '../../context/CustomizerContext';

export function SidebarTabs() {
  const [activeTab, setActiveTab] = useState('upload');
  const { designs, texts, cliparts } = useCustomizer();

  const totalLayers = designs.length + texts.length + cliparts.length;

  const tabs = [
    { id: 'product', label: 'Product', icon: Box },
    { id: 'color', label: 'Color', icon: Palette },
    { id: 'printArea', label: 'Print Area', icon: Target },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'clipart', label: 'Clipart', icon: Sparkles },
    { id: 'transform', label: 'Position', icon: Sliders },
    { id: 'layers', label: 'Layers', icon: Layers, badge: totalLayers },
  ];

  return (
    <aside className="w-full lg:w-96 h-full flex flex-col bg-studio-850 border-r border-slate-800 shrink-0 z-20 overflow-hidden select-none">
      {/* Top Navigation Tabs Header */}
      <div className="flex items-center gap-1 p-2 bg-studio-900 border-b border-slate-800 overflow-x-auto no-scrollbar shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 relative ${
                isActive
                  ? 'bg-brand-500 text-white shadow-glow-orange'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="w-4 h-4 rounded-full bg-slate-900 text-brand-400 text-[10px] font-black flex items-center justify-center border border-brand-500/40">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Body Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'product' && <ProductTab />}
        {activeTab === 'color' && <ColorTab />}
        {activeTab === 'printArea' && <PrintAreaTab />}
        {activeTab === 'upload' && <UploadTab />}
        {activeTab === 'text' && <TextTab />}
        {activeTab === 'clipart' && <ClipartTab />}
        {activeTab === 'transform' && <DesignControls />}
        {activeTab === 'layers' && <LayersTab />}
      </div>
    </aside>
  );
}
