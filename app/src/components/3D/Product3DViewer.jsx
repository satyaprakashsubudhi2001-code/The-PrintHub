import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../context/StoreContext';
import { ProductModel } from './ProductModel';
import { LightingStudio } from './LightingStudio';
import { ThreeDControls } from './ThreeDControls';
import { Product2DFallback } from '../2D/Product2DFallback';

function CameraRig() {
  const { cameraPreset, cameraTrigger, customizerProduct } = useStore();
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 3.0));
  const lookAtPos = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const presets = customizerProduct.cameraPresets || {};
    const defaultPos = customizerProduct.defaultCamera?.position || [0, 0, 3.0];
    const defaultTarget = customizerProduct.defaultCamera?.target || [0, 0, 0];

    const pos = presets[cameraPreset] || defaultPos;
    targetPos.current.set(pos[0], pos[1], pos[2]);
    lookAtPos.current.set(defaultTarget[0], defaultTarget[1], defaultTarget[2]);
  }, [cameraPreset, cameraTrigger, customizerProduct]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.08);
  });

  return null;
}

function Loader3D() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-studio-900/90 z-20 backdrop-blur-md">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-slate-700 border-t-brand-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-lg">
          ✨
        </div>
      </div>
      <p className="mt-3 text-xs font-semibold text-slate-200 tracking-wide">
        Loading 3D Studio...
      </p>
    </div>
  );
}

export function Product3DViewer({ isFullscreen, onToggleFullscreen }) {
  const {
    isAutoRotate,
    customizerProduct,
    is2DFallback,
    setIs2DFallback,
    setSnapshotDataUrl,
    setIsScreenshotOpen,
  } = useStore();

  const [hasWebGLError, setHasWebGLError] = useState(false);
  const canvasContainerRef = useRef(null);

  useEffect(() => {
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) setHasWebGLError(true);
    } catch (e) {
      setHasWebGLError(true);
    }
  }, []);

  const handleTakeSnapshot = () => {
    if (!canvasContainerRef.current) return;
    const canvasElement = canvasContainerRef.current.querySelector('canvas');
    if (canvasElement) {
      const dataUrl = canvasElement.toDataURL('image/png', 1.0);
      setSnapshotDataUrl(dataUrl);
      setIsScreenshotOpen(true);
    }
  };

  if (is2DFallback || hasWebGLError) {
    return (
      <Product2DFallback
        onSwitchTo3D={() => {
          setHasWebGLError(false);
          setIs2DFallback(false);
        }}
      />
    );
  }

  return (
    <div
      ref={canvasContainerRef}
      className="relative w-full h-full bg-studio-900 overflow-hidden select-none flex items-center justify-center"
    >
      <Suspense fallback={<Loader3D />}>
        <Canvas
          shadows
          gl={{
            antialias: true,
            preserveDrawingBuffer: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
            outputColorSpace: THREE.SRGBColorSpace,
            powerPreference: 'high-performance',
          }}
          camera={{
            position: customizerProduct.defaultCamera?.position || [0, 0, 3.0],
            fov: customizerProduct.defaultCamera?.fov || 45,
            near: 0.1,
            far: 100,
          }}
          className="w-full h-full cursor-grab active:cursor-grabbing outline-none"
        >
          <CameraRig />
          <LightingStudio />
          <ProductModel />
          <OrbitControls
            enableDamping
            dampingFactor={0.06}
            rotateSpeed={0.8}
            zoomSpeed={0.8}
            panSpeed={0.7}
            minDistance={1.0}
            maxDistance={5.5}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.75}
            autoRotate={isAutoRotate}
            autoRotateSpeed={1.8}
            target={new THREE.Vector3(...(customizerProduct.defaultCamera?.target || [0, 0, 0]))}
          />
        </Canvas>
      </Suspense>

      <ThreeDControls
        onTakeSnapshot={handleTakeSnapshot}
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
      />
    </div>
  );
}
