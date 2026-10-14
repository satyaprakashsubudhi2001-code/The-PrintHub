import React from 'react';
import { ContactShadows, Environment } from '@react-three/drei';
import { useStore } from '../../context/StoreContext';

export function LightingStudio() {
  const { activeEnvironment, customizerProduct } = useStore();

  const isSmall =
    customizerProduct.id === 'cap' ||
    customizerProduct.id === 'cup' ||
    customizerProduct.id === 'badge' ||
    customizerProduct.id === 'photo-frame' ||
    customizerProduct.id === 'mouse-pad';

  return (
    <>
      {/* Dynamic HDRI Studio Preset */}
      <Environment preset={activeEnvironment.preset || 'studio'} background={false} />

      {/* Ambient Lighting */}
      <ambientLight
        intensity={activeEnvironment.ambientIntensity || 0.85}
        color={activeEnvironment.fillColor || '#ffffff'}
      />

      {/* Key Directional Light with soft shadows */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={activeEnvironment.keyIntensity || 1.6}
        color={activeEnvironment.keyColor || '#ffffff'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Secondary Fill Light */}
      <directionalLight
        position={[-4, 3, -3]}
        intensity={0.7}
        color={activeEnvironment.fillColor || '#93c5fd'}
      />

      {/* Top Studio Rim Highlight */}
      <directionalLight
        position={[0, 5, -4]}
        intensity={0.9}
        color="#ffffff"
      />

      {/* Soft Contact Floor Shadow */}
      <ContactShadows
        position={[0, isSmall ? -0.52 : -0.75, 0]}
        opacity={0.75}
        scale={6}
        blur={2.4}
        far={3.5}
        resolution={1024}
        color="#000000"
      />

      {/* Studio Pedestal */}
      <mesh
        position={[0, isSmall ? -0.53 : -0.76, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[2.2, 64]} />
        <meshStandardMaterial
          color={activeEnvironment.floorColor || '#0b0f17'}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </>
  );
}
