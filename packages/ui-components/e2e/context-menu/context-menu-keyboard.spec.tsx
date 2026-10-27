import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import {
  TestContextMenu,
  TestContextMenuWithSubmenu,
} from "../helpers/mount-context-menu";
import { expectNoAxeViolations } from "../helpers/axe";

const menu = (page: Page) => page.getByRole("menu");

const openWithPointer = async (page: Page) => {
  await page
    .getByText("Right-click here to pick a sort order")
    .click({ button: "right" });
  await expect(menu(page)).toBeVisible();
};

test.describe("ContextMenu - keyboard and assistive technologies", () => {
  test("focuses the menu so the arrow keys reach the items", async ({
    mount,
    page,
  }) => {
    await mount(<TestContextMenu initialSort="name" />);
    await openWithPointer(page);
    await expect(menu(page)).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitemradio", { name: "Name" })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitemradio", { name: "Size" })).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(menu(page)).toHaveCount(0);
    await expect(page.getByTestId("current-sort")).toHaveText("size");
  });

  test("names the menu and its popover", async ({ mount, page }) => {
    await mount(<TestContextMenu />);
    await openWithPointer(page);

    await expect(page.getByRole("dialog")).toHaveAccessibleName("Context menu");
    await expect(menu(page)).toHaveAccessibleName("Context menu");
    await expectNoAxeViolations(page);
  });

  test("opens a submenu, closes it alone with Escape, and closes everything on a pick", async ({
    mount,
    page,
  }) => {
    await mount(<TestContextMenuWithSubmenu />);
    const zone = page.getByText("Right-click here to share");
    await zone.click({ button: "right" });

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await expect(menu(page)).toHaveCount(2);
    await expect(
      page.getByRole("menuitem", { name: "Copy link" }),
    ).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(menu(page)).toHaveCount(1);
    await expect(page.getByRole("menuitem", { name: "Share" })).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(menu(page)).toHaveCount(0);
    await expect(page.getByLabel("Last action")).toHaveText("email");

    // The next opening starts with the submenu closed.
    await zone.click({ button: "right" });
    await expect(menu(page)).toHaveCount(1);
  });
});
