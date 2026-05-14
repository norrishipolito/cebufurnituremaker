import { expect, type Page } from "@playwright/test";

export const adminEmail =
  process.env.E2E_ADMIN_EMAIL ?? "test@cebufurnituremaker.com";
export const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? "Password1.";

export async function loginWithCredentials(
  page: Page,
  email: string,
  password: string
) {
  await page.goto("/admin/login");
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

export async function loginAsAdmin(page: Page) {
  await loginWithCredentials(page, adminEmail, adminPassword);
}

export async function saveContentSection(
  page: Page,
  sectionKey: string,
  value: unknown
) {
  const response = await page.request.patch(`/api/admin/content/${sectionKey}`, {
    data: value,
  });
  expect(response.ok()).toBeTruthy();
}

export async function readContentSection(page: Page, sectionKey: string) {
  const response = await page.request.get(`/api/admin/content/${sectionKey}`);
  expect(response.ok()).toBeTruthy();
  const payload = await response.json();
  return payload.content;
}
