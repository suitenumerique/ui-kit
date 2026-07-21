import { test, expect } from "@playwright/experimental-ct-react";
import { TestFilePreview } from "../helpers/mount-preview";
import { pdfCorruptedFile, pdfFile } from "../helpers/fixtures";

test.describe("PDF Error Handling", () => {
  test("Displays an error message when opening a corrupted PDF", async ({
    mount,
    page,
  }) => {
    await mount(<TestFilePreview files={[pdfCorruptedFile]} />);

    const errorContainer = page.locator(".file-preview-unsupported");
    await expect(errorContainer).toBeVisible({ timeout: 15000 });

    await expect(errorContainer).toContainText(
      "An error occurred while loading the document.",
    );
    await expect(errorContainer).toContainText(
      "You can contact the support for help.",
    );
  });
});

test.describe("PDF Outdated Browser", () => {
  test("Shows outdated browser error when the PDF worker fails to initialize", async ({
    mount,
    page,
  }) => {
    await page.route("**/pdf.worker.mjs", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: "throw new Error('Simulated worker init failure');",
      }),
    );

    await mount(<TestFilePreview files={[pdfFile]} />);

    const errorContainer = page.locator(".file-preview-unsupported");
    await expect(errorContainer).toBeVisible({ timeout: 15000 });

    await expect(errorContainer).toContainText(
      "Your browser is not supported",
    );
    await expect(errorContainer).toContainText(
      "For security reasons, the PDF viewer requires a recent browser",
    );

    await expect(page.locator(".file-preview__controls")).not.toBeAttached();
  });
});
