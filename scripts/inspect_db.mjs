import prisma from '../api/_lib/prisma.js';

async function main() {
  const cats = await prisma.category.findMany();
  const prods = await prisma.product.findMany({ include: { images: true } });
  const orders = await prisma.order.findMany({ include: { items: true, customer: true } });
  
  console.log('=== DATABASE STATUS ===');
  console.log(`Categories (${cats.length}):`, cats.map(c => ({ id: c.id, name: c.name, isActive: c.isActive })));
  console.log(`Products (${prods.length}):`, prods.map(p => ({ id: p.id, name: p.name, status: p.status, imagesCount: p.images.length, images: p.images })));
  console.log(`Orders (${orders.length}):`, orders.map(o => ({ id: o.id, customer: o.customer?.name, total: o.totalAmount, itemsCount: o.items.length })));
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
