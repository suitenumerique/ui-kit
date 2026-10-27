import { createRequire } from "module";
import type { Page } from "@playwright/test";
import { expect } from "@playwright/experimental-ct-react";
import type { AxeResults } from "axe-core";

const AXE_SCRIPT = createRequire(import.meta.url).resolve("axe-core/axe.min.js");

/**
 * Runs axe-core on the whole page, as rendered at that moment, and fails on
 * any WCAG 2.2 A or AA violation. Rules that need a human (the `incomplete`
 * results) are not asserted.
 */
export const expectNoAxeViolations = async (page: Page) => {
  await page.addScriptTag({ path: AXE_SCRIPT });
  const violations = await page.evaluate(async () => {
    const { axe } = window as unknown as {
      axe: { run: (context: Document, options: object) => Promise<AxeResults> };
    };
    const results = await axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
      },
    });
    return results.violations.map((violation) => ({
      rule: violation.id,
      impact: violation.impact,
      targets: violation.nodes.map((node) => node.target.join(" ")),
    }));
  });
  expect(violations).toEqual([]);
};
