import { test, expect } from '@playwright/test';

const validEmail = 'admin@example.com';
const validPassword = 'admin123';
const invalidPassword = 'wrongpass';

test.describe('User Management App', () => {
  test('Login with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.fill('input[placeholder="Email"]', validEmail);
    await page.fill('input[placeholder="Password"]', validPassword);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=User Dashboard')).toBeVisible();
  });

  test('Login with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.fill('input[placeholder="Email"]', validEmail);
    await page.fill('input[placeholder="Password"]', invalidPassword);
    await page.click('button:has-text("Login")');
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('Create, Edit, and Delete a user', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:5173');
    await page.fill('input[placeholder="Email"]', validEmail);
    await page.fill('input[placeholder="Password"]', validPassword);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/.*dashboard/);

    // Add user
    await page.fill('input[placeholder="Name"]', 'Test User');
    await page.fill('input[placeholder="Email"]', 'testuser@example.com');
    await page.fill('input[placeholder="Role"]', 'QA');
    await page.click('button:has-text("Add")');
    await expect(page.locator('text=Test User')).toBeVisible();

    // Edit user
    await page.locator('button:has-text("Edit")').nth(0).click();
    await page.fill('input[placeholder="Role"]', 'QA Lead');
    await page.click('button:has-text("Update")');
    await expect(page.locator('text=QA Lead')).toBeVisible();

    // Delete user
    await page.locator('button:has-text("Delete")').nth(0).click();
    await expect(page.locator('text=Test User')).not.toBeVisible();
  });
});