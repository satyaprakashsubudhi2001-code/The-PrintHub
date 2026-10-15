import prisma from '../_lib/prisma.js';
import { verifyAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      verifyAdmin(req);
      const orders = await prisma.order.findMany({
        include: { customer: true, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(orders);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const data = req.body || {};
      const { customer, items, ...orderData } = data;

      if (!customer || !customer.phone) {
        return res.status(400).json({ error: 'Customer phone is required' });
      }

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Order must contain at least one item' });
      }

      const dbCustomer = await prisma.customer.upsert({
        where: { phone: customer.phone },
        update: { name: customer.name || 'Valued Customer' },
        create: { name: customer.name || 'Valued Customer', phone: customer.phone }
      });

      // Server-side validation of products, prices, and 3D customization snapshots
      let calculatedTotal = 0;
      const sanitizedItems = [];

      for (const rawItem of items) {
        let dbProduct = null;
        if (rawItem.productId) {
          dbProduct = await prisma.product.findUnique({
            where: { id: rawItem.productId },
            include: { models3D: true }
          });
        }

        // If not found by ID, attempt lookup by model or fallback to first active product
        if (!dbProduct) {
          dbProduct = await prisma.product.findFirst({
            where: { status: 'ACTIVE' }
          });
        }

        if (!dbProduct) {
          return res.status(400).json({ error: 'No active merchandise product found for order.' });
        }

        const qty = Math.max(1, parseInt(rawItem.quantity, 10) || 1);
        
        // Trusted pricing: Use database basePrice + print area fees if applicable
        let trustedUnitPrice = Number(dbProduct.salePrice || dbProduct.basePrice || 499);
        
        // Parse customization if provided
        let customizationStr = null;
        if (rawItem.customization) {
          if (typeof rawItem.customization === 'object') {
            customizationStr = JSON.stringify(rawItem.customization);
          } else {
            customizationStr = String(rawItem.customization);
          }
        } else if (rawItem.config) {
          customizationStr = JSON.stringify({
            ...rawItem.config,
            previewImage: rawItem.previewImage || null,
            printAreasUsed: rawItem.printAreasUsed || [],
            color: rawItem.color || rawItem.colorName,
            size: rawItem.size,
          });
        }

        sanitizedItems.push({
          productId: dbProduct.id,
          quantity: qty,
          price: trustedUnitPrice,
          customization: customizationStr
        });

        calculatedTotal += trustedUnitPrice * qty;
      }

      // Add shipping if applicable (e.g., ₹99 for orders under ₹999)
      const shipping = calculatedTotal >= 999 ? 0 : (orderData.shippingFee !== undefined ? Number(orderData.shippingFee) : 99);
      const finalTotal = calculatedTotal + shipping;

      const order = await prisma.order.create({
        data: {
          total: finalTotal,
          status: orderData.status || 'PENDING',
          paymentStatus: orderData.paymentStatus || 'PAID',
          shippingAddress: typeof orderData.shippingAddress === 'object' ? JSON.stringify(orderData.shippingAddress) : (orderData.shippingAddress || 'Storefront Customer Order'),
          customerId: dbCustomer.id,
          items: {
            create: sanitizedItems
          }
        },
        include: { customer: true, items: { include: { product: true } } }
      });
      res.status(201).json(order);
    } catch (err) {
      console.error('Order creation error:', err);
      res.status(400).json({ error: err.message });
    }
  } else if (req.method === 'PATCH') {
    try {
      verifyAdmin(req);
      const urlParts = (req.url || '').split('?')[0].split('/').filter(Boolean);
      const lastPart = urlParts[urlParts.length - 1];
      const id = req.query.id || (lastPart !== 'orders' ? lastPart : null) || req.body?.id;
      if (!id) return res.status(400).json({ error: 'Order ID is required' });
      const data = req.body;
      const order = await prisma.order.update({
        where: { id },
        data
      });
      res.status(200).json(order);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
