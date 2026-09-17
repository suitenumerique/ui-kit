import React from "react";
import classNames from "classnames";
import { AlertProps } from ":/components/alert/index";
import { iconFromType, VariantType } from ":/utils/VariantUtils";

export const AlertWrapper = (props: AlertProps) => {
  return (
    <div
      className={classNames(
        "c__alert",
        "c__alert--" + props.type,
        props.className,
        {
          "c__alert--hide": props.hide,
        },
      )}
    >
      {props.children}
    </div>
  );
};

// `neutral` has no icon of its own, hence the undefined.
export const alertDefaultIcon = (type?: VariantType) => {
  const icon = iconFromType(type);
  return icon ? <span className="material-icons">{icon}</span> : undefined;
};

export const alertContentProps = (props: AlertProps) => ({
  block: "c__alert" as const,
  type: props.type,
  icon: props.icon,
  defaultIcon: alertDefaultIcon(props.type),
  hideIcon: props.hideIcon,
  // The expandable variant routes its toggle button through `icon`, and hiding
  // it would take an interactive control away from assistive technologies.
  iconAriaHidden: props.expandable ? undefined : true,
  canClose: props.canClose,
  onClose: props.onClose,
});

export const alertActionProps = (props: AlertProps) => ({
  block: "c__alert" as const,
  type: props.type,
  actions: props.actions,
  buttons: props.buttons,
  primaryLabel: props.primaryLabel,
  primaryOnClick: props.primaryOnClick,
  primaryProps: props.primaryProps,
  tertiaryLabel: props.tertiaryLabel,
  tertiaryOnClick: props.tertiaryOnClick,
  tertiaryProps: props.tertiaryProps,
});
