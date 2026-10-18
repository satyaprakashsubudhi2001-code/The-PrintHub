const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('../node_modules/@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://theprinthub.co.in',
  'https://admin.theprinthub.co.in'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next(err);
});

function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (!rc) return list;
  rc.split(';').forEach(function(cookie) {
    const parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });
  return list;
}

function normalizeProductServer(p) {
  if (!p) return p;
  const rawCat = p.category ? (typeof p.category === 'object' ? (p.category.name || p.category.title || 'Apparel') : String(p.category)) : 'Apparel';
  let imageList = [];
  if (Array.isArray(p.images) && p.images.length > 0) {
    imageList = p.images
      .map(img => (typeof img === 'string' ? img : (img?.url || '')))
      .filter(url => typeof url === 'string' && url.trim().length > 0 && !url.startsWith('blob:'));
  } else if (typeof p.image === 'string' && p.image.trim().length > 0 && !p.image.startsWith('blob:')) {
    imageList = [p.image.trim()];
  }

  let primaryImage = '';
  if (Array.isArray(p.images) && p.images.length > 0) {
    const primaryObj = p.images.find(img => typeof img === 'object' && img?.isPrimary && !img?.url?.startsWith('blob:'));
    if (primaryObj?.url) primaryImage = primaryObj.url;
  }
  if (!primaryImage && imageList.length > 0) primaryImage = imageList[0];
  if (!primaryImage && typeof p.image === 'string' && p.image.trim().length > 0 && !p.image.startsWith('blob:')) primaryImage = p.image.trim();
  if (!primaryImage) primaryImage = p.previewImage || p.thumbnail || '/logo-mark-symbol.png';
  if (imageList.length === 0 && primaryImage) imageList = [primaryImage];

  const rawStatus = (p.status || '').toUpperCase();
  const isCurrentlyActive = p.isActive !== false && rawStatus !== 'INACTIVE' && rawStatus !== 'ARCHIVED';

  return {
    ...p,
    category: rawCat,
    categoryName: rawCat,
    categoryObj: typeof p.category === 'object' ? p.category : null,
    image: primaryImage,
    images: imageList,
    status: isCurrentlyActive ? 'ACTIVE' : 'INACTIVE',
    isActive: isCurrentlyActive
  };
}

function calculateInvoiceTotalsServer(items = [], discount = 0, shippingFee = 0, applyGst = true) {
  const validatedItems = (Array.isArray(items) ? items : []).map((it, idx) => {
    const quantity = Math.max(1, Number(it.quantity ?? it.qty) || 1);
    const unitPrice = Math.max(0, Number(it.unitPrice ?? it.rate ?? it.price) || 0);
    const amount = Number((quantity * unitPrice).toFixed(2));
    return {
      sNo: idx + 1,
      description: String(it.description || it.productName || it.name || 'Custom Apparel Item').trim(),
      hsnCode: String(it.hsnCode || '61091000').trim(),
      quantity,
      unitPrice,
      amount
    };
  });

  const subtotal = Number(validatedItems.reduce((acc, it) => acc + it.amount, 0).toFixed(2));
  const numDiscount = Math.max(0, Number(discount) || 0);
  const numShipping = Math.max(0, Number(shippingFee) || 0);

  const taxRate = applyGst ? 0.05 : 0;
  const taxableBase = Math.max(0, subtotal - numDiscount);
  const totalTax = Number((taxableBase * taxRate).toFixed(2));
  const cgst = Number((totalTax / 2).toFixed(2));
  const sgst = Number((totalTax - cgst).toFixed(2));
  const grandTotal = Number((taxableBase + totalTax + numShipping).toFixed(2));

  return {
    validatedItems,
    subtotal,
    discount: numDiscount,
    shippingFee: numShipping,
    taxableAmount: taxableBase,
    cgst,
    sgst,
    igst: 0,
    totalTax,
    grandTotal
  };
}

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PrintHub Backend is running' });
});

// ==========================================
// AUTHENTICATION
// ==========================================
const validEmails = [
  'theprinthub.in@gmail.com',
  'admin@theprinthub.com',
  'admin@theprinthub.in',
  'admin',
];
const validPasswords = [
  'Theprinthub@123',
  'theprinthub@123',
  'ThePrintHub@123',
  'admin123',
  'printhub123',
];

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const rawEmail = (email || '').trim().toLowerCase();
  const rawPass = (password || '').trim();

  const isValidUser = (validEmails.includes(rawEmail) || rawEmail.includes('theprinthub') || rawEmail.includes('admin')) && rawEmail.length > 0;
  const isValidPass = (validPasswords.includes(rawPass) || rawPass.toLowerCase() === 'theprinthub@123') && rawPass.length > 0;

  if (isValidUser && isValidPass) {
    const userObj = {
      name: 'The PrintHub Admin',
      email: rawEmail || 'theprinthub.in@gmail.com',
      role: 'admin',
    };
    res.setHeader('Set-Cookie', 'printhub_admin_token=admin-session-token; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200');
    return res.status(200).json({ success: true, user: userObj });
  }

  return res.status(401).json({ success: false, message: 'Access Denied: Invalid administrator credentials.' });
});

app.post('/api/auth/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'printhub_admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=-1');
  res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/auth/me', (req, res) => {
  const cookies = parseCookies(req);
  if (cookies.printhub_admin_token) {
    return res.json({
      authenticated: true,
      user: { name: 'The PrintHub Admin', email: 'theprinthub.in@gmail.com', role: 'admin' }
    });
  }
  return res.status(401).json({ authenticated: false });
});

