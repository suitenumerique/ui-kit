import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestDropdownMenu } from "../helpers/mount-dropdown-menu";

const trigger = (page: Page) => page.getByRole("button", { name: "Actions" });
const menu = (page: Page) => page.getByRole("menu");
const item = (page: Page, name: string) =>
  page.getByRole("menuitem", { name });

const openWithKeyboard = async (page: Page) => {
  await page.getByRole("button", { name: "Before" }).focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("ArrowDown");
  await expect(menu(page)).toBeVisible();
};

test.describe("DropdownMenu - keyboard", () => {
  test("moves between items, wraps and skips disabled ones", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu />);
    await openWithKeyboard(page);

    await expect(item(page, "Rename")).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(item(page, "Duplicate")).toBeFocused();
    await page.keyboard.press("ArrowDown");
    // "Archive" is disabled: it is announced but skipped.
    await expect(item(page, "Archive")).toHaveAttribute("aria-disabled", "true");
    await expect(item(page, "Download")).toBeFocused();

    await page.keyboard.press("End");
    await expect(item(page, "Delete")).toBeFocused();
    await page.keyboard.press("Home");
    await expect(item(page, "Rename")).toBeFocused();

    // Focus wraps around both ends.
    await page.keyboard.press("ArrowUp");
    await expect(item(page, "Delete")).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(item(page, "Rename")).toBeFocused();
  });

  test("moves to an item by typing its label", async ({ mount, page }) => {
    await mount(<TestDropdownMenu />);
    await openWithKeyboard(page);

    await page.keyboard.type("dow");
    await expect(item(page, "Download")).toBeFocused();
  });

  test("picks the focused item with Enter", async ({ mount, page }) => {
    await mount(<TestDropdownMenu />);
    await openWithKeyboard(page);

    await page.keyboard.press("End");
    await page.keyboard.press("Enter");

    await expect(page.getByLabel("Last action")).toHaveText("delete");
    await expect(menu(page)).toHaveCount(0);
    await expect(trigger(page)).toBeFocused();
  });

  test("closes with Tab and returns focus to the trigger", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu />);
    await openWithKeyboard(page);

    await page.keyboard.press("Tab");
    await expect(menu(page)).toHaveCount(0);
    await expect(trigger(page)).toBeFocused();
  });

  test("closes every level with Tab from a submenu", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu scenario="submenus" />);
    await openWithKeyboard(page);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await expect(item(page, "Copy link")).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(menu(page)).toHaveCount(0);
    await expect(trigger(page)).toBeFocused();
  });

  test("opens and closes submenus with the arrow keys", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu scenario="submenus" />);
    await openWithKeyboard(page);

    await page.keyboard.press("ArrowDown");
    const share = item(page, "Share");
    await expect(share).toBeFocused();
    await expect(share).toHaveAttribute("aria-haspopup", "menu");
    await expect(share).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("ArrowRight");
    await expect(share).toHaveAttribute("aria-expanded", "true");
    await expect(item(page, "Copy link")).toBeFocused();
    await expect(menu(page)).toHaveCount(2);

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(item(page, "PDF")).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(page.getByLabel("Last action")).toHaveText("pdf");
    await expect(menu(page)).toHaveCount(0);
  });

  test("returns to the parent item with the left arrow", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu scenario="submenus" />);
    await openWithKeyboard(page);

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await expect(item(page, "Copy link")).toBeFocused();

    await page.keyboard.press("ArrowLeft");
    await expect(menu(page)).toHaveCount(1);
    await expect(item(page, "Share")).toBeFocused();
  });

  test("highlights the focused item with its background only", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu />);
    await openWithKeyboard(page);

    const rename = item(page, "Rename");
    await expect(rename).toHaveAttribute("data-focus-visible", "true");
    await expect(rename).toHaveCSS("outline-style", "none");
    const background = (name: string) =>
      item(page, name).evaluate(
        (element) => getComputedStyle(element).backgroundColor,
      );
    expect(await background("Rename")).not.toBe(await background("Duplicate"));
  });

  test("keeps a focus outline in forced colors mode", async ({
    mount,
    page,
  }) => {
    await page.emulateMedia({ forcedColors: "active" });
    await mount(<TestDropdownMenu />);
    await openWithKeyboard(page);

    await expect(item(page, "Rename")).toHaveCSS("outline-style", "solid");
  });
});
