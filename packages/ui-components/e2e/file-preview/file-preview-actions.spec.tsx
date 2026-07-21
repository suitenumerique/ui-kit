import { test, expect } from "@playwright/experimental-ct-react";
import { TestFilePreview } from "../helpers/mount-preview";
import { pdfFile, audioFile, unsupportedFile } from "../helpers/fixtures";
import type { FilePreviewType } from "../../src/components/preview/types";

test.describe("File Preview Actions Menu", () => {
  test.beforeEach(async ({ mount, page }) => {
    await mount(
      <TestFilePreview files={[pdfFile]} handleDownloadFile={() => {}} />,
    );
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });
  });

  test("Shows the actions dropdown with download and print options", async ({
    page,
  }) => {
    const filePreview = page.getByTestId("file-preview");
    const moreVertButton = filePreview.getByText("more_horiz").locator("..");
    await expect(moreVertButton).toBeVisible();
    await moreVertButton.click();

    await expect(
      page.getByRole("menuitem", { name: "Download" }),
    ).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Print" })).toBeVisible();
  });

  test("Print action in dropdown opens the file in a new tab", async ({
    page,
    context,
  }) => {
    const filePreview = page.getByTestId("file-preview");
    const moreVertButton = filePreview.getByText("more_horiz").locator("..");
    await moreVertButton.click();

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("menuitem", { name: "Print" }).click(),
    ]);

    expect(newPage).toBeTruthy();
    await newPage.close();
  });

  test("Updates the browser tab title when preview is open", async ({
    page,
  }) => {
    await expect(page).toHaveTitle(/pv_cm\.pdf/);
  });
});

test.describe("File Preview Actions Menu - Download callback", () => {
  test("Download action in dropdown triggers handleDownloadFile callback", async ({
    mount,
    page,
  }) => {
    let downloadedFile: FilePreviewType | undefined;
    await mount(
      <TestFilePreview
        files={[pdfFile]}
        handleDownloadFile={(file) => {
          downloadedFile = file;
        }}
      />,
    );
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });

    const filePreview = page.getByTestId("file-preview");
    const moreVertButton = filePreview.getByText("more_horiz").locator("..");
    await moreVertButton.click();

    await page.getByRole("menuitem", { name: "Download" }).click();

    await expect(async () => {
      expect(downloadedFile).toBeDefined();
      expect(downloadedFile!.title).toContain("pv_cm");
    }).toPass({ timeout: 5000 });
  });
});

test.describe("File Preview Actions Menu - Non-printable file", () => {
  test("Hides the actions menu for non-PDF/non-image files", async ({
    mount,
    page,
  }) => {
    await mount(<TestFilePreview files={[audioFile]} />);
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });

    const filePreview = page.getByTestId("file-preview");
    await expect(filePreview.getByText("more_horiz")).not.toBeVisible();
  });
});

test.describe("File Preview customHeaderActions", () => {
  test("Renders custom content alongside the built-in header actions", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestFilePreview
        files={[pdfFile]}
        handleDownloadFile={() => {}}
        customHeaderActionsMode="wrap"
      />,
    );
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId("custom-before")).toBeVisible();
    await expect(page.getByTestId("custom-after")).toBeVisible();

    const filePreview = page.getByTestId("file-preview");
    await expect(filePreview.getByText("info_outline")).toBeVisible();
    await expect(filePreview.getByText("more_horiz")).toBeVisible();
    await expect(filePreview.getByText("file_download")).toBeVisible();
  });

  test("Replaces the built-in header actions when the wrapper omits them", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestFilePreview
        files={[pdfFile]}
        handleDownloadFile={() => {}}
        customHeaderActionsMode="replace"
      />,
    );
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId("custom-only")).toBeVisible();

    const filePreview = page.getByTestId("file-preview");
    await expect(filePreview.getByText("info_outline")).not.toBeVisible();
    await expect(filePreview.getByText("more_horiz")).not.toBeVisible();
  });
});

test.describe("File Preview headerActionsMenuOptions", () => {
  test("Appends the custom entries after the built-in options", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestFilePreview
        files={[pdfFile]}
        handleDownloadFile={() => {}}
        extraMenuOptions={[
          { id: "copy-link", label: "Copy link" },
          { id: "delete", label: "Delete", variant: "danger" },
        ]}
      />,
    );
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });

    const filePreview = page.getByTestId("file-preview");
    const moreVertButton = filePreview.getByText("more_horiz").locator("..");
    await moreVertButton.click();

    const items = page.getByRole("menuitem");
    await expect(items).toHaveCount(4);
    await expect(items.nth(0)).toHaveText(/Download/);
    await expect(items.nth(1)).toHaveText(/Print/);
    await expect(items.nth(2)).toHaveText(/Copy link/);
    await expect(items.nth(3)).toHaveText(/Delete/);
  });
});

