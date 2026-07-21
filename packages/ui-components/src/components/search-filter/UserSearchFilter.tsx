import { UserAvatar } from ":/components/users/avatar/UserAvatar";
import { SearchFilter } from "./SearchFilter";
import { UserSearchFilterItem, UserSearchFilterProps } from "./types";
import { MenuItemBody } from "../menu/MenuItemBody";
import { useCunningham } from ":/components/Provider";

export const UserSearchFilter = (props: UserSearchFilterProps) => {
  const { t } = useCunningham();
  return (
    <SearchFilter<UserSearchFilterItem>
      {...props}
      placeholder={
        props.placeholder ?? t("components.searchFilter.placeholder")
      }
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
