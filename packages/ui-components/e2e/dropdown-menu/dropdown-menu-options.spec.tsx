import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestDropdownMenu } from "../helpers/mount-dropdown-menu";

const open = (page: Page) =>
  page.getByRole("button", { name: "Actions" }).click();
const menu = (page: Page) => page.getByRole("menu");
const item = (page: Page, name: string) =>
  page.getByRole("menuitem", { name });

test.describe("DropdownMenu - options", () => {
  test("renders the danger variant, test ids and decorative icons", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu />);
    await open(page);

    const remove = page.getByTestId("delete-item");
    await expect(remove).toHaveAccessibleName("Delete");
    await expect(remove).toHaveClass(/c__dropdown-menu-item--danger/);
    await expect(remove.locator(".c__dropdown-menu-item__icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  test("announces the sub text as the item description", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu />);
    await open(page);

    await expect(item(page, "Duplicate")).toHaveAccessibleDescription(
      "Make a copy",
    );
  });

  test("drops hidden items and orphaned separators", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu scenario="options" />);
    await open(page);

    await expect(page.getByRole("menuitem", { name: "Restore" })).toHaveCount(
      0,
    );
    // Open | Help (showSeparator) | Changelog: two separators remain.
    await expect(menu(page).getByRole("separator")).toHaveCount(2);
  });

  test("names new window items and renders links", async ({ mount, page }) => {
    await mount(<TestDropdownMenu scenario="options" />);
    await open(page);

    await expect(item(page, "Help (new window)")).toBeVisible();
    const changelog = item(page, "Changelog");
    await expect(changelog).toHaveAttribute("href", "#changelog");
    await expect(item(page, "Open")).toHaveAccessibleDescription("⌘O");
  });

  test("describes the menu with its messages", async ({ mount, page }) => {
    await mount(
      <TestDropdownMenu
        topMessage="Shared folder"
        bottomMessage="Read only"
      />,
    );
    await open(page);

    await expect(menu(page)).toHaveAccessibleDescription(
      "Shared folder Read only",
    );
  });

  test("uses 40px items, and 32px items in the tiny variant", async ({
    mount,
    page,
  }) => {
    const component = await mount(<TestDropdownMenu />);
    await open(page);
    expect((await item(page, "Rename").boundingBox())?.height).toBe(40);
    await component.unmount();

    await mount(<TestDropdownMenu variant="tiny" />);
    await open(page);
    expect((await item(page, "Rename").boundingBox())?.height).toBe(32);
    await expect(page.locator(".c__dropdown-menu")).toHaveClass(/c__dropdown-menu--tiny/);
  });

  for (const variant of ["default", "tiny"] as const) {
    test(`wraps long labels within the maximum width (${variant})`, async ({
      mount,
      page,
    }) => {
      await mount(
        <TestDropdownMenu scenario="long-labels" variant={variant} />,
      );
      await open(page);

      const surface = (await page.locator(".c__dropdown-menu").boundingBox())!;
      expect(surface.width).toBeLessThanOrEqual(320);

      const share = item(
        page,
        "Share with every member of the workspace and their guests",
      );
      const label = share.locator(".c__dropdown-menu-item__label");
      const lineHeight = await label.evaluate((element) =>
        parseFloat(getComputedStyle(element).lineHeight),
      );
      expect((await label.boundingBox())!.height).toBeGreaterThanOrEqual(
        lineHeight * 2,
      );
      // Short items keep the single line height.
      expect((await item(page, "Rename").boundingBox())!.height).toBe(
        variant === "tiny" ? 32 : 40,
      );
    });
  }

  test("keeps the minimum width for short labels", async ({ mount, page }) => {
    await mount(<TestDropdownMenu scenario="checked" />);
    await open(page);

    const surface = (await page.locator(".c__dropdown-menu").boundingBox())!;
    expect(surface.width).toBeGreaterThanOrEqual(150);
  });

  test("scrolls long menus and flags the hidden edges", async ({
    mount,
    page,
  }) => {
    await page.setViewportSize({ width: 800, height: 400 });
    await mount(<TestDropdownMenu scenario="long" />);
    await open(page);

    const viewport = page.locator(".c__dropdown-menu__viewport");
    await expect(viewport).toHaveAttribute("data-overflow-bottom", "");
    await expect(viewport).not.toHaveAttribute("data-overflow-top");

    await page.keyboard.press("End");
    await expect(item(page, "Folder 40")).toBeInViewport();
    await expect(viewport).toHaveAttribute("data-overflow-top", "");
    await expect(viewport).not.toHaveAttribute("data-overflow-bottom");
  });

  test("keeps the keyboard focus clear of the overflow indicators", async ({
    mount,
    page,
  }) => {
    await page.setViewportSize({ width: 800, height: 400 });
    await mount(<TestDropdownMenu scenario="long" />);
    await page.getByRole("button", { name: "Before" }).focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("ArrowDown");

    const list = page.locator(".c__dropdown-menu__list");
    const focused = page.locator(".c__dropdown-menu-item[data-focused]");
    const indicatorSize = 24;
    // React Aria scrolls the focused item on the next animation frame.
    const gaps = () =>
      focused.evaluate((item) => {
        const listBox = item.closest(".c__dropdown-menu__list")!.getBoundingClientRect();
        const itemBox = item.getBoundingClientRect();
        return {
          top: Math.round(itemBox.top - listBox.top),
          bottom: Math.round(listBox.bottom - itemBox.bottom),
        };
      });

    for (let index = 0; index < 15; index++) {
      await page.keyboard.press("ArrowDown");
    }
    await expect(focused).toHaveText("Folder 16");
    await expect
      .poll(async () => (await gaps()).bottom)
      .toBeGreaterThanOrEqual(indicatorSize - 1);

    for (let index = 0; index < 10; index++) {
      await page.keyboard.press("ArrowUp");
    }
    await expect(focused).toHaveText("Folder 6");
    expect(await list.evaluate((element) => element.scrollTop)).toBeGreaterThan(
      0,
    );
    await expect
      .poll(async () => (await gaps()).top)
      .toBeGreaterThanOrEqual(indicatorSize - 1);
  });
});
