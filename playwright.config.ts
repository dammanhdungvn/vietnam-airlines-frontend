/**
 * @fileoverview Cấu hình Playwright cho E2E testing
 * @version 1.0.0
 * @since 2025-10-02
 * @author Dũng Đàm
 */

import { defineConfig, devices } from '@playwright/test';

/**
 * Cấu hình Playwright
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Thư mục chứa test files
  testDir: './tests/e2e',
  
  // Chạy tests song song
  fullyParallel: true,
  
  // Fail build nếu có test bị skip trong CI
  forbidOnly: !!process.env.CI,
  
  // Retry failed tests
  retries: process.env.CI ? 2 : 0,
  
  // Workers cho parallel execution
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: 'html',
  
  // Shared settings cho tất cả projects
  use: {
    // Base URL cho app
    baseURL: 'http://localhost:3000',
    
    // Collect trace khi test fail
    trace: 'on-first-retry',
    
    // Screenshot khi fail
    screenshot: 'only-on-failure',
    
    // Video khi fail
    video: 'retain-on-failure',
  },

  // Configure projects cho nhiều browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment để test trên nhiều browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Dev server configuration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});

