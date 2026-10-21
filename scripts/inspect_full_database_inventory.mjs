import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function inspect() {
  console.log('=== DATABASE INVENTORY AUDIT ===\n');

  // 1. Categories
  const categories = await prisma.category.findMany({
    include: {
      products: {
        select: { id: true, name: true, sku: true, status: true, isActive: true }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`--- CATEGORIES (${categories.length} total) ---`);
  categories.forEach((c, idx) => {
    console.log(`[${idx + 1}] ID: ${c.id}`);
    console.log(`    Name: "${c.name}" | Active: ${c.isActive} | Products count: ${c.products.length}`);
    if (c.products.length > 0) {
      c.products.forEach(p => console.log(`      -> Product: "${p.name}" (SKU: ${p.sku}, ID: ${p.id})`));
    }
  });

  // 2. Products
  const products = await prisma.product.findMany({
    include: {
      category: { select: { id: true, name: true } },
      models3D: { select: { id: true, name: true, modelUrl: true } },
      inventory: true,
      images: true
    },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`\n--- PRODUCTS (${products.length} total) ---`);
  for (const [idx, p] of products.entries()) {
    const orderItemsCount = await prisma.orderItem.count({ where: { productId: p.id } });
    const designReqCount = await prisma.designRequest.count({ where: { productId: p.id } });
    console.log(`[${idx + 1}] ID: ${p.id}`);
    console.log(`    Name: "${p.name}" | SKU: ${p.sku} | Price: ₹${p.basePrice} | Status: ${p.status}`);
    console.log(`    Category: "${p.category?.name || 'None'}" (${p.categoryId})`);
    console.log(`    Linked 3D Model: ${p.models3D && p.models3D.length > 0 ? `"${p.models3D[0].name}" (${p.models3D[0].id})` : 'None'}`);
    console.log(`    Inventory: ${p.inventory ? `Qty: ${p.inventory.quantity}` : 'None'} | Images: ${p.images ? p.images.length : 0}`);
    console.log(`    Order Items referenced: ${orderItemsCount} | Design Requests referenced: ${designReqCount}`);
  }

  // 3. 3D Models
  const models = await prisma.customModel3D.findMany({
    include: {
      product: { select: { id: true, name: true, sku: true } },
      printableAreas: true
    },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`\n--- 3D MODELS (${models.length} total) ---`);
  for (const [idx, m] of models.entries()) {
    const orderItemsWithModel = await prisma.orderItem.count({
      where: { customization: { contains: m.id } }
    });
    const designReqWithModel = await prisma.designRequest.count({
      where: { customization: { contains: m.id } }
    });
    console.log(`[${idx + 1}] ID: ${m.id}`);
    console.log(`    Name: "${m.name}" | Asset: ${m.modelUrl} | Status: ${m.status}`);
    console.log(`    Linked Product: ${m.product ? `"${m.product.name}" (${m.product.id})` : 'None'}`);
    console.log(`    Printable Areas: ${m.printableAreas.length} (${m.printableAreas.map(a => a.name).join(', ')})`);
    console.log(`    Order Items referenced: ${orderItemsWithModel} | Design Requests referenced: ${designReqWithModel}`);
  }

  // 4. Invoices & Orders
  const ordersCount = await prisma.order.count();
  const invoices = await prisma.invoice.findMany({
    select: { id: true, invoiceNumber: true, customerName: true, grandTotal: true }
  });

  console.log(`\n--- ORDERS & INVOICES ---`);
  console.log(`Total Orders: ${ordersCount}`);
  console.log(`Total Invoices: ${invoices.length}`);
  invoices.forEach(inv => {
    console.log(`  -> Invoice ${inv.invoiceNumber} (ID: ${inv.id}): ${inv.customerName} - ₹${inv.grandTotal}`);
  });

  await prisma.$disconnect();
}

inspect().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
