import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestShareModal } from "../helpers/mount-share-modal";

const openConfirmation = async (page: Page, title: string) => {
  await page.getByRole("button", { name: "Import contacts" }).click();
  await page.getByRole("menuitem", { name: title, exact: true }).click();
  return page.getByRole("dialog", { name: title, exact: true });
};

const scenarios = [
  {
    action: "restrict",
    title: "Restrict access",
    isRestricted: false,
    confirmation:
      "People who have access through the parent folder will lose it. Only people added directly will keep access.",
    hint: "You can give them access again at any time.",
  },
  {
    action: "unrestrict",
    title: "Open access",
    isRestricted: true,
    confirmation:
      "Everyone with access to the parent folder will have access to this folder. People added directly will keep their access.",
    hint: "You can restrict access again at any time.",
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
      await expect(modal).toContainText(scenario.confirmation);
      await expect(modal).toContainText(scenario.hint);
      expect(await page.evaluate(() => window.__shareModalCalls)).toEqual([]);
      await modal
        .getByRole("button", { name: scenario.title, exact: true })
        .click();
      await expect(modal).toHaveCount(0);
      expect(await page.evaluate(() => window.__shareModalCalls)).toEqual([
        { name: scenario.action },
      ]);
      await expect(
        page.getByText("This folder has restricted access"),
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
      for (const action of ["Cancel", "close", "Escape"]) {
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
          page.getByRole("button", { name: "Import contacts" }),
        ).toBeVisible();
      }
      expect(await page.evaluate(() => window.__shareModalCalls)).toEqual([]);
      await expect(
        page.getByText("This folder has restricted access"),
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
