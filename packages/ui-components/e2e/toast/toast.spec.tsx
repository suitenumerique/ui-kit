import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestStandaloneToast, TestToast } from "../helpers/mount-toast";

// Toasts raised by the provider have no live role: the announcer speaks.
const toastOf = (page: Page) => page.locator(".c__toast");

const callsOf = (page: Page) => page.evaluate(() => window.__toastCalls ?? []);

const announced = (page: Page, politeness: "polite" | "assertive") =>
  page.locator(
    `[data-live-announcer] [aria-live="${politeness}"] > :not(:empty)`,
  );

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
    // Asked for 800ms, held for the 5s minimum.
    await expect(toast).toBeHidden({ timeout: 8000 });
  });

  test("announces each toast once, in order, without moving focus", async ({
    mount,
    page,
  }) => {
    await mount(<TestToast />);
    const trigger = page.getByRole("button", { name: "Stack toast" });
    await trigger.click();
    await trigger.click();

    await expect(announced(page, "polite")).toHaveText([
      "Document 1 moved",
      "Document 2 moved",
    ]);
    await expect(page.getByRole("status")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("announces an error assertively and keeps it until it is closed", async ({
    mount,
    page,
  }) => {
    await mount(<TestToast />);
    await page.getByRole("button", { name: "Show error" }).click();

    await expect(announced(page, "assertive")).toHaveText([
      "The import failed",
    ]);
    await expect(page.getByRole("alert")).toHaveCount(0);

    const toast = toastOf(page);
    await toast.getByRole("button", { name: "Close notification" }).click();
    await expect(toast).toBeHidden();
  });

  test("reaches the toasts with F6 and goes back with Shift+F6", async ({
    mount,
    page,
  }) => {
    await mount(<TestToast />);
    const trigger = page.getByRole("button", { name: "Stack toast" });
    await trigger.click();
    await trigger.click();

    await page.keyboard.press("F6");
    await expect(
      page.getByRole("region", { name: "2 notifications." }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("alertdialog", { name: "Document 2 moved" }),
    ).toBeFocused();

    await page.keyboard.press("Shift+F6");
    await expect(trigger).toBeFocused();
  });

  test("stacks several toasts instead of replacing the previous one", async ({
    mount,
    page,
  }) => {
    await mount(<TestToast />);

    await page.getByRole("button", { name: "Stack toast" }).click();
    await page.getByRole("button", { name: "Stack toast" }).click();

    await expect(toastOf(page)).toHaveCount(2);
    await expect(toastOf(page).getByText("Document 1 moved")).toBeVisible();
    await expect(toastOf(page).getByText("Document 2 moved")).toBeVisible();
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
