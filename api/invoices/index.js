import prisma from '../_lib/prisma.js';
import { verifyAdmin } from '../_lib/auth.js';

/**
 * Generate safe, unique sequential invoice number on the server.
 * Format: INV-YYYY-XXXX (e.g. INV-2026-0001)
 */
async function generateInvoiceNumber() {
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

/**
 * Validate line items and calculate financial totals.
 */
function calculateInvoiceTotals(items = [], discount = 0, shippingFee = 0, applyGst = true) {
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

  // 5% GST (CGST 2.5% + SGST 2.5%) for clothing and custom merchandise
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

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'GET') {
    try {
      const urlParts = (req.url || '').split('?')[0].split('/').filter(Boolean);
      const lastPart = urlParts[urlParts.length - 1];
      const targetId = req.query.id || (lastPart !== 'invoices' ? lastPart : null);

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

        if (!invoice) {
          return res.status(404).json({ error: 'Invoice not found' });
        }

        return res.status(200).json({
          ...invoice,
          items: JSON.parse(invoice.itemsJson || '[]'),
          history: JSON.parse(invoice.historyJson || '[]')
        });
      }

      // Query filters
      const { search, status, paymentStatus, orderId } = req.query;
      const whereClause = {};

      if (status && status !== 'ALL') {
        whereClause.status = status;
      }
      if (paymentStatus && paymentStatus !== 'ALL') {
        whereClause.paymentStatus = paymentStatus;
      }
      if (orderId) {
        whereClause.orderId = orderId;
      }

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

      const parsedInvoices = invoices.map(inv => ({
        ...inv,
        items: JSON.parse(inv.itemsJson || '[]'),
        history: JSON.parse(inv.historyJson || '[]')
      }));

      return res.status(200).json(parsedInvoices);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      verifyAdmin(req);
      const data = req.body || {};

      // If created from an existing order, link and populate
      let orderRecord = null;
      if (data.orderId) {
        orderRecord = await prisma.order.findUnique({
          where: { id: data.orderId },
          include: { items: { include: { product: true } }, customer: true }
        });
      }

      const invoiceNumber = data.invoiceNumber && data.invoiceNumber.trim()
        ? data.invoiceNumber.trim()
        : await generateInvoiceNumber();

      // Check unique number collision
      const existing = await prisma.invoice.findUnique({
        where: { invoiceNumber }
      });
      if (existing) {
        return res.status(400).json({ error: `Invoice number "${invoiceNumber}" already exists.` });
      }

      // Customer info snapshot
      const customerName = data.customerName || orderRecord?.customer?.name || 'Valued Customer';
      const customerEmail = data.customerEmail || orderRecord?.customer?.email || '';
      const customerPhone = data.customerPhone || orderRecord?.customer?.phone || '';
      const billingAddress = data.billingAddress || orderRecord?.notes || 'Customer Atelier Address';

      // Store info snapshot from settings
      let storeSettings = {
        name: 'The PrintHub Central Atelier',
        address: 'Plot 42, Textile Technology Park, Sector 18, Gurugram, Haryana 122015, India',
        phone: '+91 79928 01158',
        email: 'theprinthub.in@gmail.com',
        gstin: '06AAACT1984Q1Z8'
      };

      try {
        const settingsRecord = await prisma.homepageContent.findUnique({
          where: { key: 'contact_settings' }
        });
        if (settingsRecord?.content) {
          const parsed = JSON.parse(settingsRecord.content);
          if (parsed.address) storeSettings.address = parsed.address;
          if (parsed.phone || parsed.whatsapp) storeSettings.phone = parsed.phone || parsed.whatsapp;
          if (parsed.email) storeSettings.email = parsed.email;
        }
      } catch (e) {}

      // Line items: either from payload or derived from order items
      let rawItems = data.items;
      if (!rawItems || rawItems.length === 0) {
        if (orderRecord && orderRecord.items?.length > 0) {
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
      const totals = calculateInvoiceTotals(rawItems, discount, shippingFee, data.applyGst !== false);

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
          storeName: data.storeName || storeSettings.name,
          storeAddress: data.storeAddress || storeSettings.address,
          storePhone: data.storePhone || storeSettings.phone,
          storeEmail: data.storeEmail || storeSettings.email,
          storeGstin: data.storeGstin || storeSettings.gstin,
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
          paymentRef: data.paymentRef || data.paymentReference || (orderRecord?.id ? `ORD-${orderRecord.id}` : null),
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

      return res.status(201).json({
        ...invoice,
        items: totals.validatedItems,
        history: JSON.parse(invoice.historyJson)
      });
    } catch (err) {
      console.error('Failed to create invoice:', err);
      return res.status(400).json({ error: err.message });
    }
  } else if (req.method === 'PATCH') {
    try {
      verifyAdmin(req);
      const urlParts = (req.url || '').split('?')[0].split('/').filter(Boolean);
      const lastPart = urlParts[urlParts.length - 1];
      const targetId = req.query.id || (lastPart !== 'invoices' ? lastPart : null) || req.body?.id;

      if (!targetId) {
        return res.status(400).json({ error: 'Invoice ID is required' });
      }

      const existing = await prisma.invoice.findFirst({
        where: {
          OR: [{ id: targetId }, { invoiceNumber: targetId }]
        }
      });

      if (!existing) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      const data = req.body || {};
      const wasIssued = existing.status === 'ISSUED';
      const isDraft = existing.status === 'DRAFT';

      // Parse current items or new items
      const itemsToCalculate = data.items || JSON.parse(existing.itemsJson || '[]');
      const discount = data.discount !== undefined ? data.discount : (data.discountAmount !== undefined ? data.discountAmount : existing.discount);
      const shippingFee = data.shippingFee !== undefined ? data.shippingFee : (data.shippingCharges !== undefined ? data.shippingCharges : (data.shipping !== undefined ? data.shipping : existing.shippingFee));
      const totals = calculateInvoiceTotals(itemsToCalculate, discount, shippingFee, true);

      // Audit & Revision tracking
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

      return res.status(200).json({
        ...updated,
        items: totals.validatedItems,
        history
      });
    } catch (err) {
      console.error('Failed to update invoice:', err);
      return res.status(400).json({ error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      verifyAdmin(req);
      const urlParts = (req.url || '').split('?')[0].split('/').filter(Boolean);
      const lastPart = urlParts[urlParts.length - 1];
      const targetId = req.query.id || (lastPart !== 'invoices' ? lastPart : null) || req.body?.id;

      if (!targetId) {
        return res.status(400).json({ error: 'Invoice ID is required' });
      }

      const existing = await prisma.invoice.findFirst({
        where: {
          OR: [{ id: targetId }, { invoiceNumber: targetId }]
        }
      });

      if (!existing) {
        return res.status(200).json({ success: true, message: 'Invoice already deleted or not found' });
      }

      // If draft, delete entirely; if issued, archive/cancel
      if (existing.status === 'DRAFT') {
        await prisma.invoice.delete({ where: { id: existing.id } });
      } else {
        await prisma.invoice.update({
          where: { id: existing.id },
          data: { status: 'CANCELLED' }
        });
      }

      return res.status(200).json({ success: true, message: 'Invoice removed / cancelled successfully' });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
