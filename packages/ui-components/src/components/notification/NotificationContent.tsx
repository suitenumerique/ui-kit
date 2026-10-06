import { ReactNode } from "react";
import classNames from "classnames";
import { Button } from ":/components/button";
import { useCunningham } from ":/components/provider";
import { NotificationProps } from "./types";

/**
 * BEM root of the component embedding the content. Every class emitted here is
 * prefixed with it, so the markup stays styled by that component's stylesheet.
 */
export type NotificationBlock = "c__alert";

export interface NotificationActionsProps
  extends Omit<NotificationProps, "children" | "icon"> {
  block: NotificationBlock;
  /** Added to the action row, next to `{block}__actions`. */
  className?: string;
  /** Free-form node appended after the labelled buttons. */
  buttons?: ReactNode;
  onClose?: (value: boolean) => void;
}

export interface NotificationContentProps
  extends NotificationActionsProps,
    Pick<NotificationProps, "icon" | "children"> {
  /** Icon used when `icon` is omitted. */
  defaultIcon?: ReactNode;
}

// Split out because `Alert` is rendered without a provider by some consumers:
// the translation hook must only run once a close button is actually asked for.
const NotificationClose = ({
  type,
  onClose,
}: Pick<NotificationActionsProps, "type" | "onClose">) => {
  const { t } = useCunningham();
  return (
    <Button
      color={type}
      variant="tertiary"
      size="small"
      icon={<span className="material-icons">close</span>}
      aria-label={t("components.alert.close_aria_label")}
      onClick={() => onClose?.(true)}
    />
  );
};

export const hasNotificationActions = ({
  buttons,
  primaryLabel,
  tertiaryLabel,
  canClose,
}: NotificationActionsProps) =>
  !!buttons || !!primaryLabel || !!tertiaryLabel || !!canClose;

export const NotificationActions = (props: NotificationActionsProps) => {
  const {
    block,
    type,
    className,
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
      {tertiaryLabel && (
        <Button
          variant="tertiary"
          color={type}
          onClick={tertiaryOnClick}
          {...tertiaryProps}
        >
          {tertiaryLabel}
        </Button>
      )}
      {primaryLabel && (
        <Button
          color={type}
          variant="secondary"
          onClick={primaryOnClick}
          {...primaryProps}
        >
          {primaryLabel}
        </Button>
      )}
      {buttons}
      {canClose && <NotificationClose type={type} onClose={onClose} />}
    </div>
  );
};

export const NotificationContent = ({
  icon,
  defaultIcon,
  children,
  ...actionProps
}: NotificationContentProps) => {
  const { block } = actionProps;
  // A custom icon is rendered as is: the expandable alert passes its toggle
  // button there.
  const $icon =
    icon ??
    (defaultIcon && <div className={`${block}__icon`}>{defaultIcon}</div>);

  return (
    <div className={`${block}__content`}>
      <div className={`${block}__content__left`}>
        {children}
        {$icon}
      </div>
      <NotificationActions {...actionProps} />
    </div>
  );
};
