import { test, expect } from "@playwright/experimental-ct-react";
import type { Locator, Page } from "@playwright/test";
import {
  TestContextMenu,
  TestTwoContextMenus,
} from "../helpers/mount-context-menu";

/** The trailing check icon rendered by `MenuItemBody` for `isChecked` items. */
const CHECK_ICON = ".c__dropdown-menu-item__check";

/** Open the context menu by right-clicking its trigger. */
const openMenu = (page: Page) =>
  page.getByTestId("context-menu-trigger").click({ button: "right" });

const menuItem = (page: Page, name: string) =>
  page.getByRole("menuitem", { name });

const expectChecked = (item: Locator, isChecked: boolean) =>
  expect(item.locator(CHECK_ICON)).toHaveCount(isChecked ? 1 : 0);

test.describe("ContextMenu - checked item", () => {
  test("Marks only the checked item with a checkmark", async ({
    mount,
    page,
  }) => {
    await mount(<TestContextMenu initialSort="date" />);
    await openMenu(page);

    await expect(page.getByTestId("context-menu")).toBeVisible();
    await expectChecked(menuItem(page, "Date modified"), true);
    await expectChecked(menuItem(page, "Name"), false);
    await expectChecked(menuItem(page, "Size"), false);
    await expectChecked(menuItem(page, "Refresh"), false);
  });

  test("Renders no checkmark when no item is checked", async ({
    mount,
    page,
  }) => {
    await mount(<TestContextMenu />);
    await openMenu(page);

    await expect(page.getByTestId("context-menu")).toBeVisible();
    await expect(page.locator(CHECK_ICON)).toHaveCount(0);
  });

  test("Moves the checkmark to the option picked on the previous opening", async ({
    mount,
    page,
  }) => {
    await mount(<TestContextMenu initialSort="name" />);

    await openMenu(page);
    await menuItem(page, "Size").click();

    // Picking an option closes the menu (no `keepOpen`) and updates the state.
    await expect(page.getByTestId("context-menu")).toHaveCount(0);
    await expect(page.getByTestId("current-sort")).toHaveText("size");

    await openMenu(page);
    await expectChecked(menuItem(page, "Size"), true);
    await expectChecked(menuItem(page, "Name"), false);
  });

  test("Moves the checkmark without reopening when the item keeps the menu open", async ({
    mount,
    page,
  }) => {
    await mount(<TestContextMenu initialSort="name" keepOpen />);

    await openMenu(page);
    await menuItem(page, "Date modified").click();

    await expect(page.getByTestId("context-menu")).toBeVisible();
    await expect(page.getByTestId("current-sort")).toHaveText("date");
    await expectChecked(menuItem(page, "Date modified"), true);
    await expectChecked(menuItem(page, "Name"), false);
  });
});

test.describe("ContextMenu - open menu ownership", () => {
  test("Refreshes the items of the owning trigger without picking up another trigger's", async ({
    mount,
    page,
  }) => {
    await mount(<TestTwoContextMenus />);

    await page.getByTestId("file-trigger").click({ button: "right" });
    await expect(menuItem(page, "Rename (0)")).toBeVisible();

    // `keepOpen` leaves the menu open while the callback re-renders *both*
    // triggers, so the open menu must follow the file trigger only.
    await menuItem(page, "Rename (0)").click();

    await expect(menuItem(page, "Rename (1)")).toBeVisible();
    await expect(menuItem(page, "Delete")).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Share" })).toHaveCount(0);
    await expect(page.getByRole("menuitem", { name: "Archive" })).toHaveCount(0);
  });
});
