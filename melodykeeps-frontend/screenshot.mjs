import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:4200/player-demo', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ path: 'C:\\MelodyKeeps\\melodykeeps-frontend\\player-screenshot.png' });
    console.log('Screenshot saved');
    
    // Check if player SVG exists
    const svg = await page.locator('svg[data-testid="wavekeeps-player"]').isVisible();
    console.log('Player visible:', svg);
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
