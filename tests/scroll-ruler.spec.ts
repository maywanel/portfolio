import { test, expect } from '@playwright/test';

for (const width of [1440, 1024, 390]) {
  test(`ruler tracks and controls page scrolling at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('dialog')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('.intro-overlay')).toHaveCount(0);
    const ruler = page.getByRole('scrollbar', { name: 'Page scroll position' });
    await expect(ruler).toBeVisible();
    const box = await ruler.boundingBox();
    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await expect.poll(async () => Number(await ruler.getAttribute('aria-valuenow'))).toBe(50);
    expect(await page.locator('.scroll-ruler-marker').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m42)).toBeGreaterThan(200);
    await ruler.press('End');
    await expect(ruler).toHaveAttribute('aria-valuenow', '100');
    await ruler.press('Home');
    await expect(ruler).toHaveAttribute('aria-valuenow', '0');
    await ruler.press('PageDown');
    await expect.poll(async () => Number(await ruler.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 4);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height * 0.75, { steps: 5 });
    await page.mouse.up();
    await expect(ruler).toHaveAttribute('aria-valuenow', '75');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await ruler.blur();
    await page.screenshot({ path: `/tmp/ruler-${width}.png` });
    await page.emulateMedia({ forcedColors: 'active' });
    await expect(ruler).toBeHidden();
    await expect(page.locator('html')).toHaveCSS('scrollbar-width', 'auto');
  });
}
