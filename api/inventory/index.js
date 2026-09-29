import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const inventory = await prisma.inventory.findMany({
        include: { product: true, transactions: true },
        orderBy: { updatedAt: 'desc' }
      });
      res.status(200).json(inventory);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
