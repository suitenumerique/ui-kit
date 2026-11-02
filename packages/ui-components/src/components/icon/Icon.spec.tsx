import { render, screen } from "@testing-library/react";
import { Icon } from "./Icon";

describe("<Icon />", () => {
  it("hides the ligature from assistive technologies", () => {
    render(
      <button>
        <Icon name="home" />
        Accueil
      </button>,
    );
    expect(screen.getByRole("button")).toHaveAccessibleName("Accueil");
  });

  it("stays exposed when it is labelled", () => {
    render(<Icon name="search" aria-label="Rechercher" />);
    const icon = screen.getByRole("img", { name: "Rechercher" });
    expect(icon).not.toHaveAttribute("aria-hidden");
    expect(icon).toHaveAccessibleName("Rechercher");
  });

  it("stays hidden when the label is empty", () => {
    const { container } = render(<Icon name="search" aria-label="" />);
    const icon = container.querySelector(".material-icons");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).not.toHaveAttribute("role");
  });

  it("lets the consumer override aria-hidden", () => {
    const { container } = render(<Icon name="info" aria-hidden={false} />);
    expect(container.querySelector(".material-icons")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
  });
});
