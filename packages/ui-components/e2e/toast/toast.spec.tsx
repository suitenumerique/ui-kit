import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestToast } from "../helpers/mount-toast";

const toastOf = (page: Page) => page.getByRole("alert");

const callsOf = (page: Page) =>
  page.evaluate(() => window.__toastCalls ?? []);

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

  test("lists extended items and collapses the list", async ({
    mount,
    page,
  }) => {
    await mount(<TestToast />);
    await page.getByRole("button", { name: "Show extended" }).click();

    const toast = toastOf(page);
    await expect(toast).toContainText("2 documents in transfer");
    await expect(toast).toContainText("15%");
    await expect(toast.getByRole("listitem")).toHaveCount(2);
    await expect(toast.getByText("Report")).toBeVisible();

    await toast.getByRole("button", { name: "Collapse" }).click();
    await expect(toast.getByRole("listitem")).toHaveCount(0);
    await expect(toast.getByRole("button", { name: "Expand" })).toBeVisible();

    await toast.getByRole("button", { name: "Close" }).click();
    await expect(toast).toBeHidden();
  });
});
