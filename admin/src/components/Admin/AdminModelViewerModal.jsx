import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { X, RotateCcw, Box, Check, Sparkles, Layers, Sliders, AlertCircle } from 'lucide-react';

function GLBModelLoader({ url, color, showWireframe }) {
  const { scene } = useGLTF(url);
  const clonedScene = React.useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.material.color = new THREE.Color(color);
        child.material.wireframe = showWireframe;
        child.material.needsUpdate = true;
      }
    });
  }, [clonedScene, color, showWireframe]);

  return <primitive object={clonedScene} />;
}

function ProceduralFallbackMesh({ productType, color, showWireframe }) {
  const meshRef = useRef();
  const type = (productType || '').toLowerCase();

  return (
    <mesh ref={meshRef}>
      {type.includes('mug') || type.includes('cup') ? (
        <cylinderGeometry args={[0.5, 0.48, 1.1, 32]} />
      ) : type.includes('mouse') || type.includes('pad') ? (
        <boxGeometry args={[1.4, 0.04, 1.0]} />
      ) : (
        <cylinderGeometry args={[0.48, 0.44, 1.25, 32]} />
      )}
      <meshStandardMaterial
        color={color}
        wireframe={showWireframe}
        roughness={0.7}
        metalness={0.05}
      />
    </mesh>
  );
}

function StudioScene({ modelUrl, productType, color, showWireframe, isAutoRotate }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (isAutoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      <directionalLight position={[-5, 4, -5]} intensity={0.8} />
      <directionalLight position={[0, -5, 2]} intensity={0.4} />

      {modelUrl && (modelUrl.endsWith('.glb') || modelUrl.startsWith('data:')) ? (
        <Suspense fallback={<ProceduralFallbackMesh productType={productType} color={color} showWireframe={showWireframe} />}>
          <GLBModelLoader url={modelUrl} color={color} showWireframe={showWireframe} />
        </Suspense>
      ) : (
        <ProceduralFallbackMesh productType={productType} color={color} showWireframe={showWireframe} />
      )}
    </group>
  );
}

export function AdminModelViewerModal({ model, isOpen, onClose }) {
  const [selectedColor, setSelectedColor] = useState('#18181b');
  const [showWireframe, setShowWireframe] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const controlsRef = useRef();

  // Parse colors array safely
  const parsedColors = React.useMemo(() => {
    if (!model?.colors) return ['#18181b', '#ffffff', '#dc2626', '#2563eb'];
    try {
      if (Array.isArray(model.colors)) return model.colors;
      return JSON.parse(model.colors);
    } catch (e) {
      return ['#18181b', '#ffffff'];
    }
  }, [model]);

  useEffect(() => {
    if (parsedColors.length > 0) {
      setSelectedColor(parsedColors[0]);
    }
  }, [model, parsedColors]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  if (!isOpen || !model) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in select-none font-mono">
      <div className="relative w-full max-w-4xl h-[85vh] max-h-[780px] flex flex-col rounded-3xl bg-[#080b15] border border-slate-800 shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-white font-display uppercase tracking-tight">
                  {model.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                  v{model.version || 1} • {model.productType}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  model.status === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {model.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Inspect 3D mesh, orbit around the model, test surface colors, and verify printable area bounds
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Canvas Stage */}
        <div className="flex-1 relative bg-gradient-to-b from-[#0a0f1d] to-[#04060c] flex items-center justify-center overflow-hidden">
          <Canvas
            camera={{ position: [0, 0, 2.8], fov: 45 }}
            gl={{ preserveDrawingBuffer: true, antialias: true }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <StudioScene
              modelUrl={model.modelUrl}
              productType={model.productType}
              color={selectedColor}
              showWireframe={showWireframe}
              isAutoRotate={isAutoRotate}
            />
            <OrbitControls
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={1.2}
              maxDistance={6.0}
            />
          </Canvas>

          {/* Floating Controls Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button
              onClick={handleResetCamera}
              title="Reset View"
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset View</span>
            </button>

            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              title="Toggle Auto Rotate"
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
                isAutoRotate
                  ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Auto Rotate</span>
            </button>

            <button
              onClick={() => setShowWireframe(!showWireframe)}
              title="Toggle Wireframe"
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
                showWireframe
                  ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                  : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">Wireframe</span>
            </button>
          </div>

          {/* Printable Areas Indicator Badge Overlay */}
          <div className="absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-2 max-w-[80%]">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-bold text-slate-300 backdrop-blur-md flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Configured Areas ({model.printableAreas?.length || 0}):</span>
            </div>
            {(model.printableAreas || []).map((area) => (
              <span
                key={area.id}
                className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700/80 text-[10px] font-mono text-cyan-300 backdrop-blur-md shadow-sm"
              >
                {area.name} ({area.width}" × {area.height}")
              </span>
            ))}
          </div>
        </div>

        {/* Footer: Color Swatches & Details */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">Available Colors:</span>
            <div className="flex items-center gap-2">
              {parsedColors.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setSelectedColor(hex)}
                  className={`w-7 h-7 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-center ${
                    selectedColor.toLowerCase() === hex.toLowerCase()
                      ? 'border-cyan-400 scale-110 shadow-md ring-2 ring-cyan-500/30'
                      : 'border-slate-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: hex }}
                  title={hex}
                >
                  {selectedColor.toLowerCase() === hex.toLowerCase() && (
                    <Check className={`w-3.5 h-3.5 ${hex === '#ffffff' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>Base Price: <strong className="text-white">₹{model.basePrice || 0}</strong></span>
            <span>•</span>
            <span>Format: <strong className="text-cyan-400 uppercase">{model.modelFormat || 'glb'}</strong></span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Done Previewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
