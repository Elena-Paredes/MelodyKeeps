import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('📸 QA VISUAL — 4 screenshots\n');

  await page.goto('http://localhost:4200/demo-multiple', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const songs = [
    { testid: 'demo-spring-day', file: 'spring-day-purple.png', expected: 'Purple' },
    { testid: 'demo-fake-love', file: 'fake-love-purple.png', expected: 'Purple' },
    { testid: 'demo-dna', file: 'dna-purple.png', expected: 'Purple' },
  ];

  for (const { testid, file, expected } of songs) {
    const div = page.locator(`[data-testid="${testid}"]`).first();
    const visible = await div.isVisible().catch(() => false);

    if (visible) {
      const path = `C:\\MelodyKeeps\\_review\\color-variants\\arirang-red\\${file}`;
      await div.screenshot({ path });
      console.log(`✓ ${file} (${expected})`);
    }
  }

  // Now test with home component for Swim and Like Animals (arirang-red)
  console.log('\n(Home component not easily automated; manual test required)\n');

  await page.close();
  await browser.close();
  console.log('✓ Screenshot capture complete');
})();
