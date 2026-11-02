import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { ComponentProps } from "react";
import {
  TestDropdownMenu,
  TestStandalonePopover,
} from "../helpers/mount-dropdown-menu";
import { expectNoAxeViolations } from "../helpers/axe";

const menu = (page: Page) => page.getByRole("menu");

/** Opens the menu from the keyboard, as a keyboard or screen reader user does. */
const openFromKeyboard = async (page: Page) => {
  await page.getByRole("button", { name: "Before" }).focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(menu(page)).toBeVisible();
};

const AUDITED: Array<[string, ComponentProps<typeof TestDropdownMenu>]> = [
  [
    "actions with messages",
    { scenario: "actions", topMessage: "Top message", bottomMessage: "Bottom message" },
  ],
  ["single selection mixed with actions", { scenario: "mixed", initialValues: ["reader"] }],
  [
    "multiple selection",
    { scenario: "selection", multiple: true, initialValues: ["reader", "editor"] },
  ],
  ["checked items", { scenario: "checked" }],
  ["links, shortcuts and hidden items", { scenario: "options" }],
  ["tiny variant", { scenario: "actions", variant: "tiny" }],
  ["unstyled trigger", { scenario: "actions", triggerKind: "unstyled" }],
];

test.describe("DropdownMenu - accessibility audit", () => {
  for (const [name, props] of AUDITED) {
    test(`has no axe violation while open: ${name}`, async ({ mount, page }) => {
      await mount(<TestDropdownMenu {...props} />);
      await openFromKeyboard(page);
      await expectNoAxeViolations(page);
    });
  }

  test("has no axe violation with a submenu open", async ({ mount, page }) => {
    await mount(<TestDropdownMenu scenario="submenus" />);
    await openFromKeyboard(page);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await expect(menu(page)).toHaveCount(2);
    await expectNoAxeViolations(page);
  });
});

test.describe("DropdownMenu - assistive technologies", () => {
  test("exposes the selectable items, their group and the actions", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu scenario="mixed" initialValues={["reader"]} />);
    await openFromKeyboard(page);

    await expect(page.getByRole("dialog")).toMatchAriaSnapshot(`
      - dialog "Actions":
        - menu "Actions":
          - group:
            - menuitemradio "Reader" [checked]
            - menuitemradio "Commenter"
            - menuitemradio "Editor"
            - menuitemradio "Administrator" [disabled]
          - menuitem "Remove access"
    `);
    await expect(
      page.getByRole("menuitemradio", { name: "Reader" }),
    ).toHaveAccessibleDescription("Can view");
    // Separators stay visual: an exposed one is counted in the item positions
    // announced by VoiceOver in Chrome.
    await expect(menu(page).getByRole("separator")).toHaveCount(0);
    await expect(
      menu(page).getByRole("separator", { includeHidden: true }),
    ).toHaveAttribute("aria-hidden", "true");
  });

  test("exposes the submenu trigger state and names the submenu after it", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu scenario="submenus" />);
    await openFromKeyboard(page);
    const share = page.getByRole("menuitem", { name: "Share" });
    await expect(share).toHaveAttribute("aria-haspopup", "menu");
    await expect(share).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");

    await expect(share).toHaveAttribute("aria-expanded", "true");
    await expect(menu(page).nth(1)).toHaveAccessibleName("Share");
    await expect(page.getByRole("menuitem", { name: "Copy link" })).toBeFocused();
  });

  test("makes the rest of the page inert while open", async ({ mount, page }) => {
    await mount(<TestDropdownMenu />);
    const before = page.getByRole("button", { name: "Before" });
    const isInert = () => before.evaluate((element) => element.closest("[inert]") !== null);

    await openFromKeyboard(page);
    expect(await isInert()).toBe(true);

    await page.keyboard.press("Escape");
    await expect(menu(page)).toHaveCount(0);
    expect(await isInert()).toBe(false);
  });
});

test.describe("DropdownMenu.Popover - outside a trigger", () => {
  test("focuses the menu, then closes on a pick or on Tab", async ({
    mount,
    page,
  }) => {
    await mount(<TestStandalonePopover />);
    const open = page.getByRole("button", { name: "Open" });

    await open.click();
    await expect(menu(page)).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(menu(page)).toHaveCount(0);
    await expect(page.getByLabel("Last action")).toHaveText("rename");

    await open.click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await expect(menu(page)).toHaveCount(0);
    await expect(page.getByLabel("Last action")).toHaveText("delete");

    await open.click();
    await expect(menu(page)).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(menu(page)).toHaveCount(0);
  });
});

test.describe("DropdownMenu - forced colors", () => {
  test("keeps the separators and the focused item visible", async ({
    mount,
    page,
  }) => {
    await page.emulateMedia({ forcedColors: "active" });
    await mount(<TestDropdownMenu scenario="mixed" initialValues={["reader"]} />);
    await openFromKeyboard(page);

    const surfaceColor = await page
      .locator(".c__dropdown-menu")
      .evaluate((element) => getComputedStyle(element).backgroundColor);
    await expect(
      menu(page).getByRole("separator", { includeHidden: true }),
    ).not.toHaveCSS(
      "background-color",
      surfaceColor,
    );

    const reader = page.getByRole("menuitemradio", { name: "Reader" });
    await expect(reader).toBeFocused();
    await expect(reader).toHaveCSS("outline-style", "solid");
  });
});
