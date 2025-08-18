import { Dialog, Popover } from "react-aria-components";
import { ReactElement, useId, useRef, useState } from "react";
import { Button, useCunningham } from "@openfun/cunningham-react";
import { UserAvatar } from ":/components/users/avatar/UserAvatar";
import { Icon } from ":/components/icon";

export type UserMenuProps = {
    user?: {
        full_name?: string;
        email: string;
    } | null,
    settingsCTA?: string | (() => void);
    logout?: () => void;
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
    footerAction,
}: UserMenuProps) => {
    const { t } = useCunningham();
    const id = useId();
    const [openState, setOpenState] = useState(isInitialOpen);
    const toggleUserMenu = () => setOpenState(!openState);
    const showFooter = !!logout || !!footerAction;
    const showSettingsCTA = !!settingsCTA;
    const triggerRef = useRef(null);

    if (!user) return null;

    return (
        <>
            <Button
                color="tertiary-text"
                ref={triggerRef}
                id={id}
                onClick={toggleUserMenu}
                className="user-menu__trigger"
                aria-label={t(openState ? "components.userMenu.close" : "components.userMenu.open")}
                title={t(openState ? "components.userMenu.close" : "components.userMenu.open")}
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
                        <UserAvatar fullName={user.full_name ?? user.email!} size="large" />
                        <div className="user-menu__content__identity">
                            {user.full_name ?
                                <>
                                    <p className="user-menu__content__identity__name"><strong>{user.full_name}</strong></p>
                                    <p className="user-menu__content__identity__email">{user.email}</p>
                                </> :
                                <p className="user-menu__content__identity__email"><strong>{user.email}</strong></p>
                            }
                        </div>
                        {showSettingsCTA && (
                            <Button
                                onClick={typeof settingsCTA === "function" ? settingsCTA : undefined}
                                href={typeof settingsCTA === "string" ? settingsCTA : undefined}
                                color="tertiary"
                                size="small"
                                icon={<Icon name="account_box" />}
                            >
                                {t("components.userMenu.accountSettings")}
                            </Button>
                        )}
                    </div>
                    {showFooter && (
                        <footer className="user-menu__footer">
                            {footerAction &&
                                <div className="user-menu__footer__left">
                                    {footerAction}
                                </div>
                            }
                            {logout && (
                                <div className="user-menu__footer__right">

                                    <Button
                                        color="secondary"
                                        size="small"
                                        icon={<Icon name="logout" />}
                                        onClick={logout}
                                        fullWidth
                                    >
                                        {t("components.userMenu.logout")}
                                    </Button>
                                </div>
                            )}
                        </footer>
                    )}
                </Dialog>
            </Popover>
        </>
    );
};
