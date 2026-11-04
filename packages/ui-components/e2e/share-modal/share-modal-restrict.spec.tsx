import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestShareModal } from "../helpers/mount-share-modal";

const openConfirmation = async (page: Page, title: string) => {
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByRole("menuitem", { name: title, exact: true }).click();
  return page.getByRole("dialog", { name: title, exact: true });
};

const scenarios = [
  {
    action: "restrict",
    title: "Restrict access",
    isRestricted: false,
    confirmation: "Access inherited from the parent item will be removed.",
    details:
      "People added directly to this item will keep their access. Access can be restored for others at any time.",
  },
  {
    action: "unrestrict",
    title: "Expand access",
    isRestricted: true,
    confirmation: "Everyone with access to the parent item will have access.",
    details: "People added directly will keep their access.",
  },
];

for (const scenario of scenarios) {
  test.describe(scenario.title, () => {
    test("changes access only after confirmation", async ({ mount, page }) => {
      await mount(
        <TestShareModal
          allowFileImport
          canRestrict
          isRestricted={scenario.isRestricted}
        />,
      );
      const modal = await openConfirmation(page, scenario.title);
      // The consequence is emphasized, the details follow in the same paragraph.
      await expect(modal.locator("strong")).toHaveText(scenario.confirmation);
      await expect(modal).toContainText(scenario.details);
      expect(await page.evaluate(() => window.__shareModalCalls)).toEqual([]);
      await modal
        .getByRole("button", { name: scenario.title, exact: true })
        .click();
      await expect(modal).toHaveCount(0);
      expect(await page.evaluate(() => window.__shareModalCalls)).toEqual([
        { name: scenario.action },
      ]);
      await expect(
        page.getByText("This item has restricted access"),
      ).toHaveCount(scenario.isRestricted ? 0 : 1);

      // Reopening the menu must offer the opposite action and its own copy.
      const opposite = scenarios.find(
        ({ action }) => action !== scenario.action,
      )!;
      const nextModal = await openConfirmation(page, opposite.title);
      await expect(nextModal).toContainText(opposite.confirmation);
      await nextModal
        .getByRole("button", { name: opposite.title, exact: true })
        .click();
      expect(await page.evaluate(() => window.__shareModalCalls)).toEqual([
        { name: scenario.action },
        { name: opposite.action },
      ]);
    });

    test("cancel, close and Escape dismiss without changing access", async ({
      mount,
      page,
    }) => {
      await mount(
        <TestShareModal
          allowFileImport
          canRestrict
          isRestricted={scenario.isRestricted}
        />,
      );
      for (const action of ["Cancel", "Close", "Escape"]) {
        const modal = await openConfirmation(page, scenario.title);
        await expect(modal).toContainText(scenario.confirmation);
        if (action === "Escape") {
          await page.keyboard.press("Escape");
        } else {
          await modal
            .getByRole("button", { name: action, exact: true })
            .click();
        }
        await expect(modal).toHaveCount(0);
        await expect(
          page.getByRole("button", { name: "More actions" }),
        ).toBeVisible();
      }
      expect(await page.evaluate(() => window.__shareModalCalls)).toEqual([]);
      await expect(
        page.getByText("This item has restricted access"),
      ).toHaveCount(scenario.isRestricted ? 1 : 0);
    });

    test("shows the warning for paginated members and fits a narrow screen", async ({
      mount,
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await mount(
        <TestShareModal
          allowFileImport
          canRestrict
          hasNextMembers
          isRestricted={scenario.isRestricted}
        />,
      );
      const modal = await openConfirmation(page, scenario.title);
      await expect(modal).toContainText(scenario.confirmation);
      const bounds = await modal.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(375);
      await expect(
        modal.getByRole("button", { name: scenario.title, exact: true }),
      ).toBeInViewport();
    });
  });
}

// Apps name their items: the restriction copy follows `customTranslations`,
// like the link settings do.
test("restriction copy follows customTranslations", async ({ mount, page }) => {
  // 1. Mount a restrictable modal with folder wording for the menu and dialog.
  await mount(
    <TestShareModal
      allowFileImport
      canRestrict
      customTranslations={{
        "components.share.restrict.title": "Restrict folder",
        "components.share.restrict.description": "Only people of this folder",
        "components.share.restrict.confirmation": "Parent folder access goes.",
        "components.share.restrict.details": "Folder members stay.",
      }}
    />,
  );

  // 2. The menu entry shows the overridden title and description.
  await page.getByRole("button", { name: "More actions" }).click();
  const entry = page.getByRole("menuitem", { name: /Restrict folder/ });
  await expect(entry).toContainText("Only people of this folder");

  // 3. The dialog uses the overrides for its title, text and confirm button,
  //    while the untouched Cancel label keeps its default.
  await entry.click();
  const modal = page.getByRole("dialog", { name: "Restrict folder" });
  await expect(modal.locator("strong")).toHaveText("Parent folder access goes.");
  await expect(modal).toContainText("Folder members stay.");
  await expect(
    modal.getByRole("button", { name: "Restrict folder", exact: true }),
  ).toBeVisible();
  await expect(
    modal.getByRole("button", { name: "Cancel", exact: true }),
  ).toBeVisible();
});
