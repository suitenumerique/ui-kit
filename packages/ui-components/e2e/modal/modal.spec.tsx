import { test, expect } from "@playwright/experimental-ct-react";
import { TestModal, TestTabModal } from "../helpers/mount-modal";

test.describe("Modal", () => {
  test("names and describes the dialog with its title and subtitle", async ({
    mount,
    page,
  }) => {
    await mount(<TestModal titleIcon />);
    await page.getByRole("button", { name: "Open modal" }).click();

    const dialog = page.getByRole("dialog", {
      name: "Delete the file",
      exact: true,
    });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog).toHaveAccessibleDescription(
      "This action cannot be undone.",
    );
    await expect(
      dialog.getByRole("heading", { level: 2, name: "Delete the file" }),
    ).toBeVisible();
  });

  test("translates the close button", async ({ mount, page }) => {
    await mount(<TestModal locale="fr-FR" />);
    await page.getByRole("button", { name: "Open modal" }).click();
    await expect(
      page.getByRole("button", { name: "Fermer", exact: true }),
    ).toBeVisible();
  });

  test("traps the focus and restores it on Escape", async ({ mount, page }) => {
    await mount(<TestModal />);
    const trigger = page.getByRole("button", { name: "Open modal" });
    await trigger.click();

    const dialog = page.getByRole("dialog");
    const close = dialog.getByRole("button", { name: "Close", exact: true });
    const confirm = dialog.getByRole("button", { name: "Confirm" });

    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(confirm).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(confirm).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
});

test.describe("Modal tab variant", () => {
  test("names the dialog, the tab list and the panel", async ({
    mount,
    page,
  }) => {
    await mount(<TestTabModal />);
    await page.getByRole("button", { name: "Open settings" }).click();

    await expect(page.getByRole("dialog", { name: "Settings" })).toBeVisible();
    await expect(page.getByRole("tablist", { name: "Settings" })).toBeVisible();
    await expect(
      page.getByRole("tabpanel", { name: "General" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 3, name: "General" }),
    ).toBeVisible();
  });

  test("moves between tabs with the keyboard", async ({ mount, page }) => {
    await mount(<TestTabModal />);
    await page.getByRole("button", { name: "Open settings" }).click();

    const general = page.getByRole("tab", { name: "General" });
    const privacy = page.getByRole("tab", { name: "Privacy" });
    const notifications = page.getByRole("tab", { name: "Notifications" });
    await general.focus();

    await page.keyboard.press("ArrowDown");
    await expect(privacy).toBeFocused();
    await expect(general).toHaveAttribute("aria-selected", "true");
    // The focused tab is not the selected one: the ring, not the gray fill,
    // has to show where the focus is.
    await expect(privacy).toHaveCSS("outline-style", "solid");
    await expect(privacy).toHaveCSS("outline-width", "2px");
    await expect(privacy).toHaveCSS("outline-offset", "2px");
    await page.keyboard.press("End");
    await expect(notifications).toBeFocused();
    await page.keyboard.press("Home");
    await expect(general).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(privacy).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel", { name: "Privacy" })).toHaveText(
      "Privacy content",
    );

    // A single tab stop: Tab leaves the tab list
    await privacy.focus();
    await page.keyboard.press("Tab");
    await expect(page.locator('[role="tab"]:focus')).toHaveCount(0);
  });

  test("keeps the focus in the visible half on small screens", async ({
    mount,
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await mount(<TestTabModal />);
    await page.getByRole("button", { name: "Open settings" }).click();

    const dialog = page.getByRole("dialog");
    const sidebar = dialog.locator(".c__modal__tab-sidebar");
    const content = dialog.locator(".c__modal__tab-content");
    const back = dialog.getByRole("button", { name: "Back to tabs" });
    const save = dialog.getByRole("button", { name: "Save" });

    // Only the visible half is reachable
    await expect(content).toHaveAttribute("inert", "");
    await expect(sidebar).not.toHaveAttribute("inert");

    await dialog.getByRole("tab", { name: "Privacy" }).click();
    await expect(back).toBeFocused();
    await expect(sidebar).toHaveAttribute("inert", "");
    await expect(content).not.toHaveAttribute("inert");

    // Focus wraps within the content half, never reaching the page behind
    await page.keyboard.press("Shift+Tab");
    await expect(save).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(back).toBeFocused();

    await back.click();
    await expect(dialog.getByRole("tab", { name: "Privacy" })).toBeFocused();
    await expect(content).toHaveAttribute("inert", "");

    // Same wrap in the sidebar half
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("tab", { name: "Privacy" })).not.toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("tab", { name: "Privacy" })).toBeFocused();
  });
});
