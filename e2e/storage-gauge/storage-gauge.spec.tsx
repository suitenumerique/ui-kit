import { test, expect } from "@playwright/experimental-ct-react";
import {
  TestStorageGauge,
  TestStorageGaugeDetails,
  TestBottomMenuGauge,
} from "../helpers/mount-gauge";

test.describe("StorageGauge (button)", () => {
  test("renders the value and a trailing arrow when showArrow is set", async ({
    mount,
  }) => {
    const component = await mount(
      <TestStorageGauge used={1.8} total={10} unit="GB" showArrow />,
    );

    await expect(component).toContainText("1.80");
    await expect(component).toContainText("10");
    await expect(component).toContainText("GB");
    await expect(component.locator(".c__storage-gauge__arrow")).toHaveText(
      "north_east",
    );
  });

  test("applies the warning status class near the limit", async ({ mount }) => {
    const component = await mount(
      <TestStorageGauge used={9.1} total={10} unit="GB" />,
    );
    await expect(component.locator(".c__storage-gauge")).toHaveClass(
      /c__storage-gauge--warning/,
    );
  });

  test("applies the full status class when full", async ({ mount }) => {
    const component = await mount(
      <TestStorageGauge used={10} total={10} unit="GB" />,
    );
    await expect(component.locator(".c__storage-gauge")).toHaveClass(
      /c__storage-gauge--full/,
    );
  });
});

test.describe("StorageGaugeDetails", () => {
  test("renders title, description and a More info action", async ({
    mount,
  }) => {
    const component = await mount(
      <TestStorageGaugeDetails
        used={1.8}
        total={10}
        unit="GB"
        info="Useful info"
        action={{ label: "More info", href: "https://example.com" }}
      />,
    );

    await expect(component).toContainText("Used storage");
    await expect(component).toContainText("1.80 of 10 GB used");
    const link = component.getByRole("link", { name: "More info" });
    await expect(link).toHaveAttribute("href", "https://example.com");
  });
});

test.describe("BottomMenu", () => {
  test("renders settings and a gauge, and the gauge opens the details modal", async ({
    mount,
    page,
  }) => {
    const component = await mount(
      <TestBottomMenuGauge used={1.8} total={10} unit="GB" />,
    );

    await expect(
      component.getByRole("button", { name: "Settings" }),
    ).toBeVisible();

    const gauge = component.locator(".c__storage-gauge");
    await expect(gauge).toBeVisible();
    await gauge.click();

    // The modal renders the gauge details.
    await expect(page.locator(".c__storage-gauge-details")).toBeVisible();
    await expect(page.getByText("1.80 of 10 GB used")).toBeVisible();
  });
});
