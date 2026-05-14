import { expect, test } from "@playwright/test";

test("projects admin requires authentication", async ({ page }) => {
  await page.goto("/admin/projects");

  await expect(page).toHaveURL(/\/admin\/login/);
});
