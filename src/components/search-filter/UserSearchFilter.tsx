import { UserAvatar } from ":/components/users/avatar/UserAvatar";
import { SearchFilter } from "./SearchFilter";
import { UserSearchFilterItem, UserSearchFilterProps } from "./types";
import { MenuItemBody } from "../menu/MenuItemBody";

export const UserSearchFilter = (props: UserSearchFilterProps) => {
  return (
    <SearchFilter<UserSearchFilterItem>
      {...props}
      placeholder={props.placeholder ?? "Search for a name"}
      renderItem={(item) => (
        <div className="c__dropdown-menu-item">
          <MenuItemBody
            label={item.fullName}
            icon={<UserAvatar fullName={item.fullName} size="xsmall" />}
          />
        </div>
      )}
    />
  );
};
