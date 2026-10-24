import { defineConfig, devices } from '@playwright/test';

const devPort = 5173;
const previewPort = 4173;

const phoneDevice = {
  ...devices['Desktop Chrome'],
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 3,
};

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      // Primary layout: iPhone-sized viewport (390 x 844), Chromium engine, dev server.
      name: 'phone',
      testIgnore: '**/pwa.spec.ts',
      use: { ...phoneDevice, baseURL: `http://localhost:${devPort}` },
    },
    {
      // PWA checks need the production build (the service worker is off in dev).
      name: 'pwa',
      testMatch: '**/pwa.spec.ts',
      use: { ...phoneDevice, baseURL: `http://localhost:${previewPort}` },
    },
  ],
  webServer: [
    {
      command: `npm run dev -- --port ${devPort} --strictPort`,
      url: `http://localhost:${devPort}`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: `npm run build && npm run preview -- --port ${previewPort} --strictPort`,
      url: `http://localhost:${previewPort}`,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
});
