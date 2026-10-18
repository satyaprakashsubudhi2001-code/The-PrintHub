import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EVIDENCE_DIR = path.resolve('qa_evidence');
const ARTIFACT_DIR = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\3110483e-9dcc-4071-9ce5-b7b688aaa29f';

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

async function captureRemainingScreenshots() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('Navigating to Admin Portal to capture Add Category and Mobile view...');
    await page.goto('https://admin.theprinthub.co.in/admin', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    const isLogin = await page.$('input[type="password"]');
    if (isLogin) {
      await page.fill('input[type="text"], input[type="email"]', 'theprinthub.in@gmail.com');
      await page.fill('input[type="password"]', 'Theprinthub@123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
    }

    // Go to Categories Tab
    console.log('Opening Categories tab...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button, a'));
      const catTab = tabs.find(t => t.textContent && t.textContent.trim() === 'Categories');
      if (catTab) catTab.click();
    });
    await page.waitForTimeout(1500);

    // Open "CREATE NEW CATEGORY" modal
    console.log('Opening CREATE NEW CATEGORY modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find(b => b.textContent && b.textContent.includes('CREATE NEW CATEGORY'));
      if (addBtn) addBtn.click();
    });
    await page.waitForTimeout(1500);

    const catModalFile = 'empty_12_admin_add_category_validation.png';
    await page.screenshot({ path: path.join(EVIDENCE_DIR, catModalFile) });
    copyToArtifacts(catModalFile);

    // Close Category Modal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const cancelBtn = btns.find(b => b.textContent && (b.textContent.includes('Cancel') || b.textContent.includes('Close') || b.textContent.trim() === '✕'));
      if (cancelBtn) cancelBtn.click();
    });
    await page.waitForTimeout(1000);

    // Test Mobile Layout on Admin
    console.log('Setting Admin mobile viewport (390x844)...');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(1500);

    const adminMobileFile = 'empty_15_admin_dashboard_mobile.png';
    await page.screenshot({ path: path.join(EVIDENCE_DIR, adminMobileFile) });
    copyToArtifacts(adminMobileFile);

    console.log('🎉 Successfully captured remaining screenshots!');
  } catch (err) {
    console.error('Error in captureRemainingScreenshots:', err);
  } finally {
    await browser.close();
  }
}

captureRemainingScreenshots();
