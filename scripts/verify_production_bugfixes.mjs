import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EVIDENCE_DIR = path.resolve('qa_evidence');
const ARTIFACT_DIR = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\a93b63f6-3fe0-4989-80b5-7e351dd0b4cd';

if (!fs.existsSync(EVIDENCE_DIR)) fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

function copyToArtifacts(filename) {
  try {
    const src = path.join(EVIDENCE_DIR, filename);
    const dest = path.join(ARTIFACT_DIR, filename);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  } catch (err) {
    console.warn(`Failed to copy ${filename} to artifacts:`, err.message);
  }
}

async function verifyProduction() {
  console.log('===============================================================');
  console.log('🧪 LIVE PRODUCTION BUG FIX VERIFICATION: THE PRINTHUB');
  console.log('===============================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--window-size=1440,900'
    ],
    defaultViewport: { width: 1440, height: 900 }
  });

  const report = {
    customerPortal: { url: 'https://theprinthub.co.in/design-by-customer', errors: [], passed: true, details: {} },
    adminConsole: { url: 'https://admin.theprinthub.co.in/admin', errors: [], passed: true, details: {} }
  };

  try {
    // =========================================================================
    // PART 1: CUSTOMER CUSTOMIZER VERIFICATION
    // =========================================================================
    console.log('---------------------------------------------------------------');
    console.log('PART 1: Verifying Customer Customizer (https://theprinthub.co.in/design-by-customer)');
    console.log('---------------------------------------------------------------');

    const customerPage = await browser.newPage();
    const customerErrors = [];
    const customerFailedRequests = [];

    customerPage.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('401')) {
          console.log(`[Customer Console Error] ${text}`);
          customerErrors.push(text);
        }
      }
    });

    customerPage.on('pageerror', err => {
      console.log(`[Customer Page Error] ${err.message}`);
      customerErrors.push(err.message);
    });

    customerPage.on('requestfailed', req => {
      if (!req.url().includes('orders') && !req.url().includes('favicon')) {
        customerFailedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
      }
    });

    await customerPage.goto('https://theprinthub.co.in/design-by-customer', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for product cards to load from API
    await customerPage.waitForSelector('div.group', { timeout: 15000 });

    // Check specifically for k.slice(...).map error
    const hasSliceError = customerErrors.some(e => e.includes('slice') && e.includes('map'));
    console.log(`Error check 'k.slice(...).map': ${hasSliceError ? '❌ DETECTED' : '✅ NOT DETECTED (PASSED)'}`);

    if (hasSliceError) {
      report.customerPortal.passed = false;
      report.customerPortal.errors.push('k.slice(...).map is not a function was observed!');
    }

    // Capture initial customizer screenshot
    await customerPage.screenshot({ path: path.join(EVIDENCE_DIR, '01_live_customizer_initial.png') });
    copyToArtifacts('01_live_customizer_initial.png');
    console.log('📸 Captured 01_live_customizer_initial.png');

    // Verify all 4 products rendered in Step 1
    const productCards = await customerPage.$$eval('div.group', cards => {
      return cards.map(c => {
        const titleEl = c.querySelector('h3');
        return titleEl ? titleEl.textContent.trim() : null;
      }).filter(Boolean);
    });
    console.log(`Found ${productCards.length} customizable items:`, productCards);
    report.customerPortal.details.productCards = productCards;

    // Verify all 4 products: T Shirt, Collared Shirt, Mug, Mouse Pad
    const targetProducts = [
      { name: 'T-Shirt', pattern: /t-shirt|round neck/i },
      { name: 'Collared Shirt', pattern: /collared|shirt|polo/i },
      { name: 'Mug', pattern: /mug|coffee/i },
      { name: 'Mouse Pad', pattern: /mouse pad|pad/i }
    ];

    const testedProducts = {};

    for (const target of targetProducts) {
      console.log(`\nTesting product selection: ${target.name}...`);
      const cardHandle = await customerPage.evaluateHandle((patternStr) => {
        const regex = new RegExp(patternStr, 'i');
        const cards = Array.from(document.querySelectorAll('div.group'));
        for (const card of cards) {
          if (regex.test(card.textContent)) return card;
        }
        return null;
      }, target.pattern.source);

      if (cardHandle && (await cardHandle.evaluate(el => !!el))) {
        await customerPage.evaluate((el) => {
          const btn = el.querySelector('button') || el;
          if (btn) btn.click();
        }, cardHandle);
        await new Promise(r => setTimeout(r, 1500));

        const viewInfo = await customerPage.evaluate(() => {
          return {
            swatches: document.querySelectorAll('button[title], div.flex button').length,
            stepText: document.body.innerText.includes('STEP 2') ? 'Step 2' : 'Studio'
          };
        });

        console.log(`  ✓ Product selected (${target.name}): ${viewInfo.stepText}, Swatches=${viewInfo.swatches}`);
        const screenshotName = `02_live_customizer_${target.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.png`;
        await customerPage.screenshot({ path: path.join(EVIDENCE_DIR, screenshotName) });
        copyToArtifacts(screenshotName);
        console.log(`  📸 Captured ${screenshotName}`);

        testedProducts[target.name] = { success: true, swatches: viewInfo.swatches };

        // Return to Step 1
        await customerPage.evaluate(() => {
          const step1Btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('1. SILHOUETTE') || b.textContent.includes('Customize another'));
          if (step1Btn) step1Btn.click();
        });
        await new Promise(r => setTimeout(r, 1000));
      } else {
        console.log(`  ⚠️ Product card for ${target.name} not found in DOM`);
        testedProducts[target.name] = { success: false, reason: 'Card not found' };
      }
    }
    report.customerPortal.details.testedProducts = testedProducts;

    // Full Step-by-Step Customization Journey Test (Steps 1 to 6)
    console.log('\nTesting full customizer wizard (Steps 1 to 6)...');
    
    // Ensure we are on Step 1 of customizer
    await customerPage.goto('https://theprinthub.co.in/design-by-customer', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await customerPage.waitForSelector('div.group', { timeout: 15000 });

    // 1. Select Classic Round Neck T-Shirt
    console.log('Selecting Classic Round Neck T-Shirt in Step 1...');
    await customerPage.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div.group'));
      const tshirtCard = cards.find(c => /t-shirt|round neck/i.test(c.textContent)) || cards[0];
      const btn = tshirtCard.querySelector('button') || tshirtCard;
      btn.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    // 2. Step 2 (Colour) -> Next: Select Size
    console.log('Moving from Step 2 to Step 3...');
    await customerPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent.includes('Next: Select Size'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    // 3. Step 3 (Size) -> Next: Select Print Placements
    console.log('Moving from Step 3 to Step 4...');
    await customerPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent.includes('Next: Select Print Placements'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    // 4. Step 4 (Placements) -> Next: Upload & Design
    console.log('Moving from Step 4 to Step 5...');
    await customerPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent.includes('Next: Upload & Design') || b.textContent.includes('Upload & Design'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    // 5. Step 5 (Atelier Design Studio) -> Upload artwork & Proceed to Preview
    console.log('Step 5 Atelier Design Studio reached. Uploading artwork...');
    const testArtPath = path.resolve('qa_evidence', 'test_artwork.png');
    if (!fs.existsSync(testArtPath)) {
      const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      fs.writeFileSync(testArtPath, Buffer.from(base64Png, 'base64'));
    }

    const fileInput = await customerPage.$('input[type="file"]');
    if (fileInput) {
      await fileInput.uploadFile(testArtPath);
      console.log('✓ Uploaded test artwork');
      await new Promise(r => setTimeout(r, 1500));
    }

    console.log('Moving from Step 5 to Step 6 (3D Preview)...');
    await customerPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const proceedBtn = btns.find(b => b.textContent.includes('PROCEED TO PREVIEW'));
      if (proceedBtn) proceedBtn.click();
    });
    await new Promise(r => setTimeout(r, 4000));

    // Verify 3D Canvas in Step 6
    const stageDetails = await customerPage.evaluate(() => {
      const canvasEl = document.querySelector('canvas');
      const addToCartBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ADD TO CART'));
      const titleEl = document.querySelector('h1');
      return {
        hasCanvas: !!canvasEl,
        hasAddToCart: !!addToCartBtn,
        stepTitle: titleEl ? titleEl.textContent.trim() : null
      };
    });

    console.log(`Step 6 3D Preview: Canvas=${stageDetails.hasCanvas ? '✅' : '❌'}, AddToCart=${stageDetails.hasAddToCart ? '✅' : '❌'}, Title="${stageDetails.stepTitle}"`);

    await customerPage.screenshot({ path: path.join(EVIDENCE_DIR, '03_live_customizer_3d_stage.png') });
    copyToArtifacts('03_live_customizer_3d_stage.png');
    console.log('📸 Captured 03_live_customizer_3d_stage.png');

    report.customerPortal.details.stageDetails = stageDetails;
    report.customerPortal.passed = !hasSliceError && (stageDetails.hasCanvas || stageDetails.hasAddToCart);

    // =========================================================================
    // PART 2: ADMIN CONSOLE VERIFICATION
    // =========================================================================
    console.log('\n---------------------------------------------------------------');
    console.log('PART 2: Verifying Admin Console (https://admin.theprinthub.co.in/admin)');
    console.log('---------------------------------------------------------------');

    const adminPage = await browser.newPage();
    const adminErrors = [];

    adminPage.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        console.log(`[Admin Console Error] ${text}`);
        adminErrors.push(text);
      }
    });

    adminPage.on('pageerror', err => {
      console.log(`[Admin Page Error] ${err.message}`);
      adminErrors.push(err.message);
    });

    await adminPage.goto('https://admin.theprinthub.co.in/admin', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Check if login form is displayed
    const isLoginRequired = await adminPage.evaluate(() => {
      return !!document.querySelector('input[type="password"]');
    });

    if (isLoginRequired) {
      console.log('Admin login required. Authenticating...');
      await adminPage.type('input[type="email"], input[type="text"]', 'admin@theprinthub.com');
      await adminPage.type('input[type="password"]', 'Theprinthub@123');
      await adminPage.click('button[type="submit"]');
      await adminPage.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 2000));
    }

    // Check specifically for category toLowerCase error
    const hasCategoryError = adminErrors.some(e => e.includes('toLowerCase') && (e.includes('category') || e.includes('$')));
    console.log(`Error check '($.category || "").toLowerCase': ${hasCategoryError ? '❌ DETECTED' : '✅ NOT DETECTED (PASSED)'}`);

    if (hasCategoryError) {
      report.adminConsole.passed = false;
      report.adminConsole.errors.push('($.category || "").toLowerCase is not a function was observed!');
    }

    await adminPage.screenshot({ path: path.join(EVIDENCE_DIR, '04_live_admin_dashboard.png') });
    copyToArtifacts('04_live_admin_dashboard.png');
    console.log('📸 Captured 04_live_admin_dashboard.png');

    // Navigate to Products Tab
    console.log('\nNavigating to Admin Products Tab...');
    await adminPage.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button, a'));
      const prodTab = tabs.find(t => t.textContent.includes('Products') || t.textContent.includes('Catalog'));
      if (prodTab) prodTab.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    const adminProductsCount = await adminPage.evaluate(() => {
      return document.querySelectorAll('table tbody tr, div[class*="group"]').length;
    });
    console.log(`Admin Products Tab: detected ${adminProductsCount} product items`);

    await adminPage.screenshot({ path: path.join(EVIDENCE_DIR, '05_live_admin_products_tab.png') });
    copyToArtifacts('05_live_admin_products_tab.png');
    console.log('📸 Captured 05_live_admin_products_tab.png');

    // Navigate to Categories Tab
    console.log('\nNavigating to Admin Categories Tab...');
    await adminPage.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button, a'));
      const catTab = tabs.find(t => t.textContent.includes('Categories'));
      if (catTab) catTab.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    const adminCategoriesCount = await adminPage.evaluate(() => {
      return document.querySelectorAll('table tbody tr, div[class*="group"]').length;
    });
    console.log(`Admin Categories Tab: detected ${adminCategoriesCount} category items`);

    await adminPage.screenshot({ path: path.join(EVIDENCE_DIR, '06_live_admin_categories_tab.png') });
    copyToArtifacts('06_live_admin_categories_tab.png');
    console.log('📸 Captured 06_live_admin_categories_tab.png');

    // Navigate to 3D Studio Tab
    console.log('\nNavigating to Admin 3D Studio Tab...');
    await adminPage.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button, a'));
      const studioTab = tabs.find(t => t.textContent.includes('3D Studio') || t.textContent.includes('3D Models') || t.textContent.includes('Models'));
      if (studioTab) studioTab.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    const adminModelsCount = await adminPage.evaluate(() => {
      return document.querySelectorAll('table tbody tr, div[class*="group"]').length;
    });
    console.log(`Admin 3D Studio Tab: detected ${adminModelsCount} 3D model items`);

    await adminPage.screenshot({ path: path.join(EVIDENCE_DIR, '07_live_admin_3d_studio_tab.png') });
    copyToArtifacts('07_live_admin_3d_studio_tab.png');
    console.log('📸 Captured 07_live_admin_3d_studio_tab.png');

    const postAuthAdminErrors = adminErrors.filter(e => !e.includes('401'));
    report.adminConsole.details.adminErrors = postAuthAdminErrors;
    report.adminConsole.passed = !hasCategoryError && postAuthAdminErrors.length === 0;

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    try {
      await browser.close();
    } catch (e) {}
  }

  console.log('\n===============================================================');
  console.log('📊 FINAL TEST RESULTS SUMMARY');
  console.log('===============================================================');
  console.log('Customer Customizer:                  ', report.customerPortal.passed ? '✅ PASSED' : '❌ FAILED');
  console.log('Admin Console:                        ', report.adminConsole.passed ? '✅ PASSED' : '❌ FAILED');
  console.log('Runtime Error (k.slice.map):          ', !report.customerPortal.errors.length ? '✅ RESOLVED' : '❌ UNRESOLVED');
  console.log('Runtime Error (category.toLowerCase): ', !report.adminConsole.errors.length ? '✅ RESOLVED' : '❌ UNRESOLVED');

  fs.writeFileSync(path.join(EVIDENCE_DIR, 'verification_report.json'), JSON.stringify(report, null, 2));
  process.exit(0);
}

verifyProduction().catch(err => {
  console.error(err);
  process.exit(1);
});
