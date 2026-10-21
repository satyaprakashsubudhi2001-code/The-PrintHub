import prisma from '../_lib/prisma.js';
import { verifyAdmin } from '../_lib/auth.js';
import { safeParseColors, safeParseSizes } from '../_lib/normalize.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  // ========================================================
  // GET: Fetch Models or Product Types
  // ========================================================
  if (req.method === 'GET') {
    try {
      const urlParts = (req.url || '').split('?')[0].split('/').filter(Boolean);
      const lastPart = urlParts[urlParts.length - 1];
      const modelId = req.query.id || (lastPart !== 'models' ? lastPart : null);

      // Return Product Types
      if (req.query.productTypes === 'true' || req.query.types === 'true') {
        const types = await prisma.productType3D.findMany({
          orderBy: { name: 'asc' }
        });
        return res.status(200).json(types);
      }

      // Return Single Model by ID
      if (modelId) {
        const model = await prisma.customModel3D.findUnique({
          where: { id: modelId },
          include: {
            printableAreas: { orderBy: { sortOrder: 'asc' } },
            product: {
              include: {
                category: true
              }
            }
          }
        });
        if (!model) {
          return res.status(404).json({ error: '3D Model not found' });
        }
        return res.status(200).json({
          ...model,
          colors: safeParseColors(model.colors),
          sizes: safeParseSizes(model.sizes)
        });
      }

      // Check if caller is admin
      let isAdmin = false;
      try {
        verifyAdmin(req);
        isAdmin = true;
      } catch (e) {
        isAdmin = false;
      }

      // If admin, return all models; if customer, return only ACTIVE models
      const whereCondition = isAdmin && req.query.customerOnly !== 'true'
        ? {}
        : { status: 'ACTIVE' };

      // Optional filter by productType
      if (req.query.productType) {
        whereCondition.productType = req.query.productType;
      }

      const models = await prisma.customModel3D.findMany({
        where: whereCondition,
        include: {
          printableAreas: { orderBy: { sortOrder: 'asc' } },
          product: {
            include: {
              category: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      const normalizedModels = models.map((m) => ({
        ...m,
        colors: safeParseColors(m.colors),
        sizes: safeParseSizes(m.sizes)
      }));

      return res.status(200).json(normalizedModels);
    } catch (err) {
      console.error('Error fetching 3D models:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // ========================================================
  // POST: Create Model, Add Product Type, or Upload File
  // ========================================================
  else if (req.method === 'POST') {
    try {
      verifyAdmin(req);
      const data = req.body || {};

      // 1. Create or register a new Product Type
      if (data.action === 'product-type' || req.query.action === 'product-type') {
        const typeName = (data.name || '').trim();
        if (!typeName) {
          return res.status(400).json({ error: 'Product type name is required.' });
        }

        const newType = await prisma.productType3D.upsert({
          where: { name: typeName },
          update: {
            category: data.category || 'General',
            icon: data.icon || '📦',
            description: data.description || '',
            isActive: data.isActive !== false,
          },
          create: {
            name: typeName,
            category: data.category || 'General',
            icon: data.icon || '📦',
            description: data.description || '',
            isActive: true,
          }
        });
        return res.status(201).json(newType);
      }

      // 2. Upload / Store 3D model file or artwork
      if (data.action === 'upload' || req.query.action === 'upload') {
        const { fileName, fileData, fileType } = data;
        if (!fileData) {
          return res.status(400).json({ error: 'File data is required.' });
        }

        // Validate format: must be GLB, GLTF, or valid image
        const isGLB = fileName?.toLowerCase().endsWith('.glb') || fileType?.includes('gltf-binary');
        const isGLTF = fileName?.toLowerCase().endsWith('.gltf') || fileType?.includes('gltf+json');
        const isImage = fileType?.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(fileName || '');

        if (!isGLB && !isGLTF && !isImage) {
          return res.status(400).json({
            error: 'Unsupported file type. Please upload a .glb, .gltf, .png, or .jpg file.'
          });
        }

        // Size limit validation (25MB in base64 is ~34MB)
        if (fileData.length > 35 * 1024 * 1024) {
          return res.status(400).json({ error: 'File exceeds maximum upload limit of 25MB.' });
        }

        // Validate GLB structure if base64 provided
        if (isGLB && fileData.includes(',')) {
          const rawBase64 = fileData.split(',')[1];
          const header = Buffer.from(rawBase64.substring(0, 16), 'base64').toString('ascii', 0, 4);
          if (header !== 'glTF') {
            return res.status(400).json({
              error: 'Invalid 3D model file. The uploaded file is not a valid GLB binary format.'
            });
          }
        }

        // Return persistent URL (data URL or relative asset path)
        return res.status(200).json({
          success: true,
          url: fileData,
          fileName,
          format: isGLB ? 'glb' : isGLTF ? 'gltf' : 'image',
        });
      }

      // 3. Create New 3D Model
      const {
        name,
        productType,
        productId,
        modelUrl,
        modelFormat,
        previewImage,
        colors,
        sizes,
        basePrice,
        unit,
        status,
        description,
        cameraSettings,
        materialProps,
        printableAreas,
      } = data;

      if (!name || !productType || !modelUrl) {
        return res.status(400).json({
          error: 'Model name, product type, and 3D model URL/file are required.'
        });
      }

      // Ensure product type exists
      await prisma.productType3D.upsert({
        where: { name: productType },
        update: {},
        create: { name: productType, category: 'Custom' }
      });

      // Ensure catalog product exists and is linked
      let finalProductId = productId || null;
      if (!finalProductId) {
        try {
          const cat = await prisma.category.findFirst({
            where: {
              OR: [
                { name: { contains: productType.trim(), mode: 'insensitive' } },
                { audience: 'UNISEX' }
              ]
            }
          }) || await prisma.category.findFirst() || await prisma.category.create({
            data: { name: productType.trim(), audience: 'UNISEX', description: `Category for ${productType}` }
          });

          const sku = `MOD3D-${productType.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8)}-${Date.now().toString(36).toUpperCase()}`;
          const autoProduct = await prisma.product.create({
            data: {
              sku,
              name: name.trim(),
              categoryId: cat.id,
              audience: cat.audience || 'UNISEX',
              description: description || `Customizable 3D ${productType} with high-definition DTF / UV printing.`,
              basePrice: Number(basePrice) || 499,
              salePrice: Number(basePrice) || 499,
              status: status === 'ACTIVE' ? 'ACTIVE' : 'DRAFT',
              isCustomizable: true,
              defaultColor: Array.isArray(colors) && colors[0] ? colors[0] : '#18181b',
              defaultSize: Array.isArray(sizes) && sizes[0] ? sizes[0] : 'L',
              sizes: Array.isArray(sizes) ? JSON.stringify(sizes) : (sizes || JSON.stringify(['S', 'M', 'L', 'XL'])),
              colors: Array.isArray(colors) ? JSON.stringify(colors) : (colors || JSON.stringify(['#18181b', '#ffffff'])),
            }
          });
          finalProductId = autoProduct.id;
        } catch (e) {
          console.warn('Auto-product creation notice:', e);
        }
      }

      // Prepare printable areas creation
      let areasCreate = undefined;
      if (Array.isArray(printableAreas) && printableAreas.length > 0) {
        areasCreate = {
          create: printableAreas.map((pa, idx) => ({
            name: pa.name || `Print Area ${idx + 1}`,
            meshName: pa.meshName || null,
            width: Number(pa.width) || 10,
            height: Number(pa.height) || 12,
            minScale: Number(pa.minScale) || 0.2,
            maxScale: Number(pa.maxScale) || 2.5,
            defaultPosition: typeof pa.defaultPosition === 'object' ? JSON.stringify(pa.defaultPosition) : (pa.defaultPosition || null),
            defaultRotation: Number(pa.defaultRotation) || 0,
            defaultScale: Number(pa.defaultScale) || 1.0,
            bounds: typeof pa.bounds === 'object' ? JSON.stringify(pa.bounds) : (pa.bounds || null),
            priceExtra: Number(pa.priceExtra) || 0,
            allowedColors: Array.isArray(pa.allowedColors) ? JSON.stringify(pa.allowedColors) : (pa.allowedColors || null),
            allowedSizes: Array.isArray(pa.allowedSizes) ? JSON.stringify(pa.allowedSizes) : (pa.allowedSizes || null),
            isEnabled: pa.isEnabled !== false,
            sortOrder: pa.sortOrder ?? idx,
          }))
        };
      }

      const newModel = await prisma.customModel3D.create({
        data: {
          name: name.trim(),
          productType: productType.trim(),
          productId: finalProductId,
          modelUrl,
          modelFormat: modelFormat || 'glb',
          previewImage: previewImage || null,
          colors: JSON.stringify(safeParseColors(colors)),
          sizes: JSON.stringify(safeParseSizes(sizes)),
          basePrice: Number(basePrice) || 0,
          unit: unit || 'inches',
          status: status || 'ACTIVE',
          version: 1,
          description: description || null,
          cameraSettings: typeof cameraSettings === 'object' ? JSON.stringify(cameraSettings) : (cameraSettings || null),
          materialProps: typeof materialProps === 'object' ? JSON.stringify(materialProps) : (materialProps || null),
          printableAreas: areasCreate,
        },
        include: {
          printableAreas: { orderBy: { sortOrder: 'asc' } },
          product: true
        }
      });

      return res.status(201).json({
        ...newModel,
        colors: safeParseColors(newModel.colors),
        sizes: safeParseSizes(newModel.sizes)
      });
    } catch (err) {
      console.error('Failed to create 3D model:', err);
      return res.status(400).json({ error: err.message });
    }
  }

  // ========================================================
  // PATCH: Update Model, Printable Areas, or Status
  // ========================================================
  else if (req.method === 'PATCH') {
    try {
      verifyAdmin(req);
      const urlParts = (req.url || '').split('?')[0].split('/').filter(Boolean);
      const lastPart = urlParts[urlParts.length - 1];
      const targetId = req.query.id || (lastPart !== 'models' ? lastPart : null) || req.body?.id;

      if (!targetId) {
        return res.status(400).json({ error: 'Model ID is required.' });
      }

      const existing = await prisma.customModel3D.findUnique({
        where: { id: targetId },
        include: { printableAreas: true }
      });

      if (!existing) {
        return res.status(404).json({ error: '3D Model not found.' });
      }

      const {
        printableAreas,
        id,
        createdAt,
        updatedAt,
        product,
        ...updateFields
      } = req.body;

      // Handle JSON serialization for arrays/objects
      if (updateFields.colors !== undefined) {
        updateFields.colors = JSON.stringify(safeParseColors(updateFields.colors));
      }
      if (updateFields.sizes !== undefined) {
        updateFields.sizes = JSON.stringify(safeParseSizes(updateFields.sizes));
      }
      if (updateFields.cameraSettings && typeof updateFields.cameraSettings === 'object') {
        updateFields.cameraSettings = JSON.stringify(updateFields.cameraSettings);
      }
      if (updateFields.materialProps && typeof updateFields.materialProps === 'object') {
        updateFields.materialProps = JSON.stringify(updateFields.materialProps);
      }
      if (updateFields.basePrice !== undefined) {
        updateFields.basePrice = Number(updateFields.basePrice);
      }

      // Increment version if model file changed
      if (updateFields.modelUrl && updateFields.modelUrl !== existing.modelUrl) {
        updateFields.version = (existing.version || 1) + 1;
      }

      // Execute update on model
      const updatedModel = await prisma.customModel3D.update({
        where: { id: existing.id },
        data: updateFields,
        include: {
          printableAreas: { orderBy: { sortOrder: 'asc' } },
          product: true
        }
      });

      // Update printable areas if provided
      if (Array.isArray(printableAreas)) {
        // Delete previous areas and recreate
        await prisma.printableArea3D.deleteMany({
          where: { modelId: existing.id }
        });

        for (let idx = 0; idx < printableAreas.length; idx++) {
          const pa = printableAreas[idx];
          await prisma.printableArea3D.create({
            data: {
              modelId: existing.id,
              name: pa.name || `Print Area ${idx + 1}`,
              meshName: pa.meshName || null,
              width: Number(pa.width) || 10,
              height: Number(pa.height) || 12,
              minScale: Number(pa.minScale) || 0.2,
              maxScale: Number(pa.maxScale) || 2.5,
              defaultPosition: typeof pa.defaultPosition === 'object' ? JSON.stringify(pa.defaultPosition) : (pa.defaultPosition || null),
              defaultRotation: Number(pa.defaultRotation) || 0,
              defaultScale: Number(pa.defaultScale) || 1.0,
              bounds: typeof pa.bounds === 'object' ? JSON.stringify(pa.bounds) : (pa.bounds || null),
              priceExtra: Number(pa.priceExtra) || 0,
              allowedColors: Array.isArray(pa.allowedColors) ? JSON.stringify(pa.allowedColors) : (pa.allowedColors || null),
              allowedSizes: Array.isArray(pa.allowedSizes) ? JSON.stringify(pa.allowedSizes) : (pa.allowedSizes || null),
              isEnabled: pa.isEnabled !== false,
              sortOrder: pa.sortOrder ?? idx,
            }
          });
        }
      }

      const finalModel = await prisma.customModel3D.findUnique({
        where: { id: existing.id },
        include: {
          printableAreas: { orderBy: { sortOrder: 'asc' } },
          product: true
        }
      });

      return res.status(200).json({
        ...finalModel,
        colors: safeParseColors(finalModel.colors),
        sizes: safeParseSizes(finalModel.sizes)
      });
    } catch (err) {
      console.error('Failed to update 3D model:', err);
      return res.status(400).json({ error: err.message });
    }
  }

  // ========================================================
  // DELETE: Safe Delete or Deactivate Model
  // ========================================================
  else if (req.method === 'DELETE') {
    try {
      verifyAdmin(req);
      const urlParts = (req.url || '').split('?')[0].split('/').filter(Boolean);
      const lastPart = urlParts[urlParts.length - 1];
      const targetId = req.query.id || (lastPart !== 'models' ? lastPart : null) || req.body?.id;

      if (!targetId) {
        return res.status(400).json({ error: 'Model ID is required.' });
      }

      const existing = await prisma.customModel3D.findUnique({
        where: { id: targetId },
        include: { printableAreas: true }
      });

      if (!existing) {
        return res.status(200).json({ success: true, message: 'Model already deleted or not found.' });
      }

      // Check for historical order snapshots referencing this model
      let isReferenced = false;
      try {
        const matchingOrders = await prisma.orderItem.findFirst({
          where: {
            customization: { contains: existing.id }
          }
        });
        if (matchingOrders) isReferenced = true;

        if (!isReferenced) {
          const matchingRequests = await prisma.designRequest.findFirst({
            where: {
              customization: { contains: existing.id }
            }
          });
          if (matchingRequests) isReferenced = true;
        }
      } catch (checkErr) {
        // Safe check
      }

      // If model has historical orders, deactivate / archive to preserve history
      if (isReferenced || req.query.forceArchive === 'true') {
        await prisma.customModel3D.update({
          where: { id: existing.id },
          data: { status: 'ARCHIVED' }
        });
        return res.status(200).json({
          success: true,
          message: 'Model is referenced by past orders and has been safely archived.',
          archived: true
        });
      }

      // Safe to hard delete if not in historical orders
      await prisma.printableArea3D.deleteMany({
        where: { modelId: existing.id }
      });
      await prisma.customModel3D.delete({
        where: { id: existing.id }
      });

      return res.status(200).json({
        success: true,
        message: '3D Model deleted successfully.',
        deleted: true
      });
    } catch (err) {
      console.error('Failed to delete 3D model:', err);
      return res.status(400).json({ error: err.message });
    }
  }

  // Fallback 405 Method Not Allowed
  else {
    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
