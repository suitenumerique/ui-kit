import { UserAvatar } from ":/components/users/avatar/UserAvatar";
import { SearchFilter } from "./SearchFilter";
import { UserSearchFilterItem, UserSearchFilterProps } from "./types";

export const UserSearchFilter = (props: UserSearchFilterProps) => {
  return (
    <SearchFilter<UserSearchFilterItem>
      {...props}
      placeholder={props.placeholder ?? "Search for a name"}
      renderItem={(item) => (
        <div className="c__search-filter__user-row">
          <UserAvatar fullName={item.fullName} size="small" />
          <span>{item.fullName}</span>
        </div>
      )}
    />
  );
};
