import { test, expect } from '@playwright/test';

test('intro morphs to logo, refracts the logo with WebGL water, and reveals progressively', async ({ page }) => {
  await page.goto('/');
  const overlay = page.getByRole('dialog');
  await expect(overlay).toHaveAttribute('data-phase', 'name');
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  await expect(page.locator('#main')).toHaveAttribute('inert', '');
  await expect(page.locator('.intro-name')).toHaveCSS('visibility', 'visible');
  await expect(page.locator('.intro-morph')).toHaveCSS('filter', 'none');
  await expect(overlay).toHaveAttribute('data-phase', 'morph');
  await page.waitForTimeout(850);
  await page.screenshot({ path: '/tmp/portfolio-morph-middle.png' });
  await expect(overlay).toHaveAttribute('data-phase', 'logo');
  await expect(page.locator('.intro-logo')).toHaveCSS('opacity', '1');
  await expect(overlay.getByRole('button')).toHaveCount(0);
  await expect(page.locator('.intro-water')).toHaveAttribute('data-active', 'true');
  await expect(page.locator('.intro-water')).toHaveCSS('opacity', '1');
  const still = await page.locator('.intro-water').screenshot();
  await page.mouse.move(500, 320);
  await page.mouse.move(760, 400, { steps: 24 });
  const disturbed = await page.locator('.intro-water').screenshot();
  expect(still.equals(disturbed)).toBe(false);
  await page.screenshot({ path: '/tmp/portfolio-intro.png' });
  const middle = await page.evaluate(async () => {
    window.dispatchEvent(new MouseEvent('click', { clientX: 180, clientY: 240, detail: 1 }));
    await new Promise(resolve => setTimeout(resolve, 300));
    const overlay = document.querySelector<HTMLElement>('.intro-overlay')!;
    const wave = document.querySelector<HTMLElement>('.intro-wave')!;
    return {
      phase: overlay.dataset.phase,
      opacity: getComputedStyle(overlay).opacity,
      mask: getComputedStyle(document.querySelector('.intro-surface')!).maskImage,
      left: wave.style.left, top: wave.style.top,
      overflow: getComputedStyle(document.body).overflow,
    };
  });
  expect(middle.phase).toBe('exit');
  expect(middle.opacity).toBe('1');
  expect(middle.mask).not.toBe('none');
  expect(middle.left).toBe('180px');
  expect(middle.top).toBe('240px');
  expect(middle.overflow).toBe('hidden');
  await expect(overlay).toHaveCount(0);
  await expect(page.locator('#main')).not.toHaveAttribute('inert');
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await expect(page.locator('#main')).toBeFocused();
  await page.getByRole('navigation').getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
});

test('reduced motion allows immediate keyboard dismissal', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('dialog')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('dialog')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('mobile tap reveals the portfolio', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(await page.locator('.intro-overlay').boundingBox()).toEqual({ x: 0, y: 0, width: 390, height: 844 });
  await page.mouse.click(40, 180);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Close', exact: true })).toHaveAttribute('aria-expanded', 'true');
});

test('portfolio stays accessible without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('.intro-overlay')).toBeHidden();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await context.close();
});


test('unsupported WebGL keeps logo and click dismissal available', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type.includes('webgl')) return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.goto('/');
  await expect(page.getByRole('dialog')).toHaveAttribute('data-phase', 'logo');
  await page.waitForTimeout(1000);
  await expect(page.locator('.intro-water')).not.toHaveAttribute('data-active');
  await expect(page.locator('.intro-logo')).toHaveCSS('opacity', '1');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
