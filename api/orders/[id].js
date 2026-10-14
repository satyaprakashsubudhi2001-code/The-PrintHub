import prisma from '../_lib/prisma.js';
import { verifyAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    try {
      verifyAdmin(req);
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
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
