import { render, screen } from "@testing-library/react";
import { Icon } from "./Icon";
import { IconSize } from "./types";

describe("<Icon />", () => {
  it("renders a known Material name as a hidden svg", () => {
    const { container } = render(<Icon name="home" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("c__icon");
    expect(container).not.toHaveTextContent("home");
  });

  it("keeps an unverified Material name out of the accessibility tree", () => {
    const { container } = render(<Icon name="language" />);
    const icon = container.querySelector(".material-icons");
    expect(icon).toHaveTextContent("language");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps an accessible name set on the icon itself", () => {
    render(<Icon name="search" aria-label="Search" />);
    expect(screen.getByLabelText("Search").tagName).toBe("svg");
  });

  it("uses the requested size for a mapped glyph", () => {
    const { container } = render(<Icon name="link" size={IconSize.SMALL} />);
    expect(container.querySelector("svg")).toHaveAttribute("width", "16");
  });
});
