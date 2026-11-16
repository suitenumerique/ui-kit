import { test, expect } from "@playwright/experimental-ct-react";
import { TestOnboardingModal } from "../helpers/mount-onboarding-modal";

test.describe("OnboardingModal", () => {
  test("names the dialog and keeps the focus on it at opening", async ({
    mount,
    page,
  }) => {
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();

    const dialog = page.getByRole("dialog", { name: "Learn the basics" });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { level: 2, name: "Learn the basics" }),
    ).toBeVisible();
    await expect(
      page.getByRole("tablist", { name: "Learn the basics" }),
    ).toHaveAttribute("aria-orientation", "vertical");
    await expect(page.locator('[role="tab"]:focus')).toHaveCount(0);
  });

  test("has a single Tab stop for the steps", async ({ mount, page }) => {
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();
    const dialog = page.getByRole("dialog");

    const order = [
      dialog.getByRole("button", { name: "Close", exact: true }),
      dialog.getByRole("tab", { name: "Compose" }),
      dialog.getByRole("tabpanel", { name: "Compose" }),
      dialog.getByRole("link", { name: /Learn more/ }),
      dialog.getByRole("button", { name: "Skip" }),
      dialog.getByRole("button", { name: "Next" }),
    ];
    for (const element of order) {
      await page.keyboard.press("Tab");
      await expect(element).toBeFocused();
    }
  });

  test("moves the focus with the arrows and selects with Enter or Space", async ({
    mount,
    page,
  }) => {
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();

    const compose = page.getByRole("tab", { name: "Compose" });
    const format = page.getByRole("tab", { name: "Format" });
    const share = page.getByRole("tab", { name: "Share" });
    await compose.focus();

    // Manual activation: the arrows move the focus, not the selection.
    await page.keyboard.press("ArrowDown");
    await expect(format).toBeFocused();
    await expect(compose).toHaveAttribute("aria-selected", "true");
    await expect(format).toHaveAccessibleDescription("");
    await page.keyboard.press("End");
    await expect(share).toBeFocused();
    await page.keyboard.press("Home");
    await expect(compose).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(format).toHaveAttribute("aria-selected", "true");
    await expect(format).toHaveAccessibleDescription("Format description");
    await expect(page.getByRole("tabpanel", { name: "Format" })).toContainText(
      "Format preview",
    );

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Space");
    await expect(share).toHaveAttribute("aria-selected", "true");
  });

  test("brings the focus back to the selected step", async ({
    mount,
    page,
  }) => {
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();

    const compose = page.getByRole("tab", { name: "Compose" });
    await compose.focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("tabpanel")).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(compose).toBeFocused();
  });

  test("makes the preview focusable only when its content is not", async ({
    mount,
    page,
  }) => {
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();

    const panel = page.getByRole("tabpanel");
    await expect(panel).toHaveAttribute("tabindex", "0");
    await expect(panel).toHaveAccessibleDescription("");

    await page.getByRole("tab", { name: "Format" }).click();
    await expect(panel).toHaveAccessibleDescription(
      "Animation of the formatting toolbar",
    );

    await page.getByRole("tab", { name: "Share" }).click();
    await expect(
      panel.getByRole("button", { name: "Try sharing" }),
    ).toBeVisible();
    await expect(panel).not.toHaveAttribute("tabindex");
  });

  test("announces Next without moving the focus and keeps the step visible", async ({
    mount,
    page,
  }) => {
    await mount(<TestOnboardingModal stepCount={6} />);
    await page.getByRole("button", { name: "Open onboarding" }).click();

    const list = page.getByRole("tablist");
    const status = page.getByRole("status");
    // Labelled "Understood" on the last step.
    const next = page.getByTestId("onboarding-next");

    for (const [index, title] of [
      "Format",
      "Share",
      "Templates",
      "Settings",
      "Security",
    ].entries()) {
      await next.click();
      await expect(next).toBeFocused();
      await expect(status).toHaveText(`Step ${index + 2} of 6: ${title}`);

      const step = page.getByRole("tab", { name: title });
      await expect(step).toHaveAttribute("aria-selected", "true");
      await expect
        .poll(async () => {
          const [stepBox, listBox] = await Promise.all([
            step.boundingBox(),
            list.boundingBox(),
          ]);
          return (
            !!stepBox &&
            !!listBox &&
            stepBox.y >= listBox.y - 1 &&
            stepBox.y + stepBox.height <= listBox.y + listBox.height + 1
          );
        })
        .toBe(true);
    }

    await page.getByRole("button", { name: "Understood" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByLabel("Result")).toHaveText("completed");
  });

  test("closes on Escape and on Skip", async ({ mount, page }) => {
    await mount(<TestOnboardingModal />);
    const trigger = page.getByRole("button", { name: "Open onboarding" });

    await trigger.click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByLabel("Result")).toHaveText("closed");
    await expect(trigger).toBeFocused();

    await trigger.click();
    await page.getByRole("button", { name: "Skip" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByLabel("Result")).toHaveText("skipped");
  });

  test("marks a footer link that opens in a new window", async ({
    mount,
    page,
  }) => {
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();

    const link = page.getByRole("link", {
      name: "Learn more (opens in a new window)",
    });
    await expect(link).toHaveAttribute("href", "https://example.com");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
  });

  test("renders a footer action without href as a button", async ({
    mount,
    page,
  }) => {
    await mount(<TestOnboardingModal footerAction />);
    await page.getByRole("button", { name: "Open onboarding" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("link")).toHaveCount(0);
    const action = dialog.getByRole("button", { name: "Take the tour" });
    await action.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByLabel("Result")).toHaveText("tour");
  });

  test("renders the steps in the modal font, icons on the title line", async ({
    mount,
    page,
  }) => {
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();

    const modalFont = await page
      .getByRole("heading", { name: "Learn the basics" })
      .evaluate((el) => getComputedStyle(el).fontFamily);

    for (const title of ["Compose", "Format"]) {
      const step = page.getByRole("tab", { name: title });
      // Not the browser default of form controls.
      await expect(step).toHaveCSS("font-family", modalFont);

      const titleLineHeight = await step
        .locator(".c__onboarding-modal__step__title")
        .evaluate((el) => parseFloat(getComputedStyle(el).lineHeight));
      const iconBox = await step
        .locator(".c__onboarding-modal__step__icon")
        .boundingBox();
      const contentBox = await step
        .locator(".c__onboarding-modal__step__content")
        .boundingBox();
      expect(iconBox!.y).toBeCloseTo(contentBox!.y, 0);
      expect(iconBox!.height).toBeCloseTo(titleLineHeight, 0);
    }
  });

  test("shows the focus ring on the focused step", async ({ mount, page }) => {
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();

    const compose = page.getByRole("tab", { name: "Compose" });
    const format = page.getByRole("tab", { name: "Format" });
    await compose.focus();
    await page.keyboard.press("ArrowDown");
    await expect(format).toHaveAttribute("data-focus-visible", "true");
    await expect(format).not.toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");
  });
});

