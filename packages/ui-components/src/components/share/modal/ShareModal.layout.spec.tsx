import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Harness,
  germain,
  searchInput,
  type Extra,
} from "./ShareModal.fixtures";
import type { ShareModalProps } from "./ShareModal";

describe("ShareModal layout", () => {
  it("names the user result group", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.type(searchInput(), "ali");

    expect(
      await screen.findByRole("group", { name: "Select a user" }),
    ).toBeInTheDocument();
  });

  it("labels the invite button with the app wording", async () => {
    const user = userEvent.setup();
    render(<Harness shareButtonLabel="Invite" />);

    await user.type(searchInput(), "ali");
    await user.click(await screen.findByTestId("search-user-item"));

    expect(screen.getByTestId("share-invite-button")).toHaveTextContent(
      "Invite",
    );
  });

  it("lists access requests before pending invitations", () => {
    render(
      <Harness accessRequests={[germain]} onAcceptAccessRequest={vi.fn()} />,
    );

    const requests = screen.getByRole("heading", {
      level: 3,
      name: "Access requests",
    });
    const invitations = screen.getByRole("heading", {
      level: 3,
      name: "Pending invitations",
    });
    expect(
      requests.compareDocumentPosition(invitations) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("hides access requests without an action", () => {
    render(<Harness accessRequests={[germain]} />);

    expect(
      screen.queryByRole("heading", { name: "Access requests" }),
    ).not.toBeInTheDocument();
  });

  it("hides access requests from a viewer who cannot update", () => {
    render(
      <Harness
        canUpdate={false}
        accessRequests={[germain]}
        onAcceptAccessRequest={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole("heading", { name: "Access requests" }),
    ).not.toBeInTheDocument();
  });

  it("hides access requests while searching", async () => {
    const user = userEvent.setup();
    render(
      <Harness accessRequests={[germain]} onAcceptAccessRequest={vi.fn()} />,
    );

    await user.type(searchInput(), "ali");
    // The search is debounced: wait for the results before asserting.
    await screen.findByRole("group", { name: "Select a user" });

    expect(
      screen.queryByRole("heading", { name: "Access requests" }),
    ).not.toBeInTheDocument();
  });

  it("accepts the role chosen on the row", async () => {
    const user = userEvent.setup();
    const onAcceptAccessRequest = vi.fn();
    render(
      <Harness
        accessRequests={[germain]}
        onAcceptAccessRequest={onAcceptAccessRequest}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Role to grant Germain Dupond: Reader",
      }),
    );
    expect(
      screen.queryByRole("menuitem", { name: "Remove access" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("menuitem", { name: "Editor" }));
    await user.click(
      screen.getByRole("button", { name: "Accept request from Germain Dupond" }),
    );

    expect(onAcceptAccessRequest).toHaveBeenCalledWith(germain, "editor");
  });

  it("keeps request fields typed with three generics", () => {
    expectTypeOf<
      NonNullable<
        ShareModalProps<Extra, Extra, Extra>["accessRequests"]
      >[number]["id"]
    >().toEqualTypeOf<string>();
  });

  it("renders one link description under the settings row", () => {
    render(
      <Harness
        showLinkRole
        linkRole="reader"
        linkRoleChoices={[{ value: "reader" }, { value: "editor" }]}
      />,
    );

    const descriptions = screen.getAllByText("Only users of the space can access the document");
    expect(descriptions).toHaveLength(1);

    const row = screen
      .getByTestId("share-link-settings")
      .querySelector(".c__share-modal__link-settings__content");
    expect(row).toContainElement(screen.getByTestId("share-link-reach-dropdown-button"));
    expect(row).toContainElement(screen.getByTestId("share-link-role-dropdown-button"));
    expect(row).not.toContainElement(descriptions[0]);
  });
});
