import { test, expect } from "@playwright/experimental-ct-react";
import { TestDropdownMenu } from "../helpers/mount-dropdown-menu";
import {
  SHORT_VIEWPORT,
  expectScrollableMenu,
  expectVerticallyWithin,
  frameOf,
  menuItem,
  scrollToEnd,
} from "../helpers/menu-helpers";

test.use({ viewport: SHORT_VIEWPORT });

const ITEM_COUNT = 30;

test.describe("DropdownMenu - constrained height", () => {
  test("Scrolls the list within the menu when the popover lacks room", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu itemCount={ITEM_COUNT} />);
    await page.getByRole("button", { name: "Open menu" }).click();

    await expectScrollableMenu(page, "Item 1", `Item ${ITEM_COUNT}`);
  });

  test("Keeps the top and bottom messages visible while the list scrolls", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestDropdownMenu
        itemCount={ITEM_COUNT}
        topMessage="Top message"
        bottomMessage="Bottom message"
      />,
    );
    await page.getByRole("button", { name: "Open menu" }).click();

    await expectScrollableMenu(page, "Item 1", `Item ${ITEM_COUNT}`);

    // The messages keep their place around the list instead of being pushed
    // out of the menu by it.
    const frame = frameOf(page, "Item 1");
    const topMessage = page.getByText("Top message");
    const bottomMessage = page.getByText("Bottom message");
    await expect(topMessage).toBeInViewport({ ratio: 1 });
    await expect(bottomMessage).toBeInViewport({ ratio: 1 });
    await expectVerticallyWithin(topMessage, frame);
    await expectVerticallyWithin(bottomMessage, frame);
  });

  test.describe("When the popover is smaller than the messages", () => {
    test.beforeEach(async ({ mount, page }) => {
      // The trigger sits mid-height, so the popover has no better side to flip
      // to and gets less room than the top and bottom messages need.
      await page.setViewportSize({ width: 1280, height: 200 });
      await mount(
        <div style={{ paddingTop: 80 }}>
          <TestDropdownMenu
            itemCount={ITEM_COUNT}
            topMessage="Top message"
            bottomMessage="Bottom message"
          />
        </div>,
      );
      await page.getByRole("button", { name: "Open menu" }).click();
    });

    test("Keeps the items reachable", async ({ page }) => {
      const frame = frameOf(page, "Item 1");
      await expect(frame).toBeInViewport({ ratio: 1 });

      // The list keeps room for an item instead of collapsing to nothing.
      const list = page.getByRole("menu");
      const listBox = (await list.boundingBox())!;
      const itemBox = (await menuItem(page, "Item 1").boundingBox())!;
      expect(listBox.height).toBeGreaterThanOrEqual(itemBox.height);

      // The list does not scroll on its own, so no scroll gets nested in the
      // menu one.
      expect(await scrollToEnd(list)).toBe(0);

      // The menu scrolls as a whole, so every part of it can be reached.
      for (const target of [
        menuItem(page, `Item ${ITEM_COUNT}`),
        page.getByText("Bottom message"),
        page.getByText("Top message"),
      ]) {
        await target.scrollIntoViewIfNeeded();
        await expect(target).toBeInViewport({ ratio: 1 });
        await expectVerticallyWithin(target, frame);
      }
    });

    test("Scrolls the menu to the item focused with the keyboard", async ({
      page,
    }) => {
      const frame = frameOf(page, "Item 1");

      for (const [key, itemName] of [
        ["End", `Item ${ITEM_COUNT}`],
        ["ArrowUp", `Item ${ITEM_COUNT - 1}`],
        ["Home", "Item 1"],
        ["ArrowDown", "Item 2"],
      ]) {
        await page.keyboard.press(key);
        const item = menuItem(page, itemName);
        await expect(item).toBeFocused();
        await expect(item).toBeInViewport({ ratio: 1 });
        await expectVerticallyWithin(item, frame);
      }
    });
  });

  test("Scrolls a submenu when it lacks room", async ({ mount, page }) => {
    await mount(
      <TestDropdownMenu itemCount={3} submenuItemCount={ITEM_COUNT} />,
    );
    await page.getByRole("button", { name: "Open menu" }).click();
    await menuItem(page, "More").click();

    await expectScrollableMenu(page, "Subitem 1", `Subitem ${ITEM_COUNT}`);
  });
});
