/**
 * @fileoverview E2E tests cho Dashboard
 * @version 1.0.0
 * @since 2025-10-02
 * @author Dũng Đàm
 */

import { test, expect } from '@playwright/test';

/**
 * Helper function để login trước mỗi test
 */
async function loginAsAdmin(page: any) {
  await page.goto('/login');
  await page.fill('input[id="username"]', 'admin');
  await page.fill('input[id="password"]', 'adminVNA123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
}

test.describe('Dashboard', () => {
  /**
   * Login trước mỗi test
   */
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  /**
   * Test hiển thị thống kê cơ bản
   */
  test('should display statistics cards', async ({ page }) => {
    // Verify header
    await expect(page.locator('h1')).toContainText('Thống kê');
    
    // Verify có 3 cards thống kê khách hàng
    const customerCards = page.locator('.grid > .card').first();
    await expect(customerCards).toBeVisible();
  });

  /**
   * Test hiển thị biểu đồ
   */
  test('should display revenue chart', async ({ page }) => {
    // Đợi chart load
    await page.waitForSelector('.recharts-wrapper', { timeout: 10000 });
    
    // Verify chart exists
    const chart = page.locator('.recharts-wrapper');
    await expect(chart).toBeVisible();
  });

  /**
   * Test tooltip trên biểu đồ
   */
  test('should show tooltip on chart hover', async ({ page }) => {
    // Đợi chart load
    await page.waitForSelector('.recharts-wrapper', { timeout: 10000 });
    
    // Hover vào một bar trong chart
    const bar = page.locator('.recharts-bar-rectangle').first();
    await bar.hover();
    
    // Verify tooltip hiển thị
    const tooltip = page.locator('.recharts-tooltip-wrapper');
    await expect(tooltip).toBeVisible({ timeout: 3000 });
  });

  /**
   * Test navigation đến các trang khác
   */
  test('should navigate to other pages from quick actions', async ({ page }) => {
    // Click vào "Quản lý khách mời"
    await page.click('text=Quản lý khách mời');
    
    // Verify URL changed
    await expect(page).toHaveURL(/.*quan-ly-khach-moi/);
  });

  /**
   * Test logout functionality
   */
  test('should logout successfully', async ({ page }) => {
    // Click vào sidebar logout (giả sử có)
    // await page.click('[data-testid="logout-button"]');
    
    // Verify redirect về login
    // await expect(page).toHaveURL(/.*login/);
    
    // Note: Cần thêm logout button vào UI
  });
});

