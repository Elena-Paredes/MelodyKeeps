import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('📸 HER Variant QA Screenshots\n');

  await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const configs = [
    { testid: 'demo-spring-day', file: 'spring-day-purple.png', expected: 'Purple' },
    { testid: 'demo-dna', file: 'dna-her.png', expected: 'HER' },
    { testid: 'demo-dimple', file: 'dimple-her.png', expected: 'HER' },
    { testid: 'demo-pied-piper', file: 'pied-piper-her.png', expected: 'HER' },
    { testid: 'demo-swim', file: 'swim-arirang-red.png', expected: 'ARIRANG-RED' },
  ];

  for (const { testid, file, expected } of configs) {
    const div = page.locator(`[data-testid="${testid}"]`).first();
    if (await div.isVisible()) {
      const path = `C:\\MelodyKeeps\\_review\\color-variants\\her\\${file}`;
      await div.screenshot({ path });
      console.log(`✓ ${file} (${expected})`);
    }
  }

  await page.close();
  await browser.close();
  console.log('\n✓ Captures complete');
})();
