import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Harness, searchInput } from "./ShareModal.fixtures";

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
});
