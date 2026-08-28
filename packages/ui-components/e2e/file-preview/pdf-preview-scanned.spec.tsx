import { test, expect } from "@playwright/experimental-ct-react";
import { TestFilePreview } from "../helpers/mount-preview";
import { pdfScannedFile } from "../helpers/fixtures";

// The fixture is a copier scan using MRC compression: each page is a JPEG
// 2000 background plus a JPEG 2000 colour layer stencilled by a JBIG2 text
// mask, then the same mask painted in light grey. pdfjs decodes JPEG 2000
// with a wasm module fetched from `wasmUrl`; when it is unreachable the JPX
// layers are silently skipped and only the faint mask is drawn. A rendered
// page therefore looks "fine" to DOM assertions, so the check is visual.

// The page is rendered 800px wide and is A4 portrait, so a taller viewport
// keeps the whole first page inside the virtualized scroller and the element
// screenshot covers it entirely.
test.use({ viewport: { width: 1280, height: 1300 } });

test.describe("PDF Preview — scanned document", () => {
  // The bitmap comes from pdfjs; the browser only composites the canvas.
  // Chromium rasterizes the same way on macOS and Linux, while WebKit and
  // Firefox use different canvas backends per platform, so the golden is
  // checked on Chromium only.
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "visual golden is Chromium-only",
  );

  test("renders the JPEG 2000 layers of the first page", async ({
    mount,
    page,
  }) => {
    // Decoding three ~4680x3304 layers takes a while, especially on CI.
    test.setTimeout(120_000);

    await mount(<TestFilePreview files={[pdfScannedFile]} />);

    const canvas = page.locator(
      '.pdf-preview__container .react-pdf__Page[data-page-number="1"] canvas',
    );
    await expect(canvas).toBeVisible({ timeout: 10_000 });

    // toHaveScreenshot keeps capturing until the canvas matches the golden,
    // which also absorbs the slow decode. A missing JPX layer changes far
    // more than the tolerance below (text body, grey highlights, background).
    await expect(canvas).toHaveScreenshot("scanned-page-1.png", {
      timeout: 90_000,
      maxDiffPixelRatio: 0.002,
    });
  });
});
