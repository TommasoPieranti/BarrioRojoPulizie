import { expect, test } from '@playwright/test';

test.describe('Home screen', () => {
  test('shows the Italian title and start button at phone size', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByTestId('home-title')).toHaveText('Gestione Casa');
    await expect(page.getByTestId('home-start-button')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'it');
  });

  test('has no horizontal scroll at phone width', async ({ page }) => {
    await page.goto('/');

    const overflows = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(overflows).toBe(false);
  });

  test('start button is at least 44 x 44 px', async ({ page }) => {
    await page.goto('/');

    const box = await page.getByTestId('home-start-button').boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test('follows the system dark theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const light = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );

    await page.emulateMedia({ colorScheme: 'dark' });
    const dark = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );

    expect(light).not.toBe(dark);
  });
});
