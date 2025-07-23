import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:5173';
const loginEmail = 'admin@example.com';
const loginPassword = 'admin123';

const timestamp = Date.now();
const testUser = {
  name: `TestUser_${timestamp}`,
  email: `user_${timestamp}@example.com`,
  role: 'QA'
};

test.describe.serial('Create → Edit → Delete user safely', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(baseURL);

    // Login
    await page.fill('input[placeholder="Email"]', loginEmail);
    await page.fill('input[placeholder="Password"]', loginPassword);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/i);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Create a new unique user', async () => {
    await page.fill('input[placeholder="Name"]', testUser.name);
    await page.fill('input[placeholder="Email"]', testUser.email);
    await page.fill('input[placeholder="Role"]', testUser.role);
    await page.click('button:has-text("Add")');

    // Assert user was added
    await expect(page.locator(`li:has-text("${testUser.name}")`)).toBeVisible();
  });

  test('Edit that same user', async () => {
    await page.locator(`li:has-text("${testUser.name}") >> text=Edit`).click();
    await page.fill('input[placeholder="Role"]', 'Senior QA');
    await page.click('button:has-text("Update")');

    // Assert update worked
    await expect(
      page.locator(`li:has-text("${testUser.name}") >> text=Senior QA`)
    ).toBeVisible();
  });

  test('Delete the same user', async () => {
    await page.locator(`li:has-text("${testUser.name}") >> text=Delete`).click();

    // Assert deletion worked
    await expect(page.locator(`li:has-text("${testUser.name}")`)).toHaveCount(0);
  });
});
