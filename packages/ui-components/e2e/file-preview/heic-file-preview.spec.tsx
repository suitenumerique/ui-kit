import { test, expect } from "@playwright/experimental-ct-react";
import { TestFilePreview } from "../helpers/mount-preview";
import { heicFile } from "../helpers/fixtures";

test("Display HEIC not supported message when opening a HEIC file", async ({
  mount,
  page,
}) => {
  await mount(<TestFilePreview files={[heicFile]} />);

  const filePreview = page.getByTestId("file-preview");
  await expect(filePreview).toBeVisible({ timeout: 10000 });

  await expect(
    filePreview.getByText("HEIC files are not yet supported for preview."),
  ).toBeVisible();
});
