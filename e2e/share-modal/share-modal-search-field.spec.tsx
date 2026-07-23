import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestShareModal } from "../helpers/mount-share-modal";

const field = (page: Page) => page.getByTestId("share-search-field");
const input = (page: Page) => page.getByRole("combobox");

const selectUser = async (page: Page, query: string, name: string) => {
  await input(page).fill(query);
  await page.getByTestId("search-users-list").getByText(name).click();
};

test.describe("ShareModal unified search field", () => {
  test("selected users appear as chips inside the search field (no gray box)", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await expect(field(page)).toBeVisible();

    const searchIcon = field(page).locator(
      ".c__share-modal__search-field__icon",
    );
    await expect(searchIcon.locator("svg")).toBeVisible();
    await expect(searchIcon.locator(".material-icons")).toHaveCount(0);
    await expect(searchIcon).toHaveCSS("color", "rgb(93, 93, 112)");

    // The legacy separate selected-users frame must be gone.
    await expect(page.locator(".c__share-modal__selected-users")).toHaveCount(
      0,
    );

    await selectUser(page, "ama", "Amandine Salambo");

    // The selected user is now a chip living inside the search field…
    const chip = field(page).getByTestId("selected-user-item");
    await expect(chip).toBeVisible();
    await expect(chip).toContainText("Amandine Salambo");

    // …along with the role selector and the invite button.
    await expect(page.getByTestId("share-invite-button")).toBeVisible();
    await expect(field(page).getByRole("button", { name: "Admin" })).toBeVisible();
  });

  test("Backspace selects the last chip before removing it when the input is empty", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await selectUser(page, "ama", "Amandine Salambo");
    await selectUser(page, "ja", "Jakob Philips");

    const chips = field(page).getByTestId("selected-user-item");
    const amandineChip = chips.filter({ hasText: "Amandine Salambo" });
    const jakobChip = chips.filter({ hasText: "Jakob Philips" });

    await expect(input(page)).toHaveValue("");
    await expect(chips).toHaveCount(2);

    await input(page).press("Backspace");

    await expect(chips).toHaveCount(2);
    await expect(jakobChip).toHaveAttribute("data-selected", "true");
    await expect(amandineChip).not.toHaveAttribute("data-selected", "true");

    await input(page).press("Backspace");

    await expect(jakobChip).toHaveCount(0);
    await expect(amandineChip).toBeVisible();

    await input(page).press("Backspace");
    await expect(amandineChip).toHaveAttribute("data-selected", "true");

    await input(page).press("Backspace");
    await expect(field(page).getByTestId("selected-user-item")).toHaveCount(0);
    await expect(page.getByTestId("share-invite-button")).toHaveCount(0);
  });

  test("the first row stays fixed while the input follows the current row", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    const icon = field(page).locator(".c__share-modal__search-field__icon");

    await selectUser(page, "ama", "Amandine Salambo");

    const firstChip = field(page)
      .getByTestId("selected-user-item")
      .filter({ hasText: "Amandine Salambo" });
    const initialChipBox = await firstChip.boundingBox();
    const initialIconBox = await icon.boundingBox();
    const initialInputBox = await input(page).boundingBox();

    for (const [query, name] of [
      ["ja", "Jakob Philips"],
      ["ka", "Kaylynn George"],
      ["cha", "Charlotte Dubois"],
      ["so", "Sophie Moreau"],
      ["chr", "Christopher Martin"],
      ["alice", "Alice Martin"],
      ["bob", "Bob Martin"],
      ["bern", "Alice Bernard"],
    ]) {
      await selectUser(page, query, name);
    }

    const chips = field(page).getByTestId("selected-user-item");
    const chipRows = await chips.evaluateAll((elements) =>
      Array.from(
        new Set(elements.map((element) => element.getBoundingClientRect().top)),
      ),
    );
    const wrappedChipBox = await firstChip.boundingBox();
    const wrappedIconBox = await icon.boundingBox();
    const wrappedInputBox = await input(page).boundingBox();

    expect(chipRows.length).toBeGreaterThan(1);
    expect(wrappedIconBox?.y).toBe(initialIconBox?.y);
    expect(wrappedChipBox?.y).toBe(initialChipBox?.y);
    expect(initialInputBox?.y).toBe(initialChipBox?.y);
    // The input follows the flow of the chips: it sits on the last chip row,
    // or wraps just below it when that row is full — where exactly depends on
    // the browser's font metrics, so only assert it never stays pinned above.
    expect(wrappedInputBox!.y).toBeGreaterThanOrEqual(Math.max(...chipRows));
  });
});
