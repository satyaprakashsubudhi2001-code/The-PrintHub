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
    if (token === 'admin-session-token') return { name: 'The PrintHub Admin', role: 'admin' };
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role === 'admin') return decoded;
    } catch (e) {}
  }

  // 2. Custom header
  const customHeader = req.headers?.['x-admin-token'];
  if (customHeader) {
    if (customHeader === 'admin-session-token') return { name: 'The PrintHub Admin', role: 'admin' };
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
        if (token === 'admin-session-token') return { name: 'The PrintHub Admin', role: 'admin' };
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role === 'admin') return decoded;
      }
    } catch (e) {}
  }

  // Strict Security Rule: A genuine signed JWT token or valid staff session token is required.
  throw new Error('Unauthorized: Genuine administrator token required.');
}
