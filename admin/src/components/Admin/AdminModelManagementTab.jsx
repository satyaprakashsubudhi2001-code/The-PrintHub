import React, { useState, useMemo, useRef } from 'react';
import {
  Box,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Upload,
  Layers,
  Sparkles,
  Search,
  Filter,
  Check,
  RotateCcw,
  Sliders,
  DollarSign,
  Maximize2,
  RefreshCw,
  FileCode,
  AlertTriangle,
  Info,
  Archive,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { safeParseColors } from '../../utils/normalize';
import { AdminModelViewerModal } from './AdminModelViewerModal';

export function AdminModelManagementTab() {
  const {
    models3D = [],
    productTypes3D = [],
    createModel3D,
    updateModel3D,
    deleteModel3D,
    createProductType3D,
    products = [],
    logAdminActivity,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [previewingModel, setPreviewingModel] = useState(null);
  const [areasConfigModel, setAreasConfigModel] = useState(null);
  const [replaceFileModel, setReplaceFileModel] = useState(null);
  const [isAddTypeModalOpen, setIsAddTypeModalOpen] = useState(false);

  // Notifications
  const [alertMessage, setAlertMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for Add / Edit Model
  const [formData, setFormData] = useState({
    name: '',
    productType: 'T Shirt',
    productId: '',
    modelUrl: '/models/tshirt.glb',
    modelFormat: 'glb',
    previewImage: '',
    colors: ['#18181b', '#ffffff', '#dc2626', '#2563eb'],
    sizes: ['S', 'M', 'L', 'XL'],
    basePrice: 499,
    unit: 'inches',
    status: 'ACTIVE',
    description: '',
    printableAreas: [
      {
        name: 'Front',
        meshName: 'Torso',
        width: 12,
        height: 16,
        minScale: 0.2,
        maxScale: 2.5,
        priceExtra: 0,
        bounds: { x: 0.25, y: 0.2, width: 0.5, height: 0.6 },
        isEnabled: true,
      }
    ]
  });

  // Custom Color Input in form
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newSizeTag, setNewSizeTag] = useState('');
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeCategory, setNewTypeCategory] = useState('Apparel');
  const [newTypeIcon, setNewTypeIcon] = useState('🏷️');

  // Filtered models
  const filteredModels = useMemo(() => {
    return (models3D || []).filter((m) => {
      const matchesSearch =
        (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.productType || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        selectedTypeFilter === 'ALL' || m.productType === selectedTypeFilter;
      const matchesStatus =
        selectedStatusFilter === 'ALL' || m.status === selectedStatusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [models3D, searchQuery, selectedTypeFilter, selectedStatusFilter]);

  // Statistics KPIs
  const stats = useMemo(() => {
    const total = models3D.length;
    const active = models3D.filter((m) => m.status === 'ACTIVE').length;
    const drafts = models3D.filter((m) => m.status === 'DRAFT').length;
    const totalAreas = models3D.reduce((acc, m) => acc + (m.printableAreas?.length || 0), 0);
    return { total, active, drafts, totalAreas };
  }, [models3D]);

  // Handle open Add Modal
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      productType: productTypes3D[0]?.name || 'T Shirt',
      productId: '',
      modelUrl: '/models/tshirt.glb',
      modelFormat: 'glb',
      previewImage: '',
      colors: ['#18181b', '#ffffff', '#dc2626', '#2563eb'],
      sizes: ['S', 'M', 'L', 'XL'],
      basePrice: 499,
      unit: 'inches',
      status: 'ACTIVE',
      description: '',
      printableAreas: [
        {
          name: 'Front Placement',
          meshName: 'Torso',
          width: 12,
          height: 16,
          minScale: 0.2,
          maxScale: 2.5,
          priceExtra: 0,
          bounds: { x: 0.25, y: 0.2, width: 0.5, height: 0.6 },
          isEnabled: true,
        }
      ]
    });
    setEditingModel(null);
    setIsAddModalOpen(true);
  };

  // Handle open Edit Modal
  const handleOpenEditModal = (model) => {
    let parsedColors = ['#18181b', '#ffffff'];
    let parsedSizes = ['S', 'M', 'L', 'XL'];
    try {
      if (Array.isArray(model.colors)) parsedColors = model.colors;
      else if (model.colors) parsedColors = JSON.parse(model.colors);
    } catch (e) {}
    try {
      if (Array.isArray(model.sizes)) parsedSizes = model.sizes;
      else if (model.sizes) parsedSizes = JSON.parse(model.sizes);
    } catch (e) {}

    setFormData({
      name: model.name || '',
      productType: model.productType || 'T Shirt',
      productId: model.productId || '',
      modelUrl: model.modelUrl || '',
      modelFormat: model.modelFormat || 'glb',
      previewImage: model.previewImage || '',
      colors: parsedColors,
      sizes: parsedSizes,
      basePrice: model.basePrice || 0,
      unit: model.unit || 'inches',
      status: model.status || 'ACTIVE',
      description: model.description || '',
      printableAreas: model.printableAreas && model.printableAreas.length > 0
        ? model.printableAreas.map((pa) => ({
            name: pa.name,
            meshName: pa.meshName || '',
            width: pa.width,
            height: pa.height,
            minScale: pa.minScale || 0.2,
            maxScale: pa.maxScale || 2.5,
            priceExtra: pa.priceExtra || 0,
            bounds: typeof pa.bounds === 'string' ? JSON.parse(pa.bounds || '{}') : (pa.bounds || {}),
            isEnabled: pa.isEnabled !== false,
          }))
        : [
            {
              name: 'Main Surface',
              meshName: '',
              width: 10,
              height: 10,
              minScale: 0.2,
              maxScale: 2.5,
              priceExtra: 0,
              isEnabled: true,
            }
          ]
    });
    setEditingModel(model);
    setIsAddModalOpen(true);
  };

  // Handle Save Model (Create or Update)
  const handleSaveModel = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingModel) {
        await updateModel3D(editingModel.id, formData);
        logAdminActivity?.('3D_STUDIO', 'UPDATE_MODEL', editingModel.name, { id: editingModel.id });
        setAlertMessage({ type: 'success', text: `Model "${formData.name}" successfully updated!` });
      } else {
        await createModel3D(formData);
        logAdminActivity?.('3D_STUDIO', 'CREATE_MODEL', formData.name, { type: formData.productType });
        setAlertMessage({ type: 'success', text: `New 3D Model "${formData.name}" published!` });
      }
      setIsAddModalOpen(false);
      setEditingModel(null);
    } catch (err) {
      setAlertMessage({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setAlertMessage(null), 4000);
    }
  };

  // Handle Model File Upload (GLB / GLTF)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const isGLB = fileName.toLowerCase().endsWith('.glb');
    const isGLTF = fileName.toLowerCase().endsWith('.gltf');

    if (!isGLB && !isGLTF) {
      alert('Please upload a 3D model file in .glb or .gltf format.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      alert('File size exceeds the 25MB limit. Please optimize your 3D asset.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setFormData((prev) => ({
        ...prev,
        modelUrl: dataUrl,
        modelFormat: isGLB ? 'glb' : 'gltf',
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle Replace File Action
  const handleReplaceFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !replaceFileModel) return;

    const isGLB = file.name.toLowerCase().endsWith('.glb');
    const isGLTF = file.name.toLowerCase().endsWith('.gltf');

    if (!isGLB && !isGLTF) {
      alert('Please select a .glb or .gltf file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target.result;
      try {
        await updateModel3D(replaceFileModel.id, {
          modelUrl: dataUrl,
          modelFormat: isGLB ? 'glb' : 'gltf',
        });
        setAlertMessage({
          type: 'success',
          text: `3D model file replaced and bumped to v${(replaceFileModel.version || 1) + 1}!`,
        });
        setReplaceFileModel(null);
      } catch (err) {
        setAlertMessage({ type: 'error', text: err.message || 'File replacement failed' });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Status Toggle (Active / Inactive)
  const handleToggleStatus = async (model) => {
    const nextStatus = model.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateModel3D(model.id, { status: nextStatus });
      logAdminActivity?.('3D_STUDIO', 'TOGGLE_STATUS', model.name, { newStatus: nextStatus });
    } catch (err) {
      setAlertMessage({ type: 'error', text: err.message });
    }
  };

  // Handle Delete Model with safety check
  const handleDeleteModel = async (model) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${model.name}"?\nIf this model is associated with historical orders or design requests, it will be safely archived instead to preserve order records.`
    );
    if (!confirmed) return;

    try {
      const res = await deleteModel3D(model.id);
      if (res.archived) {
        setAlertMessage({
          type: 'info',
          text: `Model "${model.name}" is referenced by past orders and has been safely ARCHIVED.`,
        });
      } else {
        setAlertMessage({
          type: 'success',
          text: `Model "${model.name}" deleted successfully.`,
        });
      }
      logAdminActivity?.('3D_STUDIO', 'DELETE_MODEL', model.name, { id: model.id });
    } catch (err) {
      setAlertMessage({ type: 'error', text: err.message });
    }
  };

  // Handle Add Product Type
  const handleCreateProductType = async (e) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;

    try {
      await createProductType3D({
        name: newTypeName.trim(),
        category: newTypeCategory,
        icon: newTypeIcon,
      });
      setFormData((prev) => ({ ...prev, productType: newTypeName.trim() }));
      setNewTypeName('');
      setIsAddTypeModalOpen(false);
      setAlertMessage({ type: 'success', text: `New product type added: ${newTypeName}` });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs text-[#183630]">
      {/* Alert Banner */}
      {alertMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between font-bold animate-in fade-in ${
            alertMessage.type === 'success'
              ? 'bg-[#183630] text-[#E5DAC9] border-[#B8A98F]'
              : alertMessage.type === 'info'
              ? 'bg-amber-900/90 text-amber-100 border-amber-600'
              : 'bg-rose-900/90 text-rose-100 border-rose-600'
          }`}
        >
          <div className="flex items-center gap-2">
            {alertMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#E5C690]" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}
            <span>[ {alertMessage.text} ]</span>
          </div>
          <button onClick={() => setAlertMessage(null)} className="text-sm cursor-pointer opacity-70 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#183630] uppercase font-display tracking-tight">
              3D Studio / Model Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#183630] text-[#E5DAC9] text-[10px] font-bold">
              [ LIVE CATALOG ]
            </span>
          </div>
          <p className="text-[#183630]/75 text-xs font-sans mt-1">
            Manage interactive 3D product models, upload GLB/GLTF assets, configure printable surfaces, and set print bounds for customer customization.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-[#183630] hover:bg-[#122824] text-[#E5DAC9] hover:text-[#E5C690] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>[ + ADD 3D MODEL ]</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#E5DAC9] border border-[#B8A98F]/60 shadow-sm flex flex-col">
          <span className="text-[10px] uppercase font-bold text-[#183630]/70">Total Models</span>
          <span className="text-xl font-black text-[#183630] font-display mt-1">{stats.total}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#E5DAC9] border border-[#B8A98F]/60 shadow-sm flex flex-col">
          <span className="text-[10px] uppercase font-bold text-[#183630]/70">Active in Store</span>
          <span className="text-xl font-black text-emerald-800 font-display mt-1">{stats.active}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#E5DAC9] border border-[#B8A98F]/60 shadow-sm flex flex-col">
          <span className="text-[10px] uppercase font-bold text-[#183630]/70">Product Types</span>
          <span className="text-xl font-black text-[#183630] font-display mt-1">{productTypes3D.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#E5DAC9] border border-[#B8A98F]/60 shadow-sm flex flex-col">
          <span className="text-[10px] uppercase font-bold text-[#183630]/70">Printable Zones</span>
          <span className="text-xl font-black text-cyan-900 font-display mt-1">{stats.totalAreas}</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#E5DAC9] border border-[#B8A98F]/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#183630]/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search models by name or product type..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F4EBDD] border border-[#B8A98F]/60 text-xs font-mono text-[#183630] placeholder-[#183630]/50 focus:outline-none focus:border-[#183630]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Type Filter */}
          <div className="relative">
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="appearance-none cursor-pointer pl-3 pr-8 py-2 rounded-xl bg-[#F4EBDD] border border-[#B8A98F]/60 text-xs font-mono font-bold text-[#183630] focus:outline-none"
            >
              <option value="ALL">All Types ({models3D.length})</option>
              {productTypes3D.map((pt) => (
                <option key={pt.id || pt.name} value={pt.name}>
                  {pt.icon || '🏷️'} {pt.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#183630]/60" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="appearance-none cursor-pointer pl-3 pr-8 py-2 rounded-xl bg-[#F4EBDD] border border-[#B8A98F]/60 text-xs font-mono font-bold text-[#183630] focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="DRAFT">Drafts</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#183630]/60" />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-[#F4EBDD] border border-[#B8A98F]/60 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#183630] text-[#E5DAC9]' : 'text-[#183630]/70'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-[#183630] text-[#E5DAC9]' : 'text-[#183630]/70'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Models Directory: Cards View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
          {filteredModels.map((model) => {
            const parsedColors = safeParseColors(model.colors);

            return (
              <div
                key={model.id}
                className="rounded-3xl bg-[#E5DAC9] border border-[#B8A98F]/70 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
              >
                {/* Card Top Preview / Thumbnail */}
                <div className="relative aspect-[16/10] bg-[#183630]/10 border-b border-[#B8A98F]/40 flex items-center justify-center overflow-hidden">
                  {model.previewImage ? (
                    <img
                      src={model.previewImage}
                      alt={model.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-[#183630]/40">
                      <Box className="w-12 h-12 stroke-1" />
                      <span className="text-[10px] font-mono mt-1 uppercase font-bold">3D Model Asset</span>
                    </div>
                  )}

                  {/* Status Badges Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm ${
                        model.status === 'ACTIVE'
                          ? 'bg-emerald-700 text-white'
                          : model.status === 'DRAFT'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      {model.status}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-[#183630]/80 text-[#E5DAC9] text-[9px] font-bold backdrop-blur-sm">
                      v{model.version || 1}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#E5DAC9] text-[#183630] border border-[#B8A98F] text-[10px] font-bold shadow-sm">
                      {model.productType}
                    </span>
                  </div>
                </div>

                {/* Card Details Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#183630] uppercase font-display tracking-tight line-clamp-1">
                      {model.name}
                    </h3>
                    {model.description && (
                      <p className="text-[11px] text-[#183630]/75 line-clamp-2 mt-1 font-sans">
                        {model.description}
                      </p>
                    )}
                  </div>

                  {/* Color Swatches and Dimensions */}
                  <div className="space-y-2 pt-2 border-t border-[#B8A98F]/30">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#183630]/70 font-bold">Base Price:</span>
                      <span className="font-black text-[#183630]">₹{model.basePrice || 0}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#183630]/70 font-bold">Printable Areas:</span>
                      <span className="font-black text-[#183630] flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-[#183630]" />
                        {model.printableAreas?.length || 0} configured
                      </span>
                    </div>

                    {Array.isArray(parsedColors) && parsedColors.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        {parsedColors.slice(0, 7).map((c, i) => {
                          const hex = typeof c === 'string' ? c : (c?.hex || '#18181b');
                          return (
                            <span
                              key={i}
                              className="w-4 h-4 rounded-full border border-[#B8A98F]/80 shadow-xs"
                              style={{ backgroundColor: hex }}
                              title={hex}
                            />
                          );
                        })}
                        {parsedColors.length > 7 && (
                          <span className="text-[9px] text-[#183630]/60 font-bold">
                            +{parsedColors.length - 7}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#B8A98F]/40">
                    <button
                      type="button"
                      onClick={() => setPreviewingModel(model)}
                      className="px-3 py-2 rounded-xl bg-[#183630] hover:bg-[#122824] text-[#E5DAC9] hover:text-[#E5C690] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>3D Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(model)}
                      className="px-3 py-2 rounded-xl bg-[#F4EBDD] hover:bg-[#183630]/10 border border-[#B8A98F] text-[#183630] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Info</span>
                    </button>
                  </div>

                  {/* Secondary Quick Action Row */}
                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(model)}
                      className="text-[#183630]/80 hover:text-[#183630] font-bold hover:underline cursor-pointer"
                    >
                      {model.status === 'ACTIVE' ? '[ Deactivate ]' : '[ Activate ]'}
                    </button>

                    <label className="text-[#183630]/80 hover:text-[#183630] font-bold hover:underline cursor-pointer">
                      <span>[ Replace 3D File ]</span>
                      <input
                        type="file"
                        accept=".glb,.gltf"
                        className="hidden"
                        onChange={(e) => {
                          setReplaceFileModel(model);
                          handleReplaceFile(e);
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => handleDeleteModel(model)}
                      className="text-rose-700 hover:text-rose-900 font-bold hover:underline cursor-pointer"
                    >
                      [ Delete ]
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Models Directory: Table View */}
      {viewMode === 'table' && (
        <div className="rounded-3xl bg-[#E5DAC9] border border-[#B8A98F]/70 shadow-sm overflow-hidden animate-in fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#183630] text-[#E5DAC9] uppercase text-[10px] tracking-wider border-b border-[#B8A98F]/40">
                <tr>
                  <th className="py-3 px-4">Model Name</th>
                  <th className="py-3 px-4">Product Type</th>
                  <th className="py-3 px-4">Base Price</th>
                  <th className="py-3 px-4">Print Areas</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B8A98F]/30">
                {filteredModels.map((model) => (
                  <tr key={model.id} className="hover:bg-[#183630]/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#183630]">
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-[#183630]/70 shrink-0" />
                        <span>{model.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-[#183630]/10 font-bold text-[10px]">
                        {model.productType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold">₹{model.basePrice || 0}</td>
                    <td className="py-3 px-4 text-[#183630]/80">
                      {model.printableAreas?.length || 0} zones
                    </td>
                    <td className="py-3 px-4 font-bold">v{model.version || 1}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(model)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                          model.status === 'ACTIVE'
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-700 text-white'
                        }`}
                      >
                        {model.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewingModel(model)}
                          className="p-1.5 rounded-lg bg-[#183630] text-[#E5DAC9] hover:text-[#E5C690]"
                          title="Preview 3D"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(model)}
                          className="p-1.5 rounded-lg bg-[#F4EBDD] border border-[#B8A98F] text-[#183630]"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteModel(model)}
                          className="p-1.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-800"
                          title="Delete / Archive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ADD / EDIT 3D MODEL */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in select-none">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-[#F4EBDD] border border-[#B8A98F] shadow-2xl overflow-hidden text-[#183630]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#B8A98F]/50 flex items-center justify-between bg-[#E5DAC9]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#183630] text-[#E5C690] flex items-center justify-center">
                  <Box className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[#183630] uppercase font-display">
                  {editingModel ? `[ EDIT 3D MODEL: ${editingModel.name} ]` : '[ ADD NEW 3D MODEL ]'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-[#183630]/60 hover:text-[#183630] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveModel} className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#183630]/80 mb-1">
                    Model Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Classic Heavyweight Tee"
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F]/60 text-xs font-mono text-[#183630] focus:outline-none focus:border-[#183630]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold uppercase text-[#183630]/80">
                      Product Type *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddTypeModalOpen(true)}
                      className="text-[10px] text-[#183630] font-bold hover:underline cursor-pointer"
                    >
                      + Add New Type
                    </button>
                  </div>
                  <select
                    value={formData.productType}
                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F]/60 text-xs font-mono font-bold text-[#183630] focus:outline-none focus:border-[#183630]"
                  >
                    {productTypes3D.map((pt) => (
                      <option key={pt.id || pt.name} value={pt.name}>
                        {pt.icon || '🏷️'} {pt.name} ({pt.category || 'Apparel'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Associated Catalog Product and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#183630]/80 mb-1">
                    Linked Catalog Product
                  </label>
                  <select
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F]/60 text-xs font-mono text-[#183630] focus:outline-none focus:border-[#183630]"
                  >
                    <option value="">-- None (Standalone Customizer) --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (SKU: {p.sku || p.id.slice(0, 8)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#183630]/80 mb-1">
                    Base Customization Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F]/60 text-xs font-mono font-bold text-[#183630] focus:outline-none focus:border-[#183630]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#183630]/80 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F]/60 text-xs font-mono font-bold text-[#183630] focus:outline-none focus:border-[#183630]"
                  >
                    <option value="ACTIVE">ACTIVE (Published in Storefront)</option>
                    <option value="DRAFT">DRAFT (Testing / Admin Only)</option>
                    <option value="INACTIVE">INACTIVE (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* 3D Model File Upload Section */}
              <div className="p-4 rounded-2xl bg-[#E5DAC9] border border-[#B8A98F]/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase text-[#183630]">
                    3D Model File (.GLB / .GLTF) *
                  </label>
                  <span className="text-[10px] text-[#183630]/60">Max 25MB</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    required
                    value={formData.modelUrl}
                    onChange={(e) => setFormData({ ...formData, modelUrl: e.target.value })}
                    placeholder="/models/tshirt.glb or data:..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#F4EBDD] border border-[#B8A98F]/60 text-xs font-mono text-[#183630] focus:outline-none focus:border-[#183630]"
                  />

                  <label className="px-4 py-2 rounded-xl bg-[#183630] text-[#E5DAC9] hover:text-[#E5C690] text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Local File</span>
                    <input
                      type="file"
                      accept=".glb,.gltf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                <p className="text-[10px] text-[#183630]/60">
                  Preloaded models available: <code className="bg-[#183630]/10 px-1 py-0.5 rounded">/models/tshirt.glb</code>, <code className="bg-[#183630]/10 px-1 py-0.5 rounded">/models/shirt.glb</code>, <code className="bg-[#183630]/10 px-1 py-0.5 rounded">/models/mug.glb</code>, <code className="bg-[#183630]/10 px-1 py-0.5 rounded">/models/mousepad.glb</code>
                </p>
              </div>

              {/* Available Colors and Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Colors */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#183630]/80 mb-1">
                    Available Garment / Product Colors
                  </label>
                  <div className="flex flex-wrap items-center gap-2 mb-2 p-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F]/60 min-h-[46px]">
                    {formData.colors.map((hex, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 border border-[#B8A98F]"
                        style={{ backgroundColor: hex, color: hex === '#ffffff' ? '#000' : '#fff' }}
                      >
                        {hex}
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, colors: formData.colors.filter((_, i) => i !== idx) })}
                          className="hover:scale-125 transition-transform"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-[#B8A98F]"
                    />
                    <input
                      type="text"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-24 px-2 py-1.5 rounded-lg bg-[#E5DAC9] border border-[#B8A98F]/60 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.colors.includes(newColorHex)) {
                          setFormData({ ...formData, colors: [...formData.colors, newColorHex] });
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#183630] text-[#E5DAC9] text-[11px] font-bold cursor-pointer"
                    >
                      + Add Color
                    </button>
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#183630]/80 mb-1">
                    Available Sizes / Variants
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5 mb-2 p-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F]/60 min-h-[46px]">
                    {formData.sizes.map((sz, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-lg bg-[#183630] text-[#E5DAC9] text-[10px] font-mono font-bold flex items-center gap-1.5"
                      >
                        {sz}
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, sizes: formData.sizes.filter((_, i) => i !== idx) })}
                          className="hover:text-[#E5C690]"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSizeTag}
                      onChange={(e) => setNewSizeTag(e.target.value)}
                      placeholder="e.g. 2XL or 11oz"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#E5DAC9] border border-[#B8A98F]/60 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newSizeTag.trim() && !formData.sizes.includes(newSizeTag.trim())) {
                          setFormData({ ...formData, sizes: [...formData.sizes, newSizeTag.trim()] });
                          setNewSizeTag('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#183630] text-[#E5DAC9] text-[11px] font-bold cursor-pointer"
                    >
                      + Add Size
                    </button>
                  </div>
                </div>
              </div>

              {/* Printable Areas Configuration */}
              <div className="p-4 rounded-2xl bg-[#E5DAC9] border border-[#B8A98F]/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#183630] uppercase font-display">
                      Printable Surfaces & Placement Zones ({formData.printableAreas.length})
                    </h4>
                    <p className="text-[10px] text-[#183630]/70 font-sans">
                      Define where customers are allowed to upload artwork (e.g. Front, Back, Sleeve, Mug Wrap).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        printableAreas: [
                          ...formData.printableAreas,
                          {
                            name: `Zone ${formData.printableAreas.length + 1}`,
                            meshName: 'Torso',
                            width: 10,
                            height: 12,
                            minScale: 0.2,
                            maxScale: 2.5,
                            priceExtra: 0,
                            isEnabled: true,
                          }
                        ]
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#183630] text-[#E5DAC9] text-[10px] font-bold cursor-pointer"
                  >
                    + Add Placement
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.printableAreas.map((pa, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#F4EBDD] border border-[#B8A98F]/50 grid grid-cols-1 sm:grid-cols-6 gap-2 items-center"
                    >
                      <div className="sm:col-span-2">
                        <label className="text-[9px] font-bold uppercase text-[#183630]/70 block">Name</label>
                        <input
                          type="text"
                          value={pa.name}
                          onChange={(e) => {
                            const updated = [...formData.printableAreas];
                            updated[idx].name = e.target.value;
                            setFormData({ ...formData, printableAreas: updated });
                          }}
                          className="w-full px-2 py-1 rounded bg-[#E5DAC9] border border-[#B8A98F]/60 text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-bold uppercase text-[#183630]/70 block">Mesh Name</label>
                        <input
                          type="text"
                          value={pa.meshName || ''}
                          placeholder="e.g. Torso"
                          onChange={(e) => {
                            const updated = [...formData.printableAreas];
                            updated[idx].meshName = e.target.value;
                            setFormData({ ...formData, printableAreas: updated });
                          }}
                          className="w-full px-2 py-1 rounded bg-[#E5DAC9] border border-[#B8A98F]/60 text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-bold uppercase text-[#183630]/70 block">Width (in)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={pa.width}
                          onChange={(e) => {
                            const updated = [...formData.printableAreas];
                            updated[idx].width = parseFloat(e.target.value) || 0;
                            setFormData({ ...formData, printableAreas: updated });
                          }}
                          className="w-full px-2 py-1 rounded bg-[#E5DAC9] border border-[#B8A98F]/60 text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-bold uppercase text-[#183630]/70 block">Height (in)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={pa.height}
                          onChange={(e) => {
                            const updated = [...formData.printableAreas];
                            updated[idx].height = parseFloat(e.target.value) || 0;
                            setFormData({ ...formData, printableAreas: updated });
                          }}
                          className="w-full px-2 py-1 rounded bg-[#E5DAC9] border border-[#B8A98F]/60 text-xs font-bold"
                        />
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2">
                        <div>
                          <label className="text-[9px] font-bold uppercase text-[#183630]/70 block">+ Fee (₹)</label>
                          <input
                            type="number"
                            value={pa.priceExtra || 0}
                            onChange={(e) => {
                              const updated = [...formData.printableAreas];
                              updated[idx].priceExtra = parseFloat(e.target.value) || 0;
                              setFormData({ ...formData, printableAreas: updated });
                            }}
                            className="w-16 px-1.5 py-1 rounded bg-[#E5DAC9] border border-[#B8A98F]/60 text-xs font-bold text-center"
                          />
                        </div>

                        {formData.printableAreas.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                printableAreas: formData.printableAreas.filter((_, i) => i !== idx)
                              });
                            }}
                            className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-100 self-end cursor-pointer"
                            title="Remove Area"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#B8A98F]/40">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewingModel(formData)}
                    className="px-4 py-2.5 rounded-xl bg-[#E5DAC9] border border-[#183630] text-[#183630] text-xs font-bold hover:bg-[#183630]/10 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview 3D Mesh</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#183630] hover:bg-[#122824] text-[#E5DAC9] hover:text-[#E5C690] text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : editingModel ? '[ Update 3D Model ]' : '[ Publish 3D Model ]'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD PRODUCT TYPE MODAL */}
      {/* ======================================================== */}
      {isAddTypeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in select-none">
          <div className="w-full max-w-md rounded-3xl bg-[#F4EBDD] border border-[#B8A98F] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#B8A98F]/40 pb-3">
              <h3 className="font-bold text-sm text-[#183630] uppercase font-display">
                [ + Add New Product Type ]
              </h3>
              <button onClick={() => setIsAddTypeModalOpen(false)} className="text-sm cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateProductType} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#183630]/80 mb-1">
                  Type Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="e.g. Hoodie, Apron, Cap, Phone Case"
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F]/60 text-xs font-mono font-bold text-[#183630] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#183630]/80 mb-1">
                    Category
                  </label>
                  <select
                    value={newTypeCategory}
                    onChange={(e) => setNewTypeCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F]/60 text-xs font-mono text-[#183630]"
                  >
                    <option value="Apparel">Apparel</option>
                    <option value="Drinkware">Drinkware</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Gifts">Gifts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#183630]/80 mb-1">
                    Icon Emoji
                  </label>
                  <input
                    type="text"
                    value={newTypeIcon}
                    onChange={(e) => setNewTypeIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F]/60 text-xs font-mono text-center font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddTypeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#E5DAC9] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#183630] text-[#E5DAC9] text-xs font-bold cursor-pointer"
                >
                  Create Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: INTERACTIVE 3D MODEL VIEWER */}
      {/* ======================================================== */}
      {previewingModel && (
        <AdminModelViewerModal
          model={previewingModel}
          isOpen={Boolean(previewingModel)}
          onClose={() => setPreviewingModel(null)}
        />
      )}
    </div>
  );
}
