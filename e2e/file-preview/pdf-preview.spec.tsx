import { test, expect } from "@playwright/experimental-ct-react";
import { TestFilePreview } from "../helpers/mount-preview";
import { pdfFile } from "../helpers/fixtures";
import {
  waitForPdfReady,
  openSidebar,
  expectActiveThumbnail,
  expectInactiveThumbnail,
  scrollPdfViewer,
  getPageInput,
} from "../helpers/pdf-helpers";

test.describe("PDF Preview", () => {
  test.beforeEach(async ({ mount, page }) => {
    await mount(<TestFilePreview files={[pdfFile]} />);
    await expect(page.locator(".pdf-preview")).toBeVisible({ timeout: 10000 });
  });

  test("Opens the PDF viewer and renders text content", async ({ page }) => {
    await expect(page.getByTestId("file-preview")).toBeVisible();
    await expect(page.locator(".pdf-preview")).toBeVisible();

    await expect(
      page
        .locator(".textLayer")
        .getByText("PROCÈS VERBAL DU CONSEIL MUNICIPAL")
        .first(),
    ).toBeAttached({ timeout: 10000 });
  });

  test("Displays the correct page count in the controls bar", async ({
    page,
  }) => {
    const pageInput = getPageInput(page);
    await expect(pageInput).toBeVisible();
    await expect(pageInput).toHaveValue("1");

    const pageTotal = page.locator(".pdf-preview__page-total");
    await expect(pageTotal).toBeVisible();
    await expect(pageTotal).toHaveText("/ 9");
  });

  test("Shows the controls bar with all expected buttons", async ({ page }) => {
    const controls = page.locator(".file-preview__controls");
    await expect(controls).toBeVisible();

    await expect(
      controls.locator('button[aria-label="Toggle sidebar"]'),
    ).toBeVisible();

    const zoomButtons = controls.locator(
      ".file-preview__controls__zoom button",
    );
    await expect(zoomButtons).toHaveCount(3);
  });

  test("Zooms in when clicking the zoom-in button", async ({ page }) => {
    const pdfPage = page.locator(".react-pdf__Page").first();
    await waitForPdfReady(page);

    const initialBox = await pdfPage.boundingBox();
    expect(initialBox).toBeTruthy();
    const initialWidth = initialBox!.width;

    const zoomIn = page.locator(
      ".file-preview__controls__zoom button >> nth=2",
    );
    await zoomIn.dispatchEvent("click");

    await expect(async () => {
      const box = await pdfPage.boundingBox();
      expect(box!.width).toBeGreaterThan(initialWidth);
    }).toPass({ timeout: 10000 });
  });

  test("Zooms out when clicking the zoom-out button", async ({ page }) => {
    const pdfPage = page.locator(".react-pdf__Page").first();
    await waitForPdfReady(page);

    const initialBox = await pdfPage.boundingBox();
    const initialWidth = initialBox!.width;

    const zoomIn = page.locator(
      ".file-preview__controls__zoom button >> nth=2",
    );
    const zoomOut = page.locator(
      ".file-preview__controls__zoom button >> nth=0",
    );

    await zoomIn.dispatchEvent("click");
    await expect(async () => {
      const box = await pdfPage.boundingBox();
      expect(box!.width).toBeGreaterThan(initialWidth);
    }).toPass({ timeout: 10000 });

    await zoomOut.dispatchEvent("click");
    await expect(async () => {
      const box = await pdfPage.boundingBox();
      expect(Math.round(box!.width)).toBe(Math.round(initialWidth));
    }).toPass({ timeout: 10000 });
  });

  test("Resets zoom to default when clicking the reset button", async ({
    page,
  }) => {
    const pdfPage = page.locator(".react-pdf__Page").first();
    await waitForPdfReady(page);

    const initialBox = await pdfPage.boundingBox();
    const initialWidth = initialBox!.width;

    const zoomIn = page.locator(
      ".file-preview__controls__zoom button >> nth=2",
    );
    const zoomReset = page.locator(
      ".file-preview__controls__zoom button >> nth=1",
    );

    await zoomIn.dispatchEvent("click");
    await zoomIn.dispatchEvent("click");
    await expect(async () => {
      const box = await pdfPage.boundingBox();
      expect(box!.width).toBeGreaterThan(initialWidth);
    }).toPass({ timeout: 10000 });

    await zoomReset.dispatchEvent("click");
    await expect(async () => {
      const box = await pdfPage.boundingBox();
      expect(Math.round(box!.width)).toBe(Math.round(initialWidth));
    }).toPass({ timeout: 10000 });
  });

  test("Opens and closes the thumbnail sidebar", async ({ page }) => {
    await expect(page.locator(".pdf-preview__sidebar")).not.toBeAttached();

    await openSidebar(page);

    await expect(page.locator(".pdf-preview__sidebar")).toBeVisible();

    const toggle = page.locator('button[aria-label="Toggle sidebar"]');
    await toggle.dispatchEvent("click");

    await expect(page.locator(".pdf-preview__sidebar")).not.toBeAttached({
      timeout: 5000,
    });
  });

  test("Applies pdf-sidebar-open class on the container when the thumbnail sidebar is opened", async ({
    page,
  }) => {
    const container = page.locator(".file-preview__container");

    await expect(container).not.toHaveClass(
      /file-preview__container--pdf-sidebar-open/,
    );

    await openSidebar(page);

    await expect(container).toHaveClass(
      /file-preview__container--pdf-sidebar-open/,
      { timeout: 5000 },
    );

    const toggle = page.locator('button[aria-label="Toggle sidebar"]');
    await toggle.dispatchEvent("click");

    await expect(container).not.toHaveClass(
      /file-preview__container--pdf-sidebar-open/,
      { timeout: 5000 },
    );
  });

  test("Marks the current page thumbnail as active", async ({ page }) => {
    await openSidebar(page);

    await expectActiveThumbnail(page, 1);
    await expectInactiveThumbnail(page, 2);
  });

  test("Navigates to a page when clicking a thumbnail", async ({ page }) => {
    await openSidebar(page);

    await page
      .locator('button[aria-label="Go to page 3"]')
      .dispatchEvent("click");

    const pageInput = getPageInput(page);
    await expect(pageInput).toHaveValue("3", { timeout: 5000 });
    await expectActiveThumbnail(page, 3);
  });

  test("Does not scroll the sidebar when clicking a thumbnail", async ({
    page,
  }) => {
    await openSidebar(page);

    const sidebarGrid = page.locator(
      ".pdf-preview__sidebar .ReactVirtualized__Grid",
    );

    const scrollBefore = await sidebarGrid.evaluate((el) => el.scrollTop);

    await page
      .locator('button[aria-label="Go to page 3"]')
      .dispatchEvent("click");

    await expect(getPageInput(page)).toHaveValue("3", { timeout: 10000 });
    await expectActiveThumbnail(page, 3);

    await page.waitForTimeout(500);

    const scrollAfter = await sidebarGrid.evaluate((el) => el.scrollTop);
    expect(scrollAfter).toBe(scrollBefore);
  });

  test("Updates the active thumbnail when scrolling the document", async ({
    page,
  }) => {
    await openSidebar(page);
    await waitForPdfReady(page);

    await expectActiveThumbnail(page, 1);

    await scrollPdfViewer(page, 3000);

    await expectActiveThumbnail(page, 3);
    await expectInactiveThumbnail(page, 1);
  });

  test("Navigates to a specific page via the page input", async ({ page }) => {
    const pageInput = getPageInput(page);
    await expect(pageInput).toBeVisible();
    await waitForPdfReady(page);

    await pageInput.fill("5");
    await pageInput.press("Enter");

    await expect(pageInput).toHaveValue("5", { timeout: 5000 });
  });

  test("Clamps out-of-range page numbers to valid range", async ({ page }) => {
    const pageInput = getPageInput(page);
    await expect(pageInput).toBeVisible();
    await waitForPdfReady(page);

    await pageInput.fill("99");
    await pageInput.press("Enter");

    await expect(pageInput).toHaveValue("9", { timeout: 5000 });
  });

  test("Resets invalid input to current page on blur", async ({ page }) => {
    const pageInput = getPageInput(page);
    await expect(pageInput).toHaveValue("1");

    await pageInput.fill("abc");
    await pageInput.blur();

    await expect(pageInput).toHaveValue("1", { timeout: 5000 });
  });

  test("Updates page number when scrolling the document", async ({ page }) => {
    const pageInput = getPageInput(page);
    await expect(pageInput).toHaveValue("1");
    await waitForPdfReady(page);

    await scrollPdfViewer(page, 3000);

    await expect(async () => {
      const value = await pageInput.inputValue();
      expect(value).not.toBe("1");
    }).toPass({ timeout: 10000 });
  });

  test("Clicking on a PDF page does not close the preview", async ({
    page,
  }) => {
    await waitForPdfReady(page);

    const pdfPage = page.locator(".react-pdf__Page").first();
    await pdfPage.click({ position: { x: 200, y: 50 } });

    await expect(page.getByTestId("file-preview")).toBeVisible();
  });
});

test.describe("PDF Preview - close interactions", () => {
  test("Clicking the blurry area beside a page closes the preview", async ({
    mount,
    page,
  }) => {
    let closed = false;
    await mount(
      <TestFilePreview files={[pdfFile]} onClose={() => { closed = true; }} />,
    );
    await waitForPdfReady(page);

    const pdfPage = page.locator(".react-pdf__Page").first();
    const box = await pdfPage.boundingBox();
    if (!box) throw new Error(".react-pdf__Page has no bounding box");

    await page.mouse.click(Math.max(1, box.x - 10), box.y + box.height / 2);

    await expect(async () => {
      expect(closed).toBe(true);
    }).toPass({ timeout: 5000 });
  });
});
