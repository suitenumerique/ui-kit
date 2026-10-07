import React from "react";
import { AlertProps } from ":/components/alert/index";
import { AlertWrapper, useAlertContentProps } from ":/components/alert/Utils";
import {
  NotificationActions,
  NotificationContent,
} from ":/components/notification/NotificationContent";

export const AlertAdditional = (props: AlertProps) => {
  const contentProps = useAlertContentProps(props);
  const {
    defaultIcon,
    icon,
    hideIcon,
    iconAriaHidden,
    iconAfterMessage,
    canClose,
    closeLabel,
    onClose,
    ...actionProps
  } = contentProps;

  return (
    <AlertWrapper {...props}>
      {/* Only the close button rides along the message here: the buttons get
          their own row below the additional text. */}
      <NotificationContent
        type={props.type}
        defaultIcon={defaultIcon}
        icon={icon}
        hideIcon={hideIcon}
        iconAriaHidden={iconAriaHidden}
        iconAfterMessage={iconAfterMessage}
        canClose={canClose}
        closeLabel={closeLabel}
        onClose={onClose}
      >
        {props.children}
      </NotificationContent>
      <div className="c__alert__additional">{props.additional}</div>
      <NotificationActions
        {...actionProps}
        className="c__alert-additional__buttons"
      />
    </AlertWrapper>
  );
};
