import prisma from '../_lib/prisma.js';
import { verifyAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // Look up product by id, sku, or name
  const existing = await prisma.product.findFirst({
    where: {
      OR: [{ id: id }, { sku: id }, { name: id }]
    }
  });

  if (req.method === 'PATCH') {
    try {
      verifyAdmin(req);
      if (!existing) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const data = req.body;
      const { images, inventory, ...productData } = data;

      const product = await prisma.product.update({
        where: { id: existing.id },
        data: productData,
        include: { images: true, inventory: true }
      });
      res.status(200).json(product);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      verifyAdmin(req);

      if (!existing) {
        return res.status(200).json({ success: true, message: 'Product already deleted or not found' });
      }

      // First attempt permanent hard delete from PostgreSQL
      try {
        await prisma.product.delete({
          where: { id: existing.id }
        });
      } catch (delErr) {
        // If historical orders or design requests reference it, archive it safely
        await prisma.product.update({
          where: { id: existing.id },
          data: { status: 'ARCHIVED' }
        });
      }

      res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
