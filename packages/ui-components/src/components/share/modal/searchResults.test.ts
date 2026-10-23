import { describe, expect, it } from "vitest";
import type { UserData } from "../types";
import { getShareSearchResults, isSameUser } from "./searchResults";

const alice = { id: "1", full_name: "Alice", email: "alice@example.com" };
const bob = { id: "2", full_name: "Bob", email: "bob@example.com" };
// The modal passes people invited by email as users whose ID is their email.
const emailOnly = (email: string) => ({ id: email, full_name: "", email });
// Typed so an empty list does not infer the user type as never.
const none: UserData<object>[] = [];

describe("getShareSearchResults", () => {
  it("hides selected users even when the results are refetched objects", () => {
    const { users } = getShareSearchResults(
      [{ ...alice }, bob],
      [alice],
      "a",
      true,
    );
    expect(users).toEqual([bob]);
  });

  it("does not offer an email twice, whatever its case", () => {
    const { emailInvitation } = getShareSearchResults(
      none,
      [emailOnly("new@example.com")],
      "NEW@example.com",
      true,
    );
    expect(emailInvitation).toBeUndefined();
  });

  it("does not offer the email of a user picked by name", () => {
    const { users, emailInvitation } = getShareSearchResults(
      [{ ...alice }],
      [alice],
      "Alice@Example.com",
      true,
    );
    expect(users).toEqual([]);
    expect(emailInvitation).toBeUndefined();
  });

  it("hides a result whose email is already pending as an email chip", () => {
    const { users } = getShareSearchResults(
      [alice],
      [emailOnly("ALICE@example.com")],
      "alice",
      true,
    );
    expect(users).toEqual([]);
  });

  it("hides members and does not offer their email", () => {
    const { users, emailInvitation } = getShareSearchResults(
      [{ ...alice }, bob],
      none,
      "alice@example.com",
      true,
      [{ user: alice, is_explicit: true }],
    );
    expect(users).toEqual([bob]);
    expect(emailInvitation).toBeUndefined();
  });

  it("keeps users with an inherited access only, without an email row", () => {
    const { users, emailInvitation } = getShareSearchResults(
      [alice],
      none,
      "alice@example.com",
      true,
      [{ user: alice, is_explicit: false }],
    );
    expect(users).toEqual([alice]);
    expect(emailInvitation).toBeUndefined();
  });

  it("does not offer an email that already has a pending invitation", () => {
    const { emailInvitation } = getShareSearchResults(
      none,
      none,
      "Invited@example.com",
      true,
      [],
      [{ email: "invited@example.com" }],
    );
    expect(emailInvitation).toBeUndefined();
  });

  it("offers a valid unknown email only when invitations are allowed", () => {
    const query = "new@example.com";
    expect(
      getShareSearchResults([alice], [bob], query, true).emailInvitation,
    ).toEqual(emailOnly(query));
    expect(
      getShareSearchResults(none, none, query, false).emailInvitation,
    ).toBeUndefined();
    expect(
      getShareSearchResults(none, none, "new@", true).emailInvitation,
    ).toBeUndefined();
  });
});

describe("isSameUser", () => {
  it("matches the same ID or the same email ignoring case", () => {
    expect(isSameUser(alice, { ...alice, email: "" })).toBe(true);
    expect(isSameUser(alice, emailOnly("ALICE@example.com"))).toBe(true);
    expect(isSameUser(alice, bob)).toBe(false);
  });

  it("does not match two different users without an email", () => {
    expect(isSameUser({ id: "1", email: "" }, { id: "2", email: "" })).toBe(
      false,
    );
  });
});
