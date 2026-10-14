import React, { useMemo } from 'react';
import * as THREE from 'three';

// -------------------------------------------------------------
// Helper: Creates UV coordinates for realistic product models
// -------------------------------------------------------------
function mapGarmentUVs(geometry, type = 'torso') {
  const pos = geometry.attributes.position;
  const uvs = [];
  const normal = geometry.attributes.normal;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const nz = normal ? normal.getZ(i) : 0;

    let u = 0.5;
    let v = 0.5;

    if (type === 'torso' || type === 'hoodie' || type === 'polo' || type === 'jersey') {
      const isFront = nz >= 0;
      if (isFront) {
        // Front Chest UV mapping: x from -0.55 to +0.55, y from -0.7 to +0.65
        u = (x + 0.55) / 1.10;
        v = (y + 0.70) / 1.35;
        u = 0.20 + Math.max(0, Math.min(1, u)) * 0.60;
        v = 0.15 + Math.max(0, Math.min(1, v)) * 0.70;
      } else {
        // Back View UV mapping: x from +0.55 (left when looking at back) to -0.55 (right)
        u = (-x + 0.55) / 1.10;
        v = (y + 0.70) / 1.35;
        u = 0.20 + Math.max(0, Math.min(1, u)) * 0.60;
        v = 0.15 + Math.max(0, Math.min(1, v)) * 0.70;
      }
    } else if (type === 'apron') {
      u = (x + 0.45) / 0.90;
      v = (y + 0.65) / 1.30;
      u = 0.15 + Math.max(0, Math.min(1, u)) * 0.70;
      v = 0.15 + Math.max(0, Math.min(1, v)) * 0.70;
    } else if (type === 'cap') {
      u = (x + 0.40) / 0.80;
      v = (y - 0.05) / 0.50;
      u = 0.25 + Math.max(0, Math.min(1, u)) * 0.50;
      v = 0.25 + Math.max(0, Math.min(1, v)) * 0.50;
    } else if (type === 'cup') {
      const angle = Math.atan2(x, z);
      u = (angle + Math.PI) / (Math.PI * 2);
      v = (y + 0.55) / 1.10;
      v = Math.max(0, Math.min(1, v));
    } else if (type === 'badge') {
      u = (x + 0.45) / 0.90;
      v = (y + 0.45) / 0.90;
      u = 0.15 + Math.max(0, Math.min(1, u)) * 0.70;
      v = 0.15 + Math.max(0, Math.min(1, v)) * 0.70;
    } else if (type === 'mousepad') {
      u = (x + 0.65) / 1.30;
      v = (z + 0.48) / 0.96;
      u = Math.max(0, Math.min(1, u));
      v = Math.max(0, Math.min(1, v));
    } else if (type === 'photoframe') {
      u = (x + 0.55) / 1.10;
      v = (y + 0.42) / 0.84;
      u = 0.08 + Math.max(0, Math.min(1, u)) * 0.84;
      v = 0.08 + Math.max(0, Math.min(1, v)) * 0.84;
    }

    uvs.push(u, v);
  }

  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  return geometry;
}

