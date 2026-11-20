import { test, expect } from "@playwright/experimental-ct-react";
import { TestOnboardingModal } from "../helpers/mount-onboarding-modal";

test.describe("OnboardingModal", () => {
  test("names the dialog and keeps the focus on it at opening", async ({
    mount,
    page,
  }) => {
    // 1. Open the modal.
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();

    // 2. The dialog is named by its visible heading.
    const dialog = page.getByRole("dialog", { name: "Learn the basics" });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { level: 2, name: "Learn the basics" }),
    ).toBeVisible();

    // 3. The steps are a vertical tab list, and none of them takes the focus.
    await expect(
      page.getByRole("tablist", { name: "Learn the basics" }),
    ).toHaveAttribute("aria-orientation", "vertical");
    await expect(page.locator('[role="tab"]:focus')).toHaveCount(0);
  });

  test("has a single Tab stop for the steps", async ({ mount, page }) => {
    // 1. Open the modal.
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();
    const dialog = page.getByRole("dialog");

    // 2. Tab goes through the dialog once: the step list counts as a single
    //    stop, then the preview, the footer link and the buttons.
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
    // 1. Open the modal and focus the first step.
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();
    const compose = page.getByRole("tab", { name: "Compose" });
    const format = page.getByRole("tab", { name: "Format" });
    const share = page.getByRole("tab", { name: "Share" });
    await compose.focus();

    // 2. The arrows move the focus, not the selection (manual activation).
    await page.keyboard.press("ArrowDown");
    await expect(format).toBeFocused();
    await expect(compose).toHaveAttribute("aria-selected", "true");
    await expect(format).toHaveAccessibleDescription("");

    // 3. End and Home jump to the last and first steps.
    await page.keyboard.press("End");
    await expect(share).toBeFocused();
    await page.keyboard.press("Home");
    await expect(compose).toBeFocused();

    // 4. Enter selects the focused step, which gets its description and
    //    its preview.
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(format).toHaveAttribute("aria-selected", "true");
    await expect(format).toHaveAccessibleDescription("Format description");
    await expect(page.getByRole("tabpanel", { name: "Format" })).toContainText(
      "Format preview",
    );

    // 5. Space selects too.
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Space");
    await expect(share).toHaveAttribute("aria-selected", "true");
  });

  test("brings the focus back to the selected step", async ({
    mount,
    page,
  }) => {
    // 1. Open the modal and move the focus to another step without
    //    selecting it.
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();
    const compose = page.getByRole("tab", { name: "Compose" });
    await compose.focus();
    await page.keyboard.press("ArrowDown");

    // 2. Tab leaves the list for the preview.
    await page.keyboard.press("Tab");
    await expect(page.getByRole("tabpanel")).toBeFocused();

    // 3. Shift+Tab comes back to the selected step, not the one last
    //    focused.
    await page.keyboard.press("Shift+Tab");
    await expect(compose).toBeFocused();
  });

  test("makes the preview focusable only when its content is not", async ({
    mount,
    page,
  }) => {
    // 1. Open the modal: the first preview has nothing focusable and no
    //    contentAlt, so the panel is a Tab stop with no description.
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();
    const panel = page.getByRole("tabpanel");
    await expect(panel).toHaveAttribute("tabindex", "0");
    await expect(panel).toHaveAccessibleDescription("");

    // 2. Select Format: the panel is described by its contentAlt.
    await page.getByRole("tab", { name: "Format" }).click();
    await expect(panel).toHaveAccessibleDescription(
      "Animation of the formatting toolbar",
    );

    // 3. Select Share: its preview holds a button, so the panel leaves the
    //    tab order.
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
    // 1. Open a modal with more steps than the list can show.
    await mount(<TestOnboardingModal stepCount={6} />);
    await page.getByRole("button", { name: "Open onboarding" }).click();
    const list = page.getByRole("tablist");
    const status = page.getByRole("status");
    // Labelled "Understood" on the last step.
    const next = page.getByTestId("onboarding-next");

    // 2. Each Next keeps the focus on itself, announces the new step,
    //    selects it and scrolls it into the visible part of the list.
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

    // 3. On the last step, Understood closes the modal and completes the
    //    onboarding.
    await page.getByRole("button", { name: "Understood" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByLabel("Result")).toHaveText("completed");
  });

  test("closes on Escape and on Skip", async ({ mount, page }) => {
    // 1. Open the modal, then press Escape: it closes and the focus goes
    //    back to the trigger.
    await mount(<TestOnboardingModal />);
    const trigger = page.getByRole("button", { name: "Open onboarding" });
    await trigger.click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByLabel("Result")).toHaveText("closed");
    await expect(trigger).toBeFocused();

    // 2. Open it again, then click Skip: it closes as skipped.
    await trigger.click();
    await page.getByRole("button", { name: "Skip" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByLabel("Result")).toHaveText("skipped");
  });

  test("marks a footer link that opens in a new window", async ({
    mount,
    page,
  }) => {
    // 1. Open the modal, whose footer has a link with an href.
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();

    // 2. Its name says it opens a new window, and it opens safely.
    const link = page.getByRole("link", {
      name: "Learn more (opens in a new window)",
    });
    await expect(link).toHaveAttribute("href", "https://example.com");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");

    // 3. The external-link icon is decorative.
    await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
  });

  test("renders a footer action without href as a button", async ({
    mount,
    page,
  }) => {
    // 1. Open the modal, whose footer has an action with only an onClick.
    await mount(<TestOnboardingModal footerAction />);
    await page.getByRole("button", { name: "Open onboarding" }).click();

    // 2. It is a button, not a link without href.
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("link")).toHaveCount(0);
    const action = dialog.getByRole("button", { name: "Take the tour" });

    // 3. It runs from the keyboard.
    await action.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByLabel("Result")).toHaveText("tour");
  });

  test("renders the steps in the modal font, icons on the title line", async ({
    mount,
    page,
  }) => {
    // 1. Open the modal and read the font of its heading.
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();
    const modalFont = await page
      .getByRole("heading", { name: "Learn the basics" })
      .evaluate((el) => getComputedStyle(el).fontFamily);

    // 2. Each step uses that font, not the browser default of form
    //    controls, and its icon is centered on the first title line.
    for (const title of ["Compose", "Format"]) {
      const step = page.getByRole("tab", { name: title });
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
    // 1. Open the modal and move the focus from the keyboard.
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();
    const compose = page.getByRole("tab", { name: "Compose" });
    const format = page.getByRole("tab", { name: "Format" });
    await compose.focus();
    await page.keyboard.press("ArrowDown");

    // 2. The focused step shows a visible focus ring.
    await expect(format).toHaveAttribute("data-focus-visible", "true");
    await expect(format).not.toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");
  });
});

