import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    try {
      const data = req.body;
      const request = await prisma.designRequest.update({
        where: { id },
        data,
        include: { customer: true, product: true }
      });
      res.status(200).json(request);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
