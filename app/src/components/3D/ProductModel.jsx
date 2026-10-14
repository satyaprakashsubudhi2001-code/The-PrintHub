import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../../context/StoreContext';
import {
  renderCustomizerCanvas,
  createFabricBumpTexture,
} from './TextureCompositor';
import {
  RoundNeckTShirtGeometry,
  OversizedTShirtGeometry,
  PoloTShirtGeometry,
  HoodieGeometry,
  JerseyGeometry,
  ApronGeometry,
  CapGeometry,
  CupGeometry,
  BadgeGeometry,
  MousePadGeometry,
  PhotoFrameGeometry,
} from './ProceduralGarmentMeshes';

export function ProductModel() {
  const {
    customizerProduct,
    customizerColor,
    designs,
    texts,
    cliparts,
    selectedPrintArea,
    showPrintBoundary,
    showWireframe,
  } = useStore();

  const canvasRef = useRef(null);
  const textureRef = useRef(null);

  // Initialize canvas and Three.js CanvasTexture
  if (!canvasRef.current && typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    canvasRef.current = canvas;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    textureRef.current = texture;
  }

  // Generate Bump Texture based on product material
  const bumpTexture = useMemo(() => {
    const isHard =
      customizerProduct.id === 'cup' ||
      customizerProduct.id === 'photo-frame' ||
      customizerProduct.id === 'badge';
    const isMesh = customizerProduct.id === 'jersey';
    const isFleece = customizerProduct.id === 'hoodie';

    const fabric = isHard ? 'ceramic' : isMesh ? 'mesh' : isFleece ? 'fleece' : 'cotton';
    return createFabricBumpTexture(fabric);
  }, [customizerProduct.id]);

  // Re-composite Canvas Texture whenever designs/texts/color/area changes with debounce
  useEffect(() => {
    let isMounted = true;
    let timer = null;

    const updateTexture = async () => {
      if (!canvasRef.current || !textureRef.current || !isMounted) return;

      try {
        await renderCustomizerCanvas({
          canvas: canvasRef.current,
          printAreas: customizerProduct.printAreas || [],
          designs,
          texts,
          cliparts,
          showGuide: showPrintBoundary,
          activePrintAreaId: selectedPrintArea,
          width: 1024,
          height: 1024,
        });

        if (isMounted && textureRef.current) {
          textureRef.current.needsUpdate = true;
        }
      } catch (e) {
        console.warn('Canvas texture render skipped:', e);
      }
    };

    // Debounce canvas redraws by 60ms during layer adjustments
    timer = setTimeout(updateTexture, 60);

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [
    customizerProduct,
    designs,
    texts,
    cliparts,
    selectedPrintArea,
    showPrintBoundary,
  ]);

  // Base PBR Solid Material
  const baseSolidMaterial = useMemo(() => {
    const isGlossy =
      customizerProduct.id === 'cup' ||
      customizerProduct.id === 'photo-frame' ||
      customizerProduct.id === 'badge';
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(customizerColor),
      roughness: isGlossy ? 0.12 : (customizerProduct.materialProps?.roughness || 0.85),
      metalness: isGlossy ? 0.08 : (customizerProduct.materialProps?.metalness || 0.02),
      bumpMap: isGlossy ? null : bumpTexture,
      bumpScale: isGlossy ? 0 : 0.015,
      wireframe: showWireframe,
      side: THREE.DoubleSide,
    });
  }, [customizerColor, customizerProduct, bumpTexture, showWireframe]);

  // Dynamic UV Overlay Material for Printable Surface
  const dynamicSurfaceMaterial = useMemo(() => {
    const isGlossy =
      customizerProduct.id === 'cup' ||
      customizerProduct.id === 'photo-frame' ||
      customizerProduct.id === 'badge';
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(customizerColor),
      map: textureRef.current,
      roughness: isGlossy ? 0.12 : (customizerProduct.materialProps?.roughness || 0.85),
      metalness: isGlossy ? 0.08 : (customizerProduct.materialProps?.metalness || 0.02),
      bumpMap: isGlossy ? null : bumpTexture,
      bumpScale: isGlossy ? 0 : 0.015,
      wireframe: showWireframe,
      side: THREE.DoubleSide,
    });

    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
    return mat;
  }, [customizerColor, customizerProduct, bumpTexture, showWireframe]);

  // Render Product Geometry based on ID
  const renderGeometry = () => {
    switch (customizerProduct.id) {
      case 'round-neck-tshirt':
        return (
          <RoundNeckTShirtGeometry
            material={baseSolidMaterial}
            dynamicMaterial={dynamicSurfaceMaterial}
          />
        );
      case 'oversized-tshirt':
        return (
          <OversizedTShirtGeometry
            material={baseSolidMaterial}
            dynamicMaterial={dynamicSurfaceMaterial}
          />
        );
      case 'polo-tshirt':
        return (
          <PoloTShirtGeometry
            material={baseSolidMaterial}
            dynamicMaterial={dynamicSurfaceMaterial}
          />
        );
      case 'hoodie':
        return (
          <HoodieGeometry
            material={baseSolidMaterial}
            dynamicMaterial={dynamicSurfaceMaterial}
          />
        );
      case 'jersey':
        return (
          <JerseyGeometry
            material={baseSolidMaterial}
            dynamicMaterial={dynamicSurfaceMaterial}
          />
        );
      case 'apron':
        return (
          <ApronGeometry
            material={baseSolidMaterial}
            dynamicMaterial={dynamicSurfaceMaterial}
          />
        );
      case 'cap':
        return (
          <CapGeometry
            material={baseSolidMaterial}
            dynamicMaterial={dynamicSurfaceMaterial}
          />
        );
      case 'cup':
        return (
          <CupGeometry
            material={baseSolidMaterial}
            dynamicMaterial={dynamicSurfaceMaterial}
          />
        );
      case 'badge':
        return (
          <BadgeGeometry
            material={baseSolidMaterial}
            dynamicMaterial={dynamicSurfaceMaterial}
          />
        );
      case 'mouse-pad':
        return (
          <MousePadGeometry
            material={baseSolidMaterial}
            dynamicMaterial={dynamicSurfaceMaterial}
          />
        );
      case 'photo-frame':
        return (
          <PhotoFrameGeometry
            material={baseSolidMaterial}
            dynamicMaterial={dynamicSurfaceMaterial}
          />
        );
      default:
        return (
          <RoundNeckTShirtGeometry
            material={baseSolidMaterial}
            dynamicMaterial={dynamicSurfaceMaterial}
          />
        );
    }
  };

  return <group>{renderGeometry()}</group>;
}
