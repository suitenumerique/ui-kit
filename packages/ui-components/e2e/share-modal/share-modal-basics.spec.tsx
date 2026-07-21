import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestShareModal } from "../helpers/mount-share-modal";

const calls = (page: Page) =>
  page.evaluate(() => window.__shareModalCalls ?? []);
const searchInput = (page: Page) => page.getByRole("combobox");

test.describe("ShareModal shell and view modes", () => {
  test("renders the default title, lists, search and footer", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await expect(page.getByText("Share folder")).toBeVisible();
    await expect(page.getByTestId("members-list")).toBeVisible();
    await expect(page.getByTestId("share-member-item")).toHaveCount(4);
    await expect(page.getByText("Pending invitations")).toBeVisible();
    await expect(searchInput(page)).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy link" })).toBeVisible();
    await expect(page.getByRole("button", { name: "OK" })).toBeVisible();
  });

  test("uses a custom modal title", async ({ mount, page }) => {
    await mount(<TestShareModal modalTitle="Partager" />);

    await expect(page.getByText("Partager")).toBeVisible();
    await expect(page.getByText("Share folder")).toHaveCount(0);
  });

  test("invokes onClose when pressing Escape", async ({ mount, page }) => {
    await mount(<TestShareModal />);

    await expect(page.getByText("Share folder")).toBeVisible();
    await page.keyboard.press("Escape");

    expect(await calls(page)).toContainEqual({ name: "close" });
  });

  test("cannot-view mode shows the message and children and hides the search", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestShareModal
        canView={false}
        canUpdate={false}
        withCannotViewChildren
      />,
    );

    await expect(
      page.getByText(
        "You can view this item but you need additional access to view its members or modify the settings.",
      ),
    ).toBeVisible();
    await expect(page.getByTestId("cannot-view-children")).toBeVisible();
    await expect(searchInput(page)).toHaveCount(0);
    await expect(page.getByTestId("members-list")).toHaveCount(0);
  });

  test("cannot-view mode uses a custom message", async ({ mount, page }) => {
    await mount(
      <TestShareModal
        canView={false}
        canUpdate={false}
        cannotViewMessage="Custom denied"
      />,
    );

    await expect(page.getByText("Custom denied")).toBeVisible();
  });

  test("empty mode renders neither search nor lists but keeps the footer", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal hideMembers hideInvitations />);

    await expect(page.getByText("Share folder")).toBeVisible();
    await expect(searchInput(page)).toHaveCount(0);
    await expect(page.getByTestId("members-list")).toHaveCount(0);
    await expect(page.getByTestId("invitations-list")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "OK" })).toBeVisible();
  });

  test("read-only mode hides the search input and renders static roles", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal canUpdate={false} linkSettings />);

    await expect(page.getByTestId("members-list")).toBeVisible();
    await expect(searchInput(page)).toHaveCount(0);
    await expect(
      page
        .getByTestId("members-list")
        .locator(".c__access-role-dropdown__role-label-can-not-update"),
    ).toHaveCount(4);
    await expect(page.getByTestId("access-role-dropdown-button")).toHaveCount(
      0,
    );
    await expect(
      page.getByTestId("share-link-reach-dropdown-button"),
    ).toHaveCount(0);
  });

  test("hiding members alone keeps the search and invitations", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal hideMembers />);

    await expect(searchInput(page)).toBeVisible();
    await expect(page.getByTestId("invitations-list")).toBeVisible();
    await expect(page.getByTestId("members-list")).toHaveCount(0);
  });
});
