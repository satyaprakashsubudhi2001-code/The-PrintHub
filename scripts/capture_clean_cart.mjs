import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EVIDENCE_DIR = path.resolve('qa_evidence');
const ARTIFACT_DIR = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\a93b63f6-3fe0-4989-80b5-7e351dd0b4cd';

async function run() {
  console.log('Starting Clean Cart Drawer & Checkout QA Capture...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--window-size=1440,900'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  await page.goto('https://www.theprinthub.co.in/', { waitUntil: 'networkidle2' });

  // 1. Click Custom Printing
  console.log('1. Navigating to Custom Printing...');
  await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const btn = Array.from(nav.querySelectorAll('button')).find(b => b.textContent.includes('Custom Printing'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  // 2. Select T-Shirt
  console.log('2. Selecting T-Shirt blank...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(x => x.textContent.includes('CUSTOMIZE IN 3D STUDIO'));
    if (b) b.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // 3. Step 2 -> 3 -> 4
  console.log('3. Advancing Step 2 -> 3 -> 4...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b2 = btns.find(x => x.textContent.includes('Next: Select Size'));
    if (b2) b2.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b3 = btns.find(x => x.textContent.includes('Next: Select Print Placements'));
    if (b3) b3.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b4 = btns.find(x => x.textContent.includes('Next: Upload & Design'));
    if (b4) b4.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  // 4. Upload test artwork
  console.log('4. Uploading artwork...');
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.uploadFile(path.join(EVIDENCE_DIR, 'test_artwork.png'));
    await new Promise(r => setTimeout(r, 3000));
  }

  // 5. Proceed to Preview (Step 6)
  console.log('5. Proceeding to 3D Preview...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b5 = btns.find(x => x.textContent.includes('PROCEED TO PREVIEW'));
    if (b5) b5.click();
  });
  await new Promise(r => setTimeout(r, 4000));

  // 6. Click ADD TO CART
  console.log('6. Clicking ADD TO CART...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b6 = btns.find(x => x.textContent.includes('ADD TO CART'));
    if (b6) b6.click();
  });
  await new Promise(r => setTimeout(r, 3000));

  // 7. Capture Cart Drawer Screenshot
  const cartPath = path.join(EVIDENCE_DIR, '07_cart_customization.png');
  await page.screenshot({ path: cartPath });
  fs.copyFileSync(cartPath, path.join(ARTIFACT_DIR, '07_cart_customization.png'));
  console.log('✓ Successfully captured and updated 07_cart_customization.png');

  // 8. Test Proceed to Checkout button
  console.log('7. Testing Proceed to Checkout...');
  const checkoutBtnFound = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const chk = btns.find(b => b.textContent && b.textContent.includes('Proceed to Secure Checkout'));
    if (chk) {
      chk.click();
      return true;
    }
    return false;
  });
  console.log('✓ Clicked Proceed to Secure Checkout:', checkoutBtnFound);
  await new Promise(r => setTimeout(r, 3000));

  const currentView = await page.evaluate(() => {
    return {
      title: document.querySelector('h1')?.textContent || document.querySelector('h2')?.textContent || document.title,
      textPreview: document.body.innerText.substring(0, 300).replace(/\s+/g, ' ')
    };
  });
  console.log('Checkout page state:', currentView);

  console.log('🎉 Verification Complete!');
  await browser.close();
}

run();
