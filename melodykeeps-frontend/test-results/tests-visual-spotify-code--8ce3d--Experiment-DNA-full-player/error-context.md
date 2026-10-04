# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\visual\spotify-code-experiment.spec.ts >> Spotify Code + Linear Progress Experiment >> DNA full player
- Location: tests\visual\spotify-code-experiment.spec.ts:34:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=DNA').first()

```

# Page snapshot

```yaml
- main [ref=e4]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]: 🎵
      - heading "MelodyKeeps" [level=1] [ref=e9]
      - paragraph [ref=e10]: Convierte tu canción en un recuerdo
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]: Correo
        - textbox "Correo" [ref=e14]:
          - /placeholder: tú@correo.com
      - generic [ref=e15]:
        - generic [ref=e16]: Contraseña
        - textbox "Contraseña" [ref=e17]:
          - /placeholder: ••••••••
      - button "Iniciar sesión" [ref=e18]
    - paragraph [ref=e19]:
      - text: ¿No tienes cuenta?
      - link "Regístrate" [ref=e20] [cursor=pointer]:
        - /url: "#"
```

# Test source

```ts
  1  | import { test } from '@playwright/test';
  2  | 
  3  | test.describe('Spotify Code + Linear Progress Experiment', () => {
  4  |   test('Spring Day full player', async ({ page }) => {
  5  |     await page.goto('http://localhost:4200');
  6  | 
  7  |     // Select Spring Day
  8  |     const springDayBtn = page.locator('text=Spring Day').first();
  9  |     await springDayBtn.click();
  10 |     await page.waitForTimeout(500);
  11 | 
  12 |     // Get player SVG
  13 |     const playerSvg = page.locator('[data-testid="wavekeeps-player"]').first();
  14 |     if (await playerSvg.isVisible()) {
  15 |       await playerSvg.screenshot({ path: 'C:\\MelodyKeeps\\_review\\spotify-code-linear-progress\\spring-day.png' });
  16 |     }
  17 |   });
  18 | 
  19 |   test('Fake Love full player', async ({ page }) => {
  20 |     await page.goto('http://localhost:4200');
  21 | 
  22 |     // Select Fake Love
  23 |     const fakeLoveBtn = page.locator('text=Fake Love').first();
  24 |     await fakeLoveBtn.click();
  25 |     await page.waitForTimeout(500);
  26 | 
  27 |     // Get player SVG
  28 |     const playerSvg = page.locator('[data-testid="wavekeeps-player"]').first();
  29 |     if (await playerSvg.isVisible()) {
  30 |       await playerSvg.screenshot({ path: 'C:\\MelodyKeeps\\_review\\spotify-code-linear-progress\\fake-love.png' });
  31 |     }
  32 |   });
  33 | 
  34 |   test('DNA full player', async ({ page }) => {
  35 |     await page.goto('http://localhost:4200');
  36 | 
  37 |     // Select DNA
  38 |     const dnaBtn = page.locator('text=DNA').first();
> 39 |     await dnaBtn.click();
     |                  ^ Error: locator.click: Test timeout of 30000ms exceeded.
  40 |     await page.waitForTimeout(500);
  41 | 
  42 |     // Get player SVG
  43 |     const playerSvg = page.locator('[data-testid="wavekeeps-player"]').first();
  44 |     if (await playerSvg.isVisible()) {
  45 |       await playerSvg.screenshot({ path: 'C:\\MelodyKeeps\\_review\\spotify-code-linear-progress\\dna.png' });
  46 |     }
  47 |   });
  48 | });
  49 | 
```