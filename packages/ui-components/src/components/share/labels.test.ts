import { getRoleLabel, getUserDisplayName } from "./labels";

describe("share labels", () => {
  it("names a user by full name, else by email", () => {
    expect(
      getUserDisplayName({ id: "1", full_name: "Alice Martin", email: "alice@example.com" }),
    ).toBe("Alice Martin");
    expect(
      getUserDisplayName({ id: "2", full_name: "", email: "invite@example.com" }),
    ).toBe("invite@example.com");
  });

  it("finds the label of a role value", () => {
    const roles = [{ label: "Reader", value: "reader" }];
    expect(getRoleLabel(roles, "reader")).toBe("Reader");
    expect(getRoleLabel(roles, "owner")).toBeUndefined();
  });
});
