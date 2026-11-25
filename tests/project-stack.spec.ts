import { test, expect } from '@playwright/test';

async function enter(page: import('@playwright/test').Page) {
  await page.goto('/');
  await expect(page.getByRole('dialog')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.intro-overlay')).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
}

for (const width of [1440, 1024, 768, 430, 390]) {
  test(`project deck remains readable at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await enter(page);
    const stack = page.locator('.project-stack');
    await expect(stack.locator('article')).toHaveCount(5);
    await expect(stack.getByRole('link', { name: 'View repository for cube3d' })).toHaveAttribute('href', 'https://github.com/maywanel/cube3d');
    await expect(stack.getByRole('link', { name: 'View repository for minishell' })).toHaveAttribute('href', 'https://github.com/maywanel/minishell');
    await expect(stack).toHaveAttribute('data-stacking', 'true');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width >= 1024) {
      const items = stack.locator('.project-stack-item');
      await items.nth(1).evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - parseFloat((el as HTMLElement).style.getPropertyValue('--stack-top')), behavior: 'instant' }));
      await expect.poll(() => items.nth(0).evaluate(el => getComputedStyle(el.firstElementChild!).transform)).not.toBe('none');
      const boxes = await items.evaluateAll(nodes => nodes.map(el => {
        const r = el.getBoundingClientRect(); return { top: r.top, bottom: r.bottom };
      }));
      const header = await page.locator('.site-header').boundingBox();
      expect(boxes[0].top).toBeGreaterThan(header!.height);
      expect(boxes[1].top).toBeGreaterThan(boxes[0].top);
      expect(boxes[1].top).toBeLessThan(boxes[0].bottom);
      // Move forward, then focus a buried card as reverse tabbing would.
      await items.nth(3).evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 160, behavior: 'instant' }));
      await stack.getByRole('link', { name: 'View repository for Webserv' }).focus();
      await expect(stack.getByRole('link', { name: 'View repository for Webserv' })).toBeInViewport();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(stack.locator('.project-stack-layer').first()).toHaveCSS('transform', 'none');
    }
    await page.locator('#about').evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
    const last = await stack.locator('article').last().boundingBox();
    const about = await page.locator('#about').boundingBox();
    expect(last!.y + last!.height).toBeLessThanOrEqual(about!.y);
    expect(errors).toEqual([]);
  });
}

for (const viewport of [{ width: 1440, height: 600 }, { width: 390, height: 844 }]) {
test(`tall cards stack after scrolling their content at ${viewport.width}px`, async ({ page }) => {
  await page.setViewportSize(viewport);
  await enter(page);
  const stack = page.locator('.project-stack');
  await expect(stack).toHaveAttribute('data-stacking', 'true');
  const items = stack.locator('.project-stack-item');
  // Pin the second card, leaving the first one visibly layered behind it.
  await items.nth(1).evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - parseFloat((el as HTMLElement).style.getPropertyValue('--stack-top')), behavior: 'instant' }));
  const boxes = await items.evaluateAll(nodes => nodes.map(el => {
    const r = el.getBoundingClientRect(); return { top: r.top, bottom: r.bottom };
  }));
  expect(boxes[1].top).toBeGreaterThan(boxes[0].top);
  expect(boxes[1].top).toBeLessThan(boxes[0].bottom);
  expect(boxes[1].bottom).toBeLessThanOrEqual(viewport.height);
  await expect(stack.getByRole('link', { name: 'View repository for Webserv' })).toBeInViewport();
  // Advancing farther must hold the active card, not move the whole list.
  await page.evaluate(() => window.scrollBy({ top: 40, behavior: 'instant' }));
  const pinned = await items.nth(1).boundingBox();
  expect(pinned!.y).toBeCloseTo(boxes[1].top, 0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(stack.locator('.project-stack-layer').first()).toHaveCSS('transform', 'none');
});
}

for (const width of [390, 1440]) {
  test(`TaskFlow arrows overlay and cycle screenshots at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await enter(page);
    await page.locator('.project-stack').evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
    const gallery = page.getByRole('group', { name: 'TaskFlow screenshots' });
    const image = gallery.getByRole('img');
    await expect(image).toHaveAccessibleName('TaskFlow landing page');
    const screenshot = (await image.boundingBox())!;
    for (const button of await gallery.getByRole('button').all()) {
      const arrow = (await button.boundingBox())!;
      expect(arrow.x).toBeGreaterThan(screenshot.x);
      expect(arrow.x + arrow.width).toBeLessThan(screenshot.x + screenshot.width);
      expect(arrow.y + arrow.height / 2).toBeCloseTo(screenshot.y + screenshot.height / 2, 0);
    }
    await gallery.getByRole('button', { name: 'Previous screenshot' }).click();
    await expect(image).toHaveAccessibleName(/team dashboard/);
    const next = gallery.getByRole('button', { name: 'Next screenshot' });
    await next.click();
    await expect(image).toHaveAccessibleName('TaskFlow landing page');
    await next.press('Enter');
    await expect(image).toHaveAccessibleName(/workspace analytics/);
    for (const name of [/team dashboard/, /landing page/, /workspace analytics/]) {
      await next.click();
      await expect(image).toHaveAccessibleName(name);
    }
  });
}
