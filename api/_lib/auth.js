import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production-12345';
export const COOKIE_NAME = 'printhub_admin_token';

/**
 * Generates a signed JWT token for the admin user.
 */
export function signAdminToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
}

/**
 * Extracts and verifies the JWT token from the incoming request cookies.
 * Returns the decoded token if valid, otherwise throws an error.
 */
export function verifyAdmin(req) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    throw new Error('No authentication cookie found.');
  }

  const cookies = parse(cookieHeader);
  const token = cookies[COOKIE_NAME];
  if (!token) {
    throw new Error('Admin authentication token is missing.');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      throw new Error('Insufficient permissions.');
    }
    return decoded;
  } catch (err) {
    throw new Error('Invalid or expired authentication token.');
  }
}
