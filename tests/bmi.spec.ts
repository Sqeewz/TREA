import { test, expect } from '@playwright/test';

test.describe('BMI Calculator Web App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC01: Calculate BMI - Normal Weight', async ({ page }) => {
    // 1. Enter Height
    await page.fill('input[placeholder="e.g. 175"]', '175');
    // 2. Enter Weight
    await page.fill('input[placeholder="e.g. 70"]', '70');
    // 3. Click Calculate
    await page.click('button[type="submit"]');

    // 4. Verify Result (BMI ~ 22.86)
    await expect(page.locator('text=BMI: 22.86')).toBeVisible();
    await expect(page.locator('text=Category: Normal weight')).toBeVisible();
  });

  test('TC02: Calculate BMI - Underweight', async ({ page }) => {
    // 1. Enter Height
    await page.fill('input[placeholder="e.g. 175"]', '180');
    // 2. Enter Weight
    await page.fill('input[placeholder="e.g. 70"]', '50');
    // 3. Click Calculate
    await page.click('button[type="submit"]');

    // 4. Verify Result (BMI ~ 15.43)
    await expect(page.locator('text=BMI: 15.43')).toBeVisible();
    await expect(page.locator('text=Category: Underweight')).toBeVisible();
  });

  test('TC03: Calculate BMI - Obesity', async ({ page }) => {
    // 1. Enter Height
    await page.fill('input[placeholder="e.g. 175"]', '170');
    // 2. Enter Weight
    await page.fill('input[placeholder="e.g. 70"]', '90');
    // 3. Click Calculate
    await page.click('button[type="submit"]');

    // 4. Verify Result (BMI ~ 31.14)
    await expect(page.locator('text=BMI: 31.14')).toBeVisible();
    await expect(page.locator('text=Category: Obesity')).toBeVisible();
  });

  test('TC04: Validation - Empty Fields', async ({ page }) => {
    // 1. Click Calculate without entering data
    // Note: The inputs have 'required' attribute, so browser validation kicks in.
    // We can check if the inputs are invalid using pseudo-classes or check if submission happened.
    // For simplicity, we check that no result is displayed.
    await page.click('button[type="submit"]');
    
    // 2. Verify Result is NOT visible
    await expect(page.locator('text=BMI:')).not.toBeVisible();
  });

  test('TC05: Verify Footer Text', async ({ page }) => {
    // 1. Check footer content
    await expect(page.locator('footer')).toContainText('67162110146-1');
  });
});
