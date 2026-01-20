import { test, expect } from '@playwright/test';

test.describe('BMI Calculator Web App', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Generate unique user
    const uniqueId = Date.now().toString();
    const email = `testuser_${uniqueId}@example.com`;
    const password = 'password123';
    const name = `Test User ${uniqueId}`;

    // 2. Go to Register
    await page.goto('/register');
    await page.fill('input[name="name"]', name);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // 3. Should redirect to Login, then login
    await expect(page).toHaveURL('/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // 4. Should redirect to Home
    await expect(page).toHaveURL('/');
  });

  test('TC01: Calculate BMI - Normal Weight', async ({ page }) => {
    // 1. Enter Height
    await page.fill('input[placeholder="e.g. 175"]', '175');
    // 2. Enter Weight
    await page.fill('input[placeholder="e.g. 70"]', '70');
    // 3. Enter Age
    await page.fill('input[placeholder="e.g. 25"]', '25');
    // 4. Click Calculate
    await page.click('button[type="submit"]');

    // 5. Verify Result (BMI ~ 22.86)
    await expect(page.locator('text=BMI: 22.86')).toBeVisible();
    await expect(page.locator('text=Category: Normal weight')).toBeVisible();
    await expect(page.locator('text=คำแนะนำ: รักษาสุขภาพให้แข็งแรง ออกกำลังกายอย่างสม่ำเสมอ')).toBeVisible();
  });

  test('TC02: Calculate BMI - Underweight', async ({ page }) => {
    // 1. Enter Height
    await page.fill('input[placeholder="e.g. 175"]', '180');
    // 2. Enter Weight
    await page.fill('input[placeholder="e.g. 70"]', '50');
    // 3. Enter Age
    await page.fill('input[placeholder="e.g. 25"]', '25');
    // 4. Click Calculate
    await page.click('button[type="submit"]');

    // 5. Verify Result (BMI ~ 15.43)
    await expect(page.locator('text=BMI: 15.43')).toBeVisible();
    await expect(page.locator('text=Category: Underweight')).toBeVisible();
    await expect(page.locator('text=คำแนะนำ: ควรรับประทานอาหารที่มีประโยชน์และเพิ่มปริมาณอาหารให้เหมาะสม')).toBeVisible();
  });

  test('TC03: Calculate BMI - Obesity', async ({ page }) => {
    // 1. Enter Height
    await page.fill('input[placeholder="e.g. 175"]', '170');
    // 2. Enter Weight
    await page.fill('input[placeholder="e.g. 70"]', '90');
    // 3. Enter Age
    await page.fill('input[placeholder="e.g. 25"]', '25');
    // 4. Click Calculate
    await page.click('button[type="submit"]');

    // 5. Verify Result (BMI ~ 31.14)
    await expect(page.locator('text=BMI: 31.14')).toBeVisible();
    await expect(page.locator('text=Category: Obesity')).toBeVisible();
    await expect(page.locator('text=คำแนะนำ: ควรปรึกษาแพทย์เพื่อรับคำแนะนำในการลดน้ำหนัก')).toBeVisible();
  });

  test('TC04: Validation - Empty Fields', async ({ page }) => {
    // 1. Click Calculate without entering data
    await page.click('button[type="submit"]');
    
    // 2. Verify Result is NOT visible
    await expect(page.locator('text=BMI:')).not.toBeVisible();
  });

  test('TC05: Verify Footer Text', async ({ page }) => {
    // 1. Check footer content
    await expect(page.locator('footer')).toContainText('67162110146-1');
  });

  test('TC06: Calculate BMI - Elderly Normal Weight', async ({ page }) => {
    // 1. Enter Height
    await page.fill('input[placeholder="e.g. 175"]', '175');
    // 2. Enter Weight
    await page.fill('input[placeholder="e.g. 70"]', '70');
    // 3. Enter Age
    await page.fill('input[placeholder="e.g. 25"]', '65');
    // 4. Select Gender
    await page.selectOption('select', 'male');
    // 5. Click Calculate
    await page.click('button[type="submit"]');

    // 6. Verify Result
    await expect(page.locator('text=Category: Normal weight')).toBeVisible();
    await expect(page.locator('text=ผู้สูงอายุควรระวังเรื่องมวลกล้ามเนื้อและโภชนาการ')).toBeVisible();
  });
});
