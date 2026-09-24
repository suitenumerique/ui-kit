import React from "react";
import { AlertProps } from ":/components/alert/index";
import {
  alertActionProps,
  alertContentProps,
  AlertWrapper,
} from ":/components/alert/Utils";
import {
  NotificationActions,
  NotificationContent,
} from ":/components/notification/NotificationContent";

export const AlertAdditional = (props: AlertProps) => {
  return (
    <AlertWrapper {...props}>
      {/* Only the close button rides along the message here: the buttons get
          their own row below the additional text. */}
      <NotificationContent {...alertContentProps(props)}>
        {props.children}
      </NotificationContent>
      <div className="c__alert__additional">{props.additional}</div>
      <NotificationActions
        {...alertActionProps(props)}
        className="c__alert-additional__buttons"
      />
    </AlertWrapper>
  );
};
