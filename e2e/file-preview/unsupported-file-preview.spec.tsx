import { test, expect } from "@playwright/experimental-ct-react";
import { TestFilePreview } from "../helpers/mount-preview";
import { unsupportedFile } from "../helpers/fixtures";
import type { FilePreviewType } from "../../src/components/preview/types";

test.describe("Unsupported File Preview", () => {
  test.beforeEach(async ({ mount, page }) => {
    await mount(
      <TestFilePreview
        files={[unsupportedFile]}
        handleDownloadFile={() => {}}
      />,
    );
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });
  });

  test("Renders the NotSupportedPreview for an unknown binary file", async ({
    page,
  }) => {
    const unsupported = page.locator(".preview-message");
    await expect(unsupported).toBeVisible();

    await expect(
      unsupported.locator(".preview-message__title"),
    ).toHaveText("test-unsupported.bin");
  });

  test("Hides the actions menu for unsupported files", async ({ page }) => {
    const filePreview = page.getByTestId("file-preview");
    await expect(filePreview.getByText("more_vert")).not.toBeVisible();
  });
});

test.describe("Unsupported File Preview - Download callback", () => {
  test("Download button in the unsupported view triggers handleDownloadFile callback", async ({
    mount,
    page,
  }) => {
    let downloadedFile: FilePreviewType | undefined;
    await mount(
      <TestFilePreview
        files={[unsupportedFile]}
        handleDownloadFile={(file) => { downloadedFile = file; }}
      />,
    );
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });

    const downloadButton = page
      .locator(".preview-message__action")
      .getByRole("button");
    await expect(downloadButton).toBeVisible();

    await downloadButton.click();

    await expect(async () => {
      expect(downloadedFile).toBeDefined();
      expect(downloadedFile!.title).toContain("test-unsupported");
    }).toPass({ timeout: 5000 });
  });
});
