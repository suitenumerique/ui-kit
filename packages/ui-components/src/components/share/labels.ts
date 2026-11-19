import type { DropdownMenuOption } from ":/components/dropdown-menu";
import type { UserData } from "./types";

export const getUserDisplayName = <UserType>(user: UserData<UserType>) =>
  user.full_name || user.email;

export const getRoleLabel = (roles: DropdownMenuOption[], value: string) =>
  roles.find((role) => role.value === value)?.label;
