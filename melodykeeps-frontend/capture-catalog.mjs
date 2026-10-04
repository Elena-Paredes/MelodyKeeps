import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('📸 Final Catalog QA Screenshots\n');

  await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const songs = [
    { testid: 'demo-swim', file: '01-swim-arirang-red.png', variant: 'arirang-red' },
    { testid: 'demo-animals', file: '02-like-animals-arirang-red.png', variant: 'arirang-red' },
    { testid: 'demo-spring-day', file: '03-spring-day-ynwa.png', variant: 'ynwa' },
    { testid: 'demo-blood-sweat-tears', file: '04-blood-sweat-tears-wings.png', variant: 'wings' },
    { testid: 'demo-mikrokosmos', file: '05-mikrokosmos-persona.png', variant: 'persona' },
    { testid: 'demo-dna', file: '06-dna-her.png', variant: 'her' },
    { testid: 'demo-dimple', file: '07-dimple-her.png', variant: 'her' },
    { testid: 'demo-im-fine', file: '08-im-fine-answer.png', variant: 'answer' },
    { testid: 'demo-pied-piper', file: '09-pied-piper-her.png', variant: 'her' },
    { testid: 'demo-we-are-bulletproof', file: '10-we-are-bulletproof-mots7.png', variant: 'mots7' },
    { testid: 'demo-fake-love', file: '11-fake-love-tear.png', variant: 'tear' },
    { testid: 'demo-run', file: '12-run-hyyh.png', variant: 'hyyh' },
  ];

  for (const { testid, file, variant } of songs) {
    const div = page.locator(`[data-testid="${testid}"]`).first();
    if (await div.isVisible()) {
      const path = `C:\\MelodyKeeps\\_review\\color-variants\\final-catalog\\${file}`;
      await div.screenshot({ path });
      console.log(`✓ ${file} (${variant})`);
    } else {
      console.log(`⚠ ${testid} not visible`);
    }
  }

  await page.close();
  await browser.close();
  console.log('\n✓ Captures complete');
})();
