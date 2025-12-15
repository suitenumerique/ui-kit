import { DropdownMenuOption } from ":/components/dropdown-menu/types";
import { LanguagePicker } from ":/components/language/language-picker";

import { Button, useCunningham } from "@gouvfr-lasuite/cunningham-react";

export type HeaderProps = {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  languages?: DropdownMenuOption[];
  onTogglePanel?: () => void;
  isPanelOpen?: boolean;
};

export const Header = ({
  leftIcon,
  rightIcon,
  languages,
  onTogglePanel,
  isPanelOpen,
}: HeaderProps) => {
  const { t } = useCunningham();
  return (
    <div className="c__header">
      <div className="c__header__toggle-menu">
        <Button
          size="medium"
          onClick={onTogglePanel}
          aria-label={isPanelOpen ? t("Close the menu") : t("Open the menu")}
          variant="tertiary"
          icon={
            <span className="material-icons c__header__toggle-menu__icon">
              {isPanelOpen ? "close" : "menu"}
            </span>
          }
        />
      </div>
      <div className="c__header__left">{leftIcon}</div>
      <div className="c__header__right">
        {languages && (
          <div className="c__header__right__language-picker">
            <LanguagePicker languages={languages} />
          </div>
        )}

        {rightIcon}
      </div>
    </div>
  );
};
