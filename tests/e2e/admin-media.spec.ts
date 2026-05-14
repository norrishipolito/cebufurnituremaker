import { expect, test } from "@playwright/test";

test("media admin requires authentication", async ({ page }) => {
  await page.goto("/admin/media");

  await expect(page).toHaveURL(/\/admin\/login/);
});
