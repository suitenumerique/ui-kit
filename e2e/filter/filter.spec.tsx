import { test, expect } from "@playwright/experimental-ct-react";
import { TestFilter } from "../helpers/mount-filter";

test.describe("Filter", () => {
  test.beforeEach(async ({ mount, page }) => {
    await mount(<TestFilter />);
    await expect(page.getByRole("button", { name: /Updated/ })).toBeVisible();
  });

  // --- Core Filter behavior -------------------------------------------------

  test("opens the dropdown and shows all options", async ({ page }) => {
    await page.getByRole("button", { name: /Updated/ }).click();

    await expect(page.getByRole("listbox")).toBeVisible();
    for (const name of ["Today", "Yesterday", "Last week", "Custom"]) {
      await expect(page.getByRole("option", { name })).toBeVisible();
    }
  });

  test("selecting a normal option closes the dropdown and updates the button", async ({
    page,
  }) => {
    const trigger = page.getByRole("button", { name: /Updated/ });
    await trigger.click();

    await page.getByRole("option", { name: "Today" }).click();

    await expect(page.getByRole("listbox")).not.toBeVisible();
    await expect(trigger).toHaveAccessibleName("Updated : Today");
  });

  test("shows a checkmark on the selected option", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /Updated/ });
    const check = page.locator(".c__dropdown-menu-item__check");
    await trigger.click();

    // Nothing selected yet → no checkmark anywhere.
    await expect(check).toHaveCount(0);

    await page.getByRole("option", { name: "Today" }).click();

    // Reopen: the selected option is marked and renders the checkmark icon.
    await trigger.click();
    const selected = page.getByRole("option", { name: "Today", selected: true });
    await expect(selected).toBeVisible();
    await expect(
      selected.locator(".c__dropdown-menu-item__check"),
    ).toBeVisible();

    // The checkmark is exclusive to the selected option.
    await expect(check).toHaveCount(1);
  });

  test("the Custom option shows a chevron affordance that normal options lack", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Updated/ }).click();

    await expect(
      page
        .getByRole("option", { name: "Custom" })
        .locator(".c__dropdown-menu-item__chevron"),
    ).toBeVisible();
    await expect(
      page
        .getByRole("option", { name: "Today" })
        .locator(".c__dropdown-menu-item__chevron"),
    ).toHaveCount(0);
  });

  // --- Sub-element (CalendarRange) feature -----------------------------------

  test("hovering the Custom row opens the calendar sub-panel", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Updated/ }).click();

    await page.getByRole("option", { name: "Custom" }).hover();

    await expect(page.getByRole("grid")).toBeVisible();
  });

  test("opens the sub-panel with the keyboard and restores focus on Escape", async ({
    page,
  }) => {
    const trigger = page.getByRole("button", { name: /Updated/ });
    await trigger.focus();
    await page.keyboard.press("Enter"); // open the dropdown
    await expect(page.getByRole("listbox")).toBeVisible();

    // Move focus down to the Custom row, then open its sub-panel with Enter.
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("ArrowDown");
    }
    await page.keyboard.press("Enter");

    // Sub-panel opens, the dropdown stays open, and focus moves into the panel.
    const grid = page.getByRole("grid");
    await expect(grid).toBeVisible();
    await expect(page.getByRole("listbox")).toBeVisible();
    const focusInPanel = await page.evaluate(
      () => !!document.activeElement?.closest(".c__filter__subpanel"),
    );
    expect(focusInPanel).toBe(true);

    // Escape closes the panel and returns focus to the Custom row.
    await page.keyboard.press("Escape");
    await expect(grid).not.toBeVisible();
    await expect(
      page.getByRole("option", { name: "Custom" }),
    ).toBeFocused();
  });

  test("clicking the Custom row is ignored and keeps the dropdown open", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Updated/ }).click();

    const customOption = page.getByRole("option", { name: "Custom" });
    // Click the left edge (padding/label) and the center to cover the row
    // padding vs the inner element: the press must be swallowed in either case.
    await customOption.click({ position: { x: 6, y: 12 } });
    await expect(page.getByRole("listbox")).toBeVisible();

    await customOption.click();
    await expect(page.getByRole("listbox")).toBeVisible();
  });

  test("confirming a range selects Custom and shows the range in the button", async ({
    page,
  }) => {
    const trigger = page.getByRole("button", { name: /Updated/ });
    await trigger.click();

    await page.getByRole("option", { name: "Custom" }).hover();
    await expect(page.getByRole("grid")).toBeVisible();

    // Only selectable days have a button child inside the grid.
    const days = page.getByRole("grid").getByRole("button");
    await days.nth(8).click();
    await days.nth(12).click();

    await page.getByRole("button", { name: "OK" }).click();

    await expect(page.getByRole("listbox")).not.toBeVisible();
    await expect(trigger).toHaveAccessibleName(
      /Updated : \d{4}-\d{2}-\d{2} – \d{4}-\d{2}-\d{2}/,
    );
  });

  test("Cancel closes the sub-panel without selecting", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /Updated/ });
    await trigger.click();

    await page.getByRole("option", { name: "Custom" }).hover();
    await expect(page.getByRole("grid")).toBeVisible();

    await page.getByRole("button", { name: "Cancel" }).click();

    await expect(page.getByRole("grid")).not.toBeVisible();
    await expect(trigger).toHaveAccessibleName("Updated");
  });

  test("Reset clears a confirmed range", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /Updated/ });
    await trigger.click();

    await page.getByRole("option", { name: "Custom" }).hover();
    await expect(page.getByRole("grid")).toBeVisible();
    const days = page.getByRole("grid").getByRole("button");
    await days.nth(8).click();
    await days.nth(12).click();
    await page.getByRole("button", { name: "OK" }).click();

    await expect(trigger).toHaveAccessibleName(/Updated : /);

    await page.getByRole("button", { name: "Reset" }).click();

    await expect(trigger).toHaveAccessibleName("Updated");
  });
});
