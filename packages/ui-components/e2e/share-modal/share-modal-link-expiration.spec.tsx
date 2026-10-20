import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestShareModal } from "../helpers/mount-share-modal";

const calls = (page: Page) =>
  page.evaluate(() => window.__shareModalCalls ?? []);
const roleButton = (page: Page) =>
  page.getByTestId("share-link-role-dropdown-button");
const expirationMenu = (page: Page) =>
  page.getByRole("menuitem", { name: "Link expires" });
const picker = (page: Page) => page.getByTestId("share-link-expiration-picker");

// The test runs in the same time zone as the browser, so the expected
// expirations are computed the same way the component does: end of the day.
const endOfDayInDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(23, 59, 59, 0);
  return date;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);

test.describe("ShareModal link expiration", () => {
  test("shows the expiration date next to the link role", async ({
    mount,
    page,
  }) => {
    const expiresAt = endOfDayInDays(10);
    await mount(
      <TestShareModal
        linkSettings
        withLinkExpiration
        linkExpiresAt={expiresAt.toISOString()}
      />,
    );

    await expect(roleButton(page)).toHaveText(
      `Reader until ${formatDate(expiresAt)}`,
    );
  });

  test("shows the expiration date in read-only mode", async ({
    mount,
    page,
  }) => {
    const expiresAt = endOfDayInDays(10);
    await mount(
      <TestShareModal
        linkSettings
        canUpdate={false}
        linkExpiresAt={expiresAt.toISOString()}
      />,
    );

    await expect(
      page.locator(
        ".c__share-modal__link-settings__content__select-role__value.disabled",
      ),
    ).toHaveText(`Reader until ${formatDate(expiresAt)}`);
  });

  test("hides the submenu without onUpdateLinkExpiresAt", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal linkSettings />);

    await roleButton(page).click();
    await expect(page.getByRole("menuitem", { name: "Editor" })).toBeVisible();
    await expect(expirationMenu(page)).toHaveCount(0);
  });

  test("a preset sets the expiration to the end of that day", async ({
    mount,
    page,
  }) => {
    // 1. Open the link role dropdown, then the "Link expires" submenu.
    await mount(<TestShareModal linkSettings withLinkExpiration />);
    await roleButton(page).click();
    await expirationMenu(page).click();

    // 2. "Never" is checked as long as the link has no expiration.
    const never = page.getByRole("menuitem", { name: "Never" });
    await expect(never.locator(".c__dropdown-menu-item__check")).toBeVisible();

    // 3. Picking a preset sends the end of the matching day.
    await page.getByRole("menuitem", { name: "7 days" }).click();
    const expected = endOfDayInDays(7);
    expect(await calls(page)).toContainEqual({
      name: "update-link-expires-at",
      value: expected.toISOString(),
    });
    await expect(roleButton(page)).toHaveText(
      `Reader until ${formatDate(expected)}`,
    );
    // The role itself must not be touched by the submenu.
    expect(
      (await calls(page)).filter((call) => call.name === "update-link-role"),
    ).toHaveLength(0);
  });

  test("Never removes the expiration", async ({ mount, page }) => {
    await mount(
      <TestShareModal
        linkSettings
        withLinkExpiration
        linkExpiresAt={endOfDayInDays(3).toISOString()}
      />,
    );

    await roleButton(page).click();
    await expirationMenu(page).click();
    await page.getByRole("menuitem", { name: "Never" }).click();

    expect(await calls(page)).toContainEqual({
      name: "update-link-expires-at",
      value: null,
    });
    await expect(roleButton(page)).toHaveText("Reader");
  });

  test("Never does nothing when the link already never expires", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal linkSettings withLinkExpiration />);

    await roleButton(page).click();
    await expirationMenu(page).click();
    await page.getByRole("menuitem", { name: "Never" }).click();

    expect(await calls(page)).toEqual([]);
  });

  test("Choose date opens a calendar to pick a custom date", async ({
    mount,
    page,
  }) => {
    // 1. Open the calendar from the submenu.
    await mount(<TestShareModal linkSettings withLinkExpiration />);
    await roleButton(page).click();
    await expirationMenu(page).click();
    await page.getByRole("menuitem", { name: "Choose date" }).click();
    await expect(picker(page)).toBeVisible();

    // 2. Pick the 15th of next month, always in the future, and confirm.
    const target = new Date();
    target.setDate(1);
    target.setMonth(target.getMonth() + 1);
    target.setDate(15);
    await picker(page).getByRole("button", { name: "Next month" }).click();
    const monthName = target.toLocaleString("en-US", { month: "long" });
    await picker(page)
      .getByRole("button", {
        name: new RegExp(`${monthName} 15, ${target.getFullYear()}`),
      })
      .click();
    await picker(page).getByRole("button", { name: "OK" }).click();

    // 3. The end of the picked day is sent and the calendar closes.
    target.setHours(23, 59, 59, 0);
    expect(await calls(page)).toContainEqual({
      name: "update-link-expires-at",
      value: target.toISOString(),
    });
    await expect(picker(page)).toHaveCount(0);
    await expect(roleButton(page)).toHaveText(
      `Reader until ${formatDate(target)}`,
    );
  });

  test("cancelling the calendar keeps the expiration", async ({
    mount,
    page,
  }) => {
    await mount(<TestShareModal linkSettings withLinkExpiration />);
    await roleButton(page).click();
    await expirationMenu(page).click();
    await page.getByRole("menuitem", { name: "Choose date" }).click();

    await picker(page).getByRole("button", { name: "Cancel" }).click();

    await expect(picker(page)).toHaveCount(0);
    expect(await calls(page)).toEqual([]);
    await expect(roleButton(page)).toHaveText("Reader");
  });
});
