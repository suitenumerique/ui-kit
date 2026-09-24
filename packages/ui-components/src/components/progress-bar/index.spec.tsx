import React from "react";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from ":/components/progress-bar";

const fillOf = (bar: HTMLElement) =>
  bar.querySelector<HTMLElement>(".c__progress-bar__fill")!;

describe("<ProgressBar />", () => {
  it("reports its completion to assistive technologies", () => {
    render(<ProgressBar value={42} aria-label="Uploading" />);

    const $bar = screen.getByRole("progressbar", { name: "Uploading" });
    expect($bar).toHaveAttribute("aria-valuenow", "42");
    expect($bar).toHaveAttribute("aria-valuemin", "0");
    expect($bar).toHaveAttribute("aria-valuemax", "100");
    expect(fillOf($bar)).toHaveStyle({ width: "42%" });
  });

  it("clamps a value outside the range", () => {
    const { rerender } = render(<ProgressBar value={-20} aria-label="Task" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    );

    rerender(<ProgressBar value={160} aria-label="Task" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
    expect(fillOf(screen.getByRole("progressbar"))).toHaveStyle({
      width: "100%",
    });
  });

  it("drops aria-valuenow when no value is given", () => {
    render(<ProgressBar aria-label="Preparing" />);

    const $bar = screen.getByRole("progressbar", { name: "Preparing" });
    expect($bar).not.toHaveAttribute("aria-valuenow");
    expect($bar).toHaveClass("c__progress-bar--indeterminate");
    // The sweep is driven by the stylesheet, so no inline width is set.
    expect(fillOf($bar).style.width).toBe("");
  });

  it("treats zero as a value, not as unknown completion", () => {
    render(<ProgressBar value={0} aria-label="Starting" />);

    const $bar = screen.getByRole("progressbar");
    expect($bar).toHaveAttribute("aria-valuenow", "0");
    expect($bar).not.toHaveClass("c__progress-bar--indeterminate");
  });

  it("carries the extra class name", () => {
    render(<ProgressBar value={10} className="my-bar" aria-label="Loading" />);

    expect(screen.getByRole("progressbar")).toHaveClass("my-bar");
  });
});
