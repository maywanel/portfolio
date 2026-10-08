import { defineConfig, devices } from '@playwright/test';

const previewURL = `http://127.0.0.1:${process.env.PORT || 3000}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 3,
  reporter: [['list']],
  use: {
    baseURL: previewURL,
    trace: 'retain-on-failure',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    },
  },
  projects: [ { name: 'chromium', use: { ...devices['Desktop Chrome'] } } ],
  webServer: {
    command: 'npm start',
    url: previewURL,
    reuseExistingServer: !process.env.CI,
    timeout: 20000,
  },
});
