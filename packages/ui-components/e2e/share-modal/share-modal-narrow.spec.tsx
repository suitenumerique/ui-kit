import { test, expect } from "@playwright/experimental-ct-react";
import { TestShareModal } from "../helpers/mount-share-modal";
import { selectUser } from "../helpers/share-modal-search";

test.use({ viewport: { width: 700, height: 800 } });

test("stacks selected users one per line on a narrow screen", async ({ mount, page }) => {
  await mount(<TestShareModal />);
  await selectUser(page, "ama", "Amandine Salambo");
  await selectUser(page, "ja", "Jakob Philips");

  const chips = page.getByTestId("selected-user-item");
  const first = await chips.nth(0).boundingBox();
  const second = await chips.nth(1).boundingBox();
  const mainSpace = await page.locator(".c__share-modal__search-field__main-space").boundingBox();
  const content = await page.locator(".c__share-modal__search-field__content").boundingBox();

  expect(second!.y).toBeGreaterThanOrEqual(first!.y + first!.height);
  expect(mainSpace!.y).toBeGreaterThanOrEqual(second!.y + second!.height);
  expect(mainSpace!.width).toBeCloseTo(content!.width, 0);
});
