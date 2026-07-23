import { test, expect } from "@playwright/experimental-ct-react";
import { CunninghamProvider } from "../../src/components/Provider/Provider";
import { ShareModalExample } from "../../src/components/share/modal/stories/ShareModalExample";

test.describe("ShareModal import menu", () => {
  test("opens the import modal from the ... menu and hides it when not allowed", async ({
    mount,
    page,
  }) => {
    await mount(
      <CunninghamProvider currentLocale="en-US">
        <ShareModalExample allowFileImport={true} />
      </CunninghamProvider>,
    );

    const kebab = page.getByRole("button", { name: "Import contacts" });
    await expect(kebab).toBeVisible();
    await kebab.click();

    await page.getByRole("menuitem", { name: "Import contacts" }).click();

    await expect(
      page.getByText(
        "Upload a CSV or XLS file with your contacts, or start from our template.",
      ),
    ).toBeVisible();
  });

  test("shows no ... button without allowFileImport or without canUpdate", async ({
    mount,
    page,
  }) => {
    await mount(
      <CunninghamProvider currentLocale="en-US">
        <ShareModalExample />
      </CunninghamProvider>,
    );

    await expect(page.getByTestId("members-list")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Import contacts" }),
    ).toHaveCount(0);
  });

  test("shows no ... button when canUpdate is false", async ({
    mount,
    page,
  }) => {
    await mount(
      <CunninghamProvider currentLocale="en-US">
        <ShareModalExample allowFileImport={true} canUpdate={false} />
      </CunninghamProvider>,
    );

    await expect(page.getByTestId("members-list")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Import contacts" }),
    ).toHaveCount(0);
  });
});
