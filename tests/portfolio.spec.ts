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
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Built belowthe surface.');
    for (const id of ['work', 'approach', 'about', 'contact']) {
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

test('system sketch switches by pointer and keyboard', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: /Access/ }).click();
  await expect(page.getByRole('tabpanel')).toContainText('Make the boundary explicit.');
  await page.getByRole('tab', { name: /Access/ }).press('ArrowRight');
  await expect(page.getByRole('tab', { name: /Deploy/ })).toBeFocused();
  await expect(page.getByRole('tabpanel')).toContainText('Give every service a place.');
  await page.getByRole('tab', { name: /Deploy/ }).press('Home');
  await expect(page.getByRole('tabpanel')).toContainText('Follow the request.');
});

test('engineering notes expand and collapse independently', async ({ page }) => {
  await page.goto('/');
  for (const name of ['Webserv', 'Inception', 'PageTurner', 'ft_transcendence']) {
    const trigger = page.getByRole('button', { name: `Engineering notes for ${name}`, exact: true });
    await trigger.click();
    const close = page.getByRole('button', { name: `Close engineering notes for ${name}`, exact: true });
    await expect(close).toHaveAttribute('aria-expanded', 'true');
    const panel = page.locator(`#${await close.getAttribute('aria-controls')}`);
    await expect(panel.getByRole('heading', { name: 'The challenge' })).toBeVisible();
    await close.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toHaveAttribute('inert', '');
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
  await page.getByRole('link', { name: 'Approach', exact: true }).focus();
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
  await expect(page.getByRole('link', { name: 'Start a conversation' })).toHaveAttribute('href', 'mailto:mouhamedelmessadi@gmail.com');
});

test('page and expanded controls pass accessibility checks', async ({ page }) => {
  // Audit final rendered states rather than intermediate animation frames.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Engineering notes for Webserv', exact: true }).click();
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
    animation: getComputedStyle(document.querySelector('.diagram-packet')!).animationName,
  }))).toEqual({ scroll: 'auto', animation: 'none' });
});

test('essential content works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:3000');
  await expect(page.getByRole('heading', { name: 'Proof in the projects.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Webserv', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start a conversation' })).toHaveAttribute('href', 'mailto:mouhamedelmessadi@gmail.com');
  await context.close();
});

test('custom 404 and metadata are available', async ({ page, request }) => {
  const response = await page.goto('/this-route-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'This route ends here.' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to the portfolio' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Built below');
  for (const path of ['/robots.txt', '/sitemap.xml', '/social-card.png', '/icon.svg']) expect((await request.get(path)).status()).toBe(200);
});
