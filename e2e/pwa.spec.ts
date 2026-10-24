import { expect, test } from '@playwright/test';

// Runs against the production build served by `vite preview` (project "pwa").
// The Italian app name must match src/i18n/it.ts (Req 16.3).
const APP_NAME = 'Gestione Casa';

interface ManifestIcon {
  src: string;
  sizes: string;
  type?: string;
  purpose?: string;
}

interface Manifest {
  name: string;
  short_name: string;
  lang: string;
  display: string;
  start_url: string;
  scope: string;
  theme_color: string;
  background_color: string;
  icons: ManifestIcon[];
}

test.describe('PWA install metadata', () => {
  test('manifest has the required fields', async ({ request }) => {
    const response = await request.get('/manifest.webmanifest');
    expect(response.status()).toBe(200);
    const manifest = (await response.json()) as Manifest;

    expect(manifest.name).toBe(APP_NAME);
    expect(manifest.short_name).toBe(APP_NAME);
    expect(manifest.lang).toBe('it');
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('/');
    expect(manifest.scope).toBe('/');
    expect(manifest.theme_color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(manifest.background_color).toMatch(/^#[0-9a-f]{6}$/i);

    const sizes = manifest.icons.map((icon) => icon.sizes);
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
    expect(manifest.icons.some((icon) => icon.purpose === 'maskable')).toBe(
      true,
    );
  });

  test('every icon in the manifest returns 200 as an image', async ({
    request,
  }) => {
    const manifest = (await (
      await request.get('/manifest.webmanifest')
    ).json()) as Manifest;
    expect(manifest.icons.length).toBeGreaterThan(0);

    for (const icon of manifest.icons) {
      const response = await request.get(icon.src);
      expect(response.status(), `icon ${icon.src}`).toBe(200);
      expect(response.headers()['content-type'], `icon ${icon.src}`).toContain(
        'image/',
      );
    }
  });

  test('home page has iPhone and theme meta tags', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
    await expect(
      page.locator('meta[name="apple-mobile-web-app-capable"]'),
    ).toHaveAttribute('content', 'yes');
    await expect(
      page.locator('meta[name="apple-mobile-web-app-title"]'),
    ).toHaveAttribute('content', APP_NAME);
    await expect(
      page.locator('meta[name="theme-color"][media*="light"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('meta[name="theme-color"][media*="dark"]'),
    ).toHaveCount(1);
    await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
  });
});

test.describe('Service worker and offline app shell', () => {
  test('service worker registers and activates', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      const worker = registration.active;
      if (!worker || worker.state === 'activated') return;
      await new Promise<void>((resolve) => {
        worker.addEventListener('statechange', () => {
          if (worker.state === 'activated') resolve();
        });
      });
    });

    const state = await page.evaluate(
      async () => (await navigator.serviceWorker.ready).active?.state ?? null,
    );
    expect(state).toBe('activated');
  });

  test('reload while offline still shows the home screen', async ({
    page,
    context,
  }) => {
    await page.goto('/');
    await page.evaluate(() => navigator.serviceWorker.ready);
    // Wait until the worker controls the page so offline reloads are served from cache.
    await page.waitForFunction(() => navigator.serviceWorker.controller);

    await context.setOffline(true);
    await page.reload();

    await expect(page.getByTestId('home-title')).toHaveText(APP_NAME);
    await context.setOffline(false);
  });
});
