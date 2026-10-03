import { test, expect } from '@playwright/test';

test('journey film follows scrolling in both directions within two seconds', async ({ page }) => {
  await page.goto('/journey-1337/');
  const video = page.locator('.journey-video');
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState)).toBeGreaterThanOrEqual(2);
  await page.evaluate(() => window.scrollTo({ top: 700, behavior: 'instant' }));
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0.4);
  const forward = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
  expect(forward).toBeLessThanOrEqual(2);
  await page.evaluate(() => window.scrollTo({ top: 150, behavior: 'instant' }));
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeLessThan(forward);
  const path = page.locator('.journey-path');
  await expect(path).toHaveClass(/is-horizontal/);
  await page.evaluate(() => window.scrollTo({ top: document.querySelector('#chapters')!.getBoundingClientRect().top + window.scrollY + 900, behavior: 'instant' }));
  await expect.poll(() => page.locator('.journey-path-track').evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41)).toBeLessThan(-500);
});

for (const width of [320, 390, 768, 1440, 1920, 2560, 3840]) {
  test(`journey fits ${width}px and keeps all chapters readable`, async ({ page }) => {
    await page.setViewportSize({ width, height: width >= 1920 ? width * 9 / 16 : 900 });
    await page.goto('/journey-1337/');
    await expect(page.locator('.journey-stage')).toHaveCount(6);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width < 900) await expect(page.locator('.journey-path')).not.toHaveClass(/is-horizontal/);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.journey-path')).not.toHaveClass(/is-horizontal/);
    const chapters = page.locator('.journey-stage');
    for (const chapter of await chapters.all()) {
      await chapter.scrollIntoViewIfNeeded();
      await expect(chapter.getByRole('heading', { level: 3 })).toBeVisible();
      const bounds = await chapter.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    }
  });
}
