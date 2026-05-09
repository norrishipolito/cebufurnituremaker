import { expect, test, type Page } from "@playwright/test";
import { adminEmail, loginAsAdmin } from "./admin-helpers";

async function deleteUsersByEmail(page: Page, emails: string[]) {
  const response = await page.request.get("/api/admin/users");

  if (!response.ok()) {
    return;
  }

  const payload = await response.json();
  const users = payload.users ?? [];

  await Promise.all(
    users
      .filter((user: { id?: string; email?: string }) =>
        user.id ? emails.includes(user.email ?? "") : false
      )
      .map((user: { id: string }) =>
        page.request.delete(`/api/admin/users/${user.id}`)
      )
  );
}

test.describe.serial("admin CRUD APIs", () => {
  test.skip(
    ({ isMobile }) => isMobile,
    "DB mutation tests run once to avoid cross-project row races."
  );

  test("admin creates, publishes, validates, and deletes a project", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    const unique = Date.now();
    const slug = `e2e-project-${unique}`;

    const invalid = await page.request.post("/api/admin/projects", {
      data: {
        slug: "Invalid Slug",
        title: "x",
        description: "x",
        category: "x",
        group: "x",
      },
    });
    expect(invalid.status()).toBe(400);

    const create = await page.request.post("/api/admin/projects", {
      data: {
        slug,
        title: `E2E Project ${unique}`,
        description: `E2E project description ${unique}`,
        category: "Testing",
        group: "custom_builds",
        sort_order: 0,
        published: true,
      },
    });
    const createPayload = await create.json();

    test.skip(
      create.status() === 400 &&
        String(createPayload.error ?? "").toLowerCase().includes("constraint"),
      "Supabase projects.group still has the old fixed-group check constraint. Run the documented migration before custom-group e2e coverage."
    );

    expect(create.status(), JSON.stringify(createPayload)).toBe(201);
    const payload = createPayload;

    try {
      await page.goto("/");
      await page.getByRole("tab", { name: "Custom Builds" }).click();
      await expect(page.getByText(`E2E Project ${unique}`)).toBeVisible();

      const duplicate = await page.request.post("/api/admin/projects", {
        data: {
          slug,
          title: `Duplicate ${unique}`,
          description: "Duplicate project",
          category: "Testing",
          group: "custom_builds",
          sort_order: 0,
          published: true,
        },
      });
      expect(duplicate.status()).toBe(400);

      const hide = await page.request.patch(
        `/api/admin/projects/${payload.project.id}`,
        {
          data: { published: false },
        }
      );
      expect(hide.ok()).toBeTruthy();

      await page.goto("/");
      const customTab = page.getByRole("tab", { name: "Custom Builds" });
      if ((await customTab.count()) > 0) {
        await customTab.click();
      }
      await expect(page.getByText(`E2E Project ${unique}`)).toHaveCount(0);
    } finally {
      await page.request.delete(`/api/admin/projects/${payload.project.id}`);
    }
  });

  test("admin APIs reject requests with a mismatched origin header", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    const response = await page.request.post("/api/admin/projects", {
      headers: {
        Origin: "https://evil.example",
      },
      data: {
        slug: `evil-origin-${Date.now()}`,
        title: "Evil Origin",
        description: "This should be rejected before validation or insert.",
        category: "Testing",
        group: "custom_builds",
        sort_order: 0,
        published: false,
      },
    });

    expect(response.status()).toBe(403);
  });

  test("admin project form creates a project without reset errors", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    const unique = Date.now();
    const slug = `e2e-form-project-${unique}`;

    try {
      await page.goto("/admin/projects");
      await page
        .getByPlaceholder("Title (ex. Narra Dining Table)")
        .first()
        .fill(`E2E Form Project ${unique}`);
      await page
        .getByPlaceholder("Slug (ex. narra-dining-table)")
        .first()
        .fill(slug);
      await page
        .getByPlaceholder("Category (ex. Dining Room)")
        .first()
        .fill("Testing");
      await page
        .getByPlaceholder("Group (ex. Products, Showroom, Custom Builds)")
        .first()
        .fill("custom_builds");
      await page
        .getByPlaceholder("Description (ex. Solid wood table with hand-finished edges.)")
        .first()
        .fill(`E2E form project description ${unique}`);
      await page.getByRole("button", { name: "Create Project" }).click();

      await expect(page.getByText("Project created")).toBeVisible();
      await expect(
        page.getByText(/cannot read properties of null/i)
      ).toHaveCount(0);
    } finally {
      const response = await page.request.get("/api/admin/projects");

      if (response.ok()) {
        const payload = await response.json();
        const project = payload.projects?.find(
          (item: { id?: string; slug?: string }) => item.slug === slug
        );

        if (project?.id) {
          await page.request.delete(`/api/admin/projects/${project.id}`);
        }
      }
    }
  });

  test("admin project UI exposes image upload and drag sorting without sort order inputs", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/projects");

    await expect(page.getByLabel("Project image upload")).toBeVisible();
    await expect(
      page.getByPlaceholder("Image alt text (ex. Narra dining table in a Cebu showroom)")
    ).toBeVisible();
    await expect(page.getByText("Drag project handles to reorder")).toBeVisible();
    await expect(page.getByPlaceholder(/sort order/i)).toHaveCount(0);
    await expect(page.getByRole("spinbutton")).toHaveCount(0);
    await expect(page.getByLabel(/^Drag /).first()).toBeVisible();
    await expect(page.getByLabel("Show in Projects section").first()).toBeChecked();
  });

  test("admin controls whether a project appears in the public projects section", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    const unique = Date.now();
    const slug = `e2e-visible-project-${unique}`;
    const title = `E2E Visible Project ${unique}`;

    try {
      await page.goto("/admin/projects");
      await page.getByPlaceholder("Title (ex. Narra Dining Table)").first().fill(title);
      await page.getByPlaceholder("Slug (ex. narra-dining-table)").first().fill(slug);
      await page.getByPlaceholder("Category (ex. Dining Room)").first().fill("Testing");
      await page
        .getByPlaceholder("Group (ex. Products, Showroom, Custom Builds)")
        .first()
        .fill("custom_builds");
      await page
        .getByPlaceholder("Description (ex. Solid wood table with hand-finished edges.)")
        .first()
        .fill(`Public visibility project ${unique}`);
      await expect(page.getByLabel("Show in Projects section").first()).toBeChecked();
      await page.getByRole("button", { name: "Create Project" }).click();
      await expect(page.getByText("Project created")).toBeVisible();

      await page.goto("/");
      await page.locator("#projects").scrollIntoViewIfNeeded();
      await page.getByRole("tab", { name: "Custom Builds" }).click();
      await expect(page.getByText(title)).toBeVisible();

      await page.goto("/admin/projects");
      const row = page.locator(`[data-project-slug="${slug}"]`);
      await expect(row).toBeVisible();
      await row.getByLabel("Show in Projects section").uncheck();
      await row.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Project saved")).toBeVisible();

      await page.goto("/");
      await page.locator("#projects").scrollIntoViewIfNeeded();
      const customTab = page.getByRole("tab", { name: "Custom Builds" });
      if ((await customTab.count()) > 0) {
        await customTab.click();
      }
      await expect(page.getByText(title)).toHaveCount(0);
    } finally {
      const response = await page.request.get("/api/admin/projects");

      if (response.ok()) {
        const payload = await response.json();
        const project = payload.projects?.find(
          (item: { id?: string; slug?: string }) => item.slug === slug
        );

        if (project?.id) {
          await page.request.delete(`/api/admin/projects/${project.id}`);
        }
      }
    }
  });

  test("admin deletes a project from the UI instead of only hiding it", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    const unique = Date.now();
    const slug = `e2e-delete-project-${unique}`;
    const title = `E2E Delete Project ${unique}`;

    try {
      await page.goto("/admin/projects");
      await page.getByPlaceholder("Title (ex. Narra Dining Table)").first().fill(title);
      await page.getByPlaceholder("Slug (ex. narra-dining-table)").first().fill(slug);
      await page.getByPlaceholder("Category (ex. Dining Room)").first().fill("Testing");
      await page
        .getByPlaceholder("Group (ex. Products, Showroom, Custom Builds)")
        .first()
        .fill("custom_builds");
      await page
        .getByPlaceholder("Description (ex. Solid wood table with hand-finished edges.)")
        .first()
        .fill(`Project to delete from UI ${unique}`);
      await page.getByRole("button", { name: "Create Project" }).click();
      await expect(page.getByText("Project created")).toBeVisible();

      const row = page.locator(`[data-project-slug="${slug}"]`);
      await expect(row).toBeVisible();
      page.once("dialog", (dialog) => dialog.accept());
      await row.getByRole("button", { name: "Delete", exact: true }).click();

      await expect(page.getByText("Project deleted")).toBeVisible();
      await expect(row).toHaveCount(0);

      await page.goto("/");
      await expect(page.getByText(title)).toHaveCount(0);

      const response = await page.request.get("/api/admin/projects");
      expect(response.ok()).toBeTruthy();
      const payload = await response.json();
      expect(
        payload.projects?.some((item: { slug?: string }) => item.slug === slug)
      ).toBeFalsy();
    } finally {
      const response = await page.request.get("/api/admin/projects");

      if (response.ok()) {
        const payload = await response.json();
        const project = payload.projects?.find(
          (item: { id?: string; slug?: string }) => item.slug === slug
        );

        if (project?.id) {
          await page.request.delete(`/api/admin/projects/${project.id}`);
        }
      }
    }
  });

  test("admin creates and deletes a testimonial", async ({ page }) => {
    await loginAsAdmin(page);
    const unique = Date.now();

    const invalid = await page.request.post("/api/admin/testimonials", {
      data: {
        name: "x",
        role: "x",
        quote: "x",
      },
    });
    expect(invalid.status()).toBe(400);

    const create = await page.request.post("/api/admin/testimonials", {
      data: {
        name: `E2E Customer ${unique}`,
        role: "Test Client",
        quote: `E2E testimonial quote ${unique}`,
        sort_order: 0,
        published: true,
      },
    });
    expect(create.status()).toBe(201);
    const payload = await create.json();

    try {
      await page.goto("/");
      await expect(
        page.getByText(`E2E testimonial quote ${unique}`).first()
      ).toBeVisible();
    } finally {
      await page.request.delete(`/api/admin/testimonials/${payload.testimonial.id}`);
    }
  });

  test("admin testimonial UI uses drag sorting without sort order inputs", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    const unique = Date.now();
    const name = `E2E UI Testimonial ${unique}`;

    try {
      await page.goto("/admin/testimonials");
      await page.getByPlaceholder("Name (ex. Maria Santos)").first().fill(name);
      await page
        .getByPlaceholder("Role (ex. Interior Designer)")
        .first()
        .fill("Test Client");
      await page
        .getByPlaceholder("Quote (ex. The craftsmanship exceeded our expectations.)")
        .first()
        .fill(`E2E testimonial UI quote ${unique}`);
      await expect(page.getByPlaceholder(/sort order/i)).toHaveCount(0);
      await expect(page.getByRole("spinbutton")).toHaveCount(0);
      await page.getByRole("button", { name: "Create Testimonial" }).click();

      await expect(page.getByText("Testimonial created")).toBeVisible();
      const row = page.locator(`[data-testimonial-name="${name}"]`);
      await expect(row).toBeVisible();
      await expect(row.getByLabel(`Drag ${name}`)).toBeVisible();
      await expect(page.getByText("Drag testimonial handles to reorder")).toBeVisible();

      page.once("dialog", (dialog) => dialog.accept());
      await row.getByRole("button", { name: "Delete" }).click();
      await expect(page.getByText("Testimonial deleted")).toBeVisible();
      await expect(row).toHaveCount(0);
    } finally {
      const response = await page.request.get("/api/admin/testimonials");

      if (response.ok()) {
        const payload = await response.json();
        const testimonial = payload.testimonials?.find(
          (item: { id?: string; name?: string }) => item.name === name
        );

        if (testimonial?.id) {
          await page.request.delete(`/api/admin/testimonials/${testimonial.id}`);
        }
      }
    }
  });

  test("asset upload rejects missing files and invalid image types", async ({
    page,
  }) => {
    await loginAsAdmin(page);

    const missingFile = await page.request.post("/api/admin/assets/upload", {
      multipart: {
        alt_text: "Missing file",
      },
    });
    expect(missingFile.status()).toBe(400);

    const invalidType = await page.request.post("/api/admin/assets/upload", {
      multipart: {
        alt_text: "Invalid file",
        file: {
          name: "not-an-image.txt",
          mimeType: "text/plain",
          buffer: Buffer.from("not an image"),
        },
      },
    });
    expect(invalidType.status()).toBe(400);

    const spoofedImage = await page.request.post("/api/admin/assets/upload", {
      multipart: {
        alt_text: "Spoofed file",
        file: {
          name: "spoofed.png",
          mimeType: "image/png",
          buffer: Buffer.from("not really a png"),
        },
      },
    });
    expect(spoofedImage.status()).toBe(400);
  });

  test("attached assets cannot be deleted before detaching from content", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    const unique = Date.now();
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
      "base64"
    );
    let assetId: string | null = null;
    let projectId: string | null = null;

    try {
      const upload = await page.request.post("/api/admin/assets/upload", {
        multipart: {
          alt_text: `Referenced asset ${unique}`,
          file: {
            name: `referenced-${unique}.png`,
            mimeType: "image/png",
            buffer: png,
          },
        },
      });
      const uploadPayload = await upload.json().catch(() => null);

      test.skip(
        upload.status() !== 201,
        `Vercel Blob upload is not available in this environment: ${
          uploadPayload?.error ?? upload.status()
        }`
      );

      assetId = uploadPayload.asset.id;
      const create = await page.request.post("/api/admin/projects", {
        data: {
          slug: `e2e-referenced-asset-${unique}`,
          title: `E2E Referenced Asset ${unique}`,
          description: `E2E referenced asset project ${unique}`,
          category: "Testing",
          group: "custom_builds",
          primary_asset_id: assetId,
          sort_order: 0,
          published: false,
        },
      });
      expect(create.status()).toBe(201);
      const createPayload = await create.json();
      projectId = createPayload.project.id;

      const blockedDelete = await page.request.delete(`/api/admin/assets/${assetId}`);
      expect(blockedDelete.status()).toBe(409);

      const assetList = await page.request.get("/api/admin/assets");
      expect(assetList.ok()).toBeTruthy();
      const assetPayload = await assetList.json();
      expect(
        assetPayload.assets?.some((asset: { id?: string }) => asset.id === assetId)
      ).toBeTruthy();
    } finally {
      if (projectId) {
        await page.request.delete(`/api/admin/projects/${projectId}`);
      }

      if (assetId) {
        await page.request.delete(`/api/admin/assets/${assetId}`);
      }
    }
  });

  test("media page reads, updates, and deletes assets without upload controls", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    const unique = Date.now();
    const initialAlt = `E2E media asset ${unique}`;
    const updatedAlt = `E2E media asset updated ${unique}`;
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
      "base64"
    );
    let assetId: string | null = null;

    try {
      const upload = await page.request.post("/api/admin/assets/upload", {
        multipart: {
          alt_text: initialAlt,
          file: {
            name: `e2e-media-${unique}.png`,
            mimeType: "image/png",
            buffer: png,
          },
        },
      });
      const uploadPayload = await upload.json().catch(() => null);

      test.skip(
        upload.status() !== 201,
        `Vercel Blob upload is not available in this environment: ${
          uploadPayload?.error ?? upload.status()
        }`
      );

      assetId = uploadPayload.asset.id;
      await page.goto("/admin/media");

      await expect(page.getByRole("button", { name: /upload image/i })).toHaveCount(0);
      await expect(page.locator('input[type="file"]')).toHaveCount(0);
      await expect(
        page.getByText("Uploading happens from the Projects page")
      ).toBeVisible();

      const row = page.locator(`[data-asset-id="${assetId}"]`);
      await expect(row).toBeVisible();
      await row.getByLabel(`Alt text for ${initialAlt}`).fill(updatedAlt);
      await row.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Asset saved")).toBeVisible();

      page.once("dialog", (dialog) => dialog.accept());
      await row.getByRole("button", { name: "Delete" }).click();
      await expect(page.getByText("Asset deleted")).toBeVisible();
      await expect(row).toHaveCount(0);

      const assetsResponse = await page.request.get("/api/admin/assets");
      expect(assetsResponse.ok()).toBeTruthy();
      const assetsPayload = await assetsResponse.json();
      expect(
        assetsPayload.assets?.some((asset: { id?: string }) => asset.id === assetId)
      ).toBeFalsy();
      assetId = null;
    } finally {
      if (assetId) {
        await page.request.delete(`/api/admin/assets/${assetId}`);
      }
    }
  });

  test("admin creates, edits, assigns a role, and deletes a user from the UI", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    const unique = Date.now();
    const email = `e2e-user-${unique}@cebufurnituremaker.com`;
    const updatedEmail = `e2e-user-updated-${unique}@cebufurnituremaker.com`;

    try {
      await page.goto("/admin/users");
      const createForm = page.locator('form[aria-label="Create user"]');
      const currentUserRow = page.locator(`[data-user-email="${adminEmail}"]`);
      await expect(currentUserRow).toBeVisible();
      await expect(
        currentUserRow.getByLabel(`Role for ${adminEmail}`)
      ).toBeDisabled();
      await expect(
        currentUserRow.getByRole("button", { name: "Delete" })
      ).toBeDisabled();

      const me = await page.request.get("/api/admin/me");
      expect(me.ok()).toBeTruthy();
      const currentUserPayload = await me.json();
      const selfId = currentUserPayload.profile.id as string;

      const selfRoleChange = await page.request.patch(
        `/api/admin/users/${selfId}/role`,
        {
          data: { role: "maintainer" },
        }
      );
      expect(selfRoleChange.status()).toBe(400);

      const selfFullRoleChange = await page.request.patch(
        `/api/admin/users/${selfId}`,
        {
          data: { role: "maintainer" },
        }
      );
      expect(selfFullRoleChange.status()).toBe(400);

      const selfDelete = await page.request.delete(`/api/admin/users/${selfId}`);
      expect(selfDelete.status()).toBe(400);

      await createForm
        .getByPlaceholder("Display name (ex. Admin Assistant)")
        .fill(`E2E Maintainer ${unique}`);
      await createForm
        .getByPlaceholder("Email (ex. maintainer@cebufurnituremaker.com)")
        .fill(email);
      await createForm
        .getByPlaceholder("Temporary password (ex. Password1.)")
        .fill("Password1.");
      await createForm.locator('select[name="role"]').selectOption("maintainer");
      await createForm.getByRole("button", { name: "Create User" }).click();

      await expect(page.getByText("User created")).toBeVisible();
      const row = page.locator(`[data-user-email="${email}"]`);
      await expect(row).toBeVisible();
      await expect(row.getByLabel(`Role for ${email}`)).toHaveValue("maintainer");

      await row
        .getByLabel(`Display name for ${email}`)
        .fill(`E2E Admin ${unique}`);
      await row.getByLabel(`Email for ${email}`).fill(updatedEmail);
      await row.getByLabel(`New password for ${email}`).fill("Password1.");
      await row.getByLabel(`Role for ${email}`).selectOption("admin");
      await row.getByRole("button", { name: "Save" }).click();

      await expect(page.getByText("User saved")).toBeVisible();
      const updatedRow = page.locator(`[data-user-email="${updatedEmail}"]`);
      await expect(updatedRow).toBeVisible();
      await expect(updatedRow.getByLabel(`Role for ${updatedEmail}`)).toHaveValue(
        "admin"
      );

      page.once("dialog", (dialog) => dialog.accept());
      await updatedRow.getByRole("button", { name: "Delete" }).click();

      await expect(page.getByText("User deleted")).toBeVisible();
      await expect(updatedRow).toHaveCount(0);
    } finally {
      await deleteUsersByEmail(page, [email, updatedEmail]);
    }
  });

  test("admin sidebar is sticky and does not scroll internally", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/projects");

    const sidebar = page.locator("aside").first();
    await expect(sidebar).toBeVisible();

    const styles = await sidebar.evaluate((element) => {
      const computed = window.getComputedStyle(element);

      return {
        position: computed.position,
        overflowY: computed.overflowY,
      };
    });

    expect(styles.position).toBe("sticky");
    expect(styles.overflowY).toBe("hidden");

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const box = await sidebar.boundingBox();
    expect(box?.y ?? 0).toBeLessThanOrEqual(1);
  });
});
