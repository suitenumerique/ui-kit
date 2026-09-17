import React from "react";
import { render } from "@testing-library/react";
import { Alert } from ":/components/alert/index";
import { CunninghamProvider } from ":/components/provider";
import { Toast } from ":/components/toast/index";
import { VariantType } from ":/utils/VariantUtils";

// Lists the BEM suffixes carried by every node of a rendered notification, in
// document order. Comparing the two lists is what pins the shared structure:
// the class names only differ by their block prefix.
const structure = (root: Element, block: string) =>
  Array.from(root.querySelectorAll(`[class*="${block}__"]`)).map((node) =>
    Array.from(node.classList)
      .filter((name) => name.startsWith(`${block}__`))
      .map((name) => name.slice(block.length))
      .join(" "),
  );

describe("notification content", () => {
  it("renders Alert and Toast with the same structure", () => {
    const shared = {
      type: VariantType.INFO,
      actions: [{ label: "Undo", onClick: () => {} }],
      primaryLabel: "Retry",
      canClose: true,
      children: "Document moved",
    };

    const { container } = render(
      <CunninghamProvider>
        <Alert {...shared} />
        <Toast {...shared} duration={0} />
      </CunninghamProvider>,
    );

    const $alert = container.querySelector(".c__alert")!;
    const $toast = container.querySelector(".c__toast")!;

    expect(structure($alert, "c__alert")).toEqual([
      "__content",
      "__icon",
      "__content__children",
      "__content__message",
      "__actions",
      "__action",
      "__action",
      "__action",
    ]);
    expect(structure($toast, "c__toast")).toEqual(
      structure($alert, "c__alert"),
    );
  });
});
