import { test, expect } from "@playwright/experimental-ct-react";
import { TestResetFilter } from "../helpers/mount-filter";

// The reset row lives *outside* the ListBox (react-aria's CollectionBuilder
// drops non-collection children), so it is a plain element rather than an
// `option` — locate it by its label within the dropdown popover.
const resetRow = (page: import("@playwright/test").Page) =>
  page.locator(".c__dropdown-menu-item", { hasText: "Reset" });

test.describe("Filter — reset row (showReset)", () => {
  test("appears only once a value is selected", async ({ mount, page }) => {
    await mount(<TestResetFilter />);
    const trigger = page.getByRole("button", { name: /Type/ });

    // Nothing selected yet → no reset row in the open dropdown.
    await trigger.click();
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(resetRow(page)).toHaveCount(0);

    // Select an option → the reset row shows on the next open.
    await page.getByRole("option", { name: "File" }).click();
    await expect(trigger).toHaveAccessibleName("Type : File");

    await trigger.click();
    await expect(resetRow(page)).toBeVisible();
  });

  test("clicking it clears the selection and keeps the menu open", async ({
    mount,
    page,
  }) => {
    await mount(<TestResetFilter />);
    const trigger = page.getByRole("button", { name: /Type/ });

    await trigger.click();
    await page.getByRole("option", { name: "Folder" }).click();
    await expect(trigger).toHaveAccessibleName("Type : Folder");

    await trigger.click();
    await resetRow(page).click();

    // Selection cleared, the reset row hides itself, and — unlike picking an
    // option — the popover stays open with no checkmark left.
    await expect(trigger).toHaveAccessibleName("Type");
    await expect(resetRow(page)).toHaveCount(0);
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(page.locator(".c__dropdown-menu-item__check")).toHaveCount(0);
  });

  test("is hidden when showReset is false, even with a selection", async ({
    mount,
    page,
  }) => {
    await mount(<TestResetFilter showReset={false} />);
    const trigger = page.getByRole("button", { name: /Type/ });

    await trigger.click();
    await page.getByRole("option", { name: "File" }).click();
    await expect(trigger).toHaveAccessibleName("Type : File");

    await trigger.click();
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(resetRow(page)).toHaveCount(0);
  });
});
