import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { fileURLToPath } from "url";
import { TestShareImportModal } from "../helpers/mount-share-import-modal";

const fileInput = (page: Page) => page.locator('input[type="file"]');
// Parsed-rows feedback is displayed as the uploader description.
const parsedRowsInfo = (page: Page) =>
  page.locator(".c__file-uploader__dropzone__description");
// Parse errors are displayed inline on the file, in the uploader dropzone.
const fileError = (page: Page) =>
  page.locator(".c__file-uploader__dropzone__error");
const importButton = (page: Page) =>
  page.getByRole("button", { name: "Import", exact: true });

const uploadCsv = (page: Page, content: string, name = "contacts.csv") =>
  fileInput(page).setInputFiles({
    name,
    mimeType: "text/csv",
    buffer: Buffer.from(content),
  });

const calls = (page: Page) =>
  page.evaluate(() => window.__shareImportCalls ?? []);

test.describe("ShareImportModal", () => {
  test("renders the default texts and actions", async ({ mount, page }) => {
    await mount(<TestShareImportModal />);

    await expect(page.getByText("Import contacts")).toBeVisible();
    await expect(
      page.getByText(
        "Upload a CSV or XLSX file with your contacts, or start from our template.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Download template" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
    await expect(importButton(page)).toBeDisabled();
  });

  test("overrides the title and description when provided", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestShareImportModal
        title="Custom title"
        description="Custom description"
      />,
    );

    await expect(page.getByText("Custom title")).toBeVisible();
    await expect(page.getByText("Custom description")).toBeVisible();
  });

  test("parses a comma-separated CSV and imports its rows", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareImportModal />);

    await uploadCsv(
      page,
      "alice@example.com,admin\nbob@example.com,viewer",
    );

    await expect(parsedRowsInfo(page)).toContainText(
      "2 rows ready to be imported.",
    );
    await expect(importButton(page)).toBeEnabled();

    await importButton(page).click();

    expect(await calls(page)).toEqual([
      {
        name: "import",
        rows: [
          { email: "alice@example.com", role: "admin" },
          { email: "bob@example.com", role: "viewer" },
        ],
      },
    ]);
  });

  test("hides the parse alerts once the import is requested", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareImportModal />);

    await uploadCsv(page, "alice@example.com,admin");
    await expect(parsedRowsInfo(page)).toBeVisible();

    await importButton(page).click();

    await expect(parsedRowsInfo(page)).toHaveCount(0);
    await expect(fileError(page)).toHaveCount(0);

    // Selecting a new file resets the import attempt and its alerts.
    await uploadCsv(page, "bob@example.com,viewer");
    await expect(parsedRowsInfo(page)).toContainText("1 row ready to be imported.");
  });

  test("parses a semicolon-separated CSV", async ({ mount, page }) => {
    await mount(<TestShareImportModal />);

    await uploadCsv(page, "alice@example.com;admin");

    await expect(parsedRowsInfo(page)).toContainText("1 row ready to be imported.");
  });

  test("parses an XLSX file", async ({ mount, page }) => {
    await mount(<TestShareImportModal />);

    await fileInput(page).setInputFiles(
      fileURLToPath(new URL("./fixtures/contacts.xlsx", import.meta.url)),
    );

    await expect(parsedRowsInfo(page)).toContainText(
      "2 rows ready to be imported.",
    );
  });

  test("rejects a file with an invalid extension", async ({ mount, page }) => {
    await mount(<TestShareImportModal />);

    await fileInput(page).setInputFiles({
      name: "contacts.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("alice@example.com,admin"),
    });

    await expect(fileError(page)).toContainText(
      "Only CSV or XLSX files are allowed.",
    );
    await expect(importButton(page)).toBeDisabled();
  });

  test("rejects a file with a malformed row and reports its number", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareImportModal />);

    await uploadCsv(page, "alice@example.com,admin\nbob@example.com");

    await expect(fileError(page)).toContainText(
      "Row 2 is invalid: two columns are expected (email, role).",
    );
    await expect(importButton(page)).toBeDisabled();
  });

  test("rejects an empty file", async ({ mount, page }) => {
    await mount(<TestShareImportModal />);

    await uploadCsv(page, "\n\n");

    await expect(fileError(page)).toContainText(
      "The file contains no rows.",
    );
    await expect(importButton(page)).toBeDisabled();
  });

  test("rejects a file larger than 200 KB", async ({ mount, page }) => {
    await mount(<TestShareImportModal />);

    await uploadCsv(page, "a".repeat(200 * 1024 + 1));

    await expect(fileError(page)).toContainText(
      "The file exceeds the maximum size of 200 KB.",
    );
    await expect(importButton(page)).toBeDisabled();
  });

  test("rejects a file with more rows than the default maximum of 100", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareImportModal />);

    const rows = Array.from(
      { length: 101 },
      (_, index) => `user.${index}@example.com,admin`,
    );
    await uploadCsv(page, rows.join("\n"));

    await expect(fileError(page)).toContainText(
      "The file exceeds the maximum of 100 rows.",
    );
    await expect(importButton(page)).toBeDisabled();
  });

  test("honors a custom maxRows limit", async ({ mount, page }) => {
    await mount(<TestShareImportModal maxRows={1} />);

    await uploadCsv(
      page,
      "alice@example.com,admin\nbob@example.com,viewer",
    );

    await expect(fileError(page)).toContainText(
      "The file exceeds the maximum of 1 rows.",
    );
    await expect(importButton(page)).toBeDisabled();
  });

  test("clears the alerts when the file is deleted", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareImportModal />);

    await uploadCsv(page, "alice@example.com,admin");
    await expect(parsedRowsInfo(page)).toBeVisible();

    // The dropzone is itself a button whose name contains "Delete", so
    // scope the locator to the inner control.
    await page
      .getByTestId("file-uploader-dropzone")
      .getByRole("button", { name: "Delete" })
      .click();

    await expect(parsedRowsInfo(page)).toHaveCount(0);
    await expect(fileError(page)).toHaveCount(0);
    await expect(importButton(page)).toBeDisabled();
  });

  test("invokes onClose when cancel is pressed", async ({ mount, page }) => {
    await mount(<TestShareImportModal />);

    await page.getByRole("button", { name: "Cancel" }).click();

    expect(await calls(page)).toEqual([{ name: "close" }]);
  });

  test("invokes onDownloadTemplate when provided", async ({ mount, page }) => {
    await mount(<TestShareImportModal withDownloadTemplate />);

    await page.getByRole("button", { name: "Download template" }).click();

    expect(await calls(page)).toEqual([{ name: "download-template" }]);
  });

  test("downloads the bundled template by default", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareImportModal />);

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download template" }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe("contacts.csv");
  });
});