// ==========================================
// CATEGORIES (Phase 3)
// ==========================================
app.get('/api/categories', async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true' || req.query.admin === 'true';
    const categories = await prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { name, audience, description, icon, image, isActive, status } = req.body || {};
    const isCatActive = isActive !== undefined ? Boolean(isActive) : (status !== undefined ? (status === 'ACTIVE' || status === true) : true);
    const category = await prisma.category.create({
      data: {
        name: (name || '').trim(),
        audience: audience || 'MAN',
        description: description || '',
        icon: icon || '🏷️',
        image: image || '',
        isActive: isCatActive
      }
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const handleCategoryUpdate = async (targetId, body, res) => {
  try {
    if (!targetId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ id: targetId }, { name: targetId }]
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const { name, audience, description, icon, image, isActive, status } = body || {};
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (audience !== undefined) updateData.audience = audience;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (image !== undefined) updateData.image = image;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (status !== undefined) updateData.isActive = (status === 'ACTIVE' || status === true);

    const category = await prisma.category.update({
      where: { id: existing.id },
      data: updateData
    });
    return res.json(category);
  } catch (err) {
    console.error('Category update error in server:', err);
    return res.status(400).json({ error: err.message });
  }
};

app.patch('/api/categories/:id', async (req, res) => {
  await handleCategoryUpdate(req.params.id, req.body, res);
});

app.patch('/api/categories', async (req, res) => {
  const targetId = req.query.id || req.body?.id;
  await handleCategoryUpdate(targetId, req.body, res);
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ id: id }, { name: id }]
      }
    });

    if (!existing) {
      return res.json({ success: true, message: 'Category already deleted or not found' });
    }

    try {
      await prisma.category.delete({ where: { id: existing.id } });
    } catch (relErr) {
      await prisma.category.update({
        where: { id: existing.id },
        data: { isActive: false }
      });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/categories', async (req, res) => {
  try {
    const targetId = req.query.id || req.body?.id;
    if (targetId) {
      const existing = await prisma.category.findFirst({
        where: {
          OR: [{ id: targetId }, { name: targetId }]
        }
      });

      if (!existing) {
        return res.json({ success: true, message: 'Category already deleted or not found' });
      }

      try {
        await prisma.category.delete({ where: { id: existing.id } });
      } catch (relErr) {
        await prisma.category.update({
          where: { id: existing.id },
          data: { isActive: false }
        });
      }
      return res.json({ success: true, message: 'Category deleted successfully' });
    }

    try {
      await prisma.category.deleteMany({});
    } catch (relErr) {
      await prisma.category.updateMany({
        data: { isActive: false }
      });
    }
    res.json({ success: true, message: 'All categories cleared' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// PRODUCTS (Phase 4)
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
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
    res.json(products.map(normalizeProductServer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
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

    const sku = productData.sku || `SKU-${Date.now().toString(36).toUpperCase()}`;
    const audience = productData.audience || 'UNISEX';

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
        sizes: Array.isArray(productData.sizes) ? JSON.stringify(productData.sizes) : (productData.sizes || '["S","M","L","XL"]'),
        colors: Array.isArray(productData.colors) ? JSON.stringify(productData.colors) : (productData.colors || '[]'),
        features: productData.features ? JSON.stringify(productData.features) : null,
        images: imageCreate,
        inventory: inventoryCreate
      },
      include: { images: { orderBy: { sortOrder: 'asc' } }, inventory: true, category: true }
    });
    res.status(201).json(normalizeProductServer(product));
  } catch (err) {
    console.error('Server product creation error:', err);
    res.status(400).json({ error: err.message });
  }
});

const handleProductUpdateServer = async (targetId, body, res) => {
  try {
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

    const { images, inventory, id, category, categoryKey, printAreas, defaultPrintArea, tags, stock, price, compareAtPrice, ...rawProductData } = body || {};

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
    if (rawProductData.colors !== undefined) {
      updateData.colors = Array.isArray(rawProductData.colors) ? JSON.stringify(rawProductData.colors) : String(rawProductData.colors);
    }
    if (rawProductData.sizes !== undefined) {
      updateData.sizes = Array.isArray(rawProductData.sizes) ? JSON.stringify(rawProductData.sizes) : String(rawProductData.sizes);
    }
    if (rawProductData.features !== undefined) updateData.features = JSON.stringify(rawProductData.features);
    if (categoryId) updateData.categoryId = categoryId;

    // Update ProductImage records if images array is passed
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

    // Update inventory if stock is provided
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
    return res.json(normalizeProductServer(product));
  } catch (err) {
    console.error('Server product update error:', err);
    return res.status(400).json({ error: err.message });
  }
};

app.patch('/api/products/:id', async (req, res) => {
  await handleProductUpdateServer(req.params.id, req.body, res);
});

app.patch('/api/products', async (req, res) => {
  const targetId = req.query.id || req.body?.id;
  await handleProductUpdateServer(targetId, req.body, res);
});

// ==========================================
// INVOICES (Issue 4)
// ==========================================
async function generateInvoiceNumberServer() {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  const latest = await prisma.invoice.findFirst({
    where: { invoiceNumber: { startsWith: prefix } },
    orderBy: { invoiceNumber: 'desc' },
    select: { invoiceNumber: true }
  });

  let nextSequence = 1;
  if (latest?.invoiceNumber) {
    const parts = latest.invoiceNumber.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastNum)) nextSequence = lastNum + 1;
  }
  return `${prefix}${String(nextSequence).padStart(4, '0')}`;
}

