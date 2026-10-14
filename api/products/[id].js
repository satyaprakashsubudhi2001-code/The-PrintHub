import prisma from '../_lib/prisma.js';
import { verifyAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    try {
      verifyAdmin(req);
      const data = req.body;
      const product = await prisma.product.update({
        where: { id },
        data,
        include: { images: true, inventory: true }
      });
      res.status(200).json(product);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      verifyAdmin(req);
      await prisma.product.update({
        where: { id },
        data: { status: 'ARCHIVED' }
      });
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
