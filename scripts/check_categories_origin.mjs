import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const cats = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      isActive: true,
      audience: true,
      products: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: 'asc' }
  });
  console.log('Categories in DB:');
  cats.forEach((c) => {
    console.log(`- "${c.name}" (ID: ${c.id})`);
    console.log(`  Created: ${c.createdAt.toISOString()} | Updated: ${c.updatedAt.toISOString()} | Active: ${c.isActive}`);
    console.log(`  Products count: ${c.products.length}`);
  });
  await prisma.$disconnect();
}

main().catch(console.error);
