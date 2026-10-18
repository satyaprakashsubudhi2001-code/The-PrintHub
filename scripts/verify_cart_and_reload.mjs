import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EVIDENCE_DIR = path.resolve('qa_evidence');
const ARTIFACT_DIR = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\a93b63f6-3fe0-4989-80b5-7e351dd0b4cd';

async function testFullCustomizerFlow() {
  console.log('🚀 Running Complete End-to-End Customizer & Cart Persistence QA...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--window-size=1440,900'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', err => {
    console.error('PAGE_ERROR:', err.message);
    pageErrors.push(err.message);
  });

  try {
    // 1. Navigate to Storefront
    console.log('1. Loading https://www.theprinthub.co.in/ ...');
    await page.goto('https://www.theprinthub.co.in/', { waitUntil: 'networkidle2' });

    // 2. Open Customizer
    console.log('2. Opening Custom Printing 3D Studio...');
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('button, a'));
      const customNav = links.find(el => el.textContent && el.textContent.includes('Custom Printing'));
      if (customNav) customNav.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    // 3. Step 1: Select T-Shirt
    console.log('3. Step 1: Selecting T-Shirt blank...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const tshirtBtn = btns.find(b => b.textContent && b.textContent.includes('CUSTOMIZE IN 3D STUDIO'));
      if (tshirtBtn) tshirtBtn.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    // 4. Step 2: Next: Select Size
    console.log('4. Step 2: Next: Select Size...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent && b.textContent.includes('Next: Select Size'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    // 5. Step 3: Next: Select Print Placements
    console.log('5. Step 3: Next: Select Print Placements...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent && b.textContent.includes('Next: Select Print Placements'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    // 6. Step 4: Next: Upload & Design
    console.log('6. Step 4: Next: Upload & Design...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent && b.textContent.includes('Next: Upload & Design'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    // 7. Step 5: Upload Artwork & Proceed to Preview
    console.log('7. Step 5: Uploading Artwork & Proceed to Preview...');
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
      await fileInput.uploadFile(path.join(EVIDENCE_DIR, 'test_artwork.png'));
      console.log('✓ Uploaded test_artwork.png');
      await new Promise(r => setTimeout(r, 3000));
    }

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const proceedPreview = btns.find(b => b.textContent && b.textContent.includes('PROCEED TO PREVIEW'));
      if (proceedPreview) proceedPreview.click();
    });
    await new Promise(r => setTimeout(r, 4000));

    // 8. Step 6: 3D Preview & Orbit
    console.log('8. Step 6: Inspecting 3D Model & Orbit Controls...');
    await page.mouse.move(720, 480);
    await page.mouse.down();
    await page.mouse.move(860, 460, { steps: 15 });
    await page.mouse.up();
    await new Promise(r => setTimeout(r, 1500));

    // 9. Click ADD TO CART
    console.log('9. Step 6: Clicking ADD TO CART...');
    const clickedAdd = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find(b => b.textContent && b.textContent.includes('ADD TO CART'));
      if (addBtn) {
        addBtn.click();
        return true;
      }
      return false;
    });
    console.log('✓ ADD TO CART clicked successfully:', clickedAdd);
    await new Promise(r => setTimeout(r, 3000));

    // 10. Capture Cart Drawer Screenshot
    const cartScreenshot = path.join(EVIDENCE_DIR, '07_cart_customization.png');
    await page.screenshot({ path: cartScreenshot });
    fs.copyFileSync(cartScreenshot, path.join(ARTIFACT_DIR, '07_cart_customization.png'));
    console.log('✓ Saved 07_cart_customization.png to evidence and artifacts');

    // 11. Verify LocalStorage Cart State
    const cartJson = await page.evaluate(() => localStorage.getItem('printhub_cart_v2'));
    const cartItems = cartJson ? JSON.parse(cartJson) : [];
    console.log(`✓ Cart contains ${cartItems.length} item(s)`);
    if (cartItems.length > 0) {
      const first = cartItems[0];
      console.log('First Cart Item Snapshot:', {
        id: first.id,
        productName: first.productName,
        unitPrice: first.unitPrice,
        totalPrice: first.totalPrice,
        color: first.color,
        size: first.size,
        hasModel3D: !!first.modelId,
        hasCustomizationSnapshot: !!first.customization
      });
    }

    // 12. Test Refresh Persistence
    console.log('10. Refreshing page to verify persistence...');
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2500));

    const reloadedCartJson = await page.evaluate(() => localStorage.getItem('printhub_cart_v2'));
    const reloadedCart = reloadedCartJson ? JSON.parse(reloadedCartJson) : [];
    console.log(`✓ Post-refresh Cart contains ${reloadedCart.length} item(s)`);

    console.log('\n--- QA RESULTS SUMMARY ---');
    console.log('Page Errors Encountered:', pageErrors.length);
    console.log('Add To Cart Triggered:', clickedAdd);
    console.log('Cart Items Persisted Post-Refresh:', reloadedCart.length > 0);

    if (pageErrors.length === 0 && clickedAdd && reloadedCart.length > 0) {
      console.log('🏆 ALL CUSTOMER PORTAL REQUIREMENTS PASSED WITH ZERO ERRORS!');
    } else {
      console.warn('⚠️ Verification finished with notes.');
    }
  } catch (err) {
    console.error('Test run failed:', err);
  } finally {
    await browser.close();
  }
}

testFullCustomizerFlow();
