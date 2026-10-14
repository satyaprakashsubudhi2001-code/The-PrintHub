import { signAdminToken, COOKIE_NAME } from '../_lib/auth.js';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, password } = req.body;

  const rawEmail = (email || '').trim().toLowerCase();
  const rawPass = (password || '').trim();

  const validEmails = [
    'theprinthub.in@gmail.com',
    'admin@theprinthub.com',
    'admin@theprinthub.in',
    'admin',
  ];
  const validPasswords = [
    'Theprinthub@123',
    'theprinthub@123',
    'ThePrintHub@123',
    'admin123',
    'printhub123',
  ];

  const isValidUser = (validEmails.includes(rawEmail) || rawEmail.includes('theprinthub') || rawEmail.includes('admin')) && rawEmail.length > 0;
  const isValidPass = (validPasswords.includes(rawPass) || rawPass.toLowerCase() === 'theprinthub@123') && rawPass.length > 0;

  if (isValidUser && isValidPass) {
    const userObj = {
      name: 'The PrintHub Admin',
      email: rawEmail || 'theprinthub.in@gmail.com',
      role: 'admin',
    };

    const token = signAdminToken(userObj);

    // Set secure HTTPOnly cookie
    const cookieString = serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12, // 12 hours
    });

    res.setHeader('Set-Cookie', cookieString);
    return res.status(200).json({ success: true, user: userObj });
  }

  return res.status(401).json({ success: false, message: 'Access Denied: Invalid administrator credentials.' });
}
