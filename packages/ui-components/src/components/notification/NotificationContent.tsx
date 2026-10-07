import { ReactNode } from "react";
import classNames from "classnames";
import { Button } from ":/components/button";
import { NotificationAction, NotificationProps } from "./types";

export interface NotificationActionsProps
  extends Omit<NotificationProps, "children" | "icon" | "hideIcon"> {
  /** Added to the action row, next to `c__notification__actions`. */
  className?: string;
  /** Free-form node appended after the labelled buttons. */
  buttons?: ReactNode;
  onClose?: (value: boolean) => void;
}

export interface NotificationContentProps
  extends NotificationActionsProps,
    Pick<NotificationProps, "icon" | "hideIcon" | "children"> {
  /** Icon used when `icon` is omitted. */
  defaultIcon?: ReactNode;
  /** Hides the icon from assistive tech. Only for the decorative default icon. */
  iconAriaHidden?: boolean;
  /**
   * Control rendered in the icon slot, after the message in the DOM so it is
   * read second. `hideIcon` does not apply to it.
   */
  toggle?: ReactNode;
  /** Rendered right after the message, inside the same wrapper. */
  trailing?: ReactNode;
}

// `actions` accepts both a node and a list of descriptors. React elements never
// carry `label`/`onClick` as own keys, so they cannot be mistaken for one.
export const isActionList = (
  actions: ReactNode | NotificationAction[],
): actions is NotificationAction[] =>
  Array.isArray(actions) &&
  actions.every(
    (action) =>
      typeof action === "object" &&
      action !== null &&
      "label" in action &&
      "onClick" in action,
  );

export const hasNotificationActions = ({
  actions,
  buttons,
  primaryLabel,
  tertiaryLabel,
  canClose,
}: NotificationActionsProps) =>
  (isActionList(actions) ? actions.length > 0 : !!actions) ||
  !!buttons ||
  !!primaryLabel ||
  !!tertiaryLabel ||
  !!canClose;

export const NotificationActions = (props: NotificationActionsProps) => {
  const {
    type,
    className,
    actions,
    buttons,
    primaryLabel,
    primaryOnClick,
    primaryProps,
    tertiaryLabel,
    tertiaryOnClick,
    tertiaryProps,
    canClose,
    closeLabel,
    onClose,
  } = props;

  if (!hasNotificationActions(props)) {
    return null;
  }

  return (
    <div className={classNames("c__notification__actions", className)}>
      {isActionList(actions)
        ? actions.map((action, index) => (
            <Button
              key={`${index}-${action.label}`}
              type="button"
              color={type}
              variant="tertiary"
              size="small"
              className="c__notification__action"
              onClick={(event) => {
                event.stopPropagation();
                action.onClick();
              }}
            >
              {action.label}
            </Button>
          ))
        : actions}
      {tertiaryLabel && (
        // Still a Button so `tertiaryProps` keeps working, but wearing the same
        // borderless look as the action list.
        <Button
          {...tertiaryProps}
          color={type}
          variant="tertiary"
          size="small"
          className={classNames(
            "c__notification__action",
            "c__notification__action--tertiary",
            tertiaryProps?.className,
          )}
          onClick={tertiaryOnClick ?? tertiaryProps?.onClick}
        >
          {tertiaryLabel}
        </Button>
      )}
      {primaryLabel && (
        <Button
          {...primaryProps}
          color={type}
          variant="tertiary"
          size="small"
          className={classNames(
            "c__notification__action",
            "c__notification__action--primary",
            primaryProps?.className,
          )}
          onClick={primaryOnClick ?? primaryProps?.onClick}
        >
          {primaryLabel}
        </Button>
      )}
      {buttons}
      {canClose && (
        <Button
          color={type}
          variant="tertiary"
          size="small"
          className="c__notification__action c__notification__action--close"
          icon={<span className="material-icons">close</span>}
          aria-label={closeLabel}
          onClick={() => onClose?.(true)}
        />
      )}
    </div>
  );
};

export const NotificationContent = ({
  icon,
  defaultIcon,
  hideIcon,
  iconAriaHidden,
  toggle,
  children,
  trailing,
  ...actionProps
}: NotificationContentProps) => {
  // The toggle takes the icon's place. `hideIcon` only drops the icon.
  const leadingIcon = toggle || hideIcon ? undefined : (icon ?? defaultIcon);
  const $icon = leadingIcon && (
    <div
      className="c__notification__icon"
      aria-hidden={iconAriaHidden || undefined}
    >
      {leadingIcon}
    </div>
  );
  const $toggle = toggle && (
    <div className="c__notification__icon c__notification__icon--after-message">
      {toggle}
    </div>
  );

  return (
    <div className="c__notification__content">
      {$icon}
      <div className="c__notification__content__children">
        <span className="c__notification__content__message">{children}</span>
        {trailing}
      </div>
      {$toggle}
      <NotificationActions {...actionProps} />
    </div>
  );
};
