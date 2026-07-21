import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestShareModal } from "../helpers/mount-share-modal";

const calls = (page: Page) =>
  page.evaluate(() => window.__shareModalCalls ?? []);
const reachButton = (page: Page) =>
  page.getByTestId("share-link-reach-dropdown-button");
const roleButton = (page: Page) =>
  page.getByTestId("share-link-role-dropdown-button");
// Both a desktop and a mobile description are in the DOM; CSS hides one.
const reachDescription = (page: Page) =>
  page.locator(".c__share-modal__link-settings__content__description.desktop");

test.describe("ShareModal link settings and footer", () => {
  test("renders the reach and role with their initial values", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal linkSettings />);

    await expect(page.getByTestId("share-link-settings")).toBeVisible();
    await expect(page.getByText("Link settings")).toBeVisible();
    await expect(reachButton(page)).toContainText("Public");
    await expect(reachDescription(page)).toHaveText(
      "Anyone with the link can access the document",
    );
    await expect(roleButton(page)).toContainText("Reader");
  });

  test("changing the reach invokes onUpdateLinkReach and updates the description", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal linkSettings />);

    await reachButton(page).click();
    await page.getByRole("menuitem", { name: "Private" }).click();

    expect(await calls(page)).toContainEqual({
      name: "update-link-reach",
      value: "restricted",
    });
    await expect(reachButton(page)).toContainText("Private");
    await expect(reachDescription(page)).toHaveText(
      "Only users of the space can access the document",
    );
  });

  test("changing the role invokes onUpdateLinkRole", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal linkSettings />);

    await roleButton(page).click();
    await page.getByRole("menuitem", { name: "Editor" }).click();

    expect(await calls(page)).toContainEqual({
      name: "update-link-role",
      value: "editor",
    });
    await expect(roleButton(page)).toContainText("Editor");
  });

  test("hides the role dropdown when showLinkRole is false", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal linkSettings showLinkRole={false} />);

    await expect(reachButton(page)).toBeVisible();
    await expect(roleButton(page)).toHaveCount(0);
  });

  test("hides the role dropdown when linkRoleChoices is empty", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal linkSettings withLinkRoleChoices={false} />);

    await expect(reachButton(page)).toBeVisible();
    await expect(roleButton(page)).toHaveCount(0);
  });

  test("shows the top messages inside the open dropdowns", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal linkSettings withTopLinkMessages />);

    await reachButton(page).click();
    await expect(page.getByText("Top link reach message")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByText("Top link reach message")).toHaveCount(0);

    await roleButton(page).click();
    await expect(page.getByText("Top link role message")).toBeVisible();
  });

  test("read-only mode renders disabled values without dropdowns", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal linkSettings canUpdate={false} />);

    await expect(
      page.locator(
        ".c__share-modal__link-settings__content__select__value.disabled",
      ),
    ).toHaveText("Public");
    await expect(
      page.locator(
        ".c__share-modal__link-settings__content__select-role__value.disabled",
      ),
    ).toHaveText("Reader");
    await expect(reachButton(page)).toHaveCount(0);
    await expect(roleButton(page)).toHaveCount(0);
  });

  test("renders no link settings section by default", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await expect(page.getByTestId("members-list")).toBeVisible();
    await expect(page.getByTestId("share-link-settings")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "OK" })).toBeVisible();
  });

  test("applies customTranslations overrides", async ({ mount, page }) => {
    await mount(
      <TestShareModal
        linkSettings
        customTranslations={{
          "components.share.linkSettings.title": "Custom link title",
        }}
      />,
    );

    await expect(page.getByText("Custom link title")).toBeVisible();
    await expect(page.getByText("Link settings")).toHaveCount(0);
  });

  test("the footer buttons invoke onCopyLink and onOk", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal />);

    await page.getByRole("button", { name: "Copy link" }).click();
    await page.getByRole("button", { name: "OK" }).click();

    expect(await calls(page)).toEqual([
      { name: "copy-link" },
      { name: "ok" },
    ]);
  });

  test("hides the footer while searching and restores it after", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal linkSettings />);

    await page.getByRole("combobox").pressSequentially("alice");
    await expect(page.getByTestId("search-users-list")).toBeVisible();
    await expect(page.getByRole("button", { name: "OK" })).toHaveCount(0);
    await expect(page.getByTestId("share-link-settings")).toHaveCount(0);

    await page.getByRole("combobox").fill("");

    await expect(page.getByRole("button", { name: "OK" })).toBeVisible();
    await expect(page.getByTestId("share-link-settings")).toBeVisible();
  });
});
