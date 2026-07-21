import { test, expect } from "@playwright/experimental-ct-react";
import {
  TestUploader,
  TestUploaderModal,
  TestUploaderStatic,
} from "../helpers/mount-upload";

test.describe("FileUploader", () => {
  test("shows the empty dropzone prompt with the max size hint", async ({
    mount,
  }) => {
    const component = await mount(<TestUploader />);
    await expect(component).toContainText("Click to upload");
    await expect(component).toContainText("Max 5 GB");
  });

  test("forwards the form name to the native file input", async ({ mount }) => {
    const component = await mount(<TestUploader name="attachments" />);
    await expect(component.locator('input[type="file"]')).toHaveAttribute(
      "name",
      "attachments",
    );
  });

  test("selecting files adds them to the list", async ({ mount, page }) => {
    const component = await mount(
      <TestUploader
        multiple
        initialFiles={[
          { id: "existing", name: "existing.pdf", status: "done" },
        ]}
      />,
    );

    await component.locator('input[type="file"]').setInputFiles([
      { name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("hi") },
      { name: "photo.png", mimeType: "image/png", buffer: Buffer.from("img") },
    ]);

    const list = page.getByTestId("file-uploader-list");
    await expect(list).toBeVisible();
    await expect(list.getByText("existing.pdf")).toBeVisible();
    await expect(list.getByText("notes.txt")).toBeVisible();
    await expect(list.getByText("photo.png")).toBeVisible();
    await expect(page.getByTestId("file-uploader-item")).toHaveCount(3);
    await expect(list.locator(".c__file-uploader__item--pending")).toHaveCount(2);
    await expect(
      list.locator(".c__file-uploader__item__status--done"),
    ).toHaveCount(1);
  });

  test("removing a file takes it out of the list", async ({ mount, page }) => {
    const component = await mount(
      <TestUploader
        multiple
        initialFiles={[
          { id: "1", name: "keep.txt", size: 10, status: "done" },
          { id: "2", name: "drop.txt", size: 10, status: "done" },
        ]}
      />,
    );

    await expect(page.getByTestId("file-uploader-item")).toHaveCount(2);
    const list = page.getByTestId("file-uploader-list");
    let fileChooserOpened = false;
    page.on("filechooser", () => {
      fileChooserOpened = true;
    });
    await list.getByText("drop.txt").hover();
    await list.getByRole("button", { name: "Delete drop.txt" }).click();
    await page.waitForTimeout(100);
    await expect(page.getByTestId("file-uploader-item")).toHaveCount(1);
    await expect(component).toContainText("keep.txt");
    await expect(component).not.toContainText("drop.txt");
    expect(fileChooserOpened).toBe(false);
  });

  test("canceling an upload does not open the file picker", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestUploader
        multiple
        cancelUploads
        initialFiles={[{ id: "1", name: "uploading.png", status: "uploading" }]}
      />,
    );

    let fileChooserOpened = false;
    page.on("filechooser", () => {
      fileChooserOpened = true;
    });

    await page.getByText("uploading.png – Uploading").hover();
    await page
      .getByTestId("file-uploader-list")
      .getByRole("button", { name: "Cancel upload" })
      .click();
    await page.waitForTimeout(100);
    await expect(page.getByTestId("file-uploader-item")).toHaveCount(0);
    expect(fileChooserOpened).toBe(false);
  });

  test("keeps the modal and populated dropzone the same size during drag hover", async ({
    mount,
    page,
  }) => {
    await mount(<TestUploaderModal />);

    const modal = page.getByRole("dialog");
    const dropzone = page.getByTestId("file-uploader-dropzone");
    const modalBefore = await modal.boundingBox();
    const dropzoneBefore = await dropzone.boundingBox();

    await dropzone.dispatchEvent("dragover");
    await expect(dropzone).toHaveClass(/c__file-uploader__dropzone--dragging/);

    const modalDuringDrag = await modal.boundingBox();
    const dropzoneDuringDrag = await dropzone.boundingBox();

    expect(modalDuringDrag?.width).toBe(modalBefore?.width);
    expect(modalDuringDrag?.height).toBe(modalBefore?.height);
    expect(dropzoneDuringDrag?.width).toBe(dropzoneBefore?.width);
    expect(dropzoneDuringDrag?.height).toBe(dropzoneBefore?.height);
  });

  test("multiple mode renders uploading and error states", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestUploaderStatic
        multiple
        files={[
          { id: "1", name: "uploading.png", status: "uploading" },
          {
            id: "2",
            name: "broken.pdf",
            status: "error",
            error: "An error occurred",
          },
        ]}
      />,
    );

    await expect(page.getByText("uploading.png – Uploading")).toBeVisible();
    await expect(page.getByText("An error occurred")).toBeVisible();
  });

  test("does not mount error details when none are provided", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestUploaderStatic
        multiple
        files={[
          {
            id: "1",
            name: "broken.pdf",
            status: "error",
            error: "An error occurred",
          },
        ]}
      />,
    );

    const item = page.getByTestId("file-uploader-item");
    await expect(
      item.locator(".c__file-uploader__item__status--error"),
    ).toBeVisible();
    await item.locator(".c__file-uploader__item__status--error").hover();
    await expect(page.getByRole("tooltip")).toHaveCount(0);
  });

  test("shows optional error details from the icon only when provided", async ({
    mount,
    page,
  }) => {
    const details = "The upload was rejected by the server.";
    await mount(
      <TestUploaderStatic
        multiple
        files={[
          {
            id: "1",
            name: "broken.pdf",
            status: "error",
            error: "An error occurred",
            errorDetails: details,
          },
        ]}
      />,
    );

    const trigger = page
      .getByTestId("file-uploader-item")
      .getByRole("button", { name: details });
    await expect(trigger).toBeVisible();
    await expect(page.getByRole("tooltip")).toHaveCount(0);

    await page.mouse.move(0, 0);
    await trigger.hover();

    const tooltip = page.getByRole("tooltip");
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText(details);
  });

  test("single mode shows the file inside the dropzone", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestUploaderStatic
        files={[
          {
            id: "1",
            name: "report.pdf",
            size: 248 * 1000 * 1000,
            status: "done",
          },
        ]}
      />,
    );

    const dropzone = page.getByTestId("file-uploader-dropzone");
    await expect(dropzone).toContainText("report.pdf");
    // No separate list in single mode.
    await expect(page.getByTestId("file-uploader-list")).toHaveCount(0);
  });
});
