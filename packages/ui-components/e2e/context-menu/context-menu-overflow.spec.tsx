import { test } from "@playwright/experimental-ct-react";
import { TestLongContextMenu } from "../helpers/mount-context-menu";
import { SHORT_VIEWPORT, expectScrollableMenu } from "../helpers/menu-helpers";

test.use({ viewport: SHORT_VIEWPORT });

const ITEM_COUNT = 30;

test.describe("ContextMenu - constrained height", () => {
  test("Scrolls the menu when the popover lacks room", async ({
    mount,
    page,
  }) => {
    await mount(<TestLongContextMenu itemCount={ITEM_COUNT} />);
    await page.getByTestId("context-menu-trigger").click({ button: "right" });

    await expectScrollableMenu(page, "Item 1", `Item ${ITEM_COUNT}`);
  });
});
