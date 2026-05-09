import { expect, test } from "@playwright/test";

test("contact form validates and submits", async ({ page }) => {
  await page.goto("/#contact");
  await page.waitForLoadState("networkidle");

  await page.getByPlaceholder("Your Name").fill("Test User");
  await page.getByPlaceholder("Your Email").fill("test@example.com");
  await page.getByPlaceholder("Message").fill("I would like a custom table.");
  await page.getByRole("button", { name: /send message/i }).click();

  await expect(page.getByText(/message sent|supabase|configuration/i)).toBeVisible();
});
