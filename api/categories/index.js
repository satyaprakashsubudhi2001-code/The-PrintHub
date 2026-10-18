import prisma from '../_lib/prisma.js';
import { verifyAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  // Never cache category lists
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'GET') {
    try {
      const includeInactive = req.query.includeInactive === 'true' || req.query.admin === 'true';
      const categories = await prisma.category.findMany({
        where: includeInactive ? {} : { isActive: true },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      verifyAdmin(req);
      const { name, audience, description, icon, image, isActive, status } = req.body;
      const isCatActive = isActive !== undefined ? Boolean(isActive) : (status !== undefined ? (status === 'ACTIVE' || status === true) : true);
      const category = await prisma.category.create({
        data: {
          name: (name || '').trim(),
          audience: audience || 'MAN',
          description: description || '',
          icon: icon || '🏷️',
          image: image || '',
          isActive: isCatActive
        }
      });
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else if (req.method === 'PATCH') {
    try {
      verifyAdmin(req);
      const urlParts = (req.url || '').split('?')[0].split('/').filter(Boolean);
      const lastPart = urlParts[urlParts.length - 1];
      const targetId = req.query.id || (lastPart !== 'categories' ? lastPart : null) || req.body?.id;

      if (!targetId) {
        return res.status(400).json({ error: 'Category ID is required' });
      }

      const existing = await prisma.category.findFirst({
        where: {
          OR: [{ id: targetId }, { name: targetId }]
        }
      });

      if (!existing) {
        return res.status(404).json({ error: 'Category not found' });
      }

      const { name, audience, description, icon, image, isActive, status } = req.body;
      const updateData = {};
      if (name !== undefined) updateData.name = name.trim();
      if (audience !== undefined) updateData.audience = audience;
      if (description !== undefined) updateData.description = description;
      if (icon !== undefined) updateData.icon = icon;
      if (image !== undefined) updateData.image = image;
      if (isActive !== undefined) updateData.isActive = Boolean(isActive);
      if (status !== undefined) updateData.isActive = (status === 'ACTIVE' || status === true);

      const category = await prisma.category.update({
        where: { id: existing.id },
        data: updateData
      });
      res.status(200).json(category);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      verifyAdmin(req);
      const urlParts = (req.url || '').split('?')[0].split('/').filter(Boolean);
      const lastPart = urlParts[urlParts.length - 1];
      const targetId = req.query.id || (lastPart !== 'categories' ? lastPart : null) || req.body?.id;

      if (targetId) {
        // Delete single category
        const existing = await prisma.category.findFirst({
          where: {
            OR: [{ id: targetId }, { name: targetId }]
          }
        });

        if (!existing) {
          return res.status(200).json({ success: true, message: 'Category already deleted or not found' });
        }

        try {
          await prisma.category.delete({ where: { id: existing.id } });
        } catch (relErr) {
          await prisma.category.update({
            where: { id: existing.id },
            data: { isActive: false }
          });
        }
        return res.status(200).json({ success: true, message: 'Category deleted successfully' });
      }

      // Bulk clear all categories
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
    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
