import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/experimental-ct-react";

/**
 * A viewport short enough to leave the menu popovers less room than a long
 * menu needs, so React Aria caps their `max-height`.
 */
export const SHORT_VIEWPORT = { width: 1280, height: 400 };

export const menuItem = (page: Page, name: string) =>
  page.getByRole("menuitem", { name, exact: true });

/** The menu (the scrollable list of items) holding the given item. */
const menuOf = (page: Page, itemName: string) =>
  page.getByRole("menu").filter({ has: menuItem(page, itemName) });

/**
 * The visible menu frame (white box) holding the given item: the DropdownMenu
 * wrapper around the menu and its messages, or the menu itself for submenus
 * and the ContextMenu.
 */
export const frameOf = (page: Page, itemName: string) =>
  page
    .locator(".react-aria-Popover > .c__dropdown-menu")
    .filter({ has: menuItem(page, itemName) });

/**
 * Scrolls the element to its end and returns the reached `scrollTop`. It stays
 * at 0 when the element is not a scroll container or does not overflow.
 */
const scrollToEnd = (locator: Locator) =>
  locator.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
    return element.scrollTop;
  });

/** Asserts `inner` is laid out within the vertical bounds of `outer`. */
export const expectVerticallyWithin = async (
  inner: Locator,
  outer: Locator,
) => {
  const innerBox = (await inner.boundingBox())!;
  const outerBox = (await outer.boundingBox())!;
  // Tolerance for sub-pixel rounding.
  expect(innerBox.y).toBeGreaterThanOrEqual(outerBox.y - 1);
  expect(innerBox.y + innerBox.height).toBeLessThanOrEqual(
    outerBox.y + outerBox.height + 1,
  );
};

/**
 * Asserts the menu frame holding `firstItemName` fits in the viewport and its
 * list scrolls within it down to `lastItemName`.
 */
export const expectScrollableMenu = async (
  page: Page,
  firstItemName: string,
  lastItemName: string,
) => {
  const frame = frameOf(page, firstItemName);
  await expect(frame).toBeVisible();
  await expect(frame).toBeInViewport({ ratio: 1 });
  expect(await scrollToEnd(menuOf(page, firstItemName))).toBeGreaterThan(0);

  const lastItem = menuItem(page, lastItemName);
  await expect(lastItem).toBeInViewport({ ratio: 1 });
  await expectVerticallyWithin(lastItem, frame);
};