// -------------------------------------------------------------
// 1. ROUND NECK T-SHIRT (Realistic anatomical drape)
// -------------------------------------------------------------
export function RoundNeckTShirtGeometry({ material, dynamicMaterial }) {
  const torsoGeo = useMemo(() => {
    // Smooth parametric torso with shoulder contours
    const geo = new THREE.CylinderGeometry(0.48, 0.46, 1.28, 64, 32, true);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      let x = pos.getX(i);
      let z = pos.getZ(i);

      // Flatten depth to mimic human chest
      z *= 0.58;

      // Shoulder widening & neck dip
      if (y > 0.2) {
        const factor = (y - 0.2) / 0.44;
        x *= 1.0 + factor * 0.28;
      }
      // Waist contour
      if (y < 0.1 && y > -0.4) {
        x *= 0.96;
      }

      pos.setXYZ(i, x, y, z);
    }
    return mapGarmentUVs(geo, 'torso');
  }, []);

  return (
    <group position={[0, 0.02, 0]}>
      {/* Printable Main Torso Mesh */}
      <mesh geometry={torsoGeo} material={dynamicMaterial} castShadow receiveShadow />

      {/* Ribbed Crew Neck Collar */}
      <mesh position={[0, 0.63, 0]} rotation={[Math.PI / 2.05, 0, 0]} material={material} castShadow>
        <torusGeometry args={[0.22, 0.026, 20, 48]} />
      </mesh>

      {/* Natural Angled Down Left Sleeve */}
      <group position={[0.56, 0.42, 0]} rotation={[0, 0, -Math.PI / 2.7]}>
        <mesh material={dynamicMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.15, 0.44, 32]} />
        </mesh>
        <mesh position={[0, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <torusGeometry args={[0.15, 0.015, 12, 32]} />
        </mesh>
      </group>

      {/* Natural Angled Down Right Sleeve */}
      <group position={[-0.56, 0.42, 0]} rotation={[0, 0, Math.PI / 2.7]}>
        <mesh material={dynamicMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.15, 0.44, 32]} />
        </mesh>
        <mesh position={[0, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <torusGeometry args={[0.15, 0.015, 12, 32]} />
        </mesh>
      </group>

      {/* Bottom Hem Ribbing */}
      <mesh position={[0, -0.64, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[0.46, 0.018, 16, 64]} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 2. OVERSIZED T-SHIRT (Drop shoulder & relaxed streetwear cut)
// -------------------------------------------------------------
export function OversizedTShirtGeometry({ material, dynamicMaterial }) {
  const torsoGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.58, 0.56, 1.38, 64, 32, true);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      let x = pos.getX(i);
      let z = pos.getZ(i);

      z *= 0.65;
      if (y > 0.1) {
        const factor = (y - 0.1) / 0.55;
        x *= 1.0 + factor * 0.35; // Broad drop shoulders
      }
      pos.setXYZ(i, x, y, z);
    }
    return mapGarmentUVs(geo, 'torso');
  }, []);

  return (
    <group position={[0, 0, 0]}>
      <mesh geometry={torsoGeo} material={dynamicMaterial} castShadow receiveShadow />

      {/* Thick Crew Collar */}
      <mesh position={[0, 0.68, 0]} rotation={[Math.PI / 2.05, 0, 0]} material={material} castShadow>
        <torusGeometry args={[0.24, 0.034, 20, 48]} />
      </mesh>

      {/* Extended Drop-Shoulder Left Sleeve */}
      <group position={[0.68, 0.36, 0]} rotation={[0, 0, -Math.PI / 2.5]}>
        <mesh material={dynamicMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.23, 0.19, 0.58, 32]} />
        </mesh>
        <mesh position={[0, -0.29, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <torusGeometry args={[0.19, 0.02, 12, 32]} />
        </mesh>
      </group>

      {/* Extended Drop-Shoulder Right Sleeve */}
      <group position={[-0.68, 0.36, 0]} rotation={[0, 0, Math.PI / 2.5]}>
        <mesh material={dynamicMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.23, 0.19, 0.58, 32]} />
        </mesh>
        <mesh position={[0, -0.29, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <torusGeometry args={[0.19, 0.02, 12, 32]} />
        </mesh>
      </group>

      {/* Bottom Straight Hem */}
      <mesh position={[0, -0.69, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[0.56, 0.022, 16, 64]} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 3. POLO T-SHIRT (Knitted folded collar & button placket)
// -------------------------------------------------------------
export function PoloTShirtGeometry({ material, dynamicMaterial }) {
  const torsoGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.49, 0.47, 1.28, 64, 32, true);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      let x = pos.getX(i);
      let z = pos.getZ(i);
      z *= 0.58;
      if (y > 0.2) {
        x *= 1.0 + ((y - 0.2) / 0.44) * 0.28;
      }
      pos.setXYZ(i, x, y, z);
    }
    return mapGarmentUVs(geo, 'polo');
  }, []);

  return (
    <group position={[0, 0.02, 0]}>
      <mesh geometry={torsoGeo} material={dynamicMaterial} castShadow receiveShadow />

      {/* Folded Polo Collar Wings */}
      <mesh position={[0, 0.64, 0.04]} rotation={[0.24, 0, 0]} material={material} castShadow>
        <torusGeometry args={[0.24, 0.048, 16, 32, Math.PI * 1.8]} />
      </mesh>

      {/* Button Placket Strip */}
      <mesh position={[0, 0.45, 0.29]} material={material} castShadow>
        <boxGeometry args={[0.08, 0.26, 0.015]} />
      </mesh>

      {/* Pearlescent Buttons */}
      <mesh position={[0, 0.53, 0.305]}>
        <cylinderGeometry args={[0.014, 0.014, 0.008, 16]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.43, 0.305]}>
        <cylinderGeometry args={[0.014, 0.014, 0.008, 16]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Short Sleeves with Ribbed Cuffs */}
      <group position={[0.56, 0.42, 0]} rotation={[0, 0, -Math.PI / 2.7]}>
        <mesh material={dynamicMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.15, 0.42, 32]} />
        </mesh>
        <mesh position={[0, -0.21, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <torusGeometry args={[0.15, 0.02, 12, 32]} />
        </mesh>
      </group>

      <group position={[-0.56, 0.42, 0]} rotation={[0, 0, Math.PI / 2.7]}>
        <mesh material={dynamicMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.15, 0.42, 32]} />
        </mesh>
        <mesh position={[0, -0.21, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <torusGeometry args={[0.15, 0.02, 12, 32]} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 4. HEAVYWEIGHT PULLOVER HOODIE (Volumetric hood & kangaroo pocket)
// -------------------------------------------------------------
export function HoodieGeometry({ material, dynamicMaterial }) {
  const torsoGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.53, 0.50, 1.30, 64, 32, true);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      let x = pos.getX(i);
      let z = pos.getZ(i);
      z *= 0.65;
      if (y > 0.15) {
        x *= 1.0 + ((y - 0.15) / 0.5) * 0.32;
      }
      pos.setXYZ(i, x, y, z);
    }
    return mapGarmentUVs(geo, 'hoodie');
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Main Hoodie Torso */}
      <mesh geometry={torsoGeo} material={dynamicMaterial} castShadow receiveShadow />

      {/* 3D Volumetric Draped Hood */}
      <group position={[0, 0.72, -0.08]}>
        {/* Hood Dome */}
        <mesh rotation={[0.22, 0, 0]} material={material} castShadow>
          <sphereGeometry args={[0.34, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.78]} />
        </mesh>
        {/* Hood Opening Collar Ring */}
        <mesh position={[0, -0.06, 0.14]} rotation={[Math.PI / 2.3, 0, 0]} material={material}>
          <torusGeometry args={[0.26, 0.048, 16, 32]} />
        </mesh>
        {/* Braided Drawstrings */}
        <mesh position={[-0.08, -0.34, 0.25]} rotation={[0.1, 0, -0.05]}>
          <cylinderGeometry args={[0.008, 0.008, 0.38, 12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.8} />
        </mesh>
        <mesh position={[0.08, -0.34, 0.25]} rotation={[0.1, 0, 0.05]}>
          <cylinderGeometry args={[0.008, 0.008, 0.38, 12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.8} />
        </mesh>
      </group>

      {/* Kangaroo Front Hand Pocket */}
      <mesh position={[0, -0.22, 0.26]} rotation={[-0.04, 0, 0]} material={material} castShadow>
        <boxGeometry args={[0.48, 0.32, 0.06]} />
      </mesh>

      {/* Full Length Sleeves with Ribbed Cuffs */}
      <group position={[0.66, 0.36, 0]} rotation={[0, 0, -Math.PI / 2.6]}>
        <mesh material={dynamicMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.16, 0.62, 32]} />
        </mesh>
        <mesh position={[0, -0.31, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <torusGeometry args={[0.16, 0.024, 12, 32]} />
        </mesh>
      </group>

      <group position={[-0.66, 0.36, 0]} rotation={[0, 0, Math.PI / 2.6]}>
        <mesh material={dynamicMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.16, 0.62, 32]} />
        </mesh>
        <mesh position={[0, -0.31, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
          <torusGeometry args={[0.16, 0.024, 12, 32]} />
        </mesh>
      </group>

      {/* Bottom Waistband Ribbing */}
      <mesh position={[0, -0.65, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[0.50, 0.035, 16, 64]} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 5. PRO ATHLETIC JERSEY (V-Neck & Raglan Cut)
// -------------------------------------------------------------
export function JerseyGeometry({ material, dynamicMaterial }) {
  const torsoGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.49, 0.47, 1.30, 64, 32, true);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      let x = pos.getX(i);
      let z = pos.getZ(i);
      z *= 0.58;
      if (y > 0.2) {
        x *= 1.0 + ((y - 0.2) / 0.45) * 0.26;
      }
      pos.setXYZ(i, x, y, z);
    }
    return mapGarmentUVs(geo, 'jersey');
  }, []);

  return (
    <group position={[0, 0.02, 0]}>
      <mesh geometry={torsoGeo} material={dynamicMaterial} castShadow receiveShadow />

      {/* V-Neck Rib Trim */}
      <mesh position={[0, 0.63, 0.02]} rotation={[Math.PI / 2.1, 0, 0]} material={material} castShadow>
        <torusGeometry args={[0.22, 0.026, 16, 32, Math.PI * 1.8]} />
      </mesh>

      {/* Athletic Raglan Sleeves */}
      <group position={[0.58, 0.42, 0]} rotation={[0, 0, -Math.PI / 2.7]}>
        <mesh material={dynamicMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.19, 0.15, 0.44, 32]} />
        </mesh>
      </group>

      <group position={[-0.58, 0.42, 0]} rotation={[0, 0, Math.PI / 2.7]}>
        <mesh material={dynamicMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.19, 0.15, 0.44, 32]} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 6. CHEF & BARISTA APRON
// -------------------------------------------------------------
export function ApronGeometry({ material, dynamicMaterial }) {
  const apronGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.28, 0.68);
    shape.lineTo(0.28, 0.68);
    shape.lineTo(0.28, 0.38);
    shape.lineTo(0.50, 0.22);
    shape.lineTo(0.50, -0.68);
    shape.lineTo(-0.50, -0.68);
    shape.lineTo(-0.50, 0.22);
    shape.lineTo(-0.28, 0.38);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    });
    return mapGarmentUVs(geo, 'apron');
  }, []);

  return (
    <group position={[0, 0, 0]}>
      <mesh geometry={apronGeo} material={dynamicMaterial} castShadow receiveShadow />

      {/* Leather Neck Loop Strap */}
      <mesh position={[0, 0.74, -0.08]} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.22, 0.016, 12, 32]} />
        <meshStandardMaterial color="#451a03" roughness={0.7} />
      </mesh>

      {/* Front Pockets */}
      <mesh position={[0, -0.32, 0.026]} material={material} castShadow>
        <boxGeometry args={[0.44, 0.28, 0.02]} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 7. STRUCTURED SNAPBACK CAP
