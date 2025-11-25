import { Dialog, Popover } from "react-aria-components";
import { ReactElement, useId, useMemo, useRef, useState } from "react";
import { Button, useCunningham } from "@openfun/cunningham-react";
import { UserAvatar } from ":/components/users/avatar/UserAvatar";
import { Icon } from ":/components/icon";
import { HorizontalSeparator } from ":/components/separator";

export type UserMenuProps = {
  user?: {
    full_name?: string;
    email: string;
  } | null;
  settingsCTA?: string | (() => void);
  logout?: () => void;
  termOfServiceUrl?: string;
  isInitialOpen?: boolean;
  shouldCloseOnInteractOutside?: (element: Element) => boolean;
  footerAction?: ReactElement;
};

/**
 * User menu component.
 *
 * **Props**
 * - `user`: An object containing the user information.
 * - `settingsCTA`: A string or a function to call when the settings button is clicked.
 * - `logout`: A function to call when the logout button is clicked.
 * - `isInitialOpen`: Whether the menu should be open by default.
 * - `shouldCloseOnInteractOutside`: A function to call when the menu should be closed.
 * - `footerAction`: The child to render inside the footer.
 */
export const UserMenu = ({
  user,
  settingsCTA,
  logout,
  isInitialOpen = false,
  shouldCloseOnInteractOutside,
  termOfServiceUrl,
  footerAction,
}: UserMenuProps) => {
  const { t } = useCunningham();
  const id = useId();
  const [openState, setOpenState] = useState(isInitialOpen);
  const toggleUserMenu = () => setOpenState(!openState);
  const showFooter = !!footerAction;
  const triggerRef = useRef(null);

  const settingsItems = useMemo(() => {
    const items: UserMenuItemProps[] = [];
    if (settingsCTA) {
      items.push({
        label: t("components.userMenu.manage_account"),
        icon: "settings",
        onClick:
          typeof settingsCTA === "function"
            ? settingsCTA
            : typeof settingsCTA === "string"
            ? () => window.open(settingsCTA, "_blank", "noopener,noreferrer")
            : undefined,
      });
    }
    if (logout) {
      items.push({
        label: t("components.userMenu.logout"),
        icon: "logout",
        onClick: logout,
      });
    }
    return items;
  }, [settingsCTA, logout, t]);

  const showSettings = settingsItems.length > 0;

  if (!user) return null;

  return (
    <>
      <Button
        variant="tertiary"
        ref={triggerRef}
        id={id}
        onClick={toggleUserMenu}
        className="user-menu__trigger"
        aria-label={t(
          openState ? "components.userMenu.close" : "components.userMenu.open"
        )}
        title={t(
          openState ? "components.userMenu.close" : "components.userMenu.open"
        )}
      >
        <UserAvatar fullName={user.full_name ?? user.email!} />
      </Button>

      <Popover
        className="c__dropdown-menu user-menu__popover"
        triggerRef={triggerRef}
        isOpen={openState}
        shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
        onOpenChange={setOpenState}
      >
        <Dialog aria-label={t("components.userMenu.dialogTitle")}>
          <div className="user-menu__content__body">
            <div className="user-menu__content__body__user-info">
              <UserAvatar fullName={user.full_name ?? user.email!} />
              <div className="user-menu__content__identity__name">
                {user.full_name ? (
                  <>
                    <p className="user-menu__content__identity__name">
                      <strong>{user.full_name}</strong>
                    </p>
                    <p className="user-menu__content__identity__email">
                      {user.email}
                    </p>
                  </>
                ) : (
                  <p className="user-menu__content__identity__email">
                    <strong>{user.email}</strong>
                  </p>
                )}
              </div>
            </div>
            {showSettings && (
              <>
                <HorizontalSeparator withPadding={false} />
                <div className="user-menu__content__body__settings">
                  {settingsItems.map((item) => (
                    <UserMenuItem
                      key={item.label}
                      label={item.label}
                      icon={item.icon}
                      onClick={item.onClick}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {showFooter && (
            <div className="user-menu__footer">
              {footerAction && (
                <div className="user-menu__footer__left">{footerAction}</div>
              )}
              {termOfServiceUrl && (
                <div className="user-menu__footer__right">
                  <Button
                    variant="tertiary"
                    target="_blank"
                    href={termOfServiceUrl}
                    size="small"
                    color="neutral"
                    fullWidth
                  >
                    {t("components.userMenu.term_of_service")}
                  </Button>
                </div>
              )}
            </div>
          )}
        </Dialog>
      </Popover>
    </>
  );
};

type UserMenuItemProps = {
  label: string;
  icon: string;
  onClick?: () => void;
};
export const UserMenuItem = ({ label, icon, onClick }: UserMenuItemProps) => {
  return (
    <div className="user-menu__item" onClick={onClick}>
      <Icon name={icon} />
      <span className="user-menu__item__label">{label}</span>
    </div>
  );
};
