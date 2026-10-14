import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Category ID is required' });
  }

  if (req.method === 'PATCH') {
    try {
      const data = req.body;
      const existing = await prisma.category.findFirst({
        where: {
          OR: [{ id: id }, { name: id }]
        }
      });

      if (!existing) {
        return res.status(404).json({ error: 'Category not found' });
      }

      const category = await prisma.category.update({
        where: { id: existing.id },
        data
      });
      res.status(200).json(category);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const existing = await prisma.category.findFirst({
        where: {
          OR: [{ id: id }, { name: id }]
        }
      });

      if (!existing) {
        // Already deleted
        return res.status(200).json({ success: true, message: 'Category already deleted or not found' });
      }

      // First attempt permanent hard-delete
      try {
        await prisma.category.delete({ where: { id: existing.id } });
      } catch (relErr) {
        // If related products exist, mark inactive
        await prisma.category.update({
          where: { id: existing.id },
          data: { isActive: false }
        });
      }

      res.status(200).json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
