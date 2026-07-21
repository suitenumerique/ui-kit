import { test, expect } from "@playwright/experimental-ct-react";
import { TestFilePreview } from "../helpers/mount-preview";
import { pdfJsFile, pdfJsLinkFile } from "../helpers/fixtures";
import { waitForPdfReady } from "../helpers/pdf-helpers";

test.describe("PDF Security", () => {
  test("Does not execute JavaScript embedded in a PDF OpenAction", async ({
    mount,
    page,
  }) => {
    let alertFired = false;
    page.on("dialog", () => {
      alertFired = true;
    });

    await mount(<TestFilePreview files={[pdfJsFile]} />);
    await expect(page.locator(".pdf-preview")).toBeVisible({ timeout: 10000 });
    await waitForPdfReady(page);

    await page.waitForTimeout(1000);

    expect(alertFired).toBe(false);
    await expect(page.locator(".pdf-preview")).toBeVisible();
  });
});

test.describe("PDF Security — javascript: URI link", () => {
  test("Blocks javascript: URI links and does not show disclaimer modal", async ({
    mount,
    page,
  }) => {
    let alertFired = false;
    page.on("dialog", async (dialog) => {
      alertFired = true;
      await dialog.dismiss();
    });

    await mount(<TestFilePreview files={[pdfJsLinkFile]} />);
    await expect(page.locator(".pdf-preview")).toBeVisible({ timeout: 10000 });
    await waitForPdfReady(page);

    const annotationLinks = page.locator(
      ".annotationLayer section.linkAnnotation a",
    );
    await expect(annotationLinks).toHaveCount(0, { timeout: 5000 });

    expect(alertFired).toBe(false);
  });
});
