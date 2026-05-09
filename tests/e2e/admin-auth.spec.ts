import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./admin-helpers";

test("logged-out admin users are redirected to login", async ({ page }) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole("heading", { name: /admin sign in/i })).toBeVisible();
  await expect(page.locator("aside")).toHaveCount(0);
  await expect(page.getByText("Cebu Furniture Admin")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Dashboard" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "View Site" })).toHaveCount(0);
});

test("signed-in admin can sign out from the admin header", async ({ page }) => {
  await loginAsAdmin(page);

  await page.getByRole("button", { name: /^sign out$/i }).click();
  await expect(page).toHaveURL(/\/admin\/login/);

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("signed-in admin can toggle dark mode", async ({ page }) => {
  await page.goto("/admin/login");
  await page.evaluate(() => {
    window.localStorage.setItem("admin-theme", "light");
  });
  await loginAsAdmin(page);

  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(
    page.getByRole("button", { name: "Switch to light mode" })
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() =>
        document.querySelector('[data-testid="admin-theme-root"]')?.parentElement
          ?.classList.contains("dark")
      )
    )
    .toBe(true);

  await page.reload();
  await expect(
    page.getByRole("button", { name: "Switch to light mode" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
});
