import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/experimental-ct-react";

export async function waitForPdfReady(page: Page) {
  await expect(page.locator(".react-pdf__Page").first()).toBeVisible({
    timeout: 10000,
  });
}

export async function openSidebar(page: Page) {
  const toggle = page.locator('button[aria-label="Toggle sidebar"]');
  await toggle.dispatchEvent("click");
  await expect(page.locator("[data-thumb-page]").first()).toBeVisible({
    timeout: 10000,
  });
}

export async function expectActiveThumbnail(page: Page, pageNum: number) {
  await expect(
    page.locator(`[data-thumb-page="${pageNum}"]`),
  ).toHaveClass(/pdf-preview__thumbnail--active/, { timeout: 10000 });
}

export async function expectInactiveThumbnail(page: Page, pageNum: number) {
  await expect(
    page.locator(`[data-thumb-page="${pageNum}"]`),
  ).not.toHaveClass(/pdf-preview__thumbnail--active/);
}

export async function scrollPdfViewer(page: Page, deltaY: number) {
  const grid = page.locator(
    ".pdf-preview__container .ReactVirtualized__Grid",
  );
  await grid.evaluate((el, dy) => {
    el.scrollTop += dy;
  }, deltaY);
  await page.waitForTimeout(500);
}

export function getPageInput(page: Page): Locator {
  return page.locator('input[aria-label="Current page"]');
}

export function getExternalLink(page: Page): Locator {
  return page
    .locator(
      ".annotationLayer section.linkAnnotation:not([data-internal-link]) a",
    )
    .first();
}

export function getInternalLink(page: Page): Locator {
  return page.locator("[data-internal-link] a").first();
}

export function getDisclaimerModal(page: Page): Locator {
  return page.getByRole("dialog", { name: "External link" });
}

export async function clickExternalLinkAndWaitForModal(page: Page) {
  await getExternalLink(page).click({ force: true });
  const modal = getDisclaimerModal(page);
  await expect(modal).toBeVisible({ timeout: 5000 });
  return modal;
}
