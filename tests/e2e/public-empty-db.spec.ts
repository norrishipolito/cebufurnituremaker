import { expect, test, type Locator } from "@playwright/test";

async function expectCumulativeOpacity(locator: Locator) {
  await expect
    .poll(async () =>
      locator.evaluate((element) => {
        let current: HTMLElement | null = element as HTMLElement;
        let opacity = 1;

        while (current && current !== document.body) {
          const value = Number.parseFloat(window.getComputedStyle(current).opacity);
          opacity *= Number.isNaN(value) ? 1 : value;
          current = current.parentElement;
        }

        return opacity;
      })
    )
    .toBeGreaterThan(0.9);
}

test("public homepage renders editable sections and project tabs", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#hero")).toBeVisible();
  await expect(page.locator("#about")).toBeVisible();
  await expect(page.locator("#projects")).toBeVisible();
  await expect(page.locator("#contact")).toBeVisible();
  const projectTabs = page.getByRole("tab");
  if ((await projectTabs.count()) > 0) {
    await expect(projectTabs.first()).toBeVisible();
  }
});

test("public homepage keeps revealed content visible after returning from a missing page", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(page.locator("footer")).toBeVisible();

  await page.getByRole("link", { name: "Collections" }).click();
  await expect(page).toHaveURL(/\/collections$/);
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);

  await expect(page.locator("#about h2")).toHaveText(/\S/);
  await expectCumulativeOpacity(page.locator("#about h2"));
  await expect(page.locator("#projects h2")).toHaveText(/\S/);
  await expectCumulativeOpacity(page.locator("#projects h2"));
  await expect(page.getByRole("heading", { name: "Product" })).toBeVisible();
  await expectCumulativeOpacity(page.getByRole("heading", { name: "Product" }));
});
