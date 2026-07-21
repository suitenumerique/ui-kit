import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestShareModal } from "../helpers/mount-share-modal";

const searchInput = (page: Page) => page.getByRole("combobox");
const searchCalls = (page: Page) =>
  page.evaluate(() =>
    (window.__shareModalCalls ?? []).filter((call) => call.name === "search"),
  );
const calls = (page: Page) =>
  page.evaluate(() => window.__shareModalCalls ?? []);

const selectUser = async (page: Page, query: string, name: string) => {
  await searchInput(page).pressSequentially(query);
  await page.getByTestId("search-users-list").getByText(name).click();
};

test.describe("ShareModal user search and invite", () => {
  test("searching shows results and hides the lists and footer", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await searchInput(page).pressSequentially("alice");

    await expect(page.getByTestId("search-users-list")).toBeVisible();
    await expect(page.getByTestId("search-user-item")).toHaveCount(2);
    await expect(page.getByText("Alice Martin")).toBeVisible();
    await expect(page.getByText("Alice Bernard")).toBeVisible();
    await expect(page.getByTestId("members-list")).toHaveCount(0);
    await expect(page.getByTestId("invitations-list")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "OK" })).toHaveCount(0);
  });

  test("debounces onSearchUsers to a single trailing call", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await searchInput(page).pressSequentially("ali");
    await expect(page.getByTestId("search-users-list")).toBeVisible();

    expect(await searchCalls(page)).toEqual([{ name: "search", query: "ali" }]);
  });

  test("clearing the input resets immediately and restores the lists", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await searchInput(page).pressSequentially("alice");
    await expect(page.getByTestId("search-users-list")).toBeVisible();

    await searchInput(page).fill("");

    await expect(page.getByTestId("search-users-list")).toHaveCount(0);
    await expect(page.getByTestId("members-list")).toBeVisible();
    expect(await searchCalls(page)).toEqual([
      { name: "search", query: "alice" },
      { name: "search", query: "" },
    ]);
  });

  test("shows the loading state while a search is pending", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal holdSearch />);

    await searchInput(page).pressSequentially("alice");

    await expect(page.locator(".c__spinner")).toBeVisible();
    await expect(page.getByTestId("members-list")).toHaveCount(0);
  });

  test("shows no result for an unmatched non-email query", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal emptySearchResults />);

    await searchInput(page).pressSequentially("zzz");

    await expect(page.getByText("No result")).toBeVisible();
    await expect(page.getByTestId("search-user-item")).toHaveCount(0);
  });

  test("offers an invite row for a valid unknown email", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal emptySearchResults />);

    await searchInput(page).pressSequentially("new.person@example.com");

    await expect(page.getByTestId("search-user-item")).toHaveCount(1);
    await expect(page.getByText("new.person@example.com")).toBeVisible();
    await expect(page.getByText("No result")).toHaveCount(0);
  });

  test("selecting a result adds a pending chip and clears the search", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await selectUser(page, "bob", "Bob Martin");

    await expect(page.getByTestId("share-invite-button")).toBeVisible();
    await expect(page.getByTestId("selected-user-item")).toHaveCount(1);
    await expect(page.getByTestId("selected-user-item")).toContainText(
      "Bob Martin",
    );
    await expect(searchInput(page)).toHaveValue("");
    // Pending users keep the search view active: lists and footer stay hidden.
    await expect(page.getByTestId("members-list")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "OK" })).toHaveCount(0);
  });

  test("removes a pending chip", async ({ mount, page }) => {
    await mount(<TestShareModal />);

    await selectUser(page, "bob", "Bob Martin");
    await expect(page.getByTestId("selected-user-item")).toHaveCount(1);

    await page.getByTestId("selected-user-item").getByRole("button").click();

    await expect(page.getByTestId("selected-user-item")).toHaveCount(0);
    // Removing the last chip also hides the invite action.
    await expect(page.getByTestId("share-invite-button")).toHaveCount(0);
    await expect(page.getByTestId("members-list")).toBeVisible();
  });

  test("pending role defaults to the first role and can be changed", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await selectUser(page, "bob", "Bob Martin");

    const roleButton = page
      .getByTestId("share-search-field")
      .getByTestId("access-role-dropdown-button");
    await expect(roleButton).toContainText("Admin");

    await roleButton.click();
    await page.getByRole("menuitem", { name: "Editor" }).click();

    await expect(roleButton).toContainText("Editor");
  });

  test("share invokes onInviteUser with the users and role, then clears the chips", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await selectUser(page, "alice", "Alice Martin");
    await selectUser(page, "bob", "Bob Martin");
    await expect(page.getByTestId("selected-user-item")).toHaveCount(2);

    const roleButton = page
      .getByTestId("share-search-field")
      .getByTestId("access-role-dropdown-button");
    await roleButton.click();
    await page.getByRole("menuitem", { name: "Reader" }).click();

    await page.getByRole("button", { name: "Share" }).click();

    expect(await calls(page)).toContainEqual({
      name: "invite",
      emails: ["alice@example.com", "bob@example.com"],
      role: "reader",
    });
    await expect(page.getByTestId("selected-user-item")).toHaveCount(0);
    // The helper registers invited users as members.
    await expect(page.getByTestId("share-member-item")).toHaveCount(6);
    await expect(page.getByRole("button", { name: "OK" })).toBeVisible();
  });

  test("excludes already selected users from the search results", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await selectUser(page, "alice", "Alice Martin");

    await searchInput(page).pressSequentially("alice");

    await expect(page.getByTestId("search-user-item")).toHaveCount(1);
    await expect(
      page.getByTestId("search-users-list").getByText("Alice Bernard"),
    ).toBeVisible();
    await expect(
      page.getByTestId("search-users-list").getByText("Alice Martin"),
    ).toHaveCount(0);
  });
});
