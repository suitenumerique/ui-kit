import { UserRow } from ":/components/users/rows/UserRow";
import { useCunningham } from ":/components/provider";
import { UserData } from ":/components/share/types.ts";
import { QuickSearchItemTemplate } from ":/components/quick-search";

type SearchUserItemProps<UserType> = {
  user: UserData<UserType>;
  /** Unknown-email row. Its action stays visible, unlike "Add" on a known user. */
  action?: "add" | "invite";
};

export const SearchUserItem = <UserType,>({
  user,
  action = "add",
}: SearchUserItemProps<UserType>) => {
  const { t } = useCunningham();

  return (
    <QuickSearchItemTemplate
      testId="search-user-item"
      left={<UserRow fullName={user.full_name} email={user.email} />}
      alwaysShowRight={action === "invite"}
      right={
        <div className="c__search-user-item-right">
          <span>
            {t(
              action === "invite"
                ? "components.share.item.invite"
                : "components.share.item.add",
            )}
          </span>
          <span className="material-icons" aria-hidden="true">
            add
          </span>
        </div>
      }
    />
  );
};
