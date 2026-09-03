import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  Check,
  CheckCircle2,
  Lock,
  Unlock,
  RotateCw,
  RotateCcw,
  Sliders,
  Info,
  Maximize2,
  Trash2,
  Plus,
  Tag,
  Eye,
  ShieldCheck,
  HelpCircle,
  Layers,
  Flame,
  X,
  Printer,
  Download,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Type,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_PRODUCTS } from '../../constants/products';
import { SAMPLE_ARTWORKS } from '../../constants/presets';
import { InteractiveMockupStage } from '../MockupStudio/InteractiveMockupStage';
import { PlacementDiagram } from '../MockupStudio/PlacementDiagram';
import { PlacementHelpModal } from '../MockupStudio/PlacementHelpModal';
import { OnDemand360Viewer } from '../MockupStudio/OnDemand360Viewer';
import { getProductPrintAreas, getCalibratedPrintArea } from '../../constants/printCalibration';
import { generateRequestId } from '../../constants/requests';

/**
 * The PrintHub — Custom Merchandise Exploration & Design Studio
 * Complete 7-Step Workflow:
 * Product -> Colour -> Size -> Placement -> Upload Artwork & Text -> Preview -> Contact & Submit Request
 */
export function DesignByCustomerView() {
  const {
    products,
    customizerProduct,
    selectProduct,
    customizerColor,
    setCustomizerColor,
    selectedSize,
    setSelectedSize,
    navigateTo,
    storeSettings,
    addDesignRequest,
    saveDraft,
    loadDraft,
    clearDraft,
  } = useStore();

  // Wizard Step: 1 (Product) | 2 (Color) | 3 (Size) | 4 (Placement) | 5 (Upload & Design) | 6 (Realistic Preview) | 7 (Submit Request)
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlacementHelpOpen, setIsPlacementHelpOpen] = useState(false);
  const [is360Active, setIs360Active] = useState(false);
  const [activePlacementSide, setActivePlacementSide] = useState('front');
  const [isAspectLocked, setIsAspectLocked] = useState(true);
  const [dimensionWarning, setDimensionWarning] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // Text Design Layer State
  const [customText, setCustomText] = useState('');
  const [selectedFont, setSelectedFont] = useState('Montserrat Bold');
  const [textColor, setTextColor] = useState('#ffffff');
  const [showTextModal, setShowTextModal] = useState(false);

  // Customer Contact State (Strictly Name, WhatsApp, Gmail, optional Company & Notes — No shipping / payment)
  const [customerForm, setCustomerForm] = useState({
    name: '',
    mobile: '',
    email: '',
    company: '',
    customerNotes: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const fileInputRef = useRef(null);

  // Set default product
  const activeProduct = customizerProduct || (products && products.length > 0 ? products[0] : INITIAL_PRODUCTS[0]);

  // Available print areas for this product based on size and physical calibration
  const availablePrintAreas = useMemo(() => {
    return getProductPrintAreas(activeProduct.id, selectedSize || 'L');
  }, [activeProduct.id, selectedSize]);

  // Selected Placements Array (e.g. ['center_chest', 'full_back'])
  const [selectedPlacementIds, setSelectedPlacementIds] = useState([]);
  const [activePlacementId, setActivePlacementId] = useState(null);

  // Per-placement Design State: { [placementId]: { dataUrl, fileName, fileType, fileSize, widthInches, heightInches, xInches, yInches, rotation, aspect, maxAreaW, maxAreaH, surface, text, font, textColor } }
  const [placementDesigns, setPlacementDesigns] = useState({});

  // Additional uploaded files repository (PDFs, reference artwork, multiple attachments)
  const [uploadedFilesList, setUploadedFilesList] = useState([]);

  // Available Colors for active product
  const availableColors = useMemo(() => {
    return [
      { name: 'Pitch Black', hex: '#18181b' },
      { name: 'Pure White', hex: '#f8fafc' },
      { name: 'Heather Grey', hex: '#64748b' },
      { name: 'Navy Blue', hex: '#1e3a8a' },
      { name: 'Royal Blue', hex: '#2563eb' },
      { name: 'Crimson Red', hex: '#dc2626' },
      { name: 'Forest Green', hex: '#15803d' },
      { name: 'Amber Gold', hex: '#eab308' },
    ];
  }, []);

  // Standard sizes for active product
  const sizesList = activeProduct.sizes || ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

  // Initialize placements when product loads
  useEffect(() => {
    if (availablePrintAreas.length > 0) {
      const defaultArea = availablePrintAreas[0];
      if (selectedPlacementIds.length === 0) {
        setSelectedPlacementIds([defaultArea.id]);
        setActivePlacementId(defaultArea.id);
        setActivePlacementSide(defaultArea.surface || defaultArea.section || 'front');
      }
    }
  }, [activeProduct.id, availablePrintAreas, selectedPlacementIds.length]);

  // Active Placement Calibration
  const activeAreaConfig = useMemo(() => {
    return (
      getCalibratedPrintArea(activeProduct.id, selectedSize || 'L', activePlacementId) ||
      availablePrintAreas[0] || { maxWidthInches: 12, maxHeightInches: 14, name: 'Print Area' }
    );
  }, [activeProduct.id, selectedSize, activePlacementId, availablePrintAreas]);

  // Current active placement design config
  const currentPlacementDesign = placementDesigns[activePlacementId] || null;

  // Restore draft if available
  useEffect(() => {
    const draft = loadDraft();
    if (draft && !submittedRequest) {
      if (draft.customerForm) setCustomerForm(draft.customerForm);
      if (draft.placementDesigns) setPlacementDesigns(draft.placementDesigns);
      if (draft.selectedPlacementIds) setSelectedPlacementIds(draft.selectedPlacementIds);
      if (draft.uploadedFilesList) setUploadedFilesList(draft.uploadedFilesList);
    }
  }, [loadDraft, submittedRequest]);

  // Handle Product Selection at Step 1
  const handleSelectProduct = (prod) => {
    selectProduct(prod);
    setCustomizerColor(prod.defaultColor || '#18181b');
    setSelectedSize(prod.defaultSize || prod.sizes?.[0] || 'L');
    const defaultArea = prod.printAreas?.[0] || { id: 'center_chest', surface: 'front' };
    setSelectedPlacementIds([defaultArea.id]);
    setActivePlacementId(defaultArea.id);
    setActivePlacementSide(defaultArea.surface || 'front');
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Placement Checkbox at Step 4
  const togglePlacement = (areaId) => {
    const area = availablePrintAreas.find((a) => a.id === areaId);
    if (!area) return;

    setSelectedPlacementIds((prev) => {
      let next;
      if (prev.includes(areaId)) {
        if (prev.length === 1) return prev;
        next = prev.filter((id) => id !== areaId);
      } else {
        next = [...prev, areaId];
      }
      return next;
    });

    setActivePlacementId(areaId);
    setActivePlacementSide(area.surface || area.section || 'front');
  };

  // Switch Active Placement in Step 5
  const switchActivePlacement = (areaId) => {
    const area = availablePrintAreas.find((a) => a.id === areaId);
    if (!area) return;
    setActivePlacementId(areaId);
    setActivePlacementSide(area.surface || area.section || 'front');
  };

  // Handle Artwork File Upload (Supports PNG, JPG, JPEG, PDF)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isImage = file.type.startsWith('image/');
      const fileSizeBytes = file.size;
      const formattedSize =
        fileSizeBytes > 1024 * 1024
          ? `${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(fileSizeBytes / 1024)} KB`;

      const reader = new FileReader();

      if (isImage) {
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          const img = new Image();
          img.onload = () => {
            const aspect = img.width / Math.max(1, img.height);
            const maxW = activeAreaConfig.maxWidthInches || 12.0;
            const maxH = activeAreaConfig.maxHeightInches || 14.0;

            let initialW = maxW * 0.85;
            let initialH = initialW / aspect;
            if (initialH > maxH) {
              initialH = maxH;
              initialW = initialH * aspect;
            }

            const newFileObj = {
              id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              placementId: activePlacementId,
              fileName: file.name,
              fileType: file.type || 'image/png',
              fileSize: formattedSize,
              resolution: `${img.width} × ${img.height} px (300 DPI)`,
              dataUrl,
              previewUrl: dataUrl,
            };

            setPlacementDesigns((prev) => ({
              ...prev,
              [activePlacementId]: {
                ...(prev[activePlacementId] || {}),
                dataUrl,
                fileName: file.name,
                fileType: file.type,
                fileSize: formattedSize,
                widthInches: parseFloat(initialW.toFixed(2)),
                heightInches: parseFloat(initialH.toFixed(2)),
                xInches: 0,
                yInches: 0,
                rotation: 0,
                aspect,
                maxAreaW: maxW,
                maxAreaH: maxH,
                surface: activePlacementSide,
                placementName: activeAreaConfig.name,
              },
            }));

            setUploadedFilesList((prev) => [newFileObj, ...prev]);
          };
          img.src = dataUrl;
        };
        reader.readAsDataURL(file);
      } else if (isPdf) {
        // PDF reference attachment
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          const newFileObj = {
            id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            placementId: activePlacementId,
            fileName: file.name,
            fileType: 'application/pdf',
            fileSize: formattedSize,
            resolution: 'Vector PDF Document',
            dataUrl,
            previewUrl: null,
          };
          setUploadedFilesList((prev) => [newFileObj, ...prev]);
        };
        reader.readAsDataURL(file);
      }
    });

    if (e.target) e.target.value = '';
  };

  // Remove uploaded file from repository
  const handleRemoveUploadedFile = (fileId) => {
    setUploadedFilesList((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Handle Preset Artwork Selection
  const handleSelectPresetArtwork = (preset) => {
    const maxW = activeAreaConfig.maxWidthInches || 12.0;
    const maxH = activeAreaConfig.maxHeightInches || 14.0;
    const initialW = Math.min(maxW, 10);
    const initialH = Math.min(maxH, 10);

    setPlacementDesigns((prev) => ({
      ...prev,
      [activePlacementId]: {
        ...(prev[activePlacementId] || {}),
        dataUrl: preset.dataUrl,
        fileName: `${preset.title.toLowerCase().replace(/\s+/g, '-')}.png`,
        fileType: 'image/png',
        fileSize: '1.5 MB',
        widthInches: initialW,
        heightInches: initialH,
        xInches: 0,
        yInches: 0,
        rotation: 0,
        aspect: 1.0,
        maxAreaW: maxW,
        maxAreaH: maxH,
        surface: activePlacementSide,
        placementName: activeAreaConfig.name,
      },
    }));
  };

  // Clear current placement artwork
  const handleClearPlacementArtwork = () => {
    setPlacementDesigns((prev) => {
      const next = { ...prev };
      delete next[activePlacementId];
      return next;
    });
  };

  // Update Design Transform (from InteractiveMockupStage drag/resize/rotate)
  const handleUpdateDesignTransform = useCallback(
    (updates) => {
      setPlacementDesigns((prev) => ({
        ...prev,
        [activePlacementId]: {
          ...(prev[activePlacementId] || {}),
          ...updates,
          maxAreaW: activeAreaConfig.maxWidthInches || 12.0,
          maxAreaH: activeAreaConfig.maxHeightInches || 14.0,
          surface: activePlacementSide,
          placementName: activeAreaConfig.name,
        },
      }));
    },
    [activePlacementId, activeAreaConfig, activePlacementSide]
  );

  // Text Design Layer Confirmation
  const handleApplyText = () => {
    if (!customText.trim()) {
      setShowTextModal(false);
      return;
    }

    setPlacementDesigns((prev) => ({
      ...prev,
      [activePlacementId]: {
        ...(prev[activePlacementId] || {}),
        text: customText.trim(),
        font: selectedFont,
        textColor: textColor,
        surface: activePlacementSide,
        placementName: activeAreaConfig.name,
      },
    }));

    setShowTextModal(false);
  };

  // Physical Width Input in Inches
  const handleWidthInchesChange = (val) => {
    const rawNum = parseFloat(val) || 1.0;
    const maxAllowed = activeAreaConfig.maxWidthInches || 12.0;

    if (rawNum > maxAllowed) {
      setDimensionWarning(`${activeAreaConfig.name} maximum width is ${maxAllowed}"`);
    } else {
      setDimensionWarning(null);
    }

    const num = Math.max(1.0, Math.min(maxAllowed, rawNum));
    if (isAspectLocked && currentPlacementDesign?.aspect) {
      const maxHAllowed = activeAreaConfig.maxHeightInches || 14.0;
      const newH = Math.min(maxHAllowed, parseFloat((num / currentPlacementDesign.aspect).toFixed(2)));
      handleUpdateDesignTransform({ widthInches: num, heightInches: newH });
    } else {
      handleUpdateDesignTransform({ widthInches: num });
    }
  };

  // Physical Height Input in Inches
  const handleHeightInchesChange = (val) => {
    const rawNum = parseFloat(val) || 1.0;
    const maxAllowed = activeAreaConfig.maxHeightInches || 14.0;

    if (rawNum > maxAllowed) {
      setDimensionWarning(`${activeAreaConfig.name} maximum height is ${maxAllowed}"`);
    } else {
      setDimensionWarning(null);
    }

    const num = Math.max(1.0, Math.min(maxAllowed, rawNum));
    if (isAspectLocked && currentPlacementDesign?.aspect) {
      const maxWAllowed = activeAreaConfig.maxWidthInches || 12.0;
      const newW = Math.min(maxWAllowed, parseFloat((num * currentPlacementDesign.aspect).toFixed(2)));
      handleUpdateDesignTransform({ heightInches: num, widthInches: newW });
    } else {
      handleUpdateDesignTransform({ heightInches: num });
    }
  };

  // Form Validation (Strictly Name, WhatsApp/Mobile, Gmail/Email)
  const validateContactForm = () => {
    const errs = {};
    if (!customerForm.name.trim()) errs.name = 'Full name is required';
    if (!customerForm.mobile.trim() || customerForm.mobile.length < 10) {
      errs.mobile = 'Valid 10-digit WhatsApp/Mobile number required';
    }
    if (!customerForm.email.trim() || !customerForm.email.includes('@')) {
      errs.email = 'Valid Gmail / Email address required';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Final Submission: Creates unique Request ID, saves all artwork & mockups
  const handleSubmitDesignRequest = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateContactForm()) return;

    setIsSubmitting(true);

    const generatedId = generateRequestId();

    // Collect all placement configs
    const placementsList = [];
    const textLayersList = [];
    const artworkFilesList = [...uploadedFilesList];

    selectedPlacementIds.forEach((id) => {
      const area = availablePrintAreas.find((a) => a.id === id);
      const design = placementDesigns[id];
      if (design) {
        placementsList.push({
          placementId: id,
          name: area?.name || id,
          surface: design.surface || area?.surface || 'front',
          widthInches: design.widthInches || 8,
          heightInches: design.heightInches || 10,
          xInches: design.xInches || 0,
          yInches: design.yInches || 0,
          maxAreaW: design.maxAreaW || 12,
          maxAreaH: design.maxAreaH || 14,
        });

        if (design.dataUrl && !artworkFilesList.some((f) => f.dataUrl === design.dataUrl)) {
          artworkFilesList.push({
            id: `file_${id}`,
            placementId: id,
            fileName: design.fileName || `${id}-artwork.png`,
            fileType: design.fileType || 'image/png',
            fileSize: design.fileSize || '2.0 MB',
            resolution: '300 DPI High-Res',
            dataUrl: design.dataUrl,
            previewUrl: design.dataUrl,
          });
        }

        if (design.text) {
          textLayersList.push({
            placementId: id,
            text: design.text,
            font: design.font || 'Montserrat Bold',
            color: design.textColor || '#ffffff',
            xInches: design.xInches || 0,
            yInches: design.yInches || 0,
          });
        }
      }
    });

    // Generate Mockups List
    const mockupsList = [
      {
        id: 'mockup_front',
        name: 'front.jpg',
        side: 'front',
        url: activeProduct.image,
      },
    ];

    if (placementsList.some((p) => p.surface === 'back')) {
      mockupsList.push({
        id: 'mockup_back',
        name: 'back.jpg',
        side: 'back',
        url: activeProduct.image,
      });
    }

    const requestPackage = {
      id: generatedId,
      createdAt: new Date().toISOString(),
      customer: {
        name: customerForm.name.trim(),
        mobile: customerForm.mobile.trim(),
        email: customerForm.email.trim(),
        company: customerForm.company.trim(),
        notes: customerForm.customerNotes.trim(),
      },
      product: {
        id: activeProduct.id,
        name: activeProduct.name,
        variant: activeProduct.variant || 'Standard Custom Blank',
        category: activeProduct.category || 'Apparel',
        basePrice: activeProduct.basePrice || 399,
      },
      color: {
        name: availableColors.find((c) => c.hex.toLowerCase() === customizerColor?.toLowerCase())?.name || 'Custom Shade',
        hex: customizerColor || '#18181b',
      },
      size: selectedSize || 'L',
      printMethod: 'DTF (Direct-to-Film 300 DPI)',
      placements: placementsList,
      artworkFiles: artworkFilesList,
      textLayers: textLayersList,
      mockups: mockupsList,
      status: 'NEW',
      adminNotes: 'Customer submitted concept online. Ready for quotation and production review.',
    };

    const saved = addDesignRequest(requestPackage);
    clearDraft();
    setIsSubmitting(false);
    setSubmittedRequest(saved);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // WhatsApp Deep-link Handoff
  const handleOpenWhatsAppChat = () => {
    if (!submittedRequest) return;
    const rawNumber = storeSettings?.whatsapp?.replace(/\D/g, '') || '917992801158';
    const placementsText = submittedRequest.placements.map((p) => p.name).join(' + ') || 'Custom Print';

    const msg = `Hello The PrintHub!

I have submitted a custom design request on your website.

*Request ID:* ${submittedRequest.id}
*Customer:* ${submittedRequest.customer.name}
*Product:* ${submittedRequest.product.name}
*Colour:* ${submittedRequest.color.name}
*Size:* ${submittedRequest.size}
*Print Locations:* ${placementsText}
*Files Uploaded:* ${submittedRequest.artworkFiles.length} file(s)

I would like to discuss this design with The PrintHub team.`;

    window.open(`https://wa.me/${rawNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Copy Request ID
  const handleCopyRequestId = () => {
    if (!submittedRequest) return;
    navigator.clipboard.writeText(submittedRequest.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Download Printable Summary
  const handleDownloadSummary = () => {
    window.print();
  };

  // Reset Studio for another design
  const handleResetStudio = () => {
    setSubmittedRequest(null);
    setCurrentStep(1);
    setPlacementDesigns({});
    setUploadedFilesList([]);
  };

  // =========================================================================
  // SUCCESS SCREEN: DESIGN REQUEST RECEIVED
  // =========================================================================
  if (submittedRequest) {
    return (
      <div className="min-h-screen bg-[#070913] text-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-in fade-in">
        <div className="w-full max-w-2xl rounded-3xl bg-[#0c101d] border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-6">
          {/* Header Status */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">
              DESIGN REQUEST RECEIVED ✓
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your design concept has been safely received by The PrintHub. Our team will review your specifications and contact you shortly.
            </p>
          </div>

          {/* Request ID Display Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
              YOUR UNIQUE REQUEST ID
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-black font-mono text-lime-400 tracking-wider">
                {submittedRequest.id}
              </span>
              <button
                onClick={handleCopyRequestId}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy Request ID"
              >
                {copiedId ? <Check className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Confirmation notification queued for: <strong className="text-white">{submittedRequest.customer.email}</strong>
            </p>
          </div>

          {/* Specifications Summary Card */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3 font-mono text-xs">
            <h3 className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Design Concept Overview</span>
              <span className="text-slate-500">{new Date(submittedRequest.createdAt).toLocaleDateString()}</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div><span className="text-slate-500">Customer:</span> {submittedRequest.customer.name}</div>
              <div><span className="text-slate-500">WhatsApp:</span> {submittedRequest.customer.mobile}</div>
              <div><span className="text-slate-500">Product:</span> {submittedRequest.product.name}</div>
              <div><span className="text-slate-500">Colour:</span> {submittedRequest.color.name}</div>
              <div><span className="text-slate-500">Size:</span> {submittedRequest.size}</div>
              <div><span className="text-slate-500">Uploaded Files:</span> {submittedRequest.artworkFiles.length} file(s)</div>
            </div>

            {submittedRequest.placements.length > 0 && (
              <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Print Locations & Physical Dimensions:</span>
                {submittedRequest.placements.map((p) => (
                  <div key={p.placementId} className="flex justify-between text-[11px] bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-lime-400 font-bold">📍 {p.name}:</span>
                    <span className="text-slate-200">{p.widthInches}" × {p.heightInches}" print</span>
                  </div>
                ))}
              </div>
            )}

            {submittedRequest.customer.notes && (
              <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                <span className="text-slate-500 font-bold block">Customer Notes:</span>
                <p className="italic text-slate-300">"{submittedRequest.customer.notes}"</p>
              </div>
            )}
          </div>

          {/* Primary Actions: WhatsApp & Summary Download */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleOpenWhatsAppChat}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all font-display"
            >
              <MessageCircle className="w-5 h-5" />
              <span>CONTINUE ON WHATSAPP</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleDownloadSummary}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors font-mono"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>DOWNLOAD DESIGN SUMMARY</span>
            </button>

            <button
              type="button"
              onClick={handleResetStudio}
              className="w-full py-2.5 text-center text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors block"
            >
              ← Customize another merchandise blank
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN STUDIO LAYOUT (WIZARD STEPS 1-7)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#070913] text-white pb-24 select-none">
      {/* 360 Fullscreen On-Demand Modal */}
      {is360Active && (
        <OnDemand360Viewer
          product={activeProduct}
          color={customizerColor}
          onClose={() => setIs360Active(false)}
        />
      )}

      {/* Placement Guide Modal */}
      {isPlacementHelpOpen && (
        <PlacementHelpModal
          product={activeProduct}
          onClose={() => setIsPlacementHelpOpen(false)}
        />
      )}

      {/* 7-Step Breadcrumb Progress Bar */}
      <div className="bg-[#0a0e1c]/95 backdrop-blur-xl border-b border-slate-800 px-4 py-3">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          {[
            { step: 1, label: '1. PRODUCT' },
            { step: 2, label: '2. COLOUR' },
            { step: 3, label: '3. SIZE' },
            { step: 4, label: '4. PLACEMENT' },
            { step: 5, label: '5. DESIGN' },
            { step: 6, label: '6. PREVIEW' },
            { step: 7, label: '7. SUBMIT' },
          ].map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => {
                if (s.step <= currentStep || (s.step === 2 && activeProduct)) {
                  setCurrentStep(s.step);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider shrink-0 transition-all ${
                currentStep === s.step
                  ? 'bg-lime-400 text-slate-950 font-black shadow-sm'
                  : currentStep > s.step
                  ? 'bg-slate-900 border border-slate-800 text-lime-400 hover:text-white'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>{s.label}</span>
              {currentStep > s.step && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: CHOOSE PRODUCT BLANK */}
      {currentStep === 1 && (
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 animate-in fade-in">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono font-bold text-lime-400 uppercase tracking-wider block">
              STEP 1 OF 7
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-display uppercase mt-1">
              WHAT DO YOU WANT TO CUSTOMIZE?
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select a premium blank garment or merchandise style to begin your custom design request.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(products && products.length > 0 ? products : INITIAL_PRODUCTS).map((prod) => (
              <div
                key={prod.id}
                className="group relative rounded-2xl bg-[#0c101d] border border-slate-800 hover:border-lime-400/60 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="px-2 py-0.5 rounded bg-lime-400/15 border border-lime-400/30 text-lime-400 text-[10px] font-black font-mono">
                    {prod.badge || 'POPULAR'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    Starting from ₹{prod.basePrice}
                  </span>
                </div>

                <div className="w-full aspect-square rounded-xl bg-slate-950 p-4 mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-1 mb-4">
                  <h3 className="font-display text-sm font-bold text-white group-hover:text-lime-400 transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{prod.subtitle}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectProduct(prod)}
                  className="w-full py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all font-display"
                >
                  <span>CUSTOMIZE THIS BLANK</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: CHOOSE COLOUR */}
      {currentStep === 2 && (
        <div className="max-w-4xl mx-auto px-4 pt-8 space-y-8 animate-in fade-in">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono font-bold text-lime-400 uppercase tracking-wider block">
              STEP 2 OF 7
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase mt-1">
              CHOOSE YOUR FABRIC / BLANK COLOUR
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Customizing: <strong className="text-white">{activeProduct.name}</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {availableColors.map((color) => {
              const isSelected = customizerColor?.toLowerCase() === color.hex.toLowerCase();
              return (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setCustomizerColor(color.hex)}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-lime-400 ring-2 ring-lime-400/20 shadow-lg'
                      : 'bg-[#0c101d] border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-full border-2 border-white/20 shadow-inner flex items-center justify-center"
                    style={{ backgroundColor: color.hex }}
                  >
                    {isSelected && <Check className="w-5 h-5 text-lime-400 drop-shadow-md" />}
                  </div>
                  <span className="text-xs font-mono font-bold">{color.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
            >
              ← Back to Products
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-8 py-3 rounded-xl bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.3)] font-display"
            >
              <span>Next: Select Size</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CHOOSE SIZE */}
      {currentStep === 3 && (
        <div className="max-w-4xl mx-auto px-4 pt-8 space-y-8 animate-in fade-in">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono font-bold text-lime-400 uppercase tracking-wider block">
              STEP 3 OF 7
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase mt-1">
              CHOOSE GARMENT / PRODUCT SIZE
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Physical print boundaries and scaling will calibrate to this size.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {sizesList.map((size) => {
              const isSelected = (selectedSize || 'L') === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-lime-400 text-slate-950 border-lime-400 font-black shadow-md'
                      : 'bg-[#0c101d] border-slate-800 hover:border-slate-700 text-slate-200 font-bold'
                  }`}
                >
                  <span className="text-base font-mono block">{size}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
            >
              ← Back to Colour
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-8 py-3 rounded-xl bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.3)] font-display"
            >
              <span>Next: Select Print Placements</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CHOOSE PLACEMENTS */}
      {currentStep === 4 && (
        <div className="max-w-5xl mx-auto px-4 pt-8 space-y-8 animate-in fade-in">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-lime-400 uppercase tracking-wider block">
                STEP 4 OF 7
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase mt-1">
                SELECT PRINT LOCATIONS
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Choose one or more placement areas on your {activeProduct.name}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPlacementHelpOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-cyan-400 font-mono"
            >
              <Info className="w-4 h-4" />
              <span>Placement Guide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePrintAreas.map((area) => {
              const isSelected = selectedPlacementIds.includes(area.id);
              return (
                <div
                  key={area.id}
                  onClick={() => togglePlacement(area.id)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-lime-400 shadow-md ring-1 ring-lime-400/30'
                      : 'bg-[#0c101d] border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white uppercase font-display">{area.name}</span>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isSelected ? 'bg-lime-400 border-lime-400 text-slate-950' : 'border-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">{area.shortDesc}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
                    <span>Max Size: {area.maxDimension || `${area.maxWidthInches}" × ${area.maxHeightInches}"`}</span>
                    <span className="uppercase text-slate-500">{area.surface}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
            >
              ← Back to Size
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-8 py-3 rounded-xl bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.3)] font-display"
            >
              <span>Next: Upload & Design</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: INTERACTIVE DESIGN STUDIO (CORE CANVAS + TOOLS) */}
      {currentStep === 5 && (
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 animate-in fade-in">
          {/* Active Placement Switcher Tabs */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 font-bold hidden sm:inline">ACTIVE AREA:</span>
              {selectedPlacementIds.map((id) => {
                const area = availablePrintAreas.find((a) => a.id === id);
                const isActive = activePlacementId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => switchActivePlacement(id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>📍 {area?.name || id}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIs360Active(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 hover:text-white flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>360° View</span>
              </button>
            </div>
          </div>

          {/* Studio Workspace: Left Canvas + Right Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Center / Left Interactive Canvas (7 Cols) */}
            <div className="lg:col-span-7 bg-[#0a0e1a] border border-slate-800 rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center relative min-h-[480px]">
              <div className="w-full max-w-[460px] aspect-square relative flex items-center justify-center">
                <InteractiveMockupStage
                  product={activeProduct}
                  color={customizerColor}
                  size={selectedSize}
                  activeSide={activePlacementSide}
                  activePlacementId={activePlacementId}
                  designData={currentPlacementDesign}
                  onUpdateDesign={handleUpdateDesignTransform}
                />
              </div>

              {/* Angle View Selector (Front, Back, 360) */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 w-full justify-center">
                <button
                  type="button"
                  onClick={() => setActivePlacementSide('front')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                    activePlacementSide === 'front' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  FRONT
                </button>
                <button
                  type="button"
                  onClick={() => setActivePlacementSide('back')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                    activePlacementSide === 'back' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  BACK
                </button>
              </div>
            </div>

            {/* Right Tools & Properties Panel (5 Cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* File Upload Trigger */}
              <div className="p-5 rounded-2xl bg-[#0c101d] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase font-display flex items-center gap-2">
                    <Upload className="w-4 h-4 text-lime-400" />
                    <span>Upload Artwork Files</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">PNG, JPG, PDF</span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/png,image/jpeg,image/jpg,application/pdf"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-lime-400/80 rounded-2xl p-6 text-center space-y-2 bg-slate-950/60 hover:bg-slate-950 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-lime-400/15 text-lime-400 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white block">Click to upload or drag artwork</span>
                  <span className="text-[10px] text-slate-400 font-mono block">Preserves high-res original vector/raster files</span>
                </div>

                {/* Uploaded Files Manager List */}
                {uploadedFilesList.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                      Uploaded Design Files ({uploadedFilesList.length})
                    </span>
                    {uploadedFilesList.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {file.previewUrl ? (
                            <img src={file.previewUrl} alt="" className="w-7 h-7 rounded object-contain bg-black" />
                          ) : (
                            <FileText className="w-6 h-6 text-cyan-400 shrink-0" />
                          )}
                          <div className="truncate">
                            <span className="font-bold text-white truncate block">{file.fileName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{file.fileSize}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveUploadedFile(file.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Physical Print Dimensions (Inches) */}
              <div className="p-5 rounded-2xl bg-[#0c101d] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase font-display flex items-center gap-2">
                    <Printer className="w-4 h-4 text-cyan-400" />
                    <span>Physical Print Dimensions</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAspectLocked(!isAspectLocked)}
                    className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-white"
                  >
                    {isAspectLocked ? <Lock className="w-3 h-3 text-cyan-400" /> : <Unlock className="w-3 h-3" />}
                    <span>{isAspectLocked ? 'Aspect Locked' : 'Unlocked'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      Width (Inches)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max={activeAreaConfig.maxWidthInches || 12}
                      value={currentPlacementDesign?.widthInches || 8}
                      onChange={(e) => handleWidthInchesChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      Height (Inches)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max={activeAreaConfig.maxHeightInches || 14}
                      value={currentPlacementDesign?.heightInches || 10}
                      onChange={(e) => handleHeightInchesChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {dimensionWarning && (
                  <p className="text-[11px] text-amber-400 font-mono">{dimensionWarning}</p>
                )}
              </div>

              {/* Text Layer Tool Trigger */}
              <div className="p-4 rounded-2xl bg-[#0c101d] border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Type className="w-4 h-4 text-indigo-400" />
                    <span>Custom Text Layer</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">Add custom brand names, numbers or slogans</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTextModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
                >
                  {currentPlacementDesign?.text ? 'Edit Text' : '+ Add Text'}
                </button>
              </div>

              {/* Next Step CTA */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="w-full py-4 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.4)] font-display transition-all"
                >
                  <span>PROCEED TO PREVIEW</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: REALISTIC PREVIEW */}
      {currentStep === 6 && (
        <div className="max-w-4xl mx-auto px-4 pt-8 space-y-8 animate-in fade-in">
          <div className="border-b border-slate-800 pb-4 text-center sm:text-left">
            <span className="text-xs font-mono font-bold text-lime-400 uppercase tracking-wider block">
              STEP 6 OF 7
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase mt-1">
              REALISTIC PRODUCT PREVIEW
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Verify your design layout before submitting your custom request.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0c101d] border border-slate-800 flex flex-col items-center justify-center">
            <div className="w-full max-w-md aspect-square relative flex items-center justify-center">
              <InteractiveMockupStage
                product={activeProduct}
                color={customizerColor}
                size={selectedSize}
                activeSide={activePlacementSide}
                activePlacementId={activePlacementId}
                designData={currentPlacementDesign}
                isInteractive={false}
              />
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
            >
              ← Edit Design
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(7)}
              className="px-8 py-3 rounded-xl bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.3)] font-display"
            >
              <span>Next: Enter Contact & Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: CONTACT DETAILS & SUBMIT REQUEST */}
      {currentStep === 7 && (
        <div className="max-w-2xl mx-auto px-4 pt-8 space-y-8 animate-in fade-in">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono font-bold text-lime-400 uppercase tracking-wider block">
              STEP 7 OF 7
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase mt-1">
              SUBMIT CUSTOM DESIGN REQUEST
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              No payment or account required. We will review your files and contact you directly.
            </p>
          </div>

          <form onSubmit={handleSubmitDesignRequest} className="p-6 sm:p-8 rounded-3xl bg-[#0c101d] border border-slate-800 space-y-5">
            {/* Full Name */}
            <div>
              <label className="text-xs font-mono text-slate-300 uppercase block mb-1.5 font-bold">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={customerForm.name}
                onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-lime-400"
              />
              {formErrors.name && <p className="text-[11px] text-rose-400 font-mono mt-1">{formErrors.name}</p>}
            </div>

            {/* WhatsApp / Mobile */}
            <div>
              <label className="text-xs font-mono text-slate-300 uppercase block mb-1.5 font-bold">
                WhatsApp / Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98765 43210"
                value={customerForm.mobile}
                onChange={(e) => setCustomerForm({ ...customerForm, mobile: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-lime-400"
              />
              {formErrors.mobile && <p className="text-[11px] text-rose-400 font-mono mt-1">{formErrors.mobile}</p>}
            </div>

            {/* Gmail / Email */}
            <div>
              <label className="text-xs font-mono text-slate-300 uppercase block mb-1.5 font-bold">
                Gmail / Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. yourname@gmail.com"
                value={customerForm.email}
                onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-lime-400"
              />
              {formErrors.email && <p className="text-[11px] text-rose-400 font-mono mt-1">{formErrors.email}</p>}
            </div>

            {/* Company / Brand Name (Optional) */}
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5 font-bold">
                Company / Brand Name <span className="text-slate-600">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Esports / Studio"
                value={customerForm.company}
                onChange={(e) => setCustomerForm({ ...customerForm, company: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-lime-400"
              />
            </div>

            {/* Customer Notes (Optional) */}
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5 font-bold">
                Design or Production Notes <span className="text-slate-600">(Optional)</span>
              </label>
              <textarea
                rows="3"
                placeholder="e.g. Please ensure chest print is centered 4 inches below collar..."
                value={customerForm.customerNotes}
                onChange={(e) => setCustomerForm({ ...customerForm, customerNotes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-lime-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(163,230,53,0.4)] font-display transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>SUBMITTING DESIGN REQUEST...</span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-slate-950" />
                    <span>SUBMIT DESIGN REQUEST</span>
                    <ArrowRight className="w-5 h-5 text-slate-950" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                className="w-full py-2.5 text-center text-xs text-slate-500 hover:text-slate-300 font-mono"
              >
                ← Back to Preview
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Text Layer Configuration */}
      {showTextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#0c101d] border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-display">Add Text to Design</h3>
              <button onClick={() => setShowTextModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Text Content</label>
              <input
                type="text"
                placeholder="e.g. THE PRINTHUB"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Font Family</label>
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              >
                <option value="Montserrat Bold">Montserrat Bold</option>
                <option value="Impact">Impact Headline</option>
                <option value="Cinzel Bold">Cinzel Luxury Serif</option>
                <option value="Brush Script MT">Brush Script Cursive</option>
                <option value="Courier New">Courier Monospace</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Text Color</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer p-1"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTextModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-xs font-bold text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyText}
                className="px-5 py-2 rounded-xl bg-lime-400 text-slate-950 text-xs font-black"
              >
                Apply Text
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DesignByCustomerView;
