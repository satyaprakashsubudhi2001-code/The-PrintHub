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

async function run() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1280,720']
  });

  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  try {
    await page.goto('https://admin.theprinthub.co.in/admin', { waitUntil: 'networkidle', timeout: 35000 });
    await page.waitForTimeout(1500);

    const isLogin = await page.$('input[type="password"]');
    if (isLogin) {
      await page.fill('input[type="text"], input[type="email"]', 'theprinthub.in@gmail.com');
      await page.fill('input[type="password"]', 'Theprinthub@123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
    }

    // Click Categories sidebar button
    console.log('Clicking Categories on sidebar...');
    await page.click('aside button:has-text("Categories")');
    await page.waitForTimeout(2000);

    // Capture Issue 2: Admin category cards in Grid view
    const repro2Grid = 'repro_issue2_admin_categories_grid.png';
    await page.screenshot({ path: path.join(EVIDENCE_DIR, repro2Grid) });
    copyToArtifacts(repro2Grid);

    // Switch to List view
    console.log('Switching to List view...');
    const listBtn = await page.$('button[title*="List" i], button:has-text("List")');
    if (listBtn) {
      await listBtn.click();
      await page.waitForTimeout(1000);
      const repro2List = 'repro_issue2_admin_categories_list.png';
      await page.screenshot({ path: path.join(EVIDENCE_DIR, repro2List) });
      copyToArtifacts(repro2List);
      // Switch back to grid
      const gridBtn = await page.$('button[title*="Grid" i], button:has-text("Grid")');
      if (gridBtn) await gridBtn.click();
      await page.waitForTimeout(1000);
    }

    // Now test Issue 3: Open CREATE NEW CATEGORY modal
    console.log('Opening CREATE NEW CATEGORY modal...');
    await page.click('button:has-text("CREATE NEW CATEGORY")');
    await page.waitForTimeout(1500);

    // In modal, select one of the preset images or click "Adjust Image"
    console.log('Selecting a preset image to enable Adjust Image...');
    await page.evaluate(() => {
      // Find preset image buttons
      const presetImgs = Array.from(document.querySelectorAll('img[src*="unsplash"]'));
      if (presetImgs.length > 0) {
        presetImgs[0].click();
      }
    });
    await page.waitForTimeout(1000);

    // Click "Adjust Image"
    console.log('Clicking Adjust Image button...');
    const clickedCrop = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const cropBtn = btns.find(b => b.textContent && (b.textContent.includes('Adjust') || b.textContent.includes('Crop')));
      if (cropBtn) {
        cropBtn.click();
        return true;
      }
      return false;
    });
    console.log('Clicked Adjust Image?', clickedCrop);
    await page.waitForTimeout(2000);

    // Capture Issue 3: Adjust Image modal on 720p height
    const repro3Modal = 'repro_issue3_adjust_image_modal_720p.png';
    await page.screenshot({ path: path.join(EVIDENCE_DIR, repro3Modal) });
    copyToArtifacts(repro3Modal);

    // Check if bottom buttons are cut off
    const cropMetrics = await page.evaluate(() => {
      const modal = document.querySelector('.relative.w-full.max-w-xl');
      if (!modal) return { found: false };
      const rect = modal.getBoundingClientRect();
      const saveBtn = Array.from(modal.querySelectorAll('button')).find(b => b.textContent.includes('CROP & SAVE') || b.textContent.includes('SAVE'));
      const saveRect = saveBtn ? saveBtn.getBoundingClientRect() : null;
      return {
        found: true,
        windowHeight: window.innerHeight,
        modalTop: rect.top,
        modalBottom: rect.bottom,
        modalHeight: rect.height,
        saveBtnBottom: saveRect ? saveRect.bottom : null,
        isSaveBtnVisible: saveRect ? (saveRect.bottom <= window.innerHeight && saveRect.top >= 0) : false
      };
    });
    console.log('Adjust Image Modal Metrics at 1280x720:', cropMetrics);

  } catch (err) {
    console.error('Error during inspection:', err);
  } finally {
    await browser.close();
  }
}

run();
