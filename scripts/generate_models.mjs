import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';

if (typeof global.FileReader === 'undefined') {
  global.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onloadend) this.onloadend();
      });
    }
  };
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 1. T-Shirt Model
function createTShirtScene() {
  const scene = new THREE.Scene();
  scene.name = 'TShirtModel';

  // Torso
  const torsoGeo = new THREE.CylinderGeometry(0.48, 0.46, 1.28, 64, 32, true);
  const pos = torsoGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    let x = pos.getX(i);
    let z = pos.getZ(i);
    z *= 0.58; // flatten chest
    if (y > 0.2) {
      const factor = (y - 0.2) / 0.44;
      x *= 1.0 + factor * 0.28;
    }
    if (y < 0.1 && y > -0.4) {
      x *= 0.96;
    }
    pos.setXYZ(i, x, y, z);
  }

  // Torso UVs
  const uvs = [];
  const normal = torsoGeo.attributes.normal;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const nz = normal ? normal.getZ(i) : 0;
    let u = 0.5;
    let v = 0.5;
    if (nz >= 0) {
      u = (x + 0.55) / 1.10;
      v = (y + 0.70) / 1.35;
      u = 0.20 + Math.max(0, Math.min(1, u)) * 0.60;
      v = 0.15 + Math.max(0, Math.min(1, v)) * 0.70;
    } else {
      u = (-x + 0.55) / 1.10;
      v = (y + 0.70) / 1.35;
      u = 0.20 + Math.max(0, Math.min(1, u)) * 0.60;
      v = 0.15 + Math.max(0, Math.min(1, v)) * 0.70;
    }
    uvs.push(u, v);
  }
  torsoGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  torsoGeo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.85,
    metalness: 0.05,
    side: THREE.DoubleSide
  });

  const torsoMesh = new THREE.Mesh(torsoGeo, mat);
  torsoMesh.name = 'Torso';
  scene.add(torsoMesh);

  // Collar
  const collarGeo = new THREE.TorusGeometry(0.24, 0.035, 16, 64);
  collarGeo.rotateX(Math.PI / 2);
  const collarMesh = new THREE.Mesh(collarGeo, mat);
  collarMesh.position.set(0, 0.63, 0);
  collarMesh.scale.set(1.1, 1, 0.75);
  collarMesh.name = 'Collar';
  scene.add(collarMesh);

  // Left & Right Sleeves
  [-1, 1].forEach((side) => {
    const sleeveGeo = new THREE.CylinderGeometry(0.18, 0.21, 0.44, 32);
    sleeveGeo.rotateZ((side * Math.PI) / 4);
    sleeveGeo.scale(side === -1 ? 0.95 : 1, 1, 0.65);
    const sleeveMesh = new THREE.Mesh(sleeveGeo, mat);
    sleeveMesh.position.set(side * 0.62, 0.45, 0);
    sleeveMesh.name = side === -1 ? 'LeftSleeve' : 'RightSleeve';
    scene.add(sleeveMesh);
  });

  return scene;
}

// 2. Collared Shirt Model
function createShirtScene() {
  const scene = new THREE.Scene();
  scene.name = 'ShirtModel';

  const torsoGeo = new THREE.CylinderGeometry(0.49, 0.47, 1.32, 64, 32, true);
  const pos = torsoGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    let x = pos.getX(i);
    let z = pos.getZ(i);
    z *= 0.56;
    if (y > 0.25) {
      const f = (y - 0.25) / 0.41;
      x *= 1.0 + f * 0.26;
    }
    pos.setXYZ(i, x, y, z);
  }

  const uvs = [];
  const normal = torsoGeo.attributes.normal;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const nz = normal ? normal.getZ(i) : 0;
    let u = 0.5, v = 0.5;
    if (nz >= 0) {
      u = (x + 0.55) / 1.10;
      v = (y + 0.70) / 1.35;
      u = 0.20 + Math.max(0, Math.min(1, u)) * 0.60;
      v = 0.15 + Math.max(0, Math.min(1, v)) * 0.70;
    } else {
      u = (-x + 0.55) / 1.10;
      v = (y + 0.70) / 1.35;
      u = 0.20 + Math.max(0, Math.min(1, u)) * 0.60;
      v = 0.15 + Math.max(0, Math.min(1, v)) * 0.70;
    }
    uvs.push(u, v);
  }
  torsoGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  torsoGeo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.75,
    metalness: 0.05,
    side: THREE.DoubleSide
  });

  const torsoMesh = new THREE.Mesh(torsoGeo, mat);
  torsoMesh.name = 'Torso';
  scene.add(torsoMesh);

  // Shirt Collar Wings
  const collarGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.14, 32, 1, true, 0, Math.PI * 1.85);
  collarGeo.rotateX(0.1);
  const collarMesh = new THREE.Mesh(collarGeo, mat);
  collarMesh.position.set(0, 0.67, -0.01);
  collarMesh.scale.set(1.05, 1, 0.72);
  collarMesh.name = 'Collar';
  scene.add(collarMesh);

  // Placket / Buttons line
  const placketGeo = new THREE.BoxGeometry(0.06, 0.9, 0.02);
  const placketMesh = new THREE.Mesh(placketGeo, mat);
  placketMesh.position.set(0, 0.18, 0.285);
  placketMesh.name = 'Placket';
  scene.add(placketMesh);

  // Sleeves
  [-1, 1].forEach((side) => {
    const sleeveGeo = new THREE.CylinderGeometry(0.17, 0.19, 0.55, 32);
    sleeveGeo.rotateZ((side * Math.PI) / 3.8);
    sleeveGeo.scale(side === -1 ? 0.95 : 1, 1, 0.62);
    const sleeveMesh = new THREE.Mesh(sleeveGeo, mat);
    sleeveMesh.position.set(side * 0.66, 0.38, 0);
    sleeveMesh.name = side === -1 ? 'LeftSleeve' : 'RightSleeve';
    scene.add(sleeveMesh);
  });

  return scene;
}

