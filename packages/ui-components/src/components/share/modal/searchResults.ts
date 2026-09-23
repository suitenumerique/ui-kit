import type { UserData } from "../types";

const isValidEmail = (email: string) => {
  return !!email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z\-0-9]{2,}))$/,
  );
};

export const getShareSearchResults = <UserType>(
  results: UserData<UserType>[],
  selectedUsers: UserData<UserType>[],
  query: string,
  allowInvitation: boolean,
) => {
  // Refetched users may have new object identities, so compare their IDs.
  const selectedIds = new Set(selectedUsers.map(({ id }) => id));
  const users = results.filter(({ id }) => !selectedIds.has(id));
  const canInviteByEmail =
    allowInvitation &&
    isValidEmail(query) &&
    !users.some(({ email }) => email === query);

  return {
    users,
    emailInvitation: canInviteByEmail
      ? { id: query, full_name: "", email: query }
      : undefined,
  };
};
