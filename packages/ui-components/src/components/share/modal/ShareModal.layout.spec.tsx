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
});
