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
    expect(screen.getByLabelText("Rechercher")).not.toHaveAttribute(
      "aria-hidden",
    );
  });

  it("lets the consumer override aria-hidden", () => {
    const { container } = render(<Icon name="info" aria-hidden={false} />);
    expect(container.querySelector(".material-icons")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
  });
});
