import { ReactNode } from "react";
import classNames from "classnames";
import { Button, ButtonProps } from ":/components/button";
import { useCunningham } from ":/components/provider";
import { VariantType } from ":/utils/VariantUtils";
import { NotificationAction } from "./types";

/**
 * BEM root of the component embedding the content. Every class emitted here is
 * prefixed with it, so `Alert` and `Toast` share the markup while keeping their
 * own stylesheet.
 */
export type NotificationBlock = "c__alert" | "c__toast";

export interface NotificationActionsProps {
  block: NotificationBlock;
  type?: VariantType;
  /** Added to the action row, next to `{block}__actions`. */
  className?: string;
  /**
   * Either a ready-made node, or a list of `{ label, onClick }` rendered as
   * borderless buttons matching the variant.
   */
  actions?: ReactNode | NotificationAction[];
  /** Free-form node appended after the labelled buttons. */
  buttons?: ReactNode;
  primaryLabel?: string;
  primaryOnClick?: ButtonProps["onClick"];
  primaryProps?: ButtonProps;
  tertiaryLabel?: string;
  tertiaryOnClick?: ButtonProps["onClick"];
  tertiaryProps?: ButtonProps;
  canClose?: boolean;
  onClose?: (value: boolean) => void;
}

export interface NotificationContentProps extends NotificationActionsProps {
  icon?: ReactNode;
  /** Icon used when `icon` is omitted. */
  defaultIcon?: ReactNode;
  hideIcon?: boolean;
  /** Set it only when the icon is decorative: it hides interactive icons too. */
  iconAriaHidden?: boolean;
  children?: ReactNode;
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

// Split out because `Alert` is rendered without a provider by some consumers:
// the translation hook must only run once a close button is actually asked for.
const NotificationClose = ({
  block,
  type,
  onClose,
}: Pick<NotificationActionsProps, "block" | "type" | "onClose">) => {
  const { t } = useCunningham();
  return (
    <Button
      color={type}
      variant="tertiary"
      size="small"
      className={`${block}__action`}
      icon={<span className="material-icons">close</span>}
      aria-label={t("components.alert.close_aria_label")}
      onClick={() => onClose?.(true)}
    />
  );
};

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
    block,
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
    onClose,
  } = props;

  if (!hasNotificationActions(props)) {
    return null;
  }

  return (
    <div className={classNames(`${block}__actions`, className)}>
      {isActionList(actions)
        ? actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={`${block}__action`}
              onClick={(event) => {
                event.stopPropagation();
                action.onClick();
              }}
            >
              {action.label}
            </button>
          ))
        : actions}
      {tertiaryLabel && (
        // Still a Button so `tertiaryProps` keeps working, but wearing the same
        // borderless look as the action list.
        <Button
          color={type}
          variant="tertiary"
          size="small"
          className={`${block}__action`}
          onClick={tertiaryOnClick}
          {...tertiaryProps}
        >
          {tertiaryLabel}
        </Button>
      )}
      {primaryLabel && (
        <Button
          color={type}
          variant="tertiary"
          size="small"
          className={`${block}__action`}
          onClick={primaryOnClick}
          {...primaryProps}
        >
          {primaryLabel}
        </Button>
      )}
      {buttons}
      {canClose && (
        <NotificationClose block={block} type={type} onClose={onClose} />
      )}
    </div>
  );
};

export const NotificationContent = ({
  icon,
  defaultIcon,
  hideIcon,
  iconAriaHidden,
  children,
  trailing,
  ...actionProps
}: NotificationContentProps) => {
  const { block } = actionProps;
  const leadingIcon = hideIcon ? undefined : (icon ?? defaultIcon);

  return (
    <div className={`${block}__content`}>
      {leadingIcon && (
        <div className={`${block}__icon`} aria-hidden={iconAriaHidden}>
          {leadingIcon}
        </div>
      )}
      <div className={`${block}__content__children`}>
        <span className={`${block}__content__message`}>{children}</span>
        {trailing}
      </div>
      <NotificationActions {...actionProps} />
    </div>
  );
};
