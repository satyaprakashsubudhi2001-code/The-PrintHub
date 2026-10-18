import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EVIDENCE_DIR = path.resolve('qa_evidence');
const ARTIFACT_DIR = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\a93b63f6-3fe0-4989-80b5-7e351dd0b4cd';

function copyToArtifacts(filename) {
  try {
    const src = path.join(EVIDENCE_DIR, filename);
    const dest = path.join(ARTIFACT_DIR, filename);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✓ Copied ${filename} to artifacts directory`);
    }
  } catch (err) {
    console.warn(`Failed to copy ${filename}:`, err.message);
  }
}

async function run() {
  console.log('🚀 Running Deep Evidence Capture on Deployed Live Sites...');

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

  const page = await browser.newPage();

  try {
    // ------------------------------------------------------------------
    // CUSTOMER PORTAL DEEP EVIDENCE
    // ------------------------------------------------------------------
    console.log('Navigating to Customer Storefront Customizer...');
    await page.goto('https://www.theprinthub.co.in/', { waitUntil: 'networkidle2', timeout: 30000 });

    // Click Custom Printing
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a, button'));
      const customLink = links.find(l => l.textContent && l.textContent.includes('Custom Printing'));
      if (customLink) customLink.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    // 1. T-Shirt in 3D Canvas
    console.log('Selecting T-Shirt and navigating to 3D Preview...');
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('button, div'));
      const tshirtBtn = cards.find(b => b.textContent && b.textContent.includes('CUSTOMIZE IN 3D STUDIO') && b.closest('div')?.textContent?.includes('T-Shirt'));
      if (tshirtBtn) tshirtBtn.click();
      else {
        const anyBtn = cards.find(b => b.textContent && b.textContent.includes('CUSTOMIZE IN 3D STUDIO'));
        if (anyBtn) anyBtn.click();
      }
    });
    await new Promise(r => setTimeout(r, 1500));

    // Jump to Step 6: 3D PREVIEW
    await page.evaluate(() => {
      const steps = Array.from(document.querySelectorAll('button, div, span'));
      const step6 = steps.find(s => s.textContent && s.textContent.includes('6. 3D PREVIEW'));
      if (step6) step6.click();
    });
    await new Promise(r => setTimeout(r, 4000));

    // Rotate the 3D model slightly
    await page.mouse.move(720, 480);
    await page.mouse.down();
    await page.mouse.move(860, 460, { steps: 15 });
    await page.mouse.up();
    await new Promise(r => setTimeout(r, 1500));

    await page.screenshot({ path: path.join(EVIDENCE_DIR, '01_customer_tshirt_3d.png') });
    copyToArtifacts('01_customer_tshirt_3d.png');

    // 2. Upload artwork and show on 3D mesh
    console.log('Going to Step 5 to upload artwork...');
    await page.evaluate(() => {
      const steps = Array.from(document.querySelectorAll('button, div, span'));
      const step5 = steps.find(s => s.textContent && s.textContent.includes('5. ATELIER DESIGN'));
      if (step5) step5.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
      await fileInput.uploadFile(path.join(EVIDENCE_DIR, 'test_artwork.png'));
      console.log('✓ Uploaded test_artwork.png');
      await new Promise(r => setTimeout(r, 3000));
    }

    // Go back to Step 6: 3D PREVIEW
    await page.evaluate(() => {
      const steps = Array.from(document.querySelectorAll('button, div, span'));
      const step6 = steps.find(s => s.textContent && s.textContent.includes('6. 3D PREVIEW'));
      if (step6) step6.click();
    });
    await new Promise(r => setTimeout(r, 3500));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '05_artwork_mapped_3d.png') });
    copyToArtifacts('05_artwork_mapped_3d.png');

    // Click 2D Layout
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn2d = buttons.find(b => b.textContent && b.textContent.includes('2D Layout'));
      if (btn2d) btn2d.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '06_2d_layout_consistency.png') });
    copyToArtifacts('06_2d_layout_consistency.png');

    // Add to Cart
    console.log('Clicking ADD TO CART...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const addBtn = buttons.find(b => b.textContent && b.textContent.includes('ADD TO CART'));
      if (addBtn) addBtn.click();
    });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '07_cart_customization.png') });
    copyToArtifacts('07_cart_customization.png');

    // ------------------------------------------------------------------
    // ADMIN PORTAL DEEP EVIDENCE
    // ------------------------------------------------------------------
    console.log('\nNavigating to Admin Portal (https://admin.theprinthub.co.in)...');
    await page.goto('https://admin.theprinthub.co.in/', { waitUntil: 'networkidle2', timeout: 30000 });

    const isLogin = await page.evaluate(() => !!document.querySelector('input[type="password"]'));
    if (isLogin) {
      console.log('Logging in to Admin...');
      await page.type('input[type="email"], input[name="email"], input[placeholder*="email" i]', 'theprinthub.in@gmail.com');
      await page.type('input[type="password"]', 'Theprinthub@123');
      await page.evaluate(() => {
        const btn = document.querySelector('button[type="submit"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Sign In'));
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 3500));
    }

    // Go to 3D Studio tab
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button, a'));
      const studioTab = tabs.find(t => t.textContent && (t.textContent.includes('3D Studio') || t.textContent.includes('3D Models')));
      if (studioTab) studioTab.click();
    });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '08_admin_3d_studio_dashboard.png') });
    copyToArtifacts('08_admin_3d_studio_dashboard.png');

    // Open Add 3D Model Modal (case-insensitive search)
    console.log('Clicking Add 3D Model button...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const addBtn = buttons.find(b => b.textContent && b.textContent.toLowerCase().includes('add 3d model'));
      if (addBtn) addBtn.click();
    });
    await new Promise(r => setTimeout(r, 2500));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '09_admin_add_model_modal.png') });
    copyToArtifacts('09_admin_add_model_modal.png');

    // Close Add Modal
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cancelBtn = buttons.find(b => b.textContent && b.textContent.toLowerCase().includes('cancel'));
      if (cancelBtn) cancelBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Open 3D Preview Modal
    console.log('Clicking 3D Preview on first model...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const previewBtn = buttons.find(b => b.textContent && b.textContent.includes('3D Preview'));
      if (previewBtn) previewBtn.click();
    });
    await new Promise(r => setTimeout(r, 3500));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '10_admin_model_preview_modal.png') });
    copyToArtifacts('10_admin_model_preview_modal.png');

    console.log('🎉 All deep evidence captured successfully!');

  } catch (err) {
    console.error('Deep evidence capture error:', err);
  } finally {
    await browser.close();
  }
}

run();
