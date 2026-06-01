import { test, expect } from "@playwright/experimental-ct-react";
import { TestHeaderBanner } from "../helpers/mount-header-banner";

test.describe("HeaderBanner", () => {
  test("renders the message and an action link with an external-link icon", async ({
    mount,
  }) => {
    const component = await mount(
      <TestHeaderBanner
        type="info"
        action={{ label: "Open the production version", href: "https://e.x" }}
      >
        You are on a pre-production version.
      </TestHeaderBanner>,
    );

    await expect(component).toContainText("You are on a pre-production version.");

    const link = component.getByRole("link", {
      name: "Open the production version",
    });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "https://e.x");
    await expect(link).toHaveAttribute("target", "_blank");
    // The default action icon is the ui-kit ExternalLink (an SVG).
    await expect(link.locator("svg")).toBeVisible();
    await expect(
      link.locator(".c__header-banner__action__label"),
    ).toHaveText("Open the production version");
  });

  test("error type uses the error modifier and the alert role", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestHeaderBanner type="error">Service is down.</TestHeaderBanner>,
    );

    const banner = page.locator(".c__header-banner");
    await expect(banner).toHaveClass(/c__header-banner--error/);
    await expect(banner).toHaveAttribute("role", "alert");
  });

  test("the close button dismisses the banner", async ({ mount, page }) => {
    const component = await mount(
      <TestHeaderBanner closable>Dismiss me</TestHeaderBanner>,
    );

    await expect(component).toContainText("Dismiss me");

    await component.getByRole("button", { name: "Close banner" }).click();

    await expect(page.locator(".c__header-banner")).toHaveCount(0);
  });

  test("renders no actions container when there is no action and not closable", async ({
    mount,
    page,
  }) => {
    await mount(<TestHeaderBanner>Info only</TestHeaderBanner>);

    await expect(page.locator(".c__header-banner__actions")).toHaveCount(0);
  });
});

test.describe("HeaderBanner — mobile", () => {
  test.use({ viewport: { width: 600, height: 800 } });

  test("hides the action label but keeps the icon and accessible name", async ({
    mount,
  }) => {
    const component = await mount(
      <TestHeaderBanner
        type="info"
        action={{ label: "Open the production version", href: "https://e.x" }}
      >
        You are on a pre-production version.
      </TestHeaderBanner>,
    );

    // The action is still reachable by its accessible name (aria-label)…
    const link = component.getByRole("link", {
      name: "Open the production version",
    });
    await expect(link).toBeVisible();
    // …the icon stays visible…
    await expect(link.locator("svg")).toBeVisible();
    // …but the visible label text is collapsed to save space.
    await expect(
      link.locator(".c__header-banner__action__label"),
    ).toBeHidden();
  });
});
