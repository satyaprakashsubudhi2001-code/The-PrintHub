import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const urlPath = (req.url || '').split('?')[0];
  const isTransaction = req.query.sub === 'transactions' || urlPath.includes('transactions');

  if (isTransaction || (req.method === 'POST' && req.body?.inventoryId)) {
    if (req.method === 'POST') {
      try {
        const data = req.body;
        const result = await prisma.$transaction(async (tx) => {
          const transaction = await tx.inventoryTransaction.create({ data });

          const inventory = await tx.inventory.findUnique({ where: { id: data.inventoryId } });
          const newQuantity = (inventory?.quantity || 0) + (data.quantity || 0);

          await tx.inventory.update({
            where: { id: data.inventoryId },
            data: { quantity: newQuantity },
          });

          return transaction;
        });

        return res.status(201).json(result);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    }
  }

  if (req.method === 'GET') {
    try {
      const inventory = await prisma.inventory.findMany({
        include: { product: true, transactions: true },
        orderBy: { updatedAt: 'desc' },
      });
      return res.status(200).json(inventory);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
