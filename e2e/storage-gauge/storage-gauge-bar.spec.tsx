import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestStorageGaugeBar } from "../helpers/mount-storage-gauge";

const fillOf = (page: Page) => page.locator(".c__storage-gauge__bar__fill");

const WARNING = /c__storage-gauge__bar__fill--warning/;
const ERROR = /c__storage-gauge__bar__fill--error/;

test.describe("StorageGaugeBar", () => {
  test("fills proportionally to usage below the warning threshold", async ({
    mount,
    page,
  }) => {
    await mount(<TestStorageGaugeBar used={2.5} total={10} />);

    await expect(fillOf(page)).toHaveAttribute("style", /width:\s*25%/);
    await expect(fillOf(page)).not.toHaveClass(WARNING);
    await expect(fillOf(page)).not.toHaveClass(ERROR);
  });

  test("renders an empty fill at 0% usage", async ({ mount, page }) => {
    await mount(<TestStorageGaugeBar used={0} total={10} />);

    await expect(fillOf(page)).toHaveAttribute("style", /width:\s*0%/);
  });

  test("switches to the warning color from 80%", async ({ mount, page }) => {
    await mount(<TestStorageGaugeBar used={8.5} total={10} />);

    await expect(fillOf(page)).toHaveAttribute("style", /width:\s*85%/);
    await expect(fillOf(page)).toHaveClass(WARNING);
  });

  test("switches to the error color at 100%", async ({ mount, page }) => {
    await mount(<TestStorageGaugeBar used={10} total={10} />);

    await expect(fillOf(page)).toHaveAttribute("style", /width:\s*100%/);
    await expect(fillOf(page)).toHaveClass(ERROR);
  });

  test("caps the fill at 100% when usage exceeds the total", async ({
    mount,
    page,
  }) => {
    await mount(<TestStorageGaugeBar used={15} total={10} />);

    await expect(fillOf(page)).toHaveAttribute("style", /width:\s*100%/);
    await expect(fillOf(page)).toHaveClass(ERROR);
  });

  test("renders an empty neutral fill when the total is zero", async ({
    mount,
    page,
  }) => {
    await mount(<TestStorageGaugeBar used={5} total={0} />);

    await expect(fillOf(page)).toHaveAttribute("style", /width:\s*0%/);
    await expect(fillOf(page)).not.toHaveClass(WARNING);
    await expect(fillOf(page)).not.toHaveClass(ERROR);
  });
});
