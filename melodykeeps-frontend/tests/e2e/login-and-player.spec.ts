import { test, expect } from '@playwright/test';

test.describe('MelodyKeeps E2E - Login y Reproductor', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar al login
    await page.goto('http://localhost:4200/login', { waitUntil: 'networkidle' });
  });

  test('debe hacer login exitosamente con credenciales de prueba', async ({ page }) => {
    // Verificar que estamos en la página de login
    await expect(page).toHaveTitle(/.*MelodykeepsFrontend.*/i);

    // Llenar formulario
    const emailInput = page.locator('input[type="email"]').or(page.locator('input[type="text"]')).first();
    const passwordInput = page.locator('input[type="password"]');

    // Esperar que los inputs estén visibles
    await emailInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      console.log('Email input no encontrado');
    });

    // Ingresar credenciales
    await page.fill('input[type="email"]', 'test@melodykeeps.dev');
    await page.fill('input[type="password"]', 'Test@123456');

    // Click en botón login
    const loginButton = page.locator('button:has-text("Login")').or(page.locator('button:has-text("Iniciar")'));
    await loginButton.click();

    // Esperar redirección a home
    await page.waitForURL(/\/home/, { timeout: 10000 });

    // Verificar que el token se guardó
    const token = await page.evaluate(() => localStorage.getItem('mk_token'));
    expect(token).toBeTruthy();
    expect(token).toContain('eyJ');
  });

  test('debe acceder al reproductor de música', async ({ page }) => {
    // Login primero
    await page.fill('input[type="email"]', 'test@melodykeeps.dev');
    await page.fill('input[type="password"]', 'Test@123456');
    await page.locator('button').first().click();

    // Esperar a estar en home
    await page.waitForURL(/\/home/, { timeout: 10000 });

    // Navegar al reproductor
    await page.goto('http://localhost:4200/player-demo');

    // Verificar que el reproductor SVG existe
    const playerSvg = page.locator('[data-testid="wavekeeps-player"]');
    await expect(playerSvg).toBeVisible();

    // Verificar elementos del reproductor
    expect(await page.locator('text=PLAYING FROM PLAYLIST').isVisible()).toBe(true);
    expect(await page.locator('text=Spring Day').isVisible()).toBe(true);
    expect(await page.locator('text=BTS').isVisible()).toBe(true);
  });

  test('mostrar error si credenciales son incorrectas', async ({ page }) => {
    // Ingresar credenciales incorrectas
    await page.fill('input[type="email"]', 'test@melodykeeps.dev');
    await page.fill('input[type="password"]', 'WrongPassword');
    await page.locator('button').first().click();

    // Esperar mensaje de error
    const errorText = page.locator('text=/Credenciales|incorrectos|inválidas/i');
    await expect(errorText).toBeVisible({ timeout: 5000 });

    // No debe redirigir a home
    expect(page.url()).toContain('login');
  });
});