test.describe("File Preview Header", () => {
  test("Closes the preview when the close button is clicked", async ({
    mount,
    page,
  }) => {
    let closed = false;
    await mount(
      <TestFilePreview
        files={[pdfFile]}
        onClose={() => {
          closed = true;
        }}
      />,
    );
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });

    const filePreview = page.getByTestId("file-preview");
    const closeButton = filePreview.locator(
      ".file-preview__header__content__left button",
    );
    await closeButton.click();

    await expect(async () => {
      expect(closed).toBe(true);
    }).toPass({ timeout: 5000 });
  });

  test("Toggles the info sidebar on and off", async ({ mount, page }) => {
    await mount(<TestFilePreview files={[pdfFile]} />);
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });

    const container = page.locator(".file-preview__container");
    const sidebar = page.locator(".file-preview-sidebar");

    await expect(container).not.toHaveClass(
      /file-preview__container--sidebar-open/,
    );
    await expect(sidebar).not.toHaveClass(/(^|\s)open(\s|$)/);

    const filePreview = page.getByTestId("file-preview");
    const infoButton = filePreview.getByText("info_outline").locator("..");
    await infoButton.click();

    await expect(container).toHaveClass(
      /file-preview__container--sidebar-open/,
      { timeout: 5000 },
    );
    await expect(sidebar).toHaveClass(/(^|\s)open(\s|$)/);

    await infoButton.click();

    await expect(container).not.toHaveClass(
      /file-preview__container--sidebar-open/,
      { timeout: 5000 },
    );
    await expect(sidebar).not.toHaveClass(/(^|\s)open(\s|$)/);
  });
});

test.describe("File Preview Navigation", () => {
  test("Navigates between files with the prev/next buttons", async ({
    mount,
    page,
  }) => {
    await mount(<TestFilePreview files={[pdfFile, unsupportedFile]} />);
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });

    const filePreview = page.getByTestId("file-preview");
    const title = filePreview.locator("h1.file-preview__title");
    const nextButton = page.locator(".file-preview__next-button button");
    const prevButton = page.locator(".file-preview__previous-button button");

    await expect(title).toHaveText("pv_cm");

    const nextDisabled = await nextButton.isDisabled();
    const prevDisabled = await prevButton.isDisabled();
    expect(nextDisabled).not.toBe(prevDisabled);

    if (!nextDisabled) {
      await nextButton.click();
    } else {
      await prevButton.click();
    }
    await expect(title).toHaveText("test-unsupported.bin");

    if (!nextDisabled) {
      await expect(nextButton).toBeDisabled();
      await expect(prevButton).toBeEnabled();
    } else {
      await expect(prevButton).toBeDisabled();
      await expect(nextButton).toBeEnabled();
    }
  });

  test("Navigates between files with ArrowLeft/ArrowRight keys", async ({
    mount,
    page,
  }) => {
    await mount(<TestFilePreview files={[pdfFile, unsupportedFile]} />);
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });

    const filePreview = page.getByTestId("file-preview");
    const title = filePreview.locator("h1.file-preview__title");
    const nextButton = page.locator(".file-preview__next-button button");

    await expect(title).toHaveText("pv_cm");

    const nextDisabled = await nextButton.isDisabled();
    const forwardKey = nextDisabled ? "ArrowLeft" : "ArrowRight";
    const backwardKey = nextDisabled ? "ArrowRight" : "ArrowLeft";

    await page.keyboard.press(forwardKey);
    await expect(title).toHaveText("test-unsupported.bin");

    await page.keyboard.press(backwardKey);
    await expect(title).toHaveText("pv_cm");
  });

  test("Does not navigate files when arrow keys are pressed inside the PDF page input", async ({
    mount,
    page,
  }) => {
    await mount(<TestFilePreview files={[pdfFile, unsupportedFile]} />);
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });

    const filePreview = page.getByTestId("file-preview");
    const title = filePreview.locator("h1.file-preview__title");

    await expect(title).toHaveText("pv_cm");

    await expect(page.locator(".react-pdf__Page").first()).toBeVisible({
      timeout: 10000,
    });

    const pageInput = page.locator('input[aria-label="Current page"]');
    await expect(pageInput).toBeVisible({ timeout: 10000 });
    await pageInput.focus();

    await page.keyboard.press("ArrowRight");
    await expect(title).toHaveText("pv_cm");

    await page.keyboard.press("ArrowLeft");
    await expect(title).toHaveText("pv_cm");
  });
});