// -------------------------------------------------------------
export function CapGeometry({ material, dynamicMaterial }) {
  const crownGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.52, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.52);
    return mapGarmentUVs(geo, 'cap');
  }, []);

  return (
    <group position={[0, -0.08, 0]} rotation={[0.18, 0, 0]}>
      {/* 6-Panel Crown */}
      <mesh geometry={crownGeo} material={dynamicMaterial} castShadow receiveShadow />

      {/* Curved Visor Brim */}
      <mesh position={[0, 0.02, 0.44]} rotation={[0.24, 0, 0]} material={material} castShadow>
        <boxGeometry args={[0.74, 0.035, 0.54]} />
      </mesh>

      {/* Top Squatchee Button */}
      <mesh position={[0, 0.52, 0]} material={material} castShadow>
        <sphereGeometry args={[0.035, 16, 16]} />
      </mesh>

      {/* Crown Base Rim */}
      <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[0.52, 0.022, 16, 48]} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 8. GLOSSY CERAMIC CUP / COFFEE MUG
// -------------------------------------------------------------
export function CupGeometry({ material, dynamicMaterial }) {
  const cupBodyGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.48, 0.46, 1.10, 64, 32, true);
    return mapGarmentUVs(geo, 'cup');
  }, []);

  return (
    <group position={[0, 0.05, 0]}>
      {/* Printable Exterior Ceramic Wall */}
      <mesh geometry={cupBodyGeo} material={dynamicMaterial} castShadow receiveShadow />

      {/* Hollow Interior Ceramic Wall */}
      <mesh material={material}>
        <cylinderGeometry args={[0.43, 0.41, 1.06, 48, 1, true]} />
      </mesh>

      {/* Bottom Ceramic Base */}
      <mesh position={[0, -0.54, 0]} rotation={[Math.PI / 2, 0, 0]} material={material} receiveShadow>
        <circleGeometry args={[0.46, 48]} />
      </mesh>

      {/* Rounded Lip Rim */}
      <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[0.455, 0.026, 16, 64]} />
      </mesh>

      {/* Ergonomic Curved C-Handle */}
      <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={material} castShadow>
        <torusGeometry args={[0.34, 0.065, 20, 48, Math.PI * 1.05]} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 9. PIN BUTTON BADGE
