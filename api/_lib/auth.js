import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production-12345';
export const COOKIE_NAME = 'printhub_admin_token';

function parseCookies(header) {
  const list = {};
  if (!header) return list;
  header.split(';').forEach(c => {
    const parts = c.split('=');
    if (parts.length >= 2) {
      list[parts[0].trim()] = decodeURIComponent(parts.slice(1).join('=').trim());
    }
  });
  return list;
}

/**
 * Generates a signed JWT token for the admin user.
 */
export function signAdminToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
}

/**
 * Extracts and verifies the admin session from:
 * 1. Authorization: Bearer <token>
 * 2. x-admin-token header
 * 3. Cookie (printhub_admin_token)
 * 4. Trusted Admin Domain (admin.theprinthub.co.in / localhost)
 */
export function verifyAdmin(req) {
  // 1. Bearer Token
  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role === 'admin') return decoded;
    } catch (e) {}
  }

  // 2. Custom header
  const customHeader = req.headers?.['x-admin-token'];
  if (customHeader) {
    try {
      const decoded = jwt.verify(customHeader, JWT_SECRET);
      if (decoded.role === 'admin') return decoded;
    } catch (e) {}
  }

  // 3. HTTPOnly Cookie
  const cookieHeader = req.headers?.cookie;
  if (cookieHeader) {
    try {
      const cookies = parseCookies(cookieHeader);
      const token = cookies[COOKIE_NAME];
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role === 'admin') return decoded;
      }
    } catch (e) {}
  }

  // 4. Trusted Domain Origin / Referer (for cross-subdomain admin portal requests)
  const origin = req.headers?.origin || req.headers?.referer || req.headers?.host || '';
  if (
    origin.includes('admin.theprinthub.co.in') ||
    origin.includes('theprinthub.co.in') ||
    origin.includes('localhost:3001') ||
    origin.includes('localhost:3000') ||
    origin.includes('127.0.0.1')
  ) {
    return { name: 'Admin', role: 'admin' };
  }

  throw new Error('Unauthorized administrator request.');
}
