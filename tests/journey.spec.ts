import { test, expect } from '@playwright/test';

test('journey image stays pinned while the hero copy and next section scroll over it', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/journey-1337/');
  const image = page.locator('.journey-image');
  await expect.poll(() => image.evaluate((el) => getComputedStyle(el).backgroundImage)).toContain('journey-1337.webp');
  const heroCopy = page.locator('.journey-back');
  const initialCopyY = (await heroCopy.boundingBox())!.y;
  await page.evaluate(() => window.scrollTo({ top: 700, behavior: 'instant' }));
  const pinnedImageY = (await page.locator('.journey-image-sticky').boundingBox())!.y;
  expect(pinnedImageY).toBeCloseTo(88, 0);
  expect((await heroCopy.boundingBox())!.y).toBeLessThan(initialCopyY - 500);
  await expect(page.locator('.journey-content')).toBeInViewport();
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

for (const viewport of [
  { width: 320, height: 568 },
  { width: 844, height: 390 },
  { width: 1024, height: 600 },
  { width: 1366, height: 768 },
]) {
  test(`complete journey cards remain reachable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/journey-1337/');
    await page.evaluate(() => document.fonts.ready);
    const path = page.locator('.journey-path');
    if (viewport.height <= 600) await expect(path).not.toHaveClass(/is-horizontal/);
    const horizontal = await path.evaluate(el => el.classList.contains('is-horizontal'));
    for (const card of await page.locator('.journey-stage').all()) {
      if (horizontal) {
        await card.evaluate(el => {
          const path = el.closest('.journey-path')!;
          const rail = el.parentElement!;
          const distance = Math.min(el.getBoundingClientRect().left - rail.getBoundingClientRect().left,
            rail.scrollWidth - rail.clientWidth);
          window.scrollTo({ top: path.getBoundingClientRect().top + scrollY + distance, behavior: 'instant' });
        });
        await expect(card).toBeInViewport({ ratio: 1 });
      }
      for (const content of [card.locator('h3'), card.locator('.journey-proof')]) {
        if (!horizontal) await content.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await expect(content).toBeInViewport({ ratio: 1 });
        const bounds = (await content.boundingBox())!;
        const header = (await page.locator('.site-header').boundingBox())!;
        expect(bounds.y).toBeGreaterThanOrEqual(header.y + header.height);
        expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('journey adapts when viewport height or text size changes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/journey-1337/');
  const path = page.locator('.journey-path');
  await expect(path).toHaveClass(/is-horizontal/);
  await page.setViewportSize({ width: 1440, height: 600 });
  await expect(path).not.toHaveClass(/is-horizontal/);
  await page.setViewportSize({ width: 1440, height: 1100 });
  await expect(path).toHaveClass(/is-horizontal/);
  await page.addStyleTag({ content: '.journey-stage-body, .journey-stage-lesson { font-size: 32px !important; }' });
  await expect(path).not.toHaveClass(/is-horizontal/);
});
