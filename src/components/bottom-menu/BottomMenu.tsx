import clsx from "clsx";
import { ReactNode } from "react";
import { Button, useCunningham } from "@gouvfr-lasuite/cunningham-react";
import { Icon } from ":/components/icon";
import { HelpMenu, HelpMenuProps } from ":/components/help-menu";
import { StorageGauge, StorageGaugeProps } from "../storage-gauge/StorageGauge";

export type BottomMenuProps = {
  /** Help menu configuration. Omit to hide the help button. */
  help?: HelpMenuProps;
  /** Settings action. Omit to hide the settings button. */
  onSettings?: () => void;
  /** Accessible label for the settings button. */
  settingsLabel?: string;
  /**
   * Storage gauge configuration. Omit to hide the gauge.
   * Provide `onClick` to make the gauge open a details modal.
   */
  gauge?: StorageGaugeProps;
  /** Extra content rendered between the action buttons and the gauge. */
  children?: ReactNode;
  className?: string;
};

/**
 * Bottom menu for LaSuite apps: a configurable footer row combining a help
 * menu, a settings button and a clickable storage gauge. Each part is optional
 * so apps can show only what they need. Meant to be passed as the
 * `leftPanelFooter` of the MainLayout.
 */
export const BottomMenu = ({
  help,
  onSettings,
  settingsLabel,
  gauge,
  children,
  className,
}: BottomMenuProps) => {
  const { t } = useCunningham();

  return (
    <div className={clsx("c__bottom-menu", className)}>
      {help && <HelpMenu {...help} />}
      {onSettings && (
        <Button
          className="c__bottom-menu__settings"
          variant="tertiary"
          color="neutral"
          size="small"
          icon={<Icon name="settings" />}
          onClick={onSettings}
          aria-label={settingsLabel ?? t("components.bottomMenu.settings")}
        />
      )}
      {children}
      {gauge && <StorageGauge showArrow {...gauge} />}
    </div>
  );
};
