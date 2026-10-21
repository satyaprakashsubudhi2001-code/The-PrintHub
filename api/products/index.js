import prisma from '../_lib/prisma.js';
import { verifyAdmin } from '../_lib/auth.js';
import { safeParseColors, safeParseSizes, normalizeCategory, normalizeProduct } from '../_lib/normalize.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'GET') {
    try {
      const includeInactive = req.query.includeInactive === 'true' || req.query.admin === 'true';
      const whereClause = includeInactive
        ? {}
        : {
            status: 'ACTIVE',
            isActive: true,
            category: { isActive: true }
          };

      const products = await prisma.product.findMany({
        where: whereClause,
        include: { category: true, images: { orderBy: { sortOrder: 'asc' } }, inventory: true },
        orderBy: { createdAt: 'desc' }
      });
      const normalizedProducts = products.map(normalizeProduct);
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
        const catName = (typeof productData.category === 'object' ? productData.category.name : productData.category).trim();
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
              icon: '🏷️',
              isActive: true
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
        const cleanList = images
          .map((img, idx) => ({
            url: typeof img === 'string' ? img : (img?.url || ''),
            sortOrder: idx,
            isPrimary: idx === 0
          }))
          .filter(img => img.url && typeof img.url === 'string' && !img.url.startsWith('blob:'));

        if (cleanList.length > 0) {
          imageCreate = { create: cleanList };
        }
      }

      const inventoryCreate = inventory ? {
        create: {
          sku: inventory.sku || `${sku}-INV`,
          quantity: Number(inventory.quantity ?? inventory.currentStock ?? inventory.stock ?? 50),
          minLevel: Number(inventory.minLevel ?? inventory.minStockLevel ?? 10)
        }
      } : undefined;

      const isProdActive = productData.isActive !== false && productData.status !== 'INACTIVE';

      const product = await prisma.product.create({
        data: {
          name: productData.name || 'Untitled Product',
          sku,
          audience,
          categoryId: categoryId || (await prisma.category.findFirst())?.id,
          description: productData.description || '',
          basePrice: Number(productData.basePrice || productData.price) || 0,
          salePrice: (productData.salePrice || productData.compareAtPrice) ? Number(productData.salePrice || productData.compareAtPrice) : null,
          costPrice: Number(productData.costPrice) || 0,
          status: isProdActive ? 'ACTIVE' : 'INACTIVE',
          isActive: isProdActive,
          isCustomizable: productData.isCustomizable !== false,
          defaultColor: productData.defaultColor || '#18181b',
          defaultSize: productData.defaultSize || 'L',
          sizes: JSON.stringify(safeParseSizes(productData.sizes)),
          colors: JSON.stringify(safeParseColors(productData.colors)),
          features: productData.features ? JSON.stringify(productData.features) : null,
          images: imageCreate,
          inventory: inventoryCreate
        },
        include: { images: { orderBy: { sortOrder: 'asc' } }, inventory: true, category: true }
      });

      res.status(201).json(normalizeProduct(product));
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

      const { images, inventory, id, category, categoryKey, printAreas, defaultPrintArea, tags, stock, price, compareAtPrice, ...rawProductData } = req.body;

      // Resolve categoryId if category name or ID is changed
      let categoryId = rawProductData.categoryId;
      if (category) {
        const catName = (typeof category === 'object' ? category.name : category).trim();
        let cat = await prisma.category.findFirst({
          where: {
            OR: [
              { id: catName },
              { name: { equals: catName, mode: 'insensitive' } }
            ]
          }
        });
        if (cat) categoryId = cat.id;
      }

      // Build safe update payload containing only scalar columns on Product model
      const updateData = {};
      if (rawProductData.name !== undefined) updateData.name = rawProductData.name;
      if (rawProductData.sku !== undefined) updateData.sku = rawProductData.sku;
      if (rawProductData.audience !== undefined) updateData.audience = rawProductData.audience;
      if (rawProductData.description !== undefined) updateData.description = rawProductData.description;
      if (rawProductData.basePrice !== undefined || price !== undefined) {
        updateData.basePrice = Number(rawProductData.basePrice ?? price) || 0;
      }
      if (rawProductData.salePrice !== undefined || compareAtPrice !== undefined) {
        updateData.salePrice = Number(rawProductData.salePrice ?? compareAtPrice) || null;
      }
      if (rawProductData.costPrice !== undefined) updateData.costPrice = Number(rawProductData.costPrice) || 0;
      if (rawProductData.status !== undefined) {
        updateData.status = rawProductData.status;
        updateData.isActive = rawProductData.status === 'ACTIVE';
      }
      if (rawProductData.isActive !== undefined) {
        updateData.isActive = Boolean(rawProductData.isActive);
        updateData.status = updateData.isActive ? 'ACTIVE' : 'INACTIVE';
      }
      if (rawProductData.isCustomizable !== undefined) updateData.isCustomizable = Boolean(rawProductData.isCustomizable);
      if (rawProductData.defaultColor !== undefined) updateData.defaultColor = rawProductData.defaultColor;
      if (rawProductData.defaultSize !== undefined) updateData.defaultSize = rawProductData.defaultSize;
      if (rawProductData.colors !== undefined) updateData.colors = JSON.stringify(safeParseColors(rawProductData.colors));
      if (rawProductData.sizes !== undefined) updateData.sizes = JSON.stringify(safeParseSizes(rawProductData.sizes));
      if (rawProductData.features !== undefined) updateData.features = JSON.stringify(rawProductData.features);
      if (categoryId) updateData.categoryId = categoryId;

      // Handle updating ProductImage records
      if (Array.isArray(images)) {
        await prisma.productImage.deleteMany({
          where: { productId: existing.id }
        });
        const cleanImages = images
          .map((img, idx) => ({
            productId: existing.id,
            url: typeof img === 'string' ? img : (img?.url || ''),
            sortOrder: idx,
            isPrimary: idx === 0
          }))
          .filter(img => img.url && typeof img.url === 'string' && !img.url.startsWith('blob:'));

        if (cleanImages.length > 0) {
          await prisma.productImage.createMany({
            data: cleanImages
          });
        }
      }

      // Handle inventory / stock update
      const newStock = stock !== undefined ? Number(stock) : (inventory?.quantity !== undefined ? Number(inventory.quantity) : undefined);
      if (newStock !== undefined) {
        await prisma.inventory.upsert({
          where: { productId: existing.id },
          create: {
            productId: existing.id,
            sku: `${existing.sku}-INV`,
            quantity: newStock,
            minLevel: 10
          },
          update: {
            quantity: newStock
          }
        });
      }

      const product = await prisma.product.update({
        where: { id: existing.id },
        data: updateData,
        include: { images: { orderBy: { sortOrder: 'asc' } }, inventory: true, category: true }
      });

      res.status(200).json(normalizeProduct(product));
    } catch (err) {
      console.error('Failed to update product in DB:', err);
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

        // Check if referenced by order items or design requests
        const orderItemsCount = await prisma.orderItem.count({ where: { productId: existing.id } });
        const designRequestsCount = await prisma.designRequest.count({ where: { productId: existing.id } });

        if (orderItemsCount > 0 || designRequestsCount > 0) {
          await prisma.product.update({
            where: { id: existing.id },
            data: { status: 'ARCHIVED', isActive: false }
          });
          return res.status(200).json({
            success: true,
            archived: true,
            message: `Product "${existing.name}" is referenced by past orders/requests and was safely ARCHIVED.`
          });
        }

        // Safe to hard delete: Clean up dependent records first
        await prisma.customModel3D.updateMany({
          where: { productId: existing.id },
          data: { productId: null }
        });

        await prisma.inventory.deleteMany({
          where: { productId: existing.id }
        });

        await prisma.productImage.deleteMany({
          where: { productId: existing.id }
        });

        await prisma.product.delete({
          where: { id: existing.id }
        });

        return res.status(200).json({ success: true, message: `Product "${existing.name}" deleted successfully` });
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
