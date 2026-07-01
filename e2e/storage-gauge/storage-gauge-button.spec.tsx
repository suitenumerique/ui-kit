import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestStorageGaugeButton } from "../helpers/mount-storage-gauge";

const buttonOf = (page: Page) => page.locator("button.c__storage-gauge");
const barOf = (page: Page) => page.locator(".c__storage-gauge__bar");
const labelOf = (page: Page) => page.locator(".c__storage-gauge__label");

const calls = (page: Page) =>
  page.evaluate(() => window.__storageGaugeCalls ?? []);

test.describe("StorageGaugeButton", () => {
  test("renders the formatted usage label with the bar", async ({
    mount,
    page,
  }) => {
    await mount(<TestStorageGaugeButton used={1.83} total={10} />);

    // Non-breaking spaces separate the values, so match on the text pieces.
    await expect(labelOf(page)).toContainText("1.83");
    await expect(labelOf(page)).toContainText("10");
    await expect(labelOf(page)).toContainText("Go");
    await expect(barOf(page)).toBeVisible();
  });

  test("respects a custom unit and precision", async ({ mount, page }) => {
    await mount(
      <TestStorageGaugeButton used={1.833} total={10} unit="GB" precision={1} />,
    );

    await expect(labelOf(page)).toContainText("1.8");
    await expect(labelOf(page)).toContainText("GB");
  });

  test("hides the bar in compact mode but keeps the label", async ({
    mount,
    page,
  }) => {
    await mount(<TestStorageGaugeButton used={1.83} total={10} compact />);

    await expect(barOf(page)).toHaveCount(0);
    await expect(labelOf(page)).toBeVisible();
    await expect(buttonOf(page)).toHaveClass(/c__storage-gauge--compact/);
  });

  test("shows the default warning icon and no label when locked", async ({
    mount,
    page,
  }) => {
    await mount(<TestStorageGaugeButton used={1.83} total={10} locked />);

    await expect(buttonOf(page)).toHaveClass(/c__storage-gauge--locked/);
    await expect(page.locator(".c__storage-gauge__locked")).toBeVisible();
    await expect(labelOf(page)).toHaveCount(0);
    await expect(barOf(page)).toHaveCount(0);
  });

  test("renders custom locked content when provided", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestStorageGaugeButton used={1.83} total={10} locked withLockedContent />,
    );

    await expect(page.getByTestId("custom-locked")).toHaveText(
      "Quota exceeded",
    );
  });

  test("invokes onClick when pressed", async ({ mount, page }) => {
    await mount(<TestStorageGaugeButton used={1.83} total={10} clickable />);

    await buttonOf(page).click();

    expect(await calls(page)).toEqual(["click"]);
  });

  test("is a real button element", async ({ mount, page }) => {
    await mount(<TestStorageGaugeButton used={1.83} total={10} clickable />);

    await expect(buttonOf(page)).toHaveAttribute("type", "button");
  });
});
