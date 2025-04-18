import { test, expect } from "@playwright/test";

test("Tickets page loads", async ({ page }) => {
  await page.goto("http://localhost:3000/tickets");

  // Example check: page contains heading or label related to tickets
  await expect(page.locator("h1, h2")).toContainText(
    /Tickets|My Bookings|Passes/i
  );
});
