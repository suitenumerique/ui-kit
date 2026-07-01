import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestStorageGaugeInformation } from "../helpers/mount-storage-gauge";

const titleOf = (page: Page) =>
  page.locator(".c__storage-gauge__information__title");
const labelOf = (page: Page) =>
  page.locator(".c__storage-gauge__information__label");
const fillOf = (page: Page) => page.locator(".c__storage-gauge__bar__fill");
const moreInfoOf = (page: Page) =>
  page.locator(".c__storage-gauge__information__more-info");

const calls = (page: Page) =>
  page.evaluate(() => window.__storageGaugeCalls ?? []);

test.describe("StorageGaugeInformation", () => {
  test("renders the default title and translated usage label", async ({
    mount,
    page,
  }) => {
    await mount(<TestStorageGaugeInformation used={1.83} total={10} />);

    await expect(titleOf(page)).toHaveText("Used Storage");
    await expect(labelOf(page)).toContainText("1.83 of 10 Go used");
    await expect(fillOf(page)).toHaveAttribute("style", /width:\s*18\.3%/);
  });

  test("overrides the title and label when provided", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestStorageGaugeInformation
        used={1.83}
        total={10}
        title="Custom title"
        label="Custom label"
      />,
    );

    await expect(titleOf(page)).toHaveText("Custom title");
    await expect(labelOf(page)).toContainText("Custom label");
  });

  test("hides the more-info action without a handler", async ({
    mount,
    page,
  }) => {
    await mount(<TestStorageGaugeInformation used={1.83} total={10} />);

    await expect(moreInfoOf(page)).toHaveCount(0);
  });

  test("renders the more-info action when a handler is given", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestStorageGaugeInformation used={1.83} total={10} withMoreInfo />,
    );

    await expect(moreInfoOf(page)).toBeVisible();
  });

  test("invokes onMoreInfoClick when the action is pressed", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestStorageGaugeInformation used={1.83} total={10} withMoreInfo />,
    );

    await moreInfoOf(page).click();

    expect(await calls(page)).toEqual(["more-info"]);
  });

  test("empties the bar when locked regardless of usage", async ({
    mount,
    page,
  }) => {
    await mount(<TestStorageGaugeInformation used={8} total={10} locked />);

    await expect(fillOf(page)).toHaveAttribute("style", /width:\s*0%/);
  });
});
