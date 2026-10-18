import prisma from '../_lib/prisma.js';
import { verifyAdmin } from '../_lib/auth.js';

const DEFAULT_CONTACT_SETTINGS = {
  whatsapp: '+91 79928 01158',
  whatsappCatalog: 'https://wa.me/c/917992801158',
  instagram: 'https://instagram.com/theprinthub',
  facebook: 'https://facebook.com/theprinthub',
  gmail: 'theprinthub.in@gmail.com',
  googleMaps: 'https://maps.google.com/?q=The+PrintHub+Studio+Mumbai',
  phone: '+91 79928 01158',
  email: 'theprinthub.in@gmail.com',
  address: 'Atelier Plot 42, Print District, Lower Parel, Mumbai, MH 400013',
  hours: 'Mon - Sat: 10:00 AM - 8:30 PM (Sun Closed)',
  slaGuarantee: '48-Hour Rush Production & Dispatch Guarantee',
};

export default async function handler(req, res) {
  // Always prevent caching so customer storefront and admin get fresh settings
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'GET') {
    try {
      const record = await prisma.homepageContent.findUnique({
        where: { key: 'contact_settings' },
      });

      if (!record || !record.content) {
        return res.status(200).json(DEFAULT_CONTACT_SETTINGS);
      }

      try {
        const parsed = JSON.parse(record.content);
        return res.status(200).json({ ...DEFAULT_CONTACT_SETTINGS, ...parsed });
      } catch (parseErr) {
        return res.status(200).json(DEFAULT_CONTACT_SETTINGS);
      }
    } catch (err) {
      console.error('[API Settings GET Error]:', err);
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST' || req.method === 'PUT') {
    try {
      // Authenticate admin token
      verifyAdmin(req);

      const incoming = req.body?.settings || req.body;
      if (!incoming || typeof incoming !== 'object') {
        return res.status(400).json({ error: 'Valid settings object is required' });
      }

      // Fetch existing record to safely merge
      const existing = await prisma.homepageContent.findUnique({
        where: { key: 'contact_settings' },
      });

      let currentData = DEFAULT_CONTACT_SETTINGS;
      if (existing && existing.content) {
        try {
          currentData = { ...DEFAULT_CONTACT_SETTINGS, ...JSON.parse(existing.content) };
        } catch (e) {}
      }

      // Merge incoming updates without wiping unedited fields
      const merged = { ...currentData, ...incoming };

      const upserted = await prisma.homepageContent.upsert({
        where: { key: 'contact_settings' },
        update: {
          content: JSON.stringify(merged),
        },
        create: {
          key: 'contact_settings',
          content: JSON.stringify(merged),
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Store settings saved successfully',
        settings: merged,
        updatedAt: upserted.updatedAt,
      });
    } catch (err) {
      console.error('[API Settings POST/PUT Error]:', err);
      const statusCode = err.message && err.message.includes('Unauthorized') ? 401 : 400;
      return res.status(statusCode).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
