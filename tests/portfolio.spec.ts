import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`readable layout at ${width}px with local assets`, async ({ page }) => {
    const errors: string[] = [];
    const failedAssets: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => { if (response.status() >= 400) failedAssets.push(response.url()); });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mohamed El Messaadi');
    for (const id of ['work', 'about', 'contact']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      fonts: [...document.fonts].filter((font) => font.status === 'loaded').length,
      emoji: /[\u{1F300}-\u{1FAFF}]/u.test(document.body.innerText),
      missingAnchors: [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].filter((a) => !document.getElementById(a.hash.slice(1))).map((a) => a.hash),
    }));
    expect(layout.overflow).toBe(false);
    expect(layout.fonts).toBeGreaterThan(0);
    expect(layout.emoji).toBe(true);
    expect(layout.missingAnchors).toEqual([]);
    expect(errors).toEqual([]);
    expect(failedAssets).toEqual([]);
    if (width === 390 || width === 1440) {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `/tmp/portfolio-next-${width}.png`, fullPage: true });
    }
  });
}

test('hero exposes role, location and working resume', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero')).toContainText('Backend & Systems Software Engineer');
  await expect(page.locator('.hero')).toContainText('Ben Guerir, Morocco');
  await page.locator('.hero').getByRole('link', { name: 'Resume', exact: true }).click();
  await expect(page).toHaveURL(/\/resume\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mohamed El Messaadi');
  await expect(page.getByRole('button', { name: 'Print / Save as PDF' })).toBeVisible();
});

test('project evidence is visible without expanding controls', async ({ page }) => {
  await page.goto('/');
  for (const name of ['Webserv', 'BookLibrary', 'ft_transcendence']) {
    const project = page.getByRole('article').filter({ has: page.getByRole('heading', { name, exact: true }) });
    await expect(project.getByRole('heading', { name: 'Implementation' })).toBeVisible();
    await expect(project.locator('.implementation-list li')).toHaveCount(3);
  }
});

test('mobile menu navigates, closes and supports Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  await menu.click();
  await page.getByRole('navigation').getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await page.getByRole('link', { name: 'Work', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('email copy succeeds and handles denied clipboard access', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('button', { name: 'Copy email', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Copied to clipboard.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('mouhamedelmessadi@gmail.com');
  await page.evaluate(() => { Object.defineProperty(navigator.clipboard, 'writeText', { value: () => Promise.reject(new Error('Denied')) }); });
  await page.getByRole('button', { name: 'Email copied', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Use the email link instead.');
  await expect(page.getByRole('link', { name: 'Email me' })).toHaveAttribute('href', 'mailto:mouhamedelmessadi@gmail.com');
});

test('page and mobile navigation pass accessibility checks', async ({ page }) => {
  // Audit final rendered states rather than intermediate animation frames.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const desktop = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(desktop.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => ({ target: n.target, issue: n.failureSummary })) }))).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const mobile = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(mobile.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => ({ target: n.target, issue: n.failureSummary })) }))).toEqual([]);
});

test('reduced motion stops animation and smooth scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.evaluate(() => ({
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
    animation: getComputedStyle(document.querySelector('.hero')!).animationName,
  }))).toEqual({ scroll: 'auto', animation: 'none' });
});

test('essential content works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:3000');
  await expect(page.getByRole('heading', { name: 'Selected work.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Webserv', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Email me' })).toHaveAttribute('href', 'mailto:mouhamedelmessadi@gmail.com');
  await context.close();
});

test('custom 404 and metadata are available', async ({ page, request }) => {
  const response = await page.goto('/this-route-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'This route ends here.' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to the portfolio' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Mohamed');
  for (const path of ['/robots.txt', '/sitemap.xml', '/social-card.png', '/icon.svg']) expect((await request.get(path)).status()).toBe(200);
});

for (const colorScheme of ['light', 'dark'] as const) {
  test(`accessible dark design under ${colorScheme} system preference and resume`, async ({ page }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    for (const route of ['/', '/resume/']) {
      await page.goto(route);
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(audit.violations).toEqual([]);
    }
  });
}


test('portrait loads and decorative type responds to scroll', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const portrait = page.getByRole('img', { name: 'Mohamed El Messaadi', exact: true });
  await expect(portrait).toBeVisible();
  await expect.poll(() => portrait.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  const backdrop = page.locator('.hero-display');
  const initial = await backdrop.evaluate(el => getComputedStyle(el).transform);
  await page.evaluate(() => window.scrollTo({ top: 450, behavior: 'instant' }));
  await expect.poll(() => backdrop.evaluate(el => getComputedStyle(el).transform)).not.toBe(initial);
});

test('magnetic links and project tilt reset after pointer leaves', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const button = page.locator('.nav-contact');
  await button.hover({ position: { x: 10, y: 10 } });
  await expect.poll(() => button.evaluate(el => getComputedStyle(el).transform)).not.toBe('matrix(1, 0, 0, 1, 0, 0)');
  await page.mouse.move(5, 5);
  await expect.poll(() => button.evaluate(el => {
    const m = new DOMMatrix(getComputedStyle(el).transform); return Math.abs(m.m41) + Math.abs(m.m42);
  })).toBeLessThan(0.1);
  const card = page.locator('.tilt-card').first();
  await card.hover({ position: { x: 40, y: 40 } });
  await expect.poll(() => card.evaluate(el => Math.abs(new DOMMatrix(getComputedStyle(el).transform).m13))).toBeGreaterThan(0.001);
});

test('reduced motion keeps pointer and parallax effects stationary', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const button = page.locator('.nav-contact');
  await button.hover({ position: { x: 10, y: 10 } });
  await expect(button).toHaveCSS('transform', 'none');
  await page.evaluate(() => window.scrollTo({ top: 450, behavior: 'instant' }));
  await expect(page.locator('.hero-display')).toHaveCSS('transform', 'none');
  const card = page.locator('.tilt-card').first();
  await card.hover();
  await expect(card).toHaveCSS('transform', 'none');
});
