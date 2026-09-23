import { test, expect } from "@playwright/experimental-ct-react";
import { TestShareModal } from "../helpers/mount-share-modal";

test("preserves member extensions and children across search transitions", async ({
  mount,
  page,
}) => {
  await mount(<TestShareModal withAccessExtensions withChildren />);
  await expect(page.getByText("Team (4)")).toBeVisible();
  await page
    .getByRole("button", { name: "Assign John Doe 2", exact: true })
    .click();
  const assignedRow = page.locator(".c__share-member-item.test-assigned");
  await expect(assignedRow).toContainText("John Doe 2");
  await expect(page.getByTestId("access-footer")).toHaveText(
    "Assigned: John Doe 2",
  );
  await expect(page.getByTestId("share-children")).toBeVisible();

  await page.getByRole("combobox").fill("alice");
  await expect(page.getByTestId("search-users-list")).toBeVisible();
  await expect(page.getByTestId("share-children")).toHaveCount(0);
  await expect(page.getByTestId("access-footer")).toHaveCount(0);
  await page.getByRole("combobox").fill("");

  await expect(page.getByTestId("share-children")).toBeVisible();
  await expect(assignedRow).toContainText("John Doe 2");
  await expect(page.getByTestId("access-footer")).toBeVisible();
});

test("supports known-user selection without offering email invitations", async ({
  mount,
  page,
}) => {
  await mount(
    <TestShareModal
      hideInvitations
      allowInvitation={false}
      searchGroupName="Suggested users"
    />,
  );
  await page.getByRole("combobox").fill("new.person@example.com");
  await expect(page.getByText("Suggested users")).toBeVisible();
  await expect(page.getByText("No result")).toBeVisible();
  await expect(page.getByTestId("search-user-item")).toHaveCount(0);

  await page.getByRole("combobox").fill("alice");
  await page
    .getByTestId("search-users-list")
    .getByText("Alice Martin", { exact: true })
    .click();
  await page.getByTestId("share-invite-button").click();
  await expect(
    page.getByTestId("members-list").getByText("Alice Martin"),
  ).toBeVisible();
  await expect(page.getByTestId("invitations-list")).toHaveCount(0);
});

test("forwards the custom search placeholder", async ({ mount, page }) => {
  await mount(<TestShareModal searchPlaceholder="Find a teammate" />);
  await expect(page.getByRole("combobox")).toHaveAttribute(
    "placeholder",
    "Find a teammate",
  );
});

test("keeps the footer and search controls reachable after resizing to mobile", async ({
  mount,
  page,
}) => {
  await mount(<TestShareModal linkSettings />);
  await page.setViewportSize({ width: 390, height: 844 });
  const input = page.getByRole("combobox");
  for (const [query, name] of [
    ["christopher", "Christopher Martin"],
    ["charlotte", "Charlotte Dubois"],
    ["amandine", "Amandine Salambo"],
  ]) {
    await input.fill(query);
    await page.getByTestId("search-users-list").getByText(name).click();
  }
  const share = page.getByTestId("share-invite-button");
  await expect(share).toBeInViewport();
  await expect(input).toBeInViewport();
  await share.click();
  await expect(
    page.getByRole("button", { name: "OK", exact: true }),
  ).toBeInViewport();
  await expect(page.getByTestId("share-link-settings")).toBeInViewport();
  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(
    page.getByRole("button", { name: "OK", exact: true }),
  ).toBeInViewport();
});
