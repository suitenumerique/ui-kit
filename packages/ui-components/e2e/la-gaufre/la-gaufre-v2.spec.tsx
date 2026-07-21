import { test, expect } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";
import { TestLaGaufreV2 } from "../helpers/mount-la-gaufre";
import type { Service } from "../../src/components/la-gaufre/LaGaufreV2";

// A 1×1 transparent GIF avoids external logo requests while satisfying
// the widget's logo guard (services without a logo are silently skipped).
const LOGO =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

const mockServices: Service[] = [
  { name: "Tchap", url: "https://tchap.gouv.fr", logo: LOGO },
  { name: "Webinaire", url: "https://webinaire.numerique.gouv.fr", logo: LOGO },
  { name: "Resana", url: "https://resana.numerique.gouv.fr", logo: LOGO },
];

const shadowHost = () => "#lasuite-widget-lagaufre-shadow";

test.use({ viewport: { width: 1280, height: 720 } });

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
test.describe("LaGaufreV2 — button", () => {
  test("renders an accessible waffle button with an aria-label", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestLaGaufreV2
        data={{ services: mockServices }}
        label="Open suite apps"
      />
    );

    const button = page.locator("button.lagaufre-button");
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("aria-label", "Open suite apps");
    await expect(button.locator("svg")).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Panel interaction
// ---------------------------------------------------------------------------
test.describe("LaGaufreV2 — panel interaction", () => {
  test("clicking the button opens the widget panel and lists services", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestLaGaufreV2 data={{ services: mockServices }} />
    );

    // Wait for the real widget to inject its shadow host.
    await expect(page.locator(shadowHost())).toBeAttached({ timeout: 10_000 });

    await page.locator("button.lagaufre-button").click();

    // The panel (#wrapper inside the shadow root) becomes visible.
    const panel = page.locator(`${shadowHost()} #wrapper`);
    await expect(panel).toBeVisible({ timeout: 5_000 });

    // Every service card has a .service-name element with the service name.
    const names = page.locator(`${shadowHost()} .service-name`);
    await expect(names).toHaveCount(mockServices.length, { timeout: 5_000 });
    await expect(names.nth(0)).toHaveText("Tchap");
    await expect(names.nth(1)).toHaveText("Webinaire");
    await expect(names.nth(2)).toHaveText("Resana");
  });

  test("clicking the button again closes the panel (toggle)", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestLaGaufreV2 data={{ services: mockServices }} />
    );

    await expect(page.locator(shadowHost())).toBeAttached({ timeout: 10_000 });

    const button = page.locator("button.lagaufre-button");
    const panel = page.locator(`${shadowHost()} #wrapper`);

    // Open
    await button.click();
    await expect(panel).toBeVisible({ timeout: 5_000 });
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await page.waitForTimeout(250);

    // Close
    await button.click();
    await expect(panel).toBeHidden({ timeout: 5_000 });
  });

  test("each service card is a link pointing to the service URL", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestLaGaufreV2 data={{ services: mockServices }} />
    );

    await expect(page.locator(shadowHost())).toBeAttached({ timeout: 10_000 });
    await page.locator("button.lagaufre-button").click();

    const tchapLink = page.locator(
      `${shadowHost()} a[href="https://tchap.gouv.fr"]`
    );
    await expect(tchapLink).toBeVisible({ timeout: 5_000 });
    // All service links open in a new tab.
    await expect(tchapLink).toHaveAttribute("target", "_blank");
  });
});

// ---------------------------------------------------------------------------
// Panel positioning
// ---------------------------------------------------------------------------
test.describe("LaGaufreV2 — panel positioning", () => {
  /**
   * Returns the inline style values set on #wrapper (the positioned panel
   * element inside the shadow root). The real widget uses "unset" for sides
   * that are not active, so we compare against that.
   */
  async function getPanelSides(page: Page) {
    return page.locator(`${shadowHost()} #wrapper`).evaluate((el: HTMLElement) => {
      const s = (el as HTMLElement).style;
      return { top: s.top, bottom: s.bottom, left: s.left, right: s.right };
    });
  }

  test("panel opens below the button when the button is in the top half of the viewport", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestLaGaufreV2
        data={{ services: mockServices }}
        buttonViewportPosition="top-right"
      />
    );

    await expect(page.locator(shadowHost())).toBeAttached({ timeout: 10_000 });
    await page.locator("button.lagaufre-button").click();
    await expect(
      page.locator(`${shadowHost()} #wrapper`)
    ).toBeVisible({ timeout: 5_000 });

    const { top, bottom } = await getPanelSides(page);

    // position() sets top=<px> and bottom="unset" for top-half buttons.
    expect(top).toMatch(/^\d+(\.\d+)?px$/);
    expect(bottom).toBe("unset");

    // The panel top value must be greater than the button's bottom edge.
    const buttonBox = await page
      .locator("button.lagaufre-button")
      .boundingBox();
    expect(parseFloat(top)).toBeGreaterThan(buttonBox!.y);
  });

  test("panel opens above the button when the button is in the bottom half of the viewport", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestLaGaufreV2
        data={{ services: mockServices }}
        buttonViewportPosition="bottom-right"
      />
    );

    await expect(page.locator(shadowHost())).toBeAttached({ timeout: 10_000 });
    await page.locator("button.lagaufre-button").click();
    await expect(
      page.locator(`${shadowHost()} #wrapper`)
    ).toBeVisible({ timeout: 5_000 });

    const { top, bottom } = await getPanelSides(page);

    // position() sets bottom=<px> and top="unset" for bottom-half buttons.
    expect(bottom).toMatch(/^\d+(\.\d+)?px$/);
    expect(top).toBe("unset");
  });

  test("panel aligns to the right edge when the button is on the right side", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestLaGaufreV2
        data={{ services: mockServices }}
        buttonViewportPosition="top-right"
      />
    );

    await expect(page.locator(shadowHost())).toBeAttached({ timeout: 10_000 });
    await page.locator("button.lagaufre-button").click();
    await expect(
      page.locator(`${shadowHost()} #wrapper`)
    ).toBeVisible({ timeout: 5_000 });

    const { right, left } = await getPanelSides(page);
    expect(right).toMatch(/^\d+(\.\d+)?px$/);
    expect(left).toBe("unset");
  });

  test("panel aligns to the left edge when the button is on the left side", async ({
    mount,
    page,
  }) => {
    await mount(
      <TestLaGaufreV2
        data={{ services: mockServices }}
        buttonViewportPosition="top-left"
      />
    );

    await expect(page.locator(shadowHost())).toBeAttached({ timeout: 10_000 });
    await page.locator("button.lagaufre-button").click();
    await expect(
      page.locator(`${shadowHost()} #wrapper`)
    ).toBeVisible({ timeout: 5_000 });

    const { right, left } = await getPanelSides(page);
    expect(left).toMatch(/^\d+(\.\d+)?px$/);
    expect(right).toBe("unset");
  });
});
