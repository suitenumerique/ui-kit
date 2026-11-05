import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Harness, member, searchInput } from "./ShareModal.fixtures";

const initialInnerWidth = window.innerWidth;

afterEach(() => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: initialInnerWidth,
  });
});

describe("ShareModal accessibility", () => {
  it("exposes section titles as headings and distinct show-more names", () => {
    render(<Harness />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Pending invitations" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Shared between 1 person" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Link settings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show more invitations" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show more members" }),
    ).toBeInTheDocument();
  });

  it("names role and remove controls with the person they affect", () => {
    render(<Harness />);

    expect(
      screen.getByRole("button", {
        name: "Change role for Alice Martin, currently Reader",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Change role for invite@example.com, currently Editor",
      }),
    ).toBeInTheDocument();
  });

  it("hides decorative icons that sit next to a text label", () => {
    render(<Harness />);

    expect(
      screen
        .getByRole("button", { name: "Show more members" })
        .querySelector(".material-icons"),
    ).toHaveAttribute("aria-hidden", "true");
    expect(
      screen
        .getByTestId("share-link-reach-dropdown-button")
        .querySelector(".material-icons"),
    ).toHaveAttribute("aria-hidden", "true");
    expect(
      screen
        .getByRole("button", { name: "Copy link" })
        .querySelector(".material-icons"),
    ).toHaveAttribute("aria-hidden", "true");
  });

  it("announces a pending user and returns focus to the search field", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1280,
    });
    const user = userEvent.setup();
    render(<Harness />);

    await user.type(searchInput(), "ali");
    const result = await screen.findByTestId("search-user-item");
    expect(result.querySelector(".material-icons")).toHaveAttribute(
      "aria-hidden",
      "true",
    );

    await user.click(result);
    expect(screen.getByRole("status")).toHaveTextContent("");
    expect(
      await screen.findByRole("button", { name: "Remove Alice Martin" }),
    ).toBeInTheDocument();
    expect(
      screen
        .getByRole("button", { name: "Remove Alice Martin" })
        .querySelector(".material-icons"),
    ).toHaveAttribute("aria-hidden", "true");

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Alice Martin added to invitations",
      );
    });
    expect(searchInput()).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Remove Alice Martin" }));
    expect(screen.getByRole("status")).toHaveTextContent("");
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Alice Martin removed from invitations",
      );
    });
    expect(searchInput()).toHaveFocus();
  });

  it("announces a role change without waiting for focus to move", async () => {
    const user = userEvent.setup();
    const onUpdateAccess = vi.fn();
    render(<Harness onUpdateAccess={onUpdateAccess} />);

    await user.click(
      screen.getByRole("button", {
        name: "Change role for Alice Martin, currently Reader",
      }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Editor" }));

    expect(onUpdateAccess).toHaveBeenCalledWith(member, "editor");
    expect(screen.getByRole("status")).toHaveTextContent("");
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Role changed to Editor for Alice Martin",
      );
    });
  });

  it("stays silent when the selected role is already active", async () => {
    const user = userEvent.setup();
    const onUpdateAccess = vi.fn();
    render(<Harness onUpdateAccess={onUpdateAccess} />);

    await user.click(
      screen.getByRole("button", {
        name: "Change role for Alice Martin, currently Reader",
      }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Reader" }));

    expect(onUpdateAccess).not.toHaveBeenCalled();
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(screen.getByRole("status")).toHaveTextContent("");
  });

  it("stays silent when no role update callback is provided", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(
      screen.getByRole("button", {
        name: "Change role for Alice Martin, currently Reader",
      }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Editor" }));

    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(screen.getByRole("status")).toHaveTextContent("");
  });
});
