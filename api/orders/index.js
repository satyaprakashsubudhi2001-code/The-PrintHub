import prisma from '../_lib/prisma.js';
import { verifyAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      verifyAdmin(req);
      const orders = await prisma.order.findMany({
        include: { customer: true, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(orders);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const data = req.body;
      const { customer, items, ...orderData } = data;
      
      const dbCustomer = await prisma.customer.upsert({
        where: { phone: customer.phone },
        update: { name: customer.name },
        create: { name: customer.name, phone: customer.phone }
      });

      const order = await prisma.order.create({
        data: {
          ...orderData,
          customerId: dbCustomer.id,
          items: {
            create: items
          }
        },
        include: { customer: true, items: true }
      });
      res.status(201).json(order);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
