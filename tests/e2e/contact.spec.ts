import { expect, test } from "@playwright/test";

test("contact form validates and submits", async ({ page }) => {
  await page.goto("/#contact");
  await page.waitForLoadState("networkidle");

  await page.getByLabel("Name").fill("Test User");
  await page.getByLabel("Email").fill("test@example.com");
  await expect(page.getByLabel("Phone")).toBeVisible();
  await expect(page.getByLabel("Inquiry type")).toBeVisible();
  const message = page.getByLabel("Message");
  await expect(message).toHaveJSProperty("tagName", "TEXTAREA");
  await expect(message).toHaveAttribute("placeholder", /Ex\./);
  await expect
    .poll(async () =>
      message.evaluate((element) => Number.parseFloat(getComputedStyle(element).minHeight))
    )
    .toBeGreaterThan(100);
  const initialHeight = await message.evaluate((element) => element.clientHeight);
  await message.fill(
    [
      "I would like a custom table.",
      "The dining area is about three meters wide.",
      "We prefer a warm wood finish and seating for six.",
      "Please share what details you need for an estimate.",
      "We also want matching bench seating on one side.",
      "The table should be comfortable for everyday family meals.",
      "It should still feel polished enough for hosting guests.",
      "We are open to your recommendation on wood species.",
      "A durable finish is important because we have young children.",
      "Please include an estimated timeline if possible.",
      "We can send inspiration photos after your first reply.",
      "Thank you.",
    ].join("\n")
  );
  await expect
    .poll(async () => message.evaluate((element) => element.clientHeight))
    .toBeGreaterThan(initialHeight);
  await page.getByRole("button", { name: /send message/i }).click();

  await expect(page.getByText(/message sent|supabase|configuration/i)).toBeVisible();
});
