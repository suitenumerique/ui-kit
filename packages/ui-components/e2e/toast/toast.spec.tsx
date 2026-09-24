import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestStandaloneToast, TestToast } from "../helpers/mount-toast";

const toastOf = (page: Page) => page.getByRole("alert");

const callsOf = (page: Page) => page.evaluate(() => window.__toastCalls ?? []);

test.describe("Toast", () => {
  test("shows a toast in the real browser", async ({ mount, page }) => {
    await mount(<TestToast />);

    await expect(toastOf(page)).toHaveCount(0);
    await page.getByRole("button", { name: "Show toast" }).click();

    const toast = toastOf(page);
    await expect(toast).toBeVisible();
    await expect(toast).toContainText("Document moved");
    await expect(toast).toContainText("15%");
  });

  test("dismisses a toast through the id returned by toast()", async ({
    mount,
    page,
  }) => {
    await mount(<TestToast />);
    await page.getByRole("button", { name: "Show toast" }).click();

    const toast = toastOf(page);
    await expect(toast).toBeVisible();

    await page.getByRole("button", { name: "Dismiss" }).click();
    await expect(toast).toBeHidden();
  });

  test("disappears after its duration", async ({ mount, page }) => {
    await mount(<TestToast />);
    await page.getByRole("button", { name: "Show fading toast" }).click();

    const toast = toastOf(page);
    await expect(toast).toBeVisible();
    await expect(toast).toBeHidden({ timeout: 5000 });
  });

  test("stacks several toasts instead of replacing the previous one", async ({
    mount,
    page,
  }) => {
    await mount(<TestToast />);

    await page.getByRole("button", { name: "Stack toast" }).click();
    await page.getByRole("button", { name: "Stack toast" }).click();

    await expect(toastOf(page)).toHaveCount(2);
    await expect(page.getByText("Document 1 moved")).toBeVisible();
    await expect(page.getByText("Document 2 moved")).toBeVisible();
  });

  test("renders actions and records their clicks", async ({ mount, page }) => {
    await mount(<TestToast />);
    await page.getByRole("button", { name: "Show actions" }).click();

    const toast = toastOf(page);
    await expect(toast.getByRole("button", { name: "See" })).toBeVisible();

    await toast.getByRole("button", { name: "See" }).click();
    expect(await callsOf(page)).toEqual(["see"]);

    await toast.getByRole("button", { name: "Cancel" }).click();
    expect(await callsOf(page)).toEqual(["see", "cancel"]);
    await expect(toast).toBeHidden();
  });

  test("rebuilds the toast from the kit props when updating it", async ({
    mount,
    page,
  }) => {
    await mount(<TestToast />);
    await page.getByRole("button", { name: "Show toast" }).click();

    const toast = toastOf(page);
    await expect(toast).toHaveClass(/c__toast--info/);
    await expect(toast).toContainText("15%");

    await page.getByRole("button", { name: "Update toast" }).click();

    await expect(toast).toContainText("Document uploaded");
    await expect(toast).toContainText("100%");
    await expect(toast).toHaveClass(/c__toast--success/);
    await expect(toast).not.toHaveClass(/c__toast--info/);
  });

  // jsdom has no `getAnimations`, so the fade-out the standalone toast waits on
  // before calling `onDelete` can only be checked in a real browser.
  test("dismisses itself and calls onDelete when mounted on its own", async ({
    mount,
    page,
  }) => {
    await mount(<TestStandaloneToast />);

    const toast = toastOf(page);
    await expect(toast).toContainText("Standalone toast");

    await expect(page.getByText("deleted")).toBeVisible();
    expect(await callsOf(page)).toEqual(["deleted"]);
  });
});
