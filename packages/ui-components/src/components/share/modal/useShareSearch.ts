import { useCallback, useEffect, useRef, useState } from "react";
import type { UserData } from "../types";
import type { ShareModalSearchProps } from "./types";

type ShareSearchOptions<UserType> = Pick<
  ShareModalSearchProps<UserType>,
  "onSearchUsers" | "onInviteUser"
> & { initialRole: string };

/** Manages debounced search, pending users, role selection, and invitation submission. */
export const useShareSearch = <UserType>({
  onSearchUsers,
  onInviteUser,
  initialRole,
}: ShareSearchOptions<UserType>) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [inputValue, setInputValue] = useState("");
  // Results and email invitations use the submitted query, not keystrokes
  // that are still waiting for the debounce delay.
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserData<UserType>[]>([]);
  const [selectedRole, setSelectedRole] = useState(initialRole);

  const cancelSearch = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => cancelSearch, [cancelSearch]);

  const changeInput = (value: string) => {
    setInputValue(value);
    cancelSearch();
    if (value === "") {
      setSearchQuery("");
      onSearchUsers?.("");
      return;
    }
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      onSearchUsers?.(value);
      setSearchQuery(value);
    }, 300);
  };

  const selectUser = (user: UserData<UserType>) => {
    cancelSearch();
    setSelectedUsers((users) => [...users, user]);
    setInputValue("");
    setSearchQuery("");
    onSearchUsers?.("");
  };

  const removeUser = (user: UserData<UserType>) => {
    setSelectedUsers((users) => users.filter(({ id }) => id !== user.id));
  };

  const share = () => {
    if (!onInviteUser) return;
    onInviteUser(selectedUsers, selectedRole);
    setSelectedUsers([]);
  };

  return {
    inputValue,
    searchQuery,
    selectedUsers,
    selectedRole,
    isSearching: searchQuery !== "" || selectedUsers.length > 0,
    changeInput,
    selectUser,
    removeUser,
    selectRole: setSelectedRole,
    share,
  };
};
