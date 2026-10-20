import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestDropdownMenuV2 } from "../helpers/mount-dropdown-menu-v2";

/**
 * DropdownMenu (V1) required the trigger to toggle the open state in its own
 * onClick. Code migrated as is must keep working with DropdownMenuV2.
 */

const trigger = (page: Page) => page.getByRole("button", { name: "Actions" });
const menu = (page: Page) => page.getByRole("menu");
const openChanges = (page: Page) => page.getByLabel("Open changes");

test.describe("DropdownMenuV2 - trigger still toggling in onClick (V1 code)", () => {
  test("opens on click, closes on pick, outside click or trigger click", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenuV2 controlled legacyToggle />);
    const box = (await trigger(page).boundingBox())!;

    await trigger(page).click();
    await expect(menu(page)).toBeVisible();
    await page.getByRole("menuitem", { name: "Download" }).click();
    await expect(menu(page)).toHaveCount(0);
    await expect(page.getByLabel("Last action")).toHaveText("download");

    await trigger(page).click();
    await page.mouse.click(600, 400);
    await expect(menu(page)).toHaveCount(0);

    await trigger(page).click();
    await expect(menu(page)).toBeVisible();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(menu(page)).toHaveCount(0);
    await expect(openChanges(page)).toHaveText(
      "true,false,true,false,true,false",
    );
  });

  test("opens from the keyboard", async ({ mount, page }) => {
    await mount(<TestDropdownMenuV2 controlled legacyToggle />);
    await page.getByRole("button", { name: "Before" }).focus();
    await page.keyboard.press("Tab");

    for (const key of ["Enter", "Space", "ArrowDown"]) {
      await page.keyboard.press(key);
      await expect(page.getByRole("menuitem", { name: "Rename" })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(menu(page)).toHaveCount(0);
      await expect(trigger(page)).toBeFocused();
    }
  });
});

test.describe("DropdownMenuV2 - trigger still toggling in onClick, touch", () => {
  test.use({ hasTouch: true });

  test("opens on tap and stays open", async ({ mount, page }) => {
    await mount(<TestDropdownMenuV2 controlled legacyToggle />);

    await trigger(page).tap();
    await expect(menu(page)).toBeVisible();
    await page.waitForTimeout(300);
    await expect(menu(page)).toBeVisible();
    await expect(openChanges(page)).toHaveText("true");
  });
});
