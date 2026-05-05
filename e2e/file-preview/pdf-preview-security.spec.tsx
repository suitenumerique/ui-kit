import { test, expect } from "@playwright/experimental-ct-react";
import { TestFilePreview } from "../helpers/mount-preview";
import { pdfJsFile, pdfJsLinkFile } from "../helpers/fixtures";
import { waitForPdfReady, getDisclaimerModal } from "../helpers/pdf-helpers";

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

    await page.evaluate(() => {
      const annotLayer = document.querySelector(".annotationLayer");
      if (!annotLayer) return;
      const section = document.createElement("section");
      section.className = "linkAnnotation";
      const a = document.createElement("a");
      a.href = "javascript:alert('xss')";
      a.textContent = "injected";
      a.style.cssText =
        "position:absolute;top:0;left:0;width:50px;height:20px;";
      section.appendChild(a);
      annotLayer.appendChild(section);
    });

    const injectedLink = page
      .locator(".annotationLayer section.linkAnnotation a")
      .first();
    // Dispatch via the DOM API: react-pdf can re-render the annotation layer
    // and detach the injected anchor between Playwright's actionability check
    // and the synthesized click, which makes the firefox project flake.
    await injectedLink.dispatchEvent("click");

    await expect(getDisclaimerModal(page)).not.toBeAttached({ timeout: 2000 });

    await page.waitForTimeout(2000);
    expect(alertFired).toBe(false);

    await expect(page.locator(".pdf-preview")).toBeVisible();
  });
});
