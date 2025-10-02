/**
 * @fileoverview E2E tests cho chức năng đăng nhập
 * @version 1.0.0
 * @since 2025-10-02
 * @author Dũng Đàm
 */

import { test, expect } from '@playwright/test';

/**
 * Test suite cho Login flow
 */
test.describe('Login Flow', () => {
  /**
   * Test đăng nhập thành công với admin credentials
   */
  test('should login successfully with admin credentials', async ({ page }) => {
    // Navigate đến trang login
    await page.goto('/login');
    
    // Đợi trang load xong
    await page.waitForLoadState('networkidle');
    
    // Điền thông tin đăng nhập
    await page.fill('input[id="username"]', 'admin');
    await page.fill('input[id="password"]', 'adminVNA123');
    
    // Click nút Sign in
    await page.click('button[type="submit"]');
    
    // Đợi redirect và kiểm tra URL
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Verify đã vào dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Verify có header "Thống kê"
    await expect(page.locator('h1')).toContainText('Thống kê');
  });

  /**
   * Test đăng nhập thất bại với sai credentials
   */
  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Điền thông tin sai
    await page.fill('input[id="username"]', 'wronguser');
    await page.fill('input[id="password"]', 'wrongpass');
    
    await page.click('button[type="submit"]');
    
    // Đợi và verify error message
    const errorToast = page.locator('.sonner-toast');
    await expect(errorToast).toBeVisible({ timeout: 5000 });
  });

  /**
   * Test validation cho empty fields
   */
  test('should validate empty username and password', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Click submit với empty fields
    await page.click('button[type="submit"]');
    
    // Verify validation messages
    await expect(page.locator('text=Tên đăng nhập không được để trống')).toBeVisible();
    await expect(page.locator('text=Mật khẩu không được để trống')).toBeVisible();
  });

  /**
   * Test redirect khi đã đăng nhập
   */
  test('should redirect to dashboard if already logged in', async ({ page, context }) => {
    // First login
    await page.goto('/login');
    await page.fill('input[id="username"]', 'admin');
    await page.fill('input[id="password"]', 'adminVNA123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    // Try to go back to login
    await page.goto('/login');
    
    // Should redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    await expect(page).toHaveURL(/.*dashboard/);
  });
});

