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
  Box,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SAMPLE_ARTWORKS } from '../../constants/presets';
import { InteractiveMockupStage } from '../MockupStudio/InteractiveMockupStage';
import { PlacementDiagram } from '../MockupStudio/PlacementDiagram';
import { PlacementHelpModal } from '../MockupStudio/PlacementHelpModal';
import { OnDemand360Viewer } from '../MockupStudio/OnDemand360Viewer';
import { getProductPrintAreas, getCalibratedPrintArea } from '../../constants/printCalibration';
import { generateRequestId } from '../../constants/requests';
import { WhatsAppIcon } from '../UI/WhatsAppIcon';

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
    themeMode,
  } = useStore();

  const isLight = themeMode === 'light';

  // Wizard Step: 1 (Product) | 2 (Color) | 3 (Size) | 4 (Placement) | 5 (Upload & Design) | 6 (Realistic Preview) | 7 (Submit Request)
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlacementHelpOpen, setIsPlacementHelpOpen] = useState(false);
  const [is360Active, setIs360Active] = useState(false);
  const [activePlacementSide, setActivePlacementSide] = useState('front');
  const [isAspectLocked, setIsAspectLocked] = useState(false);
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

  // Set default product (active product from database, or null)
  const activeProduct = customizerProduct || (products && products.length > 0 ? products[0] : null);

  // Available print areas for this product based on size and physical calibration
  const availablePrintAreas = useMemo(() => {
    if (!activeProduct?.id) return [];
    return getProductPrintAreas(activeProduct.id, selectedSize || 'L');
  }, [activeProduct?.id, selectedSize]);

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
  const sizesList = activeProduct?.sizes || ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

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
  }, [activeProduct?.id, availablePrintAreas, selectedPlacementIds.length]);

  // Active Placement Calibration
  const activeAreaConfig = useMemo(() => {
    return (
      (activeProduct?.id && getCalibratedPrintArea(activeProduct.id, selectedSize || 'L', activePlacementId)) ||
      availablePrintAreas[0] || { maxWidthInches: 12, maxHeightInches: 14, name: 'Print Area' }
    );
  }, [activeProduct?.id, selectedSize, activePlacementId, availablePrintAreas]);

  // Default dimensions calculated identically to InteractiveMockupStage
  const defaultPlacementWidth = useMemo(() => {
    const maxW = activeAreaConfig.maxWidthInches || 12.0;
    return Math.min(maxW, Math.max(2, parseFloat((maxW * 0.8).toFixed(1))));
  }, [activeAreaConfig]);

  const defaultPlacementHeight = useMemo(() => {
    const maxH = activeAreaConfig.maxHeightInches || 14.0;
    return Math.min(maxH, Math.max(2, parseFloat((maxH * 0.75).toFixed(1))));
  }, [activeAreaConfig]);

  // Current active placement design config
  const currentPlacementDesign = placementDesigns[activePlacementId] || null;

  // Local string buffers for physical print dimensions (allows seamless deleting, decimals, typing)
  const [widthInputStr, setWidthInputStr] = useState('');
  const [heightInputStr, setHeightInputStr] = useState('');
  const [isEditingWidth, setIsEditingWidth] = useState(false);
  const [isEditingHeight, setIsEditingHeight] = useState(false);

  // Synchronize local input buffers with live design dimensions when not actively editing
  useEffect(() => {
    if (!isEditingWidth) {
      const w = currentPlacementDesign?.widthInches ?? defaultPlacementWidth;
      setWidthInputStr(w != null ? String(w) : '');
    }
  }, [currentPlacementDesign?.widthInches, defaultPlacementWidth, isEditingWidth, activePlacementId]);

  useEffect(() => {
    if (!isEditingHeight) {
      const h = currentPlacementDesign?.heightInches ?? defaultPlacementHeight;
      setHeightInputStr(h != null ? String(h) : '');
    }
  }, [currentPlacementDesign?.heightInches, defaultPlacementHeight, isEditingHeight, activePlacementId]);

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

  // Switch Active Placement in Step 5 (Dynamically switches Front/Back side to match)
  const switchActivePlacement = (areaId) => {
    const area = availablePrintAreas.find((a) => a.id === areaId);
    if (!area) return;
    setActivePlacementId(areaId);
    const targetSide = area.surface || area.section || area.cameraView || 'front';
    setActivePlacementSide(targetSide);
  };

  // Synchronized Side Switcher (Front <-> Back with placement auto-selection)
  const handleSideSwitch = useCallback(
    (targetSide) => {
      setActivePlacementSide(targetSide);
      // Prioritize finding an area on this target side that the user actually selected in Step 4
      const userSelectedMatchingSide = selectedPlacementIds.find((id) => {
        const a = availablePrintAreas.find((area) => area.id === id);
        return a && (a.surface || a.section || a.cameraView) === targetSide;
      });

      if (userSelectedMatchingSide) {
        setActivePlacementId(userSelectedMatchingSide);
      } else {
        const sideArea =
          availablePrintAreas.find((a) => (a.surface || a.section || a.cameraView) === targetSide) ||
          availablePrintAreas[0];
        if (sideArea) {
          setActivePlacementId(sideArea.id);
        }
      }
    },
    [availablePrintAreas, selectedPlacementIds]
  );

  // Proceed from Step 4 (Placements) to Step 5 (Design Studio)
  const handleProceedToDesignStep = () => {
    // If the user selected multiple options (or at least one), ensure the first selected placement is activated
    const firstSelectedId = selectedPlacementIds?.[0] || availablePrintAreas[0]?.id;
    if (firstSelectedId) {
      switchActivePlacement(firstSelectedId);
    }
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Toggle Aspect Ratio Locking
  const handleToggleAspectLock = () => {
    const nextLocked = !isAspectLocked;
    setIsAspectLocked(nextLocked);
    if (nextLocked) {
      const curW = parseFloat(widthInputStr) || currentPlacementDesign?.widthInches || defaultPlacementWidth;
      const curH = parseFloat(heightInputStr) || currentPlacementDesign?.heightInches || defaultPlacementHeight;
      if (curW > 0 && curH > 0) {
        handleUpdateDesignTransform({ aspect: parseFloat((curW / curH).toFixed(3)) });
      }
    }
  };

  // Physical Width Input Change (allows free deleting, typing decimals, etc.)
  const handleWidthInchesChange = (val) => {
    setWidthInputStr(val);

    // If empty string or incomplete decimal point, don't force or snap — let user finish typing
    if (!val || val.trim() === '' || val === '.') {
      setDimensionWarning(null);
      return;
    }

    const rawNum = parseFloat(val);
    if (isNaN(rawNum) || rawNum <= 0) return;

    const maxAllowed = activeAreaConfig.maxWidthInches || 12.0;
    if (rawNum > maxAllowed) {
      setDimensionWarning(`${activeAreaConfig.name} maximum width is ${maxAllowed}"`);
    } else {
      setDimensionWarning(null);
    }

    const clampedW = Math.min(maxAllowed, rawNum);

    if (isAspectLocked) {
      const currentH = currentPlacementDesign?.heightInches ?? defaultPlacementHeight;
      const currentW = currentPlacementDesign?.widthInches ?? defaultPlacementWidth;
      const aspect = currentPlacementDesign?.aspect || (currentW > 0 && currentH > 0 ? currentW / currentH : 1.0);
      const maxHAllowed = activeAreaConfig.maxHeightInches || 14.0;
      const computedH = parseFloat((clampedW / aspect).toFixed(2));
      const clampedH = Math.min(maxHAllowed, Math.max(0.5, computedH));

      if (!isEditingHeight) {
        setHeightInputStr(String(clampedH));
      }
      handleUpdateDesignTransform({ widthInches: clampedW, heightInches: clampedH, aspect });
    } else {
      // Unlocked: ONLY updates width, height remains 100% untouched
      const currentH = currentPlacementDesign?.heightInches ?? defaultPlacementHeight;
      const newAspect = currentH > 0 ? parseFloat((clampedW / currentH).toFixed(3)) : 1.0;
      handleUpdateDesignTransform({ widthInches: clampedW, heightInches: currentH, aspect: newAspect });
    }
  };

  // Physical Width Input Blur (validation & final clamping)
  const handleWidthBlur = () => {
    setIsEditingWidth(false);
    setDimensionWarning(null);

    const maxAllowed = activeAreaConfig.maxWidthInches || 12.0;
    const parsed = parseFloat(widthInputStr);

    let finalW;
    if (isNaN(parsed) || parsed <= 0) {
      finalW = currentPlacementDesign?.widthInches ?? defaultPlacementWidth;
    } else {
      finalW = Math.max(0.5, Math.min(maxAllowed, parseFloat(parsed.toFixed(2))));
    }

    setWidthInputStr(String(finalW));

    if (isAspectLocked) {
      const currentH = currentPlacementDesign?.heightInches ?? defaultPlacementHeight;
      const currentW = currentPlacementDesign?.widthInches ?? defaultPlacementWidth;
      const aspect = currentPlacementDesign?.aspect || (currentW > 0 && currentH > 0 ? currentW / currentH : 1.0);
      const maxHAllowed = activeAreaConfig.maxHeightInches || 14.0;
      const finalH = Math.max(0.5, Math.min(maxHAllowed, parseFloat((finalW / aspect).toFixed(2))));
      setHeightInputStr(String(finalH));
      handleUpdateDesignTransform({ widthInches: finalW, heightInches: finalH, aspect });
    } else {
      const currentH = currentPlacementDesign?.heightInches ?? defaultPlacementHeight;
      const newAspect = currentH > 0 ? parseFloat((finalW / currentH).toFixed(3)) : 1.0;
      handleUpdateDesignTransform({ widthInches: finalW, heightInches: currentH, aspect: newAspect });
    }
  };

  // Physical Height Input Change (allows free deleting, typing decimals, etc.)
  const handleHeightInchesChange = (val) => {
    setHeightInputStr(val);

    if (!val || val.trim() === '' || val === '.') {
      setDimensionWarning(null);
      return;
    }

    const rawNum = parseFloat(val);
    if (isNaN(rawNum) || rawNum <= 0) return;

    const maxAllowed = activeAreaConfig.maxHeightInches || 14.0;
    if (rawNum > maxAllowed) {
      setDimensionWarning(`${activeAreaConfig.name} maximum height is ${maxAllowed}"`);
    } else {
      setDimensionWarning(null);
    }

    const clampedH = Math.min(maxAllowed, rawNum);

    if (isAspectLocked) {
      const currentH = currentPlacementDesign?.heightInches ?? defaultPlacementHeight;
      const currentW = currentPlacementDesign?.widthInches ?? defaultPlacementWidth;
      const aspect = currentPlacementDesign?.aspect || (currentW > 0 && currentH > 0 ? currentW / currentH : 1.0);
      const maxWAllowed = activeAreaConfig.maxWidthInches || 12.0;
      const computedW = parseFloat((clampedH * aspect).toFixed(2));
      const clampedW = Math.min(maxWAllowed, Math.max(0.5, computedW));

      if (!isEditingWidth) {
        setWidthInputStr(String(clampedW));
      }
      handleUpdateDesignTransform({ heightInches: clampedH, widthInches: clampedW, aspect });
    } else {
      // Unlocked: ONLY updates height, width remains 100% untouched
      const currentW = currentPlacementDesign?.widthInches ?? defaultPlacementWidth;
      const newAspect = clampedH > 0 ? parseFloat((currentW / clampedH).toFixed(3)) : 1.0;
      handleUpdateDesignTransform({ heightInches: clampedH, widthInches: currentW, aspect: newAspect });
    }
  };

  // Physical Height Input Blur (validation & final clamping)
  const handleHeightBlur = () => {
    setIsEditingHeight(false);
    setDimensionWarning(null);

    const maxAllowed = activeAreaConfig.maxHeightInches || 14.0;
    const parsed = parseFloat(heightInputStr);

    let finalH;
    if (isNaN(parsed) || parsed <= 0) {
      finalH = currentPlacementDesign?.heightInches ?? defaultPlacementHeight;
    } else {
      finalH = Math.max(0.5, Math.min(maxAllowed, parseFloat(parsed.toFixed(2))));
    }

    setHeightInputStr(String(finalH));

    if (isAspectLocked) {
      const currentH = currentPlacementDesign?.heightInches ?? defaultPlacementHeight;
      const currentW = currentPlacementDesign?.widthInches ?? defaultPlacementWidth;
      const aspect = currentPlacementDesign?.aspect || (currentW > 0 && currentH > 0 ? currentW / currentH : 1.0);
      const maxWAllowed = activeAreaConfig.maxWidthInches || 12.0;
      const finalW = Math.max(0.5, Math.min(maxWAllowed, parseFloat((finalH * aspect).toFixed(2))));
      setWidthInputStr(String(finalW));
      handleUpdateDesignTransform({ heightInches: finalH, widthInches: finalW, aspect });
    } else {
      const currentW = currentPlacementDesign?.widthInches ?? defaultPlacementWidth;
      const newAspect = finalH > 0 ? parseFloat((currentW / finalH).toFixed(3)) : 1.0;
      handleUpdateDesignTransform({ heightInches: finalH, widthInches: currentW, aspect: newAspect });
    }
  };

  // Stepper increment/decrement (+0.5" or -0.5")
  const handleStepDimension = (dimension, delta) => {
    const isW = dimension === 'width';
    const currentVal = isW
      ? parseFloat(widthInputStr) || (currentPlacementDesign?.widthInches ?? defaultPlacementWidth)
      : parseFloat(heightInputStr) || (currentPlacementDesign?.heightInches ?? defaultPlacementHeight);
    const newVal = Math.max(0.5, parseFloat((currentVal + delta).toFixed(1)));
    if (isW) {
      handleWidthInchesChange(String(newVal));
    } else {
      handleHeightInchesChange(String(newVal));
    }
  };

  // Preset dimension applicator (standard quick choices)
  const handleApplyDimensionPreset = (targetW, targetH) => {
    const maxW = activeAreaConfig.maxWidthInches || 12.0;
    const maxH = activeAreaConfig.maxHeightInches || 14.0;
    const finalW = Math.max(0.5, Math.min(maxW, targetW));
    const finalH = Math.max(0.5, Math.min(maxH, targetH));
    setWidthInputStr(String(finalW));
    setHeightInputStr(String(finalH));
    const aspect = parseFloat((finalW / finalH).toFixed(3));
    handleUpdateDesignTransform({ widthInches: finalW, heightInches: finalH, aspect });
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
      <div className="min-h-screen bg-[#E5DAC9] text-[#183630] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-in fade-in">
        <div className="w-full max-w-2xl rounded-3xl bg-[#E5DAC9] border-2 border-[#B8A98F] shadow-2xl p-6 sm:p-10 space-y-6">
          {/* Header Status */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-[#183630] text-[#E5DAC9] border border-[#B8A98F] flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-[#E5C690]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#183630] font-display uppercase tracking-tight">
              DESIGN REQUEST RECEIVED ✓
            </h1>
            <p className="text-xs text-[#183630]/80 max-w-md mx-auto">
              Your design concept has been safely received by The PrintHub. Our team will review your specifications and contact you shortly.
            </p>
          </div>

          {/* Request ID Display Card */}
          <div className="p-5 rounded-2xl bg-[#183630] border border-[#B8A98F]/40 text-center space-y-2 text-[#E5DAC9]">
            <span className="text-[10px] font-mono text-[#E5C690] uppercase tracking-wider block font-bold">
              YOUR UNIQUE REQUEST ID
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#E5C690] tracking-wider">
                {submittedRequest.id}
              </span>
              <button
                onClick={handleCopyRequestId}
                className="p-1.5 rounded-lg bg-[#183630] border border-[#B8A98F] hover:bg-[#B8A98F]/20 text-[#E5DAC9] transition-colors cursor-pointer"
                title="Copy Request ID"
              >
                {copiedId ? <Check className="w-4 h-4 text-[#E5C690]" /> : <Copy className="w-4 h-4 text-[#E5DAC9]" />}
              </button>
            </div>
            <p className="text-[11px] text-[#E5DAC9]/80 font-mono">
              Confirmation notification queued for: <strong className="text-[#E5DAC9]">{submittedRequest.customer.email}</strong>
            </p>
          </div>

          {/* Specifications Summary Card */}
          <div className="p-5 rounded-2xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] space-y-3 font-mono text-xs">
            <h3 className="text-[11px] font-bold text-[#183630] border-[#B8A98F]/40 uppercase tracking-wider border-b pb-2 flex items-center justify-between">
              <span>Design Concept Overview</span>
              <span className="text-[#183630]/70">{new Date(submittedRequest.createdAt).toLocaleDateString()}</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-[#183630]">
              <div><span className="text-[#183630]/70">Customer:</span> {submittedRequest.customer.name}</div>
              <div><span className="text-[#183630]/70">WhatsApp:</span> {submittedRequest.customer.mobile}</div>
              <div><span className="text-[#183630]/70">Product:</span> {submittedRequest.product.name}</div>
              <div><span className="text-[#183630]/70">Colour:</span> {submittedRequest.color.name}</div>
              <div><span className="text-[#183630]/70">Size:</span> {submittedRequest.size}</div>
              <div><span className="text-[#183630]/70">Uploaded Files:</span> {submittedRequest.artworkFiles.length} file(s)</div>
            </div>

            {submittedRequest.placements.length > 0 && (
              <div className="pt-2 border-t border-[#B8A98F]/40 space-y-1.5">
                <span className="text-[10px] text-[#183630]/70 uppercase block font-bold">Print Locations & Physical Dimensions:</span>
                {submittedRequest.placements.map((p) => (
                  <div key={p.placementId} className="flex justify-between text-[11px] bg-[#E5DAC9] border-[#B8A98F] p-2 rounded-lg border">
                    <span className="text-[#183630] font-bold">📍 {p.name}:</span>
                    <span className="text-[#183630]">{p.widthInches}" × {p.heightInches}" print</span>
                  </div>
                ))}
              </div>
            )}

            {submittedRequest.customer.notes && (
              <div className="pt-2 border-t border-[#B8A98F]/40 text-[#183630]/80 text-[11px]">
                <span className="text-[#183630] font-bold block">Customer Notes:</span>
                <p className="italic text-[#183630]">"{submittedRequest.customer.notes}"</p>
              </div>
            )}
          </div>

          {/* Primary Actions: WhatsApp & Summary Download */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleOpenWhatsAppChat}
              className="w-full py-4 rounded-2xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] border border-[#B8A98F] font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all font-display cursor-pointer"
            >
              <WhatsAppIcon size={20} className="w-5 h-5 shrink-0" />
              <span>CONTINUE ON WHATSAPP</span>
              <ArrowRight className="w-4 h-4 text-[#E5C690]" />
            </button>

            <button
              type="button"
              onClick={handleDownloadSummary}
              className="w-full py-3 rounded-2xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors font-mono cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#183630]" />
              <span>DOWNLOAD DESIGN SUMMARY</span>
            </button>

            <button
              type="button"
              onClick={handleResetStudio}
              className="w-full py-2.5 text-center text-xs text-[#183630]/70 hover:text-[#183630] font-mono transition-colors block cursor-pointer"
            >
              ← Customize another merchandise blank
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ZERO-STATE: NO PRODUCTS IN CATALOG
  // =========================================================================
  if (!activeProduct) {
    return (
      <div className="min-h-screen bg-[#E5DAC9] text-[#183630] py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-in fade-in">
        <div className="w-full max-w-lg rounded-3xl bg-[#E5DAC9] border border-[#B8A98F]/50 shadow-xl p-8 sm:p-12 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#183630]/10 text-[#183630] border border-[#B8A98F]/40 flex items-center justify-center mx-auto text-2xl">
            <Box className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-[#183630]">
            No Customizable Blanks Available
          </h2>
          <p className="text-xs text-[#183630]/80 leading-relaxed max-w-sm mx-auto">
            The 3D Customizer currently has no active merchandise blanks. Create products in the Admin Command Center to begin customizing in 3D.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#B8A98F]/60 hover:border-[#183630] text-xs font-mono font-bold transition-colors cursor-pointer text-[#183630]"
            >
              Return to Storefront
            </button>
            <button
              onClick={() => navigateTo('admin')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-mono font-black shadow-md transition-all cursor-pointer"
            >
              + Add Product in Admin
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
    <div className="min-h-screen bg-[#E5DAC9] text-[#183630] pb-24 select-none">
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
      <div className="bg-[#183630] border-b border-[#B8A98F]/30 px-4 py-3 sticky top-16 z-30 backdrop-blur-md shadow-md">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          {[
            { step: 1, label: '1. SILHOUETTE' },
            { step: 2, label: '2. COLOUR' },
            { step: 3, label: '3. SIZE' },
            { step: 4, label: '4. PLACEMENT' },
            { step: 5, label: '5. ATELIER DESIGN' },
            { step: 6, label: '6. 3D PREVIEW' },
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-[0.16em] uppercase shrink-0 transition-all ${
                currentStep === s.step
                  ? 'bg-[#E5C690] text-[#183630] font-black border border-[#B8A98F] shadow-sm'
                  : currentStep > s.step
                  ? 'bg-[#183630] border border-[#B8A98F]/40 text-[#E5DAC9] hover:border-[#E5C690]'
                  : 'text-[#E5DAC9]/40 border border-transparent cursor-not-allowed'
              }`}
            >
              <span>{s.label}</span>
              {currentStep > s.step && <Check className="w-3 h-3 text-[#E5C690]" />}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: CHOOSE PRODUCT BLANK */}
      {currentStep === 1 && (
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 animate-in fade-in">
          <div className="border-b border-[#B8A98F]/30 pb-4">
            <span className="text-xs font-mono font-bold text-[#183630]/75 uppercase tracking-wider block">
              STEP 1 OF 7
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#183630] font-display uppercase mt-1">
              WHAT DO YOU WANT TO CUSTOMIZE?
            </h1>
            <p className="text-xs text-[#183630]/80 mt-1">
              Select a premium blank garment or merchandise style to begin your custom design request.
            </p>
          </div>

          {/* Products Grid / Empty State */}
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="group relative rounded-2xl bg-[#E5DAC9] border border-[#B8A98F]/50 hover:border-[#183630] shadow-sm hover:shadow-md p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono bg-[#183630] border border-[#B8A98F]/40 text-[#E5DAC9]">
                      {prod.badge || 'POPULAR'}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#183630]">
                      Starting from ₹{prod.basePrice}
                    </span>
                  </div>

                  <div className="w-full aspect-square rounded-xl bg-[#183630]/5 border border-[#B8A98F]/30 p-4 mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  <div className="space-y-1 mb-4">
                    <h3 className="font-display text-sm font-bold text-[#183630] transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-[#183630]/75 line-clamp-2">{prod.subtitle}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectProduct(prod)}
                    className="w-full py-2.5 rounded-xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] hover:text-[#E5C690] border border-[#B8A98F] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all font-display shadow-sm cursor-pointer"
                  >
                    <span>CUSTOMIZE THIS BLANK</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl border border-[#B8A98F]/40 bg-[#E5DAC9] shadow-sm space-y-4">
              <Box className="w-12 h-12 text-[#183630]/50 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold font-display text-[#183630]">
                  Catalog is Currently Empty
                </h3>
                <p className="text-xs text-[#183630]/80 max-w-sm mx-auto">
                  All products have been cleared. You can add new blanks from the Admin Panel, or customize a generic standard studio canvas template.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigateTo('admin')}
                  className="px-6 py-2.5 rounded-full bg-[#183630] hover:bg-[#183630]/90 border border-[#B8A98F] text-[#E5DAC9] font-bold text-xs uppercase tracking-wider font-display transition-all shadow-md"
                >
                  Manage Products in Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectProduct(DEFAULT_PRESET_PRODUCTS[0])}
                  className="px-5 py-2.5 rounded-full bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] font-black text-xs uppercase tracking-wider font-display transition-all"
                >
                  Use Standard 3D Studio Canvas →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: CHOOSE COLOUR */}
      {currentStep === 2 && (
        <div className="max-w-4xl mx-auto px-4 pt-8 space-y-8 animate-in fade-in">
          <div className="border-b border-[#B8A98F]/30 pb-4">
            <span className="text-xs font-mono font-bold text-[#183630]/75 uppercase tracking-wider block">
              STEP 2 OF 7
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#183630] font-display uppercase mt-1">
              CHOOSE YOUR FABRIC / BLANK COLOUR
            </h1>
            <p className="text-xs text-[#183630]/80 mt-1">
              Customizing: <strong className="text-[#183630] font-bold">{activeProduct.name}</strong>
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
                      ? 'bg-[#E5DAC9] border-2 border-[#183630] ring-2 ring-[#E5C690]/50 shadow-md text-[#183630]'
                      : 'bg-[#E5DAC9] border-[#B8A98F]/50 hover:border-[#183630] text-[#183630] shadow-sm'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-full border-2 border-[#B8A98F]/50 shadow-inner flex items-center justify-center"
                    style={{ backgroundColor: color.hex }}
                  >
                    {isSelected && <Check className="w-5 h-5 text-[#E5DAC9] drop-shadow-md" />}
                  </div>
                  <span className="text-xs font-mono font-bold text-[#183630]">{color.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between pt-6 border-t border-[#B8A98F]/30">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 rounded-xl bg-[#E5DAC9] border border-[#B8A98F]/60 text-[#183630] hover:bg-[#183630]/10 text-xs font-bold transition-colors"
            >
              ← Back to Products
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-8 py-3 rounded-xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] hover:text-[#E5C690] border border-[#B8A98F] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
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
          <div className="border-b border-[#B8A98F]/30 pb-4">
            <span className="text-xs font-mono font-bold text-[#183630]/75 uppercase tracking-wider block">
              STEP 3 OF 7
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#183630] font-display uppercase mt-1">
              CHOOSE GARMENT / PRODUCT SIZE
            </h1>
            <p className="text-xs text-[#183630]/80 mt-1">
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
                      ? 'bg-[#183630] text-[#E5C690] border-[#183630] font-black shadow-md'
                      : 'bg-[#E5DAC9] border-[#B8A98F]/50 hover:border-[#183630] text-[#183630] font-bold shadow-sm'
                  }`}
                >
                  <span className="text-base font-mono block">{size}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between pt-6 border-t border-[#B8A98F]/30">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-xl bg-[#E5DAC9] border border-[#B8A98F]/60 text-[#183630] hover:bg-[#183630]/10 text-xs font-bold transition-colors"
            >
              ← Back to Colour
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-8 py-3 rounded-xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] hover:text-[#E5C690] border border-[#B8A98F] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
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
          <div className="border-b border-[#B8A98F]/30 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-[#183630]/75 uppercase tracking-wider block">
                STEP 4 OF 7
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#183630] font-display uppercase mt-1">
                SELECT PRINT LOCATIONS
              </h1>
              <p className="text-xs text-[#183630]/80 mt-1">
                Choose one or more placement areas on your {activeProduct.name}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPlacementHelpOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#183630]/10 border border-[#B8A98F]/50 text-[#183630] text-xs font-mono"
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
                      ? 'bg-[#E5DAC9] border-2 border-[#183630] shadow-md ring-2 ring-[#E5C690]/40 text-[#183630]'
                      : 'bg-[#E5DAC9] border-[#B8A98F]/50 hover:border-[#183630] text-[#183630] shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#183630] uppercase font-display">{area.name}</span>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#183630] border-[#183630] text-[#E5C690]'
                          : 'border-[#B8A98F]/60'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#183630]/75 mb-2">{area.shortDesc}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#183630]/80">
                    <span>Max Size: {area.maxDimension || `${area.maxWidthInches}" × ${area.maxHeightInches}"`}</span>
                    <span className="uppercase text-[#183630]/60">{area.surface}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-6 border-t border-[#B8A98F]/30">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-xl bg-[#E5DAC9] border border-[#B8A98F]/60 text-[#183630] hover:bg-[#183630]/10 text-xs font-bold transition-colors"
            >
              ← Back to Size
            </button>
            <button
              type="button"
              onClick={handleProceedToDesignStep}
              className="px-8 py-3 rounded-xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] hover:text-[#E5C690] border border-[#B8A98F] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
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
          {/* Dynamic Placement Selector Bar: Dropdown + Quick Pills + Side Flip + 360 View */}
          <div className="p-4 rounded-2xl bg-[#E5DAC9] border border-[#B8A98F]/50 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Left: Dropdown Button Selector & Quick Pills */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#183630] text-[#E5C690] flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase font-black tracking-wider block text-[#183630]/75">
                    Choose Placement To Edit
                  </span>
                  <div className="relative inline-block mt-0.5">
                    <select
                      value={activePlacementId}
                      onChange={(e) => {
                        const newId = e.target.value;
                        if (!selectedPlacementIds.includes(newId)) {
                          setSelectedPlacementIds((prev) => [...prev, newId]);
                        }
                        switchActivePlacement(newId);
                      }}
                      className="appearance-none cursor-pointer pl-3 pr-9 py-1.5 rounded-xl font-mono text-xs font-bold transition-all shadow-sm focus:outline-none bg-[#183630]/5 hover:bg-[#183630]/10 border border-[#B8A98F]/50 text-[#183630] focus:border-[#183630]"
                    >
                      <optgroup label={`Your Selected Placements (${selectedPlacementIds.length})`}>
                        {selectedPlacementIds.map((id) => {
                          const area = availablePrintAreas.find((a) => a.id === id);
                          const hasArtwork = Boolean(placementDesigns[id]?.dataUrl || placementDesigns[id]?.text);
                          const sideLabel = (area?.surface || 'front').toUpperCase();
                          return (
                            <option key={id} value={id}>
                              {area?.name || id} • [{sideLabel}] {hasArtwork ? '✓ Artwork Added' : '○ Ready for Artwork'}
                            </option>
                          );
                        })}
                      </optgroup>
                      {availablePrintAreas.filter((a) => !selectedPlacementIds.includes(a.id)).length > 0 && (
                        <optgroup label="Other Available Placements">
                          {availablePrintAreas
                            .filter((a) => !selectedPlacementIds.includes(a.id))
                            .map((area) => (
                              <option key={area.id} value={area.id}>
                                + {area.name} • [{(area.surface || 'front').toUpperCase()}]
                              </option>
                            ))}
                        </optgroup>
                      )}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#183630]/60" />
                  </div>
                </div>
              </div>

              {/* Quick Switch Pills for Selected Areas */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedPlacementIds.map((id) => {
                  const area = availablePrintAreas.find((a) => a.id === id);
                  const isActive = activePlacementId === id;
                  const hasArtwork = Boolean(placementDesigns[id]?.dataUrl || placementDesigns[id]?.text);
                  const side = area?.surface || 'front';
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => switchActivePlacement(id)}
                      className={`group px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-[#183630] text-[#E5C690] shadow-md border border-[#B8A98F]'
                          : 'bg-[#E5DAC9] hover:bg-[#183630]/10 text-[#183630] border border-[#B8A98F]/50'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#E5C690]' : hasArtwork ? 'bg-[#183630]' : 'bg-[#B8A98F]'}`} />
                      <span>{area?.name?.split('(')[0]?.trim() || id}</span>
                      <span className={`text-[9px] px-1 py-0.2 rounded uppercase font-mono ${isActive ? 'bg-[#E5C690] text-[#183630]' : 'text-[#183630]/60'}`}>
                        {side}
                      </span>
                      {hasArtwork && <Check className="w-3 h-3 text-[#E5C690]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Controls: Viewing Angle Badge & 360 View */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-colors text-[#183630]/75 hover:text-[#183630] hover:bg-[#183630]/10"
              >
                ← Edit Placements
              </button>

              <div className="px-3 py-1 rounded-xl text-xs font-mono font-bold border bg-[#183630]/10 text-[#183630] border-[#B8A98F]/40">
                Viewing: <span className="uppercase font-black">{activePlacementSide}</span>
              </div>

              <button
                type="button"
                onClick={() => setIs360Active(true)}
                className="px-3 py-1.5 rounded-xl bg-[#183630] border border-[#B8A98F] text-[#E5DAC9] hover:text-[#E5C690] text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>360° View</span>
              </button>
            </div>
          </div>

          {/* Studio Workspace: Left Canvas + Right Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Center / Left Interactive Canvas (7 Cols) */}
            <div className="lg:col-span-7 bg-[#183630]/5 border border-[#B8A98F]/40 rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center relative min-h-[580px]">
              <div className="w-full max-w-[580px] aspect-square relative flex items-center justify-center">
                <InteractiveMockupStage
                  product={activeProduct}
                  color={customizerColor}
                  size={selectedSize}
                  activeSide={activePlacementSide}
                  activePlacementId={activePlacementId}
                  designData={currentPlacementDesign}
                  onUpdateDesign={handleUpdateDesignTransform}
                  onSideChange={handleSideSwitch}
                  onOpenFileUpload={() => fileInputRef.current?.click()}
                />
              </div>
            </div>

            {/* Right Tools & Properties Panel (5 Cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* File Upload Trigger */}
              <div className="p-5 rounded-2xl bg-[#E5DAC9] border border-[#B8A98F]/50 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#183630] uppercase font-display flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#183630]" />
                    <span>Upload Artwork Files</span>
                  </h3>
                  <span className="text-[10px] font-mono text-[#183630]/60">PNG, JPG, PDF</span>
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
                  className="cursor-pointer border-2 border-dashed border-[#B8A98F]/60 hover:border-[#183630] bg-[#183630]/5 hover:bg-[#183630]/10 rounded-2xl p-6 text-center space-y-2 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#183630]/10 text-[#183630] flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#183630] block">Click to upload or drag artwork</span>
                  <span className="text-[10px] text-[#183630]/70 font-mono block">Preserves high-res original vector/raster files</span>
                </div>

                {/* Uploaded Files Manager List */}
                {uploadedFilesList.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#B8A98F]/30">
                    <span className="text-[10px] font-mono text-[#183630]/70 uppercase font-bold block">
                      Uploaded Design Files ({uploadedFilesList.length})
                    </span>
                    {uploadedFilesList.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#183630]/5 border border-[#B8A98F]/40 text-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {file.previewUrl ? (
                            <img src={file.previewUrl} alt="" className="w-7 h-7 rounded object-contain bg-[#183630]/10" />
                          ) : (
                            <FileText className="w-6 h-6 text-[#183630] shrink-0" />
                          )}
                          <div className="truncate">
                            <span className="font-bold text-[#183630] truncate block">{file.fileName}</span>
                            <span className="text-[10px] text-[#183630]/60 font-mono">{file.fileSize}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveUploadedFile(file.id)}
                          className="p-1 rounded text-[#183630]/60 hover:text-[#183630]"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dynamic Physical Print Dimensions (Inches) */}
              <div className="p-5 rounded-2xl bg-[#E5DAC9] border border-[#B8A98F]/50 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-[#B8A98F]/30">
                  <div>
                    <h3 className="text-xs font-bold text-[#183630] uppercase font-display flex items-center gap-2">
                      <Printer className="w-4 h-4 text-[#183630]" />
                      <span>Physical Print Dimensions</span>
                    </h3>
                    <p className="text-[10px] font-mono mt-0.5 text-[#183630]/75">
                      {isAspectLocked
                        ? '🔒 Proportions locked. Click button to unlock free measurements.'
                        : '🔓 Free sizing active. Enter custom width & height freely, then lock if desired.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleAspectLock}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider transition-all border shadow-sm self-start sm:self-auto ${
                      isAspectLocked
                        ? 'bg-[#183630] border-[#B8A98F] text-[#E5C690] font-bold'
                        : 'bg-[#E5DAC9] border-[#B8A98F]/60 text-[#183630] hover:bg-[#183630]/10'
                    }`}
                    title={isAspectLocked ? "Click to unlock free custom measurements" : "Click to lock current Width:Height ratio"}
                  >
                    {isAspectLocked ? <Lock className="w-3.5 h-3.5 text-[#E5C690]" /> : <Unlock className="w-3.5 h-3.5 text-[#183630]/60" />}
                    <span>{isAspectLocked ? 'Aspect Ratio Locked' : 'Free Sizing (Click to Lock)'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Width Input with +/- steppers */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono text-[#183630]/75 uppercase font-bold">
                        Width (Inches)
                      </label>
                      <span className="text-[9px] font-mono text-[#183630]/60">max {activeAreaConfig.maxWidthInches || 12}"</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStepDimension('width', -0.5)}
                        className="w-7 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 border bg-[#183630]/10 hover:bg-[#183630]/20 border-[#B8A98F]/50 text-[#183630]"
                        title="Decrease width by 0.5 inches"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={widthInputStr}
                        onFocus={() => setIsEditingWidth(true)}
                        onBlur={handleWidthBlur}
                        onChange={(e) => handleWidthInchesChange(e.target.value)}
                        placeholder="e.g. 8"
                        className="w-full px-2.5 py-1.5 rounded-lg text-center bg-[#183630]/5 border border-[#B8A98F]/50 text-[#183630] focus:border-[#183630] focus:bg-[#E5DAC9] font-mono text-sm focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleStepDimension('width', 0.5)}
                        className="w-7 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 border bg-[#183630]/10 hover:bg-[#183630]/20 border-[#B8A98F]/50 text-[#183630]"
                        title="Increase width by 0.5 inches"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Height Input with +/- steppers */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono text-[#183630]/75 uppercase font-bold">
                        Height (Inches)
                      </label>
                      <span className="text-[9px] font-mono text-[#183630]/60">max {activeAreaConfig.maxHeightInches || 14}"</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStepDimension('height', -0.5)}
                        className="w-7 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 border bg-[#183630]/10 hover:bg-[#183630]/20 border-[#B8A98F]/50 text-[#183630]"
                        title="Decrease height by 0.5 inches"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={heightInputStr}
                        onFocus={() => setIsEditingHeight(true)}
                        onBlur={handleHeightBlur}
                        onChange={(e) => handleHeightInchesChange(e.target.value)}
                        placeholder="e.g. 10"
                        className="w-full px-2.5 py-1.5 rounded-lg text-center bg-[#183630]/5 border border-[#B8A98F]/50 text-[#183630] focus:border-[#183630] focus:bg-[#E5DAC9] font-mono text-sm focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleStepDimension('height', 0.5)}
                        className="w-7 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 border bg-[#183630]/10 hover:bg-[#183630]/20 border-[#B8A98F]/50 text-[#183630]"
                        title="Increase height by 0.5 inches"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Presets Strip */}
                <div className="pt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-[9px] font-mono text-[#183630]/60 uppercase tracking-wider mr-1">Presets:</span>
                  {[
                    { label: '3.5" × 3.5"', w: 3.5, h: 3.5 },
                    { label: '8" × 10"', w: 8, h: 10 },
                    { label: '10" × 12"', w: 10, h: 12 },
                    {
                      label: `Max (${activeAreaConfig.maxWidthInches || 12}" × ${activeAreaConfig.maxHeightInches || 14}")`,
                      w: activeAreaConfig.maxWidthInches || 12,
                      h: activeAreaConfig.maxHeightInches || 14,
                    },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyDimensionPreset(preset.w, preset.h)}
                      className="px-2 py-0.5 rounded text-[10px] font-mono transition-colors border bg-[#183630]/10 hover:bg-[#183630]/20 border-[#B8A98F]/40 text-[#183630]"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {dimensionWarning && (
                  <p className="text-[11px] text-[#183630] font-mono">{dimensionWarning}</p>
                )}
              </div>

              {/* Text Layer Tool Trigger */}
              <div className="p-4 rounded-2xl bg-[#E5DAC9] border border-[#B8A98F]/50 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#183630] flex items-center gap-1.5">
                    <Type className="w-4 h-4 text-[#183630]" />
                    <span>Custom Text Layer</span>
                  </h4>
                  <p className="text-[10px] text-[#183630]/75 font-mono">Add custom brand names, numbers or slogans</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTextModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] hover:text-[#E5C690] border border-[#B8A98F] text-xs font-bold transition-all"
                >
                  {currentPlacementDesign?.text ? 'Edit Text' : '+ Add Text'}
                </button>
              </div>

              {/* Next Step CTA */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="w-full py-4 rounded-2xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] hover:text-[#E5C690] border border-[#B8A98F] font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 font-display transition-all shadow-md cursor-pointer"
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
          <div className="border-b border-[#B8A98F]/30 pb-4 text-center sm:text-left">
            <span className="text-xs font-mono font-bold text-[#183630]/75 uppercase tracking-wider block">
              STEP 6 OF 7
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#183630] font-display uppercase mt-1">
              REALISTIC PRODUCT PREVIEW
            </h1>
            <p className="text-xs text-[#183630]/80 mt-1">
              Verify your design layout before submitting your custom request.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#183630]/5 border border-[#B8A98F]/40 shadow-md flex flex-col items-center justify-center">
            <div className="w-full max-w-md aspect-square relative flex items-center justify-center">
              <InteractiveMockupStage
                product={activeProduct}
                color={customizerColor}
                size={selectedSize}
                activeSide={activePlacementSide}
                activePlacementId={activePlacementId}
                designData={currentPlacementDesign}
                isInteractive={false}
                onSideChange={handleSideSwitch}
              />
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-[#B8A98F]/30">
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-6 py-3 rounded-xl bg-[#E5DAC9] border border-[#B8A98F]/60 text-[#183630] hover:bg-[#183630]/10 text-xs font-bold transition-colors"
            >
              ← Edit Design
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(7)}
              className="px-8 py-3 rounded-xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] hover:text-[#E5C690] border border-[#B8A98F] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
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
          <div className="border-b border-[#B8A98F]/30 pb-4">
            <span className="text-xs font-mono font-bold text-[#183630]/75 uppercase tracking-wider block">
              STEP 7 OF 7
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#183630] font-display uppercase mt-1">
              SUBMIT CUSTOM DESIGN REQUEST
            </h1>
            <p className="text-xs text-[#183630]/80 mt-1">
              No payment or account required. We will review your files and contact you directly.
            </p>
          </div>

          <form onSubmit={handleSubmitDesignRequest} className="p-6 sm:p-8 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F]/50 shadow-xl space-y-5">
            {/* Full Name */}
            <div>
              <label className="text-xs font-mono text-[#183630] uppercase block mb-1.5 font-bold">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={customerForm.name}
                onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#183630]/5 border border-[#B8A98F]/50 text-[#183630] placeholder:text-[#183630]/40 focus:border-[#183630] focus:bg-[#E5DAC9] text-sm focus:outline-none"
              />
              {formErrors.name && <p className="text-[11px] text-[#183630] font-mono mt-1">{formErrors.name}</p>}
            </div>

            {/* WhatsApp / Mobile */}
            <div>
              <label className="text-xs font-mono text-[#183630] uppercase block mb-1.5 font-bold">
                WhatsApp / Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98765 43210"
                value={customerForm.mobile}
                onChange={(e) => setCustomerForm({ ...customerForm, mobile: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#183630]/5 border border-[#B8A98F]/50 text-[#183630] placeholder:text-[#183630]/40 focus:border-[#183630] focus:bg-[#E5DAC9] text-sm font-mono focus:outline-none"
              />
              {formErrors.mobile && <p className="text-[11px] text-[#183630] font-mono mt-1">{formErrors.mobile}</p>}
            </div>

            {/* Gmail / Email */}
            <div>
              <label className="text-xs font-mono text-[#183630] uppercase block mb-1.5 font-bold">
                Gmail / Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. yourname@gmail.com"
                value={customerForm.email}
                onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#183630]/5 border border-[#B8A98F]/50 text-[#183630] placeholder:text-[#183630]/40 focus:border-[#183630] focus:bg-[#E5DAC9] text-sm focus:outline-none"
              />
              {formErrors.email && <p className="text-[11px] text-[#183630] font-mono mt-1">{formErrors.email}</p>}
            </div>

            {/* Company / Brand Name (Optional) */}
            <div>
              <label className="text-xs font-mono text-[#183630]/75 uppercase block mb-1.5 font-bold">
                Company / Brand Name <span className="text-[#183630]/50 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Esports / Studio"
                value={customerForm.company}
                onChange={(e) => setCustomerForm({ ...customerForm, company: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#183630]/5 border border-[#B8A98F]/50 text-[#183630] placeholder:text-[#183630]/40 focus:border-[#183630] focus:bg-[#E5DAC9] text-sm focus:outline-none"
              />
            </div>

            {/* Customer Notes (Optional) */}
            <div>
              <label className="text-xs font-mono text-[#183630]/75 uppercase block mb-1.5 font-bold">
                Design or Production Notes <span className="text-[#183630]/50 font-normal">(Optional)</span>
              </label>
              <textarea
                rows="3"
                placeholder="e.g. Please ensure chest print is centered 4 inches below collar..."
                value={customerForm.customerNotes}
                onChange={(e) => setCustomerForm({ ...customerForm, customerNotes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#183630]/5 border border-[#B8A98F]/50 text-[#183630] placeholder:text-[#183630]/40 focus:border-[#183630] focus:bg-[#E5DAC9] text-sm focus:outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#183630]/20 font-display transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>SUBMITTING DESIGN REQUEST...</span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-[#183630]" />
                    <span>SUBMIT DESIGN REQUEST</span>
                    <ArrowRight className="w-5 h-5 text-[#183630]" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                className="w-full py-2.5 text-center text-xs text-[#183630]/70 hover:text-[#183630] font-mono"
              >
                ← Back to Preview
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Text Layer Configuration */}
      {showTextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#183630]/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#183630] border border-[#B8A98F]/40 shadow-2xl text-[#E5DAC9] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#B8A98F]/30 pb-3">
              <h3 className="text-sm font-bold text-[#E5DAC9] font-display">Add Text to Design</h3>
              <button onClick={() => setShowTextModal(false)} className="text-[#E5DAC9]/70 hover:text-[#E5DAC9]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-mono text-[#E5DAC9]/80 block mb-1 font-bold">Text Content</label>
              <input
                type="text"
                placeholder="e.g. THE PRINTHUB"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#183630] border border-[#B8A98F]/50 text-[#E5DAC9] text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#E5DAC9]/80 block mb-1 font-bold">Font Family</label>
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#183630] border border-[#B8A98F]/50 text-[#E5DAC9] text-sm focus:outline-none"
              >
                <option value="Montserrat Bold">Montserrat Bold</option>
                <option value="Impact">Impact Headline</option>
                <option value="Cinzel Bold">Cinzel Luxury Serif</option>
                <option value="Brush Script MT">Brush Script Cursive</option>
                <option value="Courier New">Courier Monospace</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-[#E5DAC9]/80 block mb-1 font-bold">Text Color</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-10 rounded-xl bg-[#183630] border border-[#B8A98F]/50 cursor-pointer p-1"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTextModal(false)}
                className="px-4 py-2 rounded-xl bg-[#E5DAC9]/10 text-[#E5DAC9] hover:bg-[#E5DAC9]/20 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyText}
                className="px-5 py-2 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-black"
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
