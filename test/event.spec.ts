import { test, expect } from '@playwright/test';

test('Event details page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/event/jh7as7crgs8atvw38ffpbk0r4s7e7yn3');

  // Check if the page title or header contains "QuickPass"
  await expect(page.locator('h1')).toHaveText(/QuickPass/i);

  // Optional: If the actual event title is inside a different tag, like <h2> or <p>, check that instead
  // For example, assuming event title is in <h2>
  // await expect(page.locator('h2')).toContainText(/Event|Concert|Conference/i);
});
