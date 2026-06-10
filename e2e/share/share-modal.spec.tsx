import { test, expect } from "@playwright/experimental-ct-react";
import { TestShareModal } from "../helpers/mount-share";

test.describe("ShareModal — unified search field", () => {
  test("selected users appear as chips inside the search field (no gray box)", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    const field = page.getByTestId("share-search-field");
    await expect(field).toBeVisible();

    // The legacy separate selected-users frame must be gone.
    await expect(page.locator(".c__share-modal__selected-users")).toHaveCount(0);

    // Type to trigger the (debounced) search results.
    const input = field.locator(".c__share-modal__search-field__input");
    await input.fill("am");

    const results = page.getByTestId("search-users-list");
    await expect(results).toBeVisible();
    await results.getByText("Amandine Salambo").click();

    // The selected user is now a chip living inside the search field…
    const chip = field.getByTestId("selected-user-item");
    await expect(chip).toBeVisible();
    await expect(chip).toContainText("Amandine Salambo");

    // …along with the role selector and the invite button.
    await expect(page.getByTestId("share-invite-button")).toBeVisible();
    await expect(
      field.getByRole("button", { name: "Admin" }),
    ).toBeVisible();
  });

  test("a chip can be removed, hiding the invite action", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    const field = page.getByTestId("share-search-field");
    const input = field.locator(".c__share-modal__search-field__input");
    await input.fill("am");
    await page
      .getByTestId("search-users-list")
      .getByText("Amandine Salambo")
      .click();

    const chip = field.getByTestId("selected-user-item");
    await expect(chip).toBeVisible();

    await chip.getByRole("button").click();

    await expect(field.getByTestId("selected-user-item")).toHaveCount(0);
    await expect(page.getByTestId("share-invite-button")).toHaveCount(0);
  });

  test("Backspace selects the last chip before removing it when the input is empty", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    const field = page.getByTestId("share-search-field");
    const input = field.locator(".c__share-modal__search-field__input");

    await input.fill("am");
    await page
      .getByTestId("search-users-list")
      .getByText("Amandine Salambo")
      .click();

    await input.fill("ja");
    await page
      .getByTestId("search-users-list")
      .getByText("Jakob Philips")
      .click();

    const chips = field.getByTestId("selected-user-item");
    const amandineChip = chips.filter({ hasText: "Amandine Salambo" });
    const jakobChip = chips.filter({ hasText: "Jakob Philips" });

    await expect(input).toHaveValue("");
    await expect(chips).toHaveCount(2);

    await input.press("Backspace");

    await expect(chips).toHaveCount(2);
    await expect(jakobChip).toHaveAttribute("data-selected", "true");
    await expect(amandineChip).not.toHaveAttribute("data-selected", "true");

    await input.press("Backspace");

    await expect(jakobChip).toHaveCount(0);
    await expect(amandineChip).toBeVisible();

    await input.press("Backspace");
    await expect(amandineChip).toHaveAttribute("data-selected", "true");

    await input.press("Backspace");
    await expect(field.getByTestId("selected-user-item")).toHaveCount(0);
    await expect(page.getByTestId("share-invite-button")).toHaveCount(0);
  });
});
