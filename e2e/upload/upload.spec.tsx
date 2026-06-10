import { test, expect } from "@playwright/experimental-ct-react";
import { TestUploader, TestUploaderStatic } from "../helpers/mount-upload";

test.describe("FileUploader", () => {
  test("shows the empty dropzone prompt with the max size hint", async ({
    mount,
  }) => {
    const component = await mount(<TestUploader />);
    await expect(component).toContainText("Click to upload");
    await expect(component).toContainText("Max 5 GB");
  });

  test("selecting files adds them to the list", async ({ mount, page }) => {
    const component = await mount(<TestUploader multiple />);

    await component.locator('input[type="file"]').setInputFiles([
      { name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("hi") },
      { name: "photo.png", mimeType: "image/png", buffer: Buffer.from("img") },
    ]);

    const list = page.getByTestId("file-uploader-list");
    await expect(list).toBeVisible();
    await expect(list.getByText("notes.txt")).toBeVisible();
    await expect(list.getByText("photo.png")).toBeVisible();
    await expect(page.getByTestId("file-uploader-item")).toHaveCount(2);
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

    await page
      .getByTestId("file-uploader-list")
      .getByRole("button", { name: "Cancel upload" })
      .click();
    await page.waitForTimeout(100);
    await expect(page.getByTestId("file-uploader-item")).toHaveCount(0);
    expect(fileChooserOpened).toBe(false);
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

  test("single mode shows the file inside the dropzone", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestUploaderStatic
        files={[
          { id: "1", name: "report.pdf", size: 248 * 1024 * 1024, status: "done" },
        ]}
      />,
    );

    const dropzone = page.getByTestId("file-uploader-dropzone");
    await expect(dropzone).toContainText("report.pdf");
    // No separate list in single mode.
    await expect(page.getByTestId("file-uploader-list")).toHaveCount(0);
  });
});