// 3. Ceramic Mug Model
function createMugScene() {
  const scene = new THREE.Scene();
  scene.name = 'MugModel';

  // Body with cylindrical wrap UV
  const bodyGeo = new THREE.CylinderGeometry(0.52, 0.50, 1.10, 64, 1, false);
  const pos = bodyGeo.attributes.position;
  const uvs = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const angle = Math.atan2(x, z);
    const u = (angle + Math.PI) / (Math.PI * 2);
    const v = Math.max(0, Math.min(1, (y + 0.55) / 1.10));
    uvs.push(u, v);
  }
  bodyGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  bodyGeo.computeVertexNormals();

  const mugMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.12,
    metalness: 0.08,
  });

  const bodyMesh = new THREE.Mesh(bodyGeo, mugMat);
  bodyMesh.name = 'MugBody';
  scene.add(bodyMesh);

  // Handle
  const handleGeo = new THREE.TorusGeometry(0.36, 0.07, 16, 48, Math.PI);
  handleGeo.rotateZ(-Math.PI / 2);
  const handleMesh = new THREE.Mesh(handleGeo, mugMat);
  handleMesh.position.set(0.56, 0.02, 0);
  handleMesh.name = 'Handle';
  scene.add(handleMesh);

  return scene;
}

// 4. Desk Mouse Pad Model
function createMousePadScene() {
  const scene = new THREE.Scene();
  scene.name = 'MousePadModel';

  // Rounded Desk Pad Box
  const padGeo = new THREE.BoxGeometry(1.4, 0.03, 1.0, 32, 2, 32);
  const pos = padGeo.attributes.position;
  const normal = padGeo.attributes.normal;
  const uvs = [];

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const ny = normal ? normal.getY(i) : 0;
    if (ny > 0.5) {
      // Top printable surface
      const u = (x + 0.70) / 1.40;
      const v = (z + 0.50) / 1.00;
      uvs.push(Math.max(0, Math.min(1, u)), Math.max(0, Math.min(1, v)));
    } else {
      uvs.push(0.5, 0.5);
    }
  }
  padGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  padGeo.computeVertexNormals();

  const padMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.78,
    metalness: 0.04,
  });

  const padMesh = new THREE.Mesh(padGeo, padMat);
  padMesh.name = 'MousePadSurface';
  scene.add(padMesh);

  // Stitched border rim
  const rimGeo = new THREE.BoxGeometry(1.42, 0.034, 1.02);
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    roughness: 0.9,
    wireframe: false
  });
  const rimMesh = new THREE.Mesh(rimGeo, rimMat);
  rimMesh.position.set(0, -0.003, 0);
  rimMesh.name = 'StitchedEdge';
  scene.add(rimMesh);

  return scene;
}

async function exportToGLB(scene) {
  const exporter = new GLTFExporter();
  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (glb) => {
        resolve(Buffer.from(glb));
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}

async function generateAll() {
  console.log('Generating 3D GLB assets...');

  const models = [
    { name: 'tshirt.glb', scene: createTShirtScene() },
    { name: 'shirt.glb', scene: createShirtScene() },
    { name: 'mug.glb', scene: createMugScene() },
    { name: 'mousepad.glb', scene: createMousePadScene() },
  ];

  const targetDirs = [
    path.resolve('public/models'),
    path.resolve('app/public/models'),
    path.resolve('admin/public/models'),
  ];

  targetDirs.forEach(ensureDir);

  for (const m of models) {
    const glbBuffer = await exportToGLB(m.scene);
    console.log(`Generated ${m.name}: ${glbBuffer.length} bytes`);
    for (const dir of targetDirs) {
      fs.writeFileSync(path.join(dir, m.name), glbBuffer);
    }
  }

  console.log('All 4 models successfully created and saved to public directories!');
}

generateAll().catch(console.error);
