import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`hero sequence follows the one-second wave at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(page.getByRole('dialog')).toBeFocused();
    const hero = page.locator('.hero');
    await expect(hero).toHaveAttribute('data-entrance', 'waiting');
    await expect(page.locator('.hero-portrait')).toHaveCSS('opacity', '0');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    await expect(hero).toHaveAttribute('data-entrance', 'waiting');
    await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 1800 });
    await expect(hero).toHaveAttribute('data-entrance', 'playing');
    await expect(page.locator('.hero-backend')).toHaveCSS('animation-delay', '0s');
    await expect(page.locator('.hero-developer')).toHaveCSS('animation-delay', '0.85s');
    await expect(page.locator('.hero-copy')).toHaveCSS('animation-delay', '1.65s');
    await expect(page.locator('.hero-type-back')).toHaveCSS('z-index', '0');
    await expect(page.locator('.portrait-frame')).toHaveCSS('z-index', '1');
    await expect(page.locator('.hero-type-front')).toHaveCSS('z-index', '2');
    await expect(page.locator('.hero-portrait')).toHaveCSS('opacity', '1');
    await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
    expect(await page.locator('.hero-portrait').evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await page.screenshot({ path: `/tmp/hero-entrance-${width}.png`, fullPage: false });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
