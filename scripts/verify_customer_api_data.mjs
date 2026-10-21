const BASE_URL = 'http://localhost:5000';

async function main() {
  console.log('=== VERIFYING CUSTOMER APIS ===\n');

  // 1. Categories for customer
  const catRes = await fetch(`${BASE_URL}/api/categories`);
  const categories = await catRes.json();
  console.log(`Active Categories returned to customer (${categories.length}):`);
  categories.forEach(c => console.log(`  - "${c.name}" (Active: ${c.isActive})`));

  // 2. Products for customer
  const prodRes = await fetch(`${BASE_URL}/api/products`);
  const products = await prodRes.json();
  console.log(`\nActive Products returned to customer (${products.length}):`);
  products.forEach(p => console.log(`  - "${p.name}" (SKU: ${p.sku})`));

  // 3. Models for customer
  const modRes = await fetch(`${BASE_URL}/api/models`);
  const models = await modRes.json();
  console.log(`\nActive 3D Models returned to customer (${models.length}):`);
  models.forEach(m => console.log(`  - "${m.name}" (Asset: ${m.modelUrl})`));

  console.log('\n✓ Customer API Verification Complete.');
}

main().catch(console.error);
