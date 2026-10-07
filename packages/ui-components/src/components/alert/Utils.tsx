import React, { use } from "react";
import classNames from "classnames";
import { AlertProps } from ":/components/alert/index";
import { CunninghamContext } from ":/components/provider";
import { iconFromType, VariantType } from ":/utils/VariantUtils";

export const AlertWrapper = (props: AlertProps) => {
  return (
    <div
      className={classNames(
        "c__alert",
        "c__alert--" + props.type,
        props.type && "c__notification--" + props.type,
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

/**
 * Everything the alert hands to the shared content, in one object: what is
 * specific to the alert is left out, the rest goes through untouched, so a new
 * shared prop needs no change here.
 */
export const useAlertContentProps = ({
  additional: _additional,
  className: _className,
  closed: _closed,
  expandable,
  expanded: _expanded,
  hide: _hide,
  onExpand: _onExpand,
  children: _children,
  ...shared
}: AlertProps) => {
  // `use` may sit behind the condition: an alert without a close button still
  // renders outside `CunninghamProvider`.
  const closeLabel =
    shared.closeLabel ??
    (shared.canClose
      ? use(CunninghamContext)?.t("components.alert.close_aria_label")
      : undefined);
  // The expandable variant routes its toggle button through `icon`. Hiding it
  // would take an interactive control away from assistive technologies, so it
  // stays announced and moves after the message instead.
  const interactiveIcon = !!expandable;

  return {
    ...shared,
    closeLabel,
    defaultIcon: alertDefaultIcon(shared.type),
    iconAriaHidden: interactiveIcon ? undefined : true,
    iconAfterMessage: interactiveIcon,
  };
};
