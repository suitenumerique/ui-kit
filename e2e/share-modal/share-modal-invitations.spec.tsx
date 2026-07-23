import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestShareModal } from "../helpers/mount-share-modal";

const calls = (page: Page) =>
  page.evaluate(() => window.__shareModalCalls ?? []);
const invitationsList = (page: Page) => page.getByTestId("invitations-list");
const invitationRoleButton = (page: Page) =>
  invitationsList(page).getByTestId("access-role-dropdown-button");

test.describe("ShareModal invitations list", () => {
  test("renders the invitation rows under the pending title", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await expect(invitationsList(page)).toBeVisible();
    await expect(page.getByText("Pending invitations")).toBeVisible();
    await expect(page.getByTestId("share-invitation-item")).toHaveCount(1);
    await expect(page.getByText("invited.1@example.com")).toBeVisible();
    await expect(invitationRoleButton(page)).toContainText("Admin");
  });

  test("hides the section when there is no invitation", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal invitationsCount={0} />);

    await expect(page.getByTestId("members-list")).toBeVisible();
    await expect(invitationsList(page)).toHaveCount(0);
  });

  test("changing a role invokes onUpdateInvitation and updates the row", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await invitationRoleButton(page).click();
    await page.getByRole("menuitem", { name: "Reader" }).click();

    expect(await calls(page)).toContainEqual({
      name: "update-invitation",
      id: "1",
      role: "reader",
    });
    await expect(invitationRoleButton(page)).toContainText("Reader");
  });

  test("deleting the last invitation removes the section", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await invitationRoleButton(page).click();
    await page.getByRole("menuitem", { name: "Remove access" }).click();

    expect(await calls(page)).toContainEqual({
      name: "delete-invitation",
      id: "1",
    });
    await expect(invitationsList(page)).toHaveCount(0);
    await expect(page.getByTestId("members-list")).toBeVisible();
  });

  test("shows more invitations on demand", async ({ mount, page }) => {
    await mount(<TestShareModal hasNextInvitations />);

    await invitationsList(page)
      .getByRole("button", { name: "Show more" })
      .click();

    expect(await calls(page)).toContainEqual({
      name: "load-next-invitations",
    });
  });

  test("read-only mode renders a static role label", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal canUpdate={false} />);

    await expect(
      invitationsList(page).locator(
        ".c__access-role-dropdown__role-label-can-not-update",
      ),
    ).toHaveText("Admin");
    await expect(invitationRoleButton(page)).toHaveCount(0);
  });
});
