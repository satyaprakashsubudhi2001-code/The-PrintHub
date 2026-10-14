import prisma from '../_lib/prisma.js';
import { verifyAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  // Never cache category lists
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'GET') {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      verifyAdmin(req);
      const { name, audience, description, icon, image } = req.body;
      const category = await prisma.category.create({
        data: { name, audience, description, icon, image }
      });
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      verifyAdmin(req);
      try {
        await prisma.category.deleteMany({});
      } catch (relErr) {
        await prisma.category.updateMany({
          data: { isActive: false }
        });
      }
      res.status(200).json({ success: true, message: 'All categories cleared' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
