import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { PRODUCTS, COLOR_PALETTE, PRINTING_METHODS, QUANTITY_TIERS } from '../constants/products';
import { SAMPLE_ARTWORKS, STUDIO_ENVIRONMENTS } from '../constants/presets';

const CustomizerContext = createContext();

export function CustomizerProvider({ children }) {
  // Product state
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [productColor, setProductColor] = useState(PRODUCTS[0].defaultColor);
  const [selectedPrintArea, setSelectedPrintArea] = useState(PRODUCTS[0].defaultPrintArea);
  
  // Customization Layers
  const [designs, setDesigns] = useState([
    {
      id: 'default_crest',
      name: 'The PrintHub Crest',
      dataUrl: SAMPLE_ARTWORKS[0].dataUrl,
      fileUrl: null,
      printArea: 'front_center',
      x: 0,
      y: 0,
      scale: 1.0,
      rotation: 0,
      opacity: 1,
      flipX: false,
      flipY: false,
      visible: true,
    }
  ]);

  const [texts, setTexts] = useState([
    {
      id: 'default_text',
      text: 'LIMITED EDITION',
      fontFamily: 'Bebas Neue, sans-serif',
      fontSize: 42,
      fillColor: '#ffffff',
      strokeColor: '#f97316',
      strokeWidth: 0,
      bold: true,
      italic: false,
      letterSpacing: 2,
      textAlign: 'center',
      curved: 0,
      shadow: true,
      shadowColor: 'rgba(0,0,0,0.8)',
      printArea: 'front_center',
      x: 0,
      y: 0.58,
      scale: 0.9,
      rotation: 0,
      opacity: 1,
      visible: true,
    }
  ]);

  const [cliparts, setCliparts] = useState([]);
  const [activeLayer, setActiveLayer] = useState({ id: 'default_crest', type: 'design' });

  // 3D Studio Environment & Camera
  const [cameraPreset, setCameraPreset] = useState('front');
  const [cameraTrigger, setCameraTrigger] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [showWireframe, setShowWireframe] = useState(false);
  const [showPrintBoundary, setShowPrintBoundary] = useState(true);
  const [activeEnvironment, setActiveEnvironment] = useState(STUDIO_ENVIRONMENTS[0]);

  // Commercial / Order options
  const [selectedSize, setSelectedSize] = useState(PRODUCTS[0].defaultSize);
  const [quantity, setQuantity] = useState(1);
  const [printingMethod, setPrintingMethod] = useState(PRINTING_METHODS[0].id);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false);
  const [snapshotDataUrl, setSnapshotDataUrl] = useState(null);
  const [is2DFallback, setIs2DFallback] = useState(false);

  // Cart & Order History
  const [cartItems, setCartItems] = useState([
    {
      id: 'sample_cart_item_1',
      productId: 'tshirt',
      productName: 'Classic T-Shirt',
      color: '#121214',
      colorName: 'Obsidian Black',
      size: 'L',
      quantity: 2,
      printingMethod: 'dtf',
      printingMethodName: 'HD Direct-to-Film (DTF)',
      unitPrice: 619,
      totalPrice: 1238,
      printAreasUsed: ['front_center'],
      previewImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23121214"/><text x="100" y="105" fill="%23f97316" font-size="48" font-family="Arial" text-anchor="middle">👕</text></svg>',
      config: {
        productId: 'tshirt',
        color: '#121214',
        designsCount: 1,
        textsCount: 1,
      },
      createdAt: new Date().toISOString()
    }
  ]);

  // Undo / Redo history stacks
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Switch Product
  const selectProduct = (product) => {
    setSelectedProduct(product);
    setProductColor(product.defaultColor);
    setSelectedPrintArea(product.defaultPrintArea);
    setSelectedSize(product.defaultSize);

    // Adjust default layers to match the new product's default print area
    setDesigns((prev) =>
      prev.map((d) => ({
        ...d,
        printArea: product.defaultPrintArea,
      }))
    );
    setTexts((prev) =>
      prev.map((t) => ({
        ...t,
        printArea: product.defaultPrintArea,
      }))
    );
    setCliparts((prev) =>
      prev.map((c) => ({
        ...c,
        printArea: product.defaultPrintArea,
      }))
    );

    setCameraPreset('front');
    setCameraTrigger((c) => c + 1);
  };

  // Change Camera Preset
  const setCameraView = (viewName) => {
    setCameraPreset(viewName);
    setCameraTrigger((c) => c + 1);
  };

  // Design Management
  const addDesign = (fileOrUrl, name = 'Custom Graphic') => {
    const newDesign = {
      id: `design_${Date.now()}`,
      name,
      fileUrl: typeof fileOrUrl === 'string' ? fileOrUrl : null,
      dataUrl: typeof fileOrUrl === 'string' ? fileOrUrl : null,
      printArea: selectedPrintArea,
      x: 0,
      y: 0,
      scale: 1.0,
      rotation: 0,
      opacity: 1,
      flipX: false,
      flipY: false,
      visible: true,
    };
    setDesigns((prev) => [...prev, newDesign]);
    setActiveLayer({ id: newDesign.id, type: 'design' });
  };

  const updateDesign = (id, updates) => {
    setDesigns((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  const removeDesign = (id) => {
    setDesigns((prev) => prev.filter((d) => d.id !== id));
    if (activeLayer.id === id) {
      setActiveLayer({ id: null, type: null });
    }
  };

  const duplicateDesign = (id) => {
    const target = designs.find((d) => d.id === id);
    if (!target) return;
    const duplicated = {
      ...target,
      id: `design_${Date.now()}`,
      name: `${target.name} (Copy)`,
      x: (target.x || 0) + 0.08,
      y: (target.y || 0) + 0.08,
    };
    setDesigns((prev) => [...prev, duplicated]);
    setActiveLayer({ id: duplicated.id, type: 'design' });
  };

  // Text Management
  const addText = (textValue = 'YOUR TEXT') => {
    const newText = {
      id: `text_${Date.now()}`,
      text: textValue,
      fontFamily: 'Outfit, sans-serif',
      fontSize: 38,
      fillColor: '#f97316',
      strokeColor: '#000000',
      strokeWidth: 0,
      bold: true,
      italic: false,
      letterSpacing: 2,
      textAlign: 'center',
      curved: 0,
      shadow: false,
      shadowColor: 'rgba(0,0,0,0.8)',
      printArea: selectedPrintArea,
      x: 0,
      y: 0,
      scale: 1.0,
      rotation: 0,
      opacity: 1,
      visible: true,
    };
    setTexts((prev) => [...prev, newText]);
    setActiveLayer({ id: newText.id, type: 'text' });
  };

  const updateText = (id, updates) => {
    setTexts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const removeText = (id) => {
    setTexts((prev) => prev.filter((t) => t.id !== id));
    if (activeLayer.id === id) {
      setActiveLayer({ id: null, type: null });
    }
  };

  const duplicateText = (id) => {
    const target = texts.find((t) => t.id === id);
    if (!target) return;
    const duplicated = {
      ...target,
      id: `text_${Date.now()}`,
      x: (target.x || 0) + 0.08,
      y: (target.y || 0) + 0.08,
    };
    setTexts((prev) => [...prev, duplicated]);
    setActiveLayer({ id: duplicated.id, type: 'text' });
  };

  // Clipart Management
  const addClipart = (clipartItem) => {
    const newClipart = {
      id: `clipart_${Date.now()}`,
      name: clipartItem.name,
      dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(clipartItem.svg)}`,
      printArea: selectedPrintArea,
      x: 0,
      y: 0,
      scale: 1.0,
      rotation: 0,
      opacity: 1,
      flipX: false,
      flipY: false,
      visible: true,
    };
    setCliparts((prev) => [...prev, newClipart]);
    setActiveLayer({ id: newClipart.id, type: 'clipart' });
  };

  const updateClipart = (id, updates) => {
    setCliparts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const removeClipart = (id) => {
    setCliparts((prev) => prev.filter((c) => c.id !== id));
    if (activeLayer.id === id) {
      setActiveLayer({ id: null, type: null });
    }
  };

  // Quick Action Utilities for Active Layer
  const centerActiveLayer = () => {
    if (!activeLayer.id) return;
    if (activeLayer.type === 'design') {
      updateDesign(activeLayer.id, { x: 0, y: 0 });
    } else if (activeLayer.type === 'text') {
      updateText(activeLayer.id, { x: 0, y: 0 });
    } else if (activeLayer.type === 'clipart') {
      updateClipart(activeLayer.id, { x: 0, y: 0 });
    }
  };

  const fitActiveLayer = () => {
    if (!activeLayer.id) return;
    if (activeLayer.type === 'design') {
      updateDesign(activeLayer.id, { scale: 1.35, x: 0, y: 0, rotation: 0 });
    } else if (activeLayer.type === 'text') {
      updateText(activeLayer.id, { scale: 1.25, x: 0, y: 0, rotation: 0 });
    } else if (activeLayer.type === 'clipart') {
      updateClipart(activeLayer.id, { scale: 1.4, x: 0, y: 0, rotation: 0 });
    }
  };

  const resetActiveLayer = () => {
    if (!activeLayer.id) return;
    if (activeLayer.type === 'design') {
      updateDesign(activeLayer.id, { scale: 1.0, x: 0, y: 0, rotation: 0, opacity: 1, flipX: false, flipY: false });
    } else if (activeLayer.type === 'text') {
      updateText(activeLayer.id, { scale: 1.0, x: 0, y: 0, rotation: 0, opacity: 1 });
    } else if (activeLayer.type === 'clipart') {
      updateClipart(activeLayer.id, { scale: 1.0, x: 0, y: 0, rotation: 0, opacity: 1, flipX: false, flipY: false });
    }
  };

  const resetCustomization = () => {
    setDesigns([]);
    setTexts([]);
    setCliparts([]);
    setActiveLayer({ id: null, type: null });
  };

  // Pricing Calculation Engine
  const calculatePricing = useCallback(() => {
    const baseGarmentPrice = selectedProduct.basePrice || 499;

    // Find unique active print areas being used
    const usedPrintAreaIds = new Set([
      ...designs.filter((d) => d.visible !== false).map((d) => d.printArea),
      ...texts.filter((t) => t.visible !== false).map((t) => t.printArea),
      ...cliparts.filter((c) => c.visible !== false).map((c) => c.printArea),
    ]);

    let printAreasCost = 0;
    usedPrintAreaIds.forEach((areaId) => {
      const areaDef = selectedProduct.printAreas.find((a) => a.id === areaId);
      if (areaDef) {
        printAreasCost += areaDef.fee || 100;
      }
    });

    const method = PRINTING_METHODS.find((m) => m.id === printingMethod) || PRINTING_METHODS[0];
    const printMethodFee = (method.feePerArea || 0) * Math.max(1, usedPrintAreaIds.size);

    const singleUnitPrice = baseGarmentPrice + printAreasCost + printMethodFee;

    // Determine quantity tier discount
    const tier = QUANTITY_TIERS.find((t) => quantity >= t.min && quantity <= t.max) || QUANTITY_TIERS[0];
    const discountPercent = tier.discountPercent;
    const discountedUnitPrice = Math.round(singleUnitPrice * (1 - discountPercent / 100));
    const totalPrice = discountedUnitPrice * quantity;
    const originalTotalPrice = singleUnitPrice * quantity;
    const totalSavings = originalTotalPrice - totalPrice;

    return {
      baseGarmentPrice,
      printAreasCost,
      printMethodFee,
      singleUnitPrice,
      discountPercent,
      unitPrice: discountedUnitPrice,
      totalPrice,
      totalSavings,
      usedAreasCount: usedPrintAreaIds.size,
      tierLabel: tier.label,
    };
  }, [selectedProduct, designs, texts, cliparts, printingMethod, quantity]);

  // Add to Cart
  const addToCart = (previewImageDataUrl) => {
    const pricing = calculatePricing();
    const colorObj = COLOR_PALETTE.find((c) => c.hex.toLowerCase() === productColor.toLowerCase()) || { name: 'Custom Color', hex: productColor };
    const methodObj = PRINTING_METHODS.find((m) => m.id === printingMethod) || PRINTING_METHODS[0];

    const usedPrintAreas = Array.from(
      new Set([
        ...designs.filter((d) => d.visible !== false).map((d) => d.printArea),
        ...texts.filter((t) => t.visible !== false).map((t) => t.printArea),
        ...cliparts.filter((c) => c.visible !== false).map((c) => c.printArea),
      ])
    );

    const newCartItem = {
      id: `cart_${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      color: productColor,
      colorName: colorObj.name,
      size: selectedSize,
      quantity,
      printingMethod,
      printingMethodName: methodObj.name,
      unitPrice: pricing.unitPrice,
      totalPrice: pricing.totalPrice,
      printAreasUsed: usedPrintAreas,
      previewImage: previewImageDataUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23121214"/><text x="100" y="105" fill="%23f97316" font-size="48" font-family="Arial" text-anchor="middle">👕</text></svg>',
      config: {
        productId: selectedProduct.id,
        model: selectedProduct.modelPath,
        color: productColor,
        designs: [...designs],
        texts: [...texts],
        cliparts: [...cliparts],
        size: selectedSize,
        quantity,
        printingMethod,
      },
      createdAt: new Date().toISOString(),
    };

    setCartItems((prev) => [newCartItem, ...prev]);
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: newQty,
            totalPrice: item.unitPrice * newQty,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Load a saved configuration (e.g. from Cart or Order)
  const loadConfiguration = (config) => {
    const prod = PRODUCTS.find((p) => p.id === config.productId) || PRODUCTS[0];
    setSelectedProduct(prod);
    setProductColor(config.color || prod.defaultColor);
    setDesigns(config.designs || []);
    setTexts(config.texts || []);
    setCliparts(config.cliparts || []);
    if (config.size) setSelectedSize(config.size);
    if (config.printingMethod) setPrintingMethod(config.printingMethod);
    if (config.quantity) setQuantity(config.quantity);
  };

  return (
    <CustomizerContext.Provider
      value={{
        selectedProduct,
        setSelectedProduct,
        selectProduct,
        productColor,
        setProductColor,
        selectedPrintArea,
        setSelectedPrintArea,
        designs,
        setDesigns,
        addDesign,
        updateDesign,
        removeDesign,
        duplicateDesign,
        texts,
        setTexts,
        addText,
        updateText,
        removeText,
        duplicateText,
        cliparts,
        setCliparts,
        addClipart,
        updateClipart,
        removeClipart,
        activeLayer,
        setActiveLayer,
        centerActiveLayer,
        fitActiveLayer,
        resetActiveLayer,
        resetCustomization,
        cameraPreset,
        setCameraView,
        cameraTrigger,
        isAutoRotate,
        setIsAutoRotate,
        showWireframe,
        setShowWireframe,
        showPrintBoundary,
        setShowPrintBoundary,
        activeEnvironment,
        setActiveEnvironment,
        selectedSize,
        setSelectedSize,
        quantity,
        setQuantity,
        printingMethod,
        setPrintingMethod,
        calculatePricing,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isAdminOpen,
        setIsAdminOpen,
        isScreenshotOpen,
        setIsScreenshotOpen,
        snapshotDataUrl,
        setSnapshotDataUrl,
        is2DFallback,
        setIs2DFallback,
        loadConfiguration,
      }}
    >
      {children}
    </CustomizerContext.Provider>
  );
}

export function useCustomizer() {
  const context = useContext(CustomizerContext);
  if (!context) {
    throw new Error('useCustomizer must be used within a CustomizerProvider');
  }
  return context;
}