test.describe("OnboardingModal text-only", () => {
  test("renders the steps as buttons marking the current one", async ({
    mount,
    page,
  }) => {
    // 1. Open the modal without preview: there are no tabs and no panel.
    await mount(<TestOnboardingModal textOnly />);
    await page.getByRole("button", { name: "Open onboarding" }).click();
    await expect(page.getByRole("tablist")).toHaveCount(0);
    await expect(page.getByRole("tabpanel")).toHaveCount(0);

    // 2. The steps are a list of buttons named by the heading. The current
    //    one is marked and described, in the modal font.
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

    // 3. Buttons, not tabs: Tab goes from one step to the next.
    await compose.focus();
    await page.keyboard.press("Tab");
    await expect(format).toBeFocused();

    // 4. Enter moves the mark to the focused step.
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
    // 1. Open the modal on a phone-sized screen: the step list is hidden,
    //    and there is no Previous button on the first step.
    await page.setViewportSize({ width: 375, height: 700 });
    await mount(<TestOnboardingModal />);
    await page.getByRole("button", { name: "Open onboarding" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("tablist")).toBeHidden();
    await expect(dialog.getByRole("button", { name: "Previous" })).toHaveCount(
      0,
    );

    // 2. Next shows the second step in place of the list.
    await dialog.getByRole("button", { name: "Next" }).click();
    const mobileStep = dialog.locator(".c__onboarding-modal__mobile-step");
    await expect(mobileStep).toContainText("Format");

    // 3. Previous comes back to the first step and announces it.
    const previous = dialog.getByRole("button", { name: "Previous" });
    await previous.click();
    await expect(page.getByRole("status")).toHaveText("Step 1 of 3: Compose");
    await expect(mobileStep).toContainText("Compose");
  });
});
