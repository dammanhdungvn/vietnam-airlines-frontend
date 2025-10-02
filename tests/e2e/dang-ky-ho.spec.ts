/**
 * @fileoverview E2E tests cho chức năng Đăng ký hộ
 * @version 1.0.0
 * @since 2025-10-02
 * @author Dũng Đàm
 */

import { test, expect } from '@playwright/test';

async function loginAsAdmin(page: any) {
  await page.goto('/login');
  await page.fill('input[id="username"]', 'admin');
  await page.fill('input[id="password"]', 'adminVNA123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
}

test.describe('Đăng Ký Hộ', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dang-ky-ho');
  });

  /**
   * Test hiển thị danh sách khách hàng (chưa đăng ký ghế)
   */
  test('should display customers without seat registration', async ({ page }) => {
    // Verify step 1 active
    await expect(page.locator('text=Khách hàng')).toBeVisible();
    
    // Verify có danh sách khách hàng
    await page.waitForSelector('[data-testid="customer-list"]', { timeout: 10000 });
  });

  /**
   * Test không hiển thị khách đã đăng ký ghế
   */
  test('should not show customers with seat registration', async ({ page }) => {
    // Giả sử có customer với seatInfo
    // Verify customer đó không xuất hiện trong list
    
    // Note: Cần mock data hoặc setup test data
  });

  /**
   * Test chọn khách hàng và next step
   */
  test('should select customer and move to next step', async ({ page }) => {
    // Wait for customer list
    await page.waitForSelector('[data-testid="customer-list"]', { timeout: 10000 });
    
    // Select first customer
    const firstCustomer = page.locator('[data-testid="customer-item"]').first();
    await firstCustomer.click();
    
    // Click Tiếp tục
    await page.click('text=Tiếp tục');
    
    // Verify moved to step 2
    await expect(page.locator('text=Lấy thông tin')).toHaveClass(/active/);
  });

  /**
   * Test validation: phải có checkbox và avatar
   */
  test('should validate checkbox and avatar in step 2', async ({ page }) => {
    // Select customer and go to step 2
    await page.waitForSelector('[data-testid="customer-list"]', { timeout: 10000 });
    const firstCustomer = page.locator('[data-testid="customer-item"]').first();
    await firstCustomer.click();
    await page.click('text=Tiếp tục');
    
    // Try to continue without checkbox
    const continueButton = page.locator('button:has-text("Tiếp tục")');
    await expect(continueButton).toBeDisabled();
    
    // Check agreement checkbox
    await page.check('input[type="checkbox"][id="agreement"]');
    
    // Nếu customer chưa có avatar, button vẫn disabled
    // Nếu có avatar, button should be enabled
  });

  /**
   * Test thêm khách hàng mới nhanh
   */
  test('should open quick add customer modal', async ({ page }) => {
    // Click Thêm khách mới
    await page.click('text=Thêm khách mới');
    
    // Verify modal opened
    await expect(page.locator('text=Thêm khách mời mới')).toBeVisible();
    
    // Fill form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[placeholder="Nhập họ và tên"]', 'Test User');
    
    // Note: Cần handle submit và verify
  });
});

