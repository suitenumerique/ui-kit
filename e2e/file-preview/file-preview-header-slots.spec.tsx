import { test, expect } from "@playwright/experimental-ct-react";
import { TestFilePreview } from "../helpers/mount-preview";
import { pdfFile, audioFile } from "../helpers/fixtures";

test.describe("File Preview header right slots", () => {
  test("Renders headerRightContentEnd at the end of the right action group", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestFilePreview
        files={[pdfFile]}
        handleDownloadFile={() => {}}
        headerRightContent={
          <span data-testid="header-right-start">start-slot</span>
        }
        headerRightContentEnd={
          <button data-testid="header-right-end" type="button">
            end-slot
          </button>
        }
      />,
    );

    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });

    const startSlot = page.getByTestId("header-right-start");
    const endSlot = page.getByTestId("header-right-end");
    const moreVert = page
      .getByTestId("file-preview")
      .getByText("more_vert")
      .locator("..");

    await expect(startSlot).toBeVisible();
    await expect(endSlot).toBeVisible();
    await expect(moreVert).toBeVisible();

    // The end slot should be the last child of the right action group,
    // sitting after the actions (more_vert) menu — and the start slot
    // should sit before it.
    const right = page.locator(".file-preview__header__content__right");
    const lastChild = right.locator(":scope > *").last();
    const firstChild = right.locator(":scope > *").first();

    await expect(lastChild).toHaveAttribute("data-testid", "header-right-end");
    await expect(firstChild).toHaveAttribute(
      "data-testid",
      "header-right-start",
    );

    // Sanity-check horizontal order: end slot must be to the right of more_vert.
    const endBox = await endSlot.boundingBox();
    const moreVertBox = await moreVert.boundingBox();
    expect(endBox && moreVertBox).toBeTruthy();
    expect(endBox!.x).toBeGreaterThan(moreVertBox!.x);
  });

  test("Renders headerRightContentEnd even when the actions menu is hidden", async ({
    mount,
    page,
  }) => {
    // Audio files don't show the more_vert actions menu — the trailing slot
    // should still render.
    await mount(
      <TestFilePreview
        files={[audioFile]}
        headerRightContentEnd={
          <button data-testid="header-right-end" type="button">
            end-slot
          </button>
        }
      />,
    );

    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });

    const filePreview = page.getByTestId("file-preview");
    await expect(filePreview.getByText("more_vert")).not.toBeVisible();
    await expect(page.getByTestId("header-right-end")).toBeVisible();

    const right = page.locator(".file-preview__header__content__right");
    const lastChild = right.locator(":scope > *").last();
    await expect(lastChild).toHaveAttribute("data-testid", "header-right-end");
  });

  test("Triggers click handlers on nodes passed via headerRightContentEnd", async ({
    mount,
    page,
  }) => {
    let clicks = 0;
    await mount(
      <TestFilePreview
        files={[pdfFile]}
        headerRightContentEnd={
          <button
            type="button"
            data-testid="header-right-end"
            onClick={() => {
              clicks += 1;
            }}
          >
            end-slot
          </button>
        }
      />,
    );

    await expect(page.getByTestId("file-preview")).toBeVisible({
      timeout: 10000,
    });

    await page.getByTestId("header-right-end").click();

    await expect(async () => {
      expect(clicks).toBe(1);
    }).toPass({ timeout: 5000 });
  });
});
