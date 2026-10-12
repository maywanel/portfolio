import { test, expect } from '@playwright/test';

test('intro is shown once across reloads and later visits in the same browser', async ({ page, context }) => {
  await page.goto('/');
  await expect(page.getByRole('dialog')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.hero-actions')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('#main')).not.toHaveAttribute('inert');
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  const nextVisit = await context.newPage();
  await nextVisit.goto('/');
  await expect(nextVisit.locator('.hero-actions')).toBeVisible();
  await expect(nextVisit.getByRole('dialog')).toHaveCount(0);
});

test('reload during the intro also skips it next time', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('dialog')).toBeFocused();
  await page.reload();
  await expect(page.locator('.hero-actions')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('blocked storage does not prevent entry', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage blocked'); };
  });
  await page.goto('/');
  await expect(page.getByRole('dialog')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('#main')).not.toHaveAttribute('inert');
});

test('tape scrolls away, pauses offscreen, and resumes when visible', async ({ page }) => {
  await page.goto('/journey-1337/');
  const tape = page.locator('.journey-tape');
  const track = page.locator('.journey-tape-track');
  await expect(tape).toHaveCSS('position', 'relative');
  await expect(track).toHaveCSS('animation-play-state', 'paused');
  await tape.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await expect(track).toHaveCSS('animation-play-state', 'running');
  await page.evaluate(() => window.scrollBy({ top: 1000, behavior: 'instant' }));
  await expect(tape).not.toBeInViewport();
  await expect(track).toHaveCSS('animation-play-state', 'paused');
  const paused = await track.evaluate(el => getComputedStyle(el).transform);
  await page.waitForTimeout(150);
  expect(await track.evaluate(el => getComputedStyle(el).transform)).toBe(paused);
  await tape.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await expect(track).toHaveCSS('animation-play-state', 'running');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(track).toHaveCSS('animation-name', 'none');
});

test('project scroll effects activate near work and stop after it', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('portfolio:intro-seen', 'true'));
  await page.goto('/');
  const stack = page.locator('.project-stack');
  await expect(stack).not.toHaveAttribute('data-motion-active', 'true');
  await stack.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
  await expect(stack).toHaveAttribute('data-motion-active', 'true');
  await page.locator('#contact').evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
  await expect(stack).toHaveAttribute('data-motion-active', 'false');
});

test('section reveals are deferred and reduced motion completes an active reveal', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('portfolio:intro-seen', 'true'));
  await page.goto('/');
  const heading = page.locator('#skills .motion-reveal').first();
  expect(await heading.evaluate(el => el.getAnimations().length)).toBe(0);
  await heading.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await expect.poll(() => heading.evaluate(el => el.getAnimations().length)).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(heading).toHaveCSS('opacity', '1');
  await expect(heading).toHaveCSS('transform', 'none');
});
