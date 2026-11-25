import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [320, 390, 768, 1024, 1440, 1920, 2560, 3440, 3840]) {
  test(`readable layout at ${width}px with local assets`, async ({ page }) => {
    const errors: string[] = [];
    const failedAssets: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => { if (response.status() >= 400) failedAssets.push(response.url()); });
    const height = width === 3440 ? 1440 : width >= 1920 ? width * 9 / 16 : 900;
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.getByRole('dialog')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('.intro-overlay')).toHaveCount(0);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mohamed El Messaadi');
    if (width >= 1920) {
      const hero = await page.locator('.hero-stage').boundingBox();
      const header = await page.locator('.header-inner').boundingBox();
      const actions = await page.locator('.hero-actions').boundingBox();
      expect(hero!.width).toBeGreaterThan(1320);
      expect(hero!.width).toBeLessThanOrEqual(1920);
      expect(header!.x).toBeCloseTo(hero!.x, 0);
      expect(actions!.y + actions!.height).toBeLessThanOrEqual(height);
      for (const selector of ['.project-content', '.capability', '.about-copy', '.contact-actions']) {
        for (const element of await page.locator(selector).all()) {
          expect(await element.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
        }
      }
    }
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
    expect(layout.emoji).toBe(false);
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
    await expect(page.getByRole('dialog')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('.intro-overlay')).toHaveCount(0);
  await expect(page.locator('.hero')).toContainText('Backend Developer');
  await expect(page.locator('.hero')).toContainText('Ben Guerir, Morocco');
  await page.locator('.hero').getByRole('link', { name: 'Resume', exact: true }).click();
  await expect(page).toHaveURL(/\/resume\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mohamed El Messaadi');
  await expect(page.getByRole('button', { name: 'Print / Save as PDF' })).toBeVisible();
});

test('project evidence is visible without expanding controls', async ({ page }) => {
  await page.goto('/');
    await expect(page.getByRole('dialog')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('.intro-overlay')).toHaveCount(0);
  for (const name of ['Webserv', 'PageTurner', 'TaskFlow']) {
    const project = page.getByRole('article').filter({ has: page.getByRole('heading', { name, exact: true }) });
    await expect(project.getByRole('heading', { name: 'Implementation' })).toBeVisible();
    await expect(project.locator('.implementation-list li')).toHaveCount(3);
  }
});

test('mobile menu navigates, closes and supports Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
    await expect(page.getByRole('dialog')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('.intro-overlay')).toHaveCount(0);
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
    await expect(page.getByRole('dialog')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('.intro-overlay')).toHaveCount(0);
  await page.getByRole('button', { name: 'Copy email', exact: true }).click();
  const copyStatus = page.locator('#contact').getByRole('status');
  await expect(copyStatus).toHaveText('Copied to clipboard.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('mouhamedelmessadi@gmail.com');
  await page.evaluate(() => { Object.defineProperty(navigator.clipboard, 'writeText', { value: () => Promise.reject(new Error('Denied')) }); });
  await page.getByRole('button', { name: 'Email copied', exact: true }).click();
  await expect(copyStatus).toContainText('Use the email link instead.');
  await expect(page.getByRole('link', { name: 'Email me' })).toHaveAttribute('href', 'mailto:mouhamedelmessadi@gmail.com');
});

test('page and mobile navigation pass accessibility checks', async ({ page }) => {
  // Audit final rendered states rather than intermediate animation frames.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
    await expect(page.getByRole('dialog')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('.intro-overlay')).toHaveCount(0);
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
    await expect(page.getByRole('dialog')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('.intro-overlay')).toHaveCount(0);
  expect(await page.evaluate(() => ({
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
    animation: getComputedStyle(document.querySelector('.hero')!).animationName,
  }))).toEqual({ scroll: 'auto', animation: 'none' });
});

test('essential content works without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
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


test('hero layered type stays still on scroll with the supplied portrait', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
    await expect(page.getByRole('dialog')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('.intro-overlay')).toHaveCount(0);
  await expect(page.locator('.hero-portrait')).toHaveAttribute('src', '/me.png');
  const backdrop = page.locator('.hero-type-back');
  const initial = await backdrop.evaluate(el => getComputedStyle(el).transform);
  await page.evaluate(() => window.scrollTo({ top: 450, behavior: 'instant' }));
  await expect(backdrop).toHaveCSS('transform', initial);
  await expect(page.locator('.hero-type-front')).toHaveCSS('transform', 'none');
});

test('magnetic links and project tilt reset after pointer leaves', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
    await expect(page.getByRole('dialog')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('.intro-overlay')).toHaveCount(0);
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
    await expect(page.getByRole('dialog')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('.intro-overlay')).toHaveCount(0);
  const button = page.locator('.nav-contact');
  await button.hover({ position: { x: 10, y: 10 } });
  await expect(button).toHaveCSS('transform', 'none');
  await page.evaluate(() => window.scrollTo({ top: 450, behavior: 'instant' }));
  await expect(page.locator('.hero-type-back')).toHaveCSS('transform', 'none');
  const card = page.locator('.tilt-card').first();
  await card.hover();
  await expect(card).toHaveCSS('transform', 'none');
});
