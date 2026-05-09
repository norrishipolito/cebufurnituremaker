import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  readContentSection,
  saveContentSection,
} from "./admin-helpers";

test.describe.serial("authenticated admin editing", () => {
  test.skip(
    ({ isMobile }) => isMobile,
    "DB mutation tests run once to avoid cross-project row races."
  );

  test("hero content saves and reflects on the public homepage", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/content");

    const originalHero = await readContentSection(page, "hero");
    const unique = Date.now();
    const updatedHero = {
      ...originalHero,
      heading: `Admin Test Hero ${unique}`,
      emphasizedHeading: "",
      tagline: `Admin test tagline ${unique}`,
    };

    try {
      await page.getByLabel("Hero heading").fill(updatedHero.heading);
      await page.getByLabel("Emphasized heading text").fill("");
      await page.getByLabel("Hero tagline").fill(updatedHero.tagline);
      await page.getByRole("button", { name: /save hero/i }).click();
      await expect(page.getByTestId("content-editor-hero-status")).toHaveText(
        /saved/i
      );

      await page.goto("/");
      await expect(
        page.getByRole("heading", { name: updatedHero.heading })
      ).toBeVisible();
      await expect(page.getByText(updatedHero.tagline)).toBeVisible();
    } finally {
      await page.goto("/admin/content");
      await saveContentSection(page, "hero", originalHero);
    }
  });

  test("about, contact, and footer section edits render publicly", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/content");

    const originalAbout = await readContentSection(page, "about");
    const originalContact = await readContentSection(page, "contact");
    const originalFooter = await readContentSection(page, "footer");
    const unique = Date.now();

    const updatedAbout = {
      ...originalAbout,
      title: `Admin About ${unique}`,
      description: `Admin about description ${unique}`,
    };
    const updatedContact = {
      ...originalContact,
      title: `Admin Contact ${unique}`,
      email: `admin-${unique}@example.com`,
    };
    const updatedFooter = {
      ...originalFooter,
      brand: `Admin footer brand ${unique}`,
    };
    try {
      await page.getByLabel("About title").fill(updatedAbout.title);
      await page.getByLabel("About description").fill(updatedAbout.description);
      await page.getByRole("button", { name: /save about/i }).click();
      await expect(page.getByTestId("content-editor-about-status")).toHaveText(
        /saved/i
      );

      await page.getByLabel("Contact title").fill(updatedContact.title);
      await page.getByLabel("Contact email").fill(updatedContact.email);
      await page.getByRole("button", { name: /save contact/i }).click();
      await expect(page.getByTestId("content-editor-contact-status")).toHaveText(
        /saved/i
      );

      await page.getByLabel("Footer brand description").fill(updatedFooter.brand);
      await page.getByRole("button", { name: /save footer/i }).click();
      await expect(page.getByTestId("content-editor-footer-status")).toHaveText(
        /saved/i
      );

      await page.goto("/");
      await expect(
        page.getByRole("heading", { name: updatedAbout.title })
      ).toBeVisible();
      await expect(page.getByText(updatedContact.email)).toBeVisible();
      await expect(page.getByText(updatedFooter.brand)).toBeVisible();
    } finally {
      await page.goto("/admin/content");
      await saveContentSection(page, "about", originalAbout);
      await saveContentSection(page, "contact", originalContact);
      await saveContentSection(page, "footer", originalFooter);
    }
  });

  test("content editor uses guided fields instead of a raw JSON textarea", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/content");

    await expect(page.getByLabel("Hero heading")).toBeVisible();
    await expect(page.getByLabel("Contact email")).toBeVisible();
    await expect(page.getByLabel("Footer brand description")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Navigation" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /save navigation/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /add navigation item/i })).toHaveCount(0);
    const navigationPatch = await page.request.patch("/api/admin/content/navigation", {
      data: [],
    });
    expect(navigationPatch.status()).toBe(400);
    await expect(page.getByTestId("content-editor-hero")).toHaveCount(0);
  });
});
