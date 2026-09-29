import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const customers = await prisma.customer.findMany({
        include: { orders: true, designRequests: true },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(customers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
