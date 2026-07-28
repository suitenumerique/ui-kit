import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestShareModal } from "../helpers/mount-share-modal";

const calls = (page: Page) =>
  page.evaluate(() => window.__shareModalCalls ?? []);

const importModalDescription = (page: Page) =>
  page.getByText(
    "Upload a CSV or XLSX file with your contacts, or start from our template.",
  );

const openImportModalAndUpload = async (page: Page) => {
  await page.getByRole("button", { name: "Import contacts" }).click();
  await page.getByRole("menuitem", { name: "Import contacts" }).click();

  await expect(importModalDescription(page)).toBeVisible();

  await page.locator('input[type="file"]').setInputFiles({
    name: "contacts.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("alice@example.com,admin"),
  });
  await expect(page.locator(".c__alert--info")).toContainText(
    "1 row ready to be imported.",
  );
};

// The kebab-visibility cases (allowFileImport on/off, canUpdate false) are
// covered by e2e/share-import-modal/share-modal-import.spec.tsx, and the
// parsing internals by share-import-modal.spec.tsx. This spec only covers the
// seam those files cannot assert: the rows reaching onImportContacts and the
// close/lock behavior driven by its resolved value.
test.describe("ShareModal import contacts seam", () => {
  test("imported rows flow to onImportContacts and the import modal closes when it resolves true", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal allowFileImport />);

    await openImportModalAndUpload(page);

    await page.getByRole("button", { name: "Import", exact: true }).click();

    expect(await calls(page)).toContainEqual({
      name: "import-contacts",
      rows: [{ email: "alice@example.com", role: "admin" }],
    });
    await expect(importModalDescription(page)).toHaveCount(0);
  });

  test("keeps the import modal open when onImportContacts resolves false", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal allowFileImport importResult={false} />);

    await openImportModalAndUpload(page);

    await page.getByRole("button", { name: "Import", exact: true }).click();

    expect(await calls(page)).toContainEqual({
      name: "import-contacts",
      rows: [{ email: "alice@example.com", role: "admin" }],
    });
    await expect(importModalDescription(page)).toBeVisible();
  });

  test("locks the import modal while onImportContacts is pending", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal allowFileImport holdImport />);

    await openImportModalAndUpload(page);

    const importModal = page.locator(".c__modal--medium");
    const importButton = page.getByRole("button", {
      name: "Import",
      exact: true,
    });
    await importButton.click();

    await expect(importButton).toBeDisabled();
    await expect(importButton.locator(".c__spinner")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Cancel", exact: true }),
    ).toBeDisabled();
    // preventClose removes the import modal's own close button (the parent
    // ShareModal keeps its X, hence the scoping to the medium modal).
    await expect(
      importModal.getByRole("button", { name: "close" }),
    ).toHaveCount(0);

    await page.keyboard.press("Escape");
    await expect(importModalDescription(page)).toBeVisible();

    await page.evaluate(() => window.__resolveImport?.(true));
    await expect(importModalDescription(page)).toHaveCount(0);
  });

  test("keeps the import action reachable when there are no members", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal allowFileImport membersCount={0} />);

    await expect(page.getByTestId("share-member-item")).toHaveCount(0);
    await page.getByRole("button", { name: "Import contacts" }).click();
    await page.getByRole("menuitem", { name: "Import contacts" }).click();

    await expect(importModalDescription(page)).toBeVisible();
  });

  test("forwards importModalChildren into the import modal", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal allowFileImport withImportModalChildren />);

    await page.getByRole("button", { name: "Import contacts" }).click();
    await page.getByRole("menuitem", { name: "Import contacts" }).click();

    await expect(page.getByTestId("import-modal-children")).toBeVisible();
  });

  test("maxImportRows is forwarded to the import modal", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal allowFileImport maxImportRows={1} />);

    await page.getByRole("button", { name: "Import contacts" }).click();
    await page.getByRole("menuitem", { name: "Import contacts" }).click();

    await page.locator('input[type="file"]').setInputFiles({
      name: "contacts.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("alice@example.com,admin\nbob@example.com,viewer"),
    });

    await expect(
      page.locator(".c__file-uploader__dropzone__error"),
    ).toContainText("The file exceeds the maximum of 1 rows.");
    await expect(
      page.getByRole("button", { name: "Import", exact: true }),
    ).toBeDisabled();
  });
});
