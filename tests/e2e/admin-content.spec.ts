import { expect, test } from "@playwright/test";

test("content editor requires authentication", async ({ page }) => {
  await page.goto("/admin/content");

  await expect(page).toHaveURL(/\/admin\/login/);
});
