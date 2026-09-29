import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const requests = await prisma.designRequest.findMany({
        include: { customer: true, product: true },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(requests);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const data = req.body;
      const { customer, product, color, size, printMethod, placements, artworkFiles, textLayers, mockups, status, adminNotes, notes } = data;
      
      const dbCustomer = await prisma.customer.upsert({
        where: { phone: customer.phone },
        update: { name: customer.name, email: customer.email },
        create: { name: customer.name, phone: customer.phone, email: customer.email, company: customer.company }
      });

      const currentYear = new Date().getFullYear();
      const count = await prisma.designRequest.count();
      const nextNum = count + 1;
      const padded = String(nextNum).padStart(5, '0');
      const generatedId = `PH-${currentYear}-${padded}`;

      const customization = JSON.stringify({ color, size, printMethod, placements, textLayers });
      const artworkUrls = JSON.stringify(artworkFiles);
      const mockupUrls = JSON.stringify(mockups);

      const newRequest = await prisma.designRequest.create({
        data: {
          id: generatedId,
          customerId: dbCustomer.id,
          productId: product.id,
          status: status || 'NEW',
          customization,
          artworkUrls,
          mockupUrls,
          notes,
          adminNotes,
        },
        include: { customer: true, product: true }
      });
      
      const responsePayload = {
        ...newRequest,
        customization: JSON.parse(newRequest.customization || '{}'),
        artworkFiles: JSON.parse(newRequest.artworkUrls || '[]'),
        mockups: JSON.parse(newRequest.mockupUrls || '[]'),
        product,
        color, size, printMethod, placements, textLayers
      };

      res.status(201).json(responsePayload);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
