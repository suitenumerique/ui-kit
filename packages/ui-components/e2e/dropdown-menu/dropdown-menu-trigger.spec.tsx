import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import {
  TestDropdownMenu,
  TestTriggerDisabledWhileOpen,
  TriggerKind,
} from "../helpers/mount-dropdown-menu";

const TRIGGERS: TriggerKind[] = [
  "button",
  "icon-button",
  "native",
  "div",
  "custom",
  "tooltip",
  "aria-button",
  "unstyled",
];

const trigger = (page: Page) => page.getByRole("button", { name: "Actions" });
const menu = (page: Page) => page.getByRole("menu");
const item = (page: Page, name: string) =>
  page.getByRole("menuitem", { name });

/** Reaches the trigger with the keyboard, as a keyboard user would. */
const tabToTrigger = async (page: Page) => {
  await page.getByRole("button", { name: "Before" }).focus();
  await page.keyboard.press("Tab");
  await expect(trigger(page)).toBeFocused();
};

for (const triggerKind of TRIGGERS) {
  test.describe(`DropdownMenu - ${triggerKind} trigger`, () => {
    test("exposes the menu button semantics", async ({ mount, page }) => {
      await mount(<TestDropdownMenu triggerKind={triggerKind} />);

      await expect(trigger(page)).toHaveAttribute("aria-haspopup", "true");
      await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");

      await trigger(page).click();

      await expect(menu(page)).toBeVisible();
      await expect(trigger(page)).toHaveAttribute("aria-expanded", "true");
      await expect(trigger(page)).toHaveAttribute(
        "aria-controls",
        (await menu(page).getAttribute("id")) as string,
      );
      await expect(menu(page)).toHaveAccessibleName("Actions");
    });

    test("opens once per click and closes on a second click", async ({
      mount,
      page,
    }) => {
      await mount(<TestDropdownMenu triggerKind={triggerKind} />);
      const box = (await trigger(page).boundingBox())!;

      await trigger(page).click();
      await expect(menu(page)).toBeVisible();
      await expect(page.getByLabel("Open changes")).toHaveText("true");

      // The open menu is modal: its underlay covers the trigger, and a click
      // there dismisses the menu without reopening it.
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await expect(menu(page)).toHaveCount(0);
      await expect(page.getByLabel("Open changes")).toHaveText("true,false");
    });

    test("opens from the keyboard on the first or the last item", async ({
      mount,
      page,
    }) => {
      await mount(<TestDropdownMenu triggerKind={triggerKind} />);

      await tabToTrigger(page);
      await page.keyboard.press("Enter");
      await expect(item(page, "Rename")).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(menu(page)).toHaveCount(0);
      await expect(trigger(page)).toBeFocused();

      await page.keyboard.press("Space");
      await expect(item(page, "Rename")).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(trigger(page)).toBeFocused();

      await page.keyboard.press("ArrowDown");
      await expect(item(page, "Rename")).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(trigger(page)).toBeFocused();

      await page.keyboard.press("ArrowUp");
      await expect(item(page, "Delete")).toBeFocused();
    });

    test("runs the picked action, closes and returns focus", async ({
      mount,
      page,
    }) => {
      await mount(<TestDropdownMenu triggerKind={triggerKind} />);

      await trigger(page).click();
      await item(page, "Download").click();

      await expect(page.getByLabel("Last action")).toHaveText("download");
      await expect(menu(page)).toHaveCount(0);
      await expect(trigger(page)).toBeFocused();
    });
  });
}

