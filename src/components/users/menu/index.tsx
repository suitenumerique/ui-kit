import { Dialog, Popover } from "react-aria-components";
import { ReactElement, useId, useMemo, useRef, useState } from "react";
import {
  Button,
  ButtonElement,
  Modal,
  ModalSize,
  useCunningham,
} from "@openfun/cunningham-react";
import { UserAvatar } from ":/components/users/avatar/UserAvatar";
import { Icon } from ":/components/icon";
import { HorizontalSeparator } from ":/components/separator";
import { useResponsive } from ":/hooks/useResponsive";

type UserMenuContentProps = {
  user: UserMenuProps["user"];
  settingsItems: UserMenuItemProps[];
  showSettings: boolean;
  actions?: ReactElement;
  termOfServiceUrl?: string;
};

/**
 * User menu content component (shared between desktop and mobile).
 */
const UserMenuContent = ({
  user,
  settingsItems,
  showSettings,
  actions: footerAction,
  termOfServiceUrl,
}: UserMenuContentProps) => {
  const showActions = !!footerAction || !!termOfServiceUrl;

  const { t } = useCunningham();

  if (!user) return null;

  return (
    <>
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
        {showActions && (
          <>
            <HorizontalSeparator withPadding={false} />
            <div className="user-menu__actions user-menu__actions--mobile">
              {footerAction && (
                <div className="user-menu__actions__left">{footerAction}</div>
              )}
              {termOfServiceUrl && (
                <div className="user-menu__actions__right">
                  <Button
                    variant="tertiary"
                    target="_blank"
                    href={termOfServiceUrl}
                    size="small"
                    color="neutral"
                  >
                    {t("components.userMenu.term_of_service")}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

type UserMenuMobileProps = UserMenuContentProps;

const UserMenuMobile = ({ ...props }: UserMenuMobileProps) => {
  const { t } = useCunningham();
  const menuTrigger = useUserMenuTrigger();

  return (
    <>
      <UserMenuTrigger user={props.user} {...menuTrigger} />
      <Modal
        isOpen={menuTrigger.openState}
        onClose={() => menuTrigger.setOpenState(false)}
        aria-label={t("components.userMenu.dialogTitle")}
        size={ModalSize.FULL}
      >
        <div className="user-menu__popover user-menu__popover--mobile">
          <Button
            variant="tertiary"
            className="user-menu__close-button"
            onClick={menuTrigger.toggleUserMenu}
            aria-label={t("components.userMenu.close")}
            color="neutral"
            icon={<Icon name="close" />}
            size="small"
          />

          <UserMenuContent {...props} />
          <div className="user-menu__footer--mobile">
            <Button variant="primary" onClick={menuTrigger.toggleUserMenu}>
              {t("components.share.ok")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

type UserMenuDesktopProps = UserMenuContentProps & {};

/**
 * Desktop version of the user menu.
 */
const UserMenuDesktop = ({
  user,
  settingsItems,
  showSettings,
  actions: footerAction,
  termOfServiceUrl,
}: UserMenuDesktopProps) => {
  const { t } = useCunningham();
  const menuTrigger = useUserMenuTrigger();
  return (
    <>
      <UserMenuTrigger user={user} {...menuTrigger} />
      <Popover
        className="c__dropdown-menu user-menu__popover"
        triggerRef={menuTrigger.triggerRef}
        isOpen={menuTrigger.openState}
        onOpenChange={menuTrigger.setOpenState}
      >
        <Dialog aria-label={t("components.userMenu.dialogTitle")}>
          <UserMenuContent
            user={user}
            settingsItems={settingsItems}
            showSettings={showSettings}
            actions={footerAction}
            termOfServiceUrl={termOfServiceUrl}
          />
        </Dialog>
      </Popover>
    </>
  );
};

export type UserMenuProps = {
  user?: {
    full_name?: string;
    email: string;
  } | null;
  settingsCTA?: string | (() => void);
  logout?: () => void;
  termOfServiceUrl?: string;
  isInitialOpen?: boolean;
  actions?: ReactElement;
};

export const UserMenu = ({
  user,
  settingsCTA,
  logout,
  termOfServiceUrl,
  actions,
}: UserMenuProps) => {
  const { t } = useCunningham();
  const { isTablet } = useResponsive();

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
      {isTablet ? (
        <UserMenuMobile
          user={user}
          settingsItems={settingsItems}
          showSettings={showSettings}
          actions={actions}
          termOfServiceUrl={termOfServiceUrl}
        />
      ) : (
        <UserMenuDesktop
          user={user}
          settingsItems={settingsItems}
          showSettings={showSettings}
          actions={actions}
          termOfServiceUrl={termOfServiceUrl}
        />
      )}
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

type UserMenuTriggerProps = ReturnType<typeof useUserMenuTrigger> & {
  user: UserMenuProps["user"];
};

const UserMenuTrigger = ({
  user,
  triggerRef,
  id,
  openState,
  toggleUserMenu,
}: UserMenuTriggerProps) => {
  const { t } = useCunningham();

  if (!user) return null;

  return (
    <Button
      variant="tertiary"
      size="small"
      ref={triggerRef}
      id={id}
      onClick={toggleUserMenu}
      aria-label={t(
        openState ? "components.userMenu.close" : "components.userMenu.open"
      )}
      title={t(
        openState ? "components.userMenu.close" : "components.userMenu.open"
      )}
    >
      <UserAvatar fullName={user.full_name ?? user.email!} />
    </Button>
  );
};

const useUserMenuTrigger = () => {
  const id = useId();
  const [openState, setOpenState] = useState(false);
  const toggleUserMenu = () => {
    setOpenState(!openState);
  };
  const triggerRef = useRef<ButtonElement>(null);
  return { id, openState, setOpenState, toggleUserMenu, triggerRef };
};
