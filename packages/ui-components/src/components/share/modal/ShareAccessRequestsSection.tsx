import type { Ref } from "react";
import type { DropdownMenuOption } from ":/components/dropdown-menu";
import { useCunningham } from ":/components/provider";
import { ShareAccessRequestItem } from "./items/ShareAccessRequestItem";
import { ShowMoreButton } from "./ShowMoreButton";
import type { ShareModalAccessRequestProps } from "./types";

type ShareAccessRequestsSectionProps<UserType, AccessRequestType> = Pick<
  ShareModalAccessRequestProps<UserType, AccessRequestType>,
  "accessRequests" | "hasNextAccessRequests" | "onLoadNextAccessRequests"
> & {
  roles: DropdownMenuOption[];
  canAccept: boolean;
  canReject: boolean;
  onAccept: NonNullable<
    ShareModalAccessRequestProps<
      UserType,
      AccessRequestType
    >["onAcceptAccessRequest"]
  >;
  onReject: NonNullable<
    ShareModalAccessRequestProps<
      UserType,
      AccessRequestType
    >["onRejectAccessRequest"]
  >;
  listRef: Ref<HTMLDivElement>;
};

/** Lists pending access requests with accept and reject actions. */
export const ShareAccessRequestsSection = <UserType, AccessRequestType>({
  accessRequests = [],
  roles,
  canAccept,
  canReject,
  onAccept,
  onReject,
  hasNextAccessRequests = false,
  onLoadNextAccessRequests,
  listRef,
}: ShareAccessRequestsSectionProps<UserType, AccessRequestType>) => {
  const { t } = useCunningham();
  return (
    <div
      className="c__share-modal__access-requests"
      data-testid="access-requests-list"
      ref={listRef}
    >
      <h3 className="c__share-modal__access-requests-title">
        {t("components.share.access_requests.title")}
      </h3>
      {accessRequests.map((request) => (
        <ShareAccessRequestItem
          key={request.id}
          request={request}
          roles={roles}
          canAccept={canAccept}
          canReject={canReject}
          onAccept={onAccept}
          onReject={onReject}
        />
      ))}
      <ShowMoreButton
        show={hasNextAccessRequests}
        onShowMore={onLoadNextAccessRequests}
        label={t("components.share.access_requests.load_more_aria")}
      />
    </div>
  );
};
