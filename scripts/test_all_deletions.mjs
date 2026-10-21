import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('======================================================');
  console.log('🧪 TESTING ALL 3 DELETION ENDPOINTS & AUTHORIZATION');
  console.log('======================================================\n');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer admin-session-token',
    'x-admin-token': 'admin-session-token'
  };

  // ----------------------------------------------------------------
  // TEST 1: CATEGORY DELETION (0 Products -> Hard Delete)
  // ----------------------------------------------------------------
  console.log('--- TEST 1: Delete Category with 0 products (Hard Delete) ---');
  const tempCat = await prisma.category.create({
    data: {
      name: 'Temp Test Category ' + Date.now(),
      audience: 'UNISEX',
      description: 'Temporary category for delete testing',
      isActive: true
    }
  });
  console.log(`Created temp category: "${tempCat.name}" (ID: ${tempCat.id})`);

  const delCatRes = await fetch(`${BASE_URL}/api/categories?id=${tempCat.id}`, {
    method: 'DELETE',
    headers
  });
  console.log('DELETE status:', delCatRes.status);
  const delCatData = await delCatRes.json();
  console.log('DELETE response:', delCatData);

  const checkCat = await prisma.category.findUnique({ where: { id: tempCat.id } });
  console.log('Category exists in DB after delete:', !!checkCat);
  if (checkCat) throw new Error('Expected temp category to be hard deleted from DB!');
  console.log('✓ TEST 1 PASSED: Category hard deleted cleanly from database.\n');

  // ----------------------------------------------------------------
  // TEST 2: CATEGORY DELETION (With Products Attached -> Safe Deactivation)
  // ----------------------------------------------------------------
  console.log('--- TEST 2: Delete Category with products attached (Safe Deactivation) ---');
  const tempCatWithProd = await prisma.category.create({
    data: {
      name: 'Temp Cat With Prod ' + Date.now(),
      audience: 'UNISEX',
      description: 'Temporary category with product',
      isActive: true
    }
  });
  const tempProdForCat = await prisma.product.create({
    data: {
      sku: 'TEMP-PROD-' + Date.now(),
      name: 'Temp Attached Product',
      categoryId: tempCatWithProd.id,
      audience: 'UNISEX',
      basePrice: 199,
      status: 'ACTIVE'
    }
  });

  const delCatWithProdRes = await fetch(`${BASE_URL}/api/categories?id=${tempCatWithProd.id}`, {
    method: 'DELETE',
    headers
  });
  console.log('DELETE status:', delCatWithProdRes.status);
  const delCatWithProdData = await delCatWithProdRes.json();
  console.log('DELETE response:', delCatWithProdData);

  const checkCatWithProd = await prisma.category.findUnique({ where: { id: tempCatWithProd.id } });
  console.log('Category isActive in DB:', checkCatWithProd?.isActive);
  console.log('Deactivated flag in response:', delCatWithProdData.deactivated);
  if (checkCatWithProd?.isActive !== false || !delCatWithProdData.deactivated) {
    throw new Error('Expected category to be deactivated, not hard deleted or active!');
  }
  console.log('✓ TEST 2 PASSED: Category with products was safely deactivated to protect products.\n');

  // Clean up the temp product and category from test 2
  await prisma.product.delete({ where: { id: tempProdForCat.id } });
  await prisma.category.delete({ where: { id: tempCatWithProd.id } });

  // ----------------------------------------------------------------
  // TEST 3: PRODUCT DELETION (0 Orders -> Hard Delete with Asset Cleanup)
  // ----------------------------------------------------------------
  console.log('--- TEST 3: Delete Product with 0 orders (Hard Delete + Cascade) ---');
  const catForProd = await prisma.category.findFirst({ where: { isActive: true } });
  const tempProduct = await prisma.product.create({
    data: {
      sku: 'TEMP-HARD-DEL-' + Date.now(),
      name: 'Temporary Deletable Product',
      categoryId: catForProd.id,
      audience: 'UNISEX',
      basePrice: 299,
      status: 'ACTIVE',
      inventory: {
        create: {
          sku: 'TEMP-HARD-DEL-INV-' + Date.now(),
          quantity: 20
        }
      },
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-test', isPrimary: true }
        ]
      }
    }
  });
  console.log(`Created temp product: "${tempProduct.name}" (ID: ${tempProduct.id})`);

  const delProdRes = await fetch(`${BASE_URL}/api/products?id=${tempProduct.id}`, {
    method: 'DELETE',
    headers
  });
  console.log('DELETE status:', delProdRes.status);
  const delProdData = await delProdRes.json();
  console.log('DELETE response:', delProdData);

  const checkProd = await prisma.product.findUnique({ where: { id: tempProduct.id } });
  const checkInv = await prisma.inventory.findFirst({ where: { productId: tempProduct.id } });
  const checkImg = await prisma.productImage.findFirst({ where: { productId: tempProduct.id } });
  console.log('Product in DB:', !!checkProd);
  console.log('Inventory in DB:', !!checkInv);
  console.log('Images in DB:', !!checkImg);
  if (checkProd || checkInv || checkImg) {
    throw new Error('Expected product, inventory, and images to be hard deleted!');
  }
  console.log('✓ TEST 3 PASSED: Product, inventory, and images hard deleted with 0 orphaned records.\n');

  // ----------------------------------------------------------------
  // TEST 4: 3D MODEL DELETION (0 Orders -> Hard Delete + Printable Areas)
  // ----------------------------------------------------------------
  console.log('--- TEST 4: Delete 3D Model with 0 orders (Hard Delete + Printable Areas) ---');
  const tempModel = await prisma.customModel3D.create({
    data: {
      name: 'Temp 3D Model ' + Date.now(),
      productType: 'Accessories',
      modelUrl: '/models/temp.glb',
      status: 'ACTIVE',
      printableAreas: {
        create: [
          { name: 'Front Area', width: 10, height: 10, bounds: '{}' }
        ]
      }
    }
  });
  console.log(`Created temp model: "${tempModel.name}" (ID: ${tempModel.id})`);

  const delModelRes = await fetch(`${BASE_URL}/api/models?id=${tempModel.id}`, {
    method: 'DELETE',
    headers
  });
  console.log('DELETE status:', delModelRes.status);
  const delModelData = await delModelRes.json();
  console.log('DELETE response:', delModelData);

  const checkModel = await prisma.customModel3D.findUnique({ where: { id: tempModel.id } });
  const checkArea = await prisma.printableArea3D.findFirst({ where: { modelId: tempModel.id } });
  console.log('Model in DB:', !!checkModel);
  console.log('Printable Areas in DB:', !!checkArea);
  if (checkModel || checkArea) {
    throw new Error('Expected model and printable areas to be deleted from DB!');
  }
  console.log('✓ TEST 4 PASSED: 3D Model and printable areas deleted cleanly.\n');

  // ----------------------------------------------------------------
  // TEST 5: UNAUTHORIZED REQUESTS REJECTED
  // ----------------------------------------------------------------
  console.log('--- TEST 5: Verify Unauthorized Deletions are Blocked (HTTP 401) ---');
  
  // 5a. Category delete without auth
  const unauthCatRes = await fetch(`${BASE_URL}/api/categories?id=some-fake-id`, {
    method: 'DELETE'
  });
  console.log('Unauth category delete HTTP status:', unauthCatRes.status);
  if (unauthCatRes.status !== 401) throw new Error('Expected 401 Unauthorized for unauth category delete');

  // 5b. Product delete without auth
  const unauthProdRes = await fetch(`${BASE_URL}/api/products?id=some-fake-id`, {
    method: 'DELETE'
  });
  console.log('Unauth product delete HTTP status:', unauthProdRes.status);
  if (unauthProdRes.status !== 401) throw new Error('Expected 401 Unauthorized for unauth product delete');

  // 5c. Model delete without auth
  const unauthModelRes = await fetch(`${BASE_URL}/api/models?id=some-fake-id`, {
    method: 'DELETE'
  });
  console.log('Unauth model delete HTTP status:', unauthModelRes.status);
  if (unauthModelRes.status !== 401) throw new Error('Expected 401 Unauthorized for unauth model delete');

  // 5d. Model delete with invalid token
  const invalidTokenRes = await fetch(`${BASE_URL}/api/models?id=some-fake-id`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer bad-token-123' }
  });
  console.log('Invalid token model delete HTTP status:', invalidTokenRes.status);
  if (invalidTokenRes.status !== 401) throw new Error('Expected 401 Unauthorized for invalid token');

  console.log('✓ TEST 5 PASSED: All unauthorized and invalid-token delete attempts rejected with HTTP 401.\n');

  console.log('======================================================');
  console.log('🎉 ALL 5 DELETION & AUTH TESTS PASSED WITH 100% SUCCESS!');
  console.log('======================================================');

  await prisma.$disconnect();
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
