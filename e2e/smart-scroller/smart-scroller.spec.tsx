import { test, expect } from "@playwright/experimental-ct-react";
import type { Locator, Page } from "@playwright/test";
import { TestSmartScroller } from "../helpers/mount-smart-scroller";

const viewportOf = (page: Page) =>
  page.locator(".c__smart-scroller__viewport");

// The arrows are a pointer-only affordance (aria-hidden), so they are located
// by class rather than by role/name.
const rightArrowOf = (page: Page) =>
  page.locator(".c__smart-scroller__arrow--right");
const leftArrowOf = (page: Page) =>
  page.locator(".c__smart-scroller__arrow--left");

// Read a numeric geometry property off the scrollable viewport.
const geom = (
  viewport: Locator,
  prop: "scrollLeft" | "clientWidth" | "scrollWidth",
) => viewport.evaluate((el, p) => el[p as keyof Element] as number, prop);

// Poll until the smooth scroll has settled, then return the resting scrollLeft.
const settledScrollLeft = async (viewport: Locator) => {
  let last = -1;
  await expect
    .poll(async () => {
      const current = await geom(viewport, "scrollLeft");
      const stable = current === last;
      last = current;
      return stable ? "stable" : current;
    })
    .toBe("stable");
  return last;
};

test.describe("SmartScroller", () => {
  test("renders no arrows when content fits", async ({ mount, page }) => {
    await mount(<TestSmartScroller itemCount={2} />);
    await expect(viewportOf(page)).toBeVisible();

    await expect(rightArrowOf(page)).toHaveCount(0);
    await expect(leftArrowOf(page)).toHaveCount(0);
  });

  test("shows only the right arrow when content overflows at the start", async ({
    mount,
    page,
  }) => {
    await mount(<TestSmartScroller itemCount={15} />);

    await expect(rightArrowOf(page)).toBeVisible();
    await expect(leftArrowOf(page)).toHaveCount(0);
    expect(await geom(viewportOf(page), "scrollLeft")).toBe(0);
  });

  test("hides the arrows from assistive technology", async ({
    mount,
    page,
  }) => {
    await mount(<TestSmartScroller itemCount={15} />);

    // The visible arrow is aria-hidden, so it is absent from the a11y tree...
    await expect(rightArrowOf(page)).toBeVisible();
    await expect(rightArrowOf(page)).toHaveAttribute("aria-hidden", "true");
    await expect(
      page.getByRole("button", { name: "Scroll right" }),
    ).toHaveCount(0);

    // ...and removed from the tab order.
    await expect(rightArrowOf(page)).toHaveAttribute("tabindex", "-1");
  });

  test("clicking the right arrow scrolls ~50% of the viewport width", async ({
    mount,
    page,
  }) => {
    await mount(<TestSmartScroller itemCount={15} />);
    const viewport = viewportOf(page);

    const clientWidth = await geom(viewport, "clientWidth");
    await rightArrowOf(page).click();

    const scrollLeft = await settledScrollLeft(viewport);
    expect(Math.abs(scrollLeft - clientWidth * 0.5)).toBeLessThanOrEqual(2);
  });

  test("scrolling right reveals the left arrow", async ({ mount, page }) => {
    await mount(<TestSmartScroller itemCount={15} />);

    await rightArrowOf(page).click();

    await expect(leftArrowOf(page)).toBeVisible();
  });

  test("clicking the left arrow scrolls back toward the start", async ({
    mount,
    page,
  }) => {
    await mount(<TestSmartScroller itemCount={15} />);
    const viewport = viewportOf(page);

    await rightArrowOf(page).click();
    const afterRight = await settledScrollLeft(viewport);
    expect(afterRight).toBeGreaterThan(0);

    await leftArrowOf(page).click();
    const afterLeft = await settledScrollLeft(viewport);
    expect(afterLeft).toBeLessThan(afterRight);
  });

  test("reaching the end hides the right arrow and keeps the left arrow", async ({
    mount,
    page,
  }) => {
    await mount(<TestSmartScroller itemCount={15} />);
    const viewport = viewportOf(page);

    await viewport.evaluate((el) => {
      el.scrollLeft = el.scrollWidth;
    });

    await expect(rightArrowOf(page)).toHaveCount(0);
    await expect(leftArrowOf(page)).toBeVisible();
  });

  test("scrollRatio of 1 scrolls a full viewport width", async ({
    mount,
    page,
  }) => {
    await mount(<TestSmartScroller itemCount={15} scrollRatio={1} />);
    const viewport = viewportOf(page);

    const clientWidth = await geom(viewport, "clientWidth");
    await rightArrowOf(page).click();

    const scrollLeft = await settledScrollLeft(viewport);
    expect(Math.abs(scrollLeft - clientWidth)).toBeLessThanOrEqual(2);
  });

  test("recomputes arrows when the container is resized", async ({
    mount,
    page,
  }) => {
    // 3 items (~360px) fit the 480px frame: no arrows.
    await mount(<TestSmartScroller itemCount={3} />);
    await expect(rightArrowOf(page)).toHaveCount(0);

    // Shrinking the frame makes the same content overflow -> right arrow shows.
    await page.getByTestId("frame").evaluate((el) => {
      (el as HTMLElement).style.width = "200px";
    });
    await expect(rightArrowOf(page)).toBeVisible();

    // Growing it back past the content width hides the arrow again.
    await page.getByTestId("frame").evaluate((el) => {
      (el as HTMLElement).style.width = "480px";
    });
    await expect(rightArrowOf(page)).toHaveCount(0);
  });
});
