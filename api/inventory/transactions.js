import prisma from '../../_lib/prisma.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const data = req.body;
      const result = await prisma.$transaction(async (tx) => {
        const transaction = await tx.inventoryTransaction.create({ data });
        
        const inventory = await tx.inventory.findUnique({ where: { id: data.inventoryId } });
        const newQuantity = inventory.quantity + data.quantity;
        
        await tx.inventory.update({
          where: { id: data.inventoryId },
          data: { quantity: newQuantity }
        });
        
        return transaction;
      });
      
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
