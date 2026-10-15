import React, { useEffect, useMemo, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
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

function GLBCustomizerMesh({ url, solidMaterial, dynamicMaterial, meshNames = [] }) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    const lowerMeshNames = (meshNames || []).filter(Boolean).map((m) => m.toLowerCase());
    let dynamicAssigned = false;

    clonedScene.traverse((child) => {
      if (child.isMesh) {
        const name = (child.name || '').toLowerCase();
        const matchesAdminConfig = lowerMeshNames.some((m) => name.includes(m) || m.includes(name));
        const matchesDefaultPrintable =
          name.includes('torso') ||
          name.includes('body') ||
          name.includes('surface') ||
          name.includes('front') ||
          name.includes('wrap') ||
          name.includes('pad') ||
          name.includes('print') ||
          name.includes('mug') ||
          name.includes('cylinder') ||
          name === '';

        if (matchesAdminConfig || matchesDefaultPrintable) {
          child.material = dynamicMaterial;
          dynamicAssigned = true;
        } else {
          child.material = solidMaterial;
        }
      }
    });

    if (!dynamicAssigned) {
      clonedScene.traverse((child) => {
        if (child.isMesh && !dynamicAssigned) {
          child.material = dynamicMaterial;
          dynamicAssigned = true;
        }
      });
    }
  }, [clonedScene, solidMaterial, dynamicMaterial, meshNames]);

  return <primitive object={clonedScene} />;
}

