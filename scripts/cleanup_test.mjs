import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  await prisma.productType3D.deleteMany({ where: { name: 'Security Test Type' } });
  console.log('Cleaned up test record successfully.');
  await prisma.$disconnect();
}

main().catch(console.error);
