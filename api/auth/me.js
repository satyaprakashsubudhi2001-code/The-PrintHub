import { verifyAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const adminUser = verifyAdmin(req);
    return res.status(200).json({ success: true, user: adminUser });
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message });
  }
}
