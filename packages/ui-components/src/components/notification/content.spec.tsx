import React from "react";
import { render, screen } from "@testing-library/react";
import { Alert } from ":/components/alert/index";
import { CunninghamProvider } from ":/components/provider";
import { Toast } from ":/components/toast/index";
import { VariantType } from ":/utils/VariantUtils";

// Lists the shared classes carried by every node of a rendered notification, in
// document order. Comparing the two lists is what pins the shared structure.
const structure = (root: Element) =>
  Array.from(root.querySelectorAll('[class*="c__notification__"]')).map(
    (node) =>
      Array.from(node.classList)
        .filter((name) => name.startsWith("c__notification__"))
        .join(" "),
  );

describe("notification content", () => {
  const shared = {
    type: VariantType.INFO,
    actions: [{ label: "Undo", onClick: () => {} }],
    primaryLabel: "Retry",
    canClose: true,
    children: "Document moved",
  };

  it("renders Alert and Toast with the same structure", () => {
    const { container } = render(
      <CunninghamProvider>
        <Alert {...shared} />
        <Toast {...shared} duration={0} />
      </CunninghamProvider>,
    );

    const $alert = container.querySelector(".c__alert")!;
    const $toast = container.querySelector(".c__toast")!;

    expect(structure($alert)).toEqual([
      "c__notification__content",
      "c__notification__icon",
      "c__notification__content__children",
      "c__notification__content__message",
      "c__notification__actions",
      "c__notification__action",
      "c__notification__action c__notification__action--primary",
      "c__notification__action c__notification__action--close",
    ]);
    expect(structure($toast)).toEqual(structure($alert));
  });

  it("names the close button after each component's translation", () => {
    render(
      <CunninghamProvider>
        <Alert {...shared} />
        <Toast {...shared} duration={0} />
      </CunninghamProvider>,
    );

    expect(
      screen.getByRole("button", { name: "Delete alert" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Close notification" }),
    ).toBeInTheDocument();
  });

  it("lets closeLabel override the translated name", () => {
    render(
      <CunninghamProvider>
        <Alert {...shared} closeLabel="Dismiss" />
      </CunninghamProvider>,
    );

    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });
});
