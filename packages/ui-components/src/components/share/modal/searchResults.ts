import type { AccessData, InvitationData, UserData } from "../types";

const isValidEmail = (email: string) => {
  return !!email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z\-0-9]{2,}))$/,
  );
};

const isSameEmail = (a: string, b: string) =>
  a !== "" && a.toLowerCase() === b.toLowerCase();

/**
 * Whether two users are the same recipient. Email-only invitees use their
 * email as ID, so the same person can come back with another ID.
 */
export const isSameUser = (
  a: Pick<UserData<unknown>, "id" | "email">,
  b: Pick<UserData<unknown>, "id" | "email">,
) => a.id === b.id || isSameEmail(a.email, b.email);

export const getShareSearchResults = <UserType>(
  results: UserData<UserType>[],
  selectedUsers: UserData<UserType>[],
  query: string,
  allowInvitation: boolean,
  accesses: Pick<AccessData<UserType, unknown>, "user" | "is_explicit">[] = [],
  invitations: Pick<InvitationData<UserType, unknown>, "email">[] = [],
) => {
  const members = accesses.map(({ user }) => user);
  // Users with an inherited access only stay available: sharing with them
  // gives them an explicit access.
  const unavailableUsers = [
    ...selectedUsers,
    ...accesses
      .filter(({ is_explicit }) => is_explicit !== false)
      .map(({ user }) => user),
  ];
  // Refetched users may have new object identities, so compare IDs and emails.
  const users = results.filter(
    (user) => !unavailableUsers.some((other) => isSameUser(user, other)),
  );
  // Check every result, not only the visible ones: a hidden result is still
  // a registered user that cannot be invited by email.
  const knownEmails = [
    ...[...selectedUsers, ...members, ...results].map(({ email }) => email),
    ...invitations.map(({ email }) => email),
  ];
  const canInviteByEmail =
    allowInvitation &&
    isValidEmail(query) &&
    !knownEmails.some((email) => isSameEmail(email, query));

  return {
    users,
    emailInvitation: canInviteByEmail
      ? { id: query, full_name: "", email: query }
      : undefined,
  };
};
