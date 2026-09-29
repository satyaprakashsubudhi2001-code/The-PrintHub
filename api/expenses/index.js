import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const expenses = await prisma.expense.findMany({
        orderBy: { date: 'desc' }
      });
      res.status(200).json(expenses);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const data = req.body;
      const expense = await prisma.expense.create({ data });
      res.status(201).json(expense);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
