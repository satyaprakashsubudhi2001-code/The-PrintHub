import prisma from '../_lib/prisma.js';
import { verifyAdmin } from '../_lib/auth.js';
import { safeParseColors, safeParseSizes, normalizeCategory } from '../_lib/normalize.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'GET') {
    try {
      const products = await prisma.product.findMany({
        where: { status: 'ACTIVE' },
        include: { category: true, images: { orderBy: { sortOrder: 'asc' } }, inventory: true },
        orderBy: { createdAt: 'desc' }
      });
      const normalizedProducts = products.map((p) => {
        const catName = normalizeCategory(p.category);
        return {
          ...p,
          category: catName,
          categoryName: catName,
          categoryObj: typeof p.category === 'object' ? p.category : null,
          colors: safeParseColors(p.colors),
          sizes: safeParseSizes(p.sizes)
        };
      });
      res.status(200).json(normalizedProducts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      verifyAdmin(req);
      const data = req.body;
      const { images, inventory, ...productData } = data;

      // Auto-resolve or create categoryId if only category name is provided
      let categoryId = productData.categoryId;
      if (!categoryId && productData.category) {
        const catName = productData.category.trim();
        let cat = await prisma.category.findFirst({
          where: {
            OR: [
              { name: { equals: catName, mode: 'insensitive' } },
              { id: catName }
            ]
          }
        });

        if (!cat) {
          cat = await prisma.category.create({
            data: {
              name: catName,
              audience: productData.audience || 'UNISEX',
              icon: '🏷️'
            }
          });
        }
        categoryId = cat.id;
      }

      // Ensure required SKU exists
      const sku = productData.sku || `SKU-${Date.now().toString(36).toUpperCase()}`;
      const audience = productData.audience || 'UNISEX';

      // Normalize images input
      let imageCreate = undefined;
      if (Array.isArray(images) && images.length > 0) {
        imageCreate = {
          create: images.map((img, idx) => ({
            url: typeof img === 'string' ? img : (img.url || ''),
            sortOrder: idx,
            isPrimary: idx === 0
          }))
        };
      }

      const inventoryCreate = inventory ? {
        create: {
          sku: inventory.sku || `${sku}-INV`,
          quantity: Number(inventory.quantity ?? inventory.currentStock ?? inventory.stock ?? 50),
          minLevel: Number(inventory.minLevel ?? inventory.minStockLevel ?? 10)
        }
      } : undefined;

      const product = await prisma.product.create({
        data: {
          name: productData.name || 'Untitled Product',
          sku,
          audience,
          categoryId: categoryId || (await prisma.category.findFirst())?.id,
          description: productData.description || '',
          basePrice: Number(productData.basePrice || productData.price) || 0,
          salePrice: productData.compareAtPrice ? Number(productData.compareAtPrice) : null,
          costPrice: Number(productData.costPrice) || 0,
          status: 'ACTIVE',
          isCustomizable: productData.isCustomizable !== false,
          defaultColor: productData.defaultColor || '#18181b',
          defaultSize: productData.defaultSize || 'L',
          sizes: JSON.stringify(safeParseSizes(productData.sizes)),
          colors: JSON.stringify(safeParseColors(productData.colors)),
          features: productData.features ? JSON.stringify(productData.features) : null,
          images: imageCreate,
          inventory: inventoryCreate
        },
        include: { images: true, inventory: true, category: true }
      });

      const catName = normalizeCategory(product.category);
      res.status(201).json({
        ...product,
        category: catName,
        categoryName: catName,
        categoryObj: typeof product.category === 'object' ? product.category : null,
        colors: safeParseColors(product.colors),
        sizes: safeParseSizes(product.sizes)
      });
    } catch (err) {
      console.error('Failed to create product in DB:', err);
      res.status(400).json({ error: err.message });
    }
  } else if (req.method === 'PATCH') {
    try {
      verifyAdmin(req);
      const urlParts = (req.url || '').split('?')[0].split('/').filter(Boolean);
      const lastPart = urlParts[urlParts.length - 1];
      const targetId = req.query.id || (lastPart !== 'products' ? lastPart : null) || req.body?.id;

      if (!targetId) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      const existing = await prisma.product.findFirst({
        where: {
          OR: [{ id: targetId }, { sku: targetId }, { name: targetId }]
        }
      });

      if (!existing) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const { images, inventory, id, ...productData } = req.body;
      if (productData.colors !== undefined) {
        productData.colors = JSON.stringify(safeParseColors(productData.colors));
      }
      if (productData.sizes !== undefined) {
        productData.sizes = JSON.stringify(safeParseSizes(productData.sizes));
      }

      const product = await prisma.product.update({
        where: { id: existing.id },
        data: productData,
        include: { images: true, inventory: true, category: true }
      });
      const catName = normalizeCategory(product.category);
      res.status(200).json({
        ...product,
        category: catName,
        categoryName: catName,
        categoryObj: typeof product.category === 'object' ? product.category : null,
        colors: safeParseColors(product.colors),
        sizes: safeParseSizes(product.sizes)
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      verifyAdmin(req);
      const urlParts = (req.url || '').split('?')[0].split('/').filter(Boolean);
      const lastPart = urlParts[urlParts.length - 1];
      const targetId = req.query.id || (lastPart !== 'products' ? lastPart : null) || req.body?.id;

      if (targetId) {
        // Delete single product
        const existing = await prisma.product.findFirst({
          where: {
            OR: [{ id: targetId }, { sku: targetId }, { name: targetId }]
          }
        });

        if (!existing) {
          return res.status(200).json({ success: true, message: 'Product already deleted or not found' });
        }

        try {
          await prisma.product.delete({
            where: { id: existing.id }
          });
        } catch (delErr) {
          await prisma.product.update({
            where: { id: existing.id },
            data: { status: 'ARCHIVED' }
          });
        }

        return res.status(200).json({ success: true, message: 'Product deleted successfully' });
      }

      // Bulk clear all products
      try {
        await prisma.productImage.deleteMany({});
        await prisma.inventory.deleteMany({});
        await prisma.product.deleteMany({});
      } catch (delErr) {
        await prisma.product.updateMany({
          data: { status: 'ARCHIVED' }
        });
      }
      res.status(200).json({ success: true, message: 'All products cleared' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
