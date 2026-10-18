import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import prisma from '../api/_lib/prisma.js';

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

async function verifyIssue5AndAll() {
  console.log('===============================================================');
  console.log('🧪 VERIFYING ISSUE 5: STORE ADDRESS SYNC & PERSISTENCE');
  console.log('===============================================================\n');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const results = {
    issue5: {
      adminFormLocated: false,
      initialAddress: '',
      testAddressSaved: '',
      apiResponseOk: false,
      databasePersisted: false,
      dbContent: null,
      customerInitialAddress: '',
      customerUpdatedAddress: '',
      customerReloadedAddress: '',
      persistedAfterReload: false,
      restoredAddress: ''
    },
    issues1to4: {}
  };

  try {
    // -------------------------------------------------------------------------
    // STEP 1: Inspect Customer Storefront BEFORE change
    // -------------------------------------------------------------------------
    console.log('>>> [Step 1] Inspecting Customer Storefront before address change...');
    const custContext1 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const custPage1 = await custContext1.newPage();
    await custPage1.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
    await custPage1.waitForTimeout(2000);

    // Scroll to footer
    const footerElement = await custPage1.$('footer');
    if (footerElement) {
      await footerElement.scrollIntoViewIfNeeded();
      await custPage1.waitForTimeout(1000);
    }

    const initialFooterText = await custPage1.evaluate(() => {
      const footer = document.querySelector('footer');
      const mapPinDiv = Array.from(footer?.querySelectorAll('div') || []).find(d => d.textContent.includes('Plot') || d.textContent.includes('District') || d.textContent.includes('Mumbai') || d.textContent.includes('Industrial Area'));
      return mapPinDiv ? mapPinDiv.textContent.trim() : footer?.innerText || '';
    });

    results.issue5.customerInitialAddress = initialFooterText;
    console.log('Customer Initial Address in Footer:', initialFooterText);

    const fileBeforeCust = 'before_issue5_customer_footer.png';
    await custPage1.screenshot({ path: path.join(EVIDENCE_DIR, fileBeforeCust) });
    copyToArtifacts(fileBeforeCust);
    await custContext1.close();

    // -------------------------------------------------------------------------
    // STEP 2: Open Admin Contact Settings Tab
    // -------------------------------------------------------------------------
    console.log('\n>>> [Step 2] Opening Admin Contact Settings Form...');
    const adminContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const adminPage = await adminContext.newPage();
    await adminPage.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 30000 });
    await adminPage.waitForTimeout(1500);

    // Login if needed
    const passInput = await adminPage.$('input[type="password"]');
    if (passInput) {
      await adminPage.fill('input[type="text"], input[type="email"]', 'theprinthub.in@gmail.com');
      await adminPage.fill('input[type="password"]', 'Theprinthub@123');
      await adminPage.click('button[type="submit"]');
      await adminPage.waitForTimeout(2000);
    }

    // Click "Contact & Social" in sidebar
    const contactBtn = await adminPage.$('button:has-text("Contact & Social"), button:has-text("Contact")');
    if (contactBtn) {
      await contactBtn.click();
      await adminPage.waitForTimeout(1500);
    }

    // Locate Address textarea / input
    const addressInput = await adminPage.$('textarea, input[value*="Plot"], input[value*="District"], input[value*="Mumbai"]');
    if (addressInput) {
      results.issue5.adminFormLocated = true;
      results.issue5.initialAddress = await addressInput.inputValue();
      console.log('Admin Form located. Current value:', results.issue5.initialAddress);

      const fileBeforeAdmin = 'before_issue5_admin_address_form.png';
      await adminPage.screenshot({ path: path.join(EVIDENCE_DIR, fileBeforeAdmin) });
      copyToArtifacts(fileBeforeAdmin);

      // -----------------------------------------------------------------------
      // STEP 3: Enter new test address & Save
      // -----------------------------------------------------------------------
      const TEST_ADDRESS = 'The PrintHub Flagship Atelier, 77 Heritage Textile Lane, Lower Parel, Mumbai 400013, Maharashtra, India';
      console.log(`\n>>> [Step 3] Entering new address: "${TEST_ADDRESS}"`);
      await addressInput.fill(TEST_ADDRESS);
      await adminPage.waitForTimeout(500);

      const saveBtn = await adminPage.$('button[type="submit"]:has-text("SAVE")');
      if (saveBtn) {
        console.log('Clicking Save button...');
        await saveBtn.click();
        await adminPage.waitForTimeout(2500);
      }

      const fileAfterAdmin = 'after_issue5_admin_address_saved.png';
      await adminPage.screenshot({ path: path.join(EVIDENCE_DIR, fileAfterAdmin) });
      copyToArtifacts(fileAfterAdmin);

      results.issue5.testAddressSaved = TEST_ADDRESS;
    } else {
      console.error('❌ Could not locate address input in AdminContactSettingsTab');
    }

    // -------------------------------------------------------------------------
    // STEP 4: Verify Database Persistence directly in PostgreSQL
    // -------------------------------------------------------------------------
    console.log('\n>>> [Step 4] Checking PostgreSQL database persistence via Prisma...');
    const dbRecord = await prisma.homepageContent.findUnique({
      where: { key: 'contact_settings' }
    });

    if (dbRecord && dbRecord.content) {
      const parsed = JSON.parse(dbRecord.content);
      results.issue5.databasePersisted = parsed.address === results.issue5.testAddressSaved;
      results.issue5.dbContent = parsed;
      console.log('✓ Database record retrieved:', {
        key: dbRecord.key,
        persistedAddress: parsed.address,
        updatedAt: dbRecord.updatedAt,
        matchesTestAddress: results.issue5.databasePersisted
      });
    } else {
      console.error('❌ No record found in database for key "contact_settings"');
    }

    // -------------------------------------------------------------------------
    // STEP 5: Verify Customer Storefront in Fresh Session
    // -------------------------------------------------------------------------
    console.log('\n>>> [Step 5] Checking Customer Storefront in a fresh session...');
    const custContext2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const custPage2 = await custContext2.newPage();
    await custPage2.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
    await custPage2.waitForTimeout(2000);

    const footer2 = await custPage2.$('footer');
    if (footer2) {
      await footer2.scrollIntoViewIfNeeded();
      await custPage2.waitForTimeout(1000);
    }

    const updatedFooterText = await custPage2.evaluate(() => {
      const footer = document.querySelector('footer');
      const spans = Array.from(footer?.querySelectorAll('span') || []);
      const addressSpan = spans.find(s => s.textContent.includes('Heritage') || s.textContent.includes('Plot') || s.textContent.includes('Textile') || s.textContent.includes('Mumbai'));
      return addressSpan ? addressSpan.textContent.trim() : '';
    });

    results.issue5.customerUpdatedAddress = updatedFooterText;
    console.log('Customer Updated Address in Footer:', updatedFooterText);

    const fileAfterCust = 'after_issue5_customer_footer_updated.png';
    await custPage2.screenshot({ path: path.join(EVIDENCE_DIR, fileAfterCust) });
    copyToArtifacts(fileAfterCust);

    // -------------------------------------------------------------------------
    // STEP 6: Refresh Customer Website and Verify Persistence
    // -------------------------------------------------------------------------
    console.log('\n>>> [Step 6] Refreshing Customer Website to verify persistence...');
    await custPage2.reload({ waitUntil: 'networkidle' });
    await custPage2.waitForTimeout(2000);

    const footer3 = await custPage2.$('footer');
    if (footer3) {
      await footer3.scrollIntoViewIfNeeded();
      await custPage2.waitForTimeout(1000);
    }

    const reloadedFooterText = await custPage2.evaluate(() => {
      const footer = document.querySelector('footer');
      const spans = Array.from(footer?.querySelectorAll('span') || []);
      const addressSpan = spans.find(s => s.textContent.includes('Heritage') || s.textContent.includes('Plot') || s.textContent.includes('Textile') || s.textContent.includes('Mumbai'));
      return addressSpan ? addressSpan.textContent.trim() : '';
    });

    results.issue5.customerReloadedAddress = reloadedFooterText;
    results.issue5.persistedAfterReload = reloadedFooterText.includes('Heritage Textile Lane');
    console.log('Customer Reloaded Address in Footer:', reloadedFooterText);
    console.log('✓ Persisted after reload:', results.issue5.persistedAfterReload);

    const fileReloadCust = 'after_issue5_customer_footer_reloaded.png';
    await custPage2.screenshot({ path: path.join(EVIDENCE_DIR, fileReloadCust) });
    copyToArtifacts(fileReloadCust);

    await custContext2.close();
    await adminContext.close();

  } catch (err) {
    console.error('Error during Issue 5 verification:', err);
    results.issue5.error = err.message;
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }

  // Save results JSON
  fs.writeFileSync(path.join(EVIDENCE_DIR, 'issue5_test_results.json'), JSON.stringify(results, null, 2));
  copyToArtifacts('issue5_test_results.json');

  console.log('\n===============================================================');
  console.log('📊 ISSUE 5 TEST SUMMARY:');
  console.log(JSON.stringify(results.issue5, null, 2));
  console.log('===============================================================');
}

verifyIssue5AndAll().catch(console.error);
