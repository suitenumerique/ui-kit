import clsx from "clsx";
import { UserAvatar } from "../avatar/UserAvatar";

type UserProps = {
  fullName?: string;
  email?: string;
  showEmail?: boolean;
};

export const UserRow = ({
  fullName: full_name,
  email,
  showEmail = true,
}: UserProps) => {
  const name = full_name && full_name !== "" ? full_name : email ?? "";
  return (
    <div className="c__user-row">
      <UserAvatar fullName={name} size="small" />
      <div className="c__user-row__info">
        <span className="c__user-row__name">{full_name}</span>
        {showEmail && email && (
          <span
            className={clsx("c__user-row__email", {
              "has-only-email": email && (full_name === "" || !full_name),
            })}
          >
            {email}
          </span>
        )}
      </div>
    </div>
  );
};
