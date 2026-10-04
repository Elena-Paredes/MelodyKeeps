import { test, expect } from '@playwright/test';

test.describe('WaveKeeps Player Classic Template', () => {
  test('should render player at exact 1000x1500 resolution', async ({ page }) => {
    await page.goto('http://localhost:4200/player-demo');

    const player = page.locator('[data-testid="wavekeeps-player"]');

    // Set exact viewport
    await page.setViewportSize({ width: 1000, height: 1500 });

    // Wait for image to load
    await page.waitForTimeout(500);

    // Snapshot comparison
    await expect(player).toHaveScreenshot('player-classic.png', {
      animations: 'disabled',
      maxDiffPixels: 10,
    });
  });

  test('should match reference design geometry', async ({ page }) => {
    await page.goto('http://localhost:4200/player-demo');

    const player = page.locator('[data-testid="wavekeeps-player"]');
    const bbox = await player.boundingBox();

    expect(bbox?.width).toBeDefined();
    expect(bbox?.height).toBeDefined();

    // Aspect ratio 2:3
    const ratio = bbox!.width! / bbox!.height!;
    expect(Math.abs(ratio - 2 / 3)).toBeLessThan(0.01);
  });

  test('should render all required elements', async ({ page }) => {
    await page.goto('http://localhost:4200/player-demo');

    // Check for elements via SVG selectors
    const svg = page.locator('svg[data-testid="wavekeeps-player"]');
    expect(await svg.isVisible()).toBe(true);

    // Text elements should exist
    const header = page.locator('text:has-text("PLAYING FROM PLAYLIST")');
    expect(await header.isVisible()).toBe(true);

    const title = page.locator('text:has-text("Spring Day")');
    expect(await title.isVisible()).toBe(true);

    const artist = page.locator('text:has-text("BTS")');
    expect(await artist.isVisible()).toBe(true);
  });
});
