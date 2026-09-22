import { test, expect } from "@playwright/experimental-ct-react";
import { TestTabs } from "../helpers/mount-tabs";

for (const variant of ["default", "line"] as const) {
  test.describe(`Tabs (${variant})`, () => {
    test("labels the tab group and associates each selected panel", async ({
      mount,
      page,
    }) => {
      await mount(<TestTabs variant={variant} />);
      await expect(
        page.getByRole("tablist", { name: "Project" }),
      ).toBeVisible();
      const overview = page.getByRole("tab", { name: "Overview" });
      await expect(overview).toHaveAttribute("aria-selected", "true");
      const panel = page.getByRole("tabpanel", { name: "Overview" });
      await expect(panel).toHaveAttribute(
        "id",
        (await overview.getAttribute("aria-controls")) as string,
      );
      await expect(panel).toHaveAttribute(
        "aria-labelledby",
        (await overview.getAttribute("id")) as string,
      );
      await expect(page.getByRole("tabpanel")).toHaveCount(1);
      await page.getByRole("tab", { name: "Activity" }).click();
      await expect(page.getByRole("tabpanel", { name: "Activity" })).toHaveText(
        "Activity content",
      );
      await expect(
        page.getByRole("button", { name: "Overview action" }),
      ).toHaveCount(0);
      await expect(page.getByLabel("Last selection")).toHaveText("activity");
    });

    test("supports an initial selection", async ({ mount, page }) => {
      await mount(<TestTabs variant={variant} defaultSelectedTab="settings" />);
      await expect(page.getByRole("tab", { name: "Settings" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      await expect(page.getByRole("tabpanel")).toHaveText("Settings content");
    });

    test("supports controlled selection and external updates", async ({
      mount,
      page,
    }) => {
      await mount(<TestTabs variant={variant} controlled />);
      await page.getByRole("tab", { name: "Activity" }).click();
      await expect(page.getByRole("tabpanel")).toHaveText("Activity content");
      await page.getByRole("button", { name: "Open settings" }).click();
      await expect(page.getByRole("tab", { name: "Settings" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      await expect(page.getByRole("tabpanel")).toHaveText("Settings content");
    });

    test("navigates by keyboard, wraps, and skips disabled tabs", async ({
      mount,
      page,
    }) => {
      await mount(<TestTabs variant={variant} disableActivity />);
      const overview = page.getByRole("tab", { name: "Overview" });
      const settings = page.getByRole("tab", { name: "Settings" });
      const activity = page.getByRole("tab", { name: "Activity" });
      await expect(activity).toBeDisabled();
      await page.getByRole("button", { name: "Before tabs" }).focus();
      await page.keyboard.press("Tab");
      await expect(overview).toBeFocused();
      await expect(overview).toHaveCSS("outline-style", "solid");
      await expect(overview).toHaveCSS("outline-width", "2px");
      await page.keyboard.press("ArrowRight");
      await expect(settings).toBeFocused();
      await expect(settings).toHaveAttribute("aria-selected", "true");
      await page.keyboard.press("ArrowRight");
      await expect(overview).toBeFocused();
      await page.keyboard.press("ArrowLeft");
      await expect(settings).toBeFocused();
      await page.keyboard.press("Home");
      await expect(overview).toBeFocused();
      await page.keyboard.press("End");
      await expect(settings).toBeFocused();
      await activity.click({ force: true });
      await expect(settings).toHaveAttribute("aria-selected", "true");
    });

    test("manual activation separates focus from selection", async ({
      mount,
      page,
    }) => {
      await mount(<TestTabs variant={variant} keyboardActivation="manual" />);
      await page.getByRole("tab", { name: "Overview" }).focus();
      await page.keyboard.press("ArrowRight");
      const activity = page.getByRole("tab", { name: "Activity" });
      await expect(activity).toBeFocused();
      await expect(activity).toHaveAttribute("aria-selected", "false");
      await expect(
        page.getByRole("tabpanel", { name: "Overview" }),
      ).toBeVisible();
      await page.keyboard.press("Enter");
      await expect(activity).toHaveAttribute("aria-selected", "true");
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("Space");
      await expect(
        page.getByRole("tabpanel", { name: "Settings" }),
      ).toBeVisible();
    });

    test("Tab reaches the panel instead of every tab", async ({
      mount,
      page,
    }) => {
      await mount(<TestTabs variant={variant} defaultSelectedTab="activity" />);
      await page.getByRole("tab", { name: "Activity" }).focus();
      await page.keyboard.press("Tab");
      await expect(
        page.getByRole("tabpanel", { name: "Activity" }),
      ).toBeFocused();
    });

    test("keeps icon-only tabs accessible and icons at the design size", async ({
      mount,
      page,
    }) => {
      await mount(<TestTabs variant={variant} icons iconOnly />);
      const overview = page.getByRole("tab", { name: "Overview" });
      await expect(overview).toHaveText("");
      await expect(overview.locator("svg")).toHaveCSS("width", "18px");
      await expect(overview.locator("svg")).toHaveCSS("height", "18px");
      await page.getByRole("tab", { name: "Activity" }).click();
      await expect(
        page.getByRole("tabpanel", { name: "Activity" }),
      ).toBeVisible();
    });

    test("matches design height and shows the correct selected treatment", async ({
      mount,
      page,
    }) => {
      await mount(<TestTabs variant={variant} icons />);
      const selected = page.getByRole("tab", { name: "Overview" });
      await expect
        .poll(async () => (await selected.boundingBox())?.height)
        .toBe(variant === "line" ? 30 : 26);
      await expect(selected).toHaveCSS("font-size", "14px");
      if (variant === "line") {
        await expect(selected.locator(".c__tabs__indicator")).toHaveCSS(
          "height",
          "1.5px",
        );
        await expect(selected).toHaveCSS(
          "background-color",
          "rgba(0, 0, 0, 0)",
        );
      } else {
        await expect(selected).not.toHaveCSS(
          "background-color",
          "rgba(0, 0, 0, 0)",
        );
      }
      const activity = page.getByRole("tab", { name: "Activity" });
      const oldColor = await activity.evaluate(
        (node) => getComputedStyle(node).color,
      );
      await activity.hover();
      if (variant === "line") {
        await expect(activity).not.toHaveCSS("color", oldColor);
        await expect(activity).toHaveCSS(
          "background-color",
          "rgba(0, 0, 0, 0)",
        );
      } else {
        await expect(activity).not.toHaveCSS(
          "background-color",
          "rgba(0, 0, 0, 0)",
        );
      }
    });

    test("distributes full-width tabs equally", async ({ mount, page }) => {
      await mount(<TestTabs variant={variant} fullWidth />);
      await expect(page.getByRole("tab")).toHaveCount(3);
      const widths = await page
        .getByRole("tab")
        .evaluateAll((nodes) =>
          nodes.map((node) => node.getBoundingClientRect().width),
        );
      expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
      expect(widths[0]).toBeGreaterThan(180);
    });

    test("scrolls long tab lists without overflowing the container", async ({
      mount,
      page,
    }) => {
      await mount(<TestTabs variant={variant} width={180} icons />);
      const list = page.getByRole("tablist");
      expect(
        await list.evaluate((node) => node.scrollWidth > node.clientWidth),
      ).toBe(true);
      await page.getByRole("tab", { name: "Overview" }).focus();
      await page.keyboard.press("End");
      await expect(page.getByRole("tab", { name: "Settings" })).toBeFocused();
      await expect
        .poll(() => list.evaluate((node) => node.scrollLeft))
        .toBeGreaterThan(0);
      expect(
        await list.evaluate((node) => node.getBoundingClientRect().width),
      ).toBeLessThanOrEqual(180);
    });
  });
}

test("renders nothing for an empty tab list", async ({ mount, page }) => {
  await mount(<TestTabs tabs={[]} />);
  await expect(page.getByRole("tablist")).toHaveCount(0);
  await expect(page.getByRole("tabpanel")).toHaveCount(0);
});

test("selects the first enabled tab", async ({ mount, page }) => {
  await mount(
    <TestTabs
      tabs={[
        {
          id: "disabled",
          label: "Disabled",
          content: "Unavailable",
          isDisabled: true,
        },
        { id: "enabled", label: "Enabled", content: "Available" },
      ]}
    />,
  );
  await expect(page.getByRole("tab", { name: "Enabled" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("keeps legacy Material icons out of accessible names", async ({
  mount,
  page,
}) => {
  await mount(
    <TestTabs
      tabs={[
        {
          id: "info",
          label: "Information",
          icon: "info",
          content: "Information content",
        },
      ]}
    />,
  );
  await expect(page.getByRole("tab")).toHaveAccessibleName("Information");
});

test("preserves a visible selected state in forced colors", async ({
  mount,
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active" });
  await mount(<TestTabs />);
  await expect(page.getByRole("tab", { name: "Overview" })).toHaveCSS(
    "outline-style",
    "solid",
  );
});

test("slides and resizes the line between tabs", async ({ mount, page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await mount(
    <TestTabs
      variant="line"
      tabs={[
        { id: "short", label: "Short", content: "First panel" },
        { id: "long", label: "A much longer tab", content: "Second panel" },
      ]}
    />,
  );
  const indicator = page.locator(".c__tabs__indicator");
  await expect(indicator).toHaveCount(1);
  await expect(indicator).toHaveCSS("transition-duration", "0.25s, 0.25s");
  const start = (await indicator.boundingBox())!;
  // Slow the transition so the intermediate position can be inspected reliably.
  await page.addStyleTag({
    content: ".c__tabs__indicator { transition-duration: 1s; }",
  });
  const destination = page.getByRole("tab", { name: "A much longer tab" });
  await destination.click();
  await expect(page.getByRole("tabpanel")).toHaveText("Second panel");
  const movingLine = destination.locator(".c__tabs__indicator");
  await expect
    .poll(() => movingLine.evaluate((node) => node.getAnimations().length))
    .toBeGreaterThan(0);
  await movingLine.evaluate((node) => {
    for (const animation of node.getAnimations()) {
      animation.pause();
      animation.currentTime = 500;
    }
  });
  const middle = (await movingLine.boundingBox())!;
  const tab = (await destination.boundingBox())!;
  expect(middle.x).toBeGreaterThan(start.x);
  expect(middle.x).toBeLessThan(tab.x + 4);
  expect(middle.width).toBeGreaterThan(start.width);
  expect(middle.width).toBeLessThan(tab.width - 8);
  await movingLine.evaluate((node) =>
    node.getAnimations().forEach((animation) => animation.finish()),
  );
  await expect
    .poll(async () => (await movingLine.boundingBox())?.x)
    .toBeCloseTo(tab.x + 4, 0);
  await expect
    .poll(async () => (await movingLine.boundingBox())?.width)
    .toBeCloseTo(tab.width - 8, 0);
  await expect(indicator).toHaveCount(1);
});

test("moves the line instantly with reduced motion, including external selection", async ({
  mount,
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await mount(<TestTabs variant="line" controlled />);
  await expect(page.locator(".c__tabs__indicator")).toHaveCSS(
    "transition-property",
    "none",
  );
  await page.getByRole("button", { name: "Open settings" }).click();
  const selected = page.getByRole("tab", { name: "Settings" });
  const indicator = selected.locator(".c__tabs__indicator");
  await expect(indicator).toBeVisible();
  expect(await indicator.evaluate((node) => node.getAnimations().length)).toBe(
    0,
  );
  const tab = (await selected.boundingBox())!;
  expect((await indicator.boundingBox())!.x).toBeCloseTo(tab.x + 4, 0);
  expect((await indicator.boundingBox())!.width).toBeCloseTo(tab.width - 8, 0);
  await expect(page.locator(".c__tabs__indicator")).toHaveCount(1);
});
