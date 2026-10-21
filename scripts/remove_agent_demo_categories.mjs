import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:5000';

const TARGET_AGENT_CATEGORIES = [
  { id: '403db9fd-b88c-4f28-bcab-5189cc33abe7', name: 'Custom T-Shirts' },
  { id: '7d8ed2b2-db1f-4980-83c6-44e0c2c3a734', name: 'Shirts' }
];

async function main() {
  console.log('=== REMOVING AGENT-CREATED DEMO CATEGORIES VIA API ===\n');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer admin-session-token',
    'x-admin-token': 'admin-session-token'
  };

  for (const cat of TARGET_AGENT_CATEGORIES) {
    console.log(`Checking category "${cat.name}" (ID: ${cat.id})...`);
    const dbCat = await prisma.category.findUnique({
      where: { id: cat.id },
      include: { products: true }
    });

    if (!dbCat) {
      console.log(`Category "${cat.name}" already removed from DB.`);
      continue;
    }

    if (dbCat.products.length > 0) {
      console.warn(`WARNING: Category "${cat.name}" has ${dbCat.products.length} products. Skipping hard delete.`);
      continue;
    }

    console.log(`Sending authorized DELETE request for "${cat.name}"...`);
    const res = await fetch(`${BASE_URL}/api/categories?id=${cat.id}`, {
      method: 'DELETE',
      headers
    });

    console.log(`Response HTTP Status: ${res.status}`);
    const data = await res.json();
    console.log('Response body:', data);

    const checkCat = await prisma.category.findUnique({ where: { id: cat.id } });
    if (checkCat) {
      throw new Error(`Category "${cat.name}" still exists in database!`);
    }
    console.log(`✓ Confirmed: Category "${cat.name}" successfully deleted from database.\n`);
  }

  console.log('=== REMAINING CATEGORIES IN DATABASE ===');
  const remaining = await prisma.category.findMany({
    select: { id: true, name: true, isActive: true, products: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'asc' }
  });
  remaining.forEach(r => {
    console.log(`- "${r.name}" | Active: ${r.isActive} | Products: ${r.products.length}`);
  });

  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Removal failed:', err);
  process.exit(1);
});
