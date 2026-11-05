import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Harness,
  RequestsHarness,
  germain,
  hugo,
  member,
  searchInput,
} from "./ShareModal.fixtures";

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

  it("names request actions with the person and hides their icons", () => {
    render(
      <Harness
        accessRequests={[germain]}
        onAcceptAccessRequest={vi.fn()}
        onRejectAccessRequest={vi.fn()}
      />,
    );

    for (const name of [
      "Accept request from Germain Dupond",
      "Reject request from Germain Dupond",
    ]) {
      expect(
        screen.getByRole("button", { name }).querySelector("svg"),
      ).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("announces an accepted and a rejected request", async () => {
    const user = userEvent.setup();
    render(<RequestsHarness requests={[germain, hugo]} />);

    await user.click(
      screen.getByRole("button", { name: "Accept request from Germain Dupond" }),
    );
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Access request from Germain Dupond accepted",
      );
    });

    await user.click(
      screen.getByRole("button", { name: "Reject request from Hugo Martin" }),
    );
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Access request from Hugo Martin rejected",
      );
    });
  });

  it("moves focus to the next request after an action", async () => {
    const user = userEvent.setup();
    render(<RequestsHarness requests={[germain, hugo]} />);

    await user.click(
      screen.getByRole("button", { name: "Accept request from Germain Dupond" }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Accept request from Hugo Martin" }),
      ).toHaveFocus();
    });
  });

  it("moves focus to the previous request when the last one goes", async () => {
    const user = userEvent.setup();
    render(<RequestsHarness requests={[germain, hugo]} />);

    await user.click(
      screen.getByRole("button", { name: "Reject request from Hugo Martin" }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Accept request from Germain Dupond",
        }),
      ).toHaveFocus();
    });
  });

  it("returns focus to the search field when no request is left", async () => {
    const user = userEvent.setup();
    render(<RequestsHarness requests={[germain]} />);

    await user.click(
      screen.getByRole("button", { name: "Accept request from Germain Dupond" }),
    );

    await waitFor(() => {
      expect(searchInput()).toHaveFocus();
    });
  });

  it("focuses reject when the app offers no accept", async () => {
    const user = userEvent.setup();
    render(<RequestsHarness requests={[germain, hugo]} canAccept={false} />);

    expect(
      screen.queryByRole("button", { name: "Accept request from Hugo Martin" }),
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Reject request from Germain Dupond" }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Reject request from Hugo Martin" }),
      ).toHaveFocus();
    });
  });

  it("waits for the app to remove the request before moving focus", async () => {
    const user = userEvent.setup();
    const onAcceptAccessRequest = vi.fn();
    const { rerender } = render(
      <Harness
        accessRequests={[germain, hugo]}
        onAcceptAccessRequest={onAcceptAccessRequest}
      />,
    );

    const accept = screen.getByRole("button", {
      name: "Accept request from Germain Dupond",
    });
    await user.click(accept);
    rerender(
      <Harness
        accessRequests={[germain, hugo]}
        onAcceptAccessRequest={onAcceptAccessRequest}
      />,
    );
    expect(accept).toHaveFocus();

    rerender(
      <Harness
        accessRequests={[hugo]}
        onAcceptAccessRequest={onAcceptAccessRequest}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Accept request from Hugo Martin" }),
      ).toHaveFocus();
    });
  });

  it("does not steal focus from a control that is still present", async () => {
    const user = userEvent.setup();
    const onAcceptAccessRequest = vi.fn();
    const onRejectAccessRequest = vi.fn();
    const { rerender } = render(
      <Harness
        accessRequests={[germain, hugo]}
        onAcceptAccessRequest={onAcceptAccessRequest}
        onRejectAccessRequest={onRejectAccessRequest}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Accept request from Germain Dupond" }),
    );
    const rejectHugo = screen.getByRole("button", {
      name: "Reject request from Hugo Martin",
    });
    rejectHugo.focus();
    rerender(
      <Harness
        accessRequests={[hugo]}
        onAcceptAccessRequest={onAcceptAccessRequest}
        onRejectAccessRequest={onRejectAccessRequest}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Reject request from Hugo Martin" }),
    ).toHaveFocus();
  });

  it("moves focus after a later request is removed too", async () => {
    const user = userEvent.setup();
    const onAcceptAccessRequest = vi.fn();
    const onRejectAccessRequest = vi.fn();
    const { rerender } = render(
      <Harness
        accessRequests={[germain, hugo]}
        onAcceptAccessRequest={onAcceptAccessRequest}
        onRejectAccessRequest={onRejectAccessRequest}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Accept request from Germain Dupond" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Reject request from Hugo Martin" }),
    );
    rerender(
      <Harness
        accessRequests={[hugo]}
        onAcceptAccessRequest={onAcceptAccessRequest}
        onRejectAccessRequest={onRejectAccessRequest}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Reject request from Hugo Martin" }),
    ).toHaveFocus();

    rerender(
      <Harness
        accessRequests={[]}
        onAcceptAccessRequest={onAcceptAccessRequest}
        onRejectAccessRequest={onRejectAccessRequest}
      />,
    );
    await waitFor(() => {
      expect(searchInput()).toHaveFocus();
    });
  });
});
