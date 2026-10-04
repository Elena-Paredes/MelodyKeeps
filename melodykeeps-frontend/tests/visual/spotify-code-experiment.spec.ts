import { test } from '@playwright/test';

test.describe('Spotify Code + Linear Progress Experiment', () => {
  test('Spring Day full player', async ({ page }) => {
    await page.goto('http://localhost:4200');

    // Select Spring Day
    const springDayBtn = page.locator('text=Spring Day').first();
    await springDayBtn.click();
    await page.waitForTimeout(500);

    // Get player SVG
    const playerSvg = page.locator('[data-testid="wavekeeps-player"]').first();
    if (await playerSvg.isVisible()) {
      await playerSvg.screenshot({ path: 'C:\\MelodyKeeps\\_review\\spotify-code-linear-progress\\spring-day.png' });
    }
  });

  test('Fake Love full player', async ({ page }) => {
    await page.goto('http://localhost:4200');

    // Select Fake Love
    const fakeLoveBtn = page.locator('text=Fake Love').first();
    await fakeLoveBtn.click();
    await page.waitForTimeout(500);

    // Get player SVG
    const playerSvg = page.locator('[data-testid="wavekeeps-player"]').first();
    if (await playerSvg.isVisible()) {
      await playerSvg.screenshot({ path: 'C:\\MelodyKeeps\\_review\\spotify-code-linear-progress\\fake-love.png' });
    }
  });

  test('DNA full player', async ({ page }) => {
    await page.goto('http://localhost:4200');

    // Select DNA
    const dnaBtn = page.locator('text=DNA').first();
    await dnaBtn.click();
    await page.waitForTimeout(500);

    // Get player SVG
    const playerSvg = page.locator('[data-testid="wavekeeps-player"]').first();
    if (await playerSvg.isVisible()) {
      await playerSvg.screenshot({ path: 'C:\\MelodyKeeps\\_review\\spotify-code-linear-progress\\dna.png' });
    }
  });
});
