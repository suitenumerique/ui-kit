import { test, expect } from "@playwright/experimental-ct-react";
import { TestFilePreview } from "../helpers/mount-preview";
import { imageFile } from "../helpers/fixtures";

test.describe("Image Preview", () => {
  test.beforeEach(async ({ mount, page }) => {
    await mount(<TestFilePreview files={[imageFile]} />);
    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });
  });

  test("Displays the image in the ImageViewer", async ({ page }) => {
    const viewer = page.locator(".image-viewer");
    await expect(viewer).toBeVisible();

    const image = viewer.locator("img.image-viewer__image");
    await expect(image).toBeVisible({ timeout: 5000 });

    const src = await image.getAttribute("src");
    expect(src).toBeTruthy();
    expect(src).toMatch(/monet_1/);
  });

  test("Shows the actions menu (more_vert) for image files", async ({
    page,
  }) => {
    const filePreview = page.getByTestId("file-preview");
    const moreVertButton = filePreview.getByText("more_vert").locator("..");
    await expect(moreVertButton).toBeVisible();

    await moreVertButton.click();
    await expect(page.getByRole("menuitem", { name: "Print" })).toBeVisible();
  });

  test("Print action triggers the browser print dialog via a hidden iframe", async ({
    page,
    context,
  }) => {
    await page.evaluate(() => {
      (window as unknown as { __printCalled: boolean }).__printCalled = false;
      const descriptor = Object.getOwnPropertyDescriptor(
        HTMLIFrameElement.prototype,
        "contentWindow",
      );
      Object.defineProperty(HTMLIFrameElement.prototype, "contentWindow", {
        configurable: true,
        get() {
          const win = descriptor?.get?.call(this) as Window | null;
          if (win && !(win as unknown as { __patched?: boolean }).__patched) {
            (win as unknown as { __patched: boolean }).__patched = true;
            win.print = () => {
              (
                window as unknown as { __printCalled: boolean }
              ).__printCalled = true;
            };
          }
          return win;
        },
      });
    });

    const pagesBefore = context.pages().length;

    const previewSrc = await page
      .locator(".image-viewer img.image-viewer__image")
      .getAttribute("src");
    expect(previewSrc).toBeTruthy();

    const filePreview = page.getByTestId("file-preview");
    const moreVertButton = filePreview.getByText("more_vert").locator("..");
    await moreVertButton.click();
    await page.getByRole("menuitem", { name: "Print" }).click();

    const hiddenIframe = page.locator('body > iframe[aria-hidden="true"]');
    await expect(hiddenIframe).toHaveCount(1, { timeout: 5000 });

    const iframeImg = hiddenIframe.contentFrame().locator("img");
    await expect(iframeImg).toHaveAttribute("src", previewSrc!, {
      timeout: 5000,
    });

    await expect
      .poll(
        () =>
          iframeImg.evaluate((img: HTMLImageElement) => img.naturalWidth),
        { timeout: 5000 },
      )
      .toBeGreaterThan(0);

    await expect
      .poll(
        () =>
          page.evaluate(
            () =>
              (window as unknown as { __printCalled: boolean }).__printCalled,
          ),
        { timeout: 5000 },
      )
      .toBe(true);

    expect(context.pages().length).toBe(pagesBefore);
  });

  test("Zoom keyboard shortcuts (+, -, 0) update the image transform", async ({
    page,
  }) => {
    const wrapper = page.locator(".image-viewer__image-wrapper");
    await expect(wrapper).toBeVisible({ timeout: 5000 });

    const container = page.locator(".image-viewer__container");
    await container.focus();

    const initialTransform = await wrapper.evaluate(
      (el) => (el as HTMLElement).style.transform,
    );
    const initialScale = parseFloat(
      initialTransform.match(/scale\(([^)]+)\)/)?.[1] ?? "NaN",
    );
    expect(Number.isFinite(initialScale)).toBe(true);

    await page.keyboard.press("=");
    await expect(async () => {
      const t = await wrapper.evaluate(
        (el) => (el as HTMLElement).style.transform,
      );
      const s = parseFloat(t.match(/scale\(([^)]+)\)/)?.[1] ?? "NaN");
      expect(s).toBeGreaterThan(initialScale);
    }).toPass({ timeout: 5000 });

    await page.keyboard.press("0");
    await expect(async () => {
      const t = await wrapper.evaluate(
        (el) => (el as HTMLElement).style.transform,
      );
      const s = parseFloat(t.match(/scale\(([^)]+)\)/)?.[1] ?? "NaN");
      expect(s).toBeCloseTo(initialScale, 2);
    }).toPass({ timeout: 5000 });
  });

  test("Clicking the image itself does not close the preview", async ({
    page,
  }) => {
    const wrapper = page.locator(".image-viewer__image-wrapper");
    await expect(wrapper).toBeVisible({ timeout: 5000 });

    await wrapper.click();

    await expect(page.getByTestId("file-preview")).toBeVisible();
  });

  test("Dragging across the image viewer does not close the preview", async ({
    page,
  }) => {
    const container = page.locator(".image-viewer__container");
    await expect(container).toBeVisible({ timeout: 5000 });

    const box = await container.boundingBox();
    if (!box) throw new Error("image-viewer__container has no bounding box");

    await page.mouse.move(box.x + 5, box.y + 5);
    await page.mouse.down();
    await page.mouse.move(box.x + 80, box.y + 80, { steps: 5 });
    await page.mouse.up();

    await expect(page.getByTestId("file-preview")).toBeVisible();
  });
});

test.describe("Image Preview - close interactions", () => {
  test("Clicking the blurry backdrop closes the preview", async ({
    mount,
    page,
  }) => {
    let closed = false;
    await mount(
      <TestFilePreview files={[imageFile]} onClose={() => { closed = true; }} />,
    );

    const container = page.locator(".image-viewer__container");
    await expect(container).toBeVisible({ timeout: 5000 });

    await container.click({ position: { x: 5, y: 5 } });

    await expect(async () => {
      expect(closed).toBe(true);
    }).toPass({ timeout: 5000 });
  });
});
