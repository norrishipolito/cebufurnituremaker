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

test("admin documentation requires authentication", async ({ page }) => {
  await page.goto("/admin/documentation");

  await expect(page).toHaveURL(/\/admin\/login/);
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

test("signed-in admin header stays sticky on scrollable pages", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/admin/documentation");

  const header = page.getByRole("banner");
  await expect(header).toBeVisible();

  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollHeight > window.innerHeight
      )
    )
    .toBe(true);

  const styles = await header.evaluate((element) => {
    const computed = window.getComputedStyle(element);
    const parent = element.parentElement
      ? window.getComputedStyle(element.parentElement)
      : null;

    return {
      parentOverflowY: parent?.overflowY,
      position: computed.position,
      top: computed.top,
    };
  });

  expect(styles.position).toBe("sticky");
  expect(styles.top).toBe("0px");
  expect(styles.parentOverflowY).toBe("visible");

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  const headerBox = await header.boundingBox();
  expect(headerBox?.y ?? 999).toBeLessThanOrEqual(1);
});

test("signed-in admin can open documentation from the sidebar", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "The sidebar is desktop-only.");

  await loginAsAdmin(page);

  const sidebar = page.locator("aside").first();
  await expect(sidebar.getByRole("link", { name: "Documentation" })).toBeVisible();
  await sidebar.getByRole("link", { name: "Documentation" }).click();

  await expect(page).toHaveURL(/\/admin\/documentation/);
  await expect(
    page.getByRole("heading", { name: "Admin Documentation" })
  ).toBeVisible();
  const documentationMain = page.getByRole("main");
  await expect(
    documentationMain.getByText("Contents", { exact: true })
  ).toBeVisible();
  await expect(
    documentationMain.getByRole("link", { name: "Projects" })
  ).toBeVisible();
  await expect(
    documentationMain.getByRole("heading", { name: "Projects" })
  ).toBeVisible();
  await expect(
    documentationMain.getByRole("heading", { name: "Users" })
  ).toBeVisible();
  await expect(
    documentationMain.getByRole("heading", { name: "Settings" })
  ).toBeVisible();
  await expect(
    documentationMain.getByText("Narra Dining Table", { exact: true })
  ).toBeVisible();
});
