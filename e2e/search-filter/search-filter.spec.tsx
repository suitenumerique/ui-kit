import { test, expect } from "@playwright/experimental-ct-react";
import {
  TestSearchFilter,
  TestUserSearchFilter,
} from "../helpers/mount-search-filter";

test.describe("SearchFilter", () => {
  const triggerName = /Category/;

  // The Reset row lives above the search box and is a plain div (not a
  // listbox option), so it is located by its text rather than by role.
  // --- Reset feature (the point of this branch) ----------------------------

  test("shows no Reset row when nothing is selected", async ({
    mount,
    page,
  }) => {
    await mount(<TestSearchFilter />);

    await page.getByRole("button", { name: triggerName }).click();

    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(page.getByText("Reset", { exact: true })).toHaveCount(0);
  });

  test("shows a Reset row once an item is selected", async ({
    mount,
    page,
  }) => {
    await mount(<TestSearchFilter />);
    const trigger = page.getByRole("button", { name: triggerName });

    await trigger.click();
    await page.getByRole("option", { name: "Apple" }).click();
    await expect(trigger).toHaveAccessibleName("Category : Apple");

    await trigger.click();
    await expect(page.getByText("Reset", { exact: true })).toBeVisible();
  });

  test("clicking Reset clears the selection", async ({ mount, page }) => {
    await mount(<TestSearchFilter />);
    const trigger = page.getByRole("button", { name: triggerName });

    await trigger.click();
    await page.getByRole("option", { name: "Apple" }).click();
    await trigger.click();

    // Reset only clears the selection; it does not close the popover, so the
    // row vanishes in place and the trigger drops the active value.
    await page.getByText("Reset", { exact: true }).click();

    await expect(trigger).toHaveAccessibleName("Category");
    await expect(page.getByText("Reset", { exact: true })).toHaveCount(0);
  });

  test("showReset={false} hides the Reset row even when selected", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestSearchFilter
        showReset={false}
        initialSelected={{ id: "apple", label: "Apple" }}
      />,
    );
    const trigger = page.getByRole("button", { name: triggerName });
    await expect(trigger).toHaveAccessibleName("Category : Apple");

    await trigger.click();

    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(page.getByText("Reset", { exact: true })).toHaveCount(0);
  });

  // --- Core behavior --------------------------------------------------------

  test("opens the dropdown with a search input and all options", async ({
    mount,
    page,
  }) => {
    await mount(<TestSearchFilter />);

    await page.getByRole("button", { name: triggerName }).click();

    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(page.getByPlaceholder("Search...")).toBeVisible();
    for (const name of ["Apple", "Banana", "Cherry"]) {
      await expect(page.getByRole("option", { name })).toBeVisible();
    }
  });

  test("selecting an option updates the trigger, closes the popover, and clears the search", async ({
    mount,
    page,
  }) => {
    await mount(<TestSearchFilter />);
    const trigger = page.getByRole("button", { name: triggerName });

    await trigger.click();
    await page.getByPlaceholder("Search...").fill("Ap");
    await page.getByRole("option", { name: "Apple" }).click();

    await expect(page.getByRole("listbox")).not.toBeVisible();
    await expect(trigger).toHaveAccessibleName("Category : Apple");

    // Reopening shows the search box has been reset.
    await trigger.click();
    await expect(page.getByPlaceholder("Search...")).toHaveValue("");
  });

  test("typing in the search box filters the options", async ({
    mount,
    page,
  }) => {
    await mount(<TestSearchFilter />);

    await page.getByRole("button", { name: triggerName }).click();
    await page.getByPlaceholder("Search...").fill("ban");

    await expect(page.getByRole("option", { name: "Banana" })).toBeVisible();
    await expect(page.getByRole("option", { name: "Apple" })).toHaveCount(0);
    await expect(page.getByRole("option", { name: "Cherry" })).toHaveCount(0);
  });

  test("shows a spinner and no options while loading", async ({
    mount,
    page,
  }) => {
    await mount(<TestSearchFilter isLoading />);

    await page.getByRole("button", { name: triggerName }).click();

    // The loading row is itself a listbox option, so assert the data options
    // are suppressed rather than expecting zero options overall.
    await expect(page.locator(".c__search-filter__loading")).toBeVisible();
    await expect(page.getByRole("option", { name: "Apple" })).toHaveCount(0);
  });

  test("renders the empty state when no option matches", async ({
    mount,
    page,
  }) => {
    await mount(<TestSearchFilter emptyState="No results" />);

    await page.getByRole("button", { name: triggerName }).click();
    await page.getByPlaceholder("Search...").fill("zzz");

    // The empty-state row is itself a listbox option, so assert the data
    // options are gone rather than expecting zero options overall.
    await expect(page.getByText("No results")).toBeVisible();
    await expect(page.getByRole("option", { name: "Banana" })).toHaveCount(0);
  });

  test("Escape closes the popover and restores focus to the trigger", async ({
    mount,
    page,
  }) => {
    await mount(<TestSearchFilter />);
    const trigger = page.getByRole("button", { name: triggerName });

    await trigger.click();
    const input = page.getByPlaceholder("Search...");
    await expect(input).toBeVisible();
    await input.focus();

    await input.press("Escape");

    await expect(page.getByRole("listbox")).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
});

test.describe("UserSearchFilter", () => {
  test("renders each user's full name as an option", async ({
    mount,
    page,
  }) => {
    await mount(<TestUserSearchFilter />);

    await page.getByRole("button", { name: /Owner/ }).click();

    await expect(
      page.getByRole("option", { name: "Alice Martin" }),
    ).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Bob Dupont" }),
    ).toBeVisible();
  });
});
