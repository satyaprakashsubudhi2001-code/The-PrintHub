const PROD_STORE_URL = 'https://theprinthub.co.in';
const PROD_ADMIN_URL = 'https://admin.theprinthub.co.in';

async function checkProduction() {
  console.log('=== CHECKING LIVE PRODUCTION STATUS ===\n');

  // 1. Categories
  try {
    const res = await fetch(`${PROD_STORE_URL}/api/categories?_t=${Date.now()}`, { cache: 'no-store' });
    console.log(`Live Categories HTTP Status: ${res.status}`);
    if (res.ok) {
      const data = await res.json();
      console.log(`Total live categories returned: ${data.length}`);
      data.forEach(c => console.log(`  - "${c.name}" (Active: ${c.isActive})`));
      
      const hasCustomTShirts = data.some(c => c.name === 'Custom T-Shirts');
      const hasShirts = data.some(c => c.name === 'Shirts');
      console.log(`Demo "Custom T-Shirts" present: ${hasCustomTShirts}`);
      console.log(`Demo "Shirts" present: ${hasShirts}`);
    }
  } catch (e) {
    console.error('Error fetching live categories:', e.message);
  }

  // 2. Products
  try {
    const res = await fetch(`${PROD_STORE_URL}/api/products?_t=${Date.now()}`, { cache: 'no-store' });
    console.log(`\nLive Products HTTP Status: ${res.status}`);
    if (res.ok) {
      const data = await res.json();
      console.log(`Total live products returned: ${data.length}`);
      data.forEach(p => console.log(`  - "${p.name}" (SKU: ${p.sku})`));
    }
  } catch (e) {
    console.error('Error fetching live products:', e.message);
  }

  // 3. Models
  try {
    const res = await fetch(`${PROD_STORE_URL}/api/models?_t=${Date.now()}`, { cache: 'no-store' });
    console.log(`\nLive 3D Models HTTP Status: ${res.status}`);
    if (res.ok) {
      const data = await res.json();
      console.log(`Total live models returned: ${data.length}`);
      data.forEach(m => console.log(`  - "${m.name}" (Asset: ${m.modelUrl})`));
    }
  } catch (e) {
    console.error('Error fetching live models:', e.message);
  }

  // 4. Test Production Admin Authentication & Verification
  try {
    console.log('\nTesting Production Admin Login & Auth Token issuance...');
    const loginRes = await fetch(`${PROD_STORE_URL}/api/auth?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'theprinthub.in@gmail.com', password: 'Theprinthub@123' })
    });
    console.log(`Production Login HTTP Status: ${loginRes.status}`);
    const loginData = await loginRes.json();
    console.log('Login success:', loginData.success);
    console.log('Token received:', !!loginData.token);

    if (loginData.token) {
      const token = loginData.token;
      // Test production admin call
      const adminModelsRes = await fetch(`${PROD_STORE_URL}/api/models`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-admin-token': token
        }
      });
      console.log(`Production Admin Models Access HTTP Status: ${adminModelsRes.status}`);
    }
  } catch (e) {
    console.error('Error testing production admin login:', e.message);
  }
}

checkProduction().catch(console.error);
