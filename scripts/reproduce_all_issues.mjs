import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EVIDENCE_DIR = path.resolve('qa_evidence');
const ARTIFACT_DIR = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\3110483e-9dcc-4071-9ce5-b7b688aaa29f';

if (!fs.existsSync(EVIDENCE_DIR)) fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

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

async function reproduce() {
  console.log('🚀 Starting reproduction of 4 UI issues on Live Production...\n');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // =========================================================================
    // ISSUE 1: Customer Category Images
    // =========================================================================
    console.log('--- Inspecting Issue 1: Customer Category Images ---');
    await page.goto('https://theprinthub.co.in/', { waitUntil: 'networkidle', timeout: 35000 });
    await page.waitForTimeout(2000);

    // Scroll to Category section
    const catSection = await page.$('text=Product Categories');
    if (catSection) {
      await catSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
    }

    const issue1File = 'repro_issue1_customer_categories.png';
    await page.screenshot({ path: path.join(EVIDENCE_DIR, issue1File) });
    copyToArtifacts(issue1File);

    // Inspect image element styles
    const customerImgData = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('img[alt*="Shirt"], img[alt*="T-Shirt"]'));
      return cards.map(img => {
        const computed = window.getComputedStyle(img);
        const parentComputed = window.getComputedStyle(img.parentElement);
        return {
          alt: img.alt,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          renderedWidth: img.clientWidth,
          renderedHeight: img.clientHeight,
          objectFit: computed.objectFit,
          objectPosition: computed.objectPosition,
          parentAspect: parentComputed.aspectRatio || parentComputed.height,
          parentClasses: img.parentElement.className
        };
      });
    });
    console.log('Customer Category Images inspection:', JSON.stringify(customerImgData, null, 2));

    // =========================================================================
    // ISSUE 2 & 4: Admin Category Images & Sidebar Scrolling
    // =========================================================================
    console.log('\n--- Inspecting Issue 2 & 4: Admin Category Images & Sidebar Scrolling ---');
    await page.goto('https://admin.theprinthub.co.in/admin', { waitUntil: 'networkidle', timeout: 35000 });
    await page.waitForTimeout(2000);

    const isLogin = await page.$('input[type="password"]');
    if (isLogin) {
      await page.fill('input[type="text"], input[type="email"]', 'theprinthub.in@gmail.com');
      await page.fill('input[type="password"]', 'Theprinthub@123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
    }

    // Go to Categories Tab
    console.log('Navigating to Admin Categories Tab...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button, a'));
      const catTab = tabs.find(t => t.textContent && t.textContent.trim() === 'Categories');
      if (catTab) catTab.click();
    });
    await page.waitForTimeout(2000);

    const issue2File = 'repro_issue2_admin_categories.png';
    await page.screenshot({ path: path.join(EVIDENCE_DIR, issue2File) });
    copyToArtifacts(issue2File);

    // Inspect Admin Category card image styling
    const adminImgData = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('img[alt*="Shirt"], img[alt*="T-Shirt"]'));
      return cards.map(img => {
        const computed = window.getComputedStyle(img);
        return {
          alt: img.alt,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          renderedWidth: img.clientWidth,
          renderedHeight: img.clientHeight,
          objectFit: computed.objectFit,
          objectPosition: computed.objectPosition,
          parentClasses: img.parentElement.className
        };
      });
    });
    console.log('Admin Category Images inspection:', JSON.stringify(adminImgData, null, 2));

    // Test Issue 4: Scroll down the admin page and check sidebar position
    console.log('Testing Issue 4: Admin Sidebar scroll behavior...');
    const sidebarPosBefore = await page.evaluate(() => {
      const aside = document.querySelector('aside');
      const rect = aside ? aside.getBoundingClientRect() : null;
      return {
        top: rect?.top,
        height: rect?.height,
        windowScrollY: window.scrollY,
        bodyScrollY: document.body.scrollTop,
        mainScrollY: document.querySelector('main')?.scrollTop
      };
    });

    // Scroll down 600px
    await page.evaluate(() => {
      window.scrollBy(0, 600);
      const main = document.querySelector('main');
      if (main) main.scrollTop = 600;
    });
    await page.waitForTimeout(1000);

    const sidebarPosAfter = await page.evaluate(() => {
      const aside = document.querySelector('aside');
      const rect = aside ? aside.getBoundingClientRect() : null;
      const computed = aside ? window.getComputedStyle(aside) : null;
      const parentComputed = aside?.parentElement ? window.getComputedStyle(aside.parentElement) : null;
      return {
        top: rect?.top,
        height: rect?.height,
        position: computed?.position,
        parentOverflow: parentComputed?.overflow,
        parentOverflowX: parentComputed?.overflowX,
        parentOverflowY: parentComputed?.overflowY,
        windowScrollY: window.scrollY,
        mainScrollY: document.querySelector('main')?.scrollTop
      };
    });
    console.log('Sidebar Position Before Scroll:', sidebarPosBefore);
    console.log('Sidebar Position After Scroll:', sidebarPosAfter);

    const issue4File = 'repro_issue4_admin_sidebar_scrolled.png';
    await page.screenshot({ path: path.join(EVIDENCE_DIR, issue4File) });
    copyToArtifacts(issue4File);

    // =========================================================================
    // ISSUE 3: Adjust Image Modal Scrolling
    // =========================================================================
    console.log('\n--- Inspecting Issue 3: Adjust Image Modal Scrolling ---');
    // Test on laptop height 720p (1280x720) to see modal cutoff
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);

    // Open "CREATE NEW CATEGORY" modal
    console.log('Opening CREATE NEW CATEGORY modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find(b => b.textContent && b.textContent.includes('CREATE NEW CATEGORY'));
      if (addBtn) addBtn.click();
    });
    await page.waitForTimeout(1500);

    // Click "Adjust Image" or "Crop" button in the modal
    console.log('Opening Adjust Image / Cropper modal...');
    const adjustBtnClicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const cropBtn = btns.find(b => b.textContent && (b.textContent.includes('Adjust') || b.textContent.includes('Crop')));
      if (cropBtn) {
        cropBtn.click();
        return true;
      }
      return false;
    });
    await page.waitForTimeout(2000);

    const modalMetrics = await page.evaluate(() => {
      const modal = document.querySelector('.relative.w-full.max-w-xl') || document.querySelector('div[class*="max-w-xl"]');
      if (!modal) return { found: false };
      const rect = modal.getBoundingClientRect();
      const windowH = window.innerHeight;
      const saveBtn = Array.from(modal.querySelectorAll('button')).find(b => b.textContent.includes('SAVE'));
      const saveRect = saveBtn ? saveBtn.getBoundingClientRect() : null;
      return {
        found: true,
        modalTop: rect.top,
        modalBottom: rect.bottom,
        modalHeight: rect.height,
        windowHeight: windowH,
        isOverflowingBottom: rect.bottom > windowH,
        saveBtnBottom: saveRect?.bottom,
        saveBtnVisibleInViewport: saveRect ? (saveRect.bottom <= windowH && saveRect.top >= 0) : false
      };
    });
    console.log('Image Cropper Modal Metrics (1280x720):', modalMetrics);

    const issue3File = 'repro_issue3_adjust_image_modal_cutoff.png';
    await page.screenshot({ path: path.join(EVIDENCE_DIR, issue3File) });
    copyToArtifacts(issue3File);

    console.log('\n🎉 Reproduction completed successfully!');
  } catch (err) {
    console.error('Reproduction error:', err);
  } finally {
    await browser.close();
  }
}

reproduce();
