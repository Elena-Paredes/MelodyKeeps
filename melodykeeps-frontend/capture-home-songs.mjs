import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('📸 Capturing all 12 songs from home\n');

  // Navigate to home page (song selector)
  await page.goto('http://localhost:4200/home', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const songs = [
    { name: 'Swim', file: '01-swim-arirang-red.png' },
    { name: 'Like Animals', file: '02-like-animals-arirang-red.png' },
    { name: 'Spring Day', file: '03-spring-day-ynwa.png' },
    { name: 'Blood Sweat & Tears', file: '04-blood-sweat-tears-wings.png' },
    { name: 'Mikrokosmos', file: '05-mikrokosmos-persona.png' },
    { name: 'DNA', file: '06-dna-her.png' },
    { name: 'Dimple', file: '07-dimple-her.png' },
    { name: "I'm Fine", file: '08-im-fine-answer.png' },
    { name: 'Pied Piper', file: '09-pied-piper-her.png' },
    { name: 'We Are Bulletproof: the Eternal Edition', file: '10-we-are-bulletproof-mots7.png' },
    { name: 'Fake Love', file: '11-fake-love-tear.png' },
    { name: 'Run', file: '12-run-hyyh.png' },
  ];

  for (const { name, file } of songs) {
    try {
      // Click on song (assuming it's in a list or grid)
      const songButton = page.locator(`button:has-text("${name}"), [class*="song"]:has-text("${name}")`).first();

      if (await songButton.isVisible({ timeout: 1000 })) {
        await songButton.click();
        await page.waitForTimeout(1500);

        // Capture player
        const playerDiv = page.locator('[data-testid="wavekeeps-player"]').first();
        if (await playerDiv.isVisible({ timeout: 1000 })) {
          const path = `C:\\MelodyKeeps\\_review\\color-variants\\final-catalog\\${file}`;
          await playerDiv.screenshot({ path });
          console.log(`✓ ${file}`);
        }
      } else {
        // Try scrolling and finding song
        await page.keyboard.press('End');
        await page.waitForTimeout(500);
        console.log(`⚠ ${name} not easily found`);
      }
    } catch (err) {
      console.log(`⚠ Error capturing ${name}: ${err.message}`);
    }
  }

  await page.close();
  await browser.close();
  console.log('\n✓ Done');
})();
