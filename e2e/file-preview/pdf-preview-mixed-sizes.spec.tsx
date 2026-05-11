import { test, expect } from "@playwright/experimental-ct-react";
import type { Page, Locator } from "@playwright/test";
import { TestFilePreview } from "../helpers/mount-preview";
import { pdfMixedFile } from "../helpers/fixtures";
import {
  waitForPdfReady,
  openSidebar,
  getPageInput,
} from "../helpers/pdf-helpers";

const EXPECTED_RATIOS = [
  1.414, 0.707, 1.294, 1.647, 0.707, 1.419, 0.709, 1.545, 1.412, 0.704, 1.0,
  0.286, 4.0, 1.0, 1.414, 1.56, 1.414,
];

function getRenderedPage(page: Page, pageNum: number): Locator {
  return page.locator(
    `.pdf-preview__container .react-pdf__Page[data-page-number="${pageNum}"]`,
  );
}

function getRenderedThumbnail(page: Page, pageNum: number): Locator {
  return page.locator(
    `.pdf-preview__sidebar [data-thumb-page="${pageNum}"] .react-pdf__Thumbnail`,
  );
}

async function goToPage(page: Page, pageNum: number) {
  const pageInput = getPageInput(page);
  await pageInput.fill(String(pageNum));
  await pageInput.press("Enter");
}

async function expectRatio(
  locator: Locator,
  expectedRatio: number,
  tolerance = 0.03,
) {
  await expect(async () => {
    const box = await locator.boundingBox();
    expect(box).toBeTruthy();
    const ratio = box!.height / box!.width;
    expect(Math.abs(ratio - expectedRatio)).toBeLessThanOrEqual(
      Math.max(tolerance, expectedRatio * tolerance),
    );
  }).toPass({ timeout: 10000 });
}

async function expectRenderedRatio(
  page: Page,
  pageNum: number,
  expectedRatio: number,
) {
  await expectRatio(getRenderedPage(page, pageNum), expectedRatio);
}

test.describe("PDF Preview — mixed page sizes", () => {
  test.beforeEach(async ({ mount, page }) => {
    await mount(<TestFilePreview files={[pdfMixedFile]} />);
    await expect(page.locator(".pdf-preview")).toBeVisible({ timeout: 10000 });
    await waitForPdfReady(page);
  });

  test("renders the first page at its actual aspect ratio (A4 portrait)", async ({
    page,
  }) => {
    await expectRenderedRatio(page, 1, EXPECTED_RATIOS[0]);
  });

  test("scrollToPage(2) lands on a landscape page and it renders at its real aspect ratio", async ({
    page,
  }) => {
    const pageInput = getPageInput(page);
    await pageInput.fill("2");
    await pageInput.press("Enter");
    await expect(pageInput).toHaveValue("2", { timeout: 5000 });

    await expectRenderedRatio(page, 2, EXPECTED_RATIOS[1]);

    const landscape = await getRenderedPage(page, 2).boundingBox();
    const portrait = await getRenderedPage(page, 1).boundingBox();
    expect(landscape).toBeTruthy();
    expect(portrait).toBeTruthy();
    expect(Math.abs(landscape!.width - portrait!.width)).toBeLessThanOrEqual(1);
    expect(landscape!.height).toBeLessThan(portrait!.height);
  });

  test("scrollToPage(13) lands on an extreme-ratio page (tall strip)", async ({
    page,
  }) => {
    const pageInput = getPageInput(page);
    await pageInput.fill("13");
    await pageInput.press("Enter");
    await expect(pageInput).toHaveValue("13", { timeout: 5000 });

    await expectRenderedRatio(page, 13, EXPECTED_RATIOS[12]);
  });

  test("thumbnail and main page render at matching per-page aspect ratios", async ({
    page,
  }) => {
    await openSidebar(page);

    const cases = [
      { page: 1, ratio: EXPECTED_RATIOS[0] },
      { page: 2, ratio: EXPECTED_RATIOS[1] },
      { page: 12, ratio: EXPECTED_RATIOS[11] },
      { page: 13, ratio: EXPECTED_RATIOS[12] },
      { page: 14, ratio: EXPECTED_RATIOS[13] },
    ];

    const capturedThumbHeights: Record<number, number> = {};

    for (const c of cases) {
      await goToPage(page, c.page);
      // Don't assert on the page input value — extreme aspect ratios (e.g.
      // page 12 at 0.286) make a neighbouring page occupy the viewport
      // centre, so the input reflects that page rather than the target.
      // Verify the navigation by waiting for the rendered page itself.
      await expect(getRenderedPage(page, c.page)).toBeVisible({
        timeout: 10000,
      });
      await expect(getRenderedThumbnail(page, c.page)).toBeVisible({
        timeout: 10000,
      });
      await expectRenderedRatio(page, c.page, c.ratio);
      await expectRatio(getRenderedThumbnail(page, c.page), c.ratio);
      const box = await getRenderedThumbnail(page, c.page).boundingBox();
      expect(box).toBeTruthy();
      capturedThumbHeights[c.page] = box!.height;
    }

    expect(capturedThumbHeights[1]).toBeGreaterThan(
      capturedThumbHeights[2] * 1.5,
    );
  });

  test("page-input jumps land precisely on target across mixed ratios", async ({
    page,
  }) => {
    const pageInput = getPageInput(page);
    for (const target of [13, 5, 17, 2, 11]) {
      await pageInput.fill(String(target));
      // Wait for React to commit the new pageInputValue before pressing Enter.
      // Without this, on slow CI runners the keydown handler can fire while its
      // closure still holds the previous pageInputValue.
      await expect(pageInput).toHaveAttribute(
        "size",
        String(String(target).length),
      );
      await pageInput.press("Enter");
      await expect(getRenderedPage(page, target)).toBeVisible({
        timeout: 10000,
      });
    }
  });

  test("virtual-list total height matches the sum of per-page heights", async ({
    page,
  }) => {
    const pageInput = getPageInput(page);
    for (const p of [2, 5, 8, 11, 13, 15, 17, 1]) {
      await pageInput.fill(String(p));
      await pageInput.press("Enter");
      await expect(pageInput).toHaveValue(String(p), { timeout: 5000 });
    }

    const firstBox = await getRenderedPage(page, 1).boundingBox();
    expect(firstBox).toBeTruthy();
    const renderedWidth = firstBox!.width;

    const expectedContentHeight = EXPECTED_RATIOS.reduce(
      (sum, r) => sum + renderedWidth * r,
      0,
    );

    const gridInner = page
      .locator(
        ".pdf-preview__container .ReactVirtualized__Grid__innerScrollContainer",
      )
      .first();

    await expect(async () => {
      const h = await gridInner.evaluate((el) =>
        parseFloat(getComputedStyle(el as HTMLElement).height),
      );
      const expectedTotal =
        expectedContentHeight + 16 * (EXPECTED_RATIOS.length + 1);
      expect(Math.abs(h - expectedTotal) / expectedTotal).toBeLessThanOrEqual(
        0.05,
      );
    }).toPass({ timeout: 15000 });
  });
});
