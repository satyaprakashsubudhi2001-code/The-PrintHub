import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
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
      const { name, audience, description, icon, image } = req.body;
      const category = await prisma.category.create({
        data: { name, audience, description, icon, image }
      });
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
