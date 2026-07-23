import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestShareModal } from "../helpers/mount-share-modal";

// Kept in sync with ADMIN_TOP_MESSAGE in the mount helper: Playwright CT
// specs can only import components from files containing JSX.
const ADMIN_TOP_MESSAGE = "You cannot change the role of an administrator";

const calls = (page: Page) =>
  page.evaluate(() => window.__shareModalCalls ?? []);
const memberItems = (page: Page) => page.getByTestId("share-member-item");
const memberRoleButton = (page: Page, index: number) =>
  memberItems(page).nth(index).getByTestId("access-role-dropdown-button");

test.describe("ShareModal members list", () => {
  test("renders the member rows with names, emails and current roles", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await expect(memberItems(page)).toHaveCount(4);
    await expect(page.getByText("Shared between 4 people")).toBeVisible();
    await expect(page.getByText("John Doe 1")).toBeVisible();
    await expect(page.getByText("john.doe.1@example.com")).toBeVisible();
    await expect(memberRoleButton(page, 0)).toContainText("Reader");
    await expect(memberRoleButton(page, 1)).toContainText("Admin");
  });

  test("uses the singular title with a single member", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal membersCount={1} />);

    await expect(page.getByText("Shared between 1 person")).toBeVisible();
  });

  test("changing a role invokes onUpdateAccess and updates the row", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await memberRoleButton(page, 0).click();
    await page.getByRole("menuitem", { name: "Editor" }).click();

    expect(await calls(page)).toContainEqual({
      name: "update-access",
      id: "1",
      role: "editor",
    });
    await expect(memberRoleButton(page, 0)).toContainText("Editor");
  });

  test("getAccessRoles disables options per member", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    // Member 2 is an admin: only the Admin role stays enabled.
    await memberRoleButton(page, 1).click();

    await expect(
      page.getByRole("menuitem", { name: "Editor" }),
    ).toHaveAttribute("aria-disabled", "true");
    await expect(
      page.getByRole("menuitem", { name: "Reader" }),
    ).toHaveAttribute("aria-disabled", "true");
    await expect(
      page.getByRole("menuitem", { name: "Admin" }),
    ).not.toHaveAttribute("aria-disabled", "true");

    // Playwright refuses to click aria-disabled elements; dispatch the event
    // directly to prove the option really is inert.
    await page.getByRole("menuitem", { name: "Editor" }).dispatchEvent("click");

    expect(
      (await calls(page)).filter((call) => call.name === "update-access"),
    ).toEqual([]);
    await expect(memberRoleButton(page, 1)).toContainText("Admin");
  });

  test("shows the accessRoleTopMessage only for admins", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal withAccessRoleTopMessage />);

    await memberRoleButton(page, 1).click();
    await expect(page.getByText(ADMIN_TOP_MESSAGE)).toBeVisible();
    await page.keyboard.press("Escape");

    await memberRoleButton(page, 0).click();
    await expect(page.getByRole("menuitem", { name: "Admin" })).toBeVisible();
    await expect(page.getByText(ADMIN_TOP_MESSAGE)).toHaveCount(0);
  });

  test("deleting a member invokes onDeleteAccess and removes the row", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await memberRoleButton(page, 1).click();
    await page.getByRole("menuitem", { name: "Remove access" }).click();

    expect(await calls(page)).toContainEqual({
      name: "delete-access",
      id: "2",
    });
    await expect(memberItems(page)).toHaveCount(3);
    await expect(page.getByText("Shared between 3 people")).toBeVisible();
  });

  test("disables the deletion when can_delete is false", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    // Member 1 is seeded with can_delete: false.
    await memberRoleButton(page, 0).click();

    await expect(
      page.getByRole("menuitem", { name: "Remove access" }),
    ).toHaveAttribute("aria-disabled", "true");

    // Playwright refuses to click aria-disabled elements; dispatch the event
    // directly to prove the option really is inert.
    await page
      .getByRole("menuitem", { name: "Remove access" })
      .dispatchEvent("click");

    expect(
      (await calls(page)).filter((call) => call.name === "delete-access"),
    ).toEqual([]);
    await expect(memberItems(page)).toHaveCount(4);
  });

  test("shows more members on demand", async ({ mount, page }) => {
    await mount(<TestShareModal hasNextMembers />);

    await page
      .getByTestId("members-list")
      .getByRole("button", { name: "Show more" })
      .click();

    expect(await calls(page)).toContainEqual({ name: "load-next-members" });
  });

  test("hides the show-more button without a next page", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await expect(page.getByTestId("members-list")).toBeVisible();
    await expect(
      page
        .getByTestId("members-list")
        .getByRole("button", { name: "Show more" }),
    ).toHaveCount(0);
  });

  test("read-only mode renders static role labels", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal canUpdate={false} />);

    const staticLabels = page
      .getByTestId("members-list")
      .locator(".c__access-role-dropdown__role-label-can-not-update");
    await expect(staticLabels).toHaveCount(4);
    await expect(staticLabels.first()).toHaveText("Reader");
    await expect(
      page
        .getByTestId("members-list")
        .getByTestId("access-role-dropdown-button"),
    ).toHaveCount(0);
  });
});
