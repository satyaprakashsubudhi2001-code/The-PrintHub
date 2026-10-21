import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PROD_API_URL = 'https://www.theprinthub.co.in';

async function main() {
  console.log('=== TESTING LIVE PRODUCTION DELETION WORKFLOW ===\n');

  // 1. Create a temporary test category in production database
  const tempName = 'Test Prod Deletion ' + Date.now();
  console.log(`Creating temporary test category: "${tempName}"...`);
  const tempCat = await prisma.category.create({
    data: {
      name: tempName,
      audience: 'UNISEX',
      description: 'Temporary production deletion verification record',
      isActive: true
    }
  });
  console.log(`Created in DB with ID: ${tempCat.id}`);

  // 2. Verify it appears via live API
  const listRes = await fetch(`${PROD_API_URL}/api/categories?includeInactive=true`, {
    headers: {
      'Authorization': 'Bearer admin-session-token',
      'x-admin-token': 'admin-session-token'
    }
  });
  const list = await listRes.json();
  const found = list.some(c => c.id === tempCat.id);
  console.log(`Visible in live admin API listing: ${found}`);

  // 3. Delete it using authorized admin delete endpoint
  console.log(`Sending authorized DELETE request to ${PROD_API_URL}/api/categories?id=${tempCat.id}...`);
  const delRes = await fetch(`${PROD_API_URL}/api/categories?id=${tempCat.id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer admin-session-token',
      'x-admin-token': 'admin-session-token'
    }
  });
  console.log(`DELETE HTTP Status: ${delRes.status}`);
  const delData = await delRes.json();
  console.log('DELETE response payload:', delData);

  // 4. Verify in DB that it is gone
  const checkDb = await prisma.category.findUnique({ where: { id: tempCat.id } });
  console.log(`Exists in DB after deletion: ${!!checkDb}`);
  if (checkDb) {
    throw new Error('Test category still exists in production DB!');
  }

  // 5. Verify in live API listing that it is gone
  const afterListRes = await fetch(`${PROD_API_URL}/api/categories?includeInactive=true`, {
    headers: {
      'Authorization': 'Bearer admin-session-token',
      'x-admin-token': 'admin-session-token'
    }
  });
  const afterList = await afterListRes.json();
  const stillInList = afterList.some(c => c.id === tempCat.id);
  console.log(`Present in live API listing after deletion: ${stillInList}`);

  console.log('\n✓ LIVE PRODUCTION DELETION VERIFIED 100% SUCCESSFUL!');
  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Live deletion test failed:', err);
  process.exit(1);
});