export function ProductModel() {
  const {
    customizerProduct,
    customizerColor,
    designs,
    texts,
    cliparts,
    placementDesigns,
    selectedPrintArea,
    showPrintBoundary,
    showWireframe,
  } = useStore();

  const canvasRef = useRef(null);
  const textureRef = useRef(null);

  // Derive effective designs from placementDesigns if designs array is empty
  const effectiveDesigns = useMemo(() => {
    if (designs && designs.length > 0) return designs;
    if (!placementDesigns || Object.keys(placementDesigns).length === 0) return [];

    const result = [];
    Object.entries(placementDesigns).forEach(([areaId, item]) => {
      if (!item || !item.dataUrl) return;
      const maxW = item.maxAreaW || 12;
      const maxH = item.maxAreaH || 14;
      const wInches = item.widthInches || (maxW * 0.8);
      const xNorm = item.xInches ? (item.xInches / (maxW / 2)) : 0;
      const yNorm = item.yInches ? (item.yInches / (maxH / 2)) : 0;
      const scale = wInches / (maxW * 0.7);

      result.push({
        id: `design_${areaId}`,
        name: item.fileName || 'Custom Artwork',
        printArea: areaId,
        dataUrl: item.dataUrl,
        fileUrl: item.dataUrl,
        x: Math.max(-1, Math.min(1, xNorm)),
        y: Math.max(-1, Math.min(1, yNorm)),
        scale: Math.max(0.2, Math.min(2.5, scale)),
        rotation: item.rotation || 0,
        visible: true,
      });
    });
    return result;
  }, [designs, placementDesigns]);

  // Derive effective texts from placementDesigns if texts array is empty
  const effectiveTexts = useMemo(() => {
    if (texts && texts.length > 0) return texts;
    if (!placementDesigns || Object.keys(placementDesigns).length === 0) return [];

    const result = [];
    Object.entries(placementDesigns).forEach(([areaId, item]) => {
      if (!item || !item.text) return;
      result.push({
        id: `text_${areaId}`,
        printArea: areaId,
        text: item.text,
        fontFamily: item.font || 'Montserrat Bold, sans-serif',
        fontSize: 36,
        fillColor: item.textColor || '#ffffff',
        x: 0,
        y: 0.5,
        scale: 1.0,
        rotation: 0,
        visible: true,
      });
    });
    return result;
  }, [texts, placementDesigns]);

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
      customizerProduct?.id === 'cup' ||
      customizerProduct?.productType === 'Mug' ||
      customizerProduct?.id === 'photo-frame' ||
      customizerProduct?.id === 'badge';
    const isMesh = customizerProduct?.id === 'jersey';
    const isFleece = customizerProduct?.id === 'hoodie';

    const fabric = isHard ? 'ceramic' : isMesh ? 'mesh' : isFleece ? 'fleece' : 'cotton';
    return createFabricBumpTexture(fabric);
  }, [customizerProduct?.id, customizerProduct?.productType]);

  // Re-composite Canvas Texture whenever designs/texts/color/area changes with debounce
  useEffect(() => {
    let isMounted = true;
    let timer = null;

    const updateTexture = async () => {
      if (!canvasRef.current || !textureRef.current || !isMounted) return;

      try {
        await renderCustomizerCanvas({
          canvas: canvasRef.current,
          printAreas: customizerProduct?.printAreas || [],
          designs: effectiveDesigns,
          texts: effectiveTexts,
          cliparts: cliparts || [],
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

    timer = setTimeout(updateTexture, 60);

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [
    customizerProduct,
    effectiveDesigns,
    effectiveTexts,
    cliparts,
    selectedPrintArea,
    showPrintBoundary,
  ]);

  // Base PBR Solid Material
  const baseSolidMaterial = useMemo(() => {
    const isGlossy =
      customizerProduct?.id === 'cup' ||
      customizerProduct?.productType === 'Mug' ||
      customizerProduct?.id === 'photo-frame' ||
      customizerProduct?.id === 'badge';
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(customizerColor),
      roughness: isGlossy ? 0.12 : (customizerProduct?.materialProps?.roughness || 0.85),
      metalness: isGlossy ? 0.08 : (customizerProduct?.materialProps?.metalness || 0.02),
      bumpMap: isGlossy ? null : bumpTexture,
      bumpScale: isGlossy ? 0 : 0.015,
      wireframe: showWireframe,
      side: THREE.DoubleSide,
    });
  }, [customizerColor, customizerProduct, bumpTexture, showWireframe]);

  // Dynamic UV Overlay Material for Printable Surface
  const dynamicSurfaceMaterial = useMemo(() => {
    const isGlossy =
      customizerProduct?.id === 'cup' ||
      customizerProduct?.productType === 'Mug' ||
      customizerProduct?.id === 'photo-frame' ||
      customizerProduct?.id === 'badge';
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(customizerColor),
      map: textureRef.current,
      roughness: isGlossy ? 0.12 : (customizerProduct?.materialProps?.roughness || 0.85),
      metalness: isGlossy ? 0.08 : (customizerProduct?.materialProps?.metalness || 0.02),
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

  // Render procedural fallback geometry based on ID or product type
  const renderProceduralGeometry = () => {
    const id = (customizerProduct?.id || '').toLowerCase();
    const type = (customizerProduct?.productType || '').toLowerCase();

    if (type.includes('mug') || id === 'cup') {
      return (
        <CupGeometry
          material={baseSolidMaterial}
          dynamicMaterial={dynamicSurfaceMaterial}
        />
      );
    }
    if (type.includes('mouse') || type.includes('pad') || id === 'mouse-pad') {
      return (
        <MousePadGeometry
          material={baseSolidMaterial}
          dynamicMaterial={dynamicSurfaceMaterial}
        />
      );
    }
    if (type === 'shirt' || id === 'polo-tshirt' || id === 'shirt') {
      return (
        <PoloTShirtGeometry
          material={baseSolidMaterial}
          dynamicMaterial={dynamicSurfaceMaterial}
        />
      );
    }
    if (id === 'oversized-tshirt') {
      return (
        <OversizedTShirtGeometry
          material={baseSolidMaterial}
          dynamicMaterial={dynamicSurfaceMaterial}
        />
      );
    }
    if (id === 'hoodie') {
      return (
        <HoodieGeometry
          material={baseSolidMaterial}
          dynamicMaterial={dynamicSurfaceMaterial}
        />
      );
    }
    if (id === 'jersey') {
      return (
        <JerseyGeometry
          material={baseSolidMaterial}
          dynamicMaterial={dynamicSurfaceMaterial}
        />
      );
    }
    if (id === 'apron') {
      return (
        <ApronGeometry
          material={baseSolidMaterial}
          dynamicMaterial={dynamicSurfaceMaterial}
        />
      );
    }
    if (id === 'cap') {
      return (
        <CapGeometry
          material={baseSolidMaterial}
          dynamicMaterial={dynamicSurfaceMaterial}
        />
      );
    }
    if (id === 'badge') {
      return (
        <BadgeGeometry
          material={baseSolidMaterial}
          dynamicMaterial={dynamicSurfaceMaterial}
        />
      );
    }
    if (id === 'photo-frame') {
      return (
        <PhotoFrameGeometry
          material={baseSolidMaterial}
          dynamicMaterial={dynamicSurfaceMaterial}
        />
      );
    }

    return (
      <RoundNeckTShirtGeometry
        material={baseSolidMaterial}
        dynamicMaterial={dynamicSurfaceMaterial}
      />
    );
  };

  const renderGeometry = () => {
    if (
      customizerProduct?.modelUrl &&
      (customizerProduct.modelUrl.endsWith('.glb') || customizerProduct.modelUrl.startsWith('data:'))
    ) {
      return (
        <Suspense fallback={renderProceduralGeometry()}>
          <GLBCustomizerMesh
            url={customizerProduct.modelUrl}
            solidMaterial={baseSolidMaterial}
            dynamicMaterial={dynamicSurfaceMaterial}
            meshNames={(customizerProduct.printAreas || []).map((pa) => pa.meshName)}
          />
        </Suspense>
      );
    }
    return renderProceduralGeometry();
  };

  return <group>{renderGeometry()}</group>;
}