test.describe("OnboardingModal text-only", () => {
  test("renders the steps as buttons marking the current one", async ({
    mount,
    page,
  }) => {
    await mount(<TestOnboardingModal textOnly />);
    await page.getByRole("button", { name: "Open onboarding" }).click();

    await expect(page.getByRole("tablist")).toHaveCount(0);
    await expect(page.getByRole("tabpanel")).toHaveCount(0);
    const list = page.getByRole("list", { name: "Learn the basics" });
    await expect(list.getByRole("listitem")).toHaveCount(3);

    const compose = list.getByRole("button", { name: "Compose" });
    const format = list.getByRole("button", { name: "Format" });
    await expect(compose).toHaveAttribute("aria-current", "step");
    await expect(compose).toHaveAccessibleDescription("Compose description");
    await expect(compose).toHaveCSS(
      "font-family",
      await page
        .getByRole("heading", { name: "Learn the basics" })
        .evaluate((el) => getComputedStyle(el).fontFamily),
    );

    // Buttons, not tabs: Tab goes from one step to the next.
    await compose.focus();
    await page.keyboard.press("Tab");
    await expect(format).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(format).toHaveAttribute("aria-current", "step");
    await expect(compose).not.toHaveAttribute("aria-current");
  });
});

test.describe("OnboardingModal on small screens", () => {
  test("replaces the step list and adds a Previous button", async ({
    mount,
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("tablist")).toBeHidden();
    await expect(dialog.getByRole("button", { name: "Previous" })).toHaveCount(
      0,
    );

    await dialog.getByRole("button", { name: "Next" }).click();
    const mobileStep = dialog.locator(".c__onboarding-modal__mobile-step");
    await expect(mobileStep).toContainText("Format");

    const previous = dialog.getByRole("button", { name: "Previous" });
    await previous.click();
    await expect(page.getByRole("status")).toHaveText("Step 1 of 3: Compose");
    await expect(mobileStep).toContainText("Compose");
  });
});
