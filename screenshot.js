const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport size to match player aspect ratio
  await page.setViewportSize({ width: 600, height: 900 });

  console.log('🎵 Capturing Spring Day...');
  await page.goto('http://localhost:4200');
  await page.waitForLoadState('networkidle');

  // Wait for player to render
  await page.waitForSelector('[data-testid="wavekeeps-player"]', { timeout: 5000 }).catch(() => {});

  const playerSpringDay = page.locator('[data-testid="wavekeeps-player"]').first();
  if (await playerSpringDay.isVisible().catch(() => false)) {
    console.log('✓ Player visible, capturing...');
    await playerSpringDay.screenshot({ path: 'C:\\_MelodyKeeps\\_review\\spotify-code-linear-progress\\spring-day.png' });
  } else {
    console.log('✗ Player not visible');
  }

  await browser.close();
})().catch(console.error);