test.describe("DropdownMenu - trigger", () => {
  test("keeps its events from reaching a clickable parent", async ({
    mount,
    page,
  }) => {
    // A menu button inside a clickable row or card must not activate it.
    await mount(<TestDropdownMenu inClickableParent />);

    await trigger(page).click();
    await item(page, "Download").click();
    await expect(page.getByLabel("Last action")).toHaveText("download");

    await tabToTrigger(page);
    await page.keyboard.press("Enter");
    await expect(item(page, "Rename")).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page.getByLabel("Last action")).toHaveText("duplicate");

    await expect(page.getByLabel("Parent events")).toHaveText("");
  });

  test("shows no focus ring on the trigger after a mouse pick", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu />);

    await trigger(page).click();
    await item(page, "Duplicate").hover();
    await item(page, "Download").hover();
    await item(page, "Download").click();

    await expect(menu(page)).toHaveCount(0);
    await expect(trigger(page)).toBeFocused();
    await expect(trigger(page)).not.toHaveAttribute("data-focus-visible");
    await expect(trigger(page)).toHaveCSS("box-shadow", "none");
    await expect(trigger(page)).toHaveCSS("outline-style", "none");
  });

  test("shows the focus ring on the trigger after a keyboard pick", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu />);

    await tabToTrigger(page);
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");

    await expect(menu(page)).toHaveCount(0);
    await expect(trigger(page)).toBeFocused();
    await expect(trigger(page)).toHaveAttribute("data-focus-visible", "true");
    await expect(trigger(page)).not.toHaveCSS("box-shadow", "none");
    // Only the kit ring: no browser outline on top of it.
    await expect(trigger(page)).toHaveCSS("outline-style", "none");
  });

  test("does not submit the form it sits in", async ({ mount, page }) => {
    for (const triggerKind of ["button", "native", "unstyled"] as const) {
      const component = await mount(
        <TestDropdownMenu triggerKind={triggerKind} inForm />,
      );
      await trigger(page).click();
      await expect(menu(page)).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByLabel("Submitted")).toHaveText("0");
      await component.unmount();
    }
  });

  test("does not submit the form when a screen reader activates a wrapped trigger", async ({
    mount,
    page,
  }) => {
    for (const triggerKind of ["button", "tooltip"] as const) {
      const component = await mount(
        <TestDropdownMenu triggerKind={triggerKind} inForm />,
      );
      // A screen reader activates the trigger with a click of no detail.
      await trigger(page).evaluate((element) => (element as HTMLElement).click());
      await expect(menu(page)).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByLabel("Submitted")).toHaveText("0");
      await component.unmount();
    }
  });

  test("keeps an aria-disabled trigger closed, from the keyboard too", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu triggerKind="aria-disabled" />);

    await tabToTrigger(page);
    for (const key of ["Enter", "Space", "ArrowDown", "ArrowUp"]) {
      await page.keyboard.press(key);
    }
    // Playwright waits for a disabled element to be enabled before clicking.
    await trigger(page).click({ force: true });

    await expect(menu(page)).toHaveCount(0);
    await expect(page.getByLabel("Open changes")).toHaveText("");
  });

  for (const controlled of [false, true]) {
    test(`closes for good when its trigger gets disabled while open${
      controlled ? ", controlled" : ""
    }`, async ({ mount, page }) => {
      await mount(<TestTriggerDisabledWhileOpen controlled={controlled} />);
      await trigger(page).click();
      await item(page, "Lock").click();

      await expect(menu(page)).toHaveCount(0);
      await expect(page.getByLabel("Open changes")).toHaveText("true,false");

      // Enabling the trigger again must not bring the menu back.
      await page.getByRole("button", { name: "Unlock" }).click();
      await expect(trigger(page)).toBeEnabled();
      await page.waitForTimeout(300);
      await expect(menu(page)).toHaveCount(0);
      await expect(page.getByLabel("Open changes")).toHaveText("true,false");
    });
  }

  test("does not open again on hover after a press released on an item", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu />);
    const box = (await trigger(page).boundingBox())!;
    const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 };

    // Press the trigger, drag to an item and release there.
    await page.mouse.move(center.x, center.y);
    await page.mouse.down();
    await expect(menu(page)).toBeVisible();
    const itemBox = (await item(page, "Download").boundingBox())!;
    await page.mouse.move(itemBox.x + 10, itemBox.y + itemBox.height / 2, {
      steps: 5,
    });
    await page.mouse.up();
    await expect(menu(page)).toHaveCount(0);
    await expect(page.getByLabel("Last action")).toHaveText("download");

    // Hovering the trigger again must not resume the press.
    await page.mouse.move(600, 400, { steps: 3 });
    await page.mouse.move(center.x, center.y, { steps: 3 });
    await page.waitForTimeout(300);
    await expect(menu(page)).toHaveCount(0);
    await expect(page.getByLabel("Open changes")).toHaveText("true,false");
  });

  test("shows the tooltip of a wrapped trigger and hides it on press", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu triggerKind="tooltip" />);

    // React Aria shows tooltips on hover once it has seen the pointer move.
    await page.mouse.move(0, 0);
    await page.mouse.move(5, 5);
    await trigger(page).hover();
    await expect(page.getByText("Actions tooltip")).toBeVisible();

    await trigger(page).click();
    await expect(menu(page)).toBeVisible();
    await expect(page.getByText("Actions tooltip")).toHaveCount(0);
  });

  test("names the unstyled trigger after its aria-label, not its content", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu triggerKind="unstyled" />);

    await expect(trigger(page)).toHaveAccessibleName("Actions");
    await expect(page.getByRole("button", { name: "JM" })).toHaveCount(0);
  });

  test("shows the focus ring of the unstyled trigger from the keyboard only", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu triggerKind="unstyled" />);

    await trigger(page).click();
    await item(page, "Download").click();
    await expect(menu(page)).toHaveCount(0);
    await expect(trigger(page)).toBeFocused();
    await expect(trigger(page)).not.toHaveAttribute("data-focus-visible");
    await expect(trigger(page)).toHaveCSS("outline-style", "none");

    await tabToTrigger(page);
    await expect(trigger(page)).toHaveAttribute("data-focus-visible", "true");
    await expect(trigger(page)).toHaveCSS("outline-style", "solid");
  });

  test("follows a controlled open state", async ({ mount, page }) => {
    await mount(<TestDropdownMenu controlled />);

    await page.getByRole("button", { name: "Open from outside" }).click();
    await expect(menu(page)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menu(page)).toHaveCount(0);
    await expect(page.getByLabel("Open changes")).toHaveText("false");
  });

  test("opens on mount with defaultOpen", async ({ mount, page }) => {
    await mount(<TestDropdownMenu defaultOpen />);
    await expect(menu(page)).toBeVisible();
  });

  test("closes on outside clicks unless shouldCloseOnInteractOutside refuses", async ({
    mount,
    page,
  }) => {
    const component = await mount(<TestDropdownMenu />);
    await trigger(page).click();
    await page.mouse.click(600, 400);
    await expect(menu(page)).toHaveCount(0);
    await component.unmount();

    await mount(<TestDropdownMenu keepOpenOnOutsideClick />);
    await trigger(page).click();
    await page.mouse.click(600, 400);
    await expect(menu(page)).toBeVisible();
    await page.getByRole("menuitem", { name: "Rename" }).click();
    await expect(menu(page)).toHaveCount(0);
  });
});

test.describe("DropdownMenu - trigger, touch", () => {
  test.use({ hasTouch: true });

  test("does not submit the form when a wrapped trigger is tapped", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu triggerKind="tooltip" inForm />);

    await trigger(page).tap();

    await expect(menu(page)).toBeVisible();
    await expect(page.getByLabel("Submitted")).toHaveText("0");
  });
});
