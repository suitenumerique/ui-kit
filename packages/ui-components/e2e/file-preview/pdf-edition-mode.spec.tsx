import { test, expect } from "@playwright/experimental-ct-react";
import { TestFilePreview } from "../helpers/mount-preview";
import { pdfFile } from "../helpers/fixtures";
import { waitForPdfReady } from "../helpers/pdf-helpers";

// FilePreview lazy-loads PdfEditor: the editor code is a separate chunk,
// fetched the first time the edition mode is turned on.
const EDITOR_CHUNK = /\/PdfEditor-[\w-]+\.js$/;

test.describe("PDF edition mode", () => {
  test("Keeps the preview on screen while the editor code loads", async ({
    mount,
    page,
  }) => {
    // Hold the editor's lazy chunk until the test releases it: on a test
    // machine it arrives too fast to tell the two behaviours apart.
    let release!: () => void;
    const released = new Promise<void>((resolve) => (release = resolve));
    await page.route(EDITOR_CHUNK, async (route) => {
      await released;
      await route.continue();
    });

    await mount(<TestFilePreview files={[pdfFile]} />);
    await waitForPdfReady(page);

    const chunkRequested = page.waitForRequest(EDITOR_CHUNK);
    await page.getByRole("button", { name: "Edit" }).click();
    await chunkRequested;

    // The toggle runs in a transition, so React keeps the preview until the
    // editor is ready. Without it, Suspense would show its empty fallback.
    await expect(page.locator(".pdf-preview")).toBeVisible();

    release();
    await expect(
      page.locator(".pdfViewer .page canvas").first(),
    ).toBeVisible({ timeout: 10000 });
    await expect(page.locator(".pdf-preview")).not.toBeAttached();
  });
});
