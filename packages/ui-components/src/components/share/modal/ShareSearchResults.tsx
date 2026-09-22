import {
  QuickSearchGroup,
  type QuickSearchData,
} from ":/components/quick-search";
import { useCunningham } from ":/components/provider";
import type { UserData } from "../types";
import { SearchUserItem } from "./items/SearchUserItem";
import { getShareSearchResults } from "./searchResults";

type ShareSearchResultsProps<UserType> = {
  results?: UserData<UserType>[];
  selectedUsers: UserData<UserType>[];
  query: string;
  allowInvitation: boolean;
  groupName?: string;
  onSelect: (user: UserData<UserType>) => void;
};

/** Displays available users and the optional action to invite an email address. */
export const ShareSearchResults = <UserType,>({
  results = [],
  selectedUsers,
  query,
  allowInvitation,
  groupName,
  onSelect,
}: ShareSearchResultsProps<UserType>) => {
  const { t } = useCunningham();
  const { users, emailInvitation } = getShareSearchResults(
    results,
    selectedUsers,
    query,
    allowInvitation,
  );
  const group: QuickSearchData<UserData<UserType>> = {
    groupName: groupName ?? t("components.share.search.group_name"),
    elements: users,
    showWhenEmpty: true,
    emptyString: emailInvitation
      ? undefined
      : t(
          query
            ? "components.share.user.no_result"
            : "components.share.user.placeholder",
        ),
    endActions: emailInvitation
      ? [
          {
            content: <SearchUserItem user={emailInvitation} />,
            // The public API also passes email-only invitees through UserData.
            onSelect: () => onSelect(emailInvitation as UserData<UserType>),
          },
        ]
      : undefined,
  };

  return (
    <div
      className="c__share-modal__search-users"
      data-testid="search-users-list"
    >
      <QuickSearchGroup
        group={group}
        onSelect={onSelect}
        renderElement={(user) => <SearchUserItem user={user} />}
      />
    </div>
  );
};
