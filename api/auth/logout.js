import { COOKIE_NAME } from '../_lib/auth.js';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Set secure HTTPOnly cookie to expire immediately
  const cookieString = serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: -1, // Expire immediately
  });

  res.setHeader('Set-Cookie', cookieString);
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
}
