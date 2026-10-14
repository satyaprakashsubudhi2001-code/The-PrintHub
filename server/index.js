const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

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
app.use(express.json());

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
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { name, audience, description, icon, image } = req.body;
    const category = await prisma.category.create({
      data: { name, audience, description, icon, image }
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const category = await prisma.category.update({
      where: { id },
      data
    });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
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
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      include: { category: true, images: { orderBy: { sortOrder: 'asc' } }, inventory: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const data = req.body;
    
    // Extract related data for separate creation if needed, or use Prisma nested writes
    const { images, inventory, ...productData } = data;
    
    const product = await prisma.product.create({
      data: {
        ...productData,
        images: images ? { create: images } : undefined,
        inventory: inventory ? { create: inventory } : undefined
      },
      include: { images: true, inventory: true }
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ id: id }, { sku: id }, { name: id }]
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = await prisma.product.update({
      where: { id: existing.id },
      data,
      include: { images: true, inventory: true }
    });
    res.json(product);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`PrintHub Backend API running on port ${PORT}`);
});
