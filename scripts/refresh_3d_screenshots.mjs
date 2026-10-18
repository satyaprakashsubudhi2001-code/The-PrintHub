import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EVIDENCE_DIR = path.resolve('qa_evidence');
const ARTIFACT_DIR = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\a93b63f6-3fe0-4989-80b5-7e351dd0b4cd';

async function captureUpdatedScreenshots() {
  console.log('Capturing fresh live screenshots of 3D Canvas, Artwork Mapping & 2D Layout...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--window-size=1440,900'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  await page.goto('https://www.theprinthub.co.in/', { waitUntil: 'networkidle2' });

  // 1. Click Custom Printing
  await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const btn = Array.from(nav.querySelectorAll('button')).find(b => b.textContent.includes('Custom Printing'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  // 2. Select T-Shirt
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(x => x.textContent.includes('CUSTOMIZE IN 3D STUDIO'));
    if (b) b.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // 3. Step 2 -> 3 -> 4
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

  // 4. Capture 2D Layout consistency screenshot (Step 5)
  console.log('Capturing 06_2d_layout_consistency.png...');
  const p6 = path.join(EVIDENCE_DIR, '06_2d_layout_consistency.png');
  await page.screenshot({ path: p6 });
  fs.copyFileSync(p6, path.join(ARTIFACT_DIR, '06_2d_layout_consistency.png'));

  // 5. Upload artwork in Step 5
  console.log('Uploading artwork in Step 5...');
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.uploadFile(path.join(EVIDENCE_DIR, 'test_artwork.png'));
    await new Promise(r => setTimeout(r, 3000));
  }

  // 6. Proceed to Preview (Step 6)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b5 = btns.find(x => x.textContent.includes('PROCEED TO PREVIEW'));
    if (b5) b5.click();
  });
  await new Promise(r => setTimeout(r, 4500));

  // 7. Capture Artwork Mapped 3D screenshot
  console.log('Capturing 05_artwork_mapped_3d.png...');
  const p5 = path.join(EVIDENCE_DIR, '05_artwork_mapped_3d.png');
  await page.screenshot({ path: p5 });
  fs.copyFileSync(p5, path.join(ARTIFACT_DIR, '05_artwork_mapped_3d.png'));

  // 8. Rotate model in 3D canvas and capture 01_customer_tshirt_3d.png
  console.log('Rotating 3D canvas and capturing 01_customer_tshirt_3d.png...');
  await page.mouse.move(720, 520);
  await page.mouse.down();
  await page.mouse.move(860, 480, { steps: 15 });
  await page.mouse.up();
  await new Promise(r => setTimeout(r, 1500));

  const p1 = path.join(EVIDENCE_DIR, '01_customer_tshirt_3d.png');
  await page.screenshot({ path: p1 });
  fs.copyFileSync(p1, path.join(ARTIFACT_DIR, '01_customer_tshirt_3d.png'));

  console.log('✓ All 3 customer 3D screenshots refreshed successfully!');
  await browser.close();
}

captureUpdatedScreenshots();
