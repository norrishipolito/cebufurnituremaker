import { expect, test } from "@playwright/test";
import { loginAsAdmin, loginWithCredentials } from "./admin-helpers";

test("admin users page requires authentication", async ({ page }) => {
  await page.goto("/admin/users");

  await expect(page).toHaveURL(/\/admin\/login/);
});

test("maintainer does not see users or settings links in the sidebar", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "The sidebar is desktop-only.");

  const unique = Date.now();
  const email = `e2e-maintainer-sidebar-${unique}@cebufurnituremaker.com`;
  const password = "Password1.";
  let userId: string | null = null;

  await loginAsAdmin(page);

  try {
    const create = await page.request.post("/api/admin/users", {
      data: {
        display_name: `E2E Maintainer ${unique}`,
        email,
        password,
        role: "maintainer",
      },
    });
    expect(create.status()).toBe(201);
    const createPayload = await create.json();
    userId = createPayload.user.id;

    await page.getByRole("button", { name: /^sign out$/i }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
    await loginWithCredentials(page, email, password);

    const sidebar = page.locator("aside").first();
    await expect(sidebar).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Users" })).toHaveCount(0);
    await expect(sidebar.getByRole("link", { name: "Settings" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Users" })).toHaveCount(0);

    await page.goto("/admin/users");
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto("/admin/settings");
    await expect(page).toHaveURL(/\/admin$/);

    await page.goto("/admin/documentation");
    await expect(
      page.getByRole("heading", { name: "Admin Documentation" })
    ).toBeVisible();

    const documentationMain = page.getByRole("main");
    await expect(
      documentationMain.getByRole("link", { name: "Users" })
    ).toHaveCount(0);
    await expect(
      documentationMain.getByRole("link", { name: "Settings" })
    ).toHaveCount(0);
    await expect(
      documentationMain.getByRole("heading", { name: "Users" })
    ).toHaveCount(0);
    await expect(
      documentationMain.getByRole("heading", { name: "Settings" })
    ).toHaveCount(0);
    await expect(
      documentationMain.getByText(
        "Admins use Users for account creation, role assignment, password changes, and deletion."
      )
    ).toHaveCount(0);
  } finally {
    await loginAsAdmin(page);

    if (userId) {
      await page.request.delete(`/api/admin/users/${userId}`);
    }
  }
});
