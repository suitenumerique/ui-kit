import clsx from "clsx";
import {
  HTMLAttributeAnchorTarget,
  HTMLAttributes,
  ReactNode,
  useState,
} from "react";
import { Button, useCunningham } from "@gouvfr-lasuite/cunningham-react";
import { Icon } from ":/components/icon";
import { ExternalLink } from ":/icons";

export type HeaderBannerType = "info" | "warning" | "error";

export type HeaderBannerAction = {
  /** Text displayed inside the action button/link. */
  label: string;
  /** When provided, the action renders as an anchor pointing to this URL. */
  href?: string;
  /** Click handler. Used when `href` is not provided (renders a button). */
  onClick?: () => void;
  /** Anchor target, only relevant when `href` is set (default "_blank"). */
  target?: HTMLAttributeAnchorTarget;
  /**
   * Icon shown before the label. Defaults to an external-link icon.
   * Pass `null` to hide it.
   */
  icon?: ReactNode | null;
};

export type HeaderBannerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "role" | "title"
> & {
  /** Visual variant. "info" uses the brand color (default). */
  type?: HeaderBannerType;
  /** Banner message, displayed on the leading side. */
  children?: ReactNode;
  /** Optional action displayed on the trailing side. */
  action?: HeaderBannerAction;
  /** Display a dismiss button that hides the banner. */
  closable?: boolean;
  /** Called when the banner is dismissed. */
  onClose?: () => void;
  /** Accessibility role. Defaults to "alert" for `error`, otherwise "status". */
  role?: string;
  /** Accessible label for the close button. */
  closeLabel?: string;
};

/**
 * A full-width banner pinned at the top of an application to inform users of
 * an important situation (pre-production environment, service instability,
 * scheduled maintenance, etc.).
 *
 * The banner can carry an optional action (link or button) and can be made
 * dismissible, which is especially useful on small screens where the message
 * may wrap to several lines.
 */
export const HeaderBanner = ({
  type = "info",
  children,
  action,
  closable = false,
  onClose,
  role,
  closeLabel,
  className,
  ...props
}: HeaderBannerProps) => {
  const { t } = useCunningham();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const resolvedRole = role ?? (type === "error" ? "alert" : "status");
  const actionIcon =
    action && action.icon === undefined ? (
      <ExternalLink size={14} aria-hidden="true" />
    ) : (
      action?.icon
    );
  // When the action has an icon, the label is hidden on mobile to save space
  // (the icon alone keeps the action compact); the accessible name is preserved
  // via aria-label/title.
  const hasActionIcon = !!actionIcon;

  return (
    <div
      className={clsx(
        "c__header-banner",
        `c__header-banner--${type}`,
        className,
      )}
      role={resolvedRole}
      aria-live={type === "error" ? "assertive" : "polite"}
      {...props}
    >
      <p className="c__header-banner__message">{children}</p>
      {(action || closable) && (
        <div className="c__header-banner__actions">
          {action && (
            <Button
              type="button"
              variant="tertiary"
              color="neutral"
              size="nano"
              className={clsx("c__header-banner__action", {
                "c__header-banner__action--has-icon": hasActionIcon,
              })}
              href={action.href}
              target={action.href ? action.target ?? "_blank" : undefined}
              rel={action.href ? "noopener noreferrer" : undefined}
              onClick={action.onClick}
              icon={actionIcon}
              aria-label={action.label}
              title={action.label}
            >
              <span className="c__header-banner__action__label">
                {action.label}
              </span>
            </Button>
          )}
          {closable && (
            <Button
              type="button"
              variant="tertiary"
              color="neutral"
              size="nano"
              className="c__header-banner__close"
              onClick={handleClose}
              aria-label={closeLabel ?? t("components.headerBanner.close")}
              icon={<Icon name="close" size={16} aria-hidden="true" />}
            />
          )}
        </div>
      )}
    </div>
  );
};
