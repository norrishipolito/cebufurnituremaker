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

test("public project cards open a carousel modal and detail page", async ({ page }) => {
  await page.goto("/");
  await page.locator("#projects").scrollIntoViewIfNeeded();

  await page.getByRole("button", { name: /Modern Sofa Set/ }).first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Modern Sofa Set" })).toBeVisible();
  await expect(dialog.getByText("Project Overview")).toBeVisible();
  await expect(dialog.getByText("Living Room").first()).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Show Modern Sofa Set image 2" })).toBeVisible();

  await dialog.getByRole("button", { name: "Show Modern Sofa Set image 2" }).click();
  await dialog.getByRole("link", { name: "View More Details" }).click();

  await expect(page).toHaveURL(/\/projects\/modern-sofa-set$/);
  await expect(page.getByRole("heading", { name: "Modern Sofa Set" })).toBeVisible();
  await expect(page.getByText("Project Overview")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Ready to shape a piece that feels made for your space?",
    })
  ).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
});

test("public project cards preview multiple images on hover", async ({
  isMobile,
  page,
}) => {
  test.skip(isMobile, "Hover image previews are desktop-only.");

  await page.goto("/");
  await page.locator("#projects").scrollIntoViewIfNeeded();

  const card = page.getByRole("button", { name: /Modern Sofa Set/ }).first();
  const previewImage = card.locator("img").first();
  await expect(previewImage).toHaveAttribute("alt", /Modern sofa set/i);
  await card.hover();

  await expect
    .poll(async () => previewImage.getAttribute("alt"))
    .toContain("Wood coffee table");
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
