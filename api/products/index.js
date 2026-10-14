import prisma from '../_lib/prisma.js';
import { verifyAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      res.setHeader('Cache-Control', 'no-store');
      const products = await prisma.product.findMany({
        where: { status: 'ACTIVE' },
        include: { category: true, images: { orderBy: { sortOrder: 'asc' } }, inventory: true },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      verifyAdmin(req);
      const data = req.body;
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
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
