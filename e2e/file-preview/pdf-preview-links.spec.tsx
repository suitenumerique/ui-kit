import { test, expect } from "@playwright/experimental-ct-react";
import { TestFilePreview } from "../helpers/mount-preview";
import { pdfLinksFile } from "../helpers/fixtures";
import {
  waitForPdfReady,
  getInternalLink,
  getDisclaimerModal,
  clickExternalLinkAndWaitForModal,
  getPageInput,
} from "../helpers/pdf-helpers";

test.describe("PDF Links", () => {
  test.beforeEach(async ({ mount, page }) => {
    await mount(<TestFilePreview files={[pdfLinksFile]} />);
    await expect(page.locator(".pdf-preview")).toBeVisible({ timeout: 10000 });
    await waitForPdfReady(page);
  });

  test("Shows a disclaimer modal when clicking an external link", async ({
    page,
  }) => {
    const modal = await clickExternalLinkAndWaitForModal(page);

    await expect(modal.locator(".c__modal__title")).toHaveText("External link");
    await expect(modal.locator(".pdf-preview__external-link")).toContainText(
      "example.com",
    );
    await expect(modal).toContainText("Do you want to continue?");
  });

  test("Opens external link in a new tab when confirming", async ({
    page,
    context,
  }) => {
    const modal = await clickExternalLinkAndWaitForModal(page);

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      modal.getByRole("button", { name: "Yes" }).click(),
    ]);

    expect(newPage.url()).toContain("example.com");
    await newPage.close();
  });

  test("Does not open a new tab when declining the disclaimer", async ({
    page,
  }) => {
    const modal = await clickExternalLinkAndWaitForModal(page);

    await modal.getByRole("button", { name: "Cancel" }).click();

    await expect(modal).not.toBeAttached({ timeout: 5000 });
    await expect(page.locator(".pdf-preview")).toBeVisible();
  });

  test("Navigates to target page via an internal link without disclaimer", async ({
    page,
  }) => {
    await getInternalLink(page).click({ force: true });

    await expect(getDisclaimerModal(page)).not.toBeAttached({ timeout: 2000 });
    await expect(getPageInput(page)).toHaveValue("3", { timeout: 5000 });
  });
});
