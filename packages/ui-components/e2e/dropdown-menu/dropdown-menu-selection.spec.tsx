import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestDropdownMenu } from "../helpers/mount-dropdown-menu";

const open = (page: Page) =>
  page.getByRole("button", { name: "Actions" }).click();
const menu = (page: Page) => page.getByRole("menu");
const radio = (page: Page, name: string) =>
  page.getByRole("menuitemradio", { name });
const checkbox = (page: Page, name: string) =>
  page.getByRole("menuitemcheckbox", { name });

test.describe("DropdownMenu - selection", () => {
  test("exposes selectable items as checked radio items", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestDropdownMenu scenario="selection" initialValues={["commenter"]} />,
    );
    await open(page);

    await expect(page.getByRole("menuitemradio")).toHaveCount(4);
    await expect(radio(page, "Commenter")).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(radio(page, "Reader")).toHaveAttribute(
      "aria-checked",
      "false",
    );
    await expect(radio(page, "Reader")).toHaveAccessibleDescription(
      "Can view",
    );
    await expect(radio(page, "Administrator")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  test("reports the picked value, then runs the item callback", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestDropdownMenu scenario="selection" initialValues={["reader"]} />,
    );
    await open(page);
    await radio(page, "Editor").click();

    await expect(menu(page)).toHaveCount(0);
    await expect(page.getByLabel("Selected")).toHaveText("editor");
    await expect(page.getByLabel("Last action")).toHaveText("editor callback");

    await open(page);
    await expect(radio(page, "Editor")).toHaveAttribute("aria-checked", "true");
    await expect(radio(page, "Reader")).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  test("reports the value again when the checked item is picked", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestDropdownMenu scenario="selection" initialValues={["reader"]} />,
    );
    await open(page);
    await radio(page, "Reader").click();

    await expect(page.getByLabel("Last action")).toHaveText("select reader");
    await expect(page.getByLabel("Selected")).toHaveText("reader");
  });

  test("keeps action items as plain menu items next to a selection", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestDropdownMenu scenario="mixed" initialValues={["reader"]} />,
    );
    await open(page);

    await expect(page.getByRole("menuitemradio")).toHaveCount(4);
    const remove = page.getByRole("menuitem", { name: "Remove access" });
    await expect(remove).toBeVisible();
    await expect(remove).not.toHaveAttribute("aria-checked");

    await remove.click();
    await expect(page.getByLabel("Last action")).toHaveText("remove");
    await expect(page.getByLabel("Selected")).toHaveText("reader");
  });

  test("exposes checkbox items and stays open in multiple mode", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestDropdownMenu
        scenario="selection"
        multiple
        initialValues={["reader"]}
      />,
    );
    await open(page);

    await expect(page.getByRole("menuitemcheckbox")).toHaveCount(4);
    await checkbox(page, "Commenter").click();

    await expect(menu(page)).toBeVisible();
    await expect(page.getByLabel("Selected")).toHaveText("reader,commenter");
    await expect(checkbox(page, "Commenter")).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(checkbox(page, "Reader")).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  test("treats isChecked items as selectable and honours keepOpen", async ({
    mount,
    page,
  }) => {
    await mount(<TestDropdownMenu scenario="checked" />);
    await open(page);

    await expect(radio(page, "Name")).toHaveAttribute("aria-checked", "true");
    await radio(page, "Size").click();

    await expect(menu(page)).toBeVisible();
    await expect(page.getByLabel("Sort")).toHaveText("size");
    await expect(radio(page, "Size")).toHaveAttribute("aria-checked", "true");
    await expect(radio(page, "Name")).toHaveAttribute("aria-checked", "false");
  });

  test("gives each run of selectable items split by a separator its own group", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestDropdownMenu scenario="sort-groups" initialValues={["name", "asc"]} />,
    );
    await open(page);

    await expect(menu(page)).toMatchAriaSnapshot(`
      - menu:
        - group:
          - menuitemradio "Name" [checked]
          - menuitemradio "Date"
        - group:
          - menuitemradio "Ascending" [checked]
          - menuitemradio "Descending"
    `);
  });

  test("shows a checkmark and a bold label on the checked item", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestDropdownMenu scenario="selection" initialValues={["editor"]} />,
    );
    await open(page);

    const editor = radio(page, "Editor");
    await expect(editor.locator(".c__dropdown-menu-item__check")).toHaveCount(1);
    await expect(page.locator(".c__dropdown-menu-item__check")).toHaveCount(1);

    const weightOf = (name: string) =>
      radio(page, name)
        .locator(".c__dropdown-menu-item__label")
        .evaluate((label) => Number(getComputedStyle(label).fontWeight));
    expect(await weightOf("Editor")).toBeGreaterThan(await weightOf("Reader"));
  });
});
