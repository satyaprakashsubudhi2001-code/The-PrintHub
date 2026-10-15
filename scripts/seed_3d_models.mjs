import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding 3D Product Types and Models in Neon PostgreSQL...');

  // 1. Seed Product Types
  const productTypes = [
    { name: 'T Shirt', category: 'Apparel', icon: '👕', description: 'Custom printed round-neck, oversized, and regular t-shirts' },
    { name: 'Shirt', category: 'Apparel', icon: '👔', description: 'Executive collared shirts and polo shirts' },
    { name: 'Mug', category: 'Drinkware', icon: '☕', description: 'Ceramic sublimation coffee and tea mugs with 360 wrap' },
    { name: 'Mouse Pad', category: 'Accessories', icon: '🖱️', description: 'Custom printed non-slip rubber desk pads and gaming mouse pads' },
  ];

  for (const pt of productTypes) {
    await prisma.productType3D.upsert({
      where: { name: pt.name },
      update: pt,
      create: pt,
    });
  }
  console.log('✓ Product types seeded.');

  // 2. Seed Initial 3D Models
  const initialModels = [
    {
      name: 'Classic Round Neck T-Shirt',
      productType: 'T Shirt',
      modelUrl: '/models/tshirt.glb',
      modelFormat: 'glb',
      previewImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
      colors: JSON.stringify(['#18181b', '#ffffff', '#dc2626', '#2563eb', '#16a34a', '#eab308', '#9333ea', '#475569']),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']),
      basePrice: 499,
      unit: 'inches',
      status: 'ACTIVE',
      version: 1,
      description: 'Premium 100% combed cotton jersey t-shirt with front, back, and sleeve print placements.',
      cameraSettings: JSON.stringify({ position: [0, 0, 2.8], target: [0, 0, 0], fov: 45 }),
      materialProps: JSON.stringify({ roughness: 0.82, metalness: 0.05 }),
      printableAreas: [
        {
          name: 'Front Chest',
          meshName: 'Torso',
          width: 12.0,
          height: 16.0,
          minScale: 0.3,
          maxScale: 2.5,
          defaultPosition: JSON.stringify({ x: 0, y: 0.05 }),
          defaultRotation: 0,
          defaultScale: 1.0,
          bounds: JSON.stringify({ x: 0.28, y: 0.18, width: 0.44, height: 0.52 }),
          priceExtra: 0,
          isEnabled: true,
          sortOrder: 0,
        },
        {
          name: 'Back',
          meshName: 'Torso',
          width: 12.0,
          height: 16.0,
          minScale: 0.3,
          maxScale: 2.5,
          defaultPosition: JSON.stringify({ x: 0, y: 0.05 }),
          defaultRotation: 0,
          defaultScale: 1.0,
          bounds: JSON.stringify({ x: 0.28, y: 0.18, width: 0.44, height: 0.52 }),
          priceExtra: 150,
          isEnabled: true,
          sortOrder: 1,
        },
        {
          name: 'Left Sleeve',
          meshName: 'LeftSleeve',
          width: 4.0,
          height: 4.0,
          minScale: 0.2,
          maxScale: 1.5,
          defaultPosition: JSON.stringify({ x: 0, y: 0 }),
          defaultRotation: 0,
          defaultScale: 1.0,
          bounds: JSON.stringify({ x: 0.3, y: 0.3, width: 0.4, height: 0.4 }),
          priceExtra: 80,
          isEnabled: true,
          sortOrder: 2,
        },
        {
          name: 'Right Sleeve',
          meshName: 'RightSleeve',
          width: 4.0,
          height: 4.0,
          minScale: 0.2,
          maxScale: 1.5,
          defaultPosition: JSON.stringify({ x: 0, y: 0 }),
          defaultRotation: 0,
          defaultScale: 1.0,
          bounds: JSON.stringify({ x: 0.3, y: 0.3, width: 0.4, height: 0.4 }),
          priceExtra: 80,
          isEnabled: true,
          sortOrder: 3,
        },
      ],
    },
    {
      name: 'Executive Collared Shirt',
      productType: 'Shirt',
      modelUrl: '/models/shirt.glb',
      modelFormat: 'glb',
      previewImage: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
      colors: JSON.stringify(['#1e293b', '#ffffff', '#0284c7', '#f8fafc', '#334155']),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', '2XL']),
      basePrice: 699,
      unit: 'inches',
      status: 'ACTIVE',
      version: 1,
      description: 'Formal and semi-formal button shirt crafted for bespoke embroidery or sharp DTF chest crests.',
      cameraSettings: JSON.stringify({ position: [0, 0, 2.9], target: [0, 0, 0], fov: 45 }),
      materialProps: JSON.stringify({ roughness: 0.72, metalness: 0.05 }),
      printableAreas: [
        {
          name: 'Left Chest',
          meshName: 'Torso',
          width: 4.5,
          height: 4.5,
          minScale: 0.2,
          maxScale: 1.8,
          defaultPosition: JSON.stringify({ x: 0.15, y: 0.12 }),
          defaultRotation: 0,
          defaultScale: 1.0,
          bounds: JSON.stringify({ x: 0.52, y: 0.25, width: 0.25, height: 0.25 }),
          priceExtra: 0,
          isEnabled: true,
          sortOrder: 0,
        },
        {
          name: 'Back',
          meshName: 'Torso',
          width: 11.0,
          height: 14.0,
          minScale: 0.3,
          maxScale: 2.2,
          defaultPosition: JSON.stringify({ x: 0, y: 0.08 }),
          defaultRotation: 0,
          defaultScale: 1.0,
          bounds: JSON.stringify({ x: 0.30, y: 0.20, width: 0.40, height: 0.40 }),
          priceExtra: 150,
          isEnabled: true,
          sortOrder: 1,
        },
      ],
    },
    {
      name: '11oz Ceramic Coffee Mug',
      productType: 'Mug',
      modelUrl: '/models/mug.glb',
      modelFormat: 'glb',
      previewImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      colors: JSON.stringify(['#ffffff', '#18181b', '#dc2626', '#0284c7']),
      sizes: JSON.stringify(['11oz']),
      basePrice: 299,
      unit: 'inches',
      status: 'ACTIVE',
      version: 1,
      description: 'Glossy ceramic drinkware calibrated for seamless 360 wrap heat-press dye sublimation.',
      cameraSettings: JSON.stringify({ position: [0, 0, 2.4], target: [0, 0, 0], fov: 45 }),
      materialProps: JSON.stringify({ roughness: 0.12, metalness: 0.08 }),
      printableAreas: [
        {
          name: 'Mug Wrap',
          meshName: 'MugBody',
          width: 8.5,
          height: 3.75,
          minScale: 0.3,
          maxScale: 2.0,
          defaultPosition: JSON.stringify({ x: 0, y: 0 }),
          defaultRotation: 0,
          defaultScale: 1.0,
          bounds: JSON.stringify({ x: 0.05, y: 0.10, width: 0.90, height: 0.80 }),
          priceExtra: 0,
          isEnabled: true,
          sortOrder: 0,
        },
      ],
    },
    {
      name: 'Pro Gaming & Office Mouse Pad',
      productType: 'Mouse Pad',
      modelUrl: '/models/mousepad.glb',
      modelFormat: 'glb',
      previewImage: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80',
      colors: JSON.stringify(['#18181b', '#0f172a', '#1e1b4b']),
      sizes: JSON.stringify(['Standard (22x18cm)', 'Extended Desk (90x40cm)']),
      basePrice: 349,
      unit: 'inches',
      status: 'ACTIVE',
      version: 1,
      description: 'Micro-textured polyester fabric surface with anti-slip rubberized base and perimeter anti-fray stitching.',
      cameraSettings: JSON.stringify({ position: [0, 1.8, 2.0], target: [0, 0, 0], fov: 45 }),
      materialProps: JSON.stringify({ roughness: 0.85, metalness: 0.02 }),
      printableAreas: [
        {
          name: 'Top Surface',
          meshName: 'MousePadSurface',
          width: 14.0,
          height: 10.0,
          minScale: 0.2,
          maxScale: 2.0,
          defaultPosition: JSON.stringify({ x: 0, y: 0 }),
          defaultRotation: 0,
          defaultScale: 1.0,
          bounds: JSON.stringify({ x: 0.02, y: 0.02, width: 0.96, height: 0.96 }),
          priceExtra: 0,
          isEnabled: true,
          sortOrder: 0,
        },
      ],
    },
  ];

  for (const m of initialModels) {
    const { printableAreas, ...modelData } = m;

    let existing = await prisma.customModel3D.findFirst({
      where: { name: modelData.name },
    });

    if (!existing) {
      existing = await prisma.customModel3D.create({
        data: modelData,
      });
      console.log(`Created model: ${existing.name}`);
    } else {
      await prisma.customModel3D.update({
        where: { id: existing.id },
        data: modelData,
      });
      console.log(`Updated model: ${existing.name}`);
    }

    // Seed or update printable areas
    for (const pa of printableAreas) {
      const existingArea = await prisma.printableArea3D.findFirst({
        where: { modelId: existing.id, name: pa.name },
      });

      if (!existingArea) {
        await prisma.printableArea3D.create({
          data: { ...pa, modelId: existing.id },
        });
      } else {
        await prisma.printableArea3D.update({
          where: { id: existingArea.id },
          data: pa,
        });
      }
    }
  }

  console.log('✓ All 4 models seeded successfully with printable areas!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