app.get('/api/invoices', async (req, res) => {
  try {
    const { search, status, paymentStatus, orderId } = req.query;
    const whereClause = {};

    if (status && status !== 'ALL') whereClause.status = status;
    if (paymentStatus && paymentStatus !== 'ALL') whereClause.paymentStatus = paymentStatus;
    if (orderId) whereClause.orderId = orderId;

    if (search && search.trim()) {
      const q = search.trim();
      whereClause.OR = [
        { invoiceNumber: { contains: q, mode: 'insensitive' } },
        { customerName: { contains: q, mode: 'insensitive' } },
        { customerEmail: { contains: q, mode: 'insensitive' } },
        { customerPhone: { contains: q, mode: 'insensitive' } },
        { orderId: { contains: q, mode: 'insensitive' } }
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: { order: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(invoices.map(inv => ({
      ...inv,
      items: JSON.parse(inv.itemsJson || '[]'),
      history: JSON.parse(inv.historyJson || '[]')
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoice.findFirst({
      where: {
        OR: [{ id }, { invoiceNumber: id }]
      },
      include: { order: true }
    });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json({
      ...invoice,
      items: JSON.parse(invoice.itemsJson || '[]'),
      history: JSON.parse(invoice.historyJson || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/invoices', async (req, res) => {
  try {
    const data = req.body || {};
    let orderRecord = null;
    if (data.orderId) {
      orderRecord = await prisma.order.findUnique({
        where: { id: data.orderId },
        include: { items: { include: { product: true } }, customer: true }
      });
    }

    const invoiceNumber = data.invoiceNumber && data.invoiceNumber.trim()
      ? data.invoiceNumber.trim()
      : await generateInvoiceNumberServer();

    const existing = await prisma.invoice.findUnique({ where: { invoiceNumber } });
    if (existing) {
      return res.status(400).json({ error: `Invoice number "${invoiceNumber}" already exists.` });
    }

    const customerName = data.customerName || orderRecord?.customer?.name || 'Valued Customer';
    const customerEmail = data.customerEmail || orderRecord?.customer?.email || '';
    const customerPhone = data.customerPhone || orderRecord?.customer?.phone || '';
    const billingAddress = data.billingAddress || orderRecord?.notes || 'Customer Atelier Address';

    let rawItems = data.items;
    if (!rawItems || rawItems.length === 0) {
      if (orderRecord?.items?.length > 0) {
        rawItems = orderRecord.items.map(oi => ({
          description: `${oi.product?.name || 'Custom Apparel'} (Qty: ${oi.quantity})`,
          quantity: oi.quantity,
          unitPrice: oi.unitPrice,
          amount: oi.totalPrice
        }));
      } else {
        rawItems = [{ description: 'Custom Print Merchandise', quantity: 1, unitPrice: data.grandTotal || 499, amount: data.grandTotal || 499 }];
      }
    }

    const discount = data.discount ?? data.discountAmount ?? orderRecord?.discount ?? 0;
    const shippingFee = data.shippingFee ?? data.shippingCharges ?? data.shipping ?? orderRecord?.shipping ?? 0;
    const totals = calculateInvoiceTotalsServer(rawItems, discount, shippingFee, data.applyGst !== false);

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: orderRecord?.id || data.orderId || null,
        status: data.status || 'ISSUED',
        invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : new Date(),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        customerName,
        customerEmail,
        customerPhone,
        billingAddress,
        storeName: data.storeName || 'The PrintHub Central Atelier',
        storeAddress: data.storeAddress || 'Plot 42, Textile Technology Park, Sector 18, Gurugram, Haryana 122015, India',
        storePhone: data.storePhone || '+91 79928 01158',
        storeEmail: data.storeEmail || 'theprinthub.in@gmail.com',
        storeGstin: data.storeGstin || '06AAACT1984Q1Z8',
        subtotal: totals.subtotal,
        discount: totals.discount,
        shippingFee: totals.shippingFee,
        taxableAmount: totals.taxableAmount,
        cgst: totals.cgst,
        sgst: totals.sgst,
        igst: totals.igst,
        totalTax: totals.totalTax,
        grandTotal: totals.grandTotal,
        paymentStatus: data.paymentStatus || (orderRecord?.paymentStatus === 'PAID' ? 'PAID' : 'UNPAID'),
        paymentMethod: data.paymentMethod || 'UPI',
        paymentRef: data.paymentRef || (orderRecord?.id ? `ORD-${orderRecord.id}` : null),
        itemsJson: JSON.stringify(totals.validatedItems),
        notes: data.notes || '',
        historyJson: JSON.stringify([
          {
            timestamp: new Date().toISOString(),
            action: 'CREATED',
            status: data.status || 'ISSUED',
            grandTotal: totals.grandTotal,
            user: 'Administrator'
          }
        ])
      },
      include: { order: true }
    });

    res.status(201).json({
      ...invoice,
      items: totals.validatedItems,
      history: JSON.parse(invoice.historyJson)
    });
  } catch (err) {
    console.error('Invoice creation error in server:', err);
    res.status(400).json({ error: err.message });
  }
});

const handleInvoiceUpdateServer = async (targetId, body, res) => {
  try {
    if (!targetId) return res.status(400).json({ error: 'Invoice ID is required' });
    const existing = await prisma.invoice.findFirst({
      where: {
        OR: [{ id: targetId }, { invoiceNumber: targetId }]
      }
    });
    if (!existing) return res.status(404).json({ error: 'Invoice not found' });

    const data = body || {};
    const wasIssued = existing.status === 'ISSUED';
    const itemsToCalculate = data.items || JSON.parse(existing.itemsJson || '[]');
    const discount = data.discount !== undefined ? data.discount : (data.discountAmount !== undefined ? data.discountAmount : existing.discount);
    const shippingFee = data.shippingFee !== undefined ? data.shippingFee : (data.shippingCharges !== undefined ? data.shippingCharges : (data.shipping !== undefined ? data.shipping : existing.shippingFee));
    const totals = calculateInvoiceTotalsServer(itemsToCalculate, discount, shippingFee, true);

    const history = JSON.parse(existing.historyJson || '[]');
    history.push({
      timestamp: new Date().toISOString(),
      action: wasIssued ? 'MODIFIED_AFTER_ISSUANCE' : 'UPDATED_DRAFT',
      previousGrandTotal: existing.grandTotal,
      newGrandTotal: totals.grandTotal,
      reason: data.modificationReason || (wasIssued ? 'Material update to issued invoice' : 'Draft edit')
    });

    const updateData = {
      subtotal: totals.subtotal,
      discount: totals.discount,
      shippingFee: totals.shippingFee,
      taxableAmount: totals.taxableAmount,
      cgst: totals.cgst,
      sgst: totals.sgst,
      totalTax: totals.totalTax,
      grandTotal: totals.grandTotal,
      itemsJson: JSON.stringify(totals.validatedItems),
      historyJson: JSON.stringify(history)
    };

    if (data.status !== undefined) updateData.status = data.status;
    if (data.paymentStatus !== undefined) updateData.paymentStatus = data.paymentStatus;
    if (data.paymentMethod !== undefined) updateData.paymentMethod = data.paymentMethod;
    if (data.paymentRef !== undefined || data.paymentReference !== undefined) updateData.paymentRef = data.paymentRef || data.paymentReference;
    if (data.customerName !== undefined) updateData.customerName = data.customerName;
    if (data.customerEmail !== undefined) updateData.customerEmail = data.customerEmail;
    if (data.customerPhone !== undefined) updateData.customerPhone = data.customerPhone;
    if (data.billingAddress !== undefined) updateData.billingAddress = data.billingAddress;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.invoiceDate !== undefined) updateData.invoiceDate = new Date(data.invoiceDate);
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;

    const updated = await prisma.invoice.update({
      where: { id: existing.id },
      data: updateData,
      include: { order: true }
    });

    res.json({
      ...updated,
      items: totals.validatedItems,
      history
    });
  } catch (err) {
    console.error('Invoice update error in server:', err);
    res.status(400).json({ error: err.message });
  }
};

app.patch('/api/invoices/:id', async (req, res) => {
  await handleInvoiceUpdateServer(req.params.id, req.body, res);
});

app.patch('/api/invoices', async (req, res) => {
  const targetId = req.query.id || req.body?.id;
  await handleInvoiceUpdateServer(targetId, req.body, res);
});

app.delete('/api/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.invoice.findFirst({
      where: { OR: [{ id }, { invoiceNumber: id }] }
    });
    if (!existing) return res.json({ success: true, message: 'Invoice not found' });
    if (existing.status === 'DRAFT') {
      await prisma.invoice.delete({ where: { id: existing.id } });
    } else {
      await prisma.invoice.update({
        where: { id: existing.id },
        data: { status: 'CANCELLED' }
      });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ id: id }, { sku: id }, { name: id }]
      }
    });

    if (!existing) {
      return res.json({ success: true, message: 'Product already deleted or not found' });
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

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/products', async (req, res) => {
  try {
    const targetId = req.query.id || req.body?.id;
    if (targetId) {
      const existing = await prisma.product.findFirst({
        where: {
          OR: [{ id: targetId }, { sku: targetId }, { name: targetId }]
        }
      });

      if (!existing) {
        return res.json({ success: true, message: 'Product already deleted or not found' });
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

      return res.json({ success: true, message: 'Product deleted successfully' });
    }

    try {
      await prisma.productImage.deleteMany({});
      await prisma.inventory.deleteMany({});
      await prisma.product.deleteMany({});
    } catch (delErr) {
      await prisma.product.updateMany({
        data: { status: 'ARCHIVED' }
      });
    }
    res.json({ success: true, message: 'All products cleared' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// DESIGN REQUESTS (Phase 6 & 9)
// ==========================================
app.get('/api/design-requests', async (req, res) => {
  try {
    const requests = await prisma.designRequest.findMany({
      include: { customer: true, product: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/design-requests', async (req, res) => {
  try {
    const data = req.body;
    const { customer, product, color, size, printMethod, placements, artworkFiles, textLayers, mockups, status, adminNotes, notes } = data;
    
    // Create or find customer (simplified for now, using phone as unique)
    const dbCustomer = await prisma.customer.upsert({
      where: { phone: customer.phone },
      update: { name: customer.name, email: customer.email },
      create: { name: customer.name, phone: customer.phone, email: customer.email, company: customer.company }
    });

    // Generate Request ID (e.g., PH-2026-00001)
    const currentYear = new Date().getFullYear();
    const count = await prisma.designRequest.count();
    const nextNum = count + 1;
    const padded = String(nextNum).padStart(5, '0');
    const generatedId = `PH-${currentYear}-${padded}`;

    const customization = JSON.stringify({ color, size, printMethod, placements, textLayers });
    const artworkUrls = JSON.stringify(artworkFiles);
    const mockupUrls = JSON.stringify(mockups);

    const newRequest = await prisma.designRequest.create({
      data: {
        id: generatedId,
        customerId: dbCustomer.id,
        productId: product.id,
        status: status || 'NEW',
        customization,
        artworkUrls,
        mockupUrls,
        notes,
        adminNotes,
      },
      include: { customer: true, product: true }
    });
    
    // Remap for frontend compatibility
    const responsePayload = {
      ...newRequest,
      customization: JSON.parse(newRequest.customization || '{}'),
      artworkFiles: JSON.parse(newRequest.artworkUrls || '[]'),
      mockups: JSON.parse(newRequest.mockupUrls || '[]'),
      product,
      color, size, printMethod, placements, textLayers // spread out for direct access in frontend
    };

    res.status(201).json(responsePayload);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/design-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const request = await prisma.designRequest.update({
      where: { id },
      data,
      include: { customer: true, product: true }
    });
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// ORDERS (Phase 11)
// ==========================================
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { customer: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const data = req.body;
    const { customer, items, ...orderData } = data;
    
    const dbCustomer = await prisma.customer.upsert({
      where: { phone: customer.phone },
      update: { name: customer.name },
      create: { name: customer.name, phone: customer.phone }
    });

    const order = await prisma.order.create({
      data: {
        ...orderData,
        customerId: dbCustomer.id,
        items: {
          create: items
        }
      },
      include: { customer: true, items: true }
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const order = await prisma.order.update({
      where: { id },
      data
    });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// CUSTOMERS (Phase 10)
// ==========================================
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: { orders: true, designRequests: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// INVENTORY (Phase 12)
// ==========================================
app.get('/api/inventory', async (req, res) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: { product: true, transactions: true },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inventory/transactions', async (req, res) => {
  try {
    const data = req.body;
    // Expects: { inventoryId, type, quantity, reason, unitCost }
    
    // Run inside a transaction to update the inventory balance as well
    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.inventoryTransaction.create({ data });
      
      const inventory = await tx.inventory.findUnique({ where: { id: data.inventoryId } });
      const newQuantity = inventory.quantity + data.quantity;
      
      await tx.inventory.update({
        where: { id: data.inventoryId },
        data: { quantity: newQuantity }
      });
      
      return transaction;
    });
    
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// EXPENSES (Phase 13)
// ==========================================
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const data = req.body;
    const expense = await prisma.expense.create({ data });
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// INVOICES (Phase 13 / Issue 4)
// ==========================================
async function generateInvoiceNumberServer() {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  const latest = await prisma.invoice.findFirst({
    where: { invoiceNumber: { startsWith: prefix } },
    orderBy: { invoiceNumber: 'desc' },
    select: { invoiceNumber: true }
  });
  let nextSequence = 1;
  if (latest?.invoiceNumber) {
    const parts = latest.invoiceNumber.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastNum)) {
      nextSequence = lastNum + 1;
    }
  }
  return `${prefix}${String(nextSequence).padStart(4, '0')}`;
}

app.get(['/api/invoices', '/api/invoices/:id'], async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  try {
    const targetId = req.params.id || req.query.id;
    if (targetId) {
      const invoice = await prisma.invoice.findFirst({
        where: {
          OR: [
            { id: targetId },
            { invoiceNumber: targetId }
          ]
        },
        include: { order: true }
      });
      if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
      return res.json({
        ...invoice,
        items: JSON.parse(invoice.itemsJson || '[]'),
        history: JSON.parse(invoice.historyJson || '[]')
      });
    }

    const { search, status, paymentStatus, orderId } = req.query;
    const whereClause = {};
    if (status && status !== 'ALL') whereClause.status = status;
    if (paymentStatus && paymentStatus !== 'ALL') whereClause.paymentStatus = paymentStatus;
    if (orderId) whereClause.orderId = orderId;
    if (search && search.trim()) {
      const q = search.trim();
      whereClause.OR = [
        { invoiceNumber: { contains: q, mode: 'insensitive' } },
        { customerName: { contains: q, mode: 'insensitive' } },
        { customerEmail: { contains: q, mode: 'insensitive' } },
        { customerPhone: { contains: q, mode: 'insensitive' } },
        { orderId: { contains: q, mode: 'insensitive' } }
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: { order: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(invoices.map(inv => ({
      ...inv,
      items: JSON.parse(inv.itemsJson || '[]'),
      history: JSON.parse(inv.historyJson || '[]')
    })));
  } catch (err) {
    console.error('Invoice GET error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/invoices', async (req, res) => {
  try {
    const data = req.body || {};
    let orderRecord = null;
    if (data.orderId) {
      orderRecord = await prisma.order.findUnique({
        where: { id: data.orderId },
        include: { items: { include: { product: true } } }
      });
    }

    const contactRecord = await prisma.homepageContent.findUnique({
      where: { key: 'contact_settings' }
    });
    const storeSettings = contactRecord?.content ? JSON.parse(contactRecord.content) : {};

    const storeSnapshot = {
      storeName: 'The PrintHub Atelier',
      legalEntity: 'The PrintHub Custom Merchandise Pvt Ltd',
      address: storeSettings.address || 'Atelier Plot 42, Print District, Lower Parel, Mumbai, MH 400013',
      phone: storeSettings.phone || storeSettings.whatsapp || '+91 79928 01158',
      email: storeSettings.email || storeSettings.gmail || 'theprinthub.in@gmail.com',
      gstin: storeSettings.gstin || '27AAACT0000A1Z5',
      state: 'Maharashtra',
      stateCode: '27'
    };

    let customerSnapshot = {
      customerName: (data.customerName || orderRecord?.customerName || 'Direct Store Client').trim(),
      customerEmail: (data.customerEmail || orderRecord?.customerEmail || '').trim(),
      customerPhone: (data.customerPhone || orderRecord?.customerPhone || '').trim(),
      billingAddress: data.billingAddress || orderRecord?.billingAddress || orderRecord?.shippingAddress || {
        street: 'Direct Atelier Walk-in / Digital Order',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400013',
        country: 'India'
      }
    };

    let lineItems = [];
    if (Array.isArray(data.items) && data.items.length > 0) {
      lineItems = data.items;
    } else if (orderRecord?.items && orderRecord.items.length > 0) {
      lineItems = orderRecord.items.map((it) => ({
        description: it.product?.name || `Apparel Item (${it.size || 'M'}, ${it.color || 'Standard'})`,
        hsnCode: '61091000',
        quantity: it.quantity || 1,
        unitPrice: it.price || 0,
        amount: Number(((it.quantity || 1) * (it.price || 0)).toFixed(2))
      }));
    } else {
      lineItems = [{
        description: 'Custom Apparel Print Order',
        hsnCode: '61091000',
        quantity: 1,
        unitPrice: Number(data.subtotal || data.grandTotal || 499),
        amount: Number(data.subtotal || data.grandTotal || 499)
      }];
    }

    const discount = Number(data.discount) || 0;
    const shippingFee = Number(data.shippingFee) || 0;
    const applyGst = data.applyGst !== false;
    const calculated = calculateInvoiceTotalsServer(lineItems, discount, shippingFee, applyGst);

    const invoiceNumber = await generateInvoiceNumberServer();

    const created = await prisma.invoice.create({
      data: {
        invoiceNumber,
        invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : new Date(),
        dueDate: data.dueDate ? new Date(data.dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: data.status === 'ISSUED' ? 'ISSUED' : (data.status || 'DRAFT'),
        paymentStatus: data.paymentStatus || (orderRecord?.paymentStatus === 'PAID' ? 'PAID' : 'PENDING'),
        paymentMethod: data.paymentMethod || 'Razorpay / UPI / NetBanking',
        paymentReference: data.paymentReference || null,
        orderId: data.orderId || null,
        customerName: customerSnapshot.customerName,
        customerEmail: customerSnapshot.customerEmail,
        customerPhone: customerSnapshot.customerPhone,
        billingAddress: typeof customerSnapshot.billingAddress === 'object' ? customerSnapshot.billingAddress : { raw: customerSnapshot.billingAddress },
        shippingAddress: data.shippingAddress ? (typeof data.shippingAddress === 'object' ? data.shippingAddress : { raw: data.shippingAddress }) : undefined,
        storeSnapshot,
        customerSnapshot,
        itemsJson: JSON.stringify(calculated.validatedItems),
        subtotal: calculated.subtotal,
        discount: calculated.discount,
        shippingFee: calculated.shippingFee,
        taxableAmount: calculated.taxableAmount,
        cgst: calculated.cgst,
        sgst: calculated.sgst,
        igst: 0,
        totalTax: calculated.totalTax,
        grandTotal: calculated.grandTotal,
        notes: data.notes || 'Thank you for choosing The PrintHub Atelier.',
        terms: data.terms || 'All custom printed apparel is checked for quality assurance before dispatch. In case of manufacturing defects, notify within 48 hours.',
        historyJson: JSON.stringify([{
          action: 'CREATED',
          timestamp: new Date().toISOString(),
          actor: 'Administrator',
          details: `Invoice initialized as ${data.status || 'DRAFT'}`
        }])
      },
      include: { order: true }
    });

    res.status(201).json({
      ...created,
      items: calculated.validatedItems,
      history: JSON.parse(created.historyJson || '[]')
    });
  } catch (err) {
    console.error('Invoice POST error:', err);
    res.status(400).json({ error: err.message });
  }
});

app.patch(['/api/invoices', '/api/invoices/:id'], async (req, res) => {
  try {
    const targetId = req.params.id || req.query.id || req.body?.id;
    if (!targetId) return res.status(400).json({ error: 'Invoice ID is required' });

    const existing = await prisma.invoice.findFirst({
      where: {
        OR: [
          { id: targetId },
          { invoiceNumber: targetId }
        ]
      }
    });

    if (!existing) return res.status(404).json({ error: 'Invoice not found' });

    const data = req.body || {};
    let lineItems = existing.itemsJson ? JSON.parse(existing.itemsJson) : [];
    if (Array.isArray(data.items) && data.items.length > 0) {
      lineItems = data.items;
    }

    const discount = data.discount !== undefined ? Number(data.discount) : existing.discount;
    const shippingFee = data.shippingFee !== undefined ? Number(data.shippingFee) : existing.shippingFee;
    const applyGst = data.applyGst !== undefined ? Boolean(data.applyGst) : (existing.totalTax > 0);
    const calculated = calculateInvoiceTotalsServer(lineItems, discount, shippingFee, applyGst);

    const history = existing.historyJson ? JSON.parse(existing.historyJson) : [];
    const changeSummary = [];

    if (existing.status === 'ISSUED' && data.status === 'ISSUED') {
      changeSummary.push(`Issued invoice modified. Subtotal: ₹${existing.subtotal} -> ₹${calculated.subtotal}, Grand Total: ₹${existing.grandTotal} -> ₹${calculated.grandTotal}`);
    } else if (existing.status === 'DRAFT' && data.status === 'ISSUED') {
      changeSummary.push('Draft finalized and issued officially');
    }
    if (data.paymentStatus && data.paymentStatus !== existing.paymentStatus) {
      changeSummary.push(`Payment status changed: ${existing.paymentStatus} -> ${data.paymentStatus}`);
    }

    if (changeSummary.length > 0) {
      history.push({
        action: 'UPDATED',
        timestamp: new Date().toISOString(),
        actor: 'Administrator',
        details: changeSummary.join('; '),
        previousSnapshot: {
          subtotal: existing.subtotal,
          grandTotal: existing.grandTotal,
          status: existing.status,
          paymentStatus: existing.paymentStatus
        }
      });
    }

    const updatePayload = {
      itemsJson: JSON.stringify(calculated.validatedItems),
      subtotal: calculated.subtotal,
      discount: calculated.discount,
      shippingFee: calculated.shippingFee,
      taxableAmount: calculated.taxableAmount,
      cgst: calculated.cgst,
      sgst: calculated.sgst,
      igst: 0,
      totalTax: calculated.totalTax,
      grandTotal: calculated.grandTotal,
      historyJson: JSON.stringify(history)
    };

    if (data.status) updatePayload.status = data.status;
    if (data.paymentStatus) updatePayload.paymentStatus = data.paymentStatus;
    if (data.paymentMethod) updatePayload.paymentMethod = data.paymentMethod;
    if (data.paymentReference !== undefined) updatePayload.paymentReference = data.paymentReference;
    if (data.customerName) updatePayload.customerName = data.customerName.trim();
    if (data.customerEmail) updatePayload.customerEmail = data.customerEmail.trim();
    if (data.customerPhone) updatePayload.customerPhone = data.customerPhone.trim();
    if (data.billingAddress) updatePayload.billingAddress = typeof data.billingAddress === 'object' ? data.billingAddress : { raw: data.billingAddress };
    if (data.notes !== undefined) updatePayload.notes = data.notes;
    if (data.terms !== undefined) updatePayload.terms = data.terms;
    if (data.invoiceDate) updatePayload.invoiceDate = new Date(data.invoiceDate);
    if (data.dueDate) updatePayload.dueDate = new Date(data.dueDate);

    const updated = await prisma.invoice.update({
      where: { id: existing.id },
      data: updatePayload,
      include: { order: true }
    });

    res.json({
      ...updated,
      items: calculated.validatedItems,
      history
    });
  } catch (err) {
    console.error('Invoice PATCH error:', err);
    res.status(400).json({ error: err.message });
  }
});

app.delete(['/api/invoices', '/api/invoices/:id'], async (req, res) => {
  try {
    const targetId = req.params.id || req.query.id || req.body?.id;
    if (!targetId) return res.status(400).json({ error: 'Invoice ID is required' });

    const existing = await prisma.invoice.findFirst({
      where: {
        OR: [
          { id: targetId },
          { invoiceNumber: targetId }
        ]
      }
    });

    if (!existing) return res.status(404).json({ error: 'Invoice not found' });

    if (existing.status === 'ISSUED') {
      const history = existing.historyJson ? JSON.parse(existing.historyJson) : [];
      history.push({
        action: 'VOIDED',
        timestamp: new Date().toISOString(),
        actor: 'Administrator',
        details: 'Invoice marked VOID by administrator'
      });
      const voided = await prisma.invoice.update({
        where: { id: existing.id },
        data: {
          status: 'VOID',
          historyJson: JSON.stringify(history)
        }
      });
      return res.json({ success: true, message: 'Issued invoice voided for audit compliance', invoice: voided });
    }

    await prisma.invoice.delete({ where: { id: existing.id } });
    res.json({ success: true, message: 'Draft invoice deleted successfully' });
  } catch (err) {
    console.error('Invoice DELETE error:', err);
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// 3D MODELS & PRINTABLE AREAS
// ==========================================
app.get(['/api/models', '/api/models/:id'], async (req, res) => {
  try {
    const modelId = req.params.id || req.query.id;
    if (req.query.productTypes === 'true' || req.query.types === 'true') {
      const types = await prisma.productType3D.findMany({ orderBy: { name: 'asc' } });
      return res.json(types);
    }
    if (modelId) {
      const model = await prisma.customModel3D.findUnique({
        where: { id: modelId },
        include: { printableAreas: { orderBy: { sortOrder: 'asc' } }, product: true }
      });
      if (!model) return res.status(404).json({ error: '3D Model not found' });
      return res.json(model);
    }
    const whereCondition = req.query.customerOnly === 'true' ? { status: 'ACTIVE' } : {};
    if (req.query.productType) whereCondition.productType = req.query.productType;
    const models = await prisma.customModel3D.findMany({
      where: whereCondition,
      include: { printableAreas: { orderBy: { sortOrder: 'asc' } }, product: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/models', async (req, res) => {
  try {
    const data = req.body || {};
    if (data.action === 'product-type') {
      const newType = await prisma.productType3D.upsert({
        where: { name: (data.name || '').trim() },
        update: { category: data.category || 'General', icon: data.icon || '📦', description: data.description || '', isActive: true },
        create: { name: (data.name || '').trim(), category: data.category || 'General', icon: data.icon || '📦', description: data.description || '', isActive: true }
      });
      return res.status(201).json(newType);
    }
    if (data.action === 'upload') {
      return res.json({ success: true, url: data.fileData, fileName: data.fileName, format: 'glb' });
    }
    const { name, productType, productId, modelUrl, modelFormat, previewImage, colors, sizes, basePrice, unit, status, description, cameraSettings, materialProps, printableAreas } = data;
    const newModel = await prisma.customModel3D.create({
      data: {
        name: (name || '').trim(),
        productType: (productType || '').trim(),
        productId: productId || null,
        modelUrl: modelUrl || '/models/tshirt.glb',
        modelFormat: modelFormat || 'glb',
        previewImage: previewImage || null,
        colors: Array.isArray(colors) ? JSON.stringify(colors) : (colors || '[]'),
        sizes: Array.isArray(sizes) ? JSON.stringify(sizes) : (sizes || '[]'),
        basePrice: Number(basePrice) || 0,
        unit: unit || 'inches',
        status: status || 'ACTIVE',
        version: 1,
        description: description || null,
        cameraSettings: typeof cameraSettings === 'object' ? JSON.stringify(cameraSettings) : (cameraSettings || null),
        materialProps: typeof materialProps === 'object' ? JSON.stringify(materialProps) : (materialProps || null),
        printableAreas: Array.isArray(printableAreas) && printableAreas.length > 0 ? {
          create: printableAreas.map((pa, idx) => ({
            name: pa.name || `Area ${idx + 1}`,
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
            sortOrder: idx
          }))
        } : undefined
      },
      include: { printableAreas: true, product: true }
    });
    res.status(201).json(newModel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch(['/api/models', '/api/models/:id'], async (req, res) => {
  try {
    const targetId = req.params.id || req.query.id || req.body?.id;
    if (!targetId) return res.status(400).json({ error: 'Model ID is required' });
    const { printableAreas, id, product, ...updateFields } = req.body;
    if (updateFields.colors && Array.isArray(updateFields.colors)) updateFields.colors = JSON.stringify(updateFields.colors);
    if (updateFields.sizes && Array.isArray(updateFields.sizes)) updateFields.sizes = JSON.stringify(updateFields.sizes);
    const updated = await prisma.customModel3D.update({
      where: { id: targetId },
      data: updateFields,
      include: { printableAreas: true, product: true }
    });
    if (Array.isArray(printableAreas)) {
      await prisma.printableArea3D.deleteMany({ where: { modelId: targetId } });
      for (let idx = 0; idx < printableAreas.length; idx++) {
        const pa = printableAreas[idx];
        await prisma.printableArea3D.create({
          data: {
            modelId: targetId,
            name: pa.name || `Area ${idx + 1}`,
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
            isEnabled: pa.isEnabled !== false,
            sortOrder: idx
          }
        });
      }
    }
    const finalModel = await prisma.customModel3D.findUnique({
      where: { id: targetId },
      include: { printableAreas: true, product: true }
    });
    res.json(finalModel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete(['/api/models', '/api/models/:id'], async (req, res) => {
  try {
    const targetId = req.params.id || req.query.id || req.body?.id;
    if (!targetId) return res.status(400).json({ error: 'Model ID is required' });
    await prisma.printableArea3D.deleteMany({ where: { modelId: targetId } });
    await prisma.customModel3D.delete({ where: { id: targetId } });
    res.json({ success: true, message: '3D Model deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// STORE & CONTACT SETTINGS
// ==========================================
const DEFAULT_CONTACT_SETTINGS = {
  whatsapp: '+91 79928 01158',
  whatsappCatalog: 'https://wa.me/c/917992801158',
  instagram: 'https://instagram.com/theprinthub',
  facebook: 'https://facebook.com/theprinthub',
  gmail: 'theprinthub.in@gmail.com',
  googleMaps: 'https://maps.google.com/?q=The+PrintHub+Studio+Mumbai',
  phone: '+91 79928 01158',
  email: 'theprinthub.in@gmail.com',
  address: 'Atelier Plot 42, Print District, Lower Parel, Mumbai, MH 400013',
  hours: 'Mon - Sat: 10:00 AM - 8:30 PM (Sun Closed)',
  slaGuarantee: '48-Hour Rush Production & Dispatch Guarantee',
};

app.get('/api/settings', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  try {
    const record = await prisma.homepageContent.findUnique({
      where: { key: 'contact_settings' }
    });
    if (!record || !record.content) {
      return res.json(DEFAULT_CONTACT_SETTINGS);
    }
    const parsed = JSON.parse(record.content);
    return res.json({ ...DEFAULT_CONTACT_SETTINGS, ...parsed });
  } catch (err) {
    console.error('Settings GET error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const incoming = req.body?.settings || req.body;
    if (!incoming || typeof incoming !== 'object') {
      return res.status(400).json({ error: 'Valid settings object is required' });
    }

    const existing = await prisma.homepageContent.findUnique({
      where: { key: 'contact_settings' }
    });

    let currentData = DEFAULT_CONTACT_SETTINGS;
    if (existing && existing.content) {
      try {
        currentData = { ...DEFAULT_CONTACT_SETTINGS, ...JSON.parse(existing.content) };
      } catch (e) {}
    }

    const merged = { ...currentData, ...incoming };

    const upserted = await prisma.homepageContent.upsert({
      where: { key: 'contact_settings' },
      update: { content: JSON.stringify(merged) },
      create: { key: 'contact_settings', content: JSON.stringify(merged) }
    });

    res.json({ success: true, message: 'Settings saved', settings: merged, updatedAt: upserted.updatedAt });
  } catch (err) {
    console.error('Settings POST error:', err);
    res.status(400).json({ error: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`PrintHub Backend API running on port ${PORT}`);
});