// -------------------------------------------------------------
export function BadgeGeometry({ material, dynamicMaterial }) {
  const badgeGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.55, 0.53, 0.06, 64);
    return mapGarmentUVs(geo, 'badge');
  }, []);

  return (
    <group position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
      {/* High-Gloss Domed Face */}
      <mesh geometry={badgeGeo} material={dynamicMaterial} castShadow receiveShadow />
      {/* Rear Metal Backing Plate */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.02, 32]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 10. DESKTOP GAMING MOUSE PAD
// -------------------------------------------------------------
export function MousePadGeometry({ material, dynamicMaterial }) {
  const padGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 1.30, h = 0.96, r = 0.08;
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.03,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    });
    geo.rotateX(-Math.PI / 2);
    return mapGarmentUVs(geo, 'mousepad');
  }, []);

  return (
    <group position={[0, -0.05, 0]}>
      <mesh geometry={padGeo} material={dynamicMaterial} castShadow receiveShadow />
      {/* Non-Slip Rubber Base */}
      <mesh position={[0, -0.025, 0]}>
        <boxGeometry args={[1.32, 0.015, 0.98]} />
        <meshStandardMaterial color="#09090b" roughness={0.9} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 11. WOODEN ACRYLIC PHOTO FRAME
// -------------------------------------------------------------
export function PhotoFrameGeometry({ material, dynamicMaterial }) {
  const acrylicGeo = useMemo(() => {
    const geo = new THREE.BoxGeometry(1.10, 0.84, 0.03);
    return mapGarmentUVs(geo, 'photoframe');
  }, []);

  return (
    <group position={[0, 0.05, 0]}>
      {/* Clear HD Acrylic Plate */}
      <mesh geometry={acrylicGeo} material={dynamicMaterial} castShadow receiveShadow />
      {/* Solid Wooden Desk Base */}
      <mesh position={[0, -0.44, 0]} material={material} castShadow>
        <boxGeometry args={[1.18, 0.09, 0.28]} />
      </mesh>
    </group>
  );
}
