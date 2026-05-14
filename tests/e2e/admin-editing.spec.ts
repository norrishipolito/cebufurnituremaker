import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  readContentSection,
  saveContentSection,
} from "./admin-helpers";

async function expandContentSection(page: import("@playwright/test").Page, name: string) {
  const toggle = page.getByRole("button", { name, exact: true });

  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
}

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
      await expandContentSection(page, "Hero");
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
      emailDescription: `Admin email description ${unique}`,
      projectInquiryLabel: `Admin inquiries ${unique}`,
      projectInquiryValue: `Admin project card value ${unique}`,
      projectInquiryDescription: `Admin inquiry description ${unique}`,
      phoneDescription: `Admin phone description ${unique}`,
      addressDescription: `Admin address description ${unique}`,
      hoursTitle: `Admin hours ${unique}`,
      hours: `By appointment ${unique}`,
    };
    const updatedFooter = {
      ...originalFooter,
      brand: `Admin footer brand ${unique}`,
    };
    const facebookUrl = `https://facebook.com/e2e-cebu-${unique}`;

    try {
      await expandContentSection(page, "About");
      await page.getByLabel("About title").fill(updatedAbout.title);
      await page.getByLabel("About description").fill(updatedAbout.description);
      await page.getByRole("button", { name: /save about/i }).click();
      await expect(page.getByTestId("content-editor-about-status")).toHaveText(
        /saved/i
      );

      await expandContentSection(page, "Contact");
      await page.getByLabel("Contact title").fill(updatedContact.title);
      await page.getByLabel("Contact email").fill(updatedContact.email);
      await page
        .getByLabel("Email card description")
        .fill(updatedContact.emailDescription);
      await page
        .getByLabel("Project inquiry card title")
        .fill(updatedContact.projectInquiryLabel);
      await page
        .getByLabel("Project inquiry card value")
        .fill(updatedContact.projectInquiryValue);
      await page
        .getByLabel("Project inquiry card description")
        .fill(updatedContact.projectInquiryDescription);
      await page
        .getByLabel("Phone card description")
        .fill(updatedContact.phoneDescription);
      await page
        .getByLabel("Address card description")
        .fill(updatedContact.addressDescription);
      await page.getByLabel("Hours card title").fill(updatedContact.hoursTitle);
      await page.getByLabel("Workshop hours").fill(updatedContact.hours);
      await page.getByRole("button", { name: /save contact/i }).click();
      await expect(page.getByTestId("content-editor-contact-status")).toHaveText(
        /saved/i
      );

      await expandContentSection(page, "Footer");
      await page.getByLabel("Footer brand description").fill(updatedFooter.brand);
      await page.getByLabel("Facebook URL").fill(facebookUrl);
      await page.getByRole("button", { name: /save footer/i }).click();
      await expect(page.getByTestId("content-editor-footer-status")).toHaveText(
        /saved/i
      );

      await page.goto("/");
      await expect(
        page.getByRole("heading", { name: updatedAbout.title })
      ).toBeVisible();
      await expect(page.getByText(updatedContact.email)).toBeVisible();
      await expect(page.getByText(updatedContact.emailDescription)).toBeVisible();
      await expect(page.getByText(updatedContact.projectInquiryLabel)).toBeVisible();
      await expect(page.getByText(updatedContact.projectInquiryValue)).toBeVisible();
      await expect(page.getByText(updatedContact.hours)).toBeVisible();
      await expect(page.getByText(updatedFooter.brand)).toBeVisible();
      await expect(page.getByRole("link", { name: "Facebook" })).toHaveAttribute(
        "href",
        facebookUrl
      );
      await expect(page.getByRole("link", { name: "GitHub" })).toHaveCount(0);
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

    await expandContentSection(page, "Hero");
    await expandContentSection(page, "Contact");
    await expandContentSection(page, "Footer");
    await expect(page.getByLabel("Hero heading")).toBeVisible();
    await expect(page.getByLabel("Contact email")).toBeVisible();
    await expect(page.getByLabel("Email card description")).toBeVisible();
    await expect(page.getByLabel("Project inquiry card title")).toBeVisible();
    await expect(page.getByLabel("Project inquiry card value")).toBeVisible();
    await expect(page.getByLabel("Project inquiry card description")).toBeVisible();
    await expect(page.getByLabel("Phone card description")).toBeVisible();
    await expect(page.getByLabel("Address card description")).toBeVisible();
    await expect(page.getByLabel("Hours card title")).toBeVisible();
    await expect(page.getByLabel("Workshop hours")).toBeVisible();
    await expect(page.getByLabel("Footer brand description")).toBeVisible();
    await expect(page.getByLabel("Facebook URL")).toBeVisible();
    await expect(page.getByLabel("Instagram URL")).toBeVisible();
    await expect(page.getByLabel("Twitter URL")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Navigation" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /save navigation/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /add navigation item/i })).toHaveCount(0);
    const navigationPatch = await page.request.patch("/api/admin/content/navigation", {
      data: [],
    });
    expect(navigationPatch.status()).toBe(400);
    await expect(page.getByTestId("content-editor-hero")).toHaveCount(0);
  });

  test("content editor sections expand and keep showcase description below the showcase title and image", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/content");

    const aboutToggle = page.getByRole("button", { name: "About", exact: true });
    await expect(aboutToggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByLabel("About title")).toHaveCount(0);

    await aboutToggle.click();
    await expect(aboutToggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByLabel("Showcase description")).toBeVisible();

    const titleBox = await page.getByLabel("Showcase title").boundingBox();
    const imageBox = await page.getByLabel("Showcase image URL").boundingBox();
    const descriptionBox = await page
      .getByLabel("Showcase description")
      .boundingBox();

    expect(titleBox).not.toBeNull();
    expect(imageBox).not.toBeNull();
    expect(descriptionBox).not.toBeNull();
    expect(descriptionBox!.y).toBeGreaterThan(
      Math.max(titleBox!.y, imageBox!.y)
    );

    await aboutToggle.click();
    await expect(aboutToggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByLabel("About title")).toHaveCount(0);
  });
});
