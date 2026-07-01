import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestStorageGaugeBar } from "../helpers/mount-storage-gauge";

const fillOf = (page: Page) => page.locator(".c__storage-gauge__bar__fill");

// The threshold color is applied as an inline CSS custom property, so read it
// straight off the fill element rather than the resolved computed color.
const fillColorOf = (page: Page) =>
  fillOf(page).evaluate((el) =>
    (el as HTMLElement).style.getPropertyValue("--c--storage-gauge-fill-color"),
  );

const NEUTRAL = "var(--c--contextuals--content--semantic--neutral--secondary)";
const WARNING = "var(--c--contextuals--content--semantic--warning--secondary)";
const ERROR = "var(--c--contextuals--content--semantic--error--secondary)";

test.describe("StorageGaugeBar", () => {
  test("fills proportionally to usage below the warning threshold", async ({
    mount,
    page,
  }) => {
    await mount(<TestStorageGaugeBar used={2.5} total={10} />);

    await expect(fillOf(page)).toHaveAttribute("style", /width:\s*25%/);
    expect(await fillColorOf(page)).toBe(NEUTRAL);
  });

  test("renders an empty fill at 0% usage", async ({ mount, page }) => {
    await mount(<TestStorageGaugeBar used={0} total={10} />);

    await expect(fillOf(page)).toHaveAttribute("style", /width:\s*0%/);
  });

  test("switches to the warning color from 80%", async ({ mount, page }) => {
    await mount(<TestStorageGaugeBar used={8.5} total={10} />);

    await expect(fillOf(page)).toHaveAttribute("style", /width:\s*85%/);
    expect(await fillColorOf(page)).toBe(WARNING);
  });

  test("switches to the error color at 100%", async ({ mount, page }) => {
    await mount(<TestStorageGaugeBar used={10} total={10} />);

    await expect(fillOf(page)).toHaveAttribute("style", /width:\s*100%/);
    expect(await fillColorOf(page)).toBe(ERROR);
  });

  test("caps the fill at 100% when usage exceeds the total", async ({
    mount,
    page,
  }) => {
    await mount(<TestStorageGaugeBar used={15} total={10} />);

    await expect(fillOf(page)).toHaveAttribute("style", /width:\s*100%/);
    expect(await fillColorOf(page)).toBe(ERROR);
  });

  test("renders an empty neutral fill when the total is zero", async ({
    mount,
    page,
  }) => {
    await mount(<TestStorageGaugeBar used={5} total={0} />);

    await expect(fillOf(page)).toHaveAttribute("style", /width:\s*0%/);
    expect(await fillColorOf(page)).toBe(NEUTRAL);
  });
});
